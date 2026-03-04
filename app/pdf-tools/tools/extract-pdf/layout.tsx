import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Extract Pages from PDF Offline – Plain",
  description: "Extract selected pages from a PDF locally in your browser. Files are never uploaded.",
  openGraph: {
    title: "Extract Pages from PDF Offline – Plain",
    description: "Extract selected pages from a PDF locally in your browser. Files are never uploaded.",
  },
  alternates: {
    canonical: "https://plain.tools/tools/extract-pdf",
  },
}

export default function ExtractPDFLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
