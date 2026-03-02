import { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Check, X, Chrome, MousePointer, Zap, Shield, FileText } from "lucide-react"

export const metadata: Metadata = {
  title: "Browser Extension - Plain",
  description: "Offline PDF tools, one click away. The Plain browser extension gives you instant access to privacy-focused PDF tools without leaving your current tab.",
  openGraph: {
    title: "Browser Extension - Plain",
    description: "Offline PDF tools, one click away. Instant access to privacy-focused PDF tools.",
  },
}

const features = [
  {
    icon: MousePointer,
    title: "One-click access",
    description: "Click the icon to open Plain tools in a clean panel. Quick access to Merge and Split.",
  },
  {
    icon: Zap,
    title: "Same offline processing",
    description: "All processing happens in your browser. Files never leave your device.",
  },
  {
    icon: Shield,
    title: "Minimal permissions",
    description: "Only requests what's needed: permission to display the popup panel.",
  },
]

const doesList = [
  "Opens Plain tools in a clean popup panel",
  "Provides quick access to Merge PDF and Split PDF",
  "Uses the same offline, client-side processing",
  "Works after initial load without internet",
]

const doesNotList = [
  "Intercept file downloads",
  "Auto-run or process files automatically",
  "Upload your files anywhere",
  "Track your browsing activity",
  "Access your page content",
  "Run background processes",
]

const useCases = [
  {
    title: "Quick access while working",
    description: "Click the extension icon to open Merge or Split in a panel. No need to open a new tab or navigate away from your current work.",
  },
  {
    title: "Sensitive document handling",
    description: "Merge or split confidential PDFs without uploading to cloud services. Processing happens entirely in the panel.",
  },
  {
    title: "Frequent PDF tasks",
    description: "If you regularly combine or extract PDF pages, the extension provides faster access than bookmarking the website.",
  },
  {
    title: "Offline or restricted networks",
    description: "After the panel loads once, it works without internet. Useful for air-gapped environments or limited connectivity.",
  },
]

