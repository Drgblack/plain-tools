import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { JsonLd } from "@/components/seo/json-ld"
import { PageBreadcrumbs } from "@/components/seo/page-breadcrumbs"
import { StatusDynamicClient } from "@/app/status/[site]/client"
import { buildPageMetadata } from "@/lib/page-metadata"
import {
  getStatusQueryPageBySlug,
  statusQueryPathForSlug,
  STATUS_QUERY_PAGES,
} from "@/lib/status-query-pages"
import { getSiteStatusContext, statusPathFor } from "@/lib/site-status"
import {
  buildBreadcrumbList,
  buildFaqPageSchema,
  buildItemListSchema,
  buildWebPageSchema,
  combineJsonLd,
} from "@/lib/structured-data"

interface Props {
  params: Promise<{ site: string }>
}

export function generateStaticParams() {
  return STATUS_QUERY_PAGES.map((entry) => ({ site: entry.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { site } = await params
  const entry = getStatusQueryPageBySlug(site)

  if (!entry) {
    return {
      title: "Status check page unavailable | Plain Tools",
      description:
        "This status query page is not available. Use the status directory to check a supported domain.",
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  const metadata = buildPageMetadata({
    title: `Is ${entry.name} Down Right Now?`,
    description: `Check whether ${entry.name} is currently down. Instant website status check with troubleshooting steps and related network tools.`,
    path: statusQueryPathForSlug(entry.slug),
    image: "/og/default.png",
  })

  return {
    ...metadata,
    alternates: {
      ...metadata.alternates,
      canonical: `https://plain.tools${statusPathFor(entry.domain)}`,
    },
    robots: {
      index: false,
      follow: true,
    },
  }
}

export default async function IsSiteDownPage({ params }: Props) {
  const { site } = await params
  const entry = getStatusQueryPageBySlug(site)

  if (!entry) {
    notFound()
  }

  const relatedChecks = STATUS_QUERY_PAGES.filter((value) => value.slug !== entry.slug).slice(0, 5)
  const statusContext = getSiteStatusContext(entry.domain)

  const faqItems = [
    {
      question: `Is ${entry.name} down right now?`,
      answer:
        `Use the live checker on this page. It reports whether ${entry.name} responded during the latest probe.`,
    },
    {
      question: `Why is ${entry.name} not working?`,
      answer:
        "Possible causes include a service outage, DNS resolver problems, regional routing issues, or local network restrictions.",
    },
    {
      question: `How can I check if ${entry.name} is down?`,
      answer:
        "Run the status check, review response time, then validate DNS and latency with related tools to isolate local versus global issues.",
    },
  ]

  const pagePath = statusQueryPathForSlug(entry.slug)
  const schema = combineJsonLd([
    buildWebPageSchema({
      name: `Is ${entry.name} Down Right Now?`,
      description: `Live status check for ${entry.name} with response timing and practical troubleshooting steps.`,
      url: `https://plain.tools${pagePath}`,
    }),
    buildBreadcrumbList([
      { name: "Home", url: "https://plain.tools/" },
      { name: "Status", url: "https://plain.tools/status" },
      { name: `Is ${entry.name} Down`, url: `https://plain.tools${pagePath}` },
    ]),
    buildFaqPageSchema(faqItems),
    buildItemListSchema(
      `Related checks for ${entry.name}`,
      relatedChecks.map((value) => ({
        name: `Is ${value.name} down?`,
        url: `https://plain.tools${statusQueryPathForSlug(value.slug)}`,
      })),
      `https://plain.tools${pagePath}`
    ),
  ])

  return (
    <article className="min-h-screen bg-background">
      {schema ? <JsonLd id={`status-query-schema-${entry.slug}`} schema={schema} /> : null}

      <section className="border-b border-border/60 px-4 py-10">
        <div className="mx-auto max-w-6xl space-y-4">
          <PageBreadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Status", href: "/status" },
              { label: `Is ${entry.name} Down` },
            ]}
          />
          <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            Is {entry.name} Down Right Now?
          </h1>
          <p className="max-w-4xl text-sm leading-relaxed text-muted-foreground md:text-base">
            This page checks whether {entry.name} is currently reachable. If the service appears
            down, it may indicate a server outage, regional issue, DNS problem, or local network
            connectivity failure.
          </p>
          <div className="flex flex-wrap gap-2 text-xs">
            <Link
              href={statusPathFor(entry.domain)}
              className="rounded-full border border-border bg-card px-3 py-1.5 text-muted-foreground transition hover:border-accent/40 hover:text-accent"
            >
              Open canonical status page ({entry.domain})
            </Link>
            <Link
              href="/status"
              className="rounded-full border border-border bg-card px-3 py-1.5 text-muted-foreground transition hover:border-accent/40 hover:text-accent"
            >
              Browse status directory
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-border/60 px-4 py-10">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-4 text-lg font-semibold text-foreground">Current Status</h2>
          <StatusDynamicClient site={entry.domain} siteName={entry.name} />
        </div>
      </section>

      <section className="border-b border-border/60 px-4 py-10">
        <div className="mx-auto max-w-6xl space-y-4">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            What does “down” mean?
          </h2>
          <p className="max-w-4xl text-sm leading-relaxed text-muted-foreground">
            “Down” means the latest check could not get a usable response from {entry.name}. This
            can reflect a platform outage, DNS resolver issue, regional connectivity failure, or
            local firewall/network constraints.
          </p>
          <div className="grid gap-3 md:grid-cols-3">
            <article className="rounded-lg border border-border/60 bg-card/40 p-4 text-sm text-muted-foreground">
              <h3 className="font-semibold text-foreground">Service outage</h3>
              <p className="mt-2">The provider may be experiencing an incident.</p>
            </article>
            <article className="rounded-lg border border-border/60 bg-card/40 p-4 text-sm text-muted-foreground">
              <h3 className="font-semibold text-foreground">DNS issue</h3>
              <p className="mt-2">Resolver failures can block domain lookups.</p>
            </article>
            <article className="rounded-lg border border-border/60 bg-card/40 p-4 text-sm text-muted-foreground">
              <h3 className="font-semibold text-foreground">Regional/local path issue</h3>
              <p className="mt-2">Routing, ISP, or local policy can affect only some users.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="border-b border-border/60 px-4 py-10">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            Troubleshooting steps
          </h2>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
            <li>Refresh the page and run the check again.</li>
            <li>Check the official {entry.name} status page if available.</li>
            <li>Try another network connection (mobile hotspot or VPN off).</li>
            <li>Flush DNS cache and retry.</li>
            <li>Wait a few minutes and run another check.</li>
            {statusContext.troubleshootingSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-b border-border/60 px-4 py-10">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">Related tools</h2>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <Link href="/dns-lookup" className="rounded-full border border-border bg-card px-3 py-1.5 text-muted-foreground transition hover:border-accent/40 hover:text-accent">
              DNS lookup
            </Link>
            <Link href="/ping-test" className="rounded-full border border-border bg-card px-3 py-1.5 text-muted-foreground transition hover:border-accent/40 hover:text-accent">
              Latency test
            </Link>
            <Link href="/what-is-my-ip" className="rounded-full border border-border bg-card px-3 py-1.5 text-muted-foreground transition hover:border-accent/40 hover:text-accent">
              IP checker
            </Link>
            <Link href="/network-tools" className="rounded-full border border-border bg-card px-3 py-1.5 text-muted-foreground transition hover:border-accent/40 hover:text-accent">
              Network tools hub
            </Link>
          </div>
        </div>
      </section>

      <section className="px-4 py-10">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">Related status checks</h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {relatedChecks.map((value) => (
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
        </div>
      </section>
    </article>
  )
}
