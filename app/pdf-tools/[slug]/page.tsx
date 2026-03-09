import { notFound, permanentRedirect } from "next/navigation"

import { getPdfToolVariantFlatAliasPage } from "@/lib/pdf-tool-variants"

type PageProps = {
  params: Promise<{ slug: string }>
}

export default async function PdfToolVariantAliasPage({ params }: PageProps) {
  const { slug } = await params
  const page = getPdfToolVariantFlatAliasPage(slug)

  if (!page) {
    notFound()
  }

  permanentRedirect(page.pdfPath)
}
