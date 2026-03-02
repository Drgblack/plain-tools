import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Why Local-First Wins - Compare Plain PDF",
  description: "Compare Plain's local-first architecture with cloud-based PDF tools like iLovePDF and Smallpdf. See why professionals choose 100% on-device processing for sensitive documents.",
  keywords: [
    "iLovePDF alternative privacy",
    "Smallpdf offline version",
    "local PDF processing",
    "offline PDF tools",
    "private PDF editor",
    "no upload PDF tools",
    "browser-based PDF",
    "WebAssembly PDF"
  ],
  openGraph: {
    title: "Why Local-First Wins - Compare Plain PDF",
    description: "Your documents are too sensitive for the cloud. Compare why professionals are switching to Plain for 100% on-device processing.",
    url: "https://plain.tools/compare",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Why Local-First Wins - Compare Plain PDF",
    description: "Your documents are too sensitive for the cloud. Compare why professionals are switching to Plain.",
  },
  alternates: {
    canonical: "https://plain.tools/compare",
  },
}

export default function CompareLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
