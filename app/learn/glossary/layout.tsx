import type { Metadata } from "next"

import { buildPageMetadata } from "@/lib/page-metadata"

export const metadata: Metadata = buildPageMetadata({
  title: "PDF privacy glossary",
  description:
    "Read clear definitions for WebAssembly, OCR, metadata, redaction, and privacy terms used in local browser-based PDF workflows.",
  path: "/learn/glossary",
  image: "/og/learn.png",
})

export default function LearnGlossaryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
