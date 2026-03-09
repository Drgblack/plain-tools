import type { Metadata } from "next"
import Link from "next/link"

import { JsonLd } from "@/components/seo/json-ld"
import { Surface } from "@/components/surface"
import { buildPageMetadata } from "@/lib/page-metadata"
import { DNS_RECORD_TYPES, DNS_RECORD_DEFINITIONS, DNS_SITEMAP_DOMAINS } from "@/lib/network-dns"
import {
  buildBreadcrumbList,
  buildFaqPageSchema,
  buildSoftwareApplicationSchema,
  buildWebPageSchema,
  combineJsonLd,
} from "@/lib/structured-data"

import { DNSLookupClient } from "./client"

export const metadata: Metadata = buildPageMetadata({
  title: "DNS Lookup Tool | Check A, AAAA, MX, NS, TXT, SOA, CNAME | Plain Tools",
  description:
    "DNS lookup tool for A, AAAA, MX, NS, TXT, SOA, and CNAME records. Check TTL values, propagation clues, mail routing, and nameserver configuration for any domain.",
  path: "/dns-lookup",
  image: "/og/default.png",
  googleNotranslate: true,
})

const faq = [
  {
    question: "Which DNS records can I check here?",
    answer:
      "The main DNS lookup route supports A, AAAA, MX, NS, TXT, SOA, and CNAME records so you can diagnose web, email, verification, and delegation issues from one place.",
  },
  {
    question: "Why do TTL values matter in DNS troubleshooting?",
    answer:
      "TTL tells resolvers how long they can cache an answer. If you changed a record recently, older cached TTL windows often explain why one network still sees outdated data.",
  },
  {
    question: "When should I use a dedicated /dns/[domain] page?",
    answer:
      "Use the domain route when you want a shareable, indexable page for one hostname with all major record types, explanations, and related troubleshooting guidance.",
  },
  {
    question: "Does Plain Tools proxy my DNS request?",
    answer:
      "The client tool uses public DNS-over-HTTPS directly from the browser. The static and dynamic pages display resolver-backed DNS results without adding a Plain Tools upload workflow.",
  },
]

const dnsLookupSchema = combineJsonLd([
  buildWebPageSchema({
    name: "DNS Lookup Tool",
    description:
      "Check A, AAAA, MX, NS, TXT, SOA, and CNAME records with TTL-aware DNS diagnostics for any domain.",
    url: "https://plain.tools/dns-lookup",
  }),
  buildSoftwareApplicationSchema({
    name: "DNS Lookup",
    description:
      "DNS-over-HTTPS lookup tool for live DNS diagnostics, propagation checks, mail routing review, and nameserver verification.",
    url: "https://plain.tools/dns-lookup",
    featureList: [
      "Query A, AAAA, MX, NS, TXT, SOA, and CNAME records",
      "Open dedicated domain pages like /dns/example.com",
      "Use TTL values for propagation-aware troubleshooting",
    ],
  }),
  buildFaqPageSchema(faq),
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
        <div className="mx-auto max-w-6xl space-y-8">
          <Surface as="section">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              What these records mean
            </h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {DNS_RECORD_TYPES.map((type) => (
                <article
                  key={type}
                  className="rounded-xl border border-border/70 bg-background/60 p-4"
                >
                  <h3 className="font-semibold text-foreground">
                    {DNS_RECORD_DEFINITIONS[type].label}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {DNS_RECORD_DEFINITIONS[type].description}
                  </p>
                </article>
              ))}
            </div>
          </Surface>

          <Surface as="section">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              Why DNS matters
            </h2>
            <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground">
              <p>
                DNS is often the first layer to inspect when a website fails to load, email stops
                routing, or a domain verification token is rejected. A clean application stack can
                still look broken if the domain points to the wrong address, the wrong nameserver,
                or an outdated cached answer.
              </p>
              <p>
                The main tool page is designed for active lookup workflows. It lets you query a
                hostname immediately, then move into a dedicated domain page if you want a fuller
                explanation, all major record types together, and shareable diagnostics for the
                same domain.
              </p>
            </div>
          </Surface>

          <Surface as="section">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              Related DNS routes
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {DNS_SITEMAP_DOMAINS.slice(0, 8).map((domain) => (
                <Link
                  key={domain}
                  href={`/dns/${domain}`}
                  className="rounded-full border border-border bg-card px-3 py-1.5 text-sm text-muted-foreground transition hover:border-accent/40 hover:text-accent"
                >
                  DNS records for {domain}
                </Link>
              ))}
            </div>
          </Surface>
        </div>
      </section>
    </>
  )
}
