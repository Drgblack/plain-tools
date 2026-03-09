import type { Metadata } from "next"

import { PdfIntentPage } from "@/components/intent/pdf-intent-page"
import { buildPdfIntentMetadata } from "@/lib/pdf-intent-pages"

export const metadata: Metadata = buildPdfIntentMetadata("png-to-pdf-online")

export default function PngToPdfOnlinePage() {
  return <PdfIntentPage slug="png-to-pdf-online" />
}
