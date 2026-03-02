import { Metadata } from "next"
import Script from "next/script"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Plain vs iLovePDF",
  description:
    "Plain compares its offline architecture with iLovePDF's server-based approach. Factual differences in privacy and processing.",
  openGraph: {
    title: "Plain vs iLovePDF - Plain",
    description: "Plain compares offline and server-based PDF processing approaches.",
  },
  alternates: {
    canonical: "https://plain.tools/comparisons/plain-vs-ilovepdf",
  },
}

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://plain.tools/" },
    { "@type": "ListItem", "position": 2, "name": "Comparisons", "item": "https://plain.tools/comparisons" },
    { "@type": "ListItem", "position": 3, "name": "Plain vs iLovePDF", "item": "https://plain.tools/comparisons/plain-vs-ilovepdf" }
  ]
}

export default function PlainVsILovePDFPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Script
        id="breadcrumb-json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Header />
      <main className="flex-1">
        <article className="px-4 py-16">
          <div className="mx-auto max-w-3xl">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              Plain vs iLovePDF
            </h1>

            <p className="mt-6 text-muted-foreground leading-relaxed">
              Plain and iLovePDF are both tools for working with PDF files, but
              they use different technical approaches. This page explains how
              those approaches differ and when each tool may be appropriate.
            </p>

            {/* iLovePDF Section */}
            <section className="mt-12">
              <h2 className="text-xl font-medium text-foreground">
                iLovePDF (Online PDF Service)
              </h2>
              <div className="mt-4 space-y-3 text-muted-foreground leading-relaxed">
                <p>
                  iLovePDF is an online PDF service that processes files on
                  cloud servers. When using iLovePDF:
                </p>
                <ul className="list-disc space-y-2 pl-6">
                  <li>Files are uploaded to external servers for processing</li>
                  <li>Processing happens in the cloud</li>
                  <li>Processed files are downloaded after completion</li>
                  <li>A wide range of PDF tools is available</li>
                  <li>
                    Accounts, usage limits, or subscriptions may apply depending
                    on usage
                  </li>
                </ul>
              </div>
            </section>

            {/* Plain Section */}
            <section className="mt-12">
              <h2 className="text-xl font-medium text-foreground">
                Plain (Offline, Client-Side PDF Tools)
              </h2>
              <div className="mt-4 space-y-3 text-muted-foreground leading-relaxed">
                <p>
                  Plain uses client-side PDF processing, meaning all operations
                  happen locally in the browser:
                </p>
                <ul className="list-disc space-y-2 pl-6">
                  <li>Files are processed locally in the browser</li>
                  <li>No file uploads occur</li>
                  <li>No server-side processing takes place</li>
                  <li>Tools work offline after the page loads</li>
                  <li>No user accounts or cloud storage</li>
                </ul>
              </div>
            </section>

            {/* Comparison Table */}
            <section className="mt-12">
              <h2 className="text-xl font-medium text-foreground">
                Key Differences at a Glance
              </h2>
              <div className="mt-6 overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="py-3 pr-4 text-left font-medium text-foreground">
                        Feature
                      </th>
                      <th className="py-3 px-4 text-left font-medium text-foreground">
                        iLovePDF
                      </th>
                      <th className="py-3 pl-4 text-left font-medium text-foreground">
                        Plain
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    <tr className="border-b border-border/50">
                      <td className="py-3 pr-4">File handling</td>
                      <td className="py-3 px-4">Uploaded to servers</td>
                      <td className="py-3 pl-4">Processed locally</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 pr-4">Processing location</td>
                      <td className="py-3 px-4">Cloud servers</td>
                      <td className="py-3 pl-4">{"User's browser"}</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 pr-4">Works offline</td>
                      <td className="py-3 px-4">No</td>
                      <td className="py-3 pl-4">Yes</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 pr-4">Account required</td>
                      <td className="py-3 px-4">Sometimes</td>
                      <td className="py-3 pl-4">No</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 pr-4">
                        Confidential document handling
                      </td>
                      <td className="py-3 px-4">Depends on policy</td>
                      <td className="py-3 pl-4">No uploads involved</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 pr-4">Verifiable by user</td>
                      <td className="py-3 px-4">Limited</td>
                      <td className="py-3 pl-4">
                        Yes (via DevTools / offline use)
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* When iLovePDF */}
            <section className="mt-12">
              <h2 className="text-xl font-medium text-foreground">
                When iLovePDF May Be Suitable
              </h2>
              <ul className="mt-4 list-disc space-y-2 pl-6 text-muted-foreground leading-relaxed">
                <li>Users who want access to many advanced PDF features</li>
                <li>Cloud-based workflows with cross-device access</li>
                <li>Convenience and familiarity with online PDF services</li>
                <li>Situations where uploading files is acceptable</li>
              </ul>
            </section>

            {/* When Plain */}
            <section className="mt-12">
              <h2 className="text-xl font-medium text-foreground">
                When Plain May Be Suitable
              </h2>
              <ul className="mt-4 list-disc space-y-2 pl-6 text-muted-foreground leading-relaxed">
                <li>Confidential or sensitive documents</li>
                <li>Workplace or regulated environments</li>
                <li>Users who prefer not to upload files to external servers</li>
                <li>Situations requiring offline access</li>
                <li>
                  Anyone who wants to merge PDF without upload or verify tool
                  behavior
                </li>
              </ul>
            </section>

            {/* Verifiability */}
            <section className="mt-12">
              <h2 className="text-xl font-medium text-foreground">
                Verifiability and Transparency
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Plain is designed so users can verify that no file uploads occur
                by inspecting network requests in their browser&apos;s developer
                tools, or by using the tools while fully offline. This allows
                users to confirm the behavior themselves rather than relying
                solely on privacy claims.
              </p>
              <p className="mt-4 border-l-2 border-accent pl-4 text-foreground italic">
                &quot;Plain is designed to be verifiable, not just trusted.&quot;
              </p>
            </section>

            {/* SEO Paragraph */}
            <section className="mt-16 border-t border-border pt-8">
              <p className="text-sm text-muted-foreground leading-relaxed">
                This Plain vs iLovePDF comparison is intended to help users
                understand the differences between online PDF services and
                offline PDF tools. Both approaches have valid use cases. Plain
                focuses on client-side PDF processing, allowing users to work
                with documents locally without uploads. For more information
                about how Plain works, see the{" "}
                <a
                  href="/how-it-works"
                  className="text-foreground underline underline-offset-4 hover:text-accent"
                >
                  How It Works
                </a>{" "}
                page.
              </p>
            </section>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  )
}
