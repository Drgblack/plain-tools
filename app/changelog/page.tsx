import type { Metadata } from "next"
import Link from "next/link"
import { Rss } from "lucide-react"

import { buildPageMetadata } from "@/lib/page-metadata"
import { CHANGELOG_ITEMS } from "@/lib/changelog-data"

export const metadata: Metadata = buildPageMetadata({
  title: "Changelog",
  description:
    "Track shipped Plain Tools updates across PDF workflows, network diagnostics, trust features, and site-quality improvements with practical release notes.",
  path: "/changelog",
  image: "/og/default.png",
})

export default function ChangelogPage() {
  return (
    <main className="flex-1 bg-background px-4 py-14 md:py-16">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          Changelog
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
          Recent Plain Tools updates. This page lists shipped changes only, with links to the
          most relevant pages.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href="/changelog/rss.xml"
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition hover:border-accent/40 hover:text-accent"
          >
            <Rss className="h-3.5 w-3.5" />
            Subscribe via RSS
          </Link>
          <Link
            href="/roadmap"
            className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition hover:border-accent/40 hover:text-accent"
          >
            View roadmap
          </Link>
        </div>

        <div className="mt-10 space-y-6">
          {CHANGELOG_ITEMS.map((update) => (
            <article key={update.date + update.title} className="rounded-xl border border-border bg-card/40 p-5">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">{update.date}</p>
              <h2 className="mt-1 text-lg font-semibold text-foreground">{update.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{update.summary}</p>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                {update.notes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
              {update.links && update.links.length > 0 ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {update.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition hover:border-accent/40 hover:text-accent"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              ) : null}
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
