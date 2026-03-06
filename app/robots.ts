import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
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
  }
}
