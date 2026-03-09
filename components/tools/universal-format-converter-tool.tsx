"use client"

import jsPDF from "jspdf"
import { Download, FileOutput, Loader2, Trash2, UploadCloud } from "lucide-react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Toaster, toast } from "sonner"

import { ProcessedLocallyBadge } from "@/components/tools/processed-locally-badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { notifyLocalDownloadSuccess } from "@/lib/local-download-events"
import { getPdfJs } from "@/lib/pdfjs-loader"
import { blobToUint8Array, downloadZip, makeZip } from "@/lib/zip-download"

type UniversalFormatConverterToolProps = {
  from: string
  fromLabel: string
  to: string
  toLabel: string
}

type OutputFile =
  | {
      fileName: string
      imageCount?: number
      kind: "single"
      sizeBytes: number
      url: string
    }
  | {
      fileName: string
      imageCount: number
      kind: "zip"
      sizeBytes: number
      zipBytes: Uint8Array
    }

type PdfPageLike = {
  getTextContent: () => Promise<{ items: Array<unknown> }>
  getViewport: (parameters: { scale: number }) => { width: number; height: number }
  render: (parameters: {
    annotationMode: number
    canvasContext: CanvasRenderingContext2D
    viewport: unknown
  }) => { promise: Promise<unknown> }
}

type PdfJsModule = Awaited<ReturnType<typeof getPdfJs>>

const IMAGE_ACCEPTS: Record<string, string> = {
  avif: "image/avif,.avif",
  bmp: "image/bmp,.bmp",
  gif: "image/gif,.gif",
  heic: ".heic,image/heic",
  heif: ".heif,image/heif",
  ico: "image/x-icon,.ico",
  jfif: "image/jpeg,.jfif",
  jpeg: "image/jpeg,.jpeg,.jpg",
  jpg: "image/jpeg,.jpg,.jpeg",
  png: "image/png,.png",
  svg: "image/svg+xml,.svg",
  tif: "image/tiff,.tif",
  tiff: "image/tiff,.tiff,.tif",
  webp: "image/webp,.webp",
}

const IMAGE_OUTPUT_MIME_TYPES: Record<string, string> = {
  avif: "image/avif",
  jpeg: "image/jpeg",
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
}

const PDF_LIKE_SOURCE = new Set(["pdf"])
const TEXT_OUTPUTS = new Set(["text", "txt"])
const LOSSY_OUTPUTS = new Set(["jpg", "jpeg", "webp", "avif"])

