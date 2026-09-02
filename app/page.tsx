import type { Metadata } from "next"
import {
  ArrowRight,
  Calculator,
  Eye,
  FileText,
  FileType,
  Gauge,
  Globe,
  HardDrive,
  Lock,
  SearchCheck,
  Server,
  Shield,
  Wifi,
} from "lucide-react"
import Link from "next/link"

import { AdLayout } from "@/components/ads/ad-layout"
import { CategoryTile } from "@/components/category-tile"
import { ProofStrip } from "@/components/proof-strip"
import { JsonLd } from "@/components/seo/json-ld"
import { Surface } from "@/components/surface"
import { ToolCard } from "@/components/tool-card"
import { TrendingStatus } from "@/components/trending-status"
import { buildPageMetadata } from "@/lib/page-metadata"
import {
  buildBreadcrumbList,
  buildItemListSchema,
  buildWebApplicationSchema,
  buildWebPageSchema,
  buildWebSiteSchema,
  combineJsonLd,
} from "@/lib/structured-data"
import { TOOL_CATALOGUE } from "@/lib/tools-catalogue"
import { cn } from "@/lib/utils"

export const metadata: Metadata = buildPageMetadata({
  title: "Free PDF tools, website status checks and network diagnostics",
  description:
    "Use Plain Tools for free PDF workflows, website status checks, and network diagnostics. Priority pages focus on local processing, no-upload handling, and practical troubleshooting.",
  path: "/",
  image: "/og/default.png",
})

const homePageSchema = combineJsonLd([
  buildWebSiteSchema({
    name: "Plain Tools",
    url: "https://plain.tools",
    description:
      "Trust-first utility platform for PDF workflows, file tasks, and network diagnostics.",
  }),
  buildWebPageSchema({
    name: "Plain Tools",
    description:
      "Trust-first utility tools for PDF workflows, file tasks, network diagnostics, and uptime checks.",
    url: "https://plain.tools",
  }),
  buildWebApplicationSchema({
    name: "Plain Tools",
    description:
      "Browser-first utility platform with local processing for core workflows and practical diagnostics.",
    url: "https://plain.tools",
    offerCurrency: "EUR",
    featureList: [
      "No file uploads for core local workflows",
      "No advertising trackers in core utility workflows",
      "Works offline after first load for local tools",
      "Verifiable claims and open source visibility",
    ],
  }),
  buildBreadcrumbList([{ name: "Home", url: "https://plain.tools/" }]),
  buildItemListSchema(
    "Plain Tools key sections",
    [
      { name: "PDF Tools", url: "https://plain.tools/tools" },
      { name: "Site Status", url: "https://plain.tools/site-status" },
      { name: "Network Tools", url: "https://plain.tools/network-tools" },
      { name: "Learn", url: "https://plain.tools/learn" },
      { name: "Compare", url: "https://plain.tools/compare" },
    ],
    "https://plain.tools"
  ),
])

const primaryTasks = [
  {
    title: "Merge or combine PDFs",
    description: "Combine multiple PDF files locally with no upload step.",
    href: "/tools/merge-pdf",
    icon: <FileType className="h-5 w-5" />,
    label: "PDF workflow",
  },
  {
    title: "Split or extract PDF pages",
    description: "Pull out selected pages or ranges without sending files to a server.",
    href: "/tools/split-pdf",
    icon: <FileText className="h-5 w-5" />,
    label: "PDF workflow",
  },
  {
    title: "Compress a PDF for sharing",
    description: "Reduce file size locally for email, storage, or upload limits.",
    href: "/tools/compress-pdf",
    icon: <HardDrive className="h-5 w-5" />,
    label: "PDF workflow",
  },
  {
    title: "Check whether a site is down",
    description: "Run a live status check, then move into DNS or latency diagnostics if needed.",
    href: "/site-status",
    icon: <Wifi className="h-5 w-5" />,
    label: "Network check",
  },
] as const

