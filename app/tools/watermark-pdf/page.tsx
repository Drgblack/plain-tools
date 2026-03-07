import type { Metadata } from "next"

import WatermarkPdfTool from "@/components/tools/watermark-pdf-tool"
import { ToolJsonLd } from "@/components/seo/tool-json-ld"
import { ToolRelatedLinks } from "@/components/seo/tool-related-links"
import { PageBreadcrumbs } from "@/components/seo/page-breadcrumbs"
import { ToolHelperPanel } from "@/components/tools/tool-helper-panel"
import { buildPageMetadata } from "@/lib/page-metadata"

export const metadata: Metadata = buildPageMetadata({
  title: "Add Watermark to PDF Locally - No Upload",
  description:
    "Add text or image watermarks to PDF pages locally in your browser. Control font size, opacity, position, colour, and rotation angle before download.",
  path: "/tools/watermark-pdf",
  image: "/og/tools.png",
})

export default function WatermarkPdfPage() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-background">
      <ToolJsonLd toolSlug="watermark-pdf" />

      <main className="flex-1 px-4 py-8 sm:py-10">
        <div className="mx-auto max-w-6xl space-y-6">
          <PageBreadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Tools", href: "/tools" },
              { label: "Add Watermark to PDF" },
            ]}
          />

          <section className="space-y-2 text-center sm:space-y-3">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Add Watermark to PDF
            </h1>
            <p className="mx-auto max-w-3xl text-sm text-muted-foreground sm:text-base">
              Apply text or image watermark overlays on every PDF page with configurable opacity,
              position, size, colour, and rotation angle. Processing runs locally in your browser.
              Files never leave your device.
            </p>
          </section>

          <ToolHelperPanel
            uploadHint="Upload one PDF, then choose text or image watermark mode and set placement options."
            resultHint="Apply the watermark and download a new PDF with overlays on each page."
            limitationNote="Watermarks are visual overlays and do not add cryptographic protection."
          />

          <WatermarkPdfTool />
        </div>

        <ToolRelatedLinks toolSlug="watermark-pdf" className="mt-8" />
      </main>
    </div>
  )
}
