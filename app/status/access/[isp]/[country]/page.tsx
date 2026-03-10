import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { ProgrammaticLayout } from "@/components/ProgrammaticLayout"
import { StatusLookupForm } from "@/components/seo/status-lookup-form"
import {
  getStatusIspBundle,
  getStatusIspStaticParams,
} from "@/lib/status-regions"
import { buildCanonicalUrl, buildPageMetadata } from "@/lib/page-metadata"
import { buildWebPageSchema } from "@/lib/structured-data"

type Props = {
  params: Promise<{ isp: string; country: string }>
}

export const revalidate = 3600
export const dynamicParams = true

function getPrebuildLimit() {
  const raw = process.env.STATUS_ISP_PREBUILD_LIMIT
  if (!raw) return 900
  const value = Number.parseInt(raw, 10)
  return Number.isFinite(value) && value > 0 ? value : 900
}

export function generateStaticParams() {
  return getStatusIspStaticParams(getPrebuildLimit())
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { country, isp } = await params
  const page = getStatusIspBundle(isp, country)

  if (!page) {
    const invalid = buildPageMetadata({
      description: "The requested ISP status page does not exist.",
      googleNotranslate: true,
      image: "/og/default.png",
      path: `/status/${isp}-in-${country}`,
      title: "Invalid ISP status page | Plain Tools",
    })
    return { ...invalid, robots: { follow: false, index: false } }
  }

  return buildPageMetadata({
    description: page.desc,
    googleNotranslate: true,
    image: "/og/default.png",
    path: page.canonicalPath,
    title: page.title,
  })
}

export default async function StatusIspPage({ params }: Props) {
  const { country, isp } = await params
  const page = getStatusIspBundle(isp, country)
  if (!page) notFound()

  return (
    <ProgrammaticLayout
      breadcrumbs={page.breadcrumbs}
      featureList={page.featureList}
      heroBadges={page.heroBadges}
      liveTool={<StatusLookupForm defaultValue="chatgpt.com" />}
      liveToolDescription={page.liveToolDescription}
      liveToolTitle="Run an anonymous status check"
      page={page.page}
      relatedSectionTitle={`Related ISP and network checks for ${page.h1}`}
      schema={buildWebPageSchema({
        description: page.desc,
        name: page.h1,
        url: buildCanonicalUrl(page.canonicalPath),
      })}
      showVerifyLocalProcessing={false}
      siloLinks={page.siloLinks}
      titleOverride={page.h1}
    />
  )
}
