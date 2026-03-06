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

import { WhatIsMyIPClient } from "./client"

export const metadata: Metadata = buildPageMetadata({
  title: "What is my IP address",
  description:
    "View your public IP address and browser-reported connection hints, then continue with DNS and status checks for practical network troubleshooting.",
  path: "/what-is-my-ip",
  image: "/og/default.png",
})

const ipLookupSchema = combineJsonLd([
  buildWebPageSchema({
    name: "What is my IP address",
    description:
      "See your public IP and connection context in a practical browser-based diagnostics workflow.",
    url: "https://plain.tools/what-is-my-ip",
  }),
  buildSoftwareApplicationSchema({
    name: "What is my IP address",
    description:
      "Browser-based IP lookup with quick access to related DNS, status, and latency checks.",
    url: "https://plain.tools/what-is-my-ip",
    featureList: [
      "Show current public IP",
      "Display connection hints exposed by the browser",
      "Link directly into DNS and status diagnostics",
    ],
  }),
  buildFaqPageSchema([
    {
      question: "What does this page show?",
      answer:
        "It reports your current public IP address and available browser connection hints such as network type and round-trip timing.",
    },
    {
      question: "Is IP geolocation exact?",
      answer:
        "No. IP geolocation is approximate and often reflects ISP routing context rather than precise physical position.",
    },
    {
      question: "What should I do after checking my IP?",
      answer:
        "If you are troubleshooting reachability, continue with DNS lookup and site-status checks to isolate the issue.",
    },
  ]),
  buildBreadcrumbList([
    { name: "Home", url: "https://plain.tools/" },
    { name: "What Is My IP", url: "https://plain.tools/what-is-my-ip" },
  ]),
])

export default function WhatIsMyIPPage() {
  return (
    <>
      {ipLookupSchema ? <JsonLd id="what-is-my-ip-page-schema" schema={ipLookupSchema} /> : null}
      <WhatIsMyIPClient />
      <section className="border-t border-border/60 px-4 py-10">
        <div className="mx-auto max-w-6xl space-y-4">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            Use this result in a wider diagnostics workflow
          </h2>
          <p className="max-w-4xl text-sm leading-relaxed text-muted-foreground">
            Your public IP helps confirm outbound network context, but it is only one signal. For
            incident triage, pair this with DNS resolution and uptime checks to determine whether
            an issue is local, resolver-related, or service-side.
          </p>
          <div className="flex flex-wrap gap-2 text-xs">
            <Link
              href="/dns-lookup"
              className="rounded-full border border-border bg-card px-3 py-1.5 text-muted-foreground transition hover:border-accent/40 hover:text-accent"
            >
              Run DNS lookup
            </Link>
            <Link
              href="/site-status"
              className="rounded-full border border-border bg-card px-3 py-1.5 text-muted-foreground transition hover:border-accent/40 hover:text-accent"
            >
              Check website status
            </Link>
            <Link
              href="/ping-test"
              className="rounded-full border border-border bg-card px-3 py-1.5 text-muted-foreground transition hover:border-accent/40 hover:text-accent"
            >
              Measure latency
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
