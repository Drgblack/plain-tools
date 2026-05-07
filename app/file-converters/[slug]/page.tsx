import { permanentRedirect } from "next/navigation"

import { getCanonicalFileConverterPath } from "@/lib/seo/file-converter-canonicals"

type ConverterRouteProps = {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return [
    "pdf-to-word",
    "word-to-pdf",
    "jpg-to-pdf",
    "png-to-pdf",
    "image-to-pdf",
    "pdf-to-jpg",
    "pdf-to-png",
    "pdf-to-image",
    "pdf-to-excel",
    "pdf-to-ppt",
    "excel-to-pdf",
    "ppt-to-pdf",
    "heic-to-pdf",
    "pdf-to-heic",
    "tiff-to-pdf",
  ].map((slug) => ({ slug }))
}

export default async function FileConverterAliasPage({ params }: ConverterRouteProps) {
  const { slug } = await params
  permanentRedirect(getCanonicalFileConverterPath(slug))
}
