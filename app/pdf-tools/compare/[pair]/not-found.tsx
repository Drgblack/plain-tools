import Link from "next/link"

export default function PdfComparisonNotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <h1 className="text-2xl font-semibold text-foreground">Comparison page not found</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        The PDF comparison route you requested could not be found. Try the comparison hub or open
        a valid route such as /pdf-tools/compare/plain-tools-vs-smallpdf.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/pdf-tools/compare"
          className="inline-flex rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-accent transition hover:border-accent/40 hover:text-accent"
        >
          Browse Comparisons
        </Link>
        <Link
          href="/pdf-tools/compare/plain-tools-vs-smallpdf"
          className="inline-flex rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-accent transition hover:border-accent/40 hover:text-accent"
        >
          Open Plain Tools vs Smallpdf
        </Link>
      </div>
    </div>
  )
}
