import type { Metadata } from "next"

import { PdfIntentPage } from "@/components/intent/pdf-intent-page"
import { buildPdfIntentMetadata } from "@/lib/pdf-intent-pages"

export const metadata: Metadata = buildPdfIntentMetadata("extract-pages-from-pdf")

export default function ExtractPagesFromPdfPage() {
  return <PdfIntentPage slug="extract-pages-from-pdf" />
}
