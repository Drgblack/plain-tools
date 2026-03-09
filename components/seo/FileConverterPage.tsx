import Link from "next/link"

import { CanonicalSelf } from "@/components/seo/canonical-self"
import { FaqBlock } from "@/components/seo/faq-block"
import { FileConverterToolEmbed } from "@/components/seo/file-converter-tool-embed"
import { JsonLd } from "@/components/seo/json-ld"
import { PageBreadcrumbs } from "@/components/seo/page-breadcrumbs"
import { RelatedLinks } from "@/components/seo/related-links"
import { SsrContentDebug } from "@/components/seo/ssr-content-debug"
import { VerifyLocalProcessing } from "@/components/verify-local-processing"
import type { FileConverterSeoPage } from "@/lib/file-converter-slugs"
import {
  buildBreadcrumbList,
  buildFaqPageSchema,
  buildHowToSchema,
  buildSoftwareApplicationSchema,
  buildWebPageSchema,
  combineJsonLd,
} from "@/lib/structured-data"

type FileConverterPageProps = {
  page: FileConverterSeoPage
}

export function FileConverterPage({ page }: FileConverterPageProps) {
  const schema = combineJsonLd([
    buildWebPageSchema({
      name: page.title,
      description: page.metaDescription,
      url: `https://plain.tools${page.path}`,
    }),
    buildSoftwareApplicationSchema({
      name: page.h1,
      description: page.metaDescription,
      url: `https://plain.tools${page.path}`,
      featureList: [
        `Convert ${page.from.seoLabel} to ${page.to.seoLabel} in a privacy-first workflow`,
        "No upload for the core conversion path",
        "Browser-only processing where the format is supported locally",
        "Internal links to adjacent converters and core Plain Tools workflows",
      ],
    }),
    buildHowToSchema(
      `How to convert ${page.from.seoLabel} to ${page.to.seoLabel}`,
      page.metaDescription,
      page.steps.map((step) => ({
        name: step.title,
        text: step.text,
      }))
    ),
    buildFaqPageSchema(page.faq),
    buildBreadcrumbList([
      { name: "Home", url: "https://plain.tools/" },
      { name: "File Converters", url: "https://plain.tools/file-converters" },
      { name: page.title, url: `https://plain.tools${page.path}` },
    ]),
  ])

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-background">
      <CanonicalSelf path={page.path} />
      <SsrContentDebug routeId={page.path} />
      {schema ? <JsonLd id={`file-converter-${page.slug}-schema`} schema={schema} /> : null}

      <main className="flex-1" data-plain-ssr-content>
        <div className="mx-auto w-full max-w-6xl px-4 py-12 md:py-14">
          <PageBreadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "File Converters", href: "/file-converters" },
              { label: page.h1 },
            ]}
            className="mb-4"
          />

          <header className="max-w-4xl space-y-4">
            <div className="inline-flex rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-accent">
              File converter slug
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
                Why this conversion page exists
              </h2>
              <div className="mt-3 space-y-4 text-sm leading-relaxed text-muted-foreground md:text-base">
                <p>
                  Search intent here is specific. People are not looking for a general tool index;
                  they want a direct {page.from.seoLabel} to {page.to.seoLabel} path with no
                  upload and a realistic explanation of how the conversion behaves.
                </p>
                <p>
                  The page embeds the live tool, adds format-specific guidance, and keeps the
                  internal linking focused on adjacent conversions that a user is genuinely likely
                  to need next.
                </p>
              </div>
            </div>

            <aside className="rounded-2xl border border-border/80 bg-card/60 p-5 shadow-[0_12px_40px_-28px_rgba(0,112,243,0.35)] md:p-6">
              <h2 className="text-lg font-semibold tracking-tight text-foreground md:text-xl">
                Privacy-first trust block
              </h2>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li className="rounded-xl border border-border/70 bg-background/60 px-3 py-2">
                  No upload for the core conversion path
                </li>
                <li className="rounded-xl border border-border/70 bg-background/60 px-3 py-2">
                  Browser-only processing where supported
                </li>
                <li className="rounded-xl border border-border/70 bg-background/60 px-3 py-2">
                  Clear caveats when browser format support is limited
                </li>
              </ul>
              <Link
                href={page.canonicalToolHref}
                className="mt-4 inline-flex text-sm font-medium text-accent hover:underline"
              >
                Open the canonical tool
              </Link>
            </aside>
          </section>

          <section className="mt-10">
            <div className="mb-4">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                Live converter workspace
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                The tool below runs the actual conversion flow for this slug instead of forcing
                users through a second navigation step.
              </p>
            </div>
            <FileConverterToolEmbed page={page} />
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

          <div className="mt-10 space-y-10">
            {page.sections.map((section) => (
              <section
                key={section.id}
                className="rounded-2xl border border-border/80 bg-card/60 p-5 shadow-[0_12px_40px_-28px_rgba(0,112,243,0.35)] md:p-6"
              >
                <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                  {section.heading}
                </h2>
                <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground md:text-base">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
                {section.bullets ? (
                  <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-muted-foreground md:text-base">
                    {section.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}
          </div>

          <VerifyLocalProcessing />

          <div className="mt-10">
            <FaqBlock faqs={page.faq} />
          </div>

          <div className="mt-10">
            <RelatedLinks
              heading="Related converters and tools"
              sections={[
                { title: `More ${page.from.seoLabel} converters`, links: page.relatedConverters.sameInput },
                { title: `${page.to.seoLabel} output alternatives`, links: page.relatedConverters.sameOutput },
                { title: "Canonical tools", links: page.relatedConverters.supportingTools },
              ]}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
