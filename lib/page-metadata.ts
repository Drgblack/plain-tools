import type { Metadata } from "next"

const BASE_URL = "https://plain.tools"

type PageMetadataInput = {
  title: string
  description: string
  path: string
  image?: string
}

export function buildPageMetadata({
  title,
  description,
  path,
  image = "/og/default.png",
}: PageMetadataInput): Metadata {
  const canonical = `${BASE_URL}${path === "/" ? "" : path}`

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  }
}
