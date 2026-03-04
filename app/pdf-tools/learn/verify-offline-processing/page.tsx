import { Metadata } from "next"
import Link from "next/link"
import Script from "next/script"
import { ChevronRight } from "lucide-react"
import {
  generateTechArticleSchema,
  generateBreadcrumbSchema,
  generateHowToSchema,
  generateFAQSchema,
  combineSchemas,
} from "@/lib/legacy/schema"

export const metadata: Metadata = {
  title: "Verifying Offline Processing in DevTools",
  description:
    "Plain shows how to use browser DevTools to verify that files are processed locally without being uploaded.",
  openGraph: {
    title: "Verifying Offline Processing in DevTools - Plain",
    description: "Plain shows how to use browser DevTools to verify that files are processed locally.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Verifying Offline Processing in DevTools - Plain",
    description: "Plain shows how to use browser DevTools to verify that files are processed locally.",
  },
  alternates: {
    canonical: "https://plain.tools/learn/verify-offline-processing",
  },
}

// Article schema for technical documentation
const articleSchema = generateTechArticleSchema({
  title: "Verifying Offline Processing in DevTools",
  description:
    "A step-by-step guide to verifying that a tool processes files locally without uploading them.",
  slug: "verify-offline-processing",
  datePublished: "2026-02-01",
  dateModified: "2026-02-27",
  proficiencyLevel: "Beginner",
})

// Breadcrumb schema
const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Verify Offline Processing" },
])

// HowTo schema for step-by-step instructions
const howToSchema = generateHowToSchema({
  name: "How to Verify Offline Processing in Browser DevTools",
  description: "Steps to confirm a web tool processes files locally without server uploads.",
  totalTime: "PT5M",
  steps: [
    {
      name: "Open browser developer tools",
      text: "Press F12 or right-click and select 'Inspect' to open DevTools. Navigate to the Network tab.",
    },
    {
      name: "Clear existing network activity",
      text: "Click the clear button in the Network tab to remove any previous requests.",
    },
    {
      name: "Load your files in the tool",
      text: "Select or drag files into the PDF tool. Watch the Network tab for any new requests.",
    },
    {
      name: "Perform the operation",
      text: "Click the action button (e.g., 'Merge PDFs'). Monitor for any file upload requests.",
    },
    {
      name: "Analyze network requests",
      text: "Review the requests list. Local processing shows no POST requests with large file payloads.",
    },
  ],
})

// FAQ schema for common questions
const faqSchema = generateFAQSchema([
  {
    question: "How can I tell if a PDF tool is uploading my files?",
    answer:
      "Open your browser's Network tab in DevTools before using the tool. If you see large POST requests or file data being transmitted to remote servers, your files are being uploaded. Local-only tools will show minimal network activity with no file payloads.",
  },
  {
    question: "Can I verify offline processing works without internet?",
    answer:
      "Yes. After loading the page, disconnect from the internet (airplane mode or unplug ethernet). If the tool still processes your files, it is genuinely running locally. Tools that require server processing will fail without internet.",
  },
  {
    question: "What should the Network tab look like for local processing?",
    answer:
      "For genuine local processing, you should see no new network requests when selecting files or performing operations. Any requests that do appear should be small metadata or analytics calls, not file data transfers.",
  },
])

// Combine all schemas into a single graph
const combinedSchema = combineSchemas([
  articleSchema,
  breadcrumbSchema,
  howToSchema,
  faqSchema,
])

