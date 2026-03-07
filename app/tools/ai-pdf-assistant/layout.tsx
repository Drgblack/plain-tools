import type { Metadata } from "next"

import { buildPageMetadata } from "@/lib/page-metadata"

export const metadata: Metadata = {
  ...buildPageMetadata({
    title: "AI PDF Assistant - Opt-in Analysis",
    description:
      "Summarise PDFs and ask document questions with local extraction first, then optional server-side AI response when explicitly enabled.",
    path: "/tools/ai-pdf-assistant",
    image: "/og/tools.png",
  }),
  robots: {
    index: false,
    follow: false,
  },
}

export default function AIPdfAssistantLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

