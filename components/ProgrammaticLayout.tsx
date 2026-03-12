import Link from "next/link"
import type { ReactNode } from "react"

import { CanonicalSelf } from "@/components/seo/canonical-self"
import { FaqBlock } from "@/components/seo/faq-block"
import { JsonLd } from "@/components/seo/json-ld"
import { PageBreadcrumbs } from "@/components/seo/page-breadcrumbs"
import { RelatedLinks } from "@/components/seo/related-links"
import { SsrContentDebug } from "@/components/seo/ssr-content-debug"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { VerifyLocalProcessing } from "@/components/verify-local-processing"
import { type ProgrammaticPageData } from "@/lib/programmatic-content"
import { buildCanonicalUrl } from "@/lib/page-metadata"
import {
  buildBreadcrumbList,
  buildFaqPageSchema,
  buildSoftwareApplicationSchema,
  combineJsonLd,
  type JsonLdObject,
} from "@/lib/structured-data"
import { cn } from "@/lib/utils"

type ProgrammaticLayoutProps = {
  afterStructuredContent?: ReactNode
  beforeStructuredContent?: ReactNode
  breadcrumbs?: Array<{ href?: string; label: string }>
  featureList?: string[]
  heroBadges?: string[]
  liveTool?: ReactNode
  liveToolDescription?: string
  liveToolTitle?: string
  page: ProgrammaticPageData
  relatedSectionTitle?: string
  schema?: JsonLdObject | null
  showVerifyLocalProcessing?: boolean
  sidebarSilo?: ReactNode
  siloLinks?: Array<{ href: string; label: string }>
  titleOverride?: string
}

function Section({
  title,
  children,
  className,
}: {
  title: string
  children: ReactNode
  className?: string
}) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-border/80 bg-card/60 p-5 shadow-[0_12px_40px_-28px_rgba(0,112,243,0.35)] md:p-6",
        className
      )}
    >
      <h2 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h2>
      <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground md:text-base">
        {children}
      </div>
    </section>
  )
}

