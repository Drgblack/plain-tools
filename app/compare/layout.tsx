import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Compare Plain with Adobe, Smallpdf, iLovePDF, Sejda, and DocuSign",
  description: "Compare Plain with major PDF platforms on privacy, upload requirements, offline support, speed, compliance posture, and real workflow trade-offs. Built for.",
  alternates: {
    canonical: "https://plain.tools/compare",
    languages: {
      en: "https://plain.tools/compare",
      de: "https://plain.tools/compare",
      "x-default": "https://plain.tools/compare",
    },
  },
}

export default function CompareLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}


