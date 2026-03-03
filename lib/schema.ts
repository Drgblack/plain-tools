/**
 * Structured Data Schema Utilities for Learning Center
 * 
 * Optimized for search engines and AI retrieval systems (ChatGPT, Perplexity, Gemini)
 * Following schema.org specifications with clean, non-spammy markup
 */

const BASE_URL = "https://plain.tools"

const organization = {
  "@type": "Organization",
  name: "Plain",
  url: BASE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${BASE_URL}/icon.svg`,
  },
}

/**
 * Generate Article schema for Learn articles
 * Used for educational content with clear authorship
 */
export function generateArticleSchema({
  title,
  description,
  slug,
  datePublished,
  dateModified,
  wordCount,
  keywords,
}: {
  title: string
  description: string
  slug: string
  datePublished?: string
  dateModified?: string
  wordCount?: number
  keywords?: string[]
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    author: organization,
    publisher: organization,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${BASE_URL}/learn/${slug}`,
    },
    url: `${BASE_URL}/learn/${slug}`,
    ...(datePublished && { datePublished }),
    ...(dateModified && { dateModified }),
    ...(wordCount && { wordCount }),
    ...(keywords && { keywords: keywords.join(", ") }),
    inLanguage: "en",
    isAccessibleForFree: true,
  }
}

/**
 * Generate TechArticle schema for technical documentation
 * Better semantic match for technical explanations
 */
export function generateTechArticleSchema({
  title,
  description,
  slug,
  datePublished,
  dateModified,
  proficiencyLevel = "Beginner",
}: {
  title: string
  description: string
  slug: string
  datePublished?: string
  dateModified?: string
  proficiencyLevel?: "Beginner" | "Intermediate" | "Expert"
}) {
  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: title,
    description,
    author: organization,
    publisher: organization,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${BASE_URL}/learn/${slug}`,
    },
    url: `${BASE_URL}/learn/${slug}`,
    ...(datePublished && { datePublished }),
    ...(dateModified && { dateModified }),
    proficiencyLevel,
    inLanguage: "en",
    isAccessibleForFree: true,
  }
}

/**
 * Generate Breadcrumb schema
 * Helps search engines understand site structure
 */
export function generateBreadcrumbSchema(
  items: { name: string; slug?: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: BASE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Learn",
        item: `${BASE_URL}/learn`,
      },
      ...items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 3,
        name: item.name,
        ...(item.slug && { item: `${BASE_URL}/learn/${item.slug}` }),
      })),
    ],
  }
}

/**
 * Generate FAQ schema
 * Used for articles with clear question/answer pairs
 * Important: Only use for genuine FAQs, not fabricated questions
 */
export function generateFAQSchema(
  faqs: readonly { question: string; answer: string }[]
) {
  if (faqs.length === 0) return null
  
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }
}

/**
 * Generate HowTo schema
 * Used for step-by-step guides and tutorials
 */
export function generateHowToSchema({
  name,
  description,
  steps,
  totalTime,
}: {
  name: string
  description: string
  steps: { name: string; text: string }[]
  totalTime?: string // ISO 8601 duration, e.g., "PT5M" for 5 minutes
}) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    description,
    ...(totalTime && { totalTime }),
    step: steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.name,
      text: step.text,
    })),
  }
}

/**
 * Generate WebPage schema with speakable content
 * Optimized for voice assistants and AI retrieval
 */
export function generateWebPageSchema({
  title,
  description,
  slug,
  speakableSelectors = ["article h1", "article header p"],
}: {
  title: string
  description: string
  slug: string
  speakableSelectors?: string[]
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url: `${BASE_URL}/learn/${slug}`,
    isPartOf: {
      "@type": "WebSite",
      name: "Plain",
      url: BASE_URL,
    },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: speakableSelectors,
    },
    inLanguage: "en",
  }
}

/**
 * Combine multiple schemas into a single graph
 * Reduces script tags and improves parsing
 */
export function combineSchemas(schemas: (object | null)[]) {
  const validSchemas = schemas.filter(Boolean)
  
  if (validSchemas.length === 0) return null
  if (validSchemas.length === 1) return validSchemas[0]
  
  return {
    "@context": "https://schema.org",
    "@graph": validSchemas.map((schema) => {
      // Remove duplicate @context from nested schemas
      const schemaWithoutContext = { ...(schema as Record<string, unknown>) }
      delete schemaWithoutContext["@context"]
      return schemaWithoutContext
    }),
  }
}
