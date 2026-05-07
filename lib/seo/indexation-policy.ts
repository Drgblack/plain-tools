import type { Metadata } from "next"

import {
  buildCalculatorPath,
  getPrebuildCalculatorParams,
  type CalculatorCategory,
} from "@/lib/calculator-financial-deep"
import {
  generateAllExtendedConverterParams,
} from "@/lib/converter-families"
import {
  generateAllExtendedOpenFormatGuideParams,
} from "@/lib/converter-families-ext"
import {
  generateAllExtendedConverterModifierParams,
} from "@/lib/converter-specialized-ext"
import {
  getIndexableProfessionalWorkflowIndustryHubs,
  getIndexableProfessionalWorkflowSitemapPaths,
  isProfessionalWorkflowIndexable,
  isProfessionalWorkflowIndustryHubIndexable,
} from "@/lib/professional-workflows-expanded"
import {
  STATUS_CATEGORIES,
  STATUS_DOMAINS_BY_CATEGORY,
  STATUS_HIGH_DEMAND_SITES,
  type StatusCategory,
} from "@/lib/status-domains"
import {
  parseStatusIspFlatSlug,
  parseStatusRegionFlatSlug,
} from "@/lib/status-regions"

export const NOINDEX_EXACT_PATHS = new Set([
  "/faq",
  "/html-sitemap",
  "/labs",
])

export const SEO_INDEXATION_LIMITS = {
  calculatorExpressions: 1400,
  converterModifiers: 500,
  converterOpenFormats: 120,
  converterPairs: 140,
  guideIndustryHubs: 15,
  guideWorkflowPages: 285,
  statusDomains: 112,
  statusOutageHistoryPages: 43,
  statusTrendingSegments: 10,
} as const

type IndexationPolicy = {
  follow: boolean
  index: boolean
  reason: string
}

type CalculatorParam = {
  category: CalculatorCategory
  expression: string
}

function unique<T>(items: T[]) {
  return Array.from(new Set(items))
}

const CANONICAL_CALCULATOR_PARAMS = getPrebuildCalculatorParams(
  SEO_INDEXATION_LIMITS.calculatorExpressions
)
const CANONICAL_CALCULATOR_PATHS = new Set(
  CANONICAL_CALCULATOR_PARAMS.map((entry) =>
    buildCalculatorPath(entry.category, entry.expression)
  )
)
const CANONICAL_CALCULATOR_PARAMS_BY_CATEGORY = new Map<string, CalculatorParam[]>(
  CANONICAL_CALCULATOR_PARAMS.reduce<Array<[string, CalculatorParam[]]>>((accumulator, entry) => {
    const existing = accumulator.find(([category]) => category === entry.category)
    if (existing) {
      existing[1].push(entry)
      return accumulator
    }

    accumulator.push([entry.category, [entry]])
    return accumulator
  }, [])
)
const CANONICAL_CONVERTER_PAIR_PATHS = new Set(
  generateAllExtendedConverterParams(SEO_INDEXATION_LIMITS.converterPairs).map(
    ({ from, to }) => `/convert/${from}-to-${to}`
  )
)
const CANONICAL_CONVERTER_MODIFIER_PATHS = new Set(
  generateAllExtendedConverterModifierParams(
    SEO_INDEXATION_LIMITS.converterModifiers
  ).map(({ from, modifier, to }) => `/convert/${from}-to-${to}/${modifier}`)
)
const CANONICAL_OPEN_FORMAT_GUIDE_PATHS = new Set(
  generateAllExtendedOpenFormatGuideParams(
    SEO_INDEXATION_LIMITS.converterOpenFormats
  ).map(({ format }) => `/convert/open-${format}`)
)
const CANONICAL_GUIDE_INDUSTRY_PATHS = new Set(
  getIndexableProfessionalWorkflowIndustryHubs().map((hub) => hub.canonicalPath)
)
const CANONICAL_GUIDE_WORKFLOW_PATHS = new Set(
  getIndexableProfessionalWorkflowSitemapPaths()
)
const STATUS_INDEXABLE_DOMAIN_COUNT_PER_CATEGORY = 8
const STATUS_INDEXABLE_OUTAGE_HISTORY_COUNT_PER_CATEGORY = 3
const CANONICAL_STATUS_DOMAINS = unique(
  [
    ...STATUS_HIGH_DEMAND_SITES,
    ...STATUS_CATEGORIES.flatMap((category) =>
      STATUS_DOMAINS_BY_CATEGORY[category]
        .slice(0, STATUS_INDEXABLE_DOMAIN_COUNT_PER_CATEGORY)
        .map((entry) => entry.domain)
    ),
  ]
)
const CANONICAL_STATUS_DOMAIN_SET = new Set(CANONICAL_STATUS_DOMAINS)
const CANONICAL_STATUS_OUTAGE_HISTORY_DOMAINS = unique(
  [
    ...STATUS_HIGH_DEMAND_SITES,
    ...STATUS_CATEGORIES.flatMap((category) =>
      STATUS_DOMAINS_BY_CATEGORY[category]
        .slice(0, STATUS_INDEXABLE_OUTAGE_HISTORY_COUNT_PER_CATEGORY)
        .map((entry) => entry.domain)
    ),
  ]
)
const CANONICAL_STATUS_OUTAGE_HISTORY_DOMAIN_SET = new Set(
  CANONICAL_STATUS_OUTAGE_HISTORY_DOMAINS
)
const CANONICAL_STATUS_TRENDING_SEGMENTS = [
  "social",
  "streaming",
  "ai-tools",
  "developer",
  "finance",
  "ecommerce",
  "productivity",
  "cloud",
  "gaming",
  "news-media",
] as const
const CANONICAL_STATUS_TRENDING_SEGMENT_SET = new Set(
  CANONICAL_STATUS_TRENDING_SEGMENTS
)

