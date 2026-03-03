"use client"

import { zipSync } from "fflate"
import { Download, FileText, Image as ImageIcon, Loader2, Trash2, UploadCloud } from "lucide-react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { toast, Toaster } from "sonner"

import { Button } from "@/components/ui/button"
import { ProcessedLocallyBadge } from "@/components/tools/processed-locally-badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { getPdfJs } from "@/lib/pdfjs-loader"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

type ConvertMode = "images" | "text"
type ImageFormat = "png" | "jpeg"
type DpiOption = 72 | 150 | 300

type ConversionOutput = {
  url: string
  fileName: string
  sizeBytes: number
}

type PdfPageLike = {
  getViewport: (parameters: { scale: number }) => { width: number; height: number }
  render: (parameters: {
    canvasContext: CanvasRenderingContext2D
    viewport: unknown
    annotationMode: number
  }) => { promise: Promise<unknown> }
  getTextContent: () => Promise<{ items: Array<unknown> }>
}

type PdfJsModule = Awaited<ReturnType<typeof getPdfJs>>

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

const extractBaseName = (fileName: string) => fileName.replace(/\.pdf$/i, "")

const countPdfPages = async (file: File): Promise<number> => {
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
    return sourcePdf.numPages
  } finally {
    await loadingTask.destroy()
  }
}

const renderPdfPageToBlob = async (
  page: PdfPageLike,
  pdfjs: PdfJsModule,
  format: ImageFormat,
  dpi: DpiOption,
  jpegQuality: number
) => {
  const scale = dpi / 72
  const viewport = page.getViewport({ scale })
  const canvas = document.createElement("canvas")
  canvas.width = Math.max(1, Math.ceil(viewport.width))
  canvas.height = Math.max(1, Math.ceil(viewport.height))

  const context = canvas.getContext("2d")
  if (!context) {
    throw new Error("Could not initialise canvas for image conversion.")
  }

  await page.render({ canvasContext: context, viewport, annotationMode: pdfjs.AnnotationMode.ENABLE }).promise

  const mimeType = format === "png" ? "image/png" : "image/jpeg"
  const quality = format === "jpeg" ? jpegQuality / 100 : undefined

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (result) => {
        if (!result) {
          reject(new Error("Could not export rendered page."))
          return
        }
        resolve(result)
      },
      mimeType,
      quality
    )
  })

  canvas.width = 0
  canvas.height = 0

  return blob
}

const extractPageText = async (page: PdfPageLike) => {
  const content = await page.getTextContent()
  return content.items
    .map((item) =>
      typeof (item as { str?: string }).str === "string"
        ? ((item as { str?: string }).str as string)
        : ""
    )
    .join(" ")
    .replace(/\s+/g, " ")
    .trim()
}

