"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Download, FileText, Loader2, Scissors, Trash2, UploadCloud } from "lucide-react"
import { toast, Toaster } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { splitPdf, type PdfPageRange } from "@/lib/pdf-batch-engine"

type SplitOutput = {
  name: string
  url: string
  sizeBytes: number
  range: PdfPageRange
}

type PdfJsModule = typeof import("pdfjs-dist/legacy/build/pdf.mjs")

let pdfJsPromise: Promise<PdfJsModule> | null = null

const getPdfJs = async () => {
  if (!pdfJsPromise) {
    pdfJsPromise = import("pdfjs-dist/legacy/build/pdf.mjs")
  }
  return pdfJsPromise
}

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

const formatRange = (range: PdfPageRange) =>
  range.start === range.end ? `Page ${range.start}` : `Pages ${range.start}-${range.end}`

const parseRanges = (input: string, maxPages: number): PdfPageRange[] => {
  const tokens = input
    .split(/[\n,;]+/)
    .map((value) => value.trim())
    .filter(Boolean)

  if (!tokens.length) {
    throw new Error("Enter at least one page range.")
  }

  const parsed: PdfPageRange[] = []

  for (const token of tokens) {
    const simplePageMatch = token.match(/^(\d+)$/)
    if (simplePageMatch) {
      const page = Number(simplePageMatch[1])
      if (page < 1 || page > maxPages) {
        throw new Error(`Page ${page} is outside the document range (1-${maxPages}).`)
      }
      parsed.push({ start: page, end: page })
      continue
    }

    const rangeMatch = token.match(/^(\d+)\s*(?:-|to)\s*(\d+)$/i)
    if (!rangeMatch) {
      throw new Error(`Invalid token "${token}". Use formats like 1-3 or 5.`)
    }

    const start = Number(rangeMatch[1])
    const end = Number(rangeMatch[2])

    if (start > end) {
      throw new Error(`Invalid range "${token}". Start must be less than or equal to end.`)
    }
    if (start < 1 || end > maxPages) {
      throw new Error(`Range "${token}" is outside the document range (1-${maxPages}).`)
    }

    parsed.push({ start, end })
  }

  return parsed
}

const countPdfPages = async (file: File): Promise<number> => {
  const pdfjs = await getPdfJs()
  const bytes = new Uint8Array(await file.arrayBuffer())
  const loadingTask = pdfjs.getDocument({
    data: bytes,
    disableWorker: true,
    disableAutoFetch: true,
    disableRange: true,
    disableStream: true,
  })

  try {
    const pdf = await loadingTask.promise
    return pdf.numPages
  } catch {
    throw new Error("Could not read this PDF. Please choose a valid, unencrypted file.")
  } finally {
    await loadingTask.destroy()
  }
}

