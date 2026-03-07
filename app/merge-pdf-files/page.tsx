import type { Metadata } from "next"

import { PdfIntentPage } from "@/components/intent/pdf-intent-page"
import { buildPdfIntentMetadata } from "@/lib/pdf-intent-pages"

export const metadata: Metadata = buildPdfIntentMetadata("merge-pdf-files")

export default function MergePdfFilesPage() {
  return <PdfIntentPage slug="merge-pdf-files" />
}
