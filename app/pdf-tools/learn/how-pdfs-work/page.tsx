import { Metadata } from "next"
import Link from "next/link"
import Script from "next/script"
import { Header } from "@/components/legacy/header"
import { Footer } from "@/components/legacy/footer"
import { ChevronRight } from "lucide-react"
import {
  generateTechArticleSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
  combineSchemas,
} from "@/lib/legacy/schema"

export const metadata: Metadata = {
  title: "How PDFs Work Internally",
  description:
    "Plain describes how PDF files store text, images, fonts, and layout data to create self-contained documents.",
  openGraph: {
    title: "How PDFs Work Internally - Plain",
    description: "Plain describes how PDF files store text, images, fonts, and layout data to create self-contained documents.",
  },
  twitter: {
    card: "summary_large_image",
    title: "How PDFs Work Internally - Plain",
    description: "Plain describes how PDF files store text, images, fonts, and layout data to create self-contained documents.",
  },
  alternates: {
    canonical: "https://plain.tools/learn/how-pdfs-work",
  },
}

// Technical article schema
const articleSchema = generateTechArticleSchema({
  title: "How PDFs Work Internally",
  description:
    "Learn how PDF files function internally, including how text, images, fonts, and layout are stored.",
  slug: "how-pdfs-work",
  datePublished: "2026-01-20",
  dateModified: "2026-02-27",
  proficiencyLevel: "Intermediate",
})

// Breadcrumb schema
const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "How PDFs Work", slug: "how-pdfs-work" },
])

// FAQ schema
const faqSchema = generateFAQSchema([
  {
    question: "What is the basic structure of a PDF file?",
    answer:
      "A PDF file consists of four main parts: a header declaring the PDF version, a body containing objects (text, images, fonts), a cross-reference table mapping object locations, and a trailer pointing to key structures.",
  },
  {
    question: "How do PDFs store text?",
    answer:
      "PDFs store text as a series of positioning commands and character codes. Each text element includes coordinates for exact placement, font references, and the actual characters to display.",
  },
  {
    question: "Why are PDFs harder to edit than Word documents?",
    answer:
      "PDFs store content by absolute position rather than semantic structure. There are no concepts like 'paragraphs' or 'margins' - just positioned elements. This preserves appearance but makes restructuring difficult.",
  },
])

// Combine schemas
const combinedSchema = combineSchemas([articleSchema, breadcrumbSchema, faqSchema])

