"use client"

import { useState, useCallback, useRef, useMemo } from "react"
import { PDFDocument } from "pdf-lib"
import { FileText, Download, ShieldCheck, CheckCircle2, X, ChevronDown, AlertCircle } from "lucide-react"
import Link from "next/link"
import Script from "next/script"
import { Header } from "@/components/legacy/header"
import { Footer } from "@/components/legacy/footer"
import { Button } from "@/components/legacy/ui/button"
import { ShareButton } from "@/components/legacy/share-button"

const softwareAppJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Plain - Extract PDF Pages",
  "applicationCategory": "UtilitiesApplication",
  "operatingSystem": "Web",
  "url": "https://plain.tools/tools/extract-pdf",
  "description": "Extract pages from PDF files offline in your browser. Select specific pages or ranges to create a new PDF. Files are processed locally and never uploaded.",
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
    { "@type": "ListItem", "position": 3, "name": "Extract PDF", "item": "https://plain.tools/tools/extract-pdf" }
  ]
}

interface ExtractionResult {
  name: string
  url: string
  pageCount: number
  pageRange: string
}

export default function ExtractPDFPage() {
  const [file, setFile] = useState<File | null>(null)
  const [pageCount, setPageCount] = useState<number | null>(null)
  const [isDraggingOver, setIsDraggingOver] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [pageRangeInput, setPageRangeInput] = useState("")
  const [extractAsSeparate, setExtractAsSeparate] = useState(false)
  const [showOptions, setShowOptions] = useState(false)
  const [results, setResults] = useState<ExtractionResult[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const getPageCount = async (file: File): Promise<number | null> => {
    try {
      const arrayBuffer = await file.arrayBuffer()
      const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true })
      return pdf.getPageCount()
    } catch {
      return null
    }
  }

  const handleFile = useCallback(async (newFile: File) => {
    if (newFile.type !== "application/pdf") return
    
    const count = await getPageCount(newFile)
    setFile(newFile)
    setPageCount(count)
    setPageRangeInput("")
    setResults([])
    setExtractAsSeparate(false)
    setShowOptions(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDraggingOver(false)
      if (e.dataTransfer.files.length > 0) {
        handleFile(e.dataTransfer.files[0])
      }
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

  // Parse and validate page ranges
  const parseResult = useMemo(() => {
    if (!pageRangeInput.trim() || !pageCount) {
      return { pages: [], error: null }
    }

    const pages: number[] = []
    const errors: string[] = []
    const parts = pageRangeInput.split(",").map(s => s.trim()).filter(Boolean)

    for (const part of parts) {
      if (part.includes("-")) {
        const [startStr, endStr] = part.split("-").map(s => s.trim())
        const start = parseInt(startStr, 10)
        const end = parseInt(endStr, 10)

        if (isNaN(start) || isNaN(end)) {
          errors.push(`Invalid range "${part}"`)
        } else if (start < 1 || end < 1) {
          errors.push(`Page numbers must be at least 1`)
        } else if (start > pageCount || end > pageCount) {
          errors.push(`Page ${Math.max(start, end)} exceeds document length (${pageCount} pages)`)
        } else if (start > end) {
          errors.push(`Invalid range "${part}" (start > end)`)
        } else {
          for (let i = start; i <= end; i++) {
            if (!pages.includes(i)) pages.push(i)
          }
        }
      } else {
        const page = parseInt(part, 10)
        if (isNaN(page)) {
          errors.push(`Invalid page number "${part}"`)
        } else if (page < 1) {
          errors.push(`Page numbers must be at least 1`)
        } else if (page > pageCount) {
          errors.push(`Page ${page} exceeds document length (${pageCount} pages)`)
        } else {
          if (!pages.includes(page)) pages.push(page)
        }
      }
    }

    pages.sort((a, b) => a - b)
    return { pages, error: errors.length > 0 ? errors[0] : null }
  }, [pageRangeInput, pageCount])

  const isValidInput = parseResult.pages.length > 0 && !parseResult.error

  const extractPages = async () => {
    if (!file || !pageCount || !isValidInput) return

    setIsProcessing(true)
    const newResults: ExtractionResult[] = []

    try {
      const arrayBuffer = await file.arrayBuffer()
      const sourcePdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true })
      const baseName = file.name.replace(/\.pdf$/i, "")

      if (extractAsSeparate) {
        // Extract each page as a separate PDF
        for (const pageNum of parseResult.pages) {
          const newPdf = await PDFDocument.create()
          const [page] = await newPdf.copyPages(sourcePdf, [pageNum - 1])
          newPdf.addPage(page)
          
          const pdfBytes = await newPdf.save()
          const blob = new Blob([pdfBytes], { type: "application/pdf" })
          const url = URL.createObjectURL(blob)
          
          newResults.push({
            name: `${baseName}_page_${pageNum}.pdf`,
            url,
            pageCount: 1,
            pageRange: `Page ${pageNum}`
          })
        }
      } else {
        // Extract all selected pages into one PDF (default)
        const newPdf = await PDFDocument.create()
        const pages = await newPdf.copyPages(sourcePdf, parseResult.pages.map(p => p - 1))
        pages.forEach(page => newPdf.addPage(page))
        
        const pdfBytes = await newPdf.save()
        const blob = new Blob([pdfBytes], { type: "application/pdf" })
        const url = URL.createObjectURL(blob)
        
        const rangeLabel = parseResult.pages.length === 1
          ? `page_${parseResult.pages[0]}`
          : `pages_${parseResult.pages[0]}-${parseResult.pages[parseResult.pages.length - 1]}`
        
        newResults.push({
          name: `${baseName}_${rangeLabel}.pdf`,
          url,
          pageCount: parseResult.pages.length,
          pageRange: parseResult.pages.length === 1 
            ? `Page ${parseResult.pages[0]}`
            : `${parseResult.pages.length} pages`
        })
      }

      setResults(newResults)
    } catch (error) {
      console.error("Error extracting pages:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const reset = () => {
    results.forEach(r => URL.revokeObjectURL(r.url))
    setFile(null)
    setPageCount(null)
    setPageRangeInput("")
    setResults([])
    setExtractAsSeparate(false)
    setShowOptions(false)
  }

  const removeFile = () => {
    setFile(null)
    setPageCount(null)
    setPageRangeInput("")
    setResults([])
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Script
        id="software-app-json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppJsonLd) }}
      />
      <Script
        id="breadcrumb-json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Header />

      <main className="flex-1">
        {/* Tool Header */}
        <section className="relative bg-[oklch(0.12_0.004_250)] px-4 pt-20 pb-10">
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent/10 to-transparent" />
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-[28px] font-semibold tracking-tight text-foreground md:text-[32px]">
              Extract PDF Pages
            </h1>
            <p className="mt-4 flex items-center justify-center gap-2.5 text-[15px] text-muted-foreground">
              <ShieldCheck className="h-5 w-5 text-accent" strokeWidth={1.75} />
              <span>Processed locally. <strong className="text-foreground/90">Files never leave your device.</strong></span>
            </p>
          </div>
        </section>

        {/* Main Tool Area */}
        <section className="px-4 py-10 md:py-14">
          <div className="mx-auto max-w-2xl">
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />

            {/* Drop Zone - visible when no result */}
            {results.length === 0 && (
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => !file && fileInputRef.current?.click()}
                className={`relative rounded-2xl border-2 border-dashed transition-all duration-200 ${
                  isDraggingOver
                    ? "border-accent bg-accent/[0.06] shadow-[0_0_50px_-10px_oklch(0.62_0.21_250/0.35)]"
                    : file 
                      ? "border-white/[0.08] bg-[oklch(0.14_0.005_250)]" 
                      : "border-white/[0.10] bg-[oklch(0.14_0.005_250)] hover:border-accent/30 hover:bg-[oklch(0.145_0.005_250)] cursor-pointer"
                } ${file ? "p-6" : "p-14 md:p-20"}`}
              >
                {/* Empty state */}
                {!file && (
                  <div className="flex flex-col items-center text-center">
                    <div className="relative mb-8">
                      <div className="absolute -inset-5 rounded-3xl bg-accent/[0.08] blur-2xl" />
                      <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl bg-accent/12 ring-1 ring-accent/25">
                        <FileText className="h-12 w-12 text-accent" strokeWidth={1.5} />
                      </div>
                    </div>
                    <p className="text-[18px] font-semibold text-foreground">
                      Drop a PDF file here
                    </p>
                    <p className="mt-3 max-w-sm text-[14px] leading-relaxed text-muted-foreground">
                      Drag and drop your file, or click anywhere in this area to browse
                    </p>
                    <Button
                      variant="outline"
                      className="mt-8 h-12 px-10 text-[14px] font-medium border-white/[0.12] bg-[oklch(0.16_0.006_250)] hover:bg-[oklch(0.18_0.007_250)] hover:border-white/[0.18] focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                      onClick={(e) => {
                        e.stopPropagation()
                        fileInputRef.current?.click()
                      }}
                    >
                      Select file
                    </Button>
                  </div>
                )}

                {/* File loaded state */}
                {file && (
                  <div className="space-y-6">
                    {/* File info */}
                    <div className="flex items-center gap-4 rounded-xl bg-[oklch(0.165_0.006_250)] p-4 ring-1 ring-white/[0.06]">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-accent/12 ring-1 ring-accent/20">
                        <FileText className="h-6 w-6 text-accent" strokeWidth={1.75} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[14px] font-medium text-foreground">{file.name}</p>
                        {pageCount !== null && (
                          <p className="mt-0.5 text-[13px] text-accent font-medium">
                            {pageCount} {pageCount === 1 ? "page" : "pages"} available
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={removeFile}
                        className="rounded-lg p-2 text-muted-foreground/50 transition-colors hover:bg-white/[0.06] hover:text-muted-foreground focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:outline-none"
                        aria-label="Remove file"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    {/* Page range input */}
                    <div className="space-y-3">
                      <label className="text-[12px] font-medium text-muted-foreground px-1">
                        Pages to extract
                      </label>
                      <input
                        type="text"
                        value={pageRangeInput}
                        onChange={(e) => setPageRangeInput(e.target.value)}
                        placeholder={`e.g., 1, 3-5, 8 (1-${pageCount} available)`}
                        className={`w-full rounded-lg border px-4 py-3 text-[14px] text-foreground placeholder:text-muted-foreground/50 focus:outline-none transition-colors ${
                          parseResult.error
                            ? "border-red-500/50 bg-red-500/[0.05] focus:border-red-500/70 focus:ring-1 focus:ring-red-500/30"
                            : "border-white/[0.10] bg-[oklch(0.16_0.005_250)] focus:border-accent/40 focus:ring-1 focus:ring-accent/30"
                        }`}
                      />
                      
                      {/* Inline error message */}
                      {parseResult.error && (
                        <div className="flex items-start gap-2 px-1">
                          <AlertCircle className="h-4 w-4 text-red-400 mt-0.5 shrink-0" />
                          <p className="text-[12px] text-red-400">{parseResult.error}</p>
                        </div>
                      )}
                      
                      {/* Valid selection feedback */}
                      {!parseResult.error && parseResult.pages.length > 0 && (
                        <p className="text-[12px] text-accent px-1">
                          {parseResult.pages.length} {parseResult.pages.length === 1 ? "page" : "pages"} selected: {parseResult.pages.join(", ")}
                        </p>
                      )}
                      
                      {/* Help text when no input */}
                      {!pageRangeInput.trim() && (
                        <p className="text-[11px] text-muted-foreground/70 px-1">
                          Enter individual pages (1, 3, 5) or ranges (1-5). Separate with commas.
                        </p>
                      )}
                    </div>

                    {/* Options (collapsed by default) */}
                    <div className="border-t border-white/[0.06] pt-4">
                      <button
                        type="button"
                        onClick={() => setShowOptions(!showOptions)}
                        className="flex items-center gap-2 text-[12px] text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <ChevronDown className={`h-4 w-4 transition-transform ${showOptions ? "rotate-180" : ""}`} />
                        Options
                      </button>
                      
                      {showOptions && (
                        <div className="mt-4 rounded-lg bg-[oklch(0.16_0.005_250)] p-4 ring-1 ring-white/[0.06]">
                          <label className="flex items-start gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={extractAsSeparate}
                              onChange={(e) => setExtractAsSeparate(e.target.checked)}
                              className="mt-1 h-4 w-4 rounded border-white/[0.20] bg-transparent text-accent focus:ring-accent/50 focus:ring-offset-0"
                            />
                            <div>
                              <p className="text-[13px] font-medium text-foreground">Extract each page as a separate PDF</p>
                              <p className="mt-0.5 text-[12px] text-muted-foreground">
                                Creates {parseResult.pages.length || "multiple"} individual files instead of one combined PDF
                              </p>
                            </div>
                          </label>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Processing State */}
            {isProcessing && (
              <div className="mt-8 rounded-2xl bg-[oklch(0.14_0.005_250)] p-12 ring-1 ring-white/[0.06]">
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-8">
                    <div className="absolute -inset-4 rounded-2xl bg-accent/[0.04] blur-xl" />
                    <div className="relative flex h-16 w-16 items-center justify-center rounded-xl bg-accent/10 ring-1 ring-accent/20">
                      <FileText className="h-7 w-7 text-accent" strokeWidth={1.5} />
                    </div>
                  </div>
                  <p className="text-[16px] font-medium text-foreground">
                    Extracting pages locally...
                  </p>
                  <p className="mt-3 max-w-xs text-[14px] leading-relaxed text-muted-foreground">
                    Your files remain on this device. Nothing is being uploaded.
                  </p>
                </div>
              </div>
            )}

            {/* Primary CTA */}
            {file && results.length === 0 && !isProcessing && (
              <div className="mt-10">
                <Button
                  onClick={extractPages}
                  disabled={!isValidInput}
                  className="w-full h-14 text-[15px] font-semibold bg-accent hover:bg-accent/90 text-accent-foreground disabled:opacity-40 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-all"
                >
                  {extractAsSeparate 
                    ? `Extract ${parseResult.pages.length || 0} separate PDFs`
                    : `Extract ${parseResult.pages.length || 0} ${parseResult.pages.length === 1 ? "page" : "pages"}`
                  }
                </Button>
              </div>
            )}

            {/* Results */}
            {results.length > 0 && (
              <div className="mt-10 rounded-2xl bg-[oklch(0.14_0.005_250)] p-8 ring-1 ring-white/[0.08]">
                {/* Success header */}
                <div className="text-center">
                  <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-green-500/10 ring-1 ring-green-500/20">
                    <CheckCircle2 className="h-7 w-7 text-green-500" strokeWidth={1.75} />
                  </div>
                  <h2 className="text-[18px] font-semibold text-foreground">
                    Pages extracted
                  </h2>
                  <p className="mt-2 text-[14px] text-muted-foreground">
                    Processed locally. Ready to download.
                  </p>
                </div>

                {/* Page count summary */}
                <div className="mt-8 flex items-center justify-center gap-6 text-center">
                  <div>
                    <p className="text-[24px] font-semibold text-foreground">{pageCount}</p>
                    <p className="text-[12px] text-muted-foreground/70">Original pages</p>
                  </div>
                  <div className="h-8 w-px bg-white/[0.08]" />
                  <div>
                    <p className="text-[24px] font-semibold text-accent">
                      {results.reduce((sum, r) => sum + r.pageCount, 0)}
                    </p>
                    <p className="text-[12px] text-muted-foreground/70">Extracted pages</p>
                  </div>
                </div>

                {/* Download button(s) */}
                <div className="mt-8">
                  {results.length === 1 ? (
                    <a
                      href={results[0].url}
                      download={results[0].name}
                      className="flex items-center justify-center gap-3 w-full h-14 rounded-xl bg-accent text-accent-foreground text-[15px] font-semibold transition-all hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    >
                      <Download className="h-5 w-5" strokeWidth={2} />
                      Download PDF
                    </a>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-[12px] text-muted-foreground/60 text-center mb-4">
                        {results.length} files ready
                      </p>
                      {results.map((result, index) => (
                        <a
                          key={index}
                          href={result.url}
                          download={result.name}
                          className="flex items-center justify-between gap-4 rounded-xl bg-[oklch(0.165_0.006_250)] p-4 ring-1 ring-white/[0.06] transition-all hover:ring-accent/30 group"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/12 ring-1 ring-accent/20">
                              <FileText className="h-5 w-5 text-accent" strokeWidth={1.75} />
                            </div>
                            <div className="min-w-0 text-left">
                              <p className="truncate text-[13px] font-medium text-foreground">{result.name}</p>
                              <p className="text-[12px] text-muted-foreground">{result.pageRange}</p>
                            </div>
                          </div>
                          <Download className="h-5 w-5 text-muted-foreground group-hover:text-accent shrink-0 transition-colors" />
                        </a>
                      ))}
                    </div>
                  )}
                </div>

                {/* Secondary actions */}
                <div className="mt-10 pt-8 border-t border-white/[0.04]">
                  <div className="flex flex-col items-center gap-4">
                    <Button
                      variant="outline"
                      onClick={reset}
                      className="h-11 px-6 text-[13px] font-medium border-white/[0.10] bg-transparent hover:bg-[oklch(0.16_0.006_250)] hover:border-white/[0.16]"
                    >
                      Extract another PDF
                    </Button>
                    <Link
                      href="/pdf-tools/learn/online-vs-offline-pdf-tools"
                      className="text-[13px] text-muted-foreground/70 underline underline-offset-2 transition-colors hover:text-foreground"
                    >
                      Learn how offline processing works
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Other Tools */}
        <section className="px-4 py-12">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-[12px] text-muted-foreground/60 mb-4">Other tools</p>
            <div className="flex flex-wrap justify-center gap-2">
              <Link
                href="/pdf-tools/tools/merge-pdf"
                className="rounded-full bg-[oklch(0.14_0.004_250)] px-4 py-2 text-[13px] text-muted-foreground border border-white/[0.06] transition-colors hover:border-accent/25 hover:text-foreground"
              >
                Merge PDF
              </Link>
              <Link
                href="/pdf-tools/tools/split-pdf"
                className="rounded-full bg-[oklch(0.14_0.004_250)] px-4 py-2 text-[13px] text-muted-foreground border border-white/[0.06] transition-colors hover:border-accent/25 hover:text-foreground"
              >
                Split PDF
              </Link>
              <Link
                href="/pdf-tools/tools/compress-pdf"
                className="rounded-full bg-[oklch(0.14_0.004_250)] px-4 py-2 text-[13px] text-muted-foreground border border-white/[0.06] transition-colors hover:border-accent/25 hover:text-foreground"
              >
                Compress PDF
              </Link>
            </div>
          </div>
        </section>

        {/* Info section */}
        <section className="relative bg-[oklch(0.125_0.003_250)] px-4 py-16">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/15 to-transparent" />
          <div className="mx-auto max-w-3xl">
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              About page extraction
            </h2>
            <p className="mt-4 text-[14px] leading-relaxed text-muted-foreground">
              Extract specific pages from any PDF document without uploading your files. 
              Enter page numbers or ranges (like 1-5, 8, 10-12) to pull exactly the pages 
              you need. By default, selected pages are combined into a single new PDF. 
              Use the options menu to extract each page as a separate file instead.
            </p>
            <p className="mt-4 text-[14px] leading-relaxed text-muted-foreground">
              All processing happens locally in your browser using WebAssembly. Your files 
              are never uploaded to any server.
            </p>
          </div>
        </section>
      </main>

      <Footer />

      <style jsx global>{`
        @keyframes processing-pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        .processing-pulse {
          animation: processing-pulse 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}


