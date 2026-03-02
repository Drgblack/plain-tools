import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ToolsSection } from "@/components/tools-section"

export const metadata: Metadata = {
  title: "PDF Tools",
  description:
    "Plain provides PDF tools that run locally in your browser. Merge, split, compress, and reorder pages without uploading files.",
  openGraph: {
    title: "PDF Tools - Plain",
    description: "Plain provides PDF tools that run locally in your browser without uploading files.",
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
