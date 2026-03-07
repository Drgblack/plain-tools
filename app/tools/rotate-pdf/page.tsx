import type { Metadata } from "next"

import RotatePdfTool from "@/components/tools/rotate-pdf-tool"
import { ToolJsonLd } from "@/components/seo/tool-json-ld"
import { ToolRelatedLinks } from "@/components/seo/tool-related-links"
import { PageBreadcrumbs } from "@/components/seo/page-breadcrumbs"
import { ToolHelperPanel } from "@/components/tools/tool-helper-panel"
import { buildPageMetadata } from "@/lib/page-metadata"

export const metadata: Metadata = buildPageMetadata({
  title: "Rotate PDF Pages Locally - No Upload",
  description:
    "Rotate PDF pages locally with per-page thumbnails and 90° clockwise, 90° counterclockwise, or 180° controls. Apply globally or per page, then download.",
  path: "/tools/rotate-pdf",
  image: "/og/tools.png",
})

export default function RotatePdfPage() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-background">
      <ToolJsonLd toolSlug="rotate-pdf" />

      <main className="flex-1 px-4 py-8 sm:py-10">
        <div className="mx-auto max-w-6xl space-y-6">
          <PageBreadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Tools", href: "/tools" },
              { label: "Rotate PDF Pages" },
            ]}
          />
          <section className="space-y-2 text-center sm:space-y-3">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Rotate PDF Pages
            </h1>
            <p className="mx-auto max-w-3xl text-sm text-muted-foreground sm:text-base">
              Rotate pages with per-page thumbnail controls or global apply shortcuts for 90° clockwise,
              90° counterclockwise, and 180°. Previews and processing run locally in your browser.
              Files never leave your device.
            </p>
          </section>

          <ToolHelperPanel
            uploadHint="Upload one PDF to render page thumbnails and configure per-page or global rotation."
            resultHint="Use Rotate & Download to export a new rotated PDF."
            limitationNote="Rotation modifies page orientation only. It does not reorder or crop page content."
          />

          <RotatePdfTool />
        </div>

        <ToolRelatedLinks toolSlug="rotate-pdf" className="mt-8" />
      </main>
    </div>
  )
}
