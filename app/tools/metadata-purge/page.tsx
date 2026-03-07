import type { Metadata } from "next"
import { ToolRelatedLinks } from "@/components/seo/tool-related-links"
import { ToolJsonLd } from "@/components/seo/tool-json-ld"
import { PageBreadcrumbs } from "@/components/seo/page-breadcrumbs"
import { ToolHelperPanel } from "@/components/tools/tool-helper-panel"
import { buildPageMetadata } from "@/lib/page-metadata"

import MetadataPurgeTool from "@/components/tools/metadata-purge-tool"

export const metadata: Metadata = buildPageMetadata({
  title: "Remove PDF Metadata Locally - No Upload",
  description:
    "Inspect and remove PDF metadata fields such as XMP and document info locally in your browser before sharing sensitive files.",
  path: "/tools/metadata-purge",
  image: "/og/tools.png",
})

export default function MetadataPurgePage() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-background">
      <ToolJsonLd toolSlug="metadata-purge" />
      

      <main className="flex-1 px-4 py-8 sm:py-10">
        <div className="mx-auto max-w-4xl space-y-6">
          <PageBreadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Tools", href: "/tools" },
              { label: "Metadata Purge" },
            ]}
          />
          <section className="space-y-2 text-center sm:space-y-3">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Plain Metadata Purge
            </h1>
            <p className="mx-auto max-w-3xl text-sm text-muted-foreground sm:text-base">
              Review every tracked metadata field before removal. Purge selected fields locally and download a cleaned PDF.
            </p>
          </section>

          <ToolHelperPanel
            uploadHint="Upload one PDF to inspect document info, XMP metadata, and embedded metadata fields."
            resultHint="Download a cleaned PDF after removing selected metadata fields."
            limitationNote="Some third-party viewers may cache metadata previews. Reopen the new file in a fresh viewer session to confirm removals."
          />

          <MetadataPurgeTool />
        </div>
                <ToolRelatedLinks toolSlug="metadata-purge" className="mt-8" />
      </main>

      
    </div>
  )
}

