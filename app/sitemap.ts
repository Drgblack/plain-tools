import fs from "node:fs"
import path from "node:path"
import type { MetadataRoute } from "next"

import { TOOL_CATALOGUE } from "@/lib/tools-catalogue"

const BASE_URL = "https://plain.tools"
const APP_DIR = path.join(process.cwd(), "app")

const EXCLUDED_SEGMENTS = new Set(["api", "og", "_not-found", "_global-error"])

const isDynamicSegment = (segment: string) => segment.startsWith("[") && segment.endsWith("]")
const isGroupSegment = (segment: string) => segment.startsWith("(") && segment.endsWith(")")

const pageExists = (directory: string) =>
  fs.existsSync(path.join(directory, "page.tsx")) || fs.existsSync(path.join(directory, "page.ts"))

const getStaticRoutes = (directory: string, segments: string[] = []): string[] => {
  const routes: string[] = []

  if (pageExists(directory)) {
    const route = `/${segments.join("/")}`.replace(/\/+/g, "/")
    routes.push(route === "/" ? "/" : route.replace(/\/$/, ""))
  }

  const entries = fs.readdirSync(directory, { withFileTypes: true })

  for (const entry of entries) {
    if (!entry.isDirectory()) continue

    const segment = entry.name
    const shouldSkip =
      EXCLUDED_SEGMENTS.has(segment) ||
      segment.startsWith("_") ||
      segment.startsWith("@") ||
      isDynamicSegment(segment)

    if (shouldSkip) continue

    const nextSegments = isGroupSegment(segment) ? segments : [...segments, segment]
    routes.push(...getStaticRoutes(path.join(directory, segment), nextSegments))
  }

  return routes
}

const scorePriority = (route: string) => {
  if (route === "/") return 1
  if (route.startsWith("/tools/")) return 0.9
  if (route.startsWith("/blog") || route.startsWith("/learn")) return 0.8
  if (route.startsWith("/compare") || route.startsWith("/comparisons")) return 0.7
  if (route === "/tools") return 0.9
  return 0.5
}

const scoreFrequency = (route: string): MetadataRoute.Sitemap[number]["changeFrequency"] => {
  if (route === "/") return "weekly"
  if (route.startsWith("/tools/")) return "monthly"
  if (route.startsWith("/blog")) return "weekly"
  if (route.startsWith("/learn")) return "monthly"
  return "monthly"
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const staticRoutes = getStaticRoutes(APP_DIR)
  const availableToolRoutes = TOOL_CATALOGUE.filter((tool) => tool.available).map(
    (tool) => `/tools/${tool.slug}`
  )

  const routes = Array.from(new Set([...staticRoutes, ...availableToolRoutes])).sort()

  return routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: now,
    changeFrequency: scoreFrequency(route),
    priority: scorePriority(route),
  }))
}
