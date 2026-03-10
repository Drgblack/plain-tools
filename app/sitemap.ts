import { MetadataRoute } from "next"

import { getConverterModifierSitemapPaths } from "@/lib/converter-modifiers"
import { getCompareMatrixSitemapPaths } from "@/lib/compare-matrix"
import { categories as blogCategories, posts as blogPosts } from "@/lib/blog-data"
import { getConverterSitemapPaths } from "@/lib/converter-pairs"
import { IP_SITEMAP_ADDRESSES } from "@/lib/network-ip"
import { OUTAGE_HISTORY_PAGES, outageHistoryPathForSlug } from "@/lib/outage-history-pages"
import { DNS_SITEMAP_DOMAINS } from "@/lib/network-dns"
import { getPdfVariantSitemapPaths } from "@/lib/pdf-variants"
import { getPdfComparisonSitemapPaths } from "@/lib/pdf-tool-comparisons"
import { PDF_INTENT_PAGES, pdfIntentPathFor } from "@/lib/pdf-intent-pages"
import { getProfessionalWorkflowSitemapPaths } from "@/lib/professional-workflows"
import { getProgrammaticSitemapPaths } from "@/lib/programmatic-content"
import { expansionSitemapUrls } from "@/lib/seo/expansion-content"
import { FIRST_WAVE_PRIORITY_PATHS } from "@/lib/seo/first-wave-pages"
import { seoMdxSitemapUrls } from "@/lib/seo/mdx-page-registry"
import { trancheSitemapUrls } from "@/lib/seo/tranche1-content"
import { workflowSitemapUrls } from "@/lib/seo/workflows-content"
import { statusPathFor } from "@/lib/site-status"
import {
  STATUS_CATEGORIES,
  STATUS_HIGH_DEMAND_SITES,
  STATUS_STATIC_DOMAINS,
} from "@/lib/status-domains"
import { STATUS_QUERY_PAGES, statusQueryPathForSlug } from "@/lib/status-query-pages"
import { TOOL_PROBLEM_PAGES } from "@/lib/tool-problem-pages"
import { TOOL_VARIANT_PAGES } from "@/lib/tools-matrix"
import { TOOL_CATALOGUE } from "@/lib/tools-catalogue"

const BASE_URL = "https://www.plain.tools"
const SITEMAP_CHUNK_SIZE = 5000
const firstWavePriorityPathSet = new Set(FIRST_WAVE_PRIORITY_PATHS)

type SitemapEntry = MetadataRoute.Sitemap[number]

function normalizeCanonicalUrl(url: string) {
  const parsed = new URL(url)
  if (parsed.origin !== BASE_URL) return null

  const pathname =
    parsed.pathname !== "/" ? parsed.pathname.replace(/\/+$/, "") || "/" : "/"

  if (pathname.startsWith("/pdf-tools/")) {
    const isPdfVariantIndex = pathname === "/pdf-tools/variants"
    const isPdfComparisonIndex = pathname === "/pdf-tools/compare"
    const isPdfVariantRoute = /^\/pdf-tools\/[^/]+\/[^/]+$/.test(pathname)
    const isPdfComparisonRoute = /^\/pdf-tools\/compare\/[^/]+$/.test(pathname)
    if (
      !isPdfVariantIndex &&
      !isPdfComparisonIndex &&
      !isPdfVariantRoute &&
      !isPdfComparisonRoute
    ) {
      return null
    }
  }
  if (pathname.startsWith("/file-converters/")) return null

  return `${BASE_URL}${pathname}`
}

function toEntry(
  path: string,
  now: Date,
  changeFrequency: NonNullable<SitemapEntry["changeFrequency"]>,
  priority: number
): SitemapEntry {
  return {
    changeFrequency,
    lastModified: now,
    priority,
    url: path.startsWith("http") ? path : `${BASE_URL}${path}`,
  }
}

function chunk<T>(items: T[], size: number) {
  const chunks: T[][] = []
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size))
  }
  return chunks
}

