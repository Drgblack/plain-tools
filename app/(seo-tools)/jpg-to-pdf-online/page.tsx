import type { Metadata } from "next"

import { PdfIntentPage } from "@/components/intent/pdf-intent-page"
import { buildPdfIntentMetadata } from "@/lib/pdf-intent-pages"

export const metadata: Metadata = buildPdfIntentMetadata("jpg-to-pdf-online")

export default function JpgToPdfOnlinePage() {
  return <PdfIntentPage slug="jpg-to-pdf-online" />
}
