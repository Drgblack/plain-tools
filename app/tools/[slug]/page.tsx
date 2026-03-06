import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { lazy, Suspense, type ComponentType, type LazyExoticComponent } from "react"
import Script from "next/script"

import { ErrorBoundary } from "@/components/error-boundary"
import { ToolRelatedLinks } from "@/components/seo/tool-related-links"
import { buildStandardPageTitle } from "@/lib/page-title"
import { getToolBySlug, TOOL_CATALOGUE } from "@/lib/tools-catalogue"
import { getToolSeoEntry } from "@/lib/seo-route-map"
import { serializeJsonLd } from "@/lib/sanitize"
import {
  buildFaqPageSchema,
  buildHowToSchema,
  buildSoftwareApplicationSchema,
} from "@/lib/structured-data"
import { getToolPageProfile } from "@/lib/tool-page-content"

type ToolRouteParams = { slug: string }

type PageProps = {
  params: Promise<ToolRouteParams>
}

type ToolComponent = ComponentType | LazyExoticComponent<ComponentType>

const toolComponents: Record<string, ToolComponent> = {
  "merge-pdf": lazy(() => import("@/components/tools/merge-pdf-tool")),
  "split-pdf": lazy(() => import("@/components/tools/split-pdf-tool")),
  "compress-pdf": lazy(() => import("@/components/tools/compress-pdf-tool")),
  "irreversible-redactor": lazy(() => import("@/components/tools/redact-tool")),
  "redact-pdf": lazy(() => import("@/components/tools/redact-tool")),
  "privacy-risk-scanner": lazy(() => import("@/components/tools/privacy-scanner-tool")),
  "privacy-scan": lazy(() => import("@/components/tools/privacy-scanner-tool")),
  "offline-ocr": lazy(() => import("@/components/tools/ocr-tool")),
  "compression-preview": lazy(() => import("@/components/tools/compression-previewer-tool")),
  "pdf-qa": lazy(() => import("@/components/tools/qa-tool")),
  "suggest-edits": lazy(() => import("@/components/tools/suggest-edits-tool")),
  "summarize-pdf": lazy(() => import("@/components/tools/summarize-tool")),
  "ocr-pdf": lazy(() => import("@/components/tools/ocr-pdf-tool")),
  "pdf-to-word": lazy(() => import("@/components/tools/pdf-to-word-tool")),
  "protect-pdf": lazy(() => import("@/components/tools/protect-pdf-tool")),
  "unlock-pdf": lazy(() => import("@/components/tools/unlock-pdf-tool")),
  "sign-pdf": lazy(() => import("@/components/tools/sign-pdf-tool")),
  "word-to-pdf": lazy(() => import("@/components/tools/word-to-pdf-tool")),
  "pdf-to-jpg": lazy(() => import("@/components/tools/pdf-to-jpg-tool")),
  "pdf-to-excel": lazy(() => import("@/components/tools/pdf-to-excel-tool")),
  "pdf-to-ppt": lazy(() => import("@/components/tools/pdf-to-ppt-tool")),
  "jpg-to-pdf": lazy(() => import("@/components/tools/jpg-to-pdf-tool")),
}

const FallbackToolComponent = () => <div>Tool UI coming soon</div>

const resolveToolSlug = async (params: Promise<ToolRouteParams>) => {
  const { slug } = await params
  return slug
}

function normaliseToolMetadataTitle(rawTitle: string, fallbackToolName: string) {
  const cleaned = rawTitle.replace("Plain.tools", "Plain Tools")
  if (cleaned.includes("|") || cleaned.includes(" - ")) {
    return buildStandardPageTitle(fallbackToolName)
  }
  return buildStandardPageTitle(cleaned)
}

