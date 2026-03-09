import type { MetadataRoute } from "next"

import { buildCanonicalUrl } from "@/lib/page-metadata"
import { getPdfVariantSitemapPaths } from "@/lib/pdf-variants"

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  return [
    {
      changeFrequency: "weekly",
      lastModified: now,
      priority: 0.8,
      url: buildCanonicalUrl("/pdf-tools/variants"),
    },
    ...getPdfVariantSitemapPaths().map((path) => ({
      changeFrequency: "daily" as const,
      lastModified: now,
      priority: 0.78,
      url: buildCanonicalUrl(path),
    })),
  ]
}
