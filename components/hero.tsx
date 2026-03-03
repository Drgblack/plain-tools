"use client"

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Upload, WifiOff, ShieldCheck, BookOpen, GitCompare, BadgeCheck } from "lucide-react"
import Link from "next/link"
import dynamic from "next/dynamic"
import { TOOL_CATALOGUE } from "@/lib/tools-catalogue"

const LocalPreview = dynamic(
  () => import("@/components/local-preview").then((mod) => mod.LocalPreview),
  { ssr: false }
)

const HeroToolPills = dynamic(
  () => import("@/components/hero-tool-pills").then((mod) => mod.HeroToolPills),
  { ssr: false }
)

const availableToolCount = TOOL_CATALOGUE.reduce(
  (count, tool) => count + (tool.available ? 1 : 0),
  0
)

export function Hero() {
  const [isDragOver, setIsDragOver] = useState(false)
  const [previewFiles, setPreviewFiles] = useState<File[]>([])
  const [showPreview, setShowPreview] = useState(false)
  const dropZoneRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (dropZoneRef.current && !dropZoneRef.current.contains(e.relatedTarget as Node)) {
      setIsDragOver(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
    
    const files = Array.from(e.dataTransfer.files).filter(
      file => file.type === "application/pdf"
    )
    
    if (files.length > 0) {
      setPreviewFiles(files)
      setShowPreview(true)
    }
  }, [])

  const handleFileSelect = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      setPreviewFiles(files)
      setShowPreview(true)
    }
  }, [])

  const handleClosePreview = useCallback(() => {
    setShowPreview(false)
    setPreviewFiles([])
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }, [])

  const scrollToLiveDemo = useCallback(() => {
    document
      .getElementById("homepage-live-demo")
      ?.scrollIntoView({ behavior: "smooth", block: "start" })
  }, [])

  return (
    <>
    {/* Local Preview Modal */}
    {showPreview && previewFiles.length > 0 && (
      <LocalPreview
        files={previewFiles}
        onClose={handleClosePreview}
        mode={previewFiles.length > 1 ? "merge" : "single"}
      />
    )}

    <section className="relative flex flex-col items-center justify-center bg-[radial-gradient(circle_at_50%_22%,rgba(0,112,243,0.12),transparent_46%),#000] px-4 py-20 text-center md:py-28">
      
      {/* Status pill with subtle glow pulse */}
      <div className="relative mb-6">
        {/* Outer glow pulse */}
        <div className="absolute -inset-1 rounded-full bg-accent/[0.08] blur-md" />
        <div className="status-pill relative flex items-center gap-2.5 rounded-full px-4 py-2">
          <span className="h-1.5 w-1.5 rounded-full bg-accent/80" />
          <span className="text-[11px] font-medium tracking-wide text-foreground/85">
            Works offline after load
          </span>
        </div>
      </div>
      
      <h1
        data-tour="hero-heading"
        className="relative max-w-3xl text-balance text-3xl font-bold leading-[1.05] tracking-[-0.025em] sm:text-4xl lg:text-6xl"
        style={{ fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif" }}
      >
        <span className="text-foreground">Plain PDF tools.</span>{" "}
        <span className="text-accent font-extrabold">Nothing uploaded.</span>
      </h1>
      <p className="relative mt-4 max-w-3xl text-balance text-[14px] font-medium text-foreground/85 md:text-[15px]">
        Built for professionals who&apos;ve stopped trusting Adobe, Smallpdf, and DocuSign with their files.
      </p>
      <p className="relative mt-5 max-w-sm px-2 text-pretty text-[13px] leading-relaxed text-muted-foreground md:px-0 md:text-sm">
        Private PDF workflows in your browser. No uploads, no servers.
      </p>
      <p className="relative mt-3 text-[12px] uppercase tracking-wide text-muted-foreground/70">
        {availableToolCount} live tools, zero coming soon.
      </p>
      <Link
        href="/verify-claims"
        className="relative mt-4 inline-flex min-h-[44px] items-center gap-2 rounded-full border border-accent/35 bg-accent/12 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-accent transition-colors hover:bg-accent/18"
      >
        <BadgeCheck className="h-3.5 w-3.5" strokeWidth={2} />
        Verified: Zero Uploads
      </Link>
      {/* Drag and Drop Zone */}
      <div className="relative mt-10 w-full max-w-xl px-2 sm:px-4">
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
        <div
          id="hero-file-dropzone"
          ref={dropZoneRef}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleFileSelect}
          className={`relative flex min-h-[180px] w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 transition-all duration-300 md:p-10 ${
            isDragOver
              ? "drag-zone-pulse border-accent bg-accent/[0.08]"
              : "border-[#333] bg-[#111]/50 hover:border-[#0070f3] hover:bg-[#111]/80 hover:shadow-[0_0_10px_rgba(0,112,243,0.2)]"
          }`}
        >
          <div className={`mb-4 flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-300 ${
            isDragOver ? "bg-accent/20 scale-110" : "bg-accent/10"
          }`}>
            <Upload className={`h-8 w-8 transition-all duration-300 ${
              isDragOver ? "text-accent" : "text-accent/90"
            }`} strokeWidth={1.5} />
          </div>
          <p className="mb-2 text-center text-[15px] font-medium text-foreground">
            {isDragOver ? (
              "Drop your PDFs here"
            ) : (
              <>
                <span className="pointer-only">Drag and drop your PDFs</span>
                <span className="touch-only">Tap to select files</span>
              </>
            )}
          </p>
          <p className="mb-6 text-center text-[13px] text-muted-foreground">
            <span className="pointer-only">or select files to get started</span>
            <span className="touch-only">or browse files to get started</span>
          </p>
          <Button
            onClick={(event) => {
              event.stopPropagation()
              handleFileSelect()
            }}
            size="lg"
            className="h-11 bg-accent px-8 text-[14px] font-semibold text-[#041225] hover:bg-accent/90"
          >
            Select Files
          </Button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              scrollToLiveDemo()
            }}
            className="mt-3 text-[13px] font-medium text-muted-foreground transition-colors hover:text-accent"
          >
            Or try a live demo ↓
          </button>
        </div>
        
        {/* Trust indicators below drop zone */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[11px] font-medium tracking-wide text-muted-foreground/80">
          <span className="flex items-center gap-1.5">
            <WifiOff className="h-3 w-3 text-accent/85" strokeWidth={2} />
            <span>Works offline</span>
          </span>
          <span className="hidden h-3 w-px bg-white/[0.06] sm:block" />
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-3 w-3 text-accent/85" strokeWidth={2} />
            <span>Files stay on device</span>
          </span>
        </div>
      </div>

      {/* Secondary CTAs */}
      <div className="relative mt-12 flex w-full max-w-xl flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
        <Link
          href="/learn"
          className="group flex w-full items-center justify-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.02] px-4 py-2.5 text-[13px] font-medium text-muted-foreground/80 transition-all duration-200 hover:border-accent/25 hover:bg-accent/[0.06] hover:text-foreground sm:w-auto"
        >
          <BookOpen className="h-3.5 w-3.5 text-muted-foreground/60 transition-colors duration-200 group-hover:text-accent" strokeWidth={2} />
          Learn Center
        </Link>
        <Link
          href="/compare/plain-vs-ilovepdf"
          className="group flex w-full items-center justify-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.02] px-4 py-2.5 text-[13px] font-medium text-muted-foreground/80 transition-all duration-200 hover:border-accent/25 hover:bg-accent/[0.06] hover:text-foreground sm:w-auto"
        >
          <GitCompare className="h-3.5 w-3.5 text-muted-foreground/60 transition-colors duration-200 group-hover:text-accent" strokeWidth={2} />
          Comparisons
        </Link>
        <Link
          href="/verify-claims"
          className="group flex w-full items-center justify-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.02] px-4 py-2.5 text-[13px] font-medium text-muted-foreground/80 transition-all duration-200 hover:border-accent/25 hover:bg-accent/[0.06] hover:text-foreground sm:w-auto"
        >
          <BadgeCheck className="h-3.5 w-3.5 text-muted-foreground/60 transition-colors duration-200 group-hover:text-accent" strokeWidth={2} />
          Verify Claims
        </Link>
      </div>

      <div className="relative mt-5 flex w-full max-w-3xl flex-wrap items-center justify-center gap-2 text-xs">
        <Link
          href="/learn/how-to-verify-a-pdf-tool-doesnt-upload-your-files"
          className="rounded-full border border-white/[0.08] px-3 py-1.5 text-muted-foreground/80 transition-colors hover:border-accent/30 hover:text-foreground"
        >
          Verify No Uploads
        </Link>
        <Link
          href="/learn/what-is-pdf-metadata-and-why-it-matters"
          className="rounded-full border border-white/[0.08] px-3 py-1.5 text-muted-foreground/80 transition-colors hover:border-accent/30 hover:text-foreground"
        >
          PDF Metadata Guide
        </Link>
        <Link
          href="/learn/how-pdf-redaction-really-works"
          className="rounded-full border border-white/[0.08] px-3 py-1.5 text-muted-foreground/80 transition-colors hover:border-accent/30 hover:text-foreground"
        >
          Redaction Guide
        </Link>
      </div>

      <HeroToolPills />
    </section>
    </>
  )
}
