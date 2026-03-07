import type { Metadata } from "next"

import { buildPageMetadata } from "@/lib/page-metadata"

export const metadata: Metadata = buildPageMetadata({
  title: "Extract PDF Pages Locally - No Upload",
  description:
    "Extract selected PDF pages or ranges locally in your browser, then download one combined PDF or separate page files without uploads.",
  path: "/tools/extract-pdf",
  image: "/og/tools.png",
})

export default function ExtractPdfLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