export const EXCLUDED_URL_PATTERNS = [
  "/faq",
  "/html-sitemap",
  "/labs",
  "/calculators/<category>/<expression> when outside the curated calculator allowlist",
  "/convert/<from>-to-<to> when outside the curated converter-pair allowlist",
  "/convert/<from>-to-<to>/<modifier> when outside the curated converter-modifier allowlist",
  "/convert/open-<format> when outside the curated open-format guide allowlist",
  "/guides/<industry> outside the curated priority-industry hubs",
  "/guides/<industry>/<workflow> outside the curated priority industry x workflow intersections",
  "/status/<domain> outside the curated category-representative status set",
  "/status/<domain>-outage-history outside the curated outage-history set",
  "/status/trending-<segment> outside the primary status trend segments",
  "/status/<site>-<country> regional permutations",
  "/status/<isp>-in-<country> ISP permutations",
] as const

export const NOINDEX_URL_PATTERNS = [
  "/faq",
  "/html-sitemap",
  "/labs",
  "/calculators/<category>/<expression> outside the curated calculator set",
  "/convert/<from>-to-<to> outside the curated converter set",
  "/convert/<from>-to-<to>/<modifier> outside the curated converter-modifier set",
  "/convert/open-<format> outside the curated open-format set",
  "/guides/<industry> outside the curated priority-industry hubs",
  "/guides/<industry>/<workflow> outside the curated priority industry x workflow intersections",
  "/status/<domain> outside the curated category-representative status set",
  "/status/<domain>-outage-history outside the curated outage-history set",
  "/status/trending-<segment> outside the primary status trend segments",
  "/status/<site>-<country>",
  "/status/<isp>-in-<country>",
] as const

function normalizePath(path: string) {
  if (!path) return "/"
  const trimmed = path.trim()
  if (!trimmed) return "/"
  const pathname = trimmed.startsWith("http")
    ? new URL(trimmed).pathname
    : trimmed.startsWith("/")
      ? trimmed
      : `/${trimmed}`

  return pathname !== "/" ? pathname.replace(/\/+$/, "") || "/" : "/"
}

