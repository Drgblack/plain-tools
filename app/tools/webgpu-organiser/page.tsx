import type { Metadata } from "next"

import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import WebgpuOrganiserTool from "@/components/tools/webgpu-organiser-tool"

export const metadata: Metadata = {
  title: "Plain WebGPU Page Organiser",
  description:
    "Reorder, delete, rotate, duplicate, and bulk-edit PDF pages locally with visual thumbnails.",
  alternates: {
    canonical: "https://plain.tools/tools/plain-webgpu-page-organiser",
  },
  openGraph: {
    title: "Plain WebGPU Page Organiser - Plain",
    description:
      "Organise PDF pages in a thumbnail grid locally in your browser. No uploads.",
    url: "https://plain.tools/tools/plain-webgpu-page-organiser",
  },
}

export default function WebgpuOrganiserPage() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-background">
      <Header />

      <main className="flex-1 px-4 py-8 sm:py-10">
        <div className="mx-auto max-w-6xl space-y-6">
          <section className="space-y-2 text-center sm:space-y-3">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Plain WebGPU Page Organiser
            </h1>
            <p className="mx-auto max-w-3xl text-sm text-muted-foreground sm:text-base">
              Reorder, delete, rotate, duplicate, and bulk edit PDF pages with local thumbnail previews.
            </p>
          </section>

          <WebgpuOrganiserTool />
        </div>
      </main>

      <Footer />
    </div>
  )
}
