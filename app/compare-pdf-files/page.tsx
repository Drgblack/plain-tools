import type { Metadata } from "next"

import { PdfIntentPage } from "@/components/intent/pdf-intent-page"
import { buildPdfIntentMetadata } from "@/lib/pdf-intent-pages"

export const metadata: Metadata = buildPdfIntentMetadata("compare-pdf-files")

export default function ComparePdfFilesPage() {
  return <PdfIntentPage slug="compare-pdf-files" />
}
