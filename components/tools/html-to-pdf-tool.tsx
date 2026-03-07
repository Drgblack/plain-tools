"use client"

import html2canvas from "html2canvas"
import jsPDF from "jspdf"
import {
  Download,
  FileText,
  FileType2,
  Globe,
  Loader2,
  RotateCcw,
  UploadCloud,
} from "lucide-react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Toaster, toast } from "sonner"

import { ProcessedLocallyBadge } from "@/components/tools/processed-locally-badge"
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
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { ensureSafeLocalFileSize, formatFileSize } from "@/lib/pdf-client-utils"
import { notifyLocalDownloadSuccess } from "@/lib/local-download-events"

type InputMode = "html" | "url"

type ConversionOutput = {
  url: string
  fileName: string
  sizeBytes: number
  fallbackUsed: boolean
  sourceLabel: string
}

const MAX_HTML_INPUT_BYTES = 4 * 1024 * 1024

const FILE_TEXT_MIME_TYPES = new Set([
  "text/html",
  "application/xhtml+xml",
  "text/plain",
])

const escapeUnsafeFilename = (value: string) =>
  value
    .replace(/[^\w.-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase() || "html-to-pdf"

const stripMarkup = (html: string) => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, "text/html")
  return doc.body.textContent?.replace(/\s+/g, " ").trim() ?? ""
}

const createRenderContainer = (safeHtml: string) => {
  const host = document.createElement("div")
  host.style.position = "fixed"
  host.style.left = "-10000px"
  host.style.top = "0"
  host.style.width = "794px"
  host.style.background = "#ffffff"
  host.style.color = "#111827"
  host.style.padding = "42px"
  host.style.boxSizing = "border-box"
  host.style.fontFamily =
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif'
  host.style.fontSize = "14px"
  host.style.lineHeight = "1.55"
  host.style.zIndex = "-1"
  host.innerHTML = safeHtml
  document.body.appendChild(host)
  return host
}

const sanitizeHtmlForPdf = (html: string) => {
  const parser = new DOMParser()
  const documentRoot = parser.parseFromString(html, "text/html")
  const body = documentRoot.body ?? documentRoot.documentElement

  body
    .querySelectorAll(
      "script, iframe, object, embed, frame, frameset, meta[http-equiv='refresh'], link[rel='preload'], link[rel='modulepreload']"
    )
    .forEach((node) => node.remove())

  body.querySelectorAll("img").forEach((node) => {
    const src = node.getAttribute("src") ?? ""
    if (/^https?:\/\//i.test(src)) {
      node.replaceWith(documentRoot.createTextNode(node.getAttribute("alt") ?? ""))
    }
  })

  body.querySelectorAll("*").forEach((element) => {
    const attrs = Array.from(element.attributes)
    attrs.forEach((attr) => {
      const key = attr.name.toLowerCase()
      const value = attr.value.trim().toLowerCase()

      if (key.startsWith("on")) {
        element.removeAttribute(attr.name)
        return
      }

      if (
        (key === "href" || key === "src" || key === "xlink:href" || key === "srcdoc") &&
        value.startsWith("javascript:")
      ) {
        element.removeAttribute(attr.name)
      }
    })
  })

  return body.innerHTML.trim()
}

const fetchWithTimeout = async (url: string, timeoutMs: number) => {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const response = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: {
        Accept: "text/html,application/xhtml+xml,text/plain;q=0.9,*/*;q=0.8",
      },
    })
    if (!response.ok) {
      throw new Error(`HTTP ${response.status} ${response.statusText}`.trim())
    }
    return await response.text()
  } finally {
    clearTimeout(timer)
  }
}

