import type { Metadata } from "next"

import { PdfIntentPage } from "@/components/intent/pdf-intent-page"
import { buildPdfIntentMetadata } from "@/lib/pdf-intent-pages"

export const metadata: Metadata = buildPdfIntentMetadata("word-to-pdf-online")

export default function WordToPdfOnlinePage() {
  return <PdfIntentPage slug="word-to-pdf-online" />
}
