"use client"

import { useState, useCallback, useRef } from "react"
import { PDFDocument } from "pdf-lib"
import { GripVertical, X, FileText, Download, Plus, ShieldCheck, CheckCircle2, Zap } from "lucide-react"
import Link from "next/link"
import Script from "next/script"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ShareButton } from "@/components/share-button"
import { PrivacyAudit } from "@/components/privacy-audit"
import { Button } from "@/components/ui/button"
import { mergeFilesWithBatchEngine, shouldUseParallelBatchProcessing } from "@/lib/pdf-batch-engine"

const softwareAppJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Plain - Merge PDF",
  "applicationCategory": "UtilitiesApplication",
  "operatingSystem": "Web",
  "url": "https://plain.tools/tools/merge-pdf",
  "description": "Merge PDF files offline in your browser. Files are processed locally and are never uploaded to a server.",
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
    { "@type": "ListItem", "position": 3, "name": "Merge PDF", "item": "https://plain.tools/tools/merge-pdf" }
  ]
}

interface PDFFile {
  id: string
  file: File
  name: string
  pageCount: number | null
}

export default function MergePDFPage() {
  const [files, setFiles] = useState<PDFFile[]>([])
  const [isDraggingOver, setIsDraggingOver] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [processingStatus, setProcessingStatus] = useState("Organising files locally.")
  const [hardwareAccelerationActive, setHardwareAccelerationActive] = useState(false)
  const [mergedPdfUrl, setMergedPdfUrl] = useState<string | null>(null)
  const [processingTime, setProcessingTime] = useState(0)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
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

  const addFiles = useCallback(async (newFiles: FileList | File[]) => {
    const pdfFiles = Array.from(newFiles).filter(
      (file) => file.type === "application/pdf"
    )

    const filesWithMeta = await Promise.all(
      pdfFiles.map(async (file) => ({
        id: crypto.randomUUID(),
        file,
        name: file.name,
        pageCount: await getPageCount(file),
      }))
    )

    setFiles((prev) => [...prev, ...filesWithMeta])
    setMergedPdfUrl(null)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDraggingOver(false)
      if (e.dataTransfer.files.length > 0) {
        addFiles(e.dataTransfer.files)
      }
    },
    [addFiles]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDraggingOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDraggingOver(false)
  }, [])

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id))
    setMergedPdfUrl(null)
  }

  const handleReorderDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleReorderDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return

    const newFiles = [...files]
    const [removed] = newFiles.splice(draggedIndex, 1)
    newFiles.splice(index, 0, removed)
    setFiles(newFiles)
    setDraggedIndex(index)
  }

  const handleReorderDragEnd = () => {
    setDraggedIndex(null)
  }

