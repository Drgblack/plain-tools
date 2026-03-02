import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PerformanceBenchmark } from "@/components/performance-benchmark"
import { ArrowLeft, FlaskConical } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Labs | Plain - Local PDF Tools",
  description: "Experimental features and performance benchmarking tools for Plain. Test your hardware's local processing capabilities.",
}

export default function LabsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="px-4 py-20 md:py-28">
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
                <h1 className="text-2xl font-bold tracking-tight text-foreground">Plain Labs</h1>
                <p className="text-[13px] text-muted-foreground/70">Experimental features and diagnostics</p>
              </div>
            </div>
            <p className="text-[14px] text-muted-foreground/80 max-w-2xl leading-relaxed">
              Test your device&apos;s local processing capabilities and explore experimental features. 
              All tests run entirely on your hardware with no data transmitted externally.
            </p>
          </div>

          {/* Performance Benchmark */}
          <section className="mb-12">
            <h2 className="text-[13px] font-medium text-muted-foreground/50 uppercase tracking-wider mb-4 font-mono">
              Performance Benchmark
            </h2>
            <PerformanceBenchmark />
          </section>

          {/* Coming soon section */}
          <section>
            <h2 className="text-[13px] font-medium text-muted-foreground/50 uppercase tracking-wider mb-4 font-mono">
              Coming Soon
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="p-5 rounded-xl bg-white/[0.02] ring-1 ring-white/[0.06]">
                <h3 className="text-[14px] font-semibold text-foreground/60 mb-2">WebGPU Stress Test</h3>
                <p className="text-[12px] text-muted-foreground/50 leading-relaxed">
                  Extended GPU benchmarking for AI workloads with detailed TFLOPS analysis.
                </p>
              </div>
              <div className="p-5 rounded-xl bg-white/[0.02] ring-1 ring-white/[0.06]">
                <h3 className="text-[14px] font-semibold text-foreground/60 mb-2">Memory Profiler</h3>
                <p className="text-[12px] text-muted-foreground/50 leading-relaxed">
                  Real-time memory usage visualisation during document processing.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
