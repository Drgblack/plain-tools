import type { Metadata } from "next"

import { PdfIntentPage } from "@/components/intent/pdf-intent-page"
import { buildPdfIntentMetadata } from "@/lib/pdf-intent-pages"

export const metadata: Metadata = buildPdfIntentMetadata("pdf-to-jpg-online")

export default function PdfToJpgOnlinePage() {
  return <PdfIntentPage slug="pdf-to-jpg-online" />
}
