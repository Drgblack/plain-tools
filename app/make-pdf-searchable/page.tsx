import type { Metadata } from "next"

import { PdfIntentPage } from "@/components/intent/pdf-intent-page"
import { buildPdfIntentMetadata } from "@/lib/pdf-intent-pages"

export const metadata: Metadata = buildPdfIntentMetadata("make-pdf-searchable")

export default function MakePdfSearchablePage() {
  return <PdfIntentPage slug="make-pdf-searchable" />
}
