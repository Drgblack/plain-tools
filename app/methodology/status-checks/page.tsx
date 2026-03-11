import type { Metadata } from "next"
import Link from "next/link"

import { JsonLd } from "@/components/seo/json-ld"
import { PageBreadcrumbs } from "@/components/seo/page-breadcrumbs"
import { buildPageMetadata } from "@/lib/page-metadata"
import {
  buildArticleSchema,
  buildBreadcrumbList,
  buildWebPageSchema,
  combineJsonLd,
} from "@/lib/structured-data"

const LAST_REVIEWED = "March 11, 2026"

export const metadata: Metadata = buildPageMetadata({
  title: "Status-check methodology | Plain Tools",
  description:
    "Learn what Plain Tools status pages measure, what an outage result means, and how canonical status routes and outage history pages are maintained.",
  path: "/methodology/status-checks",
  image: "/og/default.png",
  type: "article",
})

const methodologySchema = combineJsonLd([
  buildWebPageSchema({
    name: "Status-check methodology | Plain Tools",
    description:
      "Methodology for Plain Tools status checks, canonical status routes, and outage history pages.",
    url: "https://plain.tools/methodology/status-checks",
  }),
  buildArticleSchema({
    headline: "Plain Tools status-check methodology",
    description:
      "Methodology for Plain Tools status checks, canonical status routes, and outage history pages.",
    url: "https://plain.tools/methodology/status-checks",
    datePublished: "2026-03-11",
    dateModified: "2026-03-11",
    authorName: "Plain Tools",
  }),
  buildBreadcrumbList([
    { name: "Home", url: "https://plain.tools/" },
    { name: "Methodology", url: "https://plain.tools/methodology/status-checks" },
    { name: "Status checks", url: "https://plain.tools/methodology/status-checks" },
  ]),
])

const phases = [
  {
    title: "Canonical status routes",
    body:
      "Plain Tools treats `/status/{domain}` as the canonical route for ongoing status checks. Query-like routes can exist for user demand, but they should consolidate into the canonical domain page for linking, sharing, and sitemap inclusion.",
  },
  {
    title: "Live result interpretation",
    body:
      "A live result shows whether the latest probe could obtain a usable response. It does not automatically prove a global outage. Resolver failures, regional routing, firewalls, and other local conditions can still affect some users while the service remains reachable elsewhere.",
  },
  {
    title: "Outage history pages",
    body:
      "Outage-history pages summarise aggregated check history and expose recent incidents as a user-facing timeline. They are meant to support investigation, not to replace an official provider incident report.",
  },
  {
    title: "Why methodology matters",
    body:
      "Status pages work best when users understand what the tool measured, what the page inferred, and what follow-up checks are sensible. That is why these pages are linked from the main status hubs and trust pages.",
  },
] as const

export default function StatusChecksMethodologyPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      {methodologySchema ? <JsonLd id="status-methodology-schema" schema={methodologySchema} /> : null}

      <header className="max-w-3xl space-y-4">
        <PageBreadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Methodology", href: "/methodology/status-checks" },
            { label: "Status Checks" },
          ]}
        />
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
          Methodology
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          Status-check methodology
        </h1>
        <p className="text-base leading-relaxed text-muted-foreground">
          This page explains what Plain Tools status routes are intended to measure, how canonical
          status pages differ from query-like entry pages, and how to interpret live results
          without overstating what a single probe can prove.
        </p>
        <div className="inline-flex rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground">
          Last reviewed: {LAST_REVIEWED}
        </div>
      </header>

      <section className="mt-10 grid gap-4 md:grid-cols-2">
        {phases.map((phase) => (
          <article key={phase.title} className="rounded-xl border border-border/70 bg-card/50 p-5">
            <h2 className="text-lg font-semibold text-foreground">{phase.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{phase.body}</p>
          </article>
        ))}
      </section>

      <section className="mt-10 rounded-2xl border border-border/70 bg-card/50 p-6">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">Recommended follow-up checks</h2>
        <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            If a service looks down, compare the canonical status route with DNS lookup results,
            latency tests, and region-aware checks where available. This is the fastest way to
            separate platform-wide incidents from local network conditions.
          </p>
          <div className="flex flex-wrap gap-2">
            <Link href="/status" className="rounded-full border border-border bg-background px-4 py-2 transition hover:border-accent/40 hover:text-accent">
              Browse status directory
            </Link>
            <Link href="/site-status" className="rounded-full border border-border bg-background px-4 py-2 transition hover:border-accent/40 hover:text-accent">
              Run live site check
            </Link>
            <Link href="/dns-lookup" className="rounded-full border border-border bg-background px-4 py-2 transition hover:border-accent/40 hover:text-accent">
              DNS lookup
            </Link>
            <Link href="/ping-test" className="rounded-full border border-border bg-background px-4 py-2 transition hover:border-accent/40 hover:text-accent">
              Ping test
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
