import type { Metadata } from "next"

import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import LocalSignerTool from "@/components/tools/local-signer-tool"

export const metadata: Metadata = {
  title: "Plain Local Cryptographic Signer",
  description: "Create locally verifiable cryptographic PDF signatures in your browser with visual placement controls, verification support, and no upload exposure. Built for.",
  alternates: {
    canonical: "https://plain.tools/tools/plain-local-cryptographic-signer",
  },
  openGraph: {
    title: "Plain Local Cryptographic Signer - Plain",
    description:
      "Draw, type, or upload a visual signature and apply cryptographic PDF signing locally with private browser processing.",
    url: "https://plain.tools/tools/plain-local-cryptographic-signer",
  },
}

export default function LocalSignerPage() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-background">
      <Header />

      <main className="flex-1 px-4 py-8 sm:py-10">
        <div className="mx-auto max-w-5xl space-y-6">
          <section className="space-y-2 text-center sm:space-y-3">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Plain Local Cryptographic Signer
            </h1>
            <p className="mx-auto max-w-3xl text-sm text-muted-foreground sm:text-base">
              Add a visual signature and a locally verifiable cryptographic signature envelope to your PDF without uploading
              files.
            </p>
          </section>

          <LocalSignerTool />
        </div>
      </main>

      <Footer />
    </div>
  )
}

