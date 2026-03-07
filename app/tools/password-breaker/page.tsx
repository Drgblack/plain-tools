import type { Metadata } from "next"
import { ToolRelatedLinks } from "@/components/seo/tool-related-links"
import { ToolJsonLd } from "@/components/seo/tool-json-ld"
import { PageBreadcrumbs } from "@/components/seo/page-breadcrumbs"
import { ToolHelperPanel } from "@/components/tools/tool-helper-panel"
import { buildPageMetadata } from "@/lib/page-metadata"

import PasswordBreakerTool from "@/components/tools/password-breaker-tool"

export const metadata: Metadata = buildPageMetadata({
  title: "Recover PDF Password Access Locally",
  description:
    "Attempt authorised local recovery of password-protected PDFs using known-password and bounded brute-force modes in your browser.",
  path: "/tools/password-breaker",
  image: "/og/tools.png",
})

export default function PasswordBreakerPage() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-background">
      <ToolJsonLd toolSlug="password-breaker" />
      

      <main className="flex-1 px-4 py-8 sm:py-10">
        <div className="mx-auto max-w-4xl space-y-6">
          <PageBreadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Tools", href: "/tools" },
              { label: "Password Breaker" },
            ]}
          />
          <section className="space-y-2 text-center sm:space-y-3">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Plain Password Breaker
            </h1>
            <p className="mx-auto max-w-3xl text-sm text-muted-foreground sm:text-base">
              Recover your own protected PDF locally using a known password or bounded brute-force search. Files never
              leave your device.
            </p>
          </section>

          <ToolHelperPanel
            uploadHint="Upload one password-protected PDF that you are authorised to unlock."
            resultHint="Download an unlocked PDF after successful known-password or bounded brute-force recovery."
            limitationNote="This is best-effort and can take significant time for complex passwords. Use only on files you own or are authorised to process."
          />

          <PasswordBreakerTool />
        </div>
                <ToolRelatedLinks toolSlug="password-breaker" className="mt-8" />
      </main>

      
    </div>
  )
}

