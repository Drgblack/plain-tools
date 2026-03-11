import { permanentRedirect } from "next/navigation"

import { getLegacyCanonicalRedirect } from "@/lib/seo/legacy-route-canonicals"

export default function PdfMergeLegacyPage() {
  permanentRedirect(getLegacyCanonicalRedirect("/pdf-merge") ?? "/tools/merge-pdf")
}
