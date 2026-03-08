import type { Metadata } from "next"

import { PdfIntentPage } from "@/components/intent/pdf-intent-page"
import { buildPdfIntentMetadata } from "@/lib/pdf-intent-pages"

export const metadata: Metadata = buildPdfIntentMetadata("annotate-pdf-online")

export default function AnnotatePdfOnlinePage() {
  return <PdfIntentPage slug="annotate-pdf-online" />
}
