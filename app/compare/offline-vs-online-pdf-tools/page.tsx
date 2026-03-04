import type { Metadata } from "next"
import Link from "next/link"
import Script from "next/script"

import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { serializeJsonLd } from "@/lib/sanitize"

const LAST_UPDATED = "March 3, 2026"
const PAGE_URL = "https://plain.tools/compare/offline-vs-online-pdf-tools"

export const metadata: Metadata = {
  title: "Offline vs Online PDF Tools: Privacy, Speed, and Cost Comparison",
  description:
    "Deep comparison of offline vs online PDF tools covering architecture, upload risk, latency, compliance impact, and when each model is the better choice.",
  keywords: [
    "offline vs online pdf tools",
    "offline pdf tools",
    "online pdf tools comparison",
    "local pdf processing",
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
    question: "Are offline PDF tools always more private?",
    answer:
      "For file-transit risk, yes: offline/local tools avoid cloud transfer by design. You should still evaluate device security and browser hygiene.",
  },
  {
    question: "When do online PDF tools make more sense?",
    answer:
      "Online tools are often better for managed enterprise workflows, collaborative signing, and features tightly integrated with cloud ecosystems.",
  },
  {
    question: "Can offline PDF tools handle large files?",
    answer:
      "They can, but practical limits depend on your device memory and browser constraints. Cloud tools may handle larger files by shifting work to servers.",
  },
  {
    question: "How do I verify whether a tool uploads files?",
    answer:
      "Use browser DevTools Network tab (Fetch/XHR filter) while processing a document. Verify whether file bytes are sent to remote endpoints.",
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
  headline: "Offline vs Online PDF Tools",
  dateModified: "2026-03-03",
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": PAGE_URL,
  },
}

export default function OfflineVsOnlinePdfToolsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Script
        id="offline-vs-online-article-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(articleJsonLd) }}
      />
      <Script
        id="offline-vs-online-faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(faqJsonLd) }}
      />
      <Header />
      <main className="flex-1 px-4 py-14 sm:py-20">
        <article className="mx-auto max-w-5xl space-y-10">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>
            <span>/</span>
            <Link href="/compare" className="hover:text-foreground">
              Compare
            </Link>
            <span>/</span>
            <span className="text-foreground">Offline vs Online PDF Tools</span>
          </nav>

          <header className="space-y-4">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              Last updated: {LAST_UPDATED}
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Offline vs Online PDF Tools
            </h1>
            <p className="text-base leading-relaxed text-muted-foreground">
              The real difference is architecture. Online tools process files on remote servers.
              Offline tools process files in your browser or local runtime. That one choice affects
              privacy, performance, compliance posture, and operating cost.
            </p>
          </header>

          <section className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-white/[0.08] bg-muted/20 p-5">
              <h2 className="text-lg font-semibold text-foreground">Online model</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Upload document, process remotely, download result. Best for centralized cloud
                operations, but introduces transfer risk and policy dependencies.
              </p>
            </div>
            <div className="rounded-lg border border-white/[0.08] bg-muted/20 p-5">
              <h2 className="text-lg font-semibold text-foreground">Offline model</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Load app once, process locally, export locally. Best when privacy and data locality
                are primary requirements.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Comprehensive comparison table</h2>
            <div className="overflow-x-auto rounded-lg border border-white/[0.12]">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="px-4 py-3">Dimension</th>
                    <th className="px-4 py-3">Online/server PDF tools</th>
                    <th className="px-4 py-3">Offline/local PDF tools</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-white/[0.08]">
                    <td className="px-4 py-3 font-medium text-foreground">File path</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      File bytes leave device and travel to third-party infrastructure.
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      File bytes remain local on your device during processing.
                    </td>
                  </tr>
                  <tr className="border-t border-white/[0.08] bg-muted/20">
                    <td className="px-4 py-3 font-medium text-foreground">Privacy controls</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      Provider policy and contractual controls.
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      Architectural control plus local endpoint security.
                    </td>
                  </tr>
                  <tr className="border-t border-white/[0.08]">
                    <td className="px-4 py-3 font-medium text-foreground">Network dependency</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      Continuous connection required.
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      Usually works offline after initial load.
                    </td>
                  </tr>
                  <tr className="border-t border-white/[0.08] bg-muted/20">
                    <td className="px-4 py-3 font-medium text-foreground">Latency</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      Upload + queue + processing + download.
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      Local processing only.
                    </td>
                  </tr>
                  <tr className="border-t border-white/[0.08]">
                    <td className="px-4 py-3 font-medium text-foreground">Large-file handling</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      Often better at extreme sizes due server resources.
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      Limited by local CPU/RAM/browser constraints.
                    </td>
                  </tr>
                  <tr className="border-t border-white/[0.08] bg-muted/20">
                    <td className="px-4 py-3 font-medium text-foreground">Compliance fit</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      Works where cloud transfer is permitted by policy.
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      Useful where data residency or no-upload policy is strict.
                    </td>
                  </tr>
                  <tr className="border-t border-white/[0.08]">
                    <td className="px-4 py-3 font-medium text-foreground">Account model</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      Often account/subscription centered.
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      Can be account-free for core workflows.
                    </td>
                  </tr>
                  <tr className="border-t border-white/[0.08] bg-muted/20">
                    <td className="px-4 py-3 font-medium text-foreground">Verification</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      Requires trust in provider statements and reports.
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      Can be tested directly in DevTools network inspector.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-white/[0.08] p-5">
              <h2 className="text-lg font-semibold text-foreground">When online wins</h2>
              <ul className="mt-3 list-disc space-y-2 ps-5 text-sm text-muted-foreground">
                <li>Deep enterprise workflow orchestration and approvals</li>
                <li>Very large documents that exceed local resource budgets</li>
                <li>Cloud-native collaboration requirements</li>
              </ul>
            </div>
            <div className="rounded-lg border border-white/[0.08] p-5">
              <h2 className="text-lg font-semibold text-foreground">When offline wins</h2>
              <ul className="mt-3 list-disc space-y-2 ps-5 text-sm text-muted-foreground">
                <li>Sensitive or regulated files that should not leave endpoint</li>
                <li>Air-gapped or weak-connectivity environments</li>
                <li>Teams wanting transparent, testable no-upload behavior</li>
              </ul>
            </div>
          </section>

          <section className="rounded-xl border border-accent/25 bg-accent/10 p-5">
            <h2 className="text-lg font-semibold text-foreground">Clear next step</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Run a local workflow and verify it yourself in under two minutes.
            </p>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <Button asChild className="w-full sm:w-auto">
                <Link href="/tools/merge-pdf">Try Plain free — no account, no upload</Link>
              </Button>
              <Button asChild variant="outline" className="w-full sm:w-auto">
                <Link href="/verify-claims">Run the verification checklist</Link>
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
        </article>
      </main>
      <Footer />
    </div>
  )
}
