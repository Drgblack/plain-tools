import { Metadata } from "next"
import Script from "next/script"
import Link from "next/link"
import { Header } from "@/components/legacy/header"
import { Footer } from "@/components/legacy/footer"
import { Clock, Calendar, ArrowLeft } from "lucide-react"

export const metadata: Metadata = {
  title: "What Happens When You Upload a PDF",
  description:
    "Plain explains what technically occurs when you upload a PDF to a website, including where files go and how long they are retained.",
  authors: [{ name: "Plain Editorial" }],
  openGraph: {
    type: "article",
    title: "What Happens When You Upload a PDF",
    description: "Plain explains what technically occurs when you upload a PDF to a website.",
    publishedTime: "2026-02-25T00:00:00Z",
    authors: ["Plain Editorial"],
  },
  twitter: {
    card: "summary_large_image",
    title: "What Happens When You Upload a PDF",
    description: "Plain explains what technically occurs when you upload a PDF to a website.",
    images: ["/og?title=What%20Happens%20When%20You%20Upload%20a%20PDF%3F&subtitle=Plain%20Blog&kind=blog"],
  },
}

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "What Happens When You Upload a PDF to a Website?",
  description:
    "A factual explanation of what technically occurs when you upload a PDF to a website, where files go, how long they are retained, and when uploading is appropriate or risky.",
  author: {
    "@type": "Person",
    name: "Plain Editorial",
  },
  publisher: {
    "@type": "Organization",
    name: "Plain",
  },
  datePublished: "2026-02-20",
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": "https://plain.tools/blog/what-happens-when-you-upload-a-pdf",
  },
}

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Do websites keep uploaded PDFs?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "It depends on the service. Some websites delete uploaded files immediately after processing, while others retain files for hours, days, or indefinitely. Retention policies vary widely and are not always clearly disclosed. Check the service's privacy policy for specific information about file retention.",
      },
    },
    {
      "@type": "Question",
      name: "Can uploaded PDFs be accessed by staff?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "In most cases, yes. Uploaded files typically reside on servers where staff with sufficient access privileges could potentially view them. Whether staff actually access user files depends on the company's policies, access controls, and operational practices. Services handling sensitive documents usually implement strict access controls and audit logging.",
      },
    },
  ],
}

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://plain.tools/" },
    { "@type": "ListItem", position: 2, name: "Blog", item: "https://plain.tools/blog" },
    {
      "@type": "ListItem",
      position: 3,
      name: "What Happens When You Upload a PDF to a Website?",
      item: "https://plain.tools/blog/what-happens-when-you-upload-a-pdf",
    },
  ],
}

export default function WhatHappensWhenYouUploadPDFPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Script
        id="article-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <Script
        id="faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Script
        id="breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Header />

      <main className="flex-1">
        <article className="px-4 py-16 md:py-24">
          <div className="mx-auto max-w-2xl">
            {/* Breadcrumb */}
            <nav className="mb-8">
              <Link
                href="/pdf-tools/blog"
                className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground/70 transition-colors hover:text-accent"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to Blog
              </Link>
            </nav>

            {/* Header */}
            <header className="mb-10">
              <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                What Happens When You Upload a PDF to a Website?
              </h1>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-[13px] text-muted-foreground/70">
                <span className="font-medium text-foreground/80">Plain Editorial</span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  February 20, 2026
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  7 min read
                </span>
              </div>
            </header>

            {/* Intro */}
            <p className="mb-8 text-[15px] leading-relaxed text-muted-foreground">
              When you use a website to merge, convert, or edit a PDF, the file typically leaves 
              your device and travels to a remote server. This article explains the technical 
              process, where your files end up, and when uploading makes sense versus when it 
              introduces unnecessary risk.
            </p>

            {/* In Simple Terms */}
            <div className="mb-12 rounded-xl border border-accent/15 bg-[oklch(0.155_0.006_250)] p-6">
              <h2 className="mb-3 text-[14px] font-semibold uppercase tracking-wider text-accent">
                In Simple Terms
              </h2>
              <p className="text-[14px] leading-relaxed text-foreground/80">
                Uploading a PDF means sending a copy of your file to someone else's computer. 
                That computer processes your file and sends back the result. Your original file 
                may be kept on their servers for minutes, hours, or longer—depending on their 
                policies and practices.
              </p>
            </div>

            {/* Main Content */}
            <div className="prose-custom space-y-10">
              {/* What uploading technically means */}
              <section>
                <h2 className="mb-4 text-xl font-semibold tracking-tight text-foreground">
                  What "uploading a file" technically means
                </h2>
                <p className="text-[15px] leading-relaxed text-muted-foreground">
                  When you select a file and click "upload" or "process," your browser reads the 
                  file from your device and transmits the data over the internet to a remote server. 
                  This transmission typically uses HTTPS, which encrypts the data during transit.
                </p>
                <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                  Once the data arrives at the server, it is written to storage—either temporarily 
                  in memory, on disk, or in a cloud storage system. The server then runs processing 
                  software on your file, generates the result, and makes it available for you to 
                  download.
                </p>
                <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                  The key point: during this process, your file exists on a computer you do not 
                  control, operated by people you do not know, under policies you may not have read.
                </p>
              </section>

              {/* Where uploaded PDFs usually go */}
              <section>
                <h2 className="mb-4 text-xl font-semibold tracking-tight text-foreground">
                  Where uploaded PDFs usually go
                </h2>
                <p className="text-[15px] leading-relaxed text-muted-foreground">
                  Uploaded files are typically stored in one of several locations:
                </p>
                <ul className="mt-4 space-y-2 text-[15px] leading-relaxed text-muted-foreground">
                  <li className="flex gap-3">
                    <span className="text-accent">•</span>
                    <span><strong className="text-foreground/90">Cloud storage services</strong> — AWS S3, Google Cloud Storage, or Azure Blob Storage</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-accent">•</span>
                    <span><strong className="text-foreground/90">Application servers</strong> — Local disk storage on the processing server</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-accent">•</span>
                    <span><strong className="text-foreground/90">Content delivery networks</strong> — Distributed caching systems for faster delivery</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-accent">•</span>
                    <span><strong className="text-foreground/90">Backup systems</strong> — Automated backups that may retain copies</span>
                  </li>
                </ul>
                <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                  The physical location of these servers varies. Many services use data centres in 
                  multiple countries, which can have implications for data protection regulations.
                </p>
              </section>

              {/* Retention */}
              <section>
                <h2 className="mb-4 text-xl font-semibold tracking-tight text-foreground">
                  How long uploaded files are often retained
                </h2>
                <p className="text-[15px] leading-relaxed text-muted-foreground">
                  Retention periods vary significantly between services:
                </p>
                <ul className="mt-4 space-y-2 text-[15px] leading-relaxed text-muted-foreground">
                  <li className="flex gap-3">
                    <span className="text-accent">•</span>
                    <span><strong className="text-foreground/90">Immediate deletion</strong> — Some services claim to delete files immediately after processing</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-accent">•</span>
                    <span><strong className="text-foreground/90">Hours to days</strong> — Many services retain files for 1–24 hours for "convenience"</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-accent">•</span>
                    <span><strong className="text-foreground/90">Indefinite</strong> — Some services retain files unless you explicitly delete them</span>
                  </li>
                </ul>
                <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                  Even when services promise quick deletion, backup systems and logging 
                  infrastructure may retain copies for longer periods. Verifying actual deletion 
                  is typically impossible for end users.
                </p>
              </section>

              {/* Access */}
              <section>
                <h2 className="mb-4 text-xl font-semibold tracking-tight text-foreground">
                  Who can access uploaded PDFs
                </h2>
                <p className="text-[15px] leading-relaxed text-muted-foreground">
                  Depending on the service's architecture and policies, uploaded files may be 
                  accessible to:
                </p>
                <ul className="mt-4 space-y-2 text-[15px] leading-relaxed text-muted-foreground">
                  <li className="flex gap-3">
                    <span className="text-accent">•</span>
                    <span><strong className="text-foreground/90">System administrators</strong> — Staff with server access privileges</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-accent">•</span>
                    <span><strong className="text-foreground/90">Support staff</strong> — Employees troubleshooting issues</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-accent">•</span>
                    <span><strong className="text-foreground/90">Cloud provider employees</strong> — Staff at the hosting company</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-accent">•</span>
                    <span><strong className="text-foreground/90">Third-party contractors</strong> — External parties with system access</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-accent">•</span>
                    <span><strong className="text-foreground/90">Automated systems</strong> — Machine learning training, analytics, or moderation systems</span>
                  </li>
                </ul>
                <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                  Reputable services implement access controls and audit logging. However, the 
                  technical capability for access typically exists even when policies prohibit it.
                </p>
              </section>

              {/* When uploading is reasonable */}
              <section>
                <h2 className="mb-4 text-xl font-semibold tracking-tight text-foreground">
                  When uploading a PDF is reasonable
                </h2>
                <p className="text-[15px] leading-relaxed text-muted-foreground">
                  Uploading files to a trusted service is appropriate in many situations:
                </p>
                <ul className="mt-4 space-y-2 text-[15px] leading-relaxed text-muted-foreground">
                  <li className="flex gap-3">
                    <span className="text-accent">•</span>
                    <span>The document contains no sensitive or personal information</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-accent">•</span>
                    <span>You need features that require server-side processing (OCR, advanced editing)</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-accent">•</span>
                    <span>The service has a clear privacy policy you have reviewed</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-accent">•</span>
                    <span>Your organisation has approved the service for your use case</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-accent">•</span>
                    <span>You are working with publicly available documents</span>
                  </li>
                </ul>
              </section>

              {/* When uploading is risky */}
              <section>
                <h2 className="mb-4 text-xl font-semibold tracking-tight text-foreground">
                  When uploading a PDF is risky
                </h2>
                <p className="text-[15px] leading-relaxed text-muted-foreground">
                  Consider alternatives to uploading when:
                </p>
                <ul className="mt-4 space-y-2 text-[15px] leading-relaxed text-muted-foreground">
                  <li className="flex gap-3">
                    <span className="text-accent">•</span>
                    <span>The PDF contains personal data (names, addresses, ID numbers)</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-accent">•</span>
                    <span>The document is confidential or commercially sensitive</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-accent">•</span>
                    <span>You are bound by compliance requirements (GDPR, HIPAA, legal privilege)</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-accent">•</span>
                    <span>The service's data handling policies are unclear</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-accent">•</span>
                    <span>You cannot verify where your data is being sent</span>
                  </li>
                </ul>
                <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                  For these situations, browser-based tools that process files locally—without 
                  uploading—eliminate server-side risks entirely. Learn more about{" "}
                  <Link href="/pdf-tools/learn/online-vs-offline-pdf-tools" className="text-accent underline underline-offset-4 transition-colors hover:text-accent/80">
                    online vs offline PDF tools
                  </Link>.
                </p>
              </section>

              {/* Conclusion */}
              <section className="border-t border-accent/10 pt-10">
                <h2 className="mb-4 text-xl font-semibold tracking-tight text-foreground">
                  Conclusion
                </h2>
                <p className="text-[15px] leading-relaxed text-muted-foreground">
                  Uploading a PDF is not inherently dangerous, but it does mean trusting a third 
                  party with your data. Understanding what happens during an upload helps you make 
                  informed decisions about which tools to use for different types of documents.
                </p>
                <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                  For sensitive files, consider tools that never require uploads. You can{" "}
                  <Link href="/pdf-tools/verify" className="text-accent underline underline-offset-4 transition-colors hover:text-accent/80">
                    verify these claims yourself
                  </Link>{" "}
                  using your browser's developer tools.
                </p>
              </section>

              {/* Related Reading */}
              <section className="border-t border-accent/10 pt-10">
                <h2 className="mb-6 text-lg font-semibold tracking-tight text-foreground">
                  Related reading
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Link
                    href="/pdf-tools/learn/online-vs-offline-pdf-tools"
                    className="group rounded-xl bg-[oklch(0.165_0.006_250)] p-5 ring-1 ring-accent/10 transition-all duration-200 hover:-translate-y-0.5 hover:ring-accent/25"
                  >
                    <h3 className="text-[14px] font-semibold text-foreground group-hover:text-accent">
                      Online vs Offline PDF Tools
                    </h3>
                    <p className="mt-1.5 text-[12px] leading-relaxed text-muted-foreground/80">
                      Compare browser-based and upload-based approaches
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
                      Privacy considerations for sensitive documents
                    </p>
                  </Link>
                  <Link
                    href="/pdf-tools/verify"
                    className="group rounded-xl bg-[oklch(0.165_0.006_250)] p-5 ring-1 ring-accent/10 transition-all duration-200 hover:-translate-y-0.5 hover:ring-accent/25"
                  >
                    <h3 className="text-[14px] font-semibold text-foreground group-hover:text-accent">
                      How to Verify Plain
                    </h3>
                    <p className="mt-1.5 text-[12px] leading-relaxed text-muted-foreground/80">
                      Check for yourself that files stay local
                    </p>
                  </Link>
                  <Link
                    href="/pdf-tools/tools/merge-pdf"
                    className="group rounded-xl bg-[oklch(0.165_0.006_250)] p-5 ring-1 ring-accent/10 transition-all duration-200 hover:-translate-y-0.5 hover:ring-accent/25"
                  >
                    <h3 className="text-[14px] font-semibold text-foreground group-hover:text-accent">
                      Merge PDFs Offline
                    </h3>
                    <p className="mt-1.5 text-[12px] leading-relaxed text-muted-foreground/80">
                      Try a tool that never uploads your files
                    </p>
                  </Link>
                </div>
              </section>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  )
}


