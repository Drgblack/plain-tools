import { MetadataRoute } from "next"

import { seoMdxSitemapUrls } from "@/lib/seo/mdx-page-registry"
import { expansionSitemapUrls } from "@/lib/seo/expansion-content"
import { trancheSitemapUrls } from "@/lib/seo/tranche1-content"
import { workflowSitemapUrls } from "@/lib/seo/workflows-content"
import { categories as blogCategories, posts as blogPosts } from "@/lib/blog-data"
import { TOOL_CATALOGUE } from "@/lib/tools-catalogue"
import { OUTAGE_HISTORY_PAGES, outageHistoryPathForSlug } from "@/lib/outage-history-pages"
import {
  STATUS_CATEGORIES,
  STATUS_HIGH_DEMAND_SITES,
  STATUS_STATIC_DOMAINS,
} from "@/lib/status-domains"
import { STATUS_QUERY_PAGES, statusQueryPathForSlug } from "@/lib/status-query-pages"
import { statusPathFor } from "@/lib/site-status"
import { FIRST_WAVE_PRIORITY_PATHS } from "@/lib/seo/first-wave-pages"
import { PDF_INTENT_PAGES, pdfIntentPathFor } from "@/lib/pdf-intent-pages"
import { TOOL_PROBLEM_PAGES } from "@/lib/tool-problem-pages"

const BASE_URL = "https://plain.tools"
const now = new Date()
const firstWavePriorityPathSet = new Set(FIRST_WAVE_PRIORITY_PATHS)

/**
 * Sitemap policy:
 * - Include canonical root URLs only.
 * - Exclude legacy mount aliases (/pdf-tools/*) and converter alias slugs.
 * - Include curated status routes only (prevents arbitrary-domain sitemap pollution).
 */
function normalizeCanonicalUrl(url: string) {
  const parsed = new URL(url)
  if (parsed.origin !== BASE_URL) return null

  const pathname =
    parsed.pathname !== "/" ? parsed.pathname.replace(/\/+$/, "") || "/" : "/"

  if (pathname.startsWith("/pdf-tools/")) return null
  if (pathname.startsWith("/file-converters/")) return null

  return `${BASE_URL}${pathname}`
}

const staticHighPriority = [
  "/",
  "/tools",
  "/learn",
  "/compare",
]

const staticCorePages = [
  "/blog",
  "/pricing",
  "/pdf-tools",
  "/file-converters",
  "/image-tools",
  "/file-tools",
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

const pdfIntentPages = PDF_INTENT_PAGES.map((page) => ({
  url: `${BASE_URL}${pdfIntentPathFor(page.slug)}`,
  lastModified: now,
  changeFrequency: "monthly" as const,
  priority: 0.82,
}))

const toolProblemPages = TOOL_PROBLEM_PAGES.map((page) => ({
  url: `${BASE_URL}/tools/${page.slug}`,
  lastModified: now,
  changeFrequency: "monthly" as const,
  priority: 0.84,
}))

const statusCategoryPages = STATUS_CATEGORIES.map((category) => ({
  url: `${BASE_URL}/status/${category}`,
  lastModified: now,
  changeFrequency: "daily" as const,
  priority: 0.75,
}))

const statusQueryPages = STATUS_QUERY_PAGES.map((entry) => ({
  url: `${BASE_URL}${statusQueryPathForSlug(entry.slug)}`,
  lastModified: now,
  changeFrequency: "daily" as const,
  priority: 0.82,
}))

const outageHistoryPages = OUTAGE_HISTORY_PAGES.map((entry) => ({
  url: `${BASE_URL}${outageHistoryPathForSlug(entry.slug)}`,
  lastModified: now,
  changeFrequency: "daily" as const,
  priority: 0.8,
}))

export default function sitemap(): MetadataRoute.Sitemap {
  const homepage = {
    url: BASE_URL,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 1,
  }

  const staticHigh = staticHighPriority
    .filter((path) => path !== "/")
    .map((path) => ({
      url: `${BASE_URL}${path}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    }))

  const staticCore = staticCorePages.map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }))

  const curatedLanding = curatedLandingPages.map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }))

  const toolPages = TOOL_CATALOGUE.filter((tool) => tool.available).map((tool) => ({
    url: `${BASE_URL}/tools/${tool.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }))

  const tranchePages = [
    ...trancheSitemapUrls,
    ...expansionSitemapUrls,
    ...workflowSitemapUrls,
    ...seoMdxSitemapUrls,
  ].map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: path.startsWith("/compare/") ? 0.75 : 0.8,
  }))

  const blogCategoryPages = blogCategories
    .filter((category) => category.slug !== "all")
    .map((category) => ({
      url: `${BASE_URL}/blog/category/${category.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }))

  const blogPostPages = blogPosts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }))

  const staticStatusPages = STATUS_STATIC_DOMAINS.map((site) => ({
    url: `${BASE_URL}${statusPathFor(site)}`,
    lastModified: now,
    changeFrequency: "daily" as const,
    priority: STATUS_HIGH_DEMAND_SITES.includes(site as (typeof STATUS_HIGH_DEMAND_SITES)[number])
      ? 0.88
      : 0.75,
  }))

  const entries = [
    homepage,
    ...staticHigh,
    ...staticCore,
    ...curatedLanding,
    ...pdfIntentPages,
    ...toolProblemPages,
    ...statusCategoryPages,
    ...statusQueryPages,
    ...outageHistoryPages,
    ...blogCategoryPages,
    ...blogPostPages,
    ...toolPages,
    ...staticStatusPages,
    ...tranchePages,
  ]

  const deduped = new Map<string, MetadataRoute.Sitemap[number]>()
  for (const entry of entries) {
    const canonical = normalizeCanonicalUrl(entry.url)
    if (!canonical) continue
    const canonicalPath = canonical.replace(BASE_URL, "") || "/"
    const boostedPriority = firstWavePriorityPathSet.has(canonicalPath)
      ? Math.max(entry.priority ?? 0.7, 0.95)
      : entry.priority
    deduped.set(canonical, {
      ...entry,
      url: canonical,
      priority: boostedPriority,
    })
  }

  return Array.from(deduped.values())
}
