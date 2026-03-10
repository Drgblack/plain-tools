import type { Metadata } from "next"
import { notFound, permanentRedirect } from "next/navigation"

import { ProgrammaticLayout } from "@/components/ProgrammaticLayout"
import { NetworkLookupForm } from "@/components/seo/network-lookup-form"
import {
  NetworkKeyValueTable,
  NetworkListTable,
  NetworkStatGrid,
} from "@/components/seo/network-lookup-panels"
import {
  buildAsnPage,
  fetchAsnLookup,
  generateNetworkAsnParams,
  normalizeAsnInput,
} from "@/lib/network-ops"
import { buildCanonicalUrl, buildPageMetadata } from "@/lib/page-metadata"
import { buildWebPageSchema } from "@/lib/structured-data"

type Props = {
  params: Promise<{ asn: string }>
}

export const revalidate = 86400
export const dynamicParams = true

function getPrebuildLimit() {
  const raw = process.env.NETWORK_ASN_PREBUILD_LIMIT
  if (!raw) return 20
  const value = Number.parseInt(raw, 10)
  return Number.isFinite(value) && value > 0 ? value : 20
}

export function generateStaticParams() {
  return generateNetworkAsnParams(getPrebuildLimit())
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { asn } = await params
  const normalizedAsn = normalizeAsnInput(asn)

  if (!normalizedAsn) {
    const invalid = buildPageMetadata({
      description: "The requested ASN is not valid.",
      googleNotranslate: true,
      image: "/og/default.png",
      path: `/network/asn/${encodeURIComponent(asn)}`,
      title: "Invalid ASN lookup | Plain Tools",
    })
    return { ...invalid, robots: { follow: false, index: false } }
  }

  return buildPageMetadata({
    description: `Lookup ${normalizedAsn} for owner, prefixes, and routing context on Plain Tools.`,
    googleNotranslate: true,
    image: "/og/default.png",
    path: `/network/asn/${normalizedAsn}`,
    title: `ASN Lookup for ${normalizedAsn} – Prefixes, Owner & RIR | Plain Tools`,
  })
}

function ResultsSection({ result }: { result: Awaited<ReturnType<typeof fetchAsnLookup>> }) {
  return (
    <section className="space-y-6 notranslate" translate="no">
      <section className="rounded-2xl border border-border/80 bg-card/60 p-5 shadow-[0_12px_40px_-28px_rgba(0,112,243,0.35)] md:p-6">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          ASN ownership for {result.asn}
        </h2>
        <div className="mt-4">
          <NetworkStatGrid
            items={[
              { label: "Owner", value: result.name },
              { label: "Country", value: result.country },
              { label: "RIR", value: result.rir },
              { label: "Prefixes shown", value: result.prefixes.length },
            ]}
          />
        </div>
      </section>
      <section className="rounded-2xl border border-border/80 bg-card/60 p-5 shadow-[0_12px_40px_-28px_rgba(0,112,243,0.35)]">
        <NetworkKeyValueTable
          rows={[
            { label: "ASN", value: result.asn },
            { label: "Owner", value: result.name },
            { label: "Description", value: result.description },
            { label: "Country", value: result.country },
            { label: "RIR", value: result.rir },
          ]}
        />
      </section>
      <section className="rounded-2xl border border-border/80 bg-card/60 p-5 shadow-[0_12px_40px_-28px_rgba(0,112,243,0.35)]">
        <h3 className="text-lg font-semibold text-foreground">Example prefixes</h3>
        <div className="mt-4">
          <NetworkListTable
            columns={["Prefix"]}
            rows={
              result.prefixes.length > 0
                ? result.prefixes.map((prefix) => [prefix])
                : [["No prefixes returned"]]
            }
          />
        </div>
      </section>
    </section>
  )
}

export default async function NetworkAsnPage({ params }: Props) {
  const { asn } = await params
  const normalizedAsn = normalizeAsnInput(asn)

  if (!normalizedAsn) {
    return <div className="mx-auto max-w-3xl px-4 py-16 text-sm text-muted-foreground">Invalid ASN. Use a value such as AS15169.</div>
  }

  if (asn !== normalizedAsn) {
    permanentRedirect(`/network/asn/${normalizedAsn}`)
  }

  const result = await fetchAsnLookup(normalizedAsn).catch(() => null)
  if (!result) {
    notFound()
  }
  const page = buildAsnPage(result)

  return (
    <ProgrammaticLayout
      beforeStructuredContent={<ResultsSection result={result} />}
      breadcrumbs={page.breadcrumbs}
      featureList={page.featureList}
      heroBadges={page.heroBadges}
      liveTool={<NetworkLookupForm defaultValue={normalizedAsn} kind="asn" />}
      liveToolDescription={page.liveToolDescription}
      liveToolTitle="Run another ASN lookup"
      page={page.page}
      relatedSectionTitle={`Related checks after ASN lookup for ${normalizedAsn}`}
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