function isCalculatorExpressionPath(path: string) {
  return /^\/calculators\/[^/]+\/[^/]+$/.test(path)
}

function isConverterPairPath(path: string) {
  return /^\/convert\/[^/]+-to-[^/]+$/.test(path)
}

function isConverterModifierPath(path: string) {
  return /^\/convert\/[^/]+-to-[^/]+\/[^/]+$/.test(path)
}

function isOpenFormatGuidePath(path: string) {
  return /^\/convert\/open-[^/]+$/.test(path)
}

function isGuideIndustryPath(path: string) {
  return /^\/guides\/[^/]+$/.test(path)
}

function isGuideWorkflowPath(path: string) {
  return /^\/guides\/[^/]+\/[^/]+$/.test(path)
}

function isStatusOutageHistoryPath(path: string) {
  return /^\/status\/[^/]+-outage-history$/.test(path)
}

function isStatusTrendingSegmentPath(path: string) {
  return /^\/status\/trending-[^/]+$/.test(path)
}

function isStatusDomainPath(path: string) {
  return (
    /^\/status\/[^/]+$/.test(path) &&
    !path.startsWith("/status/trending") &&
    !path.endsWith("-outage-history") &&
    !STATUS_CATEGORIES.some((category) => path === `/status/${category}`)
  )
}

function isDeprioritizedStatusPermutationPath(path: string) {
  const match = /^\/status\/([^/]+)$/.exec(path)
  if (!match) return false

  const slug = decodeURIComponent(match[1] ?? "")
  return Boolean(parseStatusIspFlatSlug(slug) || parseStatusRegionFlatSlug(slug))
}

export function getIndexableCalculatorCategoryParams(
  category: string,
  limit?: number
) {
  const entries = CANONICAL_CALCULATOR_PARAMS_BY_CATEGORY.get(category) ?? []
  return typeof limit === "number" ? entries.slice(0, limit) : entries
}

export function getIndexableCalculatorSitemapPaths() {
  return Array.from(CANONICAL_CALCULATOR_PATHS)
}

export function getIndexableConverterPairSitemapPaths() {
  return Array.from(CANONICAL_CONVERTER_PAIR_PATHS)
}

export function getIndexableConverterModifierSitemapPaths() {
  return Array.from(CANONICAL_CONVERTER_MODIFIER_PATHS)
}

export function getIndexableOpenFormatGuideSitemapPaths() {
  return Array.from(CANONICAL_OPEN_FORMAT_GUIDE_PATHS)
}

export function getIndexableGuideIndustrySitemapPaths() {
  return Array.from(CANONICAL_GUIDE_INDUSTRY_PATHS)
}

export function getIndexableGuideWorkflowSitemapPaths() {
  return Array.from(CANONICAL_GUIDE_WORKFLOW_PATHS)
}

export function getIndexableStatusDomains() {
  return [...CANONICAL_STATUS_DOMAINS]
}

export function getIndexableStatusCategoryDomains(category: StatusCategory) {
  return STATUS_DOMAINS_BY_CATEGORY[category].filter((entry) =>
    CANONICAL_STATUS_DOMAIN_SET.has(entry.domain)
  )
}

export function getIndexableStatusOutageHistoryDomains() {
  return [...CANONICAL_STATUS_OUTAGE_HISTORY_DOMAINS]
}

export function getIndexableStatusTrendingSegments() {
  return [...CANONICAL_STATUS_TRENDING_SEGMENTS]
}

export function isIndexableStatusDomain(domain: string) {
  return CANONICAL_STATUS_DOMAIN_SET.has(domain.trim().toLowerCase())
}

export function isIndexableStatusOutageHistoryDomain(domain: string) {
  return CANONICAL_STATUS_OUTAGE_HISTORY_DOMAIN_SET.has(domain.trim().toLowerCase())
}

