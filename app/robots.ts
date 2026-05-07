import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Only block private and parameterized crawl traps. Public duplicate paths should stay
        // crawlable so Google can see redirects or noindex directives instead of accumulating
        // blocked-URL noise in Search Console.
        disallow: [
          "/api/",
          "/sign-in",
          "/sign-up",
          "/pro/",
          "/*?*",
        ],
      },
    ],
    host: "https://plain.tools",
    sitemap: "https://plain.tools/sitemap.xml",
  }
}
