import type { Metadata } from "next"
import { ToolRelatedLinks } from "@/components/seo/tool-related-links"
import { ToolJsonLd } from "@/components/seo/tool-json-ld"
import { ToolFaqSectionBySlug, ToolSeoContentBySlug } from "@/components/tool-seo-content"
import { PageBreadcrumbs } from "@/components/seo/page-breadcrumbs"
import { ToolHelperPanel } from "@/components/tools/tool-helper-panel"
import { buildPageMetadata } from "@/lib/page-metadata"

import LocalSignerTool from "@/components/tools/local-signer-tool"

export const metadata: Metadata = buildPageMetadata({
  title: "Local Cryptographic PDF Signer - Private",
  description:
    "Create cryptographic and visual PDF signatures locally in your browser with private key handling, verification support, and no upload exposure.",
  path: "/tools/local-signer",
  image: "/og/tools.png",
})

export default function LocalSignerPage() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-background">
      <ToolJsonLd toolSlug="local-signer" />
      

      <main className="flex-1 px-4 py-8 sm:py-10">
        <div className="mx-auto max-w-5xl space-y-6">
          <PageBreadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Tools", href: "/tools" },
              { label: "Local Cryptographic Signer" },
            ]}
          />
          <section className="space-y-2 text-center sm:space-y-3">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Plain Local Cryptographic Signer
            </h1>
            <p className="mx-auto max-w-3xl text-sm text-muted-foreground sm:text-base">
              Add a visual signature and a locally verifiable cryptographic signature envelope to your PDF without uploading
              files.
            </p>
          </section>

          <ToolSeoContentBySlug toolSlug="local-signer" />

          <ToolHelperPanel
            uploadHint="Upload one PDF and choose a signature source (draw, typed, or image)."
            resultHint="Download a signed PDF and keep verification artefacts for audit trails."
            limitationNote="Viewer support for signature validation varies. Always verify in your target PDF reader before final distribution."
          />

          <LocalSignerTool />

          <ToolFaqSectionBySlug toolSlug="local-signer" className="mt-6" />
        </div>
                <ToolRelatedLinks toolSlug="local-signer" className="mt-8" />
      </main>

      
    </div>
  )
}

