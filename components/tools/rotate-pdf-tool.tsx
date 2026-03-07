"use client"

import { Download, Loader2, RefreshCw } from "lucide-react"
import Image from "next/image"
import { useCallback, useEffect, useMemo, useState } from "react"
import { Toaster, toast } from "sonner"

import { ProcessedLocallyBadge } from "@/components/tools/processed-locally-badge"
import { PdfFileDropzone } from "@/components/tools/shared/pdf-file-dropzone"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { notifyLocalDownloadSuccess } from "@/lib/local-download-events"
import { getPdfLib } from "@/lib/pdf-lib-loader"
import { ensureSafeLocalFileSize, formatFileSize, isPdfLikeFile } from "@/lib/pdf-client-utils"
import { generatePagePreviews, type PageThumbnail } from "@/lib/page-organiser-engine"

type RotationOption = 0 | 90 | 180 | 270
type RotationDelta = -90 | 90 | 180

type OutputFile = {
  url: string
  name: string
  size: number
}

const ROTATION_OPTIONS: RotationOption[] = [0, 90, 180, 270]

const isRotationOption = (value: number): value is RotationOption =>
  value === 0 || value === 90 || value === 180 || value === 270

const normaliseRotation = (value: number): RotationOption => {
  const normalised = ((value % 360) + 360) % 360
  if (normalised === 0 || normalised === 90 || normalised === 180 || normalised === 270) {
    return normalised
  }
  return 0
}

