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
  title: "What Is My IP Address? Check IPv4, IPv6 and Public IP | Plain Tools",
  description:
    "Check your public IP address, IPv4 or IPv6 exposure, and browser-reported connection hints. Then open IP ownership, DNS lookup, and ping tools for deeper troubleshooting.",
  path: "/what-is-my-ip",
  image: "/og/default.png",
  googleNotranslate: true,
})

const ipLookupSchema = combineJsonLd([
  buildWebPageSchema({
    name: "What is my IP address",
    description:
      "Check your public IP address and browser connection context, then continue into ownership, DNS, and latency diagnostics.",
    url: "https://plain.tools/what-is-my-ip",
  }),
  buildSoftwareApplicationSchema({
    name: "What is my IP address",
    description:
      "Browser-based IP detection with fast links into IP ownership, DNS lookup, and latency checks.",
    url: "https://plain.tools/what-is-my-ip",
    featureList: [
      "Show current public IP",
      "Display connection hints exposed by the browser",
      "Open related IP ownership, DNS, and latency diagnostics",
    ],
  }),
  buildFaqPageSchema([
    {
      question: "What does this page show?",
      answer:
        "It reports the public IP address your browser currently uses to reach the internet, plus available browser connection hints such as network type and round-trip timing.",
    },
    {
      question: "Is this the same as my local 192.168 or 10.x address?",
      answer:
        "No. This page shows your public internet-facing IP. Addresses like 192.168.x.x, 10.x.x.x, and fd00:: are private network addresses used inside local networks and are not the same as your public IP.",
    },
    {
      question: "Is IP geolocation exact?",
      answer:
        "No. IP geolocation is approximate and often reflects ISP routing context rather than a precise physical location.",
    },
    {
      question: "What should I do after checking my IP?",
      answer:
        "If you are troubleshooting reachability, continue with IP ownership lookup, DNS lookup, and ping tests to isolate whether the issue is local, resolver-related, or service-side.",
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
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(280px,0.7fr)]">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-foreground">
                What your public IP tells you
              </h2>
              <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground">
                <p>
                  Your public IP is the address websites, APIs, and remote services see when your
                  browser connects to them. It is useful for checking VPN exits, ISP changes,
                  office egress paths, IPv6 availability, and whether you are actually testing from
                  the network edge you think you are using.
                </p>
                <p>
                  It is different from local network addresses such as 192.168.x.x, 10.x.x.x, or
                  fd00:: ranges. Those private addresses only exist inside your router, office LAN,
                  or device network stack and are not directly routable on the public internet.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold tracking-tight text-foreground">
                Privacy-first workflow
              </h2>
              <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground">
                <p>
                  This tool runs in the browser and only requests the network information needed to
                  show your current public IP. There are no files to upload, no account required,
                  and no extra analytics layer added by the tool itself.
                </p>
                <p>
                  Once you know your public IP, open the dedicated IP lookup pages to inspect ISP,
                  ASN, organization, and approximate location data for that address. That gives you
                  a clean path from quick self-check to deeper ownership and routing analysis.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border/70 bg-card/60 p-5">
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              Continue the diagnosis
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Use your current public IP as a starting point, then branch into the next check based
              on whether you need ownership, resolution, or latency context.
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              <Link
                href="/dns-lookup"
                className="rounded-full border border-border bg-card px-3 py-1.5 text-muted-foreground transition hover:border-accent/40 hover:text-accent"
              >
                Run DNS lookup
              </Link>
              <Link
                href="/ping-test"
                className="rounded-full border border-border bg-card px-3 py-1.5 text-muted-foreground transition hover:border-accent/40 hover:text-accent"
              >
                Measure latency
              </Link>
              <Link
                href="/site-status"
                className="rounded-full border border-border bg-card px-3 py-1.5 text-muted-foreground transition hover:border-accent/40 hover:text-accent"
              >
                Check website status
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
