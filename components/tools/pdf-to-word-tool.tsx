"use client"

import { Document, HeadingLevel, Packer, Paragraph, TextRun } from "docx"
import { Download, FileText, Loader2, Trash2, UploadCloud } from "lucide-react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Toaster, toast } from "sonner"

import { ProcessedLocallyBadge } from "@/components/tools/processed-locally-badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ensureSafeLocalFileSize } from "@/lib/pdf-client-utils"
import { getPdfJs } from "@/lib/pdfjs-loader"
import { notifyLocalDownloadSuccess } from "@/lib/local-download-events"

type TextItemLike = {
  str?: string
  hasEOL?: boolean
  transform?: number[]
}

type ConversionOutput = {
  url: string
  fileName: string
  sizeBytes: number
}

const isPdfFile = (file: File) =>
  file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")
const MAX_PDF_TO_WORD_BYTES = 200 * 1024 * 1024

const formatBytes = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`
  const kb = bytes / 1024
  if (kb < 1024) return `${kb.toFixed(1)} KB`
  const mb = kb / 1024
  if (mb < 1024) return `${mb.toFixed(2)} MB`
  return `${(mb / 1024).toFixed(2)} GB`
}

const extractBaseName = (name: string) => name.replace(/\.pdf$/i, "")

const classifyHeading = (line: string) => {
  const trimmed = line.trim()
  if (trimmed.length < 5 || trimmed.length > 80) return false

  const words = trimmed.split(/\s+/)
  if (words.length > 10) return false

  const hasTerminalPunctuation = /[.!?]$/.test(trimmed)
  if (hasTerminalPunctuation) return false

  return /^[A-Z0-9][A-Za-z0-9\s,:()\-/]+$/.test(trimmed)
}

const extractLinesFromItems = (items: TextItemLike[]) => {
  const tokens = items
    .map((item, index) => {
      const raw = item.str?.replace(/\s+/g, " ").trim() ?? ""
      if (!raw) return null

      const y = Number(item.transform?.[5] ?? 0)
      const x = Number(item.transform?.[4] ?? 0)
      return { text: raw, y, x, hasEOL: Boolean(item.hasEOL), index }
    })
    .filter((token): token is { text: string; y: number; x: number; hasEOL: boolean; index: number } => token !== null)

  tokens.sort((a, b) => {
    if (Math.abs(a.y - b.y) > 1.5) {
      return b.y - a.y
    }
    if (Math.abs(a.x - b.x) > 1.5) {
      return a.x - b.x
    }
    return a.index - b.index
  })

  const lines: string[] = []
  let currentLine: string[] = []
  let currentY: number | null = null

  for (const token of tokens) {
    const startsNewLine =
      currentY === null ||
      Math.abs(token.y - currentY) > 2.5 ||
      (currentLine.length > 0 && token.hasEOL)

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

export default function PdfToWordTool() {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isConverting, setIsConverting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState("Upload a PDF to convert it into a .docx file.")
  const [output, setOutput] = useState<ConversionOutput | null>(null)

  useEffect(() => {
    return () => {
      if (output?.url) {
        URL.revokeObjectURL(output.url)
      }
    }
  }, [output])

  const resetOutput = useCallback(() => {
    if (output?.url) {
      URL.revokeObjectURL(output.url)
    }
    setOutput(null)
  }, [output])

  const handleFile = useCallback(
    (candidate: File) => {
      try {
        if (!isPdfFile(candidate)) {
          toast.error("Please choose a PDF file.")
          return
        }

        ensureSafeLocalFileSize(candidate, MAX_PDF_TO_WORD_BYTES)

        setFile(candidate)
        setProgress(0)
        setStatus("Ready to convert.")
        resetOutput()
      } catch (error) {
        const message = error instanceof Error ? error.message : "Could not use this file."
        setStatus(message)
        toast.error(message)
      }
    },
    [resetOutput]
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
    resetOutput()

    try {
      const pdfjs = await getPdfJs()
      const pdfBytes = new Uint8Array(await file.arrayBuffer())
      const loadingTask = pdfjs.getDocument({
        data: pdfBytes,
        disableAutoFetch: true,
        disableRange: true,
        disableStream: true,
      })

      try {
        const pdf = await loadingTask.promise
        const docChildren: Paragraph[] = []
        let extractedLineCount = 0

        for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
          setStatus(`Extracting text from page ${pageNumber} of ${pdf.numPages}...`)
          const page = await pdf.getPage(pageNumber)
          const textContent = await page.getTextContent()
          const lines = extractLinesFromItems(textContent.items as TextItemLike[])

          docChildren.push(
            new Paragraph({
              text: `--- Page ${pageNumber} ---`,
              heading: HeadingLevel.HEADING_2,
            })
          )

          if (lines.length === 0) {
            docChildren.push(
              new Paragraph({
                children: [new TextRun("(No extractable text found on this page.)")],
              })
            )
          } else {
            for (const line of lines) {
              extractedLineCount += 1
              if (classifyHeading(line)) {
                docChildren.push(
                  new Paragraph({
                    text: line,
                    heading: HeadingLevel.HEADING_3,
                  })
                )
              } else {
                docChildren.push(
                  new Paragraph({
                    children: [new TextRun(line)],
                  })
                )
              }
            }
          }

          if (pageNumber < pdf.numPages) {
            docChildren.push(new Paragraph({ text: "" }))
          }

          setProgress(Math.round((pageNumber / pdf.numPages) * 80) + 10)
        }

        if (extractedLineCount === 0) {
          throw new Error("No extractable text was found. This PDF may be image-only.")
        }

        setStatus("Building .docx file...")

        const doc = new Document({
          sections: [
            {
              children: docChildren,
            },
          ],
        })

        const blob = await Packer.toBlob(doc)
        const baseName = extractBaseName(file.name)
        const fileName = `${baseName}.docx`
        const url = URL.createObjectURL(blob)

        setOutput({
          url,
          fileName,
          sizeBytes: blob.size,
        })

        setProgress(100)
        setStatus("Done. Your Word file is ready.")
        toast.success("Conversion complete.")
      } finally {
        await loadingTask.destroy()
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Conversion failed."
      setStatus(message)
      toast.error(message)
    } finally {
      setIsConverting(false)
    }
  }, [file, resetOutput])

  return (
    <div className="space-y-6 overflow-x-hidden">
      <Toaster richColors position="top-right" />

      <Card className="border-blue-500/25 bg-card/80">
        <CardHeader>
          <CardTitle className="text-base">Best-effort PDF to Word conversion</CardTitle>
          <CardDescription>
            Complex layouts may not be preserved. Your file never leaves your device.
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
            handleFile(selected)
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
                handleFile(dropped)
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
            <p className="mt-1 text-xs text-muted-foreground">Best-effort offline conversion to .docx</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">PDF to Word</CardTitle>
          <CardDescription className="break-words">{status}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {file ? (
            <div className="flex flex-col gap-3 rounded-lg border bg-muted/30 p-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">{file.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">{formatBytes(file.size)}</p>
              </div>
              <Button
                type="button"
                variant="ghost"
                className="w-full sm:w-auto"
                onClick={() => {
                  setFile(null)
                  setStatus("Upload a PDF to convert it into a .docx file.")
                  setProgress(0)
                  resetOutput()
                }}
                disabled={isConverting}
              >
                <Trash2 className="h-4 w-4" />
                Remove
              </Button>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No PDF selected yet.</p>
          )}

          {(isConverting || progress > 0) && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{isConverting ? "Converting" : "Complete"}</span>
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
                <FileText className="h-4 w-4" />
                Convert
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => {
              setProgress(0)
              setStatus(file ? "Ready to convert." : "Upload a PDF to convert it into a .docx file.")
              resetOutput()
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
            <CardTitle className="text-base">Download Word file</CardTitle>
            <CardDescription className="break-words">
              {output.fileName} • {formatBytes(output.sizeBytes)}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <ProcessedLocallyBadge />
            <Button asChild className="w-full sm:w-auto">
              <a
                href={output.url}
                download={output.fileName}
                onClick={() => notifyLocalDownloadSuccess()}
              >
                <Download className="h-4 w-4" />
                Download .docx
              </a>
            </Button>
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}
