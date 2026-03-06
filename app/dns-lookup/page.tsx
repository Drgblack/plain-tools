import type { Metadata } from "next"
import Link from "next/link"

import { JsonLd } from "@/components/seo/json-ld"
import { buildPageMetadata } from "@/lib/page-metadata"
import {
  buildBreadcrumbList,
  buildFaqPageSchema,
  buildSoftwareApplicationSchema,
  buildWebPageSchema,
  combineJsonLd,
} from "@/lib/structured-data"

import { DNSLookupClient } from "./client"

export const metadata: Metadata = buildPageMetadata({
  title: "DNS lookup",
  description:
    "Look up A, AAAA, MX, TXT, NS, and CNAME records for any domain with practical DNS diagnostics for troubleshooting and verification workflows.",
  path: "/dns-lookup",
  image: "/og/default.png",
})

const dnsLookupSchema = combineJsonLd([
  buildWebPageSchema({
    name: "DNS lookup tool",
    description:
      "Query domain DNS records and inspect A, AAAA, MX, TXT, NS, and CNAME answers.",
    url: "https://plain.tools/dns-lookup",
  }),
  buildSoftwareApplicationSchema({
    name: "DNS lookup",
    description:
      "Browser-based DNS-over-HTTPS lookup for practical diagnostics and domain troubleshooting.",
    url: "https://plain.tools/dns-lookup",
    featureList: [
      "Query A, AAAA, MX, TXT, NS, and CNAME records",
      "Open canonical domain routes such as /dns/example.com",
      "Pair results with status and latency checks",
    ],
  }),
  buildFaqPageSchema([
    {
      question: "Which record types can I inspect?",
      answer:
        "The tool supports A, AAAA, MX, TXT, NS, and CNAME records for common DNS troubleshooting.",
    },
    {
      question: "Why might answers change between checks?",
      answer:
        "Large domains often use load balancing and regional DNS responses, so answers can vary by query context.",
    },
    {
      question: "Can I open a dedicated page for one domain?",
      answer:
        "Yes. Use canonical routes like /dns/google.com for shareable, domain-specific checks.",
    },
  ]),
  buildBreadcrumbList([
    { name: "Home", url: "https://plain.tools/" },
    { name: "DNS Lookup", url: "https://plain.tools/dns-lookup" },
  ]),
])

export default function DNSLookupPage() {
  return (
    <>
      {dnsLookupSchema ? <JsonLd id="dns-lookup-page-schema" schema={dnsLookupSchema} /> : null}
      <DNSLookupClient />
      <section className="border-t border-border/60 px-4 py-10">
        <div className="mx-auto max-w-6xl space-y-4">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            What to check after a DNS lookup
          </h2>
          <p className="max-w-4xl text-sm leading-relaxed text-muted-foreground">
            Start by confirming the record type you need, then compare results against expected
            infrastructure. If a domain resolves correctly but still fails for users, continue with
            site-status and latency checks to isolate routing or origin issues.
          </p>
          <div className="flex flex-wrap gap-2 text-xs">
            <Link
              href="/dns/openai.com"
              className="rounded-full border border-border bg-card px-3 py-1.5 text-muted-foreground transition hover:border-accent/40 hover:text-accent"
            >
              Example: openai.com records
            </Link>
            <Link
              href="/site-status"
              className="rounded-full border border-border bg-card px-3 py-1.5 text-muted-foreground transition hover:border-accent/40 hover:text-accent"
            >
              Check site status
            </Link>
            <Link
              href="/network-tools"
              className="rounded-full border border-border bg-card px-3 py-1.5 text-muted-foreground transition hover:border-accent/40 hover:text-accent"
            >
              Browse network tools
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