export function isIndexableStatusTrendingSegment(segment: string) {
  return CANONICAL_STATUS_TRENDING_SEGMENT_SET.has(segment.trim().toLowerCase())
}

export function getIndexationPolicy(path: string): IndexationPolicy | null {
  const normalizedPath = normalizePath(path)

  if (NOINDEX_EXACT_PATHS.has(normalizedPath)) {
    return {
      follow: true,
      index: false,
      reason: "utility-page",
    }
  }

  if (
    isCalculatorExpressionPath(normalizedPath) &&
    !CANONICAL_CALCULATOR_PATHS.has(normalizedPath)
  ) {
    return {
      follow: false,
      index: false,
      reason: "deprioritized-calculator-expression",
    }
  }

  if (
    isConverterPairPath(normalizedPath) &&
    !CANONICAL_CONVERTER_PAIR_PATHS.has(normalizedPath)
  ) {
    return {
      follow: false,
      index: false,
      reason: "deprioritized-converter-pair",
    }
  }

  if (
    isConverterModifierPath(normalizedPath) &&
    !CANONICAL_CONVERTER_MODIFIER_PATHS.has(normalizedPath)
  ) {
    return {
      follow: false,
      index: false,
      reason: "deprioritized-converter-modifier",
    }
  }

  if (
    isOpenFormatGuidePath(normalizedPath) &&
    !CANONICAL_OPEN_FORMAT_GUIDE_PATHS.has(normalizedPath)
  ) {
    return {
      follow: false,
      index: false,
      reason: "deprioritized-open-format-guide",
    }
  }

  if (isGuideIndustryPath(normalizedPath)) {
    const [, , industry] = normalizedPath.split("/")
    if (!isProfessionalWorkflowIndustryHubIndexable(industry ?? "")) {
      return {
        follow: false,
        index: false,
        reason: "deprioritized-guide-industry-hub",
      }
    }
  }

  if (isGuideWorkflowPath(normalizedPath)) {
    const [, , industry, workflow] = normalizedPath.split("/")
    if (!isProfessionalWorkflowIndexable(industry ?? "", workflow ?? "")) {
      return {
        follow: false,
        index: false,
        reason: "deprioritized-guide-workflow",
      }
    }
  }

  if (isStatusOutageHistoryPath(normalizedPath)) {
    const match = /^\/status\/([^/]+)-outage-history$/.exec(normalizedPath)
    const domain = decodeURIComponent(match?.[1] ?? "").trim().toLowerCase()
    if (!isIndexableStatusOutageHistoryDomain(domain)) {
      return {
        follow: false,
        index: false,
        reason: "deprioritized-status-outage-history",
      }
    }
  }

  if (isStatusTrendingSegmentPath(normalizedPath)) {
    const segment = normalizedPath.replace("/status/trending-", "")
    if (!isIndexableStatusTrendingSegment(segment)) {
      return {
        follow: false,
        index: false,
        reason: "deprioritized-status-trending-segment",
      }
    }
  }

  if (isStatusDomainPath(normalizedPath)) {
    const domain = decodeURIComponent(normalizedPath.replace("/status/", ""))
      .trim()
      .toLowerCase()
    if (!isIndexableStatusDomain(domain)) {
      return {
        follow: false,
        index: false,
        reason: "deprioritized-status-domain",
      }
    }
  }

  if (isDeprioritizedStatusPermutationPath(normalizedPath)) {
    return {
      follow: false,
      index: false,
      reason: "deprioritized-status-permutation",
    }
  }

  return null
}

export function applyIndexationPolicy(metadata: Metadata, path: string): Metadata {
  const policy = getIndexationPolicy(path)
  if (!policy) return metadata

  return {
    ...metadata,
    robots: {
      follow: policy.follow,
      index: policy.index,
      googleBot: {
        follow: policy.follow,
        index: policy.index,
      },
    },
  }
}

export function isIndexablePath(path: string) {
  return getIndexationPolicy(path)?.index !== false
}
