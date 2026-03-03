"use client"

import { PDFDocument, StandardFonts, rgb } from "pdf-lib"
import type { APIError } from "@anthropic-ai/sdk"

type PdfJsModule = typeof import("pdfjs-dist/legacy/build/pdf.mjs")

type SummariseProgress = (progress: number, status: string) => void

export interface SummarizePdfOptions {
  maxChars?: number
  retries?: number
  allowServerProcessing?: boolean
  summaryInstruction?: string
  onProgress?: SummariseProgress
}

export const SERVER_WARNING = "This sends text to server."

export interface PdfQaOptions {
  maxChars?: number
  retries?: number
  allowServerProcessing: boolean
  onProgress?: SummariseProgress
}

export interface SuggestPdfEditsOptions {
  rewriteInstruction: string
  allowServerProcessing: boolean
  sectionText?: string
  pageNumber?: number
  maxChars?: number
  retries?: number
  acceptedSuggestionIndex?: number
  onProgress?: SummariseProgress
}

export interface PdfEditSuggestion {
  id: string
  pageNumber: number
  originalText: string
  suggestedText: string
  instruction: string
  bounds: {
    x: number
    y: number
    width: number
    height: number
  }
}

export interface SuggestPdfEditsResult {
  warning: string
  suggestions: PdfEditSuggestion[]
  updatedPdfBytes?: Uint8Array
}

interface EditableSection {
  pageNumber: number
  text: string
  bounds: {
    x: number
    y: number
    width: number
    height: number
  }
}

let pdfJsModulePromise: Promise<PdfJsModule> | null = null

const getPdfJs = async () => {
  if (!pdfJsModulePromise) {
    pdfJsModulePromise = import("pdfjs-dist/legacy/build/pdf.mjs").then((pdfjs) => {
      if (!pdfjs.GlobalWorkerOptions.workerSrc) {
        pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.js"
      }
      return pdfjs
    })
  }
  return pdfJsModulePromise
}

const sleep = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms)
  })

const getRetryAfterMs = (response: Response, attempt: number) => {
  const retryAfterHeader = response.headers.get("retry-after")
  if (retryAfterHeader) {
    const seconds = Number(retryAfterHeader)
    if (Number.isFinite(seconds) && seconds > 0) {
      return Math.ceil(seconds * 1000)
    }
  }

  return Math.min(10_000, 1000 * 2 ** attempt)
}

const normaliseWhitespace = (value: string) =>
  value.replace(/\s+/g, " ").trim()

const extractEditableSections = async (
  file: File,
  maxChars: number,
  pageNumber: number | undefined,
  onProgress?: SummariseProgress
) => {
  const pdfjs = await getPdfJs()
  const sourceBytes = new Uint8Array(await file.arrayBuffer())
  const loadingTask = pdfjs.getDocument({
    data: sourceBytes,
    disableAutoFetch: true,
    disableRange: true,
    disableStream: true,
  })

  try {
    const sourcePdf = await loadingTask.promise
    const sections: EditableSection[] = []
    const startPage = pageNumber ? Math.max(1, pageNumber) : 1
    const endPage = pageNumber
      ? Math.min(sourcePdf.numPages, pageNumber)
      : sourcePdf.numPages

    for (let currentPage = startPage; currentPage <= endPage; currentPage++) {
      const page = await sourcePdf.getPage(currentPage)
      const viewport = page.getViewport({ scale: 1 })
      const textContent = await page.getTextContent()

      for (const item of textContent.items) {
        if (!item || typeof item !== "object" || !("str" in item)) {
          continue
        }

        const text = normaliseWhitespace(typeof item.str === "string" ? item.str : "")
        if (text.length < 20) {
          continue
        }

        const transform =
          "transform" in item && Array.isArray(item.transform)
            ? (item.transform as number[])
            : [1, 0, 0, 1, 0, 0]
        const rawWidth =
          "width" in item && typeof item.width === "number"
            ? item.width
            : Math.max(40, text.length * 4)
        const rawHeight = Math.abs(transform[3]) || 12

        sections.push({
          pageNumber: currentPage,
          text: text.slice(0, maxChars),
          bounds: {
            x: Math.max(0, transform[4] - 2),
            y: Math.max(0, transform[5] - rawHeight * 0.85),
            width: Math.min(viewport.width, Math.max(30, rawWidth + 8)),
            height: Math.max(14, rawHeight * 1.4),
          },
        })
      }

      onProgress?.(
        Math.round(((currentPage - startPage + 1) / (endPage - startPage + 1)) * 45),
        `Extracting editable sections locally: page ${currentPage} of ${endPage}.`
      )
    }

    if (sections.length === 0) {
      const extractedText = await extractPdfText(file, maxChars, undefined)
      if (extractedText) {
        return [
          {
            pageNumber: 1,
            text: extractedText.slice(0, maxChars),
            bounds: {
              x: 36,
              y: 36,
              width: 420,
              height: 120,
            },
          },
        ]
      }
    }

    return sections
  } finally {
    await loadingTask.destroy()
  }
}

