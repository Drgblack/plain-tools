import Link from "next/link"

export function FinancialScopeNote({ compact = false }: { compact?: boolean }) {
  return (
    <section
      className={`rounded-2xl border border-border/80 bg-card/50 ${compact ? "p-4" : "p-5 md:p-6"}`}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        Scope note
      </p>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        Plain Tools keeps this calculator cluster focused on fast browser-only estimates.
        For deeper amortization tables, bracket-level tax planning, or advanced investment
        modeling, use{" "}
        <Link
          href="https://plainfigures.org"
          className="font-medium text-accent hover:underline"
          rel="noopener noreferrer"
          target="_blank"
        >
          plainfigures.org
        </Link>
        .
      </p>
    </section>
  )
}
