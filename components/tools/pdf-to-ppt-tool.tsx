"use client"

import { Download, Loader2, Presentation, Trash2 } from "lucide-react"
import { useCallback, useMemo, useState } from "react"
import { Toaster, toast } from "sonner"

import { PdfFileDropzone } from "@/components/tools/shared/pdf-file-dropzone"
import { ProcessedLocallyBadge } from "@/components/tools/processed-locally-badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useObjectUrlState } from "@/hooks/use-object-url-state"
import {
  ensureSafeLocalFileSize,
  formatFileSize,
  isPdfLikeFile,
} from "@/lib/pdf-client-utils"
import { notifyLocalDownloadSuccess } from "@/lib/local-download-events"
import { getPdfJs } from "@/lib/pdfjs-loader"

type ScaleOption = 1 | 1.5 | 2
type OutputMode = "one-slide-per-page"

type ConversionResult = {
  fileName: string
  sizeBytes: number
  slideCount: number
}

type PptxModule = typeof import("pptxgenjs")
type PptxInstance = InstanceType<PptxModule["default"]>

const MAX_PDF_TO_PPT_BYTES = 200 * 1024 * 1024

const extractBaseName = (name: string) => name.replace(/\.pdf$/i, "")

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value))

const fitImageToSlide = (
  imageWidthPx: number,
  imageHeightPx: number,
  slideWidthIn: number,
  slideHeightIn: number
) => {
  const imageRatio = imageWidthPx / imageHeightPx
  const slideRatio = slideWidthIn / slideHeightIn

  if (imageRatio > slideRatio) {
    const width = slideWidthIn
    const height = width / imageRatio
    return { x: 0, y: (slideHeightIn - height) / 2, w: width, h: height }
  }

  const height = slideHeightIn
  const width = height * imageRatio
  return { x: (slideWidthIn - width) / 2, y: 0, w: width, h: height }
}

const buildPptBlob = async (
  pageImages: Array<{ dataUrl: string; width: number; height: number }>
) => {
  const pptxModule = (await import("pptxgenjs")) as PptxModule
  const PptxGenJS = pptxModule.default
  const pptx = new PptxGenJS() as PptxInstance

  const first = pageImages[0]
  if (!first) {
    throw new Error("No rendered pages were available for PPT export.")
  }

  const firstRatio = first.height / first.width
  const layoutWidth = 10
  const layoutHeight = clamp(layoutWidth * firstRatio, 5.625, 13.333)
  const layoutName = "PLAIN_LOCAL_PDF"
  pptx.defineLayout({ name: layoutName, width: layoutWidth, height: layoutHeight })
  pptx.layout = layoutName
  pptx.author = "plain.tools"
  pptx.subject = "PDF to PowerPoint (offline)"
  pptx.title = "PDF to PowerPoint export"
  pptx.company = "plain.tools"

  for (const image of pageImages) {
    const slide = pptx.addSlide()
    const placement = fitImageToSlide(
      image.width,
      image.height,
      layoutWidth,
      layoutHeight
    )
    slide.addImage({
      data: image.dataUrl,
      ...placement,
    })
  }

  const output = await pptx.write({ outputType: "blob" })
  if (output instanceof Blob) {
    return output
  }

  if (output instanceof ArrayBuffer) {
    return new Blob([new Uint8Array(output)], {
      type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    })
  }

  throw new Error("Unexpected PPT export output type.")
}

