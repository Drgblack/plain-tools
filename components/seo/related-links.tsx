import Link from "next/link"
import { ArrowRight } from "lucide-react"

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
    <section className="rounded-2xl border border-border/80 bg-card/60 p-5 shadow-[0_12px_40px_-28px_rgba(0,112,243,0.35)] md:p-6">
      <h2 className="text-lg font-semibold tracking-tight text-foreground md:text-xl">{heading}</h2>
      <p className="mt-1 text-sm text-muted-foreground">Continue with related tools, comparisons, and practical guides.</p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {visibleSections.map((section) => (
          <div
            key={section.title}
            className="rounded-xl border border-border/70 bg-background/50 p-3.5 transition-colors hover:border-accent/35"
          >
            <h3 className="text-sm font-semibold text-foreground">{section.title}</h3>
            <ul className="mt-2 space-y-2.5">
              {section.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-1 text-sm font-medium text-accent transition-colors hover:text-accent/90 hover:underline"
                  >
                    {link.label}
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
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
