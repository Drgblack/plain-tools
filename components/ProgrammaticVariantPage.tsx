import Link from "next/link"
import { Suspense } from "react"

import { ErrorBoundary } from "@/components/error-boundary"
import { FaqBlock } from "@/components/seo/faq-block"
import { JsonLd } from "@/components/seo/json-ld"
import { PageBreadcrumbs } from "@/components/seo/page-breadcrumbs"
import { RelatedLinks } from "@/components/seo/related-links"
import { VerifyLocalProcessing } from "@/components/verify-local-processing"
import { FallbackToolComponent, toolComponents } from "@/components/tools/tool-component-registry"
import { buildCanonicalUrl } from "@/lib/page-metadata"
import {
  getRelatedToolVariantPages,
  getVariantModifierDefinition,
  type ToolVariantPageDefinition,
} from "@/lib/tools-matrix"
import { getToolBySlug } from "@/lib/tools-catalogue"
import {
  buildBreadcrumbList,
  buildFaqPageSchema,
  buildHowToSchema,
  buildSoftwareApplicationSchema,
  buildWebPageSchema,
  combineJsonLd,
} from "@/lib/structured-data"

type ProgrammaticVariantPageProps = {
  page: ToolVariantPageDefinition
}

function formatGuideLabel(path: string) {
  return path
    .split("/")
    .filter(Boolean)
    .at(-1)
    ?.replace(/-/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase()) ?? path
}

