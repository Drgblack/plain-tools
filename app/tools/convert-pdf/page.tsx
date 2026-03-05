import type { Metadata } from "next"
import { ToolRelatedLinks } from "@/components/seo/tool-related-links"

import ConvertTool from "@/components/tools/convert-tool"

export const metadata: Metadata = {
  title: "Convert PDF",
  description: "Convert PDF files to page images or extracted text locally in your browser with page-level progress and no upload or server processing requirements. Built for.",
  alternates: {
    canonical: "https://plain.tools/tools/convert-pdf",
  },
  openGraph: {
    title: "Convert PDF - Plain",
    description:
      "Convert PDF pages to PNG/JPEG or extract TXT output locally with private browser processing and no file uploads.",
    url: "https://plain.tools/tools/convert-pdf",
  },
}

export default function ConvertPdfPage() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-background">
      

      <main className="flex-1 px-4 py-8 sm:py-10">
        <div className="mx-auto max-w-3xl space-y-6">
          <section className="space-y-2 text-center sm:space-y-3">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Convert PDF
            </h1>
            <p className="mx-auto max-w-2xl text-sm text-muted-foreground sm:text-base">
              Convert PDF pages to PNG/JPEG or extract all text into a plain TXT file. Everything runs locally on your device.
            </p>
          </section>

          <ConvertTool />
        </div>
                <ToolRelatedLinks toolSlug="convert-pdf" className="mt-8" />
      </main>

      
    </div>
  )
}

