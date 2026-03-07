import { MetadataRoute } from "next"

import { seoMdxSitemapUrls } from "@/lib/seo/mdx-page-registry"
import { trancheSitemapUrls } from "@/lib/seo/tranche1-content"
import { workflowSitemapUrls } from "@/lib/seo/workflows-content"
import { categories as blogCategories, posts as blogPosts } from "@/lib/blog-data"
import { TOOL_CATALOGUE } from "@/lib/tools-catalogue"
import { STATUS_POPULAR_SITES } from "@/lib/site-status"

const BASE_URL = "https://plain.tools"
const now = new Date()

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
  "/file-converters",
  "/file-tools",
  "/verify-claims",
  "/network-tools",
  "/site-status",
  "/what-is-my-ip",
  "/dns-lookup",
  "/ping-test",
  "/faq",
  "/how-it-works",
  "/about",
  "/privacy",
  "/terms",
  "/support",
  "/pricing",
  "/labs",
  "/roadmap",
  "/changelog",
  "/html-sitemap",
]

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

  const toolPages = TOOL_CATALOGUE.filter((tool) => tool.available).map((tool) => ({
    url: `${BASE_URL}/tools/${tool.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }))

  const tranchePages = [
    ...trancheSitemapUrls,
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

  // Curated canonical status URLs only - avoids sitemap pollution from arbitrary user-entered domains.
  const curatedStatusPages = STATUS_POPULAR_SITES.map((site) => ({
    url: `${BASE_URL}/status/${encodeURIComponent(site)}`,
    lastModified: now,
    changeFrequency: "daily" as const,
    priority: 0.75,
  }))

  const entries = [
    homepage,
    ...staticHigh,
    ...staticCore,
    ...blogCategoryPages,
    ...blogPostPages,
    ...toolPages,
    ...curatedStatusPages,
    ...tranchePages,
  ]

  const deduped = new Map<string, MetadataRoute.Sitemap[number]>()
  for (const entry of entries) {
    const canonical = normalizeCanonicalUrl(entry.url)
    if (!canonical) continue
    deduped.set(canonical, {
      ...entry,
      url: canonical,
    })
  }

  return Array.from(deduped.values())
}
