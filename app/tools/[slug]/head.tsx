import { notFound } from "next/navigation"

import { serializeJsonLd } from "@/lib/sanitize"
import { getToolPageProfile } from "@/lib/tool-page-content"
import { buildToolSchema } from "@/lib/tool-schema"
import { getToolProblemPage } from "@/lib/tool-problem-pages"
import { getToolBySlug } from "@/lib/tools-catalogue"

type ToolHeadProps = {
  params: Promise<{ slug: string }>
}

export default async function Head({ params }: ToolHeadProps) {
  const { slug } = await params
  const tool = getToolBySlug(slug)
  const problemPage = getToolProblemPage(slug)

  if (problemPage) {
    return null
  }

  if (!tool) {
    notFound()
  }

  const profile = getToolPageProfile(tool)
  const schema = buildToolSchema({
    name: tool.name,
    slug,
    description: profile.description,
    featureList: profile.featureList,
    browserRequirements:
      "Requires a modern browser with WebAssembly support (Chrome 57+, Firefox 53+, Safari 11+, Edge 16+).",
    includeHowTo: true,
    howToSteps: [
      {
        name: "Upload your file",
        text: "Select a file from your device. The file stays local in your browser session.",
      },
      {
        name: "Choose options",
        text: "Pick the settings needed for your workflow before processing.",
      },
      {
        name: "Process locally",
        text: `Run ${tool.name} directly in the browser without server-side file handling.`,
      },
      {
        name: "Download output",
        text: "Download the processed result and verify output quality before sharing.",
      },
    ],
    includeFaq: profile.faqs.length > 0,
    faqs: profile.faqs.map((faq) => ({
      question: faq.question,
      answer: faq.answer,
    })),
  })

  if (!schema) {
    return null
  }

  return (
    <script
      id={`tool-schema-${tool.slug}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }}
    />
  )
}
