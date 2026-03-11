import Link from "next/link"

type LinkGridItem = {
  label: string
  href: string
  description?: string
}

type LinkGridSectionProps = {
  title: string
  description?: string
  items: LinkGridItem[]
  columns?: "2" | "3" | "4"
}

const columnClasses: Record<NonNullable<LinkGridSectionProps["columns"]>, string> = {
  "2": "sm:grid-cols-2",
  "3": "sm:grid-cols-2 lg:grid-cols-3",
  "4": "sm:grid-cols-2 lg:grid-cols-4",
}

export function LinkGridSection({
  title,
  description,
  items,
  columns = "3",
}: LinkGridSectionProps) {
  if (items.length === 0) return null

  return (
    <section className="rounded-2xl border border-border/80 bg-card/60 p-5 md:p-6">
      <h2 className="text-xl font-semibold tracking-tight text-foreground">{title}</h2>
      {description ? (
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      ) : null}
      <div className={`mt-4 grid gap-3 ${columnClasses[columns]}`}>
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-xl border border-border/70 bg-background/60 px-4 py-3 transition hover:border-accent/40"
          >
            <div className="text-sm font-semibold text-foreground transition hover:text-accent">
              {item.label}
            </div>
            {item.description ? (
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            ) : null}
          </Link>
        ))}
      </div>
    </section>
  )
}
