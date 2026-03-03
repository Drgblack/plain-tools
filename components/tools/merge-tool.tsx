"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Download, FileText, Loader2, Trash2, UploadCloud, X } from "lucide-react"
import { toast, Toaster } from "sonner"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { mergePdfs } from "@/lib/pdf-batch-engine"

type QueuedPdfFile = {
  id: string
  file: File
}

const LARGE_MERGE_THRESHOLD_BYTES = 500 * 1024 * 1024

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`
  const kb = bytes / 1024
  if (kb < 1024) return `${kb.toFixed(1)} KB`
  const mb = kb / 1024
  if (mb < 1024) return `${mb.toFixed(2)} MB`
  const gb = mb / 1024
  return `${gb.toFixed(2)} GB`
}

const isPdfFile = (file: File) =>
  file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")

export default function MergeTool() {
  const [files, setFiles] = useState<QueuedPdfFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState("Ready to merge locally.")
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [hasCompletedMerge, setHasCompletedMerge] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const totalBytes = useMemo(
    () => files.reduce((acc, item) => acc + item.file.size, 0),
    [files]
  )
  const isLargeMerge = totalBytes >= LARGE_MERGE_THRESHOLD_BYTES

  useEffect(() => {
    return () => {
      if (resultUrl) {
        URL.revokeObjectURL(resultUrl)
      }
    }
  }, [resultUrl])

  const clearResult = useCallback(() => {
    if (resultUrl) {
      URL.revokeObjectURL(resultUrl)
      setResultUrl(null)
    }
    setHasCompletedMerge(false)
  }, [resultUrl])

  const addFiles = useCallback(
    (incoming: FileList | File[]) => {
      const candidates = Array.from(incoming)
      const pdfs = candidates.filter(isPdfFile)
      const rejectedCount = candidates.length - pdfs.length

      if (rejectedCount > 0) {
        toast.error("Only PDF files are supported.")
      }

      if (!pdfs.length) return

      clearResult()
      setStatus("Ready to merge locally.")
      setProgress(0)

      const incomingItems: QueuedPdfFile[] = pdfs.map((file) => ({
        id: crypto.randomUUID(),
        file,
      }))

      setFiles((previous) => [...previous, ...incomingItems])
    },
    [clearResult]
  )

  const removeFile = useCallback((id: string) => {
    setFiles((previous) => previous.filter((item) => item.id !== id))
    setStatus("Ready to merge locally.")
    setProgress(0)
  }, [])

  const handleMerge = useCallback(async () => {
    if (files.length < 2) return

    setIsLoading(true)
    setHasCompletedMerge(false)
    setProgress(isLargeMerge ? 3 : 0)
    setStatus(
      isLargeMerge
        ? "Initialising large local merge..."
        : "Merging PDFs locally..."
    )

    let progressTimer: ReturnType<typeof setInterval> | null = null
    if (isLargeMerge) {
      progressTimer = setInterval(() => {
        setProgress((current) => Math.min(94, current + 2))
      }, 220)
    }

    try {
      const mergedBytes = await mergePdfs(files.map((item) => item.file))
      const blob = new Blob([mergedBytes], { type: "application/pdf" })
      const nextUrl = URL.createObjectURL(blob)

      if (resultUrl) {
        URL.revokeObjectURL(resultUrl)
      }

      setResultUrl(nextUrl)
      setProgress(100)
      setStatus("Merge complete. Ready for download.")
      setHasCompletedMerge(true)
      toast.success("PDFs merged successfully.")
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Could not merge the selected PDFs."
      setStatus("Merge failed.")
      toast.error(message)
    } finally {
      if (progressTimer) clearInterval(progressTimer)
      setIsLoading(false)
    }
  }, [files, isLargeMerge, resultUrl])

  const handleDownload = useCallback(() => {
    if (!resultUrl) return
    const anchor = document.createElement("a")
    anchor.href = resultUrl
    anchor.download = "merged.pdf"
    anchor.click()
  }, [resultUrl])

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
            addFiles(event.target.files)
          }
          event.currentTarget.value = ""
        }}
      />

      <div
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
          if (event.dataTransfer.files.length) {
            addFiles(event.dataTransfer.files)
          }
        }}
        onClick={() => fileInputRef.current?.click()}
        className={`rounded-xl border-2 border-dashed p-8 text-center transition-colors md:p-10 ${
          isDragging
            ? "border-[#0070f3] bg-[#0070f3]/10"
            : "border-[#333] bg-card hover:border-[#0070f3]/70"
        }`}
      >
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <UploadCloud className="h-6 w-6 text-primary" />
        </div>
        <p className="text-sm font-medium text-foreground">
          Drop PDF files here, or click to browse
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Multiple files supported. Local-only merge in your browser.
        </p>
      </div>

      <div className="rounded-xl border border-[#333] bg-card">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <p className="text-sm font-medium text-foreground">
            Files ({files.length})
          </p>
          <p className="text-xs text-muted-foreground">{formatFileSize(totalBytes)}</p>
        </div>

        {files.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-muted-foreground">
            No files selected yet.
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {files.map((item) => (
              <li key={item.id} className="flex min-w-0 items-center justify-between gap-3 px-4 py-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 shrink-0 text-primary" />
                    <p className="truncate text-sm font-medium text-foreground">
                      {item.file.name}
                    </p>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatFileSize(item.file.size)}
                  </p>
                </div>
                <button
                  type="button"
                  className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                  onClick={() => removeFile(item.id)}
                  aria-label={`Remove ${item.file.name}`}
                >
                  <X className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          type="button"
          className="w-full sm:flex-1"
          onClick={handleMerge}
          disabled={isLoading || files.length < 2}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Merging...
            </>
          ) : (
            "Merge"
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full border-[#333] hover:border-[#0070f3] sm:w-auto"
          onClick={() => {
            setFiles([])
            clearResult()
            setProgress(0)
            setStatus("Ready to merge locally.")
          }}
          disabled={isLoading || files.length === 0}
        >
          <Trash2 className="h-4 w-4" />
          Clear
        </Button>
      </div>

      {isLoading ? (
        <div className="rounded-xl border border-[#333] bg-card p-4">
          <div className="mb-2 flex min-w-0 items-center gap-2 text-sm text-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="min-w-0 break-words">{status}</span>
          </div>
          {isLargeMerge ? (
            <>
              <Progress value={progress} className="h-2" />
              <p className="mt-2 text-xs text-muted-foreground">
                Large file set detected. Estimated progress: {progress}%
              </p>
            </>
          ) : (
            <p className="text-xs text-muted-foreground">
              Processing locally on this device.
            </p>
          )}
        </div>
      ) : null}

      {resultUrl ? (
        <div className="rounded-xl border border-[#333] bg-card p-4">
          <p className="text-sm font-medium text-foreground">
            {hasCompletedMerge ? "Merged PDF is ready." : "Merged output available."}
          </p>
          <p className="mt-1 break-words text-xs text-muted-foreground">{status}</p>
          <Button className="mt-4 w-full sm:w-auto" onClick={handleDownload}>
            <Download className="h-4 w-4" />
            Download merged.pdf
          </Button>
        </div>
      ) : null}
    </div>
  )
}