const categories = [
  {
    name: "Work with PDFs",
    description: "Merge, split, compress, convert, OCR, and sign PDFs locally in your browser.",
    href: "/tools",
    icon: <FileType className="h-6 w-6" />,
    toolCount: TOOL_CATALOGUE.filter((tool) => tool.available).length,
  },
  {
    name: "Convert and Handle Files",
    description: "Use browser-based conversion workflows for documents, text, and lightweight file tasks.",
    href: "/file-converters",
    icon: <FileText className="h-6 w-6" />,
    toolCount: 8,
  },
  {
    name: "Check Site Status",
    description: "Check whether a website is down, reachable, and responding in real time.",
    href: "/status",
    icon: <Wifi className="h-6 w-6" />,
    toolCount: 1,
  },
  {
    name: "Check Network and DNS",
    description: "Run IP lookup, DNS checks, and latency diagnostics for everyday troubleshooting.",
    href: "/network-tools",
    icon: <Globe className="h-6 w-6" />,
    toolCount: 4,
  },
  {
    name: "Image Tools",
    description: "Export PDF pages as images, combine images into PDFs, and optimise visual files locally.",
    href: "/image-tools",
    icon: <Eye className="h-6 w-6" />,
    toolCount: 6,
  },
  {
    name: "Use Calculators (Sister Site)",
    description: "Open Plain Figures for finance, maths, and day-to-day calculator workflows.",
    href: "https://plainfigures.org",
    icon: <Calculator className="h-6 w-6" />,
    external: true,
  },
] as const

const popularTools = [
  {
    name: "Merge PDF",
    description: "Combine multiple PDF files in-browser with no uploads.",
    href: "/tools/merge-pdf",
    tags: ["Local", "Core"] as const,
    icon: <FileType className="h-5 w-5" />,
  },
  {
    name: "Split PDF",
    description: "Break a PDF into separate pages or ranges without sending files to a server.",
    href: "/tools/split-pdf",
    tags: ["Local", "Core"] as const,
    icon: <FileText className="h-5 w-5" />,
  },
  {
    name: "Compress PDF",
    description: "Optimise PDF size locally with practical controls.",
    href: "/tools/compress-pdf",
    tags: ["Local", "Optimise"] as const,
    icon: <HardDrive className="h-5 w-5" />,
  },
  {
    name: "PDF to Word",
    description: "Convert text-based PDF documents into editable Word output in your browser.",
    href: "/tools/pdf-to-word",
    tags: ["Local", "Convert"] as const,
    icon: <FileText className="h-5 w-5" />,
  },
  {
    name: "Word to PDF",
    description: "Turn DOCX files into PDFs locally for sharing, printing, or sign-off.",
    href: "/tools/word-to-pdf",
    tags: ["Local", "Convert"] as const,
    icon: <FileType className="h-5 w-5" />,
  },
  {
    name: "JPG to PDF",
    description: "Bundle image files into a single PDF for forms, scans, or records.",
    href: "/tools/jpg-to-pdf",
    tags: ["Local", "Image"] as const,
    icon: <Eye className="h-5 w-5" />,
  },
  {
    name: "DNS Lookup",
    description: "Query A, AAAA, MX, TXT, and other DNS records quickly.",
    href: "/dns-lookup",
    tags: ["Network", "DNS"] as const,
    icon: <Server className="h-5 w-5" />,
  },
  {
    name: "Site Status Checker",
    description: "Check whether a website is up, down, or degraded in real time.",
    href: "/site-status",
    tags: ["Network", "Status"] as const,
    icon: <Wifi className="h-5 w-5" />,
  },
] as const

const homepageProofPoints = [
  {
    icon: HardDrive,
    title: "Processed locally",
    detail: "Core local workflows run in your browser, on your device.",
  },
  {
    icon: Shield,
    title: "No uploads for core tools",
    detail: "Local PDF operations do not require sending file contents to our servers.",
  },
  {
    icon: Lock,
    title: "Built for sensitive files",
    detail: "Practical workflows for legal, HR, finance, and admin documents.",
  },
  {
    icon: SearchCheck,
    title: "Verifiable claims",
    detail: "Use DevTools Network inspection to validate no-upload behaviour.",
  },
  {
    icon: Gauge,
    title: "Fast to use",
    detail: "Open, process, and download without waiting on an upload queue.",
  },
] as const

const guidanceLinks = [
  {
    title: "Verify local-processing claims",
    description: "Check the privacy model yourself instead of relying on marketing copy.",
    href: "/verify-claims",
  },
  {
    title: "Read practical guides",
    description: "Learn when local processing fits best and what trade-offs to expect.",
    href: "/learn",
  },
  {
    title: "Compare alternatives",
    description: "See how Plain Tools differs from upload-based PDF services.",
    href: "/compare",
  },
] as const

const footerLinks = [
  { label: "Open the full tools directory", href: "/tools" },
  { label: "Browse the topic map", href: "/topics" },
  { label: "View the HTML sitemap", href: "/html-sitemap" },
  { label: "Read the public roadmap", href: "/roadmap" },
] as const

