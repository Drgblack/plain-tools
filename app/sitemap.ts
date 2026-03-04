import fs from "node:fs"
import path from "node:path"
import { execFileSync } from "node:child_process"
import type { MetadataRoute } from "next"

import { TOOL_CATALOGUE } from "@/lib/tools-catalogue"

const BASE_URL = "https://plain.tools"
const APP_DIR = path.join(process.cwd(), "app")

const EXCLUDED_SEGMENTS = new Set(["api", "og", "_not-found", "_global-error"])
const EXCLUDED_ROUTES = new Set(["/pro/success", "/sign-in", "/sign-up"])
const MANUAL_COMPARE_ROUTES = [
  "/compare/offline-vs-online-pdf-tools",
  "/compare/plain-vs-adobe-acrobat",
  "/compare/plain-vs-docusign",
  "/compare/plain-vs-ilovepdf",
  "/compare/plain-vs-sejda",
  "/compare/plain-vs-smallpdf",
]
const MANUAL_LEARN_ROUTES = [
  "/learn/why-you-should-never-upload-medical-records-to-pdf-tools",
  "/learn/how-to-verify-a-pdf-tool-doesnt-upload-your-files",
  "/learn/what-is-pdf-metadata-and-why-it-matters",
  "/learn/adobe-acrobat-ai-privacy-concerns-explained",
  "/learn/how-pdf-redaction-really-works",
  "/learn/compress-pdf-without-losing-quality",
  "/learn/how-to-sign-a-pdf-without-uploading-it",
  "/learn/gdpr-and-pdf-tools-what-businesses-need-to-know",
  "/learn/webassembly-pdf-processing-explained",
  "/learn/ocr-pdf-without-cloud",
]
const MANUAL_REQUIRED_ROUTES = ["/pricing", "/verify-claims", "/about", "/privacy", "/terms", "/support"]
const PAGE_FILE_NAMES = ["page.tsx", "page.ts"] as const

const isDynamicSegment = (segment: string) => segment.startsWith("[") && segment.endsWith("]")
const isGroupSegment = (segment: string) => segment.startsWith("(") && segment.endsWith(")")

const pageExists = (directory: string) =>
  fs.existsSync(path.join(directory, "page.tsx")) || fs.existsSync(path.join(directory, "page.ts"))

const findPageFile = (directory: string): string | null => {
  for (const fileName of PAGE_FILE_NAMES) {
    const fullPath = path.join(directory, fileName)
    if (fs.existsSync(fullPath)) return fullPath
  }

  return null
}

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
  if (route.startsWith("/learn")) return 0.8
  if (route.startsWith("/compare")) return 0.8
  if (route.startsWith("/blog")) return 0.7
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

const lastModifiedCache = new Map<string, Date>()

const resolveRouteSourceFile = (route: string): string | null => {
  if (route === "/") {
    return findPageFile(APP_DIR)
  }

  if (route.startsWith("/tools/") && route !== "/tools") {
    const slug = route.replace("/tools/", "")
    const toolPageFile = findPageFile(path.join(APP_DIR, "tools", slug))
    if (toolPageFile) return toolPageFile
    return findPageFile(path.join(APP_DIR, "tools", "[slug]"))
  }

  const segments = route.replace(/^\//, "").split("/").filter(Boolean)
  const routeFile = findPageFile(path.join(APP_DIR, ...segments))
  if (routeFile) return routeFile

  return findPageFile(APP_DIR)
}

const getRouteLastModified = (route: string): Date => {
  const cached = lastModifiedCache.get(route)
  if (cached) return cached

  const routeFile = resolveRouteSourceFile(route)
  const fallbackDate = routeFile && fs.existsSync(routeFile)
    ? fs.statSync(routeFile).mtime
    : new Date()

  if (!routeFile) {
    lastModifiedCache.set(route, fallbackDate)
    return fallbackDate
  }

  try {
    const relativePath = path.relative(process.cwd(), routeFile)
    const gitLastModified = execFileSync(
      "git",
      ["log", "-1", "--format=%cI", "--", relativePath],
      { cwd: process.cwd(), encoding: "utf8" }
    ).trim()

    const parsed = new Date(gitLastModified)
    if (!Number.isNaN(parsed.getTime())) {
      lastModifiedCache.set(route, parsed)
      return parsed
    }
  } catch {
    // Ignore environments without git history and use file metadata fallback.
  }

  lastModifiedCache.set(route, fallbackDate)
  return fallbackDate
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = getStaticRoutes(APP_DIR).filter(
    (route) => !route.startsWith("/tools/") || route === "/tools"
  )
  const availableToolRoutes = TOOL_CATALOGUE.filter((tool) => tool.available).map(
    (tool) => `/tools/${tool.slug}`
  )

  const routes = Array.from(
    new Set([
      ...staticRoutes,
      ...availableToolRoutes,
      ...MANUAL_COMPARE_ROUTES,
      ...MANUAL_LEARN_ROUTES,
      ...MANUAL_REQUIRED_ROUTES,
    ])
  )
    .filter((route) => !EXCLUDED_ROUTES.has(route))
    .filter((route) => !route.startsWith("/comparisons"))
    .sort()

  return routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: getRouteLastModified(route),
    changeFrequency: scoreFrequency(route),
    priority: scorePriority(route),
  }))
}
