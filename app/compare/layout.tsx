import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Compare Plain.tools with major PDF platforms",
  description:
    "Compare Plain.tools with major PDF platforms on privacy handling, upload requirements, offline support, and practical workflow fit.",
  alternates: {
    canonical: "https://plain.tools/compare",
    languages: {
      en: "https://plain.tools/compare",
      de: "https://plain.tools/compare",
      "x-default": "https://plain.tools/compare",
    },
  },
  openGraph: {
    title: "Compare Plain.tools with major PDF platforms",
    description:
      "Compare privacy, upload requirements, and workflow fit across common PDF alternatives.",
    url: "https://plain.tools/compare",
    images: [
      {
        url: "/og/compare.png",
        width: 1200,
        height: 630,
        alt: "Plain.tools comparison pages",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Compare Plain.tools with major PDF platforms",
    description:
      "Fair PDF tool comparisons focused on privacy, speed, and practical workflow fit.",
    images: ["/og/compare.png"],
  },
}

export default function CompareLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}