const chooseSectionForRewrite = (
  sections: EditableSection[],
  requestedSectionText?: string
) => {
  if (!sections.length) return null
  const query = normaliseWhitespace(requestedSectionText || "").toLowerCase()

  if (query) {
    const exact = sections.find((section) =>
      normaliseWhitespace(section.text).toLowerCase().includes(query)
    )
    if (exact) return exact
  }

  return [...sections].sort((left, right) => right.text.length - left.text.length)[0]
}

const wrapTextForBounds = (
  text: string,
  maxWidth: number,
  fontSize: number
) => {
  const words = text.split(/\s+/).filter(Boolean)
  const lines: string[] = []
  let currentLine = ""
  const maxCharsPerLine = Math.max(12, Math.floor(maxWidth / Math.max(5, fontSize * 0.55)))

  for (const word of words) {
    const candidate = currentLine ? `${currentLine} ${word}` : word
    if (candidate.length > maxCharsPerLine) {
      if (currentLine) lines.push(currentLine)
      currentLine = word
    } else {
      currentLine = candidate
    }
  }

  if (currentLine) {
    lines.push(currentLine)
  }

  return lines
}

const applyAcceptedSuggestionToPdf = async (
  file: File,
  suggestion: PdfEditSuggestion
) => {
  const sourceBytes = new Uint8Array(await file.arrayBuffer())
  const pdfDoc = await PDFDocument.load(sourceBytes, {
    ignoreEncryption: true,
    updateMetadata: false,
  })
  const page = pdfDoc.getPage(suggestion.pageNumber - 1)
  if (!page) {
    throw new Error("Cannot apply suggestion: target page does not exist.")
  }

  const padding = 2
  const blockX = Math.max(0, suggestion.bounds.x - padding)
  const blockY = Math.max(0, suggestion.bounds.y - padding)
  const blockWidth = Math.min(page.getWidth() - blockX, suggestion.bounds.width + padding * 2)
  const blockHeight = Math.min(page.getHeight() - blockY, suggestion.bounds.height + padding * 2)

  page.drawRectangle({
    x: blockX,
    y: blockY,
    width: blockWidth,
    height: blockHeight,
    color: rgb(1, 1, 1),
  })

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const fontSize = Math.max(9, Math.min(12, blockHeight * 0.42))
  const lines = wrapTextForBounds(suggestion.suggestedText, blockWidth - 6, fontSize)
  const lineHeight = fontSize * 1.2
  const maxLines = Math.max(1, Math.floor((blockHeight - 4) / lineHeight))

  for (let index = 0; index < Math.min(maxLines, lines.length); index++) {
    const y = blockY + blockHeight - (index + 1) * lineHeight
    if (y < blockY) {
      break
    }

    page.drawText(lines[index], {
      x: blockX + 3,
      y,
      size: fontSize,
      font,
      color: rgb(0.1, 0.1, 0.1),
      maxWidth: blockWidth - 6,
    })
  }

  return await pdfDoc.save({ useObjectStreams: true })
}

