import { Metadata } from "next"
import Link from "next/link"
import Script from "next/script"
import { WifiOff, Activity, Code, CheckCircle2, Monitor, XCircle, ArrowRight, Eye, AlertTriangle } from "lucide-react"
import {
  generateTechArticleSchema,
  generateHowToSchema,
  generateFAQSchema,
  combineSchemas,
} from "@/lib/legacy/schema"

export const metadata: Metadata = {
  title: "Verify Offline Processing",
  description:
    "Plain shows how to verify that files are processed locally using browser DevTools. Inspect network requests, test offline functionality, and confirm no uploads occur.",
  openGraph: {
    title: "Verify Offline Processing - Plain",
    description: "Plain shows how to verify that files are processed locally using browser DevTools.",
  },
  alternates: {
    canonical: "https://plain.tools/verify",
  },
}

// TechArticle schema - technical verification guide
const articleSchema = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  headline: "How to Verify Offline Processing",
  description: "Technical guide to independently verify that Plain processes files locally without server uploads.",
  author: {
    "@type": "Organization",
    name: "Plain",
    url: "https://plain.tools",
  },
  publisher: {
    "@type": "Organization",
    name: "Plain",
    url: "https://plain.tools",
  },
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": "https://plain.tools/verify",
  },
  url: "https://plain.tools/verify",
  datePublished: "2026-01-15",
  dateModified: "2026-02-27",
  proficiencyLevel: "Beginner",
  inLanguage: "en",
}

// HowTo schema for verification steps
const howToSchema = generateHowToSchema({
  name: "How to Verify Plain Processes Files Locally",
  description: "Steps to confirm that Plain does not upload your files to any server using browser DevTools.",
  totalTime: "PT3M",
  steps: [
    { name: "Open DevTools", text: "Press F12 or right-click and select Inspect, then navigate to the Network tab." },
    { name: "Clear existing requests", text: "Click the clear button to remove previous network activity." },
    { name: "Process a file", text: "Select and process a PDF file while watching the Network tab." },
    { name: "Analyse requests", text: "Check that no POST requests contain file data or large payloads." },
    { name: "Test offline", text: "Disconnect from the internet and verify the tool still works." },
  ],
})

// FAQ schema for common verification questions
const faqSchema = generateFAQSchema([
  {
    question: "How can I tell if a website is uploading my files?",
    answer: "Open your browser DevTools (F12), go to the Network tab, and process a file. If you see POST requests with large payloads matching your file size, your files are being uploaded. Local-only tools show no such requests.",
  },
  {
    question: "What should the Network tab look like for local processing?",
    answer: "For genuine local processing, you should see minimal network activity when processing files. No large POST requests, no requests to external upload services, and no payloads containing your file data.",
  },
  {
    question: "Can I verify offline processing works without internet?",
    answer: "Yes. After loading the page, disconnect from the internet and process a file. If the tool works without connectivity, processing is genuinely local. Server-dependent tools will fail when offline.",
  },
  {
    question: "What proves that no uploads occur?",
    answer: "Three pieces of evidence: (1) No POST requests with file payloads in the Network tab, (2) The tool works when offline, (3) No upload progress indicators or server response delays during processing.",
  },
])

// Breadcrumb schema
const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://plain.tools/" },
    { "@type": "ListItem", position: 2, name: "Verify", item: "https://plain.tools/verify" },
  ],
}

// Combine all schemas
const combinedSchema = combineSchemas([articleSchema, howToSchema, faqSchema, breadcrumbSchema])

