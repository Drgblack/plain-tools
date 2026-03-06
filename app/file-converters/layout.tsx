import type { Metadata } from "next"

import { buildPageMetadata } from "@/lib/page-metadata"

export const metadata: Metadata = buildPageMetadata({
  title: "File Converters - Local PDF and Image Conversion | Plain Tools",
  description:
    "Convert PDF, Word, image, and office files with practical guides and local-first workflows. No upload processing where local tools are available.",
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
