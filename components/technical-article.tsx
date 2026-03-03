"use client"

import { useState, ReactNode } from "react"
import Link from "next/link"
import Script from "next/script"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AutoLinkContent } from "@/components/auto-link-content"
import { motion, useScroll, useSpring } from "framer-motion"
import { 
  ChevronRight, 
  Copy, 
  Check, 
  ArrowRight,
  Shield,
  Cpu,
  HardDrive,
  Merge,
  Scissors,
  Minimize2,
  FileText,
  LucideIcon
} from "lucide-react"

// ============================================================================
// TECHNICAL SUMMARY BOX
// The "Technical Abstract" at the top of each article
// ============================================================================

interface TechnicalSummaryProps {
  title?: string
  points: string[]
  technologies?: string[]
}

export function TechnicalSummary({ 
  title = "Technical Summary", 
  points,
  technologies = []
}: TechnicalSummaryProps) {
  return (
    <div className="rounded-xl border-l-4 border-[#0070f3] bg-[#111] p-6 mb-10">
      <h2 className="text-[14px] font-semibold uppercase tracking-wider text-[#0070f3] mb-4">
        {title}
      </h2>
      <ul className="space-y-3">
        {points.map((point, idx) => (
          <li key={idx} className="flex items-start gap-3">
            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#0070f3] shrink-0" />
            <span className="text-[14px] leading-relaxed text-white/80">{point}</span>
          </li>
        ))}
      </ul>
      {technologies.length > 0 && (
        <div className="mt-5 pt-4 border-t border-[#222]">
          <span className="text-[11px] uppercase tracking-wider text-white/40 mr-3">Core Technologies:</span>
          <div className="inline-flex flex-wrap gap-2 mt-2">
            {technologies.map((tech) => (
              <span 
                key={tech} 
                className="rounded-md bg-[#0070f3]/10 px-2.5 py-1 text-[11px] font-mono font-medium text-[#0070f3] ring-1 ring-[#0070f3]/20"
                translate="no"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================================================
// CODE BLOCK COMPONENT
// Sleek syntax-highlighted code blocks
// ============================================================================

interface CodeBlockProps {
  code: string
  language?: string
  filename?: string
  showLineNumbers?: boolean
}

export function CodeBlock({ 
  code, 
  language = "javascript", 
  filename,
  showLineNumbers = true 
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Simple syntax highlighting for common patterns
  const highlightCode = (code: string) => {
    return code
      // Keywords in blue
      .replace(/\b(const|let|var|function|async|await|return|import|export|from|if|else|try|catch|new|class|extends)\b/g, '<span class="text-[#0070f3]">$1</span>')
      // Strings in green
      .replace(/(["'`])(?:(?!\1)[^\\]|\\.)*?\1/g, '<span class="text-emerald-400">$&</span>')
      // Comments in grey
      .replace(/(\/\/.*$)/gm, '<span class="text-white/30">$1</span>')
      // Numbers in amber
      .replace(/\b(\d+)\b/g, '<span class="text-amber-400">$1</span>')
      // Functions in purple
      .replace(/\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/g, '<span class="text-purple-400">$1</span>(')
  }

  const lines = code.trim().split('\n')

  return (
    <div className="group relative rounded-xl overflow-hidden my-8">
      {/* Header bar */}
      {filename && (
        <div className="flex items-center justify-between bg-[#0a0a0a] px-4 py-2 border-b border-[#222]">
          <span className="text-[12px] font-mono text-white/50">{filename}</span>
          <span className="text-[10px] font-mono uppercase tracking-wider text-white/30">{language}</span>
        </div>
      )}
      
      {/* Code content */}
      <div className="relative bg-[#050505] p-4 overflow-x-auto">
        {/* Copy button */}
        <button
          onClick={copyToClipboard}
          className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-md bg-white/5 text-white/40 transition-all duration-150 hover:bg-white/10 hover:text-white opacity-0 group-hover:opacity-100"
          title="Copy code"
        >
          {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
        </button>

        <pre className="font-mono text-[13px] leading-relaxed">
          <code>
            {lines.map((line, idx) => (
              <div key={idx} className="flex">
                {showLineNumbers && (
                  <span className="select-none pr-4 text-white/20 w-8 text-right shrink-0">
                    {idx + 1}
                  </span>
                )}
                <span 
                  className="text-white/80"
                  dangerouslySetInnerHTML={{ __html: highlightCode(line) || '&nbsp;' }}
                />
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  )
}

// ============================================================================
// DATA FLOW DIAGRAM
// Interactive diagram showing local processing
// ============================================================================

interface DataFlowDiagramProps {
  title?: string
  caption?: string
}

export function DataFlowDiagram({ 
  title = "Local Processing Data Flow",
  caption = "Your file never leaves the browser sandbox. All processing occurs in local memory."
}: DataFlowDiagramProps) {
  return (
    <figure className="my-10">
      <div className="rounded-xl border border-[#333] bg-[#0a0a0a] p-8 overflow-hidden">
        {/* Diagram Title */}
        <div className="text-center mb-8">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#0070f3]">
            {title}
          </span>
        </div>

        {/* Flow Diagram */}
        <div className="flex items-center justify-center gap-4 md:gap-8">
          {/* User's Device */}
          <div className="flex flex-col items-center">
            <div className="flex h-20 w-20 md:h-24 md:w-24 items-center justify-center rounded-xl border-2 border-[#0070f3] bg-[#0070f3]/10">
              <HardDrive className="h-8 w-8 md:h-10 md:w-10 text-[#0070f3]" />
            </div>
            <span className="mt-3 text-[11px] md:text-[12px] font-medium text-white/60">Your Device</span>
            <span className="text-[10px] text-white/40">Local File</span>
          </div>

          {/* Arrow 1 */}
          <div className="flex flex-col items-center">
            <ArrowRight className="h-6 w-6 text-[#0070f3]" />
            <span className="mt-1 text-[9px] text-white/40">Load</span>
          </div>

          {/* Browser Sandbox */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="flex h-20 w-20 md:h-24 md:w-24 items-center justify-center rounded-xl border-2 border-[#0070f3] bg-[#0070f3]/10">
                <Cpu className="h-8 w-8 md:h-10 md:w-10 text-[#0070f3]" />
              </div>
              {/* Sandbox border */}
              <div className="absolute -inset-3 rounded-2xl border border-dashed border-[#0070f3]/30" />
              <span className="absolute -top-1 left-1/2 -translate-x-1/2 bg-[#0a0a0a] px-2 text-[8px] font-mono uppercase tracking-wider text-[#0070f3]/60">
                Browser Sandbox
              </span>
            </div>
            <span className="mt-5 text-[11px] md:text-[12px] font-medium text-white/60">Wasm Engine</span>
            <span className="text-[10px] text-white/40">Local RAM Only</span>
          </div>

          {/* Arrow 2 */}
          <div className="flex flex-col items-center">
            <ArrowRight className="h-6 w-6 text-[#0070f3]" />
            <span className="mt-1 text-[9px] text-white/40">Output</span>
          </div>

          {/* Output File */}
          <div className="flex flex-col items-center">
            <div className="flex h-20 w-20 md:h-24 md:w-24 items-center justify-center rounded-xl border-2 border-emerald-500 bg-emerald-500/10">
              <FileText className="h-8 w-8 md:h-10 md:w-10 text-emerald-500" />
            </div>
            <span className="mt-3 text-[11px] md:text-[12px] font-medium text-white/60">Result</span>
            <span className="text-[10px] text-white/40">Direct Download</span>
          </div>
        </div>

        {/* Remote Server - Crossed Out */}
        <div className="mt-10 flex items-center justify-center">
          <div className="relative flex items-center gap-4 rounded-lg border border-red-500/20 bg-red-500/5 px-6 py-3">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-px w-full bg-red-500/60 rotate-[-8deg]" />
            </div>
            <Shield className="h-5 w-5 text-red-500/40" />
            <span className="text-[12px] text-red-500/40">Remote Server</span>
            <span className="text-[10px] font-mono text-red-500/30">No connection required</span>
          </div>
        </div>
      </div>
      
      {/* Caption */}
      <figcaption className="mt-3 text-center text-[12px] text-white/40">
        {caption}
      </figcaption>
    </figure>
  )
}

// ============================================================================
// STICKY TOOL SIDEBAR
// "Test this Technology" card linking to relevant tool
// ============================================================================

interface ToolSidebarProps {
  toolName: string
  toolDescription: string
  toolHref: string
  toolIcon?: LucideIcon
}

const toolIcons: Record<string, LucideIcon> = {
  merge: Merge,
  split: Scissors,
  compress: Minimize2,
  default: FileText,
}

export function ToolSidebar({ 
  toolName, 
  toolDescription, 
  toolHref,
  toolIcon
}: ToolSidebarProps) {
  const IconComponent = toolIcon || toolIcons.default

  return (
    <div className="sticky top-24">
      <div className="rounded-xl border border-[#333] bg-[#111] p-5 transition-all duration-300 hover:border-[#0070f3] hover:shadow-[0_0_20px_rgba(0,112,243,0.1)]">
        {/* Header */}
        <span className="text-[10px] font-mono uppercase tracking-wider text-[#0070f3]">
          Test this Technology
        </span>
        
        {/* Tool Info */}
        <div className="mt-4 flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#0070f3]/10 ring-1 ring-[#0070f3]/20">
            <IconComponent className="h-5 w-5 text-[#0070f3]" />
          </div>
          <div>
            <h3 className="text-[14px] font-semibold text-white">{toolName}</h3>
            <p className="mt-1 text-[12px] leading-relaxed text-white/50">
              {toolDescription}
            </p>
          </div>
        </div>
        
        {/* CTA */}
        <Link
          href={toolHref}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-[#0070f3] px-4 py-2.5 text-[13px] font-semibold text-white transition-all duration-150 hover:bg-[#0070f3]/90 hover:shadow-[0_0_20px_rgba(0,112,243,0.3)]"
        >
          Try {toolName}
          <ArrowRight className="h-4 w-4" />
        </Link>
        
        {/* Privacy Note */}
        <p className="mt-4 text-center text-[10px] text-white/30">
          100% local processing. No uploads.
        </p>
      </div>
      
      {/* Additional Resources */}
      <div className="mt-4 rounded-xl border border-[#222] bg-[#0a0a0a] p-4">
        <span className="text-[10px] font-mono uppercase tracking-wider text-white/40">
          Related Articles
        </span>
        <ul className="mt-3 space-y-2">
          <li>
            <Link 
              href="/learn/how-plain-works" 
              className="text-[12px] text-white/50 hover:text-[#0070f3] transition-colors"
            >
              How Plain Works
            </Link>
          </li>
          <li>
            <Link 
              href="/learn/verify-offline-processing" 
              className="text-[12px] text-white/50 hover:text-[#0070f3] transition-colors"
            >
              Verify Offline Processing
            </Link>
          </li>
          <li>
            <Link 
              href="/compare" 
              className="text-[12px] text-white/50 hover:text-[#0070f3] transition-colors"
            >
              Compare to Cloud Tools
            </Link>
          </li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// READING PROGRESS BAR
// ============================================================================

function ReadingProgressBar() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] bg-[#0070f3] origin-left z-[60]"
      style={{ scaleX }}
    />
  )
}

// ============================================================================
// TECHNICAL ARTICLE LAYOUT
// Main wrapper component for technical deep-dive articles
// ============================================================================

interface TechnicalArticleProps {
  title: string
  subtitle?: string
  author?: string
  datePublished: string
  dateModified?: string
  readTime?: string
  category?: string
  canonicalUrl: string
  jsonLd?: object
  toolSidebar?: {
    toolName: string
    toolDescription: string
    toolHref: string
  }
  children: ReactNode
}

export function TechnicalArticle({
  title,
  subtitle,
  author = "Plain Technical Team",
  datePublished,
  dateModified,
  readTime = "8 min read",
  category = "Technical Architecture",
  canonicalUrl,
  jsonLd,
  toolSidebar,
  children
}: TechnicalArticleProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <ReadingProgressBar />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* JSON-LD Schema */}
      {jsonLd && (
        <Script
          id="article-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative border-b border-[#222] bg-[#000] px-4 py-16 md:py-24">
          {/* Technical grid pattern */}
          <div className="pointer-events-none absolute inset-0 hero-grid-pattern opacity-30" />
          
          <div className="relative mx-auto max-w-4xl">
            {/* Breadcrumbs */}
            <nav aria-label="Breadcrumb" className="mb-6">
              <ol className="flex items-center gap-2 text-[12px]">
                <li>
                  <Link href="/" className="text-white/40 hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <ChevronRight className="h-3 w-3 text-white/20" />
                <li>
                  <Link href="/learn" className="text-white/40 hover:text-white transition-colors">
                    Learn
                  </Link>
                </li>
                <ChevronRight className="h-3 w-3 text-white/20" />
                <li>
                  <span className="text-[#0070f3]">{title}</span>
                </li>
              </ol>
            </nav>
            
            {/* Category Badge */}
            <span className="inline-block rounded-full bg-[#0070f3]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#0070f3] ring-1 ring-[#0070f3]/20 mb-4">
              {category}
            </span>
            
            {/* Title */}
            <h1 className="text-3xl font-bold tracking-[-0.03em] text-white md:text-4xl lg:text-5xl">
              {title}
            </h1>
            
            {/* Subtitle */}
            {subtitle && (
              <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-white/60">
                {subtitle}
              </p>
            )}
            
            {/* Meta */}
            <div className="mt-6 flex flex-wrap items-center gap-4 text-[12px] text-white/40">
              <span>{author}</span>
              <span className="h-1 w-1 rounded-full bg-white/20" />
              <time dateTime={datePublished}>
                {new Date(datePublished).toLocaleDateString('en-GB', { 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </time>
              {dateModified && dateModified !== datePublished && (
                <>
                  <span className="h-1 w-1 rounded-full bg-white/20" />
                  <span>Updated {new Date(dateModified).toLocaleDateString('en-GB', { 
                    day: 'numeric', 
                    month: 'short', 
                    year: 'numeric' 
                  })}</span>
                </>
              )}
              <span className="h-1 w-1 rounded-full bg-white/20" />
              <span>{readTime}</span>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="relative px-4 py-12 md:py-16">
          <div className="mx-auto max-w-6xl">
  <div className="flex gap-12">
  {/* Main Content - Auto-links Master Terms to Glossary */}
  <article className="flex-1 max-w-3xl prose-technical">
    <AutoLinkContent>
      {children}
    </AutoLinkContent>
  </article>
              
              {/* Sidebar (Desktop) */}
              {toolSidebar && (
                <aside className="hidden lg:block w-72 shrink-0">
                  <ToolSidebar {...toolSidebar} />
                </aside>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

// ============================================================================
// ARTICLE TYPOGRAPHY COMPONENTS
// ============================================================================

export function ArticleH2({ children }: { children: ReactNode }) {
  return (
    <h2 className="mt-12 mb-4 text-2xl font-bold tracking-tight text-white">
      {children}
    </h2>
  )
}

export function ArticleH3({ children }: { children: ReactNode }) {
  return (
    <h3 className="mt-8 mb-3 text-xl font-semibold text-white">
      {children}
    </h3>
  )
}

export function ArticleParagraph({ children }: { children: ReactNode }) {
  return (
    <p className="my-4 text-[15px] leading-relaxed text-white/70">
      {children}
    </p>
  )
}

export function ArticleList({ children, ordered = false }: { children: ReactNode; ordered?: boolean }) {
  const Tag = ordered ? 'ol' : 'ul'
  return (
    <Tag className={`my-4 space-y-2 ps-6 ${ordered ? 'list-decimal' : 'list-disc'}`}>
      {children}
    </Tag>
  )
}

export function ArticleListItem({ children }: { children: ReactNode }) {
  return (
    <li className="text-[15px] leading-relaxed text-white/70">
      {children}
    </li>
  )
}

export function ArticleBlockquote({ children }: { children: ReactNode }) {
  return (
    <blockquote className="my-6 border-s-4 border-[#0070f3]/40 ps-5 text-[15px] italic leading-relaxed text-white/60">
      {children}
    </blockquote>
  )
}

export function ArticleNote({ children, type = "info" }: { children: ReactNode; type?: "info" | "warning" | "tip" }) {
  const styles = {
    info: "border-[#0070f3] bg-[#0070f3]/5 text-[#0070f3]",
    warning: "border-amber-500 bg-amber-500/5 text-amber-500",
    tip: "border-emerald-500 bg-emerald-500/5 text-emerald-500",
  }
  
  const labels = {
    info: "Note",
    warning: "Warning",
    tip: "Tip",
  }

  return (
    <div className={`my-6 rounded-lg border-s-4 p-4 ${styles[type]}`}>
      <span className="text-[11px] font-semibold uppercase tracking-wider">{labels[type]}</span>
      <div className="mt-2 text-[14px] leading-relaxed text-white/70">
        {children}
      </div>
    </div>
  )
}
