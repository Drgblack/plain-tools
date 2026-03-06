import type { Metadata } from "next"
import Link from "next/link"

import { buildPageMetadata } from "@/lib/page-metadata"

export const metadata: Metadata = buildPageMetadata({
  title: "Roadmap",
  description:
    "Review the public Plain Tools roadmap with shipped work, active polish priorities, and planned areas, presented without artificial delivery-date promises.",
  path: "/roadmap",
  image: "/og/default.png",
})

const recentlyShipped = [
  "New offline tools for PDF conversion and signing workflows",
  "Improved homepage trust messaging and route discoverability",
  "Expanded schema coverage for tools and learn articles",
]

const currentlyPolishing = [
  "Cross-tool UX consistency for statuses, disclaimers, and download feedback",
  "Accessibility and keyboard support improvements on shared components",
  "Metadata and internal linking refinements for SEO stability",
]

const plannedNext = [
  "More robust browser diagnostics in Labs for heavy files",
  "Additional comparison and workflow education pages",
  "Performance and bundle size tuning on tool-heavy routes",
]

export default function RoadmapPage() {
  return (
    <main className="flex-1 bg-background px-4 py-14 md:py-16">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          Public Roadmap
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
          This roadmap is status-based, not date-promised. We publish what is shipped, what is being polished,
          and what is exploratory.
        </p>

        <div className="mt-10 space-y-6">
          <section className="rounded-xl border border-border bg-card/40 p-5">
            <h2 className="text-lg font-semibold text-foreground">Recently shipped</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
              {recentlyShipped.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="rounded-xl border border-border bg-card/40 p-5">
            <h2 className="text-lg font-semibold text-foreground">Currently polishing</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
              {currentlyPolishing.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="rounded-xl border border-border bg-card/40 p-5">
            <h2 className="text-lg font-semibold text-foreground">Planned next areas</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
              {plannedNext.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        </div>

        <div className="mt-10 flex flex-wrap gap-2">
          <Link
            href="/changelog"
            className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition hover:border-accent/40 hover:text-accent"
          >
            View changelog
          </Link>
          <Link
            href="/labs"
            className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition hover:border-accent/40 hover:text-accent"
          >
            Open Labs
          </Link>
          <Link
            href="/sitemap"
            className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition hover:border-accent/40 hover:text-accent"
          >
            Browse HTML sitemap
          </Link>
        </div>
      </div>
    </main>
  )
}
