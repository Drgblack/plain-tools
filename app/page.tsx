import type { Metadata } from "next"
import {
  Globe,
  FileText,
  FileType,
  Calculator,
  Shield,
  Gauge,
  Wifi,
  Eye,
  Server,
  HardDrive,
  Lock,
  SearchCheck,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"
import { AdLayout } from "@/components/ads/ad-layout"
import { CategoryTile } from "@/components/category-tile"
import { ProofStrip } from "@/components/proof-strip"
import { TrendingStatus } from "@/components/trending-status"
import { JsonLd } from "@/components/seo/json-ld"
import { ToolCard } from "@/components/tool-card"
import { Surface } from "@/components/surface"
import { buildPageMetadata } from "@/lib/page-metadata"
import {
  buildBreadcrumbList,
  buildItemListSchema,
  buildWebApplicationSchema,
  buildWebPageSchema,
  buildWebSiteSchema,
  combineJsonLd,
} from "@/lib/structured-data"
import { cn } from "@/lib/utils"
import { TOOL_CATALOGUE } from "@/lib/tools-catalogue"
import { PDF_INTENT_PAGES } from "@/lib/pdf-intent-pages"
import { TOOL_PROBLEM_PAGES } from "@/lib/tool-problem-pages"
import {
  FIRST_WAVE_COMPARE_PAGES,
  FIRST_WAVE_GUIDE_PAGES,
  FIRST_WAVE_STATUS_PAGES,
  FIRST_WAVE_TOOL_PAGES,
} from "@/lib/seo/first-wave-pages"

// Homepage has explicit canonical URL
export const metadata: Metadata = buildPageMetadata({
  title: "Utility platform for PDF, status and network tools",
  description:
    "43+ offline PDF tools, network diagnostics, converters and utilities - 100% local processing, no uploads, no tracking, with privacy by design.",
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
  buildBreadcrumbList([
    { name: "Home", url: "https://plain.tools/" },
  ]),
  buildItemListSchema(
    "Plain Tools key sections",
    [
      { name: "PDF Tools", url: "https://plain.tools/tools" },
      { name: "Learn", url: "https://plain.tools/learn" },
      { name: "Compare", url: "https://plain.tools/compare" },
      { name: "Site Status", url: "https://plain.tools/site-status" },
      { name: "Network Tools", url: "https://plain.tools/network-tools" },
    ],
    "https://plain.tools"
  ),
])

const categories = [
  {
    name: "Check Network and DNS",
    description: "Run IP lookup, DNS checks, and latency diagnostics for everyday network troubleshooting",
    href: "/network-tools",
    icon: <Globe className="h-6 w-6" />,
    toolCount: 4,
  },
  {
    name: "Convert and Handle Files",
    description: "Use browser-based file utilities for format checks and lightweight conversion workflows",
    href: "/file-converters",
    icon: <FileText className="h-6 w-6" />,
    toolCount: 8,
  },
  {
    name: "Work with PDFs",
    description: "Merge, split, compress, convert, OCR, and sign PDFs locally in your browser",
    href: "/pdf-tools",
    icon: <FileType className="h-6 w-6" />,
    toolCount: TOOL_CATALOGUE.filter((tool) => tool.available).length,
  },
  {
    name: "Image Tools",
    description: "Export PDF pages as images, combine images into PDFs, and optimise visual files locally",
    href: "/image-tools",
    icon: <Eye className="h-6 w-6" />,
    toolCount: 6,
  },
  {
    name: "Check Site Status",
    description: "Check whether a website is down, reachable, and responding in real time",
    href: "/status",
    icon: <Wifi className="h-6 w-6" />,
    toolCount: 1,
  },
  {
    name: "Use Calculators (Sister Site)",
    description: "Open Plain Figures for finance, maths, and day-to-day calculator workflows",
    href: "https://plainfigures.org",
    icon: <Calculator className="h-6 w-6" />,
    external: true,
  },
]

const popularTools = [
  {
    name: "Site Status Checker",
    description: "Check whether a website is up, down, or degraded",
    href: "/site-status",
    tags: ["Network", "Status"],
    icon: <Wifi className="h-5 w-5" />,
  },
  {
    name: "What is My IP",
    description: "Instantly view your public IP and basic network context",
    href: "/what-is-my-ip",
    tags: ["Network", "Diagnostics"],
    icon: <Globe className="h-5 w-5" />,
  },
  {
    name: "DNS Lookup",
    description: "Query A, AAAA, MX, TXT and other DNS records quickly",
    href: "/dns-lookup",
    tags: ["Network", "DNS"],
    icon: <Server className="h-5 w-5" />,
  },
  {
    name: "Merge PDF",
    description: "Combine multiple PDF files in-browser with no uploads",
    href: "/tools/merge-pdf",
    tags: ["Local", "Core"],
    icon: <FileType className="h-5 w-5" />,
  },
  {
    name: "Compress PDF",
    description: "Optimise PDF size locally with clear quality controls",
    href: "/tools/compress-pdf",
    tags: ["Local", "Optimise"],
    icon: <FileType className="h-5 w-5" />,
  },
  {
    name: "File Converters",
    description: "Open practical browser-based file conversion workflows",
    href: "/file-converters",
    tags: ["File", "Convert"],
    icon: <FileText className="h-5 w-5" />,
  },
]

const homepageMostPopularTools = [
  {
    name: "Merge PDF",
    description: "Combine multiple PDF files in one browser-based workflow with no upload step.",
    href: "/tools/merge-pdf",
    icon: <FileType className="h-5 w-5" />,
  },
  {
    name: "Split PDF",
    description: "Break a PDF into separate pages or ranges without sending files to a server.",
    href: "/tools/split-pdf",
    icon: <FileText className="h-5 w-5" />,
  },
  {
    name: "Compress PDF",
    description: "Reduce PDF size locally with practical controls for smaller email-ready files.",
    href: "/tools/compress-pdf",
    icon: <HardDrive className="h-5 w-5" />,
  },
  {
    name: "PDF to Word",
    description: "Convert PDF documents into editable Word files directly in your browser.",
    href: "/tools/pdf-to-word",
    icon: <FileText className="h-5 w-5" />,
  },
  {
    name: "Word to PDF",
    description: "Turn Word documents into PDFs quickly for sharing, printing, or sign-off.",
    href: "/tools/word-to-pdf",
    icon: <FileType className="h-5 w-5" />,
  },
  {
    name: "PDF to JPG",
    description: "Export PDF pages as JPG images when you need previews or lighter image output.",
    href: "/tools/pdf-to-jpg",
    icon: <Eye className="h-5 w-5" />,
  },
  {
    name: "JPG to PDF",
    description: "Bundle JPG images into a single PDF for applications, records, or sharing.",
    href: "/tools/jpg-to-pdf",
    icon: <FileText className="h-5 w-5" />,
  },
  {
    name: "PDF to PNG",
    description: "Open the image-export workflow for clean page snapshots and transparent-friendly output.",
    href: "/tools/pdf-to-png",
    icon: <Eye className="h-5 w-5" />,
  },
  {
    name: "PNG to PDF",
    description: "Use the image-to-PDF workflow to combine PNG assets into one portable document.",
    href: "/tools/png-to-pdf",
    icon: <FileText className="h-5 w-5" />,
  },
  {
    name: "Check Website Status",
    description: "See whether a website is up, down, or timing out before you start troubleshooting.",
    href: "/site-status",
    icon: <Wifi className="h-5 w-5" />,
  },
]

const homepageSeoToolLinks = PDF_INTENT_PAGES.filter((page) =>
  [
    "merge-pdf-online",
    "split-pdf-online",
    "compress-pdf-online",
    "pdf-to-word-online",
    "word-to-pdf-online",
    "pdf-to-jpg-online",
    "jpg-to-pdf-online",
    "pdf-to-png-online",
    "png-to-pdf-online",
    "rotate-pdf-online",
  ].includes(page.slug)
).map((page) => ({
  label: page.h1,
  href: `/${page.slug}`,
}))

const homepageProblemPages = TOOL_PROBLEM_PAGES.filter((page) =>
  [
    "merge-pdf-mac",
    "merge-pdf-offline",
    "compress-pdf-large-files",
    "sign-pdf-online",
    "pdf-to-word-no-upload",
    "make-pdf-searchable",
  ].includes(page.slug)
).map((page) => ({
  label: page.h1,
  href: `/tools/${page.slug}`,
}))

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
    detail: "No upload queue for local operations. Open, process, and download.",
  },
]