export function ProgrammaticVariantPage({ page }: ProgrammaticVariantPageProps) {
  const tool = getToolBySlug(page.toolSlug)
  const modifier = getVariantModifierDefinition(page.modifierSlug)
  const ToolComponent = toolComponents[page.toolSlug] ?? FallbackToolComponent
  const canonical = buildCanonicalUrl(page.path)
  const siblingVariants = getRelatedToolVariantPages(page.toolSlug, page.modifierSlug, 5).map(
    (entry) => ({
      label: entry.h1,
      href: entry.path,
    })
  )
  const relatedToolLinks = page.relatedToolSlugs
    .map((slug) => {
      const relatedTool = getToolBySlug(slug)
      if (!relatedTool) return null
      return {
        label: relatedTool.name,
        href: `/tools/${relatedTool.slug}`,
      }
    })
    .filter(Boolean) as Array<{ label: string; href: string }>
  const relatedGuideLinks = page.relatedGuidePaths.map((path) => ({
    label: formatGuideLabel(path),
    href: path,
  }))

  const schema = combineJsonLd([
    buildWebPageSchema({
      name: page.title,
      description: page.metaDescription,
      url: canonical,
    }),
    buildSoftwareApplicationSchema({
      name: page.h1,
      description: page.metaDescription,
      url: canonical,
      featureList: [
        tool?.description ?? `${page.h1} runs in your browser for the core workflow.`,
        "Core file handling stays on your device during processing",
        "No upload step is required for the local workflow",
        "Practical checks and caveats are visible before you start",
      ],
    }),
    buildHowToSchema(
      `How to use ${page.h1}`,
      page.metaDescription,
      page.steps.map((step) => ({
        name: step.title,
        text: step.text,
      }))
    ),
    buildFaqPageSchema(page.faq),
    buildBreadcrumbList([
      { name: "Home", url: "https://plain.tools/" },
      { name: "Tools", url: "https://plain.tools/tools" },
      { name: tool?.name ?? page.toolSlug, url: `https://plain.tools/tools/${page.toolSlug}` },
      { name: page.h1, url: canonical },
    ]),
  ])

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-background">
      {schema ? <JsonLd id={`tool-variant-schema-${page.slug.replace(/\//g, "-")}`} schema={schema} /> : null}

      <main className="flex-1">
        <div className="mx-auto w-full max-w-6xl px-4 py-12 md:py-14">
          <PageBreadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Tools", href: "/tools" },
              { label: tool?.name ?? page.toolSlug, href: `/tools/${page.toolSlug}` },
              { label: page.h1 },
            ]}
            className="mb-4"
          />

          <header className="max-w-4xl space-y-4">
            <div className="inline-flex rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-accent">
              Tool intent variant
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              {page.h1}
            </h1>
            <div className="space-y-4">
              {page.introParagraphs.map((paragraph) => (
                <p
                  key={paragraph}
                  className="text-base leading-relaxed text-muted-foreground md:text-[1.03rem]"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </header>

          <section className="mt-8 grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
            <div className="rounded-2xl border border-border/80 bg-card/60 p-5 shadow-[0_12px_40px_-28px_rgba(0,112,243,0.35)] md:p-6">
              <h2 className="text-lg font-semibold tracking-tight text-foreground md:text-xl">
                How it works locally
              </h2>
              <div className="mt-3 space-y-4 text-sm leading-relaxed text-muted-foreground md:text-base">
                {page.howItWorksParagraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>

            <aside className="rounded-2xl border border-border/80 bg-card/60 p-5 shadow-[0_12px_40px_-28px_rgba(0,112,243,0.35)] md:p-6">
              <h2 className="text-lg font-semibold tracking-tight text-foreground md:text-xl">
                Trust block
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {modifier?.privacyAngle ??
                  "The core workflow stays in your browser so you can inspect what happens before you trust the result."}
              </p>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                {page.trustPoints.map((point) => (
                  <li
                    key={point}
                    className="rounded-xl border border-border/70 bg-background/60 px-3 py-2"
                  >
                    {point}
                  </li>
                ))}
              </ul>
              <div className="mt-4 rounded-xl border border-accent/25 bg-accent/10 p-3 text-sm font-medium text-foreground">
                {page.ctaText}
              </div>
            </aside>
          </section>

          <section className="mt-10">
            <div className="mb-4">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                Try the live tool
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                This variant page uses the same underlying workflow as{" "}
                <Link href={`/tools/${page.toolSlug}`} className="font-medium text-accent hover:underline">
                  {tool?.name ?? "the canonical tool page"}
                </Link>
                , with guidance tuned to this specific use case.
              </p>
            </div>
            <Suspense
              fallback={
                <div className="rounded-xl border border-border/70 bg-card/40 p-4 text-sm text-muted-foreground">
                  Loading tool workspace...
                </div>
              }
            >
              <ErrorBoundary context={`tool-variant:${page.slug}`}>
                <ToolComponent />
              </ErrorBoundary>
            </Suspense>
          </section>

          <section className="mt-10 rounded-2xl border border-border/80 bg-card/60 p-5 shadow-[0_12px_40px_-28px_rgba(0,112,243,0.35)] md:p-6">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              Step-by-step guide
            </h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {page.steps.map((step, index) => (
                <article
                  key={step.title}
                  className="rounded-xl border border-border/70 bg-background/60 p-4"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent/90">
                    Step {index + 1}
                  </p>
                  <h3 className="mt-2 text-base font-semibold text-foreground">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {step.text}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <VerifyLocalProcessing />

          <section className="mt-10 rounded-2xl border border-border/80 bg-card/60 p-5 shadow-[0_12px_40px_-28px_rgba(0,112,243,0.35)] md:p-6">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              Limitations and caveats
            </h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {page.limitations.map((item) => (
                <article
                  key={item}
                  className="rounded-xl border border-border/70 bg-background/60 p-4 text-sm leading-relaxed text-muted-foreground"
                >
                  {item}
                </article>
              ))}
            </div>
          </section>

          <div className="mt-10">
            <FaqBlock faqs={page.faq} />
          </div>

          <div className="mt-10">
            <RelatedLinks
              heading="Related tools and variants"
              sections={[
                {
                  title: "Parent tool",
                  links: [
                    {
                      label: tool?.name ?? page.toolSlug,
                      href: `/tools/${page.toolSlug}`,
                    },
                  ],
                },
                { title: "Related tools", links: relatedToolLinks },
                { title: "Related variants", links: siblingVariants },
                { title: "Related guides", links: relatedGuideLinks },
              ]}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
