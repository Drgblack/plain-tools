import { Check, Lock } from "lucide-react"

const privacyPoints = [
  "No file uploads",
  "No user accounts",
  "No analytics trackers",
  "No cookies required",
  "No server-side processing",
]

export function PrivacySection() {
  return (
    <section id="privacy" className="relative bg-[oklch(0.135_0.004_250)] px-4 pt-40 pb-36 md:pt-52 md:pb-48">
      {/* Top transition gradient */}
      <div className="absolute inset-x-0 -top-16 h-16 bg-gradient-to-b from-transparent to-[oklch(0.135_0.004_250)]" />
      {/* Top accent line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/25 to-transparent" />
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-accent/[0.03] to-transparent" />
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="animate-accent-line h-6 w-1 rounded-full bg-accent" />
            <h2 className="text-2xl font-semibold tracking-tight text-foreground leading-tight">
              Privacy by Design
            </h2>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-accent/8 px-3 py-1.5 ring-1 ring-accent/15">
            <Lock className="h-3 w-3 text-[#9dd2ff]" strokeWidth={2} />
            <span className="text-[10px] font-medium tracking-wide text-[#9dd2ff]">VERIFIABLE</span>
          </div>
        </div>
        {/* Dark card container for premium feel */}
        <div className="mt-10 rounded-xl bg-[oklch(0.165_0.006_250)] p-6 ring-1 ring-accent/10 md:p-8">
          <ul className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
            {privacyPoints.map((point) => (
              <li key={point} className="flex items-center gap-3.5">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/14 ring-1 ring-accent/25">
                  <Check className="h-3.5 w-3.5 text-accent" strokeWidth={2.5} />
                </div>
                <span className="text-[13px] font-medium text-foreground/90">{point}</span>
              </li>
            ))}
          </ul>
          <p className="mt-8 border-l-2 border-accent/30 pl-4 text-[13px] italic text-foreground/70">
            {"If it can't be verified, it doesn't belong here."}
          </p>
        </div>
      </div>
    </section>
  )
}
