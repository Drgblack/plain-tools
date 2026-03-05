"use client"

import jsPDF from "jspdf"
import { ArrowDown, ArrowUp, Download, FileImage, Loader2, Trash2, UploadCloud, X } from "lucide-react"
import Image from "next/image"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { toast, Toaster } from "sonner"

import { Button } from "@/components/ui/button"
import { ProcessedLocallyBadge } from "@/components/tools/processed-locally-badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { notifyLocalDownloadSuccess } from "@/lib/local-download-events"

type OrientationMode = "auto" | "portrait" | "landscape"
type PageSizeMode = "a4" | "letter" | "fit"
type MarginMode = "none" | "small" | "medium"

type ImageItem = {
  id: string
  file: File
  previewUrl: string
  width: number
  height: number
  dataUrl: string
}

type ConvertResult = {
  url: string
  sizeBytes: number
}

const ACCEPTED_IMAGE_TYPES = new Set(["image/jpeg", "image/jpg", "image/png"])

const PAGE_SIZES: Record<Exclude<PageSizeMode, "fit">, { width: number; height: number }> = {
  a4: { width: 595.28, height: 841.89 },
  letter: { width: 612, height: 792 },
}

const MARGINS: Record<MarginMode, number> = {
  none: 0,
  small: 18,
  medium: 36,
}

