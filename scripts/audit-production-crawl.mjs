import { mkdir, writeFile } from "node:fs/promises"
import path from "node:path"

const BASE_URL = process.env.PROD_AUDIT_BASE_URL ?? "https://www.plain.tools"
const MAX_PAGES = Number.parseInt(process.env.PROD_AUDIT_MAX_PAGES ?? "120", 10)
const REPORT_DIR = path.join(process.cwd(), "generated", "seo")
const REPORT_PATH = path.join(REPORT_DIR, "production-crawl-report.json")

const SEEDS = [
  "/",
  "/tools",
  "/topics",
  "/learn",
  "/guides",
  "/status",
  "/site-status",
  "/network-tools",
  "/file-converters",
  "/calculators",
  "/compare",
  "/editorial-policy",
  "/methodology/status-checks",
]

const CRITICAL_PAGES = [
  "/tools/merge-pdf",
  "/tools/split-pdf",
  "/tools/compress-pdf",
  "/tools/pdf-to-word",
  "/tools/word-to-pdf",
  "/status/chatgpt.com",
  "/dns-lookup",
  "/ping-test",
  "/calculators",
  "/file-converters",
  "/topics",
  "/editorial-policy",
  "/methodology/status-checks",
]

const EXPECTED_NOINDEX = ["/faq", "/html-sitemap", "/labs"]
const EXPECTED_SITEMAP_EXCLUSIONS = [
  ...EXPECTED_NOINDEX,
  "/pdf-tools",
  "/pdf-tools/compare",
  "/pdf-tools/variants",
]

function normalizePath(input) {
  const url = new URL(input, BASE_URL)
  if (url.origin !== new URL(BASE_URL).origin) return null
  return url.pathname.replace(/\/+$/, "") || "/"
}

function extractLinks(html) {
  const matches = html.matchAll(/href=["']([^"'#]+)["']/gi)
  const links = new Set()

  for (const match of matches) {
    const normalized = normalizePath(match[1])
    if (normalized) links.add(normalized)
  }

  return [...links]
}

function isCrawlableHtmlPath(targetPath) {
  if (!targetPath) return false
  if (targetPath.startsWith("/_next/")) return false
  if (targetPath.startsWith("/api/")) return false
  if (/\.(?:css|js|json|txt|xml|ico|png|jpg|jpeg|svg|webmanifest|woff2?)$/i.test(targetPath)) {
    return false
  }
  return true
}

function extractCanonical(html) {
  const match = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i)
  return match ? normalizePath(match[1]) : null
}

