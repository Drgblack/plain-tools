import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { CanonicalSelf } from "@/components/seo/canonical-self"
import { FaqBlock } from "@/components/seo/faq-block"
import { JsonLd } from "@/components/seo/json-ld"
import { PageBreadcrumbs } from "@/components/seo/page-breadcrumbs"
import { RelatedLinks } from "@/components/seo/related-links"
import { SsrContentDebug } from "@/components/seo/ssr-content-debug"
import {
  type CompareRouteParams,
  generateAllComparisonParams,
  getComparisonPage,
} from "@/lib/compare-matrix"
import { buildPageMetadata } from "@/lib/page-metadata"
import {
  buildArticleSchema,
  buildBreadcrumbList,
  buildFaqPageSchema,
  buildWebPageSchema,
  combineJsonLd,
} from "@/lib/structured-data"

type PageProps = {
  params: Promise<CompareRouteParams>
}

export const revalidate = 86400
export const dynamicParams = true

function getPrebuildLimit() {
  const raw = process.env.COMPARE_PREBUILD_LIMIT
  if (!raw) return 60
  const value = Number.parseInt(raw, 10)
  return Number.isFinite(value) && value > 0 ? value : 60
}

export function generateStaticParams() {
  return generateAllComparisonParams(getPrebuildLimit())
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const page = getComparisonPage(slug)

  if (!page) {
    return buildPageMetadata({
      title: "Comparison page not found",
      description:
        "The requested comparison route does not exist. Browse Plain Tools comparison pages for privacy-first PDF tool evaluations and local alternatives.",
      path: "/compare",
      image: "/og/compare.png",
      type: "article",
      googleNotranslate: true,
    })
  }

  return buildPageMetadata({
    title: page.title,
    description: page.desc,
    path: page.canonicalPath,
    image: "/og/compare.png",
    type: "article",
    googleNotranslate: true,
  })
}

export default async function CompareSlugPage({ params }: PageProps) {
  const { slug } = await params
  const page = getComparisonPage(slug)

  if (!page) {
    notFound()
  }

  const schema = combineJsonLd([
    buildWebPageSchema({
      name: page.title,
      description: page.desc,
      url: `https://www.plain.tools${page.canonicalPath}`,
    }),
    buildArticleSchema({
      headline: page.title.replace(" | Plain Tools", ""),
      description: page.desc,
      url: `https://www.plain.tools${page.canonicalPath}`,
    }),
    buildFaqPageSchema(page.faq),
    buildBreadcrumbList([
      { name: "Home", url: "https://www.plain.tools/" },
      { name: "Compare", url: "https://www.plain.tools/compare" },
      { name: page.title.replace(" | Plain Tools", ""), url: `https://www.plain.tools${page.canonicalPath}` },
    ]),
  ])

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-background">
      <CanonicalSelf path={page.canonicalPath} />
      <SsrContentDebug routeId={page.canonicalPath} />
      {schema ? <JsonLd id={`compare-${page.slug}-schema`} schema={schema} /> : null}

      <main className="flex-1" data-plain-ssr-content>
        <div className="mx-auto w-full max-w-6xl px-4 py-12 md:py-14">
          <PageBreadcrumbs
            items={[
              { href: "/", label: "Home" },
              { href: "/compare", label: "Compare" },
              { label: page.title.replace(" | Plain Tools", "") },
            ]}
            className="mb-4"
          />

          <header className="max-w-4xl space-y-4">
            <div className="inline-flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-accent">
              {["privacy-first", "feature table", "local vs cloud", "no-upload angle"].map((badge) => (
                <span
                  key={badge}
                  className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1"
                >
                  {badge}
                </span>
              ))}
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              {page.title.replace(" | Plain Tools", "")}
            </h1>
            <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
              {page.intro.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </header>

          <section className="mt-8 grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
            <div className="rounded-2xl border border-border/80 bg-card/60 p-5 shadow-[0_12px_40px_-28px_rgba(0,112,243,0.35)] md:p-6">
              <h2 className="text-lg font-semibold tracking-tight text-foreground md:text-xl">
                Recommendation
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
                {page.recommendation.summary}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
                {page.recommendation.rationale}
              </p>
            </div>

            <aside className="rounded-2xl border border-border/80 bg-card/60 p-5 shadow-[0_12px_40px_-28px_rgba(0,112,243,0.35)] md:p-6">
              <h2 className="text-lg font-semibold tracking-tight text-foreground md:text-xl">
                Plain Tools angle
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Comparison pages on Plain Tools are not just editorial summaries. They are meant to
                send users directly into local PDF workflows if the hosted options feel too upload-heavy
                for the job at hand.
              </p>
            </aside>
          </section>

          <section className="mt-10 rounded-2xl border border-border/80 bg-card/60 p-5 shadow-[0_12px_40px_-28px_rgba(0,112,243,0.35)] md:p-6">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              Feature table
            </h2>
            <div className="mt-4 overflow-hidden rounded-xl border border-border/70">
              <table className="min-w-full divide-y divide-border/70 text-left text-sm">
                <thead className="bg-background/80">
                  <tr>
                    <th className="px-4 py-3 font-semibold text-foreground">Feature</th>
                    <th className="px-4 py-3 font-semibold text-foreground">{page.tool1Name}</th>
                    <th className="px-4 py-3 font-semibold text-foreground">{page.tool2Name}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 bg-card/40">
                  {page.rows.map((row) => (
                    <tr key={row.feature}>
                      <td className="px-4 py-3 align-top font-medium text-foreground">
                        {row.feature}
                      </td>
                      <td className="px-4 py-3 align-top text-muted-foreground">{row.tool1}</td>
                      <td className="px-4 py-3 align-top text-muted-foreground">{row.tool2}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <div className="mt-10 space-y-10">
            {page.sections.map((section) => (
              <section
                key={section.title}
                className="rounded-2xl border border-border/80 bg-card/60 p-5 shadow-[0_12px_40px_-28px_rgba(0,112,243,0.35)] md:p-6"
              >
                <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                  {section.title}
                </h2>
                <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground md:text-base">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <div className="mt-10">
            <FaqBlock faqs={page.faq} />
          </div>

          <div className="mt-10">
            <RelatedLinks
              currentPath={page.canonicalPath}
              heading="Related comparisons and local tools"
            />
          </div>
        </div>
      </main>
    </div>
  )
}
