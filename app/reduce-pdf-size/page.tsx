import type { Metadata } from "next"

import { PdfIntentPage } from "@/components/intent/pdf-intent-page"
import { buildPdfIntentMetadata } from "@/lib/pdf-intent-pages"

export const metadata: Metadata = buildPdfIntentMetadata("reduce-pdf-size")

export default function ReducePdfSizePage() {
  return <PdfIntentPage slug="reduce-pdf-size" />
}
