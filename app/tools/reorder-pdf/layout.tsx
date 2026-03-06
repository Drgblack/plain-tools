import type { Metadata } from "next"

import { buildPageMetadata } from "@/lib/page-metadata"

export const metadata: Metadata = buildPageMetadata({
  title: "Reorder PDF Pages in Browser - Private and Free | Plain Tools",
  description:
    "Reorder PDF pages with local browser processing only. Drag pages into place and export without uploads or server-side handling.",
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
