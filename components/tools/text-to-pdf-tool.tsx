"use client"

import { PDFDocument, StandardFonts, rgb } from "pdf-lib"
import { Download, FileText, Loader2, RotateCcw } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { Toaster, toast } from "sonner"

import { ProcessedLocallyBadge } from "@/components/tools/processed-locally-badge"
import { PdfFileDropzone } from "@/components/tools/shared/pdf-file-dropzone"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { notifyLocalDownloadSuccess } from "@/lib/local-download-events"

type GeneratedOutput = {
  url: string
  name: string
  size: number
}

type InlineStyle = "normal" | "bold" | "italic" | "boldItalic"

type TextRun = {
  text: string
  style: InlineStyle
}

type ParsedLine = {
  text: string
  fontSize: number
  baseStyle: InlineStyle
  afterGap: number
}

const DEFAULT_STATUS = "Paste text or Markdown, or upload a .txt/.md file."
const INLINE_MARKDOWN_REGEX = /(\*\*([^*]+)\*\*|__([^_]+)__|\*([^*]+)\*|_([^_]+)_)/g
const MAX_INPUT_BYTES = 3 * 1024 * 1024
const BODY_FONT_SIZE = 12
const PAGE_WIDTH = 595.28
const PAGE_HEIGHT = 841.89
const PAGE_MARGIN = 50
const CONTENT_WIDTH = PAGE_WIDTH - PAGE_MARGIN * 2

