import Link from "next/link"
import { ArrowRight, BookOpen, BadgeCheck } from "lucide-react"

export function SeoContent() {
  return (
    <section id="about" className="relative px-4 pt-28 pb-24 md:pt-36 md:pb-28">
      {/* Top transition from privacy section */}
      <div className="absolute inset-x-0 -top-12 h-12 bg-gradient-to-b from-[oklch(0.135_0.004_250)] to-transparent" />
      {/* Section divider */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
      <div className="mx-auto max-w-5xl">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Offline PDF Tools You Can Trust
        </h2>
        <p className="mt-6 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          Plain provides offline PDF tools that work entirely in your browser.
          Unlike traditional PDF utilities that require uploading sensitive
          documents to external servers, Plain processes files locally using
          modern browser technology. This makes it ideal for confidential
          documents, workplace use, and privacy-conscious users. Whether you
          need to merge PDF without upload, use client-side PDF tools for
          sensitive data, or simply want private PDF utilities you can trust,
          Plain delivers a professional solution without compromises.
        </p>
        
        {/* Secondary CTA cards */}
        <div className="mt-10 grid gap-3 sm:grid-cols-3">
          <Link
            href="/compare/offline-vs-online-pdf-tools"
            className="group flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] p-4 transition-all duration-200 hover:border-accent/20 hover:bg-accent/[0.04]"
          >
            <div className="flex items-center gap-3">
              <BookOpen className="h-4 w-4 text-muted-foreground/50 transition-colors duration-200 group-hover:text-accent" strokeWidth={2} />
              <span className="text-[13px] font-medium text-muted-foreground/80 transition-colors duration-200 group-hover:text-foreground">Offline vs Online</span>
            </div>
            <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/40 transition-all duration-200 group-hover:text-accent group-hover:translate-x-0.5" strokeWidth={2} />
          </Link>
          <Link
            href="/learn"
            className="group flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] p-4 transition-all duration-200 hover:border-accent/20 hover:bg-accent/[0.04]"
          >
            <div className="flex items-center gap-3">
              <BookOpen className="h-4 w-4 text-muted-foreground/50 transition-colors duration-200 group-hover:text-accent" strokeWidth={2} />
              <span className="text-[13px] font-medium text-muted-foreground/80 transition-colors duration-200 group-hover:text-foreground">Learn Center</span>
            </div>
            <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/40 transition-all duration-200 group-hover:text-accent group-hover:translate-x-0.5" strokeWidth={2} />
          </Link>
          <Link
            href="/verify-claims"
            className="group flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] p-4 transition-all duration-200 hover:border-accent/20 hover:bg-accent/[0.04]"
          >
            <div className="flex items-center gap-3">
              <BadgeCheck className="h-4 w-4 text-muted-foreground/50 transition-colors duration-200 group-hover:text-accent" strokeWidth={2} />
              <span className="text-[13px] font-medium text-muted-foreground/80 transition-colors duration-200 group-hover:text-foreground">Verify Claims</span>
            </div>
            <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/40 transition-all duration-200 group-hover:text-accent group-hover:translate-x-0.5" strokeWidth={2} />
          </Link>
        </div>
      </div>
    </section>
  )
}
