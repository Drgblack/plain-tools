import type { Metadata } from "next"

import { buildPageMetadata } from "@/lib/page-metadata"

export const metadata: Metadata = buildPageMetadata({
  title: "AI PDF assistant",
  description:
    "Summarise PDFs and ask focused document questions with explicit AI opt-in, local extraction first, and clear privacy boundaries before any remote inference.",
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
