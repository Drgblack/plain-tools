import type { Metadata } from "next"
import Link from "next/link"
import Script from "next/script"
import { Header } from "@/components/legacy/header"
import { Footer } from "@/components/legacy/footer"
import { ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Offline vs Online PDF Tools - Plain",
  description: "A technical comparison of offline client-side PDF processing versus online server-based processing. Understand the architectural differences, privacy implications, and when each approach makes sense.",
  openGraph: {
    title: "Offline vs Online PDF Tools",
    description: "A technical comparison of offline client-side PDF processing versus online server-based processing.",
  },
}

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Offline vs Online PDF Tools",
  description: "A technical comparison of offline client-side PDF processing versus online server-based processing.",
  author: {
    "@type": "Organization",
    name: "Plain",
    url: "https://plain.tools",
  },
  publisher: {
    "@type": "Organization",
    name: "Plain",
    url: "https://plain.tools",
  },
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": "https://plain.tools/compare/offline-vs-online-pdf-tools",
  },
}

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://plain.tools/" },
    { "@type": "ListItem", position: 2, name: "Compare", item: "https://plain.tools/compare" },
    { "@type": "ListItem", position: 3, name: "Offline vs Online PDF Tools", item: "https://plain.tools/compare/offline-vs-online-pdf-tools" },
  ],
}

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Can PDFs be processed without uploading?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Offline PDF tools use client-side processing where all operations happen in your browser using technologies like WebAssembly. Files are read locally, processed locally, and the output is generated locally. No file data is transmitted over the internet.",
      },
    },
    {
      "@type": "Question",
      name: "Are offline tools more private?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Offline tools provide architectural privacy guarantees because files never leave your device. Online tools require trusting the provider's privacy policies and security practices since files are transmitted to and processed on their servers.",
      },
    },
    {
      "@type": "Question",
      name: "Do offline tools still use the internet?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Offline tools typically require an internet connection for the initial page load to download the application code. After that, PDF processing works without any network connection. You can verify this by disconnecting from the internet after the page loads.",
      },
    },
    {
      "@type": "Question",
      name: "What are the limitations of offline PDF processing?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Offline processing is limited by browser memory and device CPU power. Very large files may be slower to process or hit memory limits. Some advanced features like OCR typically require server-side processing due to computational requirements.",
      },
    },
    {
      "@type": "Question",
      name: "What are the limitations of online PDF processing?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Online processing requires a stable internet connection and involves upload/download time. Files leave your device, which may not be acceptable for sensitive documents. Free tiers often have daily limits or file size restrictions.",
      },
    },
  ],
}

