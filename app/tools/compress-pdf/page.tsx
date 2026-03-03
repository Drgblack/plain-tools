"use client"

import { useState, useCallback, useRef } from "react"
import { PDFDocument } from "pdf-lib"
import { FileText, Download, ShieldCheck, CheckCircle2, X, Info } from "lucide-react"
import Link from "next/link"
import Script from "next/script"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { serializeJsonLd } from "@/lib/sanitize"

const softwareAppJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Plain - Compress PDF",
  "applicationCategory": "UtilitiesApplication",
  "operatingSystem": "Web",
  "url": "https://plain.tools/tools/compress-pdf",
  "description": "Compress PDF files locally in your browser. No uploads. Results depend on your document.",
  "publisher": {
    "@id": "https://plain.tools/#organization"
  }
}

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://plain.tools/" },
    { "@type": "ListItem", "position": 2, "name": "Tools", "item": "https://plain.tools/tools" },
    { "@type": "ListItem", "position": 3, "name": "Compress PDF", "item": "https://plain.tools/tools/compress-pdf" }
  ]
}

interface CompressionResult {
  name: string
  url: string
  originalSize: number
  compressedSize: number
  savings: number
}

export default function CompressPDFPage() {
  const [file, setFile] = useState<File | null>(null)
  const [pageCount, setPageCount] = useState<number | null>(null)
  const [isDraggingOver, setIsDraggingOver] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<CompressionResult | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }

  const handleFile = useCallback(async (newFile: File) => {
    if (newFile.type !== "application/pdf") return
    setFile(newFile)
    setResult(null)
    setPageCount(null)
    
    // Read page count
    try {
      const arrayBuffer = await newFile.arrayBuffer()
      const pdfDoc = await PDFDocument.load(arrayBuffer)
      setPageCount(pdfDoc.getPageCount())
    } catch {
      // Silently fail - page count is optional info
    }
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDraggingOver(false)
      const droppedFile = e.dataTransfer.files[0]
      if (droppedFile) handleFile(droppedFile)
    },
    [handleFile]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDraggingOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDraggingOver(false)
  }, [])

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0]
      if (selectedFile) handleFile(selectedFile)
    },
    [handleFile]
  )

  const removeFile = useCallback(() => {
    setFile(null)
    setPageCount(null)
    setResult(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }, [])

  const compress = async () => {
    if (!file) return

    setIsProcessing(true)

    try {
      const arrayBuffer = await file.arrayBuffer()
      const pdfDoc = await PDFDocument.load(arrayBuffer)
      
      // Re-save the PDF which can reduce size by removing unused objects
      const compressedBytes = await pdfDoc.save({
        useObjectStreams: true,
        addDefaultPage: false,
      })

      const originalSize = file.size
      const compressedSize = compressedBytes.length
      const savings = Math.max(0, ((originalSize - compressedSize) / originalSize) * 100)

      const blob = new Blob([compressedBytes], { type: "application/pdf" })
      const url = URL.createObjectURL(blob)

      const baseName = file.name.replace(/\.pdf$/i, "")

      setResult({
        name: `${baseName}_compressed.pdf`,
        url,
        originalSize,
        compressedSize,
        savings,
      })
    } catch (error) {
      console.error("Compression failed:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const reset = () => {
    if (result?.url) {
      URL.revokeObjectURL(result.url)
    }
    setFile(null)
    setPageCount(null)
    setResult(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const canCompress = file !== null

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-background">
      <Script
        id="software-app-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(softwareAppJsonLd) }}
      />
      <Script
        id="breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbJsonLd) }}
      />
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative px-4 pt-16 pb-6 md:pt-20">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute left-1/2 top-0 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/[0.04] blur-3xl" />
          </div>
          <div className="relative mx-auto max-w-3xl text-center">
            <h1 className="text-[28px] font-bold tracking-tight text-foreground md:text-[36px]">
              Compress PDF
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground md:text-[16px]">
              Reduce file size locally in your browser. Results depend on your document.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-accent/8 px-3 py-1.5 ring-1 ring-accent/20">
              <ShieldCheck className="h-3.5 w-3.5 text-accent" strokeWidth={2} />
              <span className="text-[12px] font-medium text-accent">
                Processed locally. Files never leave your device.
              </span>
            </div>
          </div>
        </section>

        {/* Tool Section */}
        <section className="px-4 pb-20">
          <div className="mx-auto max-w-2xl">
            {/* Main tool area */}
            {!result ? (
              <div className="rounded-2xl bg-[oklch(0.14_0.005_250)] p-8 ring-1 ring-white/[0.06]">
                {/* File input */}
                {!file ? (
                  <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative cursor-pointer rounded-xl border-2 border-dashed p-12 text-center transition-all duration-200 ${
                      isDraggingOver
                        ? "border-accent bg-accent/[0.06]"
                        : "border-white/[0.12] hover:border-accent/40 hover:bg-white/[0.02]"
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,application/pdf"
                      onChange={handleFileInput}
                      className="hidden"
                    />
                    <div className="relative mx-auto mb-5 w-fit">
                      <div className="absolute -inset-3 rounded-2xl bg-accent/[0.08] blur-xl" />
                      <div className="relative flex h-14 w-14 items-center justify-center rounded-xl bg-accent/12 ring-1 ring-accent/25">
                        <FileText className="h-7 w-7 text-accent" strokeWidth={1.5} />
                      </div>
                    </div>
                    <p className="text-[15px] font-medium text-foreground">
                      Drop your PDF here
                    </p>
                    <p className="mt-2 text-[13px] text-muted-foreground">
                      or click to browse
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Selected file */}
                    <div className="flex items-center gap-4 rounded-xl bg-[oklch(0.165_0.006_250)] p-4 ring-1 ring-white/[0.06]">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/12 ring-1 ring-accent/20">
                        <FileText className="h-5 w-5 text-accent" strokeWidth={1.75} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[14px] font-medium text-foreground">
                          {file.name}
                        </p>
                        <p className="mt-0.5 text-[12px] text-muted-foreground">
                          {formatFileSize(file.size)}
                          {pageCount !== null && (
                            <span className="text-muted-foreground/60"> · {pageCount} {pageCount === 1 ? "page" : "pages"}</span>
                          )}
                        </p>
                      </div>
                      <button
                        onClick={removeFile}
                        className="rounded-md p-1.5 text-muted-foreground/60 transition-colors hover:bg-white/[0.06] hover:text-foreground"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Note about compression limits */}
                    <div className="flex items-start gap-3 rounded-lg bg-[oklch(0.12_0.003_250)] p-4 border border-white/[0.06]">
                      <Info className="h-4 w-4 shrink-0 text-muted-foreground/70 mt-0.5" />
                      <div className="text-[13px] text-muted-foreground leading-relaxed">
                        <p>
                          Offline compression has limits. Results depend on how your PDF was created.{" "}
                          <Link 
                            href="/learn/why-offline-compression-has-limits" 
                            className="text-accent hover:underline"
                          >
                            Learn why
                          </Link>
                        </p>
                      </div>
                    </div>

                    {/* Compress button */}
                    <Button
                      onClick={compress}
                      disabled={!canCompress || isProcessing}
                      className="w-full h-12 text-[15px] font-semibold bg-accent hover:bg-accent/90 text-accent-foreground disabled:opacity-40"
                    >
                      {isProcessing ? "Compressing..." : "Compress PDF"}
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              /* Success State */
              <div className="rounded-2xl bg-[oklch(0.14_0.005_250)] p-10 ring-1 ring-white/[0.06]">
                {/* Success header - different messaging based on result */}
                <div className="text-center mb-8">
                  <div className="relative mx-auto mb-6 w-fit">
                    <div className={`absolute -inset-4 rounded-2xl blur-xl ${result.savings > 0 ? "bg-green-500/[0.06]" : "bg-accent/[0.04]"}`} />
                    <div className={`relative flex h-14 w-14 items-center justify-center rounded-xl ${result.savings > 0 ? "bg-green-500/10 ring-1 ring-green-500/25" : "bg-accent/10 ring-1 ring-accent/20"}`}>
                      <CheckCircle2 className={`h-7 w-7 ${result.savings > 0 ? "text-green-500" : "text-accent"}`} strokeWidth={1.5} />
                    </div>
                  </div>
                  <h2 className="text-[18px] font-semibold text-foreground">
                    {result.savings > 0 ? "Compression successful" : "Processing complete"}
                  </h2>
                  <p className="mt-2 text-[14px] text-muted-foreground max-w-sm mx-auto">
                    {result.savings > 0 
                      ? "Your PDF has been compressed."
                      : "This PDF could not be compressed further without quality loss."
                    }
                  </p>
                </div>

                {/* Size comparison */}
                <div className="rounded-lg bg-[oklch(0.155_0.005_250)] p-5 border border-white/[0.08]">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[13px] text-muted-foreground">Original size</span>
                    <span className="text-[14px] font-medium text-foreground">{formatFileSize(result.originalSize)}</span>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[13px] text-muted-foreground">Compressed size</span>
                    <span className="text-[14px] font-medium text-foreground">{formatFileSize(result.compressedSize)}</span>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
                    <span className="text-[13px] text-muted-foreground">Change</span>
                    <span className={`text-[14px] font-semibold ${result.savings > 0 ? "text-green-500" : "text-muted-foreground/70"}`}>
                      {result.savings > 0 ? `-${result.savings.toFixed(1)}%` : "0%"}
                    </span>
                  </div>
                </div>

                {/* Explanation for no reduction */}
                {result.savings <= 0 && (
                  <div className="mt-4 flex items-start gap-3 rounded-lg bg-[oklch(0.12_0.003_250)] p-4 border border-white/[0.06]">
                    <Info className="h-4 w-4 shrink-0 text-muted-foreground/60 mt-0.5" />
                    <p className="text-[13px] text-muted-foreground/80 leading-relaxed">
                      This PDF is already optimized or uses compression that cannot be improved with browser-based processing.{" "}
                      <Link 
                        href="/learn/why-offline-compression-has-limits" 
                        className="text-accent/80 hover:text-accent hover:underline"
                      >
                        Learn why
                      </Link>
                    </p>
                  </div>
                )}

                {/* Download button */}
                <div className="mt-6">
                  <a
                    href={result.url}
                    download={result.name}
                    className="flex items-center justify-center gap-2 w-full h-14 rounded-xl bg-accent text-[15px] font-semibold text-accent-foreground transition-colors hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    <Download className="h-5 w-5" strokeWidth={2} />
                    Download PDF
                  </a>
                </div>

                {/* Secondary actions */}
                <div className="mt-10 pt-8 border-t border-white/[0.04]">
                  <div className="flex flex-col items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        if (result?.url) URL.revokeObjectURL(result.url)
                        setResult(null)
                      }}
                      className="text-[13px] text-muted-foreground/80 transition-colors hover:text-foreground"
                    >
                      Try another compression level
                    </button>
                    <button
                      type="button"
                      onClick={reset}
                      className="text-[13px] text-muted-foreground/60 transition-colors hover:text-foreground"
                    >
                      Compress another PDF
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Other tools */}
            <div className="mt-8 text-center">
              <p className="text-[12px] text-muted-foreground/60 mb-3">Other tools</p>
              <div className="flex flex-wrap justify-center gap-2">
                <Link
                  href="/tools/merge-pdf"
                  className="rounded-full bg-[oklch(0.14_0.004_250)] px-3 py-1.5 text-[12px] text-muted-foreground border border-white/[0.06] transition-colors hover:border-accent/25 hover:text-foreground"
                >
                  Merge PDF
                </Link>
                <Link
                  href="/tools/split-pdf"
                  className="rounded-full bg-[oklch(0.14_0.004_250)] px-3 py-1.5 text-[12px] text-muted-foreground border border-white/[0.06] transition-colors hover:border-accent/25 hover:text-foreground"
                >
                  Split PDF
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* SEO Content */}
        <section className="relative px-4 py-12">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />
          <div className="mx-auto max-w-3xl">
            <h2 className="text-lg font-medium text-foreground">
              Compress PDF Files Without Uploading
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Plain compresses PDF files offline without uploading them to any server.
              All processing happens locally in your browser. Note that offline compression
              has limitations compared to server-based tools, and results depend on how
              your PDF was created.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
