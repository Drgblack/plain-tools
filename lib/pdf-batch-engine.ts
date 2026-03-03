"use client"

import { generateCompressionPreview } from "./compression-engine"
import { getPdfLib } from "./pdf-lib-loader"

const LARGE_FILE_THRESHOLD_BYTES = 500 * 1024 * 1024

type MergeSource = {
  name: string
  buffer: ArrayBuffer
}

type WorkerProgressMessage = {
  type: "progress"
  requestId: string
  progress: number
  status: string
}

type WorkerMergeSuccessMessage = {
  type: "mergeChunkSuccess"
  requestId: string
  mergedBuffer: ArrayBuffer
  pageCount: number
}

type WorkerSplitSuccessMessage = {
  type: "splitSuccess"
  requestId: string
  outputs: Array<{
    name: string
    buffer: ArrayBuffer
    pageCount: number
    pageRange: string
  }>
}

type WorkerOcrSuccessMessage = {
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

type WorkerMessage =
  | WorkerProgressMessage
  | WorkerMergeSuccessMessage
  | WorkerSplitSuccessMessage
  | WorkerOcrSuccessMessage
  | WorkerErrorMessage

type BatchSplitMode = "extract" | "ranges" | "individual"

export interface BatchSplitOptions {
  mode: BatchSplitMode
  selectedPages?: number[]
  ranges?: number[][]
}

export interface BatchSplitOutput {
  sourceFileName: string
  name: string
  bytes: Uint8Array
  pageCount: number
  pageRange: string
}

export interface OcrOutput {
  name: string
  bytes: Uint8Array
  extractedText: string
  pageCount: number
}

export interface PdfPageRange {
  start: number
  end: number
}

export type PdfConversionFormat = "png" | "jpg" | "text"
export type PlainBatchMode = "merge" | "split" | "compress" | "convert"

export interface PlainHardwareAcceleratedBatchOptions {
  mode: PlainBatchMode
  splitMode?: BatchSplitMode
  selectedPages?: number[]
  splitRanges?: PdfPageRange[]
  conversionFormat?: PdfConversionFormat
  compressionScale?: number
  maxParallelFiles?: number
  onProgress?: BatchProgress
}

export interface PlainHardwareAcceleratedBatchResult {
  mode: PlainBatchMode
  sourceNames: string[]
  outputName: string
  bytes?: Uint8Array
  blobs?: Blob[]
  splitOutputs?: Uint8Array[]
  webgpuActive: boolean
  workerAccelerated: boolean
  inputBytes: number
  outputBytes: number
  status: string
}

export interface PlainOfflineOcrBatchOptions {
  maxParallelFiles?: number
  onProgress?: BatchProgress
}

export interface PlainOfflineOcrBatchResult {
  sourceName: string
  outputName: string
  bytes: Uint8Array
  extractedText: string
  pageCount: number
  webgpuActive: boolean
}

export interface CompressionPreviewPair {
  pageIndex: number
  originalBlob: Blob
  compressedBlob: Blob
}

export interface PlainRealTimeCompressionPreviewerOptions {
  previewPages?: number
  previewMimeType?: "image/jpeg" | "image/png"
  onProgress?: BatchProgress
}

export interface PlainRealTimeCompressionPreviewResult {
  level: number
  scale: number
  previewPairs: CompressionPreviewPair[]
  compressedBytes: Uint8Array
  originalSizeBytes: number
  compressedSizeBytes: number
  savingsPercent: number
  webgpuActive: boolean
}

type BatchProgress = (progress: number, status: string) => void

type PdfJsModule = typeof import("pdfjs-dist/legacy/build/pdf.mjs")

const TWO_GB_BYTES = 2 * 1024 * 1024 * 1024
const DEFAULT_BATCH_PARALLELISM = 2

let pdfJsModulePromise: Promise<PdfJsModule> | null = null

const createBatchWorker = () =>
  new Worker(new URL("../workers/pdf-batch.worker.ts", import.meta.url), {
    type: "module",
  })

const isWebGpuComputeAvailable = () =>
  typeof navigator !== "undefined" && "gpu" in navigator

const waitForUiFrame = () =>
  new Promise<void>((resolve) => {
    if (typeof requestAnimationFrame !== "undefined") {
      requestAnimationFrame(() => resolve())
      return
    }
    setTimeout(() => resolve(), 0)
  })

const getPdfJsModule = async () => {
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

const bytesToTransferableBuffer = (bytes: Uint8Array): ArrayBuffer =>
  bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer

const toArrayBuffer = (buffer: ArrayBufferLike): ArrayBuffer => {
  const bytes = new Uint8Array(buffer)
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer
}

const runMergeChunkInWorker = (
  files: MergeSource[],
  onProgress?: BatchProgress
): Promise<Uint8Array> => {
  const requestId = crypto.randomUUID()
  const worker = createBatchWorker()

  return new Promise((resolve, reject) => {
    const handleMessage = (event: MessageEvent<WorkerMessage>) => {
      const message = event.data
      if (!message || message.requestId !== requestId) {
        return
      }

      if (message.type === "progress") {
        onProgress?.(message.progress, message.status)
        return
      }

      worker.removeEventListener("message", handleMessage)
      worker.terminate()

      if (message.type === "error") {
        reject(new Error(message.error))
        return
      }

      if (message.type === "mergeChunkSuccess") {
        resolve(new Uint8Array(message.mergedBuffer))
      }
    }

    worker.addEventListener("message", handleMessage)
    worker.addEventListener("error", (event) => {
      worker.removeEventListener("message", handleMessage)
      worker.terminate()
      reject(new Error(event.message || "Parallel merge worker failed to start."))
    })

    const transferables = files.map((file) => file.buffer)
    worker.postMessage(
      {
        type: "mergeChunk",
        requestId,
        files,
      },
      transferables
    )
  })
}

const splitIntoChunks = <T,>(items: T[], chunkCount: number) => {
  const safeChunkCount = Math.max(1, Math.min(chunkCount, items.length))
  const chunks = Array.from({ length: safeChunkCount }, () => [] as T[])

  items.forEach((item, index) => {
    chunks[index % safeChunkCount].push(item)
  })

  return chunks.filter((chunk) => chunk.length > 0)
}

const sumFileSizes = (files: File[]) =>
  files.reduce((total, file) => total + file.size, 0)

const clampParallelism = (value?: number) => {
  const requested =
    typeof value === "number" && Number.isFinite(value)
      ? Math.floor(value)
      : DEFAULT_BATCH_PARALLELISM
  return Math.max(1, Math.min(6, requested))
}

const clampCompressionLevel = (level: number) =>
  Math.max(0, Math.min(100, Math.round(level)))

const compressionLevelToScale = (level: number) => {
  const normalisedLevel = clampCompressionLevel(level) / 100
  return Math.max(0.1, 1 - normalisedLevel * 0.9)
}

const pickPreviewPageIndices = (pageCount: number, previewPages: number) => {
  const safePreviewPages = Math.max(1, Math.min(previewPages, pageCount))
  if (safePreviewPages === 1) {
    return [0]
  }

  if (safePreviewPages >= pageCount) {
    return Array.from({ length: pageCount }, (_, index) => index)
  }

  const positions = new Set<number>()
  for (let index = 0; index < safePreviewPages; index++) {
    const ratio = index / (safePreviewPages - 1)
    positions.add(Math.min(pageCount - 1, Math.round(ratio * (pageCount - 1))))
  }

  return Array.from(positions).sort((left, right) => left - right)
}

const buildOutputName = (fileName: string, suffix: string) => {
  const baseName = fileName.replace(/\.pdf$/i, "")
  return `${baseName}${suffix}`
}

const mapWithConcurrency = async <T, R>(
  items: T[],
  concurrency: number,
  mapper: (item: T, index: number) => Promise<R>
) => {
  const limit = Math.max(1, concurrency)
  const results = new Array<R>(items.length)
  let nextIndex = 0

  const runWorker = async () => {
    while (true) {
      const current = nextIndex
      nextIndex += 1
      if (current >= items.length) {
        return
      }

      results[current] = await mapper(items[current], current)
      await waitForUiFrame()
    }
  }

  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, () => runWorker()))
  return results
}

