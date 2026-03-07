import type { Metadata } from "next"
import { buildStandardPageTitle, normalizeBrandCapitalization } from "@/lib/page-title"

export const BASE_URL = "https://plain.tools"
const MIN_DESCRIPTION_LENGTH = 140
const MAX_DESCRIPTION_LENGTH = 160
const DEFAULT_PAGE_DESCRIPTION =
  "Access 43+ offline PDF tools, file converters, network diagnostics, and status checks. Core workflows run locally on Plain Tools with no uploads and no tracking."

type PageMetadataInput = {
  title: string
  description: string
  path: string
  image?: string
  type?: "website" | "article"
}

function normalisePageTitle(rawTitle: string): string {
  const cleaned = normalizeBrandCapitalization(rawTitle).trim()
  const hasBrandMention = /plain tools/i.test(cleaned)
  if (hasBrandMention) return cleaned
  return buildStandardPageTitle(cleaned)
}

function normaliseDescription(rawDescription: string): string {
  const cleaned = rawDescription.replace(/\s+/g, " ").trim()
  const resolved = cleaned.length > 0 ? cleaned : DEFAULT_PAGE_DESCRIPTION
  if (resolved.length <= MAX_DESCRIPTION_LENGTH) {
    return resolved
  }

  const clipped = resolved.slice(0, MAX_DESCRIPTION_LENGTH)
  const lastWhitespace = clipped.lastIndexOf(" ")
  if (lastWhitespace < MIN_DESCRIPTION_LENGTH) {
    return `${clipped.trimEnd()}…`
  }
  return `${clipped.slice(0, lastWhitespace).trimEnd()}…`
}

export function buildCanonicalUrl(path: string): string {
  if (!path || path === "/") return BASE_URL
  return `${BASE_URL}${path.startsWith("/") ? path : `/${path}`}`
}

export function buildPageMetadata({
  title,
  description,
  path,
  image = "/og/default.png",
  type = "website",
}: PageMetadataInput): Metadata {
  const canonical = buildCanonicalUrl(path)
  const resolvedTitle = normalisePageTitle(title)
  const resolvedDescription = normaliseDescription(description)

  return {
    title: resolvedTitle,
    description: resolvedDescription,
    alternates: {
      canonical,
    },
    openGraph: {
      type,
      siteName: "Plain Tools",
      locale: "en_GB",
      title: resolvedTitle,
      description: resolvedDescription,
      url: canonical,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: resolvedTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description: resolvedDescription,
      images: [image],
    },
  }
}
