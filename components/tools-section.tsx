"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { 
  Merge, Split, Minimize2, ArrowUpDown, FileOutput, FileType, ArrowRight, 
  Search, Lock, Star, RefreshCw, FileText, Table, Image, Globe,
  ShieldAlert, Unlock, Stamp, ScanText, Binary, Trash2, Zap, FileSearch, PenTool, LayoutGrid,
  MessageSquare, Sparkles, Layers, LucideIcon
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { TiltCard } from "@/components/ui/tilt-card"

type ToolCategory = "popular" | "convert" | "security" | "edit" | "ai"
type ToolStatus = "Soon" | "New" | "Beta"

interface Tool {
  icon: LucideIcon
  title: string
  description: string
  href: string
  available: boolean
  category: ToolCategory
  isAI?: boolean
  aiNote?: string
  status?: ToolStatus
  badge?: string
}

const categories = [
  { id: "popular" as const, label: "Popular", icon: Star },
  { id: "convert" as const, label: "Convert", icon: RefreshCw },
  { id: "security" as const, label: "Security & Privacy", icon: Lock },
  { id: "edit" as const, label: "Performance & Edit", icon: Binary },
  { id: "ai" as const, label: "AI Labs", icon: Sparkles },
]

const tools: Tool[] = [
  // Popular tools
  {
    icon: Merge,
    title: "Merge PDF",
    description: "Combine multiple PDFs into one document",
    href: "/tools/merge-pdf",
    available: true,
    category: "popular",
  },
  {
    icon: Split,
    title: "Split PDF",
    description: "Separate a PDF into individual pages",
    href: "/tools/split-pdf",
    available: true,
    category: "popular",
  },
  {
    icon: Minimize2,
    title: "Compress PDF",
    description: "Reduce file size whilst maintaining quality",
    href: "/tools/compress-pdf",
    available: false,
    category: "popular",
  },
  {
    icon: ArrowUpDown,
    title: "Reorder Pages",
    description: "Rearrange pages in your PDF document",
    href: "/tools/reorder-pages",
    available: false,
    category: "popular",
  },
  {
    icon: FileOutput,
    title: "Extract Pages",
    description: "Pull specific pages from a PDF",
    href: "/tools/extract-pages",
    available: false,
    category: "popular",
  },
  {
    icon: FileType,
    title: "Rotate PDF",
    description: "Rotate pages to the correct orientation",
    href: "/tools/rotate-pdf",
    available: false,
    category: "popular",
  },
  
  // Convert tools
  {
    icon: FileText,
    title: "PDF to Word",
    description: "Convert documents to editable formats without cloud uploads.",
    href: "/tools/pdf-to-word",
    available: false,
    category: "convert",
  },
  {
    icon: Table,
    title: "PDF to Excel",
    description: "Extract tables and data to spreadsheet format",
    href: "/tools/pdf-to-excel",
    available: false,
    category: "convert",
  },
  {
    icon: Image,
    title: "Image to PDF",
    description: "Transform photos and scans into professional PDF documents.",
    href: "/tools/image-to-pdf",
    available: false,
    category: "convert",
  },
  {
    icon: Globe,
    title: "HTML to PDF",
    description: "Convert web pages and HTML content to PDF",
    href: "/tools/html-to-pdf",
    available: false,
    category: "convert",
  },
  {
    icon: FileType,
    title: "PDF to Image",
    description: "Export PDF pages as high-quality images",
    href: "/tools/pdf-to-image",
    available: false,
    category: "convert",
  },
  {
    icon: FileOutput,
    title: "PDF to Text",
    description: "Extract plain text content from PDF files",
    href: "/tools/pdf-to-text",
    available: false,
    category: "convert",
  },
  
  // Security & Privacy tools
  {
    icon: FileSearch,
    title: "Plain Metadata Purge",
    description: "Permanently strip XMP, PDF, and embedded metadata with a local before/after diff view. No uploads.",
    href: "/tools/plain-metadata-purge",
    available: false,
    category: "security",
    status: "New",
  },
  {
    icon: ShieldAlert,
    title: "Plain Irreversible Redactor",
    description: "Pixel-precise, burn-in redaction of text and regions with local SHA-256 verification. No uploads.",
    href: "/tools/plain-irreversible-redactor",
    available: false,
    category: "security",
    status: "New",
  },
  {
    icon: PenTool,
    title: "Plain Local Cryptographic Signer",
    description: "Apply PAdES/PKCS#7 signatures using keys stored solely in your browser secure enclave. Local-only workflow.",
    href: "/tools/plain-local-cryptographic-signer",
    available: false,
    category: "security",
    status: "New",
  },
  {
    icon: Unlock,
    title: "Plain Password Breaker",
    description: "Remove owner or user passwords using local-only recovery paths with no telemetry and no uploads.",
    href: "/tools/plain-password-breaker",
    available: false,
    category: "security",
    status: "New",
  },
  {
    icon: ShieldAlert,
    title: "Permanent Redaction",
    description: "Physically remove sensitive information from the PDF byte-code locally.",
    href: "/tools/redact-pdf",
    available: false,
    category: "security",
  },
  {
    icon: Unlock,
    title: "Unlock PDF",
    description: "Remove password restrictions and permissions from your files.",
    href: "/tools/unlock-pdf",
    available: false,
    category: "security",
  },
  {
    icon: Lock,
    title: "Protect PDF",
    description: "Add password encryption to your documents",
    href: "/tools/protect-pdf",
    available: false,
    category: "security",
  },
  {
    icon: Stamp,
    title: "Add Watermark",
    description: "Apply custom text or image overlays to protect your documents.",
    href: "/tools/watermark-pdf",
    available: false,
    category: "security",
  },
  
  // Performance & Edit tools
  {
    icon: LayoutGrid,
    title: "Plain WebGPU Page Organiser",
    description: "Drag-and-drop reordering and rotation with hardware-accelerated local previews. No uploads.",
    href: "/tools/plain-webgpu-page-organiser",
    available: false,
    category: "edit",
    status: "New",
    badge: "WebGPU",
  },
  {
    icon: Zap,
    title: "Plain Hardware-Accelerated Batch Engine",
    description: "Simultaneous merge and split of large PDF sets (>2GB) via WebGPU compute shaders. Local-only processing.",
    href: "/tools/plain-hardware-accelerated-batch-engine",
    available: false,
    category: "edit",
    status: "New",
    badge: "WebGPU",
  },
  {
    icon: ScanText,
    title: "Plain Offline OCR Pipeline",
    description: "WebGPU-optimised text recognition for scanned documents without leaving the device or uploading files.",
    href: "/tools/plain-offline-ocr-pipeline",
    available: false,
    category: "edit",
    status: "New",
    badge: "WebGPU",
  },
  {
    icon: Minimize2,
    title: "Plain Real-Time Compression Previewer",
    description: "Slider-driven recompression with side-by-side visual and size previews in Wasm. Fully local, no uploads.",
    href: "/tools/plain-real-time-compression-previewer",
    available: false,
    category: "edit",
    status: "New",
  },
  {
    icon: ScanText,
    title: "OCR / Searchable PDF",
    description: "Use local optical character recognition to make scanned text searchable.",
    href: "/tools/ocr-pdf",
    available: false,
    category: "edit",
  },
  {
    icon: Binary,
    title: "Page Numbering",
    description: "Add customisable headers and footers for professional indexing.",
    href: "/tools/page-numbers",
    available: false,
    category: "edit",
  },
  {
    icon: Trash2,
    title: "Delete Pages",
    description: "Remove unwanted pages from your document",
    href: "/tools/delete-pages",
    available: false,
    category: "security",
  },
  
  // AI Labs tools
  {
    icon: MessageSquare,
    title: "AI Chat with PDF",
    description: "Discuss your documents with a private, WebGPU-accelerated local AI.",
    href: "/tools/ai-chat-pdf",
    available: false,
    category: "ai",
    isAI: true,
    aiNote: "WebGPU Accelerated",
    status: "Beta",
  },
  {
    icon: Zap,
    title: "Instant Summary",
    description: "Generate key insights from large documents using on-device processing.",
    href: "/tools/ai-summary",
    available: false,
    category: "ai",
    isAI: true,
    aiNote: "Powered by local WebLLM",
    status: "New",
  },
  {
    icon: ScanText,
    title: "Smart Extract",
    description: "AI-powered extraction of key data and entities",
    href: "/tools/ai-extract",
    available: false,
    category: "ai",
    isAI: true,
    aiNote: "Powered by local Wasm",
    status: "Beta",
  },
  {
    icon: FileText,
    title: "Document Analysis",
    description: "Get insights and structure analysis of your PDF",
    href: "/tools/ai-analyse",
    available: false,
    category: "ai",
    isAI: true,
    aiNote: "Powered by local WebLLM",
    status: "Beta",
  },
]