const extractPdfText = async (
  file: File,
  maxChars: number,
  onProgress?: SummariseProgress
) => {
  const pdfjs = await getPdfJs()
  const sourceBytes = new Uint8Array(await file.arrayBuffer())
  const loadingTask = pdfjs.getDocument({
    data: sourceBytes,
    disableAutoFetch: true,
    disableRange: true,
    disableStream: true,
  })

  try {
    const sourcePdf = await loadingTask.promise
    const segments: string[] = []

    for (let pageIndex = 0; pageIndex < sourcePdf.numPages; pageIndex++) {
      const page = await sourcePdf.getPage(pageIndex + 1)
      const textContent = await page.getTextContent()
      const pageText = textContent.items
        .map((item) => {
          if (item && typeof item === "object" && "str" in item && typeof item.str === "string") {
            return item.str
          }
          return ""
        })
        .join(" ")
        .replace(/\s+/g, " ")
        .trim()

      if (pageText) {
        segments.push(`Page ${pageIndex + 1}: ${pageText}`)
      }

      onProgress?.(
        Math.round(((pageIndex + 1) / sourcePdf.numPages) * 55),
        `Extracting text locally: page ${pageIndex + 1} of ${sourcePdf.numPages}.`
      )
    }

    return segments.join("\n\n").slice(0, maxChars)
  } finally {
    await loadingTask.destroy()
  }
}

export async function summarizePdf(
  file: File,
  options: SummarizePdfOptions = {}
): Promise<string> {
  const allowServerProcessing = options.allowServerProcessing ?? false
  const maxChars = Math.max(2000, Math.min(200_000, options.maxChars ?? 80_000))
  const retries = Math.max(0, Math.min(5, options.retries ?? 2))
  const summaryInstruction = options.summaryInstruction?.trim()

  if (!allowServerProcessing) {
    throw new Error(
      `Server processing is disabled. Set allowServerProcessing: true to continue. ${SERVER_WARNING}`
    )
  }

  console.warn(`[Plain] ${SERVER_WARNING}`)
  options.onProgress?.(1, "Initialising local PDF summarisation pipeline.")

  const extractedText = await extractPdfText(file, maxChars, options.onProgress)
  if (!extractedText.trim()) {
    throw new Error("No readable text was found in the PDF.")
  }

  options.onProgress?.(60, "Sending extracted text to server summarisation endpoint.")

  let attempt = 0
  while (attempt <= retries) {
    const response = await fetch("/api/ai/summarize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fileName: file.name,
        text: extractedText,
        summaryInstruction,
      }),
    })

    if (response.status === 429 && attempt < retries) {
      const retryMs = getRetryAfterMs(response, attempt)
      options.onProgress?.(
        70,
        `Rate limited by summarisation service. Retrying in ${Math.ceil(retryMs / 1000)} seconds.`
      )
      await sleep(retryMs)
      attempt += 1
      continue
    }

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as
        | { error?: string; warning?: string; details?: APIError }
        | null
      throw new Error(payload?.error || "PDF summarisation request failed.")
    }

    const payload = (await response.json()) as { summary?: string; warning?: string }
    const summary = payload.summary?.trim()
    if (!summary) {
      throw new Error("Server returned an empty summary.")
    }

    options.onProgress?.(100, "Complete. Summary generated.")
    return summary
  }

  throw new Error("PDF summarisation exceeded retry limits.")
}

export async function pdfQA(
  file: File,
  question: string,
  options: PdfQaOptions
): Promise<string> {
  const trimmedQuestion = question.trim()
  if (!trimmedQuestion) {
    throw new Error("A question is required for PDF QA.")
  }

  if (!options.allowServerProcessing) {
    throw new Error(
      `Server processing is disabled. Set allowServerProcessing: true to continue. ${SERVER_WARNING}`
    )
  }

  const maxChars = Math.max(2000, Math.min(200_000, options.maxChars ?? 80_000))
  const retries = Math.max(0, Math.min(5, options.retries ?? 2))

  console.warn(`[Plain] ${SERVER_WARNING}`)
  options.onProgress?.(1, "Initialising local PDF question answering pipeline.")

  const extractedText = await extractPdfText(file, maxChars, options.onProgress)
  if (!extractedText.trim()) {
    throw new Error("No readable text was found in the PDF.")
  }

  options.onProgress?.(60, "Sending extracted text and question to server QA endpoint.")

  let attempt = 0
  while (attempt <= retries) {
    const response = await fetch("/api/ai/qa", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fileName: file.name,
        text: extractedText,
        question: trimmedQuestion,
      }),
    })

    if (response.status === 429 && attempt < retries) {
      const retryMs = getRetryAfterMs(response, attempt)
      options.onProgress?.(
        70,
        `Rate limited by QA service. Retrying in ${Math.ceil(retryMs / 1000)} seconds.`
      )
      await sleep(retryMs)
      attempt += 1
      continue
    }

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as
        | { error?: string; warning?: string; details?: APIError }
        | null
      throw new Error(payload?.error || "PDF QA request failed.")
    }

    const payload = (await response.json()) as { answer?: string; warning?: string }
    const answer = payload.answer?.trim()
    if (!answer) {
      throw new Error("Server returned an empty answer.")
    }

    options.onProgress?.(100, "Complete. PDF question answered.")
    return answer
  }

  throw new Error("PDF QA exceeded retry limits.")
}

