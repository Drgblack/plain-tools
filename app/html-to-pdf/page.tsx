import type { Metadata } from "next"

import { PdfIntentPage } from "@/components/intent/pdf-intent-page"
import { buildPdfIntentMetadata } from "@/lib/pdf-intent-pages"

export const metadata: Metadata = buildPdfIntentMetadata("html-to-pdf")

export default function HtmlToPdfPage() {
  return <PdfIntentPage slug="html-to-pdf" />
}
