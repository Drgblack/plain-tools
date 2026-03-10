import type { Metadata } from "next"
import { notFound, permanentRedirect } from "next/navigation"

import { ProgrammaticLayout } from "@/components/ProgrammaticLayout"
import { StatusLookupForm } from "@/components/seo/status-lookup-form"
import {
  getStatusRegionBundle,
  getStatusRegionStaticParams,
  statusRegionPathFor,
} from "@/lib/status-regions"
import { buildCanonicalUrl, buildPageMetadata } from "@/lib/page-metadata"
import { normalizeSiteInput } from "@/lib/site-status"
import { buildWebPageSchema } from "@/lib/structured-data"

type Props = {
  params: Promise<{ site: string; country: string }>
}

export const revalidate = 3600
export const dynamicParams = true

function getPrebuildLimit() {
  const raw = process.env.STATUS_REGION_PREBUILD_LIMIT
  if (!raw) return 2500
  const value = Number.parseInt(raw, 10)
  return Number.isFinite(value) && value > 0 ? value : 2500
}

export function generateStaticParams() {
  return getStatusRegionStaticParams(getPrebuildLimit())
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { country, site } = await params
  const normalizedSite = normalizeSiteInput(site)

  if (!normalizedSite) {
    const invalid = buildPageMetadata({
      description: "The requested regional status page does not map to a valid domain.",
      googleNotranslate: true,
      image: "/og/default.png",
      path: statusRegionPathFor(site, country),
      title: "Invalid regional status page | Plain Tools",
    })
    return { ...invalid, robots: { follow: false, index: false } }
  }

  const page = getStatusRegionBundle(normalizedSite, country)
  if (!page) notFound()

  return buildPageMetadata({
    description: page.desc,
    googleNotranslate: true,
    image: "/og/default.png",
    path: page.canonicalPath,
    title: page.title,
  })
}

export default async function StatusRegionPage({ params }: Props) {
  const { country, site } = await params
  const normalizedSite = normalizeSiteInput(site)
  if (!normalizedSite) notFound()

  if (normalizedSite !== site) {
    permanentRedirect(statusRegionPathFor(normalizedSite, country))
  }

  const page = getStatusRegionBundle(normalizedSite, country)
  if (!page) notFound()

  return (
    <ProgrammaticLayout
      breadcrumbs={page.breadcrumbs}
      featureList={page.featureList}
      heroBadges={page.heroBadges}
      liveTool={<StatusLookupForm defaultValue={normalizedSite} />}
      liveToolDescription={page.liveToolDescription}
      liveToolTitle="Run an anonymous status check"
      page={page.page}
      relatedSectionTitle={`Related local-versus-global checks for ${normalizedSite}`}
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
