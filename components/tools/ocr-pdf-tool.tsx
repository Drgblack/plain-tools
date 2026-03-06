"use client"

import { Download, Loader2, ScanText, Trash2 } from "lucide-react"
import { PDFDocument, StandardFonts, rgb } from "pdf-lib"
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
import { getPdfJs } from "@/lib/pdfjs-loader"
import { notifyLocalDownloadSuccess } from "@/lib/local-download-events"

type OcrLanguage = "eng" | "deu"
type OutputMode = "searchable-pdf" | "text-only"

type OcrWord = {
  text?: string
  bbox?: {
    x0: number
    y0: number
    x1: number
    y1: number
  }
}

type OcrPageData = {
  label: string
  canvas: HTMLCanvasElement
  pointWidth: number
  pointHeight: number
  scale: number
}

type ToolResult = {
  fileName: string
  sizeBytes: number
  pageCount: number
  textLength: number
}

const MAX_OCR_INPUT_BYTES = 120 * 1024 * 1024
const DEFAULT_RENDER_SCALE = 1.6

const isImageFile = (file: File) => file.type.startsWith("image/")

const extractBaseName = (name: string) =>
  name.replace(/\.[^/.]+$/, "")

const buildTextOutput = (pageTexts: string[]) =>
  pageTexts
    .map((text, index) => `Page ${index + 1}\n${text.trim()}`)
    .join("\n\n")
    .trim()

const loadImageToCanvas = async (file: File): Promise<OcrPageData> => {
  const objectUrl = URL.createObjectURL(file)
  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = () => reject(new Error("Could not decode this image file for OCR."))
      img.src = objectUrl
    })

    const canvas = document.createElement("canvas")
    canvas.width = Math.max(1, image.naturalWidth || image.width)
    canvas.height = Math.max(1, image.naturalHeight || image.height)

    const context = canvas.getContext("2d")
    if (!context) {
      throw new Error("Could not initialise image canvas for OCR.")
    }

    context.drawImage(image, 0, 0, canvas.width, canvas.height)
    return {
      label: file.name,
      canvas,
      pointWidth: canvas.width,
      pointHeight: canvas.height,
      scale: 1,
    }
  } finally {
    URL.revokeObjectURL(objectUrl)
  }
}

const loadPdfPagesToCanvas = async (
  file: File,
  scale: number,
  setStatus: (value: string) => void,
  setProgress: (value: number) => void
) => {
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
    const pages: OcrPageData[] = []
    for (let index = 0; index < pdf.numPages; index += 1) {
      const pageNumber = index + 1
      setStatus(`Rendering page ${pageNumber} of ${pdf.numPages} for OCR...`)
      const page = await pdf.getPage(pageNumber)
      const renderViewport = page.getViewport({ scale })
      const pointViewport = page.getViewport({ scale: 1 })

      const canvas = document.createElement("canvas")
      canvas.width = Math.max(1, Math.ceil(renderViewport.width))
      canvas.height = Math.max(1, Math.ceil(renderViewport.height))

      const context = canvas.getContext("2d")
      if (!context) {
        throw new Error("Could not initialise canvas for OCR rendering.")
      }

      await page.render({
        canvas,
        canvasContext: context,
        viewport: renderViewport,
        annotationMode: pdfjs.AnnotationMode.ENABLE,
      }).promise

      pages.push({
        label: `Page ${pageNumber}`,
        canvas,
        pointWidth: pointViewport.width,
        pointHeight: pointViewport.height,
        scale,
      })
      setProgress(Math.min(28, Math.round((pageNumber / pdf.numPages) * 24) + 4))
    }

    return pages
  } finally {
    await loadingTask.destroy()
  }
}

