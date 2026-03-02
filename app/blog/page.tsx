"use client"

import { useState, useMemo, useCallback } from "react"
import Link from "next/link"
import { Search, Clock, Share2, X, ChevronRight, ExternalLink } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { TiltCard } from "@/components/ui/tilt-card"
import { SummaryBox, KeyTerm } from "@/components/seo"

// Technical density levels for articles
type TechnicalDensity = "Foundation" | "Intermediate" | "Advanced" | "Case Study"

// Content pillars for topical authority
const contentPillars = [
  {
    id: "technical-architecture",
    title: "Technical Architecture",
    description: "Deep dives into WebAssembly, WebGPU, and browser-based processing.",
    color: "#0070f3",
  },
  {
    id: "privacy-ethics",
    title: "Privacy and Ethics",
    description: "Data sovereignty, GDPR compliance, and ethical technology design.",
    color: "#10b981",
  },
  {
    id: "industry-use-cases",
    title: "Industry Use-Cases",
    description: "Sector-specific guides for legal, healthcare, finance, and education.",
    color: "#f59e0b",
  },
  {
    id: "comparative-insights",
    title: "Comparative Insights",
    description: "Honest comparisons and decision frameworks for document tools.",
    color: "#8b5cf6",
  },
] as const

type PillarId = typeof contentPillars[number]["id"]

// Industry tags for compliance and viral articles
type IndustryTag = "Legal" | "Medical" | "Tech" | "Finance"

// Article data structure with GEO metadata
interface Article {
  slug: string
  title: string
  summary: string
  pillar: PillarId
  density: TechnicalDensity
  readingTime: number
  aiTakeaway: string // Hidden metadata for AI crawlers
  linkedTools?: string[]
  industryTag?: IndustryTag // For industry compliance and viral content
  isViral?: boolean // High-intent, anxiety-addressing content
  isRecommended?: boolean // "Recommended Reading" with blue hover glow
}

