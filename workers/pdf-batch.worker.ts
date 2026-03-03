/// <reference lib="webworker" />

import { PDFDocument, StandardFonts, rgb } from "pdf-lib"
import { createWorker, OEM } from "tesseract.js"
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs"

type MergeFileInput = {
  name: string
  buffer: ArrayBuffer
}

type MergeChunkRequest = {
  type: "mergeChunk"
  requestId: string
  files: MergeFileInput[]
}

type SplitMode = "extract" | "ranges" | "individual"

type SplitRequest = {
  type: "splitFile"
  requestId: string
  fileName: string
  buffer: ArrayBuffer
  mode: SplitMode
  selectedPages?: number[]
  ranges?: number[][]
}

type OcrRequest = {
  type: "performLocalOCR"
  requestId: string
  file: File
}

type WorkerRequest = MergeChunkRequest | SplitRequest | OcrRequest

type WorkerProgressMessage = {
  type: "progress"
  requestId: string
  progress: number
  status: string
}

type MergeChunkSuccessMessage = {
  type: "mergeChunkSuccess"
  requestId: string
  mergedBuffer: ArrayBuffer
  pageCount: number
}

type SplitOutput = {
  name: string
  buffer: ArrayBuffer
  pageCount: number
  pageRange: string
}

type SplitSuccessMessage = {
  type: "splitSuccess"
  requestId: string
  outputs: SplitOutput[]
}

type OcrSuccessMessage = {
  type: "ocrSuccess"
  requestId: string
  name: string
  buffer: ArrayBuffer
  extractedText: string
  pageCount: number
}

type WorkerErrorMessage = {
  type: "error"
  requestId: string
  error: string
}

const workerScope = self as DedicatedWorkerGlobalScope
const OCR_LOCAL_ASSET_BASE = "/tesseract"
const OCR_WORKER_PATH = `${OCR_LOCAL_ASSET_BASE}/worker.min.js`
const OCR_CORE_PATH = `${OCR_LOCAL_ASSET_BASE}/tesseract-core-simd-lstm.wasm.js`
const OCR_LANG_PATH = `${OCR_LOCAL_ASSET_BASE}/lang-data`
const OCR_DEFAULT_LANG_FILE = "eng.traineddata.gz"

const toArrayBuffer = (bytes: Uint8Array): ArrayBuffer =>
  bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer

const toDataUrl = async (canvas: OffscreenCanvas, mimeType = "image/jpeg", quality = 0.9) => {
  const blob = await canvas.convertToBlob({ type: mimeType, quality })
  const buffer = await blob.arrayBuffer()
  const bytes = new Uint8Array(buffer)

  let binary = ""
  const chunkSize = 0x8000
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize))
  }
  return `data:${mimeType};base64,${btoa(binary)}`
}

const sendProgress = (requestId: string, progress: number, status: string) => {
  const message: WorkerProgressMessage = {
    type: "progress",
    requestId,
    progress,
    status,
  }
  workerScope.postMessage(message)
}

const sendError = (requestId: string, error: string) => {
  const message: WorkerErrorMessage = {
    type: "error",
    requestId,
    error,
  }
  workerScope.postMessage(message)
}

const ensureLocalOcrLanguageData = async () => {
  const languageFileUrl = `${OCR_LANG_PATH}/${OCR_DEFAULT_LANG_FILE}`
  const response = await fetch(languageFileUrl, { method: "HEAD" })
  if (!response.ok) {
    throw new Error(
      `Missing local OCR language file at ${languageFileUrl}. Add ${OCR_DEFAULT_LANG_FILE} to continue.`
    )
  }
}

