import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Merge PDFs",
  description:
    "Merge multiple PDF files into one document with private local browser processing, drag reorder support, and zero upload requirements for sensitive workflows.",
  openGraph: {
    title: "Merge PDFs - Plain",
    description:
      "Merge multiple PDFs with local browser processing, fast output generation, and no server uploads for private document handling.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Merge PDFs - Plain",
    description: "Plain combines multiple PDF files into one document. Processing happens locally in your browser.",
  },
  alternates: {
    canonical: "https://plain.tools/tools/merge-pdf",
  },
}

export default function MergePDFLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
