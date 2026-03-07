import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { StatusDynamicClient } from "@/app/status/[site]/client"
import { JsonLd } from "@/components/seo/json-ld"
import { PageBreadcrumbs } from "@/components/seo/page-breadcrumbs"
import { StatusHistory } from "@/components/status-history"
import { BASE_URL, buildCanonicalUrl } from "@/lib/page-metadata"
import {
  getOutageHistoryPageBySlug,
  getRelatedOutageHistoryPages,
  outageHistoryPathForSlug,
  OUTAGE_HISTORY_PAGES,
} from "@/lib/outage-history-pages"
import {
  formatOutageDuration,
  getRecentOutageIncidents,
} from "@/lib/outage-history"
import { statusQueryPathForSlug, STATUS_QUERY_PAGES } from "@/lib/status-query-pages"
import { getSiteStatusContext, statusPathFor } from "@/lib/site-status"
import {
  buildBreadcrumbList,
  buildFaqPageSchema,
  buildItemListSchema,
  buildWebPageSchema,
  combineJsonLd,
} from "@/lib/structured-data"

interface Props {
  params: Promise<{ service: string }>
}

export const revalidate = 300
export const dynamicParams = false

export function generateStaticParams() {
  return OUTAGE_HISTORY_PAGES.map((entry) => ({
    service: entry.slug,
  }))
}

function formatOutageDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value))
}

