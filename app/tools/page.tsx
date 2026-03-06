import type { Metadata } from "next"
import Link from "next/link"
import { ToolsSection } from "@/components/tools-section"

export const metadata: Metadata = {
  title: "Private PDF Tools - Local Browser Processing | Plain.tools",
  description:
    "Browse Plain.tools PDF utilities for merge, split, compress, convert, OCR, and signing. Processed locally in your browser with no file uploads.",
  alternates: {
    canonical: "https://plain.tools/tools",
  },
  openGraph: {
    title: "Private PDF Tools - Local Browser Processing | Plain.tools",
    description:
      "Explore privacy-first PDF tools that run locally in your browser. No uploads, calm workflows, and practical results.",
    url: "https://plain.tools/tools",
    images: [
      {
        url: "/og/tools.png",
        width: 1200,
        height: 630,
        alt: "Plain.tools PDF tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Private PDF Tools - Local Browser Processing | Plain.tools",
    description:
      "Merge, split, compress, convert, and sign PDFs locally in your browser. No uploads.",
    images: ["/og/tools.png"],
  },
}

export default function ToolsPage() {
  const popularTools = [
    { label: "Merge PDF", href: "/tools/merge-pdf" },
    { label: "Split PDF", href: "/tools/split-pdf" },
    { label: "Compress PDF", href: "/tools/compress-pdf" },
    { label: "PDF to Word", href: "/tools/pdf-to-word" },
    { label: "Word to PDF", href: "/tools/word-to-pdf" },
    { label: "JPG to PDF", href: "/tools/jpg-to-pdf" },
    { label: "Sign PDF", href: "/tools/sign-pdf" },
  ]

  const groupedLinks = [
    {
      title: "Convert",
      links: [
        { label: "PDF to Word", href: "/tools/pdf-to-word" },
        { label: "Word to PDF", href: "/tools/word-to-pdf" },
        { label: "PDF to JPG", href: "/tools/pdf-to-jpg" },
        { label: "JPG to PDF", href: "/tools/jpg-to-pdf" },
      ],
    },
    {
      title: "Organise",
      links: [
        { label: "Merge PDF", href: "/tools/merge-pdf" },
        { label: "Split PDF", href: "/tools/split-pdf" },
        { label: "Reorder PDF", href: "/tools/reorder-pdf" },
        { label: "Extract PDF", href: "/tools/extract-pdf" },
      ],
    },
    {
      title: "Secure",
      links: [
        { label: "Sign PDF", href: "/tools/sign-pdf" },
        { label: "Protect PDF", href: "/tools/protect-pdf" },
        { label: "Unlock PDF", href: "/tools/unlock-pdf" },
        { label: "Metadata Purge", href: "/tools/metadata-purge" },
      ],
    },
    {
      title: "Optimise and OCR",
      links: [
        { label: "Compress PDF", href: "/tools/compress-pdf" },
        { label: "Compression Preview", href: "/tools/compression-preview" },
        { label: "OCR PDF", href: "/tools/ocr-pdf" },
        { label: "Offline OCR", href: "/tools/offline-ocr" },
      ],
    },
  ]

  const trustPoints = [
    "Processed locally in your browser",
    "No file uploads",
    "Free to use",
    "Built for sensitive documents",
  ]

  const subtleCtas = [
    { label: "Verify claims", href: "/verify-claims" },
    { label: "Read practical guides", href: "/learn" },
    { label: "Compare alternatives", href: "/compare" },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="flex-1">
        <section className="border-b border-border px-4 py-8 sm:py-10">
          <div className="mx-auto max-w-6xl space-y-4">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Private PDF tools that run locally in your browser
            </h1>
            <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              Plain.tools gives you practical PDF workflows for conversion, organisation, signing,
              and privacy checks. Files stay on your device, processing runs in-browser, and you
              can verify the behaviour yourself.
            </p>
            <h2 className="text-sm font-semibold text-foreground">Popular PDF tools</h2>
            <div className="flex flex-wrap gap-2">
              {popularTools.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="rounded-full border border-border bg-card px-3 py-1.5 text-xs text-foreground transition hover:border-accent/40 hover:text-accent"
                >
                  {tool.label}
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-border px-4 py-5">
          <div className="mx-auto grid max-w-6xl gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {trustPoints.map((point) => (
              <p
                key={point}
                className="rounded-lg border border-border/80 bg-card/50 px-3 py-2 text-xs text-muted-foreground"
              >
                {point}
              </p>
            ))}
          </div>
        </section>

        <section className="border-b border-border px-4 py-8">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-lg font-semibold text-foreground">Browse by workflow</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {groupedLinks.map((group) => (
                <div key={group.title} className="rounded-lg border border-border bg-card/40 p-4">
                  <h3 className="text-sm font-semibold text-foreground">{group.title}</h3>
                  <ul className="mt-3 space-y-2">
                    {group.links.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="text-xs text-muted-foreground transition hover:text-accent hover:underline"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <ToolsSection />

        <section className="border-t border-border px-4 py-10">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-2">
            {subtleCtas.map((cta) => (
              <Link
                key={cta.href}
                href={cta.href}
                className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition hover:border-accent/40 hover:text-accent"
              >
                {cta.label}
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