const privacyClaims = [
  {
    icon: <Shield className="h-6 w-6" />,
    title: "No uploads",
    description: "Files never leave your device. All processing happens locally in your browser.",
  },
  {
    icon: <Eye className="h-6 w-6" />,
    title: "No ad tracking",
    description: "No advertising trackers or behavioural profiling in core utility workflows.",
  },
  {
    icon: <HardDrive className="h-6 w-6" />,
    title: "Local-first",
    description: "Tools run entirely in your browser using WebAssembly and Web Workers.",
  },
  {
    icon: <Wifi className="h-6 w-6" />,
    title: "Offline capable",
    description: "Most tools work without an internet connection after first load.",
  },
  {
    icon: <Server className="h-6 w-6" />,
    title: "Transparent",
    description: "All source code is available for inspection. Verify our claims yourself.",
  },
  {
    icon: <Lock className="h-6 w-6" />,
    title: "No accounts",
    description: "Use any tool instantly. No sign-up, no email, no personal data required.",
  },
]

const browseCategories = [
  { 
    name: "PDF Tools", 
    href: "/pdf-tools", 
    count: TOOL_CATALOGUE.filter((tool) => tool.available).length,
    description: "Conversion, organisation, and secure document workflows",
    icon: <FileType className="h-5 w-5" />,
  },
  { 
    name: "Image Tools", 
    href: "/image-tools", 
    count: 6,
    description: "PDF image export, image-to-PDF, OCR, and image optimisation",
    icon: <Eye className="h-5 w-5" />,
  },
  { 
    name: "Network Tools", 
    href: "/network-tools", 
    count: 4,
    description: "IP, DNS, latency, and availability diagnostics",
    icon: <Globe className="h-5 w-5" />,
  },
  { 
    name: "File Converters", 
    href: "/file-converters", 
    count: 8,
    description: "Document, spreadsheet, presentation, and text conversion workflows",
    icon: <FileText className="h-5 w-5" />,
  },
  { 
    name: "Status Checker", 
    href: "/status", 
    count: 1,
    description: "Quick website uptime checks for operational issues",
    icon: <Wifi className="h-5 w-5" />,
  },
  { 
    name: "Learn Guides", 
    href: "/learn", 
    count: 25,
    description: "Practical privacy and workflow guides",
    icon: <FileText className="h-5 w-5" />,
  },
  { 
    name: "Compare Pages", 
    href: "/compare", 
    count: 9,
    description: "Fair comparisons against upload-based alternatives",
    icon: <Shield className="h-5 w-5" />,
  },
]

