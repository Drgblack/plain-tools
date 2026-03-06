"use client"

import { Download, Eraser, Loader2, PenTool, Type } from "lucide-react"
import { type PointerEvent as ReactPointerEvent, useCallback, useMemo, useRef, useState } from "react"
import { PDFDocument } from "pdf-lib"
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

type SignatureMethod = "draw" | "type"

type SignedResult = {
  fileName: string
  sizeBytes: number
  pageNumber: number
}

const MAX_SIGN_PDF_BYTES = 200 * 1024 * 1024
const DRAW_CANVAS_WIDTH = 900
const DRAW_CANVAS_HEIGHT = 260

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value))

const dataUrlToUint8Array = (dataUrl: string) => {
  const [, base64 = ""] = dataUrl.split(",")
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes
}

const createTypedSignatureDataUrl = (typedName: string) => {
  if (typeof document === "undefined") {
    throw new Error("Typed signature generation requires a browser context.")
  }

  const text = typedName.trim()
  if (!text) {
    throw new Error("Enter a name before applying a typed signature.")
  }

  const canvas = document.createElement("canvas")
  canvas.width = 1200
  canvas.height = 320
  const context = canvas.getContext("2d")
  if (!context) {
    throw new Error("Could not render typed signature.")
  }

  context.clearRect(0, 0, canvas.width, canvas.height)
  context.fillStyle = "#0a0a0a"
  context.textAlign = "center"
  context.textBaseline = "middle"
  context.font = '88px "Brush Script MT", "Segoe Script", "Lucida Handwriting", cursive'
  context.fillText(text, canvas.width / 2, canvas.height / 2)
  return canvas.toDataURL("image/png")
}

