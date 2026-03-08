import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { lazy, Suspense, type ComponentType, type LazyExoticComponent } from "react"

import { ErrorBoundary } from "@/components/error-boundary"
import { JsonLd } from "@/components/seo/json-ld"
import { ToolFaqBlock } from "@/components/seo/tool-faq-block"
import { ToolRelatedLinks } from "@/components/seo/tool-related-links"
import { PageBreadcrumbs } from "@/components/seo/page-breadcrumbs"
import { ToolAnswerFirst } from "@/components/seo/tool-answer-first"
import { ToolIntentLinks } from "@/components/intent/tool-intent-links"
import { ToolSeoContent } from "@/components/tool-seo-content"
import { buildMetaDescription, buildPageMetadata } from "@/lib/page-metadata"
import { getToolSeoLinks } from "@/lib/seo/tranche1-link-map"
import { getToolBySlug, TOOL_CATALOGUE } from "@/lib/tools-catalogue"
import { getToolSeoEntry } from "@/lib/seo-route-map"
import { buildToolHowToSteps, buildToolSeoDescription, getToolPageProfile } from "@/lib/tool-page-content"
import { buildToolSchema } from "@/lib/tool-schema"

type ToolRouteParams = { slug: string }

type PageProps = {
  params: Promise<ToolRouteParams>
}

type ToolComponent = ComponentType | LazyExoticComponent<ComponentType>

const INTENT_TOOL_SLUGS = new Set([
  "compress-pdf",
  "merge-pdf",
  "pdf-to-word",
  "word-to-pdf",
  "split-pdf",
  "pdf-to-jpg",
  "jpg-to-pdf",
  "watermark-pdf",
  "sign-pdf",
  "protect-pdf",
  "unlock-pdf",
  "fill-pdf",
  "reorder-pdf",
  "annotate-pdf",
  "compare-pdf",
  "ocr-pdf",
  "offline-ocr",
  "pdf-to-excel",
  "pdf-to-ppt",
  "html-to-pdf",
  "pdf-to-html",
  "pdf-to-markdown",
  "text-to-pdf",
])

const toolComponents: Record<string, ToolComponent> = {
  "merge-pdf": lazy(() => import("@/components/tools/merge-pdf-tool")),
  "split-pdf": lazy(() => import("@/components/tools/split-pdf-tool")),
  "compare-pdf": lazy(() => import("@/components/tools/compare-pdf-tool")),
  "rotate-pdf": lazy(() => import("@/components/tools/rotate-pdf-tool")),
  "annotate-pdf": lazy(() => import("@/components/tools/annotate-pdf-tool")),
  "watermark-pdf": lazy(() => import("@/components/tools/watermark-pdf-tool")),
  "fill-pdf": lazy(() => import("@/components/tools/fill-pdf-tool")),
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
  "local-signer": lazy(() => import("@/components/tools/local-signer-tool")),
  "word-to-pdf": lazy(() => import("@/components/tools/word-to-pdf-tool")),
  "pdf-to-jpg": lazy(() => import("@/components/tools/pdf-to-jpg-tool")),
  "pdf-to-excel": lazy(() => import("@/components/tools/pdf-to-excel-tool")),
  "pdf-to-ppt": lazy(() => import("@/components/tools/pdf-to-ppt-tool")),
  "pdf-to-html": lazy(() => import("@/components/tools/pdf-to-html-tool")),
  "html-to-pdf": lazy(() => import("@/components/tools/html-to-pdf-tool")),
  "jpg-to-pdf": lazy(() => import("@/components/tools/jpg-to-pdf-tool")),
  "text-to-pdf": lazy(() => import("@/components/tools/text-to-pdf-tool")),
  "reorder-pdf": lazy(() => import("@/components/tools/webgpu-organiser-tool")),
  "image-compress": lazy(() => import("@/components/tools/image-compress-tool")),
  "file-hash": lazy(() => import("@/components/tools/file-hash-tool")),
  "qr-code": lazy(() => import("@/components/tools/qr-code-tool")),
}