const mergeChunk = async (request: MergeChunkRequest) => {
  const mergedPdf = await PDFDocument.create()
  let processedPages = 0

  for (let i = 0; i < request.files.length; i++) {
    const source = request.files[i]
    const pdf = await PDFDocument.load(source.buffer, { ignoreEncryption: true })
    const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())
    pages.forEach((page) => mergedPdf.addPage(page))

    processedPages += pages.length
    sendProgress(
      request.requestId,
      Math.round(((i + 1) / request.files.length) * 100),
      `Accelerating merge in parallel worker ${i + 1} of ${request.files.length}.`
    )
  }

  const mergedBytes = await mergedPdf.save({ useObjectStreams: true })
  const success: MergeChunkSuccessMessage = {
    type: "mergeChunkSuccess",
    requestId: request.requestId,
    mergedBuffer: toArrayBuffer(mergedBytes),
    pageCount: processedPages,
  }

  workerScope.postMessage(success, [success.mergedBuffer])
}

const splitFile = async (request: SplitRequest) => {
  const sourcePdf = await PDFDocument.load(request.buffer, { ignoreEncryption: true })
  const baseName = request.fileName.replace(/\.pdf$/i, "")
  const outputs: SplitOutput[] = []

  if (request.mode === "extract") {
    const selectedPages = request.selectedPages ?? []
    const output = await PDFDocument.create()
    const copied = await output.copyPages(sourcePdf, selectedPages.map((page) => page - 1))
    copied.forEach((page) => output.addPage(page))

    const bytes = await output.save({ useObjectStreams: true })
      outputs.push({
        name: `${baseName}_pages_${selectedPages.join("-")}.pdf`,
        buffer: toArrayBuffer(bytes),
        pageCount: selectedPages.length,
        pageRange:
          selectedPages.length === 1
          ? `Page ${selectedPages[0]}`
          : `Pages ${selectedPages[0]}-${selectedPages[selectedPages.length - 1]}`,
    })
  } else if (request.mode === "ranges") {
    const ranges = request.ranges ?? []
    for (let i = 0; i < ranges.length; i++) {
      const range = ranges[i]
      const output = await PDFDocument.create()
      const copied = await output.copyPages(sourcePdf, range.map((page) => page - 1))
      copied.forEach((page) => output.addPage(page))

      const bytes = await output.save({ useObjectStreams: true })
      outputs.push({
        name:
          range.length === 1
            ? `${baseName}_page_${range[0]}.pdf`
            : `${baseName}_pages_${range[0]}-${range[range.length - 1]}.pdf`,
        buffer: toArrayBuffer(bytes),
        pageCount: range.length,
        pageRange:
          range.length === 1
            ? `Page ${range[0]}`
            : `Pages ${range[0]}-${range[range.length - 1]}`,
      })

      sendProgress(
        request.requestId,
        Math.round(((i + 1) / ranges.length) * 100),
        `Organising split ranges in parallel worker ${i + 1} of ${ranges.length}.`
      )
    }
  } else {
    for (let i = 0; i < sourcePdf.getPageCount(); i++) {
      const output = await PDFDocument.create()
      const [copiedPage] = await output.copyPages(sourcePdf, [i])
      output.addPage(copiedPage)
      const bytes = await output.save({ useObjectStreams: true })

      outputs.push({
        name: `${baseName}_page_${i + 1}.pdf`,
        buffer: toArrayBuffer(bytes),
        pageCount: 1,
        pageRange: `Page ${i + 1}`,
      })

      sendProgress(
        request.requestId,
        Math.round(((i + 1) / sourcePdf.getPageCount()) * 100),
        `Organising individual pages in parallel worker ${i + 1} of ${sourcePdf.getPageCount()}.`
      )
    }
  }

  const success: SplitSuccessMessage = {
    type: "splitSuccess",
    requestId: request.requestId,
    outputs,
  }

  const transferables = outputs.map((output) => output.buffer)
  workerScope.postMessage(success, transferables)
}

