import type { Metadata } from "next"

import { PdfIntentPage } from "@/components/intent/pdf-intent-page"
import { buildPdfIntentMetadata } from "@/lib/pdf-intent-pages"

export const metadata: Metadata = buildPdfIntentMetadata("text-to-pdf")

export default function TextToPdfPage() {
  return <PdfIntentPage slug="text-to-pdf" />
}
