import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Blog - Privacy-First PDF Insights | Plain Tools",
  description:
    "Read Plain Tools articles on local PDF processing, upload risks, privacy architecture, and practical workflow guidance for sensitive documents.",
  openGraph: {
    title: "Blog - Privacy-First PDF Insights | Plain Tools",
    description:
      "Insights on local PDF processing, privacy trade-offs, and practical document workflows.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog - Privacy-First PDF Insights | Plain Tools",
    description:
      "Insights on local PDF processing, privacy trade-offs, and practical document workflows.",
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

