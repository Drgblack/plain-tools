"use client"

import { PDFDocument, StandardFonts, rgb } from "pdf-lib"
import type { PlainRedactionRegion } from "./pdf-security-engines"

type PdfJsModule = typeof import("pdfjs-dist/legacy/build/pdf.mjs")

type ScannerProgress = (progress: number, status: string) => void

type RiskType = "ssn" | "email" | "medical_id" | "iban"
type RiskSeverity = "low" | "medium" | "high"

type TextLikeItem = {
  str?: string
  transform?: number[]
  width?: number
  height?: number
}

interface RiskPattern {
  type: RiskType
  label: string
  severity: RiskSeverity
  expression: RegExp
}

export interface PrivacyRiskBounds {
  x: number
  y: number
  width: number
  height: number
}

export interface PrivacyRiskFinding {
  id: string
  page: number
  type: RiskType
  label: string
  severity: RiskSeverity
  confidence: number
  matchedText: string
  bounds: PrivacyRiskBounds
  recommendation: string
}

export interface PrivacyRiskSummary {
  totalFindings: number
  byType: Record<RiskType, number>
  bySeverity: Record<RiskSeverity, number>
  highRiskPages: number[]
}

export interface PrivacyRiskReport {
  fileName: string
  scannedAt: string
  pageCount: number
  webgpuActive: boolean
  wasmActive: boolean
  findings: PrivacyRiskFinding[]
  suggestedRedactions: PlainRedactionRegion[]
  summary: PrivacyRiskSummary
  complianceNotes: string[]
}

export interface PlainPrivacyRiskScannerOptions {
  maxFindings?: number
  highlightAlpha?: number
  onProgress?: ScannerProgress
}

export interface PlainPrivacyRiskScannerResult {
  report: PrivacyRiskReport
  annotatedBytes: Uint8Array
}

