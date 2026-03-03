import { Metadata } from "next"
import Link from "next/link"
import Script from "next/script"
import { ChevronRight } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import {
  generateTechArticleSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
  combineSchemas,
} from "@/lib/schema"
import { serializeJsonLd } from "@/lib/sanitize"

export const metadata: Metadata = {
  title: 'What "No Uploads" Actually Means',
  description:
    'Plain explains what local file processing means and how it differs from server-based tools that upload your files.',
  openGraph: {
    title: 'What "No Uploads" Actually Means - Plain',
    description: 'Plain explains what local file processing means and how it differs from server-based tools.',
  },
  twitter: {
    card: "summary_large_image",
    title: 'What "No Uploads" Actually Means - Plain',
    description: 'Plain explains what local file processing means and how it differs from server-based tools.',
  },
  alternates: {
    canonical: "https://plain.tools/learn/no-uploads-explained",
  },
}

// Technical article schema
const articleSchema = generateTechArticleSchema({
  title: 'What "No Uploads" Actually Means',
  description: "A technical explanation of what it means when a tool processes files without uploading them. Built for private, offline-first PDF workflows with clear.",
  slug: "no-uploads-explained",
  datePublished: "2026-02-01",
  dateModified: "2026-02-27",
  proficiencyLevel: "Beginner",
})

// Breadcrumb schema
const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "No Uploads Explained", slug: "no-uploads-explained" },
])

// FAQ schema
const faqSchema = generateFAQSchema([
  {
    question: 'What does "no uploads" mean for a PDF tool?',
    answer:
      'It means your files are processed entirely on your own device using your browser\'s built-in capabilities. The file data stays in your browser\'s memory and is never transmitted over the internet to a remote server.',
  },
  {
    question: "How can I verify that a tool doesn't upload my files?",
    answer:
      "Open your browser's developer tools (F12) and watch the Network tab while using the tool. Genuine local processing shows no large POST requests or file data being sent to servers.",
  },
  {
    question: "Is local processing as capable as server-based processing?",
    answer:
      "For many common operations like merging, splitting, and reordering PDFs, yes. Modern browsers with WebAssembly can run sophisticated PDF libraries locally. Some advanced operations like OCR may still benefit from server processing.",
  },
])

// Combine schemas
const combinedSchema = combineSchemas([articleSchema, breadcrumbSchema, faqSchema])

