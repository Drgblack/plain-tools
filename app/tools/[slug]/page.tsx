import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { lazy, Suspense, type ComponentType, type LazyExoticComponent } from "react"

import { ErrorBoundary } from "@/components/error-boundary"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { getToolBySlug, TOOL_CATALOGUE } from "@/lib/tools-catalogue"
import { getToolSeoEntry } from "@/lib/seo-route-map"

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

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const tool = getToolBySlug(slug)
  const seo = getToolSeoEntry(slug)

  if (!tool) {
    return {
      title: "Tool Not Found - Plain",
      description:
        "The requested Plain tool could not be found. Browse available offline PDF tools and process documents locally without uploads.",
    }
  }

  return {
    title: tool.name,
    description:
      seo?.description ??
      `${tool.name} by Plain runs in your browser with local processing and no file uploads for private PDF document workflows.`,
    alternates: {
      canonical: `https://plain.tools/tools/${slug}`,
    },
    openGraph: {
      title: `${tool.name} - Plain`,
      description:
        seo?.description ??
        `${tool.name} by Plain runs in your browser with local processing and no file uploads for private PDF document workflows.`,
      url: `https://plain.tools/tools/${slug}`,
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: `${tool.name} - Plain`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${tool.name} - Plain`,
      description:
        seo?.description ??
        `${tool.name} by Plain runs in your browser with local processing and no file uploads for private PDF document workflows.`,
      images: ["/opengraph-image"],
    },
  }
}

export default async function ToolPage({ params }: PageProps) {
  const { slug } = await params
  const tool = getToolBySlug(slug)
  const seo = getToolSeoEntry(slug)

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
                <ErrorBoundary context={`tool:${tool.slug}`}>
                  <ToolComponent />
                </ErrorBoundary>
              </Suspense>

              {seo ? (
                <div className="mt-6 rounded-lg border border-white/[0.1] bg-muted/20 p-4 text-sm text-muted-foreground">
                  Learn more:{" "}
                  <a
                    href={seo.learnHref}
                    className="font-medium text-accent hover:underline"
                  >
                    {seo.learnLabel}
                  </a>
                </div>
              ) : null}
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
