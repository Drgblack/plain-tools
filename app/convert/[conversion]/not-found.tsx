import Link from "next/link"

export default function FileConverterNotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <h1 className="text-2xl font-semibold text-foreground">Converter page not found</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        The converter route you requested is not available. Try the main file converters hub or
        open a valid route such as /convert/png-to-jpg.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/file-converters"
          className="inline-flex rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-accent transition hover:border-accent/40 hover:text-accent"
        >
          Browse File Converters
        </Link>
        <Link
          href="/convert/png-to-jpg"
          className="inline-flex rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-accent transition hover:border-accent/40 hover:text-accent"
        >
          Open PNG to JPG
        </Link>
      </div>
    </div>
  )
}
