import type { Metadata } from "next"

import { PdfIntentPage } from "@/components/intent/pdf-intent-page"
import { buildPdfIntentMetadata } from "@/lib/pdf-intent-pages"

export const metadata: Metadata = buildPdfIntentMetadata("rotate-pdf-pages")

export default function RotatePdfPagesPage() {
  return <PdfIntentPage slug="rotate-pdf-pages" />
}