function buildMetadata(entry: (typeof OUTAGE_HISTORY_PAGES)[number]): Metadata {
  const path = outageHistoryPathForSlug(entry.slug)
  const canonical = buildCanonicalUrl(path)
  const title = `${entry.name} Outage History | Plain.tools`
  const description = `View recent ${entry.name} outages and uptime history. Check whether ${entry.name} is currently down and see recent incidents.`

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        en: canonical,
        de: canonical,
        "x-default": canonical,
      },
    },
    openGraph: {
      type: "website",
      siteName: "Plain Tools",
      locale: "en_GB",
      title,
      description,
      url: canonical,
      images: [
        {
          url: "/og/default.png",
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og/default.png"],
    },
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { service } = await params
  const entry = getOutageHistoryPageBySlug(service)

  if (!entry) {
    return {
      title: "Outage history page unavailable | Plain.tools",
      description:
        "This outage history page is not available. Use the status directory to check a supported service.",
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  return buildMetadata(entry)
}

export default async function OutageHistoryPage({ params }: Props) {
  const { service } = await params
  const entry = getOutageHistoryPageBySlug(service)

  if (!entry) {
    notFound()
  }

  const path = outageHistoryPathForSlug(entry.slug)
  const canonicalStatusPath = statusPathFor(entry.domain)
  const relatedOutagePages = getRelatedOutageHistoryPages(entry.slug, 5)
  const relatedStatusChecks = STATUS_QUERY_PAGES.filter((value) => value.slug !== entry.slug).slice(
    0,
    4
  )
  const statusContext = getSiteStatusContext(entry.domain)
  const recentOutages = await getRecentOutageIncidents(entry.domain, {
    hours: 72,
    limit: 6,
  })

  const faqItems = [
    {
      question: `Has ${entry.name} been down today?`,
      answer:
        `Use the live status check on this page and review the recent outage table for the latest aggregated reachability events we have recorded for ${entry.name}.`,
    },
    {
      question: `Why does ${entry.name} go down?`,
      answer:
        `${entry.name} can fail because of server overload, DNS issues, cloud provider incidents, regional routing failures, or partial platform outages.`,
    },
    {
      question: `How can I check ${entry.name} server status?`,
      answer:
        `Start with the live check on this page, then compare the 24-hour timeline, the canonical status route, DNS lookup results, and a latency test to separate global outages from local connection problems.`,
    },
  ]

  const schema = combineJsonLd([
    buildWebPageSchema({
      name: `${entry.name} Outage History`,
      description: `Recent ${entry.name} outage history, live status, and troubleshooting guidance built from aggregated reachability checks.`,
      url: `${BASE_URL}${path}`,
    }),
    buildBreadcrumbList([
      { name: "Home", url: BASE_URL },
      { name: "Status", url: `${BASE_URL}/status` },
      { name: `${entry.name} Outage History`, url: `${BASE_URL}${path}` },
    ]),
    buildFaqPageSchema(faqItems),
    buildItemListSchema(
      `${entry.name} outage history links`,
      [
        {
          name: `${entry.name} canonical status page`,
          url: `${BASE_URL}${canonicalStatusPath}`,
        },
        {
          name: `Is ${entry.name} down`,
          url: `${BASE_URL}${statusQueryPathForSlug(entry.slug)}`,
        },
        ...relatedOutagePages.map((value) => ({
          name: `${value.name} outage history`,
          url: `${BASE_URL}${outageHistoryPathForSlug(value.slug)}`,
        })),
      ],
      `${BASE_URL}${path}`
    ),
  ])

  return (
    <article className="min-h-screen bg-background">
      {schema ? <JsonLd id={`outage-history-schema-${entry.slug}`} schema={schema} /> : null}

      <section className="border-b border-border/60 px-4 py-10">
        <div className="mx-auto max-w-6xl space-y-4">
          <PageBreadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Status", href: "/status" },
              { label: `${entry.name} Outage History` },
            ]}
          />
          <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            {entry.name} Outage History
          </h1>
          <p className="max-w-4xl text-sm leading-relaxed text-muted-foreground md:text-base">
            This page tracks recent {entry.name} availability checks, current status, and short
            outage history for {entry.domain}. We detect outages from anonymous aggregated status
            checks only, then use the timeline below to show whether failures look isolated or
            widespread.
          </p>
          <p className="max-w-4xl text-sm leading-relaxed text-muted-foreground">
            A failed check does not always mean a global outage. Local DNS issues, ISP routing,
            captive portals, or firewall policy can block you while the service remains reachable
            elsewhere.
          </p>
          <div className="flex flex-wrap gap-2 text-xs">
            <Link
              href={statusQueryPathForSlug(entry.slug)}
              className="rounded-full border border-border bg-card px-3 py-1.5 text-muted-foreground transition hover:border-accent/40 hover:text-accent"
            >
              Is {entry.name} down?
            </Link>
            <Link
              href={canonicalStatusPath}
              className="rounded-full border border-border bg-card px-3 py-1.5 text-muted-foreground transition hover:border-accent/40 hover:text-accent"
            >
              Open canonical status page
            </Link>
            <Link
              href={`/dns/${encodeURIComponent(entry.domain)}`}
              className="rounded-full border border-border bg-card px-3 py-1.5 text-muted-foreground transition hover:border-accent/40 hover:text-accent"
            >
              Check DNS for {entry.domain}
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-border/60 px-4 py-10">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-lg font-semibold text-foreground">Current status</h2>
          <p className="mt-2 max-w-4xl text-sm leading-relaxed text-muted-foreground">
            Live status uses the existing status checker and shows whether the latest probe was up
            or down, along with response time and the most recent check timestamp.
          </p>
          <div className="mt-4 rounded-xl border border-border/70 bg-card/40 p-4 md:p-5">
            <StatusDynamicClient site={entry.domain} siteName={entry.name} />
          </div>
        </div>
      </section>

      <section className="border-b border-border/60 px-4 py-10">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-lg font-semibold text-foreground">Recent outages</h2>
          <p className="mt-2 max-w-4xl text-sm leading-relaxed text-muted-foreground">
            Recent outage history is inferred from aggregated check history only. We do not collect
            user reports, login data, or personal identifiers.
          </p>
          <div className="mt-4 overflow-hidden rounded-xl border border-border/70 bg-card/40">
            <table className="min-w-full divide-y divide-border/60 text-sm">
              <thead className="bg-background/70 text-left text-xs uppercase tracking-[0.12em] text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Duration</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {recentOutages && recentOutages.incidents.length > 0 ? (
                  recentOutages.incidents.map((incident) => (
                    <tr key={`${incident.startedAt}-${incident.endedAt ?? "ongoing"}`}>
                      <td className="px-4 py-3 text-foreground">
                        {formatOutageDate(incident.startedAt)}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {formatOutageDuration(incident.durationMinutes)}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{incident.label}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="px-4 py-3 text-foreground">Last 72 hours</td>
                    <td className="px-4 py-3 text-muted-foreground">No outages</td>
                    <td className="px-4 py-3 text-muted-foreground">Stable</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="border-b border-border/60 px-4 py-10">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-lg font-semibold text-foreground">24-hour status timeline</h2>
          <p className="mt-2 max-w-4xl text-sm leading-relaxed text-muted-foreground">
            Green means reachable, red means unreachable, and grey means no recent aggregated check
            was available for that hour bucket.
          </p>
          <div className="mt-4">
            <StatusHistory domain={entry.domain} />
          </div>
        </div>
      </section>

      <section className="border-b border-border/60 px-4 py-10">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-lg font-semibold text-foreground">What causes outages</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            {[
              ["Server overload", "Traffic spikes can overwhelm front-end or API capacity."],
              ["Infrastructure failure", "Load balancers, databases, or edge networks can fail."],
              ["DNS issues", "Resolver or DNS propagation problems can break access before HTTP."],
              ["Regional outages", "A service may fail in one geography while staying up elsewhere."],
              ["Cloud provider issues", "Shared cloud incidents can impact many services at once."],
            ].map(([title, description]) => (
              <article key={title} className="rounded-lg border border-border/60 bg-card/40 p-4">
                <h3 className="text-sm font-semibold text-foreground">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
              </article>
            ))}
          </div>
          <p className="mt-4 max-w-4xl text-sm leading-relaxed text-muted-foreground">
            For {entry.name}, {statusContext.segmentNote.toLowerCase()}
          </p>
        </div>
      </section>

      <section className="border-b border-border/60 px-4 py-10">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-lg font-semibold text-foreground">Troubleshooting</h2>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
            <li>Refresh the page and run the live check again.</li>
            <li>Try another network connection to separate local issues from broader outages.</li>
            <li>Check the official {entry.name} status page if one is published.</li>
            <li>Flush DNS cache or switch resolvers if name resolution looks inconsistent.</li>
            <li>Try again later if recent checks show an ongoing outage or unstable recovery.</li>
          </ol>
        </div>
      </section>

      <section className="border-b border-border/60 px-4 py-10">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-2">
          <section>
            <h2 className="text-lg font-semibold text-foreground">Related status checks</h2>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              <li>
                <Link
                  href={statusQueryPathForSlug(entry.slug)}
                  className="block rounded-md border border-border/60 bg-card/40 px-3 py-2 text-sm text-muted-foreground transition hover:border-accent/40 hover:text-accent"
                >
                  Is {entry.name} down?
                </Link>
              </li>
              {relatedStatusChecks.map((value) => (
                <li key={value.slug}>
                  <Link
                    href={statusQueryPathForSlug(value.slug)}
                    className="block rounded-md border border-border/60 bg-card/40 px-3 py-2 text-sm text-muted-foreground transition hover:border-accent/40 hover:text-accent"
                  >
                    Is {value.name} down?
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">Related network tools</h2>
            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              <Link
                href="/dns-lookup"
                className="rounded-full border border-border bg-card px-3 py-1.5 text-muted-foreground transition hover:border-accent/40 hover:text-accent"
              >
                DNS lookup
              </Link>
              <Link
                href="/ping-test"
                className="rounded-full border border-border bg-card px-3 py-1.5 text-muted-foreground transition hover:border-accent/40 hover:text-accent"
              >
                Latency tester
              </Link>
              <Link
                href="/what-is-my-ip"
                className="rounded-full border border-border bg-card px-3 py-1.5 text-muted-foreground transition hover:border-accent/40 hover:text-accent"
              >
                IP checker
              </Link>
              <Link
                href="/network-tools"
                className="rounded-full border border-border bg-card px-3 py-1.5 text-muted-foreground transition hover:border-accent/40 hover:text-accent"
              >
                Network tools hub
              </Link>
            </div>
          </section>
        </div>
      </section>

      <section className="px-4 py-10">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-lg font-semibold text-foreground">Related outage history pages</h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {relatedOutagePages.map((value) => (
              <li key={value.slug}>
                <Link
                  href={outageHistoryPathForSlug(value.slug)}
                  className="block rounded-md border border-border/60 bg-card/40 px-3 py-2 text-sm text-muted-foreground transition hover:border-accent/40 hover:text-accent"
                >
                  {value.name} outage history
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </article>
  )
}
