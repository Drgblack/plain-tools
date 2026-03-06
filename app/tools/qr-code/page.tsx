import type { Metadata } from "next"

import QrCodeTool from "@/components/tools/qr-code-tool"
import { ToolJsonLd } from "@/components/seo/tool-json-ld"
import { ToolRelatedLinks } from "@/components/seo/tool-related-links"
import { PageBreadcrumbs } from "@/components/seo/page-breadcrumbs"
import { ToolHelperPanel } from "@/components/tools/tool-helper-panel"
import { buildPageMetadata } from "@/lib/page-metadata"

export const metadata: Metadata = buildPageMetadata({
  title: "QR Code Generator Locally - No Upload",
  description:
    "Generate QR codes for URLs or text in your browser with custom size, error correction, and colours. Download PNG or SVG locally.",
  path: "/tools/qr-code",
  image: "/og/tools.png",
})

export default function QrCodePage() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-background">
      <ToolJsonLd toolSlug="qr-code" />

      <main className="flex-1 px-4 py-8 sm:py-10">
        <div className="mx-auto max-w-3xl space-y-6">
          <PageBreadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Tools", href: "/tools" },
              { label: "QR Code Generator" },
            ]}
          />

          <section className="space-y-2 text-center sm:space-y-3">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              QR Code Generator
            </h1>
            <p className="mx-auto max-w-2xl text-sm text-muted-foreground sm:text-base">
              Generate scannable QR codes for links or text with configurable size, error correction,
              and colours. Processing stays local in your browser.
            </p>
          </section>

          <ToolHelperPanel
            uploadHint="Paste URL or text content. File upload is not required for this utility."
            resultHint="Preview the QR code, then download it as PNG or SVG."
            limitationNote="QR output is generated locally and best suited for standard URLs and short text payloads."
          />

          <QrCodeTool />
        </div>

        <ToolRelatedLinks toolSlug="qr-code" className="mt-8" />
      </main>
    </div>
  )
}
