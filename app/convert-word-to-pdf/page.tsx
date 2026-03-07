import type { Metadata } from "next"

import { PdfIntentPage } from "@/components/intent/pdf-intent-page"
import { buildPdfIntentMetadata } from "@/lib/pdf-intent-pages"

export const metadata: Metadata = buildPdfIntentMetadata("convert-word-to-pdf")

export default function ConvertWordToPdfPage() {
  return <PdfIntentPage slug="convert-word-to-pdf" />
}
