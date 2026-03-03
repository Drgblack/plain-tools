import { createElement } from 'react'
import { serializeJsonLd } from "@/lib/sanitize"

/**
 * Schema.org / JSON-LD Structured Data for Plain PDF
 * Optimised for GEO (Generative Engine Optimisation) and traditional SEO
 * 
 * Uses UK English throughout (optimised, initialised, etc.)
 */

const BASE_URL = 'https://plain.tools'
const ORGANISATION_NAME = 'Plain'
const LOGO_URL = `${BASE_URL}/logo.png`

// Organisation schema - used site-wide
export function generateOrganisationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: ORGANISATION_NAME,
    url: BASE_URL,
    logo: LOGO_URL,
    description: 'Privacy-first PDF tools that run entirely in your browser. No uploads, no servers, no ad tracking.',
    foundingDate: '2024',
    foundingLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'GB',
      },
    },
    sameAs: [
      'https://twitter.com/plainpdf',
      'https://linkedin.com/company/plainpdf',
    ],
  }
}

// WebSite schema for search features
export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: ORGANISATION_NAME,
    url: BASE_URL,
    description: 'Professional PDF tools with complete privacy. All processing happens locally in your browser using WebAssembly technology.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/tools?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

// SoftwareApplication schema for tool pages
export interface ToolSchemaOptions {
  name: string
  description: string
  slug: string
  category?: string
  aggregateRating?: {
    ratingValue: number
    ratingCount: number
  }
}

export function generateToolSchema(options: ToolSchemaOptions) {
  const { name, description, slug, category = 'Document Management', aggregateRating } = options

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: `${name} - Plain PDF`,
    description,
    url: `${BASE_URL}/tools/${slug}`,
    applicationCategory: category,
    operatingSystem: 'Browser-based',
    browserRequirements: 'Requires a modern browser with WebAssembly support (Chrome, Firefox, Safari, Edge)',
    permissions: 'No server uploads required. All processing occurs locally.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'GBP',
    },
    provider: {
      '@type': 'Organization',
      name: ORGANISATION_NAME,
      url: BASE_URL,
    },
    featureList: [
      '100% local processing',
      'No file uploads',
      'Works offline after initial load',
      'WebAssembly-powered performance',
      'No account required',
      'No ad tracking or cookies',
    ],
  }

  if (aggregateRating) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: aggregateRating.ratingValue,
      ratingCount: aggregateRating.ratingCount,
      bestRating: 5,
      worstRating: 1,
    }
  }

  return schema
}

// TechArticle schema for Learning Centre posts (GEO optimised)
export interface TechArticleSchemaOptions {
  headline: string
  description: string
  slug: string
  datePublished: string
  dateModified?: string
  author?: string
  wordCount?: number
  proficiencyLevel?: 'Beginner' | 'Expert'
  dependencies?: string[]
}

export function generateTechArticleSchema(options: TechArticleSchemaOptions) {
  const {
    headline,
    description,
    slug,
    datePublished,
    dateModified,
    author = 'Plain Team',
    wordCount,
    proficiencyLevel = 'Beginner',
    dependencies = ['WebAssembly', 'Modern Web Browser'],
  } = options

  return {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline,
    description,
    url: `${BASE_URL}/learn/${slug}`,
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      '@type': 'Organization',
      name: author,
      url: BASE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: ORGANISATION_NAME,
      url: BASE_URL,
      logo: {
        '@type': 'ImageObject',
        url: LOGO_URL,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${BASE_URL}/learn/${slug}`,
    },
    proficiencyLevel,
    dependencies,
    wordCount,
    inLanguage: 'en-GB',
    isAccessibleForFree: true,
    // GEO-specific: helps AI understand the content type
    about: {
      '@type': 'Thing',
      name: 'Browser-based PDF Processing',
      description: 'Technology for processing PDF documents locally using WebAssembly without server uploads',
    },
  }
}

// BlogPosting schema for blog posts
export interface BlogPostSchemaOptions {
  headline: string
  description: string
  slug: string
  datePublished: string
  dateModified?: string
  author?: string
  image?: string
  wordCount?: number
}

export function generateBlogPostSchema(options: BlogPostSchemaOptions) {
  const {
    headline,
    description,
    slug,
    datePublished,
    dateModified,
    author = 'Plain Team',
    image,
    wordCount,
  } = options

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline,
    description,
    url: `${BASE_URL}/blog/${slug}`,
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      '@type': 'Organization',
      name: author,
      url: BASE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: ORGANISATION_NAME,
      url: BASE_URL,
      logo: {
        '@type': 'ImageObject',
        url: LOGO_URL,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${BASE_URL}/blog/${slug}`,
    },
    image: image || `${BASE_URL}/api/og?title=${encodeURIComponent(headline)}&type=blog`,
    wordCount,
    inLanguage: 'en-GB',
    isAccessibleForFree: true,
  }
}

// FAQPage schema for FAQ sections
export interface FAQSchemaOptions {
  questions: Array<{
    question: string
    answer: string
  }>
}

export function generateFAQSchema(options: FAQSchemaOptions) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: options.questions.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }
}

// HowTo schema for tutorial/guide content
export interface HowToSchemaOptions {
  name: string
  description: string
  steps: Array<{
    name: string
    text: string
  }>
  totalTime?: string // ISO 8601 duration format, e.g., "PT5M"
}

export function generateHowToSchema(options: HowToSchemaOptions) {
  const { name, description, steps, totalTime = 'PT2M' } = options

  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    totalTime,
    tool: {
      '@type': 'HowToTool',
      name: 'Plain PDF (Browser-based)',
    },
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
    })),
  }
}

// Helper component to render JSON-LD in pages
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  const jsonString = serializeJsonLd(Array.isArray(data) ? data : data)

  return createElement('script', {
    type: 'application/ld+json',
    dangerouslySetInnerHTML: { __html: jsonString },
  })
}
