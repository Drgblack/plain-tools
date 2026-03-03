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
  title: "Why PDFs Preserve Layout",
  description:
    "Plain explains how PDF files maintain consistent visual appearance across devices through embedded fonts, fixed positioning, and self-contained resources.",
  openGraph: {
    title: "Why PDFs Preserve Layout - Plain",
    description: "Plain explains how PDF files maintain consistent visual appearance across devices.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Why PDFs Preserve Layout - Plain",
    description: "Plain explains how PDF files maintain consistent visual appearance across devices.",
  },
  alternates: {
    canonical: "https://plain.tools/learn/pdf-consistency",
  },
}

// Technical article schema
const articleSchema = generateTechArticleSchema({
  title: "Why PDFs Preserve Layout",
  description:
    "How PDF files maintain consistent visual appearance across devices and platforms.",
  slug: "pdf-consistency",
  datePublished: "2026-01-25",
  dateModified: "2026-02-27",
  proficiencyLevel: "Beginner",
})

// Breadcrumb schema
const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Why PDFs Preserve Layout", slug: "pdf-consistency" },
])

// FAQ schema
const faqSchema = generateFAQSchema([
  {
    question: "Why do PDFs look the same on every device?",
    answer:
      "PDFs embed everything needed to render the document: fonts, exact positioning coordinates, images, and colour profiles. The viewer uses this embedded information rather than relying on device-specific resources, ensuring identical appearance everywhere.",
  },
  {
    question: "What is font embedding in PDFs?",
    answer:
      "Font embedding stores the font data directly in the PDF file. When you open the PDF, it uses the embedded fonts rather than looking for them on your system, ensuring text displays correctly even if you do not have those fonts installed.",
  },
  {
    question: "Why are PDFs harder to edit than Word documents?",
    answer:
      "PDFs store content by absolute position rather than semantic structure. There are no concepts like paragraphs or margins to adjust - just positioned elements. This preserves appearance but makes restructuring difficult.",
  },
  {
    question: "Can PDFs adapt to different screen sizes?",
    answer:
      "No. PDFs use fixed positioning where every element has exact coordinates. The layout is determined at creation time and does not reflow for different screen sizes the way responsive websites do.",
  },
])

// Combine schemas
const combinedSchema = combineSchemas([articleSchema, breadcrumbSchema, faqSchema])

