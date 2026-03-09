import { FaqBlock } from "@/components/seo/faq-block"
import { JsonLd } from "@/components/seo/json-ld"
import { PageBreadcrumbs } from "@/components/seo/page-breadcrumbs"
import { RelatedLinks } from "@/components/seo/related-links"
import type { PdfComparisonPage as PdfComparisonPageData } from "@/lib/pdf-tool-comparisons"
import {
  buildBreadcrumbList,
  buildFaqPageSchema,
  buildSoftwareApplicationSchema,
  buildWebPageSchema,
  combineJsonLd,
} from "@/lib/structured-data"

type PdfComparisonPageProps = {
  page: PdfComparisonPageData
}

export function PdfComparisonPage({ page }: PdfComparisonPageProps) {
  const schema = combineJsonLd([
    buildWebPageSchema({
      name: page.title,
      description: page.metaDescription,
      url: `https://plain.tools${page.path}`,
    }),
    buildSoftwareApplicationSchema({
      name: page.tool1.name,
      description: page.tool1.privacySummary,
      url: `https://plain.tools${page.path}`,
      featureList: [page.tool1.bestFor, page.tool1.strengths, page.tool1.recommendationAngle],
    }),
    buildSoftwareApplicationSchema({
      name: page.tool2.name,
      description: page.tool2.privacySummary,
      url: `https://plain.tools${page.path}`,
      featureList: [page.tool2.bestFor, page.tool2.strengths, page.tool2.recommendationAngle],
    }),
    buildFaqPageSchema(page.faq),
    buildBreadcrumbList([
      { name: "Home", url: "https://plain.tools/" },
      { name: "PDF Tools", url: "https://plain.tools/pdf-tools" },
      { name: "Compare", url: "https://plain.tools/pdf-tools/compare" },
      { name: page.title, url: `https://plain.tools${page.path}` },
    ]),
  ])

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-background">
      {schema ? <JsonLd id={`pdf-compare-${page.pairSlug}-schema`} schema={schema} /> : null}

      <main className="flex-1">
        <div className="mx-auto w-full max-w-6xl px-4 py-12 md:py-14">
          <PageBreadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "PDF Tools", href: "/pdf-tools" },
              { label: "Compare", href: "/pdf-tools/compare" },
              { label: page.title },
            ]}
            className="mb-4"
          />

          <header className="max-w-4xl space-y-4">
            <div className="inline-flex rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-accent">
              PDF comparison page
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
                Privacy angle
              </h2>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li className="rounded-xl border border-border/70 bg-background/60 px-3 py-2">
                  Compare upload-first vs browser-first PDF workflows
                </li>
                <li className="rounded-xl border border-border/70 bg-background/60 px-3 py-2">
                  Use the matrix below to see where hosted suites introduce more file handoff risk
                </li>
                <li className="rounded-xl border border-border/70 bg-background/60 px-3 py-2">
                  Jump from the comparison into local Plain Tools workflows when privacy matters
                </li>
              </ul>
            </aside>
          </section>

          <section className="mt-10 rounded-2xl border border-border/80 bg-card/60 p-5 shadow-[0_12px_40px_-28px_rgba(0,112,243,0.35)] md:p-6">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              Quick comparison table
            </h2>
            <div className="mt-4 overflow-hidden rounded-xl border border-border/70">
              <table className="min-w-full divide-y divide-border/70 text-left text-sm">
                <thead className="bg-background/80">
                  <tr>
                    <th className="px-4 py-3 font-semibold text-foreground">Feature</th>
                    <th className="px-4 py-3 font-semibold text-foreground">{page.tool1.name}</th>
                    <th className="px-4 py-3 font-semibold text-foreground">{page.tool2.name}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 bg-card/40">
                  {page.table.map((row) => (
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
              </section>
            ))}
          </div>

          <div className="mt-10">
            <FaqBlock faqs={page.faq} />
          </div>

          <div className="mt-10">
            <RelatedLinks
              heading="Related comparisons and local tools"
              sections={[
                { title: "More vendor comparisons", links: page.relatedLinks.comparisons },
                { title: "Try Plain Tools locally", links: page.relatedLinks.tools },
              ]}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
