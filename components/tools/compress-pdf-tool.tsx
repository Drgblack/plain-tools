"use client"

import { Download, FileText, Loader2, ShieldAlert, Trash2, UploadCloud } from "lucide-react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Toaster, toast } from "sonner"

import { ProcessedLocallyBadge } from "@/components/tools/processed-locally-badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { notifyLocalDownloadSuccess } from "@/lib/local-download-events"
import { getPdfLib } from "@/lib/pdf-lib-loader"
import { getPdfJs } from "@/lib/pdfjs-loader"

type CompressionMode = "light" | "medium" | "strong"

type CompressionResult = {
  url: string
  fileName: string
  outputSize: number
  mode: CompressionMode
  flattened: boolean
}

const isPdfFile = (file: File) =>
  file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")

const formatBytes = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`
  const kb = bytes / 1024
  if (kb < 1024) return `${kb.toFixed(1)} KB`
  const mb = kb / 1024
  if (mb < 1024) return `${mb.toFixed(2)} MB`
  return `${(mb / 1024).toFixed(2)} GB`
}

const baseName = (name: string) => name.replace(/\.pdf$/i, "")

const countPages = async (file: File) => {
  const pdfjs = await getPdfJs()
  const bytes = new Uint8Array(await file.arrayBuffer())
  const loadingTask = pdfjs.getDocument({
    data: bytes,
    disableAutoFetch: true,
    disableRange: true,
    disableStream: true,
  })

  try {
    const pdf = await loadingTask.promise
    return pdf.numPages
  } finally {
    await loadingTask.destroy()
  }
}

const optimiseLight = async (file: File) => {
  const { PDFDocument } = await getPdfLib()
  const bytes = new Uint8Array(await file.arrayBuffer())
  const pdf = await PDFDocument.load(bytes, {
    ignoreEncryption: true,
    updateMetadata: false,
  })

  pdf.setTitle("")
  pdf.setAuthor("")
  pdf.setSubject("")
  pdf.setKeywords([])
  pdf.setCreator("")
  pdf.setProducer("")

  return await pdf.save({
    useObjectStreams: true,
    addDefaultPage: false,
    updateFieldAppearances: false,
    objectsPerTick: 120,
  })
}

const renderFlattenedCompression = async (
  file: File,
  mode: Exclude<CompressionMode, "light">,
  onProgress: (value: number, status: string) => void
) => {
  const scale = mode === "medium" ? 0.8 : 0.55
  const quality = mode === "medium" ? 0.8 : 0.62

  const { PDFDocument } = await getPdfLib()
  const pdfjs = await getPdfJs()

  const sourceBytes = new Uint8Array(await file.arrayBuffer())
  const loadingTask = pdfjs.getDocument({
    data: sourceBytes,
    disableAutoFetch: true,
    disableRange: true,
    disableStream: true,
  })

  try {
    const sourcePdf = await loadingTask.promise
    const outputPdf = await PDFDocument.create()

    for (let index = 0; index < sourcePdf.numPages; index += 1) {
      onProgress(
        Math.min(95, 10 + Math.round((index / Math.max(1, sourcePdf.numPages)) * 75)),
        `Rendering page ${index + 1} of ${sourcePdf.numPages}...`
      )

      const page = await sourcePdf.getPage(index + 1)
      const originalViewport = page.getViewport({ scale: 1 })
      const renderViewport = page.getViewport({ scale })

      if (typeof document === "undefined") {
        throw new Error("Compression rendering requires a browser context.")
      }

      const canvas = document.createElement("canvas")
      canvas.width = Math.max(1, Math.ceil(renderViewport.width))
      canvas.height = Math.max(1, Math.ceil(renderViewport.height))

      const context = canvas.getContext("2d")
      if (!context) {
        throw new Error("Could not initialise canvas for compression.")
      }

      await page.render({
        canvas,
        canvasContext: context,
        viewport: renderViewport,
        annotationMode: pdfjs.AnnotationMode.ENABLE,
      }).promise

      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (result) => {
            if (!result) {
              reject(new Error("Could not export compressed page."))
              return
            }
            resolve(result)
          },
          "image/jpeg",
          quality
        )
      })

      const imageBytes = new Uint8Array(await blob.arrayBuffer())
      const image = await outputPdf.embedJpg(imageBytes)

      const outputPage = outputPdf.addPage([originalViewport.width, originalViewport.height])
      outputPage.drawImage(image, {
        x: 0,
        y: 0,
        width: originalViewport.width,
        height: originalViewport.height,
      })

      canvas.width = 0
      canvas.height = 0
    }

    onProgress(98, "Finalising optimised PDF...")

    return await outputPdf.save({
      useObjectStreams: true,
      addDefaultPage: false,
      updateFieldAppearances: false,
      objectsPerTick: 120,
    })
  } finally {
    await loadingTask.destroy()
  }
}

export default function CompressPdfTool() {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [file, setFile] = useState<File | null>(null)
  const [pageCount, setPageCount] = useState<number | null>(null)
  const [mode, setMode] = useState<CompressionMode>("light")
  const [allowStrongFlattening, setAllowStrongFlattening] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [isCompressing, setIsCompressing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState("Upload a PDF to begin offline optimisation.")
  const [result, setResult] = useState<CompressionResult | null>(null)

  useEffect(() => {
    return () => {
      if (result?.url) {
        URL.revokeObjectURL(result.url)
      }
    }
  }, [result])

  const clearResult = useCallback(() => {
    if (result?.url) {
      URL.revokeObjectURL(result.url)
    }
    setResult(null)
  }, [result])

  const handleFile = useCallback(
    async (candidate: File) => {
      if (!isPdfFile(candidate)) {
        toast.error("Only PDF files are supported.")
        return
      }

      setFile(candidate)
      setPageCount(null)
      clearResult()
      setProgress(0)
      setStatus("Reading PDF metadata...")

      try {
        const pages = await countPages(candidate)
        setPageCount(pages)
        setStatus(`Loaded locally. ${pages} page${pages === 1 ? "" : "s"} detected.`)
      } catch {
        setFile(null)
        setPageCount(null)
        setStatus("Could not read this PDF.")
        toast.error("Could not read this PDF. Please choose another file.")
      }
    },
    [clearResult]
  )

  const runCompression = useCallback(async () => {
    if (!file) {
      toast.error("Upload a PDF first.")
      return
    }

    if (mode === "strong" && !allowStrongFlattening) {
      toast.error("Enable the strong-mode warning toggle before continuing.")
      return
    }

    setIsCompressing(true)
    setProgress(3)
    clearResult()
    setStatus("Initialising offline optimisation...")

    try {
      let bytes: Uint8Array
      let flattened = false

      if (mode === "light") {
        setStatus("Optimising metadata and document structure...")
        bytes = await optimiseLight(file)
      } else {
        flattened = true
        bytes = await renderFlattenedCompression(file, mode, (nextProgress, nextStatus) => {
          setProgress(nextProgress)
          setStatus(nextStatus)
        })
      }

      const blob = new Blob([bytes], { type: "application/pdf" })
      const url = URL.createObjectURL(blob)

      setResult({
        url,
        mode,
        flattened,
        outputSize: blob.size,
        fileName: `${baseName(file.name)}-optimised-${mode}.pdf`,
      })
      setProgress(100)
      setStatus("Optimisation complete.")
      toast.success("Optimised PDF ready for download.")
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Could not optimise this PDF."
      setStatus("Optimisation failed.")
      toast.error(message)
    } finally {
      setIsCompressing(false)
    }
  }, [allowStrongFlattening, clearResult, file, mode])

  const beforeSize = file?.size ?? 0
  const afterSize = result?.outputSize ?? 0
  const savings = useMemo(() => {
    if (!beforeSize || !afterSize || afterSize >= beforeSize) return 0
    return ((beforeSize - afterSize) / beforeSize) * 100
  }, [afterSize, beforeSize])

  const canCompress = useMemo(() => {
    if (!file || isCompressing) return false
    if (mode === "strong") return allowStrongFlattening
    return true
  }, [allowStrongFlattening, file, isCompressing, mode])

  return (
    <div className="space-y-6 overflow-x-hidden">
      <Toaster richColors position="top-right" />

      <Card className="border-blue-500/25 bg-card/80">
        <CardHeader>
          <CardTitle className="text-base">Best-effort offline optimisation</CardTitle>
          <CardDescription>
            Results vary by PDF content. Files never leave your device.
          </CardDescription>
        </CardHeader>
      </Card>

      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={(event) => {
          const selected = event.target.files?.[0]
          if (selected) {
            void handleFile(selected)
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
              const dropped = event.dataTransfer.files[0]
              if (dropped) {
                void handleFile(dropped)
              }
            }}
            className={`cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition-colors sm:p-10 ${
              isDragging ? "border-primary bg-primary/10" : "border-border bg-muted/20 hover:border-primary/70"
            }`}
          >
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <UploadCloud className="h-6 w-6 text-primary" />
            </div>
            <p className="text-sm font-medium text-foreground">Drop a PDF here, or click to browse</p>
            <p className="mt-1 text-xs text-muted-foreground">Single file optimisation with local-only processing</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Optimisation mode</CardTitle>
          <CardDescription className="break-words">{status}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          {file ? (
            <div className="rounded-lg border bg-muted/30 p-3">
              <div className="flex min-w-0 items-center gap-2">
                <FileText className="h-4 w-4 shrink-0 text-primary" />
                <p className="truncate text-sm font-medium text-foreground">{file.name}</p>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {formatBytes(file.size)}
                {typeof pageCount === "number" ? ` • ${pageCount} page${pageCount === 1 ? "" : "s"}` : ""}
              </p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No PDF selected yet.</p>
          )}

          <div className="space-y-2">
            <Label>Compression level</Label>
            <div className="grid gap-2 sm:grid-cols-3">
              <Button
                type="button"
                variant={mode === "light" ? "default" : "outline"}
                className="w-full"
                onClick={() => setMode("light")}
                disabled={isCompressing}
              >
                Light
              </Button>
              <Button
                type="button"
                variant={mode === "medium" ? "default" : "outline"}
                className="w-full"
                onClick={() => setMode("medium")}
                disabled={isCompressing}
              >
                Medium
              </Button>
              <Button
                type="button"
                variant={mode === "strong" ? "default" : "outline"}
                className="w-full"
                onClick={() => setMode("strong")}
                disabled={isCompressing}
              >
                Strong
              </Button>
            </div>
          </div>

          <div className="rounded-lg border bg-muted/20 p-3 text-xs text-muted-foreground">
            {mode === "light"
              ? "Light: preserves text when possible and optimises metadata/document structure."
              : mode === "medium"
                ? "Medium: down-samples pages by rebuilding from rendered images. Selectable text may be lost."
                : "Strong: aggressive image-based rebuild for maximum reduction. Quality loss and text flattening are expected."}
          </div>

          {mode === "strong" ? (
            <label className="flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-200">
              <input
                type="checkbox"
                className="mt-0.5"
                checked={allowStrongFlattening}
                onChange={(event) => setAllowStrongFlattening(event.target.checked)}
                disabled={isCompressing}
              />
              <span>
                Strong compression may flatten text into images and reduce readability at high zoom. I understand and want aggressive compression.
              </span>
            </label>
          ) : null}

          {(isCompressing || progress > 0) && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{isCompressing ? "Processing" : "Complete"}</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2 w-full" />
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-2 sm:flex-row">
          <Button
            type="button"
            className="w-full sm:w-auto"
            disabled={!canCompress}
            onClick={runCompression}
          >
            {isCompressing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Optimising...
              </>
            ) : (
              <>
                <ShieldAlert className="h-4 w-4" />
                Optimise PDF
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
              setMode("light")
              setAllowStrongFlattening(false)
              setProgress(0)
              setStatus("Upload a PDF to begin offline optimisation.")
              clearResult()
            }}
            disabled={isCompressing && !file}
          >
            <Trash2 className="h-4 w-4" />
            Reset
          </Button>
        </CardFooter>
      </Card>

      {result ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Optimised output</CardTitle>
            <CardDescription>
              {result.fileName} • {formatBytes(result.outputSize)}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <ProcessedLocallyBadge />

            <div className="grid gap-2 sm:grid-cols-3">
              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground">Before</p>
                <p className="text-sm font-medium text-foreground">{formatBytes(beforeSize)}</p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground">After</p>
                <p className="text-sm font-medium text-foreground">{formatBytes(afterSize)}</p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground">Saved</p>
                <p className="text-sm font-medium text-foreground">{savings.toFixed(1)}%</p>
              </div>
            </div>

            {result.flattened ? (
              <p className="rounded-md border border-amber-500/30 bg-amber-500/10 p-2 text-xs text-amber-200">
                This output was rebuilt from rendered page images for stronger compression. Selectable text may not be preserved.
              </p>
            ) : (
              <p className="rounded-md border bg-muted/20 p-2 text-xs text-muted-foreground">
                Light mode kept document structure where possible. Text should remain selectable in most cases.
              </p>
            )}

            <Button asChild className="w-full sm:w-auto">
              <a
                href={result.url}
                download={result.fileName}
                onClick={() => notifyLocalDownloadSuccess()}
              >
                <Download className="h-4 w-4" />
                Download optimised PDF
              </a>
            </Button>
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}