const formatBytes = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`
  const kb = bytes / 1024
  if (kb < 1024) return `${kb.toFixed(1)} KB`
  const mb = kb / 1024
  if (mb < 1024) return `${mb.toFixed(2)} MB`
  return `${(mb / 1024).toFixed(2)} GB`
}

const isSupportedImage = (file: File) =>
  ACCEPTED_IMAGE_TYPES.has(file.type.toLowerCase()) || /\.(jpe?g|png)$/i.test(file.name)

const readFileAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result)
        return
      }
      reject(new Error(`Could not read ${file.name} as data URL.`))
    }
    reader.onerror = () => reject(new Error(`Could not read ${file.name}.`))
    reader.readAsDataURL(file)
  })

const measureImage = (dataUrl: string) =>
  new Promise<{ width: number; height: number }>((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight })
    img.onerror = () => reject(new Error("Could not measure image dimensions."))
    img.src = dataUrl
  })

const resolveOrientation = (
  mode: OrientationMode,
  imageWidth: number,
  imageHeight: number
): "portrait" | "landscape" => {
  if (mode === "portrait" || mode === "landscape") {
    return mode
  }
  return imageWidth >= imageHeight ? "landscape" : "portrait"
}

export default function JpgToPdfTool() {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [images, setImages] = useState<ImageItem[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [isConverting, setIsConverting] = useState(false)
  const [pageSize, setPageSize] = useState<PageSizeMode>("a4")
  const [orientation, setOrientation] = useState<OrientationMode>("auto")
  const [marginMode, setMarginMode] = useState<MarginMode>("small")
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState("Add JPG/JPEG/PNG images to create a PDF locally.")
  const [result, setResult] = useState<ConvertResult | null>(null)

  useEffect(() => {
    return () => {
      images.forEach((image) => URL.revokeObjectURL(image.previewUrl))
      if (result?.url) {
        URL.revokeObjectURL(result.url)
      }
    }
  }, [images, result])

  const totalInputSize = useMemo(
    () => images.reduce((total, image) => total + image.file.size, 0),
    [images]
  )

  const clearResult = useCallback(() => {
    if (result?.url) {
      URL.revokeObjectURL(result.url)
    }
    setResult(null)
  }, [result])

  const addImages = useCallback(
    async (incoming: FileList | File[]) => {
      const candidates = Array.from(incoming)
      const supported = candidates.filter(isSupportedImage)

      if (supported.length !== candidates.length) {
        toast.error("Only JPG, JPEG, and PNG files are supported.")
      }

      if (!supported.length) {
        return
      }

      try {
        const nextItems: ImageItem[] = []

        for (const file of supported) {
          const dataUrl = await readFileAsDataUrl(file)
          const { width, height } = await measureImage(dataUrl)
          nextItems.push({
            id: crypto.randomUUID(),
            file,
            dataUrl,
            width,
            height,
            previewUrl: URL.createObjectURL(file),
          })
        }

        setImages((previous) => [...previous, ...nextItems])
        setStatus("Ready to convert.")
        setProgress(0)
        clearResult()
      } catch (error) {
        const message = error instanceof Error ? error.message : "Could not load one or more images."
        toast.error(message)
      }
    },
    [clearResult]
  )

  const removeImage = useCallback(
    (id: string) => {
      setImages((previous) => {
        const target = previous.find((item) => item.id === id)
        if (target) {
          URL.revokeObjectURL(target.previewUrl)
        }
        return previous.filter((item) => item.id !== id)
      })
      setStatus("Ready to convert.")
      setProgress(0)
      clearResult()
    },
    [clearResult]
  )

  const moveImage = useCallback(
    (index: number, direction: "up" | "down") => {
      setImages((previous) => {
        const target = direction === "up" ? index - 1 : index + 1
        if (target < 0 || target >= previous.length) {
          return previous
        }

        const reordered = [...previous]
        const [moved] = reordered.splice(index, 1)
        reordered.splice(target, 0, moved)
        return reordered
      })
      setStatus("Ready to convert.")
      setProgress(0)
      clearResult()
    },
    [clearResult]
  )

  const runConversion = useCallback(async () => {
    if (!images.length) {
      toast.error("Add at least one image.")
      return
    }

    setIsConverting(true)
    setProgress(3)
    setStatus("Building PDF locally...")
    clearResult()

    try {
      const firstImage = images[0]
      const firstOrientation = resolveOrientation(orientation, firstImage.width, firstImage.height)
      const firstFormat =
        pageSize === "fit"
          ? ([firstImage.width, firstImage.height] as [number, number])
          : (firstOrientation === "portrait"
              ? ([PAGE_SIZES[pageSize].width, PAGE_SIZES[pageSize].height] as [number, number])
              : ([PAGE_SIZES[pageSize].height, PAGE_SIZES[pageSize].width] as [number, number]))

      const pdf = new jsPDF({
        unit: "pt",
        orientation: firstOrientation,
        format: firstFormat,
        compress: true,
      })

      const margin = MARGINS[marginMode]

      for (let index = 0; index < images.length; index += 1) {
        const image = images[index]
        const pageOrientation = resolveOrientation(orientation, image.width, image.height)

        if (index > 0) {
          if (pageSize === "fit") {
            pdf.addPage([image.width, image.height], pageOrientation)
          } else {
            const dims = PAGE_SIZES[pageSize]
            const pageFormat =
              pageOrientation === "portrait"
                ? ([dims.width, dims.height] as [number, number])
                : ([dims.height, dims.width] as [number, number])
            pdf.addPage(pageFormat, pageOrientation)
          }
        }

        const pageWidth = pdf.internal.pageSize.getWidth()
        const pageHeight = pdf.internal.pageSize.getHeight()

        const maxWidth = Math.max(1, pageWidth - margin * 2)
        const maxHeight = Math.max(1, pageHeight - margin * 2)

        const scaleFactor = Math.min(maxWidth / image.width, maxHeight / image.height)
        const renderWidth = image.width * scaleFactor
        const renderHeight = image.height * scaleFactor

        const offsetX = (pageWidth - renderWidth) / 2
        const offsetY = (pageHeight - renderHeight) / 2

        const format = image.file.type.toLowerCase().includes("png") ? "PNG" : "JPEG"

        pdf.addImage(
          image.dataUrl,
          format,
          offsetX,
          offsetY,
          renderWidth,
          renderHeight,
          undefined,
          "FAST"
        )

        setStatus(`Converting image ${index + 1} of ${images.length}...`)
        setProgress(Math.round(((index + 1) / images.length) * 100))
      }

      const blob = pdf.output("blob")
      const url = URL.createObjectURL(blob)

      setResult({ url, sizeBytes: blob.size })
      setStatus("Done. PDF is ready to download.")
      setProgress(100)
      toast.success("JPG to PDF conversion complete.")
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not convert images to PDF."
      setStatus("Conversion failed.")
      toast.error(message)
    } finally {
      setIsConverting(false)
    }
  }, [clearResult, images, marginMode, orientation, pageSize])

  return (
    <div className="space-y-6 overflow-x-hidden">
      <Toaster richColors position="top-right" />

      <Card className="border-blue-500/25 bg-card/80">
        <CardHeader>
          <CardTitle className="text-base">Best-effort offline JPG to PDF</CardTitle>
          <CardDescription>
            Conversion runs entirely in your browser. Files never leave your device.
          </CardDescription>
        </CardHeader>
      </Card>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png"
        multiple
        className="hidden"
        onChange={(event) => {
          if (event.target.files?.length) {
            void addImages(event.target.files)
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
              if (event.dataTransfer.files.length) {
                void addImages(event.dataTransfer.files)
              }
            }}
            className={`cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition-colors sm:p-10 ${
              isDragging ? "border-primary bg-primary/10" : "border-border bg-muted/20 hover:border-primary/70"
            }`}
          >
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <UploadCloud className="h-6 w-6 text-primary" />
            </div>
            <p className="text-sm font-medium text-foreground">Drop JPG/JPEG/PNG files here, or click to browse</p>
            <p className="mt-1 text-xs text-muted-foreground">Multi-image PDF creation with local processing only</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Images ({images.length})</CardTitle>
          <CardDescription className="break-words">
            {images.length > 0 ? `${formatBytes(totalInputSize)} selected` : "No images selected yet."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {images.length === 0 ? (
            <p className="text-sm text-muted-foreground">Add one or more images to begin.</p>
          ) : (
            <div className="space-y-3">
              {images.map((image, index) => (
                <div
                  key={image.id}
                  className="flex min-w-0 flex-col gap-3 rounded-lg border bg-muted/30 p-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 gap-3">
                    <Image
                      src={image.previewUrl}
                      alt={image.file.name}
                      width={56}
                      height={56}
                      unoptimized
                      className="h-14 w-14 shrink-0 rounded-md object-cover"
                    />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">{image.file.name}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {image.width}x{image.height} • {formatBytes(image.file.size)}
                      </p>
                    </div>
                  </div>

                  <div className="flex w-full gap-2 sm:w-auto">
                    <Button
                      type="button"
                      variant="outline"
                      className="h-9 min-h-[44px] flex-1 px-3 sm:flex-none"
                      onClick={() => moveImage(index, "up")}
                      disabled={index === 0 || isConverting}
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="h-9 min-h-[44px] flex-1 px-3 sm:flex-none"
                      onClick={() => moveImage(index, "down")}
                      disabled={index === images.length - 1 || isConverting}
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      className="h-9 min-h-[44px] flex-1 px-3 text-destructive hover:text-destructive sm:flex-none"
                      onClick={() => removeImage(image.id)}
                      disabled={isConverting}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="page-size">Page size</Label>
              <select
                id="page-size"
                value={pageSize}
                onChange={(event) => setPageSize(event.target.value as PageSizeMode)}
                className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                disabled={isConverting}
              >
                <option value="a4">A4</option>
                <option value="letter">Letter</option>
                <option value="fit">Fit to image</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="orientation">Orientation</Label>
              <select
                id="orientation"
                value={orientation}
                onChange={(event) => setOrientation(event.target.value as OrientationMode)}
                className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                disabled={isConverting}
              >
                <option value="auto">Auto</option>
                <option value="portrait">Portrait</option>
                <option value="landscape">Landscape</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="margin">Margin</Label>
              <select
                id="margin"
                value={marginMode}
                onChange={(event) => setMarginMode(event.target.value as MarginMode)}
                className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                disabled={isConverting}
              >
                <option value="none">None</option>
                <option value="small">Small</option>
                <option value="medium">Medium</option>
              </select>
            </div>
          </div>

          {(isConverting || progress > 0) ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{isConverting ? "Converting" : "Complete"}</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2 w-full" />
              <p className="text-xs text-muted-foreground">{status}</p>
            </div>
          ) : null}
        </CardContent>

        <CardFooter className="flex flex-col gap-2 sm:flex-row">
          <Button
            type="button"
            className="w-full sm:w-auto"
            disabled={isConverting || images.length === 0}
            onClick={runConversion}
          >
            {isConverting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Converting...
              </>
            ) : (
              <>
                <FileImage className="h-4 w-4" />
                Convert to PDF
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => {
              images.forEach((image) => URL.revokeObjectURL(image.previewUrl))
              setImages([])
              setPageSize("a4")
              setOrientation("auto")
              setMarginMode("small")
              setProgress(0)
              setStatus("Add JPG/JPEG/PNG images to create a PDF locally.")
              clearResult()
            }}
            disabled={isConverting || images.length === 0}
          >
            <Trash2 className="h-4 w-4" />
            Clear
          </Button>
        </CardFooter>
      </Card>

      {result ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">PDF output ready</CardTitle>
            <CardDescription>images-to-pdf.pdf • {formatBytes(result.sizeBytes)}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <ProcessedLocallyBadge />
            <Button asChild className="w-full sm:w-auto">
              <a href={result.url} download="images-to-pdf.pdf" onClick={() => notifyLocalDownloadSuccess()}>
                <Download className="h-4 w-4" />
                Download images-to-pdf.pdf
              </a>
            </Button>
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}
