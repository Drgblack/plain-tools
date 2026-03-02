import { Metadata } from "next"
import Link from "next/link"
import Script from "next/script"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Plain vs Sejda: Free Limits vs Unlimited Local Processing",
  description: "A technical comparison of Sejda's free-tier limits and online editing versus Plain's unlimited local PDF processing. Understand daily task limits versus offline execution.",
  openGraph: {
    title: "Plain vs Sejda: Free Limits vs Unlimited Local Processing",
    description: "A technical comparison of free-tier limits versus unlimited local PDF processing.",
    images: [
      {
        url: "/og?title=Plain%20vs%20Sejda&subtitle=Free%20limits%20vs%20local%20processing&kind=compare",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Plain vs Sejda - Plain",
    description: "A factual comparison of Sejda's online PDF tools vs Plain's offline processing.",
    images: ["/og?title=Plain%20vs%20Sejda&subtitle=Free%20limits%20vs%20local%20processing&kind=compare"],
  },
}

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Plain vs Sejda: Free Limits vs Unlimited Local Processing",
  description:
    "A factual comparison between Plain and Sejda focusing on free-tier limits, online editing, and offline processing.",
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
    "@id": "https://plain.tools/compare/plain-vs-sejda",
  },
}

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://plain.tools/" },
    { "@type": "ListItem", position: 2, name: "Compare", item: "https://plain.tools/compare" },
    { "@type": "ListItem", position: 3, name: "Plain vs Sejda", item: "https://plain.tools/compare/plain-vs-sejda" },
  ],
}

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Does Sejda upload files?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Sejda's online tools upload PDF files to their servers for processing. They state that files are automatically deleted after 2 hours. They also offer a desktop application that processes files locally.",
      },
    },
    {
      "@type": "Question",
      name: "Are there limits on Sejda's free usage?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Sejda's free tier has several limits: 3 tasks per hour, maximum 200 pages per document, maximum 50 MB file size, and limited batch processing. These limits reset hourly for online tools.",
      },
    },
    {
      "@type": "Question",
      name: "When does offline PDF processing matter?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Offline processing matters when handling sensitive documents that shouldn't leave your device, when working in air-gapped or restricted network environments, when you need to process files without usage limits, or when you want to verify that files aren't being transmitted.",
      },
    },
    {
      "@type": "Question",
      name: "Does Plain have usage limits?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Plain has no daily task limits, no hourly restrictions, and no page count limits. Processing is limited only by your device's memory and CPU capabilities since all operations happen locally in your browser.",
      },
    },
    {
      "@type": "Question",
      name: "Can Sejda work offline?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sejda's web tools require an internet connection. They offer a paid desktop application (Sejda Desktop) that can work offline, but the free online version requires uploading files to their servers.",
      },
    },
  ],
}

