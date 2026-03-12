#!/usr/bin/env node

import { execSync } from "node:child_process"
import { mkdir, readFile, rm, writeFile } from "node:fs/promises"
import path from "node:path"

const REPORT_DIR = path.join(process.cwd(), "generated", "seo")
const REPORT_PATH = path.join(REPORT_DIR, "indexing-hygiene-report.json")
const PAYLOAD_PATH = path.join(process.cwd(), ".tmp-indexing-hygiene-payload.json")
const BASE_URL = "https://www.plain.tools"

const EXACT_REDIRECT_PATHS = [
  "/compress-pdf",
  "/pdf-merge",
  "/pdf-to-word",
  "/pricing",
  "/sitemap",
  "/verify",
  "/tools/pdf-to-png",
  "/tools/png-to-pdf",
  "/pdf-tools",
  "/pdf-tools/compare",
  "/pdf-tools/sitemap.xml",
  "/pdf-tools/robots.txt",
  "/pdf-tools/verify",
  "/pdf-tools/verify-claims",
]

const EXCLUDED_PREFIXES = ["/pdf-tools/", "/status/region/", "/status/access/"]
const REQUIRED_PRIORITY_PATHS = [
  "/",
  "/tools",
  "/tools/merge-pdf",
  "/tools/split-pdf",
  "/tools/compress-pdf",
  "/tools/pdf-to-word",
  "/tools/word-to-pdf",
  "/file-converters",
  "/learn",
  "/compare",
  "/status",
  "/status/chatgpt.com",
  "/site-status",
  "/topics",
  "/guides",
  "/calculators",
]

function runTsx(code) {
  return execSync(`npx tsx -e ${JSON.stringify(code)}`, {
    cwd: process.cwd(),
    encoding: "utf8",
    maxBuffer: 12 * 1024 * 1024,
    shell: true,
    stdio: ["ignore", "pipe", "inherit"],
  }).trim()
}

function normalizePath(url) {
  const parsed = new URL(url, BASE_URL)
  if (parsed.origin !== BASE_URL) return null
  return parsed.pathname.replace(/\/+$/, "") || "/"
}

function matchesDisallow(pathname, disallow) {
  if (!disallow) return false
  if (disallow === "/") return true
  return pathname === disallow || pathname.startsWith(disallow.endsWith("/") ? disallow : `${disallow}/`)
}

runTsx(
  `import fs from "node:fs"; import robots from "./app/robots.ts"; import { buildSitemapEntries } from "./lib/sitemap-data.ts"; import { NOINDEX_EXACT_PATHS } from "./lib/seo/indexation-policy.ts"; const entries = buildSitemapEntries(new Date()).map((entry) => entry.url); const robotsConfig = robots(); const noindexPaths = Array.from(NOINDEX_EXACT_PATHS); fs.writeFileSync(${JSON.stringify(PAYLOAD_PATH)}, JSON.stringify({ entries, noindexPaths, robotsConfig }));`
)

const payload = JSON.parse(await readFile(PAYLOAD_PATH, "utf8"))
await rm(PAYLOAD_PATH, { force: true })

const sitemapPaths = payload.entries.map((entry) => normalizePath(entry)).filter(Boolean)

const disallowRules = (payload.robotsConfig.rules ?? [])
  .filter((rule) => rule.userAgent === "*" || rule.userAgent === undefined)
  .flatMap((rule) => rule.disallow ?? [])

const duplicatePaths = sitemapPaths.filter((path, index) => sitemapPaths.indexOf(path) !== index)
const blockedInRobots = sitemapPaths.filter((path) =>
  disallowRules.some((rule) => matchesDisallow(path, rule))
)
const noindexInSitemap = sitemapPaths.filter((path) => payload.noindexPaths.includes(path))
const redirectPathsInSitemap = sitemapPaths.filter((path) => EXACT_REDIRECT_PATHS.includes(path))
const excludedPrefixesInSitemap = sitemapPaths.filter((path) =>
  EXCLUDED_PREFIXES.some((prefix) => path.startsWith(prefix))
)
const missingRequiredPaths = REQUIRED_PRIORITY_PATHS.filter((path) => !sitemapPaths.includes(path))

const errors = []

if (duplicatePaths.length > 0) {
  errors.push(`Duplicate sitemap paths found: ${duplicatePaths.slice(0, 10).join(", ")}`)
}

if (blockedInRobots.length > 0) {
  errors.push(`Robots-blocked URLs found in sitemap: ${blockedInRobots.slice(0, 10).join(", ")}`)
}

if (noindexInSitemap.length > 0) {
  errors.push(`Noindex URLs found in sitemap: ${noindexInSitemap.slice(0, 10).join(", ")}`)
}

if (redirectPathsInSitemap.length > 0) {
  errors.push(`Redirecting URLs found in sitemap: ${redirectPathsInSitemap.slice(0, 10).join(", ")}`)
}

if (excludedPrefixesInSitemap.length > 0) {
  errors.push(
    `Excluded low-priority or legacy prefixes found in sitemap: ${excludedPrefixesInSitemap.slice(0, 10).join(", ")}`
  )
}

if (missingRequiredPaths.length > 0) {
  errors.push(`Critical canonical pages missing from sitemap: ${missingRequiredPaths.join(", ")}`)
}

const report = {
  auditedAt: new Date().toISOString(),
  baseUrl: BASE_URL,
  counts: {
    blockedInRobots: blockedInRobots.length,
    duplicates: duplicatePaths.length,
    missingRequiredPaths: missingRequiredPaths.length,
    noindexInSitemap: noindexInSitemap.length,
    redirectPathsInSitemap: redirectPathsInSitemap.length,
    sitemapPaths: sitemapPaths.length,
  },
  disallowRules,
  blockedInRobots,
  duplicatePaths,
  excludedPrefixesInSitemap,
  missingRequiredPaths,
  noindexInSitemap,
  redirectPathsInSitemap,
  errors,
}

await mkdir(REPORT_DIR, { recursive: true })
await writeFile(REPORT_PATH, JSON.stringify(report, null, 2))

if (errors.length > 0) {
  console.error(`Indexing hygiene audit failed. Report written to ${REPORT_PATH}`)
  for (const error of errors) {
    console.error(`- ${error}`)
  }
  process.exit(1)
}

console.log(`Indexing hygiene audit passed. Report written to ${REPORT_PATH}`)
