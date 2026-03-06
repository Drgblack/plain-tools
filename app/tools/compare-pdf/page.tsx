import type { Metadata } from "next"

import ComparePdfTool from "@/components/tools/compare-pdf-tool"
import { ToolJsonLd } from "@/components/seo/tool-json-ld"
import { ToolRelatedLinks } from "@/components/seo/tool-related-links"
import { PageBreadcrumbs } from "@/components/seo/page-breadcrumbs"
import { ToolHelperPanel } from "@/components/tools/tool-helper-panel"
import { buildPageMetadata } from "@/lib/page-metadata"

export const metadata: Metadata = buildPageMetadata({
  title: "Compare PDF Files Locally - No Upload",
  description:
    "Compare two PDF files using local text extraction and diff highlighting in your browser. Review page-by-page changes with no upload step.",
  path: "/tools/compare-pdf",
  image: "/og/tools.png",
})

export default function ComparePdfPage() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-background">
      <ToolJsonLd toolSlug="compare-pdf" />

      <main className="flex-1 px-4 py-8 sm:py-10">
        <div className="mx-auto max-w-6xl space-y-6">
          <PageBreadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Tools", href: "/tools" },
              { label: "Compare PDF Files" },
            ]}
          />

          <section className="space-y-2 text-center sm:space-y-3">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Compare PDF Files
            </h1>
            <p className="mx-auto max-w-3xl text-sm text-muted-foreground sm:text-base">
              Compare two PDFs with local text extraction and highlight differences page-by-page.
              Processing stays in your browser and files never leave your device.
            </p>
          </section>

          <ToolHelperPanel
            uploadHint="Upload two PDF files. The first is treated as the base version and the second as the updated version."
            resultHint="Run comparison to view side-by-side differences and word-level changes."
            limitationNote="This is a best-effort text diff. Visual-only layout changes are not detected unless extracted text changes."
          />

          <ComparePdfTool />
        </div>

        <ToolRelatedLinks toolSlug="compare-pdf" className="mt-8" />
      </main>
    </div>
  )
}

