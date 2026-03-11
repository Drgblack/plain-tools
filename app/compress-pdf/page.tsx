import { permanentRedirect } from "next/navigation"

import { getLegacyCanonicalRedirect } from "@/lib/seo/legacy-route-canonicals"

export default function CompressPdfLegacyPage() {
  permanentRedirect(getLegacyCanonicalRedirect("/compress-pdf") ?? "/tools/compress-pdf")
}
