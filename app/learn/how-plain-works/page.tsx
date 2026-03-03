import { Metadata } from "next"
import Link from "next/link"
import Script from "next/script"
import { ArrowLeft, ArrowRight, Shield, Terminal } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ArticleShareRow } from "@/components/share-button"
import {
  generateTechArticleSchema,
  generateBreadcrumbSchema,
  generateHowToSchema,
  generateFAQSchema,
  combineSchemas,
} from "@/lib/schema"

export const metadata: Metadata = {
  title: "How Plain Works",
  description:
    "Learn how Plain processes PDFs entirely in your browser using client-side technology. No servers, no uploads. Understand the technical architecture and verify it yourself.",
  openGraph: {
    title: "How Plain Works - Plain",
    description: "Technical explanation of client-side PDF processing with no uploads.",
  },
  alternates: {
    canonical: "https://plain.tools/learn/how-plain-works",
  },
}

// Article schema
const articleSchema = generateTechArticleSchema({
  title: "How Plain Works",
  description:
    "A technical explanation of how Plain processes PDFs entirely in the browser using client-side technology.",
  slug: "how-plain-works",
  datePublished: "2026-01-15",
  dateModified: "2026-02-27",
  proficiencyLevel: "Beginner",
})

// Breadcrumb schema
const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "How Plain Works", slug: "how-plain-works" },
])

// HowTo schema for verification steps
const howToSchema = generateHowToSchema({
  name: "How to Verify Plain Processes Files Locally",
  description: "Steps to confirm that Plain does not upload your files to any server.",
  totalTime: "PT3M",
  steps: [
    { name: "Open DevTools", text: "Press F12 or right-click and select 'Inspect', then click the Network tab." },
    { name: "Process a file", text: "Use any Plain tool while watching the Network tab." },
    { name: "Check network activity", text: "Observe that no file data is sent to any server." },
    { name: "Test offline", text: "Disconnect from the internet after loading the page. The tools still work." },
  ],
})

// FAQ schema
const faqSchema = generateFAQSchema([
  {
    question: "Does Plain upload my files to a server?",
    answer:
      "No. Plain processes all files entirely in your browser. Your files never leave your device. You can verify this by monitoring network activity or testing offline.",
  },
  {
    question: "How does Plain process PDFs without a server?",
    answer:
      "Plain uses WebAssembly to run PDF processing code directly in your browser. This allows complex operations like merging and compressing PDFs without server involvement.",
  },
  {
    question: "Does Plain work offline?",
    answer:
      "Yes. Once the page is loaded, Plain works without internet connectivity. This confirms that processing happens locally on your device.",
  },
])

// Combine all schemas
const combinedSchema = combineSchemas([articleSchema, breadcrumbSchema, howToSchema, faqSchema])

const verificationSteps = [
  {
    title: "Open DevTools Network tab",
    description: "Press F12 or right-click and select 'Inspect', then click the Network tab.",
  },
  {
    title: "Process a PDF file",
    description: "Use any Plain tool (e.g., Merge PDF) while watching the Network tab.",
  },
  {
    title: "Observe network activity",
    description: "You will see no file uploads to any server. Your PDF data stays local.",
  },
  {
    title: "Test offline mode",
    description: "Disconnect from the internet after loading the page. The tools still work.",
  },
]

