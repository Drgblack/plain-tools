/// <reference lib="webworker" />

import { PDFDocument } from "pdf-lib"
import * as pdfjs from "pdfjs-dist/legacy/build/pdf.mjs"

import { generateCompressionPreview } from "@/lib/compression-engine"

if (!pdfjs.GlobalWorkerOptions.workerSrc) {
  pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.js"
}

type Operation = "merge" | "compress" | "split" | "convert"
type SplitRule = "every-n" | "at-pages"
type ConvertFormat = "png" | "jpeg"

type MergeRequest = {
  type: "merge-files"
  requestId: string
  files: Array<{ name: string; buffer: ArrayBuffer }>
}

type FileProcessRequest = {
  type: "process-file"
  requestId: string
  operation: Exclude<Operation, "merge">
  fileName: string
  buffer: ArrayBuffer
  options?: {
    compressionScale?: number
    splitRule?: SplitRule
    splitEveryN?: number
    splitAtPages?: number[]
    convertFormat?: ConvertFormat
    convertDpi?: 72 | 150 | 300
  }
}

type WorkerRequest = MergeRequest | FileProcessRequest

type WorkerProgress = {
  type: "progress"
  requestId: string
  progress: number
  status: string
}

type WorkerMergeProgress = {
  type: "merge-progress"
  requestId: string
  currentFileIndex: number
  totalFiles: number
  progress: number
  status: string
}

type WorkerFileSuccess = {
  type: "file-success"
  requestId: string
  fileName: string
  outputBytes: number
  outputs: Array<{
    name: string
    mimeType: string
    buffer: ArrayBuffer
  }>
}

type WorkerMergeSuccess = {
  type: "merge-success"
  requestId: string
  output: {
    name: string
    mimeType: "application/pdf"
    buffer: ArrayBuffer
  }
  outputBytes: number
}

type WorkerError = {
  type: "error"
  requestId: string
  error: string
}

const workerScope = self as DedicatedWorkerGlobalScope

const toArrayBuffer = (bytes: Uint8Array) =>
  bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer

const isPositiveInt = (value: number) => Number.isInteger(value) && value > 0

const splitByEveryN = (pageCount: number, everyN: number) => {
  const ranges: Array<{ start: number; end: number }> = []
  for (let start = 1; start <= pageCount; start += everyN) {
    ranges.push({
      start,
      end: Math.min(pageCount, start + everyN - 1),
    })
  }
  return ranges
}

const splitBySpecificStarts = (pageCount: number, starts: number[]) => {
  const validStarts = Array.from(new Set(starts.filter((value) => isPositiveInt(value))))
    .filter((value) => value <= pageCount)
    .sort((left, right) => left - right)

  if (!validStarts.includes(1)) {
    validStarts.unshift(1)
  }

  const ranges: Array<{ start: number; end: number }> = []
  for (let index = 0; index < validStarts.length; index += 1) {
    const start = validStarts[index] ?? 1
    const nextStart = validStarts[index + 1]
    ranges.push({
      start,
      end: nextStart ? nextStart - 1 : pageCount,
    })
  }

  return ranges.filter((range) => range.start <= range.end)
}

const postProgress = (requestId: string, progress: number, status: string) => {
  const payload: WorkerProgress = {
    type: "progress",
    requestId,
    progress,
    status,
  }
  workerScope.postMessage(payload)
}

const postMergeProgress = (
  requestId: string,
  currentFileIndex: number,
  totalFiles: number,
  progress: number,
  status: string
) => {
  const payload: WorkerMergeProgress = {
    type: "merge-progress",
    requestId,
    currentFileIndex,
    totalFiles,
    progress,
    status,
  }
  workerScope.postMessage(payload)
}

