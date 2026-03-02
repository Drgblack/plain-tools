"use client"

import { PDFDocument } from "pdf-lib"

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

type BatchProgress = (progress: number, status: string) => void

const createBatchWorker = () =>
  new Worker(new URL("../workers/pdf-batch.worker.ts", import.meta.url), {
    type: "module",
  })

const bytesToTransferableBuffer = (bytes: Uint8Array) =>
  bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength)

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

const mergeOnMainThread = async (sources: MergeSource[]) => {
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

export async function mergeFilesWithBatchEngine(
  files: File[],
  onProgress?: BatchProgress
) {
  const sources = await Promise.all(
    files.map(async (file) => ({
      name: file.name,
      buffer: await file.arrayBuffer(),
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
