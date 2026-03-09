import { TOOL_CATALOGUE } from "@/lib/tools-catalogue"
import { BASE_URL } from "@/lib/page-metadata"
import { buildSitemapXml, type SitemapXmlEntry } from "@/lib/seo/sitemap-xml"
import { PDF_INTENT_PAGES, pdfIntentPathFor } from "@/lib/pdf-intent-pages"
import { TOOL_PROBLEM_PAGES } from "@/lib/tool-problem-pages"
import { TOOL_VARIANT_PAGES } from "@/lib/tools-matrix"

export async function GET() {
  const now = new Date()
  const seoLandingPages = ["/diagnosis", "/is-chatgpt-down", "/check-if-website-is-down"] as const

  const entries: SitemapXmlEntry[] = TOOL_CATALOGUE.filter((tool) => tool.available).map((tool) => ({
    url: `${BASE_URL}/tools/${tool.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }))

  entries.push(
    ...TOOL_PROBLEM_PAGES.map((page) => ({
      url: `${BASE_URL}/tools/${page.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.84,
    })),
    ...TOOL_VARIANT_PAGES.map((page) => ({
      url: `${BASE_URL}${page.path}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.83,
    })),
    ...PDF_INTENT_PAGES.map((page) => ({
      url: `${BASE_URL}${pdfIntentPathFor(page.slug)}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.82,
    })),
    ...seoLandingPages.map((path) => ({
      url: `${BASE_URL}${path}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.84,
    }))
  )

  return new Response(buildSitemapXml(entries), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  })
}