export default function VerifyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(combinedSchema) }}
      />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative border-b border-accent/10 bg-[oklch(0.12_0.004_250)] px-4 py-20 md:py-28">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[280px] w-[450px] rounded-full bg-accent/[0.08] blur-[100px]" />
          </div>
          
          <div className="relative mx-auto max-w-2xl">
            {/* Breadcrumb */}
            <nav className="mb-8 flex items-center gap-2 text-[13px] text-muted-foreground/80">
              <Link href="/pdf-tools/" className="rounded hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50">Home</Link>
              <span>/</span>
              <span className="text-foreground/90">Verify</span>
            </nav>

            <h1 className="text-3xl font-bold tracking-[-0.02em] text-foreground md:text-4xl">
              How to Verify Plain
            </h1>
            <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
              You don't have to take our word for it. Plain is designed to be verifiable.
              Here's how to confirm for yourself that your files never leave your device.
            </p>
          </div>
        </section>

        {/* In Simple Terms */}
        <section className="border-b border-accent/10 px-4 py-12">
          <div className="mx-auto max-w-2xl">
            <div className="rounded-xl border border-accent/15 bg-[oklch(0.17_0.008_250)] p-6">
              <p className="text-[13px] font-medium text-accent">In Simple Terms</p>
              <p className="mt-2 text-[14px] leading-relaxed text-foreground/90">
                Plain works entirely in your browser. You can verify this by disconnecting from the internet 
                after the page loads—the tools still work. You can also check your browser's Network tab 
                to confirm no files are sent anywhere. These tests take about 60 seconds.
              </p>
            </div>
          </div>
        </section>

        {/* Verification Methods */}
        <section className="px-4 py-16">
          <div className="mx-auto max-w-2xl space-y-16">
            
            {/* 1. Offline Test */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/12 ring-1 ring-accent/20">
                  <WifiOff className="h-5 w-5 text-accent" />
                </div>
                <h2 className="text-xl font-semibold tracking-tight text-foreground">
                  1. The Offline Test
                </h2>
              </div>
              <div className="space-y-4 text-[14px] leading-relaxed text-muted-foreground/90">
                <p>
                  The simplest way to verify Plain works locally is to test it without an internet connection.
                </p>
                <ol className="space-y-3 ml-4 list-decimal list-outside marker:text-accent/60">
                  <li>
                    Open any Plain tool (e.g., <Link href="/pdf-tools/tools/merge-pdf" className="text-accent hover:underline">Merge PDF</Link>)
                  </li>
                  <li>
                    Wait for the page to fully load
                  </li>
                  <li>
                    <strong className="text-foreground">Disconnect from the internet</strong> — turn off WiFi, 
                    enable airplane mode, or unplug your ethernet cable
                  </li>
                  <li>
                    Select files and process them as normal
                  </li>
                  <li>
                    The tool works exactly the same because all processing happens in your browser
                  </li>
                </ol>
                <p className="text-[13px] text-muted-foreground/70 mt-4">
                  If the tool required server uploads, it would fail immediately when offline. Plain doesn't.
                </p>
              </div>
            </div>

            {/* 2. Network Tab Check */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/12 ring-1 ring-accent/20">
                  <Activity className="h-5 w-5 text-accent" />
                </div>
                <h2 className="text-xl font-semibold tracking-tight text-foreground">
                  2. Network Tab Inspection
                </h2>
              </div>
              <div className="space-y-4 text-[14px] leading-relaxed text-muted-foreground/90">
                <p>
                  Your browser's Network tab shows every request made to external servers. 
                  Use it to verify Plain doesn't upload your files.
                </p>
                <ol className="space-y-3 ml-4 list-decimal list-outside marker:text-accent/60">
                  <li>
                    Open browser DevTools:
                    <ul className="mt-2 ml-4 space-y-1 text-[13px] text-muted-foreground/70">
                      <li><strong className="text-foreground/80">Chrome/Edge:</strong> Press <code className="rounded bg-accent/10 px-1.5 py-0.5 text-accent">F12</code> or <code className="rounded bg-accent/10 px-1.5 py-0.5 text-accent">Ctrl+Shift+I</code></li>
                      <li><strong className="text-foreground/80">Firefox:</strong> Press <code className="rounded bg-accent/10 px-1.5 py-0.5 text-accent">F12</code> or <code className="rounded bg-accent/10 px-1.5 py-0.5 text-accent">Ctrl+Shift+I</code></li>
                      <li><strong className="text-foreground/80">Safari:</strong> Enable Developer menu in Preferences, then <code className="rounded bg-accent/10 px-1.5 py-0.5 text-accent">Cmd+Option+I</code></li>
                    </ul>
                  </li>
                  <li>
                    Click the <strong className="text-foreground">"Network"</strong> tab
                  </li>
                  <li>
                    Clear existing requests (circle with line through it)
                  </li>
                  <li>
                    Select and process your PDF files in Plain
                  </li>
                  <li>
                    Watch the Network tab — no outgoing requests with your file data
                  </li>
                </ol>
              </div>

              {/* Visual diagram: Network tab comparison */}
              <div className="mt-8 grid gap-4 md:grid-cols-2">
                {/* Local processing diagram */}
                <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span className="text-[13px] font-medium text-green-500">Local Processing (Plain)</span>
                  </div>
                  <div className="rounded-lg bg-[oklch(0.12_0.004_250)] p-3 font-mono text-[11px]">
                    <div className="flex items-center gap-2 text-muted-foreground/60 border-b border-accent/10 pb-2 mb-2">
                      <span className="w-14">Method</span>
                      <span className="w-10">Status</span>
                      <span className="flex-1">URL</span>
                      <span className="w-12 text-right">Size</span>
                    </div>
                    <div className="space-y-1.5 text-muted-foreground/80">
                      <div className="flex items-center gap-2">
                        <span className="w-14 text-blue-400">GET</span>
                        <span className="w-10 text-green-400">200</span>
                        <span className="flex-1 truncate">/tools/merge-pdf</span>
                        <span className="w-12 text-right">12 KB</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-14 text-blue-400">GET</span>
                        <span className="w-10 text-green-400">200</span>
                        <span className="flex-1 truncate">/_next/static/...</span>
                        <span className="w-12 text-right">45 KB</span>
                      </div>
                      <div className="flex items-center gap-2 opacity-60 italic">
                        <span className="flex-1 text-green-400/80">No file uploads during processing</span>
                      </div>
                    </div>
                  </div>
                  <p className="mt-3 text-[12px] text-muted-foreground/70">
                    Only page assets loaded. No POST requests. No file data transmitted.
                  </p>
                </div>

                {/* Upload-based diagram */}
                <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <XCircle className="h-4 w-4 text-red-500" />
                    <span className="text-[13px] font-medium text-red-500">Upload-Based Tool</span>
                  </div>
                  <div className="rounded-lg bg-[oklch(0.12_0.004_250)] p-3 font-mono text-[11px]">
                    <div className="flex items-center gap-2 text-muted-foreground/60 border-b border-accent/10 pb-2 mb-2">
                      <span className="w-14">Method</span>
                      <span className="w-10">Status</span>
                      <span className="flex-1">URL</span>
                      <span className="w-12 text-right">Size</span>
                    </div>
                    <div className="space-y-1.5 text-muted-foreground/80">
                      <div className="flex items-center gap-2">
                        <span className="w-14 text-blue-400">GET</span>
                        <span className="w-10 text-green-400">200</span>
                        <span className="flex-1 truncate">/merge</span>
                        <span className="w-12 text-right">18 KB</span>
                      </div>
                      <div className="flex items-center gap-2 text-red-400">
                        <span className="w-14 font-semibold">POST</span>
                        <span className="w-10 text-green-400">200</span>
                        <span className="flex-1 truncate">/api/upload</span>
                        <span className="w-12 text-right font-semibold">2.4 MB</span>
                      </div>
                      <div className="flex items-center gap-2 text-red-400">
                        <span className="w-14 font-semibold">POST</span>
                        <span className="w-10 text-green-400">200</span>
                        <span className="flex-1 truncate">/api/process</span>
                        <span className="w-12 text-right font-semibold">1.8 MB</span>
                      </div>
                    </div>
                  </div>
                  <p className="mt-3 text-[12px] text-muted-foreground/70">
                    POST requests with large payloads indicate file uploads.
                  </p>
                </div>
              </div>
            </div>

            {/* 3. What to Look For */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/12 ring-1 ring-accent/20">
                  <Eye className="h-5 w-5 text-accent" />
                </div>
                <h2 className="text-xl font-semibold tracking-tight text-foreground">
                  3. Evidence Checklist
                </h2>
              </div>
              <div className="space-y-4 text-[14px] leading-relaxed text-muted-foreground/90">
                <p>
                  When inspecting network requests, here's what proves local processing:
                </p>
                
                {/* Evidence checklist */}
                <div className="rounded-xl border border-accent/15 bg-[oklch(0.15_0.005_250)] p-5 space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-500 shrink-0" />
                    <div>
                      <p className="text-[13px] font-medium text-foreground">No POST requests with large payloads</p>
                      <p className="text-[12px] text-muted-foreground/70 mt-1">
                        File uploads appear as POST requests with sizes matching your files
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-500 shrink-0" />
                    <div>
                      <p className="text-[13px] font-medium text-foreground">No requests to external upload endpoints</p>
                      <p className="text-[12px] text-muted-foreground/70 mt-1">
                        Watch for URLs containing "upload", "api/process", or third-party domains
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-500 shrink-0" />
                    <div>
                      <p className="text-[13px] font-medium text-foreground">Download uses blob: URL</p>
                      <p className="text-[12px] text-muted-foreground/70 mt-1">
                        Local files are served via <code className="rounded bg-accent/10 px-1 text-accent">blob:</code> URLs, not fetched from a server
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-500 shrink-0" />
                    <div>
                      <p className="text-[13px] font-medium text-foreground">No upload progress or server wait time</p>
                      <p className="text-[12px] text-muted-foreground/70 mt-1">
                        Local processing starts immediately; uploads show progress indicators
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Red Flags - What Would Indicate Uploads */}
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-[15px] font-semibold text-foreground">
                    4. Red Flags: What Would Indicate Uploads
                  </h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground/90">
                    If you observe any of the following in DevTools, files are being sent to a server:
                  </p>
                  <ul className="mt-3 space-y-2 text-[13px] text-muted-foreground/80">
                    <li className="flex items-start gap-2">
                      <XCircle className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
                      <span>POST requests appearing when you select or process files</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
                      <span>Request sizes matching your file sizes (e.g., 2 MB request for a 2 MB PDF)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
                      <span>Requests to URLs containing "upload", "api/file", or third-party domains</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
                      <span>Upload progress bars or "processing on server" messages</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
                      <span>Tool fails to work when you disconnect from the internet</span>
                    </li>
                  </ul>
                  <p className="mt-4 text-[13px] text-muted-foreground/70">
                    None of these occur with Plain. You can verify this yourself using the steps above.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Closing Note */}
        <section className="border-t border-accent/10 bg-[oklch(0.135_0.004_250)] px-4 py-16">
          <div className="mx-auto max-w-2xl">
            <div className="rounded-xl border border-accent/15 bg-[oklch(0.165_0.006_250)] p-6">
              <p className="text-[14px] leading-relaxed text-foreground/90">
                Verifiability is a core principle of Plain. We believe privacy claims should be 
                independently confirmable, not just promised. If you can't verify it, you can't trust it.
              </p>
              <p className="mt-4 text-[13px] italic text-muted-foreground/70 border-l-2 border-accent/25 pl-4">
                "If it can't be verified, it doesn't belong here."
              </p>
            </div>
            
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/pdf-tools/tools/merge-pdf"
                className="inline-flex items-center text-[13px] font-medium text-accent hover:underline"
              >
                Try Merge PDF
              </Link>
              <Link
                href="/pdf-tools/learn/how-plain-works"
                className="inline-flex items-center text-[13px] font-medium text-muted-foreground/70 hover:text-accent transition-colors"
              >
                How Plain Works
              </Link>
              <Link
                href="/pdf-tools/privacy"
                className="inline-flex items-center text-[13px] font-medium text-muted-foreground/70 hover:text-accent transition-colors"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}