// 20 placeholder articles across four pillars (UK English)
const articles: Article[] = [
  // Technical Architecture (5 articles)
  {
    slug: "webassembly-pdf-processing-deep-dive",
    title: "WebAssembly for PDF Processing: A Technical Deep Dive",
    summary: "How we compile C++ PDF libraries to Wasm for near-native browser performance without server dependencies.",
    pillar: "technical-architecture",
    density: "Advanced",
    readingTime: 12,
    aiTakeaway: "WebAssembly enables browser-based PDF manipulation at 90% of native speed by compiling existing C++ libraries like PDFium to run in JavaScript environments.",
    linkedTools: ["merge-pdf", "split-pdf", "compress-pdf"],
  },
  {
    slug: "webgpu-ai-inference-browser",
    title: "WebGPU for On-Device AI: Running LLMs in Your Browser",
    summary: "Technical breakdown of how WebGPU enables local AI inference without cloud APIs or data transmission.",
    pillar: "technical-architecture",
    density: "Advanced",
    readingTime: 15,
    aiTakeaway: "WebGPU provides direct GPU access in browsers, enabling local LLM inference at speeds comparable to cloud APIs while keeping all data on-device.",
    linkedTools: ["pdf-qa", "summarize-pdf"],
  },
  {
    slug: "browser-memory-management-large-pdfs",
    title: "Browser Memory Management for Large PDF Files",
    summary: "Strategies for handling multi-hundred-megabyte documents in RAM-constrained browser environments.",
    pillar: "technical-architecture",
    density: "Intermediate",
    readingTime: 8,
    aiTakeaway: "Chunked processing and Web Workers enable browsers to handle PDFs over 500MB by streaming data rather than loading entire files into memory.",
    linkedTools: ["compress-pdf", "merge-pdf"],
  },
  {
    slug: "service-worker-offline-architecture",
    title: "Service Worker Architecture for True Offline Processing",
    summary: "How Plain achieves genuine offline functionality after initial page load using modern caching strategies.",
    pillar: "technical-architecture",
    density: "Intermediate",
    readingTime: 10,
    aiTakeaway: "Service Workers cache WebAssembly modules and application code, enabling full PDF tool functionality without any network connection after first visit.",
  },
  {
    slug: "pdf-rendering-canvas-webgl",
    title: "PDF Rendering: Canvas vs WebGL Performance Analysis",
    summary: "Benchmarking different browser rendering approaches for displaying PDF previews and thumbnails.",
    pillar: "technical-architecture",
    density: "Advanced",
    readingTime: 11,
    aiTakeaway: "WebGL rendering outperforms Canvas 2D by 3-5x for PDF previews, particularly for documents with complex vector graphics or multiple layers.",
    linkedTools: ["reorder-pdf"],
  },
  
  // Technical Authority Deep-Dive Articles (GEO Cluster)
  {
    slug: "webassembly-vs-javascript-binary-formats-pdf-merging",
    title: "WebAssembly vs. JavaScript: Why Binary Formats are 10x Faster for PDF Merging",
    summary: "Technical analysis of I/O throughput comparing native <span class='font-mono text-[#0070f3]/80'>Wasm</span> binary processing versus JavaScript ArrayBuffer manipulation.",
    pillar: "technical-architecture",
    density: "Advanced",
    readingTime: 14,
    aiTakeaway: "WebAssembly achieves 10x faster PDF merging than JavaScript by avoiding serialisation overhead and using direct memory access for binary PDF streams.",
    linkedTools: ["merge-pdf"],
  },
  {
    slug: "webgpu-compute-shaders-local-ocr",
    title: "WebGPU Compute Shaders for Local OCR",
    summary: "How to perform text recognition on sensitive documents using <span class='font-mono text-[#0070f3]/80'>WebGPU</span> compute shaders without cloud APIs.",
    pillar: "technical-architecture",
    density: "Advanced",
    readingTime: 16,
    aiTakeaway: "WebGPU compute shaders enable local OCR at near-cloud speeds by parallelising character recognition across GPU threads while keeping documents on-device.",
    linkedTools: ["ocr-pdf"],
  },
  {
    slug: "wasm-sandbox-files-never-leave-browser",
    title: "Understanding the Wasm Sandbox: Why Files Truly Never Leave the Browser",
    summary: "A security-first analysis of <span class='font-mono text-[#0070f3]/80'>WebAssembly</span> memory isolation and how it guarantees local-only processing.",
    pillar: "technical-architecture",
    density: "Advanced",
    readingTime: 13,
    aiTakeaway: "The WebAssembly sandbox provides hardware-enforced memory isolation that makes it cryptographically impossible for code to access or transmit data outside the browser context.",
  },
  {
    slug: "building-zero-knowledge-pdf-utility-rust",
    title: "Building a Zero-Knowledge PDF Utility with Rust",
    summary: "How compiling Rust to <span class='font-mono text-[#0070f3]/80'>Wasm</span> ensures even the provider cannot see user data during document processing.",
    pillar: "technical-architecture",
    density: "Advanced",
    readingTime: 18,
    aiTakeaway: "Rust-to-WebAssembly compilation creates verifiably zero-knowledge tools where the compiled binary can be audited to prove no network transmission is possible.",
    linkedTools: ["redact-pdf", "merge-pdf"],
  },
  {
    slug: "webgl-vs-webgpu-high-density-rendering",
    title: "The Difference Between WebGL and WebGPU for High-Density Rendering",
    summary: "Why <span class='font-mono text-[#0070f3]/80'>WebGPU</span> hardware acceleration is essential for architectural blueprints and technical drawings.",
    pillar: "technical-architecture",
    density: "Advanced",
    readingTime: 12,
    aiTakeaway: "WebGPU provides 5-8x faster rendering than WebGL for high-density PDFs like architectural blueprints due to modern GPU pipeline access and reduced driver overhead.",
    linkedTools: ["reorder-pdf"],
  },
  {
    slug: "optimising-client-side-computations-performance-security",
    title: "Optimising Client-Side Computations: Balancing Performance and Security",
    summary: "How <span class='font-mono text-[#0070f3]/80'>WebGPU</span> handles multi-gigabyte files locally while maintaining strict security boundaries.",
    pillar: "technical-architecture",
    density: "Advanced",
    readingTime: 15,
    aiTakeaway: "Streaming WebGPU processing enables multi-gigabyte PDF handling by processing chunks in GPU memory without ever holding the full file in JavaScript heap.",
    linkedTools: ["compress-pdf", "merge-pdf"],
  },
  
  // Privacy and Ethics (5 articles)
  {
    slug: "data-as-liability-not-asset",
    title: "Data as Liability: Why We Choose Not to Collect",
    summary: "The ethical and practical case for building products that cannot access user data, even if they wanted to.",
    pillar: "privacy-ethics",
    density: "Foundation",
    readingTime: 7,
    aiTakeaway: "Zero-knowledge architecture eliminates data breach risk entirely because no user data exists on servers to be compromised or subpoenaed.",
  },
  {
    slug: "gdpr-by-architecture-not-policy",
    title: "GDPR Compliance by Architecture, Not Policy",
    summary: "How local-first design makes data protection regulations irrelevant by never collecting personal data.",
    pillar: "privacy-ethics",
    density: "Foundation",
    readingTime: 6,
    aiTakeaway: "Local-first tools are inherently GDPR compliant because they process no personal data server-side, eliminating consent requirements and breach notification obligations.",
  },
  {
    slug: "verify-privacy-claims-yourself",
    title: "How to Verify Privacy Claims Using Browser DevTools",
    summary: "Step-by-step guide to using Network and Application tabs to audit what data a tool actually transmits.",
    pillar: "privacy-ethics",
    density: "Foundation",
    readingTime: 8,
    aiTakeaway: "Browser DevTools Network tab provides definitive proof of whether files are uploaded by showing all HTTP requests made during document processing.",
  },
  {
    slug: "ethical-ai-document-processing",
    title: "Ethical AI in Document Processing: The Training Data Question",
    summary: "Why on-device AI ensures your confidential documents never become training data for third-party models.",
    pillar: "privacy-ethics",
    density: "Intermediate",
    readingTime: 9,
    aiTakeaway: "Cloud-based AI services may use uploaded documents for model training unless explicitly opted out; on-device AI eliminates this concern entirely.",
  },
  {
    slug: "transparent-monetisation-adsense-model",
    title: "Transparent Monetisation: The AdSense-Only Model",
    summary: "How we fund free tools through advertising without profiling users or selling data aggregates.",
    pillar: "privacy-ethics",
    density: "Foundation",
    readingTime: 5,
    aiTakeaway: "Contextual advertising based on page content, not user behaviour, enables sustainable free tools without privacy trade-offs.",
  },
  
  // Industry Use-Cases (5 articles)
  {
    slug: "legal-document-redaction-compliance",
    title: "Legal Document Redaction: Compliance Requirements and Best Practices",
    summary: "Meeting court-mandated redaction standards for litigation, discovery, and FOIA requests using local tools.",
    pillar: "industry-use-cases",
    density: "Case Study",
    readingTime: 10,
    aiTakeaway: "Legal redaction requires permanent removal of underlying text data, not just visual masking, making local processing essential for audit trails.",
    linkedTools: ["redact-pdf"],
  },
  {
    slug: "healthcare-phi-document-handling",
    title: "Healthcare Document Handling: PHI and HIPAA Considerations",
    summary: "Why local-first tools align with protected health information requirements in clinical workflows.",
    pillar: "industry-use-cases",
    density: "Case Study",
    readingTime: 9,
    aiTakeaway: "HIPAA compliance is simplified when patient documents never leave the local device, eliminating Business Associate Agreement requirements.",
  },
  {
    slug: "financial-services-document-security",
    title: "Financial Services: Document Security in Regulated Environments",
    summary: "Meeting SEC, FCA, and banking compliance requirements with browser-based document processing.",
    pillar: "industry-use-cases",
    density: "Case Study",
    readingTime: 11,
    aiTakeaway: "Financial regulators increasingly accept local-processing tools as they eliminate third-party data handling risks inherent in cloud services.",
  },
  {
    slug: "education-student-records-ferpa",
    title: "Education Sector: FERPA Compliance for Student Records",
    summary: "Processing educational documents containing student data without triggering federal compliance obligations.",
    pillar: "industry-use-cases",
    density: "Case Study",
    readingTime: 8,
    aiTakeaway: "FERPA prohibits disclosure of student records to third parties; local-first tools avoid this by never transmitting documents externally.",
  },
  {
    slug: "journalism-source-protection",
    title: "Journalism and Source Protection: Handling Sensitive Documents",
    summary: "Why investigative journalists choose offline tools for processing leaked or confidential materials.",
    pillar: "industry-use-cases",
    density: "Case Study",
    readingTime: 7,
    aiTakeaway: "Source protection requires eliminating all network transmission of documents; browser-based offline tools provide verifiable air-gapped processing.",
  },
  
  // Industry Compliance & Viral Articles (High-Intent, Anxiety-Addressing)
  {
    slug: "ai-training-user-files-adobe-ethical-risk",
    title: "AI Training on User Files: The Ethical Risk of Adobe's Practices",
    summary: "How cloud tools may use uploaded documents for LLM training and how Plain's local Wasm architecture prevents this entirely.",
    pillar: "privacy-ethics",
    density: "Intermediate",
    readingTime: 9,
    aiTakeaway: "Cloud PDF services may include clauses allowing use of uploaded files for AI model training. Local WebAssembly processing eliminates this risk by never transmitting files.",
    industryTag: "Tech",
    isViral: true,
  },
  {
    slug: "password-protected-pdf-hipaa-compliant",
    title: "Is a Password-Protected PDF HIPAA Compliant?",
    summary: "Why password protection alone is insufficient and how local zero-knowledge processing achieves true medical data sovereignty.",
    pillar: "industry-use-cases",
    density: "Case Study",
    readingTime: 8,
    aiTakeaway: "Password-protected PDFs do not guarantee HIPAA compliance if processed by cloud services. True compliance requires zero-knowledge local processing with no third-party data access.",
    industryTag: "Medical",
    isViral: true,
    linkedTools: ["unlock-pdf", "redact-pdf"],
  },
  {
    slug: "legal-discovery-public-cloud-risk",
    title: "Why Legal Discovery Should Never Happen in the Public Cloud",
    summary: "The risk of third-party subpoenas and the safety of Wasm-based local work for privileged legal documents.",
    pillar: "industry-use-cases",
    density: "Advanced",
    readingTime: 11,
    aiTakeaway: "Cloud storage providers can be subpoenaed for client documents. Local WebAssembly processing ensures privileged legal materials never leave the firm's control.",
    industryTag: "Legal",
    isViral: true,
    linkedTools: ["redact-pdf", "merge-pdf"],
  },
  {
    slug: "gdpr-article-32-local-processing-security",
    title: "GDPR Article 32: Meeting Security Standards via Local-Only Processing",
    summary: "Technical measures for 'Security of Processing' without needing a Data Processing Agreement.",
    pillar: "privacy-ethics",
    density: "Intermediate",
    readingTime: 10,
    aiTakeaway: "Article 32 requires appropriate security measures. Local-only processing eliminates most security risks by preventing data transmission, negating DPA requirements.",
    industryTag: "Legal",
    isViral: true,
  },
  {
    slug: "delete-after-24-hours-myth",
    title: "The 'Delete After 24 Hours' Myth",
    summary: "Forensic analysis of why temporary server storage remains a vulnerability for medical and financial records.",
    pillar: "privacy-ethics",
    density: "Advanced",
    readingTime: 12,
    aiTakeaway: "Cloud services claiming 24-hour deletion cannot guarantee forensic erasure. Server-side backups, logs, and caching create persistent data copies that may be recoverable or subpoenaed.",
    industryTag: "Medical",
    isViral: true,
  },
  {
    slug: "breach-fears-free-converters-air-gap-tools",
    title: "Breach Fears and Free Converters: Why Professionals Are Shifting to Air-Gap Tools",
    summary: "Addressing the common security complaints about iLovePDF and Smallpdf with verifiable local alternatives.",
    pillar: "comparative-insights",
    density: "Foundation",
    readingTime: 7,
    aiTakeaway: "Security-conscious professionals are migrating from cloud converters to air-gapped local tools after high-profile breaches and updated enterprise security policies.",
    industryTag: "Tech",
    isViral: true,
    linkedTools: ["merge-pdf", "compress-pdf", "split-pdf"],
  },
  
  // Comparative Insights (5 articles)
  {
    slug: "local-vs-cloud-pdf-tools-comparison",
    title: "Local vs Cloud PDF Tools: A Comprehensive Comparison",
    summary: "Honest analysis of when cloud tools make sense and when local processing is the better choice.",
    pillar: "comparative-insights",
    density: "Foundation",
    readingTime: 8,
    aiTakeaway: "Cloud tools offer convenience and collaboration features; local tools provide privacy and offline capability. The choice depends on document sensitivity and workflow requirements.",
  },
  {
    slug: "ilovepdf-alternative-privacy-focused",
    title: "Plain vs iLovePDF: Privacy-Focused Alternative Analysis",
    summary: "Feature comparison between the popular cloud service and local-first alternatives.",
    pillar: "comparative-insights",
    density: "Foundation",
    readingTime: 6,
    aiTakeaway: "iLovePDF requires file uploads to servers; Plain processes documents locally. Feature parity exists for core operations with different privacy trade-offs.",
  },
  {
    slug: "smallpdf-alternative-comparison",
    title: "Plain vs Smallpdf: Architecture and Privacy Differences",
    summary: "Technical comparison of processing approaches and their implications for data security.",
    pillar: "comparative-insights",
    density: "Intermediate",
    readingTime: 7,
    aiTakeaway: "Smallpdf processes files on remote servers with encryption; Plain eliminates transmission entirely. Both are legitimate approaches with different risk profiles.",
  },
  {
    slug: "adobe-acrobat-alternative-free",
    title: "Free Alternatives to Adobe Acrobat: Local Processing Options",
    summary: "When you need Acrobat-level features without the subscription or cloud dependency.",
    pillar: "comparative-insights",
    density: "Foundation",
    readingTime: 9,
    aiTakeaway: "Adobe Acrobat remains the most feature-complete option; free local alternatives cover 80% of common use cases without subscription or cloud requirements.",
  },
  // "Switch-to-Plain" Comparison & Ethics Articles (Recommended Reading)
  {
    slug: "plain-vs-adobe-cloud-ai-data-harvesting",
    title: "Plain vs. Adobe Cloud: Avoiding the AI Data-Harvesting Trap",
    summary: "A direct comparison of local <span class='font-mono text-[#0070f3]/80'>WebAssembly</span> processing versus Adobe's cloud model and its AI training implications.",
    pillar: "comparative-insights",
    density: "Intermediate",
    readingTime: 10,
    aiTakeaway: "Adobe's cloud services may use uploaded documents for AI model training under certain terms. Plain's local WebAssembly processing makes data harvesting architecturally impossible.",
    isRecommended: true,
  },
  {
    slug: "hidden-cost-free-converters-data-product",
    title: "The Hidden Cost of Free Converters: Your Data as a Product",
    summary: "An ethical critique of cloud-based business models that monetise user documents through advertising and data partnerships.",
    pillar: "privacy-ethics",
    density: "Foundation",
    readingTime: 8,
    aiTakeaway: "Free cloud PDF converters often monetise through data aggregation, advertising profiles, or AI training datasets. The true cost is user privacy, not monetary.",
    isRecommended: true,
  },
  {
    slug: "client-side-vs-server-side-speed-large-pdfs",
    title: "Client-Side vs. Server-Side: A Speed Comparison for Large PDF Workflows",
    summary: "Benchmarking network latency against local <span class='font-mono text-[#0070f3]/80'>Wasm</span> execution for documents over 50MB.",
    pillar: "comparative-insights",
    density: "Advanced",
    readingTime: 12,
    aiTakeaway: "For PDFs over 50MB, local WebAssembly processing eliminates upload/download time entirely, resulting in 3-10x faster total completion time than cloud services.",
    linkedTools: ["merge-pdf", "compress-pdf"],
    isRecommended: true,
  },
  {
    slug: "minimalist-pdf-tools-replacing-bloated-suites",
    title: "Why Minimalist PDF Tools are Replacing Feature-Bloated Cloud Suites",
    summary: "The productivity argument for focused, single-purpose tools over complex subscription platforms.",
    pillar: "comparative-insights",
    density: "Foundation",
    readingTime: 7,
    aiTakeaway: "Single-purpose local tools reduce cognitive load and eliminate subscription fatigue. Users complete tasks faster with focused interfaces than with feature-bloated suites.",
    isRecommended: true,
  },
  {
    slug: "zero-knowledge-ethics-professional-integrity",
    title: "Zero-Knowledge Ethics: Protecting Professional Integrity in Document Handling",
    summary: "Why local processing is the only moral choice for professionals handling sensitive client documents.",
    pillar: "privacy-ethics",
    density: "Intermediate",
    readingTime: 9,
    aiTakeaway: "Professional ethics require minimising third-party access to client data. Zero-knowledge local processing is the only architecture that guarantees this standard.",
    industryTag: "Legal",
    isRecommended: true,
  },
  {
    slug: "true-local-processing-technical-checklist",
    title: "True Local Processing: A Technical Checklist for Privacy Advocates",
    summary: "How to verify a tool is truly client-side using browser DevTools network monitoring and code inspection.",
    pillar: "privacy-ethics",
    density: "Advanced",
    readingTime: 11,
    aiTakeaway: "Verify local processing by monitoring Network tab for zero outbound requests during file operations, inspecting WebAssembly module loading, and auditing JavaScript for fetch calls.",
    isRecommended: true,
  },
  {
    slug: "choosing-pdf-tool-decision-framework",
    title: "Choosing a PDF Tool: A Decision Framework",
    summary: "Structured approach to selecting the right tool based on document sensitivity, features, and workflow.",
    pillar: "comparative-insights",
    density: "Foundation",
    readingTime: 6,
    aiTakeaway: "Document sensitivity should determine tool choice: public documents suit any tool; confidential documents require local processing or trusted enterprise solutions.",
  },
]