const PATTERNS: RiskPattern[] = [
  {
    type: "ssn",
    label: "US Social Security Number",
    severity: "high",
    expression: /\b\d{3}-\d{2}-\d{4}\b/g,
  },
  {
    type: "email",
    label: "Email Address",
    severity: "medium",
    expression: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,
  },
  {
    type: "medical_id",
    label: "Medical Identifier",
    severity: "high",
    expression: /\b(?:MRN|Medical\s*ID|Patient\s*ID)\s*[:#-]?\s*[A-Z0-9-]{5,20}\b/gi,
  },
  {
    type: "iban",
    label: "IBAN",
    severity: "high",
    expression: /\b[A-Z]{2}\d{2}[A-Z0-9]{10,30}\b/g,
  },
]

const typeConfidence: Record<RiskType, number> = {
  ssn: 0.95,
  email: 0.9,
  medical_id: 0.88,
  iban: 0.93,
}

const recommendations: Record<RiskType, string> = {
  ssn: "Redact this identifier before sharing externally.",
  email: "Review whether this contact data should be redacted or pseudonymised.",
  medical_id: "Treat as sensitive health data and redact where unnecessary.",
  iban: "Mask account information to reduce financial exposure.",
}

let pdfJsModulePromise: Promise<PdfJsModule> | null = null

const isWebGpuAvailable = () =>
  typeof navigator !== "undefined" && "gpu" in navigator

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

const reportProgress = (
  progress: number,
  status: string,
  onProgress?: ScannerProgress
) => {
  onProgress?.(progress, status)
  console.info(`[Plain] ${status}`)
}

const isValidIban = (value: string) => {
  const iban = value.replace(/\s+/g, "").toUpperCase()
  if (!/^[A-Z]{2}\d{2}[A-Z0-9]{10,30}$/.test(iban)) return false

  const rearranged = `${iban.slice(4)}${iban.slice(0, 4)}`
  let remainder = 0

  for (const character of rearranged) {
    const numericChunk = /[A-Z]/.test(character)
      ? String(character.charCodeAt(0) - 55)
      : character

    for (const digit of numericChunk) {
      remainder = (remainder * 10 + Number(digit)) % 97
    }
  }

  return remainder === 1
}

const normaliseBounds = (bounds: PrivacyRiskBounds, pageWidth: number, pageHeight: number) => {
  const startX = Math.max(0, Math.min(pageWidth, bounds.x))
  const startY = Math.max(0, Math.min(pageHeight, bounds.y))
  const endX = Math.max(startX, Math.min(pageWidth, bounds.x + bounds.width))
  const endY = Math.max(startY, Math.min(pageHeight, bounds.y + bounds.height))

  return {
    x: startX,
    y: startY,
    width: Math.max(1, endX - startX),
    height: Math.max(1, endY - startY),
  }
}

const makeFindingId = (
  page: number,
  type: RiskType,
  bounds: PrivacyRiskBounds,
  matchedText: string
) =>
  [
    page,
    type,
    Math.round(bounds.x),
    Math.round(bounds.y),
    Math.round(bounds.width),
    Math.round(bounds.height),
    matchedText.toLowerCase(),
  ].join(":")

const deriveBoundsForMatch = (
  item: TextLikeItem,
  pageHeight: number,
  start: number,
  end: number
) => {
  const text = item.str ?? ""
  const width = Math.max(4, Number(item.width || 0))
  const baseHeight = Math.abs(item.transform?.[3] || 0) || Number(item.height || 0) || 10
  const height = Math.max(8, baseHeight * 1.15)
  const x = Number(item.transform?.[4] || 0)
  const y = Number(item.transform?.[5] || 0) - height * 0.2
  const charWidth = text.length > 0 ? width / text.length : width

  return normaliseBounds(
    {
      x: x + start * charWidth,
      y,
      width: Math.max(4, (end - start) * charWidth),
      height,
    },
    Number.MAX_SAFE_INTEGER,
    pageHeight
  )
}

const getMatchesForPattern = (text: string, pattern: RegExp) => {
  const matcher = new RegExp(pattern.source, pattern.flags)
  const matches: Array<{ value: string; start: number; end: number }> = []
  let match = matcher.exec(text)

  while (match) {
    matches.push({
      value: match[0],
      start: match.index,
      end: match.index + match[0].length,
    })
    match = matcher.exec(text)
  }

  return matches
}

const mergeRedactionSuggestions = (regions: PlainRedactionRegion[]) => {
  const sorted = [...regions].sort((left, right) => {
    if (left.page !== right.page) return left.page - right.page
    if (left.coords.y !== right.coords.y) return left.coords.y - right.coords.y
    return left.coords.x - right.coords.x
  })

  const merged: PlainRedactionRegion[] = []
  for (const region of sorted) {
    const previous = merged[merged.length - 1]
    if (!previous || previous.page !== region.page) {
      merged.push(region)
      continue
    }

    const overlapX =
      previous.coords.x <= region.coords.x + region.coords.width &&
      region.coords.x <= previous.coords.x + previous.coords.width
    const overlapY =
      previous.coords.y <= region.coords.y + region.coords.height &&
      region.coords.y <= previous.coords.y + previous.coords.height

    if (!overlapX || !overlapY) {
      merged.push(region)
      continue
    }

    const minX = Math.min(previous.coords.x, region.coords.x)
    const minY = Math.min(previous.coords.y, region.coords.y)
    const maxX = Math.max(
      previous.coords.x + previous.coords.width,
      region.coords.x + region.coords.width
    )
    const maxY = Math.max(
      previous.coords.y + previous.coords.height,
      region.coords.y + region.coords.height
    )

    previous.coords.x = minX
    previous.coords.y = minY
    previous.coords.width = maxX - minX
    previous.coords.height = maxY - minY
  }

  return merged
}

export async function plainPrivacyRiskScanner(
  file: File,
  options: PlainPrivacyRiskScannerOptions = {}
): Promise<PlainPrivacyRiskScannerResult> {
  const maxFindings = Math.max(1, options.maxFindings ?? 600)
  const highlightAlpha = Math.max(0.08, Math.min(0.5, options.highlightAlpha ?? 0.22))
  const webgpuActive = isWebGpuAvailable()

  reportProgress(
    2,
    webgpuActive
      ? "Initialising local privacy scanner with WebGPU-ready acceleration."
      : "Initialising local privacy scanner.",
    options.onProgress
  )

  const sourceBytes = new Uint8Array(await file.arrayBuffer())
  const pdfjs = await getPdfJs()
  const loadingTask = pdfjs.getDocument({
    data: sourceBytes,
    disableWorker: true,
    disableAutoFetch: true,
    disableRange: true,
    disableStream: true,
  })

  const findings: PrivacyRiskFinding[] = []
  const findingIds = new Set<string>()

  try {
    const sourcePdf = await loadingTask.promise

    for (let pageIndex = 0; pageIndex < sourcePdf.numPages; pageIndex++) {
      const page = await sourcePdf.getPage(pageIndex + 1)
      const viewport = page.getViewport({ scale: 1 })
      const textContent = await page.getTextContent()

      for (const item of textContent.items as TextLikeItem[]) {
        const text = (item.str || "").trim()
        if (!text) continue

        for (const pattern of PATTERNS) {
          const matches = getMatchesForPattern(text, pattern.expression)
          for (const match of matches) {
            if (pattern.type === "iban" && !isValidIban(match.value)) {
              continue
            }

            const bounds = normaliseBounds(
              deriveBoundsForMatch(item, viewport.height, match.start, match.end),
              viewport.width,
              viewport.height
            )
            const id = makeFindingId(pageIndex + 1, pattern.type, bounds, match.value)
            if (findingIds.has(id)) continue
            findingIds.add(id)

            findings.push({
              id,
              page: pageIndex + 1,
              type: pattern.type,
              label: pattern.label,
              severity: pattern.severity,
              confidence: typeConfidence[pattern.type],
              matchedText: match.value,
              bounds,
              recommendation: recommendations[pattern.type],
            })

            if (findings.length >= maxFindings) {
              break
            }
          }

          if (findings.length >= maxFindings) {
            break
          }
        }

        if (findings.length >= maxFindings) {
          break
        }
      }

      reportProgress(
        Math.min(75, Math.round(((pageIndex + 1) / sourcePdf.numPages) * 75)),
        `Scanning privacy risks locally: page ${pageIndex + 1} of ${sourcePdf.numPages}.`,
        options.onProgress
      )
    }

    const annotatedPdf = await PDFDocument.load(sourceBytes, {
      ignoreEncryption: true,
      updateMetadata: false,
    })
    const labelFont = await annotatedPdf.embedFont(StandardFonts.Helvetica)

    for (const finding of findings) {
      const page = annotatedPdf.getPage(finding.page - 1)
      if (!page) continue

      page.drawRectangle({
        x: finding.bounds.x,
        y: finding.bounds.y,
        width: finding.bounds.width,
        height: finding.bounds.height,
        color: rgb(1, 0.24, 0.24),
        opacity: highlightAlpha,
      })

      page.drawRectangle({
        x: finding.bounds.x,
        y: finding.bounds.y,
        width: finding.bounds.width,
        height: finding.bounds.height,
        borderColor: rgb(0.78, 0.06, 0.06),
        borderWidth: 0.8,
      })

      const labelY = Math.min(
        page.getHeight() - 12,
        finding.bounds.y + finding.bounds.height + 2
      )

      page.drawText(`${finding.type.toUpperCase()} ${(finding.confidence * 100).toFixed(0)}%`, {
        x: finding.bounds.x,
        y: labelY,
        size: 8,
        font: labelFont,
        color: rgb(0.72, 0.06, 0.06),
      })
    }

    const suggestedRedactions = mergeRedactionSuggestions(
      findings.map((finding) => ({
        page: finding.page,
        coords: {
          x: finding.bounds.x,
          y: finding.bounds.y,
          width: finding.bounds.width,
          height: finding.bounds.height,
        },
      }))
    )

    const byType: Record<RiskType, number> = {
      ssn: 0,
      email: 0,
      medical_id: 0,
      iban: 0,
    }
    const bySeverity: Record<RiskSeverity, number> = {
      low: 0,
      medium: 0,
      high: 0,
    }

    for (const finding of findings) {
      byType[finding.type] += 1
      bySeverity[finding.severity] += 1
    }

    const highRiskPages = Array.from(
      new Set(
        findings
          .filter((finding) => finding.severity === "high")
          .map((finding) => finding.page)
      )
    ).sort((left, right) => left - right)

    const report: PrivacyRiskReport = {
      fileName: file.name,
      scannedAt: new Date().toISOString(),
      pageCount: annotatedPdf.getPageCount(),
      webgpuActive,
      wasmActive: true,
      findings,
      suggestedRedactions,
      summary: {
        totalFindings: findings.length,
        byType,
        bySeverity,
        highRiskPages,
      },
      complianceNotes: [
        "All scanning and annotation run locally in your browser with no uploads.",
        "Suggested redactions can be passed into Plain redaction tools for irreversible removal.",
        "Review findings manually before sharing for GDPR/HIPAA-aligned data minimisation.",
      ],
    }

    reportProgress(
      92,
      "Applying annotated risk overlays and preparing auto-redact suggestions.",
      options.onProgress
    )

    const annotatedBytes = await annotatedPdf.save({ useObjectStreams: true })

    reportProgress(
      100,
      "Complete. Privacy risk scan finished locally.",
      options.onProgress
    )

    return { report, annotatedBytes }
  } finally {
    await loadingTask.destroy()
  }
}
