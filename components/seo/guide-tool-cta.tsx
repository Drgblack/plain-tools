import Link from "next/link"
import { ArrowRight } from "lucide-react"

type GuideToolCtaProps = {
  href: string
  label: string
  title?: string
  description?: string
}

export function GuideToolCta({
  href,
  label,
  title = "Use the matching tool",
  description = "Move from the guide into the live local workflow. The core processing path stays in your browser, with no upload-first handoff.",
}: GuideToolCtaProps) {
  return (
    <section className="rounded-2xl border border-border/80 bg-card/60 p-5 shadow-[0_12px_40px_-28px_rgba(0,112,243,0.35)] md:p-6">
      <h2 className="text-lg font-semibold tracking-tight text-foreground md:text-xl">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">
        {description}
      </p>
      <Link
        href={href}
        className="mt-4 inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/10 px-4 py-2 text-sm font-medium text-accent transition hover:border-accent/45 hover:bg-accent/15"
      >
        {label}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </section>
  )
}
