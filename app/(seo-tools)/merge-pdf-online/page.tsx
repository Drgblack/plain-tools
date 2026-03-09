import type { Metadata } from "next"

import { PdfIntentPage } from "@/components/intent/pdf-intent-page"
import { buildPdfIntentMetadata } from "@/lib/pdf-intent-pages"

export const metadata: Metadata = buildPdfIntentMetadata("merge-pdf-online")

export default function MergePdfOnlinePage() {
  return <PdfIntentPage slug="merge-pdf-online" />
}
