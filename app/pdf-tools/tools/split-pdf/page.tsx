"use client"

import { useState, useCallback, useRef } from "react"
import { PDFDocument } from "pdf-lib"
import { FileText, Download, ShieldCheck, CheckCircle2, X, ChevronDown } from "lucide-react"
import Link from "next/link"
import Script from "next/script"
import { Button } from "@/components/legacy/ui/button"
import { ShareButton } from "@/components/legacy/share-button"

const softwareAppJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Plain - Split PDF",
  "applicationCategory": "UtilitiesApplication",
  "operatingSystem": "Web",
  "url": "https://plain.tools/tools/split-pdf",
  "description": "Split PDF files offline in your browser. Extract pages, split by ranges, or separate into individual pages. Files are processed locally and never uploaded.",
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
    { "@type": "ListItem", "position": 3, "name": "Split PDF", "item": "https://plain.tools/tools/split-pdf" }
  ]
}

type SplitMode = "extract" | "ranges" | "individual"

interface SplitResult {
  name: string
  url: string
  pageCount: number
  pageRange: string
}

export default function SplitPDFPage() {
  const [file, setFile] = useState<File | null>(null)
  const [pageCount, setPageCount] = useState<number | null>(null)
  const [isDraggingOver, setIsDraggingOver] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [splitMode, setSplitMode] = useState<SplitMode>("extract")
  const [selectedPages, setSelectedPages] = useState<number[]>([])
  const [pageRanges, setPageRanges] = useState("")
  const [results, setResults] = useState<SplitResult[]>([])
  const [showAdvanced, setShowAdvanced] = useState(false)
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
    setSelectedPages([])
    setPageRanges("")
    setResults([])
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

  const togglePage = (page: number) => {
    setSelectedPages(prev => 
      prev.includes(page) 
        ? prev.filter(p => p !== page)
        : [...prev, page].sort((a, b) => a - b)
    )
  }

  const parsePageRanges = (input: string, maxPages: number): number[][] => {
    const ranges: number[][] = []
    const parts = input.split(",").map(s => s.trim()).filter(Boolean)
    
    for (const part of parts) {
      if (part.includes("-")) {
        const [start, end] = part.split("-").map(s => parseInt(s.trim(), 10))
        if (!isNaN(start) && !isNaN(end) && start >= 1 && end <= maxPages && start <= end) {
          ranges.push(Array.from({ length: end - start + 1 }, (_, i) => start + i))
        }
      } else {
        const page = parseInt(part, 10)
        if (!isNaN(page) && page >= 1 && page <= maxPages) {
          ranges.push([page])
        }
      }
    }
    return ranges
  }

  const isValidInput = (): boolean => {
    if (!file || !pageCount) return false
    
    switch (splitMode) {
      case "extract":
        return selectedPages.length > 0
      case "ranges":
        return parsePageRanges(pageRanges, pageCount).length > 0
      case "individual":
        return pageCount > 0
      default:
        return false
    }
  }

  const splitPDF = async () => {
    if (!file || !pageCount || !isValidInput()) return

    setIsProcessing(true)
    const newResults: SplitResult[] = []

    try {
      const arrayBuffer = await file.arrayBuffer()
      const sourcePdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true })
      const baseName = file.name.replace(/\.pdf$/i, "")

      if (splitMode === "extract") {
        // Extract selected pages into one PDF
        const newPdf = await PDFDocument.create()
        const pages = await newPdf.copyPages(sourcePdf, selectedPages.map(p => p - 1))
        pages.forEach(page => newPdf.addPage(page))
        
        const pdfBytes = await newPdf.save()
        const blob = new Blob([pdfBytes], { type: "application/pdf" })
        const url = URL.createObjectURL(blob)
        
        const pageRangeLabel = selectedPages.length === 1 
          ? `Page ${selectedPages[0]}`
          : `Pages ${selectedPages[0]}-${selectedPages[selectedPages.length - 1]}`
        
        newResults.push({
          name: `${baseName}_pages_${selectedPages.join("-")}.pdf`,
          url,
          pageCount: selectedPages.length,
          pageRange: pageRangeLabel
        })
      } else if (splitMode === "ranges") {
        // Split by page ranges
        const ranges = parsePageRanges(pageRanges, pageCount)
        
        for (let i = 0; i < ranges.length; i++) {
          const range = ranges[i]
          const newPdf = await PDFDocument.create()
          const pages = await newPdf.copyPages(sourcePdf, range.map(p => p - 1))
          pages.forEach(page => newPdf.addPage(page))
          
          const pdfBytes = await newPdf.save()
          const blob = new Blob([pdfBytes], { type: "application/pdf" })
          const url = URL.createObjectURL(blob)
          
          const rangeLabel = range.length === 1 ? `page_${range[0]}` : `pages_${range[0]}-${range[range.length - 1]}`
          const pageRangeDisplay = range.length === 1 ? `Page ${range[0]}` : `Pages ${range[0]}-${range[range.length - 1]}`
          
          newResults.push({
            name: `${baseName}_${rangeLabel}.pdf`,
            url,
            pageCount: range.length,
            pageRange: pageRangeDisplay
          })
        }
      } else if (splitMode === "individual") {
        // Split into individual pages
        for (let i = 0; i < pageCount; i++) {
          const newPdf = await PDFDocument.create()
          const [page] = await newPdf.copyPages(sourcePdf, [i])
          newPdf.addPage(page)
          
          const pdfBytes = await newPdf.save()
          const blob = new Blob([pdfBytes], { type: "application/pdf" })
          const url = URL.createObjectURL(blob)
          
          newResults.push({
            name: `${baseName}_page_${i + 1}.pdf`,
            url,
            pageCount: 1,
            pageRange: `Page ${i + 1}`
          })
        }
      }

      setResults(newResults)
    } catch (error) {
      console.error("Error splitting PDF:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const reset = () => {
    results.forEach(r => URL.revokeObjectURL(r.url))
    setFile(null)
    setPageCount(null)
    setSelectedPages([])
    setPageRanges("")
    setResults([])
    setSplitMode("extract")
  }

  const removeFile = () => {
    setFile(null)
    setPageCount(null)
    setSelectedPages([])
    setPageRanges("")
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
      <main className="flex-1">
        {/* Tool Header */}
        <section className="relative bg-[oklch(0.12_0.004_250)] px-4 pt-20 pb-10">
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent/10 to-transparent" />
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-[28px] font-semibold tracking-tight text-foreground md:text-[32px]">
              Split PDF
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
                            {pageCount} {pageCount === 1 ? "page" : "pages"} detected
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

                    {/* Split mode selection */}
                    <div className="space-y-3">
                      <p className="text-[12px] font-medium text-muted-foreground px-1">
                        How would you like to split?
                      </p>
                      <div className="grid gap-2">
                        <button
                          type="button"
                          onClick={() => setSplitMode("extract")}
                          className={`flex items-start gap-3 rounded-lg p-4 text-left transition-all ${
                            splitMode === "extract"
                              ? "bg-accent/10 ring-1 ring-accent/30"
                              : "bg-[oklch(0.16_0.005_250)] ring-1 ring-white/[0.06] hover:ring-white/[0.10]"
                          }`}
                        >
                          <div className={`mt-0.5 h-4 w-4 rounded-full border-2 flex items-center justify-center ${
                            splitMode === "extract" ? "border-accent" : "border-muted-foreground/40"
                          }`}>
                            {splitMode === "extract" && <div className="h-2 w-2 rounded-full bg-accent" />}
                          </div>
                          <div>
                            <p className="text-[14px] font-medium text-foreground">Extract specific pages</p>
                            <p className="mt-0.5 text-[12px] text-muted-foreground">Select individual pages to extract into a new PDF</p>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => { setSplitMode("ranges"); setShowAdvanced(true); }}
                          className={`flex items-start gap-3 rounded-lg p-4 text-left transition-all ${
                            splitMode === "ranges"
                              ? "bg-accent/10 ring-1 ring-accent/30"
                              : "bg-[oklch(0.16_0.005_250)] ring-1 ring-white/[0.06] hover:ring-white/[0.10]"
                          }`}
                        >
                          <div className={`mt-0.5 h-4 w-4 rounded-full border-2 flex items-center justify-center ${
                            splitMode === "ranges" ? "border-accent" : "border-muted-foreground/40"
                          }`}>
                            {splitMode === "ranges" && <div className="h-2 w-2 rounded-full bg-accent" />}
                          </div>
                          <div>
                            <p className="text-[14px] font-medium text-foreground">Split by page ranges</p>
                            <p className="mt-0.5 text-[12px] text-muted-foreground">Define ranges like 1-3, 4-6 to create multiple PDFs</p>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => { setSplitMode("individual"); setShowAdvanced(true); }}
                          className={`flex items-start gap-3 rounded-lg p-4 text-left transition-all ${
                            splitMode === "individual"
                              ? "bg-accent/10 ring-1 ring-accent/30"
                              : "bg-[oklch(0.16_0.005_250)] ring-1 ring-white/[0.06] hover:ring-white/[0.10]"
                          }`}
                        >
                          <div className={`mt-0.5 h-4 w-4 rounded-full border-2 flex items-center justify-center ${
                            splitMode === "individual" ? "border-accent" : "border-muted-foreground/40"
                          }`}>
                            {splitMode === "individual" && <div className="h-2 w-2 rounded-full bg-accent" />}
                          </div>
                          <div>
                            <p className="text-[14px] font-medium text-foreground">Split into individual pages</p>
                            <p className="mt-0.5 text-[12px] text-muted-foreground">Create a separate PDF for each page</p>
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* Page selection for extract mode */}
                    {splitMode === "extract" && pageCount && (
                      <div className="space-y-3">
                        <p className="text-[12px] font-medium text-muted-foreground px-1">
                          Select pages to extract {selectedPages.length > 0 && `(${selectedPages.length} selected)`}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {Array.from({ length: pageCount }, (_, i) => i + 1).map(page => (
                            <button
                              key={page}
                              type="button"
                              onClick={() => togglePage(page)}
                              className={`h-10 w-10 rounded-lg text-[13px] font-medium transition-all ${
                                selectedPages.includes(page)
                                  ? "bg-accent text-accent-foreground"
                                  : "bg-[oklch(0.16_0.005_250)] text-muted-foreground ring-1 ring-white/[0.06] hover:ring-accent/30 hover:text-foreground"
                              }`}
                            >
                              {page}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Page ranges input */}
                    {splitMode === "ranges" && pageCount && (
                      <div className="space-y-3">
                        <p className="text-[12px] font-medium text-muted-foreground px-1">
                          Enter page ranges (e.g., 1-3, 4-6, 7)
                        </p>
                        <input
                          type="text"
                          value={pageRanges}
                          onChange={(e) => setPageRanges(e.target.value)}
                          placeholder="1-3, 4-6, 7-10"
                          className="w-full rounded-lg border border-white/[0.10] bg-[oklch(0.16_0.005_250)] px-4 py-3 text-[14px] text-foreground placeholder:text-muted-foreground/50 focus:border-accent/40 focus:outline-none focus:ring-1 focus:ring-accent/30 transition-colors"
                        />
                        <p className="text-[11px] text-muted-foreground/70 px-1">
                          Each range creates a separate PDF. Pages 1-{pageCount} available.
                        </p>
                      </div>
                    )}

                    {/* Individual pages info */}
                    {splitMode === "individual" && pageCount && (
                      <div className="rounded-lg bg-[oklch(0.16_0.005_250)] p-4 ring-1 ring-white/[0.06]">
                        <p className="text-[13px] text-muted-foreground">
                          This will create <strong className="text-foreground">{pageCount} separate PDF files</strong>, one for each page.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Processing State */}
            {isProcessing && (
              <div className="mt-8 rounded-2xl bg-[oklch(0.14_0.005_250)] p-12 ring-1 ring-white/[0.06]">
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-8">
                    <div className="absolute -inset-4 rounded-2xl bg-accent/[0.04] blur-xl processing-pulse" />
                    <div className="relative flex h-16 w-16 items-center justify-center rounded-xl bg-accent/10 ring-1 ring-accent/20">
                      <FileText className="h-7 w-7 text-accent" strokeWidth={1.5} />
                    </div>
                  </div>
                  <p className="text-[16px] font-medium text-foreground">
                    Processing locally in your browser...
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
                  size="lg"
                  className={`w-full h-14 text-[16px] font-semibold tracking-[-0.01em] transition-all duration-200 ${
                    isValidInput()
                      ? "btn-premium text-accent-foreground"
                      : "bg-[oklch(0.16_0.004_250)] text-muted-foreground/50 cursor-not-allowed border border-white/[0.05]"
                  }`}
                  onClick={splitPDF}
                  disabled={!isValidInput()}
                >
                  Split PDF
                </Button>
                {!isValidInput() && (
                  <p className="mt-4 text-center text-[13px] text-muted-foreground">
                    {splitMode === "extract" && "Select at least one page to extract"}
                    {splitMode === "ranges" && "Enter valid page ranges to split"}
                    {splitMode === "individual" && "Ready to split into individual pages"}
                  </p>
                )}
              </div>
            )}

            {/* Success State - calm, technical, trustworthy */}
            {results.length > 0 && (
              <div className="rounded-2xl bg-[oklch(0.14_0.005_250)] p-10 ring-1 ring-white/[0.06]">
                {/* Success header */}
                <div className="text-center mb-8">
                  <div className="relative mx-auto mb-6 w-fit">
                    <div className="absolute -inset-4 rounded-2xl bg-green-500/[0.06] blur-xl" />
                    <div className="relative flex h-14 w-14 items-center justify-center rounded-xl bg-green-500/10 ring-1 ring-green-500/25">
                      <CheckCircle2 className="h-7 w-7 text-green-500" strokeWidth={1.5} />
                    </div>
                  </div>
                  <h2 className="text-[18px] font-semibold text-foreground">
                    {results.length === 1 ? "Your PDF is ready" : `${results.length} files created`}
                  </h2>
                  <p className="mt-2 text-[14px] text-muted-foreground">
                    Processed locally. Click each file to download.
                  </p>
                </div>

                {/* Generated files list */}
                <div className="space-y-2">
                  <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/60 px-1 mb-3">
                    Generated files
                  </p>
                  {results.map((result, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 rounded-lg bg-[oklch(0.155_0.005_250)] p-4 border border-white/[0.08]"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 ring-1 ring-accent/20">
                        <FileText className="h-5 w-5 text-accent" strokeWidth={1.75} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[14px] font-medium text-foreground">{result.name}</p>
                        <p className="mt-0.5 text-[12px] text-muted-foreground">
                          {result.pageRange}
                        </p>
                      </div>
                      <a
                        href={result.url}
                        download={result.name}
                        className="flex items-center gap-2 rounded-md bg-[oklch(0.18_0.006_250)] px-4 py-2 text-[13px] font-medium text-foreground border border-white/[0.10] transition-colors hover:border-accent/30 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
                      >
                        <Download className="h-4 w-4" strokeWidth={1.75} />
                        Download
                      </a>
                    </div>
                  ))}
                </div>

                {/* Secondary action */}
                <div className="mt-10 text-center">
                  <button
                    type="button"
                    onClick={reset}
                    className="text-[14px] text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 rounded-md px-4 py-2"
                  >
                    Split another PDF
                  </button>
                </div>

                {/* Learn more links */}
                <div className="mt-10 border-t border-white/[0.04] pt-8 text-center">
                  <p className="mb-4 text-[13px] text-muted-foreground">
                    Want to learn how PDFs work?
                  </p>
                  <div className="flex flex-wrap justify-center gap-3">
                    <Link
                      href="/pdf-tools/learn/what-is-a-pdf"
                      className="text-[13px] text-muted-foreground/80 underline underline-offset-2 transition-colors hover:text-foreground"
                    >
                      How PDFs work
                    </Link>
                    <span className="text-muted-foreground/40">|</span>
                    <Link
                      href="/pdf-tools/compare/offline-vs-online-pdf-tools"
                      className="text-[13px] text-muted-foreground/80 underline underline-offset-2 transition-colors hover:text-foreground"
                    >
                      Learn more about offline processing
                    </Link>
                  </div>
                </div>

                {/* Subtle share option */}
                <div className="mt-8 border-t border-white/[0.04] pt-8">
                  <ShareButton variant="subtle" />
                </div>
              </div>
            )}
          </div>
        </section>

        {/* How It Works */}
        <section className="relative bg-[oklch(0.135_0.004_250)] px-4 py-16">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/15 to-transparent" />
          <div className="mx-auto max-w-3xl">
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              How it works
            </h2>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              <div className="flex flex-col">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 ring-1 ring-accent/20 text-sm font-bold text-accent">
                  1
                </div>
                <h3 className="text-[14px] font-semibold text-foreground">Add your file</h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground/80">
                  Drop or select the PDF file you want to split. Page count is detected automatically.
                </p>
              </div>
              <div className="flex flex-col">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 ring-1 ring-accent/20 text-sm font-bold text-accent">
                  2
                </div>
                <h3 className="text-[14px] font-semibold text-foreground">Choose how to split</h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground/80">
                  Extract specific pages, split by ranges, or separate into individual pages.
                </p>
              </div>
              <div className="flex flex-col">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 ring-1 ring-accent/20 text-sm font-bold text-accent">
                  3
                </div>
                <h3 className="text-[14px] font-semibold text-foreground">Download results</h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground/80">
                  Your new PDFs are created locally and ready to download instantly.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Learn More Links */}
        <section className="px-4 py-12">
          <div className="mx-auto max-w-2xl">
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Link
                href="/pdf-tools/learn/how-plain-works"
                className="group rounded-xl border border-white/[0.06] bg-[oklch(0.16_0.006_250)] p-5 transition-all duration-200 hover:border-accent/25 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
              >
                <h3 className="text-[14px] font-semibold text-foreground group-hover:text-accent transition-colors">
                  How Plain Works
                </h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
                  Understand the client-side architecture that keeps your files private.
                </p>
              </Link>
              <Link
                href="/pdf-tools/tools/compress-pdf"
                className="group rounded-xl border border-white/[0.06] bg-[oklch(0.16_0.006_250)] p-5 transition-all duration-200 hover:border-accent/25 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
              >
                <h3 className="text-[14px] font-semibold text-foreground group-hover:text-accent transition-colors">
                  Compress PDF
                </h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
                  Reduce file size locally in your browser.
                </p>
              </Link>
            </div>
            <div className="mt-4 text-center">
              <Link
                href="/pdf-tools/tools/merge-pdf"
                className="text-[13px] text-muted-foreground/70 hover:text-foreground transition-colors"
              >
                Also available: Merge PDF
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}



