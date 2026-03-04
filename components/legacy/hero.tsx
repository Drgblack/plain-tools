"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Upload, WifiOff, ShieldCheck, BookOpen, GitCompare, BadgeCheck } from "lucide-react"
import Link from "next/link"
import { LocalPreview } from "@/components/local-preview"

const trustClaims = [
  "Works offline after load",
  "No uploads",
  "Verifiable in DevTools",
]

export function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const [previewFiles, setPreviewFiles] = useState<File[]>([])
  const [showPreview, setShowPreview] = useState(false)
  const dropZoneRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % trustClaims.length)
        setIsTransitioning(false)
      }, 400)
    }, 4000)

    return () => clearInterval(interval)
  }, [])

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

    <section className="relative flex flex-col items-center justify-center px-4 py-20 text-center md:py-28 bg-[#000]">
      {/* Geometric grid pattern background */}
      <div className="pointer-events-none absolute inset-0 hero-grid-pattern opacity-40" />
      
      {/* Layered background glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Primary headline glow - slightly stronger */}
        <div className="absolute top-[38%] left-1/2 -translate-x-1/2 -translate-y-1/2 h-[350px] w-[550px] rounded-full bg-accent/[0.12] blur-[100px]" />
        {/* Secondary CTA glow */}
        <div className="absolute top-[72%] left-1/2 -translate-x-1/2 -translate-y-1/2 h-36 w-60 rounded-full bg-accent/[0.06] blur-[70px]" />
      </div>
      
      {/* Status pill with subtle glow pulse */}
      <div className="animate-fade-up relative mb-6">
        {/* Outer glow pulse */}
        <div className="absolute -inset-1 rounded-full bg-accent/[0.08] blur-md pill-glow-pulse" />
        <div className="status-pill relative flex items-center gap-2.5 rounded-full px-4 py-2">
          <span className="pill-dot-pulse h-1.5 w-1.5 rounded-full bg-accent/80" />
          <span 
            className={`text-[11px] font-medium tracking-wide text-foreground/85 transition-all duration-300 ease-out ${
              isTransitioning ? "opacity-0 -translate-y-1" : "opacity-100 translate-y-0"
            }`}
          >
            {trustClaims[currentIndex]}
          </span>
        </div>
      </div>
      
      <h1 data-tour="hero-heading" className="animate-fade-up-delay-1 relative max-w-3xl text-balance text-4xl font-bold tracking-[-0.025em] leading-[1.05] md:text-5xl lg:text-[3.5rem] xl:text-6xl">
        <span className="text-foreground">Plain PDF tools.</span>{" "}
        <span className="text-accent font-extrabold">Nothing uploaded.</span>
      </h1>
      <p className="animate-fade-up-delay-2 relative mt-5 max-w-lg px-2 text-pretty text-[15px] leading-relaxed text-muted-foreground md:px-0 md:text-base">
        Offline PDF tools that run entirely in your browser.{" "}
        <br className="hidden sm:inline" />
        No uploads. No servers. No accounts. Just simple, professional PDF
        utilities powered by your device.
      </p>
      {/* Drag and Drop Zone */}
      <div className="animate-fade-up-delay-3 relative mt-10 w-full max-w-xl px-4">
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
        <div
          ref={dropZoneRef}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 transition-all duration-300 md:p-10 ${
            isDragOver
              ? "drag-zone-pulse border-accent bg-accent/[0.08]"
              : "border-[#333] bg-[#111]/50 hover:border-[#0070f3] hover:bg-[#111]/80 hover:shadow-[0_0_10px_rgba(0,112,243,0.2)]"
          }`}
        >
          <div className={`mb-4 flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-300 ${
            isDragOver ? "bg-accent/20 scale-110" : "bg-accent/10"
          }`}>
            <Upload className={`h-8 w-8 transition-all duration-300 ${
              isDragOver ? "text-accent" : "text-accent/70"
            }`} strokeWidth={1.5} />
          </div>
          <p className="mb-2 text-center text-[15px] font-medium text-foreground">
            {isDragOver ? "Drop your PDFs here" : "Drag and drop your PDFs"}
          </p>
          <p className="mb-6 text-center text-[13px] text-muted-foreground">
            or select files to get started
          </p>
          <Button
            onClick={handleFileSelect}
            size="lg"
            className="btn-premium h-11 px-8 text-[14px] font-semibold text-white"
          >
            Select Files
          </Button>
        </div>
        
        {/* Trust indicators below drop zone */}
        <div className="mt-6 flex items-center justify-center gap-6 text-[11px] font-medium tracking-wide text-muted-foreground/60">
          <span className="flex items-center gap-1.5">
            <WifiOff className="h-3 w-3 text-accent/60" strokeWidth={2} />
            <span>Works offline</span>
          </span>
          <span className="h-3 w-px bg-white/[0.06]" />
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-3 w-3 text-accent/60" strokeWidth={2} />
            <span>Files stay on device</span>
          </span>
        </div>
      </div>

      {/* Secondary CTAs */}
      <div className="animate-fade-up-delay-3 relative mt-12 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/learn"
          className="group flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.02] px-4 py-2.5 text-[13px] font-medium text-muted-foreground/80 transition-all duration-200 hover:border-accent/25 hover:bg-accent/[0.06] hover:text-foreground"
        >
          <BookOpen className="h-3.5 w-3.5 text-muted-foreground/60 transition-colors duration-200 group-hover:text-accent" strokeWidth={2} />
          Learn Center
        </Link>
        <Link
          href="/compare/plain-vs-ilovepdf"
          className="group flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.02] px-4 py-2.5 text-[13px] font-medium text-muted-foreground/80 transition-all duration-200 hover:border-accent/25 hover:bg-accent/[0.06] hover:text-foreground"
        >
          <GitCompare className="h-3.5 w-3.5 text-muted-foreground/60 transition-colors duration-200 group-hover:text-accent" strokeWidth={2} />
          Comparisons
        </Link>
        <Link
          href="/verify-claims"
          className="group flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.02] px-4 py-2.5 text-[13px] font-medium text-muted-foreground/80 transition-all duration-200 hover:border-accent/25 hover:bg-accent/[0.06] hover:text-foreground"
        >
          <BadgeCheck className="h-3.5 w-3.5 text-muted-foreground/60 transition-colors duration-200 group-hover:text-accent" strokeWidth={2} />
          Verify Claims
        </Link>
      </div>
    </section>
    </>
  )
}
