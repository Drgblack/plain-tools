import { serializeJsonLd } from "@/lib/sanitize"
/**
 * BlogSchema Component - Dynamic JSON-LD Schema Injection
 * 
 * Generates TechArticle, FAQPage, and SoftwareApplication schemas
 * for GEO (Generative Engine Optimisation) and traditional SEO.
 * 
 * Uses UK English throughout. Server-side rendered for Zero-Trace Policy.
 */

import Script from "next/script"

const BASE_URL = "https://plain.tools"
const ORGANISATION_NAME = "Plain PDF"
const LOGO_URL = `${BASE_URL}/logo.png`

// Tool slug to name mapping for SoftwareApplication schema
const TOOL_MAPPINGS: Record<string, { name: string; description: string }> = {
  "merge-pdf": {
    name: "Merge PDF",
    description: "Combine multiple PDF files into a single document. 100% local processing using WebAssembly.",
  },
  "split-pdf": {
    name: "Split PDF",
    description: "Extract pages or split PDF documents into multiple files. No server uploads required.",
  },
  "compress-pdf": {
    name: "Compress PDF",
    description: "Reduce PDF file size while maintaining quality. Browser-based compression using WebAssembly.",
  },
  "redact-pdf": {
    name: "Redact PDF",
    description: "Permanently remove sensitive information from PDF documents. True redaction, not just overlay.",
  },
  "unlock-pdf": {
    name: "Unlock PDF",
    description: "Remove password protection from PDF files. All processing happens locally in your browser.",
  },
  "offline-ocr": {
    name: "OCR PDF",
    description: "Convert scanned documents to searchable PDFs using local WebGPU-accelerated text recognition.",
  },
  "reorder-pdf": {
    name: "Reorder PDF",
    description: "Rearrange, rotate, and delete pages in PDF documents. Drag-and-drop interface with local processing.",
  },
  "pdf-qa": {
    name: "Private AI Chat",
    description: "Chat with your PDF documents using on-device AI. Zero cloud APIs, WebGPU-powered.",
  },
  "summarize-pdf": {
    name: "Summarize PDF",
    description: "Generate concise summaries of PDF documents while keeping processing privacy-focused.",
  },
}

export interface BlogSchemaProps {
  // Core article metadata
  title: string
  description: string
  slug: string
  datePublished: string // ISO 8601 format: YYYY-MM-DD
  dateModified?: string
  readingTime?: number
  
  // Content categorisation
  category?: "technical-architecture" | "privacy-ethics" | "industry-use-cases" | "comparative-insights"
  proficiencyLevel?: "Beginner" | "Expert" | "Professional"
  
  // FAQ schema trigger - for question-based titles
  isQuestionArticle?: boolean
  faqItems?: Array<{
    question: string
    answer: string
  }>
  
  // Tool linkage for SoftwareApplication schema
  linkedTools?: string[] // Array of tool slugs
  
  // GEO metadata
  aiTakeaway?: string // Hidden summary for AI crawlers
  dependencies?: string[] // Technical dependencies (WebAssembly, WebGPU, etc.)
}

// Generate TechArticle schema (primary schema for all blog posts)
function generateTechArticleSchema(props: BlogSchemaProps) {
  const {
    title,
    description,
    slug,
    datePublished,
    dateModified,
    readingTime,
    proficiencyLevel = "Professional",
    dependencies = ["WebAssembly", "WebGPU", "React"],
    aiTakeaway,
  } = props

  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "@id": `${BASE_URL}/blog/${slug}#article`,
    headline: title,
    description: aiTakeaway || description,
    author: {
      "@type": "Organization",
      name: `${ORGANISATION_NAME} Engineering`,
      url: BASE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: ORGANISATION_NAME,
      logo: {
        "@type": "ImageObject",
        url: LOGO_URL,
      },
    },
    datePublished: datePublished,
    dateModified: dateModified || datePublished,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${BASE_URL}/blog/${slug}`,
    },
    inLanguage: "en-GB",
    // TechArticle-specific fields
    proficiencyLevel: proficiencyLevel,
    dependencies: dependencies.join(", "),
    // Additional GEO-optimised fields
    isAccessibleForFree: true,
    articleSection: "Technical Documentation",
    wordCount: readingTime ? readingTime * 200 : undefined, // Estimate ~200 words per minute
    // Knowledge Graph signals
    about: [
      {
        "@type": "Thing",
        name: "WebAssembly",
        sameAs: "https://en.wikipedia.org/wiki/WebAssembly",
      },
      {
        "@type": "Thing",
        name: "Browser-based document processing",
      },
      {
        "@type": "Thing",
        name: "Privacy-preserving technology",
      },
    ],
  }
}

// Generate FAQPage schema (for question-based articles)
function generateFAQPageSchema(faqItems: Array<{ question: string; answer: string }>, slug: string) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${BASE_URL}/blog/${slug}#faq`,
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  }
}

