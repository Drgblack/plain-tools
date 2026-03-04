import { Metadata } from "next"
import Link from "next/link"
import Script from "next/script"
import { Header } from "@/components/legacy/header"
import { Footer } from "@/components/legacy/footer"
import {
  generateArticleSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
  combineSchemas,
} from "@/lib/legacy/schema"

export const metadata: Metadata = {
  title: "What Is a PDF?",
  description: "Plain explains what PDF files are, how they preserve document layout, and why they are used for sharing documents.",
  openGraph: {
    title: "What Is a PDF? - Plain",
    description: "Plain explains what PDF files are, how they preserve document layout, and why they are used for sharing documents.",
  },
  twitter: {
    card: "summary_large_image",
    title: "What Is a PDF? - Plain",
    description: "Plain explains what PDF files are, how they preserve document layout, and why they are used for sharing documents.",
  },
  alternates: {
    canonical: "https://plain.tools/learn/what-is-a-pdf",
  },
}

// Article schema
const articleSchema = generateArticleSchema({
  title: "What Is a PDF?",
  description: "A clear explanation of what PDF files are, why they exist, and how they are used.",
  slug: "what-is-a-pdf",
  datePublished: "2026-01-15",
  dateModified: "2026-02-27",
  wordCount: 1200,
  keywords: ["PDF", "Portable Document Format", "document format", "file format"],
})

// Breadcrumb schema
const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "What Is a PDF?", slug: "what-is-a-pdf" },
])

// FAQ schema for common questions addressed in the article
const faqSchema = generateFAQSchema([
  {
    question: "What does PDF stand for?",
    answer:
      "PDF stands for Portable Document Format. The name reflects its primary purpose: to create documents that can be shared and viewed portably across different systems without losing their appearance.",
  },
  {
    question: "What is the difference between a PDF and a Word document?",
    answer:
      "Word documents are designed for editing and adapt to different screen sizes and fonts. PDFs are designed for viewing and lock in the exact appearance of a document. The tradeoff is that PDFs are harder to edit but guarantee visual consistency across all devices.",
  },
  {
    question: "Are PDF files editable?",
    answer:
      "PDFs can be edited, but the process varies depending on how the PDF was created. Some PDFs are images of text requiring OCR, while others contain actual text data. Many PDF operations like merging, splitting, or reordering pages work at the structural level without altering content.",
  },
  {
    question: "Why do PDFs look the same on every device?",
    answer:
      "PDFs achieve visual consistency by embedding everything needed to render the document: font data, exact positioning coordinates for every element, embedded images and graphics, and page dimensions. The viewer uses this embedded information rather than relying on device-specific resources.",
  },
])

// Combine all schemas
const combinedSchema = combineSchemas([articleSchema, breadcrumbSchema, faqSchema])

