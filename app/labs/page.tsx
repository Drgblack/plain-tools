import type { Metadata } from "next"
import { PerformanceBenchmark } from "@/components/performance-benchmark"
import { ArrowLeft, FlaskConical } from "lucide-react"
import Link from "next/link"
import { buildStandardPageTitle } from "@/lib/page-title"
import { applyIndexationPolicy } from "@/lib/seo/indexation-policy"

const baseMetadata: Metadata = {
  title: buildStandardPageTitle("Labs"),
  description:
    "Experimental diagnostics and exploratory prototypes for Plain Tools. Includes local benchmark tooling and transparent status labels.",
}

export const metadata: Metadata = applyIndexationPolicy(baseMetadata, "/labs")

const exploratoryTracks = [
  {
    title: "WebGPU Stress Test",
    status: "Exploratory",
    note: "No release date yet",
    description:
      "Extended GPU diagnostics for heavy local workflows. We are validating reliability across devices before publishing.",
  },
  {
    title: "Memory Profiler",
    status: "Planned",
    note: "Depends on benchmark feedback",
    description:
      "Live memory visibility during document processing. Scope and UX are still being refined based on real usage patterns.",
  },
]

export default function LabsPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="px-4 py-20 md:py-28 [&_p]:text-base">
        <div className="mx-auto max-w-4xl">
          {/* Back link */}
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-[13px] text-muted-foreground/70 transition-colors hover:text-foreground mb-8"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" strokeWidth={2} />
            Back to Tools
          </Link>

          {/* Page header */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0070f3]/10 ring-1 ring-[#0070f3]/30">
                <FlaskConical className="h-6 w-6 text-[#0070f3]" strokeWidth={1.5} />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-4xl">Plain Labs</h1>
                <p className="text-muted-foreground/70">Experimental features and diagnostics</p>
              </div>
            </div>
            <p className="max-w-2xl leading-relaxed text-muted-foreground/80">
              Labs contains diagnostics and experiments. Features listed here are prototypes or research tracks,
              not production commitments. All tests run entirely on your hardware with no data transmitted externally.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link
                href="/roadmap"
                className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition hover:border-accent/40 hover:text-accent"
              >
                View roadmap
              </Link>
              <Link
                href="/changelog"
                className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition hover:border-accent/40 hover:text-accent"
              >
                View changelog
              </Link>
            </div>
          </div>

          {/* Performance Benchmark */}
          <section className="mb-12">
            <h2 className="text-[13px] font-medium text-muted-foreground/50 uppercase tracking-wider mb-4 font-mono">
              Performance Benchmark
            </h2>
            <PerformanceBenchmark />
          </section>

          {/* Exploratory status section */}
          <section>
            <h2 className="text-[13px] font-medium text-muted-foreground/50 uppercase tracking-wider mb-4 font-mono">
              Exploratory Tracks
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {exploratoryTracks.map((item) => (
                <div key={item.title} className="p-5 rounded-xl bg-white/[0.02] ring-1 ring-white/[0.06]">
                  <div className="mb-2 flex items-center gap-2">
                    <h3 className="text-[14px] font-semibold text-foreground/80">{item.title}</h3>
                    <span className="rounded-full border border-white/[0.15] px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
                      {item.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground/60">{item.note}</p>
                  <p className="mt-2 text-muted-foreground/60 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-muted-foreground/60">
              Labs items are intentionally labelled without fixed dates until scope and stability are confirmed.
            </p>
          </section>
        </div>
      </main>
    </div>
  )
}