const processMerge = async (request: MergeRequest) => {
  const outputPdf = await PDFDocument.create()

  for (let index = 0; index < request.files.length; index += 1) {
    const file = request.files[index]
    if (!file) continue
    const sourcePdf = await PDFDocument.load(file.buffer, { ignoreEncryption: true })
    const pages = await outputPdf.copyPages(sourcePdf, sourcePdf.getPageIndices())
    pages.forEach((page) => outputPdf.addPage(page))

    const progress = Math.round(((index + 1) / request.files.length) * 100)
    postMergeProgress(
      request.requestId,
      index,
      request.files.length,
      progress,
      `Merging ${index + 1} of ${request.files.length} files in worker.`
    )
  }

  const bytes = await outputPdf.save({ useObjectStreams: true })
  const mergeSuccess: WorkerMergeSuccess = {
    type: "merge-success",
    requestId: request.requestId,
    output: {
      name: "plain-batch-merged.pdf",
      mimeType: "application/pdf",
      buffer: toArrayBuffer(bytes),
    },
    outputBytes: bytes.byteLength,
  }

  workerScope.postMessage(mergeSuccess, [mergeSuccess.output.buffer])
}

const processCompress = async (request: FileProcessRequest) => {
  const scale = Math.max(0.1, Math.min(1, request.options?.compressionScale ?? 0.82))
  const file = new File([request.buffer], request.fileName, { type: "application/pdf" })

  postProgress(request.requestId, 6, "Initialising local compression in worker.")
  const compressed = await generateCompressionPreview(file, scale, (stage, message) => {
    if (stage === "Initialising Wasm") {
      postProgress(request.requestId, 20, message)
      return
    }
    if (stage === "Optimising Images") {
      postProgress(request.requestId, 68, message)
      return
    }
    postProgress(request.requestId, 95, message)
  })

  const bytes = compressed.bytes
  const baseName = request.fileName.replace(/\.pdf$/i, "")

  const success: WorkerFileSuccess = {
    type: "file-success",
    requestId: request.requestId,
    fileName: request.fileName,
    outputBytes: bytes.byteLength,
    outputs: [
      {
        name: `${baseName}-compressed.pdf`,
        mimeType: "application/pdf",
        buffer: toArrayBuffer(bytes),
      },
    ],
  }

  workerScope.postMessage(success, success.outputs.map((output) => output.buffer))
}

const processSplit = async (request: FileProcessRequest) => {
  const sourcePdf = await PDFDocument.load(request.buffer, { ignoreEncryption: true })
  const pageCount = sourcePdf.getPageCount()
  const rule = request.options?.splitRule ?? "every-n"
  const baseName = request.fileName.replace(/\.pdf$/i, "")

  const ranges =
    rule === "at-pages"
      ? splitBySpecificStarts(pageCount, request.options?.splitAtPages ?? [])
      : splitByEveryN(pageCount, Math.max(1, request.options?.splitEveryN ?? 1))

  if (!ranges.length) {
    throw new Error("No valid split ranges could be created for this file.")
  }

  const outputs: WorkerFileSuccess["outputs"] = []
  for (let index = 0; index < ranges.length; index += 1) {
    const range = ranges[index]
    if (!range) continue

    const outputPdf = await PDFDocument.create()
    const pagesToCopy: number[] = []
    for (let page = range.start; page <= range.end; page += 1) {
      pagesToCopy.push(page - 1)
    }
    const copied = await outputPdf.copyPages(sourcePdf, pagesToCopy)
    copied.forEach((page) => outputPdf.addPage(page))

    const bytes = await outputPdf.save({ useObjectStreams: true })
    const fileLabel =
      range.start === range.end
        ? `${baseName}-page-${range.start}.pdf`
        : `${baseName}-pages-${range.start}-${range.end}.pdf`
    outputs.push({
      name: fileLabel,
      mimeType: "application/pdf",
      buffer: toArrayBuffer(bytes),
    })

    const progress = Math.round(((index + 1) / ranges.length) * 100)
    postProgress(
      request.requestId,
      progress,
      `Splitting range ${index + 1} of ${ranges.length} in worker.`
    )
  }

  const outputBytes = outputs.reduce((total, output) => total + output.buffer.byteLength, 0)
  const success: WorkerFileSuccess = {
    type: "file-success",
    requestId: request.requestId,
    fileName: request.fileName,
    outputBytes,
    outputs,
  }

  workerScope.postMessage(success, outputs.map((output) => output.buffer))
}

