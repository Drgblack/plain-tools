import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Extract Pages from PDF Offline – Plain",
  description: "Extract selected pages from PDF files entirely in your browser with local processing and no upload requirements for controlled document sharing. Built for.",
  openGraph: {
    title: "Extract Pages from PDF Offline – Plain",
    description:
      "Extract PDF pages locally with privacy-safe browser processing and instant download output without sending document bytes to servers.",
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