export async function suggestPdfEdits(
  file: File,
  options: SuggestPdfEditsOptions
): Promise<SuggestPdfEditsResult> {
  const rewriteInstruction = normaliseWhitespace(options.rewriteInstruction || "")
  if (!rewriteInstruction) {
    throw new Error("A rewrite instruction is required, for example: 'Make this formal'.")
  }

  if (!options.allowServerProcessing) {
    throw new Error(
      `Server processing is disabled. Set allowServerProcessing: true to continue. ${SERVER_WARNING}`
    )
  }

  const maxChars = Math.max(1000, Math.min(80_000, options.maxChars ?? 20_000))
  const retries = Math.max(0, Math.min(5, options.retries ?? 2))
  console.warn(`[Plain] ${SERVER_WARNING}`)
  options.onProgress?.(1, "Initialising PDF edit suggestion pipeline.")

  const sections = await extractEditableSections(
    file,
    maxChars,
    options.pageNumber,
    options.onProgress
  )
  const selectedSection = chooseSectionForRewrite(sections, options.sectionText)

  if (!selectedSection || !selectedSection.text.trim()) {
    throw new Error("No editable text section was found for rewrite suggestions.")
  }

  options.onProgress?.(52, "Sending section text to server for rewrite suggestions.")

  let attempt = 0
  while (attempt <= retries) {
    const response = await fetch("/api/ai/suggest-edits", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fileName: file.name,
        instruction: rewriteInstruction,
        text: selectedSection.text,
      }),
    })

    if (response.status === 429 && attempt < retries) {
      const retryMs = getRetryAfterMs(response, attempt)
      options.onProgress?.(
        65,
        `Rate limited by edit suggestion service. Retrying in ${Math.ceil(retryMs / 1000)} seconds.`
      )
      await sleep(retryMs)
      attempt += 1
      continue
    }

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as
        | { error?: string; warning?: string; details?: APIError }
        | null
      throw new Error(payload?.error || "PDF edit suggestion request failed.")
    }

    const payload = (await response.json()) as {
      suggestions?: string[]
      warning?: string
    }
    const rawSuggestions = (payload.suggestions || [])
      .map((value) => normaliseWhitespace(value))
      .filter(Boolean)

    if (!rawSuggestions.length) {
      throw new Error("No edit suggestions were returned by the server.")
    }

    const suggestions: PdfEditSuggestion[] = rawSuggestions.map((suggestedText, index) => ({
      id: `${selectedSection.pageNumber}:${index + 1}`,
      pageNumber: selectedSection.pageNumber,
      originalText: selectedSection.text,
      suggestedText,
      instruction: rewriteInstruction,
      bounds: selectedSection.bounds,
    }))

    let updatedPdfBytes: Uint8Array | undefined
    if (
      typeof options.acceptedSuggestionIndex === "number" &&
      options.acceptedSuggestionIndex >= 0 &&
      options.acceptedSuggestionIndex < suggestions.length
    ) {
      options.onProgress?.(82, "Applying accepted edit suggestion back into the PDF.")
      updatedPdfBytes = await applyAcceptedSuggestionToPdf(
        file,
        suggestions[options.acceptedSuggestionIndex]
      )
    }

    options.onProgress?.(100, "Complete. PDF edit suggestions generated.")
    return {
      warning: SERVER_WARNING,
      suggestions,
      updatedPdfBytes,
    }
  }

  throw new Error("PDF edit suggestion request exceeded retry limits.")
}

