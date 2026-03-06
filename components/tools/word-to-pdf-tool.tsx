"use client"

import html2canvas from "html2canvas"
import jsPDF from "jspdf"
import mammoth from "mammoth"
import { Download, FileType2, Loader2, Trash2, UploadCloud } from "lucide-react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Toaster, toast } from "sonner"

import { ProcessedLocallyBadge } from "@/components/tools/processed-locally-badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ensureSafeLocalFileSize, formatFileSize } from "@/lib/pdf-client-utils"
import { notifyLocalDownloadSuccess } from "@/lib/local-download-events"
import { sanitizeDocxHtmlForRendering } from "@/lib/word-html-sanitizer"

type ConversionOutput = {
  url: string
  fileName: string
  sizeBytes: number
}

const DOCX_MIME = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"

const isDocxFile = (file: File) =>
  file.type === DOCX_MIME || file.name.toLowerCase().endsWith(".docx")

const MAX_DOCX_BYTES = 40 * 1024 * 1024

const extractBaseName = (name: string) => name.replace(/\.docx$/i, "")

const createRenderContainer = (html: string) => {
  const host = document.createElement("div")
  host.style.position = "fixed"
  host.style.left = "-10000px"
  host.style.top = "0"
  host.style.width = "794px"
  host.style.background = "#ffffff"
  host.style.color = "#111111"
  host.style.padding = "48px"
  host.style.boxSizing = "border-box"
  host.style.fontFamily = "Arial, Helvetica, sans-serif"
  host.style.fontSize = "14px"
  host.style.lineHeight = "1.5"
  host.style.zIndex = "-1"

  host.innerHTML = html
  document.body.appendChild(host)
  return host
}

export default function WordToPdfTool() {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isConverting, setIsConverting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState("Upload a .docx file to convert it into PDF.")
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
        if (!isDocxFile(candidate)) {
          toast.error("Please choose a .docx file.")
          return
        }
        ensureSafeLocalFileSize(candidate, MAX_DOCX_BYTES)

        setFile(candidate)
        setProgress(0)
        setStatus("Ready to convert.")
        resetOutput()
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Could not use this file."
        setStatus(message)
        toast.error(message)
      }
    },
    [resetOutput]
  )

  const canConvert = useMemo(() => Boolean(file && !isConverting), [file, isConverting])

  const runConversion = useCallback(async () => {
    if (!file) {
      toast.error("Upload a Word file first.")
      return
    }

    setIsConverting(true)
    setProgress(5)
    setStatus("Reading .docx content locally...")
    resetOutput()

    try {
      const arrayBuffer = await file.arrayBuffer()
      const mammothResult = await mammoth.convertToHtml({ arrayBuffer })
      const safeHtml = sanitizeDocxHtmlForRendering(mammothResult.value)
      const textOnly = safeHtml.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()

      if (!textOnly) {
        throw new Error("No readable text was found in this .docx file.")
      }

      setProgress(35)
      setStatus("Rendering document preview to canvas...")

      const container = createRenderContainer(safeHtml)

      try {
        if (document.fonts && "ready" in document.fonts) {
          await document.fonts.ready
        }

        await new Promise((resolve) => window.requestAnimationFrame(() => resolve(null)))

        const canvas = await html2canvas(container, {
          scale: 2,
          useCORS: true,
          backgroundColor: "#ffffff",
          logging: false,
          windowWidth: container.scrollWidth,
          windowHeight: container.scrollHeight,
        })

        setProgress(70)
        setStatus("Generating PDF...")

        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "pt",
          format: "a4",
          compress: true,
        })

        const pageWidth = pdf.internal.pageSize.getWidth()
        const pageHeight = pdf.internal.pageSize.getHeight()

        const imageData = canvas.toDataURL("image/png")
        const imageWidth = pageWidth
        const imageHeight = (canvas.height * imageWidth) / canvas.width

        let heightLeft = imageHeight
        let yOffset = 0

        pdf.addImage(imageData, "PNG", 0, yOffset, imageWidth, imageHeight, undefined, "FAST")
        heightLeft -= pageHeight

        while (heightLeft > 0) {
          yOffset -= pageHeight
          pdf.addPage()
          pdf.addImage(imageData, "PNG", 0, yOffset, imageWidth, imageHeight, undefined, "FAST")
          heightLeft -= pageHeight
        }

        const blob = pdf.output("blob")
        const baseName = extractBaseName(file.name)
        const fileName = `${baseName}.pdf`
        const url = URL.createObjectURL(blob)

        setOutput({
          url,
          fileName,
          sizeBytes: blob.size,
        })

        setProgress(100)
        setStatus("Done. Your PDF is ready.")
        toast.success("Conversion complete.")
      } finally {
        container.remove()
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
          <CardTitle className="text-base">Best-effort Word to PDF conversion</CardTitle>
          <CardDescription>
            Complex formatting may shift. Conversion runs locally in your browser. No uploads.
          </CardDescription>
        </CardHeader>
      </Card>

      <input
        ref={fileInputRef}
        type="file"
        accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
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
            <p className="text-sm font-medium text-foreground">Drop a .docx file here, or click to browse</p>
            <p className="mt-1 text-xs text-muted-foreground">Best-effort offline conversion to PDF</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Word to PDF</CardTitle>
          <CardDescription className="break-words">{status}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {file ? (
            <div className="flex flex-col gap-3 rounded-lg border bg-muted/30 p-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">{file.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
              </div>
              <Button
                type="button"
                variant="ghost"
                className="w-full sm:w-auto"
                onClick={() => {
                  setFile(null)
                  setStatus("Upload a .docx file to convert it into PDF.")
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
            <p className="text-sm text-muted-foreground">No Word file selected yet.</p>
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
                <FileType2 className="h-4 w-4" />
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
              setStatus(file ? "Ready to convert." : "Upload a .docx file to convert it into PDF.")
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
            <CardTitle className="text-base">Download PDF</CardTitle>
            <CardDescription className="break-words">
              {output.fileName} • {formatFileSize(output.sizeBytes)}
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
                Download PDF
              </a>
            </Button>
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}
