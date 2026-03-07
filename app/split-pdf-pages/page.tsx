import type { Metadata } from "next"

import { PdfIntentPage } from "@/components/intent/pdf-intent-page"
import { buildPdfIntentMetadata } from "@/lib/pdf-intent-pages"

export const metadata: Metadata = buildPdfIntentMetadata("split-pdf-pages")

export default function SplitPdfPagesPage() {
  return <PdfIntentPage slug="split-pdf-pages" />
}
