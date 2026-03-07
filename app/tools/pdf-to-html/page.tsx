import type { Metadata } from "next"

import PdfToHtmlTool from "@/components/tools/pdf-to-html-tool"
import { ToolJsonLd } from "@/components/seo/tool-json-ld"
import { ToolRelatedLinks } from "@/components/seo/tool-related-links"
import { ToolFaqSectionBySlug, ToolSeoContentBySlug } from "@/components/tool-seo-content"
import { PageBreadcrumbs } from "@/components/seo/page-breadcrumbs"
import { ToolHelperPanel } from "@/components/tools/tool-helper-panel"
import { buildPageMetadata } from "@/lib/page-metadata"

export const metadata: Metadata = buildPageMetadata({
  title: "PDF to HTML Locally - No Upload",
  description:
    "Convert PDF files to downloadable HTML locally in your browser. Extract text, optionally embed page images, and export without uploading your file.",
  path: "/tools/pdf-to-html",
  image: "/og/tools.png",
})

export default function PdfToHtmlPage() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-background">
      <ToolJsonLd toolSlug="pdf-to-html" />

      <main className="flex-1 px-4 py-8 sm:py-10">
        <div className="mx-auto max-w-6xl space-y-6">
          <PageBreadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Tools", href: "/tools" },
              { label: "PDF to HTML" },
            ]}
          />

          <section className="space-y-2 text-center sm:space-y-3">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              PDF to HTML
            </h1>
            <p className="mx-auto max-w-3xl text-sm text-muted-foreground sm:text-base">
              Convert PDFs into HTML with extracted page text and optional embedded page snapshots.
              Processing stays local in your browser. Files never leave your device.
            </p>
          </section>

          <ToolSeoContentBySlug toolSlug="pdf-to-html" />

          <ToolHelperPanel
            uploadHint="Upload one PDF from your device. Large files can take longer to render."
            resultHint="Download a single .html file containing extracted text and optional page preview images."
            limitationNote="This is a best-effort conversion. Complex layout positioning and fonts may differ from the source PDF."
          />

          <PdfToHtmlTool />

          <ToolFaqSectionBySlug toolSlug="pdf-to-html" className="mt-6" />
        </div>

        <ToolRelatedLinks toolSlug="pdf-to-html" className="mt-8" />
      </main>
    </div>
  )
}
