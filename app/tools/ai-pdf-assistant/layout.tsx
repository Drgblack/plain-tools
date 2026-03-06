import type { Metadata } from "next"

import { buildPageMetadata } from "@/lib/page-metadata"

export const metadata: Metadata = buildPageMetadata({
  title: "AI PDF Assistant - Summarise and Ask Questions | Plain Tools",
  description:
    "Summarise PDFs and ask document questions with Plain Tools. Extraction starts locally and AI responses run only after explicit opt-in.",
  path: "/tools/ai-pdf-assistant",
  image: "/og/tools.png",
})

export default function AIPdfAssistantLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
