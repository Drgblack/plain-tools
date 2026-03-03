import type { Metadata } from "next"
import Link from "next/link"
import Script from "next/script"

import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { serializeJsonLd } from "@/lib/sanitize"

const LAST_UPDATED = "March 3, 2026"
const PAGE_URL = "https://plain.tools/compare/plain-vs-ilovepdf"

export const metadata: Metadata = {
  title: "Plain vs iLovePDF: A Private iLovePDF Alternative",
  description:
    "Compare Plain vs iLovePDF on upload requirements, privacy controls, pricing model, performance, offline capability, and practical file-size limitations.",
  keywords: [
    "ilovepdf alternative",
    "ilovepdf privacy",
    "offline pdf tools",
    "no upload pdf tools",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
}

const faqItems = [
  {
    question: "Does iLovePDF upload my files?",
    answer:
      "Yes. iLovePDF states that uploaded files are stored on its servers for processing and removed after a retention window.",
  },
  {
    question: "What is a good iLovePDF alternative for sensitive files?",
    answer:
      "A local-first workflow like Plain is often chosen when teams want verifiable in-browser processing with no file upload.",
  },
  {
    question: "Is iLovePDF free?",
    answer:
      "iLovePDF has a free tier with usage limits and paid Premium/business plans for heavier workflows.",
  },
  {
    question: "Can I merge PDFs offline?",
    answer:
      "Yes. Plain can merge PDFs locally after the initial page load, including offline sessions.",
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
  headline: "Plain vs iLovePDF",
  dateModified: "2026-03-03",
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": PAGE_URL,
  },
}

export default function PlainVsILovePDFPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Script
        id="plain-vs-ilovepdf-article-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(articleJsonLd) }}
      />
      <Script
        id="plain-vs-ilovepdf-faq-jsonld"
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
            <span className="text-foreground">Plain vs iLovePDF</span>
          </nav>

          <header className="space-y-4">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              Last updated: {LAST_UPDATED}
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Plain vs iLovePDF
            </h1>
            <p className="text-base leading-relaxed text-muted-foreground">
              If you are researching an <strong>iLovePDF alternative</strong>, the core tradeoff
              is upload-based convenience versus local privacy guarantees. iLovePDF publishes a
              clear server-retention window for uploaded files, while Plain is designed around
              no-upload local execution for core tools.
            </p>
          </header>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Feature comparison</h2>
            <div className="overflow-x-auto rounded-lg border border-white/[0.12]">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">iLovePDF</th>
                    <th className="px-4 py-3">Plain</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-white/[0.08]">
                    <td className="px-4 py-3 font-medium text-foreground">Pricing</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      Free tier + Premium and Business subscription plans.
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      Free local tools, no account required.
                    </td>
                  </tr>
                  <tr className="border-t border-white/[0.08] bg-muted/20">
                    <td className="px-4 py-3 font-medium text-foreground">Upload required</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      Yes. Files are uploaded and temporarily stored on iLovePDF servers.
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      No upload for local workflows.
                    </td>
                  </tr>
                  <tr className="border-t border-white/[0.08]">
                    <td className="px-4 py-3 font-medium text-foreground">Privacy model</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      Server policy and retention controls.
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      Browser-local architecture with verifiable no-upload behavior.
                    </td>
                  </tr>
                  <tr className="border-t border-white/[0.08] bg-muted/20">
                    <td className="px-4 py-3 font-medium text-foreground">Offline capability</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      Internet required for web processing.
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      Works offline after initial load for supported tools.
                    </td>
                  </tr>
                  <tr className="border-t border-white/[0.08]">
                    <td className="px-4 py-3 font-medium text-foreground">Speed profile</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      Upload/download and network conditions strongly affect job time.
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      Local run time only; no upload round-trip.
                    </td>
                  </tr>
                  <tr className="border-t border-white/[0.08] bg-muted/20">
                    <td className="px-4 py-3 font-medium text-foreground">File-size limits</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      Depends on plan and cloud-side constraints.
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      Limited mainly by your own browser/device resources.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-xl border border-accent/25 bg-accent/10 p-5">
            <h2 className="text-lg font-semibold text-foreground">
              Need an iLovePDF alternative for offline work?
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Start with local merge/split workflows and verify network activity yourself in
              DevTools.
            </p>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <Button asChild className="w-full sm:w-auto">
                <Link href="/tools/merge-pdf">Try Plain free — no account, no upload</Link>
              </Button>
              <Button asChild variant="outline" className="w-full sm:w-auto">
                <Link href="/verify-claims">Verify zero-upload claims</Link>
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
                  href="https://www.ilovepdf.com/help/faq"
                  className="text-accent hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  iLovePDF FAQ (server retention and file handling)
                </a>
              </li>
              <li>
                <a
                  href="https://www.ilovepdf.com/pricing"
                  className="text-accent hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  iLovePDF pricing
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
