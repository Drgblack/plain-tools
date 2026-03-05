import type { Metadata } from "next"
import { ToolRelatedLinks } from "@/components/seo/tool-related-links"

import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
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
      <Header />

      <main className="flex-1 px-4 py-8 sm:py-10">
        <div className="mx-auto max-w-4xl space-y-6">
          <section className="space-y-2 text-center sm:space-y-3">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Plain Password Breaker
            </h1>
            <p className="mx-auto max-w-3xl text-sm text-muted-foreground sm:text-base">
              Recover your own protected PDF locally using a known password or bounded brute-force search. Files never
              leave your device.
            </p>
          </section>

          <PasswordBreakerTool />
        </div>
                <ToolRelatedLinks toolSlug="password-breaker" className="mt-8" />
      </main>

      <Footer />
    </div>
  )
}

