import type { Metadata } from "next"
import { buildStandardPageTitle, normalizeBrandCapitalization } from "@/lib/page-title"

export const BASE_URL = "https://www.plain.tools"
const MIN_DESCRIPTION_LENGTH = 140
const MAX_DESCRIPTION_LENGTH = 160
const DEFAULT_PAGE_DESCRIPTION =
  "Private browser tools for PDF, file, network, and status workflows. Local processing where supported, with no uploads for core tools and clear trust guidance."

type PageMetadataInput = {
  title: string
  description: string
  path: string
  image?: string
  type?: "website" | "article"
  googleNotranslate?: boolean
}

function normalisePageTitle(rawTitle: string): string {
  const cleaned = normalizeBrandCapitalization(rawTitle).trim()
  const hasBrandMention = /plain tools/i.test(cleaned)
  if (hasBrandMention) return cleaned
  return buildStandardPageTitle(cleaned)
}

export function buildMetaDescription(rawDescription: string): string {
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
  googleNotranslate = false,
}: PageMetadataInput): Metadata {
  const canonical = buildCanonicalUrl(path)
  const resolvedTitle = normalisePageTitle(title)
  const resolvedDescription = buildMetaDescription(description)

  return {
    title: resolvedTitle,
    description: resolvedDescription,
    alternates: {
      canonical,
      languages: {
        en: canonical,
        "x-default": canonical,
      },
    },
    other: googleNotranslate
      ? {
          // Page-level only. For section-level protection use translate="no" / .notranslate.
          google: "notranslate",
        }
      : undefined,
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
