import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Compress PDF Offline – Plain",
  description: "Compress PDF files offline in your browser with adjustable quality controls, local processing, and no server uploads for privacy-sensitive documents. Built for.",
  openGraph: {
    title: "Compress PDF Offline – Plain",
    description:
      "Reduce PDF file size with local browser compression, private processing, and no upload dependency for faster secure sharing.",
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

