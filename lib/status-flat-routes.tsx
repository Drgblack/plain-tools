import { notFound } from "next/navigation"

import { ProgrammaticLayout } from "@/components/ProgrammaticLayout"
import { StatusDynamicClient } from "@/app/status/[site]/client"
import { StatusHistory } from "@/components/status-history"
import { StatusLookupForm } from "@/components/seo/status-lookup-form"
import { getStatusHistorySummary, getStatusTrends } from "@/lib/status-trending"
import { buildStatusHistoryWindows } from "@/lib/status-history"
import {
  getStatusOutageHistoryBundle,
  getStatusTrendingBundle,
} from "@/lib/status-extensions"
import {
  getStatusIspBundle,
  getStatusRegionBundle,
  parseStatusIspFlatSlug,
  parseStatusRegionFlatSlug,
} from "@/lib/status-regions"
import { buildCanonicalUrl } from "@/lib/page-metadata"
import { normalizeSiteInput } from "@/lib/site-status"
import { getStatusRpmRolloutPaths } from "@/lib/status-trends-rpm"
import { buildWebPageSchema } from "@/lib/structured-data"

type StatusFlatMetadata = {
  description: string
  path: string
  title: string
}

type StatusFlatVariant =
  | { kind: "history"; normalizedDomain: string }
  | { kind: "isp"; country: string; isp: string }
  | { kind: "region"; country: string; site: string }
  | { kind: "trending"; segment: string }

