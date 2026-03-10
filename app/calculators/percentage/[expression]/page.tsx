import type { Metadata } from "next"
import { notFound, permanentRedirect } from "next/navigation"

import { ProgrammaticLayout } from "@/components/ProgrammaticLayout"
import { PercentageCalculatorEmbed } from "@/components/seo/percentage-calculator-embed"
import {
  CALCULATOR_METADATA_EXAMPLES,
  generatePercentageCalculatorParams,
  getPercentageCalculatorPage,
  parsePercentageExpression,
} from "@/lib/calculator-combos"
import { buildCanonicalUrl, buildPageMetadata } from "@/lib/page-metadata"
import { buildWebPageSchema } from "@/lib/structured-data"

type Props = {
  params: Promise<{ expression: string }>
}

export const revalidate = 86400
export const dynamicParams = true

function getPrebuildLimit() {
  const raw = process.env.CALCULATOR_PREBUILD_LIMIT
  if (!raw) return 220
  const value = Number.parseInt(raw, 10)
  return Number.isFinite(value) && value > 0 ? value : 220
}

export function generateStaticParams() {
  return generatePercentageCalculatorParams(getPrebuildLimit())
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { expression } = await params
  const page = getPercentageCalculatorPage(expression)

  if (!page) {
    const invalid = buildPageMetadata({
      description: "The requested percentage calculator expression is not valid.",
      googleNotranslate: true,
      image: "/og/default.png",
      path: `/calculators/percentage/${encodeURIComponent(expression)}`,
      title: "Invalid percentage calculator expression | Plain Tools",
    })

    return {
      ...invalid,
      robots: { follow: false, index: false },
    }
  }

  return buildPageMetadata({
    description: page.description,
    googleNotranslate: true,
    image: "/og/default.png",
    path: page.canonicalPath,
    title: page.title,
  })
}

function CalculationSummary({ expression }: { expression: string }) {
  const parsed = parsePercentageExpression(expression)
  if (!parsed) return null

  return (
    <section className="rounded-2xl border border-border/80 bg-card/60 p-5 shadow-[0_12px_40px_-28px_rgba(0,112,243,0.35)] md:p-6 notranslate" translate="no">
      <h2 className="text-2xl font-semibold tracking-tight text-foreground">
        Percentage formula result
      </h2>
      <div className="mt-4 overflow-hidden rounded-xl border border-border/70">
        <table className="min-w-full divide-y divide-border/70 text-left text-sm">
          <tbody className="divide-y divide-border/60 bg-card/40">
            <tr>
              <th className="w-48 px-4 py-3 font-medium text-foreground">Expression</th>
              <td className="px-4 py-3 text-muted-foreground">
                {parsed.percent}% of {parsed.base}
              </td>
            </tr>
            <tr>
              <th className="px-4 py-3 font-medium text-foreground">Formula</th>
              <td className="px-4 py-3 text-muted-foreground">
                ({parsed.percent} / 100) x {parsed.base}
              </td>
            </tr>
            <tr>
              <th className="px-4 py-3 font-medium text-foreground">Result</th>
              <td className="px-4 py-3 text-muted-foreground">{parsed.result}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default async function PercentageCalculatorPageRoute({ params }: Props) {
  const { expression } = await params
  const page = getPercentageCalculatorPage(expression)

  if (!page) {
    notFound()
  }

  if (expression !== page.expression) {
    permanentRedirect(page.canonicalPath)
  }

  const parsed = parsePercentageExpression(page.expression)
  if (!parsed) {
    notFound()
  }

  return (
    <ProgrammaticLayout
      beforeStructuredContent={<CalculationSummary expression={page.expression} />}
      breadcrumbs={page.breadcrumbs}
      featureList={page.featureList}
      heroBadges={page.heroBadges}
      liveTool={
        <PercentageCalculatorEmbed
          baseValue={parsed.base}
          percentValue={parsed.percent}
        />
      }
      liveToolDescription={page.liveToolDescription}
      liveToolTitle="Try another percentage"
      page={page.page}
      relatedSectionTitle={`Related percentage checks near ${parsed.percent}% of ${parsed.base}`}
      schema={buildWebPageSchema({
        description: page.description,
        name: page.h1,
        url: buildCanonicalUrl(page.canonicalPath),
      })}
      showVerifyLocalProcessing={false}
      siloLinks={page.siloLinks}
      titleOverride={page.h1}
    />
  )
}

export { CALCULATOR_METADATA_EXAMPLES }
