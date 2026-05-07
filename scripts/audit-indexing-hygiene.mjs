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
const FAMILY_BASELINES = {
  guides: 3596,
  status: 2929,
}

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

function buildGuideBuckets(paths) {
  return {
    industryHubs: paths.filter((path) => /^\/guides\/[^/]+$/.test(path)).length,
    workflowPages: paths.filter((path) => /^\/guides\/[^/]+\/[^/]+$/.test(path)).length,
  }
}

function buildStatusBuckets(paths) {
  return {
    categories: paths.filter((path) =>
      /^\/status\/(social|messaging|streaming|developer-tools|saas|ai|finance|ecommerce|productivity|cloud|gaming|news|education|design)$/.test(
        path
      )
    ).length,
    domainPages: paths.filter(
      (path) =>
        /^\/status\/[^/]+$/.test(path) &&
        path !== "/status/trending" &&
        !path.endsWith("-outage-history") &&
        !/^\/status\/trending-/.test(path) &&
        !/^\/status\/(social|messaging|streaming|developer-tools|saas|ai|finance|ecommerce|productivity|cloud|gaming|news|education|design)$/.test(
          path
        )
    ).length,
    outageHistory: paths.filter((path) => /^\/status\/[^/]+-outage-history$/.test(path)).length,
    trendingOverview: paths.filter((path) => path === "/status/trending").length,
    trendingSegments: paths.filter((path) => /^\/status\/trending-[^/]+$/.test(path)).length,
  }
}

