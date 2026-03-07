import type { Metadata } from "next"

import FileHashTool from "@/components/tools/file-hash-tool"
import { ToolJsonLd } from "@/components/seo/tool-json-ld"
import { ToolRelatedLinks } from "@/components/seo/tool-related-links"
import { ToolFaqSectionBySlug, ToolSeoContentBySlug } from "@/components/tool-seo-content"
import { PageBreadcrumbs } from "@/components/seo/page-breadcrumbs"
import { ToolHelperPanel } from "@/components/tools/tool-helper-panel"
import { buildPageMetadata } from "@/lib/page-metadata"

export const metadata: Metadata = buildPageMetadata({
  title: "File Hash / Checksum Locally - No Upload",
  description:
    "Generate SHA-256, MD5, SHA-1, and SHA-512 checksums for files in your browser. Local-only hashing with no uploads.",
  path: "/tools/file-hash",
  image: "/og/tools.png",
})

export default function FileHashPage() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-background">
      <ToolJsonLd toolSlug="file-hash" />

      <main className="flex-1 px-4 py-8 sm:py-10">
        <div className="mx-auto max-w-3xl space-y-6">
          <PageBreadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Tools", href: "/tools" },
              { label: "File Hash / Checksum" },
            ]}
          />

          <section className="space-y-2 text-center sm:space-y-3">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              File Hash / Checksum
            </h1>
            <p className="mx-auto max-w-2xl text-sm text-muted-foreground sm:text-base">
              Compute file checksums using SHA-256, MD5, SHA-1, or SHA-512.
              Everything runs locally in your browser. Files never leave your device.
            </p>
          </section>

          <ToolSeoContentBySlug toolSlug="file-hash" />

          <ToolHelperPanel
            uploadHint="Upload any file type and choose the checksum algorithm."
            resultHint="Copy the resulting hex digest for integrity checks or file comparison."
            limitationNote="Checksums verify integrity but do not encrypt files. SHA-256 is recommended for modern workflows."
          />

          <FileHashTool />

          <ToolFaqSectionBySlug toolSlug="file-hash" className="mt-6" />
        </div>

        <ToolRelatedLinks toolSlug="file-hash" className="mt-8" />
      </main>
    </div>
  )
}
