import { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Monitor, WifiOff, Search, ShieldX } from "lucide-react"

export const metadata: Metadata = {
  title: "How Plain Works",
  description: "Plain explains how PDFs are processed locally in your browser using WebAssembly without uploading files. Built for private, offline-first PDF workflows with.",
  openGraph: {
    title: "How Plain Works - Plain",
    description: "Plain explains how PDFs are processed locally in your browser without uploading files.",
  },
  alternates: {
    canonical: "https://plain.tools/how-it-works",
  },
}

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="px-4 py-16">
        <div className="mx-auto max-w-3xl">
          {/* Page Title */}
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            How Plain Works
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Plain processes PDF files locally in your browser using modern web
            technologies. Files are never uploaded to a server and never leave
            your device.
          </p>

          {/* Section 1 - Client-Side Processing */}
          <section className="mt-16">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-secondary">
                <Monitor className="h-5 w-5 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">
                Everything runs locally
              </h2>
            </div>
            <div className="mt-4 space-y-4 text-muted-foreground">
              <p>
                All PDF operations happen inside your browser environment using
                WebAssembly and JavaScript. When you select a file, it is read
                directly into memory on your device. The processing logic
                executes locally, and the output is generated without any
                network requests.
              </p>
              <p>
                After the initial page load, no data is sent elsewhere. The
                tools function entirely within your browser tab.
              </p>
            </div>
          </section>

          {/* Section 2 - Offline Capability */}
          <section className="mt-14">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-secondary">
                <WifiOff className="h-5 w-5 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">
                Works offline
              </h2>
            </div>
            <div className="mt-4 space-y-4 text-muted-foreground">
              <p>
                Once the page is loaded, you can disconnect from the internet
                and continue using the tools. This is intentional and
                verifiable.
              </p>
              <p>
                Try it yourself: load any tool page, turn off your Wi-Fi or
                enable airplane mode, and process a PDF. It will work exactly
                the same way.
              </p>
            </div>
          </section>

          {/* Section 3 - Verifiability */}
          <section className="mt-14">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-secondary">
                <Search className="h-5 w-5 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">
                You don't have to trust us
              </h2>
            </div>
            <div className="mt-4 space-y-4 text-muted-foreground">
              <p>
                Users can verify that no files are uploaded by inspecting
                network activity:
              </p>
              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>Open your browser DevTools (F12 or Cmd+Opt+I)</li>
                <li>Navigate to the Network tab</li>
                <li>Process a PDF file</li>
                <li>Confirm no file uploads occur</li>
              </ul>
              <p>
                You will see only static asset requests from the initial page
                load. No POST requests, no file data leaving your machine.
              </p>
            </div>
            <div className="mt-6 rounded-md border border-border bg-secondary/30 px-4 py-3">
              <p className="text-sm text-muted-foreground">
                "If it can't be verified, it doesn't belong here."
              </p>
            </div>
          </section>

          {/* Section 4 - What Plain Does Not Do */}
          <section className="mt-14">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-secondary">
                <ShieldX className="h-5 w-5 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">
                What Plain does not do
              </h2>
            </div>
            <ul className="mt-4 ml-4 list-inside list-disc space-y-2 text-muted-foreground">
              <li>No accounts</li>
              <li>No cloud storage</li>
              <li>No tracking pixels</li>
              <li>No behavioural analytics</li>
              <li>No server-side processing</li>
            </ul>
          </section>

          {/* SEO Content */}
          <section className="mt-20 border-t border-border pt-12">
            <p className="text-sm leading-relaxed text-muted-foreground">
              Plain provides client-side PDF tools designed for users who
              prioritize privacy. With offline PDF processing capabilities, you
              can merge PDF without upload, split documents, and reorder pages
              without any data leaving your device. These private PDF utilities
              are built for professionals in legal, healthcare, finance, and
              other sectors where document confidentiality is non-negotiable.
              All operations execute locally in your browser using WebAssembly,
              ensuring your files remain under your control at all times.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}

