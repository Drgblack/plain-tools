import type { Metadata } from "next"
import Link from "next/link"

import { JsonLd } from "@/components/seo/json-ld"
import { VerifyClaimsContent } from "@/components/verify-claims-content"
import { buildPageMetadata } from "@/lib/page-metadata"
import { verifyClaimsSchema } from "@/lib/verify-claims-schema"

export const metadata: Metadata = buildPageMetadata({
  title: "Verify claims",
  description:
    "Verify Plain Tools no-upload claims with practical DevTools checks. Confirm local processing behaviour, inspect network requests, and validate results step by step.",
  path: "/verify-claims",
  image: "/og/default.png",
})

export default function VerifyClaimsPage() {
  const relatedTools = [
    { label: "Merge PDF locally", href: "/tools/merge-pdf" },
    { label: "Split PDF locally", href: "/tools/split-pdf" },
    { label: "Compress PDF locally", href: "/tools/compress-pdf" },
    { label: "Check site status", href: "/site-status" },
  ]

  return (
    <>
      {verifyClaimsSchema ? <JsonLd id="verify-claims-schema" schema={verifyClaimsSchema} /> : null}
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
        <section className="border-t border-border/70 px-4 py-10">
          <div className="mx-auto max-w-5xl space-y-6">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                Try local workflows yourself
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
                The quickest way to validate claims is to run a real task while watching Network
                requests. Start with one of these tools.
              </p>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2">
              {relatedTools.map((tool) => (
                <li key={tool.href} className="rounded-xl border border-border/70 bg-card/40 p-4">
                  <Link href={tool.href} className="text-sm font-semibold text-foreground hover:text-accent hover:underline">
                    {tool.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="rounded-xl border border-border/70 bg-card/40 p-4">
              <h3 className="text-sm font-semibold text-foreground">Important limitation</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                AI features are explicitly opt-in and may send extracted text for processing. Core
                local tools are the no-upload workflows verified on this page.
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
