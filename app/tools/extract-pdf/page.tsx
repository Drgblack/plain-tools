import Link from "next/link"
import { ShieldCheck } from "lucide-react"

import { ToolIntentLinks } from "@/components/intent/tool-intent-links"
import { ToolRelatedLinks } from "@/components/seo/tool-related-links"
import { ToolFaqSectionBySlug, ToolSeoContentBySlug } from "@/components/tool-seo-content"
import ExtractPdfTool from "@/components/tools/extract-pdf-tool"

export default function ExtractPdfPage() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-background">
      <main className="flex-1">
        <section className="relative bg-[oklch(0.12_0.004_250)] px-4 pb-10 pt-20">
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent/10 to-transparent" />
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-[28px] font-semibold tracking-tight text-foreground md:text-[32px]">
              Extract PDF Pages
            </h1>
            <p className="mt-4 flex items-center justify-center gap-2.5 text-[15px] text-muted-foreground">
              <ShieldCheck className="h-5 w-5 text-accent" strokeWidth={1.75} />
              <span>
                Processed locally. <strong className="text-foreground/90">Files never leave your device.</strong>
              </span>
            </p>
          </div>
        </section>

        <section className="px-4 py-10">
          <div className="mx-auto max-w-3xl">
            <ToolSeoContentBySlug toolSlug="extract-pdf" />
          </div>
        </section>

        <section className="px-4 py-10 md:py-14">
          <div className="mx-auto max-w-3xl">
            <ExtractPdfTool />
            <ToolFaqSectionBySlug toolSlug="extract-pdf" className="mt-8" />
          </div>
        </section>

        <section className="px-4 py-12">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-4 text-[12px] text-muted-foreground/60">Other tools</p>
            <div className="flex flex-wrap justify-center gap-2">
              <Link
                href="/tools/merge-pdf"
                className="rounded-full border border-white/[0.06] bg-[oklch(0.14_0.004_250)] px-4 py-2 text-[13px] text-muted-foreground transition-colors hover:border-accent/25 hover:text-foreground"
              >
                Merge PDF
              </Link>
              <Link
                href="/tools/split-pdf"
                className="rounded-full border border-white/[0.06] bg-[oklch(0.14_0.004_250)] px-4 py-2 text-[13px] text-muted-foreground transition-colors hover:border-accent/25 hover:text-foreground"
              >
                Split PDF
              </Link>
              <Link
                href="/tools/compress-pdf"
                className="rounded-full border border-white/[0.06] bg-[oklch(0.14_0.004_250)] px-4 py-2 text-[13px] text-muted-foreground transition-colors hover:border-accent/25 hover:text-foreground"
              >
                Compress PDF
              </Link>
            </div>
          </div>
        </section>

        <section className="relative bg-[oklch(0.125_0.003_250)] px-4 py-16">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/15 to-transparent" />
          <div className="mx-auto max-w-3xl">
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              About page extraction
            </h2>
            <p className="mt-4 text-[14px] leading-relaxed text-muted-foreground">
              Extract specific pages from any PDF document without uploading your files. Enter page numbers or ranges like 1-5, 8, or 10-12 to pull exactly the pages you need.
            </p>
            <p className="mt-4 text-[14px] leading-relaxed text-muted-foreground">
              By default, selected pages are combined into a single new PDF. Use the options panel to extract each page as a separate file instead.
            </p>
          </div>
        </section>

        <div className="px-4">
          <div className="mx-auto mt-8 max-w-3xl">
            <ToolIntentLinks toolKey="extract-pdf" />
          </div>
        </div>

        <ToolRelatedLinks toolSlug="extract-pdf" className="mt-8" />
      </main>
    </div>
  )
}
