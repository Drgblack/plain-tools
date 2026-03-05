import Link from "next/link"

type RelatedLinkItem = {
  label: string
  href: string
}

type RelatedLinkSection = {
  title: string
  links: RelatedLinkItem[]
}

type RelatedLinksProps = {
  heading?: string
  sections: RelatedLinkSection[]
}

export function RelatedLinks({ heading = "Related resources", sections }: RelatedLinksProps) {
  const visibleSections = sections.filter((section) => section.links.length > 0)
  if (visibleSections.length === 0) return null

  return (
    <section className="rounded-xl border border-border bg-card/50 p-5">
      <h2 className="text-xl font-semibold text-foreground">{heading}</h2>
      <div className="mt-4 grid gap-5 sm:grid-cols-2">
        {visibleSections.map((section) => (
          <div key={section.title}>
            <h3 className="text-sm font-medium text-foreground">{section.title}</h3>
            <ul className="mt-2 space-y-2">
              {section.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm font-medium text-accent hover:underline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
