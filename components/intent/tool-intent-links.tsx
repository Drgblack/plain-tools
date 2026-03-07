import Link from "next/link"

import { getIntentPagesForTool, type PdfIntentToolKey } from "@/lib/pdf-intent-pages"

type ToolIntentLinksProps = {
  toolKey: PdfIntentToolKey
  className?: string
}

export function ToolIntentLinks({ toolKey, className }: ToolIntentLinksProps) {
  const pages = getIntentPagesForTool(toolKey)
  if (pages.length === 0) return null

  return (
    <section className={className}>
      <div className="rounded-xl border border-border/70 bg-card/40 p-4 md:p-5">
        <h2 className="text-base font-semibold tracking-tight text-foreground md:text-lg">
          Search-friendly landing pages
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Prefer a page tailored to a specific query? These routes use the same underlying tool workflow.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {pages.map((page) => (
            <Link
              key={page.slug}
              href={`/${page.slug}`}
              className="rounded-full border border-border/70 bg-background/70 px-3 py-2 text-sm font-medium text-accent transition-colors hover:border-accent/40 hover:text-accent/90"
            >
              {page.h1.replace(" (Private, No Uploads)", "")}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
