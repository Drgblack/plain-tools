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
  buildWhoisPage,
  fetchWhoisLookup,
  generateNetworkWhoisParams,
  normalizeWhoisQuery,
} from "@/lib/network-ops"
import { buildCanonicalUrl, buildPageMetadata } from "@/lib/page-metadata"
import { buildWebPageSchema } from "@/lib/structured-data"

type Props = {
  params: Promise<{ query: string }>
}

export const revalidate = 86400
export const dynamicParams = true

function getPrebuildLimit() {
  const raw = process.env.NETWORK_WHOIS_PREBUILD_LIMIT
  if (!raw) return 24
  const value = Number.parseInt(raw, 10)
  return Number.isFinite(value) && value > 0 ? value : 24
}

export function generateStaticParams() {
  return generateNetworkWhoisParams(getPrebuildLimit())
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { query } = await params
  const normalizedQuery = normalizeWhoisQuery(query)

  if (!normalizedQuery) {
    const invalid = buildPageMetadata({
      description: "The requested WHOIS query is not valid.",
      googleNotranslate: true,
      image: "/og/default.png",
      path: `/network/whois/${encodeURIComponent(query)}`,
      title: "Invalid WHOIS lookup | Plain Tools",
    })
    return { ...invalid, robots: { follow: false, index: false } }
  }

  return buildPageMetadata({
    description: `Lookup WHOIS and RDAP data for ${normalizedQuery} on Plain Tools.`,
    googleNotranslate: true,
    image: "/og/default.png",
    path: `/network/whois/${encodeURIComponent(normalizedQuery)}`,
    title: `WHOIS Lookup for ${normalizedQuery} – Registration & RDAP | Plain Tools`,
  })
}

function ResultsSection({ result }: { result: Awaited<ReturnType<typeof fetchWhoisLookup>> }) {
  return (
    <section className="space-y-6 notranslate" translate="no">
      <section className="rounded-2xl border border-border/80 bg-card/60 p-5 shadow-[0_12px_40px_-28px_rgba(0,112,243,0.35)] md:p-6">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          RDAP registration data
        </h2>
        <div className="mt-4">
          <NetworkStatGrid
            items={[
              { label: "Object class", value: result.objectClassName },
              { label: "Handle", value: result.handle },
              { label: "Lookup type", value: result.kind.toUpperCase() },
              { label: "Source", value: result.registrationUrl },
            ]}
          />
        </div>
      </section>
      <section className="rounded-2xl border border-border/80 bg-card/60 p-5 shadow-[0_12px_40px_-28px_rgba(0,112,243,0.35)]">
        <NetworkKeyValueTable
          rows={[
            { label: "Name", value: result.name },
            { label: "Handle", value: result.handle },
            { label: "Object class", value: result.objectClassName },
            { label: "Kind", value: result.kind },
            { label: "Registration source", value: result.registrationUrl },
          ]}
        />
      </section>
      <section className="rounded-2xl border border-border/80 bg-card/60 p-5 shadow-[0_12px_40px_-28px_rgba(0,112,243,0.35)]">
        <h3 className="text-lg font-semibold text-foreground">Registry remarks</h3>
        <div className="mt-4">
          <NetworkListTable
            columns={["Remark"]}
            rows={
              result.remarks.length > 0
                ? result.remarks.map((remark) => [remark])
                : [["No RDAP remarks returned"]]
            }
          />
        </div>
      </section>
    </section>
  )
}

export default async function NetworkWhoisPage({ params }: Props) {
  const { query } = await params
  const normalizedQuery = normalizeWhoisQuery(query)

  if (!normalizedQuery) {
    return <div className="mx-auto max-w-3xl px-4 py-16 text-sm text-muted-foreground">Invalid WHOIS query. Use a domain such as plain.tools or a public IP.</div>
  }

  if (query !== normalizedQuery) {
    permanentRedirect(`/network/whois/${encodeURIComponent(normalizedQuery)}`)
  }

  const result = await fetchWhoisLookup(normalizedQuery).catch(() => null)
  if (!result) {
    notFound()
  }
  const page = buildWhoisPage(normalizedQuery, result)

  return (
    <ProgrammaticLayout
      beforeStructuredContent={<ResultsSection result={result} />}
      breadcrumbs={page.breadcrumbs}
      featureList={page.featureList}
      heroBadges={page.heroBadges}
      liveTool={<NetworkLookupForm defaultValue={normalizedQuery} kind="whois" />}
      liveToolDescription={page.liveToolDescription}
      liveToolTitle="Run another WHOIS lookup"
      page={page.page}
      relatedSectionTitle={`Related checks after WHOIS lookup for ${normalizedQuery}`}
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
