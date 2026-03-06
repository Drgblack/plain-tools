"use client"

import Image from "next/image"
import { Download, Eraser, Highlighter, Loader2, PenLine, Type } from "lucide-react"
import {
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { Toaster, toast } from "sonner"

import { ProcessedLocallyBadge } from "@/components/tools/processed-locally-badge"
import { PdfFileDropzone } from "@/components/tools/shared/pdf-file-dropzone"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { useObjectUrlState } from "@/hooks/use-object-url-state"
import { notifyLocalDownloadSuccess } from "@/lib/local-download-events"
import { generatePagePreviews, type PageThumbnail } from "@/lib/page-organiser-engine"
import { ensureSafeLocalFileSize, formatFileSize, isPdfLikeFile } from "@/lib/pdf-client-utils"
import { getPdfJs } from "@/lib/pdfjs-loader"
import { getPdfLib } from "@/lib/pdf-lib-loader"

type DrawTool = "pen" | "highlight" | "text"

type NormalizedPoint = {
  x: number
  y: number
}

type StrokeAnnotation = {
  id: string
  type: "pen" | "highlight"
  page: number
  points: NormalizedPoint[]
  color: string
  opacity: number
  sizeRatio: number
}

type TextAnnotation = {
  id: string
  type: "text"
  page: number
  x: number
  y: number
  text: string
  color: string
  sizeRatio: number
}

type Annotation = StrokeAnnotation | TextAnnotation

type AnnotatedResult = {
  fileName: string
  sizeBytes: number
  annotationCount: number
}

const MAX_ANNOTATE_PDF_BYTES = 200 * 1024 * 1024
const HIGHLIGHT_COLOR = "#FACC15"
const HIGHLIGHT_OPACITY = 0.28
const PEN_OPACITY = 1

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

const normalizeHexColor = (value: string, fallback = "#1E40AF") => {
  const candidate = value.trim()
  if (/^#[0-9a-fA-F]{6}$/.test(candidate)) return candidate
  return fallback
}

const hexToRgbUnit = (hex: string): [number, number, number] => {
  const normalized = normalizeHexColor(hex).replace("#", "")
  const red = Number.parseInt(normalized.slice(0, 2), 16) / 255
  const green = Number.parseInt(normalized.slice(2, 4), 16) / 255
  const blue = Number.parseInt(normalized.slice(4, 6), 16) / 255
  return [red, green, blue]
}

function drawStrokeOnCanvas(
  context: CanvasRenderingContext2D,
  annotation: StrokeAnnotation,
  canvasWidth: number,
  canvasHeight: number
) {
  if (annotation.points.length < 2) return

  context.save()
  context.globalAlpha = annotation.opacity
  context.strokeStyle = annotation.color
  context.lineJoin = "round"
  context.lineCap = "round"
  context.lineWidth = Math.max(1, annotation.sizeRatio * canvasWidth)
  context.beginPath()

  const first = annotation.points[0]
  if (!first) {
    context.restore()
    return
  }

  context.moveTo(first.x * canvasWidth, first.y * canvasHeight)
  for (let index = 1; index < annotation.points.length; index += 1) {
    const point = annotation.points[index]
    if (!point) continue
    context.lineTo(point.x * canvasWidth, point.y * canvasHeight)
  }
  context.stroke()
  context.restore()
}

function drawTextOnCanvas(
  context: CanvasRenderingContext2D,
  annotation: TextAnnotation,
  canvasWidth: number,
  canvasHeight: number
) {
  const size = Math.max(12, annotation.sizeRatio * canvasWidth)

  context.save()
  context.globalAlpha = 1
  context.fillStyle = annotation.color
  context.font = `${Math.round(size)}px Inter, system-ui, sans-serif`
  context.textBaseline = "top"
  context.fillText(annotation.text, annotation.x * canvasWidth, annotation.y * canvasHeight)
  context.restore()
}

export default function AnnotatePdfTool() {
  const pageCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const overlayCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const canvasContainerRef = useRef<HTMLDivElement | null>(null)
  const pdfDocumentRef = useRef<Awaited<ReturnType<ReturnType<typeof getPdfJs>["getDocument"]>["promise"]> | null>(
    null
  )
  const drawInProgressRef = useRef<StrokeAnnotation | null>(null)
  const renderRevisionRef = useRef(0)

  const [sourceFile, setSourceFile] = useState<File | null>(null)
  const [sourceBytes, setSourceBytes] = useState<Uint8Array | null>(null)
  const [pageCount, setPageCount] = useState(0)
  const [selectedPage, setSelectedPage] = useState(1)
  const [thumbnails, setThumbnails] = useState<PageThumbnail[]>([])
  const [annotations, setAnnotations] = useState<Annotation[]>([])

  const [tool, setTool] = useState<DrawTool>("pen")
  const [penColor, setPenColor] = useState("#1E40AF")
  const [textColor, setTextColor] = useState("#0F172A")
  const [strokeWidth, setStrokeWidth] = useState(4)
  const [textSize, setTextSize] = useState(24)
  const [textInput, setTextInput] = useState("Reviewed")

  const [status, setStatus] = useState("Upload a PDF to start annotating.")
  const [previewProgress, setPreviewProgress] = useState(0)
  const [isPreparing, setIsPreparing] = useState(false)
  const [isApplying, setIsApplying] = useState(false)
  const [applyProgress, setApplyProgress] = useState(0)
  const [result, setResult] = useState<AnnotatedResult | null>(null)

  const { url: downloadUrl, clearUrl, setUrlFromBlob } = useObjectUrlState()

  const clearResult = useCallback(() => {
    clearUrl()
    setResult(null)
  }, [clearUrl])

  const destroyPdfDocument = useCallback(async () => {
    const current = pdfDocumentRef.current
    if (!current) return
    pdfDocumentRef.current = null
    await current.destroy().catch(() => undefined)
  }, [])

  const redrawOverlay = useCallback(
    (liveStroke?: StrokeAnnotation | null) => {
      const overlay = overlayCanvasRef.current
      if (!overlay) return
      const context = overlay.getContext("2d")
      if (!context) return

      context.clearRect(0, 0, overlay.width, overlay.height)
      const pageAnnotations = annotations.filter((entry) => entry.page === selectedPage)
      const strokes: StrokeAnnotation[] = []

      for (const entry of pageAnnotations) {
        if (entry.type === "text") {
          drawTextOnCanvas(context, entry, overlay.width, overlay.height)
        } else {
          strokes.push(entry)
        }
      }

      for (const stroke of strokes) {
        drawStrokeOnCanvas(context, stroke, overlay.width, overlay.height)
      }

      if (liveStroke) {
        drawStrokeOnCanvas(context, liveStroke, overlay.width, overlay.height)
      }
    },
    [annotations, selectedPage]
  )

  const renderSelectedPage = useCallback(
    async (pageNumber: number) => {
      const pdfDoc = pdfDocumentRef.current
      const pageCanvas = pageCanvasRef.current
      const overlayCanvas = overlayCanvasRef.current
      if (!pdfDoc || !pageCanvas || !overlayCanvas) return

      const revision = renderRevisionRef.current + 1
      renderRevisionRef.current = revision

      const page = await pdfDoc.getPage(pageNumber)
      if (renderRevisionRef.current !== revision) return

      const baseViewport = page.getViewport({ scale: 1 })
      const containerWidth = canvasContainerRef.current?.clientWidth ?? baseViewport.width
      const targetWidth = Math.max(280, Math.min(containerWidth - 2, 920))
      const scale = targetWidth / baseViewport.width
      const viewport = page.getViewport({ scale })

      pageCanvas.width = Math.floor(viewport.width)
      pageCanvas.height = Math.floor(viewport.height)
      pageCanvas.style.width = `${Math.floor(viewport.width)}px`
      pageCanvas.style.height = `${Math.floor(viewport.height)}px`

      overlayCanvas.width = Math.floor(viewport.width)
      overlayCanvas.height = Math.floor(viewport.height)
      overlayCanvas.style.width = `${Math.floor(viewport.width)}px`
      overlayCanvas.style.height = `${Math.floor(viewport.height)}px`

      const context = pageCanvas.getContext("2d")
      if (!context) return

      context.clearRect(0, 0, pageCanvas.width, pageCanvas.height)
      await page.render({ canvasContext: context, viewport }).promise
      if (renderRevisionRef.current !== revision) return

      redrawOverlay()
      setStatus(`Page ${pageNumber} ready. Add pen, highlight, or text annotations.`)
    },
    [redrawOverlay]
  )

  const loadPdf = useCallback(
    async (file: File) => {
      if (!isPdfLikeFile(file)) {
        toast.error("Please upload a PDF file.")
        return
      }

      try {
        ensureSafeLocalFileSize(file, MAX_ANNOTATE_PDF_BYTES)
      } catch (error) {
        const message = error instanceof Error ? error.message : "This PDF is too large for local annotation."
        toast.error(message)
        setStatus(message)
        return
      }

      setIsPreparing(true)
      setPreviewProgress(4)
      setStatus("Loading PDF locally...")
      clearResult()
      setAnnotations([])
      setThumbnails([])
      setPageCount(0)
      setSelectedPage(1)

      try {
        await destroyPdfDocument()
        const bytes = new Uint8Array(await file.arrayBuffer())
        setSourceBytes(bytes)
        setSourceFile(file)

        const pdfjs = await getPdfJs()
        const loadTask = pdfjs.getDocument({
          data: bytes,
          disableAutoFetch: true,
          disableRange: true,
          disableStream: true,
        })
        const pdfDoc = await loadTask.promise
        pdfDocumentRef.current = pdfDoc

        setPageCount(pdfDoc.numPages)
        setPreviewProgress(35)

        const preview = await generatePagePreviews(file, {
          thumbnailWidth: 110,
          onProgress: (progress) => setPreviewProgress(35 + Math.round(progress * 0.5)),
        })
        setThumbnails(preview.thumbnails)
        setPreviewProgress(90)

        await renderSelectedPage(1)
        setPreviewProgress(100)
      } catch (error) {
        const message = error instanceof Error ? error.message : "Could not prepare PDF annotation workspace."
        toast.error(message)
        setStatus(message)
      } finally {
        setIsPreparing(false)
      }
    },
    [clearResult, destroyPdfDocument, renderSelectedPage]
  )

  useEffect(() => {
    if (!sourceFile || !pageCount) return
    void renderSelectedPage(selectedPage)
  }, [pageCount, renderSelectedPage, selectedPage, sourceFile])

  useEffect(() => {
    const handleResize = () => {
      if (!pageCount) return
      void renderSelectedPage(selectedPage)
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [pageCount, renderSelectedPage, selectedPage])

  useEffect(() => {
    return () => {
      void destroyPdfDocument()
    }
  }, [destroyPdfDocument])

  const getPointerPoint = (event: ReactPointerEvent<HTMLCanvasElement>): NormalizedPoint | null => {
    const overlay = overlayCanvasRef.current
    if (!overlay || overlay.width === 0 || overlay.height === 0) return null

    const rect = overlay.getBoundingClientRect()
    const x = clamp((event.clientX - rect.left) / rect.width, 0, 1)
    const y = clamp((event.clientY - rect.top) / rect.height, 0, 1)
    return { x, y }
  }

  const handlePointerDown = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    if (isPreparing || isApplying || !sourceFile) return
    const point = getPointerPoint(event)
    if (!point) return

    if (tool === "text") {
      const label = textInput.trim()
      if (!label) {
        toast.error("Enter text before placing a text annotation.")
        return
      }

      const overlayWidth = overlayCanvasRef.current?.width || 900
      const next: TextAnnotation = {
        id: crypto.randomUUID(),
        type: "text",
        page: selectedPage,
        x: point.x,
        y: point.y,
        text: label,
        color: normalizeHexColor(textColor, "#0F172A"),
        sizeRatio: clamp(textSize / overlayWidth, 0.012, 0.22),
      }
      setAnnotations((previous) => [...previous, next])
      setStatus(`Text annotation added to page ${selectedPage}.`)
      return
    }

    const overlay = overlayCanvasRef.current
    const overlayWidth = overlay?.width || 900
    const stroke: StrokeAnnotation = {
      id: crypto.randomUUID(),
      type: tool,
      page: selectedPage,
      points: [point],
      color: tool === "highlight" ? HIGHLIGHT_COLOR : normalizeHexColor(penColor, "#1E40AF"),
      opacity: tool === "highlight" ? HIGHLIGHT_OPACITY : PEN_OPACITY,
      sizeRatio: clamp(strokeWidth / overlayWidth, 0.0018, 0.085),
    }

    drawInProgressRef.current = stroke
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handlePointerMove = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    const active = drawInProgressRef.current
    if (!active) return
    const point = getPointerPoint(event)
    if (!point) return

    active.points.push(point)
    redrawOverlay(active)
  }

  const finishStroke = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    const active = drawInProgressRef.current
    if (!active) return
    drawInProgressRef.current = null

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }

    if (active.points.length > 1) {
      setAnnotations((previous) => [...previous, { ...active }])
      setStatus(`${active.type === "highlight" ? "Highlight" : "Pen"} annotation added to page ${selectedPage}.`)
    } else {
      redrawOverlay()
    }
  }

  const pageAnnotationsCount = useMemo(
    () => annotations.filter((entry) => entry.page === selectedPage).length,
    [annotations, selectedPage]
  )

  const canApply = Boolean(sourceFile && sourceBytes && annotations.length > 0 && !isApplying)

  const undoLastAnnotationOnPage = () => {
    setAnnotations((previous) => {
      for (let index = previous.length - 1; index >= 0; index -= 1) {
        const current = previous[index]
        if (current?.page === selectedPage) {
          const copy = [...previous]
          copy.splice(index, 1)
          return copy
        }
      }
      return previous
    })
  }

  const clearSelectedPageAnnotations = () => {
    setAnnotations((previous) => previous.filter((entry) => entry.page !== selectedPage))
    setStatus(`Cleared annotations on page ${selectedPage}.`)
  }

  const clearAllAnnotations = () => {
    setAnnotations([])
    setStatus("All annotations cleared.")
  }

  const applyAnnotations = useCallback(async () => {
    if (!sourceFile || !sourceBytes) {
      toast.error("Upload a PDF first.")
      return
    }
    if (annotations.length === 0) {
      toast.error("Add at least one annotation before exporting.")
      return
    }

    setIsApplying(true)
    setApplyProgress(4)
    setStatus("Applying annotations locally...")
    clearResult()

    try {
      const { PDFDocument, StandardFonts, rgb } = await getPdfLib()
      const pdfDoc = await PDFDocument.load(sourceBytes, { ignoreEncryption: true })
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica)

      const groupedByPage = new Map<number, Annotation[]>()
      for (const annotation of annotations) {
        const group = groupedByPage.get(annotation.page) ?? []
        group.push(annotation)
        groupedByPage.set(annotation.page, group)
      }

      let appliedCount = 0
      const totalCount = annotations.length

      for (const [pageNumber, entries] of groupedByPage.entries()) {
        const page = pdfDoc.getPage(pageNumber - 1)
        if (!page) continue

        const pageWidth = page.getWidth()
        const pageHeight = page.getHeight()

        for (const entry of entries) {
          if (entry.type === "text") {
            const size = Math.max(10, entry.sizeRatio * pageWidth)
            const [red, green, blue] = hexToRgbUnit(entry.color)
            page.drawText(entry.text, {
              x: entry.x * pageWidth,
              y: pageHeight - entry.y * pageHeight - size,
              size,
              font,
              color: rgb(red, green, blue),
            })
          } else {
            const [red, green, blue] = hexToRgbUnit(entry.color)
            for (let index = 1; index < entry.points.length; index += 1) {
              const start = entry.points[index - 1]
              const end = entry.points[index]
              if (!start || !end) continue

              page.drawLine({
                start: {
                  x: start.x * pageWidth,
                  y: pageHeight - start.y * pageHeight,
                },
                end: {
                  x: end.x * pageWidth,
                  y: pageHeight - end.y * pageHeight,
                },
                thickness: Math.max(0.8, entry.sizeRatio * pageWidth),
                color: rgb(red, green, blue),
                opacity: entry.opacity,
              })
            }
          }

          appliedCount += 1
          const progress = 5 + Math.round((appliedCount / totalCount) * 88)
          setApplyProgress(progress)
        }
      }

      const outputBytes = await pdfDoc.save({ useObjectStreams: true })
      const blob = new Blob([outputBytes], { type: "application/pdf" })
      const outputName = sourceFile.name.replace(/\.pdf$/i, "") + "-annotated.pdf"
      setUrlFromBlob(blob)
      setResult({
        fileName: outputName,
        sizeBytes: blob.size,
        annotationCount: annotations.length,
      })
      setApplyProgress(100)
      setStatus("Annotated PDF is ready to download.")
      toast.success("Annotations applied successfully.")
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not apply annotations."
      setStatus(message)
      toast.error(message)
    } finally {
      setIsApplying(false)
    }
  }, [annotations, clearResult, setUrlFromBlob, sourceBytes, sourceFile])

  return (
    <div className="space-y-6 overflow-x-hidden">
      <Toaster richColors position="top-right" />

      <Card className="border-blue-500/25 bg-card/80">
        <CardHeader>
          <CardTitle className="text-base">Basic PDF annotation</CardTitle>
          <CardDescription>
            Draw pen marks, add transparent highlights, and place text labels per page. Processing runs fully
            in your browser and files never leave your device.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <PdfFileDropzone
            accept="application/pdf"
            disabled={isPreparing || isApplying}
            title="Drop a PDF here, or click to browse"
            subtitle="Local-only annotation workspace with no upload step"
            onFilesSelected={(files) => {
              const selected = files[0]
              if (selected) {
                void loadPdf(selected)
              }
            }}
          />
          {sourceFile ? (
            <div className="mt-4 rounded-lg border bg-muted/20 p-3 text-sm">
              <p className="font-medium text-foreground">{sourceFile.name}</p>
              <p className="text-xs text-muted-foreground">
                {formatFileSize(sourceFile.size)} • {pageCount} page{pageCount === 1 ? "" : "s"}
              </p>
            </div>
          ) : null}
          {(isPreparing || previewProgress > 0) && (
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{isPreparing ? "Preparing pages" : "Preview ready"}</span>
                <span>{previewProgress}%</span>
              </div>
              <Progress value={previewProgress} className="h-2 w-full" />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Annotation tools</CardTitle>
          <CardDescription>{status}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant={tool === "pen" ? "default" : "outline"}
              size="sm"
              onClick={() => setTool("pen")}
            >
              <PenLine className="h-4 w-4" />
              Pen
            </Button>
            <Button
              type="button"
              variant={tool === "highlight" ? "default" : "outline"}
              size="sm"
              onClick={() => setTool("highlight")}
            >
              <Highlighter className="h-4 w-4" />
              Highlight
            </Button>
            <Button
              type="button"
              variant={tool === "text" ? "default" : "outline"}
              size="sm"
              onClick={() => setTool("text")}
            >
              <Type className="h-4 w-4" />
              Text
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {(tool === "pen" || tool === "highlight") && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">Stroke width ({strokeWidth}px)</p>
                <input
                  type="range"
                  min={2}
                  max={24}
                  step={1}
                  value={strokeWidth}
                  onChange={(event) => setStrokeWidth(Number.parseInt(event.target.value, 10))}
                  className="h-10 w-full"
                />
              </div>
            )}

            {tool === "pen" ? (
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">Pen colour</p>
                <Input
                  type="color"
                  value={penColor}
                  onChange={(event) => setPenColor(event.target.value)}
                  className="h-10 w-full"
                />
              </div>
            ) : null}

            {tool === "text" ? (
              <>
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">Text to place</p>
                  <Input
                    value={textInput}
                    onChange={(event) => setTextInput(event.target.value)}
                    placeholder="Reviewed"
                  />
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">Text size ({textSize}px)</p>
                  <input
                    type="range"
                    min={12}
                    max={64}
                    step={1}
                    value={textSize}
                    onChange={(event) => setTextSize(Number.parseInt(event.target.value, 10))}
                    className="h-10 w-full"
                  />
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">Text colour</p>
                  <Input
                    type="color"
                    value={textColor}
                    onChange={(event) => setTextColor(event.target.value)}
                    className="h-10 w-full"
                  />
                </div>
              </>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={undoLastAnnotationOnPage}
              disabled={pageAnnotationsCount === 0 || isApplying}
            >
              Undo on page
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={clearSelectedPageAnnotations}
              disabled={pageAnnotationsCount === 0 || isApplying}
            >
              Clear page
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={clearAllAnnotations}
              disabled={annotations.length === 0 || isApplying}
            >
              <Eraser className="h-4 w-4" />
              Clear all
            </Button>
          </div>
        </CardContent>
      </Card>

      {thumbnails.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Choose a page</CardTitle>
            <CardDescription>Select a page thumbnail, then annotate on the overlay canvas.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {thumbnails.map((thumbnail, index) => {
                const pageNumber = index + 1
                const active = pageNumber === selectedPage
                const count = annotations.filter((entry) => entry.page === pageNumber).length
                return (
                  <button
                    key={`${thumbnail.originalIndex}-${pageNumber}`}
                    type="button"
                    onClick={() => setSelectedPage(pageNumber)}
                    className={`group w-24 shrink-0 rounded-lg border p-2 text-left transition ${
                      active
                        ? "border-accent bg-accent/10"
                        : "border-border bg-card/60 hover:border-accent/40"
                    }`}
                  >
                    <div className="relative aspect-[3/4] overflow-hidden rounded-md border border-border/60 bg-muted/20">
                      <Image
                        src={thumbnail.dataUrl}
                        alt={`Page ${pageNumber}`}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>
                    <p className="mt-2 text-[11px] font-medium text-foreground">Page {pageNumber}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {count} annotation{count === 1 ? "" : "s"}
                    </p>
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Canvas overlay (page {selectedPage})</CardTitle>
          <CardDescription>
            Draw or place text directly on the page overlay. Highlights use transparent yellow by default.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            ref={canvasContainerRef}
            className="mx-auto w-full overflow-x-auto rounded-lg border border-border bg-muted/20 p-3"
          >
            <div className="relative mx-auto w-fit">
              <canvas ref={pageCanvasRef} className="block max-w-full rounded-md border border-border/60" />
              <canvas
                ref={overlayCanvasRef}
                className="absolute inset-0 z-10 block max-w-full touch-none cursor-crosshair rounded-md"
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={finishStroke}
                onPointerCancel={finishStroke}
                onPointerLeave={finishStroke}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Apply and download</CardTitle>
          <CardDescription>
            Embed all annotations into a new PDF and download the annotated result locally.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {(isApplying || applyProgress > 0) && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{isApplying ? "Applying annotations" : "Ready"}</span>
                <span>{applyProgress}%</span>
              </div>
              <Progress value={applyProgress} className="h-2 w-full" />
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <Button type="button" onClick={() => void applyAnnotations()} disabled={!canApply}>
              {isApplying ? <Loader2 className="h-4 w-4 animate-spin" /> : <PenLine className="h-4 w-4" />}
              Apply & Download
            </Button>
          </div>

          {result && downloadUrl ? (
            <div className="rounded-lg border bg-muted/20 p-3">
              <ProcessedLocallyBadge />
              <p className="mt-2 text-sm text-muted-foreground">
                {result.fileName} • {formatFileSize(result.sizeBytes)} • {result.annotationCount} annotation
                {result.annotationCount === 1 ? "" : "s"}
              </p>
              <Button asChild className="mt-3">
                <a
                  href={downloadUrl}
                  download={result.fileName}
                  onClick={() => notifyLocalDownloadSuccess()}
                >
                  <Download className="h-4 w-4" />
                  Download annotated PDF
                </a>
              </Button>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  )
}

