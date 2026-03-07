import type { Metadata } from "next"

import { PdfIntentPage } from "@/components/intent/pdf-intent-page"
import { buildPdfIntentMetadata } from "@/lib/pdf-intent-pages"

export const metadata: Metadata = buildPdfIntentMetadata("extract-pdf-pages")

export default function ExtractPdfPagesPage() {
  return <PdfIntentPage slug="extract-pdf-pages" />
}
