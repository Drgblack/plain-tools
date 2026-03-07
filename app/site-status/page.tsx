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

import { SiteStatusClient } from "./client"

export const metadata: Metadata = buildPageMetadata({
  title: "Site status checker",
  description:
    "Check whether a website is up or down with response timing, canonical status URLs, and practical diagnostics for day-to-day outage triage.",
  path: "/site-status",
  image: "/og/default.png",
})

const siteStatusSchema = combineJsonLd([
  buildWebPageSchema({
    name: "Site status checker",
    description:
      "Check whether a domain is reachable, then review live status and response-time context.",
    url: "https://plain.tools/site-status",
  }),
  buildSoftwareApplicationSchema({
    name: "Site status checker",
    description:
      "Browser-based status checks for domains, with canonical result routes such as /status/chatgpt.com.",
    url: "https://plain.tools/site-status",
    featureList: [
      "Live domain status checks",
      "Response-time and HTTP-status visibility",
      "Canonical status routes for shared checks",
    ],
  }),
  buildFaqPageSchema([
    {
      question: "What does this checker verify?",
      answer:
        "It runs a live probe and reports whether a host responds as up, down, or invalid.",
    },
    {
      question: "Can I share results for one domain?",
      answer:
        "Yes. Each domain has a canonical route such as /status/reddit.com for repeat checks and sharing.",
    },
    {
      question: "Is this a file-processing workflow?",
      answer:
        "No. This tool checks network availability only and does not process or upload document files.",
    },
  ]),
  buildBreadcrumbList([
    { name: "Home", url: "https://plain.tools/" },
    { name: "Site Status", url: "https://plain.tools/site-status" },
  ]),
])

export default function SiteStatusPage() {
  return (
    <>
      {siteStatusSchema ? <JsonLd id="site-status-page-schema" schema={siteStatusSchema} /> : null}
      <section className="border-b border-border/60 px-4 py-10">
        <div className="mx-auto max-w-6xl space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            Site status checker
          </h2>
          <p className="max-w-4xl text-sm leading-relaxed text-muted-foreground md:text-base">
            Quick answer: this tool checks whether a domain currently responds, how quickly it responds, and whether the result is usable for first-line troubleshooting.
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            <article className="rounded-lg border border-border/60 bg-card/40 p-3">
              <h3 className="text-sm font-semibold text-foreground">Up</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                The target host returned a successful response during the latest probe.
              </p>
            </article>
            <article className="rounded-lg border border-border/60 bg-card/40 p-3">
              <h3 className="text-sm font-semibold text-foreground">Down</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                The probe timed out or returned an unavailable result for the host.
              </p>
            </article>
            <article className="rounded-lg border border-border/60 bg-card/40 p-3">
              <h3 className="text-sm font-semibold text-foreground">Response time</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Measured round-trip time in milliseconds for the latest status request.
              </p>
            </article>
          </div>
          <p className="max-w-4xl text-sm leading-relaxed text-muted-foreground">
            A site can be up globally but still inaccessible locally due to ISP routing, DNS cache issues, enterprise firewalls, or regional network incidents.
          </p>
          <div className="flex flex-wrap gap-2 text-xs">
            <Link
              href="/dns-lookup"
              className="rounded-full border border-border bg-card px-3 py-1.5 text-muted-foreground transition hover:border-accent/40 hover:text-accent"
            >
              Next: verify DNS records
            </Link>
            <Link
              href="/ping-test"
              className="rounded-full border border-border bg-card px-3 py-1.5 text-muted-foreground transition hover:border-accent/40 hover:text-accent"
            >
              Next: check latency
            </Link>
            <Link
              href="/what-is-my-ip"
              className="rounded-full border border-border bg-card px-3 py-1.5 text-muted-foreground transition hover:border-accent/40 hover:text-accent"
            >
              Next: confirm network context
            </Link>
          </div>
        </div>
      </section>
      <SiteStatusClient />
      <section className="border-t border-border/60 px-4 py-10">
        <div className="mx-auto max-w-6xl space-y-4">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            How to interpret the result quickly
          </h2>
          <p className="max-w-4xl text-sm leading-relaxed text-muted-foreground">
            A status result shows whether the target domain responded during the latest probe.
            Use this as a practical signal for first-line triage, then follow up with DNS and
            latency checks to isolate routing or resolver issues.
          </p>
          <div className="flex flex-wrap gap-2 text-xs">
            <Link
              href="/status/chatgpt.com"
              className="rounded-full border border-border bg-card px-3 py-1.5 text-muted-foreground transition hover:border-accent/40 hover:text-accent"
            >
              Example: chatgpt.com
            </Link>
            <Link
              href="/dns-lookup"
              className="rounded-full border border-border bg-card px-3 py-1.5 text-muted-foreground transition hover:border-accent/40 hover:text-accent"
            >
              Check DNS records
            </Link>
            <Link
              href="/ping-test"
              className="rounded-full border border-border bg-card px-3 py-1.5 text-muted-foreground transition hover:border-accent/40 hover:text-accent"
            >
              Run latency test
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
