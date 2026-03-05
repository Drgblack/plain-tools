import type { Metadata } from "next"
import { ToolRelatedLinks } from "@/components/seo/tool-related-links"

import BatchEngineTool from "@/components/tools/batch-engine-tool"

export const metadata: Metadata = {
  title: "Plain Hardware-Accelerated Batch Engine",
  description:
    "Run local batch merge, compress, split, and convert operations in parallel browser workers with queue-level progress, private processing, and no uploads.",
  alternates: {
    canonical: "https://plain.tools/tools/batch-engine",
  },
  openGraph: {
    title: "Plain Hardware-Accelerated Batch Engine - Plain",
    description:
      "Process multiple PDFs in parallel local workers with private browser execution and no upload dependency.",
    url: "https://plain.tools/tools/batch-engine",
  },
}

export default function BatchEnginePage() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-background">
      

      <main className="flex-1 px-4 py-8 sm:py-10">
        <div className="mx-auto max-w-6xl space-y-6">
          <section className="space-y-2 text-center sm:space-y-3">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Plain Hardware-Accelerated Batch Engine
            </h1>
            <p className="mx-auto max-w-3xl text-sm text-muted-foreground sm:text-base">
              Process up to 20 PDFs in parallel using local browser workers for merge, compress, split, and convert workflows.
            </p>
          </section>

          <BatchEngineTool />
        </div>
                <ToolRelatedLinks toolSlug="batch-engine" className="mt-8" />
      </main>

      
    </div>
  )
}
