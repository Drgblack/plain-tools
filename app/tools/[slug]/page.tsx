import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { Suspense } from "react"

import { AdAfterResult, AdContentTop, AdToolSidebar } from "@/components/ads/tool-page-ad-slots"
import { ErrorBoundary } from "@/components/error-boundary"
import { CanonicalSelf } from "@/components/seo/canonical-self"
import { ToolFaqBlock } from "@/components/seo/tool-faq-block"
import { ToolRelatedLinks } from "@/components/seo/tool-related-links"
import { PageBreadcrumbs } from "@/components/seo/page-breadcrumbs"
import { SsrContentDebug } from "@/components/seo/ssr-content-debug"
import { ToolAnswerFirst } from "@/components/seo/tool-answer-first"
import { ToolIntentLinks } from "@/components/intent/tool-intent-links"
import { ToolSeoContent } from "@/components/tool-seo-content"
import { buildMetaDescription, buildPageMetadata } from "@/lib/page-metadata"
import { getToolSeoLinks } from "@/lib/seo/tranche1-link-map"
import { getToolBySlug, TOOL_CATALOGUE } from "@/lib/tools-catalogue"
import { getToolSeoEntry } from "@/lib/seo-route-map"
import { buildToolHowToSteps, buildToolSeoDescription, getToolPageProfile } from "@/lib/tool-page-content"
import { buildStandardToolIntro } from "@/lib/tool-intro"
import {
  buildToolProblemMetadata,
  getToolProblemPage,
  getToolProblemPagesForTool,
  TOOL_PROBLEM_PAGE_SLUGS,
} from "@/lib/tool-problem-pages"
import { ToolProblemPage } from "@/components/seo/ToolProblemPage"
import {
  FallbackToolComponent,
  type RegisteredToolComponent,
  toolComponents,
} from "@/components/tools/tool-component-registry"
import { getToolVariantPagesForTool } from "@/lib/tools-matrix"

type ToolRouteParams = { slug: string }

type PageProps = {
  params: Promise<ToolRouteParams>
}

export const dynamic = "force-static"

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
  if (category === "AI Assistant") {
    return buildStandardToolIntro(description, "ai")
  }

  if (category === "Network Tools") {
    return buildStandardToolIntro(description, "network")
  }

  return buildStandardToolIntro(description, "local")
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
  const body = /no upload|local|browser/i.test(cleanedDescription)
    ? cleanedDescription
    : `${cleanedDescription} Fast local processing with no upload step.`

  return buildMetaDescription(
    `${intro} No upload, no account, and privacy-first local processing. ${body}`
  )
}

