import type { Metadata } from "next"
import Link from "next/link"

import { StatusDynamicClient } from "@/app/status/[site]/client"
import { FaqBlock } from "@/components/seo/faq-block"
import { JsonLd } from "@/components/seo/json-ld"
import { PageBreadcrumbs } from "@/components/seo/page-breadcrumbs"
import { RelatedLinks } from "@/components/seo/related-links"
import { buildPageMetadata } from "@/lib/page-metadata"
import { statusQueryPathForSlug, STATUS_QUERY_PAGES } from "@/lib/status-query-pages"
import { statusPathFor } from "@/lib/site-status"
import {
  buildBreadcrumbList,
  buildFaqPageSchema,
  buildItemListSchema,
  buildWebPageSchema,
  combineJsonLd,
} from "@/lib/structured-data"

const baseMetadata = buildPageMetadata({
  title: "Is ChatGPT Down Right Now?",
  description:
    "Check whether ChatGPT is down right now with live status, response time, and practical steps to separate local issues from a wider outage.",
  path: "/is-chatgpt-down",
  image: "/og/default.png",
})

export const metadata: Metadata = {
  ...baseMetadata,
  alternates: {
    ...baseMetadata.alternates,
    canonical: `https://plain.tools${statusPathFor("chatgpt.com")}`,
  },
  robots: {
    index: false,
    follow: true,
  },
}

const faqs = [
  {
    question: "Is ChatGPT down right now?",
    answer:
      "Use the live status module on this page. It checks whether chatgpt.com responded during the latest probe and shows the current response time.",
  },
  {
    question: "Why is ChatGPT not working for me?",
    answer:
      "Possible causes include a wider service outage, local DNS issues, browser cache problems, VPN or firewall interference, or a temporary routing issue between your network and the service.",
  },
  {
    question: "How can I tell if the issue is local or global?",
    answer:
      "Start with the live status check here, then compare DNS and latency results. If ChatGPT looks up here but fails on your device, the issue is more likely local to your browser, network, or resolver.",
  },
] as const

const relatedChecks = STATUS_QUERY_PAGES.filter((entry) => entry.slug !== "chatgpt").slice(0, 5)

const pageSchema = combineJsonLd([
  buildWebPageSchema({
    name: "Is ChatGPT Down Right Now?",
    description:
      "Live ChatGPT outage page with current status, response time, troubleshooting steps, and related network checks.",
    url: "https://plain.tools/is-chatgpt-down",
  }),
  buildBreadcrumbList([
    { name: "Home", url: "https://plain.tools/" },
    { name: "Status", url: "https://plain.tools/status" },
    { name: "Is ChatGPT Down", url: "https://plain.tools/is-chatgpt-down" },
  ]),
  buildFaqPageSchema([...faqs]),
  buildItemListSchema(
    "Related outage checks",
    relatedChecks.map((entry) => ({
      name: `Is ${entry.name} down?`,
      url: `https://plain.tools${statusQueryPathForSlug(entry.slug)}`,
    })),
    "https://plain.tools/is-chatgpt-down"
  ),
])