const mergeFilesSequentially = async (files: File[], onProgress?: BatchProgress) => {
  const { PDFDocument } = await getPdfLib()
  const mergedPdf = await PDFDocument.create()

  for (let index = 0; index < files.length; index++) {
    const file = files[index]
    const sourceBytes = new Uint8Array(await file.arrayBuffer())
    const sourcePdf = await PDFDocument.load(sourceBytes, { ignoreEncryption: true })
    const pages = await mergedPdf.copyPages(sourcePdf, sourcePdf.getPageIndices())
    pages.forEach((page) => mergedPdf.addPage(page))

    onProgress?.(
      Math.round(((index + 1) / files.length) * 100),
      `Organising large merge locally: file ${index + 1} of ${files.length}.`
    )
    await waitForUiFrame()
  }

  return await mergedPdf.save({ useObjectStreams: true })
}

const mergeOnMainThread = async (sources: MergeSource[]) => {
  const { PDFDocument } = await getPdfLib()
  const mergedPdf = await PDFDocument.create()
  for (const source of sources) {
    const pdf = await PDFDocument.load(source.buffer, { ignoreEncryption: true })
    const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())
    pages.forEach((page) => mergedPdf.addPage(page))
  }
  return await mergedPdf.save({ useObjectStreams: true })
}

