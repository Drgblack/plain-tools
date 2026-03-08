import type { Metadata } from "next"

import { PdfIntentPage } from "@/components/intent/pdf-intent-page"
import { buildPdfIntentMetadata } from "@/lib/pdf-intent-pages"

export const metadata: Metadata = buildPdfIntentMetadata("fill-pdf-form-online")

export default function FillPdfFormOnlinePage() {
  return <PdfIntentPage slug="fill-pdf-form-online" />
}
