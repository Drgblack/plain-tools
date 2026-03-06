import type { Metadata } from "next"

import { buildPageMetadata } from "@/lib/page-metadata"

export const metadata: Metadata = buildPageMetadata({
  title: "Extract PDF Pages Locally - No Upload | Plain Tools",
  description:
    "Extract selected pages from PDF files directly in your browser. No uploads, no account, and private local processing by design.",
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
