"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Download, FileText, Loader2, Plus, ShieldAlert, Trash2, UploadCloud } from "lucide-react"
import Image from "next/image"
import { toast, Toaster } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import {
  plainIrreversibleRedactor,
  type PlainRedactionRegion,
  type ProcessingStage,
} from "@/lib/pdf-security-engines"

type PdfJsModule = typeof import("pdfjs-dist/legacy/build/pdf.mjs")

type PageSize = {
  width: number
  height: number
}

type PagePreview = {
  pageNumber: number
  imageUrl: string
  width: number
  height: number
}

type RegionInputDraft = {
  page: string
  x: string
  y: string
  width: string
  height: string
}

type RegionItem = PlainRedactionRegion & { id: string }

const THUMB_MAX_WIDTH = 220
const EXTRA_BLEED_POINTS = 2

let pdfJsPromise: Promise<PdfJsModule> | null = null

const getPdfJs = async () => {
  if (!pdfJsPromise) {
    pdfJsPromise = import("pdfjs-dist/legacy/build/pdf.mjs")
  }
  return pdfJsPromise
}

const defaultRegionInput = (): RegionInputDraft => ({
  page: "1",
  x: "0",
  y: "0",
  width: "140",
  height: "40",
})

const isPdfFile = (file: File) =>
  file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")