export function ProgrammaticLayout({
  afterStructuredContent,
  beforeStructuredContent,
  breadcrumbs,
  featureList,
  heroBadges,
  liveTool,
  liveToolDescription,
  liveToolTitle,
  page,
  relatedSectionTitle = "Related Tools",
  schema,
  showVerifyLocalProcessing = true,
  sidebarSilo,
  siloLinks,
  titleOverride,
}: ProgrammaticLayoutProps) {
  const canonicalUrl = buildCanonicalUrl(page.canonicalPath)
  const resolvedTitle = titleOverride ?? `${page.tool.name} ${page.paramLabel}`.trim()
  const resolvedBreadcrumbs =
    breadcrumbs ??
    [
      { label: "Home", href: "/" },
      { label: "Tools", href: "/tools" },
      { label: page.tool.name, href: `/tools/${page.tool.slug}` },
      { label: page.paramLabel },
    ]
  const resolvedSiloLinks =
    siloLinks ??
    [
      { label: "PDF hub", href: "/tools" },
      { label: "Tools directory", href: "/tools" },
      { label: `Open ${page.tool.name}`, href: `/tools/${page.tool.slug}` },
    ]

  const combinedSchema = combineJsonLd([
    ...(schema ? [schema] : []),
    buildSoftwareApplicationSchema({
      name: resolvedTitle,
      description: page.description,
      url: canonicalUrl,
      featureList:
        featureList ??
        [
          "100% local browser processing for the core workflow",
          "No upload step for the main task",
          "Privacy-first explanations and review guidance",
          "Related internal tool cluster for the next constraint",
        ],
    }),
    buildFaqPageSchema(page.faq),
    buildBreadcrumbList(
      resolvedBreadcrumbs.map((item) => ({
        name: item.label,
        url: item.href ? buildCanonicalUrl(item.href) : canonicalUrl,
      }))
    ),
  ])

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-background">
      <CanonicalSelf path={page.canonicalPath} />
      <SsrContentDebug routeId={page.canonicalPath} />
      {combinedSchema ? (
        <JsonLd
          id={`programmatic-page-schema-${page.tool.slug}-${page.paramSlug}`}
          schema={combinedSchema}
        />
      ) : null}

      <main className="flex-1" data-plain-ssr-content>
        <div className="mx-auto w-full max-w-6xl px-4 py-12 md:py-14">
          <PageBreadcrumbs
            items={resolvedBreadcrumbs}
            className="mb-4"
          />

          <header className="max-w-4xl space-y-4">
            <div className="inline-flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-accent">
              {(heroBadges ?? [
                "100% local",
                "no upload",
                "privacy-first",
                "browser-only",
              ]).map((badge) => (
                <span
                  key={badge}
                  className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1"
                >
                  {badge}
                </span>
              ))}
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              {resolvedTitle}
            </h1>
            <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
              {page.intro.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </header>

          <div className="mt-10 grid gap-8 xl:grid-cols-[minmax(0,1fr)_340px]">
            <div className="space-y-8">
              <Section title="Problem Explanation">
                {page.whyUsersNeedThis.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </Section>

              <Section title="How-To Steps">
                {page.howItWorks.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                <ol className="space-y-3 pt-1">
                  {page.howToSteps.map((step, index) => (
                    <li
                      key={step.name}
                      className="rounded-xl border border-border/70 bg-background/60 p-4"
                    >
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent/90">
                        Step {index + 1}
                      </p>
                      <h3 className="mt-2 text-base font-semibold text-foreground">
                        {step.name}
                      </h3>
                      <p className="mt-2">{step.text}</p>
                    </li>
                  ))}
                </ol>
              </Section>

              {beforeStructuredContent}

              <section className="grid gap-4 md:grid-cols-3">
                {page.explanationBlocks.map((block) => (
                  <article
                    key={block.title}
                    className="rounded-2xl border border-border/80 bg-card/60 p-5 shadow-[0_12px_40px_-28px_rgba(0,112,243,0.35)]"
                  >
                    <h2 className="text-lg font-semibold tracking-tight text-foreground">
                      {block.title}
                    </h2>
                    <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground">
                      {block.paragraphs.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>
                  </article>
                ))}
              </section>

              {showVerifyLocalProcessing ? <VerifyLocalProcessing /> : null}

              <Section
                title="Privacy-First Callout"
                className="border-accent/20 bg-accent/5"
              >
                {page.privacyNote.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </Section>

              {afterStructuredContent}

              <div>
                <FaqBlock faqs={page.faq} />
              </div>

              <section className="space-y-4">
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                    {relatedSectionTitle}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">
                    Strong internal linking keeps the route inside the same task silo instead of
                    forcing users back to search results after one page.
                  </p>
                </div>

                <RelatedLinks
                  currentPath={page.canonicalPath}
                  heading={relatedSectionTitle}
                />

                <Carousel opts={{ align: "start", containScroll: "trimSnaps" }} className="px-10">
                  <CarouselContent>
                    {page.relatedTools.slice(0, 8).map((tool) => (
                      <CarouselItem
                        key={tool.href}
                        className="basis-full md:basis-1/2 xl:basis-1/3"
                      >
                        <Link
                          href={tool.href}
                          className="block h-full rounded-2xl border border-border/80 bg-card/60 p-5 transition hover:border-accent/40 hover:bg-card"
                        >
                          <h3 className="text-lg font-semibold text-foreground">{tool.name}</h3>
                          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                            {tool.description}
                          </p>
                        </Link>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-0" />
                  <CarouselNext className="right-0" />
                </Carousel>
              </section>
            </div>

            <aside className="space-y-6 xl:sticky xl:top-24 xl:self-start">
              <section
                className="rounded-2xl border border-border/80 bg-card/60 p-5 shadow-[0_12px_40px_-28px_rgba(0,112,243,0.35)] notranslate"
                data-plain-tool-shell
                translate="no"
              >
                <h2 className="text-lg font-semibold tracking-tight text-foreground">
                  {liveToolTitle ?? "Try the Live Tool"}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {liveToolDescription ??
                    "This workspace stays browser-only for the core local workflow. Use the real file, review the output, then download the result on-device."}
                </p>
                <div className="mt-4">{liveTool}</div>
              </section>

              <section className="rounded-2xl border border-border/80 bg-card/60 p-5 shadow-[0_12px_40px_-28px_rgba(0,112,243,0.35)]">
                <h2 className="text-lg font-semibold tracking-tight text-foreground">
                  Internal Link Silo
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Search engines understand the route better when the page links back to its parent
                  tool, sibling variants, and adjacent workflows inside the same document cluster.
                </p>
                <div className="mt-4 space-y-2 text-sm">
                  {resolvedSiloLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block font-medium text-accent hover:underline"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </section>

              {sidebarSilo}
            </aside>
          </div>
        </div>
      </main>
    </div>
  )
}
