import type { Metadata } from "next"
import Link from "next/link"

import { JsonLd } from "@/components/seo/json-ld"
import { PageBreadcrumbs } from "@/components/seo/page-breadcrumbs"
import { buildPageMetadata } from "@/lib/page-metadata"
import { getStatusObservabilityStorageInfo, getStatusTrends } from "@/lib/status-trending"
import { STATUS_CATEGORIES, STATUS_CATEGORY_META } from "@/lib/status-domains"
import { STATUS_QUERY_PAGES, statusQueryPathForSlug } from "@/lib/status-query-pages"
import {
  buildBreadcrumbList,
  buildItemListSchema,
  buildWebPageSchema,
  combineJsonLd,
} from "@/lib/structured-data"

export const metadata: Metadata = buildPageMetadata({
  title: "Trending website status checks today",
  description:
    "See the most checked website outage pages today on Plain Tools. Browse canonical status routes and jump into DNS, latency, and IP diagnostics.",
  path: "/status/trending",
  image: "/og/default.png",
})

export const revalidate = 300

export default async function StatusTrendingPage() {
  const storage = getStatusObservabilityStorageInfo()
  const [topChecks, developerChecks, socialChecks] = await Promise.all([
    getStatusTrends({ limit: 100, segment: "all" }),
    getStatusTrends({ limit: 12, segment: "developer" }),
    getStatusTrends({ limit: 12, segment: "social" }),
  ])

  const schema = combineJsonLd([
    buildWebPageSchema({
      name: "Trending website status checks today",
      description:
        "Live ranking of the most checked status pages on Plain Tools, with direct links to canonical domain checks.",
      url: "https://plain.tools/status/trending",
    }),
    buildBreadcrumbList([
      { name: "Home", url: "https://plain.tools/" },
      { name: "Site Status", url: "https://plain.tools/site-status" },
      { name: "Trending Checks", url: "https://plain.tools/status/trending" },
    ]),
    buildItemListSchema(
      "Trending status checks today",
      topChecks.slice(0, 50).map((entry) => ({
        name: `Is ${entry.domain} down?`,
        description: `Checked ${entry.count} times today.`,
        url: `https://plain.tools${entry.href}`,
      })),
      "https://plain.tools/status/trending"
    ),
  ])

  return (
    <article className="min-h-screen bg-background">
      {schema ? <JsonLd id="status-trending-schema" schema={schema} /> : null}
      <section className="border-b border-border/60 px-4 py-10">
        <div className="mx-auto max-w-6xl space-y-4">
          <PageBreadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Site Status", href: "/site-status" },
              { label: "Trending Checks" },
            ]}
          />
          <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            Trending website status checks today
          </h1>
          <p className="max-w-4xl text-sm leading-relaxed text-muted-foreground md:text-base">
            This page ranks the domains checked most often today. “Trending” means anonymous
            aggregate check counts by domain, not personal activity tracking.
          </p>
          <p className="max-w-4xl text-sm leading-relaxed text-muted-foreground">
            We only store domain-level popularity and recent status snapshots. We do not store IP
            addresses, user identifiers, or file data.
          </p>
          <p className="max-w-4xl text-xs leading-relaxed text-muted-foreground">
            Storage mode: {storage.persistence}.
          </p>
          <div className="flex flex-wrap gap-2 text-xs">
            <Link
              href="/site-status"
              className="rounded-full border border-border bg-card px-3 py-1.5 text-muted-foreground transition hover:border-accent/40 hover:text-accent"
            >
              Check another website
            </Link>
            <Link
              href="/status"
              className="rounded-full border border-border bg-card px-3 py-1.5 text-muted-foreground transition hover:border-accent/40 hover:text-accent"
            >
              Open status directory
            </Link>
            <Link
              href="/dns-lookup"
              className="rounded-full border border-border bg-card px-3 py-1.5 text-muted-foreground transition hover:border-accent/40 hover:text-accent"
            >
              DNS lookup
            </Link>
            <Link
              href="/ping-test"
              className="rounded-full border border-border bg-card px-3 py-1.5 text-muted-foreground transition hover:border-accent/40 hover:text-accent"
            >
              Latency test
            </Link>
            <Link
              href="/what-is-my-ip"
              className="rounded-full border border-border bg-card px-3 py-1.5 text-muted-foreground transition hover:border-accent/40 hover:text-accent"
            >
              IP checker
            </Link>
            <Link
              href="/network-tools"
              className="rounded-full border border-border bg-card px-3 py-1.5 text-muted-foreground transition hover:border-accent/40 hover:text-accent"
            >
              Network tools hub
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-border/60 px-4 py-10">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            Top checked domains today
          </h2>
          <p className="mt-2 max-w-4xl text-sm leading-relaxed text-muted-foreground">
            These routes are canonical status pages. Use them for quick outage checks and repeat
            troubleshooting.
          </p>
          <ol className="mt-4 grid gap-2 md:grid-cols-2">
            {topChecks.map((entry, index) => (
              <li key={entry.domain}>
                <Link
                  href={entry.href}
                  className="flex items-center justify-between rounded-md border border-border/60 bg-card/40 px-3 py-2 text-sm text-muted-foreground transition hover:border-accent/40 hover:text-accent"
                >
                  <span>
                    {index + 1}. Is {entry.domain} down?
                  </span>
                  <span className="text-xs text-muted-foreground">{entry.count}</span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-b border-border/60 px-4 py-10">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-2">
          <section>
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              Popular developer service checks
            </h2>
            <ul className="mt-3 space-y-2">
              {developerChecks.map((entry) => (
                <li key={entry.domain}>
                  <Link
                    href={entry.href}
                    className="text-sm text-muted-foreground transition hover:text-accent hover:underline"
                  >
                    Check whether {entry.domain} is down
                  </Link>
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              Popular social platform checks
            </h2>
            <ul className="mt-3 space-y-2">
              {socialChecks.map((entry) => (
                <li key={entry.domain}>
                  <Link
                    href={entry.href}
                    className="text-sm text-muted-foreground transition hover:text-accent hover:underline"
                  >
                    Check whether {entry.domain} is down
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </section>

      <section className="border-b border-border/60 px-4 py-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Popular “is site down” pages
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {STATUS_QUERY_PAGES.map((entry) => (
              <Link
                key={entry.slug}
                href={statusQueryPathForSlug(entry.slug)}
                className="rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground transition hover:border-accent/40 hover:text-accent"
              >
                Is {entry.name} down?
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Browse status categories
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {STATUS_CATEGORIES.map((category) => (
              <Link
                key={category}
                href={`/status/${category}`}
                className="rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground transition hover:border-accent/40 hover:text-accent"
              >
                {STATUS_CATEGORY_META[category].title}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </article>
  )
}
