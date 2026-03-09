import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { FileConverterPage } from "@/components/seo/FileConverterPage"
import {
  generateFileConverterStaticParams,
  getFileConverterPage,
  type ConverterRouteParams,
} from "@/lib/file-converter-slugs"
import { buildPageMetadata } from "@/lib/page-metadata"

type PageProps = {
  params: Promise<ConverterRouteParams>
}

export const revalidate = 86400
export const dynamicParams = false

function resolveParams(params: Promise<ConverterRouteParams>) {
  return params
}

export function generateStaticParams() {
  return generateFileConverterStaticParams()
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { conversion } = await resolveParams(params)
  const page = getFileConverterPage(conversion)

  if (!page) {
    return buildPageMetadata({
      title: "File converter not found",
      description:
        "The requested file converter route does not exist. Browse Plain Tools for privacy-first converters that run in your browser with no upload for the core workflow.",
      path: "/file-converters",
      image: "/og/tools.png",
      googleNotranslate: true,
    })
  }

  return buildPageMetadata({
    title: page.metaTitle,
    description: page.metaDescription,
    path: page.path,
    image: "/og/tools.png",
    googleNotranslate: true,
  })
}

export default async function FileConverterSlugPage({ params }: PageProps) {
  const { conversion } = await resolveParams(params)
  const page = getFileConverterPage(conversion)

  if (!page) {
    notFound()
  }

  return <FileConverterPage page={page} />
}
