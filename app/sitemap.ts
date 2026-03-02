import type { MetadataRoute } from "next"

import { TOOL_CATALOGUE } from "@/lib/tools-catalogue"

const BASE_URL = "https://plain.tools"

const STATIC_ROUTES = [
  "/",
  "/about",
  "/blog",
  "/compare",
  "/comparisons",
  "/extension",
  "/faq",
  "/how-it-works",
  "/labs",
  "/learn",
  "/offline-pdf-tools",
  "/privacy",
  "/support",
  "/terms",
  "/tools",
  "/verify",
  "/verify-claims",
  "/tools/ai-pdf-assistant",
]

const TOOL_ROUTE_OVERRIDES = [
  "/tools/merge-pdf",
  "/tools/split-pdf",
  "/tools/compress-pdf",
  "/tools/reorder-pdf",
  "/tools/extract-pdf",
]

const scorePriority = (path: string) => {
  if (path === "/") return 1
  if (path.startsWith("/tools/")) return 0.9
  if (path.startsWith("/blog") || path.startsWith("/learn")) return 0.8
  if (path.startsWith("/compare") || path.startsWith("/comparisons")) return 0.7
  if (path === "/tools") return 0.9
  return 0.5
}

const scoreFrequency = (path: string): MetadataRoute.Sitemap[number]["changeFrequency"] => {
  if (path === "/") return "weekly"
  if (path.startsWith("/tools/")) return "monthly"
  if (path.startsWith("/blog")) return "weekly"
  if (path.startsWith("/learn")) return "monthly"
  return "monthly"
}

export default function sitemap(): MetadataRoute.Sitemap {
  const today = new Date()

  const availableToolRoutes = TOOL_CATALOGUE.filter((tool) => tool.available).map(
    (tool) => `/tools/${tool.slug}`
  )

  const uniqueRoutes = Array.from(
    new Set([...STATIC_ROUTES, ...TOOL_ROUTE_OVERRIDES, ...availableToolRoutes])
  )

  return uniqueRoutes.map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: today,
    changeFrequency: scoreFrequency(path),
    priority: scorePriority(path),
  }))
}

