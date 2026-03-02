import { Metadata } from "next"
import Link from "next/link"
import Script from "next/script"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Plain vs iLovePDF: Offline vs Online PDF Processing",
  description: "A technical comparison of client-side offline PDF processing versus server-based online processing. Understand the architectural differences and privacy implications.",
  openGraph: {
    title: "Plain vs iLovePDF: Offline vs Online PDF Processing",
    description: "A technical comparison of client-side offline PDF processing versus server-based online processing.",
    images: [
      {
        url: "/og?title=Plain%20vs%20iLovePDF&subtitle=Client-side%20vs%20upload-based%20comparison&kind=compare",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Plain vs iLovePDF - Plain",
    description: "A factual comparison of offline client-side PDF tools vs upload-based online services.",
    images: ["/og?title=Plain%20vs%20iLovePDF&subtitle=Client-side%20vs%20upload-based%20comparison&kind=compare"],
  },
}

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Plain vs iLovePDF",
  description:
    "A factual comparison between Plain and iLovePDF focusing on architecture, privacy, and usage model.",
  author: {
    "@type": "Organization",
    name: "Plain",
  },
  publisher: {
    "@type": "Organization",
    name: "Plain",
  },
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": "https://plain.tools/compare/plain-vs-ilovepdf",
  },
}

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://plain.tools/" },
    { "@type": "ListItem", position: 2, name: "Compare", item: "https://plain.tools/compare" },
    { "@type": "ListItem", position: 3, name: "Plain vs iLovePDF", item: "https://plain.tools/compare/plain-vs-ilovepdf" },
  ],
}

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Does iLovePDF upload PDF files?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. iLovePDF uses a server-based architecture where PDF files are uploaded to their cloud infrastructure for processing. When you use iLovePDF, your file is transmitted over the internet to their servers, processed there, and the result is sent back to your browser.",
      },
    },
    {
      "@type": "Question",
      name: "Can PDFs be merged without uploading?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Tools like Plain use client-side processing where PDF merging happens entirely in your browser using WebAssembly. The files never leave your device. You can verify this by monitoring network activity or testing the tool offline.",
      },
    },
    {
      "@type": "Question",
      name: "Is offline PDF processing possible?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Client-side PDF tools like Plain work offline after the initial page load. All processing happens locally in your browser using WebAssembly, so no internet connection is needed during actual PDF operations.",
      },
    },
    {
      "@type": "Question",
      name: "When is upload-based PDF processing appropriate?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Upload-based processing is appropriate when you need advanced features like OCR or format conversion, when documents are not sensitive, and when cloud-based workflows are acceptable in your environment.",
      },
    },
    {
      "@type": "Question",
      name: "When is offline PDF processing appropriate?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Offline processing is appropriate when documents contain sensitive or confidential information, when your organization restricts uploading files to external servers, when you need to work in air-gapped environments, or when you want to verify tool behavior independently.",
      },
    },
  ],
}

export default function PlainVsILovePDFComparePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
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
      <main className="flex-1">
        <article className="px-4 py-20">
          <div className="mx-auto max-w-2xl">
            {/* Breadcrumb */}
            <nav className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-foreground transition-colors">
                Home
              </Link>
              <span>/</span>
              <Link href="/compare" className="hover:text-foreground transition-colors">
                Compare
              </Link>
              <span>/</span>
              <span className="text-foreground">Plain vs iLovePDF</span>
            </nav>

            <h1 className="text-[28px] font-bold tracking-tight text-foreground md:text-[32px]">
              Plain vs iLovePDF
            </h1>
            <p className="mt-2 text-[15px] text-muted-foreground">
              Offline vs Online PDF Processing
            </p>

            {/* Intro */}
            <section className="mt-10">
              <h2 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                Overview
              </h2>
              <p className="mt-3 text-[15px] leading-[1.7] text-foreground/85">
                Both Plain and iLovePDF help users work with PDFs, but they use fundamentally 
                different processing models. iLovePDF uses upload-based processing where files 
                are sent to remote servers. Plain processes PDFs locally in your browser. This 
                page explains what these differences mean in practice.
              </p>
            </section>

            {/* How each tool processes PDFs */}
            <section className="mt-12">
              <h2 className="text-[18px] font-semibold text-foreground">
                How Each Tool Processes PDFs
              </h2>
              
              <div className="mt-6 space-y-6">
                <div className="rounded-lg bg-[oklch(0.15_0.005_250)] p-5 border border-white/[0.08]">
                  <h3 className="text-[14px] font-semibold text-foreground">iLovePDF</h3>
                  <p className="mt-2 text-[14px] leading-[1.7] text-muted-foreground">
                    iLovePDF uses a server-based architecture. When you use their tools, your PDF 
                    files are uploaded to their cloud infrastructure where processing occurs. The 
                    processed files are then sent back to your browser for download. This requires 
                    an active internet connection throughout the process.
                  </p>
                </div>
                
                <div className="rounded-lg bg-[oklch(0.15_0.005_250)] p-5 border border-white/[0.08]">
                  <h3 className="text-[14px] font-semibold text-foreground">Plain</h3>
                  <p className="mt-2 text-[14px] leading-[1.7] text-muted-foreground">
                    Plain uses a client-side architecture. PDF processing happens entirely within 
                    your browser using WebAssembly. Files are never uploaded to any server. Once 
                    the page loads, processing works offline. You can verify this by monitoring 
                    network activity or disconnecting from the internet.
                  </p>
                </div>
              </div>
            </section>

            {/* Privacy implications */}
            <section className="mt-12">
              <h2 className="text-[18px] font-semibold text-foreground">
                Privacy Implications
              </h2>
              <div className="mt-4 text-[14px] leading-[1.7] text-muted-foreground space-y-4">
                <p>
                  <strong className="text-foreground/90">Server-based processing:</strong> Files 
                  travel over the internet and are processed on third-party infrastructure. This 
                  may involve temporary storage, logging, and potential access by service operators. 
                  Users must trust the provider's privacy policies and security practices.
                </p>
                <p>
                  <strong className="text-foreground/90">Client-side processing:</strong> Files 
                  remain on the user's device throughout the entire process. No network transmission 
                  of file data occurs. Privacy is architecturally enforced rather than policy-based. 
                  Users can independently verify this behavior.
                </p>
              </div>
            </section>

            {/* Tradeoffs */}
            <section className="mt-12">
              <h2 className="text-[18px] font-semibold text-foreground">
                Offline vs Server-Based Tradeoffs
              </h2>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-lg bg-[oklch(0.15_0.005_250)] p-5 border border-white/[0.08]">
                  <h3 className="text-[13px] font-semibold text-foreground mb-3">Server-based advantages</h3>
                  <ul className="space-y-2 text-[13px] text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/50" />
                      <span>More processing power for complex operations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/50" />
                      <span>Can handle very large files</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/50" />
                      <span>Advanced features like OCR</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/50" />
                      <span>Cross-device workflows</span>
                    </li>
                  </ul>
                </div>
                <div className="rounded-lg bg-[oklch(0.15_0.005_250)] p-5 border border-white/[0.08]">
                  <h3 className="text-[13px] font-semibold text-foreground mb-3">Client-side advantages</h3>
                  <ul className="space-y-2 text-[13px] text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/50" />
                      <span>Complete data privacy</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/50" />
                      <span>Works offline</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/50" />
                      <span>No account required</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/50" />
                      <span>Verifiable behavior</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* When each makes sense */}
            <section className="mt-12">
              <h2 className="text-[18px] font-semibold text-foreground">
                When Each Approach Makes Sense
              </h2>
              
              <div className="mt-6 space-y-6">
                <div>
                  <h3 className="text-[14px] font-semibold text-foreground">Server-based tools are appropriate when:</h3>
                  <ul className="mt-3 space-y-2 text-[14px] text-muted-foreground">
                    <li className="flex items-start gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent/50" />
                      <span>You need advanced features like OCR or format conversion</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent/50" />
                      <span>Documents are not sensitive or confidential</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent/50" />
                      <span>Cloud-based workflows are acceptable in your environment</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-[14px] font-semibold text-foreground">Client-side tools are appropriate when:</h3>
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
                      <span>You need to work offline or in air-gapped environments</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent/50" />
                      <span>You want to verify tool behavior independently</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Summary table */}
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
                        iLovePDF
                      </th>
                      <th className="py-3 px-4 text-left font-medium text-foreground">
                        Plain
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    <tr className="border-t border-white/[0.06]">
                      <td className="py-3 px-4 font-medium text-foreground/80">Architecture</td>
                      <td className="py-3 px-4">Server-based</td>
                      <td className="py-3 px-4">Client-side</td>
                    </tr>
                    <tr className="border-t border-white/[0.06] bg-[oklch(0.13_0.004_250)]">
                      <td className="py-3 px-4 font-medium text-foreground/80">File handling</td>
                      <td className="py-3 px-4">Uploaded to servers</td>
                      <td className="py-3 px-4">Stays on device</td>
                    </tr>
                    <tr className="border-t border-white/[0.06]">
                      <td className="py-3 px-4 font-medium text-foreground/80">Internet required</td>
                      <td className="py-3 px-4">Yes, always</td>
                      <td className="py-3 px-4">Only for initial load</td>
                    </tr>
                    <tr className="border-t border-white/[0.06] bg-[oklch(0.13_0.004_250)]">
                      <td className="py-3 px-4 font-medium text-foreground/80">Account required</td>
                      <td className="py-3 px-4">Optional/varies</td>
                      <td className="py-3 px-4">No</td>
                    </tr>
                    <tr className="border-t border-white/[0.06]">
                      <td className="py-3 px-4 font-medium text-foreground/80">Verifiable privacy</td>
                      <td className="py-3 px-4">Policy-based</td>
                      <td className="py-3 px-4">Architecturally enforced</td>
                    </tr>
                    <tr className="border-t border-white/[0.06] bg-[oklch(0.13_0.004_250)]">
                      <td className="py-3 px-4 font-medium text-foreground/80">Feature range</td>
                      <td className="py-3 px-4">Extensive</td>
                      <td className="py-3 px-4">Core PDF operations</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Note */}
            <section className="mt-12">
              <div className="rounded-lg bg-[oklch(0.14_0.004_250)] p-5 border border-white/[0.08]">
                <p className="text-[13px] text-muted-foreground leading-[1.7]">
                  <strong className="text-foreground/90">Note:</strong> This comparison is based on
                  observable architectural differences. iLovePDF has its own privacy policies
                  and security measures. Users should review the terms of service for any tool they use.
                </p>
              </div>
            </section>

            {/* Related Links */}
            <section className="mt-12">
              <h2 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60 mb-4">
                Related reading
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                <Link
                  href="/learn/online-vs-offline-pdf-tools"
                  className="group rounded-lg bg-[oklch(0.15_0.005_250)] p-4 border border-white/[0.08] transition-all hover:border-accent/30"
                >
                  <span className="text-[13px] font-medium text-foreground group-hover:text-accent transition-colors">Online vs Offline Tools</span>
                </Link>
                <Link
                  href="/verify"
                  className="group rounded-lg bg-[oklch(0.15_0.005_250)] p-4 border border-white/[0.08] transition-all hover:border-accent/30"
                >
                  <span className="text-[13px] font-medium text-foreground group-hover:text-accent transition-colors">Verify Offline Processing</span>
                </Link>
              </div>
            </section>

            {/* Back link */}
            <div className="mt-12 pt-8 border-t border-white/[0.06]">
              <Link 
                href="/compare" 
                className="text-[13px] text-muted-foreground hover:text-foreground transition-colors"
              >
                &larr; All comparisons
              </Link>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  )
}
