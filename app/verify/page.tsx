import { Metadata } from "next"
import Link from "next/link"
import {
  Shield,
  Eye,
  Server,
  Code,
  CheckCircle,
  ExternalLink,
  Lock,
  Cpu,
} from "lucide-react"
import { Surface } from "@/components/surface"
import { generateStaticPageMetadata } from "@/lib/seo"

export const metadata: Metadata = generateStaticPageMetadata({
  title: "Verify Our Privacy Claims",
  description: "Verify that Plain Tools actually works the way we claim. Open source, transparent, and verifiable. No data uploads, no tracking, no compromises.",
  slug: "verify",
})

const claims = [
  {
    icon: <Server className="h-5 w-5" />,
    title: "No server uploads",
    description: "Your files never leave your device. All processing happens in your browser using JavaScript and WebAssembly.",
    verification: "Open browser DevTools (Network tab) while using any tool. You'll see no outbound requests containing your data.",
  },
  {
    icon: <Eye className="h-5 w-5" />,
    title: "No tracking",
    description: "We don't use analytics that track individual users. No cookies, no fingerprinting, no user profiles.",
    verification: "Check the Network tab for third-party requests. Review our source code for analytics implementations.",
  },
  {
    icon: <Lock className="h-5 w-5" />,
    title: "No accounts required",
    description: "Use any tool without signing up. We don't need your email or personal information.",
    verification: "Simply use the tools. No signup prompts, no login walls, no personal data collection.",
  },
  {
    icon: <Cpu className="h-5 w-5" />,
    title: "Local processing only",
    description: "PDF operations use pdf-lib and other WebAssembly libraries that run entirely in your browser.",
    verification: "View the source code. Check the browser's DevTools to see WebAssembly modules loading locally.",
  },
]

const steps = [
  {
    step: "1",
    title: "Open DevTools",
    description: "Press F12 or right-click and select 'Inspect' to open your browser's developer tools.",
  },
  {
    step: "2",
    title: "Go to Network tab",
    description: "Click the Network tab to monitor all HTTP requests made by the page.",
  },
  {
    step: "3",
    title: "Use any tool",
    description: "Load a file and process it. Watch the Network tab for any outbound data transfers.",
  },
  {
    step: "4",
    title: "Verify no uploads",
    description: "You'll see only static asset requests. No file data is sent to any server.",
  },
]

export default function VerifyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      {/* Hero */}
      <div className="mb-16 text-center">
        <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 ring-1 ring-emerald-500/20">
          <Shield className="h-7 w-7 text-emerald-400" />
        </div>
        <h1 className="mb-4 text-balance text-4xl font-bold tracking-tight text-foreground">
          Verify our claims
        </h1>
        <p className="mx-auto max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
          We believe privacy claims should be verifiable, not just stated. 
          Here&apos;s how you can confirm that our tools actually work the way we say they do.
        </p>
      </div>

      {/* Claims Grid */}
      <section className="mb-20">
        <h2 className="mb-8 text-2xl font-semibold text-foreground">Our privacy claims</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {claims.map((claim) => (
            <Surface key={claim.title}>
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20">
                {claim.icon}
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                {claim.title}
              </h3>
              <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                {claim.description}
              </p>
              <div className="rounded-xl bg-white/[0.04] p-4 ring-1 ring-white/[0.08]">
                <p className="text-xs font-medium text-muted-foreground">
                  <span className="text-emerald-400">How to verify:</span>{" "}
                  {claim.verification}
                </p>
              </div>
            </Surface>
          ))}
        </div>
      </section>

      {/* How to Verify */}
      <section id="how-it-works" className="mb-20">
        <h2 className="mb-8 text-2xl font-semibold text-foreground">
          How to verify yourself
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <Surface key={step.step} className="p-6">
              <div className="mb-4 flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-sm font-bold text-background">
                {step.step}
              </div>
              <h3 className="mb-2 font-semibold text-foreground">{step.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </Surface>
          ))}
        </div>
      </section>

      {/* Source Code */}
      <section className="mb-20">
        <h2 className="mb-8 text-2xl font-semibold text-foreground">View the source</h2>
        <Surface>
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/[0.08] ring-1 ring-white/[0.12]">
              <Code className="h-6 w-6 text-foreground" />
            </div>
            <div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                Open source verification
              </h3>
              <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                Our code is open source. You can inspect exactly how each tool works, 
                what libraries we use, and verify that no data is transmitted to external servers.
              </p>
              <Link
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
              >
                View on GitHub
                <ExternalLink className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </Surface>
      </section>

      {/* Technical Details */}
      <section>
        <h2 className="mb-8 text-2xl font-semibold text-foreground">
          Technical architecture
        </h2>
        <div className="space-y-4">
          <Surface>
            <div className="flex items-start gap-4">
              <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">WebAssembly processing</h3>
                <p className="text-sm text-muted-foreground">
                  PDF operations use compiled WebAssembly modules (pdf-lib, etc.) that execute entirely 
                  within your browser&apos;s sandbox. No server-side processing.
                </p>
              </div>
            </div>
          </Surface>
          <Surface>
            <div className="flex items-start gap-4">
              <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">Web Workers</h3>
                <p className="text-sm text-muted-foreground">
                  Heavy computations run in Web Workers to keep the UI responsive. 
                  Workers operate in the same browser context with no network access to external servers.
                </p>
              </div>
            </div>
          </Surface>
          <Surface>
            <div className="flex items-start gap-4">
              <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">File API</h3>
                <p className="text-sm text-muted-foreground">
                  Files are read using the browser&apos;s File API and processed in-memory. 
                  Downloaded results are generated client-side using Blob URLs.
                </p>
              </div>
            </div>
          </Surface>
          <Surface>
            <div className="flex items-start gap-4">
              <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">No persistent storage</h3>
                <p className="text-sm text-muted-foreground">
                  We don&apos;t store your files anywhere. Once you close or refresh the page, 
                  all data is cleared from memory. No localStorage, no IndexedDB for file storage.
                </p>
              </div>
            </div>
          </Surface>
        </div>
      </section>
    </div>
  )
}
