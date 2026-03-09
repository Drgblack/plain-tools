import type { ToolVariantPageDefinition } from "@/lib/tools-matrix"
import {
  getRelatedToolVariantPages,
  getToolVariantPage,
  TOOL_VARIANT_PAGES,
} from "@/lib/tools-matrix"
import { getToolBySlug } from "@/lib/tools-catalogue"

export const PDF_VARIANT_PLATFORM_MODIFIERS = ["mac", "windows", "iphone", "android"] as const
export const PDF_VARIANT_PROBLEM_MODIFIERS = [
  "offline",
  "securely",
  "no-upload",
  "large-files",
] as const

export const CORE_PDF_VARIANT_TOOL_SLUGS = [
  "merge-pdf",
  "split-pdf",
  "compress-pdf",
  "pdf-to-word",
  "jpg-to-pdf",
] as const

export const CORE_PDF_VARIANT_MATRIX_MODIFIERS = [
  ...PDF_VARIANT_PLATFORM_MODIFIERS,
  ...PDF_VARIANT_PROBLEM_MODIFIERS,
] as const

export type PdfToolVariantRouteParams = {
  action: string
  variant: string
}

export type PdfVariantCategory = "platform" | "problem" | "workflow"

export type PdfToolVariantSeoPage = ToolVariantPageDefinition & {
  aliases: string[]
  category: PdfVariantCategory
  pdfPath: string
}

export type PdfToolVariantIndexGroup = {
  categories: Array<{
    name: string
    pages: PdfToolVariantSeoPage[]
  }>
  toolDescription: string
  toolName: string
  toolSlug: string
}

const VARIANT_ALIASES: Record<string, string> = {
  "large-pdf": "large-files",
  secure: "securely",
}

const ALL_PDF_VARIANT_TOOL_SLUGS = Array.from(
  new Set(TOOL_VARIANT_PAGES.map((page) => page.toolSlug))
).sort()

function normaliseVariantSlug(variant: string) {
  return VARIANT_ALIASES[variant] ?? variant
}

function getVariantCategory(modifierSlug: string): PdfVariantCategory {
  if ((PDF_VARIANT_PLATFORM_MODIFIERS as readonly string[]).includes(modifierSlug)) {
    return "platform"
  }
  if ((PDF_VARIANT_PROBLEM_MODIFIERS as readonly string[]).includes(modifierSlug)) {
    return "problem"
  }
  return "workflow"
}

function buildPdfToolVariantPath(toolSlug: string, modifierSlug: string) {
  return `/pdf-tools/${toolSlug}/${modifierSlug}`
}

function buildFlatAliases(page: ToolVariantPageDefinition) {
  const aliases = new Set<string>([`${page.toolSlug}-${page.modifierSlug}`])

  if (page.modifierSlug === "large-files" && page.toolSlug.endsWith("-pdf")) {
    aliases.add(`${page.toolSlug.replace(/-pdf$/, "")}-large-pdf`)
  }

  return Array.from(aliases)
}

function enrichPage(page: ToolVariantPageDefinition): PdfToolVariantSeoPage {
  return {
    ...page,
    aliases: buildFlatAliases(page),
    category: getVariantCategory(page.modifierSlug),
    pdfPath: buildPdfToolVariantPath(page.toolSlug, page.modifierSlug),
  }
}

function selectToolSlugs(options?: {
  includeAllPdfTools?: boolean
  toolSlugs?: readonly string[]
}) {
  if (options?.toolSlugs?.length) return [...options.toolSlugs]
  if (options?.includeAllPdfTools === false) return [...CORE_PDF_VARIANT_TOOL_SLUGS]
  return ALL_PDF_VARIANT_TOOL_SLUGS
}

export function getPdfToolVariantPage(
  action: string,
  variant: string
): PdfToolVariantSeoPage | null {
  const resolvedVariant = normaliseVariantSlug(variant)
  const page = getToolVariantPage(action, resolvedVariant)
  if (!page) return null
  return enrichPage(page)
}

export function getPdfToolVariantFlatAliasPage(flatSlug: string): PdfToolVariantSeoPage | null {
  const page = TOOL_VARIANT_PAGES.find((entry) => buildFlatAliases(entry).includes(flatSlug))
  return page ? enrichPage(page) : null
}

export function getPdfToolVariantPagesForTool(toolSlug: string) {
  return TOOL_VARIANT_PAGES.filter((page) => page.toolSlug === toolSlug).map(enrichPage)
}

export function getRelatedPdfToolVariantPages(
  toolSlug: string,
  modifierSlug: string,
  limit = 6
) {
  return getRelatedToolVariantPages(toolSlug, modifierSlug, limit).map(enrichPage)
}

export function generatePdfToolVariantStaticParams(options?: {
  includeAllPdfTools?: boolean
  modifierSlugs?: readonly string[]
  toolSlugs?: readonly string[]
}) {
  const toolSlugSet = new Set(selectToolSlugs(options))
  const modifierSlugSet = options?.modifierSlugs?.length
    ? new Set(options.modifierSlugs)
    : null

  return TOOL_VARIANT_PAGES.filter((page) => {
    if (!toolSlugSet.has(page.toolSlug)) return false
    if (modifierSlugSet && !modifierSlugSet.has(page.modifierSlug)) return false
    return true
  }).map((page) => ({
    action: page.toolSlug,
    variant: page.modifierSlug,
  }))
}

export function getPdfToolVariantSitemapPaths(options?: {
  includeAllPdfTools?: boolean
  modifierSlugs?: readonly string[]
  toolSlugs?: readonly string[]
}) {
  return generatePdfToolVariantStaticParams(options).map(({ action, variant }) =>
    buildPdfToolVariantPath(action, variant)
  )
}

function sortPagesByCategory(pages: PdfToolVariantSeoPage[]) {
  return [
    {
      name: "Platform pages",
      pages: pages.filter((page) => page.category === "platform"),
    },
    {
      name: "Problem and privacy pages",
      pages: pages.filter((page) => page.category === "problem"),
    },
    {
      name: "Workflow pages",
      pages: pages.filter((page) => page.category === "workflow"),
    },
  ].filter((section) => section.pages.length > 0)
}

export function getPdfToolVariantIndexGroups(options?: {
  includeAllPdfTools?: boolean
  toolSlugs?: readonly string[]
}) {
  return selectToolSlugs(options)
    .map((toolSlug) => {
      const tool = getToolBySlug(toolSlug)
      if (!tool) return null

      const pages = getPdfToolVariantPagesForTool(toolSlug)
      if (pages.length === 0) return null

      return {
        categories: sortPagesByCategory(pages),
        toolDescription: tool.description,
        toolName: tool.name,
        toolSlug,
      } satisfies PdfToolVariantIndexGroup
    })
    .filter(Boolean) as PdfToolVariantIndexGroup[]
}

export const PDF_VARIANT_METADATA_EXAMPLES = [
  getPdfToolVariantPage("merge-pdf", "mac"),
  getPdfToolVariantPage("merge-pdf", "securely"),
  getPdfToolVariantPage("compress-pdf", "windows"),
  getPdfToolVariantPage("split-pdf", "iphone"),
  getPdfToolVariantPage("pdf-to-word", "no-upload"),
].filter(Boolean) as PdfToolVariantSeoPage[]
