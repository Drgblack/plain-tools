"use client"

import jsQR from "jsqr"
import {
  Camera,
  CameraOff,
  CheckCircle2,
  Copy,
  Loader2,
  ScanLine,
  Upload,
} from "lucide-react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Toaster, toast } from "sonner"

import { PdfFileDropzone } from "@/components/tools/shared/pdf-file-dropzone"
import { ProcessedLocallyBadge } from "@/components/tools/processed-locally-badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useObjectUrlState } from "@/hooks/use-object-url-state"

type ScanSource = "camera" | "image" | null

type BarcodeDetectorLike = {
  detect: (
    source: HTMLCanvasElement | HTMLImageElement | ImageBitmap | OffscreenCanvas
  ) => Promise<Array<{ rawValue?: string }>>
}

type BarcodeDetectorCtorLike = new (options?: { formats?: string[] }) => BarcodeDetectorLike

const getBarcodeDetectorCtor = (): BarcodeDetectorCtorLike | null => {
  if (typeof window === "undefined") return null
  const candidate = (window as unknown as { BarcodeDetector?: BarcodeDetectorCtorLike })
    .BarcodeDetector
  return candidate ?? null
}

const isLikelyUrl = (value: string) => {
  const trimmed = value.trim()
  if (!trimmed) return false
  try {
    const withScheme = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
    const parsed = new URL(withScheme)
    return parsed.protocol === "http:" || parsed.protocol === "https:"
  } catch {
    return false
  }
}

const normaliseUrl = (value: string) => {
  const trimmed = value.trim()
  if (!trimmed) return trimmed
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  return `https://${trimmed}`
}

const isImageFile = (file: File) =>
  file.type.startsWith("image/") ||
  /\.(png|jpe?g|webp|bmp|gif)$/i.test(file.name)

