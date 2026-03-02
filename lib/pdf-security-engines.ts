"use client"

import {
  PDFDict,
  PDFDocument,
  PDFName,
  PDFStream,
  rgb,
} from "pdf-lib"

export interface Rect {
  pageIndex?: number
  pageNumber?: number
  x: number
  y: number
  width: number
  height: number
}

export type ProcessingStage =
  | "Initialising Wasm"
  | "Scrubbing Metadata"
  | "Applying Burn-In Redaction"
  | "Complete"

type StageReporter = (stage: ProcessingStage, message: string) => void

type PdfJsModule = typeof import("pdfjs-dist/legacy/build/pdf.mjs")

let pdfJsModulePromise: Promise<PdfJsModule> | null = null

const METADATA_KEYS = [
  "Author",
  "Creator",
  "Producer",
  "CreationDate",
  "ModDate",
  "Title",
  "Subject",
  "Keywords",
  "Metadata",
  "PieceInfo",
  "LastModified",
  "Company",
  "Manager",
  "Trapped",
] as const

const name = (value: string) => PDFName.of(value)

const reportStage = (
  stage: ProcessingStage,
  message: string,
  onStageChange?: StageReporter
) => {
  onStageChange?.(stage, message)
  console.info(`[Plain] ${message}`)
}

const getPdfJs = async (): Promise<PdfJsModule> => {
  if (!pdfJsModulePromise) {
    pdfJsModulePromise = import("pdfjs-dist/legacy/build/pdf.mjs")
  }

  return pdfJsModulePromise
}

const scrubMetadataKeysFromDict = (dict: PDFDict) => {
  for (const key of METADATA_KEYS) {
    dict.delete(name(key))
  }
}

const scrubMetadataFromDocument = (pdfDoc: PDFDocument) => {
  const context = pdfDoc.context

  for (const [, object] of context.enumerateIndirectObjects()) {
    if (object instanceof PDFDict) {
      scrubMetadataKeysFromDict(object)
      continue
    }

    if (object instanceof PDFStream) {
      scrubMetadataKeysFromDict(object.dict)
    }
  }

  pdfDoc.catalog.delete(name("Metadata"))
  context.trailerInfo.Info = undefined
}

const rebuildAsFlattenedDocument = async (sourceDoc: PDFDocument) => {
  const rebuiltDoc = await PDFDocument.create()
  const pages = await rebuiltDoc.copyPages(sourceDoc, sourceDoc.getPageIndices())
  for (const page of pages) {
    rebuiltDoc.addPage(page)
  }
  scrubMetadataFromDocument(rebuiltDoc)
  return rebuiltDoc
}

const safeGetPageIndex = (rect: Rect) => {
  if (typeof rect.pageIndex === "number") return rect.pageIndex
  if (typeof rect.pageNumber === "number") return rect.pageNumber - 1
  return 0
}

const drawBurnInRectangles = (
  context: CanvasRenderingContext2D,
  pageHeight: number,
  scale: number,
  rectangles: Rect[]
) => {
  context.save()
  context.fillStyle = "#000000"

  for (const rect of rectangles) {
    const scaledX = rect.x * scale
    const scaledWidth = rect.width * scale
    const scaledHeight = rect.height * scale
    const scaledY = pageHeight - (rect.y + rect.height) * scale
    context.fillRect(scaledX, scaledY, scaledWidth, scaledHeight)
  }

  context.restore()
}

export async function purgeMetadata(
  file: File,
  onStageChange?: StageReporter
): Promise<Uint8Array> {
  reportStage(
    "Initialising Wasm",
    "Initialising Wasm core for local metadata sanitisation.",
    onStageChange
  )

  const sourceBytes = new Uint8Array(await file.arrayBuffer())
  const sourceDoc = await PDFDocument.load(sourceBytes, {
    ignoreEncryption: true,
    updateMetadata: false,
  })

  reportStage(
    "Scrubbing Metadata",
    "Scrubbing metadata entries locally with no uploads.",
    onStageChange
  )

  scrubMetadataFromDocument(sourceDoc)
  const flattenedDoc = await rebuildAsFlattenedDocument(sourceDoc)
  const cleanedBytes = await flattenedDoc.save({ useObjectStreams: true })

  reportStage(
    "Complete",
    "Metadata scrubbing complete. The cleaned PDF is ready for download.",
    onStageChange
  )

  return cleanedBytes
}

export async function applyBurnInRedaction(
  file: File,
  coordinates: Rect[],
  onStageChange?: StageReporter
): Promise<Uint8Array> {
  reportStage(
    "Initialising Wasm",
    "Initialising Wasm and local rendering engines for burn-in redaction.",
    onStageChange
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

  const sourcePdf = await loadingTask.promise
  const outputDoc = await PDFDocument.create()
  const renderScale = 2

  try {
    for (let pageIndex = 0; pageIndex < sourcePdf.numPages; pageIndex++) {
      const page = await sourcePdf.getPage(pageIndex + 1)
      const renderViewport = page.getViewport({ scale: renderScale })
      const pointViewport = page.getViewport({ scale: 1 })

      const canvas = document.createElement("canvas")
      canvas.width = Math.ceil(renderViewport.width)
      canvas.height = Math.ceil(renderViewport.height)

      const context = canvas.getContext("2d")
      if (!context) {
        throw new Error("Could not initialise canvas context for local redaction.")
      }

      await page.render({
        canvasContext: context,
        viewport: renderViewport,
        annotationMode: pdfjs.AnnotationMode.ENABLE,
      }).promise

      reportStage(
        "Applying Burn-In Redaction",
        `Applying burn-in redaction on page ${pageIndex + 1} locally.`,
        onStageChange
      )

      const pageRects = coordinates.filter((rect) => safeGetPageIndex(rect) === pageIndex)
      drawBurnInRectangles(context, pointViewport.height, renderScale, pageRects)

      const redactedPngDataUrl = canvas.toDataURL("image/png")
      const redactedImage = await outputDoc.embedPng(redactedPngDataUrl)
      const outputPage = outputDoc.addPage([pointViewport.width, pointViewport.height])

      outputPage.drawImage(redactedImage, {
        x: 0,
        y: 0,
        width: pointViewport.width,
        height: pointViewport.height,
      })

      if (pageRects.length > 0) {
        for (const rect of pageRects) {
          outputPage.drawRectangle({
            x: rect.x,
            y: rect.y,
            width: rect.width,
            height: rect.height,
            color: rgb(0, 0, 0),
          })
        }
      }
    }
  } finally {
    await loadingTask.destroy()
  }

  scrubMetadataFromDocument(outputDoc)
  const redactedBytes = await outputDoc.save({ useObjectStreams: true })

  reportStage(
    "Complete",
    "Burn-in redaction complete. Underlying content has been removed and flattened locally.",
    onStageChange
  )

  return redactedBytes
}
