import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/sign-in", "/sign-up", "/pro/"],
      },
    ],
    host: "https://plain.tools",
    sitemap: "https://plain.tools/sitemap.xml",
  }
}
