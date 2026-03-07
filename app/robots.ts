import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // AdSense readiness: keep content routes crawlable and do not block Mediapartners-Google.
        userAgent: "*",
        allow: ["/", "/.well-known/", "/api/health"],
        disallow: [
          "/api/",
          "/sign-in",
          "/sign-up",
          "/pro/success",
          "/api/stripe/",
          "/api/waitlist",
        ],
      },
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "ClaudeBot", allow: "/" },
      { userAgent: "GoogleOther", allow: "/" },
      { userAgent: "Amazonbot", allow: "/" },
      { userAgent: "Applebot", allow: "/" },
    ],
    sitemap: "https://plain.tools/sitemap.xml",
    host: "https://plain.tools",
  }
}
