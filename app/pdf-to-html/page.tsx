import type { Metadata } from "next"

import { PdfIntentPage } from "@/components/intent/pdf-intent-page"
import { buildPdfIntentMetadata } from "@/lib/pdf-intent-pages"

export const metadata: Metadata = buildPdfIntentMetadata("pdf-to-html")

export default function PdfToHtmlPage() {
  return <PdfIntentPage slug="pdf-to-html" />
}
