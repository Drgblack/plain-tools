import type { Metadata } from "next"
import { notFound, permanentRedirect } from "next/navigation"

import { InvalidParam } from "@/components/invalid-param"
import { ProgrammaticLayout } from "@/components/ProgrammaticLayout"
import { NetworkLookupForm } from "@/components/seo/network-lookup-form"
import {
  NetworkListTable,
  NetworkStatGrid,
} from "@/components/seo/network-lookup-panels"
import {
  buildReversePage,
  fetchReverseLookup,
  generateNetworkReverseParams,
} from "@/lib/network-ops"
import { buildCanonicalUrl, buildPageMetadata } from "@/lib/page-metadata"
import { describeIpScope, getIpScope, validateIpAddress } from "@/lib/network-ip"
import { buildWebPageSchema } from "@/lib/structured-data"

type Props = {
  params: Promise<{ ip: string }>
}

export const revalidate = 3600
export const dynamicParams = true

function getPrebuildLimit() {
  const raw = process.env.NETWORK_REVERSE_PREBUILD_LIMIT
  if (!raw) return 16
  const value = Number.parseInt(raw, 10)
  return Number.isFinite(value) && value > 0 ? value : 16
}

export function generateStaticParams() {
  return generateNetworkReverseParams(getPrebuildLimit())
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { ip } = await params
  const validation = validateIpAddress(ip)

  if (!validation.isValid) {
    const invalid = buildPageMetadata({
      description: "The requested IP is not valid for reverse DNS lookup.",
      googleNotranslate: true,
      image: "/og/default.png",
      path: `/network/reverse/${encodeURIComponent(ip)}`,
      title: "Invalid reverse DNS IP | Plain Tools",
    })
    return { ...invalid, robots: { follow: false, index: false } }
  }

  const page = buildReversePage({
    ip: validation.normalized,
    ptr: "",
    records: [],
    scopeDescription:
      getIpScope(validation.normalized, validation.version) === "public"
        ? "This is a public IP range, so PTR answers can provide useful ownership and reputation context."
        : describeIpScope(getIpScope(validation.normalized, validation.version)),
  })
  return buildPageMetadata({
    description: page.desc,
    googleNotranslate: true,
    image: "/og/default.png",
    path: page.canonicalPath,
    title: page.title,
  })
}

function ResultsSection({
  ip,
  lookup,
}: {
  ip: string
  lookup: Awaited<ReturnType<typeof fetchReverseLookup>>
}) {
  return (
    <section className="space-y-6 notranslate" translate="no">
      <section className="rounded-2xl border border-border/80 bg-card/60 p-5 shadow-[0_12px_40px_-28px_rgba(0,112,243,0.35)] md:p-6">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          PTR records for {ip}
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
          Reverse DNS resolves the IP into the hostname it claims for itself.
        </p>
        <div className="mt-4">
          <NetworkStatGrid
            items={[
              { label: "PTR answers", value: lookup.answers.length },
              { label: "Lookup type", value: "PTR" },
              { label: "PTR zone", value: lookup.ptr },
              { label: "DNS status", value: lookup.status },
            ]}
          />
        </div>
      </section>
      <section className="rounded-2xl border border-border/80 bg-card/60 p-5 shadow-[0_12px_40px_-28px_rgba(0,112,243,0.35)]">
        <NetworkListTable
          columns={["PTR host", "Answer", "TTL"]}
          rows={
            lookup.answers.length > 0
              ? lookup.answers.map((answer) => [answer.name, answer.data, `${answer.ttl}s`])
              : [[lookup.ptr, "No PTR records returned", "-"]]
          }
        />
      </section>
    </section>
  )
}

export default async function NetworkReversePage({ params }: Props) {
  const { ip } = await params
  const validation = validateIpAddress(ip)

  if (!validation.isValid) {
    return (
      <InvalidParam
        paramType="ip"
        toolHref="/what-is-my-ip"
        toolName="Reverse DNS Lookup"
        value={ip}
      />
    )
  }

  if (ip !== validation.normalized) {
    permanentRedirect(`/network/reverse/${encodeURIComponent(validation.normalized)}`)
  }

  const scope = getIpScope(validation.normalized, validation.version)
  const lookup = await fetchReverseLookup(validation.normalized).catch(() => null)
  if (!lookup) {
    notFound()
  }
  const page = buildReversePage({
    ip: validation.normalized,
    ptr: lookup.ptr,
    records: lookup.answers,
    scopeDescription:
      scope === "public"
        ? "This is a public address, so PTR data can be useful for provider and reputation checks."
        : describeIpScope(scope),
  })

  return (
    <ProgrammaticLayout
      beforeStructuredContent={<ResultsSection ip={validation.normalized} lookup={lookup} />}
      breadcrumbs={page.breadcrumbs}
      featureList={page.featureList}
      heroBadges={page.heroBadges}
      liveTool={<NetworkLookupForm defaultValue={validation.normalized} kind="reverse" />}
      liveToolDescription={page.liveToolDescription}
      liveToolTitle="Run another reverse DNS lookup"
      page={page.page}
      relatedSectionTitle={`Related checks after reverse DNS for ${validation.normalized}`}
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