const FallbackToolComponent = () => <div>Tool UI coming soon</div>

const resolveToolSlug = async (params: Promise<ToolRouteParams>) => {
  const { slug } = await params
  return slug
}

function normaliseToolMetadataTitle(rawTitle: string, fallbackToolName: string) {
  const cleaned = rawTitle.replace("Plain.tools", "Plain Tools")
  const withoutBrand = cleaned
    .replace(/\|\s*Plain Tools$/i, "")
    .replace(/\s+-\s+Plain Tools$/i, "")
    .trim()
  if (!withoutBrand) return fallbackToolName
  if (withoutBrand.length > 70) return fallbackToolName
  if (/^(plain tools|tool)$/i.test(withoutBrand)) return fallbackToolName
  return withoutBrand
}

function buildToolLeadParagraph(description: string, category: string) {
  if (category === "AI Assistant") return description
  if (/files?\s+never\s+leave\s+your\s+device/i.test(description)) return description
  return `${description} Files never leave your device.`
}

const TOOL_META_INTROS: Record<string, string> = {
  "merge-pdf": "Merge multiple PDFs entirely in your browser with Plain Tools.",
  "compress-pdf": "Compress PDF files entirely in your browser with Plain Tools.",
  "split-pdf": "Split PDF pages entirely in your browser with Plain Tools.",
  "pdf-to-word": "Convert PDF to Word entirely in your browser with Plain Tools.",
  "word-to-pdf": "Convert Word to PDF entirely in your browser with Plain Tools.",
  "sign-pdf": "Sign PDF files entirely in your browser with Plain Tools.",
  "protect-pdf": "Protect PDF files with a password entirely in your browser with Plain Tools.",
  "unlock-pdf": "Unlock PDF files entirely in your browser with Plain Tools.",
  "merge": "Use this tool entirely in your browser with Plain Tools.",
}

