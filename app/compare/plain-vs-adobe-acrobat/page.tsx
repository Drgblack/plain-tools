import type { Metadata } from "next"
import Link from "next/link"
import Script from "next/script"

import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { serializeJsonLd } from "@/lib/sanitize"

const LAST_UPDATED = "March 3, 2026"
const PAGE_URL = "https://plain.tools/compare/plain-vs-adobe-acrobat"

export const metadata: Metadata = {
  title: "Plain vs Adobe Acrobat: A Privacy-First Adobe Acrobat Alternative",
  description:
    "Looking for an Adobe Acrobat alternative? Compare Plain vs Adobe Acrobat on privacy, upload requirements, offline capability, speed, and file-size limits.",
  keywords: [
    "adobe acrobat alternative",
    "adobe acrobat privacy",
    "pdf tools without adobe",
    "offline pdf tools",
    "no upload pdf tools",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
}

const faqItems = [
  {
    question: "Is there an Adobe Acrobat alternative that does not upload files?",
    answer:
      "Yes. Plain processes PDF operations in your browser so file bytes do not need to be uploaded for core tools like merge, split, and redact.",
  },
  {
    question: "Did Adobe change terms after AI-related concerns in 2024?",
    answer:
      "Yes. Adobe published clarification posts in June 2024 acknowledging concerns about Terms language and rolled out updated wording.",
  },
  {
    question: "Does Acrobat AI Assistant cost extra?",
    answer:
      "For individuals, Adobe announced AI Assistant as a paid add-on and also bundles AI capabilities in certain higher Acrobat plans.",
  },
  {
    question: "When should I choose Plain over Acrobat?",
    answer:
      "Choose Plain when your priority is local processing, no account setup, and verifiable zero-upload workflows for routine PDF operations.",
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
  headline: "Plain vs Adobe Acrobat",
  dateModified: "2026-03-03",
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": PAGE_URL,
  },
}

export default function PlainVsAdobeAcrobatPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Script
        id="plain-vs-adobe-article-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(articleJsonLd) }}
      />
      <Script
        id="plain-vs-adobe-faq-jsonld"
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
            <span className="text-foreground">Plain vs Adobe Acrobat</span>
          </nav>

          <header className="space-y-4">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              Last updated: {LAST_UPDATED}
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Plain vs Adobe Acrobat
            </h1>
            <p className="text-base leading-relaxed text-muted-foreground">
              Adobe faced public backlash in June 2024 over Terms wording tied to AI-era
              content usage, then published clarifications and updated terms language. If you
              are evaluating an <strong>Adobe Acrobat alternative</strong>, the practical
              question is simple: do you want cloud-first workflows or locally verifiable
              processing for everyday PDF tasks?
            </p>
          </header>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Feature comparison</h2>
            <div className="overflow-x-auto rounded-lg border border-white/[0.12]">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Adobe Acrobat</th>
                    <th className="px-4 py-3">Plain</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-white/[0.08]">
                    <td className="px-4 py-3 font-medium text-foreground">Pricing</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      Paid plans (Acrobat Standard/Pro/Studio); AI Assistant sold as add-on or
                      bundled in higher tiers.
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      Free, browser-based tools with no account required.
                    </td>
                  </tr>
                  <tr className="border-t border-white/[0.08] bg-muted/20">
                    <td className="px-4 py-3 font-medium text-foreground">Upload required</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      Adobe Document Cloud workflows involve server-side handling for uploaded
                      content.
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      Core PDF workflows run locally in browser memory.
                    </td>
                  </tr>
                  <tr className="border-t border-white/[0.08]">
                    <td className="px-4 py-3 font-medium text-foreground">Privacy model</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      Policy + account controls, with cloud infrastructure trust assumptions.
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      Architecture-first: verifiable no-upload behavior for local tools.
                    </td>
                  </tr>
                  <tr className="border-t border-white/[0.08] bg-muted/20">
                    <td className="px-4 py-3 font-medium text-foreground">Offline capability</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      Varies by product and plan; cloud features are internet-dependent.
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      Works offline after initial load for local operations.
                    </td>
                  </tr>
                  <tr className="border-t border-white/[0.08]">
                    <td className="px-4 py-3 font-medium text-foreground">Speed profile</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      Can be strong at scale, but cloud round-trips add latency.
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      No upload/download round-trip for local tasks.
                    </td>
                  </tr>
                  <tr className="border-t border-white/[0.08] bg-muted/20">
                    <td className="px-4 py-3 font-medium text-foreground">File-size limits</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      Depends on plan/workflow and cloud product constraints.
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      Limited mainly by your device memory and browser resources.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-xl border border-accent/25 bg-accent/10 p-5">
            <h2 className="text-lg font-semibold text-foreground">
              Looking for PDF tools without Adobe?
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              If your team prioritizes local execution and no account gates for common PDF
              workflows, Plain is a practical Adobe Acrobat alternative.
            </p>
            <div className="mt-4">
              <Button asChild className="w-full sm:w-auto">
                <Link href="/tools">Try Plain free — no account, no upload</Link>
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
                  href="https://blog.adobe.com/en/publish/2024/06/10/updating-adobes-terms-of-use"
                  className="text-accent hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Adobe Blog: Updating Adobe&apos;s Terms of Use (June 10, 2024)
                </a>
              </li>
              <li>
                <a
                  href="https://blog.adobe.com/en/publish/2024/06/06/clarification-adobe-terms-of-use"
                  className="text-accent hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Adobe Blog: A clarification on Adobe Terms of Use (June 6, 2024)
                </a>
              </li>
              <li>
                <a
                  href="https://www.computerworld.com/article/2145709/adobe-to-adapt-terms-of-service-on-genai-training-after-customer-backlash.html"
                  className="text-accent hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Computerworld: Adobe to adapt terms after customer backlash
                </a>
              </li>
              <li>
                <a
                  href="https://www.adobe.com/acrobat/pricing.html"
                  className="text-accent hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Adobe Acrobat pricing
                </a>
              </li>
              <li>
                <a
                  href="https://news.adobe.com/news/2025/02/acrobat-ai-assistant-contracts"
                  className="text-accent hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Adobe News: Acrobat AI Assistant contract features and add-on pricing
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
