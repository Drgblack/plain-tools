import type { Metadata } from "next"

import { buildPageMetadata } from "@/lib/page-metadata"

export const metadata: Metadata = buildPageMetadata({
  title: "Reorder PDF Pages Locally - No Upload",
  description:
    "Reorder PDF pages with visual thumbnails and local browser processing, then download a new PDF without uploading your document.",
  path: "/tools/reorder-pdf",
  image: "/og/tools.png",
})

export default function ReorderPdfLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

