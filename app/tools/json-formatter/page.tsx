import type { Metadata } from "next"

import { PageBreadcrumbs } from "@/components/seo/page-breadcrumbs"
import { RelatedLinks } from "@/components/seo/related-links"
import { ToolJsonLd } from "@/components/seo/tool-json-ld"
import { ToolFaqSectionBySlug, ToolSeoContentBySlug } from "@/components/tool-seo-content"
import JsonFormatterTool from "@/components/tools/json-formatter-tool"
import { ToolHelperPanel } from "@/components/tools/tool-helper-panel"
import { buildPageMetadata } from "@/lib/page-metadata"

export const metadata: Metadata = buildPageMetadata({
  title: "JSON Formatter & Validator (Private, Browser-Only)",
  description:
    "Format, validate, and minify JSON directly in your browser with no uploads. Private local workflow for developers and API debugging tasks.",
  path: "/tools/json-formatter",
  image: "/og/tools.png",
})

export default function JsonFormatterPage() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-background">
      <ToolJsonLd toolSlug="json-formatter" />

      <main className="flex-1 px-4 py-8 sm:py-10">
        <div className="mx-auto max-w-3xl space-y-6">
          <PageBreadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Tools", href: "/tools" },
              { label: "JSON Formatter & Validator" },
            ]}
          />

          <section className="space-y-3 text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              JSON Formatter & Validator (Private, Browser-Only)
            </h1>
            <p className="mx-auto max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              JSON formatting tools are often used during API debugging, config editing, and integration testing,
              but many online formatters push payloads through third-party services. This page keeps the whole
              process local in your browser so you can format, minify, and validate JSON without uploading request
              bodies, credentials, or internal data structures. Paste raw JSON, format it for readability, validate
              syntax errors quickly, or minify it for compact transfer and storage. The goal is practical developer
              speed with less privacy risk. You can also load the example payload to test output behaviour before
              working with live production-like data. For teams, this reduces friction in code review and incident
              analysis because well-formatted JSON is easier to inspect, diff, and discuss without tooling overhead.
            </p>
          </section>

          <ToolSeoContentBySlug toolSlug="json-formatter" />

          <ToolHelperPanel
            uploadHint="Paste JSON from logs, APIs, or config files. Processing stays local in your browser."
            resultHint="Format for readability, minify for transport, and validate structure before use."
            limitationNote="Validation checks JSON syntax only. It does not enforce your API schema rules."
          />

          <JsonFormatterTool />

          <ToolFaqSectionBySlug toolSlug="json-formatter" className="mt-6" />

          <section className="rounded-xl border border-border/70 bg-card/40 p-4 md:p-5">
            <h2 className="text-base font-semibold tracking-tight text-foreground md:text-lg">
              Why JSON formatting matters
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Clean formatting helps teams spot structural mistakes quickly, especially nested objects and array
              boundaries. Minified output is useful for compact payload transfer, while validation prevents avoidable
              parse failures before requests are sent.
            </p>
          </section>

          <RelatedLinks
            heading="Related developer workflows"
            sections={[
              {
                title: "Related tools",
                links: [
                  { label: "Base64 encoder / decoder", href: "/tools/base64-encoder" },
                  { label: "UUID generator", href: "/tools/uuid-generator" },
                  { label: "Regex tester and debugger", href: "/tools/regex-tester" },
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
                links: [{ label: "Check whether chatgpt.com is down", href: "/status/chatgpt.com" }],
              },
            ]}
          />
        </div>
      </main>
    </div>
  )
}

