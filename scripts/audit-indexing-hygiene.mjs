#!/usr/bin/env node

import { execSync } from "node:child_process"
import { mkdir, readFile, rm, writeFile } from "node:fs/promises"
import path from "node:path"

const REPORT_DIR = path.join(process.cwd(), "generated", "seo")
const REPORT_PATH = path.join(REPORT_DIR, "indexing-hygiene-report.json")
const PAYLOAD_PATH = path.join(process.cwd(), ".tmp-indexing-hygiene-payload.json")
const BASE_URL = "https://plain.tools"

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
const FORBIDDEN_DISALLOW_RULES = [
  "/pdf-tools",
  "/pdf-tools/",
  "/file-converters/",
  "/status/access/",
  "/status/region/",
  "/status/trending/",
  "/convert/open/",
]
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
    maxBuffer: 16 * 1024 * 1024,
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
  if (!disallow.includes("*")) {
    if (disallow === "/") return true
    return pathname === disallow || pathname.startsWith(disallow.endsWith("/") ? disallow : `${disallow}/`)
  }

  const pattern = new RegExp(
    `^${disallow
      .replace(/[.+?^${}()|[\]\\]/g, "\\$&")
      .replaceAll("*", ".*")}$`
  )

  return pattern.test(pathname)
}

function getFamilyKey(pathname) {
  if (pathname.startsWith("/calculators/")) return "/calculators/*"
  if (pathname.startsWith("/convert/")) return "/convert/*"
  if (pathname.startsWith("/guides/")) return "/guides/*"
  if (pathname.startsWith("/status/")) return "/status/*"
  if (pathname.startsWith("/tools/")) return "/tools/*"
  if (pathname.startsWith("/programmatic/")) return "/programmatic/*"
  if (pathname.startsWith("/compare/")) return "/compare/*"
  if (pathname.startsWith("/learn/")) return "/learn/*"
  if (pathname.startsWith("/blog/")) return "/blog/*"
  if (pathname.startsWith("/network/")) return "/network/*"
  return "other"
}

function countByFamily(paths) {
  const buckets = new Map()

  for (const pathname of paths) {
    const key = getFamilyKey(pathname)
    buckets.set(key, (buckets.get(key) ?? 0) + 1)
  }

  return Object.fromEntries([...buckets.entries()].sort((a, b) => b[1] - a[1]))
}

runTsx(
  `import fs from "node:fs"; import robots from "./app/robots.ts"; import { buildSitemapEntries } from "./lib/sitemap-data.ts"; import { EXCLUDED_URL_PATTERNS, NOINDEX_EXACT_PATHS, NOINDEX_URL_PATTERNS, SEO_INDEXATION_LIMITS, getIndexationPolicy } from "./lib/seo/indexation-policy.ts"; const entries = buildSitemapEntries(new Date()).map((entry) => entry.url); const robotsConfig = robots(); const noindexPaths = Array.from(NOINDEX_EXACT_PATHS); const nonIndexableEntries = entries.map((entry) => new URL(entry).pathname).filter((path) => Boolean(getIndexationPolicy(path))); fs.writeFileSync(${JSON.stringify(PAYLOAD_PATH)}, JSON.stringify({ entries, excludedPatterns: EXCLUDED_URL_PATTERNS, noindexPaths, noindexedPatterns: NOINDEX_URL_PATTERNS, nonIndexableEntries, robotsConfig, seoIndexationLimits: SEO_INDEXATION_LIMITS }));`
)

const payload = JSON.parse(await readFile(PAYLOAD_PATH, "utf8"))
await rm(PAYLOAD_PATH, { force: true })

const sitemapPaths = payload.entries.map((entry) => normalizePath(entry)).filter(Boolean)

const disallowRules = (payload.robotsConfig.rules ?? [])
  .filter((rule) => rule.userAgent === "*" || rule.userAgent === undefined)
  .flatMap((rule) => rule.disallow ?? [])

