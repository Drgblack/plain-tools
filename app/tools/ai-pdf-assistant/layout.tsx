import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "AI PDF Assistant – Plain",
  description: "Use Plain's AI PDF assistant workflow with local text extraction and explicit opt-in processing boundaries for summary, Q&A, and editing support. Built for.",
  openGraph: {
    title: "AI PDF Assistant – Plain",
    description:
      "Run AI-assisted PDF workflows with local extraction, consent controls, and clear privacy boundaries before any server processing.",
  },
  alternates: {
    canonical: "https://plain.tools/tools/ai-pdf-assistant",
  },
}

export default function AiPdfAssistantLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}


