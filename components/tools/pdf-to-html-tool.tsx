"use client"

import { Download, FileCode, Loader2, Trash2 } from "lucide-react"
import { useCallback, useMemo, useState } from "react"
import { Toaster, toast } from "sonner"

import { PdfFileDropzone } from "@/components/tools/shared/pdf-file-dropzone"
import { ProcessedLocallyBadge } from "@/components/tools/processed-locally-badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { useObjectUrlState } from "@/hooks/use-object-url-state"
import {
  ensureSafeLocalFileSize,
  formatFileSize,
  isPdfLikeFile,
} from "@/lib/pdf-client-utils"
import { notifyLocalDownloadSuccess } from "@/lib/local-download-events"
import { getPdfJs } from "@/lib/pdfjs-loader"

type PdfTextItem = {
  str?: string
  hasEOL?: boolean
  transform?: number[]
}

type ParsedToken = {
  text: string
  x: number
  y: number
  hasEOL: boolean
  index: number
}

type ConversionResult = {
  fileName: string
  outputSize: number
  pageCount: number
  textLineCount: number
  embeddedImageCount: number
}

const MAX_PDF_TO_HTML_BYTES = 200 * 1024 * 1024

const extractBaseName = (name: string) => name.replace(/\.pdf$/i, "")

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")

const parseTextTokens = (items: PdfTextItem[]): ParsedToken[] =>
  items
    .map((item, index) => {
      const raw = item.str?.replace(/\s+/g, " ").trim() ?? ""
      if (!raw) return null

      const x = Number(item.transform?.[4] ?? 0)
      const y = Number(item.transform?.[5] ?? 0)
      if (!Number.isFinite(x) || !Number.isFinite(y)) return null

      return {
        text: raw,
        x,
        y,
        hasEOL: Boolean(item.hasEOL),
        index,
      } satisfies ParsedToken
    })
    .filter((token): token is ParsedToken => token !== null)

const groupTokensToLines = (tokens: ParsedToken[]) => {
  const sorted = [...tokens].sort((left, right) => {
    if (Math.abs(left.y - right.y) > 1.5) return right.y - left.y
    if (Math.abs(left.x - right.x) > 1.5) return left.x - right.x
    return left.index - right.index
  })

  const lines: string[] = []
  let currentLine: string[] = []
  let currentY: number | null = null

  for (const token of sorted) {
    const startsNewLine = currentY === null || Math.abs(token.y - currentY) > 2.5

    if (startsNewLine && currentLine.length > 0) {
      lines.push(currentLine.join(" ").replace(/\s+/g, " ").trim())
      currentLine = []
    }

    currentLine.push(token.text)
    currentY = token.y

    if (token.hasEOL) {
      lines.push(currentLine.join(" ").replace(/\s+/g, " ").trim())
      currentLine = []
      currentY = null
    }
  }

  if (currentLine.length > 0) {
    lines.push(currentLine.join(" ").replace(/\s+/g, " ").trim())
  }

  return lines.filter(Boolean)
}

const buildPageSection = (
  pageNumber: number,
  lines: string[],
  imageDataUrl: string | null
) => {
  const imageHtml = imageDataUrl
    ? `<figure class="page-preview"><img src="${imageDataUrl}" alt="Page ${pageNumber} preview" loading="lazy" /></figure>`
    : ""

  const textHtml =
    lines.length > 0
      ? lines.map((line) => `<p>${escapeHtml(line)}</p>`).join("")
      : `<p class="empty-line">No extractable text found on this page.</p>`

  return `
    <section class="page-section" id="page-${pageNumber}">
      <h2>Page ${pageNumber}</h2>
      ${imageHtml}
      <div class="text-content">
        ${textHtml}
      </div>
    </section>
  `
}