const mergePDFs = async () => {
  if (files.length < 2) return
  
  const startTime = performance.now()
  setIsProcessing(true)
  setProgress(0)
  setProcessingStatus("Initialising local merge engine.")
  
  try {
      const sourceFiles = files.map((entry) => entry.file)
      const shouldAccelerate = shouldUseParallelBatchProcessing(sourceFiles)
      setHardwareAccelerationActive(shouldAccelerate)
      setProcessingStatus(
        shouldAccelerate
          ? "Accelerating merge with parallel local workers."
          : "Organising merge locally in your browser."
      )

      const mergedPdfBytes = shouldAccelerate
        ? await mergeFilesWithBatchEngine(sourceFiles, (nextProgress, status) => {
            setProgress(nextProgress)
            setProcessingStatus(status)
          })
        : await (async () => {
            const mergedPdf = await PDFDocument.create()
            for (let i = 0; i < sourceFiles.length; i++) {
              const arrayBuffer = await sourceFiles[i].arrayBuffer()
              const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true })
              const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())
              pages.forEach((page) => mergedPdf.addPage(page))
              const nextProgress = Math.round(((i + 1) / sourceFiles.length) * 100)
              setProgress(nextProgress)
              setProcessingStatus(`Organising merge locally: file ${i + 1} of ${sourceFiles.length}.`)
            }

            return await mergedPdf.save({ useObjectStreams: true })
          })()

      const blob = new Blob([mergedPdfBytes], { type: "application/pdf" })
      const url = URL.createObjectURL(blob)
      setMergedPdfUrl(url)
      setProcessingTime(performance.now() - startTime)
  } catch (error) {
      console.error("Error merging PDFs:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const reset = () => {
    if (mergedPdfUrl) {
      URL.revokeObjectURL(mergedPdfUrl)
    }
    setFiles([])
    setMergedPdfUrl(null)
    setProgress(0)
    setProcessingStatus("Organising files locally.")
    setHardwareAccelerationActive(false)
  }

  return (
    <div className="flex min-h-screen w-full flex-col overflow-x-hidden bg-background">
      {/* Canonical URL for SEO */}
      <link rel="canonical" href="https://plainpdf.com/tools/merge-pdf" />
      
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
          {/* Bottom divider */}
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent/10 to-transparent" />
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-[28px] font-semibold tracking-tight text-foreground md:text-[32px]">
              Merge PDFs
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
              multiple
              className="hidden"
              onChange={(e) => e.target.files && addFiles(e.target.files)}
            />

            {/* Drop Zone - Always visible when no result */}
            {!mergedPdfUrl && (
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => files.length === 0 && fileInputRef.current?.click()}
                className={`relative rounded-2xl border-2 border-dashed transition-all duration-200 ${
                  isDraggingOver
                    ? "border-accent bg-accent/[0.06] shadow-[0_0_50px_-10px_oklch(0.62_0.21_250/0.35)]"
                    : files.length > 0 
                      ? "border-white/[0.08] bg-[oklch(0.14_0.005_250)]" 
                      : "border-white/[0.10] bg-[oklch(0.14_0.005_250)] hover:border-accent/30 hover:bg-[oklch(0.145_0.005_250)] cursor-pointer"
                } ${files.length > 0 ? "p-6" : "p-14 md:p-20"}`}
              >
                {/* Empty state - large friendly drop zone */}
                {files.length === 0 && (
                  <div className="flex flex-col items-center text-center">
                    {/* Icon with soft glow */}
                    <div className="relative mb-8">
                      <div className="absolute -inset-5 rounded-3xl bg-accent/[0.08] blur-2xl" />
                      <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl bg-accent/12 ring-1 ring-accent/25">
                        <FileText className="h-12 w-12 text-accent" strokeWidth={1.5} />
                      </div>
                    </div>
                    <p className="text-[18px] font-semibold text-foreground">
                      Drop PDF files here
                    </p>
                    <p className="mt-3 max-w-sm text-[14px] leading-relaxed text-muted-foreground">
                      Drag and drop your files, or click anywhere in this area to browse
                    </p>
                    <Button
                      variant="outline"
                      className="mt-8 h-12 px-10 text-[14px] font-medium border-white/[0.12] bg-[oklch(0.16_0.006_250)] hover:bg-[oklch(0.18_0.007_250)] hover:border-white/[0.18] focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                      onClick={(e) => {
                        e.stopPropagation()
                        fileInputRef.current?.click()
                      }}
                    >
                      Select files
                    </Button>
                  </div>
                )}

                {/* File List */}
                {files.length > 0 && (
                  <div className="space-y-3">
                    {/* File count header */}
                    <div className="flex items-center justify-between px-1 pb-1">
                      <span className="text-[12px] font-medium text-muted-foreground">
                        {files.length} {files.length === 1 ? "file" : "files"} selected
                      </span>
                      <span className="text-[11px] text-muted-foreground/70">
                        Drag to reorder
                      </span>
                    </div>
                    
                    {files.map((file, index) => (
                      <div
                        key={file.id}
                        draggable
                        onDragStart={() => handleReorderDragStart(index)}
                        onDragOver={(e) => handleReorderDragOver(e, index)}
                        onDragEnd={handleReorderDragEnd}
                        className={`group flex items-center gap-4 rounded-xl bg-[oklch(0.165_0.006_250)] p-4 ring-1 ring-white/[0.06] transition-all duration-150 ${
                          draggedIndex === index 
                            ? "opacity-50 scale-[0.98]" 
                            : "opacity-100 hover:ring-accent/25 hover:bg-[oklch(0.17_0.007_250)]"
                        }`}
                      >
                        {/* Drag handle */}
                        <button
                          type="button"
                          className="cursor-grab rounded-lg p-2 text-muted-foreground/60 transition-colors hover:bg-white/[0.06] hover:text-muted-foreground active:cursor-grabbing focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:outline-none"
                          aria-label="Drag to reorder"
                        >
                          <GripVertical className="h-4.5 w-4.5" />
                        </button>
                        
                        {/* File icon */}
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/12 ring-1 ring-accent/20">
                          <FileText className="h-5 w-5 text-accent" strokeWidth={1.75} />
                        </div>
                        
                        {/* File info */}
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[14px] font-medium text-foreground">{file.name}</p>
                          {file.pageCount !== null && (
                            <p className="mt-0.5 text-[12px] text-muted-foreground">
                              {file.pageCount} {file.pageCount === 1 ? "page" : "pages"}
                            </p>
                          )}
                        </div>
                        
                        {/* Remove button */}
                        <button
                          type="button"
                          onClick={() => removeFile(file.id)}
                          className="rounded-lg p-2 text-muted-foreground/50 transition-colors hover:bg-white/[0.06] hover:text-muted-foreground focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:outline-none"
                          aria-label="Remove file"
                        >
                          <X className="h-4.5 w-4.5" />
                        </button>
                      </div>
                    ))}

                    {/* Add more files button */}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-dashed border-white/[0.10] p-5 text-[14px] font-medium text-muted-foreground/80 transition-all duration-150 hover:border-accent/25 hover:bg-[oklch(0.16_0.006_250)] hover:text-muted-foreground focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:outline-none"
                    >
                      <Plus className="h-4.5 w-4.5" />
                      Add more files
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Processing State - calm, text-based feedback */}
            {isProcessing && (
              <div className="mt-8 rounded-2xl bg-[oklch(0.14_0.005_250)] p-12 ring-1 ring-white/[0.06]">
                <div className="flex flex-col items-center text-center">
                  {hardwareAccelerationActive && (
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#0070f3]/35 bg-[#0070f3]/12 px-3 py-1.5">
                      <Zap className="h-3.5 w-3.5 text-[#0070f3]" strokeWidth={2} />
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-[#7ab8ff]">
                        Hardware Acceleration: Active
                      </span>
                    </div>
                  )}
                  {/* Subtle breathing indicator */}
                  <div className="relative mb-8">
                    <div className="absolute -inset-4 rounded-2xl bg-accent/[0.04] blur-xl processing-pulse" />
                    <div className="relative flex h-16 w-16 items-center justify-center rounded-xl bg-accent/10 ring-1 ring-accent/20">
                      <FileText className="h-7 w-7 text-accent" strokeWidth={1.5} />
                    </div>
                  </div>
                  <p className="text-[16px] font-medium text-foreground">
                    {processingStatus}
                  </p>
                  <p className="mt-3 max-w-xs text-[14px] leading-relaxed text-muted-foreground">
                    Your files remain on this device. Nothing is being uploaded.
                  </p>
                  <p className="mt-2 text-[12px] text-muted-foreground/70">
                    {progress}% complete
                  </p>
                </div>
              </div>
            )}

            {/* Primary CTA */}
            {files.length > 0 && !mergedPdfUrl && !isProcessing && (
              <div className="mt-10">
                <Button
                  size="lg"
                  className={`w-full h-14 text-[16px] font-semibold tracking-[-0.01em] transition-all duration-200 ${
                    files.length >= 2
                      ? "btn-premium text-accent-foreground"
                      : "bg-[oklch(0.16_0.004_250)] text-muted-foreground/50 cursor-not-allowed border border-white/[0.05]"
                  }`}
                  onClick={mergePDFs}
                  disabled={files.length < 2}
                >
                  Merge {files.length} {files.length === 1 ? "PDF" : "PDFs"}
                </Button>
                {files.length < 2 && (
                  <p className="mt-4 text-center text-[13px] text-muted-foreground">
                    Add at least 2 files to merge them together
                  </p>
                )}
              </div>
            )}

            {/* Success State - Privacy Audit Card */}
            {mergedPdfUrl && (
              <div className="space-y-6">
                {/* Privacy Audit Component */}
                <PrivacyAudit
                  toolName="Merge PDF"
                  fileName={`merged-${files.length}-files.pdf`}
                  fileSize={`${files.reduce((acc, f) => acc + f.file.size, 0) / 1024 / 1024 > 1 
                    ? (files.reduce((acc, f) => acc + f.file.size, 0) / 1024 / 1024).toFixed(2) + " MB"
                    : (files.reduce((acc, f) => acc + f.file.size, 0) / 1024).toFixed(0) + " KB"
                  }`}
                  processingTime={processingTime}
                  onDownload={() => {
                    const a = document.createElement("a")
                    a.href = mergedPdfUrl
                    a.download = "merged.pdf"
                    a.click()
                  }}
                />
                
                {/* Secondary actions */}
                <div className="flex flex-col items-center gap-4 rounded-xl border border-[#222] bg-[#0a0a0a] p-6">
                  <button
                    type="button"
                    onClick={reset}
                    className="text-[14px] text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 rounded-md px-4 py-2"
                  >
                    Merge another PDF
                  </button>
                  
                  {/* Learn more links */}
                  <div className="flex flex-wrap justify-center gap-3 border-t border-white/[0.04] pt-4">
                    <Link
                      href="/learn/what-is-a-pdf"
                      className="text-[12px] text-muted-foreground/60 underline underline-offset-2 transition-colors hover:text-foreground"
                    >
                      How PDFs work
                    </Link>
                    <span className="text-muted-foreground/30">|</span>
                    <Link
                      href="/compare/offline-vs-online-pdf-tools"
                      className="text-[12px] text-muted-foreground/60 underline underline-offset-2 transition-colors hover:text-foreground"
                    >
                      Offline processing benefits
                    </Link>
                  </div>
                  
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
                <h3 className="text-[14px] font-semibold text-foreground">Add your files</h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground/80">
                  Drop or select the PDF files you want to merge. Drag to reorder them.
                </p>
              </div>
              <div className="flex flex-col">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 ring-1 ring-accent/20 text-sm font-bold text-accent">
                  2
                </div>
                <h3 className="text-[14px] font-semibold text-foreground">Process locally</h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground/80">
                  Files are combined in your browser using client-side technology. Nothing leaves your device.
                </p>
              </div>
              <div className="flex flex-col">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 ring-1 ring-accent/20 text-sm font-bold text-accent">
                  3
                </div>
                <h3 className="text-[14px] font-semibold text-foreground">Download result</h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground/80">
                  Your merged PDF is ready to download instantly. No waiting for uploads or server processing.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Privacy Note */}
        <section className="relative px-4 py-16">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
          <div className="mx-auto max-w-3xl">
            <div className="rounded-xl border border-accent/10 bg-[oklch(0.17_0.007_250)] p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/12 ring-1 ring-accent/20">
                  <ShieldCheck className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h2 className="font-semibold text-foreground">Privacy by design</h2>
                  <ul className="mt-3 space-y-2 text-[13px] text-muted-foreground/80">
                    <li>All processing happens locally in your browser</li>
                    <li>Files are never uploaded to any server</li>
                    <li>No server interaction after page load</li>
                    <li>Works offline once opened</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Other Tools */}
        <section className="px-4 py-12">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-[12px] text-muted-foreground/60 mb-4">Other tools</p>
            <div className="flex flex-wrap justify-center gap-2">
              <Link
                href="/tools/split-pdf"
                className="rounded-full bg-[oklch(0.14_0.004_250)] px-4 py-2 text-[13px] text-muted-foreground border border-white/[0.06] transition-colors hover:border-accent/25 hover:text-foreground"
              >
                Split PDF
              </Link>
              <Link
                href="/tools/extract-pdf"
                className="rounded-full bg-[oklch(0.14_0.004_250)] px-4 py-2 text-[13px] text-muted-foreground border border-white/[0.06] transition-colors hover:border-accent/25 hover:text-foreground"
              >
                Extract Pages
              </Link>
              <Link
                href="/tools/compress-pdf"
                className="rounded-full bg-[oklch(0.14_0.004_250)] px-4 py-2 text-[13px] text-muted-foreground border border-white/[0.06] transition-colors hover:border-accent/25 hover:text-foreground"
              >
                Compress PDF
              </Link>
            </div>
          </div>
        </section>

        {/* Related Learning Links */}
        <section className="relative bg-[oklch(0.125_0.003_250)] px-4 py-16">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/15 to-transparent" />
          <div className="mx-auto max-w-3xl">
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              Learn more
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Link
                href="/learn/how-plain-works"
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
                href="/learn/online-vs-offline-pdf-tools"
                className="group rounded-xl border border-white/[0.06] bg-[oklch(0.16_0.006_250)] p-5 transition-all duration-200 hover:border-accent/25 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
              >
                <h3 className="text-[14px] font-semibold text-foreground group-hover:text-accent transition-colors">
                  Online vs Offline PDF Tools
                </h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
                  Compare browser-based tools with traditional upload services.
                </p>
              </Link>
            </div>
          </div>
        </section>

        {/* SEO Content */}
        <section className="relative px-4 py-12">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />
          <div className="mx-auto max-w-3xl">
            <h2 className="text-lg font-medium text-foreground">
              Merge PDF Files Without Uploading
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Plain lets you merge PDF files offline without uploading them to any server.
              All files are processed locally in your browser using modern client-side
              technology. This makes Plain ideal for confidential documents and professional
              use.
            </p>
          </div>
        </section>
      </main>

      <div className="mt-auto w-full">
        <Footer />
      </div>
    </div>
  )
}
