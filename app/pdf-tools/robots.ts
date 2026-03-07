import type { MetadataRoute } from "next"

/**
 * Legacy mount robots file.
 * Canonical SEO routes live on root paths and /pdf-tools URLs are redirected/noindexed.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        disallow: "/",
      },
    ],
    sitemap: "https://plain.tools/sitemap.xml",
    host: "https://plain.tools",
  }
}
