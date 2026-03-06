import type { Metadata } from "next"
import { ToolRelatedLinks } from "@/components/seo/tool-related-links"
import { ToolJsonLd } from "@/components/seo/tool-json-ld"

import MetadataPurgeTool from "@/components/tools/metadata-purge-tool"

export const metadata: Metadata = {
  title: "Plain Metadata Purge",
  description: "Inspect and remove PDF metadata locally, including XMP and Info Dictionary fields, before sharing documents outside your trusted environment. Built for.",
  alternates: {
    canonical: "https://plain.tools/tools/metadata-purge",
  },
  openGraph: {
    title: "Plain Metadata Purge - Plain",
    description:
      "Inspect and purge PDF metadata fields locally with no upload requirement and clear before/after visibility.",
    url: "https://plain.tools/tools/metadata-purge",
  },
}

export default function MetadataPurgePage() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-background">
      <ToolJsonLd toolSlug="metadata-purge" />
      

      <main className="flex-1 px-4 py-8 sm:py-10">
        <div className="mx-auto max-w-4xl space-y-6">
          <section className="space-y-2 text-center sm:space-y-3">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Plain Metadata Purge
            </h1>
            <p className="mx-auto max-w-3xl text-sm text-muted-foreground sm:text-base">
              Review every tracked metadata field before removal. Purge selected fields locally and download a cleaned PDF.
            </p>
          </section>

          <MetadataPurgeTool />
        </div>
                <ToolRelatedLinks toolSlug="metadata-purge" className="mt-8" />
      </main>

      
    </div>
  )
}

