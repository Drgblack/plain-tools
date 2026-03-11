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
  title: "Editorial policy | Plain Tools",
  description:
    "Read how Plain Tools reviews guide content, privacy claims, methodology pages, and product explanations before publication or revision.",
  path: "/editorial-policy",
  image: "/og/default.png",
  type: "article",
})

const editorialSchema = combineJsonLd([
  buildWebPageSchema({
    name: "Editorial policy | Plain Tools",
    description:
      "Editorial standards for Plain Tools guides, methodology pages, privacy claims, and product documentation.",
    url: "https://plain.tools/editorial-policy",
  }),
  buildArticleSchema({
    headline: "Plain Tools editorial policy",
    description:
      "Editorial standards for Plain Tools guides, methodology pages, privacy claims, and product documentation.",
    url: "https://plain.tools/editorial-policy",
    datePublished: "2026-03-11",
    dateModified: "2026-03-11",
    authorName: "Plain Tools",
  }),
  buildBreadcrumbList([
    { name: "Home", url: "https://plain.tools/" },
    { name: "Editorial policy", url: "https://plain.tools/editorial-policy" },
  ]),
])

const standards = [
  {
    title: "Claims are tied to architecture",
    description:
      "When Plain Tools says a workflow is local or no-upload, that statement should reflect the actual execution path in the browser, not a marketing summary.",
  },
  {
    title: "Guides must lead to working routes",
    description:
      "Informational pages should funnel into the live tool, canonical status route, or closest hub page rather than leaving users on disconnected informational dead ends.",
  },
  {
    title: "Methodology pages describe real inputs",
    description:
      "Status pages, verification pages, and diagnostic routes should explain what is measured, what is inferred, and what a user should validate independently.",
  },
  {
    title: "Updates are made when behaviour changes",
    description:
      "We prefer fewer but real update dates. When a workflow, verification step, or route structure changes, the support and methodology pages should be reviewed as part of the release.",
  },
] as const

export default function EditorialPolicyPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      {editorialSchema ? <JsonLd id="editorial-policy-schema" schema={editorialSchema} /> : null}

      <header className="max-w-3xl space-y-4">
        <PageBreadcrumbs items={[{ label: "Home", href: "/" }, { label: "Editorial Policy" }]} />
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
          Editorial standards
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          Editorial policy
        </h1>
        <p className="text-base leading-relaxed text-muted-foreground">
          Plain Tools publishes product pages, workflow guides, comparison pages, and methodology
          documents that are meant to be usable, verifiable, and consistent with how the tools
          actually behave. This page explains the standards we use when we publish or revise those
          documents.
        </p>
        <div className="inline-flex rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground">
          Last reviewed: {LAST_REVIEWED}
        </div>
      </header>

      <section className="mt-10 grid gap-4 md:grid-cols-2">
        {standards.map((standard) => (
          <article key={standard.title} className="rounded-xl border border-border/70 bg-card/50 p-5">
            <h2 className="text-lg font-semibold text-foreground">{standard.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {standard.description}
            </p>
          </article>
        ))}
      </section>

      <section className="mt-10 rounded-2xl border border-border/70 bg-card/50 p-6">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">How reviews are triggered</h2>
        <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            Editorial review should happen when tool behaviour changes, when the internal linking
            structure for a cluster changes, when a trust claim becomes broader or narrower, or when
            new hub pages change how users are meant to navigate the site. This is especially
            important for privacy explanations, status-check methodology, and comparison pages.
          </p>
          <p>
            Not every page is updated on a fixed calendar. Instead, the highest-value cluster pages
            are reviewed when there is a clear product, architecture, or search-structure reason to
            do so. That keeps visible update dates more credible and avoids false freshness signals.
          </p>
        </div>
      </section>

      <section className="mt-10 rounded-2xl border border-border/70 bg-card/50 p-6">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">Related trust pages</h2>
        <div className="mt-4 flex flex-wrap gap-2 text-sm">
          <Link href="/about" className="rounded-full border border-border bg-background px-4 py-2 text-muted-foreground transition hover:border-accent/40 hover:text-accent">
            About Plain Tools
          </Link>
          <Link href="/verify-claims" className="rounded-full border border-border bg-background px-4 py-2 text-muted-foreground transition hover:border-accent/40 hover:text-accent">
            Verify privacy claims
          </Link>
          <Link href="/methodology/status-checks" className="rounded-full border border-border bg-background px-4 py-2 text-muted-foreground transition hover:border-accent/40 hover:text-accent">
            Status-check methodology
          </Link>
        </div>
      </section>
    </main>
  )
}