export default function RotatePdfTool() {
  const [file, setFile] = useState<File | null>(null)
  const [pages, setPages] = useState<PageThumbnail[]>([])
  const [pageRotations, setPageRotations] = useState<RotationOption[]>([])
  const [previewProgress, setPreviewProgress] = useState(0)
  const [status, setStatus] = useState("Upload a PDF to load page thumbnails.")
  const [isLoadingPreviews, setIsLoadingPreviews] = useState(false)
  const [isApplying, setIsApplying] = useState(false)
  const [output, setOutput] = useState<OutputFile | null>(null)

  useEffect(() => {
    return () => {
      if (output?.url) {
        URL.revokeObjectURL(output.url)
      }
    }
  }, [output])

  const clearOutput = useCallback(() => {
    if (output?.url) {
      URL.revokeObjectURL(output.url)
    }
    setOutput(null)
  }, [output])

  const loadPreviews = useCallback(
    async (sourceFile: File) => {
      setIsLoadingPreviews(true)
      setPreviewProgress(0)
      setStatus("Rendering page thumbnails locally...")
      clearOutput()

      try {
        const { thumbnails, pageCount } = await generatePagePreviews(sourceFile, {
          thumbnailWidth: 180,
          onProgress: (progress, update) => {
            setPreviewProgress(progress)
            setStatus(update)
          },
        })

        setPages(thumbnails)
        setPageRotations(Array.from({ length: pageCount }, () => 0))
        setPreviewProgress(100)
        setStatus(`Loaded ${pageCount} pages.`)
      } catch (error) {
        const message = error instanceof Error ? error.message : "Could not render previews."
        setStatus(message)
        setPages([])
        setPageRotations([])
        toast.error(message)
      } finally {
        setIsLoadingPreviews(false)
      }
    },
    [clearOutput]
  )

  const handleFile = useCallback(
    async (selected: File) => {
      if (!isPdfLikeFile(selected)) {
        toast.error("Please upload a PDF file.")
        return
      }

      try {
        ensureSafeLocalFileSize(selected)
        setFile(selected)
        await loadPreviews(selected)
      } catch (error) {
        const message = error instanceof Error ? error.message : "Could not use this PDF."
        setStatus(message)
        toast.error(message)
      }
    },
    [loadPreviews]
  )

  const setGlobalRotation = (rotation: RotationOption) => {
    setPageRotations((previous) => previous.map(() => rotation))
  }

  const rotateAllPagesBy = (delta: RotationDelta) => {
    setPageRotations((previous) => previous.map((rotation) => normaliseRotation(rotation + delta)))
  }

  const updatePageRotation = (pageIndex: number, rotation: RotationOption) => {
    setPageRotations((previous) =>
      previous.map((value, index) => (index === pageIndex ? rotation : value))
    )
  }

  const rotatePageBy = (pageIndex: number, delta: RotationDelta) => {
    setPageRotations((previous) =>
      previous.map((value, index) =>
        index === pageIndex ? normaliseRotation(value + delta) : value
      )
    )
  }

  const hasRotationChange = useMemo(() => pageRotations.some((rotation) => rotation !== 0), [pageRotations])

  const applyRotation = useCallback(async () => {
    if (!file || pages.length === 0) {
      toast.error("Upload a PDF first.")
      return
    }

    setIsApplying(true)
    setStatus("Applying page rotations locally...")
    clearOutput()

    try {
      const { PDFDocument, degrees } = await getPdfLib()
      const source = await PDFDocument.load(await file.arrayBuffer(), {
        ignoreEncryption: true,
      })
      const documentPages = source.getPages()

      for (let index = 0; index < documentPages.length; index += 1) {
        const page = documentPages[index]
        if (!page) continue
        const selectedRotation = pageRotations[index] ?? 0
        if (selectedRotation !== 0) {
          page.setRotation(degrees(selectedRotation))
        } else {
          page.setRotation(degrees(0))
        }
      }

      const outputBytes = await source.save({ useObjectStreams: true })
      const blob = new Blob([outputBytes], { type: "application/pdf" })
      const url = URL.createObjectURL(blob)
      const baseName = file.name.replace(/\.pdf$/i, "")

      setOutput({
        url,
        name: `${baseName}-rotated.pdf`,
        size: blob.size,
      })
      setStatus("Done. Rotated PDF is ready to download.")
      toast.success("Rotation complete.")
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not rotate this PDF."
      setStatus(message)
      toast.error(message)
    } finally {
      setIsApplying(false)
    }
  }, [clearOutput, file, pageRotations, pages.length])

  return (
    <div className="space-y-6 overflow-x-hidden">
      <Toaster richColors position="top-right" />

      <Card className="border-blue-500/25 bg-card/80">
        <CardHeader>
          <CardTitle className="text-base">Rotate PDF Pages</CardTitle>
          <CardDescription>
            Rotate pages by 90, 180, or 270 degrees globally or per page. Processing stays local in your browser.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <PdfFileDropzone
            accept="application/pdf"
            title="Drop a PDF here, or click to browse"
            subtitle="Local processing only. No upload step."
            onFilesSelected={(files) => {
              const selected = files[0]
              if (selected) {
                void handleFile(selected)
              }
            }}
          />
          {file ? (
            <div className="mt-4 rounded-lg border bg-muted/20 p-3 text-sm">
              <p className="font-medium text-foreground">{file.name}</p>
              <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {(isLoadingPreviews || pages.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Page preview and rotation</CardTitle>
            <CardDescription>{status}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {(isLoadingPreviews || previewProgress > 0) && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{isLoadingPreviews ? "Rendering previews" : "Preview ready"}</span>
                  <span>{previewProgress}%</span>
                </div>
                <Progress value={previewProgress} className="h-2 w-full" />
              </div>
            )}

            {pages.length > 0 ? (
              <>
                <div className="rounded-xl border border-border bg-muted/20 p-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                    Global rotation
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={() => rotateAllPagesBy(90)}>
                      Rotate all 90° CW
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => rotateAllPagesBy(-90)}>
                      Rotate all 90° CCW
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => rotateAllPagesBy(180)}>
                      Rotate all 180°
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setGlobalRotation(0)}
                    >
                      Reset all
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {pages.map((page, index) => {
                    const selectedRotation = pageRotations[index] ?? 0
                    return (
                      <div key={`${page.originalIndex}-${index}`} className="rounded-lg border bg-card/50 p-3">
                        <div className="relative aspect-[3/4] overflow-hidden rounded-md border border-border/70 bg-muted/20">
                          <Image
                            src={page.dataUrl}
                            alt={`Page ${index + 1} preview`}
                            fill
                            unoptimized
                            className="object-cover"
                          />
                        </div>
                        <div className="mt-3 flex items-center justify-between gap-2">
                          <p className="text-xs font-medium text-foreground">Page {index + 1}</p>
                          <p className="text-xs text-muted-foreground">Rotation: {selectedRotation}°</p>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            className="h-7 px-2 text-xs"
                            onClick={() => rotatePageBy(index, 90)}
                          >
                            90° CW
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            className="h-7 px-2 text-xs"
                            onClick={() => rotatePageBy(index, -90)}
                          >
                            90° CCW
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            className="h-7 px-2 text-xs"
                            onClick={() => rotatePageBy(index, 180)}
                          >
                            180°
                          </Button>
                          <select
                            value={selectedRotation}
                            onChange={(event) => {
                              const next = Number.parseInt(event.target.value, 10)
                              if (isRotationOption(next)) {
                                updatePageRotation(index, next)
                              }
                            }}
                            className="h-7 rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground"
                            aria-label={`Set absolute rotation for page ${index + 1}`}
                          >
                            {ROTATION_OPTIONS.map((option) => (
                              <option key={option} value={option}>
                                Set {option}°
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </>
            ) : null}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Apply and download</CardTitle>
          <CardDescription>
            Save a new PDF with your selected page rotations. Files never leave your device.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              onClick={() => void applyRotation()}
              disabled={!file || pages.length === 0 || isApplying}
            >
              {isApplying ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              Rotate & Download
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setGlobalRotation(0)}
              disabled={isApplying || pages.length === 0 || !hasRotationChange}
            >
              Reset rotations
            </Button>
          </div>

          {output ? (
            <div className="rounded-lg border bg-muted/20 p-3">
              <ProcessedLocallyBadge />
              <p className="mt-2 text-sm text-muted-foreground">
                {output.name} - {formatFileSize(output.size)}
              </p>
              <Button asChild className="mt-3">
                <a
                  href={output.url}
                  download={output.name}
                  onClick={() => notifyLocalDownloadSuccess()}
                >
                  <Download className="h-4 w-4" />
                  Download rotated PDF
                </a>
              </Button>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  )
}
