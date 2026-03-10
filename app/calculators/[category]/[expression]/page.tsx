import type { Metadata } from "next"
import { notFound, permanentRedirect } from "next/navigation"

import { ProgrammaticLayout } from "@/components/ProgrammaticLayout"
import { CalculatorSummary } from "@/components/seo/calculator-summary"
import { FinancialCalculatorEmbed } from "@/components/seo/financial-calculator-embed"
import { buildPageMetadata, buildCanonicalUrl } from "@/lib/page-metadata"
import {
  type CalculatorRouteParams,
  CALCULATOR_FINANCIAL_METADATA_EXAMPLES,
  generateNonPercentageCalculatorParams,
  getCalculatorPage,
  isCalculatorCategory,
} from "@/lib/calculator-financial"
import {
  buildArticleSchema,
  buildHowToSchema,
  buildWebPageSchema,
  combineJsonLd,
} from "@/lib/structured-data"

type PageProps = {
  params: Promise<CalculatorRouteParams>
}

export const revalidate = 86400
export const dynamicParams = true

function getPrebuildLimit() {
  const raw =
    process.env.CALCULATOR_FINANCIAL_PREBUILD_LIMIT ??
    process.env.FINANCIAL_CALCULATOR_PREBUILD_LIMIT
  if (!raw) return 200
  const value = Number.parseInt(raw, 10)
  return Number.isFinite(value) && value > 0 ? value : 200
}

export function generateStaticParams() {
  return generateNonPercentageCalculatorParams(getPrebuildLimit())
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category, expression } = await params

  if (!isCalculatorCategory(category)) {
    const invalid = buildPageMetadata({
      description: "The requested calculator category is not available.",
      googleNotranslate: true,
      image: "/og/default.png",
      path: `/calculators/${encodeURIComponent(category)}/${encodeURIComponent(expression)}`,
      title: "Invalid calculator category | Plain Tools",
    })

    return {
      ...invalid,
      robots: { follow: false, index: false },
    }
  }

  const page = getCalculatorPage(category, expression)

  if (!page) {
    const invalid = buildPageMetadata({
      description: "The requested calculator expression is not valid.",
      googleNotranslate: true,
      image: "/og/default.png",
      path: `/calculators/${category}/${encodeURIComponent(expression)}`,
      title: "Invalid calculator expression | Plain Tools",
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

export default async function FinancialCalculatorPageRoute({ params }: PageProps) {
  const { category, expression } = await params

  if (!isCalculatorCategory(category)) {
    notFound()
  }

  const page = getCalculatorPage(category, expression)

  if (!page) {
    notFound()
  }

  if (category !== page.category || expression !== page.expression) {
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
          category={page.category}
          initialValues={page.initialValues}
        />
      }
      liveToolDescription={page.liveToolDescription}
      liveToolTitle="Try another calculator scenario"
      page={page.page}
      relatedSectionTitle={`Related ${page.category.replace(/-/g, " ")} calculator pages`}
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
          `How to use the ${page.category.replace(/-/g, " ")} calculator`,
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
