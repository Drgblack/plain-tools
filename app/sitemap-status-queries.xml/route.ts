import { BASE_URL } from "@/lib/page-metadata"
import { buildSitemapXml, type SitemapXmlEntry } from "@/lib/seo/sitemap-xml"
import { STATUS_QUERY_PAGES, statusQueryPathForSlug } from "@/lib/status-query-pages"

export async function GET() {
  const now = new Date()

  const entries: SitemapXmlEntry[] = STATUS_QUERY_PAGES.map((entry, index) => ({
    url: `${BASE_URL}${statusQueryPathForSlug(entry.slug)}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: index < 5 ? 0.88 : 0.8,
  }))

  return new Response(buildSitemapXml(entries), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  })
}
