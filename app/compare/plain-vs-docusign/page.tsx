import type { Metadata } from "next"
import Link from "next/link"
import Script from "next/script"

import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { serializeJsonLd } from "@/lib/sanitize"

const LAST_UPDATED = "March 3, 2026"
const PAGE_URL = "https://plain.tools/compare/plain-vs-docusign"

export const metadata: Metadata = {
  title: "Plain vs DocuSign: Local PDF Signing Alternative",
  description:
    "Compare Plain vs DocuSign for privacy-focused signing workflows across data handling, AI policy controls, offline capability, verification, and pricing.",
  keywords: [
    "docusign alternative",
    "docusign privacy concerns",
    "local pdf signing",
    "offline signing tool",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
}

const faqItems = [
  {
    question: "What is a privacy-focused DocuSign alternative?",
    answer:
      "For local, no-upload PDF preparation and signing workflows, Plain offers a browser-local signing tool for cryptographic and visual signatures.",
  },
  {
    question: "Did DocuSign publish AI data-use disclosures?",
    answer:
      "Yes. DocuSign documents how de-identified customer data may be used for AI model development with consent controls and governance statements.",
  },
  {
    question: "Can I sign PDFs without creating an account?",
    answer:
      "With Plain, yes for local signing workflows. DocuSign generally centers on managed account and envelope workflows.",
  },
  {
    question: "Is local PDF signing legally equivalent to managed e-signature platforms?",
    answer:
      "Not always. Local signing can provide technical integrity checks, while legal and regulatory requirements may still require a qualified trust workflow depending on jurisdiction.",
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
  headline: "Plain vs DocuSign",
  dateModified: "2026-03-03",
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": PAGE_URL,
  },
}

export default function PlainVsDocusignPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Script
        id="plain-vs-docusign-article-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(articleJsonLd) }}
      />
      <Script
        id="plain-vs-docusign-faq-jsonld"
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
            <span className="text-foreground">Plain vs DocuSign</span>
          </nav>

          <header className="space-y-4">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              Last updated: {LAST_UPDATED}
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Plain vs DocuSign
            </h1>
            <p className="text-base leading-relaxed text-muted-foreground">
              DocuSign remains a dominant managed e-signature platform, but AI-era disclosures on
              data use have raised new user questions about what is used for model improvement and
              under what consent controls. If you want a <strong>DocuSign alternative</strong> for
              local PDF signing prep, Plain focuses on browser-local workflows first.
            </p>
          </header>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Feature comparison (signing focus)</h2>
            <div className="overflow-x-auto rounded-lg border border-white/[0.12]">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">DocuSign</th>
                    <th className="px-4 py-3">Plain</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-white/[0.08]">
                    <td className="px-4 py-3 font-medium text-foreground">Pricing</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      Paid subscription plans for eSignature workflows.
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      Free local signer and PDF tools.
                    </td>
                  </tr>
                  <tr className="border-t border-white/[0.08] bg-muted/20">
                    <td className="px-4 py-3 font-medium text-foreground">Upload required</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      Yes. Envelope and signing flows are cloud-based.
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      Local signing and document prep can run in browser memory.
                    </td>
                  </tr>
                  <tr className="border-t border-white/[0.08]">
                    <td className="px-4 py-3 font-medium text-foreground">Privacy model</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      Enterprise policy controls + documented AI consent mechanisms.
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      Local processing architecture for no-upload signing prep.
                    </td>
                  </tr>
                  <tr className="border-t border-white/[0.08] bg-muted/20">
                    <td className="px-4 py-3 font-medium text-foreground">Offline capability</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      Core signing orchestration requires network access.
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      Local signer can operate offline after initial page load.
                    </td>
                  </tr>
                  <tr className="border-t border-white/[0.08]">
                    <td className="px-4 py-3 font-medium text-foreground">Speed profile</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      Strong collaboration/orchestration, but depends on cloud round-trips.
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      Immediate local execution for individual document workflows.
                    </td>
                  </tr>
                  <tr className="border-t border-white/[0.08] bg-muted/20">
                    <td className="px-4 py-3 font-medium text-foreground">File-size limits</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      Plan and platform limits apply for envelope/document handling.
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      Constrained mainly by browser/device limits.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-xl border border-accent/25 bg-accent/10 p-5">
            <h2 className="text-lg font-semibold text-foreground">Need local PDF signing?</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Use Plain&apos;s local signer when you need browser-local cryptographic signing prep
              and no mandatory account flow.
            </p>
            <div className="mt-4">
              <Button asChild className="w-full sm:w-auto">
                <Link href="/tools/local-signer">Try Plain free — no account, no upload</Link>
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
                  href="https://www.docusign.com/products-and-pricing/esignature"
                  className="text-accent hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  DocuSign eSignature pricing
                </a>
              </li>
              <li>
                <a
                  href="https://www.docusign.com/trust/privacy/ai-privacy-transparency"
                  className="text-accent hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  DocuSign AI privacy and transparency
                </a>
              </li>
              <li>
                <a
                  href="https://www.docusign.com/blog/control-is-your-hands-ai-evolves"
                  className="text-accent hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  DocuSign blog: customer control as AI capabilities evolve
                </a>
              </li>
              <li>
                <a
                  href="https://community.docusign.com/clm-112/is-docusign-training-its-ai-services-on-contracts-i-upload-to-docusign-for-signature-2733"
                  className="text-accent hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  DocuSign Community discussion on AI training questions
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
