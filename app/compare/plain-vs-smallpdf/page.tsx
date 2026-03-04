import type { Metadata } from "next"
import Link from "next/link"
import Script from "next/script"

import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { serializeJsonLd } from "@/lib/sanitize"

const LAST_UPDATED = "March 3, 2026"
const PAGE_URL = "https://plain.tools/compare/plain-vs-smallpdf"

export const metadata: Metadata = {
  title: "Plain vs Smallpdf: Best Smallpdf Alternative for Private PDF Work",
  description:
    "Compare Plain vs Smallpdf on privacy, uploads, large-file behavior, pricing, and offline capability. Find a Smallpdf alternative for local PDF processing.",
  keywords: [
    "smallpdf alternative",
    "smallpdf not working large files",
    "smallpdf privacy",
    "offline pdf tools",
    "no upload pdf tools",
  ],
  alternates: {
    canonical: PAGE_URL,
    languages: {
      en: PAGE_URL,
      de: PAGE_URL,
      "x-default": PAGE_URL,
    },
  },
}

const faqItems = [
  {
    question: "What is the best Smallpdf alternative for private documents?",
    answer:
      "If privacy is the top requirement, a local-first tool like Plain is often preferred because core workflows run in-browser without uploading file bytes.",
  },
  {
    question: "Why does Smallpdf struggle with some large files?",
    answer:
      "Smallpdf support content notes that large or complex files can fail processing and that upload conditions affect performance.",
  },
  {
    question: "Does Smallpdf upload files?",
    answer:
      "Yes. Smallpdf is cloud-based and requires file upload for processing workflows.",
  },
  {
    question: "Can I compress PDFs without uploading?",
    answer:
      "Yes. Plain provides client-side compression and preview workflows that execute locally.",
  },
]

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
}

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Plain vs Smallpdf",
  dateModified: "2026-03-03",
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": PAGE_URL,
  },
}

export default function PlainVsSmallpdfPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Script
        id="plain-vs-smallpdf-article-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(articleJsonLd) }}
      />
      <Script
        id="plain-vs-smallpdf-faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(faqJsonLd) }}
      />
      <Header />
      <main className="flex-1 px-4 py-14 sm:py-20">
        <article className="mx-auto max-w-4xl space-y-10">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>
            <span>/</span>
            <Link href="/compare" className="hover:text-foreground">
              Compare
            </Link>
            <span>/</span>
            <span className="text-foreground">Plain vs Smallpdf</span>
          </nav>

          <header className="space-y-4">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              Last updated: {LAST_UPDATED}
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Plain vs Smallpdf
            </h1>
            <p className="text-base leading-relaxed text-muted-foreground">
              Many searches for <strong>&ldquo;smallpdf not working large files&rdquo;</strong>{" "}
              relate to upload bottlenecks and file-processing limits. Smallpdf documents both
              upload-dependent workflows and file-size/complexity constraints. If you want a
              <strong> Smallpdf alternative</strong> focused on local speed and privacy, Plain is
              built differently.
            </p>
          </header>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Feature comparison</h2>
            <div className="overflow-x-auto rounded-lg border border-white/[0.12]">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Smallpdf</th>
                    <th className="px-4 py-3">Plain</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-white/[0.08]">
                    <td className="px-4 py-3 font-medium text-foreground">Pricing</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      Free tier with limits, plus Pro/business paid plans.
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      Free local tools, no account required.
                    </td>
                  </tr>
                  <tr className="border-t border-white/[0.08] bg-muted/20">
                    <td className="px-4 py-3 font-medium text-foreground">Upload required</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      Yes. Files are uploaded for cloud processing.
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      No upload for core PDF workflows.
                    </td>
                  </tr>
                  <tr className="border-t border-white/[0.08]">
                    <td className="px-4 py-3 font-medium text-foreground">Privacy model</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      Cloud policy controls, with temporary server storage model.
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      Local-by-default processing with verifiable network silence for file bytes.
                    </td>
                  </tr>
                  <tr className="border-t border-white/[0.08] bg-muted/20">
                    <td className="px-4 py-3 font-medium text-foreground">Offline capability</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      Internet required because processing is server-side.
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      Works offline after initial page load.
                    </td>
                  </tr>
                  <tr className="border-t border-white/[0.08]">
                    <td className="px-4 py-3 font-medium text-foreground">Speed profile</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      Depends on upload speed + server queue + download.
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      No upload latency for local operations.
                    </td>
                  </tr>
                  <tr className="border-t border-white/[0.08] bg-muted/20">
                    <td className="px-4 py-3 font-medium text-foreground">File-size limits</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      Large/complex files may fail in certain workflows.
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      Constrained mainly by your browser/device resources.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-xl border border-accent/25 bg-accent/10 p-5">
            <h2 className="text-lg font-semibold text-foreground">
              Need a Smallpdf alternative that stays local?
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Start with local compression and preview to avoid upload waiting time and reduce
              privacy exposure.
            </p>
            <div className="mt-4">
              <Button asChild className="w-full sm:w-auto">
                <Link href="/tools/batch-engine">Try Plain free — no account, no upload</Link>
              </Button>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">FAQ</h2>
            <div className="space-y-4">
              {faqItems.map((item) => (
                <div key={item.question} className="rounded-lg border border-white/[0.08] p-4">
                  <h3 className="font-medium text-foreground">{item.question}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{item.answer}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">Sources</h2>
            <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
              <li>
                <a
                  href="https://smallpdf.com/pricing"
                  className="text-accent hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Smallpdf pricing
                </a>
              </li>
              <li>
                <a
                  href="https://smallpdf.com/blog/how-to-compress-a-pdf-for-email"
                  className="text-accent hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Smallpdf blog: compression errors and large-file guidance
                </a>
              </li>
              <li>
                <a
                  href="https://smallpdf.com/blog/online-pdf-toolbox-vs-offline-pdf-software"
                  className="text-accent hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Smallpdf blog: online toolbox upload workflow
                </a>
              </li>
            </ul>
          </section>
        </article>
      </main>
      <Footer />
    </div>
  )
}