export default function SplitTool() {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [file, setFile] = useState<File | null>(null)
  const [pageCount, setPageCount] = useState<number | null>(null)
  const [rangeInput, setRangeInput] = useState("")
  const [outputs, setOutputs] = useState<SplitOutput[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState("Upload a PDF to begin.")

  useEffect(() => {
    return () => {
      outputs.forEach((output) => URL.revokeObjectURL(output.url))
    }
  }, [outputs])

  const resetResults = useCallback(() => {
    setOutputs([])
    setProgress(0)
  }, [])

  const handleIncomingFile = useCallback(
    async (candidate: File) => {
      if (!isPdfFile(candidate)) {
        toast.error("Only PDF files are supported.")
        return
      }

      setFile(candidate)
      setPageCount(null)
      setRangeInput("")
      resetResults()
      setStatus("Reading page count...")

      try {
        const pages = await countPdfPages(candidate)
        setPageCount(pages)
        setStatus(`Loaded locally. ${pages} page${pages === 1 ? "" : "s"} detected.`)
        toast.success("PDF loaded.")
      } catch (error) {
        setFile(null)
        setPageCount(null)
        setStatus("Could not load PDF.")
        const message =
          error instanceof Error ? error.message : "Failed to read PDF page count."
        toast.error(message)
      }
    },
    [resetResults]
  )

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault()
      setIsDragging(false)

      const dropped = Array.from(event.dataTransfer.files)
      if (!dropped.length) return

      const firstPdf = dropped.find(isPdfFile)
      if (!firstPdf) {
        toast.error("No PDF file found in dropped files.")
        return
      }

      if (dropped.length > 1) {
        toast.info("Using the first PDF only. This tool accepts one file at a time.")
      }

      void handleIncomingFile(firstPdf)
    },
    [handleIncomingFile]
  )

  const handleSplit = useCallback(async () => {
    if (!file || !pageCount) {
      toast.error("Upload a PDF first.")
      return
    }

    let ranges: PdfPageRange[]
    try {
      ranges = parseRanges(rangeInput, pageCount)
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Please enter valid page ranges."
      toast.error(message)
      return
    }

    setIsLoading(true)
    setStatus("Splitting PDF locally...")
    setProgress(5)
    setOutputs([])

    const progressTimer = setInterval(() => {
      setProgress((current) => {
        if (current >= 92) return current
        if (current < 40) return current + 7
        if (current < 70) return current + 4
        return current + 2
      })
    }, 220)

    try {
      const splitBytes = await splitPdf(file, ranges)

      const nextOutputs = splitBytes.map((bytes, index) => {
        const blob = new Blob([bytes], { type: "application/pdf" })
        return {
          name: `split-${index + 1}.pdf`,
          url: URL.createObjectURL(blob),
          sizeBytes: blob.size,
          range: ranges[index],
        }
      })

      setOutputs(nextOutputs)
      setProgress(100)
      setStatus(`Split complete. ${nextOutputs.length} output file(s) ready.`)
      toast.success("PDF split complete.")
    } catch (error) {
      setStatus("Split failed.")
      const message =
        error instanceof Error ? error.message : "Could not split this PDF."
      toast.error(message)
    } finally {
      clearInterval(progressTimer)
      setIsLoading(false)
    }
  }, [file, pageCount, rangeInput])

  const downloadOutput = useCallback((output: SplitOutput) => {
    const link = document.createElement("a")
    link.href = output.url
    link.download = output.name
    link.click()
  }, [])

  const canSplit = useMemo(
    () => Boolean(file && pageCount && rangeInput.trim().length > 0 && !isLoading),
    [file, isLoading, pageCount, rangeInput]
  )

  return (
    <div className="space-y-6">
      <Toaster richColors position="top-right" />

      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={(event) => {
          const selected = event.target.files?.[0]
          if (selected) {
            void handleIncomingFile(selected)
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
            onDrop={handleDrop}
            className={`cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition-colors sm:p-10 ${
              isDragging
                ? "border-primary bg-primary/10"
                : "border-border bg-muted/20 hover:border-primary/70"
            }`}
          >
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <UploadCloud className="h-6 w-6 text-primary" />
            </div>
            <p className="text-sm font-medium text-foreground">
              Drop a PDF here, or click to browse
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Single file only. Processing happens locally in your browser.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Split Settings</CardTitle>
          <CardDescription>{status}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          {file ? (
            <div className="flex flex-wrap items-center gap-3 rounded-lg border bg-muted/30 p-3">
              <div className="flex min-w-0 items-center gap-2">
                <FileText className="h-4 w-4 shrink-0 text-primary" />
                <span className="truncate text-sm font-medium">{file.name}</span>
              </div>
              <span className="text-xs text-muted-foreground">{formatBytes(file.size)}</span>
              {pageCount !== null ? (
                <span className="rounded-full border px-2 py-0.5 text-xs text-muted-foreground">
                  {pageCount} page{pageCount === 1 ? "" : "s"}
                </span>
              ) : null}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="ml-auto"
                onClick={() => {
                  setFile(null)
                  setPageCount(null)
                  setRangeInput("")
                  resetResults()
                  setStatus("Upload a PDF to begin.")
                }}
              >
                <Trash2 className="h-4 w-4" />
                Remove
              </Button>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No PDF selected yet.</p>
          )}

          <div className="space-y-2">
            <Label htmlFor="split-ranges">Page ranges</Label>
            <Input
              id="split-ranges"
              placeholder="1-3,5,7-10"
              value={rangeInput}
              onChange={(event) => setRangeInput(event.target.value)}
              disabled={!file || pageCount === null || isLoading}
            />
            <p className="text-xs text-muted-foreground">
              Use comma-separated ranges, like 1-3,5,7-10. Single pages are allowed.
            </p>
          </div>

          {(isLoading || progress > 0) && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{isLoading ? "Processing" : "Complete"}</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
        </CardContent>

        <CardFooter className="flex-col gap-2 sm:flex-row sm:justify-between">
          <Button
            type="button"
            className="w-full sm:w-auto"
            onClick={handleSplit}
            disabled={!canSplit}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Splitting...
              </>
            ) : (
              <>
                <Scissors className="h-4 w-4" />
                Split
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      {outputs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Split Files</CardTitle>
            <CardDescription>Download each split output below.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              {outputs.map((output, index) => (
                <div
                  key={output.name + index}
                  className="flex flex-col gap-3 rounded-lg border p-3"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground">{output.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatRange(output.range)} • {formatBytes(output.sizeBytes)}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="secondary"
                    className="w-full"
                    onClick={() => downloadOutput(output)}
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
