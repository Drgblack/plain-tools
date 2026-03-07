import type { JsonLdObject } from "@/lib/structured-data"
import {
  buildBreadcrumbList,
  buildFaqPageSchema,
  buildHowToSchema,
  buildSoftwareApplicationSchema,
  buildWebPageSchema,
  combineJsonLd,
} from "@/lib/structured-data"

type ToolSchemaFaq = {
  question: string
  answer: string
}

type ToolSchemaStep = {
  name: string
  text: string
}

type BuildToolSchemaInput = {
  name: string
  slug: string
  description: string
  featureList: string[]
  browserRequirements?: string
  includeHowTo?: boolean
  howToSteps?: ToolSchemaStep[]
  includeFaq?: boolean
  faqs?: ToolSchemaFaq[]
}

const DEFAULT_HOW_TO_STEPS: ToolSchemaStep[] = [
  {
    name: "Add source files",
    text: "Select files from your device. Core processing runs in your browser for local workflows.",
  },
  {
    name: "Choose options",
    text: "Set the options required for the output format or processing mode.",
  },
  {
    name: "Process and review output",
    text: "Run the tool, then download and review the generated result before sharing.",
  },
]

export function buildToolSchema(input: BuildToolSchemaInput): JsonLdObject | null {
  const url = `https://plain.tools/tools/${input.slug}`
  const schemas: JsonLdObject[] = [
    buildWebPageSchema({
      name: `${input.name} - Plain Tools`,
      description: input.description,
      url,
    }),
    buildBreadcrumbList([
      { name: "Home", url: "https://plain.tools/" },
      { name: "Tools", url: "https://plain.tools/tools" },
      { name: input.name, url },
    ]),
    buildSoftwareApplicationSchema({
      name: input.name,
      description: input.description,
      url,
      featureList: input.featureList,
      browserRequirements:
        input.browserRequirements ??
        "Requires a modern browser with JavaScript and WebAssembly support.",
    }),
  ]

  if (input.includeHowTo) {
    schemas.push(
      buildHowToSchema(
        `How to use ${input.name}`,
        input.description,
        input.howToSteps && input.howToSteps.length > 0
          ? input.howToSteps
          : DEFAULT_HOW_TO_STEPS
      )
    )
  }

  if (input.includeFaq && input.faqs && input.faqs.length > 0) {
    schemas.push(buildFaqPageSchema(input.faqs))
  }

  return combineJsonLd(schemas)
}
