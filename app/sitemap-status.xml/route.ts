import { BASE_URL } from "@/lib/page-metadata"
import { buildSitemapXml, type SitemapXmlEntry } from "@/lib/seo/sitemap-xml"
import { STATUS_DOMAINS } from "@/lib/status-domains"
import { statusPathFor } from "@/lib/site-status"

export async function GET() {
  const now = new Date()

  const entries: SitemapXmlEntry[] = [
    {
      url: `${BASE_URL}/site-status`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/status/trending`,
      lastModified: now,
      changeFrequency: "hourly",
      priority: 0.85,
    },
    ...STATUS_DOMAINS.map((site, index) => ({
      url: `${BASE_URL}${statusPathFor(site)}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: index < 100 ? 0.8 : 0.6,
    })),
  ]

  return new Response(buildSitemapXml(entries), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  })
}