const buildHtmlDocument = ({
  title,
  sourceName,
  createdAtIso,
  sectionsHtml,
}: {
  title: string
  sourceName: string
  createdAtIso: string
  sectionsHtml: string
}) => `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="generator" content="Plain Tools PDF to HTML" />
    <meta name="source-file" content="${escapeHtml(sourceName)}" />
    <meta name="created-at" content="${escapeHtml(createdAtIso)}" />
    <title>${escapeHtml(title)}</title>
    <style>
      :root {
        color-scheme: light;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      }
      body {
        margin: 0;
        padding: 24px;
        background: #f7f8fb;
        color: #111827;
        line-height: 1.55;
      }
      main {
        margin: 0 auto;
        max-width: 980px;
      }
      header {
        margin-bottom: 20px;
      }
      h1 {
        margin: 0 0 8px;
        font-size: 1.6rem;
        line-height: 1.2;
      }
      h2 {
        margin: 0;
        font-size: 1.1rem;
      }
      .meta {
        margin: 0;
        color: #4b5563;
        font-size: 0.9rem;
      }
      .note {
        margin: 10px 0 0;
        color: #374151;
        font-size: 0.9rem;
      }
      .page-section {
        margin-top: 16px;
        border: 1px solid #dbe3ef;
        border-radius: 12px;
        background: #ffffff;
        padding: 16px;
      }
      .page-preview {
        margin: 14px 0;
      }
      .page-preview img {
        display: block;
        width: 100%;
        height: auto;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        background: #ffffff;
      }
      .text-content p {
        margin: 0 0 10px;
        white-space: pre-wrap;
      }
      .text-content p:last-child {
        margin-bottom: 0;
      }
      .empty-line {
        color: #6b7280;
        font-style: italic;
      }
    </style>
  </head>
  <body>
    <main>
      <header>
        <h1>${escapeHtml(title)}</h1>
        <p class="meta">Source file: ${escapeHtml(sourceName)}</p>
        <p class="meta">Generated: ${escapeHtml(createdAtIso)}</p>
        <p class="note">Best-effort conversion generated locally with Plain Tools. Complex layouts may differ from the source PDF.</p>
      </header>
      ${sectionsHtml}
    </main>
  </body>
</html>
`

