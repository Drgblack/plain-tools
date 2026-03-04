import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Blog",
  description: "Plain writes about PDFs, local file processing, and browser-based document tools.",
  openGraph: {
    title: "Blog - Plain",
    description: "Plain writes about PDFs, local file processing, and browser-based document tools.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog - Plain",
    description: "Plain writes about PDFs, local file processing, and browser-based document tools.",
  },
  alternates: {
    canonical: "https://plain.tools/blog",
  },
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
