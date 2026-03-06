import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Split PDF Locally - No Upload | Plain Tools",
  description:
    "Split PDF files by range, extract selected pages, or save single-page outputs locally in your browser without uploads.",
  openGraph: {
    title: "Split PDF Locally - No Upload | Plain Tools",
    description:
      "Split PDFs locally with private browser processing, page-range controls, and no server-side upload requirement.",
  },
  alternates: {
    canonical: "https://plain.tools/tools/split-pdf",
  },
}

export default function SplitPdfLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}