export default function PdfToHtmlTool() {
  const [file, setFile] = useState<File | null>(null)
  const [embedPageImages, setEmbedPageImages] = useState(true)
  const [imageScale, setImageScale] = useState<1 | 1.5 | 2>(1.5)
  const [isConverting, setIsConverting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState("Upload a PDF to generate a local HTML export.")
  const [result, setResult] = useState<ConversionResult | null>(null)
  const { url: downloadUrl, clearUrl, setUrlFromBlob } = useObjectUrlState()

  const clearResult = useCallback(() => {
    clearUrl()
    setResult(null)
  }, [clearUrl])

  const handleFile = useCallback(
    (candidate: File) => {
      try {
        if (!isPdfLikeFile(candidate)) {
          toast.error("Only PDF files are supported.")
          return
        }
        ensureSafeLocalFileSize(candidate, MAX_PDF_TO_HTML_BYTES)
        setFile(candidate)
        setProgress(0)
        setStatus("Ready to convert.")
        clearResult()
      } catch (error) {
        const message = error instanceof Error ? error.message : "Could not use this file."
        setStatus(message)
        toast.error(message)
      }
    },
    [clearResult]
  )

  const canConvert = useMemo(() => Boolean(file && !isConverting), [file, isConverting])

  const runConversion = useCallback(async () => {
    if (!file) {
      toast.error("Upload a PDF first.")
      return
    }

    setIsConverting(true)
    setProgress(3)
    setStatus("Opening PDF locally...")
    clearResult()

    try {
      const pdfjs = await getPdfJs()
      const bytes = new Uint8Array(await file.arrayBuffer())
      const loadingTask = pdfjs.getDocument({
        data: bytes,
        disableAutoFetch: true,
        disableRange: true,
        disableStream: true,
      })

      const sections: string[] = []
      let textLineCount = 0
      let embeddedImageCount = 0

      try {
        const pdf = await loadingTask.promise

        for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
          setStatus(`Processing page ${pageNumber} of ${pdf.numPages}...`)
          const page = await pdf.getPage(pageNumber)
          const textContent = await page.getTextContent()
          const tokens = parseTextTokens(textContent.items as PdfTextItem[])
          const lines = groupTokensToLines(tokens)
          textLineCount += lines.length

          let imageDataUrl: string | null = null
          if (embedPageImages) {
            if (typeof document === "undefined") {
              throw new Error("Image embedding requires a browser context.")
            }
            const viewport = page.getViewport({ scale: imageScale })
            const canvas = document.createElement("canvas")
            canvas.width = Math.max(1, Math.ceil(viewport.width))
            canvas.height = Math.max(1, Math.ceil(viewport.height))

            const context = canvas.getContext("2d")
            if (!context) {
              throw new Error("Could not initialise canvas for page rendering.")
            }

            await page.render({
              canvasContext: context,
              viewport,
              annotationMode: pdfjs.AnnotationMode.ENABLE,
            }).promise

            imageDataUrl = canvas.toDataURL("image/png")
            embeddedImageCount += 1
            canvas.width = 0
            canvas.height = 0
          }

          sections.push(buildPageSection(pageNumber, lines, imageDataUrl))
          setProgress(Math.round((pageNumber / pdf.numPages) * 92))
        }

        if (textLineCount === 0 && embeddedImageCount === 0) {
          throw new Error("No extractable content was found in this PDF.")
        }

        setStatus("Building HTML file...")
        const baseName = extractBaseName(file.name)
        const fileName = `${baseName}.html`
        const createdAtIso = new Date().toISOString()
        const html = buildHtmlDocument({
          title: `${baseName} - HTML export`,
          sourceName: file.name,
          createdAtIso,
          sectionsHtml: sections.join("\n"),
        })

        const blob = new Blob([html], {
          type: "text/html;charset=utf-8",
        })
        setUrlFromBlob(blob)
        setResult({
          fileName,
          outputSize: blob.size,
          pageCount: sections.length,
          textLineCount,
          embeddedImageCount,
        })
        setProgress(100)
        setStatus("Done. Your HTML file is ready.")
        toast.success("PDF to HTML conversion complete.")
      } finally {
        await loadingTask.destroy()
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not convert this PDF."
      setStatus(message)
      toast.error(message)
    } finally {
      setIsConverting(false)
    }
  }, [clearResult, embedPageImages, file, imageScale, setUrlFromBlob])

  return (
    <div className="space-y-6 overflow-x-hidden">
      <Toaster richColors position="top-right" />

      <Card className="border-blue-500/25 bg-card/80">
        <CardHeader>
          <CardTitle className="text-base">Best-effort offline conversion</CardTitle>
          <CardDescription>
            Best-effort PDF to HTML conversion. Complex layouts may not convert perfectly. Files never leave your device.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <PdfFileDropzone
            disabled={isConverting}
            title="Drop a PDF here, or click to browse"
            subtitle="Generate downloadable HTML locally in your browser"
            onFilesSelected={(files) => {
              const selected = files[0]
              if (selected) {
                handleFile(selected)
              }
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">PDF to HTML</CardTitle>
          <CardDescription className="break-words">{status}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {file ? (
            <div className="rounded-lg border bg-muted/30 p-3">
              <p className="truncate text-sm font-medium text-foreground">{file.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No PDF selected yet.</p>
          )}

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <input
                id="embed-images"
                type="checkbox"
                className="h-4 w-4 rounded border-border bg-background text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
                checked={embedPageImages}
                disabled={isConverting}
                onChange={(event) => setEmbedPageImages(event.target.checked)}
              />
              <Label htmlFor="embed-images" className="text-sm text-foreground">
                Embed page preview images for better layout fidelity
              </Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image-scale" className="text-sm text-foreground">
                Preview image scale
              </Label>
              <select
                id="image-scale"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground disabled:cursor-not-allowed disabled:opacity-60"
                value={String(imageScale)}
                disabled={isConverting || !embedPageImages}
                onChange={(event) => {
                  const value = Number(event.target.value)
                  if (value === 1 || value === 1.5 || value === 2) {
                    setImageScale(value)
                  }
                }}
              >
                <option value="1">1x (smaller HTML file)</option>
                <option value="1.5">1.5x (balanced)</option>
                <option value="2">2x (larger, sharper previews)</option>
              </select>
            </div>
          </div>

          {(isConverting || progress > 0) && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{isConverting ? "Processing" : "Complete"}</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2 w-full" />
            </div>
          )}
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
                <FileCode className="h-4 w-4" />
                Convert to HTML
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto"
            disabled={isConverting && !file}
            onClick={() => {
              setFile(null)
              setProgress(0)
              setStatus("Upload a PDF to generate a local HTML export.")
              setEmbedPageImages(true)
              setImageScale(1.5)
              clearResult()
            }}
          >
            <Trash2 className="h-4 w-4" />
            Reset
          </Button>
        </CardFooter>
      </Card>

      {result && downloadUrl ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Download HTML</CardTitle>
            <CardDescription>
              {result.fileName} • {formatFileSize(result.outputSize)}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <ProcessedLocallyBadge />
            <p className="text-xs text-muted-foreground">
              {result.pageCount} page{result.pageCount === 1 ? "" : "s"} processed •{" "}
              {result.textLineCount} extracted text line{result.textLineCount === 1 ? "" : "s"} •{" "}
              {result.embeddedImageCount} embedded image{result.embeddedImageCount === 1 ? "" : "s"}
            </p>
            <Button asChild className="w-full sm:w-auto">
              <a
                href={downloadUrl}
                download={result.fileName}
                onClick={() => notifyLocalDownloadSuccess()}
              >
                <Download className="h-4 w-4" />
                Download HTML
              </a>
            </Button>
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}