export default function VerifyOfflineProcessingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(combinedSchema) }}
      />
      <main className="flex-1 px-4 py-16 md:py-24">
        <article className="mx-auto max-w-2xl">
          {/* Breadcrumb */}
          <nav className="mb-8 flex items-center gap-1.5 text-[13px] text-muted-foreground/70">
            <Link href="/pdf-tools/" className="transition-colors hover:text-accent">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href="/pdf-tools/learn" className="transition-colors hover:text-accent">
              Learn
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-foreground/80">Verify Offline Processing</span>
          </nav>

          {/* Header */}
          <header className="mb-12">
            <div className="mb-4 inline-flex items-center rounded-full bg-accent/10 px-3 py-1 text-[11px] font-medium text-accent ring-1 ring-accent/20">
              Tutorial
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Verifying Offline Processing in DevTools
            </h1>
            <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
              Privacy claims should be verifiable. This guide shows you how to confirm that a
              tool processes files locally without uploading them.
            </p>
          </header>

          {/* In Simple Terms */}
          <section className="mb-12 rounded-xl bg-[oklch(0.165_0.006_250)] p-6 ring-1 ring-accent/10">
            <h2 className="mb-3 text-[13px] font-semibold uppercase tracking-wider text-accent">
              In Simple Terms
            </h2>
            <p className="text-[14px] leading-relaxed text-foreground/90">
              Your browser has built-in tools that show all network activity. By watching the
              Network tab while using a PDF tool, you can see whether your files are being
              uploaded to a server or processed locally. If no file data appears in the network
              requests, the processing is genuinely local.
            </p>
          </section>

          {/* Main Content */}
          <div className="space-y-10">
            {/* Why verify */}
            <section>
              <h2 className="mb-4 text-xl font-semibold tracking-tight text-foreground">
                Why verification matters
              </h2>
              <p className="text-[15px] leading-relaxed text-muted-foreground">
                Many online tools claim to be "secure" or "private," but these terms can be vague
                or misleading. A tool might encrypt files during upload, delete them after
                processing, or store them in a "secure" data centre—but all of these still involve
                sending your files to external servers.
              </p>
              <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                True offline processing is different: your files never leave your device. The good
                news is that you can verify this yourself using your browser's built-in developer
                tools. No technical expertise is required.
              </p>
            </section>

            {/* Opening DevTools */}
            <section>
              <h2 className="mb-4 text-xl font-semibold tracking-tight text-foreground">
                Step 1: Open developer tools
              </h2>
              <p className="text-[15px] leading-relaxed text-muted-foreground">
                Every modern browser includes developer tools. Here is how to open them:
              </p>
              <div className="mt-4 space-y-3">
                <div className="rounded-lg bg-[oklch(0.14_0.004_250)] p-4 ring-1 ring-accent/8">
                  <p className="text-[13px] font-medium text-foreground">Chrome / Edge / Brave</p>
                  <p className="mt-1 text-[13px] text-muted-foreground">
                    Press <code className="rounded bg-accent/10 px-1.5 py-0.5 text-accent">F12</code> or{" "}
                    <code className="rounded bg-accent/10 px-1.5 py-0.5 text-accent">Ctrl+Shift+I</code>{" "}
                    (Windows/Linux) or{" "}
                    <code className="rounded bg-accent/10 px-1.5 py-0.5 text-accent">Cmd+Option+I</code>{" "}
                    (Mac)
                  </p>
                </div>
                <div className="rounded-lg bg-[oklch(0.14_0.004_250)] p-4 ring-1 ring-accent/8">
                  <p className="text-[13px] font-medium text-foreground">Firefox</p>
                  <p className="mt-1 text-[13px] text-muted-foreground">
                    Press <code className="rounded bg-accent/10 px-1.5 py-0.5 text-accent">F12</code> or{" "}
                    <code className="rounded bg-accent/10 px-1.5 py-0.5 text-accent">Ctrl+Shift+I</code>{" "}
                    (Windows/Linux) or{" "}
                    <code className="rounded bg-accent/10 px-1.5 py-0.5 text-accent">Cmd+Option+I</code>{" "}
                    (Mac)
                  </p>
                </div>
                <div className="rounded-lg bg-[oklch(0.14_0.004_250)] p-4 ring-1 ring-accent/8">
                  <p className="text-[13px] font-medium text-foreground">Safari</p>
                  <p className="mt-1 text-[13px] text-muted-foreground">
                    First enable developer tools: Safari → Settings → Advanced → "Show Develop menu."
                    Then press <code className="rounded bg-accent/10 px-1.5 py-0.5 text-accent">Cmd+Option+I</code>
                  </p>
                </div>
              </div>
              <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                Alternatively, right-click anywhere on the page and select "Inspect" or "Inspect Element."
              </p>
            </section>

            {/* Navigate to Network tab */}
            <section>
              <h2 className="mb-4 text-xl font-semibold tracking-tight text-foreground">
                Step 2: Go to the Network tab
              </h2>
              <p className="text-[15px] leading-relaxed text-muted-foreground">
                Once developer tools are open, click the "Network" tab. This shows all network
                requests made by the page—every file download, API call, and data upload.
              </p>
              <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                Before testing, click the "Clear" button (usually a circle with a line through it)
                to remove any previous requests. This makes it easier to see new activity.
              </p>
              <div className="mt-4 rounded-lg bg-[oklch(0.14_0.004_250)] p-4 ring-1 ring-accent/8">
                <p className="text-[13px] font-medium text-foreground">Tip</p>
                <p className="mt-1 text-[13px] text-muted-foreground">
                  Check the "Preserve log" option if available. This keeps the network log even if
                  the page navigates, making it easier to review all activity.
                </p>
              </div>
            </section>

            {/* Process a file */}
            <section>
              <h2 className="mb-4 text-xl font-semibold tracking-tight text-foreground">
                Step 3: Process a file
              </h2>
              <p className="text-[15px] leading-relaxed text-muted-foreground">
                With the Network tab open and cleared, use the PDF tool normally. Select your
                files, perform the operation (merge, split, etc.), and download the result.
              </p>
              <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                Watch the Network tab as you do this. You may see some requests—these are normal
                for any web application. What matters is whether any of them contain your file data.
              </p>
            </section>

            {/* What to look for */}
            <section>
              <h2 className="mb-4 text-xl font-semibold tracking-tight text-foreground">
                Step 4: Analyse the requests
              </h2>
              <p className="text-[15px] leading-relaxed text-muted-foreground">
                Click on each request in the list to see details. Look at:
              </p>
              <ul className="mt-4 space-y-3 text-[15px] leading-relaxed text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>
                    <strong className="font-medium text-foreground">Request URL</strong> — Where is
                    the request being sent? Legitimate requests go to the same domain (e.g.,
                    plain.tools). Suspicious requests go to external services.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>
                    <strong className="font-medium text-foreground">Request method</strong> — POST
                    requests can carry file data. GET requests typically do not.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>
                    <strong className="font-medium text-foreground">Request size</strong> — Large
                    requests (similar in size to your PDF) might contain file data. Small requests
                    are usually just API calls or analytics.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>
                    <strong className="font-medium text-foreground">Request payload</strong> — Click
                    on a request and look at the "Payload" or "Request" tab. Does it contain your
                    file contents or references to your file?
                  </span>
                </li>
              </ul>
            </section>

            {/* What you should see */}
            <section>
              <h2 className="mb-4 text-xl font-semibold tracking-tight text-foreground">
                What you should see with local processing
              </h2>
              <p className="text-[15px] leading-relaxed text-muted-foreground">
                With a genuine offline tool like Plain, you should observe:
              </p>
              <ul className="mt-4 space-y-2 text-[15px] leading-relaxed text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>No POST requests containing file data</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>No requests to external file-processing services</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>No requests with sizes matching your PDF files</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>
                    Only small requests for page assets, fonts, or minimal analytics (if any)
                  </span>
                </li>
              </ul>
              <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                The processing happens in your browser's memory, invisible to the Network tab
                because it does not involve network activity.
              </p>
            </section>

            {/* Offline test */}
            <section>
              <h2 className="mb-4 text-xl font-semibold tracking-tight text-foreground">
                Additional test: Go offline
              </h2>
              <p className="text-[15px] leading-relaxed text-muted-foreground">
                An even simpler test: disconnect from the internet after loading the page, then
                try to process a file.
              </p>
              <ol className="mt-4 space-y-3 text-[15px] leading-relaxed text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/15 text-[11px] font-bold text-accent">
                    1
                  </span>
                  <span>Load the PDF tool page while connected to the internet</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/15 text-[11px] font-bold text-accent">
                    2
                  </span>
                  <span>Disconnect from Wi-Fi or unplug your ethernet cable</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/15 text-[11px] font-bold text-accent">
                    3
                  </span>
                  <span>Select files and process them</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/15 text-[11px] font-bold text-accent">
                    4
                  </span>
                  <span>If the tool works, processing is genuinely local</span>
                </li>
              </ol>
              <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                Server-dependent tools will fail or hang when offline. True client-side tools
                continue working because they do not need a network connection for processing.
              </p>
            </section>

            {/* What upload-based tools look like */}
            <section>
              <h2 className="mb-4 text-xl font-semibold tracking-tight text-foreground">
                What upload-based tools look like
              </h2>
              <p className="text-[15px] leading-relaxed text-muted-foreground">
                For comparison, here is what you would see with a traditional online tool:
              </p>
              <ul className="mt-4 space-y-2 text-[15px] leading-relaxed text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>
                    A POST request to an upload endpoint (often with "upload" or "api" in the URL)
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>Request size roughly matching your file size</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>
                    Content-Type header indicating file upload (e.g., "multipart/form-data")
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>A subsequent download request for the processed file</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>Tool fails to work when offline</span>
                </li>
              </ul>
              <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                This is not necessarily bad—many legitimate services work this way. But it does
                mean your files are being sent to external servers, which has different privacy
                implications than local processing.
              </p>
            </section>

            {/* Summary */}
            <section className="rounded-xl border border-accent/15 bg-[oklch(0.155_0.005_250)] p-6">
              <h3 className="mb-3 text-[15px] font-semibold text-foreground">Summary</h3>
              <p className="text-[14px] leading-relaxed text-muted-foreground">
                Browser developer tools give you visibility into exactly what a web application
                is doing with your data. For privacy-sensitive tasks, taking a few seconds to
                check the Network tab can confirm whether a tool's privacy claims are genuine.
                True offline processing shows no file-related network activity and continues
                working without an internet connection.
              </p>
            </section>

            {/* Related */}
            <section className="border-t border-accent/10 pt-10">
              <h2 className="mb-6 text-lg font-semibold tracking-tight text-foreground">
                Related articles
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <Link
                  href="/pdf-tools/learn/no-uploads-explained"
                  className="group rounded-xl bg-[oklch(0.165_0.006_250)] p-5 ring-1 ring-accent/10 transition-all duration-200 hover:-translate-y-0.5 hover:ring-accent/25"
                >
                  <h3 className="text-[14px] font-semibold text-foreground group-hover:text-accent">
                    What "No Uploads" Actually Means
                  </h3>
                  <p className="mt-1.5 text-[12px] leading-relaxed text-muted-foreground/80">
                    The technical difference between local and cloud processing.
                  </p>
                </Link>
                <Link
                  href="/pdf-tools/learn/client-side-processing"
                  className="group rounded-xl bg-[oklch(0.165_0.006_250)] p-5 ring-1 ring-accent/10 transition-all duration-200 hover:-translate-y-0.5 hover:ring-accent/25"
                >
                  <h3 className="text-[14px] font-semibold text-foreground group-hover:text-accent">
                    Client-Side Processing Explained
                  </h3>
                  <p className="mt-1.5 text-[12px] leading-relaxed text-muted-foreground/80">
                    How browsers can manipulate files locally.
                  </p>
                </Link>
                <Link
                  href="/pdf-tools/learn/why-pdf-uploads-are-risky"
                  className="group rounded-xl bg-[oklch(0.165_0.006_250)] p-5 ring-1 ring-accent/10 transition-all duration-200 hover:-translate-y-0.5 hover:ring-accent/25"
                >
                  <h3 className="text-[14px] font-semibold text-foreground group-hover:text-accent">
                    Why PDF Uploads Can Be Risky
                  </h3>
                  <p className="mt-1.5 text-[12px] leading-relaxed text-muted-foreground/80">
                    Privacy considerations for online tools.
                  </p>
                </Link>
                <Link
                  href="/pdf-tools/learn/online-vs-offline-pdf-tools"
                  className="group rounded-xl bg-[oklch(0.165_0.006_250)] p-5 ring-1 ring-accent/10 transition-all duration-200 hover:-translate-y-0.5 hover:ring-accent/25"
                >
                  <h3 className="text-[14px] font-semibold text-foreground group-hover:text-accent">
                    Online vs Offline PDF Tools
                  </h3>
                  <p className="mt-1.5 text-[12px] leading-relaxed text-muted-foreground/80">
                    Understanding privacy trade-offs.
                  </p>
                </Link>
              </div>
            </section>
          </div>

          {/* Back link */}
          <nav className="mt-12 border-t border-accent/10 pt-8">
            <Link
              href="/pdf-tools/learn"
              className="text-[14px] text-muted-foreground underline underline-offset-2 transition-colors hover:text-foreground"
            >
              Back to Learning Center
            </Link>
          </nav>
        </article>
      </main>
    </div>
  )
}