const formatBytes = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`
  const kb = bytes / 1024
  if (kb < 1024) return `${kb.toFixed(1)} KB`
  const mb = kb / 1024
  return `${mb.toFixed(2)} MB`
}

const styleWithMarker = (baseStyle: InlineStyle, marker: "bold" | "italic"): InlineStyle => {
  if (marker === "bold") {
    if (baseStyle === "italic") return "boldItalic"
    if (baseStyle === "boldItalic") return "boldItalic"
    return "bold"
  }

  if (baseStyle === "bold") return "boldItalic"
  if (baseStyle === "boldItalic") return "boldItalic"
  return "italic"
}

const parseInlineMarkdown = (text: string, enabled: boolean, baseStyle: InlineStyle): TextRun[] => {
  if (!enabled || text.length === 0) {
    return [{ text, style: baseStyle }]
  }

  const runs: TextRun[] = []
  let cursor = 0

  for (const match of text.matchAll(INLINE_MARKDOWN_REGEX)) {
    const matchValue = match[0] ?? ""
    const matchIndex = match.index ?? 0
    if (matchIndex > cursor) {
      runs.push({ text: text.slice(cursor, matchIndex), style: baseStyle })
    }

    const boldText = match[2] ?? match[3]
    const italicText = match[4] ?? match[5]

    if (boldText) {
      runs.push({ text: boldText, style: styleWithMarker(baseStyle, "bold") })
    } else if (italicText) {
      runs.push({ text: italicText, style: styleWithMarker(baseStyle, "italic") })
    } else {
      runs.push({ text: matchValue, style: baseStyle })
    }

    cursor = matchIndex + matchValue.length
  }

  if (cursor < text.length) {
    runs.push({ text: text.slice(cursor), style: baseStyle })
  }

  const compacted: TextRun[] = []
  for (const run of runs) {
    if (!run.text) continue
    const previous = compacted.at(-1)
    if (previous && previous.style === run.style) {
      previous.text += run.text
      continue
    }
    compacted.push({ ...run })
  }

  return compacted.length > 0 ? compacted : [{ text, style: baseStyle }]
}

const parseMarkdownLine = (line: string, markdownEnabled: boolean): ParsedLine => {
  if (!markdownEnabled) {
    return { text: line, fontSize: BODY_FONT_SIZE, baseStyle: "normal", afterGap: 0 }
  }

  const headingMatch = line.match(/^(#{1,6})\s+(.+)$/)
  if (headingMatch) {
    const level = headingMatch[1].length
    const content = headingMatch[2]
    const fontSizeByLevel = [22, 18, 16, 14, 13, 12]
    const fontSize = fontSizeByLevel[Math.min(level - 1, fontSizeByLevel.length - 1)]
    return {
      text: content,
      fontSize,
      baseStyle: "bold",
      afterGap: level <= 2 ? 6 : 3,
    }
  }

  const listMatch = line.match(/^[-*+]\s+(.+)$/)
  if (listMatch) {
    return {
      text: `- ${listMatch[1]}`,
      fontSize: BODY_FONT_SIZE,
      baseStyle: "normal",
      afterGap: 0,
    }
  }

  return { text: line, fontSize: BODY_FONT_SIZE, baseStyle: "normal", afterGap: 0 }
}

const splitRunTokens = (run: TextRun) => run.text.split(/(\s+)/).filter((part) => part.length > 0)

const wrapRuns = (
  runs: TextRun[],
  maxWidth: number,
  fontForStyle: Record<InlineStyle, { widthOfTextAtSize: (text: string, size: number) => number }>,
  fontSize: number
) => {
  const lines: TextRun[][] = []
  let currentLine: TextRun[] = []
  let currentWidth = 0

  const pushToken = (token: string, style: InlineStyle) => {
    const previous = currentLine.at(-1)
    if (previous && previous.style === style) {
      previous.text += token
      return
    }
    currentLine.push({ text: token, style })
  }

  const pushCurrentLine = () => {
    if (currentLine.length === 0) return
    lines.push(currentLine)
    currentLine = []
    currentWidth = 0
  }

  for (const run of runs) {
    const tokens = splitRunTokens(run)
    for (const token of tokens) {
      const isWhitespace = /^\s+$/.test(token)
      if (isWhitespace && currentLine.length === 0) {
        continue
      }

      const tokenWidth = fontForStyle[run.style].widthOfTextAtSize(token, fontSize)
      if (currentLine.length > 0 && currentWidth + tokenWidth > maxWidth) {
        pushCurrentLine()
        if (isWhitespace) continue
      }

      pushToken(token, run.style)
      currentWidth += tokenWidth
    }
  }

  pushCurrentLine()
  return lines.length > 0 ? lines : [[{ text: "", style: "normal" }]]
}

const isSupportedTextFile = (file: File) => {
  const name = file.name.toLowerCase()
  return (
    file.type.startsWith("text/") ||
    name.endsWith(".txt") ||
    name.endsWith(".md") ||
    name.endsWith(".markdown")
  )
}

export default function TextToPdfTool() {
  const [inputText, setInputText] = useState("")
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null)
  const [useMarkdownFormatting, setUseMarkdownFormatting] = useState(true)
  const [outputName, setOutputName] = useState("text-to-pdf")
  const [status, setStatus] = useState(DEFAULT_STATUS)
  const [isGenerating, setIsGenerating] = useState(false)
  const [output, setOutput] = useState<GeneratedOutput | null>(null)

  useEffect(() => {
    return () => {
      if (output?.url) {
        URL.revokeObjectURL(output.url)
      }
    }
  }, [output])

  const canGenerate = useMemo(() => {
    return inputText.trim().length > 0 && !isGenerating
  }, [inputText, isGenerating])

  const resetOutput = () => {
    if (output?.url) {
      URL.revokeObjectURL(output.url)
    }
    setOutput(null)
  }

  const safeOutputName = useMemo(() => {
    const cleaned = outputName.trim().replace(/[^\w.-]+/g, "-").replace(/^-+|-+$/g, "")
    return cleaned.length > 0 ? cleaned : "text-to-pdf"
  }, [outputName])

  const loadTextFile = async (file: File) => {
    try {
      if (!isSupportedTextFile(file)) {
        toast.error("Only .txt or .md files are supported.")
        return
      }
      if (file.size > MAX_INPUT_BYTES) {
        toast.error("File is too large. Keep input under 3 MB for smooth local conversion.")
        return
      }

      const text = await file.text()
      setInputText(text)
      setUploadedFileName(file.name)
      if (!outputName.trim() || outputName === "text-to-pdf") {
        setOutputName(file.name.replace(/\.(txt|md|markdown)$/i, "") || "text-to-pdf")
      }
      setStatus(`Loaded ${file.name}. Ready to generate PDF.`)
      resetOutput()
      toast.success("Text file loaded.")
    } catch {
      toast.error("Could not read the selected file.")
    }
  }

  const generatePdf = async () => {
    const source = inputText.trim()
    if (!source) {
      toast.error("Add text or Markdown first.")
      return
    }

    setIsGenerating(true)
    setStatus("Generating PDF locally...")
    resetOutput()

    try {
      const pdfDoc = await PDFDocument.create()
      const fontNormal = await pdfDoc.embedFont(StandardFonts.Helvetica)
      const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
      const fontItalic = await pdfDoc.embedFont(StandardFonts.HelveticaOblique)
      const fontBoldItalic = await pdfDoc.embedFont(StandardFonts.HelveticaBoldOblique)
      const fontForStyle = {
        normal: fontNormal,
        bold: fontBold,
        italic: fontItalic,
        boldItalic: fontBoldItalic,
      } as const

      let page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT])
      let cursorY = PAGE_HEIGHT - PAGE_MARGIN
      const baseLineHeight = BODY_FONT_SIZE * 1.45

      const ensureSpace = (neededHeight: number) => {
        if (cursorY - neededHeight < PAGE_MARGIN) {
          page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT])
          cursorY = PAGE_HEIGHT - PAGE_MARGIN
        }
      }

      const sourceLines = source.replace(/\r\n/g, "\n").split("\n")
      for (const rawLine of sourceLines) {
        if (rawLine.trim().length === 0) {
          ensureSpace(baseLineHeight)
          cursorY -= baseLineHeight
          continue
        }

        const parsed = parseMarkdownLine(rawLine, useMarkdownFormatting)
        const runs = parseInlineMarkdown(parsed.text, useMarkdownFormatting, parsed.baseStyle)
        const wrappedLines = wrapRuns(runs, CONTENT_WIDTH, fontForStyle, parsed.fontSize)
        const lineHeight = parsed.fontSize * 1.45

        for (const lineRuns of wrappedLines) {
          ensureSpace(lineHeight)
          let cursorX = PAGE_MARGIN
          for (const run of lineRuns) {
            const font = fontForStyle[run.style]
            if (!run.text) continue
            page.drawText(run.text, {
              x: cursorX,
              y: cursorY,
              size: parsed.fontSize,
              font,
              color: rgb(0.09, 0.09, 0.1),
            })
            cursorX += font.widthOfTextAtSize(run.text, parsed.fontSize)
          }
          cursorY -= lineHeight
        }

        if (parsed.afterGap > 0) {
          ensureSpace(parsed.afterGap)
          cursorY -= parsed.afterGap
        }
      }

      const bytes = await pdfDoc.save()
      const blob = new Blob([bytes], { type: "application/pdf" })
      const url = URL.createObjectURL(blob)

      setOutput({
        url,
        name: `${safeOutputName}.pdf`,
        size: blob.size,
      })
      setStatus("Done. Your PDF is ready.")
      toast.success("PDF generated successfully.")
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not generate PDF."
      setStatus(message)
      toast.error(message)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-6 overflow-x-hidden">
      <Toaster richColors position="top-right" />

      <Card className="border-blue-500/25 bg-card/80">
        <CardHeader>
          <CardTitle className="text-base">Text or Markdown to PDF</CardTitle>
          <CardDescription>
            Best-effort formatting for Markdown headings, bold, and italic text. Processing stays local in your browser.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Input source</CardTitle>
          <CardDescription>{status}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <PdfFileDropzone
            accept=".txt,.md,.markdown,text/plain,text/markdown"
            title="Drop a .txt or .md file, or click to browse"
            subtitle="The file content is loaded into the editor below."
            onFilesSelected={(files) => {
              const selected = files[0]
              if (selected) {
                void loadTextFile(selected)
              }
            }}
          />

          {uploadedFileName ? (
            <p className="text-xs text-muted-foreground">Loaded file: {uploadedFileName}</p>
          ) : null}

          <Textarea
            value={inputText}
            onChange={(event) => {
              setInputText(event.target.value)
              if (status !== DEFAULT_STATUS) {
                setStatus("Ready to generate PDF.")
              }
            }}
            placeholder="Paste text or Markdown here..."
            rows={14}
          />

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <p className="mb-1 text-xs font-medium text-muted-foreground">Output file name</p>
              <Input
                value={outputName}
                onChange={(event) => setOutputName(event.target.value)}
                placeholder="text-to-pdf"
              />
            </div>
            <label className="flex items-end gap-2 rounded-lg border border-border bg-muted/20 px-3 py-2 text-sm">
              <input
                type="checkbox"
                checked={useMarkdownFormatting}
                onChange={(event) => setUseMarkdownFormatting(event.target.checked)}
              />
              Apply simple Markdown formatting (headings, bold, italic)
            </label>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button type="button" onClick={() => void generatePdf()} disabled={!canGenerate}>
              {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
              Generate PDF
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setInputText("")
                setUploadedFileName(null)
                setStatus(DEFAULT_STATUS)
                resetOutput()
              }}
              disabled={isGenerating}
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {output ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Your PDF is ready</CardTitle>
            <CardDescription>
              {output.name} - {formatBytes(output.size)}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <ProcessedLocallyBadge />
            <p className="text-sm text-muted-foreground">
              Download your generated PDF. Files never leave your device.
            </p>
            <Button asChild>
              <a
                href={output.url}
                download={output.name}
                onClick={() => notifyLocalDownloadSuccess()}
              >
                <Download className="h-4 w-4" />
                Download PDF
              </a>
            </Button>
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}
