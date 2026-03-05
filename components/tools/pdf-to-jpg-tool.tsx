"use client"

import { Download, FileImage, Loader2, Trash2, UploadCloud } from "lucide-react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Toaster, toast } from "sonner"

import { ProcessedLocallyBadge } from "@/components/tools/processed-locally-badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import { notifyLocalDownloadSuccess } from "@/lib/local-download-events"
import { getPdfJs } from "@/lib/pdfjs-loader"
import { blobToUint8Array, downloadZip, makeZip } from "@/lib/zip-download"

type PageSelectionMode = "all" | "selected"

type OutputFile = {
  kind: "single" | "zip"
  url?: string
  zipBytes?: Uint8Array
  fileName: string
  sizeBytes: number
  imageCount: number
}

type PdfPageRange = {
  start: number
  end: number
}

type PdfPageLike = {
  getViewport: (parameters: { scale: number }) => { width: number; height: number }
  render: (parameters: {
    canvasContext: CanvasRenderingContext2D
    viewport: unknown
    annotationMode: number
  }) => { promise: Promise<unknown> }
}

const isPdfFile = (file: File) =>
  file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")

const formatBytes = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`
  const kb = bytes / 1024
  if (kb < 1024) return `${kb.toFixed(1)} KB`
  const mb = kb / 1024
  if (mb < 1024) return `${mb.toFixed(2)} MB`
  return `${(mb / 1024).toFixed(2)} GB`
}

const parseRanges = (value: string, pageCount: number): PdfPageRange[] => {
  const tokens = value
    .split(/[\n,;]+/)
    .map((token) => token.trim())
    .filter(Boolean)

  if (!tokens.length) {
    throw new Error("Enter at least one page selection, for example 1,3,5-7.")
  }

  return tokens.map((token) => {
    const single = token.match(/^(\d+)$/)
    if (single) {
      const page = Number(single[1])
      if (page < 1 || page > pageCount) {
        throw new Error(`Page ${page} is outside the document range (1-${pageCount}).`)
      }
      return { start: page, end: page }
    }

    const range = token.match(/^(\d+)\s*-\s*(\d+)$/)
    if (!range) {
      throw new Error(`Invalid token "${token}". Use formats like 1-3 or 5.`)
    }

    const start = Number(range[1])
    const end = Number(range[2])
    if (start > end) {
      throw new Error(`Invalid range "${token}". Start must be <= end.`)
    }
    if (start < 1 || end > pageCount) {
      throw new Error(`Range "${token}" is outside the document range (1-${pageCount}).`)
    }

    return { start, end }
  })
}

const parsePageSelection = (value: string, pageCount: number): number[] => {
  const ranges = parseRanges(value, pageCount)
  const selected = new Set<number>()

  for (const range of ranges) {
    for (let page = range.start; page <= range.end; page += 1) {
      selected.add(page)
    }
  }

  return Array.from(selected).sort((left, right) => left - right)
}

const countPages = async (file: File) => {
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
    return pdf.numPages
  } finally {
    await loadingTask.destroy()
  }
}

const fileNameForPage = (page: number) => `plain-tools-page-${String(page).padStart(3, "0")}.jpg`

export default function PdfToJpgTool() {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [file, setFile] = useState<File | null>(null)
  const [pageCount, setPageCount] = useState<number | null>(null)
  const [pageSelectionMode, setPageSelectionMode] = useState<PageSelectionMode>("all")
  const [selectedPagesInput, setSelectedPagesInput] = useState("")
  const [quality, setQuality] = useState(0.85)
  const [scale, setScale] = useState(1.5)
  const [isDragging, setIsDragging] = useState(false)
  const [isConverting, setIsConverting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState("Upload a PDF to convert pages into JPG images locally.")
  const [output, setOutput] = useState<OutputFile | null>(null)

  useEffect(() => {
    return () => {
      if (output?.kind === "single" && output.url) {
        URL.revokeObjectURL(output.url)
      }
    }
  }, [output])

  const clearOutput = useCallback(() => {
    if (output?.kind === "single" && output.url) {
      URL.revokeObjectURL(output.url)
    }
    setOutput(null)
  }, [output])

  const handleFile = useCallback(
    async (candidate: File) => {
      if (!isPdfFile(candidate)) {
        toast.error("Only PDF files are supported.")
        return
      }

      setFile(candidate)
      setPageCount(null)
      setProgress(0)
      setStatus("Reading PDF page count...")
      clearOutput()

      try {
        const pages = await countPages(candidate)
        setPageCount(pages)
        setStatus(`Ready. ${pages} page${pages === 1 ? "" : "s"} detected.`)
      } catch {
        setFile(null)
        setPageCount(null)
        setStatus("Could not read this PDF.")
        toast.error("Could not read this PDF. Please choose another file.")
      }
    },
    [clearOutput]
  )

  const canConvert = useMemo(() => {
    if (!file || !pageCount || isConverting) return false
    if (pageSelectionMode === "selected") {
      return selectedPagesInput.trim().length > 0
    }
    return true
  }, [file, isConverting, pageCount, pageSelectionMode, selectedPagesInput])

  const runConversion = useCallback(async () => {
    if (!file || !pageCount) {
      toast.error("Upload a PDF first.")
      return
    }

    setIsConverting(true)
    setProgress(2)
    setStatus("Opening PDF locally...")
    clearOutput()

    try {
      const targetPages =
        pageSelectionMode === "all"
          ? Array.from({ length: pageCount }, (_, index) => index + 1)
          : parsePageSelection(selectedPagesInput, pageCount)

      const pdfjs = await getPdfJs()
      const sourceBytes = new Uint8Array(await file.arrayBuffer())
      const loadingTask = pdfjs.getDocument({
        data: sourceBytes,
        disableAutoFetch: true,
        disableRange: true,
        disableStream: true,
      })

      try {
        const sourcePdf = await loadingTask.promise
        const outputEntries: Array<{ name: string; data: Uint8Array }> = []
        let singleBlob: Blob | null = null
        let singleFileName = ""

        for (let index = 0; index < targetPages.length; index += 1) {
          const pageNumber = targetPages[index]
          setStatus(`Rendering page ${index + 1} of ${targetPages.length} (source page ${pageNumber})...`)
          const page = (await sourcePdf.getPage(pageNumber)) as unknown as PdfPageLike
          const viewport = page.getViewport({ scale })

          if (typeof document === "undefined") {
            throw new Error("PDF to JPG conversion requires a browser context.")
          }

          const canvas = document.createElement("canvas")
          canvas.width = Math.max(1, Math.ceil(viewport.width))
          canvas.height = Math.max(1, Math.ceil(viewport.height))

          const context = canvas.getContext("2d")
          if (!context) {
            throw new Error("Could not initialise canvas for JPG conversion.")
          }

          await page.render({
            canvasContext: context,
            viewport,
            annotationMode: pdfjs.AnnotationMode.ENABLE,
          }).promise

          const blob = await new Promise<Blob>((resolve, reject) => {
            canvas.toBlob(
              (result) => {
                if (!result) {
                  reject(new Error("Could not export rendered page to JPG."))
                  return
                }
                resolve(result)
              },
              "image/jpeg",
              quality
            )
          })

          const imageName = fileNameForPage(pageNumber)

          if (targetPages.length === 1) {
            singleBlob = blob
            singleFileName = imageName
          } else {
            outputEntries.push({
              name: imageName,
              data: await blobToUint8Array(blob),
            })
          }

          canvas.width = 0
          canvas.height = 0
          setProgress(Math.round(((index + 1) / targetPages.length) * 100))
        }

        if (targetPages.length === 1 && singleBlob) {
          const url = URL.createObjectURL(singleBlob)
          setOutput({
            kind: "single",
            url,
            fileName: singleFileName,
            sizeBytes: singleBlob.size,
            imageCount: 1,
          })
        } else {
          const zipBytes = makeZip(outputEntries)
          setOutput({
            kind: "zip",
            zipBytes,
            fileName: "pdf-to-jpg-output.zip",
            sizeBytes: zipBytes.byteLength,
            imageCount: targetPages.length,
          })
        }

        setStatus(`Done. ${targetPages.length} JPG file${targetPages.length === 1 ? "" : "s"} ready.`)
        setProgress(100)
        toast.success("PDF to JPG conversion complete.")
      } finally {
        await loadingTask.destroy()
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Conversion failed."
      setStatus("Conversion failed.")
      toast.error(message)
    } finally {
      setIsConverting(false)
    }
  }, [clearOutput, file, pageCount, pageSelectionMode, quality, scale, selectedPagesInput])

  return (
    <div className="space-y-6 overflow-x-hidden">
      <Toaster richColors position="top-right" />

      <Card className="border-blue-500/25 bg-card/80">
        <CardHeader>
          <CardTitle className="text-base">PDF to JPG - local-only conversion</CardTitle>
          <CardDescription>
            Best-effort local conversion. Files never leave your device.
          </CardDescription>
        </CardHeader>
      </Card>

      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={(event) => {
          const selected = event.target.files?.[0]
          if (selected) {
            void handleFile(selected)
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
              const dropped = event.dataTransfer.files[0]
              if (dropped) {
                void handleFile(dropped)
              }
            }}
            className={`cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition-colors sm:p-10 ${
              isDragging ? "border-primary bg-primary/10" : "border-border bg-muted/20 hover:border-primary/70"
            }`}
          >
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <UploadCloud className="h-6 w-6 text-primary" />
            </div>
            <p className="text-sm font-medium text-foreground">Drop a PDF here, or click to browse</p>
            <p className="mt-1 text-xs text-muted-foreground">No uploads. Processing stays in your browser.</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">PDF to JPG options</CardTitle>
          <CardDescription className="break-words">{status}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          {file ? (
            <div className="rounded-lg border bg-muted/30 p-3">
              <p className="truncate text-sm font-medium text-foreground">{file.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {formatBytes(file.size)}
                {typeof pageCount === "number" ? ` • ${pageCount} page${pageCount === 1 ? "" : "s"}` : ""}
              </p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No PDF selected yet.</p>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="output-format">Output format</Label>
              <Input id="output-format" value="JPG" disabled className="bg-muted/30" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="scale">DPI / Scale</Label>
              <select
                id="scale"
                value={String(scale)}
                onChange={(event) => setScale(Number(event.target.value))}
                className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                disabled={isConverting}
              >
                <option value="1">1x</option>
                <option value="1.5">1.5x</option>
                <option value="2">2x</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="jpg-quality">JPG quality</Label>
              <span className="text-xs text-muted-foreground">{quality.toFixed(2)}</span>
            </div>
            <Slider
              id="jpg-quality"
              min={60}
              max={100}
              step={1}
              value={[Math.round(quality * 100)]}
              onValueChange={(value) => {
                const next = value[0]
                if (typeof next === "number") {
                  setQuality(next / 100)
                }
              }}
              disabled={isConverting}
            />
          </div>

          <div className="space-y-3 rounded-lg border p-4">
            <Label>Pages</Label>
            <div className="grid gap-2 sm:grid-cols-2">
              <Button
                type="button"
                variant={pageSelectionMode === "all" ? "default" : "outline"}
                onClick={() => setPageSelectionMode("all")}
                disabled={isConverting}
                className="w-full"
              >
                All pages
              </Button>
              <Button
                type="button"
                variant={pageSelectionMode === "selected" ? "default" : "outline"}
                onClick={() => setPageSelectionMode("selected")}
                disabled={isConverting}
                className="w-full"
              >
                Selected pages
              </Button>
            </div>

            {pageSelectionMode === "selected" ? (
              <div className="space-y-2">
                <Input
                  value={selectedPagesInput}
                  onChange={(event) => setSelectedPagesInput(event.target.value)}
                  placeholder="1,3,5-7"
                  disabled={isConverting}
                />
                <p className="text-xs text-muted-foreground">Use comma-separated pages or ranges.</p>
              </div>
            ) : null}
          </div>

          {(isConverting || progress > 0) ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{isConverting ? "Converting" : "Complete"}</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2 w-full" />
            </div>
          ) : null}
        </CardContent>

        <CardFooter className="flex flex-col gap-2 sm:flex-row">
          <Button type="button" className="w-full sm:w-auto" disabled={!canConvert} onClick={runConversion}>
            {isConverting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Converting...
              </>
            ) : (
              <>
                <FileImage className="h-4 w-4" />
                Convert to JPG
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => {
              setFile(null)
              setPageCount(null)
              setPageSelectionMode("all")
              setSelectedPagesInput("")
              setQuality(0.85)
              setScale(1.5)
              setProgress(0)
              setStatus("Upload a PDF to convert pages into JPG images locally.")
              clearOutput()
            }}
            disabled={isConverting}
          >
            <Trash2 className="h-4 w-4" />
            Reset
          </Button>
        </CardFooter>
      </Card>

      {output ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">JPG output ready</CardTitle>
            <CardDescription>
              {output.fileName} • {formatBytes(output.sizeBytes)}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <ProcessedLocallyBadge />
            <p className="text-xs text-muted-foreground">
              {output.imageCount} image file{output.imageCount === 1 ? "" : "s"} generated.
            </p>
            {output.kind === "single" && output.url ? (
              <Button asChild className="w-full sm:w-auto">
                <a href={output.url} download={output.fileName} onClick={() => notifyLocalDownloadSuccess()}>
                  <Download className="h-4 w-4" />
                  Download JPG
                </a>
              </Button>
            ) : null}
            {output.kind === "zip" ? (
              <Button
                type="button"
                className="w-full sm:w-auto"
                onClick={() => {
                  if (output.zipBytes) {
                    downloadZip(output.zipBytes, output.fileName)
                    notifyLocalDownloadSuccess()
                  }
                }}
              >
                <Download className="h-4 w-4" />
                Download ZIP
              </Button>
            ) : null}
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}