export const shouldUseParallelBatchProcessing = (files: File[]) =>
  files.some((file) => file.size >= LARGE_FILE_THRESHOLD_BYTES)

const hasRenderableImageLayer = async (
  page: {
    getOperatorList: () => Promise<{ fnArray: number[] }>
  },
  ops: PdfJsModule["OPS"]
) => {
  const operatorList = await page.getOperatorList()
  return operatorList.fnArray.some(
    (operation) =>
      operation === ops.paintImageXObject ||
      operation === ops.paintInlineImageXObject ||
      operation === ops.paintImageMaskXObject ||
      operation === ops.paintImageXObjectRepeat ||
      operation === ops.paintInlineImageXObjectGroup
  )
}

const createRenderSurface = (width: number, height: number) => {
  if (typeof OffscreenCanvas !== "undefined") {
    const canvas = new OffscreenCanvas(width, height)
    const context = canvas.getContext("2d")
    if (!context) {
      throw new Error("Could not initialise offscreen canvas for local conversion.")
    }

    return {
      canvas,
      context,
      toBlob: (mimeType: string, quality?: number) =>
        canvas.convertToBlob({ type: mimeType, quality }),
      release: () => undefined,
    }
  }

  if (typeof document === "undefined") {
    throw new Error(
      "Canvas rendering is unavailable in this environment. Please run conversion in a browser context."
    )
  }

  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext("2d")
  if (!context) {
    throw new Error("Could not initialise canvas for local conversion.")
  }

  return {
    canvas,
    context,
    toBlob: (mimeType: string, quality?: number) =>
      new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob)
              return
            }
            reject(new Error("Could not export rendered page to blob."))
          },
          mimeType,
          quality
        )
      }),
    release: () => {
      canvas.width = 0
      canvas.height = 0
    },
  }
}

const extractTextFromPage = async (page: {
  getTextContent: () => Promise<{ items: Array<unknown> }>
}) => {
  const textContent = await page.getTextContent()
  return textContent.items
    .map((item) =>
      typeof item === "object" && item !== null && "str" in item && typeof item.str === "string"
        ? item.str
        : ""
    )
    .join(" ")
    .replace(/\s+/g, " ")
    .trim()
}

export async function convertPdf(
  file: File,
  targetFormat: PdfConversionFormat
): Promise<Blob[]> {
  const format = targetFormat.toLowerCase() as PdfConversionFormat
  if (!["png", "jpg", "text"].includes(format)) {
    throw new Error("Unsupported conversion format. Use 'png', 'jpg', or 'text'.")
  }

  const pdfjs = await getPdfJsModule()
  const sourceBytes = new Uint8Array(await file.arrayBuffer())
  const loadingTask = pdfjs.getDocument({
    data: sourceBytes,
    disableAutoFetch: true,
    disableRange: true,
    disableStream: true,
  })

  try {
    const sourcePdf = await loadingTask.promise

    if (format === "text") {
      const pageTexts: string[] = []
      let imageDetected = false

      for (let pageIndex = 0; pageIndex < sourcePdf.numPages; pageIndex++) {
        const page = await sourcePdf.getPage(pageIndex + 1)
        const text = await extractTextFromPage(page)
        pageTexts.push(text)

        if (!text && !imageDetected) {
          imageDetected = await hasRenderableImageLayer(page, pdfjs.OPS)
        }
      }

      if (pageTexts.some((value) => value.length > 0)) {
        const combinedText = pageTexts
          .map((value, index) => `Page ${index + 1}\n${value}`)
          .join("\n\n")
          .trim()
        return [new Blob([combinedText], { type: "text/plain;charset=utf-8" })]
      }

      if (imageDetected) {
        console.info("[Plain] Image-only PDF detected. Initialising local OCR fallback.")
        const ocrResult = await performLocalOCR(file)
        return [new Blob([ocrResult.extractedText], { type: "text/plain;charset=utf-8" })]
      }

      return [new Blob([""], { type: "text/plain;charset=utf-8" })]
    }

    const mimeType = format === "png" ? "image/png" : "image/jpeg"
    const quality = format === "jpg" ? 0.9 : undefined
    const outputBlobs: Blob[] = []

    for (let pageIndex = 0; pageIndex < sourcePdf.numPages; pageIndex++) {
      const page = await sourcePdf.getPage(pageIndex + 1)
      const viewport = page.getViewport({ scale: 2 })

      const renderSurface = createRenderSurface(
        Math.max(1, Math.ceil(viewport.width)),
        Math.max(1, Math.ceil(viewport.height))
      )

      try {
        await page.render({
          canvas: renderSurface.canvas as unknown as HTMLCanvasElement,
          canvasContext: renderSurface.context as unknown as CanvasRenderingContext2D,
          viewport,
          annotationMode: pdfjs.AnnotationMode.ENABLE,
        }).promise
        outputBlobs.push(await renderSurface.toBlob(mimeType, quality))
      } finally {
        renderSurface.release()
      }
    }

    return outputBlobs
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : `Could not convert PDF file: ${file.name}`
    throw new Error(message)
  } finally {
    await loadingTask.destroy()
  }
}

