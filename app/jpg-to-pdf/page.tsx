import type { Metadata } from "next"

import { PdfIntentPage } from "@/components/intent/pdf-intent-page"
import { buildPdfIntentMetadata } from "@/lib/pdf-intent-pages"

export const metadata: Metadata = buildPdfIntentMetadata("jpg-to-pdf")

export default function JpgToPdfPage() {
  return <PdfIntentPage slug="jpg-to-pdf" />
}
