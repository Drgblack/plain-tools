import type { Metadata } from "next"

import { buildPageMetadata } from "@/lib/page-metadata"
import { buildHowToSchema, buildWebPageSchema, combineJsonLd, type JsonLdObject } from "@/lib/structured-data"
import { buildProgrammaticPageData } from "@/lib/programmatic-content"

export type ProgrammaticMetadataResult = {
  jsonLd: JsonLdObject | null
  metadata: Metadata
}

export function generateProgrammaticMetadata(
  tool: string,
  param: string
): ProgrammaticMetadataResult | null {
  const page = buildProgrammaticPageData(tool, param)
  if (!page) return null

  const metadata = buildPageMetadata({
    title: page.title,
    description: page.description,
    path: page.canonicalPath,
    image: "/og/tools.png",
    googleNotranslate: true,
  })

  const jsonLd = combineJsonLd([
    buildWebPageSchema({
      name: page.title,
      description: page.description,
      url: `https://plain.tools${page.canonicalPath}`,
    }),
    buildHowToSchema(
      `How to use ${page.tool.name} ${page.paramLabel}`,
      page.description,
      page.howToSteps
    ),
  ])

  return {
    jsonLd,
    metadata: {
      ...metadata,
      keywords: [
        page.tool.name,
        `${page.tool.name} ${page.paramLabel}`,
        "100% local",
        "no upload",
        "privacy-first",
        "browser-only",
      ],
      other: {
        google: "notranslate",
      },
    },
  }
}
