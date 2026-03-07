import Link from "next/link"

import { JsonLd } from "@/components/seo/json-ld"
import { PageBreadcrumbs } from "@/components/seo/page-breadcrumbs"
import {
  STATUS_CATEGORIES,
  STATUS_CATEGORY_META,
  STATUS_DOMAINS_BY_CATEGORY,
  type StatusCategory,
} from "@/lib/status-domains"
import { statusPathFor } from "@/lib/site-status"
import {
  buildBreadcrumbList,
  buildItemListSchema,
  buildWebPageSchema,
  combineJsonLd,
} from "@/lib/structured-data"

type StatusCategoryPageProps = {
  category: StatusCategory
}

function categoryTitle(category: StatusCategory) {
  return category.replace(/-/g, " ")
}

export function StatusCategoryPage({ category }: StatusCategoryPageProps) {
  const metadata = STATUS_CATEGORY_META[category]
  const domains = STATUS_DOMAINS_BY_CATEGORY[category] ?? []
  const categoryHref = `/status/${category}`

  const schema = combineJsonLd([
    buildWebPageSchema({
      name: `${metadata.title} checker`,
      description: metadata.description,
      url: `https://plain.tools${categoryHref}`,
    }),
    buildBreadcrumbList([
      { name: "Home", url: "https://plain.tools/" },
      { name: "Status", url: "https://plain.tools/status" },
      { name: metadata.title, url: `https://plain.tools${categoryHref}` },
    ]),
    buildItemListSchema(
      `${metadata.title} domains`,
      domains.slice(0, 100).map((entry) => ({
        name: `Is ${entry.displayName} down?`,
        description: `Check current availability for ${entry.displayName}.`,
        url: `https://plain.tools${statusPathFor(entry.domain)}`,
      })),
      `https://plain.tools${categoryHref}`
    ),
  ])

  return (
    <article className="min-h-screen bg-background">
      {schema ? <JsonLd id={`status-category-schema-${category}`} schema={schema} /> : null}
      <section className="border-b border-border/60 px-4 py-10">
        <div className="mx-auto max-w-6xl space-y-4">
          <PageBreadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Status", href: "/status" },
              { label: metadata.title },
            ]}
          />
          <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            {metadata.title} checker
          </h1>
          <p className="max-w-4xl text-sm leading-relaxed text-muted-foreground md:text-base">
            {metadata.description}
          </p>
          <p className="max-w-4xl text-sm leading-relaxed text-muted-foreground">
            Outages can be global or local. Use each status page as a quick signal, then confirm
            with DNS lookup, latency checks, and a second network when results are mixed.
          </p>
        </div>
      </section>

      <section className="border-b border-border/60 px-4 py-10">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-lg font-semibold text-foreground">
            {categoryTitle(category)} services to check
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Canonical links below route to dedicated status pages for each service.
          </p>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {domains.map((entry) => (
              <li key={entry.domain}>
                <Link
                  href={statusPathFor(entry.domain)}
                  className="flex items-center justify-between rounded-md border border-border/60 bg-card/40 px-3 py-2 text-sm text-muted-foreground transition hover:border-accent/40 hover:text-accent"
                >
                  <span>Is {entry.displayName} down?</span>
                  <span className="text-xs text-muted-foreground">{entry.domain}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-b border-border/60 px-4 py-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Browse other categories
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {STATUS_CATEGORIES.filter((value) => value !== category).map((value) => (
              <Link
                key={value}
                href={`/status/${value}`}
                className="rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground transition hover:border-accent/40 hover:text-accent"
              >
                {STATUS_CATEGORY_META[value].title}
              </Link>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            <Link
              href="/status/trending"
              className="rounded-full border border-border bg-card px-3 py-1.5 text-muted-foreground transition hover:border-accent/40 hover:text-accent"
            >
              Trending checks today
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
          </div>
        </div>
      </section>
    </article>
  )
}
