import type { Metadata } from "next"

import { PageBreadcrumbs } from "@/components/seo/page-breadcrumbs"
import { RelatedLinks } from "@/components/seo/related-links"
import { ToolJsonLd } from "@/components/seo/tool-json-ld"
import UuidGeneratorTool from "@/components/tools/uuid-generator-tool"
import { ToolHelperPanel } from "@/components/tools/tool-helper-panel"
import { buildPageMetadata } from "@/lib/page-metadata"

export const metadata: Metadata = buildPageMetadata({
  title: "UUID Generator (Instant, Private)",
  description:
    "Generate UUID v4 and v7 values instantly in your browser. Private local workflow for development, testing, and identifier generation.",
  path: "/tools/uuid-generator",
  image: "/og/tools.png",
})

export default function UuidGeneratorPage() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-background">
      <ToolJsonLd toolSlug="uuid-generator" />

      <main className="flex-1 px-4 py-8 sm:py-10">
        <div className="mx-auto max-w-3xl space-y-6">
          <PageBreadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Tools", href: "/tools" },
              { label: "UUID Generator" },
            ]}
          />

          <section className="space-y-3 text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              UUID Generator (Instant, Private)
            </h1>
            <p className="mx-auto max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              UUID values are used across modern systems for IDs that must be globally unique, including API records,
              event streams, job queues, and database rows. This generator runs entirely in your browser so you can
              create identifiers without sending data to external services. Use version 4 for random UUIDs or version 7
              when you need time-ordered identifiers that still keep strong uniqueness properties. You can generate one
              value or batches, copy them directly into your workflow, and export a text list for scripts or fixtures.
              The tool is intended for practical development use where speed, repeatability, and privacy matter more
              than heavyweight setup. If you are testing distributed systems or seeding local datasets, generating IDs
              in-browser gives you immediate output without adding package dependencies to small utility projects.
            </p>
          </section>

          <ToolHelperPanel
            uploadHint="No upload step is required. UUID generation uses browser cryptography APIs."
            resultHint="Generate one or many UUIDs, then copy or download the list as plain text."
            limitationNote="Generated IDs are best-effort local identifiers and not a replacement for full application-level uniqueness policy."
          />

          <UuidGeneratorTool />

          <section className="rounded-xl border border-border/70 bg-card/40 p-4 md:p-5">
            <h2 className="text-base font-semibold tracking-tight text-foreground md:text-lg">
              UUID version guidance
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Version 4 UUIDs are purely random and widely supported. Version 7 UUIDs embed timestamp ordering, which
              can help log sorting and write-path locality in some systems while still preserving uniqueness.
            </p>
          </section>

          <RelatedLinks
            heading="Related developer workflows"
            sections={[
              {
                title: "Related tools",
                links: [
                  { label: "Format and validate JSON", href: "/tools/json-formatter" },
                  { label: "Base64 encoder / decoder", href: "/tools/base64-encoder" },
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
                links: [{ label: "Check whether discord.com is down", href: "/status/discord" }],
              },
            ]}
          />
        </div>
      </main>
    </div>
  )
}
