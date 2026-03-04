import { Metadata } from "next"
import Link from "next/link"
import Script from "next/script"
import { ArticleShareRow } from "@/components/legacy/share-button"
import { ChevronRight } from "lucide-react"
import {
  generateTechArticleSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
  combineSchemas,
} from "@/lib/legacy/schema"

export const metadata: Metadata = {
  title: "Online vs Offline PDF Tools: What's the Difference?",
  description:
    "Understand the difference between browser-based offline PDF tools and traditional upload-based online tools. Learn about privacy, security, and when each type is appropriate.",
  openGraph: {
    title: "Online vs Offline PDF Tools - Plain",
    description: "Understand privacy and security differences between PDF tool types.",
  },
  alternates: {
    canonical: "https://plain.tools/learn/online-vs-offline-pdf-tools",
  },
}

// Article schema
const articleSchema = generateTechArticleSchema({
  title: "Online vs Offline PDF Tools: What's the Difference?",
  description:
    "Understand the difference between browser-based offline PDF tools and traditional upload-based online tools.",
  slug: "online-vs-offline-pdf-tools",
  datePublished: "2026-01-18",
  dateModified: "2026-02-27",
  proficiencyLevel: "Beginner",
})

// Breadcrumb schema
const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Online vs Offline PDF Tools", slug: "online-vs-offline-pdf-tools" },
])

// FAQ schema
const faqSchema = generateFAQSchema([
  {
    question: "What is the difference between online and offline PDF tools?",
    answer:
      "Online PDF tools upload your files to remote servers for processing. Offline (or client-side) PDF tools process files entirely in your browser without uploading them. The key difference is where your file data goes during processing.",
  },
  {
    question: "Are offline PDF tools as capable as online tools?",
    answer:
      "For common operations like merging, splitting, and compressing PDFs, yes. Modern browsers with WebAssembly can run sophisticated processing locally. Some advanced operations like AI-powered OCR may still benefit from server processing.",
  },
  {
    question: "How do I know if a tool is truly offline?",
    answer:
      "Open browser developer tools and watch the Network tab during file processing. Offline tools show no file uploads. You can also test by going offline after loading the page - genuine offline tools continue working.",
  },
  {
    question: "When should I use online vs offline PDF tools?",
    answer:
      "Use offline tools for sensitive documents where privacy matters. Online tools may be preferable for very large files, complex operations requiring server power, or when you need features not available client-side.",
  },
])

// Combine all schemas
const combinedSchema = combineSchemas([articleSchema, breadcrumbSchema, faqSchema])

