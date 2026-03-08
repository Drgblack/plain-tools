import type { Metadata } from "next"

import { DNSLookupToolClient } from "@/components/tools/network-tools-client"
import { buildPageMetadata } from "@/lib/page-metadata"

export const metadata: Metadata = buildPageMetadata({
  title: "DNS lookup tool",
  description:
    "Lookup A, AAAA, and MX records through Cloudflare DNS-over-HTTPS directly from your browser. Privacy-first and no Plain Tools DNS proxy.",
  path: "/tools/dns-lookup",
  image: "/og/default.png",
})

export default function DNSLookupToolPage() {
  return <DNSLookupToolClient />
}
