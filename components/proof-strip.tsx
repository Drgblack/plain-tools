import type { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

type ProofPoint = {
  title: string
  detail: string
  icon: LucideIcon
}

type ProofStripProps = {
  points: ProofPoint[]
  className?: string
}

export function ProofStrip({ points, className }: ProofStripProps) {
  return (
    <div className={cn("grid gap-3 sm:grid-cols-2 lg:grid-cols-5", className)}>
      {points.map((point) => {
        const Icon = point.icon
        return (
          <div
            key={point.title}
            className="rounded-xl border border-border/80 bg-card/50 p-3.5"
          >
            <div className="flex items-start gap-2.5">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/12 ring-1 ring-accent/25">
                <Icon className="h-4 w-4 text-accent" />
              </div>
              <div>
                <p className="text-sm font-semibold tracking-tight text-foreground">{point.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{point.detail}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

