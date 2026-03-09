import type { Metadata } from "next"

import { PdfIntentPage } from "@/components/intent/pdf-intent-page"
import { buildPdfIntentMetadata } from "@/lib/pdf-intent-pages"

export const metadata: Metadata = buildPdfIntentMetadata("split-pdf-online")

export default function SplitPdfOnlinePage() {
  return <PdfIntentPage slug="split-pdf-online" />
}
