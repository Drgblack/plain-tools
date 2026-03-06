import type { Metadata } from "next"
import Link from "next/link"
import Script from "next/script"
import { ToolsSection } from "@/components/tools-section"
import { buildStandardPageTitle } from "@/lib/page-title"
import { serializeJsonLd } from "@/lib/sanitize"
import {
  buildBreadcrumbList,
  buildCollectionPageSchema,
  buildItemListSchema,
  combineJsonLd,
} from "@/lib/structured-data"
import { TOOL_CATALOGUE } from "@/lib/tools-catalogue"

export const metadata: Metadata = {
  title: buildStandardPageTitle("PDF Tools"),
  description:
    "Browse local PDF tools for merge, split, compress, convert, OCR, and signing. Process files in your browser with no uploads or account friction.",
  alternates: {
    canonical: "https://plain.tools/tools",
  },
  openGraph: {
    title: buildStandardPageTitle("PDF Tools"),
    description:
      "Explore privacy-first PDF tools that run locally in your browser. No uploads, calm workflows, and practical results.",
    url: "https://plain.tools/tools",
    images: [
      {
        url: "/og/tools.png",
        width: 1200,
        height: 630,
        alt: "Plain Tools PDF tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: buildStandardPageTitle("PDF Tools"),
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

  const crawlableToolSlugs = [
    "merge-pdf",
    "split-pdf",
    "compress-pdf",
    "pdf-to-word",
    "word-to-pdf",
    "jpg-to-pdf",
    "pdf-to-jpg",
    "pdf-to-excel",
    "pdf-to-ppt",
    "sign-pdf",
    "protect-pdf",
    "unlock-pdf",
    "ocr-pdf",
  ] as const

  const crawlableToolDirectory = crawlableToolSlugs
    .map((slug) => TOOL_CATALOGUE.find((tool) => tool.slug === slug && tool.available))
    .filter((tool): tool is NonNullable<(typeof TOOL_CATALOGUE)[number]> => Boolean(tool))

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

  const toolsHubSchema = combineJsonLd([
    buildCollectionPageSchema({
      name: "Plain Tools PDF Hub",
      description:
        "Collection of privacy-first PDF tools that run in your browser with local processing and no uploads.",
      url: "https://plain.tools/tools",
    }),
    buildBreadcrumbList([
      { name: "Home", url: "https://plain.tools/" },
      { name: "Tools", url: "https://plain.tools/tools" },
    ]),
    buildItemListSchema(
      "Major Plain Tools",
      crawlableToolDirectory.map((tool) => ({
        name: tool.name,
        description: tool.description,
        url: `https://plain.tools/tools/${tool.slug}`,
      })),
      "https://plain.tools/tools"
    ),
  ])

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {toolsHubSchema ? (
        <Script
          id="tools-hub-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(toolsHubSchema) }}
        />
      ) : null}
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

        <section className="border-b border-border px-4 py-10">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-lg font-semibold text-foreground">Tool directory</h2>
            <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
              This server-rendered list keeps core tools visible and crawlable. All links below are
              standard anchors to individual tool pages.
            </p>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {crawlableToolDirectory.map((tool) => (
                <li key={tool.slug} className="rounded-lg border border-border bg-card/40 p-4">
                  <h3 className="text-sm font-semibold text-foreground">
                    <Link href={`/tools/${tool.slug}`} className="hover:text-accent hover:underline">
                      {tool.name}
                    </Link>
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    {tool.description}
                  </p>
                  <Link
                    href={`/tools/${tool.slug}`}
                    className="mt-3 inline-flex text-xs font-medium text-accent hover:underline"
                  >
                    Open tool
                  </Link>
                </li>
              ))}
            </ul>
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

