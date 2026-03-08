import type { Metadata } from "next"

import { PdfIntentPage } from "@/components/intent/pdf-intent-page"
import { buildPdfIntentMetadata } from "@/lib/pdf-intent-pages"

export const metadata: Metadata = buildPdfIntentMetadata("sign-pdf-online")

export default function SignPdfOnlinePage() {
  return <PdfIntentPage slug="sign-pdf-online" />
}
