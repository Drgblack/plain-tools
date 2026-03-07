import type { Metadata } from "next"

import ZipTool from "@/components/tools/zip-tool"
import { ToolJsonLd } from "@/components/seo/tool-json-ld"
import { ToolRelatedLinks } from "@/components/seo/tool-related-links"
import { ToolFaqSectionBySlug, ToolSeoContentBySlug } from "@/components/tool-seo-content"
import { PageBreadcrumbs } from "@/components/seo/page-breadcrumbs"
import { ToolHelperPanel } from "@/components/tools/tool-helper-panel"
import { buildPageMetadata } from "@/lib/page-metadata"

export const metadata: Metadata = buildPageMetadata({
  title: "ZIP Extract & Create Locally - No Upload",
  description:
    "Extract ZIP archives and create new ZIP files directly in your browser. Select files, download individually, or export bundled ZIP output with local processing.",
  path: "/tools/zip-tool",
  image: "/og/tools.png",
})

export default function ZipToolPage() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-background">
      <ToolJsonLd toolSlug="zip-tool" />

      <main className="flex-1 px-4 py-8 sm:py-10">
        <div className="mx-auto max-w-6xl space-y-6">
          <PageBreadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Tools", href: "/tools" },
              { label: "ZIP Extract & Create" },
            ]}
          />

          <section className="space-y-2 text-center sm:space-y-3">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              ZIP Extract & Create
            </h1>
            <p className="mx-auto max-w-3xl text-sm text-muted-foreground sm:text-base">
              Extract files from ZIP archives and create new ZIP bundles in your browser.
              Choose files, download individual entries, or export selected outputs as a ZIP.
              Files never leave your device.
            </p>
          </section>

          <ToolSeoContentBySlug toolSlug="zip-tool" />

          <ToolHelperPanel
            uploadHint="Extract mode accepts one .zip archive. Create mode accepts multiple files of any type."
            resultHint="Download individual extracted files, a selected ZIP bundle, or a new ZIP archive you create."
            limitationNote="Best-effort archive handling for common ZIP files. Encrypted archives are not supported in this basic tool."
          />

          <ZipTool />

          <ToolFaqSectionBySlug toolSlug="zip-tool" className="mt-6" />
        </div>

        <ToolRelatedLinks toolSlug="zip-tool" className="mt-8" />
      </main>
    </div>
  )
}