function extractRobots(html) {
  const match = html.match(/<meta[^>]+name=["']robots["'][^>]+content=["']([^"']+)["']/i)
  return match ? match[1].toLowerCase() : null
}

function shouldSelfCanonical(pathname) {
  return !EXPECTED_NOINDEX.includes(pathname)
}

async function fetchText(targetPath) {
  const response = await fetch(new URL(targetPath, BASE_URL), {
    redirect: "follow",
    headers: {
      "user-agent": "plain-tools-production-crawl-audit/1.0",
    },
  })

  return {
    finalPath: normalizePath(response.url),
    html: await response.text(),
    status: response.status,
  }
}

async function fetchSitemapPaths() {
  const response = await fetch(new URL("/sitemap.xml", BASE_URL), {
    headers: {
      "user-agent": "plain-tools-production-crawl-audit/1.0",
    },
  })

  const xml = await response.text()
  const locMatches = [...xml.matchAll(/<loc>(.*?)<\/loc>/gi)].map((match) => match[1])
  return locMatches.map((loc) => normalizePath(loc)).filter(Boolean)
}

function serialiseVisited(visited) {
  return Object.fromEntries(
    [...visited.entries()].map(([targetPath, record]) => [
      targetPath,
      {
        canonical: record.canonical,
        depth: record.depth,
        finalPath: record.finalPath,
        robots: record.robots,
        status: record.status,
        linkCount: record.links.length,
      },
    ])
  )
}

const visited = new Map()
const queue = SEEDS.map((targetPath) => ({ depth: 0, path: targetPath }))
const errors = []
const warnings = []

while (queue.length > 0 && visited.size < MAX_PAGES) {
  const current = queue.shift()
  if (!current || visited.has(current.path)) continue

  try {
    const result = await fetchText(current.path)
    const links = extractLinks(result.html).filter(isCrawlableHtmlPath)

    visited.set(current.path, {
      canonical: extractCanonical(result.html),
      depth: current.depth,
      finalPath: result.finalPath,
      links,
      robots: extractRobots(result.html),
      status: result.status,
    })

    for (const link of links) {
      if (!visited.has(link) && !queue.some((item) => item.path === link)) {
        queue.push({ depth: current.depth + 1, path: link })
      }
    }
  } catch (error) {
    errors.push(`Failed to fetch ${current.path}: ${String(error)}`)
  }
}

for (const [targetPath, record] of visited.entries()) {
  if (record.status >= 400) {
    errors.push(`${targetPath} returned HTTP ${record.status}`)
  }

  if (!record.canonical) {
    if (CRITICAL_PAGES.includes(targetPath)) {
      errors.push(`${targetPath} is missing a canonical tag in rendered HTML`)
    } else {
      warnings.push(`${targetPath} is missing a canonical tag in rendered HTML`)
    }
  }

  if (record.finalPath && record.finalPath !== targetPath) {
    warnings.push(`${targetPath} redirected to ${record.finalPath}`)
  }

  if (
    CRITICAL_PAGES.includes(targetPath) &&
    record.finalPath === targetPath &&
    shouldSelfCanonical(targetPath) &&
    record.canonical &&
    record.canonical !== targetPath
  ) {
    errors.push(`${targetPath} renders canonical ${record.canonical} instead of self-canonicalising`)
  }

  if (
    CRITICAL_PAGES.includes(targetPath) &&
    record.finalPath === targetPath &&
    record.robots?.includes("noindex")
  ) {
    errors.push(`${targetPath} is a critical page but rendered robots were "${record.robots}"`)
  }
}

const criticalDepths = {}
for (const criticalPath of CRITICAL_PAGES) {
  const record = visited.get(criticalPath)
  criticalDepths[criticalPath] = record?.depth ?? null

  if (!record) {
    warnings.push(`${criticalPath} was not reached during the production crawl`)
    continue
  }

  if (record.depth > 3) {
    warnings.push(`${criticalPath} was found at depth ${record.depth}`)
  }
}

const noindexChecks = {}
for (const noindexPath of EXPECTED_NOINDEX) {
  try {
    const record =
      visited.get(noindexPath) ??
      (await (async () => {
        const result = await fetchText(noindexPath)
        const parsed = {
          canonical: extractCanonical(result.html),
          depth: Infinity,
          finalPath: result.finalPath,
          links: extractLinks(result.html),
          robots: extractRobots(result.html),
          status: result.status,
        }
        visited.set(noindexPath, parsed)
        return parsed
      })())

    noindexChecks[noindexPath] = {
      robots: record.robots,
      status: record.status,
    }

    if (!record.robots || !record.robots.includes("noindex")) {
      errors.push(
        `${noindexPath} is expected to be noindex but rendered robots were "${record.robots ?? "missing"}"`
      )
    }
  } catch (error) {
    errors.push(`Failed to verify noindex path ${noindexPath}: ${String(error)}`)
  }
}

let sitemapChecks = { excludedPathsPresent: [], missingCriticalPaths: [] }
try {
  const sitemapPaths = await fetchSitemapPaths()
  sitemapChecks = {
    excludedPathsPresent: EXPECTED_SITEMAP_EXCLUSIONS.filter((targetPath) =>
      sitemapPaths.includes(targetPath)
    ),
    missingCriticalPaths: CRITICAL_PAGES.filter((targetPath) => !sitemapPaths.includes(targetPath)),
  }

  for (const targetPath of sitemapChecks.excludedPathsPresent) {
    errors.push(`${targetPath} appears in sitemap.xml but should be excluded`)
  }

  for (const targetPath of sitemapChecks.missingCriticalPaths) {
    errors.push(`${targetPath} is a critical page but was missing from sitemap.xml`)
  }
} catch (error) {
  warnings.push(`Could not fetch sitemap.xml during production crawl audit: ${String(error)}`)
}

const report = {
  auditedAt: new Date().toISOString(),
  baseUrl: BASE_URL,
  maxPages: MAX_PAGES,
  visitedCount: visited.size,
  seeds: SEEDS,
  criticalPages: CRITICAL_PAGES,
  expectedNoindex: EXPECTED_NOINDEX,
  criticalDepths,
  noindexChecks,
  sitemapChecks,
  errors,
  warnings,
  visited: serialiseVisited(visited),
}

await mkdir(REPORT_DIR, { recursive: true })
await writeFile(REPORT_PATH, JSON.stringify(report, null, 2))

if (errors.length > 0) {
  console.error(`Production crawl audit failed. Report written to ${REPORT_PATH}`)
  for (const error of errors) console.error(`- ${error}`)
  for (const warning of warnings) console.error(`- Warning: ${warning}`)
  process.exit(1)
}

console.log(
  `Production crawl audit passed for ${visited.size} pages from ${BASE_URL}. Report written to ${REPORT_PATH}`
)
for (const warning of warnings) {
  console.warn(`Warning: ${warning}`)
}
