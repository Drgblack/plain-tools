import { BadgeCheck, CloudOff, ShieldCheck, Webhook } from "lucide-react"

const trustSignals = [
  {
    icon: CloudOff,
    label: "Zero uploads since launch",
  },
  {
    icon: Webhook,
    label: "Works in Chrome, Edge, Safari, Firefox",
  },
  {
    icon: ShieldCheck,
    label: "GDPR-compatible by architecture",
  },
  {
    icon: BadgeCheck,
    label: "Verified by DevTools",
  },
]

export function TrustStrip() {
  return (
    <section className="border-y border-white/[0.08] bg-[oklch(0.14_0.005_250)] px-4 py-4">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-2 sm:gap-3">
        {trustSignals.map((signal) => (
          <span
            key={signal.label}
            className="inline-flex min-h-[36px] items-center gap-1.5 rounded-full border border-white/[0.1] bg-background/40 px-3 py-1.5 text-[11px] font-medium text-muted-foreground sm:text-xs"
          >
            <signal.icon className="h-3.5 w-3.5 text-accent/80" strokeWidth={2} />
            {signal.label}
          </span>
        ))}
      </div>
    </section>
  )
}