export default function ExtensionPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero */}
        <section className="relative px-4 py-20 md:py-28">
          <div className="mx-auto max-w-3xl text-center">
            {/* Extension badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-accent/8 px-4 py-1.5 ring-1 ring-accent/15">
              <Chrome className="h-4 w-4 text-accent" />
              <span className="text-[12px] font-medium text-accent">Browser Extension</span>
            </div>
            
            <h1 className="text-[32px] font-bold tracking-tight text-foreground md:text-[40px]">
              Offline PDF tools, one click away.
            </h1>
            
            <p className="mt-5 text-[16px] leading-relaxed text-muted-foreground">
              The Plain browser extension gives you instant access to privacy-focused 
              PDF tools without leaving your current tab. Same offline processing, 
              same privacy guarantees.
            </p>
            
            {/* CTA */}
            <div className="mt-10">
              <a
                href="https://chrome.google.com/webstore/detail/plain"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 rounded-lg bg-accent px-6 py-3 text-[15px] font-semibold text-accent-foreground transition-all hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <Chrome className="h-5 w-5" />
                Add to Chrome
              </a>
              
              {/* Trust badge */}
              <div className="mt-6">
                <Link
                  href="/learn/no-uploads-explained"
                  className="inline-flex items-center gap-2 rounded-full bg-[oklch(0.14_0.004_250)] px-4 py-2 text-[13px] text-muted-foreground border border-white/[0.08] transition-colors hover:border-accent/25 hover:text-foreground"
                >
                  <Shield className="h-4 w-4 text-accent/70" />
                  Offline by design. No uploads. No accounts.
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="relative border-y border-white/[0.06] bg-[oklch(0.13_0.004_250)] px-4 py-16 md:py-20">
          <div className="mx-auto max-w-4xl">
            <div className="grid gap-8 md:grid-cols-3">
              {features.map((feature) => (
                <div key={feature.title} className="text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 ring-1 ring-accent/20">
                    <feature.icon className="h-6 w-6 text-accent" strokeWidth={1.75} />
                  </div>
                  <h3 className="text-[15px] font-semibold text-foreground">{feature.title}</h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What it does / doesn't do */}
        <section className="px-4 py-16 md:py-20">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-center text-[22px] font-semibold text-foreground">
              What the extension does
            </h2>
            
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {/* Does */}
              <div className="rounded-lg bg-[oklch(0.15_0.005_250)] p-6 border border-white/[0.08]">
                <h3 className="text-[14px] font-semibold text-foreground mb-5">The extension does:</h3>
                <ul className="space-y-3">
                  {doesList.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-500/10 ring-1 ring-green-500/20">
                        <Check className="h-3 w-3 text-green-500" />
                      </div>
                      <span className="text-[14px] text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Does not */}
              <div className="rounded-lg bg-[oklch(0.15_0.005_250)] p-6 border border-white/[0.08]">
                <h3 className="text-[14px] font-semibold text-foreground mb-5">The extension does NOT:</h3>
                <ul className="space-y-3">
                  {doesNotList.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted-foreground/10 ring-1 ring-muted-foreground/20">
                        <X className="h-3 w-3 text-muted-foreground" />
                      </div>
                      <span className="text-[14px] text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* When it's useful */}
        <section className="relative border-y border-white/[0.06] bg-[oklch(0.12_0.003_250)] px-4 py-16 md:py-20">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60">
              When it's useful
            </h2>
            <div className="mt-8 space-y-6">
              {useCases.map((useCase) => (
                <div key={useCase.title} className="rounded-lg bg-[oklch(0.15_0.005_250)] p-5 border border-white/[0.08]">
                  <h3 className="text-[15px] font-semibold text-foreground">{useCase.title}</h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
                    {useCase.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Permissions explained */}
        <section className="px-4 py-16 md:py-20">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center text-[22px] font-semibold text-foreground">
              Permissions explained
            </h2>
            <p className="mt-4 text-center text-[14px] text-muted-foreground">
              The extension requests minimal permissions. Here's exactly what each one does.
            </p>
            
            <div className="mt-10 space-y-4">
              <div className="rounded-lg bg-[oklch(0.15_0.005_250)] p-5 border border-white/[0.08]">
                <div className="flex items-start gap-4">
                  <code className="shrink-0 rounded bg-[oklch(0.12_0.003_250)] px-2 py-1 text-[12px] font-mono text-accent">
                    activeTab
                  </code>
                  <div>
                    <p className="text-[14px] font-medium text-foreground">Display the popup panel</p>
                    <p className="mt-1 text-[13px] text-muted-foreground">
                      Allows the extension icon to open the Plain tools panel when clicked. 
                      Does not access any page content or data.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="rounded-lg bg-[oklch(0.15_0.005_250)] p-5 border border-white/[0.08]">
                <div className="flex items-start gap-4">
                  <code className="shrink-0 rounded bg-[oklch(0.12_0.003_250)] px-2 py-1 text-[12px] font-mono text-accent">
                    storage
                  </code>
                  <div>
                    <p className="text-[14px] font-medium text-foreground">Remember your preferences</p>
                    <p className="mt-1 text-[13px] text-muted-foreground">
                      Stores your tool preferences locally (e.g., last used tool). 
                      Data stays on your device and is never transmitted.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <p className="mt-8 text-center text-[13px] text-muted-foreground/70">
              No host permissions. No content script injection. No background processes.
            </p>
          </div>
        </section>

        {/* Privacy note */}
        <section className="relative border-t border-white/[0.06] bg-[oklch(0.12_0.003_250)] px-4 py-16 md:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 ring-1 ring-accent/20">
              <FileText className="h-6 w-6 text-accent" strokeWidth={1.75} />
            </div>
            <h2 className="text-[18px] font-semibold text-foreground">
              Same privacy, same architecture
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
              The extension is simply a shortcut to Plain's web tools. All PDF processing 
              still happens entirely in your browser using WebAssembly. Your files never 
              leave your device, and you can verify this by monitoring network activity.
            </p>
            <p className="mt-6 text-[13px] text-muted-foreground/70">
              Processed locally. Files never leave your device.
            </p>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="relative border-t border-white/[0.06] bg-[oklch(0.13_0.004_250)] px-4 py-16">
          <div className="mx-auto max-w-3xl text-center">
            <a
              href="https://chrome.google.com/webstore/detail/plain"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 rounded-lg bg-accent px-6 py-3 text-[15px] font-semibold text-accent-foreground transition-all hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <Chrome className="h-5 w-5" />
              Add to Chrome
            </a>
            
            {/* Trust badge */}
            <div className="mt-5">
              <Link
                href="/learn/no-uploads-explained"
                className="inline-flex items-center gap-2 text-[13px] text-muted-foreground/80 transition-colors hover:text-foreground"
              >
                <Shield className="h-3.5 w-3.5 text-accent/60" />
                Offline by design. No uploads. No accounts.
              </Link>
            </div>
            
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                href="/tools"
                className="text-[13px] text-muted-foreground/70 underline underline-offset-2 transition-colors hover:text-foreground"
              >
                View all tools
              </Link>
              <span className="text-muted-foreground/40">|</span>
              <Link
                href="/learn/how-plain-works"
                className="text-[13px] text-muted-foreground/70 underline underline-offset-2 transition-colors hover:text-foreground"
              >
                How Plain works
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
