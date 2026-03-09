import type { Metadata } from "next"

import { NetworkToolPage } from "@/components/seo/network-tool-page"
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
  return (
    <NetworkToolPage
      title="DNS Lookup"
      intro={[
        "Use this DNS lookup page when the issue feels like a domain problem rather than a full service outage. It is useful for checking whether a hostname resolves to the address you expect, confirming that a new record has propagated, or understanding whether mail-routing entries exist before you blame the application itself. The live tool queries Cloudflare DNS-over-HTTPS directly from your browser, which keeps the workflow easy to inspect and avoids a Plain Tools resolver proxy.",
        "That direct model matters for trust. The domain you enter is sent from your browser to Cloudflare because Cloudflare is the resolver providing the answer, but Plain Tools does not sit in the middle or keep a copy of the lookup. The page then groups A, AAAA, and MX results so you can compare address records and mail routes together. If a service still looks broken after the DNS output is normal, the next step is usually a site status or latency check rather than another guess.",
      ]}
      howItWorks={[
        "Enter a clean domain such as plain.tools or openai.com and let the page normalise the hostname before lookup.",
        "Run one combined request set for A, AAAA, and MX records through Cloudflare DNS-over-HTTPS.",
        "Compare the returned answers and use them to decide whether the issue is DNS-related or whether you should move on to a status or connectivity check.",
      ]}
      caveats={[
        "This page checks Cloudflare DoH output, so answers can differ slightly from what another resolver sees at the same moment.",
        "Some domains simply do not publish every record type, so an empty AAAA or MX result is not automatically a fault.",
        "The domain lookup is direct from your browser to Cloudflare, not to a Plain Tools server, which is good for transparency but still means Cloudflare sees the query.",
      ]}
      relatedTools={[
        { label: "What Is My IP", href: "/tools/what-is-my-ip" },
        { label: "Site Status Checker", href: "/tools/site-status-checker" },
        { label: "Ping Test", href: "/tools/ping-test" },
      ]}
      relatedGuides={[
        { label: "How DNS lookup works", href: "/learn/how-dns-lookup-works" },
        {
          label: "What response time means in uptime check",
          href: "/learn/what-response-time-means-in-uptime-check",
        },
      ]}
    >
      <DNSLookupToolClient />
    </NetworkToolPage>
  )
}