function buildAllEntries(now: Date) {
  const staticHighPriority = ["/", "/tools", "/learn", "/compare"]
  const staticCorePages = [
    "/blog",
    "/pdf-tools",
    "/pdf-tools/compare",
    "/file-converters",
    "/image-tools",
    "/file-tools",
    "/diagnosis",
    "/verify-claims",
    "/network-tools",
    "/status",
    "/site-status",
    "/status/trending",
    "/what-is-my-ip",
    "/dns-lookup",
    "/ping-test",
    "/faq",
    "/how-it-works",
    "/about",
    "/privacy",
    "/terms",
    "/support",
    "/labs",
    "/roadmap",
    "/changelog",
    "/html-sitemap",
  ]
  const curatedLandingPages = [
    "/compare/smallpdf-alternative",
    "/learn/compress-pdf-without-upload",
    "/check-if-website-is-down",
  ]

  const homepage = toEntry("/", now, "weekly", 1)
  const staticHigh = staticHighPriority
    .filter((path) => path !== "/")
    .map((path) => toEntry(path, now, "weekly", 0.9))
  const staticCore = staticCorePages.map((path) => toEntry(path, now, "monthly", 0.7))
  const curatedLanding = curatedLandingPages.map((path) => toEntry(path, now, "monthly", 0.8))
  const toolPages = TOOL_CATALOGUE.filter((tool) => tool.available).map((tool) =>
    toEntry(`/tools/${tool.slug}`, now, "monthly", 0.9)
  )
  const programmaticPages = getProgrammaticSitemapPaths().map((path) =>
    toEntry(path, now, "monthly", 0.76)
  )
  const pdfIntentPages = PDF_INTENT_PAGES.map((page) =>
    toEntry(pdfIntentPathFor(page.slug), now, "monthly", 0.82)
  )
  const pdfToolVariantIndex = toEntry("/pdf-tools/variants", now, "monthly", 0.8)
  const pdfToolVariantPages = getPdfVariantSitemapPaths().map((path) =>
    toEntry(path, now, "monthly", 0.78)
  )
  const fileConverterPages = getConverterSitemapPaths().map((path) =>
    toEntry(path, now, "daily", 0.8)
  )
  const fileConverterModifierPages = getConverterModifierSitemapPaths().map((path) =>
    toEntry(path, now, "daily", 0.79)
  )
  const comparisonMatrixPages = getCompareMatrixSitemapPaths().map((path) =>
    toEntry(path, now, "monthly", 0.79)
  )
  const professionalWorkflowPages = getProfessionalWorkflowSitemapPaths().map((path) =>
    toEntry(path, now, "monthly", 0.82)
  )
  const pdfComparisonPages = getPdfComparisonSitemapPaths().map((path) =>
    toEntry(path, now, "daily", 0.79)
  )
  const toolProblemPages = TOOL_PROBLEM_PAGES.map((page) =>
    toEntry(`/tools/${page.slug}`, now, "monthly", 0.84)
  )
  const toolVariantPages = TOOL_VARIANT_PAGES.map((page) =>
    toEntry(page.path, now, "monthly", 0.83)
  )
  const dnsDynamicPages = DNS_SITEMAP_DOMAINS.map((domain) =>
    toEntry(`/dns/${encodeURIComponent(domain)}`, now, "monthly", 0.72)
  )
  const ipDynamicPages = IP_SITEMAP_ADDRESSES.map((ip) =>
    toEntry(`/ip/${encodeURIComponent(ip)}`, now, "monthly", 0.65)
  )
  const statusCategoryPages = STATUS_CATEGORIES.map((category) =>
    toEntry(`/status/${category}`, now, "daily", 0.75)
  )
  const statusQueryPages = STATUS_QUERY_PAGES.map((entry) =>
    toEntry(statusQueryPathForSlug(entry.slug), now, "daily", 0.82)
  )
  const outageHistoryPages = OUTAGE_HISTORY_PAGES.map((entry) =>
    toEntry(outageHistoryPathForSlug(entry.slug), now, "daily", 0.8)
  )
  const blogCategoryPages = blogCategories
    .filter((category) => category.slug !== "all")
    .map((category) => toEntry(`/blog/category/${category.slug}`, now, "weekly", 0.6))
  const blogPostPages = blogPosts.map((post) => ({
    changeFrequency: "weekly" as const,
    lastModified: new Date(post.date),
    priority: 0.7,
    url: `${BASE_URL}/blog/${post.slug}`,
  }))
  const staticStatusPages = STATUS_STATIC_DOMAINS.map((site) =>
    toEntry(
      statusPathFor(site),
      now,
      "daily",
      STATUS_HIGH_DEMAND_SITES.includes(site as (typeof STATUS_HIGH_DEMAND_SITES)[number])
        ? 0.88
        : 0.75
    )
  )
  const tranchePages = [
    ...trancheSitemapUrls,
    ...expansionSitemapUrls,
    ...workflowSitemapUrls,
    ...seoMdxSitemapUrls,
  ].map((path) => toEntry(path, now, "monthly", path.startsWith("/compare/") ? 0.75 : 0.8))

  const entries = [
    homepage,
    ...staticHigh,
    ...staticCore,
    ...curatedLanding,
    ...toolPages,
    ...programmaticPages,
    ...pdfIntentPages,
    pdfToolVariantIndex,
    ...pdfToolVariantPages,
    ...fileConverterPages,
    ...fileConverterModifierPages,
    ...comparisonMatrixPages,
    ...professionalWorkflowPages,
    ...pdfComparisonPages,
    ...toolProblemPages,
    ...toolVariantPages,
    ...dnsDynamicPages,
    ...ipDynamicPages,
    ...statusCategoryPages,
    ...statusQueryPages,
    ...outageHistoryPages,
    ...blogCategoryPages,
    ...blogPostPages,
    ...staticStatusPages,
    ...tranchePages,
  ]

  const deduped = new Map<string, SitemapEntry>()
  for (const entry of entries) {
    const canonical = normalizeCanonicalUrl(entry.url)
    if (!canonical) continue
    const canonicalPath = canonical.replace(BASE_URL, "") || "/"
    const boostedPriority = firstWavePriorityPathSet.has(canonicalPath)
      ? Math.max(entry.priority ?? 0.7, 0.95)
      : entry.priority
    deduped.set(canonical, {
      ...entry,
      priority: boostedPriority,
      url: canonical,
    })
  }

  return Array.from(deduped.values())
}

export async function generateSitemaps() {
  const entries = buildAllEntries(new Date())
  return chunk(entries, SITEMAP_CHUNK_SIZE).map((_, id) => ({ id }))
}

export default async function sitemap({
  id,
}: {
  id: number
}): Promise<MetadataRoute.Sitemap> {
  const entries = buildAllEntries(new Date())
  const slices = chunk(entries, SITEMAP_CHUNK_SIZE)
  return slices[id] ?? []
}
