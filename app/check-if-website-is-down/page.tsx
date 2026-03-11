import type { Metadata } from "next"
import Link from "next/link"

import { SiteStatusClient } from "@/app/site-status/client"
import { FaqBlock } from "@/components/seo/faq-block"
import { JsonLd } from "@/components/seo/json-ld"
import { PageBreadcrumbs } from "@/components/seo/page-breadcrumbs"
import { RelatedLinks } from "@/components/seo/related-links"
import { buildPageMetadata } from "@/lib/page-metadata"
import { statusPathFor } from "@/lib/site-status"
import {
  buildBreadcrumbList,
  buildFaqPageSchema,
  buildWebPageSchema,
  combineJsonLd,
} from "@/lib/structured-data"

export const metadata: Metadata = buildPageMetadata({
  title: "Check If a Website Is Down",
  description:
    "Check if a website is down with a live status probe, response time, and troubleshooting steps to separate local connection issues from wider outages.",
  path: "/check-if-website-is-down",
  image: "/og/default.png",
})

const faqs = [
  {
    question: "How can I check if a website is down?",
    answer:
      "Enter the domain into the checker on this page. It normalizes the hostname, runs a live status check, and reports whether the site appears up, down, or invalid.",
  },
  {
    question: "What if the site is up here but not for me?",
    answer:
      "That usually points to a local DNS, browser, VPN, firewall, or ISP routing issue rather than a global outage. Run DNS and latency checks next to narrow it down.",
  },
  {
    question: "Does this page collect personal data or files?",
    answer:
      "No document files are uploaded here. This page is for live network checks only and is designed to stay lightweight.",
  },
] as const

const pageSchema = combineJsonLd([
  buildWebPageSchema({
    name: "Check If a Website Is Down",
    description:
      "Website down checker with live availability results, response timing, network troubleshooting, and related status routes.",
    url: "https://plain.tools/check-if-website-is-down",
  }),
  buildBreadcrumbList([
    { name: "Home", url: "https://plain.tools/" },
    { name: "Status", url: "https://plain.tools/status" },
    { name: "Check If a Website Is Down", url: "https://plain.tools/check-if-website-is-down" },
  ]),
  buildFaqPageSchema([...faqs]),
])

export default function CheckIfWebsiteIsDownPage() {
  return (
    <article className="min-h-screen bg-background">
      {pageSchema ? <JsonLd id="check-if-website-is-down-schema" schema={pageSchema} /> : null}

      <div className="mx-auto max-w-6xl px-4 py-12">
        <PageBreadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Status", href: "/status" },
            { label: "Check If a Website Is Down" },
          ]}
          className="mb-4"
        />

        <header className="max-w-4xl">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            Check If a Website Is Down
          </h1>
          <p className="mt-4 text-base leading-8 text-muted-foreground">
            This landing page is built for the common “check if website is down” query and reuses the
            existing Plain.tools status checker instead of duplicating the logic behind it. Enter a domain,
            run the live probe, and use the result as a practical first signal for whether the site is
            reachable from the checker endpoint. The output includes the current status, the latest response
            time, and a timestamp so you can quickly tell whether a site is unavailable or just responding
            slowly. That is useful because website problems are not always global outages. A service can be
            up overall while still failing for you because of resolver issues, local firewall rules, stale
            DNS cache, corporate filtering, VPN routes, or temporary ISP problems. Use this page to check
            the site first, then follow the supporting network steps below if you need to confirm whether
            the issue is local or affecting more users.
          </p>
        </header>

        <section className="mt-10 rounded-2xl border border-border/70 bg-card/40 p-5 md:p-6">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">How it works</h2>
          <ol className="mt-4 space-y-3 text-sm leading-7 text-muted-foreground">
            <li className="rounded-xl border border-border/60 bg-background/60 px-4 py-3">
              <span className="font-semibold text-foreground">1. </span>
              Enter a domain such as `github.com` or `chatgpt.com` into the checker.
            </li>
            <li className="rounded-xl border border-border/60 bg-background/60 px-4 py-3">
              <span className="font-semibold text-foreground">2. </span>
              Run the live status probe and review whether the website appears up, down, or invalid.
            </li>
            <li className="rounded-xl border border-border/60 bg-background/60 px-4 py-3">
              <span className="font-semibold text-foreground">3. </span>
              Compare the response time and check timestamp to understand whether the issue is performance-related or a full failure.
            </li>
            <li className="rounded-xl border border-border/60 bg-background/60 px-4 py-3">
              <span className="font-semibold text-foreground">4. </span>
              Use DNS lookup, ping, and IP context tools if you need to diagnose a local versus global problem.
            </li>
          </ol>
        </section>

        <section className="mt-10 rounded-2xl border border-border/70 bg-card/40 p-5 md:p-6">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Privacy and scope</h2>
          <div className="mt-4 space-y-3 text-sm leading-7 text-muted-foreground">
            <p>
              This is a lightweight network-status workflow. It does not process document files, ask for user
              outage reports, or depend on personal data to determine whether a site is reachable.
            </p>
            <p>
              The page focuses on live status signals and practical troubleshooting. That means you can use it
              as a quick first check before moving deeper into DNS or latency testing when the result needs
              more investigation.
            </p>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="mb-4 text-2xl font-semibold tracking-tight text-foreground">Website status checker</h2>
          <SiteStatusClient />
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Related tools</h2>
          <div className="mt-4 flex flex-wrap gap-2 text-sm">
            <Link href="/dns-lookup" className="rounded-full border border-border bg-card px-4 py-2 text-muted-foreground transition hover:border-accent/40 hover:text-accent">
              DNS Lookup
            </Link>
            <Link href="/ping-test" className="rounded-full border border-border bg-card px-4 py-2 text-muted-foreground transition hover:border-accent/40 hover:text-accent">
              Ping Test
            </Link>
            <Link href="/what-is-my-ip" className="rounded-full border border-border bg-card px-4 py-2 text-muted-foreground transition hover:border-accent/40 hover:text-accent">
              What Is My IP
            </Link>
            <Link href="/status/trending" className="rounded-full border border-border bg-card px-4 py-2 text-muted-foreground transition hover:border-accent/40 hover:text-accent">
              Trending status checks
            </Link>
          </div>
        </section>

        <div className="mt-10">
          <FaqBlock faqs={[...faqs]} />
        </div>

        <div className="mt-10">
          <RelatedLinks
            heading="Related guides and checks"
            sections={[
              {
                title: "Popular status routes",
                links: [
                  { label: "Check ChatGPT status", href: statusPathFor("chatgpt.com") },
                  { label: "Check Discord status", href: statusPathFor("discord.com") },
                  { label: "Check YouTube status", href: statusPathFor("youtube.com") },
                ],
              },
              {
                title: "Learn guides",
                links: [
                  {
                    label: "Is it down for everyone or just me?",
                    href: "/learn/is-it-down-for-everyone-or-just-me",
                  },
                  {
                    label: "How DNS lookup works",
                    href: "/learn/how-dns-lookup-works",
                  },
                ],
              },
              {
                title: "Trust and verification",
                links: [
                  { label: "Verify Claims", href: "/verify-claims" },
                  { label: "Open the site status hub", href: "/site-status" },
                ],
              },
            ]}
          />
        </div>
      </div>
    </article>
  )
}
