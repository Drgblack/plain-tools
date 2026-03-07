import type { Metadata } from "next"

import PdfToMarkdownTool from "@/components/tools/pdf-to-markdown-tool"
import { ToolJsonLd } from "@/components/seo/tool-json-ld"
import { ToolRelatedLinks } from "@/components/seo/tool-related-links"
import { ToolFaqSectionBySlug, ToolSeoContentBySlug } from "@/components/tool-seo-content"
import { PageBreadcrumbs } from "@/components/seo/page-breadcrumbs"
import { ToolHelperPanel } from "@/components/tools/tool-helper-panel"
import { buildPageMetadata } from "@/lib/page-metadata"

export const metadata: Metadata = buildPageMetadata({
  title: "PDF to Markdown Locally - No Upload",
  description:
    "Convert PDF documents to Markdown locally in your browser with structured text heuristics for headings, lists, and emphasis.",
  path: "/tools/pdf-to-markdown",
  image: "/og/tools.png",
})

export default function PdfToMarkdownPage() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-background">
      <ToolJsonLd toolSlug="pdf-to-markdown" />

      <main className="flex-1 px-4 py-8 sm:py-10">
        <div className="mx-auto max-w-6xl space-y-6">
          <PageBreadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Tools", href: "/tools" },
              { label: "PDF to Markdown" },
            ]}
          />

          <section className="space-y-2 text-center sm:space-y-3">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              PDF to Markdown
            </h1>
            <p className="mx-auto max-w-3xl text-sm text-muted-foreground sm:text-base">
              Export PDF text to Markdown with best-effort structure detection for headings, lists,
              and inline emphasis. Processing runs locally in your browser. Files never leave your device.
            </p>
          </section>

          <ToolSeoContentBySlug toolSlug="pdf-to-markdown" />

          <ToolHelperPanel
            uploadHint="Upload one PDF file from your device. Structured, text-based PDFs produce the best Markdown output."
            resultHint="Preview extracted Markdown in-page and download a .md file for editing or publishing workflows."
            limitationNote="Best-effort formatting only. Complex layouts, tables, and scanned PDFs may require manual Markdown cleanup."
          />

          <PdfToMarkdownTool />

          <ToolFaqSectionBySlug toolSlug="pdf-to-markdown" className="mt-6" />
        </div>

        <ToolRelatedLinks toolSlug="pdf-to-markdown" className="mt-8" />
      </main>
    </div>
  )
}
