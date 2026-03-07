"use client"

import { Download, Droplets, Image as ImageIcon, Loader2, Type } from "lucide-react"
import { PDFDocument, StandardFonts, degrees, rgb } from "pdf-lib"
import { useCallback, useEffect, useMemo, useState } from "react"
import { Toaster, toast } from "sonner"

import { ProcessedLocallyBadge } from "@/components/tools/processed-locally-badge"
import { PdfFileDropzone } from "@/components/tools/shared/pdf-file-dropzone"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { notifyLocalDownloadSuccess } from "@/lib/local-download-events"
import { ensureSafeLocalFileSize, formatFileSize, isPdfLikeFile } from "@/lib/pdf-client-utils"

type WatermarkPosition =
  | "center"
  | "top-center"
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  | "diagonal-center"

type WatermarkMode = "text" | "image"

type WatermarkedResult = {
  url: string
  name: string
  sizeBytes: number
}

const POSITION_OPTIONS: { value: WatermarkPosition; label: string }[] = [
  { value: "center", label: "Center" },
  { value: "top-center", label: "Top" },
  { value: "diagonal-center", label: "Diagonal center" },
  { value: "top-left", label: "Top left" },
  { value: "top-right", label: "Top right" },
  { value: "bottom-left", label: "Bottom left" },
  { value: "bottom-right", label: "Bottom right" },
]

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

const hexToRgb = (hex: string) => {
  const cleaned = hex.trim().replace("#", "")
  const full = cleaned.length === 3
    ? cleaned
        .split("")
        .map((char) => `${char}${char}`)
        .join("")
    : cleaned

  if (!/^[0-9a-fA-F]{6}$/.test(full)) {
    return rgb(0.1, 0.1, 0.1)
  }

  const red = Number.parseInt(full.slice(0, 2), 16) / 255
  const green = Number.parseInt(full.slice(2, 4), 16) / 255
  const blue = Number.parseInt(full.slice(4, 6), 16) / 255
  return rgb(red, green, blue)
}

const measureTextWidth = (text: string, fontSize: number) => text.length * fontSize * 0.52

const calculatePlacement = (
  position: WatermarkPosition,
  pageWidth: number,
  pageHeight: number,
  boxWidth: number,
  boxHeight: number
) => {
  const paddingX = pageWidth * 0.06
  const paddingY = pageHeight * 0.06

  switch (position) {
    case "top-center":
      return { x: (pageWidth - boxWidth) / 2, y: pageHeight - boxHeight - paddingY }
    case "top-left":
      return { x: paddingX, y: pageHeight - boxHeight - paddingY }
    case "top-right":
      return { x: pageWidth - boxWidth - paddingX, y: pageHeight - boxHeight - paddingY }
    case "bottom-left":
      return { x: paddingX, y: paddingY }
    case "bottom-right":
      return { x: pageWidth - boxWidth - paddingX, y: paddingY }
    case "diagonal-center":
      return {
        x: (pageWidth - boxWidth) / 2,
        y: (pageHeight - boxHeight) / 2,
      }
    case "center":
    default:
      return {
        x: (pageWidth - boxWidth) / 2,
        y: (pageHeight - boxHeight) / 2,
      }
  }
}

