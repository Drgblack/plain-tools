import type { Metadata } from "next"
import Link from "next/link"
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
  const popularTools = [
    { label: "Merge PDF", href: "/tools/merge-pdf" },
    { label: "Split PDF", href: "/tools/split-pdf" },
    { label: "Compress PDF", href: "/tools/compress-pdf" },
    { label: "OCR PDF", href: "/tools/ocr-pdf" },
    { label: "Protect PDF", href: "/tools/protect-pdf" },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="flex-1">
        <section className="border-b border-border px-4 py-6">
          <div className="mx-auto max-w-6xl space-y-3">
            <p className="text-sm text-muted-foreground">
              Plain PDF tools run locally in your browser. Files never leave your device.
            </p>
            <div className="flex flex-wrap gap-2">
              {popularTools.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="rounded-full border border-border bg-card px-3 py-1.5 text-xs text-foreground transition hover:border-accent/40 hover:text-accent"
                >
                  {tool.label}
                </Link>
              ))}
            </div>
          </div>
        </section>

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
    </div>
  )
}

