"use client"

import { Download, Loader2, QrCode, RotateCcw } from "lucide-react"
import { useCallback, useMemo, useRef, useState } from "react"
import { Toaster, toast } from "sonner"
import QRCode from "qrcode"

import { ProcessedLocallyBadge } from "@/components/tools/processed-locally-badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useObjectUrlState } from "@/hooks/use-object-url-state"
import { notifyLocalDownloadSuccess } from "@/lib/local-download-events"

type ErrorCorrectionLevel = "L" | "M" | "Q" | "H"

const ECC_OPTIONS: Array<{ label: string; value: ErrorCorrectionLevel }> = [
  { label: "Low (L)", value: "L" },
  { label: "Medium (M)", value: "M" },
  { label: "Quartile (Q)", value: "Q" },
  { label: "High (H)", value: "H" },
]

const sanitizeBaseName = (value: string) =>
  value
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40) || "qr-code"

const canvasToBlob = (canvas: HTMLCanvasElement) =>
  new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Could not export PNG from canvas."))
        return
      }
      resolve(blob)
    }, "image/png")
  })

export default function QrCodeTool() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [input, setInput] = useState("https://plain.tools")
  const [size, setSize] = useState(320)
  const [ecc, setEcc] = useState<ErrorCorrectionLevel>("M")
  const [darkColor, setDarkColor] = useState("#111827")
  const [lightColor, setLightColor] = useState("#ffffff")
  const [isGenerating, setIsGenerating] = useState(false)
  const [status, setStatus] = useState("Enter text or URL, then generate your QR code locally.")
  const [svgMarkup, setSvgMarkup] = useState("")
  const [downloadBaseName, setDownloadBaseName] = useState("qr-code")
  const { url: pngUrl, setUrlFromBlob, clearUrl } = useObjectUrlState()

  const canGenerate = useMemo(
    () => input.trim().length > 0 && !isGenerating,
    [input, isGenerating]
  )

  const generateQrCode = useCallback(async () => {
    const value = input.trim()
    if (!value) {
      toast.error("Enter text or a URL first.")
      return
    }

    const canvas = canvasRef.current
    if (!canvas) {
      toast.error("QR preview canvas is not ready yet.")
      return
    }

    setIsGenerating(true)
    setStatus("Generating QR code locally...")

    try {
      const options = {
        errorCorrectionLevel: ecc,
        width: size,
        margin: 2,
        color: {
          dark: darkColor,
          light: lightColor,
        },
      } as const

      await QRCode.toCanvas(canvas, value, options)
      const pngBlob = await canvasToBlob(canvas)
      setUrlFromBlob(pngBlob)

      const svg = await QRCode.toString(value, {
        ...options,
        type: "svg",
      })
      setSvgMarkup(svg)
      setDownloadBaseName(sanitizeBaseName(value))
      setStatus("QR code ready. Download PNG or SVG below.")
      toast.success("QR code generated.")
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not generate QR code."
      setStatus(message)
      toast.error(message)
    } finally {
      setIsGenerating(false)
    }
  }, [darkColor, ecc, input, lightColor, setUrlFromBlob, size])

  const downloadSvg = useCallback(() => {
    if (!svgMarkup) {
      toast.error("Generate a QR code first.")
      return
    }

    const blob = new Blob([svgMarkup], { type: "image/svg+xml;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement("a")
    anchor.href = url
    anchor.download = `${downloadBaseName}.svg`
    anchor.click()
    URL.revokeObjectURL(url)
    notifyLocalDownloadSuccess()
  }, [downloadBaseName, svgMarkup])

  const resetTool = useCallback(() => {
    setInput("")
    setSize(320)
    setEcc("M")
    setDarkColor("#111827")
    setLightColor("#ffffff")
    setSvgMarkup("")
    setDownloadBaseName("qr-code")
    clearUrl()
    setStatus("Enter text or URL, then generate your QR code locally.")
    const canvas = canvasRef.current
    if (canvas) {
      const context = canvas.getContext("2d")
      if (context) {
        context.clearRect(0, 0, canvas.width, canvas.height)
      }
    }
  }, [clearUrl])

  return (
    <div className="space-y-6 overflow-x-hidden">
      <Toaster richColors position="top-right" />

      <Card className="border-blue-500/25 bg-card/80">
        <CardHeader>
          <CardTitle className="text-base">QR Code Generator</CardTitle>
          <CardDescription>
            Create scannable QR codes for links or text entirely in your browser. No uploads, no server processing.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Input and options</CardTitle>
          <CardDescription>{status}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="qr-input">URL or text</Label>
            <Textarea
              id="qr-input"
              value={input}
              rows={4}
              onChange={(event) => setInput(event.target.value)}
              placeholder="https://plain.tools"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="qr-size">Size ({size}px)</Label>
              <Input
                id="qr-size"
                type="range"
                min={128}
                max={1024}
                step={16}
                value={size}
                onChange={(event) => setSize(Number(event.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="qr-ecc">Error correction</Label>
              <select
                id="qr-ecc"
                value={ecc}
                onChange={(event) => setEcc(event.target.value as ErrorCorrectionLevel)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
              >
                {ECC_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="qr-dark">Foreground colour</Label>
              <Input
                id="qr-dark"
                type="color"
                value={darkColor}
                onChange={(event) => setDarkColor(event.target.value)}
                className="h-10 w-full cursor-pointer"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="qr-light">Background colour</Label>
              <Input
                id="qr-light"
                type="color"
                value={lightColor}
                onChange={(event) => setLightColor(event.target.value)}
                className="h-10 w-full cursor-pointer"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button type="button" disabled={!canGenerate} onClick={() => void generateQrCode()}>
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <QrCode className="h-4 w-4" />
                  Generate QR code
                </>
              )}
            </Button>
            <Button type="button" variant="outline" onClick={resetTool} disabled={isGenerating}>
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Preview and download</CardTitle>
          <CardDescription>Scan the preview with your phone camera before downloading.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ProcessedLocallyBadge />
          <div className="flex justify-center rounded-lg border border-border/70 bg-muted/20 p-4">
            <canvas
              ref={canvasRef}
              width={size}
              height={size}
              className="h-auto w-full max-w-[320px] rounded bg-white shadow-sm"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {pngUrl ? (
              <Button asChild>
                <a
                  href={pngUrl}
                  download={`${downloadBaseName}.png`}
                  onClick={() => notifyLocalDownloadSuccess()}
                >
                  <Download className="h-4 w-4" />
                  Download PNG
                </a>
              </Button>
            ) : null}
            <Button type="button" variant="outline" onClick={downloadSvg} disabled={!svgMarkup}>
              <Download className="h-4 w-4" />
              Download SVG
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