export default function IsChatGptDownPage() {
  return (
    <article className="min-h-screen bg-background">
      {pageSchema ? <JsonLd id="is-chatgpt-down-schema" schema={pageSchema} /> : null}

      <div className="mx-auto max-w-6xl px-4 py-12">
        <PageBreadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Status", href: "/status" },
            { label: "Is ChatGPT Down" },
          ]}
          className="mb-4"
        />

        <header className="max-w-4xl">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            Is ChatGPT Down Right Now?
          </h1>
          <p className="mt-4 text-base leading-8 text-muted-foreground">
            This page is designed for the common “is ChatGPT down?” search and connects directly to the
            same status engine that powers the canonical{" "}
            <Link href={statusPathFor("chatgpt.com")} className="font-medium text-accent hover:underline">
              /status/chatgpt.com
            </Link>{" "}
            route. Instead of relying on user reports, it checks whether ChatGPT is currently reachable,
            shows the latest response time, and gives you a practical way to decide whether the issue is
            happening for everyone or mainly on your side. That matters because ChatGPT problems are not
            always caused by a global outage. Browser cache, DNS resolver failures, VPN routing, local
            firewall rules, or temporary ISP issues can make the service feel down even when the platform
            is responding elsewhere. Use the current status module below as the first signal, then follow
            the troubleshooting and network checks on this page if the result does not match what you see
            in your own session.
          </p>
        </header>

        <section className="mt-10 rounded-2xl border border-border/70 bg-card/40 p-5 md:p-6">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">How to check ChatGPT status</h2>
          <ol className="mt-4 space-y-3 text-sm leading-7 text-muted-foreground">
            <li className="rounded-xl border border-border/60 bg-background/60 px-4 py-3">
              <span className="font-semibold text-foreground">1. </span>
              Review the live status result for chatgpt.com and note whether it appears up or down.
            </li>
            <li className="rounded-xl border border-border/60 bg-background/60 px-4 py-3">
              <span className="font-semibold text-foreground">2. </span>
              Compare the latest response time and check timestamp to understand whether the service is responding slowly or not at all.
            </li>
            <li className="rounded-xl border border-border/60 bg-background/60 px-4 py-3">
              <span className="font-semibold text-foreground">3. </span>
              If ChatGPT appears up here but fails for you, run DNS and latency checks to isolate a local network issue.
            </li>
            <li className="rounded-xl border border-border/60 bg-background/60 px-4 py-3">
              <span className="font-semibold text-foreground">4. </span>
              Recheck after a few minutes if the service is down, because brief incidents can recover quickly.
            </li>
          </ol>
        </section>

        <section className="mt-10 rounded-2xl border border-border/70 bg-card/40 p-5 md:p-6">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Privacy and methodology</h2>
          <div className="mt-4 space-y-3 text-sm leading-7 text-muted-foreground">
            <p>
              Plain.tools does not collect user-submitted outage reports on this page. The result comes from
              the existing status system, which performs live availability checks and reports the latest
              status signal without asking for your personal data.
            </p>
            <p>
              This is a lightweight network-status workflow, not a document upload tool. No files are
              processed here, and the page is meant to help you verify whether the issue is likely global,
              regional, or local to your own connection.
            </p>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="mb-4 text-2xl font-semibold tracking-tight text-foreground">Current ChatGPT status</h2>
          <div className="rounded-2xl border border-border/70 bg-card/40 p-5 md:p-6">
            <StatusDynamicClient site="chatgpt.com" siteName="ChatGPT" />
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Related tools</h2>
          <div className="mt-4 flex flex-wrap gap-2 text-sm">
            <Link href="/check-if-website-is-down" className="rounded-full border border-border bg-card px-4 py-2 text-muted-foreground transition hover:border-accent/40 hover:text-accent">
              Check if a website is down
            </Link>
            <Link href="/dns-lookup" className="rounded-full border border-border bg-card px-4 py-2 text-muted-foreground transition hover:border-accent/40 hover:text-accent">
              DNS Lookup
            </Link>
            <Link href="/ping-test" className="rounded-full border border-border bg-card px-4 py-2 text-muted-foreground transition hover:border-accent/40 hover:text-accent">
              Ping Test
            </Link>
            <Link href="/what-is-my-ip" className="rounded-full border border-border bg-card px-4 py-2 text-muted-foreground transition hover:border-accent/40 hover:text-accent">
              What Is My IP
            </Link>
          </div>
        </section>

        <div className="mt-10">
          <FaqBlock faqs={[...faqs]} />
        </div>

        <div className="mt-10">
          <RelatedLinks
            heading="More checks and guides"
            sections={[
              {
                title: "Related status checks",
                links: relatedChecks.map((entry) => ({
                  label: `Is ${entry.name} down?`,
                  href: statusQueryPathForSlug(entry.slug),
                })),
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
                  { label: "Canonical ChatGPT status page", href: "/status/chatgpt.com" },
                ],
              },
            ]}
          />
        </div>
      </div>
    </article>
  )
}
