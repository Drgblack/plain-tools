import type { Metadata } from "next"

import QrScannerTool from "@/components/tools/qr-scanner-tool"
import { ToolJsonLd } from "@/components/seo/tool-json-ld"
import { ToolRelatedLinks } from "@/components/seo/tool-related-links"
import { ToolFaqSectionBySlug, ToolSeoContentBySlug } from "@/components/tool-seo-content"
import { PageBreadcrumbs } from "@/components/seo/page-breadcrumbs"
import { ToolHelperPanel } from "@/components/tools/tool-helper-panel"
import { buildPageMetadata } from "@/lib/page-metadata"

export const metadata: Metadata = buildPageMetadata({
  title: "QR Code Scanner Locally - Camera or Image Upload",
  description:
    "Scan QR codes with camera access or image upload directly in your browser. Decode text and URLs locally with no uploads.",
  path: "/tools/qr-scanner",
  image: "/og/tools.png",
})

export default function QrScannerPage() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-background">
      <ToolJsonLd toolSlug="qr-scanner" />

      <main className="flex-1 px-4 py-8 sm:py-10">
        <div className="mx-auto max-w-6xl space-y-6">
          <PageBreadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Tools", href: "/tools" },
              { label: "QR Code Scanner" },
            ]}
          />

          <section className="space-y-2 text-center sm:space-y-3">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              QR Code Scanner
            </h1>
            <p className="mx-auto max-w-3xl text-sm text-muted-foreground sm:text-base">
              Decode QR codes from live camera preview or uploaded images with local browser processing.
              Decoded values stay in your current session and are never uploaded.
            </p>
          </section>

          <ToolSeoContentBySlug toolSlug="qr-scanner" />

          <ToolHelperPanel
            uploadHint="Use camera access for live scanning or upload a QR image from your device."
            resultHint="Decoded text or URL appears immediately, with copy and optional open-link actions."
            limitationNote="Requires Barcode Detection API support for camera/image decoding. Unsupported browsers may need a Chromium-based alternative."
          />

          <QrScannerTool />

          <ToolFaqSectionBySlug toolSlug="qr-scanner" className="mt-6" />
        </div>

        <ToolRelatedLinks toolSlug="qr-scanner" className="mt-8" />
      </main>
    </div>
  )
}
