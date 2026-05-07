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

export const EXCLUDED_URL_PATTERNS = [
  "/faq",
  "/html-sitemap",
  "/labs",
  "/calculators/<category>/<expression> when outside the curated calculator allowlist",
  "/convert/<from>-to-<to> when outside the curated converter-pair allowlist",
  "/convert/<from>-to-<to>/<modifier> when outside the curated converter-modifier allowlist",
  "/convert/open-<format> when outside the curated open-format guide allowlist",
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
