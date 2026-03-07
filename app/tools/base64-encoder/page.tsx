import type { Metadata } from "next"

import Base64Tool from "@/components/tools/base64-tool"
import { PageBreadcrumbs } from "@/components/seo/page-breadcrumbs"
import { ToolJsonLd } from "@/components/seo/tool-json-ld"
import { RelatedLinks } from "@/components/seo/related-links"
import { ToolFaqSectionBySlug, ToolSeoContentBySlug } from "@/components/tool-seo-content"
import { ToolHelperPanel } from "@/components/tools/tool-helper-panel"
import { buildPageMetadata } from "@/lib/page-metadata"

export const metadata: Metadata = buildPageMetadata({
  title: "Base64 Encoder / Decoder (Browser-Only)",
  description:
    "Encode and decode Base64 locally in your browser for text and files. Use a private workflow with no upload step and direct file download support.",
  path: "/tools/base64-encoder",
  image: "/og/tools.png",
})

export default function Base64EncoderPage() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-background">
      <ToolJsonLd toolSlug="base64-encoder" />

      <main className="flex-1 px-4 py-8 sm:py-10">
        <div className="mx-auto max-w-3xl space-y-6">
          <PageBreadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Tools", href: "/tools" },
              { label: "Base64 Encoder / Decoder" },
            ]}
          />

          <section className="space-y-3 text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Base64 Encoder / Decoder (Browser-Only)
            </h1>
            <p className="mx-auto max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              Base64 is a text-safe encoding format used when binary data must travel through systems that
              only accept plain text. Developers use it for API payloads, data URLs, token transport, and
              quick binary checks. This page gives you an encode and decode workflow that runs entirely in
              your browser. You can paste text, load a local file, generate Base64 output, then decode back
              into text or a downloadable file. Because processing stays on-device, you can use it for
              sensitive development tasks without relying on third-party upload services. It is also useful
              when you need predictable conversion during debugging, because you can inspect both input and
              output in one local workspace and avoid hidden server transformations.
            </p>
          </section>

          <ToolSeoContentBySlug toolSlug="base64-encoder" />

          <ToolHelperPanel
            uploadHint="Use text input or drop a file. File processing uses browser APIs and runs locally."
            resultHint="Copy Base64 output, download it as text, or decode Base64 into a file."
            limitationNote="Base64 is encoding, not encryption. Encoded output should still be treated as readable data."
          />

          <Base64Tool />

          <ToolFaqSectionBySlug toolSlug="base64-encoder" className="mt-6" />

          <RelatedLinks
            heading="Related developer workflows"
            sections={[
              {
                title: "Related tools",
                links: [
                  { label: "Format and validate JSON", href: "/tools/json-formatter" },
                  { label: "Generate UUIDs locally", href: "/tools/uuid-generator" },
                  { label: "Test regular expressions", href: "/tools/regex-tester" },
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
                title: "Status checks",
                links: [{ label: "Check whether chatgpt.com is down", href: "/status/chatgpt.com" }],
              },
            ]}
          />
        </div>
      </main>
    </div>
  )
}

