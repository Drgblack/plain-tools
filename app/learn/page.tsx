"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import Script from "next/script"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { TiltCard } from "@/components/ui/tilt-card"
import { FocusedSearch } from "@/components/ui/focused-search"
import { SummaryBox, KeyTerm } from "@/components/seo"
import {
  Clock,
  ArrowRight,
  Blocks,
  Zap,
  EyeOff,
  WifiOff,
  HardDrive,
  AlertTriangle,
  Shield,
  Cpu,
  Lock,
  FileText,
  Sparkles,
  BookOpen
} from "lucide-react"

// Structured data for the Learning Centre collection
const collectionSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Plain Learning Centre",
  description: "Comprehensive guides on WebAssembly, hardware acceleration, document redaction, offline workflows, and privacy-first PDF processing.",
  url: "https://plain.tools/learn",
  isPartOf: {
    "@type": "WebSite",
    name: "Plain",
    url: "https://plain.tools",
  },
  about: [
    { "@type": "Thing", name: "WebAssembly" },
    { "@type": "Thing", name: "WebGPU" },
    { "@type": "Thing", name: "Document Processing" },
    { "@type": "Thing", name: "Privacy" },
    { "@type": "Thing", name: "Client-Side Processing" },
  ],
  inLanguage: "en-GB",
}

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://plain.tools/" },
    { "@type": "ListItem", position: 2, name: "Learn", item: "https://plain.tools/learn" },
  ],
}

const combinedSchema = {
  "@context": "https://schema.org",
  "@graph": [
    { ...collectionSchema, "@context": undefined },
    { ...breadcrumbSchema, "@context": undefined },
  ],
}

// All articles organised by section
const sections = [
  {
    id: "core-privacy",
    title: "Core Privacy",
    description: "Foundational concepts for understanding data privacy in document processing.",
    articles: [
      {
        title: "Privacy 101",
        summary: "Why uploading sensitive documents is a security risk. The hidden dangers of cloud-based PDF tools.",
        href: "/learn/why-pdf-uploads-are-risky",
        category: "Security",
        readTime: "5 min",
        icon: AlertTriangle,
      },
      {
        title: "Wasm vs. Cloud Security",
        summary: "Comparing WebAssembly local processing with traditional cloud-based approaches to document security.",
        href: "/learn/wasm-vs-cloud-security",
        category: "Security",
        readTime: "6 min",
        icon: Shield,
      },
      {
        title: "Online vs Offline PDF Tools",
        summary: "A neutral comparison of server-based and client-side approaches to document processing.",
        href: "/learn/online-vs-offline-pdf-tools",
        category: "Comparison",
        readTime: "5 min",
        icon: FileText,
      },
    ],
  },
  {
    id: "technical-deep-dives",
    title: "Technical Deep Dives",
    description: "In-depth explorations of the technologies powering local document processing.",
    articles: [
      {
        title: "WebAssembly Explained",
        summary: "How your data stays in-browser. Understand the technology that enables near-native performance.",
        href: "/learn/client-side-processing",
        category: "Hardware",
        readTime: "5 min",
        icon: Blocks,
      },
      {
        title: "WebGPU Hardware Acceleration",
        summary: "Using WebGPU for local AI. How Plain leverages your device's GPU for document analysis.",
        href: "/learn/hardware-acceleration",
        category: "Hardware",
        readTime: "6 min",
        icon: Zap,
      },
      {
        title: "RAM Management for Large PDFs",
        summary: "Techniques for processing 500MB+ documents efficiently without overwhelming system memory.",
        href: "/learn/ram-optimisation",
        category: "Tutorial",
        readTime: "4 min",
        icon: HardDrive,
      },
      {
        title: "Local AI Processing",
        summary: "How WebGPU and WebLLM enable AI-powered features without sending data to external servers.",
        href: "/learn/local-ai-processing",
        category: "Hardware",
        readTime: "7 min",
        icon: Sparkles,
      },
    ],
  },
  {
    id: "security-masterclasses",
    title: "Security Masterclasses",
    description: "Advanced guides for professionals handling sensitive documents.",
    articles: [
      {
        title: "Permanent Redaction Techniques",
        summary: "Ensuring permanent data removal. A comprehensive guide to securely redacting sensitive information.",
        href: "/learn/redaction-guide",
        category: "Security",
        readTime: "7 min",
        icon: EyeOff,
      },
      {
        title: "Offline Workflows",
        summary: "Using Plain in high-security environments. Best practices for air-gapped systems and secure facilities.",
        href: "/learn/offline-workflows",
        category: "Security",
        readTime: "5 min",
        icon: WifiOff,
      },
      {
        title: "Verifying Local Processing",
        summary: "How to confirm that your files never leave your device using browser DevTools.",
        href: "/learn/verify-offline-processing",
        category: "Tutorial",
        readTime: "6 min",
        icon: Lock,
      },
      {
        title: "Encryption Best Practices",
        summary: "Understanding AES-256 local encryption and how to protect sensitive documents on-device.",
        href: "/learn/encryption-best-practices",
        category: "Security",
        readTime: "5 min",
        icon: Shield,
      },
    ],
  },
]

