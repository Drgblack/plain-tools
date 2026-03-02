import { notFound } from "next/navigation"
import { lazy, Suspense, type ComponentType, type LazyExoticComponent } from "react"

import { getToolBySlug, TOOL_CATALOGUE } from "@/lib/tools-catalogue"

type PageProps = {
  params: Promise<{ slug: string }>
}

type ToolComponent = ComponentType | LazyExoticComponent<ComponentType>

const toolComponents: Record<string, ToolComponent> = {
  "merge-pdf": lazy(() => import("@/components/tools/merge-tool")),
  "split-pdf": lazy(() => import("@/components/tools/split-tool")),
  "irreversible-redactor": lazy(() => import("@/components/tools/redact-tool")),
  "redact-pdf": lazy(() => import("@/components/tools/redact-tool")),
  "privacy-risk-scanner": lazy(() => import("@/components/tools/privacy-scanner-tool")),
  "privacy-scan": lazy(() => import("@/components/tools/privacy-scanner-tool")),
  "offline-ocr": lazy(() => import("@/components/tools/ocr-tool")),
  "summarize-pdf": lazy(() => import("@/components/tools/summarize-tool")),
}

const FallbackToolComponent = () => <div>Tool UI coming soon</div>

export async function generateStaticParams() {
  return TOOL_CATALOGUE.filter((tool) => tool.available).map((tool) => ({
    slug: tool.slug,
  }))
}

export default async function ToolPage({ params }: PageProps) {
  const { slug } = await params
  const tool = getToolBySlug(slug)

  if (!tool || !tool.available) {
    notFound()
  }

  const ToolComponent = toolComponents[tool.slug] ?? FallbackToolComponent

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold">{tool.name}</h1>
      <p className="mb-6 text-muted-foreground">{tool.description}</p>

      {tool.category !== "AI Assistant" ? (
        <div className="mb-4 text-sm text-green-600">100% Local Processing - No Uploads</div>
      ) : (
        <div className="mb-4 text-sm text-amber-600">
          Opt-in: Text extracted locally, sent to Anthropic for processing
        </div>
      )}

      <Suspense fallback={<div>Loading tool...</div>}>
        <ToolComponent />
      </Suspense>
    </div>
  )
}