export default function PlainVsSejdaComparePage() {
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
              <span className="text-foreground">Plain vs Sejda</span>
            </nav>

            <h1 className="text-[28px] font-bold tracking-tight text-foreground md:text-[32px]">
              Plain vs Sejda
            </h1>
            <p className="mt-2 text-[15px] text-muted-foreground">
              Free Limits vs Unlimited Local Processing
            </p>

            {/* Intro */}
            <section className="mt-10">
              <h2 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                Overview
              </h2>
              <p className="mt-3 text-[15px] leading-[1.7] text-foreground/85">
                Sejda offers online PDF editing with free-tier usage limits and a paid desktop 
                application. Plain processes PDFs locally in your browser with no usage restrictions. 
                This comparison examines their different approaches to limits, online editing, and 
                offline availability.
              </p>
            </section>

            {/* Free-tier limits vs unlimited */}
            <section className="mt-12">
              <h2 className="text-[18px] font-semibold text-foreground">
                Free-Tier Limits vs Unlimited Processing
              </h2>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-lg bg-[oklch(0.15_0.005_250)] p-5 border border-white/[0.08]">
                  <h3 className="text-[14px] font-semibold text-foreground">Sejda free limits</h3>
                  <ul className="mt-3 space-y-2 text-[13px] text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/50" />
                      <span>3 tasks per hour</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/50" />
                      <span>200 pages maximum per document</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/50" />
                      <span>50 MB file size limit</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/50" />
                      <span>Limited batch processing</span>
                    </li>
                  </ul>
                </div>
                <div className="rounded-lg bg-[oklch(0.15_0.005_250)] p-5 border border-white/[0.08]">
                  <h3 className="text-[14px] font-semibold text-foreground">Plain (no limits)</h3>
                  <ul className="mt-3 space-y-2 text-[13px] text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/50" />
                      <span>Unlimited tasks</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/50" />
                      <span>No page count restrictions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/50" />
                      <span>Limited only by browser memory</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/50" />
                      <span>No hourly or daily caps</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Online editing vs offline processing */}
            <section className="mt-12">
              <h2 className="text-[18px] font-semibold text-foreground">
                Online Editing vs Offline Processing
              </h2>
              <div className="mt-6 space-y-6">
                <div className="rounded-lg bg-[oklch(0.15_0.005_250)] p-5 border border-white/[0.08]">
                  <h3 className="text-[14px] font-semibold text-foreground">Sejda</h3>
                  <p className="mt-2 text-[14px] leading-[1.7] text-muted-foreground">
                    Sejda's online editor uploads your PDF to their servers where you can edit 
                    text, add images, fill forms, and annotate. Changes are processed server-side, 
                    and the modified file is sent back for download. Files are automatically 
                    deleted after 2 hours according to their documentation.
                  </p>
                </div>
                <div className="rounded-lg bg-[oklch(0.15_0.005_250)] p-5 border border-white/[0.08]">
                  <h3 className="text-[14px] font-semibold text-foreground">Plain</h3>
                  <p className="mt-2 text-[14px] leading-[1.7] text-muted-foreground">
                    Plain focuses on core operations (merge, split) processed entirely in your 
                    browser. Files never leave your device. Once the page loads, processing works 
                    without an internet connection. This architecture means no server-side features 
                    like OCR or text editing, but complete privacy.
                  </p>
                </div>
              </div>
            </section>

            {/* Daily task limits vs local execution */}
            <section className="mt-12">
              <h2 className="text-[18px] font-semibold text-foreground">
                Daily Task Limits vs Local Execution
              </h2>
              <div className="mt-4 text-[14px] leading-[1.7] text-muted-foreground space-y-4">
                <p>
                  <strong className="text-foreground/90">Server-based limits:</strong> Online 
                  PDF tools typically impose usage limits to manage server costs and encourage 
                  paid subscriptions. Sejda's free tier allows 3 tasks per hour. Hitting limits 
                  means waiting or upgrading to continue working.
                </p>
                <p>
                  <strong className="text-foreground/90">Local execution:</strong> Client-side 
                  tools like Plain have no artificial limits because processing uses your device's 
                  resources, not remote servers. You can merge or split PDFs continuously without 
                  waiting periods. The only constraints are your device's memory and CPU.
                </p>
              </div>
            </section>

            {/* When offline processing matters */}
            <section className="mt-12">
              <h2 className="text-[18px] font-semibold text-foreground">
                When Offline Processing Matters
              </h2>
              <ul className="mt-4 space-y-3 text-[14px] text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent/50" />
                  <span>Handling sensitive documents that shouldn't leave your device</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent/50" />
                  <span>Working in air-gapped or restricted network environments</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent/50" />
                  <span>Processing many files without hitting usage caps</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent/50" />
                  <span>Verifying that files aren't transmitted to third parties</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent/50" />
                  <span>Working with unreliable or slow internet connections</span>
                </li>
              </ul>
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
                        Sejda
                      </th>
                      <th className="py-3 px-4 text-left font-medium text-foreground">
                        Plain
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    <tr className="border-t border-white/[0.06]">
                      <td className="py-3 px-4 font-medium text-foreground/80">Processing</td>
                      <td className="py-3 px-4">Server-based (online)</td>
                      <td className="py-3 px-4">Client-side (local)</td>
                    </tr>
                    <tr className="border-t border-white/[0.06] bg-[oklch(0.13_0.004_250)]">
                      <td className="py-3 px-4 font-medium text-foreground/80">Free task limit</td>
                      <td className="py-3 px-4">3 per hour</td>
                      <td className="py-3 px-4">Unlimited</td>
                    </tr>
                    <tr className="border-t border-white/[0.06]">
                      <td className="py-3 px-4 font-medium text-foreground/80">File size limit</td>
                      <td className="py-3 px-4">50 MB (free)</td>
                      <td className="py-3 px-4">Browser memory</td>
                    </tr>
                    <tr className="border-t border-white/[0.06] bg-[oklch(0.13_0.004_250)]">
                      <td className="py-3 px-4 font-medium text-foreground/80">Page limit</td>
                      <td className="py-3 px-4">200 pages (free)</td>
                      <td className="py-3 px-4">None</td>
                    </tr>
                    <tr className="border-t border-white/[0.06]">
                      <td className="py-3 px-4 font-medium text-foreground/80">Offline support</td>
                      <td className="py-3 px-4">Desktop app (paid)</td>
                      <td className="py-3 px-4">Yes (after load)</td>
                    </tr>
                    <tr className="border-t border-white/[0.06] bg-[oklch(0.13_0.004_250)]">
                      <td className="py-3 px-4 font-medium text-foreground/80">Files uploaded</td>
                      <td className="py-3 px-4">Yes (2hr retention)</td>
                      <td className="py-3 px-4">No</td>
                    </tr>
                    <tr className="border-t border-white/[0.06]">
                      <td className="py-3 px-4 font-medium text-foreground/80">Advanced editing</td>
                      <td className="py-3 px-4">Yes (text, images)</td>
                      <td className="py-3 px-4">No (merge/split only)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Note */}
            <section className="mt-12">
              <div className="rounded-lg bg-[oklch(0.14_0.004_250)] p-5 border border-white/[0.08]">
                <p className="text-[13px] text-muted-foreground leading-[1.7]">
                  <strong className="text-foreground/90">Note:</strong> This comparison reflects 
                  Sejda's free tier. Their paid plans (Web Weekly, Desktop) remove or increase 
                  these limits. Users should review current pricing and terms on Sejda's website.
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
                  href="/learn/client-side-processing"
                  className="group rounded-lg bg-[oklch(0.15_0.005_250)] p-4 border border-white/[0.08] transition-all hover:border-accent/30"
                >
                  <span className="text-[13px] font-medium text-foreground group-hover:text-accent transition-colors">Is Offline PDF Processing Secure?</span>
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