// Flatten all articles for search
const allArticles = sections.flatMap(section => 
  section.articles.map(article => ({ ...article, sectionId: section.id, sectionTitle: section.title }))
)

function getCategoryStyles(category: string) {
  switch (category.toLowerCase()) {
    case "hardware":
      return "bg-[#0070f3]/10 text-[#0070f3] border-[#0070f3]/30"
    case "security":
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
    case "tutorial":
      return "bg-amber-500/10 text-amber-400 border-amber-500/30"
    case "comparison":
      return "bg-violet-500/10 text-violet-400 border-violet-500/30"
    default:
      return "bg-white/5 text-white/70 border-white/20"
  }
}

export default function LearnPage() {
  const [searchQuery, setSearchQuery] = useState("")
  
  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return sections
    
    const query = searchQuery.toLowerCase()
    return sections.map(section => ({
      ...section,
      articles: section.articles.filter(article =>
        article.title.toLowerCase().includes(query) ||
        article.summary.toLowerCase().includes(query) ||
        article.category.toLowerCase().includes(query)
      )
    })).filter(section => section.articles.length > 0)
  }, [searchQuery])

  const totalResults = filteredSections.reduce((acc, section) => acc + section.articles.length, 0)

  return (
    <div className="flex min-h-screen flex-col bg-[#000]">
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(combinedSchema) }}
      />
      <Header />

      <main className="flex-1">
        {/* Hero Section - Compact */}
        <section className="relative px-4 py-14 md:py-18 border-b border-[#333]">
          {/* Geometric grid background */}
          <div className="pointer-events-none absolute inset-0 hero-grid-pattern opacity-30" />
          
          <div className="relative mx-auto max-w-5xl">
            <div className="mb-3 inline-flex items-center rounded-full bg-[#0070f3]/10 px-3 py-1.5 border border-[#0070f3]/30">
              <Cpu className="mr-2 h-3.5 w-3.5 text-[#0070f3]" strokeWidth={2} />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#0070f3]">
                Knowledge Base
              </span>
            </div>
            <h1 className="text-[28px] font-bold tracking-tight text-white md:text-[36px]">
              Learning Centre
            </h1>
            <p className="mt-3 max-w-2xl text-[14px] leading-relaxed text-white/60">
              Comprehensive guides on WebAssembly, hardware acceleration, document security, 
              and privacy-first PDF processing.
            </p>
            
            {/* GEO-Optimised Summary for AI Crawlers */}
            <SummaryBox className="mt-6 max-w-2xl text-start">
              The <KeyTerm>Plain Learning Centre</KeyTerm> provides technical documentation on browser-based PDF processing. 
              Topics include <KeyTerm>WebAssembly</KeyTerm> for local document manipulation, <KeyTerm>WebGPU</KeyTerm> for AI-powered features, 
              permanent redaction techniques, and optimising large file handling in RAM-constrained environments.
            </SummaryBox>
            
  {/* Search Bar with Focus Dim */}
  <div className="mt-6 max-w-xl">
    <FocusedSearch
      value={searchQuery}
      onChange={setSearchQuery}
      placeholder="Search privacy guides and tutorials..."
      className="w-full"
    />
    {searchQuery && (
      <p className="mt-2 text-[12px] text-white/40">
        {totalResults} result{totalResults !== 1 ? 's' : ''}
      </p>
    )}
  </div>
          </div>
        </section>

        {/* Content Sections */}
        <div className="px-4 py-12 md:py-16">
          <div className="mx-auto max-w-5xl space-y-16">
            {filteredSections.map((section) => (
              <section key={section.id} id={section.id} aria-labelledby={`${section.id}-heading`}>
                {/* Section header */}
                <div className="mb-6 border-b border-[#333] pb-4">
                  <h2 id={`${section.id}-heading`} className="text-[20px] font-bold tracking-tight text-white">
                    {section.title}
                  </h2>
                  <p className="mt-1 text-[13px] text-white/50">
                    {section.description}
                  </p>
                </div>
                
                {/* Article cards - High density grid */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
  {section.articles.map((article) => (
  <TiltCard key={article.title} className="h-full" tiltIntensity={8} glowOnHover>
  <Link
  href={article.href}
  className="group block h-full outline-none focus-visible:ring-2 focus-visible:ring-[#0070f3] focus-visible:ring-offset-2 focus-visible:ring-offset-[#000] rounded-lg"
  >
  <article className="relative h-full rounded-lg bg-[#111] border border-[#333] p-5 transition-all duration-150">
                        {/* Top row: Category + Read time */}
                        <div className="mb-3 flex items-center justify-between">
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider border ${getCategoryStyles(article.category)}`}>
                            {article.category}
                          </span>
                          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-white/40">
                            <Clock className="h-3 w-3" strokeWidth={2} />
                            {article.readTime}
                          </span>
                        </div>
                        
                        {/* Icon + Title */}
                        <div className="mb-2 flex items-start gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#0070f3]/10 border border-[#0070f3]/20 transition-all duration-300 group-hover:bg-[#0070f3]/20 group-hover:border-[#0070f3]/40">
                            <article.icon className="h-4 w-4 text-[#0070f3]" strokeWidth={1.75} />
                          </div>
                          <h3 className="text-[14px] font-semibold text-white leading-tight transition-colors duration-200 group-hover:text-[#0070f3]">
                            {article.title}
                          </h3>
                        </div>
                        
                        {/* Summary - Two lines */}
                        <p className="text-[12px] leading-[1.6] text-white/50 line-clamp-2">
                          {article.summary}
                        </p>
                        
                        {/* Learn More link */}
                        <div className="mt-4 flex items-center gap-1">
                          <span className="relative text-[12px] font-medium text-[#0070f3]/70 transition-colors duration-200 group-hover:text-[#0070f3]">
                            Learn more
                            <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-[#0070f3] transition-all duration-300 group-hover:w-full" />
                          </span>
                          <ArrowRight className="h-3 w-3 text-[#0070f3]/50 transition-all duration-200 group-hover:text-[#0070f3] group-hover:translate-x-0.5" strokeWidth={2} />
                        </div>
  </article>
  </Link>
  </TiltCard>
  ))}
                </div>
              </section>
            ))}
            
            {/* No results */}
            {filteredSections.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Search className="mb-4 h-10 w-10 text-white/20" strokeWidth={1.5} />
                <p className="text-[15px] font-medium text-white/60">No articles found matching &ldquo;{searchQuery}&rdquo;</p>
                <button
                  onClick={() => setSearchQuery("")}
                  className="mt-3 text-[13px] font-medium text-[#0070f3] hover:underline"
                >
                  Clear search
                </button>
              </div>
            )}
          </div>
        </div>

{/* Technical Glossary Card */}
  <section className="border-t border-[#333] px-4 py-10">
    <div className="mx-auto max-w-5xl">
      <Link
        href="/learn/glossary"
        className="group flex items-center gap-5 rounded-xl border border-[#333] bg-[#111] p-6 transition-all duration-300 hover:border-[#0070f3]/50 hover:shadow-[0_0_30px_rgba(0,112,243,0.1)]"
      >
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#0070f3]/10 ring-1 ring-[#0070f3]/25 transition-all group-hover:bg-[#0070f3]/15">
          <BookOpen className="h-7 w-7 text-[#0070f3]" strokeWidth={1.5} />
        </div>
        <div className="flex-1">
          <h3 className="text-[16px] font-semibold text-white group-hover:text-[#0070f3] transition-colors">
            Technical Glossary
          </h3>
          <p className="mt-1 text-[13px] text-white/50">
            A-Z reference of privacy-first terminology: WebAssembly, WebGPU, browser sandboxing, and more.
          </p>
        </div>
        <ArrowRight className="h-5 w-5 text-white/30 transition-all group-hover:text-[#0070f3] group-hover:translate-x-1" strokeWidth={1.5} />
      </Link>
    </div>
  </section>

  {/* Quick Links Footer */}
  <nav aria-label="Related pages" className="border-t border-[#333] bg-[#0a0a0a] px-4 py-10">
  <div className="mx-auto max-w-5xl">
  <div className="flex flex-wrap items-center justify-center gap-3">
  <span className="text-[11px] font-semibold uppercase tracking-wider text-white/30 mr-3">
  Quick Links
              </span>
              {[
                { label: "Home", href: "/" },
                { label: "Tools", href: "/tools" },
                { label: "Labs", href: "/labs" },
                { label: "Verification", href: "/verify-claims" },
                { label: "Privacy Policy", href: "/privacy" },
              ].map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="inline-flex items-center rounded-md bg-[#111] px-3 py-1.5 text-[12px] font-medium text-white/70 border border-[#333] transition-all duration-200 hover:border-[#0070f3] hover:text-white hover:shadow-[0_0_8px_rgba(0,112,243,0.15)]"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </nav>
      </main>

      <Footer />
    </div>
  )
}