export async function plainRealTimeCompressionPreviewer(
  file: File,
  level: number,
  options: PlainRealTimeCompressionPreviewerOptions = {}
): Promise<PlainRealTimeCompressionPreviewResult> {
  const webgpuActive = isWebGpuComputeAvailable()
  const normalisedLevel = clampCompressionLevel(level)
  const targetScale = compressionLevelToScale(normalisedLevel)
  const previewMimeType = options.previewMimeType ?? "image/jpeg"
  const previewQuality = previewMimeType === "image/jpeg" ? 0.86 : undefined

  options.onProgress?.(
    2,
    webgpuActive
      ? "Initialising compression preview with WebGPU-ready local acceleration."
      : "Initialising compression preview locally."
  )

  const compressed = await generateCompressionPreview(file, targetScale, (stage) => {
    if (stage === "Initialising Wasm") {
      options.onProgress?.(12, "Initialising Wasm compression pipeline.")
      return
    }
    if (stage === "Optimising Images") {
      options.onProgress?.(55, "Optimising images for preview and final output.")
      return
    }
    options.onProgress?.(68, "Compression stage complete. Preparing visual previews.")
  })

  const originalBytes = new Uint8Array(await file.arrayBuffer())
  const compressedBytes = compressed.bytes
  const pdfjs = await getPdfJsModule()
  const originalTask = pdfjs.getDocument({
    data: originalBytes,
    disableAutoFetch: true,
    disableRange: true,
    disableStream: true,
  })
  const compressedTask = pdfjs.getDocument({
    data: compressedBytes,
    disableAutoFetch: true,
    disableRange: true,
    disableStream: true,
  })

  try {
    const [originalPdf, compressedPdf] = await Promise.all([
      originalTask.promise,
      compressedTask.promise,
    ])

    const comparablePageCount = Math.min(originalPdf.numPages, compressedPdf.numPages)
    if (comparablePageCount === 0) {
      throw new Error("Could not generate previews because the PDF contains no pages.")
    }

    const pageIndices = pickPreviewPageIndices(
      comparablePageCount,
      options.previewPages ?? 3
    )
    const previewPairs: CompressionPreviewPair[] = []

    for (let index = 0; index < pageIndices.length; index++) {
      const pageIndex = pageIndices[index]
      const [originalPage, compressedPage] = await Promise.all([
        originalPdf.getPage(pageIndex + 1),
        compressedPdf.getPage(pageIndex + 1),
      ])

      const originalViewport = originalPage.getViewport({ scale: 1.2 })
      const compressedViewport = compressedPage.getViewport({ scale: 1.2 })

      const originalSurface = createRenderSurface(
        Math.max(1, Math.ceil(originalViewport.width)),
        Math.max(1, Math.ceil(originalViewport.height))
      )
      const compressedSurface = createRenderSurface(
        Math.max(1, Math.ceil(compressedViewport.width)),
        Math.max(1, Math.ceil(compressedViewport.height))
      )

      try {
        await Promise.all([
          originalPage.render({
            canvas: originalSurface.canvas as unknown as HTMLCanvasElement,
            canvasContext: originalSurface.context as unknown as CanvasRenderingContext2D,
            viewport: originalViewport,
            annotationMode: pdfjs.AnnotationMode.ENABLE,
          }).promise,
          compressedPage.render({
            canvas: compressedSurface.canvas as unknown as HTMLCanvasElement,
            canvasContext: compressedSurface.context as unknown as CanvasRenderingContext2D,
            viewport: compressedViewport,
            annotationMode: pdfjs.AnnotationMode.ENABLE,
          }).promise,
        ])

        previewPairs.push({
          pageIndex,
          originalBlob: await originalSurface.toBlob(previewMimeType, previewQuality),
          compressedBlob: await compressedSurface.toBlob(previewMimeType, previewQuality),
        })
      } finally {
        originalSurface.release()
        compressedSurface.release()
      }

      const previewProgress = Math.round(((index + 1) / pageIndices.length) * 30)
      options.onProgress?.(
        70 + previewProgress,
        `Rendering side-by-side preview ${index + 1} of ${pageIndices.length}.`
      )
      await waitForUiFrame()
    }

    const originalSizeBytes = file.size
    const compressedSizeBytes = compressedBytes.byteLength
    const savingsPercent =
      originalSizeBytes > 0
        ? Math.max(0, ((originalSizeBytes - compressedSizeBytes) / originalSizeBytes) * 100)
        : 0

    options.onProgress?.(100, "Complete. Real-time compression preview is ready.")

    return {
      level: normalisedLevel,
      scale: targetScale,
      previewPairs,
      compressedBytes,
      originalSizeBytes,
      compressedSizeBytes,
      savingsPercent,
      webgpuActive,
    }
  } finally {
    await originalTask.destroy()
    await compressedTask.destroy()
  }
}

