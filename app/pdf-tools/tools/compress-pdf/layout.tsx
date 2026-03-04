import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Compress PDF Offline – Plain",
  description: "Compress PDF files locally in your browser. No uploads. Results depend on your document.",
  openGraph: {
    title: "Compress PDF Offline – Plain",
    description: "Compress PDF files locally in your browser. No uploads. Results depend on your document.",
  },
  alternates: {
    canonical: "https://plain.tools/tools/compress-pdf",
  },
}

export default function CompressPDFLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
