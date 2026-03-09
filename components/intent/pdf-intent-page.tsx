import { notFound } from "next/navigation"

import { ToolIntentPage } from "@/components/seo/ToolIntentPage"
import { getPdfIntentPage } from "@/lib/pdf-intent-pages"

type PdfIntentPageProps = {
  slug: string
}

const DEFAULT_LIMITATIONS = [
  "Very large PDFs, image-heavy scans, and complex layouts can take longer because processing uses browser memory on your device.",
  "Review the downloaded file before sharing it, especially after compression, OCR, or format conversion.",
  "If a portal has strict limits, optimise or split the final file after you confirm the output looks correct.",
]

export function PdfIntentPage({ slug }: PdfIntentPageProps) {
  const page = getPdfIntentPage(slug)
  if (!page) {
    notFound()
  }

  return (
    <ToolIntentPage
      slug={page.slug}
      title={page.h1}
      metaDescription={page.metaDescription}
      toolSlug={page.toolKey}
      toolSummary={page.toolSummary}
      intro={page.intro}
      howItWorks={page.howItWorks}
      limitations={page.limitations ?? DEFAULT_LIMITATIONS}
      faq={page.faqs}
      relatedTools={page.relatedTools}
      relatedGuides={page.learnLinks}
    />
  )
}
