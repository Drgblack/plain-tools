import type { Metadata } from "next"
import Link from "next/link"

import { JsonLd } from "@/components/seo/json-ld"
import { VerifyClaimsContent } from "@/components/verify-claims-content"
import { buildPageMetadata } from "@/lib/page-metadata"
import { verifyClaimsFaqs, verifyClaimsSchema } from "@/lib/verify-claims-schema"

export const metadata: Metadata = buildPageMetadata({
  title: "Do PDF Tools Upload Your Files? | Plain.tools Privacy Verification",
  description:
    "Learn how online PDF tools process documents and verify that Plain.tools keeps files on your device. See how to confirm this using your browser’s developer tools.",
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
              <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                Do Online PDF Tools Upload Your Files?
              </h1>
              <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
                Many online PDF tools do upload files to remote servers because the conversion,
                compression, OCR, or page-editing step happens in cloud infrastructure. That means
                the provider can receive the document itself, plus any hidden metadata, embedded
                text, and file history that travels with it.
              </p>
              <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
                Plain.tools is built around local browser processing for core PDF workflows. The
                file stays on your device while the tool runs in-browser, which reduces exposure to
                third-party storage, server-side processing queues, and transfer paths you cannot
                easily inspect. This page shows how to verify that claim in your own browser rather
                than relying on marketing copy.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <article className="rounded-xl border border-border/70 bg-card/40 p-4">
                <h2 className="text-sm font-semibold text-foreground">What you can verify on this page</h2>
                <ul className="mt-2 list-disc space-y-1.5 pl-4 text-sm text-muted-foreground">
                  <li>Core PDF workflows process files locally in your browser.</li>
                  <li>No document bytes are sent to a remote server for local tools.</li>
                  <li>Behaviour can be inspected in your own browser network panel.</li>
                </ul>
              </article>
              <article className="rounded-xl border border-border/70 bg-card/40 p-4">
                <h2 className="text-sm font-semibold text-foreground">How to inspect quickly</h2>
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
        <section className="border-b border-border/70 px-4 py-10">
          <div className="mx-auto max-w-5xl space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                Proof: No File Uploads
              </h2>
              <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
                This is the fastest way to validate the core privacy claim on Plain Tools. Open one
                of the local PDF tools, keep the Network tab visible, and watch what happens when
                you add a file and run the action. For the standard local workflows, you should not
                see file bytes being sent in Fetch or XHR requests.
              </p>
            </div>

            <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,1fr)]">
              <article className="rounded-xl border border-border/70 bg-card/40 p-4">
                <h3 className="text-sm font-semibold text-foreground">Example tool interaction</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Example: open Merge PDF or Compress PDF, then drag in a sample document while the
                  Network tab is filtered to Fetch and XHR. You may still see normal page assets or
                  analytics, but you should not see a request carrying the actual file payload for
                  the core local workflow.
                </p>
                <div className="mt-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3">
                  <p className="text-sm font-semibold text-emerald-300">
                    No Fetch/XHR requests with file data
                  </p>
                </div>
                <div className="mt-4 flex flex-wrap gap-2 text-xs">
                  <Link href="/tools/merge-pdf" className="rounded-full border border-border bg-background px-3 py-1.5 text-muted-foreground transition hover:border-accent/40 hover:text-accent">
                    Try Merge PDF
                  </Link>
                  <Link href="/tools/compress-pdf" className="rounded-full border border-border bg-background px-3 py-1.5 text-muted-foreground transition hover:border-accent/40 hover:text-accent">
                    Try Compress PDF
                  </Link>
                </div>
              </article>

              <article className="rounded-xl border border-border/70 bg-[oklch(0.14_0.01_250)] p-4 text-white">
                <h3 className="text-sm font-semibold">Simplified network log</h3>
                <pre className="mt-3 overflow-x-auto rounded-lg border border-white/10 bg-black/20 p-3 text-xs leading-6 text-white/80">
{`Name                Type       Status   Notes
main.js             script     200      app bundle
plausible.js        script     200      analytics
favicon.ico         other      200      static asset

Result: no Fetch/XHR upload request containing file bytes`}
                </pre>
              </article>
            </div>

            <div className="rounded-xl border border-border/70 bg-card/40 p-4">
              <p className="text-sm font-medium text-foreground">
                Try a tool and watch the Network tab.
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                The detailed checklist below expands this quick proof into a repeatable verification
                method you can run yourself in any modern browser.
              </p>
            </div>
          </div>
        </section>
        <section className="border-b border-border/70 px-4 py-10">
          <div className="mx-auto max-w-5xl space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                How Most PDF Tools Work vs Local Processing
              </h2>
              <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
                The main privacy difference is where the processing happens. Upload-based PDF tools
                move the file to remote servers first, while local processing keeps the document in
                the browser and performs the task on your device.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <article className="rounded-xl border border-border/70 bg-card/40 p-4">
                <h3 className="text-sm font-semibold text-foreground">Most online PDF tools</h3>
                <ul className="mt-2 list-disc space-y-1.5 pl-4 text-sm leading-relaxed text-muted-foreground">
                  <li>Upload the file to a server before the task can run.</li>
                  <li>Rely on server-side queues and remote processing infrastructure.</li>
                  <li>Require you to trust the provider&apos;s retention, access, and deletion policy.</li>
                </ul>
              </article>
              <article className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                <h3 className="text-sm font-semibold text-foreground">Plain.tools local processing</h3>
                <ul className="mt-2 list-disc space-y-1.5 pl-4 text-sm leading-relaxed text-muted-foreground">
                  <li>Runs core PDF workflows directly in your browser session.</li>
                  <li>Keeps document bytes on your device during the main tool action.</li>
                  <li>Makes the privacy claim easier to verify with the browser Network tab.</li>
                </ul>
              </article>
            </div>
          </div>
        </section>
        <section className="border-b border-border/70 px-4 py-10">
          <div className="mx-auto max-w-5xl space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                Frequently asked questions about PDF tool privacy
              </h2>
              <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
                These are the common privacy questions behind PDF converter, compressor, and OCR
                searches. The answers below are rendered in the page HTML and mirrored in FAQ
                schema for search visibility.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {verifyClaimsFaqs.map((faq) => (
                <article key={faq.question} className="rounded-xl border border-border/70 bg-card/40 p-4">
                  <h3 className="text-sm font-semibold text-foreground">{faq.question}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {faq.answer}
                  </p>
                </article>
              ))}
            </div>
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
