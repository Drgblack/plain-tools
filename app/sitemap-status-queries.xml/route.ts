import { buildSitemapXml, type SitemapXmlEntry } from "@/lib/seo/sitemap-xml"

export async function GET() {
  const entries: SitemapXmlEntry[] = []

  return new Response(buildSitemapXml(entries), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  })
}
