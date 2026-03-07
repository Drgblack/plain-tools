import type { Metadata } from "next"
import Link from "next/link"

import { JsonLd } from "@/components/seo/json-ld"
import { PageBreadcrumbs } from "@/components/seo/page-breadcrumbs"
import { TrendingStatus } from "@/components/trending-status"
import { buildPageMetadata } from "@/lib/page-metadata"
import { STATUS_QUERY_PAGES, statusQueryPathForSlug } from "@/lib/status-query-pages"
import {
  STATUS_CATEGORIES,
  STATUS_CATEGORY_META,
  STATUS_DOMAINS_BY_CATEGORY,
  STATUS_POPULAR_DOMAINS,
} from "@/lib/status-domains"
import { statusPathFor } from "@/lib/site-status"
import {
  buildBreadcrumbList,
  buildItemListSchema,
  buildWebPageSchema,
  combineJsonLd,
} from "@/lib/structured-data"

export const metadata: Metadata = buildPageMetadata({
  title: "Website status checker directory",
  description:
    "Check whether popular websites are down right now. Browse AI, messaging, streaming, developer, finance, and cloud status pages in one directory.",
  path: "/status",
  image: "/og/default.png",
})

const POPULAR_SAMPLE = [
  "chatgpt.com",
  "discord.com",
  "reddit.com",
  "youtube.com",
  "github.com",
  "google.com",
  "gmail.com",
  "netflix.com",
] as const

export default function StatusDirectoryPage() {
  const schema = combineJsonLd([
    buildWebPageSchema({
      name: "Website status checker directory",
      description:
        "Master status directory for checking whether major websites are down, with category hubs and canonical domain pages.",
      url: "https://plain.tools/status",
    }),
    buildBreadcrumbList([
      { name: "Home", url: "https://plain.tools/" },
      { name: "Status", url: "https://plain.tools/status" },
    ]),
    buildItemListSchema(
      "Popular website status checks",
      POPULAR_SAMPLE.map((domain) => ({
        name: `Is ${domain} down?`,
        url: `https://plain.tools${statusPathFor(domain)}`,
      })),
      "https://plain.tools/status"
    ),
  ])

  return (
    <article className="min-h-screen bg-background">
      {schema ? <JsonLd id="status-directory-schema" schema={schema} /> : null}
      <section className="border-b border-border/60 px-4 py-10">
        <div className="mx-auto max-w-6xl space-y-4">
          <PageBreadcrumbs items={[{ label: "Home", href: "/" }, { label: "Status" }]} />
          <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            Website status checker directory
          </h1>
          <p className="max-w-4xl text-sm leading-relaxed text-muted-foreground md:text-base">
            Use this hub to check whether a website is down, browse category-based status pages,
            and move quickly between related network diagnostics.
          </p>
          <form action="/site-status" method="get" className="rounded-xl border border-border/70 bg-card/35 p-4">
            <label htmlFor="status-query" className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              Search by domain
            </label>
            <input
              id="status-query"
              name="site"
              type="search"
              placeholder="chatgpt.com"
              className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
            />
            <p className="mt-2 text-xs text-muted-foreground">
              Enter any domain to run a live check and open its canonical status page.
            </p>
          </form>
        </div>
      </section>

      <section className="border-b border-border/60 px-4 py-10">
        <div className="mx-auto max-w-6xl">
          <TrendingStatus title="Trending checks today" limit={10} />
        </div>
      </section>

      <section className="border-b border-border/60 px-4 py-10">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-lg font-semibold text-foreground">Popular checks</h2>
          <ul className="mt-4 grid gap-2 md:grid-cols-2 lg:grid-cols-4">
            {STATUS_POPULAR_DOMAINS.slice(0, 24).map((domain) => (
              <li key={domain}>
                <Link
                  href={statusPathFor(domain)}
                  className="block rounded-md border border-border/60 bg-card/40 px-3 py-2 text-sm text-muted-foreground transition hover:border-accent/40 hover:text-accent"
                >
                  Is {domain} down?
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-b border-border/60 px-4 py-10">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-lg font-semibold text-foreground">
            Natural-language status checks
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Quick entry pages optimised for “is [site] down” searches.
          </p>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {STATUS_QUERY_PAGES.map((entry) => (
              <li key={entry.slug}>
                <Link
                  href={statusQueryPathForSlug(entry.slug)}
                  className="block rounded-md border border-border/60 bg-card/40 px-3 py-2 text-sm text-muted-foreground transition hover:border-accent/40 hover:text-accent"
                >
                  Is {entry.name} down?
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-b border-border/60 px-4 py-10">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-lg font-semibold text-foreground">Browse by category</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Category hubs make it easier to discover related status pages and internal diagnostics.
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {STATUS_CATEGORIES.map((category) => (
              <article key={category} className="rounded-lg border border-border bg-card/40 p-4">
                <Link
                  href={`/status/${category}`}
                  className="text-sm font-semibold text-foreground transition hover:text-accent hover:underline"
                >
                  {STATUS_CATEGORY_META[category].title}
                </Link>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {STATUS_CATEGORY_META[category].description}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {STATUS_DOMAINS_BY_CATEGORY[category]?.length ?? 0} services
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-10">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-lg font-semibold text-foreground">Related network diagnostics</h2>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <Link
              href="/site-status"
              className="rounded-full border border-border bg-card px-3 py-1.5 text-muted-foreground transition hover:border-accent/40 hover:text-accent"
            >
              Run a live status check
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
              href="/status/trending"
              className="rounded-full border border-border bg-card px-3 py-1.5 text-muted-foreground transition hover:border-accent/40 hover:text-accent"
            >
              Top checks today
            </Link>
          </div>
        </div>
      </section>
    </article>
  )
}