export default function OcrPdfTool() {
  const [file, setFile] = useState<File | null>(null)
  const [language, setLanguage] = useState<OcrLanguage>("eng")
  const [outputMode, setOutputMode] = useState<OutputMode>("searchable-pdf")
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState(
    "Upload a scanned PDF or image to run OCR locally."
  )
  const [result, setResult] = useState<ToolResult | null>(null)
  const { url: downloadUrl, clearUrl, setUrlFromBlob } = useObjectUrlState()

  const clearResult = useCallback(() => {
    clearUrl()
    setResult(null)
  }, [clearUrl])

  const handleFile = useCallback(
    (candidate: File) => {
      try {
        const supported = isPdfLikeFile(candidate) || isImageFile(candidate)
        if (!supported) {
          toast.error("Only PDF or image files are supported for OCR.")
          return
        }

        ensureSafeLocalFileSize(candidate, MAX_OCR_INPUT_BYTES)
        setFile(candidate)
        setProgress(0)
        setStatus("Ready to run offline OCR.")
        clearResult()
      } catch (error) {
        const message = error instanceof Error ? error.message : "Could not use this file."
        setStatus(message)
        toast.error(message)
      }
    },
    [clearResult]
  )

  const canRun = useMemo(
    () => Boolean(file && !isRunning),
    [file, isRunning]
  )

  const runOcr = useCallback(async () => {
    if (!file) {
      toast.error("Upload a file first.")
      return
    }

    setIsRunning(true)
    setProgress(2)
    setStatus("Loading OCR engine (first run can take longer)...")
    clearResult()

    const pages: OcrPageData[] = []

    try {
      const [{ createWorker, OEM }] = await Promise.all([import("tesseract.js")])

      if (isPdfLikeFile(file)) {
        pages.push(
          ...(await loadPdfPagesToCanvas(file, DEFAULT_RENDER_SCALE, setStatus, setProgress))
        )
      } else {
        setStatus("Preparing image for OCR...")
        pages.push(await loadImageToCanvas(file))
        setProgress(18)
      }

      if (!pages.length) {
        throw new Error("No pages/images were available for OCR.")
      }

      const worker = await createWorker(language, OEM.LSTM_ONLY, {
        logger: (log) => {
          if (typeof log.progress === "number") {
            const current = Math.round(log.progress * 100)
            setProgress((previous) => Math.max(previous, Math.min(92, current)))
          }
        },
      })

      const pageTexts: string[] = []
      const outputPdf = outputMode === "searchable-pdf" ? await PDFDocument.create() : null
      const ocrFont = outputPdf ? await outputPdf.embedFont(StandardFonts.Helvetica) : null

      try {
        for (let index = 0; index < pages.length; index += 1) {
          const pageData = pages[index]
          setStatus(`Running OCR on ${pageData.label} (${index + 1}/${pages.length})...`)
          const ocrResult = await worker.recognize(pageData.canvas)
          const words = (ocrResult.data.words ?? []) as OcrWord[]
          const text = (ocrResult.data.text ?? "").trim()
          pageTexts.push(text)

          if (outputPdf && ocrFont) {
            const imageDataUrl = pageData.canvas.toDataURL("image/jpeg", 0.9)
            const image = await outputPdf.embedJpg(imageDataUrl)
            const outputPage = outputPdf.addPage([pageData.pointWidth, pageData.pointHeight])

            outputPage.drawImage(image, {
              x: 0,
              y: 0,
              width: pageData.pointWidth,
              height: pageData.pointHeight,
            })

            for (const word of words) {
              const raw = (word.text ?? "").trim()
              const bbox = word.bbox
              if (!raw || !bbox) continue

              const x = bbox.x0 / pageData.scale
              const y = pageData.pointHeight - bbox.y1 / pageData.scale
              const lineHeight = Math.max(
                6,
                (bbox.y1 - bbox.y0) / pageData.scale
              )

              outputPage.drawText(raw, {
                x,
                y,
                size: lineHeight,
                font: ocrFont,
                color: rgb(0, 0, 0),
                opacity: 0,
              })
            }
          }

          const progressValue = Math.round(30 + ((index + 1) / pages.length) * 64)
          setProgress(Math.min(96, progressValue))
        }
      } finally {
        await worker.terminate()
      }

      const extractedText = buildTextOutput(pageTexts)
      const baseName = extractBaseName(file.name)

      if (outputMode === "text-only") {
        const outputText = extractedText || "(No text detected.)"
        const blob = new Blob([outputText], { type: "text/plain;charset=utf-8" })
        setUrlFromBlob(blob)
        setResult({
          fileName: `${baseName}-ocr.txt`,
          sizeBytes: blob.size,
          pageCount: pages.length,
          textLength: outputText.length,
        })
      } else {
        if (!outputPdf) {
          throw new Error("Searchable PDF output could not be initialised.")
        }
        const bytes = await outputPdf.save({ useObjectStreams: true })
        const blob = new Blob([bytes], { type: "application/pdf" })
        setUrlFromBlob(blob)
        setResult({
          fileName: `${baseName}-ocr-searchable.pdf`,
          sizeBytes: blob.size,
          pageCount: pages.length,
          textLength: extractedText.length,
        })
      }

      setProgress(100)
      setStatus("OCR complete. Output is ready for download.")
      toast.success("Offline OCR complete.")
    } catch (error) {
      const message = error instanceof Error ? error.message : "OCR failed."
      setStatus(message)
      toast.error(message)
    } finally {
      for (const page of pages) {
        page.canvas.width = 0
        page.canvas.height = 0
      }
      setIsRunning(false)
    }
  }, [clearResult, file, language, outputMode, setUrlFromBlob])

  return (
    <div className="space-y-6 overflow-x-hidden">
      <Toaster richColors position="top-right" />

      <Card className="border-blue-500/25 bg-card/80">
        <CardHeader>
          <CardTitle className="text-base">Offline OCR (best effort)</CardTitle>
          <CardDescription>
            Offline OCR can be slow. Files never leave your device.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card className="border-amber-500/35 bg-amber-500/10">
        <CardContent className="pt-6 text-sm text-amber-100">
          OCR is CPU-heavy and can take longer on large files or mobile devices. For best results,
          keep this tab open and plugged in on laptops/phones during processing.
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <PdfFileDropzone
            accept="application/pdf,image/png,image/jpeg,image/webp"
            disabled={isRunning}
            title="Drop a scanned PDF or image here, or click to browse"
            subtitle="Run OCR locally with no uploads"
            onFilesSelected={(files) => {
              const first = files[0]
              if (first) {
                handleFile(first)
              }
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">OCR settings</CardTitle>
          <CardDescription className="break-words">{status}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {file ? (
            <div className="rounded-lg border bg-muted/30 p-3">
              <p className="truncate text-sm font-medium text-foreground">{file.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No file selected yet.</p>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="ocr-lang" className="text-sm font-medium text-foreground">
                Language
              </label>
              <select
                id="ocr-lang"
                value={language}
                onChange={(event) => setLanguage(event.target.value as OcrLanguage)}
                disabled={isRunning}
                className="h-10 w-full rounded-md border bg-background px-3 text-sm"
              >
                <option value="eng">English</option>
                <option value="deu">German</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="ocr-output" className="text-sm font-medium text-foreground">
                Output
              </label>
              <select
                id="ocr-output"
                value={outputMode}
                onChange={(event) => setOutputMode(event.target.value as OutputMode)}
                disabled={isRunning}
                className="h-10 w-full rounded-md border bg-background px-3 text-sm"
              >
                <option value="searchable-pdf">Searchable PDF</option>
                <option value="text-only">Extract text only (.txt)</option>
              </select>
            </div>
          </div>

          {(isRunning || progress > 0) && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{isRunning ? "Processing" : "Complete"}</span>
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
            disabled={!canRun}
            onClick={runOcr}
          >
            {isRunning ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                OCR in progress...
              </>
            ) : (
              <>
                <ScanText className="h-4 w-4" />
                Run OCR
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => {
              setFile(null)
              setProgress(0)
              setStatus("Upload a scanned PDF or image to run OCR locally.")
              clearResult()
            }}
            disabled={isRunning}
          >
            <Trash2 className="h-4 w-4" />
            Reset
          </Button>
        </CardFooter>
      </Card>

      {result && downloadUrl ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Download OCR output</CardTitle>
            <CardDescription>
              {result.fileName} • {formatFileSize(result.sizeBytes)}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <ProcessedLocallyBadge />
            <p className="text-xs text-muted-foreground">
              {result.pageCount} page{result.pageCount === 1 ? "" : "s"} processed •{" "}
              {result.textLength} character{result.textLength === 1 ? "" : "s"} detected
            </p>
            <Button asChild className="w-full sm:w-auto">
              <a
                href={downloadUrl}
                download={result.fileName}
                onClick={() => notifyLocalDownloadSuccess()}
              >
                <Download className="h-4 w-4" />
                Download output
              </a>
            </Button>
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}
