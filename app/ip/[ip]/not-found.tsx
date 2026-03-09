import Link from "next/link"

export default function IPNotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <h1 className="text-2xl font-semibold text-foreground">IP lookup page not found</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        The IP lookup route you requested could not be loaded. Try the main What Is My IP page or
        open a valid IPv4 or IPv6 lookup route directly.
      </p>
      <Link
        href="/what-is-my-ip"
        className="mt-6 inline-flex rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-accent transition hover:border-accent/40 hover:text-accent"
      >
        Open What Is My IP
      </Link>
    </div>
  )
}
