import type { Metadata } from "next"

import AnnotatePdfTool from "@/components/tools/annotate-pdf-tool"
import { ToolJsonLd } from "@/components/seo/tool-json-ld"
import { ToolRelatedLinks } from "@/components/seo/tool-related-links"
import { PageBreadcrumbs } from "@/components/seo/page-breadcrumbs"
import { ToolHelperPanel } from "@/components/tools/tool-helper-panel"
import { buildPageMetadata } from "@/lib/page-metadata"

export const metadata: Metadata = buildPageMetadata({
  title: "Annotate PDF Locally - No Upload",
  description:
    "Annotate PDF files locally with pen, highlight, and text tools. Add comments on page overlays and download your annotated PDF without uploading files.",
  path: "/tools/annotate-pdf",
  image: "/og/tools.png",
})

export default function AnnotatePdfPage() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-background">
      <ToolJsonLd toolSlug="annotate-pdf" />

      <main className="flex-1 px-4 py-8 sm:py-10">
        <div className="mx-auto max-w-6xl space-y-6">
          <PageBreadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Tools", href: "/tools" },
              { label: "Annotate PDF" },
            ]}
          />

          <section className="space-y-2 text-center sm:space-y-3">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Annotate PDF
            </h1>
            <p className="mx-auto max-w-3xl text-sm text-muted-foreground sm:text-base">
              Add pen marks, transparent highlights, and text labels on PDF pages with a local overlay
              workspace. Processing stays in your browser and files never leave your device.
            </p>
          </section>

          <ToolHelperPanel
            uploadHint="Upload one PDF and select a page to annotate with pen, highlight, or text tools."
            resultHint="Apply annotations to embed them into a new PDF, then download the annotated file."
            limitationNote="This is a best-effort local annotator and does not include threaded comments or collaborative review."
          />

          <AnnotatePdfTool />
        </div>

        <ToolRelatedLinks toolSlug="annotate-pdf" className="mt-8" />
      </main>
    </div>
  )
}

