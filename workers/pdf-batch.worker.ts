import { PDFDocument } from "pdf-lib"

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

type WorkerRequest = MergeChunkRequest | SplitRequest

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

type WorkerErrorMessage = {
  type: "error"
  requestId: string
  error: string
}

const workerScope = self as DedicatedWorkerGlobalScope

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
    mergedBuffer: mergedBytes.buffer.slice(
      mergedBytes.byteOffset,
      mergedBytes.byteOffset + mergedBytes.byteLength
    ),
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
      buffer: bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength),
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
        buffer: bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength),
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
        buffer: bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength),
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
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Local batch processing failed in the worker."
    sendError(request.requestId, errorMessage)
  }
}
