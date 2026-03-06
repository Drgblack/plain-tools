import { redirect } from "next/navigation"

type ConverterRouteProps = {
  params: Promise<{ slug: string }>
}

const converterRedirects: Record<string, string> = {
  "pdf-to-word": "/tools/pdf-to-word",
  "word-to-pdf": "/tools/word-to-pdf",
  "jpg-to-pdf": "/tools/jpg-to-pdf",
  "png-to-pdf": "/tools/jpg-to-pdf",
  "image-to-pdf": "/tools/jpg-to-pdf",
  "pdf-to-jpg": "/tools/pdf-to-jpg",
  "pdf-to-png": "/tools/pdf-to-jpg",
  "pdf-to-image": "/tools/pdf-to-jpg",
  "pdf-to-excel": "/tools/pdf-to-excel",
  "pdf-to-ppt": "/tools/pdf-to-ppt",
  "excel-to-pdf": "/file-converters",
  "ppt-to-pdf": "/file-converters",
  "heic-to-pdf": "/file-converters",
  "pdf-to-heic": "/file-converters",
  "tiff-to-pdf": "/file-converters",
}

export function generateStaticParams() {
  return Object.keys(converterRedirects).map((slug) => ({ slug }))
}

export default async function FileConverterAliasPage({ params }: ConverterRouteProps) {
  const { slug } = await params
  const target = converterRedirects[slug]

  if (target) {
    redirect(target)
  }

  redirect("/file-converters")
}
