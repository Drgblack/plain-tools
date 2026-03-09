import type { Metadata } from "next"

import { PdfIntentPage } from "@/components/intent/pdf-intent-page"
import { buildPdfIntentMetadata } from "@/lib/pdf-intent-pages"

export const metadata: Metadata = buildPdfIntentMetadata("compress-pdf-online")

export default function CompressPdfOnlinePage() {
  return <PdfIntentPage slug="compress-pdf-online" />
}