const richSections = [
  {
    name: "Network",
    href: "/network-tools",
    description: "Troubleshoot connectivity, DNS, and uptime questions quickly.",
  },
  {
    name: "File",
    href: "/file-tools",
    description: "Use practical file-conversion workflows without heavy software.",
  },
  {
    name: "Learn",
    href: "/learn",
    description: "Practical guides for private PDF workflows and verification checks.",
  },
  {
    name: "Compare",
    href: "/compare",
    description: "Neutral comparisons against common cloud PDF alternatives.",
  },
  {
    name: "Blog",
    href: "/blog",
    description: "Opinionated but factual writing on privacy, architecture, and PDF handling.",
  },
  {
    name: "Support",
    href: "/support",
    description: "Email-first support and practical help routes for tools and workflows.",
  },
]

const visibilityCards = [
  {
    title: "Open PDF tools",
    description: "Go straight to merge, split, compress, convert, signing, OCR, and security workflows.",
    href: "/tools",
  },
  {
    title: "Check if a site is down",
    description: "Use the site status checker to quickly confirm uptime and response behaviour.",
    href: "/status",
  },
  {
    title: "Learn how to use the tools",
    description: "Step-by-step guides for private workflows, troubleshooting, and verification checks.",
    href: "/learn",
  },
  {
    title: "Compare Plain Tools with cloud alternatives",
    description: "Neutral comparisons focused on privacy trade-offs, workflow fit, and practical constraints.",
    href: "/compare",
  },
]