function buildToolMetaDescription(slug: string, toolName: string, description: string) {
  const cleanedDescription = description.replace(/\s+/g, " ").trim()
  const intro =
    TOOL_META_INTROS[slug] ??
    `${toolName} runs entirely in your browser with Plain Tools.`
  const body =
    /no upload|local|browser/i.test(cleanedDescription)
      ? cleanedDescription
      : `${cleanedDescription} Fast, private local processing with no upload step.`

  return buildMetaDescription(`${intro} No upload, no account, and verifiable local processing. ${body}`)
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
    return buildPageMetadata({
      title: "Tool not found",
      description:
        "The requested tool could not be found. Browse available Plain Tools workflows for local processing and practical document tasks.",
      path: "/tools",
      image: "/og/tools.png",
    })
  }

  const profile = getToolPageProfile(tool)
  const description = buildToolMetaDescription(slug, tool.name, profile.description)
  const title = normaliseToolMetadataTitle(profile.title, tool.name)
  const baseMetadata = buildPageMetadata({
    title,
    description,
    path: `/tools/${slug}`,
    image: "/og/tools.png",
  })

  return {
    ...baseMetadata,
    alternates: {
      ...baseMetadata.alternates,
      languages: {
        en: `https://plain.tools/tools/${slug}`,
        de: `https://plain.tools/tools/${slug}`,
        "x-default": `https://plain.tools/tools/${slug}`,
      },
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
  const introLead = buildToolLeadParagraph(profile.description, tool.category)
  const seoLinks = getToolSeoLinks(tool.slug)
  const toolSchema = buildToolSchema({
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

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-background">
      {toolSchema ? <JsonLd id={`tool-schema-${tool.slug}`} schema={toolSchema} /> : null}
      

      <main className="flex-1">
        <div className="mx-auto w-full max-w-6xl px-4 py-12 md:py-14">
          <PageBreadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Tools", href: "/tools" },
              { label: tool.name },
            ]}
            className="mb-4"
          />
          <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">{tool.name}</h1>
          <p className="mt-3 mb-8 max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
            {introLead}
          </p>

          {tool.available ? (
            <>
              <section className="mb-8 rounded-2xl border border-border/80 bg-card/65 p-5 shadow-[0_12px_38px_-28px_rgba(0,112,243,0.35)] md:p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent/90">
                  Privacy and trust
                </p>
                <p className="mt-2 text-sm font-medium text-foreground">
                  {tool.category !== "AI Assistant"
                    ? "Processed locally in your browser. Files never leave your device."
                    : "Text is extracted locally first. AI response requires explicit opt-in."}
                </p>
                <ul className="mt-3 list-disc space-y-1.5 pl-4 text-xs text-muted-foreground">
                  {profile.trustPoints.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
                <p className="mt-3 text-xs text-muted-foreground">{profile.limitation}</p>
              </section>

              <ToolAnswerFirst toolName={tool.name} content={profile.answerFirst} />

              <ToolSeoContent
                toolName={tool.name}
                description={buildToolSeoDescription(tool, profile)}
                steps={buildToolHowToSteps(tool)}
                faq={profile.faqs}
                relatedTools={seoLinks?.relatedTools ?? []}
              />

              <section className="mb-3">
                <h2 className="text-base font-semibold tracking-tight text-foreground md:text-lg">Tool workspace</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Upload your file, choose options, and download the processed output in the result area.
                </p>
              </section>

              <Suspense
                fallback={
                  <div className="rounded-xl border border-border/70 bg-card/40 p-4 text-sm text-muted-foreground">
                    Loading tool workspace...
                  </div>
                }
              >
                <ErrorBoundary context={`tool:${tool.slug}`}>
                  <ToolComponent />
                </ErrorBoundary>
              </Suspense>

              <section className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4 text-center text-sm font-medium text-green-800 dark:border-green-900/40 dark:bg-green-950/20 dark:text-green-300">
                This tool is completely free. Enjoy unlimited basic use - no account needed.
              </section>

              <section className="mt-6 rounded-xl border border-border/70 bg-card/40 p-4 text-sm">
                <p className="font-medium text-foreground">Result experience</p>
                <p className="mt-1 text-muted-foreground">
                  When processing finishes, a download action appears below. If output quality is not ideal, adjust options and run again.
                </p>
              </section>

              <section className="mt-6 rounded-xl border border-border/70 bg-card/40 p-4 text-sm">
                <p className="font-medium text-foreground">Known limitations</p>
                <p className="mt-1 text-muted-foreground">
                  {profile.limitation} For complex files, run a quick output check before sharing or archiving.
                </p>
              </section>

              {profile.faqs.length > 0 ? (
                <ToolFaqBlock faqs={profile.faqs} className="mt-6" />
              ) : null}

              {INTENT_TOOL_SLUGS.has(tool.slug) ? (
                <ToolIntentLinks
                  toolKey={tool.slug as
                    | "compress-pdf"
                    | "merge-pdf"
                    | "pdf-to-word"
                    | "word-to-pdf"
                    | "split-pdf"
                    | "pdf-to-jpg"
                    | "jpg-to-pdf"
                    | "watermark-pdf"
                    | "sign-pdf"
                    | "protect-pdf"
                    | "unlock-pdf"
                    | "fill-pdf"
                    | "reorder-pdf"
                    | "annotate-pdf"
                    | "compare-pdf"
                    | "ocr-pdf"
                    | "offline-ocr"
                    | "pdf-to-excel"
                    | "pdf-to-ppt"
                    | "html-to-pdf"
                    | "pdf-to-html"
                    | "pdf-to-markdown"
                    | "text-to-pdf"}
                  className="mt-6"
                />
              ) : null}

              {seo ? (
                <div className="mt-6 rounded-xl border border-border/70 bg-card/40 p-4 text-sm text-muted-foreground">
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
              <p className="text-base font-medium text-foreground">Coming soon</p>
              <p className="mt-2 text-sm text-muted-foreground">
                This tool is listed in the catalogue but the interface is still being finalised.
              </p>
            </div>
          )}
        </div>
      </main>

      
    </div>
  )
}
