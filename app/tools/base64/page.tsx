import type { Metadata } from "next"

import Base64Tool from "@/components/tools/base64-tool"
import { ToolJsonLd } from "@/components/seo/tool-json-ld"
import { ToolRelatedLinks } from "@/components/seo/tool-related-links"
import { PageBreadcrumbs } from "@/components/seo/page-breadcrumbs"
import { ToolHelperPanel } from "@/components/tools/tool-helper-panel"
import { buildPageMetadata } from "@/lib/page-metadata"

export const metadata: Metadata = buildPageMetadata({
  title: "Base64 Encode / Decode Locally - No Upload",
  description:
    "Encode or decode Base64 for text and files in your browser. Convert files to Base64 and decode Base64 into downloadable files with local processing.",
  path: "/tools/base64",
  image: "/og/tools.png",
})

export default function Base64Page() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-background">
      <ToolJsonLd toolSlug="base64" />

      <main className="flex-1 px-4 py-8 sm:py-10">
        <div className="mx-auto max-w-3xl space-y-6">
          <PageBreadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Tools", href: "/tools" },
              { label: "Base64 Encode / Decode" },
            ]}
          />

          <section className="space-y-2 text-center sm:space-y-3">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Base64 Encode / Decode
            </h1>
            <p className="mx-auto max-w-2xl text-sm text-muted-foreground sm:text-base">
              Encode text or files to Base64, then decode Base64 back into text or downloadable files.
              Everything runs locally in your browser. Files never leave your device.
            </p>
          </section>

          <ToolHelperPanel
            uploadHint="Use text input or drop a file. File processing uses browser APIs and runs locally."
            resultHint="Copy Base64 output, download it as a text file, or decode Base64 into a file download."
            limitationNote="Base64 increases file size and does not encrypt content. Treat encoded data as plain data."
          />

          <Base64Tool />
        </div>

        <ToolRelatedLinks toolSlug="base64" className="mt-8" />
      </main>
    </div>
  )
}