export default function ConvertTool() {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [file, setFile] = useState<File | null>(null)
  const [pageCount, setPageCount] = useState<number | null>(null)
  const [mode, setMode] = useState<ConvertMode>("images")
  const [imageFormat, setImageFormat] = useState<ImageFormat>("png")
  const [dpi, setDpi] = useState<DpiOption>(150)
  const [jpegQuality, setJpegQuality] = useState(85)
  const [isDragging, setIsDragging] = useState(false)
  const [isConverting, setIsConverting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState("Upload a PDF to begin conversion.")
  const [output, setOutput] = useState<ConversionOutput | null>(null)

  useEffect(() => {
    return () => {
      if (output?.url) {
        URL.revokeObjectURL(output.url)
      }
    }
  }, [output])

  const resetOutput = useCallback(() => {
    if (output?.url) {
      URL.revokeObjectURL(output.url)
    }
    setOutput(null)
  }, [output])

  const handleIncomingFile = useCallback(
    async (candidate: File) => {
      if (!isPdfFile(candidate)) {
        toast.error("Only PDF files are supported.")
        return
      }

      setFile(candidate)
      setPageCount(null)
      setProgress(0)
      setStatus("Reading PDF metadata...")
      resetOutput()

      try {
        const pages = await countPdfPages(candidate)
        setPageCount(pages)
        setStatus(`Ready. ${pages} page${pages === 1 ? "" : "s"} detected.`)
        toast.success("PDF loaded.")
      } catch (error) {
        setFile(null)
        setPageCount(null)
        setStatus("Could not load PDF metadata.")
        const message =
          error instanceof Error ? error.message : "Failed to read this PDF file."
        toast.error(message)
      }
    },
    [resetOutput]
  )

  const canConvert = useMemo(
    () => Boolean(file && pageCount && !isConverting),
    [file, pageCount, isConverting]
  )

  const runConversion = useCallback(async () => {
    if (!file) {
      toast.error("Upload a PDF first.")
      return
    }

    setIsConverting(true)
    setProgress(2)
    setStatus("Opening PDF locally...")
    resetOutput()

    try {
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
        const totalPages = sourcePdf.numPages
        const baseName = extractBaseName(file.name)

        if (mode === "images") {
          const pageBlobs: Blob[] = []

          for (let index = 0; index < totalPages; index++) {
            setStatus(`Rendering page ${index + 1} of ${totalPages}...`)
            const page = (await sourcePdf.getPage(index + 1)) as unknown as PdfPageLike
            const blob = await renderPdfPageToBlob(page, pdfjs, imageFormat, dpi, jpegQuality)
            pageBlobs.push(blob)
            setProgress(Math.round(((index + 1) / totalPages) * 100))
          }

          if (pageBlobs.length > 1) {
            const extension = imageFormat === "png" ? "png" : "jpg"
            const zipEntries: Record<string, Uint8Array> = {}

            for (let index = 0; index < pageBlobs.length; index++) {
              const bytes = new Uint8Array(await pageBlobs[index].arrayBuffer())
              zipEntries[`page-${String(index + 1).padStart(3, "0")}.${extension}`] = bytes
            }

            const zipBytes = zipSync(zipEntries, { level: 6 })
            const zipBlob = new Blob([zipBytes], { type: "application/zip" })
            const fileName = `${baseName}-images.zip`
            const url = URL.createObjectURL(zipBlob)

            setOutput({
              url,
              fileName,
              sizeBytes: zipBlob.size,
            })
            setStatus(`Done. ${totalPages} images zipped and ready to download.`)
          } else {
            const extension = imageFormat === "png" ? "png" : "jpg"
            const imageBlob = pageBlobs[0]
            const fileName = `${baseName}-page-1.${extension}`
            const url = URL.createObjectURL(imageBlob)

            setOutput({
              url,
              fileName,
              sizeBytes: imageBlob.size,
            })
            setStatus("Done. Image is ready to download.")
          }
        } else {
          const pageTexts: string[] = []

          for (let index = 0; index < totalPages; index++) {
            setStatus(`Extracting text from page ${index + 1} of ${totalPages}...`)
            const page = (await sourcePdf.getPage(index + 1)) as unknown as PdfPageLike
            const pageText = await extractPageText(page)
            pageTexts.push(pageText)
            setProgress(Math.round(((index + 1) / totalPages) * 100))
          }

          const fullText = pageTexts
            .map((pageText, index) => `--- Page ${index + 1} ---\n${pageText}`)
            .join("\n\n")
            .trim()

          const textBlob = new Blob([fullText], {
            type: "text/plain;charset=utf-8",
          })
          const fileName = `${baseName}.txt`
          const url = URL.createObjectURL(textBlob)

          setOutput({
            url,
            fileName,
            sizeBytes: textBlob.size,
          })
          setStatus("Done. Text export is ready to download.")
        }

        toast.success("Conversion complete.")
        setProgress(100)
      } finally {
        await loadingTask.destroy()
      }
    } catch (error) {
      setStatus("Conversion failed.")
      const message =
        error instanceof Error ? error.message : "Conversion failed. Please try another file."
      toast.error(message)
    } finally {
      setIsConverting(false)
    }
  }, [dpi, file, imageFormat, jpegQuality, mode, resetOutput])

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
            onDrop={(event) => {
              event.preventDefault()
              setIsDragging(false)
              const dropped = event.dataTransfer.files[0]
              if (dropped) {
                void handleIncomingFile(dropped)
              }
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
            <p className="text-sm font-medium text-foreground">Drop a PDF here, or click to browse</p>
            <p className="mt-1 text-xs text-muted-foreground">
              100% local processing. Files never leave your device.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Convert PDF</CardTitle>
          <CardDescription className="break-words">{status}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {file ? (
            <div className="flex flex-col gap-3 rounded-lg border bg-muted/30 p-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">{file.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {formatBytes(file.size)}
                  {typeof pageCount === "number" ? ` • ${pageCount} page${pageCount === 1 ? "" : "s"}` : ""}
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                className="w-full sm:w-auto"
                onClick={() => {
                  setFile(null)
                  setPageCount(null)
                  setProgress(0)
                  setStatus("Upload a PDF to begin conversion.")
                  resetOutput()
                }}
                disabled={isConverting}
              >
                <Trash2 className="h-4 w-4" />
                Remove
              </Button>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No PDF selected yet.</p>
          )}

          <Tabs
            value={mode}
            onValueChange={(value) => {
              if (value === "images" || value === "text") {
                setMode(value)
              }
            }}
          >
            <TabsList className="grid h-auto w-full grid-cols-1 sm:grid-cols-2">
              <TabsTrigger value="images" className="h-10">
                <ImageIcon className="h-4 w-4" />
                PDF to Images
              </TabsTrigger>
              <TabsTrigger value="text" className="h-10">
                <FileText className="h-4 w-4" />
                PDF to Text
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {mode === "images" ? (
            <div className="space-y-4 rounded-lg border p-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="convert-format">Image format</Label>
                  <select
                    id="convert-format"
                    value={imageFormat}
                    onChange={(event) => setImageFormat(event.target.value as ImageFormat)}
                    className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                    disabled={isConverting}
                  >
                    <option value="png">PNG</option>
                    <option value="jpeg">JPEG</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="convert-dpi">DPI</Label>
                  <select
                    id="convert-dpi"
                    value={dpi}
                    onChange={(event) => setDpi(Number(event.target.value) as DpiOption)}
                    className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                    disabled={isConverting}
                  >
                    <option value={72}>72 dpi</option>
                    <option value={150}>150 dpi</option>
                    <option value={300}>300 dpi</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="jpeg-quality">JPEG quality</Label>
                  <span className="text-xs text-muted-foreground">{jpegQuality}%</span>
                </div>
                <Slider
                  id="jpeg-quality"
                  min={40}
                  max={100}
                  step={1}
                  value={[jpegQuality]}
                  onValueChange={(value) => {
                    const next = value[0]
                    if (typeof next === "number") {
                      setJpegQuality(next)
                    }
                  }}
                  disabled={isConverting || imageFormat !== "jpeg"}
                />
                <p className="text-xs text-muted-foreground">
                  JPEG quality applies only when format is JPEG.
                </p>
              </div>
            </div>
          ) : (
            <div className="rounded-lg border p-4 text-sm text-muted-foreground">
              Text extraction uses PDF.js `getTextContent()` on each page and exports one plain `.txt` file.
            </div>
          )}

          {(isConverting || progress > 0) && (
            <div className="space-y-2">
              <div className="flex min-w-0 items-center justify-between gap-2 text-xs text-muted-foreground">
                <span className="min-w-0 flex-1 truncate">{isConverting ? "Converting" : "Complete"}</span>
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
            disabled={!canConvert}
            onClick={runConversion}
          >
            {isConverting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Converting...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Convert
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => {
              setMode("images")
              setImageFormat("png")
              setDpi(150)
              setJpegQuality(85)
              setProgress(0)
              setStatus(file ? "Ready to convert." : "Upload a PDF to begin conversion.")
              resetOutput()
            }}
            disabled={isConverting}
          >
            <Trash2 className="h-4 w-4" />
            Reset
          </Button>
        </CardFooter>
      </Card>

      {output ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Conversion Output</CardTitle>
            <CardDescription className="break-words">
              {output.fileName} • {formatBytes(output.sizeBytes)}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <ProcessedLocallyBadge />
            <Button asChild className="w-full sm:w-auto">
              <a href={output.url} download={output.fileName}>
                <Download className="h-4 w-4" />
                Download {output.fileName.endsWith(".zip") ? "ZIP" : output.fileName.endsWith(".txt") ? "Text" : "Image"}
              </a>
            </Button>
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}