const formatBytes = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`
  const kilobytes = bytes / 1024
  if (kilobytes < 1024) return `${kilobytes.toFixed(1)} KB`
  const megabytes = kilobytes / 1024
  if (megabytes < 1024) return `${megabytes.toFixed(2)} MB`
  return `${(megabytes / 1024).toFixed(2)} GB`
}

function getAcceptAttribute(from: string) {
  if (from === "pdf") return "application/pdf,.pdf"
  return IMAGE_ACCEPTS[from] ?? "image/*"
}

function toOutputFileName(sourceFileName: string, nextExtension: string) {
  const base = sourceFileName.replace(/\.[^.]+$/u, "")
  return `${base}.${nextExtension}`
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result)
        return
      }
      reject(new Error(`Could not read ${file.name}.`))
    }
    reader.onerror = () => reject(new Error(`Could not read ${file.name}.`))
    reader.readAsDataURL(file)
  })
}

async function loadImageFromFile(file: File) {
  const dataUrl = await readFileAsDataUrl(file)

  return await new Promise<{
    dataUrl: string
    element: HTMLImageElement
    height: number
    width: number
  }>((resolve, reject) => {
    const image = new window.Image()
    image.onload = () =>
      resolve({
        dataUrl,
        element: image,
        height: image.naturalHeight,
        width: image.naturalWidth,
      })
    image.onerror = () =>
      reject(
        new Error(
          "This browser could not decode the selected file locally. Try a more compatible format such as PNG or JPG."
        )
      )
    image.src = dataUrl
  })
}

function canvasToBlob(canvas: HTMLCanvasElement, to: string, quality: number) {
  const mimeType = IMAGE_OUTPUT_MIME_TYPES[to]
  const blobQuality = LOSSY_OUTPUTS.has(to) ? quality / 100 : undefined

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(
            new Error(
              `This browser could not export ${to.toUpperCase()} locally. Try PNG or JPG instead.`
            )
          )
          return
        }
        resolve(blob)
      },
      mimeType,
      blobQuality
    )
  })
}

async function renderPdfPageToBlob(
  page: PdfPageLike,
  pdfjs: PdfJsModule,
  outputFormat: string,
  quality: number
) {
  const viewport = page.getViewport({ scale: 1.5 })
  const canvas = document.createElement("canvas")
  canvas.width = Math.max(1, Math.ceil(viewport.width))
  canvas.height = Math.max(1, Math.ceil(viewport.height))

  const context = canvas.getContext("2d")
  if (!context) {
    throw new Error("Could not initialise the canvas for PDF rendering.")
  }

  await page.render({
    annotationMode: pdfjs.AnnotationMode.ENABLE,
    canvasContext: context,
    viewport,
  }).promise

  const blob = await canvasToBlob(canvas, outputFormat, quality)
  canvas.width = 0
  canvas.height = 0
  return blob
}

async function extractPdfText(page: PdfPageLike) {
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

export default function UniversalFormatConverterTool({
  from,
  fromLabel,
  to,
  toLabel,
}: UniversalFormatConverterToolProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isConverting, setIsConverting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [quality, setQuality] = useState(88)
  const [status, setStatus] = useState(`Choose a ${fromLabel} file to convert locally.`)
  const [output, setOutput] = useState<OutputFile | null>(null)

  useEffect(() => {
    return () => {
      if (output?.kind === "single") {
        URL.revokeObjectURL(output.url)
      }
    }
  }, [output])

  const isPdfSource = PDF_LIKE_SOURCE.has(from)
  const isTextOutput = TEXT_OUTPUTS.has(to)
  const canUseQuality = LOSSY_OUTPUTS.has(to)

  const clearOutput = useCallback(() => {
    if (output?.kind === "single") {
      URL.revokeObjectURL(output.url)
    }
    setOutput(null)
  }, [output])

  const resetAll = useCallback(() => {
    setFile(null)
    setProgress(0)
    setStatus(`Choose a ${fromLabel} file to convert locally.`)
    clearOutput()
  }, [clearOutput, fromLabel])

  const handleFile = useCallback(
    (candidate: File) => {
      setFile(candidate)
      setProgress(0)
      setStatus(`Ready to convert ${candidate.name} from ${fromLabel} to ${toLabel}.`)
      clearOutput()
    },
    [clearOutput, fromLabel, toLabel]
  )

  const runImageConversion = useCallback(async () => {
    if (!file) return

    const image = await loadImageFromFile(file)

    if (to === "pdf") {
      const pdf = new jsPDF({
        compress: true,
        format: [image.width, image.height],
        orientation: image.width >= image.height ? "landscape" : "portrait",
        unit: "pt",
      })
      pdf.addImage(
        image.dataUrl,
        file.type.toLowerCase().includes("png") || from === "png" || from === "svg" ? "PNG" : "JPEG",
        0,
        0,
        image.width,
        image.height,
        undefined,
        "FAST"
      )
      const blob = pdf.output("blob")
      const url = URL.createObjectURL(blob)
      setOutput({
        kind: "single",
        fileName: toOutputFileName(file.name, "pdf"),
        sizeBytes: blob.size,
        url,
      })
      return
    }

    const canvas = document.createElement("canvas")
    canvas.width = Math.max(1, image.width)
    canvas.height = Math.max(1, image.height)
    const context = canvas.getContext("2d")
    if (!context) {
      throw new Error("Could not initialise the canvas for image conversion.")
    }

    context.drawImage(image.element, 0, 0)
    const blob = await canvasToBlob(canvas, to, quality)
    canvas.width = 0
    canvas.height = 0

    const url = URL.createObjectURL(blob)
    setOutput({
      kind: "single",
      fileName: toOutputFileName(file.name, to === "jpeg" ? "jpeg" : to),
      sizeBytes: blob.size,
      url,
    })
  }, [file, from, quality, to])

  const runPdfConversion = useCallback(async () => {
    if (!file) return

    const pdfjs = await getPdfJs()
    const bytes = new Uint8Array(await file.arrayBuffer())
    const loadingTask = pdfjs.getDocument({
      data: bytes,
      disableAutoFetch: true,
      disableRange: true,
      disableStream: true,
    })

    try {
      const sourcePdf = await loadingTask.promise
      const totalPages = sourcePdf.numPages

      if (isTextOutput) {
        const pageTexts: string[] = []
        for (let index = 0; index < totalPages; index += 1) {
          setStatus(`Extracting text from page ${index + 1} of ${totalPages}...`)
          const page = (await sourcePdf.getPage(index + 1)) as unknown as PdfPageLike
          pageTexts.push(await extractPdfText(page))
          setProgress(Math.round(((index + 1) / totalPages) * 100))
        }

        const blob = new Blob(
          [
            pageTexts
              .map((pageText, index) => `--- Page ${index + 1} ---\n${pageText}`)
              .join("\n\n"),
          ],
          { type: "text/plain;charset=utf-8" }
        )
        const url = URL.createObjectURL(blob)
        setOutput({
          kind: "single",
          fileName: toOutputFileName(file.name, "txt"),
          sizeBytes: blob.size,
          url,
        })
        return
      }

      const imageEntries: Array<{ data: Uint8Array; name: string }> = []
      let singleBlob: Blob | null = null
      let singleName = ""

      for (let index = 0; index < totalPages; index += 1) {
        setStatus(`Rendering page ${index + 1} of ${totalPages}...`)
        const page = (await sourcePdf.getPage(index + 1)) as unknown as PdfPageLike
        const blob = await renderPdfPageToBlob(page, pdfjs, to, quality)
        const name = `${file.name.replace(/\.pdf$/iu, "")}-page-${String(index + 1).padStart(3, "0")}.${to}`

        if (totalPages === 1) {
          singleBlob = blob
          singleName = name
        } else {
          imageEntries.push({
            data: await blobToUint8Array(blob),
            name,
          })
        }
        setProgress(Math.round(((index + 1) / totalPages) * 100))
      }

      if (singleBlob) {
        const url = URL.createObjectURL(singleBlob)
        setOutput({
          kind: "single",
          fileName: singleName,
          imageCount: 1,
          sizeBytes: singleBlob.size,
          url,
        })
        return
      }

      const zipBytes = makeZip(imageEntries)
      setOutput({
        kind: "zip",
        fileName: `${file.name.replace(/\.pdf$/iu, "")}-${to}-output.zip`,
        imageCount: imageEntries.length,
        sizeBytes: zipBytes.byteLength,
        zipBytes,
      })
    } finally {
      await loadingTask.destroy()
    }
  }, [file, isTextOutput, quality, to])

  const runConversion = useCallback(async () => {
    if (!file) {
      toast.error(`Choose a ${fromLabel} file first.`)
      return
    }

    setIsConverting(true)
    setProgress(4)
    setStatus(`Starting ${fromLabel} to ${toLabel} conversion locally...`)
    clearOutput()

    try {
      if (isPdfSource) {
        await runPdfConversion()
      } else {
        await runImageConversion()
      }

      setProgress(100)
      setStatus(`Done. Your ${toLabel} file is ready to download.`)
      toast.success(`${fromLabel} to ${toLabel} conversion complete.`)
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Conversion failed. Please try a different file."
      setStatus("Conversion failed.")
      toast.error(message)
    } finally {
      setIsConverting(false)
    }
  }, [clearOutput, file, fromLabel, isPdfSource, runImageConversion, runPdfConversion, toLabel])

  const canConvert = useMemo(() => Boolean(file && !isConverting), [file, isConverting])

  return (
    <div className="space-y-6 overflow-x-hidden notranslate" translate="no">
      <Toaster richColors position="top-right" />

      <input
        ref={fileInputRef}
        type="file"
        accept={getAcceptAttribute(from)}
        className="hidden"
        onChange={(event) => {
          const selected = event.target.files?.[0]
          if (selected) {
            handleFile(selected)
          }
          event.currentTarget.value = ""
        }}
      />

      <Card className="border-blue-500/25 bg-card/80">
        <CardHeader>
          <CardTitle className="text-base">Best-effort local {fromLabel} to {toLabel}</CardTitle>
          <CardDescription>
            Browser-only workflow. No upload for the core conversion path.
          </CardDescription>
        </CardHeader>
      </Card>

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
                handleFile(dropped)
              }
            }}
            className={`cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition-colors sm:p-10 ${
              isDragging ? "border-primary bg-primary/10" : "border-border bg-muted/20 hover:border-primary/70"
            }`}
          >
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <UploadCloud className="h-6 w-6 text-primary" />
            </div>
            <p className="text-sm font-medium text-foreground">
              Drop a {fromLabel} file here, or click to browse
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              100% local processing where your browser supports the format.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">
            {fromLabel} to {toLabel} options
          </CardTitle>
          <CardDescription className="break-words">{status}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {file ? (
            <div className="rounded-lg border bg-muted/30 p-3">
              <p className="truncate text-sm font-medium text-foreground">{file.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">{formatBytes(file.size)}</p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No file selected yet.</p>
          )}

          {canUseQuality ? (
            <div className="space-y-2 rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="quality-slider">Output quality</Label>
                <span className="text-xs text-muted-foreground">{quality}%</span>
              </div>
              <Slider
                id="quality-slider"
                min={55}
                max={100}
                step={1}
                value={[quality]}
                onValueChange={(value) => {
                  const next = value[0]
                  if (typeof next === "number") {
                    setQuality(next)
                  }
                }}
                disabled={isConverting}
              />
              <p className="text-xs text-muted-foreground">
                Lower quality usually means a smaller file. PNG and PDF ignore this setting.
              </p>
            </div>
          ) : null}

          {(isConverting || progress > 0) ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{isConverting ? "Converting" : "Complete"}</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2 w-full" />
            </div>
          ) : null}
        </CardContent>

        <CardFooter className="flex flex-col gap-2 sm:flex-row">
          <Button type="button" className="w-full sm:w-auto" disabled={!canConvert} onClick={runConversion}>
            {isConverting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Converting...
              </>
            ) : (
              <>
                <FileOutput className="h-4 w-4" />
                Convert locally
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto"
            onClick={resetAll}
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
            <CardTitle className="text-base">{toLabel} output ready</CardTitle>
            <CardDescription>
              {output.fileName} • {formatBytes(output.sizeBytes)}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <ProcessedLocallyBadge />
            {"imageCount" in output && typeof output.imageCount === "number" ? (
              <p className="text-xs text-muted-foreground">
                {output.imageCount} output file{output.imageCount === 1 ? "" : "s"} generated.
              </p>
            ) : null}

            {output.kind === "single" ? (
              <Button asChild className="w-full sm:w-auto">
                <a href={output.url} download={output.fileName} onClick={() => notifyLocalDownloadSuccess()}>
                  <Download className="h-4 w-4" />
                  Download {output.fileName}
                </a>
              </Button>
            ) : (
              <Button
                type="button"
                className="w-full sm:w-auto"
                onClick={() => {
                  downloadZip(output.zipBytes, output.fileName)
                  notifyLocalDownloadSuccess()
                }}
              >
                <Download className="h-4 w-4" />
                Download ZIP
              </Button>
            )}
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}
