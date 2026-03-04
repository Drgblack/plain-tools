import { Cpu, CloudOff, ShieldCheck } from "lucide-react"

const proofPoints = [
  {
    icon: Cpu,
    title: "100% Client-Side",
    description: "All processing happens locally in your browser",
  },
  {
    icon: CloudOff,
    title: "No Uploads",
    description: "Files are never sent to any server",
  },
  {
    icon: ShieldCheck,
    title: "Verifiable",
    description: "You can confirm this yourself in DevTools or offline mode",
  },
]

export function TrustStrip() {
  return (
    <section className="relative bg-[oklch(0.145_0.005_250)] px-4 py-32 md:py-40">
      {/* Top gradient fade */}
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-background to-transparent" />
      {/* Bottom gradient fade */}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent" />
      <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3 md:gap-10">
        {proofPoints.map((point, index) => (
          <div
            key={point.title}
            className="group relative flex flex-col items-center rounded-2xl bg-[oklch(0.16_0.006_250)] p-6 text-center ring-1 ring-white/[0.08] transition-all duration-200 ease-out hover:-translate-y-1 hover:ring-accent/30 focus-visible:ring-2 focus-visible:ring-accent/50 md:items-start md:p-8 md:text-left"
            style={{ animationDelay: `${index * 0.1}s` }}
            tabIndex={0}
          >
            {/* Icon with glow effect */}
            <div className="relative mb-5 md:mb-6">
              {/* Outer glow */}
              <div className="absolute -inset-3 rounded-2xl bg-accent/8 blur-xl transition-all duration-300 group-hover:bg-accent/12 group-hover:blur-2xl" />
              {/* Icon container - larger size */}
              <div className="relative flex h-[72px] w-[72px] items-center justify-center rounded-xl bg-accent/14 ring-1 ring-accent/35 transition-all duration-200 group-hover:bg-accent/20 group-hover:ring-accent/50">
                <point.icon className="h-9 w-9 text-accent transition-transform duration-200 group-hover:scale-105" strokeWidth={1.5} />
              </div>
            </div>
            <h3 className="relative text-[15px] font-semibold tracking-tight text-foreground">{point.title}</h3>
            <p className="relative mt-2 text-[13px] leading-relaxed text-muted-foreground">{point.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
