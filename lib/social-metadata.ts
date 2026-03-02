import type { Metadata } from "next"

const BASE_URL = "https://plain.tools"
const DEFAULT_DESCRIPTION = "Professional-grade PDF utilities processed 100% locally in your browser. No uploads, total privacy, zero-server architecture."

interface GenerateMetadataOptions {
  title: string
  description?: string
  type?: "tool" | "blog" | "page"
  category?: string
  slug?: string
  publishedTime?: string
  modifiedTime?: string
  authors?: string[]
  keywords?: string[]
}

/**
 * Generate consistent SEO and social metadata for Plain PDF pages
 * 
 * Usage:
 * ```ts
 * export const metadata = generateSocialMetadata({
 *   title: "Merge PDF",
 *   type: "tool",
 *   slug: "tools/merge-pdf"
 * })
 * ```
 */
export function generateSocialMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  type = "page",
  category,
  slug = "",
  publishedTime,
  modifiedTime,
  authors = ["Plain Team"],
  keywords = ["PDF", "local processing", "privacy", "browser-based", "no upload"],
}: GenerateMetadataOptions): Metadata {
  // Build full title based on type
  const fullTitle = type === "blog" 
    ? `${title} | Plain Journal`
    : type === "tool"
    ? `${title} | Plain PDF`
    : `${title} | Plain`

  // Build canonical URL
  const canonicalUrl = slug ? `${BASE_URL}/${slug}` : BASE_URL

  // Build OG image URL with parameters for dynamic generation
  const ogImageParams = new URLSearchParams({
    title,
    type,
    ...(category && { category }),
  })
  const ogImageUrl = `${BASE_URL}/api/og?${ogImageParams.toString()}`

  return {
    title: fullTitle,
    description,
    keywords: keywords.join(", "),
    authors: authors.map(name => ({ name })),
    creator: "Plain",
    publisher: "Plain",
    
    // Canonical URL
    alternates: {
      canonical: canonicalUrl,
    },

    // Open Graph
    openGraph: {
      type: type === "blog" ? "article" : "website",
      locale: "en_GB",
      url: canonicalUrl,
      siteName: "Plain",
      title: fullTitle,
      description,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(type === "blog" && publishedTime && {
        publishedTime,
        modifiedTime: modifiedTime || publishedTime,
        authors,
      }),
    },

    // Twitter Card
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImageUrl],
      creator: "@plaintools",
      site: "@plaintools",
    },

    // Robots
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  }
}

/**
 * Generate tool-specific metadata
 */
export function generateToolMetadata(
  toolName: string,
  toolDescription?: string,
  slug?: string
): Metadata {
  return generateSocialMetadata({
    title: toolName,
    description: toolDescription || `${toolName} - Process PDFs 100% locally in your browser. No uploads, complete privacy.`,
    type: "tool",
    slug: slug || `tools/${toolName.toLowerCase().replace(/\s+/g, "-")}`,
    keywords: ["PDF", toolName.toLowerCase(), "local processing", "privacy", "browser-based", "no upload", "offline"],
  })
}

/**
 * Generate blog post-specific metadata
 */
export function generateBlogMetadata(
  postTitle: string,
  postDescription: string,
  slug: string,
  category?: string,
  publishedTime?: string,
  modifiedTime?: string
): Metadata {
  return generateSocialMetadata({
    title: postTitle,
    description: postDescription,
    type: "blog",
    category,
    slug: `blog/${slug}`,
    publishedTime,
    modifiedTime,
    keywords: ["PDF", "privacy", category?.toLowerCase() || "guide", "local processing"],
  })
}
