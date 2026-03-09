import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { PdfToolVariantPage } from "@/components/seo/PdfToolVariantPage"
import { buildPageMetadata } from "@/lib/page-metadata"
import {
  generatePdfToolVariantStaticParams,
  getPdfToolVariantPage,
  type PdfToolVariantRouteParams,
} from "@/lib/pdf-tool-variants"

type PageProps = {
  params: Promise<PdfToolVariantRouteParams>
}

export const revalidate = 2592000
export const dynamicParams = false

async function resolveParams(params: Promise<PdfToolVariantRouteParams>) {
  return params
}

export function generateStaticParams() {
  return generatePdfToolVariantStaticParams()
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { action, variant } = await resolveParams(params)
  const page = getPdfToolVariantPage(action, variant)

  if (!page) {
    return buildPageMetadata({
      title: "PDF tool variant not found",
      description:
        "The requested PDF tool variant could not be found. Browse Plain Tools for privacy-first PDF workflows that run in your browser with no upload step for the core task.",
      path: "/pdf-tools/variants",
      image: "/og/tools.png",
    })
  }

  const metadata = buildPageMetadata({
    title: page.title,
    description: page.metaDescription,
    path: page.pdfPath,
    image: "/og/tools.png",
  })

  return {
    ...metadata,
    robots: {
      index: true,
      follow: true,
    },
  }
}

export default async function PdfToolVariantRoute({ params }: PageProps) {
  const { action, variant } = await resolveParams(params)
  const page = getPdfToolVariantPage(action, variant)

  if (!page) {
    notFound()
  }

  return <PdfToolVariantPage page={page} />
}
