"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import { Metadata } from "next"
import Link from "next/link"
import Script from "next/script"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Search, ArrowLeft, BookOpen, ExternalLink } from "lucide-react"

// Glossary terms data with GEO-optimised definitions
const glossaryTerms = [
  {
    term: "WebAssembly (Wasm)",
    definition: "A binary instruction format for a stack-based virtual machine. WebAssembly enables high-performance code execution in web browsers at near-native speeds, allowing complex document processing to occur entirely on your device without server round-trips.",
    privacyImpact: "By executing PDF manipulation code locally via Wasm, your documents never leave your browser. This eliminates data exposure risks associated with cloud-based processing.",
    relatedTools: [
      { name: "Merge PDF", href: "/tools/merge-pdf" },
      { name: "Split PDF", href: "/tools/split-pdf" },
      { name: "Compress PDF", href: "/tools/compress-pdf" },
    ],
    letter: "W",
  },
  {
    term: "WebGPU",
    definition: "A modern web API that provides hardware-accelerated graphics and compute capabilities. WebGPU enables direct access to GPU resources for parallel processing tasks, making on-device AI inference practical within the browser environment.",
    privacyImpact: "WebGPU allows AI models to run entirely on your device's graphics hardware. Your prompts and documents are processed locally, never transmitted to external AI APIs or training servers.",
    relatedTools: [
      { name: "AI Chat with PDF", href: "/tools/ai-chat-pdf" },
      { name: "Instant Summary", href: "/tools/summarise-pdf" },
    ],
    letter: "W",
  },
  {
    term: "Client-Side Processing",
    definition: "The method of handling data entirely on the user's device rather than on remote servers. In client-side processing, computations occur within the browser's execution environment using the device's own CPU and memory resources.",
    privacyImpact: "Client-side processing ensures your sensitive documents remain under your physical control. No network transfers means no interception risks, no server logs, and no third-party data retention.",
    relatedTools: [
      { name: "All Tools", href: "/tools" },
    ],
    letter: "C",
  },
  {
    term: "Zero-Knowledge Architecture",
    definition: "A system design principle where the service provider has no technical ability to access, view, or decrypt user data. The architecture is constructed such that even with full access to the codebase and infrastructure, user content remains inaccessible.",
    privacyImpact: "Plain's zero-knowledge architecture means we cannot see your files even if we wanted to. There is no 'admin backdoor' because your data never reaches our systems in the first place.",
    relatedTools: [
      { name: "Permanent Redaction", href: "/tools/redact-pdf" },
    ],
    letter: "Z",
  },
  {
    term: "Browser Sandboxing",
    definition: "A security mechanism that isolates web content from the underlying operating system and other applications. The browser sandbox creates a restricted execution environment where website code cannot access files, processes, or resources outside its designated boundaries.",
    privacyImpact: "Browser sandboxing provides an additional security layer for Plain's tools. Even the code processing your documents cannot access other files on your system or persist data beyond your session.",
    relatedTools: [
      { name: "Unlock PDF", href: "/tools/unlock-pdf" },
    ],
    letter: "B",
  },
  {
    term: "End-to-End Local Encryption",
    definition: "A cryptographic approach where data is encrypted and decrypted entirely on the user's device, with encryption keys never transmitted to or stored on external servers. This ensures only the user possesses the means to access their encrypted content.",
    privacyImpact: "When Plain applies password protection to your PDFs, the encryption occurs locally. Your passwords and encryption keys exist only in your browser's memory and are never transmitted anywhere.",
    relatedTools: [
      { name: "Protect PDF", href: "/tools/protect-pdf" },
    ],
    letter: "E",
  },
  {
    term: "Progressive Web App (PWA)",
    definition: "A web application that uses modern browser capabilities to deliver an app-like experience. PWAs can be installed on devices, work offline after initial load, and provide fast, reliable performance through service worker caching.",
    privacyImpact: "Plain's PWA capability means you can install it and use it offline. Once cached, the application runs without any network connection, providing air-gapped document processing.",
    relatedTools: [
      { name: "All Tools (Offline)", href: "/tools" },
    ],
    letter: "P",
  },
  {
    term: "Air-Gap Mode",
    definition: "An operational state where a device or application is completely isolated from network connectivity. In air-gap mode, no data can be transmitted to or received from external sources, providing maximum security for sensitive operations.",
    privacyImpact: "Plain's Air-Gap Mode lets you verify complete network isolation. You can disconnect from the internet entirely and continue processing documents with full functionality.",
    relatedTools: [
      { name: "Air-Gap Toggle", href: "/tools" },
    ],
    letter: "A",
  },
  {
    term: "Document Object Model (DOM)",
    definition: "A programming interface that represents the structure of a document as a tree of objects. In web contexts, the DOM allows scripts to dynamically access and manipulate page content, structure, and styling.",
    privacyImpact: "Plain processes PDFs within the browser's DOM environment, meaning document data exists only in your browser's memory space and is automatically cleared when you close the tab.",
    relatedTools: [
      { name: "Reorder Pages", href: "/tools/reorder-pdf" },
    ],
    letter: "D",
  },
  {
    term: "Volatile Memory Processing",
    definition: "Data handling that occurs exclusively in RAM (Random Access Memory) without writing to persistent storage. Volatile memory is automatically cleared when the application closes or power is removed, leaving no recoverable traces.",
    privacyImpact: "Plain uses volatile memory for all document operations. When you close the browser tab, your document data is automatically erased with no file remnants on disk.",
    relatedTools: [
      { name: "All Tools", href: "/tools" },
    ],
    letter: "V",
  },
  {
    term: "Optical Character Recognition (OCR)",
    definition: "Technology that converts images of text (such as scanned documents or photographs) into machine-readable text data. OCR analyses visual patterns to identify characters and words, enabling text search and extraction from image-based PDFs.",
    privacyImpact: "Plain's OCR runs entirely in your browser using Wasm-compiled engines. Your scanned documents are never uploaded to cloud OCR services that might retain or analyse your content.",
    relatedTools: [
      { name: "OCR / Searchable PDF", href: "/tools/ocr-pdf" },
    ],
    letter: "O",
  },
  {
    term: "PDF/A (Archival PDF)",
    definition: "An ISO-standardised subset of PDF designed for long-term digital preservation. PDF/A documents are self-contained, embedding all necessary fonts and colour profiles, and prohibiting features that could compromise future readability.",
    privacyImpact: "Converting to PDF/A locally ensures your archival documents meet compliance standards without exposing potentially sensitive content to third-party conversion services.",
    relatedTools: [
      { name: "Convert to PDF/A", href: "/tools/convert-pdfa" },
    ],
    letter: "P",
  },
  {
    term: "Redaction",
    definition: "The permanent removal of sensitive information from a document. True redaction physically removes the underlying data, unlike overlay methods that merely hide content visually while leaving the original data extractable.",
    privacyImpact: "Plain's redaction tool permanently destroys selected content at the byte level. The redacted information cannot be recovered, ensuring confidential data is truly eliminated.",
    relatedTools: [
      { name: "Permanent Redaction", href: "/tools/redact-pdf" },
    ],
    letter: "R",
  },
  {
    term: "Service Worker",
    definition: "A script that runs in the background of a web browser, separate from the main page. Service workers enable offline functionality, background synchronisation, and content caching without requiring active user interaction.",
    privacyImpact: "Plain's service worker caches the application code locally, enabling offline use. No network requests are made once cached, and no usage data is transmitted.",
    relatedTools: [
      { name: "Offline Mode", href: "/tools" },
    ],
    letter: "S",
  },
  {
    term: "GDPR (General Data Protection Regulation)",
    definition: "European Union legislation governing data protection and privacy. GDPR establishes strict requirements for how organisations collect, process, store, and share personal data, with significant penalties for non-compliance.",
    privacyImpact: "Plain is GDPR-compliant by design. Since we never collect or process your document data, there is no personal data handling to regulate. Your data sovereignty is absolute.",
    relatedTools: [
      { name: "Privacy Policy", href: "/privacy" },
    ],
    letter: "G",
  },
  {
    term: "UK GDPR",
    definition: "The United Kingdom's domestic data protection framework, derived from EU GDPR and enshrined in the Data Protection Act 2018. UK GDPR maintains equivalent protections for UK residents following Brexit.",
    privacyImpact: "Plain operates from the UK and adheres to UK GDPR principles. Our local-first architecture exceeds compliance requirements by eliminating data collection entirely.",
    relatedTools: [
      { name: "About Plain", href: "/about" },
    ],
    letter: "U",
  },
  {
    term: "Lossless Compression",
    definition: "A data compression method that reduces file size without any loss of information. The original data can be perfectly reconstructed from the compressed version, unlike lossy compression which permanently discards some data.",
    privacyImpact: "Plain's PDF compression uses lossless techniques where possible, ensuring your document quality is preserved. All compression occurs locally without uploading files.",
    relatedTools: [
      { name: "Compress PDF", href: "/tools/compress-pdf" },
    ],
    letter: "L",
  },
  {
    term: "Metadata",
    definition: "Data that provides information about other data. In PDFs, metadata includes properties like author name, creation date, software used, and editing history. This hidden information can inadvertently expose sensitive details.",
    privacyImpact: "Plain can remove PDF metadata locally, eliminating hidden information that might reveal authorship, editing history, or software details you wish to keep private.",
    relatedTools: [
      { name: "Remove Metadata", href: "/tools/remove-metadata" },
    ],
    letter: "M",
  },
  {
    term: "Blob URL",
    definition: "A temporary URL created by the browser to reference binary data stored in memory. Blob URLs allow web applications to handle files locally without server interaction, automatically expiring when the page session ends.",
    privacyImpact: "Plain uses Blob URLs for file downloads, meaning your processed documents exist only in browser memory until you explicitly save them. No server storage is involved.",
    relatedTools: [
      { name: "All Downloads", href: "/tools" },
    ],
    letter: "B",
  },
  {
    term: "WebLLM",
    definition: "A framework for running large language models directly in web browsers using WebGPU acceleration. WebLLM enables private AI capabilities without requiring server infrastructure or API calls.",
    privacyImpact: "Plain's AI features use WebLLM to run language models on your device. Your questions and document content are processed by your own hardware, not external AI services.",
    relatedTools: [
      { name: "AI Chat with PDF", href: "/tools/ai-chat-pdf" },
      { name: "Instant Summary", href: "/tools/summarise-pdf" },
    ],
    letter: "W",
  },
]

