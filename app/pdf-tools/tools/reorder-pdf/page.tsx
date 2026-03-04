"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { PDFDocument } from "pdf-lib"
import { FileText, Download, ShieldCheck, CheckCircle2, X, GripVertical, ChevronDown, RotateCcw } from "lucide-react"
import Link from "next/link"
import Script from "next/script"
import { Button } from "@/components/legacy/ui/button"
import { getPdfJs as loadPdfJs } from "@/lib/pdfjs-loader"

const softwareAppJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Plain - Reorder PDF Pages",
  "applicationCategory": "UtilitiesApplication",
  "operatingSystem": "Web",
  "url": "https://plain.tools/tools/reorder-pdf",
  "description": "Reorder PDF pages offline in your browser. Drag and drop to rearrange pages. Files are processed locally and never uploaded.",
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
    { "@type": "ListItem", "position": 3, "name": "Reorder PDF", "item": "https://plain.tools/tools/reorder-pdf" }
  ]
}

interface PageThumbnail {
  originalIndex: number
  dataUrl: string
}

interface ReorderResult {
  name: string
  url: string
  pageCount: number
}

export default function ReorderPDFPage() {
  const [file, setFile] = useState<File | null>(null)
  const [pageCount, setPageCount] = useState<number | null>(null)
  const [isDraggingOver, setIsDraggingOver] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isLoadingThumbnails, setIsLoadingThumbnails] = useState(false)
  const [pages, setPages] = useState<PageThumbnail[]>([])
  const [pageOrder, setPageOrder] = useState<number[]>([])
  const [result, setResult] = useState<ReorderResult | null>(null)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const [showOptions, setShowOptions] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const pdfDataRef = useRef<ArrayBuffer | null>(null)

  const generateThumbnails = async (arrayBuffer: ArrayBuffer, numPages: number) => {
    setIsLoadingThumbnails(true)
    try {
      const pdfjsLib = await loadPdfJs()
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
      const thumbnails: PageThumbnail[] = []

      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i)
        const viewport = page.getViewport({ scale: 0.3 })
        
        const canvas = document.createElement("canvas")
        const context = canvas.getContext("2d")
        if (!context) continue

        canvas.height = viewport.height
        canvas.width = viewport.width

        await page.render({
          canvasContext: context,
          viewport: viewport,
        }).promise

        thumbnails.push({
          originalIndex: i - 1,
          dataUrl: canvas.toDataURL("image/jpeg", 0.7),
        })
      }

      setPages(thumbnails)
      setPageOrder(thumbnails.map((_, i) => i))
    } catch (error) {
      console.error("Error generating thumbnails:", error)
    } finally {
      setIsLoadingThumbnails(false)
    }
  }

  const handleFile = useCallback(async (newFile: File) => {
    if (newFile.type !== "application/pdf") return
    
    try {
      const arrayBuffer = await newFile.arrayBuffer()
      pdfDataRef.current = arrayBuffer
      
      const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true })
      const count = pdf.getPageCount()
      
      setFile(newFile)
      setPageCount(count)
      setResult(null)
      
      await generateThumbnails(arrayBuffer, count)
    } catch (error) {
      console.error("Error loading PDF:", error)
    }
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

  const removeFile = () => {
    setFile(null)
    setPageCount(null)
    setPages([])
    setPageOrder([])
    setResult(null)
    pdfDataRef.current = null
  }

  const reset = () => {
    removeFile()
  }

  // Page drag handlers
  const handlePageDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handlePageDragEnd = () => {
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  const handlePageDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex !== null && draggedIndex !== index) {
      setDragOverIndex(index)
    }
  }

  const handlePageDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === dropIndex) return

    const newOrder = [...pageOrder]
    const [draggedItem] = newOrder.splice(draggedIndex, 1)
    newOrder.splice(dropIndex, 0, draggedItem)
    
    setPageOrder(newOrder)
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  // Check if order has changed
  const hasOrderChanged = pageOrder.some((val, idx) => val !== idx)

  // Reset to original order
  const resetOrder = () => {
    setPageOrder(pages.map((_, i) => i))
  }

  // Reverse page order
  const reverseOrder = () => {
    setPageOrder([...pageOrder].reverse())
  }

  const handleReorder = async () => {
    if (!file || !pdfDataRef.current || !hasOrderChanged) return

    setIsProcessing(true)
    try {
      const sourcePdf = await PDFDocument.load(pdfDataRef.current, { ignoreEncryption: true })
      const newPdf = await PDFDocument.create()

      // Copy pages in new order
      for (const orderIndex of pageOrder) {
        const originalPageIndex = pages[orderIndex].originalIndex
        const [copiedPage] = await newPdf.copyPages(sourcePdf, [originalPageIndex])
        newPdf.addPage(copiedPage)
      }

      const pdfBytes = await newPdf.save()
      const blob = new Blob([pdfBytes], { type: "application/pdf" })
      const url = URL.createObjectURL(blob)

      const baseName = file.name.replace(/\.pdf$/i, "")
      
      setResult({
        name: `${baseName}-reordered.pdf`,
        url,
        pageCount: pageOrder.length,
      })
    } catch (error) {
      console.error("Error reordering PDF:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  // Cleanup URLs on unmount
  useEffect(() => {
    return () => {
      if (result?.url) {
        URL.revokeObjectURL(result.url)
      }
    }
  }, [result])

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground antialiased">
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
              Reorder PDF Pages
            </h1>
            <p className="mt-4 flex items-center justify-center gap-2.5 text-[15px] text-muted-foreground">
              <ShieldCheck className="h-5 w-5 text-accent" strokeWidth={1.75} />
              <span>Processed locally. <strong className="text-foreground/90">Files never leave your device.</strong></span>
            </p>
          </div>
        </section>

        {/* Main Tool Area */}
        <section className="px-4 py-10 md:py-14">
          <div className="mx-auto max-w-3xl">
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />

            {/* Drop Zone - visible when no result */}
            {!result && (
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
                            {pageCount} {pageCount === 1 ? "page" : "pages"}
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

                    {/* Loading thumbnails */}
                    {isLoadingThumbnails && (
                      <div className="py-12 text-center">
                        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-accent/30 border-t-accent" />
                        <p className="mt-4 text-[14px] text-muted-foreground">Loading pages...</p>
                      </div>
                    )}

                    {/* Page thumbnails grid */}
                    {!isLoadingThumbnails && pages.length > 0 && (
                      <div>
                        <div className="mb-4 flex items-center justify-between">
                          <p className="text-[12px] font-medium text-muted-foreground">
                            Drag pages to reorder
                          </p>
                          {hasOrderChanged && (
                            <button
                              type="button"
                              onClick={resetOrder}
                              className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[12px] text-muted-foreground/80 transition-colors hover:bg-white/[0.06] hover:text-foreground"
                            >
                              <RotateCcw className="h-3.5 w-3.5" />
                              Reset order
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
                          {pageOrder.map((pageIdx, orderIdx) => {
                            const page = pages[pageIdx]
                            return (
                              <div
                                key={`${pageIdx}-${orderIdx}`}
                                draggable
                                onDragStart={() => handlePageDragStart(orderIdx)}
                                onDragEnd={handlePageDragEnd}
                                onDragOver={(e) => handlePageDragOver(e, orderIdx)}
                                onDrop={(e) => handlePageDrop(e, orderIdx)}
                                className={`group relative cursor-grab rounded-lg border transition-all ${
                                  draggedIndex === orderIdx
                                    ? "opacity-50 border-accent/50 scale-95"
                                    : dragOverIndex === orderIdx
                                    ? "border-accent bg-accent/10"
                                    : "border-white/[0.08] bg-[oklch(0.16_0.005_250)] hover:border-accent/30"
                                } active:cursor-grabbing`}
                              >
                                {/* Drag handle */}
                                <div className="absolute top-1.5 left-1.5 z-10 rounded bg-black/50 p-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                                  <GripVertical className="h-3.5 w-3.5 text-white/70" />
                                </div>
                                
                                {/* Page number badge */}
                                <div className="absolute top-1.5 right-1.5 z-10 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white">
                                  {orderIdx + 1}
                                </div>
                                
                                {/* Thumbnail */}
                                <div className="aspect-[3/4] overflow-hidden rounded-lg p-1.5">
                                  <img
                                    src={page.dataUrl}
                                    alt={`Page ${page.originalIndex + 1}`}
                                    className="h-full w-full object-contain rounded"
                                    draggable={false}
                                  />
                                </div>
                                
                                {/* Original page indicator */}
                                {pageIdx !== orderIdx && (
                                  <p className="pb-1.5 text-center text-[9px] text-muted-foreground/60">
                                    was {page.originalIndex + 1}
                                  </p>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}

                    {/* Collapsible options */}
                    {pages.length > 0 && !isLoadingThumbnails && (
                      <div className="border-t border-white/[0.06] pt-4">
                        <button
                          type="button"
                          onClick={() => setShowOptions(!showOptions)}
                          className="flex w-full items-center justify-between py-2 text-[13px] text-muted-foreground/80 transition-colors hover:text-foreground"
                        >
                          <span>Options</span>
                          <ChevronDown className={`h-4 w-4 transition-transform ${showOptions ? "rotate-180" : ""}`} />
                        </button>
                        
                        {showOptions && (
                          <div className="mt-2 rounded-lg bg-[oklch(0.12_0.003_250)] p-4 space-y-3">
                            <button
                              type="button"
                              onClick={reverseOrder}
                              className="flex w-full items-center justify-between rounded-md px-3 py-2.5 text-[13px] text-foreground/90 transition-colors hover:bg-white/[0.06]"
                            >
                              <span>Reverse page order</span>
                              <span className="text-[11px] text-muted-foreground/60">Flip {pageCount} → 1</span>
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Reorder button */}
                    {pages.length > 0 && !isLoadingThumbnails && (
                      <Button
                        onClick={handleReorder}
                        disabled={!hasOrderChanged || isProcessing}
                        className="w-full h-14 text-[15px] font-semibold bg-accent text-accent-foreground hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isProcessing ? (
                          <span className="flex items-center gap-2">
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-accent-foreground/30 border-t-accent-foreground" />
                            Processing...
                          </span>
                        ) : !hasOrderChanged ? (
                          "Reorder pages to continue"
                        ) : (
                          "Save Reordered PDF"
                        )}
                      </Button>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Results */}
            {result && (
              <div className="mt-10 rounded-2xl bg-[oklch(0.14_0.005_250)] p-8 ring-1 ring-white/[0.08]">
                {/* Success header */}
                <div className="text-center">
                  <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-green-500/10 ring-1 ring-green-500/20">
                    <CheckCircle2 className="h-7 w-7 text-green-500" strokeWidth={1.75} />
                  </div>
                  <h2 className="text-[18px] font-semibold text-foreground">
                    Pages reordered
                  </h2>
                  <p className="mt-2 text-[14px] text-muted-foreground">
                    Processed locally. Ready to download.
                  </p>
                </div>

                {/* Page count */}
                <div className="mt-8 text-center">
                  <p className="text-[24px] font-semibold text-accent">{result.pageCount}</p>
                  <p className="text-[12px] text-muted-foreground/70">pages in new order</p>
                </div>

                {/* Download button */}
                <div className="mt-8">
                  <a
                    href={result.url}
                    download={result.name}
                    className="flex items-center justify-center gap-3 w-full h-14 rounded-xl bg-accent text-accent-foreground text-[15px] font-semibold transition-all hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    <Download className="h-5 w-5" strokeWidth={2} />
                    Download PDF
                  </a>
                </div>

                {/* Secondary actions */}
                <div className="mt-10 pt-8 border-t border-white/[0.04]">
                  <div className="flex flex-col items-center gap-4">
                    <Button
                      variant="outline"
                      onClick={reset}
                      className="h-11 px-6 text-[13px] font-medium border-white/[0.10] bg-transparent hover:bg-[oklch(0.16_0.006_250)] hover:border-white/[0.16]"
                    >
                      Reorder another PDF
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
                href="/pdf-tools/tools/extract-pdf"
                className="rounded-full bg-[oklch(0.14_0.004_250)] px-4 py-2 text-[13px] text-muted-foreground border border-white/[0.06] transition-colors hover:border-accent/25 hover:text-foreground"
              >
                Extract Pages
              </Link>
            </div>
          </div>
        </section>

        {/* Learn Section */}
        <section className="relative bg-[oklch(0.125_0.003_250)] px-4 py-16">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/15 to-transparent" />
          <div className="mx-auto max-w-3xl">
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              Learn more
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Link
                href="/pdf-tools/learn/how-plain-works"
                className="group rounded-xl border border-white/[0.06] bg-[oklch(0.16_0.006_250)] p-5 transition-all duration-200 hover:border-accent/25 hover:-translate-y-0.5"
              >
                <h3 className="text-[14px] font-semibold text-foreground group-hover:text-accent transition-colors">
                  How Plain Works
                </h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
                  Learn how client-side PDF processing protects your files.
                </p>
              </Link>
              <Link
                href="/pdf-tools/compare/offline-vs-online-pdf-tools"
                className="group rounded-xl border border-white/[0.06] bg-[oklch(0.16_0.006_250)] p-5 transition-all duration-200 hover:border-accent/25 hover:-translate-y-0.5"
              >
                <h3 className="text-[14px] font-semibold text-foreground group-hover:text-accent transition-colors">
                  Offline vs Online Tools
                </h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
                  Compare processing approaches for PDF tools.
                </p>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}



