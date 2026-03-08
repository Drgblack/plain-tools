import type { Metadata } from "next"

import { PdfIntentPage } from "@/components/intent/pdf-intent-page"
import { buildPdfIntentMetadata } from "@/lib/pdf-intent-pages"

export const metadata: Metadata = buildPdfIntentMetadata("protect-pdf-with-password")

export default function ProtectPdfWithPasswordPage() {
  return <PdfIntentPage slug="protect-pdf-with-password" />
}
