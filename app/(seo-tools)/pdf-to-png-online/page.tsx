import type { Metadata } from "next"

import { PdfIntentPage } from "@/components/intent/pdf-intent-page"
import { buildPdfIntentMetadata } from "@/lib/pdf-intent-pages"

export const metadata: Metadata = buildPdfIntentMetadata("pdf-to-png-online")

export default function PdfToPngOnlinePage() {
  return <PdfIntentPage slug="pdf-to-png-online" />
}
