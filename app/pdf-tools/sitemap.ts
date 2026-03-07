import type { MetadataRoute } from "next"

/**
 * Legacy mount sitemap route.
 * Canonical URLs are served from /sitemap.xml and /pdf-tools/* is excluded from index strategy.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return []
}
