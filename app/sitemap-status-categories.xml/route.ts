import { BASE_URL } from "@/lib/page-metadata"
import { buildSitemapXml, type SitemapXmlEntry } from "@/lib/seo/sitemap-xml"
import { STATUS_CATEGORIES } from "@/lib/status-domains"

export async function GET() {
  const now = new Date()

  const entries: SitemapXmlEntry[] = [
    {
      url: `${BASE_URL}/status`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...STATUS_CATEGORIES.map((category) => ({
      url: `${BASE_URL}/status/${category}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
  ]

  return new Response(buildSitemapXml(entries), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  })
}