const fetchHtmlFromUrl = async (urlValue: string, useProxy: boolean) => {
  let parsedUrl: URL
  try {
    parsedUrl = new URL(urlValue.trim())
  } catch {
    throw new Error("Enter a valid URL starting with http:// or https://")
  }

  if (!/^https?:$/i.test(parsedUrl.protocol)) {
    throw new Error("Only HTTP and HTTPS URLs are supported.")
  }

  try {
    const html = await fetchWithTimeout(parsedUrl.toString(), 15000)
    return {
      html,
      sourceLabel: parsedUrl.hostname,
    }
  } catch (directError) {
    if (!useProxy) {
      throw new Error(
        `Direct fetch failed (likely CORS blocked): ${
          directError instanceof Error ? directError.message : "Unknown error"
        }`
      )
    }

    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(parsedUrl.toString())}`
    try {
      const html = await fetchWithTimeout(proxyUrl, 20000)
      return {
        html,
        sourceLabel: `${parsedUrl.hostname} (proxy fetch)`,
      }
    } catch (proxyError) {
      throw new Error(
        `Could not fetch URL content. Direct fetch error: ${
          directError instanceof Error ? directError.message : "Unknown error"
        }. Proxy fetch error: ${
          proxyError instanceof Error ? proxyError.message : "Unknown error"
        }. Paste HTML manually as fallback.`
      )
    }
  }
}

const renderHtmlToPdf = async (html: string, fileName: string) => {
  const container = createRenderContainer(html)
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

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4",
      compress: true,
    })

    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const imageWidth = pageWidth
    const imageHeight = (canvas.height * imageWidth) / canvas.width
    const imageData = canvas.toDataURL("image/png")

    let remainingHeight = imageHeight
    let yOffset = 0
    pdf.addImage(imageData, "PNG", 0, yOffset, imageWidth, imageHeight, undefined, "FAST")
    remainingHeight -= pageHeight

    while (remainingHeight > 0) {
      yOffset -= pageHeight
      pdf.addPage()
      pdf.addImage(imageData, "PNG", 0, yOffset, imageWidth, imageHeight, undefined, "FAST")
      remainingHeight -= pageHeight
    }

    const blob = pdf.output("blob")
    return {
      blob,
      fileName: `${fileName}.pdf`,
      fallbackUsed: false,
    }
  } finally {
    container.remove()
  }
}

const renderTextFallbackPdf = (plainText: string, fileName: string) => {
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "a4",
    compress: true,
  })

  const margin = 40
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  const maxWidth = pageWidth - margin * 2
  const lineHeight = 16

  pdf.setFont("helvetica", "normal")
  pdf.setFontSize(11)

  const lines = pdf.splitTextToSize(plainText, maxWidth)
  let y = margin

  for (const line of lines) {
    if (y > pageHeight - margin) {
      pdf.addPage()
      y = margin
    }
    pdf.text(line, margin, y)
    y += lineHeight
  }

  const blob = pdf.output("blob")
  return {
    blob,
    fileName: `${fileName}.pdf`,
    fallbackUsed: true,
  }
}

const readTextFile = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result)
        return
      }
      reject(new Error("Could not read the file as text."))
    }
    reader.onerror = () => reject(new Error("Could not read the selected file."))
    reader.readAsText(file)
  })

export default function HtmlToPdfTool() {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [mode, setMode] = useState<InputMode>("html")
  const [htmlInput, setHtmlInput] = useState("")
  const [urlInput, setUrlInput] = useState("")
  const [useProxyFallback, setUseProxyFallback] = useState(true)
  const [isConverting, setIsConverting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState(
    "Paste HTML or fetch a URL, then generate a PDF locally in your browser."
  )
  const [output, setOutput] = useState<ConversionOutput | null>(null)

  const canConvert = useMemo(() => {
    if (isConverting) return false
    if (mode === "html") return htmlInput.trim().length > 0
    return urlInput.trim().length > 0
  }, [htmlInput, isConverting, mode, urlInput])

  const resetOutput = useCallback(() => {
    if (output?.url) {
      URL.revokeObjectURL(output.url)
    }
    setOutput(null)
  }, [output])

  useEffect(() => {
    return () => {
      if (output?.url) {
        URL.revokeObjectURL(output.url)
      }
    }
  }, [output])

  const onHtmlFileSelected = useCallback(async (file: File) => {
    try {
      if (
        !FILE_TEXT_MIME_TYPES.has(file.type) &&
        !/\.(html?|txt)$/i.test(file.name)
      ) {
        toast.error("Select an .html, .htm, or .txt file.")
        return
      }
      ensureSafeLocalFileSize(file, MAX_HTML_INPUT_BYTES)
      const text = await readTextFile(file)
      setMode("html")
      setHtmlInput(text)
      setStatus(`Loaded ${file.name}. Ready to convert.`)
      resetOutput()
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not load the selected file."
      toast.error(message)
      setStatus(message)
    }
  }, [resetOutput])

  const runConversion = useCallback(async () => {
    if (!canConvert) {
      toast.error("Add HTML input or URL first.")
      return
    }

    setIsConverting(true)
    setProgress(5)
    setStatus("Preparing conversion...")
    resetOutput()

    try {
      let rawHtml = ""
      let sourceLabel = "pasted-html"
      if (mode === "html") {
        rawHtml = htmlInput.trim()
      } else {
        setStatus("Fetching URL content...")
        setProgress(20)
        const fetched = await fetchHtmlFromUrl(urlInput, useProxyFallback)
        rawHtml = fetched.html
        sourceLabel = fetched.sourceLabel
      }

      const safeHtml = sanitizeHtmlForPdf(rawHtml)
      if (!safeHtml) {
        throw new Error("No usable HTML content was found.")
      }

      setStatus("Rendering HTML to PDF locally...")
      setProgress(55)
      const baseName = escapeUnsafeFilename(sourceLabel)

      let converted: { blob: Blob; fileName: string; fallbackUsed: boolean }
      try {
        converted = await renderHtmlToPdf(safeHtml, baseName)
      } catch {
        const plainText = stripMarkup(safeHtml)
        if (!plainText) {
          throw new Error("Could not render HTML and no text fallback content was found.")
        }
        converted = renderTextFallbackPdf(plainText, baseName)
      }

      const downloadUrl = URL.createObjectURL(converted.blob)
      setOutput({
        url: downloadUrl,
        fileName: converted.fileName,
        sizeBytes: converted.blob.size,
        fallbackUsed: converted.fallbackUsed,
        sourceLabel,
      })
      setStatus(
        converted.fallbackUsed
          ? "Done with text-only fallback. Your PDF is ready."
          : "Done. Your PDF is ready."
      )
      setProgress(100)
      toast.success("HTML to PDF conversion complete.")
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not convert this content."
      setStatus(message)
      toast.error(message)
    } finally {
      setIsConverting(false)
    }
  }, [canConvert, htmlInput, mode, resetOutput, urlInput, useProxyFallback])

  return (
    <div className="space-y-6 overflow-x-hidden">
      <Toaster richColors position="top-right" />

      <Card className="border-blue-500/25 bg-card/80">
        <CardHeader>
          <CardTitle className="text-base">Best-effort HTML to PDF</CardTitle>
          <CardDescription>
            Complex CSS, scripts, and external assets may not render perfectly. Conversion runs
            locally in your browser. Files never leave your device.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">HTML to PDF</CardTitle>
          <CardDescription>{status}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <Tabs
            value={mode}
            onValueChange={(value) => setMode(value as InputMode)}
            className="space-y-4"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="html">Paste HTML</TabsTrigger>
              <TabsTrigger value="url">Fetch URL</TabsTrigger>
            </TabsList>

            <TabsContent value="html" className="space-y-3">
              <Textarea
                value={htmlInput}
                onChange={(event) => setHtmlInput(event.target.value)}
                rows={12}
                placeholder="<h1>Hello</h1><p>Paste HTML markup here...</p>"
                disabled={isConverting}
              />
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isConverting}
                >
                  <UploadCloud className="h-4 w-4" />
                  Load .html file
                </Button>
                <p className="text-xs text-muted-foreground">
                  Useful for local snippets or exported HTML fragments.
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".html,.htm,.txt,text/html,text/plain"
                onChange={(event) => {
                  const selected = event.target.files?.[0]
                  if (selected) {
                    void onHtmlFileSelected(selected)
                  }
                  event.currentTarget.value = ""
                }}
              />
            </TabsContent>

            <TabsContent value="url" className="space-y-3">
              <Input
                value={urlInput}
                onChange={(event) => setUrlInput(event.target.value)}
                placeholder="https://example.com"
                disabled={isConverting}
              />
              <label className="flex items-center gap-2 text-xs text-muted-foreground">
                <input
                  type="checkbox"
                  checked={useProxyFallback}
                  onChange={(event) => setUseProxyFallback(event.target.checked)}
                  disabled={isConverting}
                />
                Use proxy fallback if direct fetch is blocked by CORS
              </label>
              <p className="text-xs text-muted-foreground">
                URL mode sends a GET request from your browser to retrieve page HTML. If blocked,
                paste HTML manually.
              </p>
            </TabsContent>
          </Tabs>

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
          <Button
            type="button"
            className="w-full sm:w-auto"
            onClick={() => void runConversion()}
            disabled={!canConvert}
          >
            {isConverting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Converting...
              </>
            ) : (
              <>
                {mode === "url" ? <Globe className="h-4 w-4" /> : <FileType2 className="h-4 w-4" />}
                Convert to PDF
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto"
            disabled={isConverting}
            onClick={() => {
              setHtmlInput("")
              setUrlInput("")
              setProgress(0)
              setStatus("Paste HTML or fetch a URL, then generate a PDF locally in your browser.")
              resetOutput()
            }}
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </CardFooter>
      </Card>

      {output ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Your file is ready</CardTitle>
            <CardDescription>
              {output.fileName} • {formatFileSize(output.sizeBytes)}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <ProcessedLocallyBadge />
            <p className="text-sm text-muted-foreground">
              Source: {output.sourceLabel}
              {output.fallbackUsed
                ? " • Text-only fallback used for compatibility."
                : " • HTML rendering completed."}
            </p>
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

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start gap-3 rounded-lg border border-border/70 bg-muted/20 p-4 text-sm">
            <FileText className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <p className="text-muted-foreground">
              Best-effort offline conversion. Complex HTML, external scripts, and remote assets may
              not be preserved. The conversion itself runs locally on your device.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
