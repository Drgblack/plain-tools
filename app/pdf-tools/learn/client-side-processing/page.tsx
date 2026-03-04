import { Metadata } from "next"
import Link from "next/link"
import Script from "next/script"
import { ChevronRight } from "lucide-react"
import { Header } from "@/components/legacy/header"
import { Footer } from "@/components/legacy/footer"
import {
  generateTechArticleSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
  combineSchemas,
} from "@/lib/legacy/schema"

export const metadata: Metadata = {
  title: "Client-Side PDF Processing Explained",
  description:
    "Plain explains how browsers process PDF files locally using JavaScript and WebAssembly, without uploading to servers.",
  openGraph: {
    title: "Client-Side PDF Processing Explained - Plain",
    description: "Plain explains how browsers process PDF files locally using JavaScript and WebAssembly.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Client-Side PDF Processing Explained - Plain",
    description: "Plain explains how browsers process PDF files locally using JavaScript and WebAssembly.",
  },
  alternates: {
    canonical: "https://plain.tools/learn/client-side-processing",
  },
}

// Technical article schema
const articleSchema = generateTechArticleSchema({
  title: "Client-Side PDF Processing Explained",
  description:
    "Learn how browsers can process PDF files locally without uploading them to servers.",
  slug: "client-side-processing",
  datePublished: "2026-02-01",
  dateModified: "2026-02-27",
  proficiencyLevel: "Intermediate",
})

// Breadcrumb schema
const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Client-Side Processing", slug: "client-side-processing" },
])

// FAQ schema
const faqSchema = generateFAQSchema([
  {
    question: "How do browsers process PDF files locally?",
    answer:
      "Browsers use JavaScript and WebAssembly to run PDF processing libraries directly on your device. When you select a file, it's read into browser memory using the File API, processed locally, and the result is created without any server communication.",
  },
  {
    question: "What is WebAssembly and why does it matter for PDF processing?",
    answer:
      "WebAssembly (Wasm) allows code written in languages like C++ to run in browsers at near-native speed. PDF libraries originally written for desktop applications can be compiled to WebAssembly, bringing their full capabilities to the browser.",
  },
  {
    question: "What are the limitations of client-side PDF processing?",
    answer:
      "Client-side processing is limited by your device's memory and processing power. Very large files or complex operations may be slower than server-based tools. However, for common tasks like merging and splitting, modern browsers handle PDFs efficiently.",
  },
])

// Combine schemas
const combinedSchema = combineSchemas([articleSchema, breadcrumbSchema, faqSchema])