export async function mergePdfs(files: File[]): Promise<Uint8Array> {
  if (!files.length) {
    throw new Error("No PDF files were provided for merging.")
  }

  const { PDFDocument } = await getPdfLib()
  const loadedSources = await Promise.all(
    files.map(async (file) => {
      const bytes = new Uint8Array(await file.arrayBuffer())

      try {
        const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true })
        return { file, pdf }
      } catch {
        throw new Error(`Invalid PDF file: ${file.name}`)
      }
    })
  )

  const shouldUseWorker =
    files.length > 1 &&
    shouldUseParallelBatchProcessing(files) &&
    typeof Worker !== "undefined"

  if (shouldUseWorker) {
    try {
      return await mergeFilesWithBatchEngine(files)
    } catch (error) {
      console.warn(
        "[Plain] Parallel merge acceleration was unavailable. Falling back to local merge."
      )
      console.warn(error)
    }
  }

  const mergedPdf = await PDFDocument.create()

  for (const source of loadedSources) {
    const pages = await mergedPdf.copyPages(source.pdf, source.pdf.getPageIndices())
    pages.forEach((page) => mergedPdf.addPage(page))
  }

  return await mergedPdf.save({ useObjectStreams: true })
}

const isValidPageNumber = (value: number) =>
  Number.isInteger(value) && value > 0

const expandRangeToPages = (range: PdfPageRange) => {
  const pages: number[] = []
  for (let page = range.start; page <= range.end; page++) {
    pages.push(page)
  }
  return pages
}

export async function splitPdf(
  file: File,
  pageRanges: PdfPageRange[]
): Promise<Uint8Array[]> {
  if (!pageRanges.length) {
    throw new Error("No page ranges were provided for splitting.")
  }

  const { PDFDocument } = await getPdfLib()
  const sourceBytes = new Uint8Array(await file.arrayBuffer())
  let sourcePdf: import("pdf-lib").PDFDocument
  try {
    sourcePdf = await PDFDocument.load(sourceBytes, { ignoreEncryption: true })
  } catch {
    throw new Error(`Invalid PDF file: ${file.name}`)
  }

  const pageCount = sourcePdf.getPageCount()
  const expandedRanges = pageRanges.map((range, index) => {
    if (!isValidPageNumber(range.start) || !isValidPageNumber(range.end)) {
      throw new Error(
        `Invalid page range at index ${index}. Page numbers must be whole numbers starting from 1.`
      )
    }

    if (range.start > range.end) {
      throw new Error(
        `Invalid page range at index ${index}. Start page cannot be greater than end page.`
      )
    }

    if (range.end > pageCount) {
      throw new Error(
        `Page range ${range.start}-${range.end} is out of range. This document has ${pageCount} page(s).`
      )
    }

    return expandRangeToPages(range)
  })

  const shouldUseWorker =
    shouldUseParallelBatchProcessing([file]) && typeof Worker !== "undefined"

  if (shouldUseWorker) {
    try {
      const outputs = await splitFilesWithBatchEngine(
        [file],
        { mode: "ranges", ranges: expandedRanges }
      )
      return outputs.map((output) => output.bytes)
    } catch (error) {
      console.warn(
        "[Plain] Parallel split acceleration was unavailable. Falling back to local split."
      )
      console.warn(error)
    }
  }

  const splitOutputs: Uint8Array[] = []
  for (const pagesInRange of expandedRanges) {
    const outputPdf = await PDFDocument.create()
    const copiedPages = await outputPdf.copyPages(
      sourcePdf,
      pagesInRange.map((page) => page - 1)
    )
    copiedPages.forEach((page) => outputPdf.addPage(page))
    splitOutputs.push(await outputPdf.save({ useObjectStreams: true }))
  }

  return splitOutputs
}

