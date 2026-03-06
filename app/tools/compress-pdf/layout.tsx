import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Compress PDF Locally - No Upload | Plain Tools",
  description:
    "Compress PDF files in your browser with adjustable quality controls, local processing, and no upload requirement.",
  openGraph: {
    title: "Compress PDF Locally - No Upload | Plain Tools",
    description:
      "Reduce PDF file size with local browser compression, private processing, and no upload dependency.",
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

