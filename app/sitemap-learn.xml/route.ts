import { BASE_URL } from "@/lib/page-metadata"
import { seoMdxSitemapUrls } from "@/lib/seo/mdx-page-registry"
import { trancheLearnSlugs } from "@/lib/seo/tranche1-content"
import { workflowSitemapUrls } from "@/lib/seo/workflows-content"
import { buildSitemapXml, type SitemapXmlEntry } from "@/lib/seo/sitemap-xml"

export async function GET() {
  const now = new Date()
  const learnUrls = new Set<string>([
    "/learn",
    "/learn/compress-pdf-without-upload",
    ...trancheLearnSlugs.map((slug) => `/learn/${slug}`),
    ...workflowSitemapUrls.filter((url) => url.startsWith("/learn/")),
    ...seoMdxSitemapUrls.filter((url) => url.startsWith("/learn/")),
  ])

  const entries: SitemapXmlEntry[] = Array.from(learnUrls)
    .sort()
    .map((path) => ({
      url: `${BASE_URL}${path}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: path === "/learn" ? 0.9 : 0.7,
    }))

  return new Response(buildSitemapXml(entries), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  })
}
