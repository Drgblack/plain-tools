import type { Metadata } from "next"
import Link from "next/link"

import { JsonLd } from "@/components/seo/json-ld"
import { LinkGridSection } from "@/components/seo/link-grid-section"
import { PageBreadcrumbs } from "@/components/seo/page-breadcrumbs"
import { buildPageMetadata } from "@/lib/page-metadata"
import {
  buildBreadcrumbList,
  buildCollectionPageSchema,
  buildItemListSchema,
  buildWebPageSchema,
  combineJsonLd,
} from "@/lib/structured-data"

export const metadata: Metadata = buildPageMetadata({
  title: "Topic map | Plain Tools",
  description:
    "Explore Plain Tools by topic: PDF workflows, file conversion, calculators, status checks, network diagnostics, guides, and comparisons.",
  path: "/topics",
  image: "/og/tools.png",
})

const topicSections = [
  {
    title: "PDF workflows",
    description: "Core money pages for merge, split, compress, edit, convert, OCR, and secure document handling.",
    items: [
      { label: "Utility tools directory", href: "/tools", description: "Main hub for high-intent PDF and utility workflows." },
      { label: "Merge PDF", href: "/tools/merge-pdf", description: "Combine multiple PDFs locally in your browser." },
      { label: "Split PDF", href: "/tools/split-pdf", description: "Extract pages or ranges without uploading files." },
      { label: "Compress PDF", href: "/tools/compress-pdf", description: "Reduce PDF size locally with practical controls." },
    ],
  },
  {
    title: "File conversion",
    description: "Document, image, and text conversion workflows with direct links into live tools and supporting guides.",
    items: [
      { label: "File converters hub", href: "/file-converters", description: "Browse the main conversion cluster by task." },
      { label: "PDF to Word", href: "/tools/pdf-to-word", description: "Convert text-based PDFs into editable DOCX output." },
      { label: "Word to PDF", href: "/tools/word-to-pdf", description: "Create shareable PDFs directly in the browser." },
      { label: "Image tools", href: "/image-tools", description: "Move into OCR, image export, and image-to-PDF tasks." },
    ],
  },
  {
    title: "Financial calculators",
    description: "Browser-only calculator hubs for mortgages, paychecks, debt, savings growth, and quick finance planning.",
    items: [
      { label: "Calculator hub", href: "/calculators", description: "Entry point for the finance calculator cluster." },
      { label: "Mortgage payment calculators", href: "/calculators/mortgage-payment", description: "Home-price, APR, term, and down-payment scenarios." },
      { label: "Paycheck estimate calculators", href: "/calculators/paycheck-estimate", description: "Gross-to-net planning by salary, pay frequency, and state." },
      { label: "401(k) growth calculators", href: "/calculators/401k-growth", description: "Contribution, match, and return scenarios." },
    ],
  },
  {
    title: "Status and network diagnostics",
    description: "Website uptime checks, DNS lookup, IP context, latency, and outage history routes.",
    items: [
      { label: "Status directory", href: "/status", description: "Canonical status routes for major services and domains." },
      { label: "Site status checker", href: "/site-status", description: "Check a URL directly when you need a fast answer." },
      { label: "Network tools hub", href: "/network-tools", description: "DNS, IP, and latency workflows in one place." },
      { label: "Trending status checks", href: "/status/trending", description: "Browse high-demand outage checks and current interest spikes." },
    ],
  },
  {
    title: "Guides and comparisons",
    description: "Informational support pages that funnel users into tools while strengthening topical structure.",
    items: [
      { label: "Learn hub", href: "/learn", description: "Practical privacy, workflow, and troubleshooting guides." },
      { label: "Guides hub", href: "/guides", description: "Industry and workflow pages organised by professional use case." },
      { label: "Compare hub", href: "/compare", description: "Neutral comparisons against common upload-based alternatives." },
      { label: "Verify claims", href: "/verify-claims", description: "Evidence-based explanation of local processing and privacy claims." },
    ],
  },
] as const

const topicsSchema = combineJsonLd([
  buildWebPageSchema({
    name: "Topic map | Plain Tools",
    description:
      "User-facing topical map for Plain Tools clusters, including PDF workflows, file conversion, calculators, status checks, and guides.",
    url: "https://plain.tools/topics",
  }),
  buildCollectionPageSchema({
    name: "Plain Tools topical map",
    description:
      "Collection page connecting the main site clusters through shallow, descriptive internal links.",
    url: "https://plain.tools/topics",
  }),
  buildBreadcrumbList([
    { name: "Home", url: "https://plain.tools/" },
    { name: "Topics", url: "https://plain.tools/topics" },
  ]),
  buildItemListSchema(
    "Plain Tools topic clusters",
    topicSections.map((section) => ({
      name: section.title,
      description: section.description,
      url: `https://plain.tools${section.items[0]?.href ?? "/topics"}`,
    })),
    "https://plain.tools/topics"
  ),
])

export default function TopicsPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      {topicsSchema ? <JsonLd id="topics-page-schema" schema={topicsSchema} /> : null}
      <header className="max-w-4xl space-y-4">
        <PageBreadcrumbs items={[{ label: "Home", href: "/" }, { label: "Topics" }]} />
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">Topic map</p>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          Explore Plain Tools by topic
        </h1>
        <p className="text-base leading-relaxed text-muted-foreground">
          This topical map is a user-facing navigation layer for the main Plain Tools clusters. Use it
          to move between money pages, cluster hubs, and supporting guides without relying on the HTML
          sitemap or deep internal routes.
        </p>
        <div className="flex flex-wrap gap-2 text-xs">
          <Link href="/tools" className="rounded-full border border-border bg-card px-3 py-1.5 text-muted-foreground transition hover:border-accent/40 hover:text-accent">
            Open tools directory
          </Link>
          <Link href="/calculators" className="rounded-full border border-border bg-card px-3 py-1.5 text-muted-foreground transition hover:border-accent/40 hover:text-accent">
            Open calculator hub
          </Link>
          <Link href="/status" className="rounded-full border border-border bg-card px-3 py-1.5 text-muted-foreground transition hover:border-accent/40 hover:text-accent">
            Browse status routes
          </Link>
        </div>
      </header>

      <div className="mt-10 grid gap-6">
        {topicSections.map((section) => (
          <LinkGridSection
            key={section.title}
            title={section.title}
            description={section.description}
            items={[...section.items]}
            columns="4"
          />
        ))}
      </div>
    </main>
  )
}