export default function QrScannerTool() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const { url: imagePreviewUrl, setUrlFromBlob, clearUrl: clearImagePreview } = useObjectUrlState()

  const [isCameraActive, setIsCameraActive] = useState(false)
  const [isWorking, setIsWorking] = useState(false)
  const [status, setStatus] = useState(
    "Scan QR codes with camera access or upload a QR image for local decoding."
  )
  const [decodedValue, setDecodedValue] = useState<string | null>(null)
  const [scanSource, setScanSource] = useState<ScanSource>(null)

  const hasBarcodeDetector = useMemo(() => Boolean(getBarcodeDetectorCtor()), [])

  const stopCamera = useCallback(() => {
    const stream = streamRef.current
    if (stream) {
      for (const track of stream.getTracks()) {
        track.stop()
      }
    }
    streamRef.current = null
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    setIsCameraActive(false)
  }, [])

  useEffect(() => stopCamera, [stopCamera])

  const decodeFromCanvas = useCallback(async (canvas: HTMLCanvasElement) => {
    const DetectorCtor = getBarcodeDetectorCtor()
    if (DetectorCtor) {
      try {
        let detector: BarcodeDetectorLike
        try {
          detector = new DetectorCtor({ formats: ["qr_code"] })
        } catch {
          detector = new DetectorCtor()
        }
        const results = await detector.detect(canvas)
        const first = results.find((result) => Boolean(result.rawValue?.trim()))
        if (first?.rawValue?.trim()) {
          return first.rawValue.trim()
        }
      } catch {
        // Fall back to jsQR when native detection fails on specific browsers/codecs.
      }
    }

    const context = canvas.getContext("2d")
    if (!context) {
      throw new Error("Could not read image data for QR decoding.")
    }
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
    const decoded = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: "attemptBoth",
    })
    return decoded?.data?.trim() || null
  }, [])

  const startCamera = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      toast.error("Camera access is not supported in this browser.")
      return
    }

    setIsWorking(true)
    setStatus("Requesting camera access...")

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" },
        },
        audio: false,
      })

      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }

      setIsCameraActive(true)
      setStatus("Camera ready. Point it at a QR code and click Scan.")
      toast.success("Camera started.")
    } catch {
      setStatus("Could not access camera. Check permission settings and try again.")
      toast.error("Camera access denied or unavailable.")
      stopCamera()
    } finally {
      setIsWorking(false)
    }
  }, [stopCamera])

  const scanFromCamera = useCallback(async () => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas || !isCameraActive) {
      toast.error("Start camera scanning first.")
      return
    }

    if (!video.videoWidth || !video.videoHeight) {
      toast.error("Camera preview is not ready yet.")
      return
    }

    setIsWorking(true)
    setStatus("Scanning camera frame...")

    try {
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const context = canvas.getContext("2d")
      if (!context) {
        throw new Error("Could not prepare frame canvas.")
      }

      context.drawImage(video, 0, 0, canvas.width, canvas.height)
      const value = await decodeFromCanvas(canvas)

      if (!value) {
        setStatus("No QR code detected in the current frame. Try adjusting distance or lighting.")
        toast.error("No QR code found.")
        return
      }

      setDecodedValue(value)
      setScanSource("camera")
      setStatus("QR code decoded from camera.")
      toast.success("QR code decoded.")
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not scan camera frame."
      setStatus(message)
      toast.error(message)
    } finally {
      setIsWorking(false)
    }
  }, [decodeFromCanvas, isCameraActive])

  const scanFromImage = useCallback(async () => {
    const image = imageRef.current
    const canvas = canvasRef.current
    if (!imagePreviewUrl || !image || !canvas) {
      toast.error("Upload a QR image first.")
      return
    }

    if (!image.complete || !image.naturalWidth || !image.naturalHeight) {
      toast.error("Image preview is still loading. Try again in a second.")
      return
    }

    setIsWorking(true)
    setStatus("Scanning uploaded image...")

    try {
      canvas.width = image.naturalWidth
      canvas.height = image.naturalHeight
      const context = canvas.getContext("2d")
      if (!context) {
        throw new Error("Could not prepare image canvas.")
      }
      context.drawImage(image, 0, 0, canvas.width, canvas.height)
      const value = await decodeFromCanvas(canvas)
      if (!value) {
        setStatus("No QR code detected in this image.")
        toast.error("No QR code found in uploaded image.")
        return
      }

      setDecodedValue(value)
      setScanSource("image")
      setStatus("QR code decoded from uploaded image.")
      toast.success("QR code decoded.")
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not scan uploaded image."
      setStatus(message)
      toast.error(message)
    } finally {
      setIsWorking(false)
    }
  }, [decodeFromCanvas, imagePreviewUrl])

  const copyDecodedValue = useCallback(async () => {
    if (!decodedValue) {
      toast.error("No decoded value to copy.")
      return
    }

    try {
      await navigator.clipboard.writeText(decodedValue)
      toast.success("Decoded value copied.")
    } catch {
      toast.error("Could not copy value.")
    }
  }, [decodedValue])

  return (
    <div className="space-y-6 overflow-x-hidden">
      <Toaster richColors position="top-right" />

      <Card className="border-blue-500/25 bg-card/80">
        <CardHeader>
          <CardTitle className="text-base">QR Code Scanner</CardTitle>
          <CardDescription>
            Scan QR codes from camera frames or uploaded images using browser-only decoding.
            Files and camera frames are processed locally.
          </CardDescription>
        </CardHeader>
      </Card>

      {!hasBarcodeDetector ? (
        <Card className="border-amber-500/30 bg-amber-500/10">
          <CardContent className="pt-5 text-sm text-amber-100">
            Native Barcode Detection API is unavailable. Falling back to local `jsQR` decoding.
            Camera and image scanning remain fully local in your browser.
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Scan with Camera</CardTitle>
          <CardDescription>{status}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {!isCameraActive ? (
              <Button type="button" onClick={() => void startCamera()} disabled={isWorking}>
                {isWorking ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
                Scan with Camera
              </Button>
            ) : (
              <>
                <Button type="button" onClick={() => void scanFromCamera()} disabled={isWorking}>
                  {isWorking ? <Loader2 className="h-4 w-4 animate-spin" /> : <ScanLine className="h-4 w-4" />}
                  Scan current frame
                </Button>
                <Button type="button" variant="outline" onClick={stopCamera} disabled={isWorking}>
                  <CameraOff className="h-4 w-4" />
                  Stop camera
                </Button>
              </>
            )}
          </div>

          <div className="overflow-hidden rounded-lg border border-border/70 bg-muted/20">
            <video
              ref={videoRef}
              className="h-auto min-h-[220px] w-full bg-black object-contain"
              playsInline
              muted
              autoPlay
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Scan from uploaded image</CardTitle>
          <CardDescription>Upload PNG, JPG, or WEBP image files that contain a QR code.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <PdfFileDropzone
            accept="image/*"
            disabled={isWorking}
            title="Drop a QR image here, or click to browse"
            subtitle="Image decoding runs locally in your browser"
            onFilesSelected={(files) => {
              const candidate = files[0]
              if (!candidate) return
              if (!isImageFile(candidate)) {
                toast.error("Please choose an image file.")
                return
              }
              setUrlFromBlob(candidate)
              setDecodedValue(null)
              setScanSource(null)
              setStatus(`Image loaded: ${candidate.name}. Click Scan uploaded image.`)
            }}
          />

          {imagePreviewUrl ? (
            <div className="space-y-3">
              <div className="overflow-hidden rounded-lg border border-border/70 bg-muted/20 p-3">
                <img
                  ref={imageRef}
                  src={imagePreviewUrl}
                  alt="Uploaded QR preview"
                  className="mx-auto max-h-[360px] w-auto max-w-full rounded"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Button type="button" onClick={() => void scanFromImage()} disabled={isWorking}>
                  {isWorking ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                  Scan uploaded image
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    clearImagePreview()
                    setDecodedValue(null)
                    setScanSource(null)
                    setStatus("Upload another image or scan with camera.")
                  }}
                  disabled={isWorking}
                >
                  Clear image
                </Button>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Decoded result</CardTitle>
          <CardDescription>
            View decoded text or URL, then copy it or open it in a new tab.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <ProcessedLocallyBadge />

          {decodedValue ? (
            <div className="space-y-3">
              <div className="rounded-lg border border-border/70 bg-muted/20 p-3">
                <div className="mb-2 inline-flex items-center gap-1 rounded-full border border-emerald-500/35 bg-emerald-500/10 px-2 py-1 text-[11px] font-medium text-emerald-300">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Decoded from {scanSource ?? "scanner"}
                </div>
                <p className="break-words text-sm text-foreground">{decodedValue}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button type="button" variant="outline" onClick={() => void copyDecodedValue()}>
                  <Copy className="h-4 w-4" />
                  Copy value
                </Button>

                {isLikelyUrl(decodedValue) ? (
                  <Button asChild type="button">
                    <a href={normaliseUrl(decodedValue)} target="_blank" rel="noopener noreferrer">
                      Open URL
                    </a>
                  </Button>
                ) : null}
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No result yet. Scan with camera or upload an image to decode a QR code.
            </p>
          )}
        </CardContent>
      </Card>

      <canvas ref={canvasRef} className="hidden" aria-hidden="true" />
    </div>
  )
}