export async function mergeFilesWithBatchEngine(
  files: File[],
  onProgress?: BatchProgress
) {
  const sources = await Promise.all(
    files.map(async (file) => ({
      name: file.name,
      buffer: toArrayBuffer(await file.arrayBuffer()),
    }))
  )

  const shouldAccelerate = shouldUseParallelBatchProcessing(files) && sources.length > 1

  if (!shouldAccelerate) {
    onProgress?.(100, "Organising merge locally without acceleration.")
    return await mergeOnMainThread(sources)
  }

  const workerCount = Math.min(
    Math.max(2, Math.floor((navigator.hardwareConcurrency || 4) / 2)),
    sources.length
  )

  const chunks = splitIntoChunks(sources, workerCount)
  let completedChunks = 0

  const partialResults = await Promise.all(
    chunks.map((chunk) =>
      runMergeChunkInWorker(chunk, (chunkProgress) => {
        const aggregate = (completedChunks + chunkProgress / 100) / chunks.length
        onProgress?.(
          Math.round(aggregate * 100),
          "Accelerating merge with parallel workers."
        )
      }).then((result) => {
        completedChunks += 1
        onProgress?.(
          Math.round((completedChunks / chunks.length) * 100),
          "Organising merged chunks for final output."
        )
        return result
      })
    )
  )

  const finalMergeInputs = partialResults.map((result, index) => ({
    name: `chunk-${index + 1}.pdf`,
    buffer: bytesToTransferableBuffer(result),
  }))

  const finalBytes = await runMergeChunkInWorker(finalMergeInputs, (progress) => {
    onProgress?.(
      progress,
      "Accelerating final merge composition in local worker."
    )
  })

  onProgress?.(100, "Complete. Parallel merge finished locally.")
  return finalBytes
}

export async function splitFilesWithBatchEngine(
  files: File[],
  options: BatchSplitOptions,
  onProgress?: BatchProgress
): Promise<BatchSplitOutput[]> {
  const shouldAccelerate = shouldUseParallelBatchProcessing(files)

  const runSplitForFile = (file: File, fileIndex: number) =>
    new Promise<BatchSplitOutput[]>((resolve, reject) => {
      const worker = createBatchWorker()
      const requestId = crypto.randomUUID()

      const handleMessage = (event: MessageEvent<WorkerMessage>) => {
        const message = event.data
        if (!message || message.requestId !== requestId) {
          return
        }

        if (message.type === "progress") {
          const overall = Math.round(
            ((fileIndex + message.progress / 100) / files.length) * 100
          )
          onProgress?.(
            overall,
            shouldAccelerate
              ? "Accelerating split operation in parallel worker."
              : "Organising split output locally."
          )
          return
        }

        worker.removeEventListener("message", handleMessage)
        worker.terminate()

        if (message.type === "error") {
          reject(new Error(message.error))
          return
        }

        if (message.type === "splitSuccess") {
          resolve(
            message.outputs.map((output) => ({
              sourceFileName: file.name,
              name: output.name,
              bytes: new Uint8Array(output.buffer),
              pageCount: output.pageCount,
              pageRange: output.pageRange,
            }))
          )
        }
      }

      worker.addEventListener("message", handleMessage)
      worker.addEventListener("error", (event) => {
        worker.removeEventListener("message", handleMessage)
        worker.terminate()
        reject(new Error(event.message || "Parallel split worker failed to start."))
      })

      file.arrayBuffer().then((buffer) => {
        worker.postMessage(
          {
            type: "splitFile",
            requestId,
            fileName: file.name,
            buffer,
            mode: options.mode,
            selectedPages: options.selectedPages,
            ranges: options.ranges,
          },
          [buffer]
        )
      }).catch((error) => {
        worker.terminate()
        reject(error)
      })
    })

  const outputsPerFile = await Promise.all(
    files.map((file, index) => runSplitForFile(file, index))
  )

  onProgress?.(100, "Complete. Split output generated locally.")
  return outputsPerFile.flat()
}