export default function OnlineVsOfflinePdfToolsPage() {
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
          <nav className="mb-8 flex items-center gap-1.5 text-[12px] text-muted-foreground/70">
            <Link href="/pdf-tools/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/pdf-tools/learn" className="hover:text-foreground transition-colors">
              Learn
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground/80">Online vs Offline PDF Tools</span>
          </nav>

          {/* Header */}
          <header className="mb-12">
            <div className="mb-4 inline-flex items-center rounded-full bg-accent/10 px-3 py-1 text-[11px] font-medium text-accent ring-1 ring-accent/20">
              Privacy & Security
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Online vs Offline PDF Tools: What's the Difference?
            </h1>
            <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
              PDF tools generally fall into two categories: online tools that require uploading
              files to a server, and offline tools that process files entirely within your
              browser. Understanding the difference helps you make informed choices about
              how your documents are handled.
            </p>
          </header>

          {/* In Simple Terms box */}
          <div className="mb-12 rounded-xl bg-[oklch(0.17_0.008_250)] p-5 ring-1 ring-accent/15">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-accent">
              In Simple Terms
            </p>
            <p className="text-[14px] leading-relaxed text-foreground/90">
              Online PDF tools upload your files to a remote server for processing. Offline
              (client-side) PDF tools process your files directly in your browser—your
              documents never leave your device. Both approaches have valid use cases
              depending on your privacy requirements and the sensitivity of your documents.
            </p>
          </div>

          {/* Content */}
          <div className="prose-plain space-y-10">
            <section>
              <h2 className="mb-4 text-xl font-semibold tracking-tight text-foreground">
                What are online PDF tools?
              </h2>
              <p className="text-[14px] leading-relaxed text-muted-foreground">
                Online PDF tools are web applications that process your documents on a remote
                server. When you use these tools, your PDF is uploaded to the service's
                infrastructure, processed there, and then made available for download.
              </p>
              <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
                This approach allows the service to use powerful server-side software and
                handle large or complex files. Many popular PDF services—including those
                from Adobe and other providers—operate this way.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold tracking-tight text-foreground">
                What are offline (client-side) PDF tools?
              </h2>
              <p className="text-[14px] leading-relaxed text-muted-foreground">
                Offline PDF tools, sometimes called client-side or browser-based tools,
                process your documents entirely within your web browser. The PDF never
                leaves your device—all operations happen locally using JavaScript and
                WebAssembly technologies.
              </p>
              <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
                These tools load once in your browser and can often work without an internet
                connection after the initial page load.{" "}
                <Link href="/pdf-tools/" className="text-accent hover:underline">
                  Plain
                </Link>{" "}
                is an example of this approach.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold tracking-tight text-foreground">
                What happens when you upload a PDF
              </h2>
              <p className="text-[14px] leading-relaxed text-muted-foreground">
                When you upload a PDF to an online service, several things typically occur:
              </p>
              <ul className="mt-3 space-y-2 text-[14px] leading-relaxed text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent/60" />
                  <span>
                    Your file is transmitted over the internet to the service's servers
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent/60" />
                  <span>
                    The file is stored temporarily (or sometimes permanently) on their infrastructure
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent/60" />
                  <span>
                    Server-side software processes the document
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent/60" />
                  <span>
                    The processed file is transmitted back to you for download
                  </span>
                </li>
              </ul>
              <p className="mt-4 text-[14px] leading-relaxed text-muted-foreground">
                Reputable services encrypt data in transit and have deletion policies, but
                the fact remains that your document exists, however briefly, on infrastructure
                you don't control.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold tracking-tight text-foreground">
                Privacy and security considerations
              </h2>
              
              {/* Comparison table */}
              <div className="mt-4 overflow-hidden rounded-lg ring-1 ring-accent/10">
                <table className="w-full text-[13px]">
                  <thead>
                    <tr className="bg-[oklch(0.16_0.006_250)]">
                      <th className="px-4 py-3 text-left font-semibold text-foreground">Aspect</th>
                      <th className="px-4 py-3 text-left font-semibold text-foreground">Online Tools</th>
                      <th className="px-4 py-3 text-left font-semibold text-foreground">Offline Tools</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-accent/8">
                    <tr className="bg-[oklch(0.14_0.005_250)]">
                      <td className="px-4 py-3 font-medium text-foreground/90">File location</td>
                      <td className="px-4 py-3 text-muted-foreground">Uploaded to remote server</td>
                      <td className="px-4 py-3 text-muted-foreground">Stays on your device</td>
                    </tr>
                    <tr className="bg-[oklch(0.15_0.005_250)]">
                      <td className="px-4 py-3 font-medium text-foreground/90">Network required</td>
                      <td className="px-4 py-3 text-muted-foreground">Yes, for upload/download</td>
                      <td className="px-4 py-3 text-muted-foreground">Only for initial page load</td>
                    </tr>
                    <tr className="bg-[oklch(0.14_0.005_250)]">
                      <td className="px-4 py-3 font-medium text-foreground/90">Third-party access</td>
                      <td className="px-4 py-3 text-muted-foreground">Service has access to file</td>
                      <td className="px-4 py-3 text-muted-foreground">No third-party access</td>
                    </tr>
                    <tr className="bg-[oklch(0.15_0.005_250)]">
                      <td className="px-4 py-3 font-medium text-foreground/90">Verifiable</td>
                      <td className="px-4 py-3 text-muted-foreground">Trust-based</td>
                      <td className="px-4 py-3 text-muted-foreground">Inspectable via DevTools</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <p className="mt-4 text-[14px] leading-relaxed text-muted-foreground">
                Neither approach is inherently "better"—the right choice depends on your
                specific requirements, the sensitivity of your documents, and your
                organisation's policies.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold tracking-tight text-foreground">
                When offline tools matter
              </h2>
              <p className="text-[14px] leading-relaxed text-muted-foreground">
                Offline PDF tools are particularly relevant when:
              </p>
              <ul className="mt-3 space-y-2 text-[14px] leading-relaxed text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent/60" />
                  <span>
                    You're working with confidential, legal, medical, or financial documents
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent/60" />
                  <span>
                    Your organisation has data residency or compliance requirements
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent/60" />
                  <span>
                    You prefer not to create accounts or agree to third-party terms of service
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent/60" />
                  <span>
                    You want verifiable privacy that doesn't rely on trusting a service's claims
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent/60" />
                  <span>
                    You need to work in low-connectivity or offline environments
                  </span>
                </li>
              </ul>
              <p className="mt-4 text-[14px] leading-relaxed text-muted-foreground">
                <Link href="/pdf-tools/tools/merge-pdf" className="text-accent hover:underline">
                  Plain's Merge PDF tool
                </Link>{" "}
                is an example of an offline tool designed for these scenarios.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold tracking-tight text-foreground">
                When online tools are acceptable
              </h2>
              <p className="text-[14px] leading-relaxed text-muted-foreground">
                Online PDF tools may be appropriate when:
              </p>
              <ul className="mt-3 space-y-2 text-[14px] leading-relaxed text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent/60" />
                  <span>
                    The documents contain no sensitive or personal information
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent/60" />
                  <span>
                    You need advanced features that require server-side processing
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent/60" />
                  <span>
                    You're working with very large files that exceed browser memory limits
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent/60" />
                  <span>
                    The service has been vetted and approved by your organisation
                  </span>
                </li>
              </ul>
              <p className="mt-4 text-[14px] leading-relaxed text-muted-foreground">
                The key is making an informed decision based on the specific documents
                you're working with and your privacy requirements.
              </p>
            </section>
          </div>

          {/* Related links */}
          <div className="mt-16 border-t border-accent/10 pt-10">
            <h3 className="mb-4 text-[13px] font-semibold uppercase tracking-wider text-muted-foreground">
              Related Articles
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <Link
                href="/pdf-tools/compare/offline-vs-online-pdf-tools"
                className="group rounded-lg bg-[oklch(0.16_0.006_250)] p-4 ring-1 ring-accent/10 transition-all duration-200 hover:ring-accent/25"
              >
                <p className="text-[13px] font-medium text-foreground group-hover:text-accent transition-colors">
                  Detailed Comparison
                </p>
                <p className="mt-1 text-[12px] text-muted-foreground/70">
                  Offline vs online PDF tools side-by-side
                </p>
              </Link>
              <Link
                href="/pdf-tools/learn/how-plain-works"
                className="group rounded-lg bg-[oklch(0.16_0.006_250)] p-4 ring-1 ring-accent/10 transition-all duration-200 hover:ring-accent/25"
              >
                <p className="text-[13px] font-medium text-foreground group-hover:text-accent transition-colors">
                  How Plain Works
                </p>
                <p className="mt-1 text-[12px] text-muted-foreground/70">
                  Technical overview of client-side processing
                </p>
              </Link>
            </div>
            <p className="mt-4 text-center text-[12px] text-muted-foreground/70">
              Try offline processing: <Link href="/pdf-tools/tools/extract-pdf" className="text-accent hover:underline">Extract Pages</Link>, <Link href="/pdf-tools/tools/merge-pdf" className="text-accent hover:underline">Merge PDF</Link>, <Link href="/pdf-tools/tools/split-pdf" className="text-accent hover:underline">Split PDF</Link>
            </p>
          </div>

          {/* Share */}
          <div className="mt-12 border-t border-white/[0.06] pt-8">
            <ArticleShareRow />
          </div>

          {/* Back to learn */}
          <div className="mt-8">
            <Link
              href="/pdf-tools/learn"
              className="text-[13px] text-muted-foreground transition-colors hover:text-foreground"
            >
              &larr; Back to Learning Center
            </Link>
          </div>
        </article>
      </main>
    </div>
  )
}



