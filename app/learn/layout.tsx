import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Learn Offline PDF Privacy, Security, and Client-Side Processing",
  description:
    "Explore Plain Learn guides on offline PDF privacy, metadata risks, secure redaction, local OCR, WebAssembly architecture, and verifiable no-upload workflows.",
  alternates: {
    canonical: "https://plain.tools/learn",
  },
}

export default function LearnLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

