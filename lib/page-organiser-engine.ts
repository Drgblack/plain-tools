"use client"

import { PDFDocument } from "pdf-lib"

export interface PageThumbnail {
  originalIndex: number
  dataUrl: string
}

type WorkerProgressMessage = {
  type: "progress"
  requestId: string
  progress: number
  status: string
}

type WorkerSuccessMessage = {
  type: "success"
  requestId: string
  thumbnails: PageThumbnail[]
  pageCount: number
  webgpuActive: boolean
}

type WorkerErrorMessage = {
  type: "error"
  requestId: string
  error: string
}

type WorkerMessage = WorkerProgressMessage | WorkerSuccessMessage | WorkerErrorMessage

type GenerateThumbnailOptions = {
  thumbnailWidth?: number
  onProgress?: (progress: number, status: string) => void
}

export const isWebGpuAvailable = () =>
  typeof navigator !== "undefined" && "gpu" in navigator

const createOrganiserWorker = () =>
  new Worker(new URL("../workers/page-organiser.worker.ts", import.meta.url), {
    type: "module",
  })

export async function generatePagePreviews(
  file: File,
  options: GenerateThumbnailOptions = {}
) {
  const requestId = crypto.randomUUID()
  const pdfBytes = await file.arrayBuffer()

  return await new Promise<{
    thumbnails: PageThumbnail[]
    pageCount: number
    webgpuActive: boolean
  }>((resolve, reject) => {
    const worker = createOrganiserWorker()

    const handleMessage = (event: MessageEvent<WorkerMessage>) => {
      const message = event.data
      if (!message || message.requestId !== requestId) {
        return
      }

      if (message.type === "progress") {
        options.onProgress?.(message.progress, message.status)
        return
      }

      worker.removeEventListener("message", handleMessage)
      worker.terminate()

      if (message.type === "error") {
        reject(new Error(message.error))
        return
      }

      resolve({
        thumbnails: message.thumbnails,
        pageCount: message.pageCount,
        webgpuActive: message.webgpuActive,
      })
    }

    worker.addEventListener("message", handleMessage)
    worker.addEventListener("error", (event) => {
      worker.removeEventListener("message", handleMessage)
      worker.terminate()
      reject(new Error(event.message || "Failed to initialise organiser worker."))
    })

    worker.postMessage(
      {
        type: "generateThumbnails",
        requestId,
        pdfBytes,
        thumbnailWidth: options.thumbnailWidth,
      },
      [pdfBytes]
    )
  })
}

export async function reorderPages(file: File, newIndexOrder: number[]) {
  const sourceBuffer = await file.arrayBuffer()
  const sourcePdf = await PDFDocument.load(sourceBuffer, { ignoreEncryption: true })
  const totalPages = sourcePdf.getPageCount()

  if (newIndexOrder.length !== totalPages) {
    throw new Error("Invalid page order. Every page must be included exactly once.")
  }

  const seen = new Set<number>()
  for (const index of newIndexOrder) {
    if (!Number.isInteger(index) || index < 0 || index >= totalPages || seen.has(index)) {
      throw new Error("Invalid page order detected. Please try organising pages again.")
    }
    seen.add(index)
  }

  const outputPdf = await PDFDocument.create()
  const copiedPages = await outputPdf.copyPages(sourcePdf, newIndexOrder)
  copiedPages.forEach((page) => outputPdf.addPage(page))

  return await outputPdf.save({ useObjectStreams: true })
}
