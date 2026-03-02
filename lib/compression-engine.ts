"use client"

import { PDFDocument } from "pdf-lib"

type PdfJsModule = typeof import("pdfjs-dist/legacy/build/pdf.mjs")

export type CompressionStage =
  | "Initialising Wasm"
  | "Optimising Images"
  | "Complete"

type CompressionReporter = (stage: CompressionStage, message: string) => void

export interface CompressionPreviewResult {
  bytes: Uint8Array
  fileSizeBytes: number
  fileSizeLabel: string
  scale: number
}

let pdfJsModulePromise: Promise<PdfJsModule> | null = null

const clampScale = (value: number) => Math.min(1, Math.max(0.1, value))

const reportStage = (
  stage: CompressionStage,
  message: string,
  onStageChange?: CompressionReporter
) => {
  onStageChange?.(stage, message)
  console.info(`[Plain] ${message}`)
}

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

const formatBytes = (value: number) => {
  if (value < 1024) return `${value} B`
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`
  return `${(value / (1024 * 1024)).toFixed(2)} MB`
}

const offscreenToJpegDataUrl = async (canvas: OffscreenCanvas) => {
  const blob = await canvas.convertToBlob({ type: "image/jpeg", quality: 0.82 })
  const buffer = await blob.arrayBuffer()
  const bytes = new Uint8Array(buffer)

  let binary = ""
  const chunkSize = 0x8000
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize))
  }
  return `data:image/jpeg;base64,${btoa(binary)}`
}

export async function generateCompressionPreview(
  file: File,
  scale: number,
  onStageChange?: CompressionReporter
): Promise<CompressionPreviewResult> {
  const targetScale = clampScale(scale)

  reportStage(
    "Initialising Wasm",
    "Initialising Wasm for local compression preview.",
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
  const outputPdf = await PDFDocument.create()

  try {
    for (let pageIndex = 0; pageIndex < sourcePdf.numPages; pageIndex++) {
      reportStage(
        "Optimising Images",
        `Optimising images locally for page ${pageIndex + 1} of ${sourcePdf.numPages}.`,
        onStageChange
      )

      const page = await sourcePdf.getPage(pageIndex + 1)
      const originalViewport = page.getViewport({ scale: 1 })
      const renderViewport = page.getViewport({ scale: targetScale })

      const canvas = new OffscreenCanvas(
        Math.max(1, Math.ceil(renderViewport.width)),
        Math.max(1, Math.ceil(renderViewport.height))
      )
      const context = canvas.getContext("2d")
      if (!context) {
        throw new Error("Could not initialise offscreen canvas for compression preview.")
      }

      await page.render({
        canvasContext: context,
        viewport: renderViewport,
        annotationMode: pdfjs.AnnotationMode.ENABLE,
      }).promise

      const imageDataUrl = await offscreenToJpegDataUrl(canvas)
      const image = await outputPdf.embedJpg(imageDataUrl)
      const outputPage = outputPdf.addPage([originalViewport.width, originalViewport.height])

      outputPage.drawImage(image, {
        x: 0,
        y: 0,
        width: originalViewport.width,
        height: originalViewport.height,
      })
    }
  } finally {
    await loadingTask.destroy()
  }

  const bytes = await outputPdf.save({ useObjectStreams: true })

  reportStage(
    "Complete",
    "Compression preview complete. Output remains local to your browser.",
    onStageChange
  )

  return {
    bytes,
    fileSizeBytes: bytes.byteLength,
    fileSizeLabel: formatBytes(bytes.byteLength),
    scale: targetScale,
  }
}
