import type { Metadata } from "next"

import { PdfIntentPage } from "@/components/intent/pdf-intent-page"
import { buildPdfIntentMetadata } from "@/lib/pdf-intent-pages"

export const metadata: Metadata = buildPdfIntentMetadata("add-watermark-to-pdf")

export default function AddWatermarkToPdfPage() {
  return <PdfIntentPage slug="add-watermark-to-pdf" />
}
