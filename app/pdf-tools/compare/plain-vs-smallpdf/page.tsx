import { Metadata } from "next"
import Link from "next/link"
import Script from "next/script"
import { Header } from "@/components/legacy/header"
import { Footer } from "@/components/legacy/footer"

export const metadata: Metadata = {
  title: "Plain vs Smallpdf: Offline vs Online PDF Processing",
  description:
    "A technical comparison of client-side offline PDF processing versus cloud-based online processing. Understand the architectural differences and privacy implications.",
  openGraph: {
    title: "Plain vs Smallpdf: Offline vs Online PDF Processing",
    description: "A technical comparison of client-side offline PDF processing versus cloud-based online processing.",
    images: [
      {
        url: "/og?title=Plain vs Smallpdf&subtitle=Offline vs Online PDF Processing&kind=compare",
        width: 1200,
        height: 630,
      },
    ],
  },
}

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Plain vs Smallpdf: Offline vs Online PDF Processing",
  description:
    "A technical comparison between Plain and Smallpdf focusing on architecture, privacy, and usage model.",
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
    "@id": "https://plain.tools/compare/plain-vs-smallpdf",
  },
}

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://plain.tools/" },
    { "@type": "ListItem", position: 2, name: "Compare", item: "https://plain.tools/compare" },
    { "@type": "ListItem", position: 3, name: "Plain vs Smallpdf", item: "https://plain.tools/compare/plain-vs-smallpdf" },
  ],
}

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Does Smallpdf require uploads?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Smallpdf uses cloud-based infrastructure where PDF files are uploaded to their servers for processing. Files are transmitted over the internet, processed on their infrastructure, and results are sent back to your browser.",
      },
    },
    {
      "@type": "Question",
      name: "Does Smallpdf work offline?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Smallpdf's web tools require an active internet connection because files must be uploaded to their servers. They offer a desktop application that provides some offline capabilities for certain features.",
      },
    },
    {
      "@type": "Question",
      name: "Which tools are better for sensitive documents?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "For sensitive documents, client-side tools like Plain offer architectural privacy guarantees because files never leave the device. Upload-based tools like Smallpdf require trusting the provider's security practices and data handling policies.",
      },
    },
    {
      "@type": "Question",
      name: "Does Smallpdf require an account?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Smallpdf offers limited free usage (2 tasks per day) without an account. An account is required for unlimited access, and a Pro subscription unlocks advanced features like OCR and e-signatures.",
      },
    },
    {
      "@type": "Question",
      name: "Does Plain require an account?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Plain has no user accounts, no login, and no registration. The tool is completely anonymous with no daily limits or usage restrictions.",
      },
    },
  ],
}

