import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Blog",
  description: "Read Plain blog posts on offline PDF tools, local browser processing, privacy architecture, tool comparisons, and practical guides for secure document.",
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

