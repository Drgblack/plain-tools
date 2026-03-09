import type { Metadata } from "next"

import { PdfIntentPage } from "@/components/intent/pdf-intent-page"
import { buildPdfIntentMetadata } from "@/lib/pdf-intent-pages"

export const metadata: Metadata = buildPdfIntentMetadata("ocr-pdf")

export default function OcrPdfPage() {
  return <PdfIntentPage slug="ocr-pdf" />
}