export default function HowPDFsWorkPage() {
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
            <span className="text-foreground/80">How PDFs Work</span>
          </nav>

          {/* Header */}
          <header className="mb-12">
            <div className="mb-4 inline-flex items-center rounded-full bg-accent/10 px-3 py-1 text-[11px] font-medium text-accent ring-1 ring-accent/20">
              PDF Fundamentals
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              How PDFs Work
            </h1>
            <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
              Understanding how PDF files function internally helps explain why they are so 
              reliable for sharing and printing documents across different systems.
            </p>
          </header>

          {/* In Simple Terms */}
          <section className="mb-12 rounded-xl bg-[oklch(0.165_0.006_250)] p-6 ring-1 ring-accent/10">
            <h2 className="mb-3 text-[13px] font-semibold uppercase tracking-wider text-accent">
              In Simple Terms
            </h2>
            <p className="text-[14px] leading-relaxed text-foreground/90">
              A PDF is a self-contained document that stores everything needed to display it 
              exactly the same way on any device: the text, images, fonts, and precise layout 
              instructions. Unlike word processors that reflow content, PDFs preserve fixed 
              positioning, making them ideal for printing and sharing documents that must 
              look identical everywhere.
            </p>
          </section>

          {/* Main Content */}
          <div className="prose-custom space-y-10">
            {/* Intro */}
            <p className="text-[15px] leading-relaxed text-muted-foreground">
              PDF stands for Portable Document Format. The key word is "portable"—a PDF file 
              contains everything required to render the document identically on any computer, 
              phone, or printer, regardless of the software or operating system being used.
            </p>

            {/* PDF vs Word documents */}
            <section>
              <h2 className="mb-4 text-xl font-semibold tracking-tight text-foreground">
                PDF vs Word documents
              </h2>
              <p className="text-[15px] leading-relaxed text-muted-foreground">
                Word processors like Microsoft Word store documents as structured content—paragraphs, 
                headings, lists—and then calculate where everything should appear based on the 
                current page size and margins. If you change the font or resize the window, the 
                text reflows to fit.
              </p>
              <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                PDFs work differently. The layout has already been calculated and fixed at the 
                time the PDF was created. The file contains absolute positions for every element. 
                This means a PDF will look identical on any screen or printer, but it also means 
                the content cannot easily adapt to different page sizes without regenerating the 
                entire document.
              </p>
              <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                For more on these differences, see{" "}
                <Link href="/pdf-tools/learn/what-is-a-pdf" className="text-accent underline underline-offset-4 transition-colors hover:text-accent/80">
                  What is a PDF
                </Link>.
              </p>
            </section>

            {/* Pages, text, images, layers */}
            <section>
              <h2 className="mb-4 text-xl font-semibold tracking-tight text-foreground">
                Pages, text, images, layers
              </h2>
              <p className="text-[15px] leading-relaxed text-muted-foreground">
                A PDF file is essentially a structured container. Inside, it holds multiple 
                types of data organized in a specific format:
              </p>
              <ul className="mt-4 space-y-2 text-[15px] leading-relaxed text-muted-foreground">
                <li className="flex gap-3">
                  <span className="text-accent">•</span>
                  <span><strong className="text-foreground/90">Pages</strong> — Each page has a defined size and contains its own content</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent">•</span>
                  <span><strong className="text-foreground/90">Text</strong> — Characters with exact coordinates specifying their position on the page</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent">•</span>
                  <span><strong className="text-foreground/90">Images</strong> — Compressed graphics embedded directly in the file</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent">•</span>
                  <span><strong className="text-foreground/90">Fonts</strong> — Embedded font data so text displays correctly everywhere</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent">•</span>
                  <span><strong className="text-foreground/90">Layers</strong> — Optional content groups that can be shown or hidden</span>
                </li>
              </ul>
              <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                Text in a PDF is not stored as flowing paragraphs. Instead, each piece of text 
                has exact coordinates—the file contains instructions like "place the letter 
                'A' at position (72, 540) using Helvetica at 12 points." This coordinate-based 
                approach is what makes PDFs reliable—there is no ambiguity about where anything 
                should appear.
              </p>
            </section>

            {/* Why PDFs are hard to edit */}
            <section>
              <h2 className="mb-4 text-xl font-semibold tracking-tight text-foreground">
                Why PDFs are hard to edit
              </h2>
              <p className="text-[15px] leading-relaxed text-muted-foreground">
                Editing a PDF is more difficult than editing a Word document because the original 
                document structure—paragraphs, headings, lists—has been flattened into positioned 
                elements. When you edit a Word file, you change the content and the software 
                recalculates the layout. With a PDF, each element has fixed coordinates.
              </p>
              <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                This creates several challenges:
              </p>
              <ul className="mt-4 space-y-2 text-[15px] leading-relaxed text-muted-foreground">
                <li className="flex gap-3">
                  <span className="text-accent">•</span>
                  <span>Adding or removing text does not automatically reflow surrounding content</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent">•</span>
                  <span>Fonts may need to be replaced if the original is not available</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent">•</span>
                  <span>Complex layouts with columns or tables are difficult to modify</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent">•</span>
                  <span>Scanned PDFs contain images of text, not actual text data</span>
                </li>
              </ul>
              <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                For this reason, many workflows involve editing source documents in Word or 
                design software, then exporting final versions as PDF.
              </p>
            </section>

            {/* Why PDF tools exist */}
            <section>
              <h2 className="mb-4 text-xl font-semibold tracking-tight text-foreground">
                Why PDF tools exist
              </h2>
              <p className="text-[15px] leading-relaxed text-muted-foreground">
                Because PDFs are designed for distribution rather than editing, specialized tools 
                have emerged to help with common tasks:
              </p>
              <ul className="mt-4 space-y-2 text-[15px] leading-relaxed text-muted-foreground">
                <li className="flex gap-3">
                  <span className="text-accent">•</span>
                  <span><strong className="text-foreground/90">Merging</strong> — Combining multiple PDFs into a single document</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent">•</span>
                  <span><strong className="text-foreground/90">Splitting</strong> — Separating a PDF into individual pages or sections</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent">•</span>
                  <span><strong className="text-foreground/90">Compressing</strong> — Reducing file size by optimizing images and fonts</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent">•</span>
                  <span><strong className="text-foreground/90">Reordering</strong> — Rearranging pages within a document</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent">•</span>
                  <span><strong className="text-foreground/90">Converting</strong> — Transforming other formats to or from PDF</span>
                </li>
              </ul>
              <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                These operations do not require understanding the original document structure—they 
                work at the level of pages and file content. This makes them well-suited to 
                browser-based processing. Learn more about{" "}
                <Link href="/pdf-tools/learn/online-vs-offline-pdf-tools" className="text-accent underline underline-offset-4 transition-colors hover:text-accent/80">
                  online vs offline PDF tools
                </Link>.
              </p>
            </section>

            {/* Privacy consideration */}
            <section className="rounded-xl border border-accent/15 bg-[oklch(0.155_0.005_250)] p-6">
              <h3 className="mb-3 text-[15px] font-semibold text-foreground">
                A note on privacy
              </h3>
              <p className="text-[14px] leading-relaxed text-muted-foreground">
                Because PDFs can contain embedded fonts, images, and metadata, they may include 
                more information than you expect. Some PDF tools transmit your files to remote 
                servers for processing. Learn more about{" "}
                <Link href="/pdf-tools/learn/why-pdf-uploads-are-risky" className="text-accent underline underline-offset-4 transition-colors hover:text-accent/80">
                  why PDF uploads can be risky
                </Link>.
              </p>
            </section>

            {/* Related */}
            <section className="border-t border-accent/10 pt-10">
              <h2 className="mb-6 text-lg font-semibold tracking-tight text-foreground">
                Related articles
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <Link
                  href="/pdf-tools/learn/what-is-a-pdf"
                  className="group rounded-xl bg-[oklch(0.165_0.006_250)] p-5 ring-1 ring-accent/10 transition-all duration-200 hover:-translate-y-0.5 hover:ring-accent/25"
                >
                  <h3 className="text-[14px] font-semibold text-foreground group-hover:text-accent">
                    What Is a PDF?
                  </h3>
                  <p className="mt-1.5 text-[12px] leading-relaxed text-muted-foreground/80">
                    Basic introduction to the PDF format.
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
            </section>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  )
}


