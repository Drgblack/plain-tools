"use client"

import { useState } from "react"
import Link from "next/link"
import Script from "next/script"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { SummaryBox, KeyTerm } from "@/components/seo"
import { TiltCard } from "@/components/ui/tilt-card"
import { 
  ArrowRight, 
  Check, 
  X, 
  Shield, 
  Cpu, 
  Wifi, 
  WifiOff,
  Brain,
  Cookie,
  Server,
  HardDrive,
  Lock,
  ChevronRight
} from "lucide-react"

const comparisonJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Why Local-First Wins - Compare Plain PDF",
  description: "Compare Plain's local-first architecture with cloud-based PDF tools. See why professionals choose 100% on-device processing for sensitive documents.",
  mainEntity: {
    "@type": "ItemList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "File Processing",
        description: "Plain processes files in browser RAM vs cloud tools that upload to remote servers"
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Privacy Architecture",
        description: "Plain uses zero-server architecture vs cloud tools that handle data through third parties"
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Offline Capability",
        description: "Plain works 100% offline (Air-Gap mode) vs cloud tools requiring active internet"
      },
      {
        "@type": "ListItem",
        position: 4,
        name: "AI Security",
        description: "Plain uses on-device WebGPU models vs cloud tools sending data to external APIs"
      },
      {
        "@type": "ListItem",
        position: 5,
        name: "Tracking",
        description: "Plain provides no-cookie guarantee vs cloud tools using cookies and profiling"
      }
    ]
  }
}

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://plain.tools/" },
    { "@type": "ListItem", position: 2, name: "Compare", item: "https://plain.tools/compare" },
  ],
}

const comparisonData = [
  {
    feature: "File Processing",
    icon: Server,
    cloud: "Uploaded to remote servers",
    cloudDetail: "Your files travel across the internet to third-party data centres",
    plain: "Stays in your browser RAM",
    plainDetail: "Files never leave your device. Processing happens locally using WebAssembly",
  },
  {
    feature: "Privacy",
    icon: Shield,
    cloud: "Data handled by third parties",
    cloudDetail: "Files pass through corporate servers with varying privacy policies",
    plain: "Zero-server architecture",
    plainDetail: "We physically cannot see your files. There is no server to upload to",
  },
  {
    feature: "Offline Use",
    icon: Wifi,
    cloud: "Requires active internet",
    cloudDetail: "Processing fails without a stable network connection",
    plain: "Works 100% offline (Air-Gap)",
    plainDetail: "After initial load, disconnect completely. Perfect for secure environments",
  },
  {
    feature: "AI Security",
    icon: Brain,
    cloud: "Sent to OpenAI/external APIs",
    cloudDetail: "Your document content is transmitted to AI providers for processing",
    plain: "On-device WebGPU models",
    plainDetail: "AI runs locally using your GPU. No prompts or data leave your browser",
  },
  {
    feature: "Tracking",
    icon: Cookie,
    cloud: "Uses cookies and profiling",
    cloudDetail: "Behavioural tracking, analytics pixels, and cross-site identification",
    plain: "No-cookie guarantee",
    plainDetail: "Zero tracking cookies, no persistent identifiers, no user profiling",
  },
]

const competitorComparisons = [
  {
    name: "iLovePDF",
    href: "/compare/plain-vs-ilovepdf",
    tagline: "Popular but cloud-dependent",
  },
  {
    name: "Smallpdf",
    href: "/compare/plain-vs-smallpdf",
    tagline: "Requires account and uploads",
  },
  {
    name: "Sejda",
    href: "/compare/plain-vs-sejda",
    tagline: "Server-processed workflows",
  },
]

