import { Metadata } from "next"
import Link from "next/link"
import Script from "next/script"
import { ArticleShareRow } from "@/components/legacy/share-button"
import { ArrowLeft, ArrowRight } from "lucide-react"
import {
  generateTechArticleSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
  combineSchemas,
} from "@/lib/legacy/schema"

export const metadata: Metadata = {
  title: "Why Uploading PDFs Can Be Risky",
  description:
    "Understand the privacy, security, and compliance risks of uploading PDF files to online services. Learn about storage, metadata exposure, and when offline tools are safer.",
  alternates: {
    canonical: "https://plain.tools/learn/why-pdf-uploads-are-risky",
  },
}

// Article schema for technical content
const articleSchema = generateTechArticleSchema({
  title: "Why Uploading PDFs Can Be Risky",
  description:
    "An objective explanation of privacy, security, and compliance risks when uploading PDF files to online services.",
  slug: "why-pdf-uploads-are-risky",
  datePublished: "2026-01-20",
  dateModified: "2026-02-27",
  proficiencyLevel: "Beginner",
})

// Breadcrumb schema
const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Why Uploading PDFs Can Be Risky", slug: "why-pdf-uploads-are-risky" },
])

// FAQ schema for common questions
const faqSchema = generateFAQSchema([
  {
    question: "What happens to my PDF when I upload it to an online tool?",
    answer:
      "When you upload a PDF to an online service, it travels across the internet to the service's servers. There it may be processed, stored temporarily or permanently, and potentially logged. The exact handling depends on the service's policies.",
  },
  {
    question: "Can online PDF tools see the content of my documents?",
    answer:
      "Yes. When you upload a PDF to a server-based tool, the service has full access to the document content. This is necessary for processing but means sensitive information is exposed to the service provider.",
  },
  {
    question: "Are free PDF tools safe to use for sensitive documents?",
    answer:
      "It depends on what you consider sensitive and your risk tolerance. Free services may have weaker privacy guarantees or use your data for other purposes. For highly sensitive documents, offline tools eliminate server exposure entirely.",
  },
])

// Combine all schemas
const combinedSchema = combineSchemas([articleSchema, breadcrumbSchema, faqSchema])

