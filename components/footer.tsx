"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { GoogleTranslateWidget } from "@/components/google-translate-widget"

// Status indicator component
function StatusIndicator({ 
  label, 
  value, 
  status = "active" 
}: { 
  label: string
  value: string
  status?: "active" | "checking" | "inactive"
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs uppercase tracking-wider text-white/40 sm:text-[11px]">{label}:</span>
      <span className="flex items-center gap-1.5 font-mono text-xs text-white/70 sm:text-[11px]">
        {value}
        <span 
          className={`h-1.5 w-1.5 rounded-full ${
            status === "active" 
              ? "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.5)]" 
              : status === "checking"
              ? "bg-amber-400 animate-pulse"
              : "bg-white/30"
          }`} 
        />
      </span>
    </div>
  )
}

// Social icon components
function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

export function Footer() {
  const [webGpuStatus, setWebGpuStatus] = useState<"active" | "checking" | "inactive">("checking")
  const [webGpuLabel, setWebGpuLabel] = useState("Checking")

  useEffect(() => {
    const checkWebGPU = async () => {
      if (typeof window !== "undefined" && "gpu" in navigator) {
        try {
          const adapter = await (navigator as Navigator & { gpu: { requestAdapter: () => Promise<unknown> } }).gpu.requestAdapter()
          if (adapter) {
            setWebGpuStatus("active")
            setWebGpuLabel("WebGPU/Accelerated")
          } else {
            setWebGpuStatus("inactive")
            setWebGpuLabel("CPU Fallback")
          }
        } catch {
          setWebGpuStatus("inactive")
          setWebGpuLabel("CPU Fallback")
        }
      } else {
        setWebGpuStatus("inactive")
        setWebGpuLabel("CPU Fallback")
      }
    }
    checkWebGPU()
  }, [])

  return (
    <footer className="relative bg-[#0a0a0a]">
      {/* Top gradient border */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#0070f3]/40 to-transparent" />
      
      {/* Main Footer Content */}
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
        <div className="mb-10">
          <div className="flex items-baseline gap-1.5">
              <span className="text-[26px] font-bold tracking-tight text-white">Plain</span>
              <span className="h-2 w-2 rounded-full bg-[#0070f3]" />
          </div>
          <p className="mt-4 max-w-[480px] text-base leading-relaxed text-[#888]">
            Private-by-design PDF utilities, processed 100% locally.
          </p>
          <div className="mt-6 inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-[#333] bg-[#111] px-3 py-2">
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4 text-[#0070f3]"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
              />
            </svg>
            <span className="text-base font-medium text-white/70">Zero-Upload Architecture</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">

          {/* Column 1: Tools */}
          <div>
            <h4 className="text-base font-semibold uppercase tracking-wider text-white/50">
              Tools
            </h4>
            <ul className="mt-5 space-y-3">
              {[
                { label: "Merge PDF", href: "/tools/merge-pdf" },
                { label: "Convert PDF", href: "/tools/convert-pdf" },
                { label: "Redact", href: "/tools/redact-pdf" },
                { label: "Batch Engine", href: "/tools/batch-engine" },
                { label: "AI Summariser", href: "/tools/summarize-pdf" },
                { label: "OCR", href: "/tools/offline-ocr" },
                { label: "All Tools", href: "/tools" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex min-h-[44px] items-center text-base text-[#888] transition-colors duration-150 hover:text-[#0070f3]"
                  >
                    <span className="relative">
                      {link.label}
                      <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-[#0070f3]/50 transition-all duration-200 group-hover:w-full" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Resources */}
          <div>
            <h4 className="text-base font-semibold uppercase tracking-wider text-white/50">
              Resources
            </h4>
            <ul className="mt-5 space-y-3">
              {[
                { label: "Learning Centre", href: "/learn" },
                { label: "Privacy Manifesto", href: "/about#manifesto" },
                { label: "Blog", href: "/blog" },
                { label: "Labs", href: "/labs" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex min-h-[44px] items-center text-base text-[#888] transition-colors duration-150 hover:text-[#0070f3]"
                  >
                    <span className="relative">
                      {link.label}
                      <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-[#0070f3]/50 transition-all duration-200 group-hover:w-full" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Legal */}
          <div>
            <h4 className="text-base font-semibold uppercase tracking-wider text-white/50">
              Legal
            </h4>
            <ul className="mt-5 space-y-3">
              {[
  { label: "Terms of Service", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "No-Cookie Guarantee", href: "/privacy#cookies" },
  { label: "Verify Claims", href: "/verify-claims" },
  { label: "Support", href: "/support" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex min-h-[44px] items-center text-base text-[#888] transition-colors duration-150 hover:text-[#0070f3]"
                  >
                    <span className="relative">
                      {link.label}
                      <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-[#0070f3]/50 transition-all duration-200 group-hover:w-full" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Translate */}
          <div>
            <h4 className="text-base font-semibold uppercase tracking-wider text-white/50">
              Translate
            </h4>
            <div className="mt-5 w-full">
              <GoogleTranslateWidget />
            </div>
          </div>
        </div>
      </div>

      {/* System Status Tray - Bottom Bar */}
      <div className="relative border-t border-[#333]">
        {/* Faint grid pattern */}
        <div className="pointer-events-none absolute inset-0 hero-grid-pattern opacity-20" />
        
        <div className="relative mx-auto max-w-6xl overflow-x-hidden px-4 py-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            
            {/* Left: Status Indicators */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-6">
              <StatusIndicator 
                label="Engine" 
                value="Wasm/Active" 
                status="active" 
              />
              <div className="hidden h-3 w-px bg-[#333] md:block" />
              <StatusIndicator 
                label="Hardware" 
                value={webGpuLabel} 
                status={webGpuStatus} 
              />
              <div className="hidden h-3 w-px bg-[#333] md:block" />
              <StatusIndicator 
                label="Security" 
                value="AES-256 Local" 
                status="active" 
              />
              <div className="hidden h-3 w-px bg-[#333] md:block" />
              <StatusIndicator 
                label="Build" 
                value="v1.2.0" 
                status="active" 
              />
              <div className="hidden h-3 w-px bg-[#333] md:block" />
              <StatusIndicator 
                label="RAM" 
                value="Browser Managed" 
                status="active" 
              />
            </div>

            {/* Right: Social Icons */}
            <div className="flex items-center gap-4">
              {/* Social Icons */}
              <div className="flex items-center gap-3">
                <a
                  href="https://x.com/plainpdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-11 w-11 items-center justify-center rounded-lg border border-[#333] bg-[#111] text-[#888] transition-all duration-150 hover:border-[#0070f3]/50 hover:text-[#0070f3]"
                  aria-label="Follow on X"
                >
                  <XIcon className="h-4 w-4" />
                </a>
                <a
                  href="https://linkedin.com/company/plainpdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-11 w-11 items-center justify-center rounded-lg border border-[#333] bg-[#111] text-[#888] transition-all duration-150 hover:border-[#0070f3]/50 hover:text-[#0070f3]"
                  aria-label="Follow on LinkedIn"
                >
                  <LinkedInIcon className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-[#222] bg-[#080808]">
        <div className="mx-auto max-w-6xl px-4 py-3">
          <p className="text-center text-base text-white/30">
            Plain PDF runs entirely in your browser. Files are never uploaded to external servers.
          </p>
        </div>
      </div>
    </footer>
  )
}
