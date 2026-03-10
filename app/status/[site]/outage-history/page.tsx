import type { Metadata } from "next"
import { notFound, permanentRedirect } from "next/navigation"

import { InvalidParam } from "@/components/invalid-param"
import { ProgrammaticLayout } from "@/components/ProgrammaticLayout"
import { StatusDynamicClient } from "@/app/status/[site]/client"
import { StatusHistory } from "@/components/status-history"
import { getStatusHistorySummary } from "@/lib/status-trending"
import {
  getStatusOutageHistoryBundle,
  STATUS_OUTAGE_HISTORY_DOMAINS,
  statusOutageHistoryPathForDomain,
} from "@/lib/status-extensions"
import { buildCanonicalUrl, buildPageMetadata } from "@/lib/page-metadata"
import { normalizeSiteInput } from "@/lib/site-status"
import { buildWebPageSchema } from "@/lib/structured-data"

type Props = {
  params: Promise<{ site: string }>
}

export const revalidate = 3600
export const dynamicParams = true

function getPrebuildLimit() {
  const raw = process.env.STATUS_OUTAGE_HISTORY_PREBUILD_LIMIT
  if (!raw) return 80
  const value = Number.parseInt(raw, 10)
  return Number.isFinite(value) && value > 0 ? value : 80
}

export function generateStaticParams() {
  return STATUS_OUTAGE_HISTORY_DOMAINS.slice(0, getPrebuildLimit()).map((site) => ({ site }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { site } = await params
  const normalized = normalizeSiteInput(site)

  if (!normalized) {
    const invalid = buildPageMetadata({
      description: "The requested site is not valid for outage history.",
      googleNotranslate: true,
      image: "/og/default.png",
      path: `/status/${encodeURIComponent(site)}-outage-history`,
      title: "Invalid outage history route | Plain Tools",
    })
    return { ...invalid, robots: { follow: false, index: false } }
  }

  const page = getStatusOutageHistoryBundle(normalized)
  if (!page) notFound()

  return buildPageMetadata({
    description: page.desc,
    googleNotranslate: true,
    image: "/og/default.png",
    path: page.canonicalPath,
    title: page.title,
  })
}

function TimelineSection({ domain }: { domain: string }) {
  return (
    <section className="space-y-6">
      <section className="rounded-2xl border border-border/80 bg-card/60 p-5 shadow-[0_12px_40px_-28px_rgba(0,112,243,0.35)] md:p-6">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Live status and 24-hour timeline
        </h2>
        <div className="mt-4 rounded-xl border border-border/70 bg-card/40 p-4">
          <StatusDynamicClient site={domain} siteName={domain} />
        </div>
        <div className="mt-4">
          <StatusHistory domain={domain} />
        </div>
      </section>
    </section>
  )
}

export default async function StatusOutageHistoryPage({ params }: Props) {
  const { site } = await params
  const normalized = normalizeSiteInput(site)

  if (!normalized) {
    return (
      <InvalidParam
        paramType="site"
        toolHref="/site-status"
        toolName="Status Checker"
        value={site}
      />
    )
  }

  if (site !== normalized) {
    permanentRedirect(
      statusOutageHistoryPathForDomain(normalized) ??
        `/status/${encodeURIComponent(normalized)}-outage-history`
    )
  }

  const page = getStatusOutageHistoryBundle(normalized)
  if (!page) notFound()

  await getStatusHistorySummary(normalized, { hours: 24, recentLimit: 8 })

  return (
    <ProgrammaticLayout
      beforeStructuredContent={<TimelineSection domain={normalized} />}
      breadcrumbs={page.breadcrumbs}
      featureList={page.featureList}
      heroBadges={page.heroBadges}
      liveTool={<StatusDynamicClient site={normalized} siteName={normalized} />}
      liveToolDescription={page.liveToolDescription}
      liveToolTitle="Run the live status check"
      page={page.page}
      relatedSectionTitle={`Related outage and network checks for ${normalized}`}
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