export default function HomePage() {
  return (
    <>
      {homePageSchema ? <JsonLd id="homepage-schema" schema={homePageSchema} /> : null}

      <div className="flex flex-col">
        <section className="relative overflow-hidden border-b border-border/50">
          <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent" />
          <div className="relative mx-auto max-w-6xl px-4 py-16 md:py-24">
            <div className="max-w-3xl">
              <div className="inline-flex rounded-full border border-accent/25 bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent">
                Free tools. Local-first workflows. No upload step for core PDF tasks.
              </div>
              <h1
                data-tour="hero-heading"
                className="mt-5 text-balance text-4xl font-semibold tracking-tight text-foreground md:text-5xl"
              >
                Start with the task you need to finish.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
                Plain Tools helps you handle PDFs, quick file conversions, website status checks,
                and network diagnostics without making you hunt through thin landing pages first.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href="/tools"
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full px-6 py-3",
                    "bg-accent font-semibold text-accent-foreground",
                    "shadow-[0_4px_20px_rgba(100,200,180,0.25)] transition-all duration-300",
                    "hover:-translate-y-0.5 hover:shadow-[0_6px_30px_rgba(100,200,180,0.35)]"
                  )}
                >
                  Browse PDF tools
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/site-status"
                  className="inline-flex items-center gap-2 rounded-full border border-white/[0.12] bg-card px-6 py-3 font-semibold text-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-white/20"
                >
                  Check site status
                </Link>
                <Link
                  href="/network-tools"
                  className="inline-flex items-center gap-2 rounded-full border border-white/[0.12] bg-card px-6 py-3 font-semibold text-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-white/20"
                >
                  Open network tools
                </Link>
              </div>
              <div className="mt-6 flex flex-wrap gap-4 text-sm">
                <Link href="/verify-claims" className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
                  Verify privacy claims
                </Link>
                <Link href="/learn" className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
                  Read guides
                </Link>
                <Link href="/compare" className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
                  Compare alternatives
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-border/50">
          <div className="mx-auto max-w-6xl px-4 py-12 md:py-14">
            <div className="mb-6 max-w-3xl">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Start with a common task
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">
                These are the fastest routes into the workflows people use most often.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {primaryTasks.map((task) => (
                <Link key={task.href} href={task.href} className="group block">
                  <Surface interactive className="h-full">
                    <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                      {task.icon}
                      {task.label}
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-foreground">{task.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {task.description}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-accent">
                      Open task
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </Surface>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-border/50">
          <div className="mx-auto max-w-6xl px-4 py-14 md:py-16">
            <div className="mb-8 max-w-3xl">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Browse by section
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">
                If you know the kind of task but not the exact tool, start with one of the main hubs.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => (
                <CategoryTile
                  key={category.name}
                  name={category.name}
                  description={category.description}
                  href={category.href}
                  icon={category.icon}
                  external={category.external}
                  toolCount={category.toolCount}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-border/50 px-4 py-6 md:py-8">
          <div className="mx-auto max-w-6xl">
            <ProofStrip points={homepageProofPoints} />
          </div>
        </section>

        <section id="tools" className="border-b border-border/50">
          <div className="mx-auto max-w-6xl px-4 py-14 md:py-16">
            <div className="mb-8 max-w-3xl">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Popular tools
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">
                Open a working tool directly when you already know the job you need done.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {popularTools.map((tool) => (
                <ToolCard
                  key={tool.href}
                  name={tool.name}
                  description={tool.description}
                  href={tool.href}
                  tags={tool.tags}
                  icon={tool.icon}
                />
              ))}
            </div>
          </div>
        </section>

        <AdLayout placement="homepage_content_top" />

        <section className="border-b border-border/50">
          <div className="mx-auto max-w-6xl px-4 py-14 md:py-16">
            <div className="grid gap-8 xl:grid-cols-[minmax(0,1.3fr)_minmax(320px,1fr)] xl:items-start">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                  Need help choosing the right route?
                </h2>
                <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
                  Start with the tool if you already know the task. If you are comparing privacy,
                  verifying claims, or learning the workflow first, use these supporting paths.
                </p>
                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  {guidanceLinks.map((link) => (
                    <Link key={link.href} href={link.href} className="group rounded-xl border border-border bg-card/40 p-5 transition hover:border-accent/40">
                      <h3 className="text-base font-semibold text-foreground">{link.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {link.description}
                      </p>
                      <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent">
                        Open
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </Link>
                  ))}
                </div>
                <div className="mt-8 flex flex-wrap gap-3 text-sm">
                  {footerLinks.map((link) => (
                    <Link key={link.href} href={link.href} className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
              <TrendingStatus title="Trending outage checks" limit={8} />
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