export default function WhatIsAPDFPage() {
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
          <nav className="mb-8 flex items-center gap-2 text-[13px] text-muted-foreground/70">
            <Link href="/pdf-tools/" className="transition-colors hover:text-accent">
              Home
            </Link>
            <span>/</span>
            <Link href="/pdf-tools/learn" className="transition-colors hover:text-accent">
              Learn
            </Link>
            <span>/</span>
            <span className="text-foreground/80">What Is a PDF?</span>
          </nav>

          {/* Header */}
          <header className="mb-12">
            <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              What Is a PDF?
            </h1>
            <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
              A PDF is a file format designed to present documents consistently across different devices, operating systems, and software. It preserves the exact layout, fonts, and formatting of a document regardless of where it is viewed.
            </p>
          </header>

          {/* In Simple Terms box */}
          <div className="mb-12 rounded-xl bg-[oklch(0.165_0.006_250)] p-6 ring-1 ring-accent/15">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-accent">
              In Simple Terms
            </p>
            <p className="text-[14px] leading-relaxed text-foreground/85">
              A PDF is a digital document that looks the same on every computer, phone, or tablet. Unlike Word documents, PDFs keep their formatting no matter where you open them. They are commonly used for contracts, forms, manuals, and any document that needs to look exactly as intended.
            </p>
          </div>

          {/* Content sections */}
          <div className="space-y-12">
            {/* What does PDF stand for? */}
            <section>
              <h2 className="mb-4 text-xl font-semibold tracking-tight text-foreground">
                What does PDF stand for?
              </h2>
              <p className="text-[14px] leading-relaxed text-muted-foreground">
                PDF stands for Portable Document Format. The name reflects its primary purpose: to create documents that can be shared and viewed portably across different systems without losing their appearance. The format was developed by Adobe Systems and released in 1993.
              </p>
            </section>

            {/* Why PDFs were created */}
            <section>
              <h2 className="mb-4 text-xl font-semibold tracking-tight text-foreground">
                Why PDFs were created
              </h2>
              <p className="text-[14px] leading-relaxed text-muted-foreground">
                Before PDFs, sharing documents between different computers and operating systems was problematic. A document created in one word processor might look completely different when opened in another. Fonts would change, layouts would break, and pages would reflow unpredictably.
              </p>
              <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
                Adobe created PDF to solve this problem. The format encapsulates everything needed to display a document exactly as intended: the text, fonts, images, and precise positioning of every element. This made it possible to share documents reliably across any platform.
              </p>
            </section>

            {/* What makes PDFs different from Word documents */}
            <section>
              <h2 className="mb-4 text-xl font-semibold tracking-tight text-foreground">
                What makes PDFs different from Word documents
              </h2>
              <p className="text-[14px] leading-relaxed text-muted-foreground">
                Word documents (.doc, .docx) are designed for editing. They store content in a flexible format that adapts to different screen sizes, installed fonts, and software versions. This flexibility is useful when creating and revising documents, but it means the document may appear differently on different computers.
              </p>
              <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
                PDFs are designed for viewing and sharing. They lock in the exact appearance of a document at the time of creation. The tradeoff is that PDFs are generally harder to edit than Word documents, but they guarantee visual consistency.
              </p>
              <div className="mt-4 rounded-lg bg-[oklch(0.14_0.004_250)] p-4 ring-1 ring-accent/8">
                <p className="text-[13px] leading-relaxed text-muted-foreground/80">
                  <span className="font-medium text-foreground/70">Key difference:</span> Word documents prioritise editability; PDFs prioritise visual fidelity.
                </p>
              </div>
            </section>

            {/* Are PDFs editable? */}
            <section>
              <h2 className="mb-4 text-xl font-semibold tracking-tight text-foreground">
                Are PDFs editable?
              </h2>
              <p className="text-[14px] leading-relaxed text-muted-foreground">
                PDFs can be edited, but the process varies depending on how the PDF was created. Some PDFs are essentially images of text and cannot be edited without optical character recognition (OCR). Others contain actual text data that can be modified with appropriate software.
              </p>
              <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
                Many PDF operations do not require editing the content itself. Tasks like merging multiple PDFs, splitting a PDF into separate files, reordering pages, or extracting specific pages can be performed without altering the original content. These operations work at the structural level of the PDF.
              </p>
              <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
                <Link href="/pdf-tools/" className="text-accent underline underline-offset-2 transition-colors hover:text-accent/80">
                  Plain PDF tools
                </Link>{" "}
                focus on these structural operations, which can be performed entirely in the browser without uploading files to a server.
              </p>
            </section>

            {/* Why PDFs look the same on every device */}
            <section>
              <h2 className="mb-4 text-xl font-semibold tracking-tight text-foreground">
                Why PDFs look the same on every device
              </h2>
              <p className="text-[14px] leading-relaxed text-muted-foreground">
                PDFs achieve visual consistency by embedding everything needed to render the document. This typically includes:
              </p>
              <ul className="mt-3 space-y-2 text-[14px] leading-relaxed text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent/60" />
                  <span>Font data (or references to standard fonts)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent/60" />
                  <span>Exact positioning coordinates for every element</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent/60" />
                  <span>Embedded images and graphics</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent/60" />
                  <span>Page dimensions and margins</span>
                </li>
              </ul>
              <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
                When a PDF viewer opens the file, it uses this embedded information to recreate the document exactly. It does not rely on the viewing device having specific fonts installed or specific software capabilities.
              </p>
              <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
                For a deeper look at the technical structure, see{" "}
                <Link href="/pdf-tools/learn/how-pdfs-work" className="text-accent underline underline-offset-2 transition-colors hover:text-accent/80">
                  How PDFs Work
                </Link>.
              </p>
            </section>

            {/* Common uses of PDF files */}
            <section>
              <h2 className="mb-4 text-xl font-semibold tracking-tight text-foreground">
                Common uses of PDF files
              </h2>
              <p className="text-[14px] leading-relaxed text-muted-foreground">
                PDFs are widely used in situations where document appearance matters:
              </p>
              <ul className="mt-3 space-y-2 text-[14px] leading-relaxed text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent/60" />
                  <span><span className="font-medium text-foreground/80">Legal documents</span> — contracts, agreements, court filings</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent/60" />
                  <span><span className="font-medium text-foreground/80">Business documents</span> — invoices, reports, proposals</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent/60" />
                  <span><span className="font-medium text-foreground/80">Forms</span> — applications, tax forms, registration documents</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent/60" />
                  <span><span className="font-medium text-foreground/80">Technical documentation</span> — manuals, specifications, datasheets</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent/60" />
                  <span><span className="font-medium text-foreground/80">Publications</span> — ebooks, whitepapers, academic papers</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent/60" />
                  <span><span className="font-medium text-foreground/80">Archives</span> — preserving documents in a stable, long-term format</span>
                </li>
              </ul>
              <p className="mt-4 text-[14px] leading-relaxed text-muted-foreground">
                When working with multiple PDF files, tools for{" "}
                <Link href="/pdf-tools/tools/merge-pdf" className="text-accent underline underline-offset-2 transition-colors hover:text-accent/80">
                  merging
                </Link>,{" "}
                splitting, or reordering pages can be useful. Understanding the difference between{" "}
                <Link href="/pdf-tools/learn/online-vs-offline-pdf-tools" className="text-accent underline underline-offset-2 transition-colors hover:text-accent/80">
                  online and offline PDF tools
                </Link>{" "}
                is important when handling sensitive documents.
              </p>
            </section>
          </div>

          {/* Related articles */}
          <nav className="mt-16 border-t border-accent/10 pt-8">
            <p className="mb-4 text-[12px] font-semibold uppercase tracking-wider text-muted-foreground/60">
              Related Articles
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
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
                href="/pdf-tools/learn/pdf-consistency"
                className="group rounded-xl bg-[oklch(0.165_0.006_250)] p-5 ring-1 ring-accent/10 transition-all duration-200 hover:-translate-y-0.5 hover:ring-accent/25"
              >
                <h3 className="text-[14px] font-semibold text-foreground group-hover:text-accent">
                  Why PDFs Preserve Layout
                </h3>
                <p className="mt-1.5 text-[12px] leading-relaxed text-muted-foreground/80">
                  How fonts and positioning ensure consistency.
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
                  How browsers process PDFs locally.
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
            <div className="mt-6">
              <Link
                href="/pdf-tools/learn"
                className="text-[14px] text-muted-foreground underline underline-offset-2 transition-colors hover:text-foreground"
              >
                Back to Learning Center
              </Link>
            </div>
          </nav>
        </article>
      </main>
      <Footer />
    </div>
  )
}