export default function PdfToPptTool() {
  const [file, setFile] = useState<File | null>(null)
  const [scale, setScale] = useState<ScaleOption>(1.5)
  const [outputMode, setOutputMode] = useState<OutputMode>("one-slide-per-page")
  const [isConverting, setIsConverting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState(
    "Upload a PDF to convert pages into a PowerPoint deck locally."
  )
  const [result, setResult] = useState<ConversionResult | null>(null)
  const { url: downloadUrl, clearUrl, setUrlFromBlob } = useObjectUrlState()

  const clearResult = useCallback(() => {
    clearUrl()
    setResult(null)
  }, [clearUrl])

  const handleFile = useCallback(
    (candidate: File) => {
      try {
        if (!isPdfLikeFile(candidate)) {
          toast.error("Only PDF files are supported.")
          return
        }

        ensureSafeLocalFileSize(candidate, MAX_PDF_TO_PPT_BYTES)
        setFile(candidate)
        setProgress(0)
        setStatus("Ready to convert.")
        clearResult()
      } catch (error) {
        const message = error instanceof Error ? error.message : "Could not use this file."
        setStatus(message)
        toast.error(message)
      }
    },
    [clearResult]
  )

  const canConvert = useMemo(() => Boolean(file && !isConverting), [file, isConverting])

  const runConversion = useCallback(async () => {
    if (!file) {
      toast.error("Upload a PDF first.")
      return
    }

    setIsConverting(true)
    setProgress(3)
    setStatus("Opening PDF locally...")
    clearResult()

    try {
      const pdfjs = await getPdfJs()
      const bytes = new Uint8Array(await file.arrayBuffer())
      const loadingTask = pdfjs.getDocument({
        data: bytes,
        disableAutoFetch: true,
        disableRange: true,
        disableStream: true,
      })

      const pageImages: Array<{ dataUrl: string; width: number; height: number }> = []

      try {
        const pdf = await loadingTask.promise
        for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
          setStatus(`Rendering page ${pageNumber} of ${pdf.numPages}...`)
          const page = await pdf.getPage(pageNumber)
          const viewport = page.getViewport({ scale })

          if (typeof document === "undefined") {
            throw new Error("PDF to PPT conversion requires a browser context.")
          }

          const canvas = document.createElement("canvas")
          canvas.width = Math.max(1, Math.ceil(viewport.width))
          canvas.height = Math.max(1, Math.ceil(viewport.height))

          const context = canvas.getContext("2d")
          if (!context) {
            throw new Error("Could not initialise canvas for slide rendering.")
          }

          await page.render({
            canvasContext: context,
            viewport,
            annotationMode: pdfjs.AnnotationMode.ENABLE,
          }).promise

          pageImages.push({
            dataUrl: canvas.toDataURL("image/png"),
            width: canvas.width,
            height: canvas.height,
          })

          canvas.width = 0
          canvas.height = 0
          setProgress(Math.min(90, Math.round((pageNumber / pdf.numPages) * 80) + 10))
        }
      } finally {
        await loadingTask.destroy()
      }

      if (!pageImages.length) {
        throw new Error("No pages were rendered from this PDF.")
      }

      setStatus("Building PowerPoint deck...")
      const pptBlob = await buildPptBlob(pageImages)
      const fileName = `${extractBaseName(file.name)}.pptx`
      setUrlFromBlob(pptBlob)
      setResult({
        fileName,
        sizeBytes: pptBlob.size,
        slideCount: pageImages.length,
      })
      setProgress(100)
      setStatus("Done. Your .pptx file is ready.")
      toast.success("PDF to PowerPoint conversion complete.")
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not convert this PDF."
      setStatus(message)
      toast.error(message)
    } finally {
      setIsConverting(false)
    }
  }, [clearResult, file, scale, setUrlFromBlob])

  return (
    <div className="space-y-6 overflow-x-hidden">
      <Toaster richColors position="top-right" />

      <Card className="border-blue-500/25 bg-card/80">
        <CardHeader>
          <CardTitle className="text-base">Best-effort offline conversion</CardTitle>
          <CardDescription>
            Best-effort offline conversion. Slides are image-based (text not editable). Files never leave your device.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <PdfFileDropzone
            disabled={isConverting}
            title="Drop a PDF here, or click to browse"
            subtitle="Convert each page into a PowerPoint slide locally"
            onFilesSelected={(files) => {
              const selected = files[0]
              if (selected) {
                handleFile(selected)
              }
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">PDF to PowerPoint options</CardTitle>
          <CardDescription className="break-words">{status}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {file ? (
            <div className="rounded-lg border bg-muted/30 p-3">
              <p className="truncate text-sm font-medium text-foreground">{file.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No PDF selected yet.</p>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Scale</p>
              <select
                value={String(scale)}
                onChange={(event) => setScale(Number(event.target.value) as ScaleOption)}
                className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                disabled={isConverting}
              >
                <option value="1">1x</option>
                <option value="1.5">1.5x</option>
                <option value="2">2x</option>
              </select>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Output</p>
              <select
                value={outputMode}
                onChange={(event) => setOutputMode(event.target.value as OutputMode)}
                className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                disabled={isConverting}
              >
                <option value="one-slide-per-page">One slide per page</option>
              </select>
            </div>
          </div>

          {(isConverting || progress > 0) && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{isConverting ? "Converting" : "Complete"}</span>
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
                <Presentation className="h-4 w-4" />
                Convert to PPT
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => {
              setFile(null)
              setScale(1.5)
              setOutputMode("one-slide-per-page")
              setProgress(0)
              setStatus("Upload a PDF to convert pages into a PowerPoint deck locally.")
              clearResult()
            }}
            disabled={isConverting && !file}
          >
            <Trash2 className="h-4 w-4" />
            Reset
          </Button>
        </CardFooter>
      </Card>

      {result && downloadUrl ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Download PowerPoint</CardTitle>
            <CardDescription>
              {result.fileName} • {formatFileSize(result.sizeBytes)}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <ProcessedLocallyBadge />
            <p className="text-xs text-muted-foreground">
              {result.slideCount} slide{result.slideCount === 1 ? "" : "s"} generated.
            </p>
            <Button asChild className="w-full sm:w-auto">
              <a
                href={downloadUrl}
                download={result.fileName}
                onClick={() => notifyLocalDownloadSuccess()}
              >
                <Download className="h-4 w-4" />
                Download .pptx
              </a>
            </Button>
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}
