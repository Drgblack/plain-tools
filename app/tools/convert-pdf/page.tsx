import type { Metadata } from "next"
import { ToolRelatedLinks } from "@/components/seo/tool-related-links"
import { ToolJsonLd } from "@/components/seo/tool-json-ld"
import { ToolFaqSectionBySlug, ToolSeoContentBySlug } from "@/components/tool-seo-content"
import { PageBreadcrumbs } from "@/components/seo/page-breadcrumbs"
import { ToolHelperPanel } from "@/components/tools/tool-helper-panel"
import { buildPageMetadata } from "@/lib/page-metadata"

import ConvertTool from "@/components/tools/convert-tool"

export const metadata: Metadata = buildPageMetadata({
  title: "Convert PDF Locally - No Upload",
  description:
    "Convert PDF pages to PNG, JPG, or TXT locally in your browser with page-level progress, private processing, and no upload requirement.",
  path: "/tools/convert-pdf",
  image: "/og/tools.png",
})

export default function ConvertPdfPage() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-background">
      <ToolJsonLd toolSlug="convert-pdf" />
      

      <main className="flex-1 px-4 py-8 sm:py-10">
        <div className="mx-auto max-w-3xl space-y-6">
          <PageBreadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Tools", href: "/tools" },
              { label: "Convert PDF" },
            ]}
          />
          <section className="space-y-2 text-center sm:space-y-3">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Convert PDF
            </h1>
            <p className="mx-auto max-w-2xl text-sm text-muted-foreground sm:text-base">
              Convert PDF pages to PNG/JPEG or extract all text into a plain TXT file. Everything runs locally on your device.
            </p>
          </section>

          <ToolSeoContentBySlug toolSlug="convert-pdf" />

          <ToolHelperPanel
            uploadHint="Upload one PDF. For long documents, allow extra time while each page is parsed."
            resultHint="Download page images (PNG/JPG) or a TXT export after conversion finishes."
            limitationNote="Complex layouts may not map perfectly to text output. Check page order and formatting before sharing."
          />

          <ConvertTool />

          <ToolFaqSectionBySlug toolSlug="convert-pdf" className="mt-6" />
        </div>
                <ToolRelatedLinks toolSlug="convert-pdf" className="mt-8" />
      </main>

      
    </div>
  )
}

