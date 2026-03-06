"use client"

import { useCallback, useMemo, useState } from "react"
import { ArrowDown, ArrowUp, Download, FileText, Loader2, Trash2, X } from "lucide-react"
import { toast, Toaster } from "sonner"

import { PdfFileDropzone } from "@/components/tools/shared/pdf-file-dropzone"
import { Button } from "@/components/ui/button"
import { ProcessedLocallyBadge } from "@/components/tools/processed-locally-badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useObjectUrlState } from "@/hooks/use-object-url-state"
import { mergePdfs } from "@/lib/pdf-batch-engine"
import {
  ensureSafeLocalFileSize,
  formatFileSize,
  isPdfLikeFile,
} from "@/lib/pdf-client-utils"
import { notifyLocalDownloadSuccess } from "@/lib/local-download-events"

type QueuedPdf = {
  id: string
  file: File
}

type MergeResult = {
  sizeBytes: number
}

const MAX_MERGE_FILES = 20
const MAX_MERGE_TOTAL_BYTES = 1024 * 1024 * 1024

export default function MergePdfTool() {
  const [files, setFiles] = useState<QueuedPdf[]>([])
  const [isMerging, setIsMerging] = useState(false)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState("Upload 2 or more PDFs to merge them locally.")
  const [result, setResult] = useState<MergeResult | null>(null)
  const { url: downloadUrl, clearUrl, setUrlFromBlob } = useObjectUrlState()

  const totalBytes = useMemo(
    () => files.reduce((total, entry) => total + entry.file.size, 0),
    [files]
  )

  const clearResult = useCallback(() => {
    clearUrl()
    setResult(null)
  }, [clearUrl])

  const enqueueFiles = useCallback(
    (incoming: File[]) => {
      const accepted = incoming.filter(isPdfLikeFile)

      if (accepted.length !== incoming.length) {
        toast.error("Only PDF files are supported.")
      }

      if (!accepted.length) {
        return
      }

      let totalBytes = files.reduce((total, entry) => total + entry.file.size, 0)
      const remainingSlots = Math.max(0, MAX_MERGE_FILES - files.length)
      const nextEntries: QueuedPdf[] = []

      if (remainingSlots === 0) {
        toast.error(`You can merge up to ${MAX_MERGE_FILES} files at once.`)
        return
      }

      for (const file of accepted.slice(0, remainingSlots)) {
        try {
          ensureSafeLocalFileSize(file)
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Could not use this file."
          toast.error(message)
          continue
        }

        if (totalBytes + file.size > MAX_MERGE_TOTAL_BYTES) {
          toast.error(
            `Combined input exceeds local safety limit (${formatFileSize(
              MAX_MERGE_TOTAL_BYTES
            )}).`
          )
          break
        }

        nextEntries.push({
          id: crypto.randomUUID(),
          file,
        })
        totalBytes += file.size
      }

      if (incoming.length > remainingSlots) {
        toast.message(`Only the first ${MAX_MERGE_FILES} files are kept.`)
      }

      if (!nextEntries.length) {
        return
      }

      setFiles((previous) => [...previous, ...nextEntries])
      setStatus("Ready to merge.")
      setProgress(0)
      clearResult()
    },
    [clearResult, files]
  )

  const removeFile = useCallback((id: string) => {
    setFiles((previous) => previous.filter((entry) => entry.id !== id))
    setStatus("Ready to merge.")
    setProgress(0)
  }, [])

  const moveFile = useCallback((index: number, direction: "up" | "down") => {
    setFiles((previous) => {
      const target = direction === "up" ? index - 1 : index + 1
      if (target < 0 || target >= previous.length) {
        return previous
      }

      const reordered = [...previous]
      const [moved] = reordered.splice(index, 1)
      reordered.splice(target, 0, moved)
      return reordered
    })
    setStatus("Ready to merge.")
    setProgress(0)
    clearResult()
  }, [clearResult])

  const runMerge = useCallback(async () => {
    if (files.length < 2) {
      toast.error("Please add at least 2 PDF files.")
      return
    }

    setIsMerging(true)
    setProgress(3)
    setStatus("Merging PDFs locally...")
    clearResult()

    const simulatedProgress = setInterval(() => {
      setProgress((current) => Math.min(92, current + 4))
    }, 220)

    try {
      const mergedBytes = await mergePdfs(files.map((entry) => entry.file))
      const blob = new Blob([mergedBytes], { type: "application/pdf" })
      setUrlFromBlob(blob)

      setResult({
        sizeBytes: blob.size,
      })
      setProgress(100)
      setStatus("Merge complete. Download is ready.")
      toast.success("PDFs merged successfully.")
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Merge failed. Please try again."
      setStatus("Merge failed.")
      toast.error(message)
    } finally {
      clearInterval(simulatedProgress)
      setIsMerging(false)
    }
  }, [clearResult, files, setUrlFromBlob])

  return (
    <div className="space-y-6 overflow-x-hidden">
      <Toaster richColors position="top-right" />

      <Card className="border-blue-500/25 bg-card/80">
        <CardHeader>
          <CardTitle className="text-base">Best-effort offline merge</CardTitle>
          <CardDescription>
            Best-effort offline merge. Files never leave your device.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <PdfFileDropzone
            multiple
            disabled={isMerging}
            title="Drop PDF files here, or click to browse"
            subtitle="All processing stays local in your browser"
            onFilesSelected={enqueueFiles}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Files to merge ({files.length})</CardTitle>
          <CardDescription className="break-words">
            {files.length > 0 ? `${formatFileSize(totalBytes)} selected` : "No files selected yet."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {files.length === 0 ? (
            <p className="text-sm text-muted-foreground">Add at least two PDFs.</p>
          ) : (
            files.map((entry, index) => (
              <div
                key={entry.id}
                className="flex min-w-0 flex-col gap-3 rounded-lg border bg-muted/30 p-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{entry.file.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{formatFileSize(entry.file.size)}</p>
                </div>

                <div className="flex w-full gap-2 sm:w-auto">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-9 min-h-[44px] flex-1 px-3 sm:flex-none"
                    onClick={() => moveFile(index, "up")}
                    disabled={index === 0 || isMerging}
                    aria-label={`Move ${entry.file.name} up`}
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-9 min-h-[44px] flex-1 px-3 sm:flex-none"
                    onClick={() => moveFile(index, "down")}
                    disabled={index === files.length - 1 || isMerging}
                    aria-label={`Move ${entry.file.name} down`}
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    className="h-9 min-h-[44px] flex-1 px-3 text-destructive hover:text-destructive sm:flex-none"
                    onClick={() => removeFile(entry.id)}
                    disabled={isMerging}
                    aria-label={`Remove ${entry.file.name}`}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}

          {(isMerging || progress > 0) && (
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{isMerging ? "Processing" : "Complete"}</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2 w-full" />
              <p className="text-xs text-muted-foreground">{status}</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-2 sm:flex-row">
          <Button
            type="button"
            className="w-full sm:w-auto"
            disabled={isMerging || files.length < 2}
            onClick={runMerge}
          >
            {isMerging ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Merging...
              </>
            ) : (
              <>
                <FileText className="h-4 w-4" />
                Merge
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => {
              setFiles([])
              setProgress(0)
              setStatus("Upload 2 or more PDFs to merge them locally.")
              clearResult()
            }}
            disabled={isMerging || files.length === 0}
          >
            <Trash2 className="h-4 w-4" />
            Clear
          </Button>
        </CardFooter>
      </Card>

      {result && downloadUrl ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Merged output ready</CardTitle>
            <CardDescription>merged.pdf • {formatFileSize(result.sizeBytes)}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <ProcessedLocallyBadge />
            <Button asChild className="w-full sm:w-auto">
              <a
                href={downloadUrl}
                download="merged.pdf"
                onClick={() => notifyLocalDownloadSuccess()}
              >
                <Download className="h-4 w-4" />
                Download merged.pdf
              </a>
            </Button>
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}
