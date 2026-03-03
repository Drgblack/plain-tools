"use client"

import { useState, useEffect, Children, isValidElement } from "react"
import Link from "next/link"
import Script from "next/script"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { TechnicalFigure } from "@/components/seo"
import { AutoLinkContent } from "@/components/auto-link-content"
import { BlogSchema, isQuestionTitle } from "@/components/blog-schema"
import { motion, useScroll, useSpring } from "framer-motion"
import { 
  Shield, 
  FileText, 
  Scissors, 
  Minimize2,
  Check,
  ChevronRight
} from "lucide-react"

// Helper to generate slug from title
function slugifyTitle(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

// Reading Progress Bar Component
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

// X (Twitter) Icon
function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

// LinkedIn Icon
function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

// Copy Link Icon
function LinkIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  )
}

// Floating Social Sidebar
function FloatingSocialSidebar({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false)

  const shareOnX = () => {
    const text = encodeURIComponent(`${title} - Plain PDF Tools`)
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(url)}`, "_blank")
  }

  const shareOnLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, "_blank")
  }

  const copyLink = async () => {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed left-4 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col gap-2">
      <button
        onClick={shareOnX}
        className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#111] border border-[#333] text-white/60 transition-all duration-150 hover:border-[#0070f3] hover:text-white hover:shadow-[0_0_10px_rgba(0,112,243,0.2)]"
        title="Share on X"
      >
        <XIcon className="h-4 w-4" />
      </button>
      <button
        onClick={shareOnLinkedIn}
        className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#111] border border-[#333] text-white/60 transition-all duration-150 hover:border-[#0070f3] hover:text-white hover:shadow-[0_0_10px_rgba(0,112,243,0.2)]"
        title="Share on LinkedIn"
      >
        <LinkedInIcon className="h-4 w-4" />
      </button>
      <button
        onClick={copyLink}
        className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#111] border border-[#333] text-white/60 transition-all duration-150 hover:border-[#0070f3] hover:text-white hover:shadow-[0_0_10px_rgba(0,112,243,0.2)]"
        title="Copy link"
      >
        {copied ? <Check className="h-4 w-4 text-green-500" /> : <LinkIcon className="h-4 w-4" />}
      </button>
    </div>
  )
}

// Shareable Quote Component
export function ShareQuote({ children, tweetText }: { children: React.ReactNode; tweetText?: string }) {
  const [copied, setCopied] = useState(false)
  const quoteText = typeof children === "string" ? children : tweetText || ""

  const shareQuote = () => {
    const text = encodeURIComponent(`"${quoteText}" - Plain PDF Tools`)
    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank")
  }

  const copyQuote = async () => {
    await navigator.clipboard.writeText(quoteText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <blockquote className="relative my-8 border-l-4 border-[#0070f3] bg-[#111] py-6 pl-6 pr-4 rounded-r-lg">
      <p className="text-[17px] leading-relaxed text-white/90 italic">
        {children}
      </p>
      <div className="mt-4 flex items-center gap-2">
        <button
          onClick={shareQuote}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#0070f3]/10 border border-[#0070f3]/30 text-[12px] font-medium text-[#0070f3] transition-all duration-150 hover:bg-[#0070f3]/20 hover:border-[#0070f3]/50"
        >
          <XIcon className="h-3 w-3" />
          Share this tip
        </button>
        <button
          onClick={copyQuote}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/5 border border-white/10 text-[12px] font-medium text-white/60 transition-all duration-150 hover:bg-white/10 hover:text-white/80"
        >
          {copied ? <Check className="h-3 w-3" /> : <LinkIcon className="h-3 w-3" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    </blockquote>
  )
}

// In-Content Ad Zone Placeholder
export function InContentAd({ position }: { position: "first" | "second" }) {
  return (
    <div className="my-10 rounded-lg border border-[#333] border-dashed bg-[#0a0a0a] p-6 text-center">
      <p className="text-[11px] font-medium uppercase tracking-wider text-white/30 mb-2">
        Promoted Content
      </p>
      <div className="h-20 flex items-center justify-center text-white/20 text-[13px]">
        {/* AdSense slot would go here */}
        Ad Zone {position === "first" ? "1" : "2"} - 720x90
      </div>
    </div>
  )
}

// Tool Card Sidebar Component
function ToolCardSidebar({ tool }: { tool: { title: string; description: string; href: string; icon: "redaction" | "merge" | "split" | "compress" } }) {
  const icons = {
    redaction: Shield,
    merge: FileText,
    split: Scissors,
    compress: Minimize2,
  }
  const Icon = icons[tool.icon]

  return (
    <div className="rounded-lg bg-[#111] border border-[#333] p-5 transition-all duration-200 hover:border-[#0070f3] hover:shadow-[0_0_10px_rgba(0,112,243,0.15)]">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0070f3]/10">
          <Icon className="h-5 w-5 text-[#0070f3]" />
        </div>
        <div className="flex-1">
          <p className="text-[11px] font-medium uppercase tracking-wider text-[#0070f3] mb-1">
            Related Tool
          </p>
          <h4 className="text-[14px] font-semibold text-white mb-1">
            {tool.title}
          </h4>
          <p className="text-[12px] leading-relaxed text-white/50 mb-3">
            {tool.description}
          </p>
          <Link
            href={tool.href}
            className="inline-flex items-center gap-1 text-[12px] font-medium text-[#0070f3] hover:underline"
          >
            Try it now
            <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  )
}

// End of Post Share Section
function EndOfPostShare({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false)

  const shareOnX = () => {
    const text = encodeURIComponent(`${title} - Plain PDF Tools`)
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(url)}`, "_blank")
  }

  const shareOnLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, "_blank")
  }

  const copyLink = async () => {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="mt-12 rounded-xl bg-gradient-to-br from-[#0070f3]/10 to-transparent border border-[#0070f3]/20 p-8 text-center">
      <h3 className="text-[20px] font-semibold text-white mb-2">
        Share this Guide
      </h3>
      <p className="text-[14px] text-white/60 mb-6">
        Help others discover privacy-first PDF tools
      </p>
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={shareOnX}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#111] border border-[#333] text-[13px] font-medium text-white transition-all duration-150 hover:border-[#0070f3] hover:shadow-[0_0_10px_rgba(0,112,243,0.2)]"
        >
          <XIcon className="h-4 w-4" />
          Share on X
        </button>
        <button
          onClick={shareOnLinkedIn}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#111] border border-[#333] text-[13px] font-medium text-white transition-all duration-150 hover:border-[#0070f3] hover:shadow-[0_0_10px_rgba(0,112,243,0.2)]"
        >
          <LinkedInIcon className="h-4 w-4" />
          LinkedIn
        </button>
        <button
          onClick={copyLink}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#111] border border-[#333] text-[13px] font-medium text-white transition-all duration-150 hover:border-[#0070f3] hover:shadow-[0_0_10px_rgba(0,112,243,0.2)]"
        >
          {copied ? <Check className="h-4 w-4 text-green-500" /> : <LinkIcon className="h-4 w-4" />}
          {copied ? "Copied" : "Copy Link"}
        </button>
      </div>
    </div>
  )
}

