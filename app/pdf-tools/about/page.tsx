import { Metadata } from "next"
import Link from "next/link"
import Script from "next/script"
import { Header } from "@/components/legacy/header"
import { Footer } from "@/components/legacy/footer"
import { SummaryBox, KeyTerm, Breadcrumbs } from "@/components/legacy/seo"
import { AutoLinkContent } from "@/components/legacy/auto-link-content"
import { 
  Shield, 
  Zap, 
  Sparkles, 
  ArrowLeft,
  Cpu,
  HardDrive,
  Globe,
  Lock,
  Banknote,
  Wifi,
  Server,
  CheckCircle2
} from "lucide-react"

export const metadata: Metadata = {
  title: "About Plain - A Plain Approach to Private Documents",
  description:
    "Plain is built on the belief that utility should never require a sacrifice of privacy. Learn about our local-first architecture using WebAssembly and WebGPU.",
  openGraph: {
    title: "About Plain - A Plain Approach to Private Documents",
    description: "Most 'free' PDF tools pay for their servers by collecting your data. We changed the architecture so we never have to see your files.",
  },
  alternates: {
    canonical: "https://plain.tools/about",
  },
}

const aboutJsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "About Plain",
  description: "Plain is built on the belief that utility should never require a sacrifice of privacy. Local-first PDF tools powered by WebAssembly and WebGPU.",
  mainEntity: {
    "@type": "Organization",
    name: "Plain",
    url: "https://plain.tools",
    description: "Offline PDF tools that run entirely in your browser using WebAssembly and WebGPU.",
    foundingLocation: {
      "@type": "Place",
      name: "United Kingdom"
    }
  },
}

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is Plain truly offline?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. After the initial page load, Plain works entirely offline. All PDF processing happens in your browser using WebAssembly. You can verify this by opening your browser's Network tab and watching for zero outbound requests during file operations."
      }
    },
    {
      "@type": "Question",
      name: "How does Plain make money?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Plain is supported by contextual advertising via Google AdSense. We display non-intrusive ads on the site, but crucially, we never share your document data with advertisers. Your files remain 100% local—only page views and interactions generate ad revenue, not your private documents."
      }
    },
    {
      "@type": "Question",
      name: "What technologies power Plain?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Plain uses WebAssembly (Wasm) for native-speed PDF processing, WebGPU for hardware-accelerated AI features, and standard Web APIs for file handling. The entire processing pipeline runs client-side with zero server dependencies."
      }
    }
  ]
}

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://plain.tools/" },
    { "@type": "ListItem", position: 2, name: "About", item: "https://plain.tools/about" },
  ],
}

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#000]">
      <Script
        id="about-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }}
      />
      <Script
        id="faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Script
        id="breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Header />

      <main className="flex-1">
        {/* Hero Section - The Mission */}
        <section className="relative border-b border-[#333] px-4 py-24 md:py-32">
          {/* Technical grid pattern background */}
          <div className="pointer-events-none absolute inset-0 hero-grid-pattern opacity-30" />
          
          {/* Glow effect */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[350px] w-[500px] rounded-full bg-[#0070f3]/[0.08] blur-[120px]" />
          </div>
          
          <div className="relative mx-auto max-w-4xl text-center">
            {/* Breadcrumb */}
            <nav className="mb-8 flex items-center justify-center gap-2 text-[12px] text-white/40">
              <Link href="/pdf-tools/" className="hover:text-white/60 transition-colors">
                Home
              </Link>
              <span>/</span>
              <span className="text-white/60">About</span>
            </nav>
            
            <h1 className="text-4xl font-bold tracking-[-0.03em] text-white md:text-5xl lg:text-6xl">
              A Plain Approach to
              <br />
              <span className="text-[#0070f3]">Private Documents</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-[17px] leading-relaxed text-white/60">
              Most &lsquo;free&rsquo; PDF tools pay for their servers by collecting your data. 
              We changed the architecture so we never have to see your files. Plain is built 
              on the belief that utility should never require a sacrifice of privacy.
            </p>
            
            {/* GEO-Optimised Summary Box for AI Crawlers */}
            <SummaryBox className="mx-auto mt-10 max-w-2xl text-start">
              <KeyTerm>Plain</KeyTerm> is a privacy-first PDF toolkit that runs entirely in your browser using <KeyTerm>WebAssembly</KeyTerm> and <KeyTerm>WebGPU</KeyTerm>. 
              Unlike cloud-based alternatives, Plain processes documents locally on your device, ensuring your files are never uploaded to external servers. 
              The service is free, funded by non-intrusive advertising, and fully compliant with <KeyTerm>GDPR</KeyTerm> and <KeyTerm>UK GDPR</KeyTerm> by design.
            </SummaryBox>
          </div>
        </section>

        {/* The Architecture of Trust */}
        <section className="border-b border-[#333] px-4 py-20 md:py-28">
          <div className="mx-auto max-w-5xl">
            <div className="mb-12 text-center">
              <h2 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
                The Architecture of Trust
              </h2>
              <p className="mt-3 text-[15px] text-white/50">
                Why local-first processing matters
              </p>
            </div>
            
            {/* Two-column layout */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* WebAssembly */}
              <div className="rounded-xl border border-[#333] bg-[#111] p-6 transition-all duration-200 hover:border-[#0070f3] hover:shadow-[0_0_20px_rgba(0,112,243,0.15)]">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[#0070f3]/10 ring-1 ring-[#0070f3]/30">
                  <Cpu className="h-6 w-6 text-[#0070f3]" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-semibold text-white">WebAssembly (Wasm)</h3>
                <p className="mt-3 text-[14px] leading-relaxed text-white/60">
                  WebAssembly allows us to run compiled code at near-native speed directly 
                  in your browser. Our PDF engine is written in optimised C++ and compiled 
                  to Wasm, meaning your documents are processed locally with the same 
                  performance you would expect from desktop software.
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center gap-2 text-[13px] text-white/50">
                    <CheckCircle2 className="h-4 w-4 text-[#0070f3]/70" strokeWidth={2} />
                    Native-speed processing
                  </li>
                  <li className="flex items-center gap-2 text-[13px] text-white/50">
                    <CheckCircle2 className="h-4 w-4 text-[#0070f3]/70" strokeWidth={2} />
                    Zero server dependency
                  </li>
                  <li className="flex items-center gap-2 text-[13px] text-white/50">
                    <CheckCircle2 className="h-4 w-4 text-[#0070f3]/70" strokeWidth={2} />
                    Verifiable in DevTools
                  </li>
                </ul>
              </div>
              
              {/* WebGPU */}
              <div className="rounded-xl border border-[#333] bg-[#111] p-6 transition-all duration-200 hover:border-[#0070f3] hover:shadow-[0_0_20px_rgba(0,112,243,0.15)]">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[#0070f3]/10 ring-1 ring-[#0070f3]/30">
                  <HardDrive className="h-6 w-6 text-[#0070f3]" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-semibold text-white">WebGPU Acceleration</h3>
                <p className="mt-3 text-[14px] leading-relaxed text-white/60">
                  For AI-powered features like document summarisation and intelligent chat, 
                  we leverage WebGPU to run machine learning models directly on your 
                  device&rsquo;s graphics hardware. This means AI features work offline 
                  and your data never touches our servers.
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center gap-2 text-[13px] text-white/50">
                    <CheckCircle2 className="h-4 w-4 text-[#0070f3]/70" strokeWidth={2} />
                    Hardware-accelerated AI
                  </li>
                  <li className="flex items-center gap-2 text-[13px] text-white/50">
                    <CheckCircle2 className="h-4 w-4 text-[#0070f3]/70" strokeWidth={2} />
                    Local LLM inference
                  </li>
                  <li className="flex items-center gap-2 text-[13px] text-white/50">
                    <CheckCircle2 className="h-4 w-4 text-[#0070f3]/70" strokeWidth={2} />
                    No cloud AI dependencies
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* The Plain Ethics Manifesto */}
        <section className="relative border-b border-[#333] px-4 py-24 md:py-32">
          {/* Technical grid pattern background */}
          <div className="pointer-events-none absolute inset-0 hero-grid-pattern opacity-20" />
          
          <div className="relative mx-auto max-w-5xl">
            {/* Section Header */}
            <div className="mb-16 text-center">
              <span className="mb-4 inline-block rounded-full bg-[#0070f3]/10 px-4 py-1.5 text-[12px] font-semibold uppercase tracking-wider text-[#0070f3] ring-1 ring-[#0070f3]/30">
                Our Principles
              </span>
              <h2 className="mt-4 text-3xl font-bold tracking-[-0.03em] text-white md:text-4xl">
                A Moral Compass for the Modern Web
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-white/50">
                Four principles that guide every decision we make at Plain.
              </p>
            </div>
            
            {/* Manifesto Grid - Bento Style */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* 01 - Data as a Liability */}
              <div className="group rounded-xl border border-[#333] bg-[#111] p-8 transition-all duration-300 hover:border-[#0070f3] hover:shadow-[0_0_30px_rgba(0,112,243,0.12)]">
                <span className="block font-mono text-5xl font-bold text-[#0070f3]">01</span>
                <h3 className="mt-4 text-xl font-bold text-white">Data as a Liability</h3>
                <p className="mt-4 text-[15px] leading-relaxed text-white/60">
                  We believe your data is a liability, not an asset. Traditional companies seek to 
                  capture and store your information; we have engineered our platform so that we 
                  never possess it. If we don&rsquo;t have it, we can&rsquo;t lose it, sell it, or be 
                  forced to hand it over.
                </p>
              </div>
              
              {/* 02 - Transparent Monetisation */}
              <div className="group rounded-xl border border-[#333] bg-[#111] p-8 transition-all duration-300 hover:border-[#0070f3] hover:shadow-[0_0_30px_rgba(0,112,243,0.12)]">
                <span className="block font-mono text-5xl font-bold text-[#0070f3]">02</span>
                <h3 className="mt-4 text-xl font-bold text-white">Transparent Monetisation</h3>
                <p className="mt-4 text-[15px] leading-relaxed text-white/60">
                  Our business model is simple: we provide professional-grade tools for free, 
                  supported by non-intrusive advertising. We refuse to supplement our revenue 
                  by profiling our users or selling &lsquo;anonymous&rsquo; data aggregates. We trade 
                  screen space for utility, not your privacy for profit.
                </p>
              </div>
              
              {/* 03 - Technical Integrity */}
              <div className="group rounded-xl border border-[#333] bg-[#111] p-8 transition-all duration-300 hover:border-[#0070f3] hover:shadow-[0_0_30px_rgba(0,112,243,0.12)]">
                <span className="block font-mono text-5xl font-bold text-[#0070f3]">03</span>
                <h3 className="mt-4 text-xl font-bold text-white">Technical Integrity</h3>
                <p className="mt-4 text-[15px] leading-relaxed text-white/60">
                  We use WebAssembly and WebGPU not just for speed, but for isolation. By moving 
                  the compute power to your device, we return control to you. Our code is designed 
                  to be a transparent bridge between your hardware and your files.
                </p>
              </div>
              
              {/* 04 - Zero-Trace Guarantee */}
              <div className="group rounded-xl border border-[#333] bg-[#111] p-8 transition-all duration-300 hover:border-[#0070f3] hover:shadow-[0_0_30px_rgba(0,112,243,0.12)]">
                <span className="block font-mono text-5xl font-bold text-[#0070f3]">04</span>
                <h3 className="mt-4 text-xl font-bold text-white">The Zero-Trace Guarantee</h3>
                <p className="mt-4 text-[15px] leading-relaxed text-white/60">
                  We do not use tracking cookies, hidden pixels, or persistent identifiers. When 
                  you close your browser tab, your session with Plain ends completely. No digital 
                  footprint is left on our side.
                </p>
              </div>
            </div>
            
            {/* Verified Privacy Badge */}
            <div className="mt-12 flex justify-center">
              <div className="inline-flex items-center gap-3 rounded-full border border-[#0070f3]/30 bg-[#0070f3]/5 px-5 py-2.5 shadow-[0_0_20px_rgba(0,112,243,0.15)]">
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5 text-[#0070f3]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                  />
                </svg>
                <span className="text-[13px] font-medium text-white/80">
                  Verified Privacy Architecture
                </span>
                <span className="rounded-full bg-[#0070f3]/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#0070f3]">
                  Auditable
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Our Three Pillars */}
        <section className="border-b border-[#333] px-4 py-20 md:py-28">
          <div className="mx-auto max-w-5xl">
            <div className="mb-12 text-center">
              <h2 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
                Our Three Pillars
              </h2>
            </div>
            
            <div className="grid gap-6 md:grid-cols-3">
              {/* Privacy */}
              <div className="rounded-xl border border-[#333] bg-[#111] p-6 text-center transition-all duration-200 hover:border-[#0070f3] hover:shadow-[0_0_20px_rgba(0,112,243,0.15)]">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#0070f3]/10 ring-1 ring-[#0070f3]/30">
                  <Shield className="h-7 w-7 text-[#0070f3]" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-semibold text-white">Privacy</h3>
                <p className="mt-3 text-[14px] leading-relaxed text-white/60">
                  No files ever leave your machine. Your documents are processed entirely 
                  in your browser using WebAssembly. We architecturally cannot see your data.
                </p>
              </div>
              
              {/* Performance */}
              <div className="rounded-xl border border-[#333] bg-[#111] p-6 text-center transition-all duration-200 hover:border-[#0070f3] hover:shadow-[0_0_20px_rgba(0,112,243,0.15)]">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#0070f3]/10 ring-1 ring-[#0070f3]/30">
                  <Zap className="h-7 w-7 text-[#0070f3]" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-semibold text-white">Performance</h3>
                <p className="mt-3 text-[14px] leading-relaxed text-white/60">
                  Native-speed processing via hardware acceleration. No upload delays, 
                  no server queues. Your PDFs are processed instantly using your device&rsquo;s 
                  full computational power.
                </p>
              </div>
              
              {/* Simplicity */}
              <div className="rounded-xl border border-[#333] bg-[#111] p-6 text-center transition-all duration-200 hover:border-[#0070f3] hover:shadow-[0_0_20px_rgba(0,112,243,0.15)]">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#0070f3]/10 ring-1 ring-[#0070f3]/30">
                  <Sparkles className="h-7 w-7 text-[#0070f3]" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-semibold text-white">Simplicity</h3>
                <p className="mt-3 text-[14px] leading-relaxed text-white/60">
                  A focused, ad-supported experience without the bloat. No accounts, no 
                  subscriptions, no dark patterns. Just tools that work.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Building in Public */}
        <section className="border-b border-[#333] px-4 py-20 md:py-28">
          <div className="mx-auto max-w-3xl">
            <div className="rounded-xl border border-[#333] bg-[#111] p-8 md:p-10">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0070f3]/10 ring-1 ring-[#0070f3]/30">
                  <Globe className="h-5 w-5 text-[#0070f3]" strokeWidth={1.5} />
                </div>
                <h2 className="text-xl font-bold text-white">Building in Public</h2>
              </div>
              
              <div className="space-y-4 text-[15px] leading-relaxed text-white/60">
                <p>
                  Plain started as a mission to return control to the user. In an era where 
                  &lsquo;free&rsquo; often means &lsquo;we monetise your data,&rsquo; we wanted to prove that 
                  a different model is possible.
                </p>
                <p>
                  We believe that document processing is a solved problem that should not 
                  require cloud infrastructure. Modern browsers are powerful enough to handle 
                  PDF operations locally. The only reason most tools upload your files is to 
                  collect data or lock you into a subscription.
                </p>
                <p>
                  Our approach is simple: build genuinely useful tools, support them through 
                  contextual advertising, and never compromise on privacy. Your documents 
                  are your business.
                </p>
              </div>
              
              {/* Location badge */}
              <div className="mt-8 flex items-center gap-2 rounded-lg bg-white/[0.03] px-4 py-3 ring-1 ring-white/[0.06]">
                <Lock className="h-4 w-4 text-[#0070f3]/70" strokeWidth={2} />
                <span className="text-[13px] text-white/50">
                  Based in the United Kingdom, serving a global community of privacy-conscious professionals.
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Technical FAQ */}
        <section className="border-b border-[#333] bg-[#0a0a0a] px-4 py-20 md:py-28">
          <div className="mx-auto max-w-3xl">
            <div className="mb-12 text-center">
              <h2 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
                Technical FAQ
              </h2>
              <p className="mt-3 text-[15px] text-white/50">
                Common questions about how Plain works
              </p>
            </div>
            
  <AutoLinkContent className="space-y-4">
  {/* FAQ 1 */}
  <div className="rounded-xl border border-[#333] bg-[#111] p-6 transition-all duration-200 hover:border-[#0070f3]/50">
  <div className="flex items-start gap-4">
  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#0070f3]/10 ring-1 ring-[#0070f3]/30">
  <Wifi className="h-4 w-4 text-[#0070f3]" strokeWidth={2} />
  </div>
  <div>
  <h3 className="text-[15px] font-semibold text-white">Is Plain truly offline?</h3>
  <p className="mt-2 text-[14px] leading-relaxed text-white/60">
  Yes. After the initial page load, Plain works entirely offline. All PDF
  processing happens in your browser using WebAssembly.
  You can verify this by opening your browser&rsquo;s Network tab and watching
  for zero outbound requests during file operations.
  </p>
  </div>
  </div>
  </div>
              
              {/* FAQ 2 */}
              <div className="rounded-xl border border-[#333] bg-[#111] p-6 transition-all duration-200 hover:border-[#0070f3]/50">
                <div className="flex items-start gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#0070f3]/10 ring-1 ring-[#0070f3]/30">
                    <Banknote className="h-4 w-4 text-[#0070f3]" strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-semibold text-white">How does Plain make money?</h3>
                    <p className="mt-2 text-[14px] leading-relaxed text-white/60">
                      Plain is supported by contextual advertising via Google AdSense. We display 
                      non-intrusive ads on the site, but crucially, we never share your document 
                      data with advertisers. Your files remain 100% local—only page views and 
                      interactions generate ad revenue, not your private documents.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* FAQ 3 */}
              <div className="rounded-xl border border-[#333] bg-[#111] p-6 transition-all duration-200 hover:border-[#0070f3]/50">
                <div className="flex items-start gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#0070f3]/10 ring-1 ring-[#0070f3]/30">
                    <Server className="h-4 w-4 text-[#0070f3]" strokeWidth={2} />
                  </div>
  <div>
  <h3 className="text-[15px] font-semibold text-white">What technologies power Plain?</h3>
  <p className="mt-2 text-[14px] leading-relaxed text-white/60">
  Plain uses WebAssembly (Wasm) for
  native-speed PDF processing, WebGPU for
  hardware-accelerated AI features, and standard Web APIs for file handling.
  The entire processing pipeline runs client-side with zero server dependencies.
  </p>
  </div>
  </div>
  </div>
  </AutoLinkContent>
  </div>
  </section>

        {/* Back to Tools CTA */}
        <section className="px-4 py-16 md:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-6 text-[15px] text-white/50">
              Ready to try our privacy-first PDF tools?
            </p>
            <Link
              href="/pdf-tools/#tools"
              className="inline-flex items-center gap-2 rounded-lg bg-[#0070f3] px-6 py-3 text-[15px] font-semibold text-white transition-all duration-200 hover:bg-[#0070f3]/90 hover:shadow-[0_0_20px_rgba(0,112,243,0.3)]"
            >
              <ArrowLeft className="h-4 w-4" strokeWidth={2} />
              Back to Tools
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}


