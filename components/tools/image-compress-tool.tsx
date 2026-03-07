"use client"

import Image from "next/image"
import { Download, FileImage, Loader2, Trash2 } from "lucide-react"
import { useCallback, useEffect, useMemo, useState } from "react"
import { Toaster, toast } from "sonner"

import { ProcessedLocallyBadge } from "@/components/tools/processed-locally-badge"
import { PdfFileDropzone } from "@/components/tools/shared/pdf-file-dropzone"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { notifyLocalDownloadSuccess } from "@/lib/local-download-events"
import { blobToUint8Array, downloadZip, makeZip } from "@/lib/zip-download"

type CompressionItem = {
  id: string
  file: File
  originalUrl: string
  width: number
  height: number
  compressedUrl: string | null
  compressedBlob: Blob | null
  compressedName: string | null
  compressedMime: string | null
}

const ACCEPTED_IMAGE_TYPES = new Set(["image/jpeg", "image/jpg", "image/png", "image/webp"])

const MAX_BATCH_FILES = 30

const isSupportedImage = (file: File) =>
  ACCEPTED_IMAGE_TYPES.has(file.type.toLowerCase()) || /\.(jpe?g|png|webp)$/i.test(file.name)

const formatBytes = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`
  const kb = bytes / 1024
  if (kb < 1024) return `${kb.toFixed(1)} KB`
  const mb = kb / 1024
  if (mb < 1024) return `${mb.toFixed(2)} MB`
  return `${(mb / 1024).toFixed(2)} GB`
}

const getBaseName = (name: string) => name.replace(/\.[^.]+$/, "")

const loadImageElement = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new window.Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error("Could not decode image."))
    image.src = src
  })

const canvasToBlob = (canvas: HTMLCanvasElement, mimeType: string, quality: number) =>
  new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Could not encode compressed image output."))
          return
        }
        resolve(blob)
      },
      mimeType,
      quality
    )
  })

const resolveOutputMime = (file: File) => {
  const type = file.type.toLowerCase()
  if (type === "image/png") return "image/webp"
  if (type === "image/webp") return "image/webp"
  return "image/jpeg"
}

const extensionForMime = (mimeType: string) => {
  if (mimeType === "image/webp") return "webp"
  if (mimeType === "image/png") return "png"
  return "jpg"
}

const revokeItemUrls = (item: CompressionItem) => {
  URL.revokeObjectURL(item.originalUrl)
  if (item.compressedUrl) {
    URL.revokeObjectURL(item.compressedUrl)
  }
}

export default function ImageCompressTool() {
  const [items, setItems] = useState<CompressionItem[]>([])
  const [qualityPercent, setQualityPercent] = useState(78)
  const [maxDimension, setMaxDimension] = useState(2200)
  const [isCompressing, setIsCompressing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState("Add JPG, PNG, or WebP images to optimise them locally.")

  useEffect(() => {
    return () => {
      items.forEach((item) => revokeItemUrls(item))
    }
  }, [items])

  const totalBeforeBytes = useMemo(
    () => items.reduce((sum, item) => sum + item.file.size, 0),
    [items]
  )

  const totalAfterBytes = useMemo(
    () => items.reduce((sum, item) => sum + (item.compressedBlob?.size ?? 0), 0),
    [items]
  )

  const compressedCount = useMemo(
    () => items.filter((item) => item.compressedBlob && item.compressedName).length,
    [items]
  )

  const canCompress = items.length > 0 && !isCompressing
  const hasCompressedOutput = compressedCount > 0
  const hasMultipleOutputs = compressedCount > 1

  const clearCompressed = useCallback(() => {
    setItems((previous) =>
      previous.map((item) => {
        if (item.compressedUrl) {
          URL.revokeObjectURL(item.compressedUrl)
        }
        return {
          ...item,
          compressedUrl: null,
          compressedBlob: null,
          compressedName: null,
          compressedMime: null,
        }
      })
    )
  }, [])

  const handleFiles = useCallback(
    async (selectedFiles: File[]) => {
      const valid = selectedFiles.filter(isSupportedImage)
      if (!valid.length) {
        toast.error("Only JPG, PNG, and WebP files are supported.")
        return
      }
      if (valid.length !== selectedFiles.length) {
        toast.error("Some files were skipped because they are not JPG, PNG, or WebP.")
      }

      const availableSlots = Math.max(0, MAX_BATCH_FILES - items.length)
      if (availableSlots <= 0) {
        toast.error(`You can compress up to ${MAX_BATCH_FILES} images at once.`)
        return
      }
      const filesToAdd = valid.slice(0, availableSlots)
      if (filesToAdd.length < valid.length) {
        toast.error(`Only the first ${availableSlots} files were added (max ${MAX_BATCH_FILES}).`)
      }

      try {
        const nextItems: CompressionItem[] = []
        for (const file of filesToAdd) {
          const originalUrl = URL.createObjectURL(file)
          const image = await loadImageElement(originalUrl)
          nextItems.push({
            id: crypto.randomUUID(),
            file,
            originalUrl,
            width: image.naturalWidth,
            height: image.naturalHeight,
            compressedUrl: null,
            compressedBlob: null,
            compressedName: null,
            compressedMime: null,
          })
        }

        setItems((previous) => [...previous, ...nextItems])
        setProgress(0)
        setStatus("Ready to compress.")
      } catch (error) {
        const message = error instanceof Error ? error.message : "Could not load one or more images."
        toast.error(message)
      }
    },
    [items.length]
  )

  const removeItem = useCallback((itemId: string) => {
    setItems((previous) => {
      const target = previous.find((item) => item.id === itemId)
      if (target) {
        revokeItemUrls(target)
      }
      return previous.filter((item) => item.id !== itemId)
    })
  }, [])

  const runCompression = useCallback(async () => {
    if (!items.length) {
      toast.error("Add at least one image first.")
      return
    }

    clearCompressed()
    setIsCompressing(true)
    setProgress(2)
    setStatus("Optimising images locally...")

    try {
      const quality = Math.min(1, Math.max(0.01, qualityPercent / 100))

      for (let index = 0; index < items.length; index += 1) {
        const item = items[index]
        const sourceImage = await loadImageElement(item.originalUrl)
        const longestSide = Math.max(sourceImage.naturalWidth, sourceImage.naturalHeight)
        const scale = longestSide > maxDimension ? maxDimension / longestSide : 1
        const outputWidth = Math.max(1, Math.round(sourceImage.naturalWidth * scale))
        const outputHeight = Math.max(1, Math.round(sourceImage.naturalHeight * scale))

        const canvas = document.createElement("canvas")
        canvas.width = outputWidth
        canvas.height = outputHeight

        const context = canvas.getContext("2d")
        if (!context) {
          throw new Error("Could not initialise canvas for image compression.")
        }

        context.drawImage(sourceImage, 0, 0, outputWidth, outputHeight)

        let outputMime = resolveOutputMime(item.file)
        let compressedBlob: Blob

        try {
          compressedBlob = await canvasToBlob(canvas, outputMime, quality)
        } catch {
          outputMime = "image/jpeg"
          compressedBlob = await canvasToBlob(canvas, outputMime, quality)
        }

        const compressedName = `${getBaseName(item.file.name)}-compressed.${extensionForMime(outputMime)}`
        const compressedUrl = URL.createObjectURL(compressedBlob)

        setItems((previous) =>
          previous.map((current) => {
            if (current.id !== item.id) return current
            if (current.compressedUrl) {
              URL.revokeObjectURL(current.compressedUrl)
            }
            return {
              ...current,
              compressedBlob,
              compressedUrl,
              compressedName,
              compressedMime: outputMime,
            }
          })
        )

        setStatus(`Compressed ${index + 1} of ${items.length}...`)
        setProgress(Math.round(((index + 1) / items.length) * 100))

        canvas.width = 0
        canvas.height = 0
      }

      setStatus("Done. Compressed image files are ready.")
      toast.success("Image compression complete.")
    } catch (error) {
      const message = error instanceof Error ? error.message : "Compression failed."
      setStatus(message)
      toast.error(message)
    } finally {
      setIsCompressing(false)
    }
  }, [clearCompressed, items, maxDimension, qualityPercent])

  const downloadSingle = useCallback((item: CompressionItem) => {
    if (!item.compressedUrl || !item.compressedName) return
    const anchor = document.createElement("a")
    anchor.href = item.compressedUrl
    anchor.download = item.compressedName
    anchor.click()
    notifyLocalDownloadSuccess()
  }, [])

  const downloadAllZip = useCallback(async () => {
    const ready = items.filter((item) => item.compressedBlob && item.compressedName)
    if (!ready.length) {
      toast.error("No compressed output to download.")
      return
    }

    try {
      const entries = await Promise.all(
        ready.map(async (item) => ({
          name: item.compressedName as string,
          data: await blobToUint8Array(item.compressedBlob as Blob),
        }))
      )
      const zipBytes = makeZip(entries)
      downloadZip(zipBytes, "image-compress-output.zip")
      notifyLocalDownloadSuccess()
    } catch {
      toast.error("Could not create ZIP output.")
    }
  }, [items])

  return (
    <div className="space-y-6 overflow-x-hidden">
      <Toaster richColors position="top-right" />

      <Card className="border-blue-500/25 bg-card/80">
        <CardHeader>
          <CardTitle className="text-base">Image Compressor / Optimizer</CardTitle>
          <CardDescription>
            Compress images locally in your browser. No uploads, no server-side file handling.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <PdfFileDropzone
            accept="image/jpeg,image/jpg,image/png,image/webp"
            multiple
            disabled={isCompressing}
            title="Drop JPG, PNG, or WebP images here, or click to browse"
            subtitle="Batch optimisation runs locally with no upload step"
            onFilesSelected={(files) => {
              void handleFiles(files)
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Compression settings</CardTitle>
          <CardDescription>{status}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs font-medium text-muted-foreground">Quality ({qualityPercent})</p>
              <p className="text-xs text-muted-foreground">1-100</p>
            </div>
            <input
              type="range"
              min={1}
              max={100}
              step={1}
              value={qualityPercent}
              onChange={(event) => setQualityPercent(Number.parseInt(event.target.value, 10))}
              className="h-10 w-full"
              disabled={isCompressing}
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs font-medium text-muted-foreground">Max dimension ({maxDimension}px)</p>
              <p className="text-xs text-muted-foreground">Resize longer side if needed</p>
            </div>
            <input
              type="range"
              min={640}
              max={4096}
              step={32}
              value={maxDimension}
              onChange={(event) => setMaxDimension(Number.parseInt(event.target.value, 10))}
              className="h-10 w-full"
              disabled={isCompressing}
            />
          </div>

          {(isCompressing || progress > 0) && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{isCompressing ? "Compressing" : "Complete"}</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2 w-full" />
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-2 sm:flex-row">
          <Button type="button" className="w-full sm:w-auto" disabled={!canCompress} onClick={() => void runCompression()}>
            {isCompressing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Compressing...
              </>
            ) : (
              <>
                <FileImage className="h-4 w-4" />
                Compress & Download
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto"
            disabled={isCompressing || items.length === 0}
            onClick={() => {
              setItems((previous) => {
                previous.forEach((item) => revokeItemUrls(item))
                return []
              })
              setProgress(0)
              setStatus("Add JPG, PNG, or WebP images to optimise them locally.")
            }}
          >
            <Trash2 className="h-4 w-4" />
            Clear files
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Preview and results ({items.length})</CardTitle>
          <CardDescription>
            {items.length > 0
              ? `${formatBytes(totalBeforeBytes)} before${
                  hasCompressedOutput ? ` • ${formatBytes(totalAfterBytes)} after` : ""
                }`
              : "No images selected yet."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground">Upload one or more images to preview compression results.</p>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="rounded-xl border border-border/70 bg-card/40 p-3">
                  <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.width}x{item.height} • {formatBytes(item.file.size)}
                        {item.compressedBlob ? ` -> ${formatBytes(item.compressedBlob.size)}` : ""}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {item.compressedBlob && item.compressedName ? (
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => downloadSingle(item)}
                        >
                          <Download className="h-4 w-4" />
                          Download
                        </Button>
                      ) : null}
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => removeItem(item.id)}
                        disabled={isCompressing}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-muted-foreground">Before</p>
                      <div className="overflow-hidden rounded-lg border border-border/60 bg-muted/15">
                        <Image
                          src={item.originalUrl}
                          alt={`${item.file.name} before compression`}
                          width={item.width}
                          height={item.height}
                          unoptimized
                          className="h-44 w-full object-contain"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-muted-foreground">After</p>
                      <div className="overflow-hidden rounded-lg border border-border/60 bg-muted/15">
                        {item.compressedUrl ? (
                          <Image
                            src={item.compressedUrl}
                            alt={`${item.file.name} after compression`}
                            width={item.width}
                            height={item.height}
                            unoptimized
                            className="h-44 w-full object-contain"
                          />
                        ) : (
                          <div className="flex h-44 items-center justify-center text-xs text-muted-foreground">
                            Run compression to preview output
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {hasCompressedOutput ? (
            <div className="rounded-lg border bg-muted/20 p-3">
              <ProcessedLocallyBadge />
              <p className="mt-2 text-xs text-muted-foreground">
                {compressedCount} compressed image file{compressedCount === 1 ? "" : "s"} ready.
              </p>
              {hasMultipleOutputs ? (
                <Button type="button" className="mt-3 w-full sm:w-auto" onClick={() => void downloadAllZip()}>
                  <Download className="h-4 w-4" />
                  Download ZIP
                </Button>
              ) : null}
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  )
}
