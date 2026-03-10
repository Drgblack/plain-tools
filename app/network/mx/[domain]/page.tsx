import type { Metadata } from "next"
import { permanentRedirect } from "next/navigation"

import { InvalidParam } from "@/components/invalid-param"
import { ProgrammaticLayout } from "@/components/ProgrammaticLayout"
import { NetworkLookupForm } from "@/components/seo/network-lookup-form"
import {
  NetworkListTable,
  NetworkStatGrid,
} from "@/components/seo/network-lookup-panels"
import {
  buildMxPage,
  fetchMxLookup,
  generateNetworkMxParams,
} from "@/lib/network-ops"
import { buildCanonicalUrl, buildPageMetadata } from "@/lib/page-metadata"
import { isValidDnsDomain, normalizeDnsDomain } from "@/lib/network-dns"
import { buildWebPageSchema } from "@/lib/structured-data"

type Props = {
  params: Promise<{ domain: string }>
}

export const revalidate = 3600
export const dynamicParams = true

function getPrebuildLimit() {
  const raw = process.env.NETWORK_DOMAIN_PREBUILD_LIMIT
  if (!raw) return 36
  const value = Number.parseInt(raw, 10)
  return Number.isFinite(value) && value > 0 ? value : 36
}

export function generateStaticParams() {
  return generateNetworkMxParams(getPrebuildLimit())
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { domain } = await params
  const normalizedDomain = normalizeDnsDomain(domain)

  if (!normalizedDomain || !isValidDnsDomain(normalizedDomain)) {
    const invalid = buildPageMetadata({
      description: "The requested domain is not valid for MX lookup.",
      googleNotranslate: true,
      image: "/og/default.png",
      path: `/network/mx/${encodeURIComponent(domain)}`,
      title: "Invalid MX lookup domain | Plain Tools",
    })
    return { ...invalid, robots: { follow: false, index: false } }
  }

  const page = buildMxPage(normalizedDomain, [])
  return buildPageMetadata({
    description: page.desc,
    googleNotranslate: true,
    image: "/og/default.png",
    path: page.canonicalPath,
    title: page.title,
  })
}

function ResultsSection({
  answers,
  domain,
}: {
  answers: Awaited<ReturnType<typeof fetchMxLookup>>["answers"]
  domain: string
}) {
  return (
    <section className="space-y-6 notranslate" translate="no">
      <section className="rounded-2xl border border-border/80 bg-card/60 p-5 shadow-[0_12px_40px_-28px_rgba(0,112,243,0.35)] md:p-6">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Live MX records for {domain}
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
          Review mail hosts and priority values before you debug the application layer.
        </p>
        <div className="mt-4">
          <NetworkStatGrid
            items={[
              { label: "Answers", value: answers.length },
              { label: "Lookup type", value: "MX" },
              { label: "Focus", value: "Mail routing" },
              { label: "Privacy", value: "Public DNS only" },
            ]}
          />
        </div>
      </section>
      <section className="rounded-2xl border border-border/80 bg-card/60 p-5 shadow-[0_12px_40px_-28px_rgba(0,112,243,0.35)]">
        <NetworkListTable
          columns={["Host", "Priority / target", "TTL"]}
          rows={
            answers.length > 0
              ? answers.map((answer) => {
                  const [priority, ...target] = answer.data.split(" ")
                  return [answer.name, `${priority} -> ${target.join(" ")}`, `${answer.ttl}s`]
                })
              : [[domain, "No MX records returned", "-"]]
          }
        />
      </section>
    </section>
  )
}

export default async function NetworkMxPage({ params }: Props) {
  const { domain } = await params
  const normalizedDomain = normalizeDnsDomain(domain)

  if (!normalizedDomain || !isValidDnsDomain(normalizedDomain)) {
    return (
      <InvalidParam
        paramType="domain"
        toolHref="/dns-lookup"
        toolName="MX Lookup"
        value={domain}
      />
    )
  }

  if (domain !== normalizedDomain) {
    permanentRedirect(`/network/mx/${encodeURIComponent(normalizedDomain)}`)
  }

  const lookup = await fetchMxLookup(normalizedDomain).catch(() => ({
    answers: [],
    resolver: "google" as const,
    status: -1,
  }))
  const page = buildMxPage(normalizedDomain, lookup.answers)

  return (
    <ProgrammaticLayout
      beforeStructuredContent={
        <ResultsSection answers={lookup.answers} domain={normalizedDomain} />
      }
      breadcrumbs={page.breadcrumbs}
      featureList={page.featureList}
      heroBadges={page.heroBadges}
      liveTool={<NetworkLookupForm defaultValue={normalizedDomain} kind="mx" />}
      liveToolDescription={page.liveToolDescription}
      liveToolTitle="Run another MX lookup"
      page={page.page}
      relatedSectionTitle={`Related checks after MX lookup for ${normalizedDomain}`}
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
