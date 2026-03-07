import type { Metadata } from "next"

import { PageBreadcrumbs } from "@/components/seo/page-breadcrumbs"
import { RelatedLinks } from "@/components/seo/related-links"
import { ToolJsonLd } from "@/components/seo/tool-json-ld"
import RegexTesterTool from "@/components/tools/regex-tester-tool"
import { ToolHelperPanel } from "@/components/tools/tool-helper-panel"
import { buildPageMetadata } from "@/lib/page-metadata"

export const metadata: Metadata = buildPageMetadata({
  title: "Regex Tester & Debugger (Browser-Only)",
  description:
    "Test regex patterns with live match preview in your browser. Debug expressions privately with no upload and no external processing.",
  path: "/tools/regex-tester",
  image: "/og/tools.png",
})

export default function RegexTesterPage() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-background">
      <ToolJsonLd toolSlug="regex-tester" />

      <main className="flex-1 px-4 py-8 sm:py-10">
        <div className="mx-auto max-w-3xl space-y-6">
          <PageBreadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Tools", href: "/tools" },
              { label: "Regex Tester & Debugger" },
            ]}
          />

          <section className="space-y-3 text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Regex Tester & Debugger (Browser-Only)
            </h1>
            <p className="mx-auto max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              Regular expressions are fast for text extraction and validation, but even small syntax mistakes can
              create broken filters or expensive matching behaviour. This tester helps you write and debug patterns in
              a local browser workspace with live match preview. Enter your pattern, choose flags, and inspect exactly
              what matches in the test text. The match list includes index positions to support parsing and transform
              workflows. Because processing stays in your browser, you can test logs, snippets, and internal strings
              without sending them to third-party regex playgrounds. This is designed for practical development loops:
              test pattern changes quickly, review results, and copy matched output for downstream scripts. It is also
              useful for log triage and text-cleaning tasks where you need fast iteration with clear, deterministic
              output before moving expressions into production code paths.
            </p>
          </section>

          <ToolHelperPanel
            uploadHint="Paste your regex pattern and sample text directly. Matching runs locally in-browser."
            resultHint="Review highlighted matches, inspect positions, and copy the matched values."
            limitationNote="This tool tests JavaScript regex behaviour. Engine differences can exist in other runtimes."
          />

          <RegexTesterTool />

          <section className="rounded-xl border border-border/70 bg-card/40 p-4 md:p-5">
            <h2 className="text-base font-semibold tracking-tight text-foreground md:text-lg">
              Regex pattern basics
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Use anchors such as <code className="rounded bg-card px-1 py-0.5 text-foreground">^</code> and{" "}
              <code className="rounded bg-card px-1 py-0.5 text-foreground">$</code> for strict line matching,
              character classes for controlled input ranges, and non-greedy quantifiers when extracting bounded text.
            </p>
          </section>

          <RelatedLinks
            heading="Related developer workflows"
            sections={[
              {
                title: "Related tools",
                links: [
                  { label: "Format and validate JSON", href: "/tools/json-formatter" },
                  { label: "UUID generator", href: "/tools/uuid-generator" },
                  { label: "Base64 encoder / decoder", href: "/tools/base64-encoder" },
                ],
              },
              {
                title: "Related guides",
                links: [
                  { label: "No uploads explained", href: "/learn/no-uploads-explained" },
                  { label: "How to audit network requests", href: "/learn/how-to-audit-pdf-tool-network-requests" },
                ],
              },
              {
                title: "Related status pages",
                links: [{ label: "Check whether reddit.com is down", href: "/status/reddit.com" }],
              },
            ]}
          />
        </div>
      </main>
    </div>
  )
}