export async function plainHardwareAcceleratedBatch(
  files: File[],
  options: PlainHardwareAcceleratedBatchOptions
): Promise<PlainHardwareAcceleratedBatchResult[]> {
  if (!files.length) {
    throw new Error("No input files were provided for batch processing.")
  }

  const onProgress = options.onProgress
  const totalInputBytes = sumFileSizes(files)
  const webgpuActive = isWebGpuComputeAvailable()
  const baseParallelism = webgpuActive
    ? Math.max(2, Math.floor((navigator.hardwareConcurrency || 4) / 2))
    : 1
  const parallelism = clampParallelism(options.maxParallelFiles ?? baseParallelism)

  if (totalInputBytes > TWO_GB_BYTES) {
    console.info(
      "[Plain] Large batch detected (>2GB). Switching to chunk-aware local processing."
    )
  }

  if (options.mode === "merge") {
    const canUseWorkerAcceleration =
      files.length > 1 &&
      typeof Worker !== "undefined" &&
      shouldUseParallelBatchProcessing(files) &&
      totalInputBytes <= TWO_GB_BYTES

    let bytes: Uint8Array
    let workerAccelerated = false

    if (canUseWorkerAcceleration) {
      try {
        workerAccelerated = true
        bytes = await mergeFilesWithBatchEngine(files, (progress, status) => {
          onProgress?.(progress, status)
        })
      } catch (error) {
        workerAccelerated = false
        console.warn(
          "[Plain] Worker merge acceleration was unavailable. Falling back to chunk-aware local merge."
        )
        console.warn(error)
        bytes = await mergeFilesSequentially(files, onProgress)
      }
    } else {
      bytes = await mergeFilesSequentially(files, onProgress)
    }

    onProgress?.(100, "Complete. Batch merge finished locally.")

    return [
      {
        mode: "merge",
        sourceNames: files.map((file) => file.name),
        outputName: "plain-batch-merged.pdf",
        bytes,
        webgpuActive,
        workerAccelerated,
        inputBytes: totalInputBytes,
        outputBytes: bytes.byteLength,
        status: "Complete",
      },
    ]
  }

  if (options.mode === "split") {
    const splitMode = options.splitMode ?? "individual"
    const splitRanges =
      splitMode === "ranges"
        ? (options.splitRanges ?? []).map((range) => {
            const pages: number[] = []
            for (let page = range.start; page <= range.end; page++) {
              pages.push(page)
            }
            return pages
          })
        : undefined

    const splitOutputs = await splitFilesWithBatchEngine(
      files,
      {
        mode: splitMode,
        selectedPages: options.selectedPages,
        ranges: splitRanges,
      },
      (progress, status) => {
        onProgress?.(progress, status)
      }
    )

    const grouped = new Map<string, BatchSplitOutput[]>()
    splitOutputs.forEach((item) => {
      const existing = grouped.get(item.sourceFileName) ?? []
      existing.push(item)
      grouped.set(item.sourceFileName, existing)
    })

    const results = Array.from(grouped.entries()).map(([sourceName, outputs]) => {
      const splitBytes = outputs.map((output) => output.bytes)
      const outputBytes = splitBytes.reduce((total, bytes) => total + bytes.byteLength, 0)

      return {
        mode: "split" as const,
        sourceNames: [sourceName],
        outputName: buildOutputName(sourceName, "-split-batch.zip"),
        splitOutputs: splitBytes,
        webgpuActive,
        workerAccelerated: typeof Worker !== "undefined",
        inputBytes: files.find((file) => file.name === sourceName)?.size ?? 0,
        outputBytes,
        status: "Complete",
      }
    })

    onProgress?.(100, "Complete. Batch split finished locally.")
    return results
  }

  if (options.mode === "compress") {
    const compressionScale = Math.min(1, Math.max(0.1, options.compressionScale ?? 0.82))
    let completed = 0

    const results = await mapWithConcurrency(files, parallelism, async (file) => {
      const compressed = await generateCompressionPreview(file, compressionScale)
      completed += 1
      onProgress?.(
        Math.round((completed / files.length) * 100),
        `Optimising batch compression locally: file ${completed} of ${files.length}.`
      )

      return {
        mode: "compress" as const,
        sourceNames: [file.name],
        outputName: buildOutputName(file.name, "-compressed.pdf"),
        bytes: compressed.bytes,
        webgpuActive,
        workerAccelerated: false,
        inputBytes: file.size,
        outputBytes: compressed.bytes.byteLength,
        status: "Complete",
      }
    })

    onProgress?.(100, "Complete. Batch compression finished locally.")
    return results
  }

  const conversionFormat = options.conversionFormat ?? "png"
  let completed = 0

  const convertResults = await mapWithConcurrency(files, parallelism, async (file) => {
    const blobs = await convertPdf(file, conversionFormat)
    const outputBytes = blobs.reduce((total, blob) => total + blob.size, 0)
    completed += 1
    onProgress?.(
      Math.round((completed / files.length) * 100),
      `Organising batch conversion locally: file ${completed} of ${files.length}.`
    )

    return {
      mode: "convert" as const,
      sourceNames: [file.name],
      outputName: buildOutputName(file.name, `-converted.${conversionFormat}`),
      blobs,
      webgpuActive,
      workerAccelerated: false,
      inputBytes: file.size,
      outputBytes,
      status: "Complete",
    }
  })

  onProgress?.(100, "Complete. Batch conversion finished locally.")
  return convertResults
}