export default function ClientSideProcessingPage() {
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
          <nav className="mb-8 flex items-center gap-1.5 text-[13px] text-muted-foreground/70">
            <Link href="/pdf-tools/" className="transition-colors hover:text-accent">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href="/pdf-tools/learn" className="transition-colors hover:text-accent">
              Learn
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-foreground/80">Client-Side Processing</span>
          </nav>

          {/* Header */}
          <header className="mb-12">
            <div className="mb-4 inline-flex items-center rounded-full bg-accent/10 px-3 py-1 text-[11px] font-medium text-accent ring-1 ring-accent/20">
              Technical
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Client-Side PDF Processing Explained
            </h1>
            <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
              Modern browsers can manipulate PDF files entirely on your device, without sending data
              to external servers. This article explains how that works.
            </p>
          </header>

          {/* In Simple Terms */}
          <section className="mb-12 rounded-xl bg-[oklch(0.165_0.006_250)] p-6 ring-1 ring-accent/10">
            <h2 className="mb-3 text-[13px] font-semibold uppercase tracking-wider text-accent">
              In Simple Terms
            </h2>
            <p className="text-[14px] leading-relaxed text-foreground/90">
              Client-side processing means your browser does the work instead of a remote server.
              When you use a client-side PDF tool, your files stay on your computer. The browser
              reads the file, processes it using built-in capabilities, and gives you the result.
              No internet upload is required.
            </p>
          </section>

          {/* Main Content */}
          <div className="space-y-10">
            {/* What is client-side processing */}
            <section>
              <h2 className="mb-4 text-xl font-semibold tracking-tight text-foreground">
                What is client-side processing?
              </h2>
              <p className="text-[15px] leading-relaxed text-muted-foreground">
                In web development, "client" refers to the user's browser, while "server" refers to
                remote computers that host websites and process data. Client-side processing runs
                code directly in your browser, using your device's processor and memory.
              </p>
              <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                When you use a traditional online PDF tool, your file is uploaded to a server,
                processed there, and then sent back to you. With client-side processing, all of
                this happens locally. The file never leaves your device.
              </p>
            </section>

            {/* How browsers read files */}
            <section>
              <h2 className="mb-4 text-xl font-semibold tracking-tight text-foreground">
                How browsers read files
              </h2>
              <p className="text-[15px] leading-relaxed text-muted-foreground">
                Modern browsers include a standard called the File API. This allows web applications
                to read files that you select, without uploading them anywhere. When you choose a
                file using a file picker or drag-and-drop, the browser provides access to that
                file's contents directly in memory.
              </p>
              <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                The key distinction is that reading a file locally is not the same as uploading it.
                The file data stays within your browser's sandbox. It is never transmitted over the
                network unless the application explicitly sends it somewhere.
              </p>
            </section>

            {/* Technologies that enable this */}
            <section>
              <h2 className="mb-4 text-xl font-semibold tracking-tight text-foreground">
                Technologies that enable local processing
              </h2>
              <p className="text-[15px] leading-relaxed text-muted-foreground">
                Several browser technologies make client-side PDF processing possible:
              </p>
              <ul className="mt-4 space-y-3 text-[15px] leading-relaxed text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>
                    <strong className="font-medium text-foreground">JavaScript</strong> — The
                    programming language that runs in browsers. It handles user interactions and
                    coordinates processing operations.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>
                    <strong className="font-medium text-foreground">WebAssembly</strong> — A binary
                    format that runs at near-native speed in browsers. Complex PDF operations use
                    WebAssembly for performance.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>
                    <strong className="font-medium text-foreground">File API</strong> — Allows
                    reading files selected by the user without uploading them.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>
                    <strong className="font-medium text-foreground">Blob API</strong> — Creates
                    downloadable files from processed data.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>
                    <strong className="font-medium text-foreground">Service Workers</strong> —
                    Enable offline functionality by caching application code.
                  </span>
                </li>
              </ul>
              <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                These are standard web technologies available in all modern browsers. No plugins,
                extensions, or special permissions are required.
              </p>
            </section>

            {/* What operations can be done client-side */}
            <section>
              <h2 className="mb-4 text-xl font-semibold tracking-tight text-foreground">
                What operations can be done client-side?
              </h2>
              <p className="text-[15px] leading-relaxed text-muted-foreground">
                Many common PDF operations can be performed entirely in the browser:
              </p>
              <ul className="mt-4 space-y-2 text-[15px] leading-relaxed text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>Merging multiple PDFs into one document</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>Splitting a PDF into separate pages</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>Reordering pages within a document</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>Extracting specific pages</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>Rotating pages</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>Basic compression</span>
                </li>
              </ul>
              <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                These structural operations work at the page level and do not require understanding
                the document's original content. More complex operations like OCR or advanced editing
                may have limitations in browser environments.
              </p>
            </section>

            {/* Limitations */}
            <section>
              <h2 className="mb-4 text-xl font-semibold tracking-tight text-foreground">
                Limitations of client-side processing
              </h2>
              <p className="text-[15px] leading-relaxed text-muted-foreground">
                Client-side processing has some constraints:
              </p>
              <ul className="mt-4 space-y-2 text-[15px] leading-relaxed text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>
                    <strong className="font-medium text-foreground">Memory limits</strong> — Very
                    large files may exceed browser memory. Processing happens in RAM.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>
                    <strong className="font-medium text-foreground">Processing speed</strong> —
                    Complex operations depend on your device's capabilities.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>
                    <strong className="font-medium text-foreground">Feature availability</strong> —
                    Some advanced PDF features may not be fully supported.
                  </span>
                </li>
              </ul>
              <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                For typical document sizes and common operations, these limitations rarely affect
                normal use. The privacy benefits often outweigh these constraints.
              </p>
            </section>

            {/* Why it matters for privacy */}
            <section>
              <h2 className="mb-4 text-xl font-semibold tracking-tight text-foreground">
                Why this matters for privacy
              </h2>
              <p className="text-[15px] leading-relaxed text-muted-foreground">
                When files never leave your device, several risks are eliminated:
              </p>
              <ul className="mt-4 space-y-2 text-[15px] leading-relaxed text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>No risk of data breaches at the server level</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>No third-party access to your documents</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>No storage of files on external systems</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>No compliance complications from cross-border data transfer</span>
                </li>
              </ul>
              <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                For sensitive documents, this architecture provides meaningful privacy guarantees
                that server-based tools cannot match. Learn more about{" "}
                <Link
                  href="/pdf-tools/learn/no-uploads-explained"
                  className="text-accent underline underline-offset-4 transition-colors hover:text-accent/80"
                >
                  what "no uploads" actually means
                </Link>
                .
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
                  href="/pdf-tools/learn/verify-offline-processing"
                  className="group rounded-xl bg-[oklch(0.165_0.006_250)] p-5 ring-1 ring-accent/10 transition-all duration-200 hover:-translate-y-0.5 hover:ring-accent/25"
                >
                  <h3 className="text-[14px] font-semibold text-foreground group-hover:text-accent">
                    Verifying Offline Processing in DevTools
                  </h3>
                  <p className="mt-1.5 text-[12px] leading-relaxed text-muted-foreground/80">
                    How to confirm files never leave your device.
                  </p>
                </Link>
                <Link
                  href="/pdf-tools/learn/how-pdfs-work"
                  className="group rounded-xl bg-[oklch(0.165_0.006_250)] p-5 ring-1 ring-accent/10 transition-all duration-200 hover:-translate-y-0.5 hover:ring-accent/25"
                >
                  <h3 className="text-[14px] font-semibold text-foreground group-hover:text-accent">
                    How PDFs Work Internally
                  </h3>
                  <p className="mt-1.5 text-[12px] leading-relaxed text-muted-foreground/80">
                    Technical details of PDF file structure.
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

      <Footer />
    </div>
  )
}