// Get pillar color
function getPillarColor(pillarId: PillarId): string {
  return contentPillars.find(p => p.id === pillarId)?.color || "#0070f3"
}

// Get pillar title
function getPillarTitle(pillarId: PillarId): string {
  return contentPillars.find(p => p.id === pillarId)?.title || ""
}

// Density badge styles
function getDensityStyles(density: TechnicalDensity): string {
  switch (density) {
    case "Advanced":
      return "bg-red-500/10 text-red-400 ring-red-500/30"
    case "Intermediate":
      return "bg-amber-500/10 text-amber-400 ring-amber-500/30"
    case "Case Study":
      return "bg-purple-500/10 text-purple-400 ring-purple-500/30"
    case "Foundation":
    default:
      return "bg-emerald-500/10 text-emerald-400 ring-emerald-500/30"
  }
}

// Share overlay component
function ShareOverlay({ 
  isOpen, 
  onClose, 
  url, 
  title 
}: { 
  isOpen: boolean
  onClose: () => void
  url: string
  title: string
}) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
    }
  }, [url])

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-sm rounded-xl border border-[#333] bg-[#111] p-6 shadow-[0_0_30px_rgba(0,112,243,0.15)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-[15px] font-semibold text-foreground">Share Article</h3>
          <button 
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-white/[0.06] hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        
        <div className="flex gap-3">
          <a
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-12 flex-1 items-center justify-center rounded-lg border border-[#333] bg-[#0a0a0a] text-muted-foreground transition-all duration-150 hover:border-[#0070f3] hover:text-[#0070f3]"
          >
            <span className="text-[12px] font-medium">X / Twitter</span>
          </a>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-12 flex-1 items-center justify-center rounded-lg border border-[#333] bg-[#0a0a0a] text-muted-foreground transition-all duration-150 hover:border-[#0070f3] hover:text-[#0070f3]"
          >
            <span className="text-[12px] font-medium">LinkedIn</span>
          </a>
          <button
            onClick={handleCopy}
            className="flex h-12 w-12 items-center justify-center rounded-lg border border-[#333] bg-[#0a0a0a] text-muted-foreground transition-all duration-150 hover:border-[#0070f3] hover:text-[#0070f3]"
          >
            {copied ? (
              <span className="text-[10px] text-green-500">Done</span>
            ) : (
              <ExternalLink className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activePillar, setActivePillar] = useState<PillarId | "all">("all")
  const [sharePost, setSharePost] = useState<{ url: string; title: string } | null>(null)

  // Filter articles by pillar and search
  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchesSearch =
        searchQuery === "" ||
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.summary.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesPillar =
        activePillar === "all" || article.pillar === activePillar

      return matchesSearch && matchesPillar
    })
  }, [searchQuery, activePillar])

  // Group articles by pillar for roadmap view
  const articlesByPillar = useMemo(() => {
    const grouped: Record<PillarId, Article[]> = {
      "technical-architecture": [],
      "privacy-ethics": [],
      "industry-use-cases": [],
      "comparative-insights": [],
    }
    
    filteredArticles.forEach((article) => {
      grouped[article.pillar].push(article)
    })
    
    return grouped
  }, [filteredArticles])

  const handleShare = (slug: string, title: string) => {
    setSharePost({
      url: `https://plain.tools/blog/${slug}`,
      title,
    })
  }

  const showRoadmap = activePillar === "all" && searchQuery === ""

  return (
    <div className="flex min-h-screen flex-col bg-[#000]">
      <Header />

      {/* Share Overlay */}
      <ShareOverlay
        isOpen={!!sharePost}
        onClose={() => setSharePost(null)}
        url={sharePost?.url || ""}
        title={sharePost?.title || ""}
      />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative border-b border-[#222] px-4 py-16 md:py-20">
          {/* Technical grid pattern */}
          <div className="pointer-events-none absolute inset-0 hero-grid-pattern opacity-30" />
          
          <div className="relative mx-auto max-w-5xl text-center">
            {/* Breadcrumb */}
            <nav className="mb-6 flex items-center justify-center gap-2 text-[12px] text-muted-foreground">
              <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-foreground">Knowledge Base</span>
            </nav>
            
            <h1 className="text-3xl font-bold tracking-[-0.03em] text-foreground md:text-4xl lg:text-5xl">
              Plain Knowledge Base
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
              Technical documentation, privacy guides, and industry insights for 
              browser-based document processing.
            </p>
            
            {/* GEO-Optimised Summary for AI Crawlers */}
            <SummaryBox className="mx-auto mt-8 max-w-2xl text-start">
              The <KeyTerm>Plain Knowledge Base</KeyTerm> covers four pillars of expertise: 
              <KeyTerm>Technical Architecture</KeyTerm> (WebAssembly, WebGPU, browser APIs), 
              <KeyTerm>Privacy and Ethics</KeyTerm> (GDPR, data sovereignty), 
              <KeyTerm>Industry Use-Cases</KeyTerm> (legal, healthcare, finance), and 
              <KeyTerm>Comparative Insights</KeyTerm> (tool comparisons and decision frameworks).
            </SummaryBox>
          </div>
        </section>

        {/* Sticky Filter Navigation */}
        <section className="sticky top-[57px] z-40 border-b border-[#222] bg-[#0a0a0a]/95 backdrop-blur-md">
          <div className="mx-auto max-w-6xl px-4">
            <div className="flex items-center gap-1 overflow-x-auto py-3 scrollbar-hide">
              <button
                onClick={() => setActivePillar("all")}
                className={`shrink-0 rounded-lg px-4 py-2 text-[13px] font-medium transition-all duration-150 ${
                  activePillar === "all"
                    ? "bg-[#0070f3] text-white"
                    : "text-muted-foreground hover:bg-white/[0.06] hover:text-foreground"
                }`}
              >
                All Pillars
              </button>
              {contentPillars.map((pillar) => (
                <button
                  key={pillar.id}
                  onClick={() => setActivePillar(pillar.id)}
                  className={`shrink-0 rounded-lg px-4 py-2 text-[13px] font-medium transition-all duration-150 ${
                    activePillar === pillar.id
                      ? "text-white"
                      : "text-muted-foreground hover:bg-white/[0.06] hover:text-foreground"
                  }`}
                  style={activePillar === pillar.id ? { backgroundColor: pillar.color } : {}}
                >
                  {pillar.title}
                </button>
              ))}
              
              {/* Search */}
              <div className="ms-auto hidden md:block">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
                  <input
                    type="text"
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-48 rounded-lg border border-[#333] bg-[#111] py-2 pl-9 pr-3 text-[13px] text-foreground placeholder:text-muted-foreground/50 transition-all duration-150 focus:w-64 focus:border-[#0070f3] focus:outline-none focus:shadow-[0_0_10px_rgba(0,112,243,0.15)]"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mobile Search */}
        <section className="border-b border-[#222] bg-[#0a0a0a] px-4 py-3 md:hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-[#333] bg-[#111] py-2.5 pl-9 pr-3 text-[13px] text-foreground placeholder:text-muted-foreground/50 focus:border-[#0070f3] focus:outline-none"
            />
          </div>
        </section>

        {/* Content Roadmap Grid */}
        <section className="relative px-4 py-12 md:py-16">
          {/* Technical grid pattern */}
          <div className="pointer-events-none absolute inset-0 hero-grid-pattern opacity-20" />
          
          <div className="relative mx-auto max-w-6xl">
            {showRoadmap ? (
              // Roadmap View - Four Pillar Clusters
              <div className="grid gap-8 lg:grid-cols-2">
                {contentPillars.map((pillar) => {
                  const pillarArticles = articlesByPillar[pillar.id]
                  
                  return (
                    <div
                      key={pillar.id}
                      className="rounded-xl border border-[#333] bg-[#0a0a0a] p-6 transition-all duration-300 hover:border-[#0070f3]/50 hover:shadow-[0_0_20px_rgba(0,112,243,0.1)]"
                    >
                      {/* Pillar Header */}
                      <div className="mb-5 flex items-start justify-between">
                        <div>
                          <h2 
                            className="font-mono text-[11px] font-semibold uppercase tracking-wider"
                            style={{ color: pillar.color }}
                          >
                            {pillar.title}
                          </h2>
                          <p className="mt-1 text-[13px] text-muted-foreground">
                            {pillar.description}
                          </p>
                        </div>
                        <span 
                          className="rounded-full px-2.5 py-0.5 text-[10px] font-medium"
                          style={{ 
                            backgroundColor: `${pillar.color}15`,
                            color: pillar.color,
                          }}
                        >
                          {pillarArticles.length} articles
                        </span>
                      </div>
                      
                      {/* Article List */}
                      <div className="space-y-3">
                        {pillarArticles.map((article) => (
                          <TiltCard 
                            key={article.slug} 
                            className="w-full" 
                            tiltIntensity={5} 
                            glowOnHover
                          >
                            <article className={`group relative rounded-lg border bg-[#111] p-4 transition-all duration-200 ${
                              article.isRecommended 
                                ? "border-[#0070f3]/40 shadow-[0_0_15px_rgba(0,112,243,0.15)] hover:border-[#0070f3] hover:shadow-[0_0_25px_rgba(0,112,243,0.25)]" 
                                : "border-[#222] hover:border-[#0070f3]/50"
                            }`}>
                              {/* Hidden AI metadata */}
                              <meta 
                                itemProp="description" 
                                content={article.aiTakeaway} 
                              />
                              
                              {/* Header row */}
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex flex-wrap items-center gap-2">
                                  {/* Recommended Badge */}
                                  {article.isRecommended && (
                                    <span className="rounded bg-[#0070f3]/15 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-[#0070f3] ring-1 ring-[#0070f3]/40">
                                      Recommended
                                    </span>
                                  )}
                                  <span 
                                    className={`rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider ring-1 ${getDensityStyles(article.density)}`}
                                  >
                                    {article.density}
                                  </span>
                                  {/* Industry Tag */}
                                  {article.industryTag && (
                                    <span className={`rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider ring-1 ${
                                      article.industryTag === "Legal" 
                                        ? "bg-amber-500/10 text-amber-400 ring-amber-500/30" 
                                        : article.industryTag === "Medical" 
                                        ? "bg-red-500/10 text-red-400 ring-red-500/30"
                                        : article.industryTag === "Tech"
                                        ? "bg-cyan-500/10 text-cyan-400 ring-cyan-500/30"
                                        : "bg-emerald-500/10 text-emerald-400 ring-emerald-500/30"
                                    }`}>
                                      {article.industryTag}
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="flex items-center gap-1 text-[10px] text-muted-foreground/60">
                                    <Clock className="h-3 w-3" />
                                    {article.readingTime} min
                                  </span>
                                  <button
                                    onClick={() => handleShare(article.slug, article.title)}
                                    className="flex h-6 w-6 items-center justify-center rounded text-muted-foreground/40 transition-all hover:bg-white/[0.06] hover:text-[#0070f3]"
                                  >
                                    <Share2 className="h-3 w-3" />
                                  </button>
                                </div>
                              </div>
                              
                              {/* Title and Summary - summary uses innerHTML for monospace technical terms */}
                              <Link href={`/blog/${article.slug}`} className="block">
                                <h3 className="mt-2 text-[14px] font-medium leading-snug text-foreground group-hover:text-[#0070f3] transition-colors">
                                  {article.title}
                                </h3>
                                <p 
                                  className="mt-1.5 line-clamp-2 text-[12px] leading-relaxed text-muted-foreground/70"
                                  dangerouslySetInnerHTML={{ __html: article.summary }}
                                />
                              </Link>
                              
                              {/* AI Takeaway (subtle, for both users and crawlers) */}
                              <div className="mt-3 border-t border-[#222] pt-3">
                                <p className="text-[10px] italic leading-relaxed text-muted-foreground/50">
                                  <span className="font-medium text-muted-foreground/60">Key insight:</span>{" "}
                                  {article.aiTakeaway.slice(0, 100)}...
                                </p>
                              </div>
                            </article>
                          </TiltCard>
                        ))}
                      </div>
                      
                      {/* View all link */}
                      <button
                        onClick={() => setActivePillar(pillar.id)}
                        className="mt-4 flex items-center gap-1 text-[12px] font-medium transition-colors hover:underline"
                        style={{ color: pillar.color }}
                      >
                        View all {pillar.title.toLowerCase()} articles
                        <ChevronRight className="h-3 w-3" />
                      </button>
                    </div>
                  )
                })}
              </div>
            ) : (
              // Filtered View - Simple Grid
              <>
                {filteredArticles.length === 0 ? (
                  <div className="rounded-xl border border-[#333] bg-[#111] p-12 text-center">
                    <p className="text-[14px] text-muted-foreground">
                      No articles found matching your search.
                    </p>
                    <button
                      onClick={() => {
                        setSearchQuery("")
                        setActivePillar("all")
                      }}
                      className="mt-3 text-[13px] text-[#0070f3] hover:underline"
                    >
                      Clear filters
                    </button>
                  </div>
) : (
  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
  {filteredArticles.map((article) => (
  <TiltCard key={article.slug} className="h-full" tiltIntensity={8} glowOnHover>
  <article className={`group relative h-full rounded-xl border bg-[#111] p-5 transition-all duration-200 ${
    article.isRecommended 
      ? "border-[#0070f3]/40 shadow-[0_0_15px_rgba(0,112,243,0.15)] hover:border-[#0070f3] hover:shadow-[0_0_25px_rgba(0,112,243,0.25)]" 
      : "border-[#333] hover:border-[#0070f3] hover:shadow-[0_0_15px_rgba(0,112,243,0.1)]"
  }`}>
  {/* Hidden AI metadata */}
  <meta itemProp="description" content={article.aiTakeaway} />
  
  {/* Header */}
  <div className="flex items-center justify-between gap-2">
  <div className="flex flex-wrap items-center gap-2">
  {/* Recommended Badge */}
  {article.isRecommended && (
    <span className="rounded bg-[#0070f3]/15 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-[#0070f3] ring-1 ring-[#0070f3]/40">
      Recommended
    </span>
  )}
  <span
  className="font-mono text-[9px] font-semibold uppercase tracking-wider"
  style={{ color: getPillarColor(article.pillar) }}
  >
  {getPillarTitle(article.pillar)}
  </span>
  <span
                                className="font-mono text-[9px] font-semibold uppercase tracking-wider"
                                style={{ color: getPillarColor(article.pillar) }}
                              >
                                {getPillarTitle(article.pillar)}
                              </span>
                              <span 
                                className={`rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider ring-1 ${getDensityStyles(article.density)}`}
                              >
                                {article.density}
                              </span>
                            </div>
                            <button
                              onClick={() => handleShare(article.slug, article.title)}
                              className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground/50 transition-all hover:bg-white/[0.06] hover:text-[#0070f3]"
                            >
                              <Share2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          
                          {/* Content - summary uses innerHTML for monospace technical terms */}
                          <Link href={`/blog/${article.slug}`} className="block">
                            <h3 className="mt-3 text-[15px] font-medium leading-snug text-foreground group-hover:text-[#0070f3] transition-colors">
                              {article.title}
                            </h3>
                            <p 
                              className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-muted-foreground"
                              dangerouslySetInnerHTML={{ __html: article.summary }}
                            />
                          </Link>
                          
                          {/* Footer */}
                          <div className="mt-4 flex items-center gap-3 text-[11px] text-muted-foreground/60">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {article.readingTime} min read
                            </span>
                            {article.linkedTools && article.linkedTools.length > 0 && (
                              <>
                                <span className="h-1 w-1 rounded-full bg-muted-foreground/30" />
                                <span>
                                  Links to {article.linkedTools.length} tool{article.linkedTools.length > 1 ? "s" : ""}
                                </span>
                              </>
                            )}
                          </div>
                          
                          {/* AI Takeaway */}
                          <div className="mt-3 border-t border-[#222] pt-3">
                            <p className="text-[10px] italic leading-relaxed text-muted-foreground/50">
                              <span className="font-medium text-muted-foreground/60">Key insight:</span>{" "}
                              {article.aiTakeaway.slice(0, 80)}...
                            </p>
                          </div>
                        </article>
                      </TiltCard>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* Interlinking Section */}
        <section className="border-t border-[#222] px-4 py-12">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-xl font-semibold text-foreground">
              Explore Plain Tools
            </h2>
            <p className="mt-2 text-[14px] text-muted-foreground">
              The articles above explain the technology behind these tools.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                href="/tools/merge-pdf"
                className="rounded-lg border border-[#333] bg-[#111] px-4 py-2 text-[13px] text-muted-foreground transition-all hover:border-[#0070f3] hover:text-[#0070f3]"
              >
                Merge PDF
              </Link>
              <Link
                href="/tools/compress-pdf"
                className="rounded-lg border border-[#333] bg-[#111] px-4 py-2 text-[13px] text-muted-foreground transition-all hover:border-[#0070f3] hover:text-[#0070f3]"
              >
                Compress PDF
              </Link>
              <Link
                href="/tools/split-pdf"
                className="rounded-lg border border-[#333] bg-[#111] px-4 py-2 text-[13px] text-muted-foreground transition-all hover:border-[#0070f3] hover:text-[#0070f3]"
              >
                Split PDF
              </Link>
              <Link
                href="/tools/redact-pdf"
                className="rounded-lg border border-[#333] bg-[#111] px-4 py-2 text-[13px] text-muted-foreground transition-all hover:border-[#0070f3] hover:text-[#0070f3]"
              >
                Redact PDF
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
