import Link from "next/link"

export default function DNSDomainNotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <h1 className="text-2xl font-semibold text-foreground">DNS page not found</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        The DNS route you requested could not be resolved. Try the main DNS Lookup tool to inspect
        a valid hostname such as example.com.
      </p>
      <Link
        href="/dns-lookup"
        className="mt-6 inline-flex rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-accent transition hover:border-accent/40 hover:text-accent"
      >
        Open DNS Lookup
      </Link>
    </div>
  )
}
