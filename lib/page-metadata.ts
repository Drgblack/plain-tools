import type { Metadata } from "next"
import { buildStandardPageTitle, normalizeBrandCapitalization } from "@/lib/page-title"

const BASE_URL = "https://plain.tools"

type PageMetadataInput = {
  title: string
  description: string
  path: string
  image?: string
}

function normalisePageTitle(rawTitle: string): string {
  const cleaned = normalizeBrandCapitalization(rawTitle).trim()
  const hasBrandSuffix = /\|\s*Plain Tools$/i.test(cleaned)
  if (hasBrandSuffix) return cleaned
  return buildStandardPageTitle(cleaned)
}

export function buildPageMetadata({
  title,
  description,
  path,
  image = "/og/default.png",
}: PageMetadataInput): Metadata {
  const canonical = `${BASE_URL}${path === "/" ? "" : path}`
  const resolvedTitle = normalisePageTitle(title)

  return {
    title: resolvedTitle,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title: resolvedTitle,
      description,
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
      description,
      images: [image],
    },
  }
}
