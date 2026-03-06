import type { Metadata } from "next"

import { buildPageMetadata } from "@/lib/page-metadata"

export const metadata: Metadata = buildPageMetadata({
  title: "File converters",
  description:
    "Browse converter routes mapped to canonical tools for PDF, Word, image, and spreadsheet workflows, with clear local-processing guidance where available.",
  path: "/file-converters",
  image: "/og/tools.png",
})

export default function FileConvertersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
