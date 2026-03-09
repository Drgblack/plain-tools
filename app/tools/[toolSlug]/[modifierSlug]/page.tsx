import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { ProgrammaticVariantPage } from "@/components/ProgrammaticVariantPage"
import { buildPageMetadata } from "@/lib/page-metadata"
import {
  getToolVariantPage,
  getToolVariantStaticParams,
} from "@/lib/tools-matrix"

type ToolVariantRouteParams = {
  toolSlug: string
  modifierSlug: string
}

type PageProps = {
  params: Promise<ToolVariantRouteParams>
}

export const revalidate = 2592000
export const dynamicParams = false

async function resolveParams(params: Promise<ToolVariantRouteParams>) {
  return params
}

export function generateStaticParams() {
  return getToolVariantStaticParams()
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { toolSlug, modifierSlug } = await resolveParams(params)
  const page = getToolVariantPage(toolSlug, modifierSlug)

  if (!page) {
    return buildPageMetadata({
      title: "Tool variant not found",
      description:
        "The requested tool-intent page could not be found. Browse Plain Tools for local browser workflows and related privacy-first guides.",
      path: "/tools",
      image: "/og/tools.png",
    })
  }

  return buildPageMetadata({
    title: page.title,
    description: page.metaDescription,
    path: page.path,
    image: "/og/tools.png",
  })
}

export default async function ToolVariantPage({ params }: PageProps) {
  const { toolSlug, modifierSlug } = await resolveParams(params)
  const page = getToolVariantPage(toolSlug, modifierSlug)

  if (!page) {
    notFound()
  }

  return <ProgrammaticVariantPage page={page} />
}