export async function generateStaticParams() {
  return TOOL_CATALOGUE.filter((tool) => tool.available).map((tool) => ({
    slug: tool.slug,
  }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const slug = await resolveToolSlug(params)
  const tool = getToolBySlug(slug)

  if (!tool) {
    return {
      title: "Tool Not Found - Plain",
      description:
        "The requested Plain tool could not be found. Browse available offline PDF tools and process documents locally without uploads.",
    }
  }

  const profile = getToolPageProfile(tool)
  const description = profile.description
  const title = normaliseToolMetadataTitle(profile.title, tool.name)

  return {
    title,
    description,
    alternates: {
      canonical: `https://plain.tools/tools/${slug}`,
      languages: {
        en: `https://plain.tools/tools/${slug}`,
        de: `https://plain.tools/tools/${slug}`,
        "x-default": `https://plain.tools/tools/${slug}`,
      },
    },
    openGraph: {
      title,
      description,
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
      title,
      description,
      images: ["/opengraph-image"],
    },
  }
}

export default async function ToolPage({ params }: PageProps) {
  const slug = await resolveToolSlug(params)
  const tool = getToolBySlug(slug)
  const seo = getToolSeoEntry(slug)

  if (!tool) {
    notFound()
  }

  const ToolComponent: ToolComponent = tool.available
    ? toolComponents[tool.slug] ?? FallbackToolComponent
    : FallbackToolComponent
  const profile = getToolPageProfile(tool)
  const faqSchema = buildFaqPageSchema([
    {
      question: `Does ${tool.name} upload my file?`,
      answer: `No. ${tool.name} processes your PDF entirely in your browser using WebAssembly. Your file never leaves your device and no data is transmitted to any server. You can verify this yourself using your browser's DevTools Network tab.`,
    },
    {
      question: `Does ${tool.name} work offline?`,
      answer: `Yes. Once the page has loaded, ${tool.name} works without an internet connection. All processing happens locally using WebAssembly compiled into your browser session.`,
    },
    {
      question: `Is ${tool.name} free?`,
      answer: `Yes. ${tool.name} is completely free to use with no account required, no file size limits beyond your device's available RAM, and no usage caps.`,
    },
  ])
  const webApplicationSchema = buildSoftwareApplicationSchema({
    name: tool.name,
    description: profile.description,
    featureList: profile.featureList,
    url: `https://plain.tools/tools/${slug}`,
    browserRequirements:
      "Requires a modern browser with WebAssembly support (Chrome 57+, Firefox 53+, Safari 11+, Edge 16+).",
  })
  const howToSchema = buildHowToSchema(
    `How to use ${tool.name}`,
    profile.description,
    [
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
    ]
  )

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-background">
      <Script
        id={`tool-webapp-schema-${tool.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(webApplicationSchema) }}
      />
      <Script
        id={`tool-faq-schema-${tool.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(faqSchema) }}
      />
      <Script
        id={`tool-howto-schema-${tool.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(howToSchema) }}
      />
      

      <main className="flex-1">
        <div className="mx-auto w-full max-w-6xl px-4 py-12 md:py-14">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">{tool.name}</h1>
          <p className="mt-3 mb-8 max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
            {profile.description}
          </p>

          {tool.available ? (
            <>
              <section className="mb-8 rounded-xl border border-border bg-card/60 p-5">
                <p className="text-sm font-medium text-foreground">
                  {tool.category !== "AI Assistant"
                    ? "Processed locally in your browser. Files never leave your device."
                    : "Text is extracted locally first. AI response requires explicit opt-in."}
                </p>
                <ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-muted-foreground">
                  {profile.trustPoints.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
                <p className="mt-3 text-xs text-muted-foreground">{profile.limitation}</p>
              </section>

              <Suspense fallback={<div>Loading tool...</div>}>
                <ErrorBoundary context={`tool:${tool.slug}`}>
                  <ToolComponent />
                </ErrorBoundary>
              </Suspense>

              {seo ? (
                <div className="mt-8 rounded-lg border border-white/[0.1] bg-muted/20 p-4 text-sm text-muted-foreground">
                  Learn more about this workflow:{" "}
                  <a
                    href={seo.learnHref}
                    className="font-medium text-accent hover:underline"
                  >
                    {seo.learnLabel}
                  </a>
                </div>
              ) : null}

              <ToolRelatedLinks toolSlug={tool.slug} className="mt-6" />
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

      
    </div>
  )
}
