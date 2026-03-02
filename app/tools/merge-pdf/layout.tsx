import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Merge PDFs",
  description: "Plain combines multiple PDF files into one document. Processing happens locally in your browser.",
  openGraph: {
    title: "Merge PDFs - Plain",
    description: "Plain combines multiple PDF files into one document. Processing happens locally in your browser.",
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
