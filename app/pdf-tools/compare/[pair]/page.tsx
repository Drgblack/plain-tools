import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { PdfComparisonPage } from "@/components/seo/PdfComparisonPage"
import {
  generatePdfComparisonStaticParams,
  getPdfComparisonPage,
  type PdfComparisonRouteParams,
} from "@/lib/pdf-tool-comparisons"
import { buildPageMetadata } from "@/lib/page-metadata"

type PageProps = {
  params: Promise<PdfComparisonRouteParams>
}

export const revalidate = 86400
export const dynamicParams = false

function resolveParams(params: Promise<PdfComparisonRouteParams>) {
  return params
}

export function generateStaticParams() {
  return generatePdfComparisonStaticParams()
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { pair } = await resolveParams(params)
  const page = getPdfComparisonPage(pair)

  if (!page) {
    return buildPageMetadata({
      title: "PDF comparison not found",
      description:
        "The requested PDF comparison page does not exist. Browse Plain Tools comparison routes for privacy-first guidance and local PDF tool alternatives.",
      path: "/pdf-tools/compare",
      image: "/og/compare.png",
      googleNotranslate: true,
    })
  }

  return buildPageMetadata({
    title: page.metaTitle,
    description: page.metaDescription,
    path: page.path,
    image: "/og/compare.png",
    type: "article",
    googleNotranslate: true,
  })
}

export default async function PdfToolComparisonRoute({ params }: PageProps) {
  const { pair } = await resolveParams(params)
  const page = getPdfComparisonPage(pair)

  if (!page) {
    notFound()
  }

  return <PdfComparisonPage page={page} />
}
