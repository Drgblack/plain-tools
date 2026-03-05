import { MetadataRoute } from "next"

import { converterSitemapUrls } from "@/lib/seo/file-converters-content"
import { trancheSitemapUrls } from "@/lib/seo/tranche1-content"
import { workflowSitemapUrls } from "@/lib/seo/workflows-content"
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

  const tranchePages = [...trancheSitemapUrls, ...workflowSitemapUrls, ...converterSitemapUrls].map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: path.startsWith("/compare/") ? 0.75 : 0.8,
  }))

  return [homepage, ...staticHigh, ...staticCore, ...toolPages, ...tranchePages]
}
