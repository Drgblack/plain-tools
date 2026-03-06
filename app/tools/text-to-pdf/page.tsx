import type { Metadata } from "next"

import TextToPdfTool from "@/components/tools/text-to-pdf-tool"
import { ToolJsonLd } from "@/components/seo/tool-json-ld"
import { ToolRelatedLinks } from "@/components/seo/tool-related-links"
import { PageBreadcrumbs } from "@/components/seo/page-breadcrumbs"
import { ToolHelperPanel } from "@/components/tools/tool-helper-panel"
import { buildPageMetadata } from "@/lib/page-metadata"

export const metadata: Metadata = buildPageMetadata({
  title: "Text or Markdown to PDF Locally - No Upload",
  description:
    "Convert pasted text or Markdown into PDF locally in your browser. Upload .txt or .md files, generate PDF pages, and download instantly with no uploads.",
  path: "/tools/text-to-pdf",
  image: "/og/tools.png",
})

export default function TextToPdfPage() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-background">
      <ToolJsonLd toolSlug="text-to-pdf" />

      <main className="flex-1 px-4 py-8 sm:py-10">
        <div className="mx-auto max-w-3xl space-y-6">
          <PageBreadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Tools", href: "/tools" },
              { label: "Text to PDF" },
            ]}
          />

          <section className="space-y-2 text-center sm:space-y-3">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Text or Markdown to PDF
            </h1>
            <p className="mx-auto max-w-2xl text-sm text-muted-foreground sm:text-base">
              Paste text or Markdown, or upload .txt/.md files, then generate a downloadable PDF.
              Processing is local in your browser and files never leave your device.
            </p>
          </section>

          <ToolHelperPanel
            uploadHint="Paste content into the editor or load a .txt/.md file from your device."
            resultHint="Generate and download a PDF with wrapped text and simple Markdown styling."
            limitationNote="Markdown support is intentionally simple. Complex Markdown features are not fully preserved."
          />

          <TextToPdfTool />
        </div>

        <ToolRelatedLinks toolSlug="text-to-pdf" className="mt-8" />
      </main>
    </div>
  )
}
