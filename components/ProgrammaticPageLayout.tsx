import Link from "next/link"
import type { ReactNode } from "react"

import { FaqBlock } from "@/components/seo/faq-block"
import { JsonLd } from "@/components/seo/json-ld"
import { PageBreadcrumbs } from "@/components/seo/page-breadcrumbs"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { VerifyLocalProcessing } from "@/components/verify-local-processing"
import { cn } from "@/lib/utils"
import { type ProgrammaticPageData } from "@/lib/programmatic-content"
import {
  buildBreadcrumbList,
  buildFaqPageSchema,
  buildSoftwareApplicationSchema,
  combineJsonLd,
  type JsonLdObject,
} from "@/lib/structured-data"

type ProgrammaticPageLayoutProps = {
  liveTool?: ReactNode
  page: ProgrammaticPageData
  schema?: JsonLdObject | null
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

export function ProgrammaticPageLayout({
  liveTool,
  page,
  schema,
}: ProgrammaticPageLayoutProps) {
  const combinedSchema = combineJsonLd([
    ...(schema ? [schema] : []),
    buildSoftwareApplicationSchema({
      name: `${page.tool.name} ${page.paramLabel}`,
      description: page.description,
      url: `https://plain.tools${page.canonicalPath}`,
      featureList: [
        "100% local browser processing for the core workflow",
        "No upload step for the main task",
        "Privacy-first explanations and review guidance",
        "Related internal tool cluster for the next constraint",
      ],
    }),
    buildFaqPageSchema(page.faq),
    buildBreadcrumbList([
      { name: "Home", url: "https://plain.tools/" },
      { name: "Tools", url: "https://plain.tools/tools" },
      { name: page.tool.name, url: `https://plain.tools/tools/${page.tool.slug}` },
      { name: page.paramLabel, url: `https://plain.tools${page.canonicalPath}` },
    ]),
  ])

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-background">
      {combinedSchema ? (
        <JsonLd
          id={`programmatic-page-schema-${page.tool.slug}-${page.paramSlug}`}
          schema={combinedSchema}
        />
      ) : null}

      <main className="flex-1">
        <div className="mx-auto w-full max-w-6xl px-4 py-12 md:py-14">
          <PageBreadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Tools", href: "/tools" },
              { label: page.tool.name, href: `/tools/${page.tool.slug}` },
              { label: page.paramLabel },
            ]}
            className="mb-4"
          />

          <header className="max-w-4xl space-y-4">
            <div className="inline-flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-accent">
              <span className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1">
                100% local
              </span>
              <span className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1">
                no upload
              </span>
              <span className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1">
                privacy-first
              </span>
              <span className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1">
                browser-only
              </span>
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              {page.tool.name} {page.paramLabel}
            </h1>
            <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
              {page.intro.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </header>

          <div className="mt-10 grid gap-8 xl:grid-cols-[minmax(0,1fr)_340px]">
            <div className="space-y-8">
              <Section title="Why Users Need This">
                {page.whyUsersNeedThis.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </Section>

              <Section title="How It Works">
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

              <VerifyLocalProcessing />

              <Section title="Privacy Note">
                {page.privacyNote.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </Section>

              <div>
                <FaqBlock faqs={page.faq} />
              </div>

              <section className="space-y-4">
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                    Related Tools
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">
                    Keep users inside the same intent cluster. Each related link solves the next
                    likely constraint without forcing them back to search results.
                  </p>
                </div>

                <Carousel
                  opts={{ align: "start", containScroll: "trimSnaps" }}
                  className="px-10"
                >
                  <CarouselContent>
                    {page.relatedTools.map((tool) => (
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
                  Try the Live Tool
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  This workspace stays browser-only for the core local workflow. Use the real file,
                  review the output, then download the result on-device.
                </p>
                <div className="mt-4">{liveTool}</div>
              </section>

              <section className="rounded-2xl border border-border/80 bg-card/60 p-5 shadow-[0_12px_40px_-28px_rgba(0,112,243,0.35)]">
                <h2 className="text-lg font-semibold tracking-tight text-foreground">
                  Canonical Tool Route
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  The broad product route stays canonical. This programmatic page narrows the use
                  case and links back into the core tool experience.
                </p>
                <Link
                  href={`/tools/${page.tool.slug}`}
                  className="mt-4 inline-flex text-sm font-medium text-accent hover:underline"
                >
                  Open {page.tool.name}
                </Link>
              </section>
            </aside>
          </div>
        </div>
      </main>
    </div>
  )
}