export interface RelatedLink {
  href: string
  title: string
  description: string
}

export interface TocItem {
  id: string
  title: string
  level: number
}

export interface BlogArticleProps {
  title: string
  description: string
  intro?: string
  simpleTerms?: string
  inSimpleTerms?: string
  datePublished: string
  readingTime: number
  slug?: string
  canonicalUrl?: string
  relatedReading?: RelatedLink[]
  tableOfContents?: TocItem[]
  breadcrumbs?: { name: string; href: string }[]
  relatedTool?: {
  title: string
  description: string
  href: string
  icon: "redaction" | "merge" | "split" | "compress"
  }
  // GEO schema metadata
  linkedTools?: string[] // Tool slugs for SoftwareApplication schema
  aiTakeaway?: string // Hidden summary for AI crawlers
  category?: "technical-architecture" | "privacy-ethics" | "industry-use-cases" | "comparative-insights"
  faqItems?: Array<{ question: string; answer: string }> // For FAQPage schema
  children: React.ReactNode
  }

export function BlogArticle({
  title,
  description,
  intro,
  simpleTerms,
  inSimpleTerms,
  datePublished,
  readingTime,
  slug,
  canonicalUrl: providedCanonicalUrl,
  relatedReading = [],
  tableOfContents = [],
  relatedTool,
  linkedTools = [],
  aiTakeaway,
  category,
  faqItems,
  children,
}: BlogArticleProps) {
  const canonicalUrl = providedCanonicalUrl || (slug ? `https://plain.tools/blog/${slug}` : "https://plain.tools/blog")
  const simpleTermsContent = simpleTerms || inSimpleTerms

  const [activeSection, setActiveSection] = useState<string>("")
  
  // Auto-generate TOC from ArticleSection children if not provided
  const generatedToc = tableOfContents.length > 0 ? tableOfContents : (() => {
    const toc: TocItem[] = []
    Children.forEach(children, (child) => {
      if (isValidElement<{ title: string; id?: string }>(child) && child.type === ArticleSection) {
        const sectionTitle = child.props.title
        const id = child.props.id || slugifyTitle(sectionTitle)
        toc.push({ id, title: sectionTitle, level: 2 })
      }
    })
    return toc
  })()

  // Inject ad zones after 3rd and 7th paragraph-like elements
  const processedChildren = (() => {
    const childArray = Children.toArray(children)
    const result: React.ReactNode[] = []
    let sectionCount = 0

    childArray.forEach((child) => {
      result.push(child)
      
      if (isValidElement(child) && child.type === ArticleSection) {
        sectionCount++
        // Add first ad after 3rd section
        if (sectionCount === 3) {
          result.push(<InContentAd key="ad-zone-1" position="first" />)
        }
        // Add second ad after 6th section (if exists)
        if (sectionCount === 6) {
          result.push(<InContentAd key="ad-zone-2" position="second" />)
        }
      }
    })

    return result
  })()

  // Track active section for TOC highlighting
  useEffect(() => {
    if (generatedToc.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      {
        rootMargin: "-80px 0px -70% 0px",
        threshold: 0,
      }
    )

    generatedToc.forEach((item) => {
      const element = document.getElementById(item.id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [generatedToc])

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: description,
    author: {
      "@type": "Person",
      name: "Plain Editorial",
    },
    publisher: {
      "@type": "Organization",
      name: "Plain",
    },
    datePublished: datePublished,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
  }

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://plain.tools/" },
      { "@type": "ListItem", position: 2, name: "Blog", item: "https://plain.tools/blog" },
      { "@type": "ListItem", position: 3, name: title, item: canonicalUrl },
    ],
  }

  const formattedDate = new Date(datePublished).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="flex min-h-screen flex-col bg-[#000]">
      {/* Reading Progress Bar */}
      <ReadingProgressBar />

      {/* Floating Social Sidebar */}
      <FloatingSocialSidebar title={title} url={canonicalUrl} />

      {/* Canonical URL for SEO */}
      <link rel="canonical" href={canonicalUrl} />
      
  <Script
  id="article-jsonld"
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
  />
  <Script
  id="breadcrumb-jsonld"
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
  />
  
  {/* GEO-Optimised TechArticle, FAQPage, and SoftwareApplication schemas */}
  <BlogSchema
    title={title}
    description={description}
    slug={slug || ""}
    datePublished={datePublished}
    readingTime={readingTime}
    category={category}
    isQuestionArticle={isQuestionTitle(title)}
    faqItems={faqItems}
    linkedTools={linkedTools}
    aiTakeaway={aiTakeaway}
    dependencies={["WebAssembly", "WebGPU", "React"]}
    proficiencyLevel="Professional"
  />
  
  <Header />

      <main className="flex-1 hero-grid-pattern">
        <article className="px-4 py-16 md:py-24">
          <div className="mx-auto max-w-6xl lg:grid lg:grid-cols-[1fr_240px] lg:gap-12 xl:gap-16">
            {/* Main content column - 720px max */}
            <div className="mx-auto max-w-[720px] lg:mx-0">
              {/* Breadcrumb */}
              <nav className="mb-8 flex items-center gap-2 text-[13px] text-white/50">
                <Link href="/" className="rounded transition-colors hover:text-white focus-visible:text-white focus-visible:ring-2 focus-visible:ring-[#0070f3]/50 outline-none">
                  Home
                </Link>
                <span>/</span>
                <Link href="/blog" className="rounded transition-colors hover:text-white focus-visible:text-white focus-visible:ring-2 focus-visible:ring-[#0070f3]/50 outline-none">
                  Blog
                </Link>
              </nav>

              {/* Article Header */}
              <header className="mb-10">
                <h1 className="text-balance text-[32px] font-bold tracking-tight text-white md:text-[40px] leading-[1.1]">
                  {title}
                </h1>
                <div className="mt-5 flex flex-wrap items-center gap-3 text-[13px] text-white/50">
                  <time dateTime={datePublished}>{formattedDate}</time>
                  <span className="h-1 w-1 rounded-full bg-white/20" />
                  <span>{readingTime} min read</span>
                </div>
              </header>

              {/* Intro */}
              <p className="mb-8 text-[17px] leading-[1.8] text-white/70">
                {intro || description}
              </p>

              {/* In Simple Terms */}
              {simpleTermsContent && (
                <div className="mb-10 rounded-xl border border-[#0070f3]/20 bg-[#0070f3]/5 p-6">
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-[#0070f3]">
                    In simple terms
                  </p>
                  <p className="text-[15px] leading-relaxed text-white/80">
                    {simpleTermsContent}
                  </p>
                </div>
              )}

              {/* Main Content with injected ads */}
              <div className="prose-custom space-y-10">
                {processedChildren}
              </div>

              {/* End of Post Share Section */}
              <EndOfPostShare title={title} url={canonicalUrl} />

              {/* Related Reading */}
              {relatedReading.length > 0 && (
                <section className="mt-12 border-t border-white/[0.06] pt-10">
                  <h2 className="mb-5 text-[11px] font-semibold uppercase tracking-wider text-white/40">
                    Related Reading
                  </h2>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {relatedReading.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="group rounded-lg bg-[#111] p-4 border border-[#333] transition-all duration-200 outline-none hover:-translate-y-0.5 hover:border-[#0070f3] hover:shadow-[0_0_10px_rgba(0,112,243,0.15)] focus-visible:ring-2 focus-visible:ring-[#0070f3]/50"
                      >
                        <h3 className="text-[14px] font-medium text-white group-hover:text-[#0070f3] transition-colors">
                          {link.title}
                        </h3>
                        <p className="mt-1 text-[13px] leading-[1.5] text-white/50">
                          {link.description}
                        </p>
                      </Link>
                    ))}
                  </div>
                </section>
              )}
              
              {/* Back to blog */}
              <div className="mt-10">
                <Link 
                  href="/blog" 
                  className="text-[13px] text-white/50 hover:text-white transition-colors"
                >
                  &larr; Back to all articles
                </Link>
              </div>
            </div>

            {/* Sticky Sidebar - Desktop only */}
            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-6">
                {/* Table of Contents */}
                {generatedToc.length > 0 && (
                  <nav>
                    <p className="mb-4 text-[11px] font-semibold uppercase tracking-wider text-white/40">
                      On this page
                    </p>
                    <ul className="space-y-2 border-l border-white/[0.08]">
                      {generatedToc.map((item) => (
                        <li key={item.id}>
                          <a
                            href={`#${item.id}`}
                            className={`block border-l-2 py-1.5 pl-4 text-[13px] leading-snug transition-colors ${
                              item.level === 3 ? "pl-6" : ""
                            } ${
                              activeSection === item.id
                                ? "border-[#0070f3] text-[#0070f3]"
                                : "border-transparent text-white/50 hover:text-white hover:border-white/[0.15]"
                            }`}
                          >
                            {item.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </nav>
                )}

                {/* Related Tool Card */}
                {relatedTool && (
                  <ToolCardSidebar tool={relatedTool} />
                )}

                {/* Default tool card if none specified */}
                {!relatedTool && (
                  <ToolCardSidebar 
                    tool={{
                      title: "Redaction Tool",
                      description: "Permanently remove sensitive information from your PDFs with local processing.",
                      href: "/tools/redact-pdf",
                      icon: "redaction"
                    }} 
                  />
                )}
              </div>
            </aside>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  )
}

// Reusable section components for article content
export function ArticleSection({
  title,
  id,
  children,
}: {
  title: string
  id?: string
  children: React.ReactNode
}) {
  const sectionId = id || slugifyTitle(title)
  
  return (
    <section id={sectionId}>
      <h2 className="mb-6 text-[24px] font-semibold tracking-tight text-white scroll-mt-24">
        {title}
      </h2>
      {/* Auto-link Master Terms to Glossary */}
      <AutoLinkContent className="space-y-5">
        {children}
      </AutoLinkContent>
    </section>
  )
}

export function ArticleSubsection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="mt-8">
      <h3 className="mb-4 text-[18px] font-semibold text-white">
        {title}
      </h3>
      {children}
    </div>
  )
}

export function ArticleParagraph({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[16px] leading-[1.85] text-white/65">
      {children}
    </p>
  )
}

export function ArticleList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3 text-[16px] leading-[1.85] text-white/65">
      {items.map((item, index) => (
        <li key={index} className="flex gap-3">
          <span className="mt-2.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#0070f3]/60" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

export function ArticleNote({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-[#333] bg-[#111] p-5">
      <p className="text-[14px] leading-relaxed text-white/60">
        {children}
      </p>
    </div>
  )
}

export function ArticleCode({ 
  children
}: { 
  children: string
}) {
  return (
    <pre className="overflow-x-auto rounded-xl bg-[#0a0a0a] p-5 text-[13px] leading-relaxed ring-1 ring-white/[0.06]">
      <code className="font-mono text-white/70">{children}</code>
    </pre>
  )
}

export function ArticleQuote({ children }: { children: React.ReactNode }) {
  return (
    <blockquote className="border-l-2 border-[#0070f3]/40 pl-5 text-[15px] italic leading-relaxed text-white/60">
      {children}
    </blockquote>
  )
}

// Re-export TechnicalFigure for blog posts with captions (Image SEO)
export { TechnicalFigure as ArticleFigure }
