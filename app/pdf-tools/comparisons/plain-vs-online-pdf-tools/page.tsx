import type { Metadata } from "next"
import Script from "next/script"
import { Header } from "@/components/legacy/header"
import { Footer } from "@/components/legacy/footer"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/legacy/ui/table"

export const metadata: Metadata = {
  title: "Plain vs Online PDF Tools",
  description:
    "Plain compares offline client-side PDF tools with server-based online services. Neutral analysis of architecture differences.",
  openGraph: {
    title: "Plain vs Online PDF Tools - Plain",
    description: "Plain compares offline and online PDF processing approaches.",
  },
  alternates: {
    canonical: "https://plain.tools/comparisons/plain-vs-online-pdf-tools",
  },
}

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://plain.tools/" },
    { "@type": "ListItem", "position": 2, "name": "Comparisons", "item": "https://plain.tools/comparisons" },
    { "@type": "ListItem", "position": 3, "name": "Plain vs Online PDF Tools", "item": "https://plain.tools/comparisons/plain-vs-online-pdf-tools" }
  ]
}

const comparisonData = [
  {
    feature: "File uploads",
    online: "Required",
    plain: "Not required",
  },
  {
    feature: "Processing location",
    online: "External servers",
    plain: "Local browser",
  },
  {
    feature: "Works offline",
    online: "No",
    plain: "Yes",
  },
  {
    feature: "Accounts required",
    online: "Often",
    plain: "No",
  },
  {
    feature: "Suitable for confidential documents",
    online: "Depends",
    plain: "Yes (no uploads)",
  },
  {
    feature: "Verifiable by user",
    online: "Limited",
    plain: "Yes (via DevTools)",
  },
]

export default function PlainVsOnlinePdfToolsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Script
        id="breadcrumb-json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Header />
      <main className="flex-1">
        <article className="mx-auto max-w-3xl px-4 py-16">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Plain vs Online PDF Tools
          </h1>

          <p className="mt-6 text-base leading-relaxed text-muted-foreground">
            PDF tools generally fall into two categories: offline, client-side
            tools and online, server-based services. This page explains how
            these approaches differ and when each may be appropriate.
          </p>

          {/* Online PDF Tools Section */}
          <section className="mt-12">
            <h2 className="text-xl font-medium text-foreground">
              Online PDF Tools (Server-Based)
            </h2>
            <div className="mt-4 space-y-3 text-base leading-relaxed text-muted-foreground">
              <p>
                Online PDF services process files on external servers. When
                using these tools:
              </p>
              <ul className="ml-6 list-disc space-y-2">
                <li>Files must be uploaded to external servers</li>
                <li>Processing happens in the cloud</li>
                <li>Results are downloaded after processing completes</li>
                <li>
                  Many services require accounts, impose usage limits, or
                  require subscriptions
                </li>
                <li>
                  Common examples include services like iLovePDF and Smallpdf
                </li>
              </ul>
            </div>
          </section>

          {/* Plain Section */}
          <section className="mt-12">
            <h2 className="text-xl font-medium text-foreground">
              Plain (Offline, Client-Side)
            </h2>
            <div className="mt-4 space-y-3 text-base leading-relaxed text-muted-foreground">
              <p>
                Plain takes a different approach by processing files entirely
                within your browser:
              </p>
              <ul className="ml-6 list-disc space-y-2">
                <li>Files are processed locally in the browser</li>
                <li>No file uploads occur</li>
                <li>No server-side processing takes place</li>
                <li>Tools work offline after the page loads</li>
                <li>No accounts or cloud storage required</li>
              </ul>
            </div>
          </section>

          {/* Comparison Table */}
          <section className="mt-12">
            <h2 className="text-xl font-medium text-foreground">
              Side-by-Side Comparison
            </h2>
            <div className="mt-6 overflow-hidden rounded-lg border border-border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-secondary/50">
                    <TableHead className="font-medium text-foreground">
                      Feature
                    </TableHead>
                    <TableHead className="font-medium text-foreground">
                      Online PDF Tools
                    </TableHead>
                    <TableHead className="font-medium text-foreground">
                      Plain
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {comparisonData.map((row) => (
                    <TableRow key={row.feature}>
                      <TableCell className="font-medium text-foreground">
                        {row.feature}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {row.online}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {row.plain}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </section>

          {/* When Online Tools May Be Appropriate */}
          <section className="mt-12">
            <h2 className="text-xl font-medium text-foreground">
              When Online Tools May Be Appropriate
            </h2>
            <div className="mt-4 space-y-3 text-base leading-relaxed text-muted-foreground">
              <p>Online PDF services may be suitable in certain situations:</p>
              <ul className="ml-6 list-disc space-y-2">
                <li>Convenience for casual, non-sensitive use</li>
                <li>
                  Access to advanced features that require server-side
                  processing
                </li>
                <li>Integration with cloud storage and team workflows</li>
              </ul>
            </div>
          </section>

          {/* When Plain May Be Appropriate */}
          <section className="mt-12">
            <h2 className="text-xl font-medium text-foreground">
              When Plain May Be Appropriate
            </h2>
            <div className="mt-4 space-y-3 text-base leading-relaxed text-muted-foreground">
              <p>
                Client-side PDF processing with Plain may be preferable when:
              </p>
              <ul className="ml-6 list-disc space-y-2">
                <li>
                  Working with confidential documents that should not be
                  uploaded
                </li>
                <li>
                  Operating in workplace or regulated environments with data
                  handling policies
                </li>
                <li>Users prefer not to upload files to external servers</li>
                <li>
                  Situations requiring offline access without internet
                  connectivity
                </li>
              </ul>
            </div>
          </section>

          {/* Verifiability */}
          <section className="mt-12">
            <h2 className="text-xl font-medium text-foreground">
              Verifiability
            </h2>
            <div className="mt-4 space-y-4 text-base leading-relaxed text-muted-foreground">
              <p>
                Plain is designed so users can verify that no uploads occur by
                inspecting network activity in browser developer tools or by
                using the tools entirely offline after the page has loaded.
              </p>
              <p className="border-l-2 border-accent pl-4 text-foreground">
                Plain is designed to be verifiable, not just trusted.
              </p>
            </div>
          </section>

          {/* SEO Content */}
          <section className="mt-16 border-t border-border pt-8">
            <p className="text-sm leading-relaxed text-muted-foreground">
              This comparison outlines the differences between offline PDF tools
              and online PDF services. Plain offers client-side PDF processing
              as an alternative for users who need privacy-first PDF tools.
              Whether you need to merge PDF without upload or simply prefer
              local processing, understanding these approaches helps you choose
              the right tool for your situation.
            </p>
          </section>
        </article>
      </main>
      <Footer />
    </div>
  )
}

