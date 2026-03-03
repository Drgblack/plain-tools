import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ToolsSection } from "@/components/tools-section"

export const metadata: Metadata = {
  title: "PDF Tools",
  description:
    "Browse Plain's full offline PDF suite for merge, split, compress, convert, OCR, redaction, signing, and AI-assisted workflows with no upload requirements.",
  openGraph: {
    title: "PDF Tools - Plain",
    description:
      "Browse Plain's offline PDF suite for merge, split, compress, convert, OCR, redaction, and signing with private client-side processing.",
  },
  alternates: {
    canonical: "https://plain.tools/tools",
  },
}

export default function ToolsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1">
        <ToolsSection />

        <section className="border-t border-border px-4 py-12">
          <div className="mx-auto max-w-3xl">
            <p className="text-sm leading-relaxed text-muted-foreground">
              Plain provides offline PDF tools designed for privacy-conscious
              users. All tools run locally in the browser without uploading
              files to external servers.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
