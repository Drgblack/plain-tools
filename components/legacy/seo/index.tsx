"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"

// ============================================
// Canonical URL Component
// ============================================
interface CanonicalProps {
  path?: string
}

export function CanonicalUrl({ path }: CanonicalProps) {
  const pathname = usePathname()
  const canonicalPath = path || pathname
  const baseUrl = "https://plainpdf.com"
  const canonicalUrl = `${baseUrl}${canonicalPath}`
  
  return (
    <link rel="canonical" href={canonicalUrl} />
  )
}

// ============================================
// Breadcrumb Component with JSON-LD
// ============================================
interface BreadcrumbItem {
  name: string
  href: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumbs({ items, className = "" }: BreadcrumbsProps) {
  const baseUrl = "https://plainpdf.com"
  
  // Generate JSON-LD schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": baseUrl
      },
      ...items.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 2,
        "name": item.name,
        "item": `${baseUrl}${item.href}`
      }))
    ]
  }

  return (
    <>
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      
      {/* Visual Breadcrumb Navigation */}
      <nav 
        aria-label="Breadcrumb navigation" 
        className={`flex items-center gap-1.5 text-[13px] text-white/50 ${className}`}
      >
        <Link 
          href="/" 
          className="flex items-center gap-1 transition-colors hover:text-white/70"
          aria-label="Home"
        >
          <Home className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="sr-only">Home</span>
        </Link>
        
        {items.map((item, index) => (
          <span key={item.href} className="flex items-center gap-1.5">
            <ChevronRight className="h-3.5 w-3.5 text-white/30" aria-hidden="true" />
            {index === items.length - 1 ? (
              <span className="text-white/70" aria-current="page">
                {item.name}
              </span>
            ) : (
              <Link 
                href={item.href}
                className="transition-colors hover:text-white/70"
              >
                {item.name}
              </Link>
            )}
          </span>
        ))}
      </nav>
    </>
  )
}

// ============================================
// GEO Summary Box Component
// ============================================
interface SummaryBoxProps {
  children: React.ReactNode
  className?: string
}

export function SummaryBox({ children, className = "" }: SummaryBoxProps) {
  return (
    <aside 
      className={`rounded-lg border border-[#0070f3]/30 bg-[#0070f3]/5 p-5 ${className}`}
      aria-label="Article summary"
    >
      <div className="mb-2 flex items-center gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#0070f3]">
          Summary
        </span>
        <div className="h-px flex-1 bg-[#0070f3]/20" />
      </div>
      <div className="text-[14px] leading-relaxed text-white/80">
        {children}
      </div>
    </aside>
  )
}

// ============================================
// Key Term Highlight Component
// ============================================
interface KeyTermProps {
  children: React.ReactNode
  definition?: string
}

export function KeyTerm({ children, definition }: KeyTermProps) {
  return (
    <strong 
      className="font-semibold text-white"
      title={definition}
    >
      {children}
    </strong>
  )
}

// ============================================
// Technical Figure with Caption (for Image SEO)
// ============================================
interface TechnicalFigureProps {
  src: string
  alt: string
  caption: string
  className?: string
}

export function TechnicalFigure({ src, alt, caption, className = "" }: TechnicalFigureProps) {
  return (
    <figure className={`my-6 ${className}`}>
      <div className="overflow-hidden rounded-lg border border-[#333] bg-[#111]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={src} 
          alt={alt}
          className="w-full"
          loading="lazy"
        />
      </div>
      <figcaption className="mt-3 text-center text-[13px] text-white/50">
        {caption}
      </figcaption>
    </figure>
  )
}

// ============================================
// Related Tools Sidebar (Semantic <aside>)
// ============================================
interface RelatedTool {
  name: string
  href: string
  description: string
}

interface RelatedToolsSidebarProps {
  tools: RelatedTool[]
  className?: string
}

export function RelatedToolsSidebar({ tools, className = "" }: RelatedToolsSidebarProps) {
  return (
    <aside 
      className={`rounded-xl border border-[#333] bg-[#111] p-5 ${className}`}
      aria-labelledby="related-tools-heading"
    >
      <h3 
        id="related-tools-heading"
        className="mb-4 text-[13px] font-semibold uppercase tracking-wider text-white/60"
      >
        Related Tools
      </h3>
      <nav aria-label="Related tools">
        <ul className="space-y-3">
          {tools.map((tool) => (
            <li key={tool.href}>
              <Link
                href={tool.href}
                className="group block rounded-lg border border-[#222] bg-[#0a0a0a] p-3 transition-all duration-150 hover:border-[#0070f3] hover:bg-[#0a0a0a]/80"
              >
                <span className="block text-[14px] font-medium text-white group-hover:text-[#0070f3]">
                  {tool.name}
                </span>
                <span className="mt-1 block text-[12px] text-white/50">
                  {tool.description}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}

// ============================================
// Page Wrapper with Semantic HTML
// ============================================
interface PageWrapperProps {
  children: React.ReactNode
  as?: "main" | "article" | "section"
  className?: string
}

export function PageWrapper({ children, as = "main", className = "" }: PageWrapperProps) {
  const Component = as
  return (
    <Component className={className} role={as === "main" ? "main" : undefined}>
      {children}
    </Component>
  )
}

// ============================================
// Preload Hints for Core Web Vitals
// ============================================
export function PreloadHints() {
  return (
    <>
      {/* Preconnect to critical origins */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* DNS Prefetch for third-party resources */}
      <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
      
      {/* Preload critical Wasm module */}
      <link 
        rel="preload" 
        href="/wasm/pdf-lib.wasm" 
        as="fetch" 
        type="application/wasm"
        crossOrigin="anonymous"
      />
    </>
  )
}

// ============================================
// Accessible Icon Wrapper
// ============================================
interface AccessibleIconProps {
  icon: React.ReactNode
  label: string
  className?: string
}

export function AccessibleIcon({ icon, label, className = "" }: AccessibleIconProps) {
  return (
    <span className={className} role="img" aria-label={label}>
      {icon}
    </span>
  )
}