const duplicatePaths = sitemapPaths.filter((entry, index) => sitemapPaths.indexOf(entry) !== index)
const blockedInRobots = sitemapPaths.filter((entry) =>
  disallowRules.some((rule) => matchesDisallow(entry, rule))
)
const forbiddenDisallowRulesPresent = disallowRules.filter((rule) =>
  FORBIDDEN_DISALLOW_RULES.includes(rule)
)
const noindexInSitemap = payload.nonIndexableEntries
const redirectPathsInSitemap = sitemapPaths.filter((entry) => EXACT_REDIRECT_PATHS.includes(entry))
const excludedPrefixesInSitemap = sitemapPaths.filter((entry) =>
  EXCLUDED_PREFIXES.some((prefix) => entry.startsWith(prefix))
)
const missingRequiredPaths = REQUIRED_PRIORITY_PATHS.filter((entry) => !sitemapPaths.includes(entry))
const familyCounts = countByFamily(sitemapPaths)

const errors = []

if (duplicatePaths.length > 0) {
  errors.push(`Duplicate sitemap paths found: ${duplicatePaths.slice(0, 10).join(", ")}`)
}

if (blockedInRobots.length > 0) {
  errors.push(`Robots-blocked URLs found in sitemap: ${blockedInRobots.slice(0, 10).join(", ")}`)
}

if (forbiddenDisallowRulesPresent.length > 0) {
  errors.push(
    `Robots.txt is blocking canonical or redirect-aware public families: ${forbiddenDisallowRulesPresent.join(", ")}`
  )
}

if (noindexInSitemap.length > 0) {
  errors.push(`Noindex URLs found in sitemap: ${noindexInSitemap.slice(0, 10).join(", ")}`)
}

if (redirectPathsInSitemap.length > 0) {
  errors.push(`Redirecting URLs found in sitemap: ${redirectPathsInSitemap.slice(0, 10).join(", ")}`)
}

if (excludedPrefixesInSitemap.length > 0) {
  errors.push(
    `Excluded low-priority or legacy prefixes found in sitemap: ${excludedPrefixesInSitemap
      .slice(0, 10)
      .join(", ")}`
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
  familyCounts,
  disallowRules,
  blockedInRobots,
  forbiddenDisallowRulesPresent,
  duplicatePaths,
  excludedPrefixesInSitemap,
  excludedPatterns: payload.excludedPatterns,
  missingRequiredPaths,
  noindexInSitemap,
  noindexedPatterns: payload.noindexedPatterns,
  redirectPathsInSitemap,
  canonicalStrategy: {
    host: BASE_URL,
    lowercasePaths: true,
    redirectAliases: true,
    selfReferencingCanonicals: true,
    trailingSlashPolicy: "strip trailing slash except root",
  },
  sitemapStrategy: {
    dynamicSourceOfTruth: "lib/sitemap-data.ts",
    includeOnlyCanonicalIndexable200s: true,
    calculatorExpressionLimit: payload.seoIndexationLimits.calculatorExpressions,
    converterModifierLimit: payload.seoIndexationLimits.converterModifiers,
    converterOpenFormatLimit: payload.seoIndexationLimits.converterOpenFormats,
    converterPairLimit: payload.seoIndexationLimits.converterPairs,
  },
  crawlBudgetRecommendations: [
    "Keep parameterized URLs out of crawl paths with robots rules, but let duplicate public paths stay crawlable long enough for Google to see redirects or noindex directives.",
    "Only expose curated calculator and converter routes in sitemap and high-signal internal hubs.",
    "Leave low-value regional and ISP status permutations live for users but noindex them so they do not compete with canonical status pages.",
    "Redirect legacy duplicate namespaces such as /pdf-tools/* and remove redirected aliases from internal links instead of blocking them in robots.txt.",
    "Monitor calculator and converter family counts before increasing any generated-route budgets.",
  ],
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
