import type { Metadata } from "next"

import { PdfIntentPage } from "@/components/intent/pdf-intent-page"
import { buildPdfIntentMetadata } from "@/lib/pdf-intent-pages"

export const metadata: Metadata = buildPdfIntentMetadata("unlock-pdf-online")

export default function UnlockPdfOnlinePage() {
  return <PdfIntentPage slug="unlock-pdf-online" />
}
