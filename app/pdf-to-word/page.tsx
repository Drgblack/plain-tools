import { permanentRedirect } from "next/navigation"

import { getLegacyCanonicalRedirect } from "@/lib/seo/legacy-route-canonicals"

export default function PdfToWordLegacyPage() {
  permanentRedirect(getLegacyCanonicalRedirect("/pdf-to-word") ?? "/tools/pdf-to-word")
}