export default function ComparePage() {
  const [expandedRow, setExpandedRow] = useState<number | null>(null)

  return (
    <div className="flex min-h-screen flex-col bg-[#000]">
      <Script
        id="comparison-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(comparisonJsonLd) }}
      />
      <Script
        id="breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <link rel="canonical" href="https://plain.tools/compare" />
      
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative border-b border-[#333] px-4 py-20 md:py-28">
          {/* Technical grid pattern background */}
          <div className="pointer-events-none absolute inset-0 hero-grid-pattern opacity-30" />
          
          <div className="relative mx-auto max-w-4xl text-center">
            {/* Breadcrumb */}
            <nav className="mb-8 flex items-center justify-center gap-2 text-[13px] text-white/40">
              <Link href="/" className="transition-colors hover:text-white/60">
                Home
              </Link>
              <ChevronRight className="h-3.5 w-3.5" />
              <span className="text-white/70">Compare</span>
            </nav>

            <h1 className="text-4xl font-bold tracking-[-0.03em] text-white md:text-5xl lg:text-6xl">
              Why <span className="text-[#0070f3]">Local-First</span> Wins
            </h1>
            
            <p className="mx-auto mt-6 max-w-2xl text-[17px] leading-relaxed text-white/60">
              Your documents are too sensitive for the cloud. Compare why professionals 
              are switching to <span translate="no" className="notranslate font-medium text-white/80">Plain</span> for 
              100% on-device processing.
            </p>

            {/* GEO Summary Box */}
            <SummaryBox className="mx-auto mt-8 max-w-2xl text-start">
              <KeyTerm>Plain PDF</KeyTerm> processes documents entirely in-browser using <KeyTerm>WebAssembly</KeyTerm>, 
              unlike cloud-based alternatives that upload files to external servers. This architectural difference 
              provides verifiable privacy guarantees rather than relying on policy promises.
            </SummaryBox>
          </div>
        </section>

        {/* Comparison Table Section */}
        <section className="px-4 py-16 md:py-24">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-12 text-center text-2xl font-bold text-white md:text-3xl">
              Feature Comparison
            </h2>

            {/* Comparison Table */}
            <div className="overflow-hidden rounded-xl border border-[#333] bg-[#0a0a0a]">
              {/* Table Header */}
              <div className="grid grid-cols-3 border-b border-[#333] bg-[#111]">
                <div className="p-4 md:p-6">
                  <span className="text-[13px] font-semibold uppercase tracking-wider text-white/50">
                    Feature
                  </span>
                </div>
                <div className="border-s border-[#333] p-4 md:p-6">
                  <span className="text-[13px] font-semibold uppercase tracking-wider text-red-400/80">
                    Cloud-Based Tools
                  </span>
                </div>
                <div className="border-s border-[#333] p-4 md:p-6">
                  <span className="text-[13px] font-semibold uppercase tracking-wider text-[#0070f3]">
                    <span translate="no" className="notranslate">Plain</span> PDF
                  </span>
                </div>
              </div>

              {/* Table Rows */}
              {comparisonData.map((row, index) => (
                <div 
                  key={row.feature}
                  className={`grid grid-cols-3 border-b border-[#222] transition-colors last:border-b-0 ${
                    expandedRow === index ? "bg-[#111]" : "hover:bg-[#0f0f0f]"
                  }`}
                >
                  {/* Feature Column */}
                  <button
                    onClick={() => setExpandedRow(expandedRow === index ? null : index)}
                    className="flex items-start gap-3 p-4 text-start md:p-6"
                  >
                    <row.icon className="mt-0.5 h-5 w-5 shrink-0 text-white/40" strokeWidth={1.5} />
                    <div>
                      <span className="text-[14px] font-medium text-white">{row.feature}</span>
                      {expandedRow === index && (
                        <p className="mt-2 text-[12px] leading-relaxed text-white/40">
                          Click to collapse
                        </p>
                      )}
                    </div>
                  </button>

                  {/* Cloud Column */}
                  <div className="flex items-start gap-3 border-s border-[#222] p-4 md:p-6">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500/10">
                      <X className="h-3 w-3 text-red-400" strokeWidth={2.5} />
                    </div>
                    <div>
                      <span className="text-[14px] text-white/70">{row.cloud}</span>
                      {expandedRow === index && (
                        <p className="mt-2 text-[12px] leading-relaxed text-white/40">
                          {row.cloudDetail}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Plain Column */}
                  <div className="flex items-start gap-3 border-s border-[#222] p-4 md:p-6">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0070f3]/10 shadow-[0_0_10px_rgba(0,112,243,0.3)]">
                      <Check className="h-3 w-3 text-[#0070f3]" strokeWidth={2.5} />
                    </div>
                    <div>
                      <span className="text-[14px] font-medium text-white">{row.plain}</span>
                      {expandedRow === index && (
                        <p className="mt-2 text-[12px] leading-relaxed text-white/50">
                          {row.plainDetail}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Expand hint */}
            <p className="mt-4 text-center text-[12px] text-white/30">
              Click any row to expand details
            </p>
          </div>
        </section>

        {/* Architecture Diagram */}
        <section className="border-t border-[#333] px-4 py-16 md:py-24">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-12 text-center text-2xl font-bold text-white md:text-3xl">
              The Architectural Difference
            </h2>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Cloud Architecture */}
              <div className="rounded-xl border border-[#333] bg-[#0a0a0a] p-6">
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10">
                    <Server className="h-4 w-4 text-red-400" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-[15px] font-semibold text-white">Cloud-Based Flow</h3>
                </div>
                <div className="space-y-3 font-mono text-[12px]">
                  <div className="flex items-center gap-2 text-white/50">
                    <span className="text-red-400">1.</span> Your file leaves your device
                  </div>
                  <div className="flex items-center gap-2 text-white/50">
                    <span className="text-red-400">2.</span> Uploaded to external server
                  </div>
                  <div className="flex items-center gap-2 text-white/50">
                    <span className="text-red-400">3.</span> Processed on third-party infrastructure
                  </div>
                  <div className="flex items-center gap-2 text-white/50">
                    <span className="text-red-400">4.</span> Stored (temporarily or permanently)
                  </div>
                  <div className="flex items-center gap-2 text-white/50">
                    <span className="text-red-400">5.</span> Downloaded back to your device
                  </div>
                </div>
                <div className="mt-4 rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2">
                  <p className="text-[11px] text-red-400/80">
                    Multiple points of exposure. Trust required at every step.
                  </p>
                </div>
              </div>

              {/* Plain Architecture */}
              <div className="rounded-xl border border-[#0070f3]/30 bg-[#0a0a0a] p-6 shadow-[0_0_30px_rgba(0,112,243,0.08)]">
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0070f3]/10">
                    <HardDrive className="h-4 w-4 text-[#0070f3]" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-[15px] font-semibold text-white">
                    <span translate="no" className="notranslate">Plain</span> Local Flow
                  </h3>
                </div>
                <div className="space-y-3 font-mono text-[12px]">
                  <div className="flex items-center gap-2 text-white/60">
                    <span className="text-[#0070f3]">1.</span> File loaded into browser RAM
                  </div>
                  <div className="flex items-center gap-2 text-white/60">
                    <span className="text-[#0070f3]">2.</span> <span translate="no" className="notranslate">WebAssembly</span> engine processes locally
                  </div>
                  <div className="flex items-center gap-2 text-white/60">
                    <span className="text-[#0070f3]">3.</span> Output generated on your device
                  </div>
                  <div className="flex items-center gap-2 text-white/60">
                    <span className="text-[#0070f3]">4.</span> RAM cleared on tab close
                  </div>
                  <div className="flex items-center gap-2 text-white/40 line-through">
                    <span className="text-white/20">5.</span> No server interaction
                  </div>
                </div>
                <div className="mt-4 rounded-lg border border-[#0070f3]/20 bg-[#0070f3]/5 px-3 py-2">
                  <p className="text-[11px] text-[#0070f3]/80">
                    Zero network transfer. Verifiable in DevTools.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Specific Competitor Comparisons */}
        <section className="border-t border-[#333] px-4 py-16 md:py-24">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-4 text-center text-2xl font-bold text-white md:text-3xl">
              Detailed Comparisons
            </h2>
            <p className="mb-12 text-center text-[15px] text-white/50">
              See how <span translate="no" className="notranslate">Plain</span> compares to specific alternatives
            </p>

            <div className="grid gap-4 md:grid-cols-3">
              {competitorComparisons.map((competitor) => (
                <TiltCard key={competitor.name} tiltIntensity={6} glowOnHover>
                  <Link
                    href={competitor.href}
                    className="group block rounded-xl border border-[#333] bg-[#111] p-6 transition-all duration-200 hover:border-[#0070f3]"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-[15px] font-semibold text-white">
                          <span translate="no" className="notranslate">Plain</span> vs {competitor.name}
                        </h3>
                        <p className="mt-1 text-[13px] text-white/50">
                          {competitor.tagline}
                        </p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-white/30 transition-all group-hover:translate-x-1 group-hover:text-[#0070f3]" />
                    </div>
                  </Link>
                </TiltCard>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative border-t border-[#333] px-4 py-20 md:py-28">
          {/* Technical grid pattern background */}
          <div className="pointer-events-none absolute inset-0 hero-grid-pattern opacity-20" />
          
          <div className="relative mx-auto max-w-2xl text-center">
            <div className="mb-6 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0070f3]/10 ring-1 ring-[#0070f3]/30 shadow-[0_0_30px_rgba(0,112,243,0.2)]">
                <Lock className="h-8 w-8 text-[#0070f3]" strokeWidth={1.5} />
              </div>
            </div>

            <h2 className="text-3xl font-bold tracking-[-0.02em] text-white md:text-4xl">
              Ready to Switch?
            </h2>
            
            <p className="mx-auto mt-4 max-w-lg text-[16px] leading-relaxed text-white/60">
              Experience the difference of true local processing. 
              Your files never leave your device.
            </p>

            <div className="mt-10">
              <Button asChild size="lg" className="h-14 px-10 text-[16px] font-semibold">
                <Link href="/tools">
                  <WifiOff className="me-2.5 h-5 w-5" strokeWidth={1.75} />
                  Start Processing Locally
                </Link>
              </Button>
            </div>

            <p className="mt-6 text-[13px] text-white/40">
              No account required. No data collected.
            </p>

            {/* Trust indicators */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-[12px] text-white/30">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-[#0070f3]" />
                <span>100% browser-based</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-[#0070f3]" />
                <span>Zero server uploads</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-[#0070f3]" />
                <span>Verifiable in DevTools</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