// Generate SoftwareApplication schema (for tool-linked articles)
function generateSoftwareApplicationSchema(toolSlugs: string[]) {
  return toolSlugs
    .filter((slug) => TOOL_MAPPINGS[slug])
    .map((slug) => {
      const tool = TOOL_MAPPINGS[slug]
      return {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "@id": `${BASE_URL}/tools/${slug}#app`,
        name: `${tool.name} - ${ORGANISATION_NAME}`,
        description: tool.description,
        url: `${BASE_URL}/tools/${slug}`,
        applicationCategory: "UtilitiesApplication",
        applicationSubCategory: "Document Management",
        operatingSystem: "Browser-based (Chrome, Firefox, Safari, Edge)",
        browserRequirements: "Requires WebAssembly support",
        permissions: "No server uploads. All processing occurs locally.",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "GBP",
        },
        provider: {
          "@type": "Organization",
          name: ORGANISATION_NAME,
          url: BASE_URL,
        },
        featureList: [
          "100% local browser processing",
          "No file uploads to servers",
          "Works offline after initial load",
          "WebAssembly-powered performance",
          "No account required",
          "No tracking cookies",
        ],
      }
    })
}

// Generate HowTo schema (for tutorial articles with linked tools)
function generateHowToSchema(
  title: string,
  description: string,
  slug: string,
  toolSlug: string
) {
  const tool = TOOL_MAPPINGS[toolSlug]
  if (!tool) return null

  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "@id": `${BASE_URL}/blog/${slug}#howto`,
    name: title,
    description: description,
    tool: {
      "@type": "HowToTool",
      name: tool.name,
      url: `${BASE_URL}/tools/${toolSlug}`,
    },
    step: [
      {
        "@type": "HowToStep",
        name: "Open the tool",
        text: `Navigate to the ${tool.name} tool in your browser.`,
        url: `${BASE_URL}/tools/${toolSlug}`,
      },
      {
        "@type": "HowToStep",
        name: "Upload your file",
        text: "Drag and drop your PDF file or click to browse. The file stays on your device.",
      },
      {
        "@type": "HowToStep",
        name: "Process locally",
        text: "The tool processes your document using WebAssembly in your browser. No server uploads occur.",
      },
      {
        "@type": "HowToStep",
        name: "Download result",
        text: "Download your processed PDF. The file is never stored externally.",
      },
    ],
    totalTime: "PT2M",
    supply: [],
  }
}

// Main BlogSchema component
export function BlogSchema(props: BlogSchemaProps) {
  const {
    slug,
    title,
    description,
    isQuestionArticle,
    faqItems,
    linkedTools = [],
  } = props

  // Build the schema graph
  const schemas: object[] = []

  // 1. Always include TechArticle schema
  schemas.push(generateTechArticleSchema(props))

  // 2. Include FAQPage schema for question-based articles
  if (isQuestionArticle || faqItems?.length) {
    const faqs = faqItems?.length
      ? faqItems
      : [
          {
            question: title,
            answer: description,
          },
        ]
    schemas.push(generateFAQPageSchema(faqs, slug))
  }

  // 3. Include SoftwareApplication schemas for linked tools
  if (linkedTools.length > 0) {
    const toolSchemas = generateSoftwareApplicationSchema(linkedTools)
    schemas.push(...toolSchemas)

    // 4. Include HowTo schema for the primary linked tool
    const howToSchema = generateHowToSchema(title, description, slug, linkedTools[0])
    if (howToSchema) {
      schemas.push(howToSchema)
    }
  }

  // Combine into @graph for cleaner output
  const combinedSchema = {
    "@context": "https://schema.org",
    "@graph": schemas.map((schema) => {
      // Remove duplicate @context from individual schemas
      const rest = { ...(schema as Record<string, unknown>) }
      delete rest["@context"]
      return rest
    }),
  }

  return (
    <Script
      id={`blog-schema-${slug}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(combinedSchema) }}
    />
  )
}

// Helper to detect if title is a question
export function isQuestionTitle(title: string): boolean {
  const questionPatterns = [
    /^(is|are|can|do|does|will|should|how|what|why|when|where|which)\s/i,
    /\?$/,
  ]
  return questionPatterns.some((pattern) => pattern.test(title.trim()))
}

// Helper to extract FAQ items from article headings and content
export function extractFAQFromContent(
  headings: string[],
  contentMap: Record<string, string>
): Array<{ question: string; answer: string }> {
  return headings
    .filter((heading) => isQuestionTitle(heading))
    .map((heading) => ({
      question: heading.replace(/\?$/, "").trim() + "?",
      answer: contentMap[heading] || "",
    }))
    .filter((faq) => faq.answer.length > 0)
}

// Utility for determining dependencies based on article content
export function inferDependencies(content: string): string[] {
  const dependencies: string[] = []
  
  const patterns: Array<{ pattern: RegExp; dep: string }> = [
    { pattern: /webassembly|wasm/i, dep: "WebAssembly" },
    { pattern: /webgpu/i, dep: "WebGPU" },
    { pattern: /react/i, dep: "React" },
    { pattern: /typescript/i, dep: "TypeScript" },
    { pattern: /rust/i, dep: "Rust" },
    { pattern: /canvas|webgl/i, dep: "Canvas API" },
    { pattern: /service.?worker/i, dep: "Service Workers" },
    { pattern: /indexeddb/i, dep: "IndexedDB" },
  ]
  
  patterns.forEach(({ pattern, dep }) => {
    if (pattern.test(content) && !dependencies.includes(dep)) {
      dependencies.push(dep)
    }
  })
  
  // Always include base dependencies
  if (!dependencies.includes("WebAssembly")) {
    dependencies.unshift("WebAssembly")
  }
  
  return dependencies
}