const trafficClusters = [
  {
    title: "PDF tools cluster",
    description: "Merge, split, compress, convert, sign, OCR, and secure document workflows.",
    href: "/tools",
    links: [
      { label: "Merge PDF locally", href: "/tools/merge-pdf" },
      { label: "Split PDF by pages", href: "/tools/split-pdf" },
    ],
  },
  {
    title: "Status and uptime cluster",
    description: "Check whether a site is down, degraded, or responding slowly right now.",
    href: "/status",
    links: [
      { label: "Check chatgpt.com status", href: "/status/chatgpt.com" },
      { label: "Check reddit.com status", href: "/status/reddit.com" },
    ],
  },
  {
    title: "Network diagnostics cluster",
    description: "Run DNS lookup, IP checks, and latency tests for troubleshooting.",
    href: "/network-tools",
    links: [
      { label: "Run DNS lookup", href: "/dns-lookup" },
      { label: "Measure latency with ping test", href: "/ping-test" },
    ],
  },
  {
    title: "Learn guides cluster",
    description: "Find step-by-step guides for private workflows and practical settings.",
    href: "/learn",
    links: [
      { label: "No uploads explained", href: "/learn/no-uploads-explained" },
      { label: "How to merge PDFs offline", href: "/learn/how-to-merge-pdfs-offline" },
    ],
  },
  {
    title: "Compare alternatives cluster",
    description: "Compare Plain Tools with cloud-first alternatives and workflow trade-offs.",
    href: "/compare",
    links: [
      { label: "Plain Tools vs Smallpdf", href: "/compare/plain-tools-vs-smallpdf" },
      { label: "Offline vs online PDF tools", href: "/compare/offline-vs-online-pdf-tools" },
    ],
  },
]

const firstWaveSections = [
  {
    title: "High-demand tools",
    links: FIRST_WAVE_TOOL_PAGES,
  },
  {
    title: "Status checks",
    links: FIRST_WAVE_STATUS_PAGES,
  },
  {
    title: "Guides",
    links: FIRST_WAVE_GUIDE_PAGES,
  },
  {
    title: "Comparisons",
    links: FIRST_WAVE_COMPARE_PAGES,
  },
]

