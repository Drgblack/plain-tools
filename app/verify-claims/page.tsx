import type { Metadata } from "next"
import Link from "next/link"

import { VerifyClaimsContent } from "@/components/verify-claims-content"
import { serializeJsonLd } from "@/lib/sanitize"

export const metadata: Metadata = {
  title: "Verify No-Upload Claims - Plain Tools",
  description:
    "Verify Plain Tools privacy claims with step-by-step DevTools checks. Confirm local processing behaviour and inspect network requests yourself.",
  alternates: {
    canonical: "https://plain.tools/verify-claims",
  },
  openGraph: {
    title: "Verify No-Upload Claims - Plain Tools",
    description:
      "Use this verification guide to confirm whether PDF processing stays local in your browser.",
    url: "https://plain.tools/verify-claims",
    images: [
      {
        url: "/og/default.png",
        width: 1200,
        height: 630,
        alt: "Verify Plain Tools privacy claims",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Verify No-Upload Claims - Plain Tools",
    description:
      "Step-by-step DevTools checks to verify local processing and no-upload behaviour.",
    images: ["/og/default.png"],
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://plain.tools/verify-claims",
      url: "https://plain.tools/verify-claims",
      name: "We Dare You to Catch Us Uploading Your Files",
      description:
        "Interactive proof page showing exactly how to verify Plain's zero-upload privacy claims in DevTools.",
      isPartOf: {
        "@type": "WebSite",
        name: "Plain",
        url: "https://plain.tools",
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Does Plain upload my PDFs?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. Plain processes PDFs locally in your browser. Your files are not uploaded for processing.",
          },
        },
        {
          "@type": "Question",
          name: "Can I verify this myself?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Use your browser's Developer Tools (Network tab) while running a tool. You should not see requests containing your PDF data.",
          },
        },
        {
          "@type": "Question",
          name: "Does Plain work offline?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Plain can work offline after the site has loaded. If you refresh while offline, loading depends on your browser cache.",
          },
        },
      ],
    },
  ],
}

export default function VerifyClaimsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />
      <main className="overflow-x-hidden">
        <section className="border-b border-border/70 bg-card/20 px-4 py-10">
          <div className="mx-auto max-w-5xl space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                What you can verify on this page
              </h2>
              <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
                This guide is intentionally practical. You can verify local processing behaviour,
                confirm that file bytes are not uploaded during core tool usage, and inspect request
                traffic in your browser DevTools without trusting marketing claims.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <article className="rounded-xl border border-border/70 bg-card/40 p-4">
                <h3 className="text-sm font-semibold text-foreground">Claims under test</h3>
                <ul className="mt-2 list-disc space-y-1.5 pl-4 text-sm text-muted-foreground">
                  <li>Core PDF workflows process files locally in your browser.</li>
                  <li>No document bytes are sent to a remote server for local tools.</li>
                  <li>Behaviour can be inspected in your own browser network panel.</li>
                </ul>
              </article>
              <article className="rounded-xl border border-border/70 bg-card/40 p-4">
                <h3 className="text-sm font-semibold text-foreground">How to inspect quickly</h3>
                <ol className="mt-2 list-decimal space-y-1.5 pl-4 text-sm text-muted-foreground">
                  <li>Open DevTools and switch to the Network tab.</li>
                  <li>Filter by Fetch/XHR requests while running a tool.</li>
                  <li>Confirm no request payload contains your PDF content.</li>
                </ol>
              </article>
            </div>
            <p className="text-sm text-muted-foreground">
              Want deeper technical context? See{" "}
              <Link href="/learn/how-to-verify-a-pdf-tool-doesnt-upload-your-files" className="font-medium text-accent hover:underline">
                verification guidance
              </Link>{" "}
              or inspect the public repository on{" "}
              <a
                href="https://github.com/Drgblack/plain-tools"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-accent hover:underline"
              >
                GitHub
              </a>
              .
            </p>
          </div>
        </section>
        <VerifyClaimsContent />
      </main>
    </>
  )
}
