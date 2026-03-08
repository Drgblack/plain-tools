import type { Metadata } from "next"

import { PdfIntentPage } from "@/components/intent/pdf-intent-page"
import { buildPdfIntentMetadata } from "@/lib/pdf-intent-pages"

export const metadata: Metadata = buildPdfIntentMetadata("reorder-pdf-pages")

export default function ReorderPdfPagesPage() {
  return <PdfIntentPage slug="reorder-pdf-pages" />
}
