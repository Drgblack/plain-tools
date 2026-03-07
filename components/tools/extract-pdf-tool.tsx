"use client"

import { useCallback, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { AlertCircle, CheckCircle2, ChevronDown, Download, FileText, X } from "lucide-react"
import { PDFDocument } from "pdf-lib"

import { ProcessedLocallyBadge } from "@/components/tools/processed-locally-badge"
import { Button } from "@/components/ui/button"
import { notifyLocalDownloadSuccess } from "@/lib/local-download-events"

interface ExtractionResult {
  name: string
  url: string
  pageCount: number
  pageRange: string
}

export default function ExtractPdfTool() {
  const [file, setFile] = useState<File | null>(null)
  const [pageCount, setPageCount] = useState<number | null>(null)
  const [isDraggingOver, setIsDraggingOver] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [pageRangeInput, setPageRangeInput] = useState("")
  const [extractAsSeparate, setExtractAsSeparate] = useState(false)
  const [showOptions, setShowOptions] = useState(false)
  const [results, setResults] = useState<ExtractionResult[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const getPageCount = async (inputFile: File): Promise<number | null> => {
    try {
      const arrayBuffer = await inputFile.arrayBuffer()
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
    (event: React.DragEvent) => {
      event.preventDefault()
      setIsDraggingOver(false)
      if (event.dataTransfer.files.length > 0) {
        void handleFile(event.dataTransfer.files[0])
      }
    },
    [handleFile]
  )

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    setIsDraggingOver(true)
  }, [])

  const handleDragLeave = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    setIsDraggingOver(false)
  }, [])

  const parseResult = useMemo(() => {
    if (!pageRangeInput.trim() || !pageCount) {
      return { pages: [] as number[], error: null as string | null }
    }

    const pages: number[] = []
    const errors: string[] = []
    const parts = pageRangeInput.split(",").map((part) => part.trim()).filter(Boolean)

    for (const part of parts) {
      if (part.includes("-")) {
        const [startStr, endStr] = part.split("-").map((value) => value.trim())
        const start = Number.parseInt(startStr, 10)
        const end = Number.parseInt(endStr, 10)

        if (Number.isNaN(start) || Number.isNaN(end)) {
          errors.push(`Invalid range "${part}"`)
        } else if (start < 1 || end < 1) {
          errors.push("Page numbers must be at least 1")
        } else if (start > pageCount || end > pageCount) {
          errors.push(`Page ${Math.max(start, end)} exceeds document length (${pageCount} pages)`)
        } else if (start > end) {
          errors.push(`Invalid range "${part}" (start > end)`)
        } else {
          for (let page = start; page <= end; page += 1) {
            if (!pages.includes(page)) pages.push(page)
          }
        }
      } else {
        const page = Number.parseInt(part, 10)
        if (Number.isNaN(page)) {
          errors.push(`Invalid page number "${part}"`)
        } else if (page < 1) {
          errors.push("Page numbers must be at least 1")
        } else if (page > pageCount) {
          errors.push(`Page ${page} exceeds document length (${pageCount} pages)`)
        } else if (!pages.includes(page)) {
          pages.push(page)
        }
      }
    }

    pages.sort((left, right) => left - right)
    return { pages, error: errors.length > 0 ? errors[0] : null }
  }, [pageCount, pageRangeInput])

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
            pageRange: `Page ${pageNum}`,
          })
        }
      } else {
        const newPdf = await PDFDocument.create()
        const copiedPages = await newPdf.copyPages(sourcePdf, parseResult.pages.map((page) => page - 1))
        copiedPages.forEach((page) => newPdf.addPage(page))

        const pdfBytes = await newPdf.save()
        const blob = new Blob([pdfBytes], { type: "application/pdf" })
        const url = URL.createObjectURL(blob)

        const rangeLabel =
          parseResult.pages.length === 1
            ? `page_${parseResult.pages[0]}`
            : `pages_${parseResult.pages[0]}-${parseResult.pages[parseResult.pages.length - 1]}`

        newResults.push({
          name: `${baseName}_${rangeLabel}.pdf`,
          url,
          pageCount: parseResult.pages.length,
          pageRange:
            parseResult.pages.length === 1
              ? `Page ${parseResult.pages[0]}`
              : `${parseResult.pages.length} pages`,
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
    results.forEach((result) => URL.revokeObjectURL(result.url))
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
    <div className="mx-auto max-w-2xl">
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={(event) => {
          const selected = event.target.files?.[0]
          if (selected) {
            void handleFile(selected)
          }
        }}
      />

      {results.length === 0 ? (
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
                : "cursor-pointer border-white/[0.10] bg-[oklch(0.14_0.005_250)] hover:border-accent/30 hover:bg-[oklch(0.145_0.005_250)]"
          } ${file ? "p-6" : "p-14 md:p-20"}`}
        >
          {!file ? (
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-8">
                <div className="absolute -inset-5 rounded-3xl bg-accent/[0.08] blur-2xl" />
                <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl bg-accent/12 ring-1 ring-accent/25">
                  <FileText className="h-12 w-12 text-accent" strokeWidth={1.5} />
                </div>
              </div>
              <p className="text-[18px] font-semibold text-foreground">Drop a PDF file here</p>
              <p className="mt-3 max-w-sm text-[14px] leading-relaxed text-muted-foreground">
                Drag and drop your file, or click anywhere in this area to browse
              </p>
              <Button
                variant="outline"
                className="mt-8 h-12 w-full border-white/[0.12] bg-[oklch(0.16_0.006_250)] px-10 text-[14px] font-medium hover:border-white/[0.18] hover:bg-[oklch(0.18_0.007_250)] focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:w-auto"
                onClick={(event) => {
                  event.stopPropagation()
                  fileInputRef.current?.click()
                }}
              >
                Select file
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center gap-4 rounded-xl bg-[oklch(0.165_0.006_250)] p-4 ring-1 ring-white/[0.06]">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-accent/12 ring-1 ring-accent/20">
                  <FileText className="h-6 w-6 text-accent" strokeWidth={1.75} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-medium text-foreground">{file.name}</p>
                  {pageCount !== null ? (
                    <p className="mt-0.5 text-[13px] font-medium text-accent">
                      {pageCount} {pageCount === 1 ? "page" : "pages"} available
                    </p>
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={removeFile}
                  className="rounded-lg p-2 text-muted-foreground/50 transition-colors hover:bg-white/[0.06] hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
                  aria-label="Remove file"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-3">
                <label className="px-1 text-[12px] font-medium text-muted-foreground">
                  Pages to extract
                </label>
                <input
                  type="text"
                  value={pageRangeInput}
                  onChange={(event) => setPageRangeInput(event.target.value)}
                  placeholder={`e.g., 1, 3-5, 8 (1-${pageCount} available)`}
                  className={`w-full rounded-lg border px-4 py-3 text-[14px] text-foreground placeholder:text-muted-foreground/50 transition-colors focus:outline-none ${
                    parseResult.error
                      ? "border-red-500/50 bg-red-500/[0.05] focus:border-red-500/70 focus:ring-1 focus:ring-red-500/30"
                      : "border-white/[0.10] bg-[oklch(0.16_0.005_250)] focus:border-accent/40 focus:ring-1 focus:ring-accent/30"
                  }`}
                />

                {parseResult.error ? (
                  <div className="flex items-start gap-2 px-1">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                    <p className="text-[12px] text-red-400">{parseResult.error}</p>
                  </div>
                ) : null}

                {!parseResult.error && parseResult.pages.length > 0 ? (
                  <p className="px-1 text-[12px] text-accent">
                    {parseResult.pages.length} {parseResult.pages.length === 1 ? "page" : "pages"} selected:{" "}
                    {parseResult.pages.join(", ")}
                  </p>
                ) : null}

                {!pageRangeInput.trim() ? (
                  <p className="px-1 text-[11px] text-muted-foreground/70">
                    Enter individual pages (1, 3, 5) or ranges (1-5). Separate with commas.
                  </p>
                ) : null}
              </div>

              <div className="border-t border-white/[0.06] pt-4">
                <button
                  type="button"
                  onClick={() => setShowOptions((current) => !current)}
                  className="flex items-center gap-2 text-[12px] text-muted-foreground transition-colors hover:text-foreground"
                >
                  <ChevronDown className={`h-4 w-4 transition-transform ${showOptions ? "rotate-180" : ""}`} />
                  Options
                </button>

                {showOptions ? (
                  <div className="mt-4 rounded-lg bg-[oklch(0.16_0.005_250)] p-4 ring-1 ring-white/[0.06]">
                    <label className="flex cursor-pointer items-start gap-3">
                      <input
                        type="checkbox"
                        checked={extractAsSeparate}
                        onChange={(event) => setExtractAsSeparate(event.target.checked)}
                        className="mt-1 h-4 w-4 rounded border-white/[0.20] bg-transparent text-accent focus:ring-accent/50 focus:ring-offset-0"
                      />
                      <div>
                        <p className="text-[13px] font-medium text-foreground">
                          Extract each page as a separate PDF
                        </p>
                        <p className="mt-0.5 text-[12px] text-muted-foreground">
                          Creates {parseResult.pages.length || "multiple"} individual files instead of one combined PDF
                        </p>
                      </div>
                    </label>
                  </div>
                ) : null}
              </div>
            </div>
          )}
        </div>
      ) : null}

      {isProcessing ? (
        <div className="mt-8 rounded-2xl bg-[oklch(0.14_0.005_250)] p-12 ring-1 ring-white/[0.06]">
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-8">
              <div className="absolute -inset-4 rounded-2xl bg-accent/[0.04] blur-xl" />
              <div className="relative flex h-16 w-16 items-center justify-center rounded-xl bg-accent/10 ring-1 ring-accent/20">
                <FileText className="h-7 w-7 text-accent" strokeWidth={1.5} />
              </div>
            </div>
            <p className="text-[16px] font-medium text-foreground">Extracting pages locally...</p>
            <p className="mt-3 max-w-xs text-[14px] leading-relaxed text-muted-foreground">
              Your files remain on this device. Nothing is being uploaded.
            </p>
          </div>
        </div>
      ) : null}

      {file && results.length === 0 && !isProcessing ? (
        <div className="mt-10">
          <Button
            onClick={extractPages}
            disabled={!isValidInput}
            className="h-14 w-full text-[15px] font-semibold transition-all focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            {extractAsSeparate
              ? `Extract ${parseResult.pages.length || 0} separate PDFs`
              : `Extract ${parseResult.pages.length || 0} ${parseResult.pages.length === 1 ? "page" : "pages"}`}
          </Button>
        </div>
      ) : null}

      {results.length > 0 ? (
        <div className="mt-10 rounded-2xl bg-[oklch(0.14_0.005_250)] p-8 ring-1 ring-white/[0.08]">
          <div className="text-center">
            <ProcessedLocallyBadge className="mb-4" />
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-green-500/10 ring-1 ring-green-500/20">
              <CheckCircle2 className="h-7 w-7 text-green-500" strokeWidth={1.75} />
            </div>
            <h2 className="text-[18px] font-semibold text-foreground">Pages extracted</h2>
            <p className="mt-2 text-[14px] text-muted-foreground">Processed locally. Ready to download.</p>
          </div>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 text-center sm:flex-row sm:gap-6">
            <div>
              <p className="text-[24px] font-semibold text-foreground">{pageCount}</p>
              <p className="text-[12px] text-muted-foreground/70">Original pages</p>
            </div>
            <div className="hidden h-8 w-px bg-white/[0.08] sm:block" />
            <div>
              <p className="text-[24px] font-semibold text-accent">
                {results.reduce((sum, result) => sum + result.pageCount, 0)}
              </p>
              <p className="text-[12px] text-muted-foreground/70">Extracted pages</p>
            </div>
          </div>

          <div className="mt-8">
            {results.length === 1 ? (
              <a
                href={results[0].url}
                download={results[0].name}
                onClick={() => notifyLocalDownloadSuccess()}
                className="flex h-14 w-full items-center justify-center gap-3 rounded-xl bg-accent text-[15px] font-semibold text-accent-foreground transition-all hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <Download className="h-5 w-5" strokeWidth={2} />
                Download PDF
              </a>
            ) : (
              <div className="space-y-3">
                <p className="mb-4 text-center text-[12px] text-muted-foreground/60">
                  {results.length} files ready
                </p>
                {results.map((result, index) => (
                  <a
                    key={index}
                    href={result.url}
                    download={result.name}
                    onClick={() => notifyLocalDownloadSuccess()}
                    className="group flex items-center justify-between gap-4 rounded-xl bg-[oklch(0.165_0.006_250)] p-4 ring-1 ring-white/[0.06] transition-all hover:ring-accent/30"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/12 ring-1 ring-accent/20">
                        <FileText className="h-5 w-5 text-accent" strokeWidth={1.75} />
                      </div>
                      <div className="min-w-0 text-left">
                        <p className="truncate text-[13px] font-medium text-foreground">{result.name}</p>
                        <p className="text-[12px] text-muted-foreground">{result.pageRange}</p>
                      </div>
                    </div>
                    <Download className="h-5 w-5 shrink-0 text-muted-foreground transition-colors group-hover:text-accent" />
                  </a>
                ))}
              </div>
            )}
          </div>

          <div className="mt-10 border-t border-white/[0.04] pt-8">
            <div className="flex flex-col items-center gap-4">
              <Button
                variant="outline"
                onClick={reset}
                className="h-11 w-full border-white/[0.10] bg-transparent px-6 text-[13px] font-medium hover:border-white/[0.16] hover:bg-[oklch(0.16_0.006_250)] sm:w-auto"
              >
                Extract another PDF
              </Button>
              <Link
                href="/learn/online-vs-offline-pdf-tools"
                className="text-[13px] text-muted-foreground/70 underline underline-offset-2 transition-colors hover:text-foreground"
              >
                Learn how offline processing works
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