export default function HowPlainWorksPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(combinedSchema) }}
      />
      <Header />

      <main className="flex-1 px-4 py-16 md:py-24">
        <article className="mx-auto max-w-2xl">
          {/* Breadcrumb */}
          <nav className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/learn" className="flex items-center gap-1 transition-colors hover:text-accent">
              <ArrowLeft className="h-3.5 w-3.5" />
              Learn
            </Link>
            <span>/</span>
            <span className="text-foreground/70">How Plain Works</span>
          </nav>

          {/* Header */}
          <header className="mb-12">
            <div className="mb-4 flex items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-accent/10 px-2.5 py-1 text-[11px] font-medium text-accent ring-1 ring-accent/20">
                Technical
              </span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              How Plain Works
            </h1>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Plain processes PDF files entirely in your browser. No files are uploaded to any server.
              This page explains the technical architecture and shows you how to verify it yourself.
            </p>
          </header>

          {/* In Simple Terms box */}
          <div className="mb-12 rounded-xl bg-[oklch(0.17_0.008_250)] p-6 ring-1 ring-accent/15">
            <div className="mb-3 flex items-center gap-2">
              <Shield className="h-4 w-4 text-accent" />
              <h2 className="text-sm font-semibold text-foreground">In Simple Terms</h2>
            </div>
            <p className="text-[13px] leading-relaxed text-muted-foreground">
              When you use Plain, your PDF files never leave your device. All processing happens
              inside your web browser using built-in technologies. You can verify this by checking
              your browser's network activity or by using Plain while offline.
            </p>
          </div>

          {/* Content */}
          <div className="prose-plain space-y-10">
            {/* Intro section */}
            <section>
              <p className="text-[15px] leading-relaxed text-foreground/85">
                Plain is a browser-based PDF toolkit. Unlike traditional online PDF services that
                require you to upload files to remote servers, Plain runs entirely within your web
                browser. Your files are processed locally on your device, and no data is transmitted
                over the internet.
              </p>
            </section>

            {/* What client-side means */}
            <section>
              <h2 className="mb-4 text-xl font-semibold tracking-tight text-foreground">
                What "Client-Side" Means
              </h2>
              <p className="text-[15px] leading-relaxed text-foreground/85">
                "Client-side" refers to code that runs in your browser rather than on a remote server.
                When you load Plain, the application code is downloaded once. After that, all PDF
                operations happen locally on your machine.
              </p>
              <p className="mt-4 text-[15px] leading-relaxed text-foreground/85">
                This is fundamentally different from server-side processing, where files are sent to
                a remote computer, processed there, and sent back. With client-side processing, your
                files never travel across the network.
              </p>
            </section>

            {/* No servers, no uploads */}
            <section>
              <h2 className="mb-4 text-xl font-semibold tracking-tight text-foreground">
                No Servers, No Uploads
              </h2>
              <p className="text-[15px] leading-relaxed text-foreground/85">
                Plain does not operate any file-processing servers. When you select a PDF file, it is
                read directly by your browser using the{" "}
                <code className="rounded bg-accent/10 px-1.5 py-0.5 text-[13px] text-accent">
                  File API
                </code>
                . The file data stays in your browser's memory, is processed locally, and the result
                is made available for download—all without network transmission.
              </p>
              <p className="mt-4 text-[15px] leading-relaxed text-foreground/85">
                This architecture eliminates several categories of risk: data breaches, unauthorised
                access, third-party storage, and compliance complications. Your files remain under
                your control at all times.
              </p>
            </section>

            {/* Browser technologies */}
            <section>
              <h2 className="mb-4 text-xl font-semibold tracking-tight text-foreground">
                Browser Technologies Used
              </h2>
              <p className="text-[15px] leading-relaxed text-foreground/85">
                Plain leverages modern browser capabilities to perform PDF operations locally:
              </p>
              <ul className="mt-4 space-y-3 text-[15px] leading-relaxed text-foreground/85">
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>
                    <strong className="font-medium text-foreground">JavaScript</strong> — The primary
                    programming language for browser applications, handling user interactions and
                    orchestrating PDF operations.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>
                    <strong className="font-medium text-foreground">WebAssembly (Wasm)</strong> — A
                    binary format that allows near-native performance in the browser. Used for
                    computationally intensive PDF processing tasks.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>
                    <strong className="font-medium text-foreground">File API</strong> — Standard
                    browser API for reading files selected by the user without uploading them.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>
                    <strong className="font-medium text-foreground">Blob API</strong> — Used to
                    construct the output PDF file and create a download link.
                  </span>
                </li>
              </ul>
              <p className="mt-4 text-[15px] leading-relaxed text-foreground/85">
                These are standard web technologies supported by all modern browsers. No plugins or
                extensions are required.
              </p>
            </section>

            {/* Offline mode */}
            <section>
              <h2 className="mb-4 text-xl font-semibold tracking-tight text-foreground">
                Offline Mode Explained
              </h2>
              <p className="text-[15px] leading-relaxed text-foreground/85">
                Because Plain processes files locally, the tools continue to work even when you're
                offline. After the initial page load, no network connection is required.
              </p>
              <p className="mt-4 text-[15px] leading-relaxed text-foreground/85">
                This is possible because all necessary code is loaded when you first visit the page.
                The application uses a Service Worker to cache assets, enabling offline use. You can
                disconnect from the internet, process your PDFs, and download the results—all without
                any network activity.
              </p>
              <p className="mt-4 text-[15px] leading-relaxed text-foreground/85">
                Offline functionality is a natural consequence of client-side architecture. If the
                processing required servers, offline mode would be impossible.
              </p>
            </section>

            {/* How to verify */}
            <section>
              <h2 className="mb-4 text-xl font-semibold tracking-tight text-foreground">
                How to Verify This Yourself
              </h2>
              <p className="text-[15px] leading-relaxed text-foreground/85">
                You don't have to take our word for it. Here's how you can confirm that Plain
                doesn't upload your files:
              </p>

              <div className="mt-6 rounded-xl bg-[oklch(0.16_0.006_250)] p-5 ring-1 ring-accent/10">
                <div className="mb-4 flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-accent" />
                  <h3 className="text-sm font-semibold text-foreground">Verification Checklist</h3>
                </div>
                <ol className="space-y-4">
                  {verificationSteps.map((step, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/12 text-xs font-bold text-accent ring-1 ring-accent/20">
                        {index + 1}
                      </span>
                      <div>
                        <p className="text-[13px] font-medium text-foreground">{step.title}</p>
                        <p className="mt-0.5 text-[12px] text-muted-foreground">{step.description}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              <p className="mt-6 text-[15px] leading-relaxed text-foreground/85">
                This level of transparency is intentional. We believe users should be able to verify
                privacy claims, not just trust them.
              </p>
            </section>

            {/* Closing */}
            <section className="border-t border-accent/10 pt-8">
              <p className="text-[15px] leading-relaxed text-foreground/85">
                Plain's architecture is designed around a simple principle: your files should never
                leave your device unless you explicitly choose to share them. Client-side processing
                makes this possible.
              </p>
              <p className="mt-4 text-[15px] leading-relaxed text-foreground/85">
                To learn more about the differences between online and offline PDF tools, see{" "}
                <Link
                  href="/learn/online-vs-offline-pdf-tools"
                  className="font-medium text-accent underline underline-offset-4 transition-colors hover:text-accent/80"
                >
                  Online vs Offline PDF Tools
                </Link>
                . To try the tools yourself, visit the{" "}
                <Link
                  href="/tools"
                  className="font-medium text-accent underline underline-offset-4 transition-colors hover:text-accent/80"
                >
                  Tools page
                </Link>
                .
              </p>
            </section>
          </div>

          {/* Related articles */}
          <div className="mt-16 border-t border-accent/10 pt-10">
            <h2 className="mb-6 text-lg font-semibold text-foreground">Related Articles</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Link
                href="/compare/offline-vs-online-pdf-tools"
                className="group rounded-xl bg-[oklch(0.17_0.008_250)] p-5 ring-1 ring-accent/10 transition-all duration-200 hover:-translate-y-0.5 hover:ring-accent/25"
              >
                <h3 className="text-[13px] font-semibold text-foreground group-hover:text-accent">
                  Offline vs Online Tools
                </h3>
                <p className="mt-1 text-[12px] text-muted-foreground">
                  Compare processing approaches side-by-side.
                </p>
                <span className="mt-3 flex items-center gap-1 text-[11px] font-medium text-accent">
                  Read comparison
                  <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
                </span>
              </Link>
              <Link
                href="/tools/compress-pdf"
                className="group rounded-xl bg-[oklch(0.17_0.008_250)] p-5 ring-1 ring-accent/10 transition-all duration-200 hover:-translate-y-0.5 hover:ring-accent/25"
              >
                <h3 className="text-[13px] font-semibold text-foreground group-hover:text-accent">
                  Try Compress PDF
                </h3>
                <p className="mt-1 text-[12px] text-muted-foreground">
                  See client-side processing in action.
                </p>
                <span className="mt-3 flex items-center gap-1 text-[11px] font-medium text-accent">
                  Open tool
                  <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
                </span>
              </Link>
            </div>
            <p className="mt-4 text-center text-[12px] text-muted-foreground/70">
              Also available: <Link href="/tools/merge-pdf" className="text-accent hover:underline">Merge PDF</Link>, <Link href="/tools/split-pdf" className="text-accent hover:underline">Split PDF</Link>, <Link href="/tools/extract-pdf" className="text-accent hover:underline">Extract Pages</Link>
            </p>
          </div>

          {/* Share */}
          <div className="mt-12 border-t border-white/[0.06] pt-8">
            <ArticleShareRow />
          </div>

          {/* Back to learn */}
          <div className="mt-8">
            <Link
              href="/learn"
              className="inline-flex items-center gap-2 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Learning Center
            </Link>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  )
}