const renderPageBlob = async (
  page: Awaited<ReturnType<Awaited<ReturnType<typeof pdfjs.getDocument>["promise"]>["getPage"]>>,
  mimeType: "image/png" | "image/jpeg",
  scale: number
) => {
  const viewport = page.getViewport({ scale })
  const canvas = new OffscreenCanvas(
    Math.max(1, Math.ceil(viewport.width)),
    Math.max(1, Math.ceil(viewport.height))
  )
  const context = canvas.getContext("2d")
  if (!context) {
    throw new Error("Could not create worker canvas context.")
  }

  await page.render({
    canvas: canvas as unknown as HTMLCanvasElement,
    canvasContext: context as unknown as CanvasRenderingContext2D,
    viewport,
    annotationMode: pdfjs.AnnotationMode.ENABLE,
  }).promise

  return await canvas.convertToBlob({
    type: mimeType,
    quality: mimeType === "image/jpeg" ? 0.88 : undefined,
  })
}

const processConvert = async (request: FileProcessRequest) => {
  const format = request.options?.convertFormat ?? "png"
  const mimeType = format === "jpeg" ? "image/jpeg" : "image/png"
  const extension = format === "jpeg" ? "jpg" : "png"
  const dpi = request.options?.convertDpi ?? 150
  const scale = dpi / 72
  const baseName = request.fileName.replace(/\.pdf$/i, "")

  const loadingTask = pdfjs.getDocument({
    data: new Uint8Array(request.buffer),
    disableAutoFetch: true,
    disableRange: true,
    disableStream: true,
  })

  try {
    const sourcePdf = await loadingTask.promise
    const outputs: WorkerFileSuccess["outputs"] = []

    for (let pageIndex = 0; pageIndex < sourcePdf.numPages; pageIndex += 1) {
      const page = await sourcePdf.getPage(pageIndex + 1)
      const blob = await renderPageBlob(page, mimeType, scale)
      const buffer = await blob.arrayBuffer()
      outputs.push({
        name: `${baseName}-page-${String(pageIndex + 1).padStart(3, "0")}.${extension}`,
        mimeType,
        buffer,
      })

      const progress = Math.round(((pageIndex + 1) / sourcePdf.numPages) * 100)
      postProgress(
        request.requestId,
        progress,
        `Converting page ${pageIndex + 1} of ${sourcePdf.numPages} in worker.`
      )
    }

    const outputBytes = outputs.reduce((total, output) => total + output.buffer.byteLength, 0)
    const success: WorkerFileSuccess = {
      type: "file-success",
      requestId: request.requestId,
      fileName: request.fileName,
      outputBytes,
      outputs,
    }

    workerScope.postMessage(success, outputs.map((output) => output.buffer))
  } finally {
    await loadingTask.destroy()
  }
}

workerScope.onmessage = async (event: MessageEvent<WorkerRequest>) => {
  const request = event.data

  try {
    if (request.type === "merge-files") {
      await processMerge(request)
      return
    }

    if (request.operation === "compress") {
      await processCompress(request)
      return
    }

    if (request.operation === "split") {
      await processSplit(request)
      return
    }

    if (request.operation === "convert") {
      await processConvert(request)
      return
    }
  } catch (error) {
    const payload: WorkerError = {
      type: "error",
      requestId: request.requestId,
      error:
        error instanceof Error
          ? error.message
          : "Batch operation failed inside worker.",
    }
    workerScope.postMessage(payload)
  }
}