runTsx(
  `import fs from "node:fs"; import robots from "./app/robots.ts"; import { buildSitemapEntries } from "./lib/sitemap-data.ts"; import { EXCLUDED_URL_PATTERNS, NOINDEX_EXACT_PATHS, NOINDEX_URL_PATTERNS, SEO_INDEXATION_LIMITS, getIndexableGuideIndustrySitemapPaths, getIndexableGuideWorkflowSitemapPaths, getIndexableStatusDomains, getIndexableStatusOutageHistoryDomains, getIndexableStatusTrendingSegments, getIndexationPolicy } from "./lib/seo/indexation-policy.ts"; const entries = buildSitemapEntries(new Date()).map((entry) => entry.url); const robotsConfig = robots(); const noindexPaths = Array.from(NOINDEX_EXACT_PATHS); const nonIndexableEntries = entries.map((entry) => new URL(entry).pathname).filter((path) => Boolean(getIndexationPolicy(path))); fs.writeFileSync(${JSON.stringify(PAYLOAD_PATH)}, JSON.stringify({ entries, excludedPatterns: EXCLUDED_URL_PATTERNS, indexableGuideIndustryPaths: getIndexableGuideIndustrySitemapPaths(), indexableGuideWorkflowPaths: getIndexableGuideWorkflowSitemapPaths(), indexableStatusDomains: getIndexableStatusDomains(), indexableStatusOutageHistoryDomains: getIndexableStatusOutageHistoryDomains(), indexableStatusTrendingSegments: getIndexableStatusTrendingSegments(), noindexPaths: Array.from(noindexPaths), noindexedPatterns: NOINDEX_URL_PATTERNS, nonIndexableEntries, robotsConfig, seoIndexationLimits: SEO_INDEXATION_LIMITS }));`
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
const guidePaths = sitemapPaths.filter((path) => path.startsWith("/guides/"))
const statusPaths = sitemapPaths.filter((path) => path.startsWith("/status/"))
const guideBuckets = buildGuideBuckets(guidePaths)
const statusBuckets = buildStatusBuckets(statusPaths)
const expectedGuideBuckets = {
  industryHubs: payload.indexableGuideIndustryPaths.length,
  workflowPages: payload.indexableGuideWorkflowPaths.length,
}
const expectedStatusBuckets = {
  categories: 14,
  domainPages: payload.indexableStatusDomains.length,
  outageHistory: payload.indexableStatusOutageHistoryDomains.length,
  trendingOverview: 1,
  trendingSegments: payload.indexableStatusTrendingSegments.length,
}

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

if (guideBuckets.industryHubs !== expectedGuideBuckets.industryHubs) {
  errors.push(
    `Guide industry hub count drifted from curated set: expected ${expectedGuideBuckets.industryHubs}, found ${guideBuckets.industryHubs}`
  )
}

if (guideBuckets.workflowPages !== expectedGuideBuckets.workflowPages) {
  errors.push(
    `Guide workflow count drifted from curated set: expected ${expectedGuideBuckets.workflowPages}, found ${guideBuckets.workflowPages}`
  )
}

if (statusBuckets.domainPages !== expectedStatusBuckets.domainPages) {
  errors.push(
    `Status domain count drifted from curated set: expected ${expectedStatusBuckets.domainPages}, found ${statusBuckets.domainPages}`
  )
}

if (statusBuckets.outageHistory !== expectedStatusBuckets.outageHistory) {
  errors.push(
    `Status outage-history count drifted from curated set: expected ${expectedStatusBuckets.outageHistory}, found ${statusBuckets.outageHistory}`
  )
}

if (statusBuckets.trendingSegments !== expectedStatusBuckets.trendingSegments) {
  errors.push(
    `Status trending-segment count drifted from curated set: expected ${expectedStatusBuckets.trendingSegments}, found ${statusBuckets.trendingSegments}`
  )
}

if (statusBuckets.categories !== expectedStatusBuckets.categories) {
  errors.push(
    `Status category hub count drifted from curated set: expected ${expectedStatusBuckets.categories}, found ${statusBuckets.categories}`
  )
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
    guideIndustryHubLimit: payload.seoIndexationLimits.guideIndustryHubs,
    guideWorkflowLimit: payload.seoIndexationLimits.guideWorkflowPages,
    statusDomainLimit: payload.seoIndexationLimits.statusDomains,
    statusOutageHistoryLimit: payload.seoIndexationLimits.statusOutageHistoryPages,
    statusTrendingSegmentLimit: payload.seoIndexationLimits.statusTrendingSegments,
  },
  familyPruning: {
    guides: {
      before: FAMILY_BASELINES.guides,
      after: guidePaths.length,
      remainingIndexable: guideBuckets,
      excludedPatterns: [
        "/guides/<industry> outside the curated priority-industry hubs",
        "/guides/<industry>/<workflow> outside the curated priority industry x workflow intersections",
      ],
      noindexedPatterns: [
        "/guides/<industry> outside the curated priority-industry hubs",
        "/guides/<industry>/<workflow> outside the curated priority industry x workflow intersections",
      ],
      consolidatedOrRedirected: [
        "/guides/<non-priority-industry> consolidated to /guides at sitemap and internal-link level; route remains live with noindex.",
        "/guides/<industry>/<non-priority-workflow> consolidated to the closest priority hub and matching tool page at sitemap and internal-link level; route remains live with noindex.",
      ],
      rationale: [
        "The 58x61 workflow matrix created substantial near-duplicate templated pages with overlapping intent.",
        "Priority industry hubs remain indexable because they provide clear navigation and stronger internal-link consolidation.",
        "Only priority industry x priority workflow intersections remain indexable because they carry the strongest strategic and commercial intent.",
      ],
    },
    status: {
      before: FAMILY_BASELINES.status,
      after: statusPaths.length,
      remainingIndexable: statusBuckets,
      excludedPatterns: [
        "/status/<domain> outside the curated category-representative status set",
        "/status/<domain>-outage-history outside the curated outage-history set",
        "/status/trending-<segment> outside the primary status trend segments",
      ],
      noindexedPatterns: [
        "/status/<domain> outside the curated category-representative status set",
        "/status/<domain>-outage-history outside the curated outage-history set",
        "/status/trending-<segment> outside the primary status trend segments",
      ],
      consolidatedOrRedirected: [
        "/status/<non-curated-domain> consolidated to /status, /status/<category>, and /site-status at sitemap and hub-link level; route remains live with noindex.",
        "/status/<non-curated-domain>-outage-history consolidated to the canonical domain page plus /status/trending and /site-status; route remains live with noindex.",
        "/status/trending-<non-primary-segment> consolidated to /status/trending at sitemap and hub-link level; route remains live with noindex.",
      ],
      rationale: [
        "Most status URLs are operational support pages rather than durable search landing pages.",
        "Category hubs remain indexable because they group public search intent cleanly without forcing Google through every low-demand domain permutation.",
        "Only representative status domains, primary trend segments, and a small outage-history subset remain indexable to preserve utility without polluting the sitemap.",
      ],
    },
  },
  crawlBudgetRecommendations: [
    "Keep parameterized URLs out of crawl paths with robots rules, but let duplicate public paths stay crawlable long enough for Google to see redirects or noindex directives.",
    "Only expose curated calculator and converter routes in sitemap and high-signal internal hubs.",
    "Leave low-value regional and ISP status permutations live for users but noindex them so they do not compete with canonical status pages.",
    "Keep the /guides family limited to priority industry hubs and priority workflow intersections instead of the full generated matrix.",
    "Keep the /status family limited to category hubs, representative domain pages, primary trending segments, and a small outage-history subset.",
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
