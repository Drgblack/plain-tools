"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import {
  Download,
  Eye,
  FileText,
  Loader2,
  Minimize2,
  Trash2,
  UploadCloud,
} from "lucide-react"
import Image from "next/image"
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
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import {
  plainRealTimeCompressionPreviewer,
  type PlainRealTimeCompressionPreviewResult,
} from "@/lib/pdf-batch-engine"

type PreviewPairUi = {
  pageIndex: number
  originalUrl: string
  compressedUrl: string
}

type PreviewState = {
  level: number
  originalSizeBytes: number
  compressedSizeBytes: number
  savingsPercent: number
  webgpuActive: boolean
  compressedBytes: Uint8Array
  pairs: PreviewPairUi[]
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

const triggerPdfDownload = (bytes: Uint8Array, fileName: string) => {
  const blob = new Blob([bytes], { type: "application/pdf" })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement("a")
  anchor.href = url
  anchor.download = fileName
  anchor.click()
  setTimeout(() => URL.revokeObjectURL(url), 0)
}

const revokePreviewPairs = (pairs: PreviewPairUi[]) => {
  pairs.forEach((pair) => {
    URL.revokeObjectURL(pair.originalUrl)
    URL.revokeObjectURL(pair.compressedUrl)
  })
}

const toPreviewState = (result: PlainRealTimeCompressionPreviewResult): PreviewState => ({
  level: result.level,
  originalSizeBytes: result.originalSizeBytes,
  compressedSizeBytes: result.compressedSizeBytes,
  savingsPercent: result.savingsPercent,
  webgpuActive: result.webgpuActive,
  compressedBytes: result.compressedBytes,
  pairs: result.previewPairs.map((pair) => ({
    pageIndex: pair.pageIndex,
    originalUrl: URL.createObjectURL(pair.originalBlob),
    compressedUrl: URL.createObjectURL(pair.compressedBlob),
  })),
})

export default function CompressionPreviewerTool() {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [file, setFile] = useState<File | null>(null)
  const [compressionLevel, setCompressionLevel] = useState(60)
  const [isDragging, setIsDragging] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState("Upload a PDF and set compression level.")
  const [preview, setPreview] = useState<PreviewState | null>(null)

  useEffect(() => {
    return () => {
      if (preview) {
        revokePreviewPairs(preview.pairs)
      }
    }
  }, [preview])

  const clearPreview = useCallback(() => {
    setPreview((previous) => {
      if (previous) {
        revokePreviewPairs(previous.pairs)
      }
      return null
    })
    setProgress(0)
  }, [])

  const setIncomingFile = useCallback(
    (nextFile: File) => {
      if (!isPdfFile(nextFile)) {
        toast.error("Only PDF files are supported.")
        return
      }

      setFile(nextFile)
      clearPreview()
      setStatus("PDF ready. Generate preview to compare before and after.")
      toast.success("PDF loaded.")
    },
    [clearPreview]
  )

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault()
      setIsDragging(false)

      const droppedFiles = Array.from(event.dataTransfer.files)
      if (!droppedFiles.length) return

      const firstPdf = droppedFiles.find(isPdfFile)
      if (!firstPdf) {
        toast.error("No PDF file detected in dropped files.")
        return
      }

      if (droppedFiles.length > 1) {
        toast.info("Using first PDF only. This tool accepts one file at a time.")
      }

      setIncomingFile(firstPdf)
    },
    [setIncomingFile]
  )

  const generatePreview = useCallback(async () => {
    if (!file) {
      toast.error("Upload a PDF first.")
      return null
    }

    setIsLoading(true)
    setProgress(4)
    setStatus("Preparing real-time compression preview...")

    try {
      const result = await plainRealTimeCompressionPreviewer(file, compressionLevel, {
        onProgress: (value, message) => {
          setProgress(Math.max(4, Math.min(100, Math.round(value))))
          setStatus(message)
        },
      })

      const nextPreview = toPreviewState(result)
      setPreview((previous) => {
        if (previous) {
          revokePreviewPairs(previous.pairs)
        }
        return nextPreview
      })
      setProgress(100)
      setStatus("Preview ready. You can now download compressed.pdf.")
      toast.success("Compression preview generated.")

      return result
    } catch (error) {
      setStatus("Preview failed.")
      const message =
        error instanceof Error ? error.message : "Failed to generate compression preview."
      toast.error(message)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [compressionLevel, file])

  const handleCompressAndDownload = useCallback(async () => {
    if (!file) {
      toast.error("Upload a PDF first.")
      return
    }

    let bytes = preview?.compressedBytes
    if (!bytes || preview?.level !== compressionLevel) {
      const result = await generatePreview()
      if (!result) return
      bytes = result.compressedBytes
    }

    triggerPdfDownload(bytes, "compressed.pdf")
    setStatus("Compressed file downloaded.")
    toast.success("compressed.pdf downloaded.")
  }, [compressionLevel, file, generatePreview, preview])

  const canPreview = Boolean(file && !isLoading)
  const canDownload = Boolean(file && !isLoading)
  const sizeDiffBytes = useMemo(() => {
    if (!preview) return 0
    return preview.originalSizeBytes - preview.compressedSizeBytes
  }, [preview])

  return (
    <div className="space-y-6 overflow-x-hidden">
      <Toaster richColors position="top-right" />

      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={(event) => {
          const selected = event.target.files?.[0]
          if (selected) {
            setIncomingFile(selected)
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
              Drop one PDF here, or click to browse
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Compression preview and processing run locally in your browser.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Real-Time Compression Previewer</CardTitle>
          <CardDescription className="break-words">{status}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {file ? (
            <div className="flex flex-wrap items-center gap-3 rounded-lg border bg-muted/30 p-3">
              <div className="flex min-w-0 items-center gap-2">
                <FileText className="h-4 w-4 shrink-0 text-primary" />
                <span className="truncate text-sm font-medium text-foreground">{file.name}</span>
              </div>
              <span className="text-xs text-muted-foreground">{formatBytes(file.size)}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="ml-auto w-full sm:w-auto"
                onClick={() => {
                  setFile(null)
                  clearPreview()
                  setStatus("Upload a PDF and set compression level.")
                }}
              >
                <Trash2 className="h-4 w-4" />
                Remove
              </Button>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No PDF selected yet.</p>
          )}

          <div className="space-y-3 rounded-lg border p-4">
            <div className="flex items-center justify-between gap-2">
              <Label htmlFor="compression-level">Compression level</Label>
              <span className="text-sm font-medium text-foreground">{compressionLevel}%</span>
            </div>
            <Slider
              id="compression-level"
              min={0}
              max={100}
              step={1}
              value={[compressionLevel]}
              onValueChange={(next) => {
                const value = next[0] ?? 60
                setCompressionLevel(value)
              }}
              disabled={!file || isLoading}
            />
            <p className="text-xs text-muted-foreground">
              0 keeps quality highest, 100 applies strongest compression.
            </p>
          </div>

          {(isLoading || progress > 0) && (
            <div className="space-y-2">
              <div className="flex min-w-0 items-center justify-between gap-2 text-xs text-muted-foreground">
                <span className="min-w-0 flex-1 truncate">{isLoading ? "Processing" : "Complete"}</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-2 sm:flex-row">
          <Button
            type="button"
            variant="secondary"
            className="w-full sm:w-auto"
            onClick={() => void generatePreview()}
            disabled={!canPreview}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Previewing...
              </>
            ) : (
              <>
                <Eye className="h-4 w-4" />
                Preview
              </>
            )}
          </Button>
          <Button
            type="button"
            className="w-full sm:w-auto"
            onClick={() => void handleCompressAndDownload()}
            disabled={!canDownload}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Compressing...
              </>
            ) : (
              <>
                <Minimize2 className="h-4 w-4" />
                Compress & Download
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      {preview ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Before/After Preview</CardTitle>
            <CardDescription>
              {preview.webgpuActive
                ? "WebGPU-ready acceleration detected."
                : "Standard browser acceleration active."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 rounded-lg border p-3 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="text-xs text-muted-foreground">Original size</p>
                <p className="text-sm font-medium text-foreground">
                  {formatBytes(preview.originalSizeBytes)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Compressed size</p>
                <p className="text-sm font-medium text-foreground">
                  {formatBytes(preview.compressedSizeBytes)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Difference</p>
                <p className="text-sm font-medium text-foreground">
                  {sizeDiffBytes >= 0 ? "-" : "+"}
                  {formatBytes(Math.abs(sizeDiffBytes))}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Savings</p>
                <p className="text-sm font-medium text-foreground">
                  {preview.savingsPercent.toFixed(1)}%
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {preview.pairs.map((pair) => (
                <div key={pair.pageIndex} className="rounded-lg border p-3">
                  <p className="mb-3 text-sm font-medium text-foreground">Page {pair.pageIndex + 1}</p>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <div className="space-y-1">
                      <p className="text-[11px] text-muted-foreground">Before</p>
                      <div className="overflow-hidden rounded-md border bg-muted/20">
                        <Image
                          src={pair.originalUrl}
                          alt={`Original page ${pair.pageIndex + 1}`}
                          width={260}
                          height={340}
                          unoptimized
                          className="h-auto w-full object-contain"
                          loading="lazy"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[11px] text-muted-foreground">After</p>
                      <div className="overflow-hidden rounded-md border bg-muted/20">
                        <Image
                          src={pair.compressedUrl}
                          alt={`Compressed page ${pair.pageIndex + 1}`}
                          width={260}
                          height={340}
                          unoptimized
                          className="h-auto w-full object-contain"
                          loading="lazy"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2 sm:flex-row">
            <Button
              type="button"
              className="w-full sm:w-auto"
              onClick={() => triggerPdfDownload(preview.compressedBytes, "compressed.pdf")}
            >
              <Download className="h-4 w-4" />
              Download compressed.pdf
            </Button>
          </CardFooter>
        </Card>
      ) : null}
    </div>
  )
}
