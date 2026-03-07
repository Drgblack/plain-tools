import type { Metadata } from "next"

import HtmlToPdfTool from "@/components/tools/html-to-pdf-tool"
import { ToolJsonLd } from "@/components/seo/tool-json-ld"
import { ToolRelatedLinks } from "@/components/seo/tool-related-links"
import { PageBreadcrumbs } from "@/components/seo/page-breadcrumbs"
import { ToolHelperPanel } from "@/components/tools/tool-helper-panel"
import { buildPageMetadata } from "@/lib/page-metadata"

export const metadata: Metadata = buildPageMetadata({
  title: "HTML to PDF Locally - No Upload",
  description:
    "Convert pasted HTML or fetched web content to PDF locally in your browser. Best-effort rendering with fallback output and no file upload step.",
  path: "/tools/html-to-pdf",
  image: "/og/tools.png",
})

export default function HtmlToPdfPage() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-background">
      <ToolJsonLd toolSlug="html-to-pdf" />

      <main className="flex-1 px-4 py-8 sm:py-10">
        <div className="mx-auto max-w-3xl space-y-6">
          <PageBreadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Tools", href: "/tools" },
              { label: "HTML to PDF" },
            ]}
          />

          <section className="space-y-2 text-center sm:space-y-3">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              HTML to PDF
            </h1>
            <p className="mx-auto max-w-2xl text-sm text-muted-foreground sm:text-base">
              Paste HTML markup or fetch web content, then export a PDF in your browser. Conversion
              runs locally. Files never leave your device.
            </p>
          </section>

          <ToolHelperPanel
            uploadHint="Use pasted HTML or URL fetch mode. URL fetch can fail on sites that block cross-origin requests."
            resultHint="Generate and download a best-effort PDF from rendered HTML content."
            limitationNote="Complex CSS, scripts, and external assets may not render exactly. Text-only fallback is used when needed."
          />

          <HtmlToPdfTool />
        </div>

        <ToolRelatedLinks toolSlug="html-to-pdf" className="mt-8" />
      </main>
    </div>
  )
}
