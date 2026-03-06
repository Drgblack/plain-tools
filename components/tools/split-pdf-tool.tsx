"use client"

import { Download, FileText, Loader2, Scissors, Trash2 } from "lucide-react"
import { useCallback, useMemo, useState } from "react"
import { toast, Toaster } from "sonner"

import { PdfFileDropzone } from "@/components/tools/shared/pdf-file-dropzone"
import { Button } from "@/components/ui/button"
import { ProcessedLocallyBadge } from "@/components/tools/processed-locally-badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import {
  countPdfPages,
  ensureSafeLocalFileSize,
  formatFileSize,
  isPdfLikeFile,
} from "@/lib/pdf-client-utils"
import { notifyLocalDownloadSuccess } from "@/lib/local-download-events"
import { expandPageRangesToUniquePages, formatPaddedIndex, parsePageRanges } from "@/lib/pdf-range-utils"
import { getPdfLib } from "@/lib/pdf-lib-loader"
import { splitPdf, type PdfPageRange } from "@/lib/pdf-batch-engine"
import { downloadZip, makeZip } from "@/lib/zip-download"

type SplitMode = "extract" | "individual" | "ranges"

type SplitOutput = {
  name: string
  bytes: Uint8Array
  sizeBytes: number
  rangeLabel: string
}

type DownloadBundle = {
  outputFiles: SplitOutput[]
  zipBytes?: Uint8Array
  zipName?: string
  zipSizeBytes?: number
}

const MAX_SPLIT_FILE_BYTES = 200 * 1024 * 1024

const parsePageSelection = (value: string, pageCount: number): number[] => {
  return expandPageRangesToUniquePages(parsePageRanges(value, pageCount))
}

const makeSplitName = (mode: SplitMode, range: PdfPageRange, index: number) => {
  if (mode === "individual" || range.start === range.end) {
    return `page-${formatPaddedIndex(index + 1)}.pdf`
  }
  return `split-range-${formatPaddedIndex(index + 1)}.pdf`
}

const createExtractPdf = async (file: File, pages: number[]) => {
  const { PDFDocument } = await getPdfLib()
  const sourceBytes = new Uint8Array(await file.arrayBuffer())
  const source = await PDFDocument.load(sourceBytes, { ignoreEncryption: true })
  const output = await PDFDocument.create()
  const copied = await output.copyPages(
    source,
    pages.map((page) => page - 1)
  )
  copied.forEach((page) => output.addPage(page))
  return await output.save({ useObjectStreams: true })
}