export async function generateStaticParams() {
  const canonicalToolParams = TOOL_CATALOGUE.filter((tool) => tool.available).map((tool) => ({
    slug: tool.slug,
  }))
  const problemPageParams = TOOL_PROBLEM_PAGE_SLUGS.map((slug) => ({ slug }))

  return [...canonicalToolParams, ...problemPageParams]
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const slug = await resolveToolSlug(params)
  const tool = getToolBySlug(slug)
  const problemPageMetadata = buildToolProblemMetadata(slug)

  if (problemPageMetadata) {
    return problemPageMetadata
  }

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
  const problemPage = getToolProblemPage(slug)
  const seo = getToolSeoEntry(slug)

  if (problemPage) {
    return <ToolProblemPage {...problemPage} />
  }

  if (!tool) {
    notFound()
  }

  const ToolComponent: RegisteredToolComponent = tool.available
    ? toolComponents[tool.slug] ?? FallbackToolComponent
    : FallbackToolComponent
  const profile = getToolPageProfile(tool)
  const introLead = buildToolLeadParagraph(profile.description, tool.category)
  const seoLinks = getToolSeoLinks(tool.slug)
  const relatedProblemPages = getToolProblemPagesForTool(tool.slug)
  const relatedVariantPages = getToolVariantPagesForTool(tool.slug).slice(0, 6)

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-background">
      <CanonicalSelf path={`/tools/${slug}`} />
      <SsrContentDebug routeId={`/tools/${slug}`} />
      <main className="flex-1">
        <div className="mx-auto w-full max-w-6xl px-4 py-12 md:py-14" data-plain-ssr-content>
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
              <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-start">
                <div>
                  <AdContentTop className="mb-8" />

                  <section className="mb-3">
                    <h2 className="text-base font-semibold tracking-tight text-foreground md:text-lg">Tool workspace</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Upload your file, choose options, and download the processed output in the result area.
                    </p>
                  </section>

                  <section
                    className="notranslate"
                    data-plain-tool-shell
                    translate="no"
                  >
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
                  </section>

                  <section className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4 text-center text-sm font-medium text-green-800 dark:border-green-900/40 dark:bg-green-950/20 dark:text-green-300">
                    This tool is completely free. Enjoy unlimited basic use - no account needed.
                  </section>

                  <section
                    className="mt-6 rounded-xl border border-border/70 bg-card/40 p-4 text-sm notranslate"
                    translate="no"
                  >
                    <p className="font-medium text-foreground">Result section</p>
                    <p className="mt-1 text-muted-foreground">
                      When processing finishes, a download action appears below. If output quality is not ideal, adjust options and run again.
                    </p>
                  </section>

                  <AdAfterResult className="mt-6" />

                  <section className="mt-6 rounded-2xl border border-border/80 bg-card/65 p-5 shadow-[0_12px_38px_-28px_rgba(0,112,243,0.35)] md:p-6">
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

                  <section className="mt-6 rounded-xl border border-border/70 bg-card/40 p-4 text-sm">
                    <p className="font-medium text-foreground">Known limitations</p>
                    <p className="mt-1 text-muted-foreground">
                      {profile.limitation} For complex files, run a quick output check before sharing or archiving.
                    </p>
                  </section>

                  {profile.faqs.length > 0 ? (
                    <ToolFaqBlock faqs={profile.faqs} className="mt-6" />
                  ) : null}

                  {relatedProblemPages.length > 0 ? (
                    <section className="mt-6 rounded-xl border border-border/70 bg-card/40 p-4 md:p-5">
                      <h2 className="text-base font-semibold tracking-tight text-foreground md:text-lg">
                        Related problem pages
                      </h2>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Prefer a page tailored to a specific constraint or user situation? These
                        routes use the same underlying tool with more focused guidance.
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {relatedProblemPages.map((page) => (
                          <a
                            key={page.slug}
                            href={`/tools/${page.slug}`}
                            className="rounded-full border border-border/70 bg-background/70 px-3 py-2 text-sm font-medium text-accent transition-colors hover:border-accent/40 hover:text-accent/90"
                          >
                            {page.h1}
                          </a>
                        ))}
                      </div>
                    </section>
                  ) : null}

                  {relatedVariantPages.length > 0 ? (
                    <section className="mt-6 rounded-xl border border-border/70 bg-card/40 p-4 md:p-5">
                      <h2 className="text-base font-semibold tracking-tight text-foreground md:text-lg">
                        Popular task variants
                      </h2>
                      <p className="mt-2 text-sm text-muted-foreground">
                        These routes answer common modifier searches such as offline, no-upload,
                        mobile, large-file, and sharing-specific workflows while reusing the same
                        core tool.
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {relatedVariantPages.map((page) => (
                          <a
                            key={page.slug}
                            href={page.path}
                            className="rounded-full border border-border/70 bg-background/70 px-3 py-2 text-sm font-medium text-accent transition-colors hover:border-accent/40 hover:text-accent/90"
                          >
                            {page.h1}
                          </a>
                        ))}
                      </div>
                    </section>
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
                </div>

                <aside className="hidden xl:block xl:sticky xl:top-24">
                  <AdToolSidebar />
                  <div className="mt-6 rounded-xl border border-border/70 bg-card/40 p-4 text-sm text-muted-foreground">
                    <p className="font-medium text-foreground">Before you share the output</p>
                    <p className="mt-2">
                      Check the result, confirm formatting, and use{" "}
                      <a href="/verify-claims" className="font-medium text-accent hover:underline">
                        verify claims
                      </a>{" "}
                      if you need a repeatable privacy check for local processing.
                    </p>
                  </div>
                </aside>
              </div>
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
