"use client"

import { zipSync } from "fflate"
import { Download, Loader2, Trash2, UploadCloud } from "lucide-react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { toast, Toaster } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ProcessedLocallyBadge } from "@/components/tools/processed-locally-badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { notifyLocalDownloadSuccess } from "@/lib/local-download-events"

type BatchOperation = "merge" | "compress" | "split" | "convert"
type QueueStatus = "queued" | "processing" | "done" | "error"
type SplitRule = "every-n" | "at-pages"
type ConvertFormat = "png" | "jpeg"

type QueueItem = {
  id: string
  fileName: string
  inputBytes: number
  status: QueueStatus
  progress: number
  statusText: string
  outputBytes?: number
  outputCount?: number
  error?: string
  downloadUrl?: string
  downloadName?: string
}

type OutputEntry = {
  name: string
  bytes: Uint8Array
}

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

type WorkerMessage =
  | WorkerProgress
  | WorkerMergeProgress
  | WorkerFileSuccess
  | WorkerMergeSuccess
  | WorkerError

type Job = {
  queueId: string
  file: File
}

const MAX_FILES = 20

const isPdfFile = (file: File) =>
  file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")

const formatBytes = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`
  const kb = bytes / 1024
  if (kb < 1024) return `${kb.toFixed(1)} KB`
  const mb = kb / 1024
  if (mb < 1024) return `${mb.toFixed(2)} MB`
  const gb = mb / 1024
  return `${gb.toFixed(2)} GB`
}

const statusVariant = (status: QueueStatus): "secondary" | "outline" | "default" | "destructive" => {
  if (status === "done") return "default"
  if (status === "processing") return "secondary"
  if (status === "error") return "destructive"
  return "outline"
}

const compressionScaleFromLevel = (level: number) => {
  const normalised = Math.max(0, Math.min(100, level)) / 100
  return Math.max(0.1, 1 - normalised * 0.9)
}

const createWorker = () =>
  new Worker(new URL("../../workers/batch-processor.worker.ts", import.meta.url), {
    type: "module",
  })

const parseSplitAtPages = (input: string) => {
  return Array.from(
    new Set(
      input
        .split(",")
        .map((part) => Number.parseInt(part.trim(), 10))
        .filter((value) => Number.isInteger(value) && value > 0)
    )
  ).sort((left, right) => left - right)
}

export default function BatchEngineTool() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const activeWorkersRef = useRef<Worker[]>([])
  const allObjectUrlsRef = useRef<string[]>([])

  const [files, setFiles] = useState<File[]>([])
  const [queue, setQueue] = useState<QueueItem[]>([])
  const [operation, setOperation] = useState<BatchOperation>("merge")
  const [splitRule, setSplitRule] = useState<SplitRule>("every-n")
  const [splitEveryN, setSplitEveryN] = useState(1)
  const [splitAtPagesText, setSplitAtPagesText] = useState("2,4")
  const [compressionLevel, setCompressionLevel] = useState(60)
  const [convertFormat, setConvertFormat] = useState<ConvertFormat>("png")
  const [convertDpi, setConvertDpi] = useState<72 | 150 | 300>(150)
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [overallStatus, setOverallStatus] = useState("Upload up to 20 PDFs to start batch processing.")
  const [allOutputs, setAllOutputs] = useState<OutputEntry[]>([])
  const [allZipUrl, setAllZipUrl] = useState<string | null>(null)
  const [allZipName, setAllZipName] = useState("plain-batch-results.zip")

  const overallProgress = useMemo(() => {
    if (queue.length === 0) return 0
    const sum = queue.reduce((total, item) => total + item.progress, 0)
    return Math.round(sum / queue.length)
  }, [queue])

  const canStart = files.length > 0 && !isProcessing

  const revokeAllUrls = useCallback(() => {
    for (const url of allObjectUrlsRef.current) {
      URL.revokeObjectURL(url)
    }
    allObjectUrlsRef.current = []
    setAllZipUrl(null)
    setQueue((previous) =>
      previous.map((item) => ({
        ...item,
        downloadUrl: undefined,
      }))
    )
  }, [])

  useEffect(() => {
    return () => {
      for (const worker of activeWorkersRef.current) {
        worker.terminate()
      }
      activeWorkersRef.current = []
      for (const url of allObjectUrlsRef.current) {
        URL.revokeObjectURL(url)
      }
      allObjectUrlsRef.current = []
    }
  }, [])

  const applyQueuePatch = useCallback((queueId: string, patch: Partial<QueueItem>) => {
    setQueue((previous) =>
      previous.map((item) => (item.id === queueId ? { ...item, ...patch } : item))
    )
  }, [])

  const createDownloadUrl = useCallback((blob: Blob) => {
    const url = URL.createObjectURL(blob)
    allObjectUrlsRef.current.push(url)
    return url
  }, [])

  const createSingleOrZipDownload = useCallback(
    (outputs: OutputEntry[], baseName: string) => {
      if (outputs.length === 1) {
        const single = outputs[0]
        if (!single) {
          throw new Error("Missing output file.")
        }
        const mimeType = single.name.toLowerCase().endsWith(".pdf")
          ? "application/pdf"
          : single.name.toLowerCase().endsWith(".jpg") || single.name.toLowerCase().endsWith(".jpeg")
            ? "image/jpeg"
            : "image/png"
        const blob = new Blob([single.bytes], { type: mimeType })
        return {
          name: single.name,
          url: createDownloadUrl(blob),
        }
      }

      const zipEntries: Record<string, Uint8Array> = {}
      for (const output of outputs) {
        zipEntries[output.name] = output.bytes
      }
      const zipBytes = zipSync(zipEntries, { level: 6 })
      const zipName = `${baseName}.zip`
      const blob = new Blob([zipBytes], { type: "application/zip" })
      return {
        name: zipName,
        url: createDownloadUrl(blob),
      }
    },
    [createDownloadUrl]
  )

  const handleIncomingFiles = useCallback((incoming: FileList | File[]) => {
    const picked = Array.from(incoming).filter(isPdfFile)
    if (!picked.length) {
      toast.error("Only PDF files are supported.")
      return
    }

    const merged = [...files, ...picked].slice(0, MAX_FILES)
    if (files.length + picked.length > MAX_FILES) {
      toast.message(`Only the first ${MAX_FILES} files are kept.`)
    }

    setFiles(merged)
    setQueue(
      merged.map((file) => ({
        id: crypto.randomUUID(),
        fileName: file.name,
        inputBytes: file.size,
        status: "queued",
        progress: 0,
        statusText: "Queued",
      }))
    )
    setAllOutputs([])
    revokeAllUrls()
    setOverallStatus("Files queued. Select an operation and run batch processing.")
  }, [files, revokeAllUrls])

  const runMergeOperation = useCallback(async () => {
    if (!files.length || !queue.length) return

    const worker = createWorker()
    activeWorkersRef.current.push(worker)
    const requestId = crypto.randomUUID()

    const filesPayload = await Promise.all(
      files.map(async (file) => ({
        name: file.name,
        buffer: await file.arrayBuffer(),
      }))
    )

    return await new Promise<void>((resolve, reject) => {
      const onMessage = (event: MessageEvent<WorkerMessage>) => {
        const message = event.data
        if (!message || message.requestId !== requestId) return

        if (message.type === "merge-progress") {
          setOverallStatus(message.status)
          setQueue((previous) =>
            previous.map((item, index) => {
              if (index < message.currentFileIndex) {
                return { ...item, status: "done", progress: 100, statusText: "Merged" }
              }
              if (index === message.currentFileIndex) {
                return {
                  ...item,
                  status: "processing",
                  progress: message.progress,
                  statusText: "Merging",
                }
              }
              return { ...item, status: "queued", progress: 0, statusText: "Queued" }
            })
          )
          return
        }

        if (message.type === "merge-success") {
          const bytes = new Uint8Array(message.output.buffer)
          const mergedOutput: OutputEntry = {
            name: message.output.name,
            bytes,
          }
          const perItemDownload = createSingleOrZipDownload([mergedOutput], "plain-batch-merged")

          setAllOutputs([mergedOutput])
          setQueue((previous) =>
            previous.map((item) => ({
              ...item,
              status: "done",
              progress: 100,
              statusText: "Merged",
              outputBytes: message.outputBytes,
              outputCount: 1,
              downloadName: perItemDownload.name,
              downloadUrl: perItemDownload.url,
            }))
          )
          setOverallStatus("Batch merge complete.")
          cleanup()
          resolve()
          return
        }

        if (message.type === "error") {
          setQueue((previous) =>
            previous.map((item) => ({
              ...item,
              status: "error",
              statusText: "Error",
              error: message.error,
            }))
          )
          setOverallStatus("Batch merge failed.")
          cleanup()
          reject(new Error(message.error))
        }
      }

      const onError = (event: ErrorEvent) => {
        cleanup()
        reject(new Error(event.message || "Merge worker failed."))
      }

      const cleanup = () => {
        worker.removeEventListener("message", onMessage)
        worker.removeEventListener("error", onError)
        worker.terminate()
        activeWorkersRef.current = activeWorkersRef.current.filter((instance) => instance !== worker)
      }

      worker.addEventListener("message", onMessage)
      worker.addEventListener("error", onError)
      worker.postMessage(
        {
          type: "merge-files",
          requestId,
          files: filesPayload,
        },
        filesPayload.map((entry) => entry.buffer)
      )
    })
  }, [createSingleOrZipDownload, files, queue.length])

  const runPerFileOperation = useCallback(async () => {
    if (!files.length || !queue.length) return

    const queueByIndex = queue
    const jobs: Job[] = files.map((file, index) => ({
      file,
      queueId: queueByIndex[index]?.id ?? crypto.randomUUID(),
    }))

    let nextJobIndex = 0
    const aggregatedOutputs: OutputEntry[] = []

    const poolSize = Math.min(
      4,
      Math.max(1, navigator.hardwareConcurrency || 2),
      Math.max(1, jobs.length)
    )

    const runJobWithWorker = async (worker: Worker, job: Job) => {
      const requestId = crypto.randomUUID()
      const fileBuffer = await job.file.arrayBuffer()

      applyQueuePatch(job.queueId, {
        status: "processing",
        statusText: "Processing",
        progress: 3,
        error: undefined,
      })

      return await new Promise<void>((resolve, reject) => {
        const onMessage = (event: MessageEvent<WorkerMessage>) => {
          const message = event.data
          if (!message || message.requestId !== requestId) return

          if (message.type === "progress") {
            applyQueuePatch(job.queueId, {
              status: "processing",
              progress: message.progress,
              statusText: message.status,
            })
            return
          }

          if (message.type === "file-success") {
            const outputs = message.outputs.map((output) => ({
              name: output.name,
              bytes: new Uint8Array(output.buffer),
            }))
            aggregatedOutputs.push(...outputs)
            const base = job.file.name.replace(/\.pdf$/i, "")
            const download = createSingleOrZipDownload(
              outputs,
              operation === "compress" ? `${base}-compressed` : `${base}-${operation}-results`
            )
            applyQueuePatch(job.queueId, {
              status: "done",
              progress: 100,
              statusText: "Done",
              outputBytes: message.outputBytes,
              outputCount: outputs.length,
              downloadName: download.name,
              downloadUrl: download.url,
            })
            cleanup()
            resolve()
            return
          }

          if (message.type === "error") {
            applyQueuePatch(job.queueId, {
              status: "error",
              statusText: "Error",
              error: message.error,
            })
            cleanup()
            reject(new Error(message.error))
          }
        }

        const onError = (event: ErrorEvent) => {
          applyQueuePatch(job.queueId, {
            status: "error",
            statusText: "Error",
            error: event.message || "Worker crashed.",
          })
          cleanup()
          reject(new Error(event.message || "Worker failed"))
        }

        const cleanup = () => {
          worker.removeEventListener("message", onMessage)
          worker.removeEventListener("error", onError)
        }

        worker.addEventListener("message", onMessage)
        worker.addEventListener("error", onError)

        worker.postMessage(
          {
            type: "process-file",
            requestId,
            operation,
            fileName: job.file.name,
            buffer: fileBuffer,
            options: {
              compressionScale: compressionScaleFromLevel(compressionLevel),
              splitRule,
              splitEveryN,
              splitAtPages: splitRule === "at-pages" ? parseSplitAtPages(splitAtPagesText) : undefined,
              convertFormat,
              convertDpi,
            },
          },
          [fileBuffer]
        )
      })
    }

    const workerRunners = Array.from({ length: poolSize }, async () => {
      const worker = createWorker()
      activeWorkersRef.current.push(worker)

      try {
        while (true) {
          const job = jobs[nextJobIndex]
          nextJobIndex += 1
          if (!job) {
            return
          }
          await runJobWithWorker(worker, job)
          setOverallStatus(
            `Processed ${Math.min(nextJobIndex, jobs.length)} of ${jobs.length} files.`
          )
        }
      } finally {
        worker.terminate()
        activeWorkersRef.current = activeWorkersRef.current.filter((instance) => instance !== worker)
      }
    })

    await Promise.all(workerRunners)
    setAllOutputs(aggregatedOutputs)
  }, [
    applyQueuePatch,
    compressionLevel,
    convertDpi,
    convertFormat,
    createSingleOrZipDownload,
    files,
    operation,
    queue,
    splitAtPagesText,
    splitEveryN,
    splitRule,
  ])

  const startBatch = useCallback(async () => {
    if (!canStart) return

    revokeAllUrls()
    setAllOutputs([])
    setAllZipName(
      operation === "merge"
        ? "plain-batch-merge.zip"
        : operation === "compress"
          ? "plain-batch-compress-results.zip"
          : operation === "split"
            ? "plain-batch-split-results.zip"
            : "plain-batch-convert-results.zip"
    )

    setQueue((previous) =>
      previous.map((item) => ({
        ...item,
        status: "queued",
        progress: 0,
        statusText: "Queued",
        error: undefined,
        outputBytes: undefined,
        outputCount: undefined,
        downloadName: undefined,
        downloadUrl: undefined,
      }))
    )

    setIsProcessing(true)
    setOverallStatus("Initialising local worker pool...")

    try {
      if (operation === "merge") {
        await runMergeOperation()
      } else {
        await runPerFileOperation()
        setOverallStatus("Batch operation complete.")
      }
      toast.success("Batch processing complete.")
    } catch (error) {
      const message = error instanceof Error ? error.message : "Batch operation failed."
      setOverallStatus(message)
      toast.error(message)
    } finally {
      setIsProcessing(false)
    }
  }, [canStart, operation, revokeAllUrls, runMergeOperation, runPerFileOperation])

  const downloadAllResults = useCallback(() => {
    if (!allOutputs.length) {
      toast.error("No outputs available yet.")
      return
    }

    if (!allZipUrl) {
      const zipEntries: Record<string, Uint8Array> = {}
      for (const output of allOutputs) {
        zipEntries[output.name] = output.bytes
      }
      const zipBytes = zipSync(zipEntries, { level: 6 })
      const zipBlob = new Blob([zipBytes], { type: "application/zip" })
      const url = createDownloadUrl(zipBlob)
      setAllZipUrl(url)
    }
  }, [allOutputs, allZipUrl, createDownloadUrl])

  return (
    <div className="space-y-6 overflow-x-hidden">
      <Toaster richColors position="top-right" />

      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        multiple
        className="hidden"
        onChange={(event) => {
          if (event.target.files) {
            handleIncomingFiles(event.target.files)
          }
          event.currentTarget.value = ""
        }}
      />

      <Card>
        <CardContent className="pt-6">
          <div
            role="button"
            tabIndex={0}
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault()
                fileInputRef.current?.click()
              }
            }}
            onDragOver={(event) => {
              event.preventDefault()
              setIsDragging(true)
            }}
            onDragLeave={(event) => {
              event.preventDefault()
              setIsDragging(false)
            }}
            onDrop={(event) => {
              event.preventDefault()
              setIsDragging(false)
              handleIncomingFiles(event.dataTransfer.files)
            }}
            className={`cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition-colors sm:p-10 ${
              isDragging
                ? "border-primary bg-primary/10"
                : "border-border bg-muted/20 hover:border-primary/70"
            }`}
          >
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <UploadCloud className="h-6 w-6 text-primary" />
            </div>
            <p className="text-sm font-medium text-foreground">Drop up to 20 PDFs here, or click to browse</p>
            <p className="mt-1 text-xs text-muted-foreground">All processing runs locally in browser workers.</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Batch Operation</CardTitle>
          <CardDescription className="break-words">{overallStatus}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="batch-operation">Operation</Label>
              <select
                id="batch-operation"
                value={operation}
                onChange={(event) => setOperation(event.target.value as BatchOperation)}
                className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                disabled={isProcessing}
              >
                <option value="merge">Batch Merge</option>
                <option value="compress">Batch Compress</option>
                <option value="split">Batch Split</option>
                <option value="convert">Batch Convert to Images</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>Files in Queue</Label>
              <div className="rounded-md border bg-muted/30 px-3 py-2 text-sm text-muted-foreground">
                {files.length} / {MAX_FILES}
              </div>
            </div>
          </div>

          {operation === "compress" ? (
            <div className="space-y-2">
              <Label htmlFor="compression-level">Compression Level (0-100)</Label>
              <Input
                id="compression-level"
                type="number"
                min={0}
                max={100}
                value={compressionLevel}
                onChange={(event) => setCompressionLevel(Number(event.target.value) || 0)}
                disabled={isProcessing}
              />
            </div>
          ) : null}

          {operation === "split" ? (
            <div className="space-y-3 rounded-lg border p-4">
              <div className="space-y-2">
                <Label htmlFor="split-rule">Split Rule</Label>
                <select
                  id="split-rule"
                  value={splitRule}
                  onChange={(event) => setSplitRule(event.target.value as SplitRule)}
                  className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                  disabled={isProcessing}
                >
                  <option value="every-n">Every N pages</option>
                  <option value="at-pages">At specific page numbers</option>
                </select>
              </div>

              {splitRule === "every-n" ? (
                <div className="space-y-2">
                  <Label htmlFor="split-every-n">N pages per split</Label>
                  <Input
                    id="split-every-n"
                    type="number"
                    min={1}
                    value={splitEveryN}
                    onChange={(event) => setSplitEveryN(Math.max(1, Number(event.target.value) || 1))}
                    disabled={isProcessing}
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="split-at-pages">Start new chunks at pages (comma-separated)</Label>
                  <Input
                    id="split-at-pages"
                    value={splitAtPagesText}
                    onChange={(event) => setSplitAtPagesText(event.target.value)}
                    placeholder="2,5,8"
                    disabled={isProcessing}
                  />
                </div>
              )}
            </div>
          ) : null}

          {operation === "convert" ? (
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="convert-format">Image Format</Label>
                <select
                  id="convert-format"
                  value={convertFormat}
                  onChange={(event) => setConvertFormat(event.target.value as ConvertFormat)}
                  className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                  disabled={isProcessing}
                >
                  <option value="png">PNG</option>
                  <option value="jpeg">JPEG</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="convert-dpi">DPI</Label>
                <select
                  id="convert-dpi"
                  value={convertDpi}
                  onChange={(event) => setConvertDpi(Number(event.target.value) as 72 | 150 | 300)}
                  className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                  disabled={isProcessing}
                >
                  <option value={72}>72 dpi</option>
                  <option value={150}>150 dpi</option>
                  <option value={300}>300 dpi</option>
                </select>
              </div>
            </div>
          ) : null}

          {(isProcessing || queue.length > 0) && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{isProcessing ? "Batch running" : "Batch progress"}</span>
                <span>{overallProgress}%</span>
              </div>
              <Progress value={overallProgress} className="h-2 w-full" />
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          {allOutputs.length > 0 ? <ProcessedLocallyBadge className="w-fit" /> : null}
          <Button type="button" className="w-full sm:w-auto" disabled={!canStart} onClick={() => void startBatch()}>
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Run Batch"
            )}
          </Button>

          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto"
            disabled={isProcessing || !files.length}
            onClick={() => {
              setFiles([])
              setQueue([])
              setAllOutputs([])
              revokeAllUrls()
              setOverallStatus("Upload up to 20 PDFs to start batch processing.")
            }}
          >
            <Trash2 className="h-4 w-4" />
            Reset
          </Button>

          <Button
            type="button"
            variant="secondary"
            className="w-full sm:w-auto"
            disabled={!allOutputs.length}
            onClick={downloadAllResults}
          >
            <Download className="h-4 w-4" />
            Prepare Download All Results
          </Button>

          {allZipUrl ? (
            <Button asChild className="w-full sm:w-auto">
              <a
                href={allZipUrl}
                download={allZipName}
                onClick={() => {
                  notifyLocalDownloadSuccess()
                }}
              >
                <Download className="h-4 w-4" />
                Download All Results
              </a>
            </Button>
          ) : null}
        </CardFooter>
      </Card>

      {queue.length > 0 ? (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Per-File Queue</CardTitle>
            <CardDescription>
              Status, progress, and output size are tracked for each file.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-[760px] w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="py-2 pr-3">File</th>
                    <th className="py-2 pr-3">Status</th>
                    <th className="py-2 pr-3">Progress</th>
                    <th className="py-2 pr-3">Size (In -&gt; Out)</th>
                    <th className="py-2">Download</th>
                  </tr>
                </thead>
                <tbody>
                  {queue.map((item) => (
                    <tr key={item.id} className="border-b align-top">
                      <td className="py-3 pr-3">
                        <p className="max-w-[220px] truncate font-medium text-foreground">{item.fileName}</p>
                        {item.error ? (
                          <p className="mt-1 text-xs text-red-500">{item.error}</p>
                        ) : (
                          <p className="mt-1 text-xs text-muted-foreground">{item.statusText}</p>
                        )}
                      </td>
                      <td className="py-3 pr-3">
                        <Badge variant={statusVariant(item.status)}>{item.status}</Badge>
                      </td>
                      <td className="py-3 pr-3">
                        <div className="space-y-1">
                          <Progress value={item.progress} className="h-2 w-full min-w-[160px]" />
                          <p className="text-xs text-muted-foreground">{item.progress}%</p>
                        </div>
                      </td>
                      <td className="py-3 pr-3 text-xs text-muted-foreground">
                        {formatBytes(item.inputBytes)} {"->"}{" "}
                        {typeof item.outputBytes === "number" ? formatBytes(item.outputBytes) : "-"}
                        {typeof item.outputCount === "number" && item.outputCount > 1
                          ? ` (${item.outputCount} files)`
                          : ""}
                      </td>
                      <td className="py-3">
                        {item.downloadUrl && item.downloadName ? (
                          <Button asChild size="sm" className="w-full sm:w-auto">
                            <a
                              href={item.downloadUrl}
                              download={item.downloadName}
                              onClick={() => {
                                notifyLocalDownloadSuccess()
                              }}
                            >
                              <Download className="h-4 w-4" />
                              Download
                            </a>
                          </Button>
                        ) : (
                          <span className="text-xs text-muted-foreground">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}
