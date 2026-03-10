import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { ProgrammaticLayout } from "@/components/ProgrammaticLayout"
import { StatusLookupForm } from "@/components/seo/status-lookup-form"
import { getStatusTrends } from "@/lib/status-trending"
import { type StatusTrendingCategory } from "@/lib/status-trending-config"
import {
  getStatusTrendingBundle,
  STATUS_TRENDING_SEGMENTS,
  statusTrendingPathForCategory,
} from "@/lib/status-extensions"
import { buildCanonicalUrl, buildPageMetadata } from "@/lib/page-metadata"
import { buildWebPageSchema } from "@/lib/structured-data"

type Props = {
  params: Promise<{ segment: StatusTrendingCategory }>
}

export const revalidate = 3600
export const dynamicParams = true

export function generateStaticParams() {
  return STATUS_TRENDING_SEGMENTS.map((entry) => ({ segment: entry.segment }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { segment } = await params
  const page = getStatusTrendingBundle(segment)
  if (!page) {
    const invalid = buildPageMetadata({
      description: "The requested trending segment does not exist.",
      googleNotranslate: true,
      image: "/og/default.png",
      path: statusTrendingPathForCategory(segment),
      title: "Trending status segment unavailable | Plain Tools",
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
            <Link
              className="flex items-center justify-between rounded-md border border-border/60 bg-card/40 px-3 py-2 text-sm text-muted-foreground transition hover:border-accent/40 hover:text-accent"
              href={entry.href}
            >
              <span>
                {index + 1}. Is {entry.domain} down?
              </span>
              <span className="text-xs text-muted-foreground">{entry.count}</span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  )
}

export default async function StatusTrendingSegmentPage({ params }: Props) {
  const { segment } = await params
  const page = getStatusTrendingBundle(segment)
  if (!page) notFound()

  const segmentMeta = STATUS_TRENDING_SEGMENTS.find((entry) => entry.segment === segment)
  if (!segmentMeta) notFound()
  const entries = await getStatusTrends({ limit: 40, segment })

  return (
    <ProgrammaticLayout
      beforeStructuredContent={
        <TrendingResults entries={entries} label={segmentMeta.label} />
      }
      breadcrumbs={page.breadcrumbs}
      featureList={page.featureList}
      heroBadges={page.heroBadges}
      liveTool={<StatusLookupForm defaultValue="chatgpt.com" />}
      liveToolDescription={page.liveToolDescription}
      liveToolTitle="Run a status check"
      page={page.page}
      relatedSectionTitle={`Related status routes after ${segmentMeta.label.toLowerCase()} trends`}
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