export default function PlainVsSmallpdfComparePage() {
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
            <nav className="mb-8 flex items-center gap-2 text-[13px] text-muted-foreground">
              <Link href="/pdf-tools/" className="hover:text-foreground transition-colors">
                Home
              </Link>
              <span>/</span>
              <Link href="/pdf-tools/compare" className="hover:text-foreground transition-colors">
                Compare
              </Link>
              <span>/</span>
              <span className="text-foreground">Plain vs Smallpdf</span>
            </nav>

            <h1 className="text-[28px] font-bold tracking-tight text-foreground md:text-[32px]">
              Plain vs Smallpdf
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
                Smallpdf is an established PDF platform with accounts, team features, and cloud 
                storage integrations. Plain is a no-account, offline-first tool where files never 
                leave your device. This comparison focuses on practical differences: account 
                requirements, processing limits, offline availability, and typical use cases.
              </p>
            </section>

            {/* Account model */}
            <section className="mt-12">
              <h2 className="text-[18px] font-semibold text-foreground">
                Account-Based vs No-Account Usage
              </h2>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-lg bg-[oklch(0.15_0.005_250)] p-5 border border-white/[0.08]">
                  <h3 className="text-[14px] font-semibold text-foreground">Smallpdf</h3>
                  <ul className="mt-3 space-y-2 text-[13px] text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/50" />
                      <span>Limited free usage without account</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/50" />
                      <span>Account required for unlimited access</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/50" />
                      <span>Pro subscription for advanced features</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/50" />
                      <span>Team plans with shared billing</span>
                    </li>
                  </ul>
                </div>
                <div className="rounded-lg bg-[oklch(0.15_0.005_250)] p-5 border border-white/[0.08]">
                  <h3 className="text-[14px] font-semibold text-foreground">Plain</h3>
                  <ul className="mt-3 space-y-2 text-[13px] text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/50" />
                      <span>No account required</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/50" />
                      <span>No login or registration</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/50" />
                      <span>Completely anonymous usage</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/50" />
                      <span>Free, unlimited use</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Upload limits vs local limits */}
            <section className="mt-12">
              <h2 className="text-[18px] font-semibold text-foreground">
                Upload Limits vs Local Limits
              </h2>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-lg bg-[oklch(0.15_0.005_250)] p-5 border border-white/[0.08]">
                  <h3 className="text-[14px] font-semibold text-foreground">Smallpdf limits</h3>
                  <ul className="mt-3 space-y-2 text-[13px] text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/50" />
                      <span>Free: 2 tasks per day</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/50" />
                      <span>File size limits vary by plan</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/50" />
                      <span>Upload speed depends on connection</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/50" />
                      <span>Processing time includes transfer</span>
                    </li>
                  </ul>
                </div>
                <div className="rounded-lg bg-[oklch(0.15_0.005_250)] p-5 border border-white/[0.08]">
                  <h3 className="text-[14px] font-semibold text-foreground">Plain limits</h3>
                  <ul className="mt-3 space-y-2 text-[13px] text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/50" />
                      <span>No daily task limits</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/50" />
                      <span>Limited by browser memory</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/50" />
                      <span>No upload time (local processing)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/50" />
                      <span>Speed depends on device CPU</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Offline availability */}
            <section className="mt-12">
              <h2 className="text-[18px] font-semibold text-foreground">
                Offline Availability
              </h2>
              <div className="mt-4 text-[14px] leading-[1.7] text-muted-foreground space-y-4">
                <p>
                  <strong className="text-foreground/90">Smallpdf:</strong> Web tools require 
                  an active internet connection. Files must be uploaded to servers for processing. 
                  A desktop application is available that provides some offline capabilities for 
                  certain features.
                </p>
                <p>
                  <strong className="text-foreground/90">Plain:</strong> Works offline after 
                  the initial page load. All processing happens in the browser using WebAssembly. 
                  No internet connection needed during PDF operations. Useful for air-gapped 
                  environments or unreliable connectivity.
                </p>
              </div>
            </section>

            {/* How each tool processes PDFs */}
            <section className="mt-12">
              <h2 className="text-[18px] font-semibold text-foreground">
                How Each Tool Processes PDFs
              </h2>
              
              <div className="mt-6 space-y-6">
                <div className="rounded-lg bg-[oklch(0.15_0.005_250)] p-5 border border-white/[0.08]">
                  <h3 className="text-[14px] font-semibold text-foreground">Smallpdf</h3>
                  <p className="mt-2 text-[14px] leading-[1.7] text-muted-foreground">
                    Smallpdf uses a cloud-based architecture. Files are uploaded to their servers 
                    for processing, with the processed results sent back to your browser. They offer 
                    a desktop application for some features, and provide integrations with cloud 
                    storage services. An internet connection is required for the web-based tools.
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
                  <strong className="text-foreground/90">Cloud-based processing:</strong> Files 
                  are transmitted to and processed on remote infrastructure. Smallpdf has security 
                  certifications (ISO 27001) and documented retention policies. Users must trust 
                  the provider&apos;s privacy policies and security practices.
                </p>
                <p>
                  <strong className="text-foreground/90">Client-side processing:</strong> Files 
                  remain on the user&apos;s device throughout the entire process. No network transmission 
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
                      <span>Extensive feature set (21+ tools)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/50" />
                      <span>OCR and e-signature capabilities</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/50" />
                      <span>Team collaboration features</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/50" />
                      <span>Cloud storage integrations</span>
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
                      <span>You need advanced features like OCR, e-signatures, or format conversion</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent/50" />
                      <span>Team collaboration and document sharing are priorities</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent/50" />
                      <span>Documents are not sensitive or confidential</span>
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

            {/* Typical audience */}
            <section className="mt-12">
              <h2 className="text-[18px] font-semibold text-foreground">
                Typical Audience
              </h2>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-lg bg-[oklch(0.15_0.005_250)] p-5 border border-white/[0.08]">
                  <h3 className="text-[14px] font-semibold text-foreground">Smallpdf users</h3>
                  <ul className="mt-3 space-y-2 text-[13px] text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/50" />
                      <span>Teams needing collaboration features</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/50" />
                      <span>Users requiring OCR or e-signatures</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/50" />
                      <span>Those who prefer cloud storage integrations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/50" />
                      <span>Non-sensitive document workflows</span>
                    </li>
                  </ul>
                </div>
                <div className="rounded-lg bg-[oklch(0.15_0.005_250)] p-5 border border-white/[0.08]">
                  <h3 className="text-[14px] font-semibold text-foreground">Plain users</h3>
                  <ul className="mt-3 space-y-2 text-[13px] text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/50" />
                      <span>Privacy-conscious individuals</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/50" />
                      <span>Legal, medical, or financial professionals</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/50" />
                      <span>Users in restricted or offline environments</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/50" />
                      <span>Anyone avoiding accounts and subscriptions</span>
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
                        Smallpdf
                      </th>
                      <th className="py-3 px-4 text-left font-medium text-foreground">
                        Plain
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    <tr className="border-t border-white/[0.06]">
                      <td className="py-3 px-4 font-medium text-foreground/80">Architecture</td>
                      <td className="py-3 px-4">Cloud-based</td>
                      <td className="py-3 px-4">Client-side</td>
                    </tr>
                    <tr className="border-t border-white/[0.06] bg-[oklch(0.13_0.004_250)]">
                      <td className="py-3 px-4 font-medium text-foreground/80">File handling</td>
                      <td className="py-3 px-4">Uploaded to servers</td>
                      <td className="py-3 px-4">Stays on device</td>
                    </tr>
                    <tr className="border-t border-white/[0.06]">
                      <td className="py-3 px-4 font-medium text-foreground/80">Internet required</td>
                      <td className="py-3 px-4">Yes (web version)</td>
                      <td className="py-3 px-4">Only for initial load</td>
                    </tr>
                    <tr className="border-t border-white/[0.06] bg-[oklch(0.13_0.004_250)]">
                      <td className="py-3 px-4 font-medium text-foreground/80">Account required</td>
                      <td className="py-3 px-4">For full features</td>
                      <td className="py-3 px-4">No</td>
                    </tr>
                    <tr className="border-t border-white/[0.06]">
                      <td className="py-3 px-4 font-medium text-foreground/80">Verifiable privacy</td>
                      <td className="py-3 px-4">Policy-based (ISO 27001)</td>
                      <td className="py-3 px-4">Architecturally enforced</td>
                    </tr>
                    <tr className="border-t border-white/[0.06] bg-[oklch(0.13_0.004_250)]">
                      <td className="py-3 px-4 font-medium text-foreground/80">Feature range</td>
                      <td className="py-3 px-4">Extensive (21+ tools)</td>
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
                  observable architectural differences. Smallpdf has its own privacy policy and
                  security certifications (ISO 27001). Users should review the terms of service 
                  for any tool they use.
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
                  href="/pdf-tools/learn/how-plain-works"
                  className="group rounded-lg bg-[oklch(0.15_0.005_250)] p-4 border border-white/[0.08] transition-all hover:border-accent/30"
                >
                  <span className="text-[13px] font-medium text-foreground group-hover:text-accent transition-colors">How Plain Works</span>
                </Link>
                <Link
                  href="/pdf-tools/learn/why-pdf-uploads-are-risky"
                  className="group rounded-lg bg-[oklch(0.15_0.005_250)] p-4 border border-white/[0.08] transition-all hover:border-accent/30"
                >
                  <span className="text-[13px] font-medium text-foreground group-hover:text-accent transition-colors">Why PDF Uploads Are Risky</span>
                </Link>
              </div>
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
          </div>
        </article>
      </main>
      <Footer />
    </div>
  )
}


