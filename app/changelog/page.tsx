import type { Metadata } from "next"
import Link from "next/link"

import { buildPageMetadata } from "@/lib/page-metadata"

export const metadata: Metadata = buildPageMetadata({
  title: "Changelog - Product Updates | Plain Tools",
  description:
    "Track recent Plain Tools updates across privacy, PDF workflows, SEO improvements, and platform reliability.",
  path: "/changelog",
  image: "/og/default.png",
})

const updates = [
  {
    date: "2026-03-06",
    title: "Metadata and canonical pass completed",
    notes: [
      "Standardised page titles and descriptions across key hubs and tool routes.",
      "Improved Open Graph and Twitter metadata for better social sharing previews.",
      "Aligned canonical URLs to reduce duplicate-indexing signals.",
    ],
  },
  {
    date: "2026-03-05",
    title: "Tool discoverability improvements",
    notes: [
      "Expanded server-rendered tool directory on /tools for stronger crawlability.",
      "Refined category labels and trust messaging for clearer navigation.",
      "Validated build output to confirm tool links are visible in static HTML.",
    ],
  },
  {
    date: "2026-03-04",
    title: "Navigation and route reliability updates",
    notes: [
      "Canonical redirects tightened for duplicated content routes.",
      "Improved homepage CTA behaviour and cross-section navigation consistency.",
      "Addressed structural routing issues affecting audit readiness.",
    ],
  },
]

export default function ChangelogPage() {
  return (
    <main className="flex-1 bg-background px-4 py-14 md:py-16">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          Changelog
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
          Recent Plain Tools updates. This page focuses on shipped changes only.
        </p>

        <div className="mt-10 space-y-6">
          {updates.map((update) => (
            <article key={update.date + update.title} className="rounded-xl border border-border bg-card/40 p-5">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">{update.date}</p>
              <h2 className="mt-1 text-lg font-semibold text-foreground">{update.title}</h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                {update.notes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-2">
          <Link
            href="/tools"
            className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition hover:border-accent/40 hover:text-accent"
          >
            Browse tools
          </Link>
          <Link
            href="/verify-claims"
            className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition hover:border-accent/40 hover:text-accent"
          >
            Verify claims
          </Link>
        </div>
      </div>
    </main>
  )
}