// Generate JSON-LD schema for DefinedTermSet
function generateGlossarySchema() {
  return {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    "@id": "https://plainpdf.com/learn/glossary",
    "name": "Plain PDF Technical Glossary",
    "description": "Comprehensive glossary of privacy-first document processing terminology including WebAssembly, WebGPU, and browser-based security concepts.",
    "inLanguage": "en-GB",
    "hasPart": glossaryTerms.map((item) => ({
      "@type": "DefinedTerm",
      "name": item.term,
      "description": item.definition,
      "inDefinedTermSet": "https://plainpdf.com/learn/glossary",
    })),
  }
}

// Get unique letters from terms
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")

export default function GlossaryPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({})
  
  // Filter and group terms
  const filteredTerms = useMemo(() => {
    const query = searchQuery.toLowerCase()
    return glossaryTerms.filter(
      (item) =>
        item.term.toLowerCase().includes(query) ||
        item.definition.toLowerCase().includes(query)
    )
  }, [searchQuery])
  
  const groupedTerms = useMemo(() => {
    const groups: Record<string, typeof glossaryTerms> = {}
    filteredTerms.forEach((item) => {
      if (!groups[item.letter]) {
        groups[item.letter] = []
      }
      groups[item.letter].push(item)
    })
    // Sort by letter
    return Object.keys(groups)
      .sort()
      .reduce((acc, letter) => {
        acc[letter] = groups[letter].sort((a, b) => a.term.localeCompare(b.term))
        return acc
      }, {} as Record<string, typeof glossaryTerms>)
  }, [filteredTerms])
  
  const availableLetters = useMemo(() => {
    return new Set(Object.keys(groupedTerms))
  }, [groupedTerms])
  
  // Track active section on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id.replace("section-", ""))
          }
        })
      },
      { rootMargin: "-100px 0px -70% 0px" }
    )
    
    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref)
    })
    
    return () => observer.disconnect()
  }, [groupedTerms])
  
  const scrollToLetter = (letter: string) => {
    const section = sectionRefs.current[letter]
    if (section) {
      const yOffset = -120
      const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: "smooth" })
    }
  }
  
  const jsonLdSchema = generateGlossarySchema()
  
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Script
        id="glossary-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
      />
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative border-b border-[#333] px-4 py-16 md:py-20">
          <div className="pointer-events-none absolute inset-0 hero-grid-pattern opacity-30" />
          
          <div className="relative mx-auto max-w-4xl">
            {/* Breadcrumb */}
            <nav className="mb-6 flex items-center gap-2 text-[13px] text-white/40">
              <Link href="/learn" className="transition-colors hover:text-white/70">
                Learning Centre
              </Link>
              <span>/</span>
              <span className="text-white/70">Glossary</span>
            </nav>
            
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#0070f3]/10 ring-1 ring-[#0070f3]/25">
                <BookOpen className="h-7 w-7 text-[#0070f3]" strokeWidth={1.5} />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-[-0.03em] text-white md:text-4xl">
                  Technical Glossary
                </h1>
                <p className="mt-2 text-[15px] leading-relaxed text-white/60">
                  A comprehensive reference guide to privacy-first document processing terminology. 
                  Understanding these concepts helps you verify how Plain protects your data.
                </p>
              </div>
            </div>
            
            {/* Search Bar */}
            <div className="mt-8">
              <div className="relative">
                <Search 
                  className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" 
                  strokeWidth={2} 
                />
                <input
                  type="text"
                  placeholder="Search terms..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-[#333] bg-[#111] py-3.5 ps-12 pe-4 text-[14px] text-white placeholder:text-white/40 outline-none transition-all duration-200 focus:border-[#0070f3] focus:shadow-[0_0_15px_rgba(0,112,243,0.25)]"
                />
                {searchQuery && (
                  <span className="absolute end-4 top-1/2 -translate-y-1/2 text-[12px] text-white/40">
                    {filteredTerms.length} term{filteredTerms.length !== 1 ? "s" : ""}
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>
        
        {/* Sticky A-Z Navigation */}
        <nav className="sticky top-[64px] z-40 border-b border-[#333] bg-[#0a0a0a]/95 backdrop-blur-md">
          <div className="mx-auto max-w-4xl px-4 py-3">
            <div className="flex flex-wrap items-center justify-center gap-1">
              {alphabet.map((letter) => {
                const isAvailable = availableLetters.has(letter)
                const isActive = activeSection === letter
                return (
                  <button
                    key={letter}
                    onClick={() => isAvailable && scrollToLetter(letter)}
                    disabled={!isAvailable}
                    className={`flex h-8 w-8 items-center justify-center rounded font-mono text-[13px] font-semibold transition-all duration-150 ${
                      isActive
                        ? "bg-[#0070f3] text-white"
                        : isAvailable
                        ? "text-white/60 hover:bg-white/[0.06] hover:text-white"
                        : "cursor-default text-white/20"
                    }`}
                  >
                    {letter}
                  </button>
                )
              })}
            </div>
          </div>
        </nav>
        
        {/* Glossary Content */}
        <section className="px-4 py-12 md:py-16">
          <div className="mx-auto max-w-4xl">
            {Object.keys(groupedTerms).length === 0 ? (
              <div className="rounded-xl border border-[#333] bg-[#111] p-12 text-center">
                <p className="text-[15px] text-white/60">
                  No terms found matching &ldquo;{searchQuery}&rdquo;
                </p>
              </div>
            ) : (
              <div className="space-y-12">
                {Object.entries(groupedTerms).map(([letter, terms]) => (
                  <section
                    key={letter}
                    id={`section-${letter}`}
                    ref={(el) => { sectionRefs.current[letter] = el }}
                  >
                    {/* Letter Header */}
                    <div className="mb-6 flex items-center gap-4">
                      <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#0070f3]/10 font-mono text-2xl font-bold text-[#0070f3] ring-1 ring-[#0070f3]/25">
                        {letter}
                      </span>
                      <div className="h-px flex-1 bg-gradient-to-r from-[#333] to-transparent" />
                    </div>
                    
                    {/* Terms Grid */}
                    <div className="space-y-4">
                      {terms.map((item) => (
                        <article
                          key={item.term}
                          className="group rounded-xl border border-[#333] bg-[#111] p-6 transition-all duration-300 hover:border-[#0070f3]/50 hover:shadow-[0_0_30px_rgba(0,112,243,0.08)]"
                        >
                          {/* Term */}
                          <h3 className="font-mono text-[17px] font-bold text-[#0070f3]" translate="no">
                            {item.term}
                          </h3>
                          
                          {/* Definition */}
                          <p className="mt-3 text-[14px] leading-relaxed text-white/70">
                            {item.definition}
                          </p>
                          
                          {/* Privacy Impact */}
                          <div className="mt-4 rounded-lg border border-[#222] bg-[#0a0a0a] p-4">
                            <h4 className="text-[12px] font-semibold uppercase tracking-wider text-white/50">
                              Why it matters for your privacy
                            </h4>
                            <p className="mt-2 text-[13px] leading-relaxed text-white/60">
                              {item.privacyImpact}
                            </p>
                          </div>
                          
                          {/* Related Tools */}
                          <div className="mt-4 flex flex-wrap items-center gap-2">
                            <span className="text-[11px] font-medium uppercase tracking-wider text-white/40">
                              Used in:
                            </span>
                            {item.relatedTools.map((tool) => (
                              <Link
                                key={tool.href}
                                href={tool.href}
                                className="inline-flex items-center gap-1 rounded-md border border-[#333] bg-[#0a0a0a] px-2 py-1 text-[11px] font-medium text-white/60 transition-all hover:border-[#0070f3]/50 hover:text-[#0070f3]"
                              >
                                {tool.name}
                                <ExternalLink className="h-2.5 w-2.5" />
                              </Link>
                            ))}
                          </div>
                        </article>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            )}
            
            {/* Back to Learning Centre */}
            <div className="mt-16 flex justify-center">
              <Link
                href="/learn"
                className="inline-flex items-center gap-2 rounded-lg border border-[#333] bg-[#111] px-6 py-3 text-[14px] font-medium text-white/70 transition-all hover:border-[#0070f3]/50 hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Learning Centre
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
}
