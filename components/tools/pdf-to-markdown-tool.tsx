"use client"

import { Download, FileCode2, Loader2, Trash2 } from "lucide-react"
import { useCallback, useMemo, useState } from "react"
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

type TextItemLike = {
  str?: string
  hasEOL?: boolean
  transform?: number[]
  fontName?: string
}

type StyledToken = {
  text: string
  x: number
  y: number
  fontSize: number
  bold: boolean
  italic: boolean
  hasEOL: boolean
  index: number
}

type MarkdownLine = {
  plainText: string
  markdownText: string
  avgFontSize: number
  minX: number
}

type ConversionResult = {
  fileName: string
  outputSizeBytes: number
  pageCount: number
  lineCount: number
}

const MAX_PDF_TO_MARKDOWN_BYTES = 200 * 1024 * 1024

const extractBaseName = (name: string) => name.replace(/\.pdf$/i, "")

const escapeMarkdownInline = (value: string) =>
  value.replace(/[\\`*_{}[\]()#+|]/g, "\\$&")

const normaliseWhitespace = (value: string) => value.replace(/\s+/g, " ").trim()

const applyInlineStyle = (text: string, bold: boolean, italic: boolean) => {
  const trimmed = text.trim()
  if (!trimmed) return ""
  if (bold && italic) return `***${trimmed}***`
  if (bold) return `**${trimmed}**`
  if (italic) return `*${trimmed}*`
  return trimmed
}

const parseStyledTokens = (items: TextItemLike[]): StyledToken[] =>
  items
    .map((item, index) => {
      const text = normaliseWhitespace(item.str ?? "")
      if (!text) return null

      const x = Number(item.transform?.[4] ?? 0)
      const y = Number(item.transform?.[5] ?? 0)
      const scaleX = Number(item.transform?.[0] ?? 0)
      const scaleY = Number(item.transform?.[3] ?? 0)
      const fontSize = Math.max(Math.abs(scaleX), Math.abs(scaleY), 8)
      const fontName = (item.fontName ?? "").toLowerCase()

      return {
        text,
        x: Number.isFinite(x) ? x : 0,
        y: Number.isFinite(y) ? y : 0,
        fontSize,
        bold: /(bold|black|heavy|semibold|demibold|medium)/.test(fontName),
        italic: /(italic|oblique)/.test(fontName),
        hasEOL: Boolean(item.hasEOL),
        index,
      } satisfies StyledToken
    })
    .filter((token): token is StyledToken => token !== null)

const groupTokensToLines = (tokens: StyledToken[]): MarkdownLine[] => {
  const sorted = [...tokens].sort((left, right) => {
    if (Math.abs(left.y - right.y) > 1.5) return right.y - left.y
    if (Math.abs(left.x - right.x) > 1.5) return left.x - right.x
    return left.index - right.index
  })

  const lineBuckets: StyledToken[][] = []
  let currentBucket: StyledToken[] = []
  let currentY: number | null = null
  let currentTolerance = 3

  for (const token of sorted) {
    const tolerance = Math.max(2.5, token.fontSize * 0.33)
    const startsNewLine =
      currentY === null ||
      Math.abs(token.y - currentY) > currentTolerance ||
      (currentBucket.length > 0 && token.hasEOL)

    if (startsNewLine && currentBucket.length > 0) {
      lineBuckets.push(currentBucket)
      currentBucket = []
    }

    currentBucket.push(token)
    currentY = token.y
    currentTolerance = tolerance

    if (token.hasEOL) {
      lineBuckets.push(currentBucket)
      currentBucket = []
      currentY = null
      currentTolerance = 3
    }
  }

  if (currentBucket.length > 0) {
    lineBuckets.push(currentBucket)
  }

  return lineBuckets
    .map((lineTokens) => {
      const sortedLine = [...lineTokens].sort((left, right) => left.x - right.x)
      const plainParts: string[] = []
      const markdownParts: string[] = []

      for (let index = 0; index < sortedLine.length; index += 1) {
        const token = sortedLine[index]
        const previous = sortedLine[index - 1]
        const gap = previous ? token.x - previous.x : 0
        const needsSpace = Boolean(previous) && gap > Math.max(previous.fontSize * 0.45, 3)

        const plainToken = token.text
        const markdownToken = applyInlineStyle(escapeMarkdownInline(token.text), token.bold, token.italic)

        if (needsSpace) {
          plainParts.push(" ")
          markdownParts.push(" ")
        } else if (previous) {
          plainParts.push(" ")
          markdownParts.push(" ")
        }

        plainParts.push(plainToken)
        markdownParts.push(markdownToken)
      }

      const plainText = normaliseWhitespace(plainParts.join(""))
      const markdownText = normaliseWhitespace(markdownParts.join(""))
      const avgFontSize =
        sortedLine.reduce((sum, token) => sum + token.fontSize, 0) / Math.max(1, sortedLine.length)
      const minX = Math.min(...sortedLine.map((token) => token.x))

      return {
        plainText,
        markdownText,
        avgFontSize,
        minX,
      } satisfies MarkdownLine
    })
    .filter((line) => line.plainText.length > 0)
}

const toHeadingLine = (text: string, level: number) => `${"#".repeat(level)} ${text}`

const isLikelyHeading = (line: MarkdownLine, medianFontSize: number) => {
  const content = line.plainText
  if (!content || content.length > 90) return false
  if (/[\.:;!?]$/.test(content)) return false
  if (/^[-*•]\s+/.test(content)) return false
  if (/^\d+[\.)]\s+/.test(content)) return false
  if (line.avgFontSize < medianFontSize * 1.22) return false
  return /^[A-Z0-9][\w\s,()/\-'"&]+$/.test(content)
}

const toListLine = (line: MarkdownLine): string | null => {
  const bullet = line.plainText.match(/^[-*•]\s+(.*)$/)
  if (bullet) return `- ${escapeMarkdownInline(normaliseWhitespace(bullet[1]))}`

  const ordered = line.plainText.match(/^(\d+[\.)])\s+(.*)$/)
  if (ordered) return `${ordered[1]} ${escapeMarkdownInline(normaliseWhitespace(ordered[2]))}`

  return null
}

const median = (values: number[]) => {
  if (!values.length) return 12
  const sorted = [...values].sort((a, b) => a - b)
  const middle = Math.floor(sorted.length / 2)
  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2
  }
  return sorted[middle]
}

const buildMarkdownForPage = (pageNumber: number, lines: MarkdownLine[], medianFontSize: number) => {
  const output: string[] = []
  output.push(`## Page ${pageNumber}`)
  output.push("")

  let previousWasParagraph = false

  for (const line of lines) {
    const listLine = toListLine(line)
    if (listLine) {
      output.push(listLine)
      previousWasParagraph = false
      continue
    }

    if (isLikelyHeading(line, medianFontSize)) {
      const headingLevel = line.avgFontSize >= medianFontSize * 1.65 ? 2 : 3
      output.push(toHeadingLine(escapeMarkdownInline(line.plainText), headingLevel))
      previousWasParagraph = false
      continue
    }

    const paragraphText = line.markdownText || escapeMarkdownInline(line.plainText)
    if (previousWasParagraph) {
      output.push(`${paragraphText}  `)
    } else {
      output.push(paragraphText)
    }
    previousWasParagraph = true
  }

  output.push("")
  return output.join("\n")
}

export default function PdfToMarkdownTool() {
  const [file, setFile] = useState<File | null>(null)
  const [isConverting, setIsConverting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState("Upload a PDF to generate structured Markdown locally.")
  const [markdownOutput, setMarkdownOutput] = useState("")
  const [result, setResult] = useState<ConversionResult | null>(null)
  const { url: downloadUrl, clearUrl, setUrlFromBlob } = useObjectUrlState()

  const clearResult = useCallback(() => {
    clearUrl()
    setMarkdownOutput("")
    setResult(null)
  }, [clearUrl])

  const canConvert = useMemo(() => Boolean(file && !isConverting), [file, isConverting])

  const handleFile = useCallback(
    (candidate: File) => {
      try {
        if (!isPdfLikeFile(candidate)) {
          toast.error("Only PDF files are supported.")
          return
        }

        ensureSafeLocalFileSize(candidate, MAX_PDF_TO_MARKDOWN_BYTES)
        setFile(candidate)
        setProgress(0)
        setStatus("Ready to convert to Markdown.")
        clearResult()
      } catch (error) {
        const message = error instanceof Error ? error.message : "Could not read this file."
        setStatus(message)
        toast.error(message)
      }
    },
    [clearResult]
  )

  const runConversion = useCallback(async () => {
    if (!file) {
      toast.error("Upload a PDF first.")
      return
    }

    setIsConverting(true)
    setProgress(4)
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

      try {
        const pdf = await loadingTask.promise
        const pageBlocks: string[] = []
        const fontSamples: number[] = []
        let lineCount = 0

        for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
          setStatus(`Extracting page ${pageNumber} of ${pdf.numPages}...`)
          const page = await pdf.getPage(pageNumber)
          const textContent = await page.getTextContent()
          const tokens = parseStyledTokens(textContent.items as TextItemLike[])
          const lines = groupTokensToLines(tokens)
          lineCount += lines.length
          fontSamples.push(...lines.map((line) => line.avgFontSize))

          setProgress(Math.round((pageNumber / pdf.numPages) * 84))
          pageBlocks.push(`__PAGE_${pageNumber}__`)
          pageBlocks.push(JSON.stringify(lines))
        }

        if (lineCount === 0) {
          throw new Error("No extractable text found. This PDF may be image-only.")
        }

        const medianFontSize = median(fontSamples)
        const markdownSections: string[] = []
        markdownSections.push(`# ${escapeMarkdownInline(extractBaseName(file.name))}`)
        markdownSections.push("")
        markdownSections.push(
          "_Best-effort local conversion by Plain Tools. Complex layouts may require manual Markdown cleanup._"
        )
        markdownSections.push("")

        for (let index = 0; index < pageBlocks.length; index += 2) {
          const marker = pageBlocks[index]
          const serializedLines = pageBlocks[index + 1]
          const match = marker.match(/^__PAGE_(\d+)__$/)
          if (!match || !serializedLines) continue
          const pageNumber = Number(match[1])
          const lines = JSON.parse(serializedLines) as MarkdownLine[]
          markdownSections.push(buildMarkdownForPage(pageNumber, lines, medianFontSize))
        }

        const markdown = markdownSections.join("\n")
        const fileName = `${extractBaseName(file.name)}.md`
        const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" })
        setUrlFromBlob(blob)
        setMarkdownOutput(markdown)
        setResult({
          fileName,
          outputSizeBytes: blob.size,
          pageCount: pdf.numPages,
          lineCount,
        })
        setProgress(100)
        setStatus("Conversion complete. Markdown output is ready.")
        toast.success("PDF to Markdown conversion complete.")
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
  }, [clearResult, file, setUrlFromBlob])

  return (
    <div className="space-y-6 overflow-x-hidden">
      <Toaster richColors position="top-right" />

      <Card className="border-blue-500/25 bg-card/80">
        <CardHeader>
          <CardTitle className="text-base">Best-effort structured text export</CardTitle>
          <CardDescription>
            Extract text into Markdown with simple heading and list detection. Files never leave your device.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <PdfFileDropzone
            disabled={isConverting}
            title="Drop a PDF here, or click to browse"
            subtitle="Generate a local .md export with structured text"
            onFilesSelected={(files) => {
              const selected = files[0]
              if (selected) handleFile(selected)
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">PDF to Markdown</CardTitle>
          <CardDescription>{status}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {file ? (
            <div className="rounded-lg border bg-muted/30 p-3">
              <p className="truncate text-sm font-medium text-foreground">{file.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No PDF selected yet.</p>
          )}

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
          <Button type="button" disabled={!canConvert} onClick={() => void runConversion()}>
            {isConverting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Converting...
              </>
            ) : (
              <>
                <FileCode2 className="h-4 w-4" />
                Convert to Markdown
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={isConverting}
            onClick={() => {
              setFile(null)
              setProgress(0)
              setStatus("Upload a PDF to generate structured Markdown locally.")
              clearResult()
            }}
          >
            <Trash2 className="h-4 w-4" />
            Reset
          </Button>
        </CardFooter>
      </Card>

      {result && markdownOutput ? (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Markdown preview</CardTitle>
            <CardDescription>
              {result.fileName} • {formatFileSize(result.outputSizeBytes)} • {result.pageCount} page
              {result.pageCount === 1 ? "" : "s"} • {result.lineCount} extracted line
              {result.lineCount === 1 ? "" : "s"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <ProcessedLocallyBadge />
            <div className="max-h-[420px] overflow-auto rounded-lg border border-border/70 bg-muted/20 p-3">
              <pre className="whitespace-pre-wrap break-words text-xs text-foreground sm:text-sm">
                {markdownOutput}
              </pre>
            </div>
            {downloadUrl ? (
              <Button asChild>
                <a
                  href={downloadUrl}
                  download={result.fileName}
                  onClick={() => notifyLocalDownloadSuccess()}
                >
                  <Download className="h-4 w-4" />
                  Download .md
                </a>
              </Button>
            ) : null}
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}