export default function NoUploadsExplainedPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(combinedSchema) }}
      />
      <Header />

      <main className="flex-1 px-4 py-16 md:py-24">
        <article className="mx-auto max-w-2xl">
          {/* Breadcrumb */}
          <nav className="mb-8 flex items-center gap-1.5 text-[13px] text-muted-foreground/70">
            <Link href="/" className="transition-colors hover:text-accent">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href="/learn" className="transition-colors hover:text-accent">
              Learn
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-foreground/80">No Uploads Explained</span>
          </nav>

          {/* Header */}
          <header className="mb-12">
            <div className="mb-4 inline-flex items-center rounded-full bg-accent/10 px-3 py-1 text-[11px] font-medium text-accent ring-1 ring-accent/20">
              Privacy
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              What "No Uploads" Actually Means
            </h1>
            <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
              Many tools claim to be "private" or "secure." This article explains what it
              technically means when a tool processes files without uploading them.
            </p>
          </header>

          {/* In Simple Terms */}
          <section className="mb-12 rounded-xl bg-[oklch(0.165_0.006_250)] p-6 ring-1 ring-accent/10">
            <h2 className="mb-3 text-[13px] font-semibold uppercase tracking-wider text-accent">
              In Simple Terms
            </h2>
            <p className="text-[14px] leading-relaxed text-foreground/90">
              "No uploads" means your files are processed on your own device, not sent to a remote
              server. The file data stays in your browser's memory and is never transmitted over
              the internet. You can verify this by checking network activity in your browser's
              developer tools.
            </p>
          </section>

          {/* Main Content */}
          <div className="space-y-10">
            {/* The difference between reading and uploading */}
            <section>
              <h2 className="mb-4 text-xl font-semibold tracking-tight text-foreground">
                The difference between reading and uploading
              </h2>
              <p className="text-[15px] leading-relaxed text-muted-foreground">
                When you select a file in your browser, two different things can happen:
              </p>
              <div className="mt-4 space-y-4">
                <div className="rounded-lg bg-[oklch(0.14_0.004_250)] p-4 ring-1 ring-accent/8">
                  <p className="text-[13px] font-medium text-foreground">Local reading</p>
                  <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                    The browser reads the file contents into memory on your device. The file data
                    stays local. No network request is made. This is what "no uploads" means.
                  </p>
                </div>
                <div className="rounded-lg bg-[oklch(0.14_0.004_250)] p-4 ring-1 ring-accent/8">
                  <p className="text-[13px] font-medium text-foreground">Server upload</p>
                  <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                    The browser sends the file contents to a remote server over the internet. The
                    file is processed on external hardware. This is how traditional online tools
                    work.
                  </p>
                </div>
              </div>
              <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                Both actions start the same way—you select a file. But the difference in what
                happens next has significant privacy implications.
              </p>
            </section>

            {/* How local file reading works */}
            <section>
              <h2 className="mb-4 text-xl font-semibold tracking-tight text-foreground">
                How local file reading works
              </h2>
              <p className="text-[15px] leading-relaxed text-muted-foreground">
                Modern browsers include the File API, a standard interface for reading files
                selected by users. When you choose a file, the browser provides access to its
                contents through JavaScript. The data is loaded into the browser's memory, where
                it can be processed by client-side code.
              </p>
              <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                This happens entirely within your browser's security sandbox. The file data cannot
                be accessed by other websites or applications. It exists only in the memory
                allocated to that browser tab.
              </p>
              <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                Critically, reading a file locally does not involve any network activity. No HTTP
                requests are made. No data packets leave your device. This is fundamentally
                different from uploading.
              </p>
            </section>

            {/* What happens when you upload */}
            <section>
              <h2 className="mb-4 text-xl font-semibold tracking-tight text-foreground">
                What happens when you upload a file
              </h2>
              <p className="text-[15px] leading-relaxed text-muted-foreground">
                When a tool uploads your file, the following typically occurs:
              </p>
              <ol className="mt-4 space-y-3 text-[15px] leading-relaxed text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/15 text-[11px] font-bold text-accent">
                    1
                  </span>
                  <span>Your browser reads the file into memory</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/15 text-[11px] font-bold text-accent">
                    2
                  </span>
                  <span>An HTTP request is made to a remote server</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/15 text-[11px] font-bold text-accent">
                    3
                  </span>
                  <span>The file data is transmitted over the internet</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/15 text-[11px] font-bold text-accent">
                    4
                  </span>
                  <span>The server receives and stores your file (at least temporarily)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/15 text-[11px] font-bold text-accent">
                    5
                  </span>
                  <span>Processing occurs on the server's hardware</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/15 text-[11px] font-bold text-accent">
                    6
                  </span>
                  <span>The result is sent back to your browser</span>
                </li>
              </ol>
              <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                At step 4, your file exists on hardware you do not control. You are trusting the
                service provider to handle it responsibly, delete it when promised, and protect
                it from breaches.
              </p>
            </section>

            {/* Why this distinction matters */}
            <section>
              <h2 className="mb-4 text-xl font-semibold tracking-tight text-foreground">
                Why this distinction matters
              </h2>
              <p className="text-[15px] leading-relaxed text-muted-foreground">
                The difference between local processing and server uploads has real consequences:
              </p>
              <ul className="mt-4 space-y-3 text-[15px] leading-relaxed text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>
                    <strong className="font-medium text-foreground">Data breaches</strong> — Files
                    on servers can be exposed if the service is hacked. Local files are not
                    affected by remote breaches.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>
                    <strong className="font-medium text-foreground">Third-party access</strong> —
                    Server operators and their subcontractors may have access to uploaded files.
                    Local processing involves no third parties.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>
                    <strong className="font-medium text-foreground">Data retention</strong> — Even
                    if services promise to delete files, you cannot verify this. Local files are
                    never stored externally.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>
                    <strong className="font-medium text-foreground">Compliance</strong> — Some
                    regulations restrict where data can be processed. Local processing avoids
                    cross-border data transfer issues.
                  </span>
                </li>
              </ul>
            </section>

            {/* How to verify no uploads */}
            <section>
              <h2 className="mb-4 text-xl font-semibold tracking-tight text-foreground">
                How to verify no uploads
              </h2>
              <p className="text-[15px] leading-relaxed text-muted-foreground">
                Claims about privacy should be verifiable. Here is how to confirm that a tool
                does not upload your files:
              </p>
              <ol className="mt-4 space-y-3 text-[15px] leading-relaxed text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/15 text-[11px] font-bold text-accent">
                    1
                  </span>
                  <span>Open your browser's developer tools (press F12 or right-click and select "Inspect")</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/15 text-[11px] font-bold text-accent">
                    2
                  </span>
                  <span>Go to the Network tab</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/15 text-[11px] font-bold text-accent">
                    3
                  </span>
                  <span>Use the tool to process a file</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/15 text-[11px] font-bold text-accent">
                    4
                  </span>
                  <span>Look for any network requests containing file data</span>
                </li>
              </ol>
              <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                With a genuine no-upload tool, you will see no requests carrying your file
                contents. For a detailed guide, see{" "}
                <Link
                  href="/learn/verify-offline-processing"
                  className="text-accent underline underline-offset-4 transition-colors hover:text-accent/80"
                >
                  Verifying Offline Processing in DevTools
                </Link>
                .
              </p>
            </section>

            {/* Common misconceptions */}
            <section>
              <h2 className="mb-4 text-xl font-semibold tracking-tight text-foreground">
                Common misconceptions
              </h2>
              <p className="text-[15px] leading-relaxed text-muted-foreground">
                Some claims can be misleading:
              </p>
              <ul className="mt-4 space-y-4 text-[15px] leading-relaxed text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <div>
                    <strong className="font-medium text-foreground">"We delete files immediately"</strong>
                    <p className="mt-1 text-muted-foreground/80">
                      The file was still uploaded and processed on their servers. Deletion
                      promises cannot be independently verified.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <div>
                    <strong className="font-medium text-foreground">"Your files are encrypted"</strong>
                    <p className="mt-1 text-muted-foreground/80">
                      Encryption protects data in transit, but the server still receives and
                      decrypts your file to process it.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <div>
                    <strong className="font-medium text-foreground">"We don't store your files"</strong>
                    <p className="mt-1 text-muted-foreground/80">
                      Files must exist on the server during processing, even if not permanently
                      stored. Brief storage is still storage.
                    </p>
                  </div>
                </li>
              </ul>
              <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                True no-upload processing eliminates these concerns because the file never leaves
                your device in the first place.
              </p>
            </section>

            {/* Related */}
            <section className="border-t border-accent/10 pt-10">
              <h2 className="mb-6 text-lg font-semibold tracking-tight text-foreground">
                Related articles
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <Link
                  href="/learn/client-side-processing"
                  className="group rounded-xl bg-[oklch(0.165_0.006_250)] p-5 ring-1 ring-accent/10 transition-all duration-200 hover:-translate-y-0.5 hover:ring-accent/25"
                >
                  <h3 className="text-[14px] font-semibold text-foreground group-hover:text-accent">
                    Client-Side Processing Explained
                  </h3>
                  <p className="mt-1.5 text-[12px] leading-relaxed text-muted-foreground/80">
                    How browsers process files locally.
                  </p>
                </Link>
                <Link
                  href="/learn/verify-offline-processing"
                  className="group rounded-xl bg-[oklch(0.165_0.006_250)] p-5 ring-1 ring-accent/10 transition-all duration-200 hover:-translate-y-0.5 hover:ring-accent/25"
                >
                  <h3 className="text-[14px] font-semibold text-foreground group-hover:text-accent">
                    Verifying Offline Processing in DevTools
                  </h3>
                  <p className="mt-1.5 text-[12px] leading-relaxed text-muted-foreground/80">
                    Step-by-step guide using DevTools.
                  </p>
                </Link>
                <Link
                  href="/learn/why-pdf-uploads-are-risky"
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
                  href="/learn/online-vs-offline-pdf-tools"
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
              href="/learn"
              className="text-[14px] text-muted-foreground underline underline-offset-2 transition-colors hover:text-foreground"
            >
              Back to Learning Center
            </Link>
          </nav>
        </article>
      </main>

      <Footer />
    </div>
  )
}