function decodeFlatSlug(value: string) {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

function resolveTrendingVariant(slug: string): StatusFlatVariant | null {
  if (!slug.startsWith("trending-")) return null
  const segment = slug.slice("trending-".length)
  return segment ? { kind: "trending", segment } : null
}

function resolveOutageHistoryVariant(slug: string): StatusFlatVariant | null {
  if (!slug.endsWith("-outage-history")) return null
  const rawDomain = slug.slice(0, -"outage-history".length - 1)
  const normalizedDomain = normalizeSiteInput(rawDomain)
  return normalizedDomain ? { kind: "history", normalizedDomain } : null
}

export function resolveStatusFlatVariant(input: string): StatusFlatVariant | null {
  const slug = decodeFlatSlug(input).trim().toLowerCase()
  if (!slug) return null

  return (
    resolveTrendingVariant(slug) ??
    resolveOutageHistoryVariant(slug) ??
    (() => {
      const region = parseStatusRegionFlatSlug(slug)
      if (region) return { kind: "region", country: region.country, site: region.site }

      const isp = parseStatusIspFlatSlug(slug)
      if (isp) return { kind: "isp", country: isp.country, isp: isp.isp }

      return null
    })()
  )
}

export function getStatusFlatMetadata(input: string): StatusFlatMetadata | null {
  const variant = resolveStatusFlatVariant(input)
  if (!variant) return null

  switch (variant.kind) {
    case "trending": {
      const page = getStatusTrendingBundle(variant.segment)
      return page
        ? { description: page.desc, path: page.canonicalPath, title: page.title }
        : null
    }
    case "history": {
      const page = getStatusOutageHistoryBundle(variant.normalizedDomain)
      return page
        ? { description: page.desc, path: page.canonicalPath, title: page.title }
        : null
    }
    case "region": {
      const page = getStatusRegionBundle(variant.site, variant.country)
      return page
        ? { description: page.desc, path: page.canonicalPath, title: page.title }
        : null
    }
    case "isp": {
      const page = getStatusIspBundle(variant.isp, variant.country)
      return page
        ? { description: page.desc, path: page.canonicalPath, title: page.title }
        : null
    }
  }
}

function TrendingResults({
  entries,
  label,
}: {
  entries: Awaited<ReturnType<typeof getStatusTrends>>
  label: string
}) {
  return (
    <section className="rounded-2xl border border-border/80 bg-card/60 p-5 shadow-[0_12px_40px_-28px_rgba(0,112,243,0.35)] md:p-6">
      <h2 className="text-2xl font-semibold tracking-tight text-foreground">
        Trending {label.toLowerCase()} checks
      </h2>
      <ol className="mt-4 grid gap-2 md:grid-cols-2">
        {entries.map((entry, index) => (
          <li key={entry.domain}>
            <a
              className="flex items-center justify-between rounded-md border border-border/60 bg-card/40 px-3 py-2 text-sm text-muted-foreground transition hover:border-accent/40 hover:text-accent"
              href={entry.href}
            >
              <span>
                {index + 1}. Is {entry.domain} down?
              </span>
              <span className="text-xs text-muted-foreground">{entry.count}</span>
            </a>
          </li>
        ))}
      </ol>
    </section>
  )
}

function TimelineSection({
  domain,
  windows,
}: {
  domain: string
  windows: ReturnType<typeof buildStatusHistoryWindows>
}) {
  return (
    <section className="space-y-6">
      <section className="grid gap-4 md:grid-cols-3">
        {windows.map((window) => (
          <article
            key={window.days}
            className="rounded-2xl border border-border/80 bg-card/60 p-5 shadow-[0_12px_40px_-28px_rgba(0,112,243,0.35)]"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent/90">
              {window.days}-day lens
            </p>
            <h2 className="mt-2 text-lg font-semibold tracking-tight text-foreground">
              {window.title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {window.summary}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {window.highlight}
            </p>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              {window.note}
            </p>
            <p className="mt-3 text-sm font-medium text-foreground">
              Directional availability view: {window.availabilityLabel}
            </p>
          </article>
        ))}
      </section>
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

export async function renderStatusFlatRoute(input: string) {
  const variant = resolveStatusFlatVariant(input)
  if (!variant) return null

  switch (variant.kind) {
    case "trending": {
      const page = getStatusTrendingBundle(variant.segment)
      if (!page) notFound()

      const entries = await getStatusTrends({ limit: 40, segment: variant.segment })

      return (
        <ProgrammaticLayout
          beforeStructuredContent={
            <TrendingResults entries={entries} label={page.page.paramLabel} />
          }
          breadcrumbs={page.breadcrumbs}
          featureList={page.featureList}
          heroBadges={page.heroBadges}
          liveTool={<StatusLookupForm defaultValue="chatgpt.com" />}
          liveToolDescription={page.liveToolDescription}
          liveToolTitle="Run a status check"
          page={page.page}
          relatedSectionTitle={`Related status routes after ${page.page.paramLabel.toLowerCase()} trends`}
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
    case "history": {
      const page = getStatusOutageHistoryBundle(variant.normalizedDomain)
      if (!page) notFound()

      const summary = await getStatusHistorySummary(variant.normalizedDomain, {
        hours: 24,
        recentLimit: 8,
      })
      const windows = buildStatusHistoryWindows(variant.normalizedDomain, summary)

      return (
        <ProgrammaticLayout
          beforeStructuredContent={
            <TimelineSection domain={variant.normalizedDomain} windows={windows} />
          }
          breadcrumbs={page.breadcrumbs}
          featureList={page.featureList}
          heroBadges={page.heroBadges}
          liveTool={
            <StatusDynamicClient
              site={variant.normalizedDomain}
              siteName={variant.normalizedDomain}
            />
          }
          liveToolDescription={page.liveToolDescription}
          liveToolTitle="Run the live status check"
          page={page.page}
          relatedSectionTitle={`Related outage and network checks for ${variant.normalizedDomain}`}
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
    case "region": {
      const page = getStatusRegionBundle(variant.site, variant.country)
      if (!page) notFound()

      return (
        <ProgrammaticLayout
          breadcrumbs={page.breadcrumbs}
          featureList={page.featureList}
          heroBadges={page.heroBadges}
          liveTool={<StatusLookupForm defaultValue={variant.site} />}
          liveToolDescription={page.liveToolDescription}
          liveToolTitle="Run an anonymous status check"
          page={page.page}
          relatedSectionTitle={`Related local-versus-global checks for ${variant.site}`}
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
    case "isp": {
      const page = getStatusIspBundle(variant.isp, variant.country)
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
  }
}

export function getStatusFlatStaticParams(limit = 3200) {
  return Array.from(new Set(getStatusRpmRolloutPaths(limit)))
    .slice(0, limit)
    .map((path) => ({ site: decodeFlatSlug(path.replace(/^\/status\//, "")) }))
}