export async function performLocalOCR(
  file: File,
  onProgress?: BatchProgress
): Promise<OcrOutput> {
  const worker = createBatchWorker()
  const requestId = crypto.randomUUID()

  return new Promise((resolve, reject) => {
    const handleMessage = (event: MessageEvent<WorkerMessage>) => {
      const message = event.data
      if (!message || message.requestId !== requestId) {
        return
      }

      if (message.type === "progress") {
        onProgress?.(message.progress, message.status)
        return
      }

      worker.removeEventListener("message", handleMessage)
      worker.terminate()

      if (message.type === "error") {
        reject(new Error(message.error))
        return
      }

      if (message.type === "ocrSuccess") {
        resolve({
          name: message.name,
          bytes: new Uint8Array(message.buffer),
          extractedText: message.extractedText,
          pageCount: message.pageCount,
        })
      }
    }

    worker.addEventListener("message", handleMessage)
    worker.addEventListener("error", (event) => {
      worker.removeEventListener("message", handleMessage)
      worker.terminate()
      reject(new Error(event.message || "Local OCR worker failed to start."))
    })

    worker.postMessage({
      type: "performLocalOCR",
      requestId,
      file,
    })
  })
}

export async function plainOfflineOCR(
  file: File,
  onProgress?: BatchProgress
): Promise<Uint8Array> {
  const webgpuActive = isWebGpuComputeAvailable()
  onProgress?.(
    1,
    webgpuActive
      ? "Initialising OCR with WebGPU-ready local acceleration."
      : "Initialising OCR locally."
  )

  const output = await performLocalOCR(file, (progress, status) => {
    onProgress?.(Math.min(99, Math.max(2, progress)), status)
  })

  onProgress?.(
    100,
    "Complete. OCR searchable PDF generated locally with no uploads."
  )
  return output.bytes
}

export async function plainOfflineOCRBatch(
  files: File[],
  options: PlainOfflineOcrBatchOptions = {}
): Promise<PlainOfflineOcrBatchResult[]> {
  if (!files.length) {
    throw new Error("No files were provided for local OCR batch processing.")
  }

  const webgpuActive = isWebGpuComputeAvailable()
  const baseParallelism = webgpuActive
    ? Math.max(2, Math.floor((navigator.hardwareConcurrency || 4) / 2))
    : 1
  const parallelism = clampParallelism(options.maxParallelFiles ?? baseParallelism)
  let completed = 0

  options.onProgress?.(
    1,
    webgpuActive
      ? "Initialising batch OCR with WebGPU-ready local acceleration."
      : "Initialising batch OCR locally."
  )

  const results = await mapWithConcurrency(files, parallelism, async (file, index) => {
    const output = await performLocalOCR(file, (fileProgress) => {
      const overall =
        ((index + fileProgress / 100) / files.length) * 100
      options.onProgress?.(
        Math.max(2, Math.min(99, Math.round(overall))),
        `Optimising OCR batch locally: file ${index + 1} of ${files.length}.`
      )
    })

    completed += 1
    options.onProgress?.(
      Math.max(2, Math.min(99, Math.round((completed / files.length) * 100))),
      `Organising OCR output locally: file ${completed} of ${files.length}.`
    )

    return {
      sourceName: file.name,
      outputName: output.name,
      bytes: output.bytes,
      extractedText: output.extractedText,
      pageCount: output.pageCount,
      webgpuActive,
    }
  })

  options.onProgress?.(100, "Complete. Batch OCR finished locally with no uploads.")
  return results
}
