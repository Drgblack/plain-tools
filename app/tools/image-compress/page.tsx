import type { Metadata } from "next"

import ImageCompressTool from "@/components/tools/image-compress-tool"
import { ToolJsonLd } from "@/components/seo/tool-json-ld"
import { ToolRelatedLinks } from "@/components/seo/tool-related-links"
import { PageBreadcrumbs } from "@/components/seo/page-breadcrumbs"
import { ToolHelperPanel } from "@/components/tools/tool-helper-panel"
import { buildPageMetadata } from "@/lib/page-metadata"

export const metadata: Metadata = buildPageMetadata({
  title: "Image Compressor / Optimizer Locally - No Upload",
  description:
    "Compress JPG, PNG, and WebP images locally in your browser with quality controls, before/after preview, and batch ZIP download. No uploads.",
  path: "/tools/image-compress",
  image: "/og/tools.png",
})

export default function ImageCompressPage() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-background">
      <ToolJsonLd toolSlug="image-compress" />

      <main className="flex-1 px-4 py-8 sm:py-10">
        <div className="mx-auto max-w-6xl space-y-6">
          <PageBreadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Tools", href: "/tools" },
              { label: "Image Compressor / Optimizer" },
            ]}
          />

          <section className="space-y-2 text-center sm:space-y-3">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Image Compressor / Optimizer
            </h1>
            <p className="mx-auto max-w-3xl text-sm text-muted-foreground sm:text-base">
              Compress JPG, PNG, and WebP images locally with quality and size controls.
              Preview before and after output, then download single files or batch ZIP output.
              Files never leave your device.
            </p>
          </section>

          <ToolHelperPanel
            uploadHint="Upload one or more JPG, PNG, or WebP images."
            resultHint="Use Compress & Download, review before/after previews, then download files or ZIP."
            limitationNote="Best-effort optimisation. PNG files are exported as WebP for stronger size reduction."
          />

          <ImageCompressTool />
        </div>

        <ToolRelatedLinks toolSlug="image-compress" className="mt-8" />
      </main>
    </div>
  )
}
