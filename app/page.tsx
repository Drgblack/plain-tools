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
import { CategoryTile } from "@/components/category-tile"
import { ProofStrip } from "@/components/proof-strip"
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

// Homepage has explicit canonical URL
export const metadata: Metadata = buildPageMetadata({
  title: "Offline PDF, file and network tools",
  description:
    "Access 43+ offline PDF tools, file converters, network diagnostics, and more on Plain Tools. Core workflows run locally with no uploads and no tracking.",
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
    href: "/file-tools",
    icon: <FileText className="h-6 w-6" />,
    toolCount: 4,
  },
  {
    name: "Work with PDFs",
    description: "Merge, split, compress, convert, OCR, and sign PDFs locally in your browser",
    href: "/tools",
    icon: <FileType className="h-6 w-6" />,
    toolCount: TOOL_CATALOGUE.filter((tool) => tool.available).length,
  },
  {
    name: "Check Site Status",
    description: "Check whether a website is down, reachable, and responding in real time",
    href: "/site-status",
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
    href: "/tools", 
    count: TOOL_CATALOGUE.filter((tool) => tool.available).length,
    description: "Conversion, organisation, and secure document workflows",
    icon: <FileType className="h-5 w-5" />,
  },
  { 
    name: "Network Tools", 
    href: "/network-tools", 
    count: 4,
    description: "IP, DNS, latency, and availability diagnostics",
    icon: <Globe className="h-5 w-5" />,
  },
  { 
    name: "File Tools", 
    href: "/file-tools", 
    count: 4,
    description: "Browser-based file conversion and handling utilities",
    icon: <FileText className="h-5 w-5" />,
  },
  { 
    name: "Status Checker", 
    href: "/site-status", 
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
    name: "Pricing",
    href: "/pricing",
    description: "Core local tools are free. See pricing for advanced and upcoming Pro features.",
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
    href: "/site-status",
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
              Trust-first utility tools for documents, files, networks, and uptime checks.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
              Plain Tools combines practical PDF workflows with network diagnostics and status tools. Privacy-first handling where relevant, with verifiable behaviour.
            </p>
            
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
                Explore PDF tools
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
                href="/learn"
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-6 py-3",
                  "bg-card border border-white/[0.12] text-foreground font-semibold",
                  "shadow-[0_4px_24px_rgba(0,0,0,0.5)]",
                  "transition-all duration-300 hover:border-white/20 hover:-translate-y-0.5"
                )}
              >
                Read practical guides
              </Link>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Core PDF tools stay free. See{" "}
              <Link href="/pricing" className="font-medium text-accent hover:underline">
                pricing
              </Link>{" "}
              for advanced and upcoming Pro features.
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <Link
                href="/network-tools"
                className="text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                Network tools
              </Link>
              <Link
                href="/file-tools"
                className="text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                File tools
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
                href="/site-status"
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

        <section className="border-b border-border/50 px-4 py-6 md:py-8">
          <div className="mx-auto max-w-6xl">
            <ProofStrip points={homepageProofPoints} />
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
                Core local tools are free to use. See{" "}
                <Link href="/pricing" className="text-accent hover:underline">
                  pricing
                </Link>{" "}
                for advanced and upcoming Pro capabilities.
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