export function ToolsSection() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState<ToolCategory>("popular")
  const [batchMode, setBatchMode] = useState(false)
  
  const filteredTools = useMemo(() => {
    let filtered = tools.filter(tool => tool.category === activeCategory)
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = tools.filter(tool => 
        tool.title.toLowerCase().includes(query) ||
        tool.description.toLowerCase().includes(query)
      )
    }
    
    return filtered
  }, [searchQuery, activeCategory])

  const showingSearchResults = searchQuery.trim().length > 0

  return (
    <section id="tools" data-tour="tools-section" className="relative px-4 pt-36 pb-32 md:pt-44 md:pb-40">
      {/* Top gradient divider */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
      <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-accent/[0.02] to-transparent" />
      
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="animate-accent-line h-6 w-1 rounded-full bg-accent" />
            <h2 className="text-2xl font-semibold tracking-tight text-foreground leading-tight">
              Available Tools
            </h2>
          </div>
          
          {/* Search bar */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" strokeWidth={2} />
            <input
              type="text"
              placeholder="Search all tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] py-2.5 pl-10 pr-4 text-[13px] text-foreground placeholder:text-muted-foreground/50 outline-none transition-all duration-200 focus:border-accent/40 focus:bg-white/[0.05] focus:ring-2 focus:ring-accent/20"
            />
          </div>
        </div>
        
        {/* Batch Mode Toggle + Category Tabs */}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Category tabs */}
          <div className="flex items-center gap-1 rounded-lg bg-white/[0.03] p-1 ring-1 ring-white/[0.06]">
            {categories.map((category) => {
              const Icon = category.icon
              const isActive = activeCategory === category.id && !showingSearchResults
              return (
                <button
                  key={category.id}
                  onClick={() => {
                    setActiveCategory(category.id)
                    setSearchQuery("")
                  }}
                  className={`flex items-center gap-2 rounded-md px-3 py-2 text-[13px] font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-accent/15 text-accent shadow-sm"
                      : "text-muted-foreground/70 hover:text-foreground hover:bg-white/[0.04]"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" strokeWidth={2} />
                  <span className="hidden sm:inline">{category.label}</span>
                </button>
              )
            })}
          </div>
          
          {/* Batch mode toggle */}
          <label className="flex items-center gap-3 cursor-pointer group">
            <span className="text-[13px] font-medium text-muted-foreground/70 transition-colors group-hover:text-muted-foreground">
              Enable Batch Processing
            </span>
            <button
              role="switch"
              aria-checked={batchMode}
              onClick={() => setBatchMode(!batchMode)}
              className={`relative h-6 w-11 rounded-full transition-all duration-200 ${
                batchMode 
                  ? "bg-accent/80" 
                  : "bg-white/[0.08] hover:bg-white/[0.12]"
              }`}
            >
              <span 
                className={`absolute top-1 left-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                  batchMode ? "translate-x-5" : "translate-x-0"
                }`} 
              />
            </button>
            <Layers className={`h-4 w-4 transition-colors duration-200 ${
              batchMode ? "text-accent" : "text-muted-foreground/40"
            }`} strokeWidth={2} />
          </label>
        </div>
        
        {/* Search results indicator */}
        {showingSearchResults && (
          <div className="mt-6 flex items-center gap-2">
            <p className="text-[13px] text-muted-foreground/70">
              Showing results for &ldquo;{searchQuery}&rdquo;
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="text-[12px] text-accent hover:underline"
            >
              Clear
            </button>
          </div>
        )}
        
        {/* Batch mode indicator */}
        {batchMode && (
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-accent/[0.08] px-4 py-2.5 ring-1 ring-accent/20">
            <Layers className="h-4 w-4 text-accent" strokeWidth={2} />
            <p className="text-[13px] text-accent/90">
              Batch mode active. Select multiple files when using any tool.
            </p>
          </div>
        )}
        
        {/* Tools grid */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTools.map((tool) => {
            const CardWrapper = tool.available ? Link : "div"
            const cardProps = tool.available ? { href: tool.href } : {}
            const status = tool.status ?? (!tool.available ? "Soon" : undefined)
            
            return (
              <TiltCard 
                key={tool.href} 
                className="h-full"
                tiltIntensity={tool.available ? 8 : 3}
                glowOnHover={tool.available}
              >
                <CardWrapper {...cardProps}>
                  <Card
                    className={`group relative h-full overflow-hidden rounded-xl transition-all duration-150 ease-out outline-none ${
                      tool.available
                        ? "bg-[#111] border border-[#333] cursor-pointer hover:border-[#0070f3] hover:shadow-[0_0_24px_rgba(0,112,243,0.18)] focus-visible:ring-2 focus-visible:ring-[#0070f3]/50"
                        : "bg-[#111] border border-[#333] cursor-default opacity-80 hover:border-[#0070f3] hover:shadow-[0_0_24px_rgba(0,112,243,0.18)]"
                    }`}
                  >
                  {/* Subtle glow on hover */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-accent/[0.04] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  
                  {/* Privacy badge - top right */}
                  <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-white/[0.04] px-2 py-1 ring-1 ring-white/[0.06]">
                    <Lock className="h-2.5 w-2.5 text-emerald-400/70" strokeWidth={2} />
                    <span className="text-[9px] font-medium text-muted-foreground/60">100% Local</span>
                  </div>
                  
                  <CardContent className="relative flex items-start gap-4 p-6 pt-10">
                    <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl transition-all duration-300 ${
                      tool.available
                        ? "bg-accent/12 ring-1 ring-accent/25 group-hover:bg-accent/20 group-hover:ring-accent/45 group-hover:scale-105"
                        : "bg-accent/6 ring-1 ring-accent/10"
                    }`}>
                      <tool.icon className={`h-7 w-7 transition-all duration-300 ${
                        tool.available ? "text-accent/80 group-hover:text-accent" : "text-accent/40"
                      }`} strokeWidth={1.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className={`text-[14px] font-semibold transition-colors duration-300 truncate ${
                          tool.available ? "text-foreground/85 group-hover:text-foreground" : "text-foreground/50"
                        }`}>
                          {tool.title}
                        </h3>
                        {status && (
                          <span className={`shrink-0 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${
                            status === "New"
                              ? "bg-[#0070f3]/20 text-[#5aa7ff]"
                              : status === "Beta"
                                ? "bg-[#0070f3]/12 text-[#7ab8ff]"
                                : "bg-white/[0.06] text-muted-foreground/60"
                          }`}>
                            {status}
                          </span>
                        )}
                        {tool.available && (
                          <ArrowRight className="shrink-0 h-3.5 w-3.5 text-accent opacity-0 -translate-x-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" strokeWidth={1.5} />
                        )}
                      </div>
                      <p className={`mt-2 text-[13px] leading-relaxed transition-colors duration-300 ${
                        tool.available ? "text-muted-foreground/70 group-hover:text-muted-foreground" : "text-muted-foreground/40"
                      }`}>
                        {tool.description}
                      </p>

                      {tool.badge && (
                        <div className="mt-3 inline-flex items-center rounded-full border border-[#0070f3]/30 bg-[#0070f3]/10 px-2.5 py-1">
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#0070f3]">
                            {tool.badge}
                          </span>
                        </div>
                      )}
                      
                      {/* AI note for AI tools - Security Terminal aesthetic */}
                      {tool.isAI && tool.aiNote && (
                        <div className="mt-3 flex items-center gap-1.5 rounded-md border border-[#0070f3]/20 bg-[#050505] px-2 py-1">
                          <Sparkles className="h-3 w-3 text-[#0070f3]" strokeWidth={2} />
                          <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#0070f3]">
                            {tool.aiNote}
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </CardWrapper>
              </TiltCard>
            )
          })}
        </div>
        
        {/* No results message */}
        {filteredTools.length === 0 && (
          <div className="mt-12 flex flex-col items-center justify-center text-center">
            <p className="text-[14px] text-muted-foreground/70">No tools found matching &ldquo;{searchQuery}&rdquo;</p>
            <button
              onClick={() => setSearchQuery("")}
              className="mt-2 text-[13px] text-accent hover:underline"
            >
              Clear search
            </button>
          </div>
        )}
        
        {/* Category description for AI Labs */}
        {activeCategory === "ai" && !showingSearchResults && (
          <div className="mt-8 rounded-xl bg-purple-500/[0.06] p-5 ring-1 ring-purple-400/15">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-400/10">
                <Sparkles className="h-5 w-5 text-purple-400/70" strokeWidth={1.5} />
              </div>
              <div>
                <h4 className="text-[14px] font-semibold text-foreground/90">Privacy-First AI</h4>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground/70">
                  All AI features run entirely in your browser using WebLLM and WebAssembly. 
                  Your documents never leave your device, ensuring complete privacy whilst 
                  leveraging powerful language models for analysis and summarisation.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