export default function SignPdfTool() {
  const drawCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const drawingRef = useRef(false)
  const [hasDrawing, setHasDrawing] = useState(false)

  const [file, setFile] = useState<File | null>(null)
  const [pageCount, setPageCount] = useState(0)
  const [signatureMethod, setSignatureMethod] = useState<SignatureMethod>("draw")
  const [typedSignature, setTypedSignature] = useState("")
  const [selectedPage, setSelectedPage] = useState(1)
  const [xPercent, setXPercent] = useState(45)
  const [yPercentTop, setYPercentTop] = useState(78)
  const [sizePercent, setSizePercent] = useState(28)
  const [isApplying, setIsApplying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState(
    "Upload a PDF, add a signature, and place it on the selected page."
  )
  const [result, setResult] = useState<SignedResult | null>(null)

  const { url: downloadUrl, clearUrl, setUrlFromBlob } = useObjectUrlState()

  const clearResult = useCallback(() => {
    clearUrl()
    setResult(null)
  }, [clearUrl])

  const clearDrawPad = useCallback(() => {
    const canvas = drawCanvasRef.current
    if (!canvas) return
    const context = canvas.getContext("2d")
    if (!context) return
    context.clearRect(0, 0, canvas.width, canvas.height)
    setHasDrawing(false)
  }, [])

  const getCanvasPoint = useCallback((event: ReactPointerEvent<HTMLCanvasElement>) => {
    const canvas = drawCanvasRef.current
    if (!canvas) {
      return null
    }
    const rect = canvas.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * canvas.width
    const y = ((event.clientY - rect.top) / rect.height) * canvas.height
    return { x, y }
  }, [])

  const handleDrawStart = useCallback(
    (event: ReactPointerEvent<HTMLCanvasElement>) => {
      if (signatureMethod !== "draw") return
      const canvas = drawCanvasRef.current
      const context = canvas?.getContext("2d")
      const point = getCanvasPoint(event)
      if (!canvas || !context || !point) return

      event.preventDefault()
      canvas.setPointerCapture(event.pointerId)
      drawingRef.current = true
      context.lineCap = "round"
      context.lineJoin = "round"
      context.lineWidth = 4
      context.strokeStyle = "#111111"
      context.beginPath()
      context.moveTo(point.x, point.y)
      setHasDrawing(true)
    },
    [getCanvasPoint, signatureMethod]
  )

  const handleDrawMove = useCallback(
    (event: ReactPointerEvent<HTMLCanvasElement>) => {
      if (signatureMethod !== "draw" || !drawingRef.current) return
      const context = drawCanvasRef.current?.getContext("2d")
      const point = getCanvasPoint(event)
      if (!context || !point) return
      event.preventDefault()
      context.lineTo(point.x, point.y)
      context.stroke()
    },
    [getCanvasPoint, signatureMethod]
  )

  const handleDrawEnd = useCallback((event: ReactPointerEvent<HTMLCanvasElement>) => {
    const canvas = drawCanvasRef.current
    if (!canvas || !drawingRef.current) return
    event.preventDefault()
    drawingRef.current = false
    if (canvas.hasPointerCapture(event.pointerId)) {
      canvas.releasePointerCapture(event.pointerId)
    }
  }, [])

  const loadPdfMetadata = useCallback(async (candidate: File) => {
    const pdfjs = await getPdfJs()
    const bytes = new Uint8Array(await candidate.arrayBuffer())
    const task = pdfjs.getDocument({
      data: bytes,
      disableAutoFetch: true,
      disableRange: true,
      disableStream: true,
    })

    try {
      const pdf = await task.promise
      return pdf.numPages
    } finally {
      await task.destroy()
    }
  }, [])

  const handlePdfFile = useCallback(
    async (candidate: File) => {
      try {
        if (!isPdfLikeFile(candidate)) {
          toast.error("Only PDF files are supported.")
          return
        }
        ensureSafeLocalFileSize(candidate, MAX_SIGN_PDF_BYTES)

        setStatus("Reading PDF metadata locally...")
        const count = await loadPdfMetadata(candidate)
        setFile(candidate)
        setPageCount(count)
        setSelectedPage(1)
        setProgress(0)
        setStatus(`Ready. ${count} page${count === 1 ? "" : "s"} detected.`)
        clearResult()
      } catch (error) {
        const message = error instanceof Error ? error.message : "Could not use this file."
        setStatus(message)
        toast.error(message)
      }
    },
    [clearResult, loadPdfMetadata]
  )

  const getSignatureBytes = useCallback(() => {
    if (signatureMethod === "draw") {
      const canvas = drawCanvasRef.current
      if (!canvas || !hasDrawing) {
        throw new Error("Draw a signature before applying it.")
      }
      return dataUrlToUint8Array(canvas.toDataURL("image/png"))
    }

    return dataUrlToUint8Array(createTypedSignatureDataUrl(typedSignature))
  }, [hasDrawing, signatureMethod, typedSignature])

  const applySignature = useCallback(async () => {
    if (!file) {
      toast.error("Upload a PDF first.")
      return
    }

    setIsApplying(true)
    setProgress(6)
    setStatus("Embedding signature locally...")
    clearResult()

    try {
      const signatureBytes = getSignatureBytes()
      setProgress(24)

      const sourceBytes = await file.arrayBuffer()
      const pdfDoc = await PDFDocument.load(sourceBytes)
      const page = pdfDoc.getPage(selectedPage - 1)
      if (!page) {
        throw new Error("Selected page could not be found.")
      }

      const signatureImage = await pdfDoc.embedPng(signatureBytes)
      const pageWidth = page.getWidth()
      const pageHeight = page.getHeight()

      let targetWidth = (pageWidth * sizePercent) / 100
      let targetHeight = (targetWidth * signatureImage.height) / signatureImage.width

      const maxHeight = pageHeight * 0.8
      if (targetHeight > maxHeight) {
        targetHeight = maxHeight
        targetWidth = (targetHeight * signatureImage.width) / signatureImage.height
      }

      const boundedXPercent = clamp(xPercent, 0, 100)
      const boundedYTopPercent = clamp(yPercentTop, 0, 100)

      const x = (boundedXPercent / 100) * (pageWidth - targetWidth)
      const y = (1 - boundedYTopPercent / 100) * (pageHeight - targetHeight)

      page.drawImage(signatureImage, {
        x,
        y,
        width: targetWidth,
        height: targetHeight,
      })
      setProgress(72)

      const outputBytes = await pdfDoc.save()
      const blob = new Blob([outputBytes], { type: "application/pdf" })
      const fileName = "signed.pdf"
      setUrlFromBlob(blob)
      setResult({
        fileName,
        sizeBytes: blob.size,
        pageNumber: selectedPage,
      })
      setProgress(100)
      setStatus("Signature applied. Your signed PDF is ready.")
      toast.success("Signed PDF generated.")
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Could not apply the signature."
      setStatus(message)
      toast.error(message)
    } finally {
      setIsApplying(false)
    }
  }, [
    clearResult,
    file,
    getSignatureBytes,
    selectedPage,
    setUrlFromBlob,
    sizePercent,
    xPercent,
    yPercentTop,
  ])

  const canApply = useMemo(() => {
    if (!file || isApplying) return false
    if (signatureMethod === "draw") return hasDrawing
    return typedSignature.trim().length > 0
  }, [file, hasDrawing, isApplying, signatureMethod, typedSignature])

  return (
    <div className="space-y-6 overflow-x-hidden">
      <Toaster richColors position="top-right" />

      <Card className="border-blue-500/25 bg-card/80">
        <CardHeader>
          <CardTitle className="text-base">Best-effort offline signing</CardTitle>
          <CardDescription>
            Best-effort offline signing. This is a visual signature placement (not a cryptographic digital certificate). Files never leave your device.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <PdfFileDropzone
            disabled={isApplying}
            title="Drop a PDF here, or click to browse"
            subtitle="Sign locally in your browser with no uploads"
            onFilesSelected={(files) => {
              const first = files[0]
              if (first) {
                void handlePdfFile(first)
              }
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Signature input</CardTitle>
          <CardDescription className="break-words">{status}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {file ? (
            <div className="rounded-lg border bg-muted/30 p-3">
              <p className="truncate text-sm font-medium text-foreground">{file.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {formatFileSize(file.size)} • {pageCount} page{pageCount === 1 ? "" : "s"}
              </p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No PDF selected yet.</p>
          )}

          <div className="grid gap-2 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setSignatureMethod("draw")}
              className={`flex min-h-[44px] items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm transition ${
                signatureMethod === "draw"
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              <PenTool className="h-4 w-4" />
              Draw signature
            </button>
            <button
              type="button"
              onClick={() => setSignatureMethod("type")}
              className={`flex min-h-[44px] items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm transition ${
                signatureMethod === "type"
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              <Type className="h-4 w-4" />
              Type signature
            </button>
          </div>

          {signatureMethod === "draw" ? (
            <div className="space-y-3 rounded-lg border p-3">
              <p className="text-xs text-muted-foreground">
                Draw with mouse, stylus, or touch.
              </p>
              <canvas
                ref={drawCanvasRef}
                width={DRAW_CANVAS_WIDTH}
                height={DRAW_CANVAS_HEIGHT}
                className="h-44 w-full touch-none rounded-md border bg-white"
                onPointerDown={handleDrawStart}
                onPointerMove={handleDrawMove}
                onPointerUp={handleDrawEnd}
                onPointerCancel={handleDrawEnd}
                onPointerLeave={handleDrawEnd}
              />
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto"
                onClick={clearDrawPad}
              >
                <Eraser className="h-4 w-4" />
                Clear signature
              </Button>
            </div>
          ) : (
            <div className="space-y-3 rounded-lg border p-3">
              <label htmlFor="typed-signature" className="text-sm font-medium text-foreground">
                Type your name
              </label>
              <input
                id="typed-signature"
                type="text"
                value={typedSignature}
                onChange={(event) => setTypedSignature(event.target.value)}
                placeholder="e.g. Alex Morgan"
                className="h-11 w-full rounded-md border bg-background px-3 text-base outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
              />
              <p className="text-xs text-muted-foreground">
                Typed signature is rendered as image text and stamped onto the PDF.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Placement controls</CardTitle>
          <CardDescription>
            Choose page and position percentages (MVP control mode).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="sign-page" className="text-sm font-medium text-foreground">
                Page
              </label>
              <select
                id="sign-page"
                value={selectedPage}
                onChange={(event) => setSelectedPage(Number(event.target.value))}
                disabled={!file || isApplying}
                className="h-10 w-full rounded-md border bg-background px-3 text-sm"
              >
                {Array.from({ length: pageCount }, (_, index) => index + 1).map((page) => (
                  <option key={page} value={page}>
                    Page {page}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="size-percent" className="text-sm font-medium text-foreground">
                Signature size ({sizePercent}% width)
              </label>
              <input
                id="size-percent"
                type="range"
                min={10}
                max={60}
                step={1}
                value={sizePercent}
                onChange={(event) => setSizePercent(Number(event.target.value))}
                disabled={!file || isApplying}
                className="h-10 w-full"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="x-percent" className="text-sm font-medium text-foreground">
                X position ({xPercent}%)
              </label>
              <input
                id="x-percent"
                type="range"
                min={0}
                max={100}
                step={1}
                value={xPercent}
                onChange={(event) => setXPercent(Number(event.target.value))}
                disabled={!file || isApplying}
                className="h-10 w-full"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="y-percent" className="text-sm font-medium text-foreground">
                Y from top ({yPercentTop}%)
              </label>
              <input
                id="y-percent"
                type="range"
                min={0}
                max={100}
                step={1}
                value={yPercentTop}
                onChange={(event) => setYPercentTop(Number(event.target.value))}
                disabled={!file || isApplying}
                className="h-10 w-full"
              />
            </div>
          </div>

          {(isApplying || progress > 0) && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{isApplying ? "Applying signature" : "Complete"}</span>
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
            disabled={!canApply}
            onClick={applySignature}
          >
            {isApplying ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Applying...
              </>
            ) : (
              <>
                <PenTool className="h-4 w-4" />
                Apply signature
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => {
              setTypedSignature("")
              clearDrawPad()
              setProgress(0)
              setStatus(
                file
                  ? `Ready. ${pageCount} page${pageCount === 1 ? "" : "s"} detected.`
                  : "Upload a PDF, add a signature, and place it on the selected page."
              )
              clearResult()
            }}
            disabled={isApplying}
          >
            Reset signature
          </Button>
        </CardFooter>
      </Card>

      {result && downloadUrl ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Download signed PDF</CardTitle>
            <CardDescription>
              {result.fileName} • {formatFileSize(result.sizeBytes)} • Page {result.pageNumber}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <ProcessedLocallyBadge />
            <Button asChild className="w-full sm:w-auto">
              <a
                href={downloadUrl}
                download={result.fileName}
                onClick={() => notifyLocalDownloadSuccess()}
              >
                <Download className="h-4 w-4" />
                Download signed.pdf
              </a>
            </Button>
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}