export default function HomePage() {
  return (
    <>
      {homePageSchema ? (
        <JsonLd id="homepage-schema" schema={homePageSchema} />
      ) : null}
      
      <div className="flex flex-col">
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-border/50">
          <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent" />
          <div className="relative mx-auto max-w-6xl px-4 py-20 md:py-24">
            <h1 className="text-balance text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
              Utility platform for PDF workflows, uptime checks, and network diagnostics.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
              Plain Tools is built for practical, repeat-use utility tasks: document workflows, site-status checks, DNS and IP diagnostics, and trust-focused guides.
            </p>
            <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-4 text-center text-sm font-medium text-green-800 dark:border-green-900/40 dark:bg-green-950/20 dark:text-green-300">
              All core PDF &amp; utility tools 100% free forever - no sign-up, no limits on basic use
            </div>
            
            {/* Intro paragraph for SEO/GEO */}
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground/80">
              Plain Tools gives you practical utilities across PDF processing, website uptime checks,
              DNS and IP diagnostics, and file conversions. Use one platform for day-to-day utility
              work with simple, trustworthy workflows.
            </p>

            {/* Primary CTAs */}
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                href="/tools"
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-6 py-3",
                  "bg-accent text-accent-foreground font-semibold",
                  "shadow-[0_4px_20px_rgba(100,200,180,0.25)]",
                  "transition-all duration-300 hover:shadow-[0_6px_30px_rgba(100,200,180,0.35)] hover:-translate-y-0.5"
                )}
              >
                Explore tools directory
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/site-status"
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-6 py-3",
                  "bg-card border border-white/[0.12] text-foreground font-semibold",
                  "shadow-[0_4px_24px_rgba(0,0,0,0.5)]",
                  "transition-all duration-300 hover:border-white/20 hover:-translate-y-0.5"
                )}
              >
                Check site status
              </Link>
              <Link
                href="/network-tools"
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-6 py-3",
                  "bg-card border border-white/[0.12] text-foreground font-semibold",
                  "shadow-[0_4px_24px_rgba(0,0,0,0.5)]",
                  "transition-all duration-300 hover:border-white/20 hover:-translate-y-0.5"
                )}
              >
                Open network tools
              </Link>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Core PDF tools stay free and are designed for practical day-to-day workflows.
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <Link
                href="/pdf-tools"
                className="text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                PDF tools
              </Link>
              <Link
                href="/file-converters"
                className="text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                File converters
              </Link>
              <Link
                href="/image-tools"
                className="text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                Image tools
              </Link>
              <Link
                href="/network-tools"
                className="text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                Network tools
              </Link>
              <Link
                href="/learn"
                className="text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                Learn how it works
              </Link>
              <Link
                href="/compare"
                className="text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                Compare alternatives
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-2">
              {["Sensitive documents", "Uptime triage", "Network diagnostics", "File conversion workflows"].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/[0.12] bg-card px-3 py-1.5 text-xs text-muted-foreground"
                >
                  Best for {item}
                </span>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              <Link href="/sign-pdf-online" className="rounded-full border border-border bg-card px-3 py-1.5 text-muted-foreground transition hover:border-accent/40 hover:text-accent">
                Sign PDF online
              </Link>
              <Link href="/protect-pdf-with-password" className="rounded-full border border-border bg-card px-3 py-1.5 text-muted-foreground transition hover:border-accent/40 hover:text-accent">
                Protect PDF with password
              </Link>
              <Link href="/compare-pdf-files" className="rounded-full border border-border bg-card px-3 py-1.5 text-muted-foreground transition hover:border-accent/40 hover:text-accent">
                Compare PDF files
              </Link>
              <Link href="/ocr-pdf" className="rounded-full border border-border bg-card px-3 py-1.5 text-muted-foreground transition hover:border-accent/40 hover:text-accent">
                OCR PDF
              </Link>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm">
              <Link
                href="/verify-claims"
                className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                Verify local processing claims
              </Link>
              <Link
                href="/learn"
                className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                Browse learn guides
              </Link>
              <Link
                href="/compare"
                className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                Compare alternatives
              </Link>
              <Link
                href="/status"
                className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                Use site status checker
              </Link>
              <Link
                href="/blog"
                className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                Read the blog
              </Link>
              <Link
                href="/support"
                className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                Contact support
              </Link>
              <Link
                href="https://github.com/Drgblack/plain-tools"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                View source on GitHub
              </Link>
            </div>
          </div>
        </section>

        <section className="border-b border-border/50">
          <div className="mx-auto max-w-6xl px-4 py-12 md:py-14">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Most Popular Tools
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
                Jump straight into the PDF and status workflows people use most often on Plain Tools.
                These links are crawlable, server-rendered entry points for common day-to-day tasks.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {homepageMostPopularTools.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="group rounded-xl border border-border bg-card/40 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:bg-card/60 hover:shadow-[0_20px_60px_-36px_rgba(100,200,180,0.45)]"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-accent/20 bg-accent/10 text-accent">
                    {tool.icon}
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-foreground">{tool.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {tool.description}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent">
                    Open tool
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </span>
                </Link>
              ))}
            </div>
            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Popular PDF searches
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {homepageSeoToolLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground transition hover:border-accent/40 hover:text-accent"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Problem-led PDF routes
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {homepageProblemPages.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground transition hover:border-accent/40 hover:text-accent"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-border/50 px-4 py-6 md:py-8">
          <div className="mx-auto max-w-6xl">
            <ProofStrip points={homepageProofPoints} />
          </div>
        </section>

        <AdLayout placement="homepage_content_top" />

        <section className="border-b border-border/50">
          <div className="mx-auto max-w-6xl px-4 py-12 md:py-14">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Start with a high-demand cluster
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
                Use these entry points to reach high-traffic utility workflows quickly and move between related pages.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {trafficClusters.map((cluster) => (
                <article key={cluster.title} className="rounded-xl border border-border bg-card/35 p-5">
                  <Link href={cluster.href} className="text-base font-semibold text-foreground hover:text-accent hover:underline">
                    {cluster.title}
                  </Link>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{cluster.description}</p>
                  <ul className="mt-3 space-y-2">
                    {cluster.links.map((link) => (
                      <li key={link.href}>
                        <Link href={link.href} className="text-xs font-medium text-accent transition hover:underline">
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-border/50">
          <div className="mx-auto max-w-6xl px-4 py-12 md:py-14">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Trending outage checks
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
                Live popularity signals from anonymous aggregate status checks. Use this to jump
                straight into high-demand outage pages.
              </p>
            </div>
            <TrendingStatus title="Most checked status pages today" limit={8} />
            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              <Link href="/is-chatgpt-down" className="rounded-full border border-border bg-card px-3 py-1.5 text-muted-foreground transition hover:border-accent/40 hover:text-accent">
                Is ChatGPT down?
              </Link>
              <Link href="/is-discord-down" className="rounded-full border border-border bg-card px-3 py-1.5 text-muted-foreground transition hover:border-accent/40 hover:text-accent">
                Is Discord down?
              </Link>
              <Link href="/is-youtube-down" className="rounded-full border border-border bg-card px-3 py-1.5 text-muted-foreground transition hover:border-accent/40 hover:text-accent">
                Is YouTube down?
              </Link>
              <Link href="/is-github-down" className="rounded-full border border-border bg-card px-3 py-1.5 text-muted-foreground transition hover:border-accent/40 hover:text-accent">
                Is GitHub down?
              </Link>
            </div>
            <div className="mt-4 flex flex-wrap gap-4">
              <Link href="/status" className="text-sm font-medium text-accent hover:underline">
                Open status directory
              </Link>
              <Link href="/status/trending" className="text-sm font-medium text-accent hover:underline">
                Open full trending status list
              </Link>
            </div>
          </div>
        </section>

        <section className="border-b border-border/50">
          <div className="mx-auto max-w-6xl px-4 py-12 md:py-14">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                First-wave traffic pages
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
                These pages are prioritised for high-intent utility queries and early traffic growth.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {firstWaveSections.map((section) => (
                <article key={section.title} className="rounded-xl border border-border bg-card/35 p-5">
                  <h3 className="text-sm font-semibold text-foreground">{section.title}</h3>
                  <ul className="mt-3 space-y-2">
                    {section.links.map((link) => (
                      <li key={link.href}>
                        <Link href={link.href} className="text-xs font-medium text-accent transition hover:underline">
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-border/50">
          <div className="mx-auto max-w-6xl px-4 py-14 md:py-16">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {visibilityCards.map((card) => (
                <Link
                  key={card.href}
                  href={card.href}
                  className="group rounded-xl border border-border bg-card/40 p-5 transition hover:border-accent/40"
                >
                  <h2 className="text-lg font-semibold tracking-tight text-foreground">{card.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{card.description}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-accent">
                    Open
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <AdLayout placement="homepage_content_bottom" />

        <section className="border-b border-border/50 px-4 py-8">
          <div className="mx-auto flex max-w-6xl flex-col gap-3 rounded-xl border border-border bg-card/35 p-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              Looking for calculators or time-conversion utilities? Visit our sister projects.
            </p>
            <div className="flex flex-wrap gap-2 text-sm">
              <Link
                href="https://plainfigures.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-border bg-background px-3 py-1.5 text-muted-foreground transition hover:border-accent/40 hover:text-accent"
              >
                Plain Figures - calculator-focused sister site
              </Link>
              <Link
                href="https://timemeaning.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-border bg-background px-3 py-1.5 text-muted-foreground transition hover:border-accent/40 hover:text-accent"
              >
                TimeMeaning - time and timezone clarity
              </Link>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="border-b border-border/50">
          <div className="mx-auto max-w-6xl px-4 py-16 md:py-18">
            <div className="mb-10">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Categories
              </h2>
              <p className="mt-2 text-muted-foreground">
                Start with a clear task, then jump straight into a working tool.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
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

        {/* Site Sections */}
        <section className="border-b border-border/50">
          <div className="mx-auto max-w-6xl px-4 py-14 md:py-16">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Explore Plain Tools
              </h2>
              <p className="mt-2 max-w-3xl text-muted-foreground">
                Move between practical utility hubs quickly: network diagnostics, file workflows,
                PDF processing, trusted documentation, and support routes.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {richSections.map((section) => (
                <Link key={section.name} href={section.href} className="group block rounded-xl border border-white/[0.1] bg-card/40 p-4 transition hover:border-accent/40">
                  <h3 className="text-base font-semibold text-foreground">{section.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{section.description}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-accent">
                    Open
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-3 text-sm">
              <Link href="/roadmap" className="text-muted-foreground hover:text-foreground hover:underline">
                Public roadmap
              </Link>
              <Link href="/changelog" className="text-muted-foreground hover:text-foreground hover:underline">
                Changelog
              </Link>
              <Link href="/sitemap" className="text-muted-foreground hover:text-foreground hover:underline">
                HTML sitemap
              </Link>
            </div>
          </div>
        </section>

        {/* Popular Tools Section */}
        <section className="border-b border-border/50">
          <div className="mx-auto max-w-6xl px-4 py-16 md:py-18">
            <div className="mb-10">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Popular Tools
              </h2>
              <p className="mt-2 text-muted-foreground">
                Most used utilities across the platform
              </p>
              <p className="mt-3 max-w-3xl text-sm text-muted-foreground">
                Core local tools are free to use for everyday PDF, file, and network tasks.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {popularTools.map((tool) => (
                <ToolCard
                  key={tool.name}
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

        {/* Browse All Tools Section */}
        <section id="tools" className="border-b border-border/50">
          <div className="mx-auto max-w-6xl px-4 py-16 md:py-18">
            <div className="mb-10">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Browse Major Sections
              </h2>
              <p className="mt-2 text-muted-foreground">
                Jump into the part of the platform you need right now
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {browseCategories.map((category) => (
                <Link
                  key={category.name}
                  href={category.href}
                  className="group block"
                >
                  <Surface interactive className="h-full">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.08] text-foreground ring-1 ring-white/[0.12]">
                      {category.icon}
                    </div>
                    <div className="mt-4">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground">{category.name}</h3>
                        <span className="rounded-full bg-white/[0.08] px-2 py-0.5 text-xs font-medium text-muted-foreground ring-1 ring-white/[0.12]">
                          {category.count} tools
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">{category.description}</p>
                    </div>
                    <div className="mt-5 pt-4 border-t border-white/[0.08]">
                      <span className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-4 py-2",
                        "bg-white/[0.08] text-sm font-semibold text-muted-foreground ring-1 ring-white/[0.12]",
                        "transition-all duration-300 group-hover:bg-accent group-hover:text-accent-foreground group-hover:ring-accent/40"
                      )}>
                        Open section
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </Surface>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Privacy Section */}
        <section>
          <div className="mx-auto max-w-6xl px-4 py-16 md:py-18">
            <div className="mb-10">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Verifiable Privacy
              </h2>
              <p className="mt-2 text-muted-foreground">
                Privacy by architecture, not policy. Verify our claims yourself.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {privacyClaims.map((claim) => (
                <Surface key={claim.title}>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.08] text-foreground ring-1 ring-white/[0.12]">
                    {claim.icon}
                  </div>
                  <h3 className="mt-5 font-semibold text-foreground">
                    {claim.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {claim.description}
                  </p>
                </Surface>
              ))}
            </div>

            <div className="mt-10 flex justify-center">
              <Link
                href="/verify-claims"
                className={cn(
                  "group inline-flex items-center gap-2 rounded-full px-6 py-3",
                  "bg-card border border-white/[0.14]",
                  "shadow-[0_4px_24px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.04)]",
                  "text-sm font-semibold text-muted-foreground",
                  "transition-all duration-300 hover:border-accent/50 hover:text-foreground hover:-translate-y-0.5"
                )}
              >
                View source to verify claims
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* What is Plain Tools - SEO/GEO section */}
        <section className="border-t border-border/50">
          <div className="mx-auto max-w-6xl px-4 py-14 md:py-16">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              What is Plain Tools?
            </h2>
            <div className="mt-4 max-w-3xl space-y-4 text-sm leading-relaxed text-muted-foreground">
              <p>
                Plain Tools is a trust-first collection of browser utilities for everyday tasks
                such as PDF workflows, file conversion, network diagnostics, and uptime checks. Core local tools
                run locally on your device without uploading files to external servers.
              </p>
              <p>
                Unlike traditional online tools that process your files on remote servers, 
                Plain Tools uses modern web technologies like WebAssembly and Web Workers to 
                perform all operations directly in your browser. This means your sensitive 
                documents, images, and data never leave your device.
              </p>
              <p>
                Every tool is designed with three principles: speed (no upload/download delays), 
                privacy (no server-side processing), and transparency (open source and verifiable). 
                Whether you need to compress a PDF, check whether a website is down, look up DNS records, or convert file formats,
                Plain Tools provides fast, secure, and completely private solutions.
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}


