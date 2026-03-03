import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Plain Local Cryptographic Signer",
  description: "Sign PDF files locally with cryptographic proof, visual signature placement, and optional verification output while keeping document bytes on-device. Built for.",
  openGraph: {
    title: "Plain Local Cryptographic Signer",
    description:
      "Create locally verifiable PDF signatures with private browser processing and no upload dependency for sensitive signing workflows.",
  },
  alternates: {
    canonical: "https://plain.tools/tools/plain-local-cryptographic-signer",
  },
}

export default function LocalSignerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}


