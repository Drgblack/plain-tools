import type { Metadata } from "next"
import { notFound, permanentRedirect } from "next/navigation"

import { ProgrammaticLayout } from "@/components/ProgrammaticLayout"
import { CalculatorSummary } from "@/components/seo/calculator-summary"
import { FinancialCalculatorEmbed } from "@/components/seo/financial-calculator-embed"
import { buildPageMetadata, buildCanonicalUrl } from "@/lib/page-metadata"
import {
  CALCULATOR_FINANCIAL_METADATA_EXAMPLES,
  generateCategoryCalculatorParams,
  getCalculatorPage,
} from "@/lib/calculator-financial-ext"
import {
  buildArticleSchema,
  buildHowToSchema,
  buildWebPageSchema,
  combineJsonLd,
} from "@/lib/structured-data"

type Props = {
  params: Promise<{ expression: string }>
}

export const revalidate = 86400
export const dynamicParams = true

function getPrebuildLimit() {
  const raw =
    process.env.CALCULATOR_PERCENTAGE_PREBUILD_LIMIT ??
    process.env.CALCULATOR_PREBUILD_LIMIT
  if (!raw) return 250
  const value = Number.parseInt(raw, 10)
  return Number.isFinite(value) && value > 0 ? value : 250
}

export function generateStaticParams() {
  return generateCategoryCalculatorParams("percentage", getPrebuildLimit()).map(
    ({ expression }) => ({ expression })
  )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { expression } = await params
  const page = getCalculatorPage("percentage", expression)

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

  const metadata = buildPageMetadata({
    description: page.description,
    googleNotranslate: true,
    image: "/og/default.png",
    path: page.canonicalPath,
    title: page.title,
    type: "article",
  })

  return {
    ...metadata,
    keywords: page.keywords,
  }
}

export default async function PercentageCalculatorPageRoute({ params }: Props) {
  const { expression } = await params
  const page = getCalculatorPage("percentage", expression)

  if (!page) {
    notFound()
  }

  if (expression !== page.expression) {
    permanentRedirect(page.canonicalPath)
  }

  return (
    <ProgrammaticLayout
      beforeStructuredContent={
        <CalculatorSummary
          rows={page.summaryRows}
          title={`${page.h1} summary`}
        />
      }
      breadcrumbs={page.breadcrumbs}
      featureList={page.featureList}
      heroBadges={page.heroBadges}
      liveTool={
        <FinancialCalculatorEmbed
          category="percentage"
          initialValues={page.initialValues}
        />
      }
      liveToolDescription={page.liveToolDescription}
      liveToolTitle="Try another percentage"
      page={page.page}
      relatedSectionTitle={`Related percentage checks near ${page.h1.toLowerCase()}`}
      schema={combineJsonLd([
        buildWebPageSchema({
          description: page.description,
          name: page.h1,
          url: buildCanonicalUrl(page.canonicalPath),
        }),
        buildArticleSchema({
          description: page.description,
          headline: page.h1,
          url: buildCanonicalUrl(page.canonicalPath),
        }),
        buildHowToSchema(
          "How to use the percentage calculator",
          page.description,
          page.page.howToSteps
        ),
      ])}
      showVerifyLocalProcessing={false}
      siloLinks={page.siloLinks}
      titleOverride={page.h1}
    />
  )
}

export { CALCULATOR_FINANCIAL_METADATA_EXAMPLES }
