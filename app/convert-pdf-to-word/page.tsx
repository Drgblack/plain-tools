import type { Metadata } from "next"

import { PdfIntentPage } from "@/components/intent/pdf-intent-page"
import { buildPdfIntentMetadata } from "@/lib/pdf-intent-pages"

export const metadata: Metadata = buildPdfIntentMetadata("convert-pdf-to-word")

export default function ConvertPdfToWordPage() {
  return <PdfIntentPage slug="convert-pdf-to-word" />
}
