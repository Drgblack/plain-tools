import type { Metadata } from "next"
import { ToolRelatedLinks } from "@/components/seo/tool-related-links"
import { ToolJsonLd } from "@/components/seo/tool-json-ld"
import { ToolFaqSectionBySlug, ToolSeoContentBySlug } from "@/components/tool-seo-content"
import { PageBreadcrumbs } from "@/components/seo/page-breadcrumbs"
import { ToolHelperPanel } from "@/components/tools/tool-helper-panel"
import { buildPageMetadata } from "@/lib/page-metadata"

import BatchEngineTool from "@/components/tools/batch-engine-tool"

export const metadata: Metadata = buildPageMetadata({
  title: "Batch PDF Engine Locally - No Upload",
  description:
    "Run merge, compress, split, and conversion jobs in parallel browser workers with local processing and queue-level progress on Plain Tools.",
  path: "/tools/batch-engine",
  image: "/og/tools.png",
})

export default function BatchEnginePage() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-background">
      <ToolJsonLd toolSlug="batch-engine" />
      

      <main className="flex-1 px-4 py-8 sm:py-10">
        <div className="mx-auto max-w-6xl space-y-6">
          <PageBreadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Tools", href: "/tools" },
              { label: "Batch Engine" },
            ]}
          />
          <section className="space-y-2 text-center sm:space-y-3">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Plain Hardware-Accelerated Batch Engine
            </h1>
            <p className="mx-auto max-w-3xl text-sm text-muted-foreground sm:text-base">
              Process up to 20 PDFs in parallel using local browser workers for merge, compress, split, and convert workflows.
            </p>
          </section>

          <ToolSeoContentBySlug toolSlug="batch-engine" />

          <ToolHelperPanel
            uploadHint="Upload multiple PDFs and choose the same operation for the whole batch."
            resultHint="Download processed files per job, with queue-level progress and completion states."
            limitationNote="Performance depends on device memory and CPU. Large batches can take longer on low-power mobile hardware."
          />

          <BatchEngineTool />

          <ToolFaqSectionBySlug toolSlug="batch-engine" className="mt-6" />
        </div>
                <ToolRelatedLinks toolSlug="batch-engine" className="mt-8" />
      </main>

      
    </div>
  )
}
