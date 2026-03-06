import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Learn - Privacy-First PDF Guides | Plain.tools",
  description:
    "Read practical guides on private PDF workflows, local browser processing, and no-upload verification.",
  alternates: {
    canonical: "https://plain.tools/learn",
  },
  openGraph: {
    title: "Learn - Privacy-First PDF Guides | Plain.tools",
    description:
      "Practical guides on local PDF processing, privacy checks, and reliable no-upload workflows.",
    url: "https://plain.tools/learn",
    images: [
      {
        url: "/og/learn.png",
        width: 1200,
        height: 630,
        alt: "Plain.tools learn centre",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Learn - Privacy-First PDF Guides | Plain.tools",
    description:
      "Guides for private PDF workflows and browser-local processing.",
    images: ["/og/learn.png"],
  },
}

export default function LearnLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
