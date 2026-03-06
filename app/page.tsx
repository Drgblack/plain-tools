import type { Metadata } from "next"
import {
  Globe,
  FileText,
  FileType,
  Calculator,
  Shield,
  Wifi,
  Eye,
  Server,
  HardDrive,
  CheckCircle,
  Lock,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"
import { CategoryTile } from "@/components/category-tile"
import { ToolCard } from "@/components/tool-card"
import { Surface } from "@/components/surface"
import { cn } from "@/lib/utils"
import { TOOL_CATALOGUE } from "@/lib/tools-catalogue"

// Homepage has explicit canonical URL
export const metadata: Metadata = {
  title: "Private PDF Tools That Run in Your Browser | Plain.tools",
  description:
    "Use Plain.tools for private PDF workflows: merge, split, compress, convert, OCR, and signing. Processed locally in your browser with no uploads.",
  alternates: {
    canonical: "https://plain.tools",
  },
  openGraph: {
    title: "Private PDF Tools That Run in Your Browser | Plain.tools",
    description:
      "Calm, practical PDF tools for sensitive documents. Processed locally in your browser with no file uploads.",
    url: "https://plain.tools",
    images: [
      {
        url: "/og/default.png",
        width: 1200,
        height: 630,
        alt: "Plain.tools homepage preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Private PDF Tools That Run in Your Browser | Plain.tools",
    description:
      "Merge, split, convert, and sign PDFs locally in your browser. No uploads.",
    images: ["/og/default.png"],
  },
}

// JSON-LD Schema for homepage
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Plain.tools',
  description: 'Plain.tools is a privacy-first collection of PDF and browser tools that run locally on your device without uploading files to external servers.',
  url: 'https://plain.tools',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  featureList: [
    'No file uploads - all processing happens locally',
    'No tracking or analytics',
    'Works offline after first load',
    'Open source and verifiable',
  ],
}

const categories = [
  {
    name: "Network Tools",
    description: "IP lookup, DNS queries, connectivity tests, and network diagnostics",
    href: "/network-tools",
    icon: <Globe className="h-6 w-6" />,
    toolCount: 4,
  },
  {
    name: "File Tools",
    description: "Convert, compress, and transform files in your browser",
    href: "/file-tools",
    icon: <FileText className="h-6 w-6" />,
    toolCount: 3,
  },
  {
    name: "PDF Tools",
    description: "Merge, split, compress, convert, OCR, and sign PDFs locally",
    href: "/tools",
    icon: <FileType className="h-6 w-6" />,
    toolCount: TOOL_CATALOGUE.filter((tool) => tool.available).length,
  },
  {
    name: "Calculators",
    description: "Financial, scientific, and utility calculators",
    href: "https://plainfigures.org",
    icon: <Calculator className="h-6 w-6" />,
    external: true,
  },
]

const popularTools = [
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
    name: "PDF to Word",
    description: "Convert PDF text to Word locally with best-effort layout retention",
    href: "/tools/pdf-to-word",
    tags: ["Local", "Convert"],
    icon: <FileText className="h-5 w-5" />,
  },
  {
    name: "Word to PDF",
    description: "Convert DOCX files to PDF in your browser",
    href: "/tools/word-to-pdf",
    tags: ["Local", "Convert"],
    icon: <FileText className="h-5 w-5" />,
  },
  {
    name: "JPG to PDF",
    description: "Combine image files into one PDF locally",
    href: "/tools/jpg-to-pdf",
    tags: ["Local", "Convert"],
    icon: <FileText className="h-5 w-5" />,
  },
  {
    name: "Sign PDF",
    description: "Place a visual signature without uploading your document",
    href: "/tools/sign-pdf",
    tags: ["Local", "Secure"],
    icon: <Lock className="h-5 w-5" />,
  },
]

const trustBadges = [
  { icon: <Lock className="h-4 w-4" />, label: "Processed locally" },
  { icon: <Shield className="h-4 w-4" />, label: "No uploads" },
  { icon: <Eye className="h-4 w-4" />, label: "No tracking" },
  { icon: <CheckCircle className="h-4 w-4" />, label: "Verifiable claims" },
]

const privacyClaims = [
  {
    icon: <Shield className="h-6 w-6" />,
    title: "No uploads",
    description: "Files never leave your device. All processing happens locally in your browser.",
  },
  {
    icon: <Eye className="h-6 w-6" />,
    title: "No tracking",
    description: "No analytics, no cookies, no fingerprinting. We don't know who you are.",
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
    name: "All PDF Tools", 
    href: "/tools", 
    count: TOOL_CATALOGUE.filter((tool) => tool.available).length,
    description: "Browse all conversion, organisation, and security workflows",
    icon: <FileType className="h-5 w-5" />,
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

export default function HomePage() {
  return (
    <>
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="flex flex-col">
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-border/50">
          <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent" />
          <div className="relative mx-auto max-w-6xl px-4 py-24 md:py-32">
            <h1 className="text-balance text-4xl font-semibold tracking-tight text-foreground md:text-5xl lg:text-6xl">
              Private PDF tools that run in your browser.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl">
              Process sensitive files locally, without upload queues or account friction.
            </p>
            
            {/* Intro paragraph for SEO/GEO */}
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground/80">
              Plain.tools gives you practical PDF workflows for conversion, organisation, signing, and
              cleanup. Files are processed on your own device, so you can keep control of confidential
              documents and verify behaviour with DevTools.
            </p>

            {/* Primary CTAs */}
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="/tools"
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-6 py-3",
                  "bg-accent text-accent-foreground font-semibold",
                  "shadow-[0_4px_20px_rgba(100,200,180,0.25)]",
                  "transition-all duration-300 hover:shadow-[0_6px_30px_rgba(100,200,180,0.35)] hover:-translate-y-0.5"
                )}
              >
                Open PDF Tools
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="#tools"
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-6 py-3",
                  "bg-card border border-white/[0.12] text-foreground font-semibold",
                  "shadow-[0_4px_24px_rgba(0,0,0,0.5)]",
                  "transition-all duration-300 hover:border-white/20 hover:-translate-y-0.5"
                )}
              >
                Browse all tools
              </Link>
            </div>

            {/* Trust Strip */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              {trustBadges.map((badge) => (
                <div
                  key={badge.label}
                  className="flex items-center gap-2 rounded-full border border-white/[0.12] bg-card px-4 py-2 text-sm text-muted-foreground shadow-[0_2px_12px_rgba(0,0,0,0.3)]"
                >
                  {badge.icon}
                  <span>{badge.label}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-2">
              {["Legal files", "HR records", "Finance packs", "School and admin paperwork"].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/[0.12] bg-card px-3 py-1.5 text-xs text-muted-foreground"
                >
                  Best for {item}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="border-b border-border/50">
          <div className="mx-auto max-w-6xl px-4 py-20">
            <div className="mb-10">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                Categories
              </h2>
              <p className="mt-2 text-muted-foreground">
                Browse tools by type
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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

        {/* Popular Tools Section */}
        <section className="border-b border-border/50">
          <div className="mx-auto max-w-6xl px-4 py-20">
            <div className="mb-10">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                Popular Tools
              </h2>
              <p className="mt-2 text-muted-foreground">
                Most used tools across all categories
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
          <div className="mx-auto max-w-6xl px-4 py-20">
            <div className="mb-10">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                Browse All Tools
              </h2>
              <p className="mt-2 text-muted-foreground">
                Explore our complete collection
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-3">
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
                        Explore tools
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
          <div className="mx-auto max-w-6xl px-4 py-20">
            <div className="mb-10">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground">
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
          <div className="mx-auto max-w-6xl px-4 py-16">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              What is Plain.tools?
            </h2>
            <div className="mt-4 max-w-3xl space-y-4 text-sm leading-relaxed text-muted-foreground">
              <p>
                Plain.tools is a privacy-first collection of browser utilities for everyday tasks 
                such as file conversion, networking diagnostics, and developer tools. All tools 
                run locally on your device without uploading files to external servers.
              </p>
              <p>
                Unlike traditional online tools that process your files on remote servers, 
                Plain.tools uses modern web technologies like WebAssembly and Web Workers to 
                perform all operations directly in your browser. This means your sensitive 
                documents, images, and data never leave your device.
              </p>
              <p>
                Every tool is designed with three principles: speed (no upload/download delays), 
                privacy (no server-side processing), and transparency (open source and verifiable). 
                Whether you need to compress a PDF, look up DNS records, or convert file formats, 
                Plain Tools provides fast, secure, and completely private solutions.
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
