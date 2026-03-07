import { BASE_URL } from "@/lib/page-metadata"
import { buildSitemapXml, type SitemapXmlEntry } from "@/lib/seo/sitemap-xml"
import { OUTAGE_HISTORY_PAGES, outageHistoryPathForSlug } from "@/lib/outage-history-pages"

export async function GET() {
  const now = new Date()

  const entries: SitemapXmlEntry[] = OUTAGE_HISTORY_PAGES.map((entry, index) => ({
    url: `${BASE_URL}${outageHistoryPathForSlug(entry.slug)}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: index < 5 ? 0.8 : 0.7,
  }))

  return new Response(buildSitemapXml(entries), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  })
}
