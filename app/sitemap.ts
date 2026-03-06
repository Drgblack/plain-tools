import { MetadataRoute } from "next"

import { seoMdxSitemapUrls } from "@/lib/seo/mdx-page-registry"
import { trancheSitemapUrls } from "@/lib/seo/tranche1-content"
import { workflowSitemapUrls } from "@/lib/seo/workflows-content"
import { categories as blogCategories, posts as blogPosts } from "@/lib/blog-data"
import { TOOL_CATALOGUE } from "@/lib/tools-catalogue"

const BASE_URL = "https://plain.tools"
const now = new Date()

const staticHighPriority = [
  "/",
  "/tools",
  "/learn",
  "/compare",
]

const staticCorePages = [
  "/blog",
  "/verify-claims",
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

  const blogIndex = {
    url: `${BASE_URL}/blog`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }

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

  const entries = [
    homepage,
    ...staticHigh,
    ...staticCore,
    blogIndex,
    ...blogCategoryPages,
    ...blogPostPages,
    ...toolPages,
    ...tranchePages,
  ]

  const deduped = new Map<string, MetadataRoute.Sitemap[number]>()
  for (const entry of entries) {
    deduped.set(entry.url, entry)
  }

  return Array.from(deduped.values())
}
