import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Private, transactional, and legacy duplicate surfaces should stay out of crawl paths.
        disallow: [
          "/api/",
          "/sign-in",
          "/sign-up",
          "/pro/",
          "/pdf-tools",
        ],
      },
    ],
    host: "https://plain.tools",
    sitemap: "https://plain.tools/sitemap.xml",
  }
}
