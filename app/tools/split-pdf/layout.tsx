import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Split PDF Offline – Plain",
  description: "Split PDF files by page range, extract selected pages, or export single-page files locally in your browser with zero upload exposure. Built for private.",
  openGraph: {
    title: "Split PDF Offline – Plain",
    description:
      "Split PDFs locally with private browser processing, custom page-range controls, and no server-side upload requirements.",
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


