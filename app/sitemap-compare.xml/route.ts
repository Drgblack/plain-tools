import { BASE_URL } from "@/lib/page-metadata"
import { getCompareMatrixSitemapPaths } from "@/lib/compare-matrix"
import { trancheCompareSlugs } from "@/lib/seo/tranche1-content"
import { buildSitemapXml, type SitemapXmlEntry } from "@/lib/seo/sitemap-xml"

export async function GET() {
  const now = new Date()
  const compareUrls = new Set<string>([
    "/compare",
    "/compare/smallpdf-alternative",
    ...trancheCompareSlugs.map((slug) => `/compare/${slug}`),
    ...getCompareMatrixSitemapPaths(),
  ])

  const entries: SitemapXmlEntry[] = Array.from(compareUrls)
    .sort()
    .map((path) => ({
      url: `${BASE_URL}${path}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: path === "/compare" ? 0.9 : 0.75,
    }))

  return new Response(buildSitemapXml(entries), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  })
}
