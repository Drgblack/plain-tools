import type { Metadata } from "next"

import { PdfIntentPage } from "@/components/intent/pdf-intent-page"
import { buildPdfIntentMetadata } from "@/lib/pdf-intent-pages"

export const metadata: Metadata = buildPdfIntentMetadata("ocr-pdf-online")

export default function OcrPdfOnlinePage() {
  return <PdfIntentPage slug="ocr-pdf-online" />
}