export default function PDFConsistencyPage() {
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
            <span className="text-foreground/80">Why PDFs Preserve Layout</span>
          </nav>

          {/* Header */}
          <header className="mb-12">
            <div className="mb-4 inline-flex items-center rounded-full bg-accent/10 px-3 py-1 text-[11px] font-medium text-accent ring-1 ring-accent/20">
              PDF Fundamentals
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Why PDFs Preserve Layout
            </h1>
            <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
              A PDF looks the same on every computer, phone, and printer. This article explains
              the technical reasons behind this consistency.
            </p>
          </header>

          {/* In Simple Terms */}
          <section className="mb-12 rounded-xl bg-[oklch(0.165_0.006_250)] p-6 ring-1 ring-accent/10">
            <h2 className="mb-3 text-[13px] font-semibold uppercase tracking-wider text-accent">
              In Simple Terms
            </h2>
            <p className="text-[14px] leading-relaxed text-foreground/90">
              PDFs are self-contained packages. They include the fonts, images, and exact
              positioning of every element. When you open a PDF, your viewer uses this embedded
              information to recreate the document exactly as intended, regardless of what
              software or device you use.
            </p>
          </section>

          {/* Main Content */}
          <div className="space-y-10">
            {/* The problem PDFs solve */}
            <section>
              <h2 className="mb-4 text-xl font-semibold tracking-tight text-foreground">
                The problem PDFs solve
              </h2>
              <p className="text-[15px] leading-relaxed text-muted-foreground">
                Before PDFs became widespread, sharing documents was unpredictable. A document
                created on one computer might look completely different on another. Fonts would
                substitute, line breaks would shift, and carefully designed layouts would fall
                apart.
              </p>
              <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                This happened because traditional document formats store content and instructions
                for layout, but rely on the receiving computer to interpret those instructions.
                If the receiving computer has different fonts installed, different margins, or
                different software, the interpretation differs.
              </p>
              <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                PDFs solve this by storing not just the content, but the final rendered result.
                The layout decisions have already been made and locked in.
              </p>
            </section>

            {/* Embedded fonts */}
            <section>
              <h2 className="mb-4 text-xl font-semibold tracking-tight text-foreground">
                Embedded fonts
              </h2>
              <p className="text-[15px] leading-relaxed text-muted-foreground">
                One of the main reasons documents look different on different computers is fonts.
                If you create a document using a font that the recipient does not have installed,
                their software substitutes a different font. This changes line lengths, paragraph
                breaks, and the overall appearance.
              </p>
              <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                PDFs can embed font data directly in the file. When you open the PDF, it uses the
                embedded fonts rather than looking for them on your system. The document displays
                correctly even if you have never heard of the fonts used.
              </p>
              <div className="mt-4 rounded-lg bg-[oklch(0.14_0.004_250)] p-4 ring-1 ring-accent/8">
                <p className="text-[13px] font-medium text-foreground">Font embedding options</p>
                <p className="mt-1 text-[13px] text-muted-foreground">
                  PDFs can embed full fonts or just the characters used in the document (font
                  subsetting). Subsetting reduces file size while maintaining appearance. Some
                  PDFs reference standard fonts (like Times or Helvetica) without embedding,
                  which can occasionally cause slight variations.
                </p>
              </div>
            </section>

            {/* Fixed positioning */}
            <section>
              <h2 className="mb-4 text-xl font-semibold tracking-tight text-foreground">
                Fixed positioning
              </h2>
              <p className="text-[15px] leading-relaxed text-muted-foreground">
                Word processors and web pages use relative positioning. Text flows to fill the
                available space, reflowing when the window size or font changes. This flexibility
                is useful for editing but creates unpredictability when sharing.
              </p>
              <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                PDFs use absolute positioning. Every element has exact coordinates on the page.
                The file contains instructions like "place this character at position 72.5 points
                from the left edge and 650.3 points from the bottom." There is no interpretation
                or calculation—the viewer simply draws elements where specified.
              </p>
              <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                This coordinate-based approach is why PDFs cannot easily adapt to different
                screen sizes the way websites do. The layout is fixed at creation time.
              </p>
            </section>

            {/* Embedded resources */}
            <section>
              <h2 className="mb-4 text-xl font-semibold tracking-tight text-foreground">
                Embedded resources
              </h2>
              <p className="text-[15px] leading-relaxed text-muted-foreground">
                Besides fonts, PDFs can embed other resources:
              </p>
              <ul className="mt-4 space-y-3 text-[15px] leading-relaxed text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>
                    <strong className="font-medium text-foreground">Images</strong> — Graphics are
                    stored directly in the PDF, not linked to external files that might move or
                    disappear.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>
                    <strong className="font-medium text-foreground">Vector graphics</strong> —
                    Shapes, lines, and diagrams are stored as mathematical descriptions, ensuring
                    crisp rendering at any zoom level.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>
                    <strong className="font-medium text-foreground">Colour profiles</strong> —
                    Colour information can be embedded to ensure accurate colour reproduction
                    across different monitors and printers.
                  </span>
                </li>
              </ul>
              <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                This self-contained nature means a PDF can be opened years later, on a completely
                different computer, and still look exactly as intended. Nothing external is
                required.
              </p>
            </section>

            {/* Page description language */}
            <section>
              <h2 className="mb-4 text-xl font-semibold tracking-tight text-foreground">
                Page description language
              </h2>
              <p className="text-[15px] leading-relaxed text-muted-foreground">
                PDFs are based on PostScript, a page description language developed by Adobe for
                printing. PostScript describes pages as a series of drawing operations: move to
                this point, draw a line, fill this area, place this character.
              </p>
              <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                This print-oriented heritage explains why PDFs excel at visual fidelity. The
                format was designed from the start to produce identical output on any printer.
                Screen viewing is essentially the same process—rendering the page description
                to a display instead of paper.
              </p>
              <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                For more technical detail on the internal structure, see{" "}
                <Link
                  href="/learn/how-pdfs-work"
                  className="text-accent underline underline-offset-4 transition-colors hover:text-accent/80"
                >
                  How PDFs Work
                </Link>
                .
              </p>
            </section>

            {/* The tradeoff */}
            <section>
              <h2 className="mb-4 text-xl font-semibold tracking-tight text-foreground">
                The tradeoff: consistency vs flexibility
              </h2>
              <p className="text-[15px] leading-relaxed text-muted-foreground">
                PDF's approach to layout preservation comes with tradeoffs:
              </p>
              <div className="mt-4 space-y-4">
                <div className="rounded-lg bg-[oklch(0.14_0.004_250)] p-4 ring-1 ring-accent/8">
                  <p className="text-[13px] font-medium text-foreground">What PDFs do well</p>
                  <ul className="mt-2 space-y-1 text-[13px] text-muted-foreground">
                    <li>• Exact visual reproduction across all platforms</li>
                    <li>• Reliable printing with predictable results</li>
                    <li>• Long-term archival (the format is ISO standardised)</li>
                    <li>• Self-contained files with no external dependencies</li>
                  </ul>
                </div>
                <div className="rounded-lg bg-[oklch(0.14_0.004_250)] p-4 ring-1 ring-accent/8">
                  <p className="text-[13px] font-medium text-foreground">What PDFs do not do well</p>
                  <ul className="mt-2 space-y-1 text-[13px] text-muted-foreground">
                    <li>• Adapting to different screen sizes (responsive design)</li>
                    <li>• Easy content editing after creation</li>
                    <li>• Reflowing text for accessibility needs</li>
                    <li>• Keeping file sizes small (embedding increases size)</li>
                  </ul>
                </div>
              </div>
              <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                PDFs are designed for final documents that need to look exactly as intended.
                They are not designed for documents that need to adapt or be easily edited.
              </p>
            </section>

            {/* When consistency matters */}
            <section>
              <h2 className="mb-4 text-xl font-semibold tracking-tight text-foreground">
                When layout consistency matters
              </h2>
              <p className="text-[15px] leading-relaxed text-muted-foreground">
                PDF's visual consistency is important for:
              </p>
              <ul className="mt-4 space-y-2 text-[15px] leading-relaxed text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>
                    <strong className="font-medium text-foreground">Legal documents</strong> —
                    Contracts, agreements, and court filings where exact wording and formatting
                    have legal significance.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>
                    <strong className="font-medium text-foreground">Print design</strong> —
                    Brochures, posters, and publications where visual design is precisely
                    controlled.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>
                    <strong className="font-medium text-foreground">Technical documentation</strong> —
                    Manuals and specifications where diagrams must align correctly with text.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>
                    <strong className="font-medium text-foreground">Archival</strong> — Records
                    that need to be readable decades later without software compatibility issues.
                  </span>
                </li>
              </ul>
              <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                For these use cases, the predictability of PDF layout is a feature, not a
                limitation.
              </p>
            </section>

            {/* Related */}
            <section className="border-t border-accent/10 pt-10">
              <h2 className="mb-6 text-lg font-semibold tracking-tight text-foreground">
                Related articles
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <Link
                  href="/learn/what-is-a-pdf"
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
                  href="/learn/how-pdfs-work"
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
                  href="/learn/client-side-processing"
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
