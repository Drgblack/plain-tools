import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Merge PDFs Locally - No Upload | Plain Tools",
  description:
    "Merge multiple PDF files into one document locally in your browser. Private workflow, drag reordering, and no upload requirement.",
  openGraph: {
    title: "Merge PDFs Locally - No Upload | Plain Tools",
    description:
      "Merge multiple PDFs locally in your browser with private processing and no server uploads.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Merge PDFs Locally - No Upload | Plain Tools",
    description: "Combine multiple PDF files locally in your browser with no upload requirement.",
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