export default function SplitPdfTool() {
  const [file, setFile] = useState<File | null>(null)
  const [pageCount, setPageCount] = useState<number | null>(null)
  const [mode, setMode] = useState<SplitMode>("extract")
  const [extractInput, setExtractInput] = useState("")
  const [rangeInput, setRangeInput] = useState("")
  const [isSplitting, setIsSplitting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState("Upload a PDF to begin splitting locally.")
  const [bundle, setBundle] = useState<DownloadBundle | null>(null)

  const clearOutputs = useCallback(() => {
    setBundle(null)
  }, [])

  const handleFile = useCallback(
    async (candidate: File) => {
      try {
        if (!isPdfLikeFile(candidate)) {
          toast.error("Only PDF files are supported.")
          return
        }

        ensureSafeLocalFileSize(candidate, MAX_SPLIT_FILE_BYTES)

        setFile(candidate)
        setPageCount(null)
        setExtractInput("")
        setRangeInput("")
        setProgress(0)
        setStatus("Reading page count...")
        clearOutputs()

        const pages = await countPdfPages(candidate)
        setPageCount(pages)
        setStatus(`Loaded locally. ${pages} page${pages === 1 ? "" : "s"} detected.`)
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Could not read this PDF. Please choose another file."
        setFile(null)
        setPageCount(null)
        setStatus(message)
        toast.error(message)
      }
    },
    [clearOutputs]
  )

  const canSplit = useMemo(() => {
    if (!file || !pageCount || isSplitting) return false
    if (mode === "individual") return pageCount > 0
    if (mode === "extract") return extractInput.trim().length > 0
    return rangeInput.trim().length > 0
  }, [extractInput, file, isSplitting, mode, pageCount, rangeInput])

  const runSplit = useCallback(async () => {
    if (!file || !pageCount) {
      toast.error("Upload a PDF first.")
      return
    }

    setIsSplitting(true)
    setProgress(5)
    setStatus("Splitting PDF locally...")
    clearOutputs()

    const progressTimer = setInterval(() => {
      setProgress((current) => Math.min(92, current + 3))
    }, 220)

    try {
      let outputs: SplitOutput[] = []

      if (mode === "extract") {
        const pages = parsePageSelection(extractInput, pageCount)
        if (!pages.length) {
          throw new Error("Enter at least one page to extract.")
        }

        const bytes = await createExtractPdf(file, pages)
        outputs = [
          {
            name: "extracted.pdf",
            bytes,
            sizeBytes: bytes.byteLength,
            rangeLabel: pages.length === 1 ? `Page ${pages[0]}` : `Pages ${pages[0]}-${pages[pages.length - 1]}`,
          },
        ]
      } else {
        const ranges: PdfPageRange[] =
          mode === "individual"
            ? Array.from({ length: pageCount }, (_, index) => ({ start: index + 1, end: index + 1 }))
            : parsePageRanges(rangeInput, pageCount)

        const splitBytes = await splitPdf(file, ranges)
        outputs = splitBytes.map((bytes, index) => {
          const range = ranges[index]
          return {
            name: makeSplitName(mode, range, index),
            bytes,
            sizeBytes: bytes.byteLength,
            rangeLabel:
              range.start === range.end
                ? `Page ${range.start}`
                : `Pages ${range.start}-${range.end}`,
          }
        })
      }

      if (outputs.length === 0) {
        throw new Error("No outputs were generated.")
      }

      if (outputs.length > 1) {
        const zipBytes = makeZip(
          outputs.map((output) => ({
            name: output.name,
            data: output.bytes,
          }))
        )

        setBundle({
          outputFiles: outputs,
          zipBytes,
          zipName: "split-pdf-output.zip",
          zipSizeBytes: zipBytes.byteLength,
        })
      } else {
        setBundle({ outputFiles: outputs })
      }

      setProgress(100)
      setStatus(`Split complete. ${outputs.length} output file${outputs.length === 1 ? "" : "s"} ready.`)
      toast.success("Split complete.")
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not split this PDF."
      setStatus("Split failed.")
      toast.error(message)
    } finally {
      clearInterval(progressTimer)
      setIsSplitting(false)
    }
  }, [clearOutputs, extractInput, file, mode, pageCount, rangeInput])

  const downloadSingle = useCallback((output: SplitOutput) => {
    const blob = new Blob([output.bytes], { type: "application/pdf" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = output.name
    link.click()
    URL.revokeObjectURL(url)
    notifyLocalDownloadSuccess()
  }, [])

  return (
    <div className="space-y-6 overflow-x-hidden">
      <Toaster richColors position="top-right" />

      <Card className="border-blue-500/25 bg-card/80">
        <CardHeader>
          <CardTitle className="text-base">Split PDF locally</CardTitle>
          <CardDescription>
            Best-effort offline split. Files never leave your device.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <PdfFileDropzone
            disabled={isSplitting}
            title="Drop a PDF here, or click to browse"
            subtitle="Single file input. Local-only processing."
            onFilesSelected={(selectedFiles) => {
              const selected = selectedFiles[0]
              if (selected) {
                void handleFile(selected)
              }
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Split options</CardTitle>
          <CardDescription className="break-words">{status}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          {file ? (
            <div className="rounded-lg border bg-muted/30 p-3">
              <div className="flex min-w-0 items-center gap-2">
                <FileText className="h-4 w-4 shrink-0 text-primary" />
                <span className="truncate text-sm font-medium text-foreground">{file.name}</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {formatFileSize(file.size)}
                {typeof pageCount === "number" ? ` • ${pageCount} page${pageCount === 1 ? "" : "s"}` : ""}
              </p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No PDF selected yet.</p>
          )}

          <div className="space-y-2">
            <Label>Mode</Label>
            <div className="grid gap-2 sm:grid-cols-3">
              <Button
                type="button"
                variant={mode === "extract" ? "default" : "outline"}
                className="w-full"
                onClick={() => setMode("extract")}
                disabled={isSplitting}
              >
                Extract pages
              </Button>
              <Button
                type="button"
                variant={mode === "individual" ? "default" : "outline"}
                className="w-full"
                onClick={() => setMode("individual")}
                disabled={isSplitting}
              >
                Separate each page
              </Button>
              <Button
                type="button"
                variant={mode === "ranges" ? "default" : "outline"}
                className="w-full"
                onClick={() => setMode("ranges")}
                disabled={isSplitting}
              >
                Split by ranges
              </Button>
            </div>
          </div>

          {mode === "extract" ? (
            <div className="space-y-2">
              <Label htmlFor="extract-pages">Pages to extract</Label>
              <Input
                id="extract-pages"
                placeholder="1,3,5-7"
                value={extractInput}
                onChange={(event) => setExtractInput(event.target.value)}
                disabled={!file || pageCount === null || isSplitting}
              />
              <p className="text-xs text-muted-foreground">Extracts selected pages into one new PDF.</p>
            </div>
          ) : null}

          {mode === "ranges" ? (
            <div className="space-y-2">
              <Label htmlFor="range-split">Ranges</Label>
              <Input
                id="range-split"
                placeholder="1-3,4-6"
                value={rangeInput}
                onChange={(event) => setRangeInput(event.target.value)}
                disabled={!file || pageCount === null || isSplitting}
              />
              <p className="text-xs text-muted-foreground">Creates one PDF per range.</p>
            </div>
          ) : null}

          {mode === "individual" ? (
            <p className="rounded-lg border bg-muted/20 p-3 text-xs text-muted-foreground">
              Creates one PDF per page. If there are multiple outputs, a ZIP file is generated.
            </p>
          ) : null}

          {(isSplitting || progress > 0) && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{isSplitting ? "Working" : "Complete"}</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2 w-full" />
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-2 sm:flex-row">
          <Button type="button" className="w-full sm:w-auto" disabled={!canSplit} onClick={runSplit}>
            {isSplitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Splitting PDF...
              </>
            ) : (
              <>
                <Scissors className="h-4 w-4" />
                Split PDF
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => {
              setFile(null)
              setPageCount(null)
              setExtractInput("")
              setRangeInput("")
              setProgress(0)
              setStatus("Upload a PDF to begin splitting locally.")
              clearOutputs()
            }}
            disabled={isSplitting && !file}
          >
            <Trash2 className="h-4 w-4" />
            Reset
          </Button>
        </CardFooter>
      </Card>

      {bundle ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Your files are ready</CardTitle>
            <CardDescription>
              {bundle.outputFiles.length} file{bundle.outputFiles.length === 1 ? "" : "s"} generated
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <ProcessedLocallyBadge />
            <p className="text-sm text-muted-foreground">
              {bundle.zipBytes ? "Download the ZIP to get all outputs at once." : "Download each output file below."}
            </p>

            {bundle.zipBytes && bundle.zipName ? (
              <Button
                type="button"
                className="w-full sm:w-auto"
                onClick={() => {
                  downloadZip(bundle.zipBytes!, bundle.zipName!)
                  notifyLocalDownloadSuccess()
                }}
              >
                <Download className="h-4 w-4" />
                Download ZIP ({bundle.zipSizeBytes ? formatFileSize(bundle.zipSizeBytes) : "ready"})
              </Button>
            ) : null}

            <div className="grid gap-2 sm:grid-cols-2">
              {bundle.outputFiles.map((output) => (
                <div key={output.name} className="rounded-lg border p-3">
                  <p className="truncate text-sm font-medium text-foreground">{output.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {output.rangeLabel} • {formatFileSize(output.sizeBytes)}
                  </p>
                  {!bundle.zipBytes ? (
                    <Button
                      type="button"
                      variant="secondary"
                      className="mt-3 w-full"
                      onClick={() => downloadSingle(output)}
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                  ) : null}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}