const performLocalOCR = async (
  file: File,
  requestId: string
) => {
  sendProgress(requestId, 2, "Initialising OCR worker locally.")
  await ensureLocalOcrLanguageData()

  const fileBuffer = await file.arrayBuffer()
  const sourceBytes = new Uint8Array(fileBuffer)
  const loadingTask = pdfjsLib.getDocument({
    data: sourceBytes,
    disableAutoFetch: true,
    disableRange: true,
    disableStream: true,
  })
  const pdf = await loadingTask.promise

  const ocrWorker = await createWorker("eng", OEM.LSTM_ONLY, {
    workerPath: OCR_WORKER_PATH,
    corePath: OCR_CORE_PATH,
    langPath: OCR_LANG_PATH,
    workerBlobURL: false,
    gzip: true,
    logger: (log) => {
      if (log.status) {
        const percentage = Math.round((log.progress ?? 0) * 100)
        sendProgress(
          requestId,
          Math.min(95, Math.max(5, percentage)),
          `Initialising OCR: ${log.status}.`
        )
      }
    },
  })

  const outputPdf = await PDFDocument.create()
  const ocrFont = await outputPdf.embedFont(StandardFonts.Helvetica)
  const pageTexts: string[] = []
  const renderScale = 1.6

  try {
    for (let index = 0; index < pdf.numPages; index++) {
      const page = await pdf.getPage(index + 1)
      const renderViewport = page.getViewport({ scale: renderScale })
      const pointViewport = page.getViewport({ scale: 1 })

      const canvas = new OffscreenCanvas(
        Math.max(1, Math.ceil(renderViewport.width)),
        Math.max(1, Math.ceil(renderViewport.height))
      )
      const context = canvas.getContext("2d")
      if (!context) {
        throw new Error("Could not initialise offscreen canvas for local OCR.")
      }

      await page.render({
        canvas: canvas as unknown as HTMLCanvasElement,
        canvasContext: context as unknown as CanvasRenderingContext2D,
        viewport: renderViewport,
        annotationMode: pdfjsLib.AnnotationMode.ENABLE,
      }).promise

      sendProgress(
        requestId,
        Math.round(((index + 1) / pdf.numPages) * 60),
        `Initialising OCR page ${index + 1} of ${pdf.numPages}.`
      )

      const ocrResult = await ocrWorker.recognize(canvas)
      pageTexts.push(ocrResult.data.text || "")

      const pageImageDataUrl = await toDataUrl(canvas, "image/jpeg", 0.9)
      const image = await outputPdf.embedJpg(pageImageDataUrl)
      const outputPage = outputPdf.addPage([pointViewport.width, pointViewport.height])

      outputPage.drawImage(image, {
        x: 0,
        y: 0,
        width: pointViewport.width,
        height: pointViewport.height,
      })

      for (const word of ocrResult.data.words ?? []) {
        const rawText = (word.text || "").trim()
        if (!rawText) continue

        const x = word.bbox.x0 / renderScale
        const y = pointViewport.height - word.bbox.y1 / renderScale
        const lineHeight = Math.max(6, (word.bbox.y1 - word.bbox.y0) / renderScale)

        outputPage.drawText(rawText, {
          x,
          y,
          size: lineHeight,
          font: ocrFont,
          color: rgb(0, 0, 0),
          opacity: 0,
        })
      }

      sendProgress(
        requestId,
        Math.round(60 + ((index + 1) / pdf.numPages) * 35),
        `Optimising OCR layer for page ${index + 1} of ${pdf.numPages}.`
      )
    }
  } finally {
    await ocrWorker.terminate()
    await loadingTask.destroy()
  }

  const outputBytes = await outputPdf.save({ useObjectStreams: true })
  const success: OcrSuccessMessage = {
    type: "ocrSuccess",
    requestId,
    name: file.name.replace(/\.pdf$/i, "") + "-ocr-searchable.pdf",
    buffer: toArrayBuffer(outputBytes),
    extractedText: pageTexts.join("\n\n"),
    pageCount: pdf.numPages,
  }

  sendProgress(requestId, 100, "Complete. OCR finished locally.")
  workerScope.postMessage(success, [success.buffer])
}

workerScope.onmessage = async (event: MessageEvent<WorkerRequest>) => {
  const request = event.data

  try {
    if (request.type === "mergeChunk") {
      await mergeChunk(request)
      return
    }

    if (request.type === "splitFile") {
      await splitFile(request)
      return
    }

    if (request.type === "performLocalOCR") {
      await performLocalOCR(request.file, request.requestId)
      return
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Local batch processing failed in the worker."
    sendError(request.requestId, errorMessage)
  }
}

