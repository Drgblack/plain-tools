import Script from "next/script"

import { serializeJsonLd } from "@/lib/sanitize"
import {
  buildBreadcrumbList,
  buildFaqPageSchema,
  buildHowToSchema,
  buildSoftwareApplicationSchema,
  buildWebPageSchema,
  combineJsonLd,
} from "@/lib/structured-data"
import { getToolPageProfile } from "@/lib/tool-page-content"
import { getToolBySlug } from "@/lib/tools-catalogue"

type ToolJsonLdProps = {
  toolSlug: string
}

export function ToolJsonLd({ toolSlug }: ToolJsonLdProps) {
  const tool = getToolBySlug(toolSlug)
  if (!tool) return null

  const pageUrl = `https://plain.tools/tools/${tool.slug}`
  const profile = getToolPageProfile(tool)

  const schema = combineJsonLd([
    buildWebPageSchema({
      name: `${tool.name} - Plain Tools`,
      description: profile.description,
      url: pageUrl,
    }),
    buildBreadcrumbList([
      { name: "Home", url: "https://plain.tools/" },
      { name: "Tools", url: "https://plain.tools/tools" },
      { name: tool.name, url: pageUrl },
    ]),
    buildSoftwareApplicationSchema({
      name: tool.name,
      description: profile.description,
      url: pageUrl,
      featureList: profile.featureList,
      browserRequirements:
        "Requires a modern browser with JavaScript and WebAssembly support.",
    }),
    buildHowToSchema(`How to use ${tool.name}`, profile.description, [
      {
        name: "Upload your file",
        text: "Select your file from local storage. Core tool processing stays in your browser.",
      },
      {
        name: "Choose options",
        text: "Set processing options based on the result you need.",
      },
      {
        name: "Process locally",
        text: `${tool.name} runs directly in the browser without server-side file handling for local workflows.`,
      },
      {
        name: "Download output",
        text: "Review and download the generated file.",
      },
    ]),
    buildFaqPageSchema([
      {
        question: `Does ${tool.name} upload my file?`,
        answer: `${tool.name} uses local browser processing for core workflows. Files stay on your device.`,
      },
      {
        question: `Is ${tool.name} free to use?`,
        answer: "Core local workflows are available without a mandatory account.",
      },
      {
        question: `Can I verify local processing?`,
        answer: "Yes. Inspect request traffic in your browser DevTools while running the tool.",
      },
    ]),
  ])

  if (!schema) return null

  return (
    <Script
      id={`tool-schema-${tool.slug}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }}
    />
  )
}