const formatBytes = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`
  const kb = bytes / 1024
  if (kb < 1024) return `${kb.toFixed(1)} KB`
  const mb = kb / 1024
  if (mb < 1024) return `${mb.toFixed(2)} MB`
  const gb = mb / 1024
  return `${gb.toFixed(2)} GB`
}

const canvasToBlob = (canvas: HTMLCanvasElement) =>
  new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob)
          return
        }
        reject(new Error("Could not generate page preview image."))
      },
      "image/png",
      0.92
    )
  })

const revokePreviewUrls = (items: PagePreview[]) => {
  items.forEach((preview) => URL.revokeObjectURL(preview.imageUrl))
}

const computeSha256 = async (bytes: Uint8Array) => {
  if (typeof crypto === "undefined" || !crypto.subtle) {
    return null
  }
  const digestBuffer = await crypto.subtle.digest("SHA-256", bytes)
  return Array.from(new Uint8Array(digestBuffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("")
}

const renderPreviews = async (file: File) => {
  const pdfjs = await getPdfJs()
  const sourceBytes = new Uint8Array(await file.arrayBuffer())
  const loadingTask = pdfjs.getDocument({
    data: sourceBytes,
    disableWorker: true,
    disableAutoFetch: true,
    disableRange: true,
    disableStream: true,
  })

  try {
    const sourcePdf = await loadingTask.promise
    const previews: PagePreview[] = []
    const pageSizes: PageSize[] = []

    for (let index = 0; index < sourcePdf.numPages; index++) {
      const page = await sourcePdf.getPage(index + 1)
      const pointViewport = page.getViewport({ scale: 1 })
      const scale = Math.min(1, THUMB_MAX_WIDTH / Math.max(1, pointViewport.width))
      const previewViewport = page.getViewport({ scale })

      const canvas = document.createElement("canvas")
      canvas.width = Math.max(1, Math.ceil(previewViewport.width))
      canvas.height = Math.max(1, Math.ceil(previewViewport.height))
      const context = canvas.getContext("2d")
      if (!context) {
        throw new Error("Could not initialise canvas for page preview rendering.")
      }

      await page.render({
        canvasContext: context,
        viewport: previewViewport,
        annotationMode: pdfjs.AnnotationMode.ENABLE,
      }).promise

      const blob = await canvasToBlob(canvas)
      const imageUrl = URL.createObjectURL(blob)
      previews.push({
        pageNumber: index + 1,
        imageUrl,
        width: pointViewport.width,
        height: pointViewport.height,
      })
      pageSizes.push({
        width: pointViewport.width,
        height: pointViewport.height,
      })

      canvas.width = 0
      canvas.height = 0
    }

    return {
      pageCount: sourcePdf.numPages,
      pageSizes,
      previews,
    }
  } finally {
    await loadingTask.destroy()
  }
}

const parseRegionInput = (
  draft: RegionInputDraft,
  pageCount: number,
  pageSizes: PageSize[]
): PlainRedactionRegion => {
  const page = Number(draft.page)
  const x = Number(draft.x)
  const y = Number(draft.y)
  const width = Number(draft.width)
  const height = Number(draft.height)

  if (!Number.isInteger(page) || page < 1 || page > pageCount) {
    throw new Error(`Page must be a whole number between 1 and ${pageCount}.`)
  }

  if (![x, y, width, height].every((value) => Number.isFinite(value))) {
    throw new Error("Coordinates must be valid numbers.")
  }
  if (x < 0 || y < 0) {
    throw new Error("x and y must be 0 or greater.")
  }
  if (width <= 0 || height <= 0) {
    throw new Error("width and height must be greater than 0.")
  }

  const pageSize = pageSizes[page - 1]
  if (pageSize) {
    if (x >= pageSize.width || y >= pageSize.height) {
      throw new Error(
        `Region starts outside page ${page}. Max x is ${pageSize.width.toFixed(2)}, max y is ${pageSize.height.toFixed(2)}.`
      )
    }
  }

  return {
    page,
    coords: { x, y, width, height },
  }
}

const withExtraBleed = (
  region: PlainRedactionRegion,
  pageSize: PageSize | undefined
): PlainRedactionRegion => {
  if (!pageSize) {
    return region
  }

  const x = Math.max(0, region.coords.x - EXTRA_BLEED_POINTS)
  const y = Math.max(0, region.coords.y - EXTRA_BLEED_POINTS)
  const width = Math.min(
    Math.max(0, pageSize.width - x),
    region.coords.width + EXTRA_BLEED_POINTS * 2
  )
  const height = Math.min(
    Math.max(0, pageSize.height - y),
    region.coords.height + EXTRA_BLEED_POINTS * 2
  )

  return {
    page: region.page,
    coords: {
      x,
      y,
      width,
      height,
    },
  }
}

const stageToProgress = (stage: ProcessingStage, message: string, pageCount: number | null) => {
  if (stage === "Initialising Wasm") {
    return 12
  }

  if (stage === "Applying Burn-In Redaction") {
    const match = message.match(/page\s+(\d+)/i)
    if (match && pageCount && pageCount > 0) {
      const pageNumber = Number(match[1])
      const pageProgress = Math.round((Math.min(pageCount, pageNumber) / pageCount) * 76)
      return Math.min(92, 16 + pageProgress)
    }
    return 70
  }

  if (stage === "Scrubbing Metadata") {
    return 96
  }

  if (stage === "Complete") {
    return 100
  }

  return 65
}

export default function RedactTool() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const loadTokenRef = useRef(0)

  const [file, setFile] = useState<File | null>(null)
  const [pageCount, setPageCount] = useState<number | null>(null)
  const [pageSizes, setPageSizes] = useState<PageSize[]>([])
  const [previews, setPreviews] = useState<PagePreview[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [isPreparingPreviews, setIsPreparingPreviews] = useState(false)

  const [regionDraft, setRegionDraft] = useState<RegionInputDraft>(defaultRegionInput)
  const [regions, setRegions] = useState<RegionItem[]>([])
  const [extraBleedFill, setExtraBleedFill] = useState(true)

  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState("Upload a PDF to start irreversible redaction.")

  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [resultSize, setResultSize] = useState<number | null>(null)
  const [sha256, setSha256] = useState<string | null>(null)

  useEffect(() => {
    return () => {
      if (resultUrl) {
        URL.revokeObjectURL(resultUrl)
      }
    }
  }, [resultUrl])

  useEffect(() => {
    return () => {
      revokePreviewUrls(previews)
    }
  }, [previews])

  const clearResult = useCallback(() => {
    if (resultUrl) {
      URL.revokeObjectURL(resultUrl)
    }
    setResultUrl(null)
    setResultSize(null)
    setSha256(null)
  }, [resultUrl])

  const loadFile = useCallback(
    async (nextFile: File) => {
      if (!isPdfFile(nextFile)) {
        toast.error("Only PDF files are supported.")
        return
      }

      const token = loadTokenRef.current + 1
      loadTokenRef.current = token

      setIsPreparingPreviews(true)
      setStatus("Rendering PDF page previews locally...")
      setProgress(0)
      clearResult()
      setRegions([])
      setRegionDraft(defaultRegionInput())

      try {
        const nextData = await renderPreviews(nextFile)
        if (token !== loadTokenRef.current) {
          revokePreviewUrls(nextData.previews)
          return
        }

        setFile(nextFile)
        setPageCount(nextData.pageCount)
        setPageSizes(nextData.pageSizes)
        setPreviews((previous) => {
          revokePreviewUrls(previous)
          return nextData.previews
        })
        setRegionDraft((previous) => ({
          ...previous,
          page: "1",
        }))
        setStatus(
          `Ready. ${nextData.pageCount} page${nextData.pageCount === 1 ? "" : "s"} loaded locally.`
        )
        toast.success("PDF loaded.")
      } catch (error) {
        setFile(null)
        setPageCount(null)
        setPageSizes([])
        setPreviews((previous) => {
          revokePreviewUrls(previous)
          return []
        })
        setStatus("Could not load PDF preview.")
        const message =
          error instanceof Error ? error.message : "Failed to load PDF for preview."
        toast.error(message)
      } finally {
        if (token === loadTokenRef.current) {
          setIsPreparingPreviews(false)
        }
      }
    },
    [clearResult]
  )

  const addRegion = useCallback(() => {
    if (!file || !pageCount) {
      toast.error("Upload a PDF first.")
      return
    }

    try {
      const parsed = parseRegionInput(regionDraft, pageCount, pageSizes)

      const pageSize = pageSizes[parsed.page - 1]
      if (pageSize) {
        const maxWidth = pageSize.width - parsed.coords.x
        const maxHeight = pageSize.height - parsed.coords.y

        if (parsed.coords.width > maxWidth || parsed.coords.height > maxHeight) {
          toast.error(
            `Region exceeds page ${parsed.page} bounds. Reduce width/height to fit the page.`
          )
          return
        }
      }

      clearResult()
      setRegions((previous) => [
        ...previous,
        {
          id: crypto.randomUUID(),
          ...parsed,
        },
      ])
      setStatus("Region added. Add more regions or run irreversible redaction.")
      toast.success("Region added.")
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Could not add this redaction region."
      toast.error(message)
    }
  }, [clearResult, file, pageCount, pageSizes, regionDraft])

  const removeRegion = useCallback(
    (id: string) => {
      clearResult()
      setRegions((previous) => previous.filter((entry) => entry.id !== id))
    },
    [clearResult]
  )

  const clearFile = useCallback(() => {
    loadTokenRef.current += 1
    setFile(null)
    setPageCount(null)
    setPageSizes([])
    setPreviews((previous) => {
      revokePreviewUrls(previous)
      return []
    })
    setRegions([])
    setRegionDraft(defaultRegionInput())
    clearResult()
    setStatus("Upload a PDF to start irreversible redaction.")
    setProgress(0)
  }, [clearResult])

  const handleRedact = useCallback(async () => {
    if (!file) {
      toast.error("Upload a PDF first.")
      return
    }
    if (!regions.length) {
      toast.error("Add at least one redaction region.")
      return
    }

    const regionPayload: PlainRedactionRegion[] = regions.map((entry) => {
      const region: PlainRedactionRegion = {
        page: entry.page,
        coords: entry.coords,
      }
      if (!extraBleedFill) {
        return region
      }
      return withExtraBleed(region, pageSizes[region.page - 1])
    })

    setIsProcessing(true)
    setProgress(8)
    setStatus("Initialising irreversible redaction locally...")
    clearResult()

    try {
      const redactedBytes = await plainIrreversibleRedactor(
        file,
        regionPayload,
        (stage, message) => {
          setStatus(message)
          setProgress((current) => Math.max(current, stageToProgress(stage, message, pageCount)))
        }
      )

      const hash = await computeSha256(redactedBytes)
      const blob = new Blob([redactedBytes], { type: "application/pdf" })
      const nextUrl = URL.createObjectURL(blob)

      setResultUrl(nextUrl)
      setResultSize(blob.size)
      setSha256(hash)
      setProgress(100)
      setStatus("Redaction complete. Ready for secure download.")
      toast.success("Irreversible redaction complete.")
    } catch (error) {
      setStatus("Redaction failed.")
      const message =
        error instanceof Error ? error.message : "Could not complete irreversible redaction."
      toast.error(message)
    } finally {
      setIsProcessing(false)
    }
  }, [clearResult, extraBleedFill, file, pageCount, pageSizes, regions])

  const handleDownload = useCallback(() => {
    if (!resultUrl) return
    const anchor = document.createElement("a")
    anchor.href = resultUrl
    anchor.download = "redacted.pdf"
    anchor.click()
  }, [resultUrl])

  const canRedact = useMemo(
    () => Boolean(file && regions.length > 0 && !isPreparingPreviews && !isProcessing),
    [file, isPreparingPreviews, isProcessing, regions.length]
  )

  return (
    <div className="space-y-6">
      <Toaster richColors position="top-right" />

      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={(event) => {
          const selected = event.target.files?.[0]
          if (selected) {
            void loadFile(selected)
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
              const droppedFile = event.dataTransfer.files?.[0]
              if (!droppedFile) return
              void loadFile(droppedFile)
            }}
            className={`cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition-colors sm:p-10 ${
              isDragging
                ? "border-primary bg-primary/10"
                : "border-border bg-muted/20 hover:border-primary/70"
            }`}
          >
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <UploadCloud className="h-6 w-6 text-primary" />
            </div>
            <p className="text-sm font-medium text-foreground">
              Drop one PDF here, or click to browse
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Pages are rendered and redacted locally in your browser.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Irreversible Redactor</CardTitle>
          <CardDescription>{status}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          {file ? (
            <div className="flex flex-wrap items-center gap-3 rounded-lg border bg-muted/30 p-3">
              <div className="flex min-w-0 items-center gap-2">
                <FileText className="h-4 w-4 shrink-0 text-primary" />
                <span className="truncate text-sm font-medium text-foreground">{file.name}</span>
              </div>
              <span className="text-xs text-muted-foreground">{formatBytes(file.size)}</span>
              {pageCount ? (
                <span className="rounded-full border px-2 py-0.5 text-xs text-muted-foreground">
                  {pageCount} page{pageCount === 1 ? "" : "s"}
                </span>
              ) : null}
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="ml-auto"
                onClick={clearFile}
              >
                <Trash2 className="h-4 w-4" />
                Remove
              </Button>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No file selected.</p>
          )}

          <div className="rounded-lg border p-4">
            <div className="mb-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              <div className="space-y-1">
                <Label htmlFor="region-page">Page</Label>
                <Input
                  id="region-page"
                  type="number"
                  min={1}
                  max={pageCount ?? undefined}
                  value={regionDraft.page}
                  disabled={!file || isPreparingPreviews || isProcessing}
                  onChange={(event) =>
                    setRegionDraft((previous) => ({ ...previous, page: event.target.value }))
                  }
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="region-x">x</Label>
                <Input
                  id="region-x"
                  type="number"
                  min={0}
                  step="0.1"
                  value={regionDraft.x}
                  disabled={!file || isPreparingPreviews || isProcessing}
                  onChange={(event) =>
                    setRegionDraft((previous) => ({ ...previous, x: event.target.value }))
                  }
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="region-y">y</Label>
                <Input
                  id="region-y"
                  type="number"
                  min={0}
                  step="0.1"
                  value={regionDraft.y}
                  disabled={!file || isPreparingPreviews || isProcessing}
                  onChange={(event) =>
                    setRegionDraft((previous) => ({ ...previous, y: event.target.value }))
                  }
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="region-width">width</Label>
                <Input
                  id="region-width"
                  type="number"
                  min={0.1}
                  step="0.1"
                  value={regionDraft.width}
                  disabled={!file || isPreparingPreviews || isProcessing}
                  onChange={(event) =>
                    setRegionDraft((previous) => ({ ...previous, width: event.target.value }))
                  }
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="region-height">height</Label>
                <Input
                  id="region-height"
                  type="number"
                  min={0.1}
                  step="0.1"
                  value={regionDraft.height}
                  disabled={!file || isPreparingPreviews || isProcessing}
                  onChange={(event) =>
                    setRegionDraft((previous) => ({ ...previous, height: event.target.value }))
                  }
                />
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <Switch
                  checked={extraBleedFill}
                  onCheckedChange={setExtraBleedFill}
                  disabled={!file || isPreparingPreviews || isProcessing}
                  id="bleed-fill"
                />
                <Label htmlFor="bleed-fill" className="text-sm font-medium">
                  Bleed fill (+2pt expansion)
                </Label>
              </div>

              <Button
                type="button"
                variant="secondary"
                disabled={!file || isPreparingPreviews || isProcessing}
                onClick={addRegion}
              >
                <Plus className="h-4 w-4" />
                Add Region
              </Button>
            </div>
          </div>

          <div className="rounded-lg border">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <p className="text-sm font-medium text-foreground">
                Regions ({regions.length})
              </p>
              <p className="text-xs text-muted-foreground">
                Coordinates in PDF points (origin: bottom-left)
              </p>
            </div>
            {regions.length === 0 ? (
              <div className="px-4 py-6 text-sm text-muted-foreground">
                No regions added yet.
              </div>
            ) : (
              <ul className="divide-y">
                {regions.map((region, index) => (
                  <li
                    key={region.id}
                    className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <p className="text-sm text-foreground">
                      <span className="font-medium">#{index + 1}</span> page {region.page}:
                      {" "}
                      x={region.coords.x}, y={region.coords.y}, w={region.coords.width}, h=
                      {region.coords.height}
                    </p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeRegion(region.id)}
                      disabled={isProcessing}
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {(isProcessing || progress > 0) && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{isProcessing ? "Processing" : "Complete"}</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
        </CardContent>

        <CardFooter className="flex-col gap-2 sm:flex-row sm:justify-between">
          <Button
            type="button"
            className="w-full sm:w-auto"
            disabled={!canRedact}
            onClick={handleRedact}
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Redacting...
              </>
            ) : (
              <>
                <ShieldAlert className="h-4 w-4" />
                Redact
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      {resultUrl ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Redacted Output</CardTitle>
            <CardDescription>Download your final file and verify its SHA-256 hash.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="rounded-full border px-2 py-0.5">redacted.pdf</span>
              {resultSize !== null ? <span>{formatBytes(resultSize)}</span> : null}
            </div>
            {sha256 ? (
              <div className="rounded-md border bg-muted/30 p-3">
                <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  SHA-256
                </p>
                <p className="break-all font-mono text-xs text-foreground">{sha256}</p>
              </div>
            ) : null}
          </CardContent>
          <CardFooter>
            <Button type="button" className="w-full sm:w-auto" onClick={handleDownload}>
              <Download className="h-4 w-4" />
              Download redacted.pdf
            </Button>
          </CardFooter>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Page Previews</CardTitle>
          <CardDescription>
            {isPreparingPreviews
              ? "Rendering previews..."
              : "Use these thumbnails to determine page numbers and approximate region placement."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isPreparingPreviews ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Rendering pages locally...
            </div>
          ) : previews.length === 0 ? (
            <p className="text-sm text-muted-foreground">Upload a PDF to preview pages.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {previews.map((preview) => {
                const regionsOnPage = regions.filter((region) => region.page === preview.pageNumber)
                return (
                  <div key={preview.pageNumber} className="space-y-2 rounded-lg border p-3">
                    <div className="relative overflow-hidden rounded-md border bg-muted/20">
                      <Image
                        src={preview.imageUrl}
                        alt={`Preview of page ${preview.pageNumber}`}
                        width={THUMB_MAX_WIDTH}
                        height={Math.max(
                          1,
                          Math.round((preview.height / Math.max(1, preview.width)) * THUMB_MAX_WIDTH)
                        )}
                        unoptimized
                        className="h-auto w-full object-contain"
                        loading="lazy"
                      />
                    </div>
                    <div className="space-y-1 text-xs">
                      <p className="font-medium text-foreground">Page {preview.pageNumber}</p>
                      <p className="text-muted-foreground">
                        {preview.width.toFixed(1)} x {preview.height.toFixed(1)} pt
                      </p>
                      <p className="text-muted-foreground">
                        Regions: {regionsOnPage.length}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
