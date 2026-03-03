"use client"

import { getPdfLib } from "./pdf-lib-loader"

export interface PageThumbnail {
  originalIndex: number
  dataUrl: string
}

export interface PageRotateOperation {
  page: number
  degrees: number
}

export interface PlainWebGPUPageOrganiserOperations {
  reorder?: number[]
  delete?: number[]
  rotate?: PageRotateOperation[]
  extract?: number[]
}

export interface PlainWebGPUPageOrganiserOptions {
  generatePreviews?: boolean
  thumbnailWidth?: number
  onProgress?: (progress: number, status: string) => void
  onPreview?: (payload: {
    thumbnails: PageThumbnail[]
    pageCount: number
    webgpuActive: boolean
  }) => void
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

const LARGE_PAGE_DOCUMENT_THRESHOLD = 100
const CHUNK_SIZE_LARGE = 24
const CHUNK_SIZE_DEFAULT = 64

const createOrganiserWorker = () =>
  new Worker(new URL("../workers/page-organiser.worker.ts", import.meta.url), {
    type: "module",
  })

const validatePageIndices = (
  label: string,
  pageIndices: number[],
  totalPages: number,
  requireUnique = true
) => {
  const seen = new Set<number>()
  for (const index of pageIndices) {
    if (!Number.isInteger(index) || index < 0 || index >= totalPages) {
      throw new Error(`Invalid ${label} page index detected.`)
    }

    if (requireUnique && seen.has(index)) {
      throw new Error(`Duplicate ${label} page index detected.`)
    }
    seen.add(index)
  }
}

const normaliseRotationDegrees = (value: number) => {
  const rounded = Math.round(value)
  if (rounded % 90 !== 0) {
    throw new Error("Rotation values must be multiples of 90 degrees.")
  }
  const normalised = ((rounded % 360) + 360) % 360
  return normalised
}

const areSetsEqual = (left: Set<number>, right: Set<number>) => {
  if (left.size !== right.size) return false
  for (const value of left) {
    if (!right.has(value)) return false
  }
  return true
}

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
  return await plainWebGPUPageOrganiser(
    file,
    { reorder: newIndexOrder },
    { generatePreviews: false }
  )
}

export async function plainWebGPUPageOrganiser(
  file: File,
  operations: PlainWebGPUPageOrganiserOperations,
  options: PlainWebGPUPageOrganiserOptions = {}
): Promise<Uint8Array> {
  const { PDFDocument, degrees } = await getPdfLib()
  const sourceBuffer = await file.arrayBuffer()
  const sourcePdf = await PDFDocument.load(sourceBuffer, { ignoreEncryption: true })
  const totalPages = sourcePdf.getPageCount()

  if (totalPages === 0) {
    throw new Error("The provided PDF has no pages to organise.")
  }

  const shouldGeneratePreviews = options.generatePreviews ?? true
  if (shouldGeneratePreviews) {
    options.onProgress?.(2, "Initialising organiser.")
    const preferredWidth =
      options.thumbnailWidth ??
      (totalPages > LARGE_PAGE_DOCUMENT_THRESHOLD ? 120 : 180)

    const previewPayload = await generatePagePreviews(file, {
      thumbnailWidth: preferredWidth,
      onProgress: (progress, status) => {
        options.onProgress?.(Math.min(45, Math.round(progress * 0.45)), status)
      },
    })
    options.onPreview?.(previewPayload)
  }

  let orderedPages = Array.from({ length: totalPages }, (_, index) => index)

  if (operations.extract?.length) {
    validatePageIndices("extract", operations.extract, totalPages, true)
    orderedPages = [...operations.extract]
  }

  if (operations.reorder?.length) {
    validatePageIndices("reorder", operations.reorder, totalPages, true)

    if (operations.extract?.length) {
      const extractSet = new Set(orderedPages)
      const reorderSet = new Set(operations.reorder)
      if (!areSetsEqual(extractSet, reorderSet)) {
        throw new Error(
          "Reorder indices must match extracted pages when extract mode is active."
        )
      }
    } else if (operations.reorder.length !== totalPages) {
      throw new Error("Reorder operation must include every page exactly once.")
    }

    orderedPages = [...operations.reorder]
  }

  if (operations.delete?.length) {
    validatePageIndices("delete", operations.delete, totalPages, true)
    const deleteSet = new Set(operations.delete)
    orderedPages = orderedPages.filter((pageIndex) => !deleteSet.has(pageIndex))
  }

  if (orderedPages.length === 0) {
    throw new Error("All pages were removed. At least one page must remain.")
  }

  const outputPdf = await PDFDocument.create()
  const chunkSize =
    totalPages > LARGE_PAGE_DOCUMENT_THRESHOLD ? CHUNK_SIZE_LARGE : CHUNK_SIZE_DEFAULT

  options.onProgress?.(52, "Organising page structure locally.")

  for (let offset = 0; offset < orderedPages.length; offset += chunkSize) {
    const chunk = orderedPages.slice(offset, offset + chunkSize)
    const copiedPages = await outputPdf.copyPages(sourcePdf, chunk)
    copiedPages.forEach((page) => outputPdf.addPage(page))

    const chunkProgress = Math.round(((offset + chunk.length) / orderedPages.length) * 30)
    options.onProgress?.(52 + chunkProgress, "Organising pages and applying layout changes.")
  }

  if (operations.rotate?.length) {
    for (const rotation of operations.rotate) {
      if (!Number.isInteger(rotation.page) || rotation.page < 0 || rotation.page >= totalPages) {
        throw new Error("Invalid rotate page index detected.")
      }

      const outputPageIndex = orderedPages.indexOf(rotation.page)
      if (outputPageIndex === -1) {
        continue
      }

      const page = outputPdf.getPage(outputPageIndex)
      const currentRotation = page.getRotation().angle
      const nextRotation = normaliseRotationDegrees(
        currentRotation + normaliseRotationDegrees(rotation.degrees)
      )
      page.setRotation(degrees(nextRotation))
    }
  }

  options.onProgress?.(96, "Finalising organised PDF locally.")
  const organisedBytes = await outputPdf.save({ useObjectStreams: true })
  options.onProgress?.(100, "Complete. Local organisation finished.")

  return organisedBytes
}