export default function OfflineVsOnlinePage() {
  return (
    <>
      <Script
        id="article-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <Script
        id="breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Script
        id="faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Header />
      <main className="min-h-screen bg-background">
        <article className="mx-auto max-w-3xl px-4 py-16 md:py-24">
          {/* Breadcrumb */}
          <nav className="mb-8 flex items-center gap-2 text-[13px] text-muted-foreground">
            <Link href="/pdf-tools/" className="transition-colors hover:text-foreground">Home</Link>
            <span className="text-muted-foreground/50">/</span>
            <Link href="/pdf-tools/compare" className="transition-colors hover:text-foreground">Compare</Link>
            <span className="text-muted-foreground/50">/</span>
            <span className="text-foreground/70">Offline vs Online</span>
          </nav>

          <header>
            <h1 className="text-[28px] font-bold tracking-tight text-foreground md:text-[32px]">
              Offline vs Online PDF Tools
            </h1>
            <p className="mt-2 text-[15px] text-muted-foreground">
              Understanding the two architectural approaches to PDF processing
            </p>
          </header>

          {/* Intro */}
          <section className="mt-10">
            <p className="text-[15px] leading-[1.7] text-foreground/85">
              PDF tools generally fall into two categories based on where processing happens: 
              online tools that upload files to servers, and offline tools that process files 
              locally in your browser. Both approaches have legitimate use cases. This page 
              explains how each works and when one might be more appropriate than the other.
            </p>
          </section>

          {/* What online tools do */}
          <section className="mt-12">
            <h2 className="text-[18px] font-semibold text-foreground">
              What Online PDF Tools Do
            </h2>
            <div className="mt-4 rounded-lg bg-[oklch(0.15_0.005_250)] p-5 border border-white/[0.08]">
              <p className="text-[14px] leading-[1.7] text-muted-foreground">
                Online PDF tools use a server-based architecture. When you use these tools:
              </p>
              <ol className="mt-4 space-y-3 text-[14px] text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[oklch(0.12_0.003_250)] text-[11px] font-medium text-foreground/70">1</span>
                  <span>Your PDF file is uploaded to the provider's servers over the internet</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[oklch(0.12_0.003_250)] text-[11px] font-medium text-foreground/70">2</span>
                  <span>Processing happens on their infrastructure using server-side software</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[oklch(0.12_0.003_250)] text-[11px] font-medium text-foreground/70">3</span>
                  <span>The processed file is sent back to your browser for download</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[oklch(0.12_0.003_250)] text-[11px] font-medium text-foreground/70">4</span>
                  <span>Files are typically deleted from servers after a period (varies by provider)</span>
                </li>
              </ol>
            </div>
          </section>

          {/* What offline tools do */}
          <section className="mt-12">
            <h2 className="text-[18px] font-semibold text-foreground">
              What Offline PDF Tools Do
            </h2>
            <div className="mt-4 rounded-lg bg-[oklch(0.15_0.005_250)] p-5 border border-white/[0.08]">
              <p className="text-[14px] leading-[1.7] text-muted-foreground">
                Offline PDF tools use a client-side architecture. When you use these tools:
              </p>
              <ol className="mt-4 space-y-3 text-[14px] text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[oklch(0.12_0.003_250)] text-[11px] font-medium text-foreground/70">1</span>
                  <span>The web page loads processing code (often WebAssembly) into your browser</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[oklch(0.12_0.003_250)] text-[11px] font-medium text-foreground/70">2</span>
                  <span>Your PDF file is read directly by the browser from your device</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[oklch(0.12_0.003_250)] text-[11px] font-medium text-foreground/70">3</span>
                  <span>Processing happens locally using your device's CPU and memory</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[oklch(0.12_0.003_250)] text-[11px] font-medium text-foreground/70">4</span>
                  <span>The output file is generated locally and saved to your device</span>
                </li>
              </ol>
            </div>
          </section>

          {/* Privacy implications */}
          <section className="mt-12">
            <h2 className="text-[18px] font-semibold text-foreground">
              Privacy Implications
            </h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-lg bg-[oklch(0.15_0.005_250)] p-5 border border-white/[0.08]">
                <h3 className="text-[14px] font-semibold text-foreground">Online tools</h3>
                <ul className="mt-3 space-y-2 text-[13px] text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/50" />
                    <span>Files travel over the internet</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/50" />
                    <span>Processed on third-party infrastructure</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/50" />
                    <span>Privacy depends on provider policies</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/50" />
                    <span>May involve temporary storage, logging</span>
                  </li>
                </ul>
              </div>
              <div className="rounded-lg bg-[oklch(0.15_0.005_250)] p-5 border border-white/[0.08]">
                <h3 className="text-[14px] font-semibold text-foreground">Offline tools</h3>
                <ul className="mt-3 space-y-2 text-[13px] text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/50" />
                    <span>Files never leave your device</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/50" />
                    <span>No network transmission of file data</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/50" />
                    <span>Privacy is architecturally enforced</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/50" />
                    <span>Behavior can be independently verified</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Performance trade-offs */}
          <section className="mt-12">
            <h2 className="text-[18px] font-semibold text-foreground">
              Performance Trade-offs
            </h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-lg bg-[oklch(0.15_0.005_250)] p-5 border border-white/[0.08]">
                <h3 className="text-[14px] font-semibold text-foreground">Online tools</h3>
                <ul className="mt-3 space-y-2 text-[13px] text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/50" />
                    <span>More processing power available</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/50" />
                    <span>Can handle very large files</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/50" />
                    <span>Upload/download adds latency</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/50" />
                    <span>Requires stable internet connection</span>
                  </li>
                </ul>
              </div>
              <div className="rounded-lg bg-[oklch(0.15_0.005_250)] p-5 border border-white/[0.08]">
                <h3 className="text-[14px] font-semibold text-foreground">Offline tools</h3>
                <ul className="mt-3 space-y-2 text-[13px] text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/50" />
                    <span>No upload/download time</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/50" />
                    <span>Works without internet (after load)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/50" />
                    <span>Limited by device resources</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/50" />
                    <span>Large files may hit memory limits</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* When each makes sense */}
          <section className="mt-12">
            <h2 className="text-[18px] font-semibold text-foreground">
              When Each Model Makes Sense
            </h2>
            
            <div className="mt-6 space-y-6">
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">Online tools are appropriate when:</h3>
                <ul className="mt-3 space-y-2 text-[14px] text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent/50" />
                    <span>You need advanced features like OCR or complex format conversion</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent/50" />
                    <span>The documents being processed are not sensitive</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent/50" />
                    <span>You're working with very large files that exceed device memory</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent/50" />
                    <span>Cloud-based workflows and integrations are beneficial</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">Offline tools are appropriate when:</h3>
                <ul className="mt-3 space-y-2 text-[14px] text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent/50" />
                    <span>Documents contain sensitive, confidential, or regulated information</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent/50" />
                    <span>Your organization restricts uploading files to external servers</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent/50" />
                    <span>You need to work in offline or air-gapped environments</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent/50" />
                    <span>You want to independently verify the tool's behavior</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent/50" />
                    <span>You prefer tools with no accounts and no usage tracking</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Summary */}
          <section className="mt-12">
            <h2 className="text-[18px] font-semibold text-foreground">
              Summary
            </h2>
            <div className="mt-6 overflow-hidden rounded-lg border border-white/[0.10]">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="bg-[oklch(0.16_0.006_250)]">
                    <th className="py-3 px-4 text-left font-medium text-foreground">
                      Aspect
                    </th>
                    <th className="py-3 px-4 text-left font-medium text-foreground">
                      Online Tools
                    </th>
                    <th className="py-3 px-4 text-left font-medium text-foreground">
                      Offline Tools
                    </th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-t border-white/[0.06]">
                    <td className="py-3 px-4 font-medium text-foreground/80">Processing location</td>
                    <td className="py-3 px-4">Remote servers</td>
                    <td className="py-3 px-4">Your browser</td>
                  </tr>
                  <tr className="border-t border-white/[0.06] bg-[oklch(0.13_0.004_250)]">
                    <td className="py-3 px-4 font-medium text-foreground/80">File transmission</td>
                    <td className="py-3 px-4">Uploaded over internet</td>
                    <td className="py-3 px-4">Stays on device</td>
                  </tr>
                  <tr className="border-t border-white/[0.06]">
                    <td className="py-3 px-4 font-medium text-foreground/80">Internet required</td>
                    <td className="py-3 px-4">Yes, always</td>
                    <td className="py-3 px-4">Only for initial load</td>
                  </tr>
                  <tr className="border-t border-white/[0.06] bg-[oklch(0.13_0.004_250)]">
                    <td className="py-3 px-4 font-medium text-foreground/80">Privacy model</td>
                    <td className="py-3 px-4">Policy-based</td>
                    <td className="py-3 px-4">Architecture-based</td>
                  </tr>
                  <tr className="border-t border-white/[0.06]">
                    <td className="py-3 px-4 font-medium text-foreground/80">Large file handling</td>
                    <td className="py-3 px-4">Server resources</td>
                    <td className="py-3 px-4">Device-limited</td>
                  </tr>
                  <tr className="border-t border-white/[0.06] bg-[oklch(0.13_0.004_250)]">
                    <td className="py-3 px-4 font-medium text-foreground/80">Advanced features</td>
                    <td className="py-3 px-4">OCR, conversions</td>
                    <td className="py-3 px-4">Core operations</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Note */}
          <section className="mt-12">
            <div className="rounded-lg bg-[oklch(0.14_0.004_250)] p-5 border border-white/[0.08]">
              <p className="text-[13px] text-muted-foreground leading-[1.7]">
                <strong className="text-foreground/90">Note:</strong> The choice between online 
                and offline tools depends on your specific requirements. Neither approach is 
                inherently superior—they serve different needs and have different trade-offs.
              </p>
            </div>
          </section>

          {/* Related Links */}
          <section className="mt-12">
            <h2 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60 mb-4">
              Related
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <Link
                href="/pdf-tools/learn/online-vs-offline-pdf-tools"
                className="group flex items-center justify-between rounded-lg bg-[oklch(0.15_0.005_250)] p-4 border border-white/[0.08] transition-all hover:border-accent/30"
              >
                <span className="text-[13px] font-medium text-foreground group-hover:text-accent transition-colors">Deep Dive: Online vs Offline</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground/50 transition-all group-hover:text-accent group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/pdf-tools/tools/extract-pdf"
                className="group flex items-center justify-between rounded-lg bg-[oklch(0.15_0.005_250)] p-4 border border-white/[0.08] transition-all hover:border-accent/30"
              >
                <span className="text-[13px] font-medium text-foreground group-hover:text-accent transition-colors">Try Extract Pages</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground/50 transition-all group-hover:text-accent group-hover:translate-x-0.5" />
              </Link>
            </div>
            <p className="mt-4 text-center text-[12px] text-muted-foreground/60">
              Also: <Link href="/pdf-tools/tools/merge-pdf" className="text-accent/80 hover:text-accent hover:underline">Merge PDF</Link>, <Link href="/pdf-tools/tools/split-pdf" className="text-accent/80 hover:text-accent hover:underline">Split PDF</Link>
            </p>
          </section>

          {/* Back link */}
          <div className="mt-12 pt-8 border-t border-white/[0.06]">
            <Link 
              href="/pdf-tools/compare" 
              className="text-[13px] text-muted-foreground hover:text-foreground transition-colors"
            >
              &larr; All comparisons
            </Link>
          </div>
        </article>
      </main>
      <Footer />
    </>
  )
}


