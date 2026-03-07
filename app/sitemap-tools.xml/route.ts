import { TOOL_CATALOGUE } from "@/lib/tools-catalogue"
import { BASE_URL } from "@/lib/page-metadata"
import { buildSitemapXml, type SitemapXmlEntry } from "@/lib/seo/sitemap-xml"
import { PDF_INTENT_PAGES, pdfIntentPathFor } from "@/lib/pdf-intent-pages"

export async function GET() {
  const now = new Date()

  const entries: SitemapXmlEntry[] = TOOL_CATALOGUE.filter((tool) => tool.available).map((tool) => ({
    url: `${BASE_URL}/tools/${tool.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }))

  entries.push(
    ...PDF_INTENT_PAGES.map((page) => ({
      url: `${BASE_URL}${pdfIntentPathFor(page.slug)}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.82,
    }))
  )

  return new Response(buildSitemapXml(entries), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  })
}