export default function WhyPdfUploadsAreRiskyPage() {
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
          <nav className="mb-8 flex items-center gap-2 text-[13px] text-muted-foreground">
            <Link href="/pdf-tools/" className="transition-colors hover:text-accent">
              Home
            </Link>
            <span>/</span>
            <Link href="/pdf-tools/learn" className="transition-colors hover:text-accent">
              Learn
            </Link>
            <span>/</span>
            <span className="text-foreground">Why Uploading PDFs Can Be Risky</span>
          </nav>

          {/* Header */}
          <header className="mb-12">
            <div className="mb-4 inline-flex items-center rounded-full bg-accent/10 px-3 py-1 text-[11px] font-medium text-accent ring-1 ring-accent/20">
              Privacy & Security
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Why Uploading PDFs Can Be Risky
            </h1>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              When you upload a PDF to an online service, your file travels to a remote server 
              for processing. This article explains what happens during that process and the 
              potential risks involved.
            </p>
          </header>

          {/* In Simple Terms box */}
          <div className="mb-12 rounded-xl bg-[oklch(0.17_0.008_250)] p-6 ring-1 ring-accent/15">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-accent">
              In Simple Terms
            </p>
            <p className="text-[14px] leading-relaxed text-foreground/90">
              Uploading a PDF means sending a copy of your file to someone else's computer. 
              Once uploaded, you have limited control over how it's stored, who can access it, 
              or how long it's retained. For sensitive documents, this can create privacy, 
              security, and compliance risks.
            </p>
          </div>

          {/* Content */}
          <div className="space-y-10 text-[15px] leading-relaxed text-muted-foreground">
            {/* What uploading means */}
            <section>
              <h2 className="mb-4 text-xl font-semibold text-foreground">
                What Does "Uploading a PDF" Mean?
              </h2>
              <p className="mb-4">
                When you use an online PDF tool, clicking "upload" or dragging a file into 
                a web page typically sends that file over the internet to the service's 
                servers. The file is transmitted, received, and stored—at least temporarily—on 
                infrastructure you don't control.
              </p>
              <p>
                This is different from browser-based tools that process files locally on your 
                device. With local processing, the file never leaves your computer. With uploads, 
                a copy of your document exists elsewhere.
              </p>
            </section>

            {/* What happens after upload */}
            <section>
              <h2 className="mb-4 text-xl font-semibold text-foreground">
                What Happens After a File Is Uploaded
              </h2>
              <p className="mb-4">
                After upload, the service processes your file on its servers. This typically 
                involves:
              </p>
              <ul className="mb-4 list-inside list-disc space-y-2 pl-2">
                <li>Receiving and temporarily storing the file</li>
                <li>Running the requested operation (merge, compress, convert, etc.)</li>
                <li>Generating a result file for download</li>
                <li>Potentially logging the transaction</li>
              </ul>
              <p>
                The specifics depend on the service. Some delete files immediately after 
                processing. Others may retain files for hours, days, or indefinitely. 
                Without reading the service's privacy policy, you may not know which 
                approach applies.
              </p>
            </section>

            {/* Storage, logging, retention */}
            <section>
              <h2 className="mb-4 text-xl font-semibold text-foreground">
                Storage, Logging, and Retention
              </h2>
              <p className="mb-4">
                Even if a service claims to delete files after processing, several copies 
                may exist:
              </p>
              <ul className="mb-4 list-inside list-disc space-y-2 pl-2">
                <li>
                  <strong className="text-foreground">Server storage:</strong> The uploaded 
                  file may be written to disk before processing
                </li>
                <li>
                  <strong className="text-foreground">Backup systems:</strong> Cloud 
                  infrastructure often creates automatic backups
                </li>
                <li>
                  <strong className="text-foreground">Access logs:</strong> Metadata about 
                  the upload (filename, size, timestamp, IP address) may be logged
                </li>
                <li>
                  <strong className="text-foreground">CDN caches:</strong> Content delivery 
                  networks may cache files temporarily
                </li>
              </ul>
              <p>
                Deletion policies vary widely. "Deleted after processing" might mean 
                immediately, after 24 hours, or after 30 days. Some services provide 
                no clear retention policy at all.
              </p>
            </section>

            {/* Metadata and hidden data */}
            <section>
              <h2 className="mb-4 text-xl font-semibold text-foreground">
                Metadata and Hidden Data
              </h2>
              <p className="mb-4">
                PDF files often contain more information than the visible content. This 
                can include:
              </p>
              <ul className="mb-4 list-inside list-disc space-y-2 pl-2">
                <li>Author name and organization</li>
                <li>Creation and modification dates</li>
                <li>Software used to create the document</li>
                <li>Revision history and tracked changes</li>
                <li>Comments and annotations</li>
                <li>Embedded fonts and images</li>
                <li>Geographic location data (in some cases)</li>
              </ul>
              <p>
                When you upload a PDF, this metadata travels with it. A service that 
                processes your file has access to all of this information, not just the 
                visible pages. For more on PDF structure, see{" "}
                <Link href="/pdf-tools/learn/how-pdfs-work" className="text-accent underline underline-offset-4 hover:text-accent/80">
                  How PDFs Work
                </Link>.
              </p>
            </section>

            {/* Compliance considerations */}
            <section>
              <h2 className="mb-4 text-xl font-semibold text-foreground">
                Compliance Considerations
              </h2>
              <p className="mb-4">
                For certain documents, uploading to third-party services may have legal 
                or contractual implications:
              </p>
              <ul className="mb-4 list-inside list-disc space-y-2 pl-2">
                <li>
                  <strong className="text-foreground">GDPR:</strong> Uploading documents 
                  containing personal data to servers outside your control may constitute 
                  data processing requiring explicit consent or a lawful basis
                </li>
                <li>
                  <strong className="text-foreground">HIPAA:</strong> Healthcare documents 
                  uploaded to non-compliant services may violate patient privacy regulations
                </li>
                <li>
                  <strong className="text-foreground">Confidentiality agreements:</strong> NDAs 
                  or client contracts may prohibit sharing documents with third parties
                </li>
                <li>
                  <strong className="text-foreground">Legal privilege:</strong> Uploading 
                  privileged legal documents could potentially waive protection
                </li>
              </ul>
              <p>
                These considerations don't mean uploading is always wrong—but they suggest 
                that the decision should be made consciously, particularly for sensitive 
                documents.
              </p>
            </section>

            {/* When uploads are unavoidable */}
            <section>
              <h2 className="mb-4 text-xl font-semibold text-foreground">
                When Uploads Are Unavoidable
              </h2>
              <p className="mb-4">
                Some PDF operations genuinely require server-side processing:
              </p>
              <ul className="mb-4 list-inside list-disc space-y-2 pl-2">
                <li>OCR (optical character recognition) often needs significant computing power</li>
                <li>Advanced format conversions may require specialized software</li>
                <li>Collaborative editing features require shared access</li>
                <li>Very large files may exceed browser processing capabilities</li>
              </ul>
              <p>
                When uploads are necessary, choosing a reputable service with clear 
                privacy policies, encryption in transit and at rest, and explicit 
                deletion guarantees reduces (but doesn't eliminate) risk.
              </p>
            </section>

            {/* When offline tools are safer */}
            <section>
              <h2 className="mb-4 text-xl font-semibold text-foreground">
                When Offline Tools Are Safer
              </h2>
              <p className="mb-4">
                For many common PDF operations, browser-based offline tools can perform 
                the same functions without uploading:
              </p>
              <ul className="mb-4 list-inside list-disc space-y-2 pl-2">
                <li>Merging multiple PDFs</li>
                <li>Splitting documents into separate pages</li>
                <li>Reordering pages</li>
                <li>Basic compression</li>
                <li>Extracting specific pages</li>
              </ul>
              <p className="mb-4">
                These operations can be performed entirely within your browser using 
                JavaScript and WebAssembly. The file never leaves your device, eliminating 
                transmission, storage, and retention risks entirely.
              </p>
              <p>
                For a detailed comparison, see{" "}
                <Link href="/pdf-tools/learn/online-vs-offline-pdf-tools" className="text-accent underline underline-offset-4 hover:text-accent/80">
                  Online vs Offline PDF Tools
                </Link>.
              </p>
            </section>
          </div>

          {/* Share */}
          <div className="mt-12 border-t border-white/[0.06] pt-8">
            <ArticleShareRow />
          </div>

          {/* Navigation */}
          <nav className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-between">
            <Link
              href="/pdf-tools/learn"
              className="text-[13px] text-muted-foreground transition-colors hover:text-foreground"
            >
              &larr; Back to Learning Center
            </Link>
            <Link
              href="/pdf-tools/tools"
              className="text-[13px] text-muted-foreground transition-colors hover:text-foreground"
            >
              View Tools &rarr;
            </Link>
          </nav>

          {/* Related articles */}
          <div className="mt-12 rounded-xl bg-[oklch(0.16_0.006_250)] p-6 ring-1 ring-accent/10">
            <p className="mb-4 text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">
              Related Articles
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <Link
                href="/pdf-tools/compare/offline-vs-online-pdf-tools"
                className="group rounded-lg bg-[oklch(0.19_0.01_250)] p-4 ring-1 ring-accent/10 transition-all duration-200 hover:ring-accent/25"
              >
                <p className="text-[13px] font-medium text-foreground group-hover:text-accent">
                  Offline vs Online Tools
                </p>
                <p className="mt-1 text-[12px] text-muted-foreground">
                  Compare processing approaches
                </p>
              </Link>
              <Link
                href="/pdf-tools/compare/plain-vs-ilovepdf"
                className="group rounded-lg bg-[oklch(0.19_0.01_250)] p-4 ring-1 ring-accent/10 transition-all duration-200 hover:ring-accent/25"
              >
                <p className="text-[13px] font-medium text-foreground group-hover:text-accent">
                  Plain vs iLovePDF
                </p>
                <p className="mt-1 text-[12px] text-muted-foreground">
                  Detailed tool comparison
                </p>
              </Link>
            </div>
          </div>
        </article>
      </main>
    </div>
  )
}



