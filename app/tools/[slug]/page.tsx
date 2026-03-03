import { notFound } from "next/navigation"
import { lazy, Suspense, type ComponentType, type LazyExoticComponent } from "react"

import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
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
  "compression-preview": lazy(() => import("@/components/tools/compression-previewer-tool")),
  "pdf-qa": lazy(() => import("@/components/tools/qa-tool")),
  "suggest-edits": lazy(() => import("@/components/tools/suggest-edits-tool")),
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

  if (!tool) {
    notFound()
  }

  const ToolComponent: ToolComponent = tool.available
    ? toolComponents[tool.slug] ?? FallbackToolComponent
    : FallbackToolComponent

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-background">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto py-8">
          <h1 className="text-3xl font-bold">{tool.name}</h1>
          <p className="mb-6 text-muted-foreground">{tool.description}</p>

          {tool.available ? (
            <>
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
            </>
          ) : (
            <div className="rounded-xl border border-border bg-card p-6">
              <p className="text-base font-medium text-foreground">Coming Soon</p>
              <p className="mt-2 text-sm text-muted-foreground">
                This tool is listed in the catalogue but its UI is not published yet.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
