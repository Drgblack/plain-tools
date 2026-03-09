import Link from "next/link"

import type { Recommendation } from "@/lib/diagnosis-rules"

type DiagnosisResultCardProps = {
  recommendation: Recommendation
}

export function DiagnosisResultCard({ recommendation }: DiagnosisResultCardProps) {
  return (
    <article className="rounded-2xl border border-border/80 bg-card/60 p-5 shadow-[0_12px_40px_-28px_rgba(0,112,243,0.35)]">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="space-y-3">
          <div className="inline-flex rounded-full border border-accent/25 bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-accent">
            Recommended route
          </div>
          <div>
            <h3 className="text-xl font-semibold tracking-tight text-foreground">
              {recommendation.title}
            </h3>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              {recommendation.description}
            </p>
          </div>
        </div>
        <Link
          href={recommendation.url}
          className="inline-flex shrink-0 items-center justify-center rounded-xl bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition hover:opacity-90"
        >
          Open route
        </Link>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(240px,1fr)]">
        <div>
          <h4 className="text-sm font-semibold text-foreground">Why this helps</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {recommendation.whyThisHelps.map((point) => (
              <li
                key={point}
                className="rounded-xl border border-border/70 bg-background/70 px-3 py-2"
              >
                {point}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-foreground">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-emerald-700 dark:text-emerald-300">
            Privacy reminder
          </p>
          <p className="mt-2 leading-relaxed">{recommendation.privacyNote}</p>
        </div>
      </div>
    </article>
  )
}