export default function WatermarkPdfTool() {
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [mode, setMode] = useState<WatermarkMode>("text")
  const [watermarkText, setWatermarkText] = useState("CONFIDENTIAL")
  const [position, setPosition] = useState<WatermarkPosition>("diagonal-center")
  const [opacity, setOpacity] = useState(0.25)
  const [fontSize, setFontSize] = useState(42)
  const [rotationAngle, setRotationAngle] = useState(35)
  const [colorHex, setColorHex] = useState("#1E40AF")
  const [imageScalePercent, setImageScalePercent] = useState(34)
  const [isApplying, setIsApplying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState("Upload a PDF and configure your watermark options.")
  const [result, setResult] = useState<WatermarkedResult | null>(null)

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

  const canApply = useMemo(() => {
    if (!pdfFile || isApplying) return false
    if (mode === "image") return Boolean(imageFile)
    return watermarkText.trim().length > 0
  }, [imageFile, isApplying, mode, pdfFile, watermarkText])

  const applyWatermark = useCallback(async () => {
    if (!pdfFile) {
      toast.error("Upload a PDF first.")
      return
    }

    if (mode === "image" && !imageFile) {
      toast.error("Upload a watermark image first.")
      return
    }

    if (mode === "text" && watermarkText.trim().length === 0) {
      toast.error("Enter watermark text.")
      return
    }

    setIsApplying(true)
    setProgress(5)
    setStatus("Applying watermark locally...")
    clearResult()

    try {
      const doc = await PDFDocument.load(await pdfFile.arrayBuffer(), {
        ignoreEncryption: true,
      })
      const pages = doc.getPages()
      const totalPages = pages.length

      const font = await doc.embedFont(StandardFonts.HelveticaBold)
      let watermarkImage: Awaited<ReturnType<PDFDocument["embedPng"]>> | Awaited<ReturnType<PDFDocument["embedJpg"]>> | null = null

      if (mode === "image" && imageFile) {
        const imageBytes = new Uint8Array(await imageFile.arrayBuffer())
        const lower = imageFile.name.toLowerCase()
        if (lower.endsWith(".png") || imageFile.type === "image/png") {
          watermarkImage = await doc.embedPng(imageBytes)
        } else {
          watermarkImage = await doc.embedJpg(imageBytes)
        }
      }

      const safeOpacity = clamp(opacity, 0.05, 1)
      const safeFontSize = clamp(fontSize, 10, 180)
      const safeScale = clamp(imageScalePercent, 8, 90) / 100
      const safeRotation = clamp(rotationAngle, -180, 180)
      const color = hexToRgb(colorHex)

      for (let index = 0; index < totalPages; index += 1) {
        const page = pages[index]
        if (!page) continue

        const pageWidth = page.getWidth()
        const pageHeight = page.getHeight()

        if (mode === "text") {
          const text = watermarkText.trim()
          const textWidth = measureTextWidth(text, safeFontSize)
          const textHeight = safeFontSize * 1.1
          const placement = calculatePlacement(position, pageWidth, pageHeight, textWidth, textHeight)

          page.drawText(text, {
            x: placement.x,
            y: placement.y,
            size: safeFontSize,
            font,
            color,
            opacity: safeOpacity,
            rotate: degrees(safeRotation),
          })
        } else if (watermarkImage) {
          let imageWidth = pageWidth * safeScale
          let imageHeight = (imageWidth * watermarkImage.height) / watermarkImage.width

          const maxHeight = pageHeight * 0.6
          if (imageHeight > maxHeight) {
            imageHeight = maxHeight
            imageWidth = (imageHeight * watermarkImage.width) / watermarkImage.height
          }

          const placement = calculatePlacement(position, pageWidth, pageHeight, imageWidth, imageHeight)

          page.drawImage(watermarkImage, {
            x: placement.x,
            y: placement.y,
            width: imageWidth,
            height: imageHeight,
            opacity: safeOpacity,
            rotate: degrees(safeRotation),
          })
        }

        const nextProgress = 10 + Math.round(((index + 1) / totalPages) * 80)
        setProgress(nextProgress)
      }

      const outputBytes = await doc.save({ useObjectStreams: true })
      const blob = new Blob([outputBytes], { type: "application/pdf" })
      const url = URL.createObjectURL(blob)
      const baseName = pdfFile.name.replace(/\.pdf$/i, "")

      setResult({
        url,
        name: `${baseName}-watermarked.pdf`,
        sizeBytes: blob.size,
      })
      setProgress(100)
      setStatus("Done. Watermarked PDF is ready.")
      toast.success("Watermark applied.")
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not apply watermark."
      setStatus(message)
      toast.error(message)
    } finally {
      setIsApplying(false)
    }
  }, [
    clearResult,
    colorHex,
    fontSize,
    imageFile,
    imageScalePercent,
    mode,
    opacity,
    rotationAngle,
    pdfFile,
    position,
    watermarkText,
  ])

  return (
    <div className="space-y-6 overflow-x-hidden">
      <Toaster richColors position="top-right" />

      <Card className="border-blue-500/25 bg-card/80">
        <CardHeader>
          <CardTitle className="text-base">Add watermark to every page</CardTitle>
          <CardDescription>
            Add text or image watermark overlays locally in your browser. Files never leave your device.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <PdfFileDropzone
            accept="application/pdf"
            title="Drop a PDF here, or click to browse"
            subtitle="Local-only processing with no upload step"
            onFilesSelected={(files) => {
              const selected = files[0]
              if (!selected) return
              try {
                if (!isPdfLikeFile(selected)) {
                  toast.error("Please upload a PDF file.")
                  return
                }
                ensureSafeLocalFileSize(selected)
                setPdfFile(selected)
                clearResult()
                setProgress(0)
                setStatus(`Ready to watermark ${selected.name}.`)
              } catch (error) {
                const message = error instanceof Error ? error.message : "Could not use this PDF."
                setStatus(message)
                toast.error(message)
              }
            }}
          />

          {pdfFile ? (
            <div className="mt-4 rounded-lg border bg-muted/20 p-3 text-sm">
              <p className="font-medium text-foreground">{pdfFile.name}</p>
              <p className="text-xs text-muted-foreground">{formatFileSize(pdfFile.size)}</p>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Watermark options</CardTitle>
          <CardDescription>{status}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant={mode === "text" ? "default" : "outline"}
              size="sm"
              onClick={() => setMode("text")}
            >
              <Type className="h-4 w-4" />
              Text watermark
            </Button>
            <Button
              type="button"
              variant={mode === "image" ? "default" : "outline"}
              size="sm"
              onClick={() => setMode("image")}
            >
              <ImageIcon className="h-4 w-4" />
              Image watermark
            </Button>
          </div>

          {mode === "text" ? (
            <div>
              <p className="mb-1 text-xs font-medium text-muted-foreground">Watermark text</p>
              <Input
                value={watermarkText}
                onChange={(event) => setWatermarkText(event.target.value)}
                placeholder="CONFIDENTIAL"
              />
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Watermark image (PNG or JPG)</p>
              <Input
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                onChange={(event) => {
                  const selected = event.target.files?.[0]
                  if (!selected) return
                  if (!selected.type.startsWith("image/")) {
                    toast.error("Upload a PNG or JPG image.")
                    return
                  }
                  setImageFile(selected)
                  clearResult()
                }}
              />
              {imageFile ? (
                <p className="text-xs text-muted-foreground">
                  {imageFile.name} - {formatFileSize(imageFile.size)}
                </p>
              ) : null}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="mb-1 text-xs font-medium text-muted-foreground">Position</p>
              <select
                value={position}
                onChange={(event) => setPosition(event.target.value as WatermarkPosition)}
                className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground"
              >
                {POSITION_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <p className="mb-1 text-xs font-medium text-muted-foreground">Opacity ({opacity.toFixed(2)})</p>
              <input
                type="range"
                min={0.05}
                max={1}
                step={0.05}
                value={opacity}
                onChange={(event) => setOpacity(Number.parseFloat(event.target.value))}
                className="h-10 w-full"
              />
            </div>

            <div>
              <p className="mb-1 text-xs font-medium text-muted-foreground">
                Rotation angle ({rotationAngle}°)
              </p>
              <input
                type="range"
                min={-180}
                max={180}
                step={1}
                value={rotationAngle}
                onChange={(event) => setRotationAngle(Number.parseInt(event.target.value, 10))}
                className="h-10 w-full"
              />
            </div>

            {mode === "text" ? (
              <>
                <div>
                  <p className="mb-1 text-xs font-medium text-muted-foreground">Text size ({fontSize}px)</p>
                  <input
                    type="range"
                    min={10}
                    max={180}
                    step={2}
                    value={fontSize}
                    onChange={(event) => setFontSize(Number.parseInt(event.target.value, 10))}
                    className="h-10 w-full"
                  />
                </div>
                <div>
                  <p className="mb-1 text-xs font-medium text-muted-foreground">Text colour</p>
                  <Input
                    type="color"
                    value={colorHex}
                    onChange={(event) => setColorHex(event.target.value)}
                    className="h-10 w-full"
                  />
                </div>
              </>
            ) : (
              <div>
                <p className="mb-1 text-xs font-medium text-muted-foreground">
                  Image size ({imageScalePercent}% of page width)
                </p>
                <input
                  type="range"
                  min={8}
                  max={90}
                  step={1}
                  value={imageScalePercent}
                  onChange={(event) => setImageScalePercent(Number.parseInt(event.target.value, 10))}
                  className="h-10 w-full"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Apply watermark</CardTitle>
          <CardDescription>
            Watermark is applied to each page in a new output file.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {(isApplying || progress > 0) && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{isApplying ? "Applying watermark" : "Ready"}</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2 w-full" />
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <Button type="button" onClick={() => void applyWatermark()} disabled={!canApply}>
              {isApplying ? <Loader2 className="h-4 w-4 animate-spin" /> : <Droplets className="h-4 w-4" />}
              Apply Watermark
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setMode("text")
                setWatermarkText("CONFIDENTIAL")
                setPosition("diagonal-center")
                setOpacity(0.25)
                setFontSize(42)
                setRotationAngle(35)
                setColorHex("#1E40AF")
                setImageScalePercent(34)
                setImageFile(null)
                clearResult()
                setProgress(0)
                setStatus(pdfFile ? "Settings reset. Ready to watermark." : "Upload a PDF and configure your watermark options.")
              }}
              disabled={isApplying}
            >
              Reset options
            </Button>
          </div>

          {result ? (
            <div className="rounded-lg border bg-muted/20 p-3">
              <ProcessedLocallyBadge />
              <p className="mt-2 text-sm text-muted-foreground">
                {result.name} - {formatFileSize(result.sizeBytes)}
              </p>
              <Button asChild className="mt-3">
                <a
                  href={result.url}
                  download={result.name}
                  onClick={() => notifyLocalDownloadSuccess()}
                >
                  <Download className="h-4 w-4" />
                  Download watermarked PDF
                </a>
              </Button>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  )
}
