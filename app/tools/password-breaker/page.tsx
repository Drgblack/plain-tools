import type { Metadata } from "next"
import { ToolRelatedLinks } from "@/components/seo/tool-related-links"
import { ToolJsonLd } from "@/components/seo/tool-json-ld"
import { PageBreadcrumbs } from "@/components/seo/page-breadcrumbs"
import { ToolHelperPanel } from "@/components/tools/tool-helper-panel"

import PasswordBreakerTool from "@/components/tools/password-breaker-tool"

export const metadata: Metadata = {
  title: "Plain Password Breaker",
  description: "Recover access to your own password-protected PDFs locally with known-password and bounded brute-force modes using private browser execution. Built for.",
  alternates: {
    canonical: "https://plain.tools/tools/password-breaker",
  },
  openGraph: {
    title: "Plain Password Breaker - Plain",
    description:
      "Attempt local PDF password recovery using known-password or bounded brute-force controls with no file uploads.",
    url: "https://plain.tools/tools/password-breaker",
  },
}

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

