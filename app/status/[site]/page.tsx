import type { Metadata } from 'next'
import Link from "next/link"
import { permanentRedirect } from "next/navigation"
import { Globe, Server, Radio, ChevronRight } from "lucide-react"
import { AdSlot } from "@/components/ads/ad-slot"
import { InvalidParam } from '@/components/invalid-param'
import { Surface } from '@/components/surface'
import { ToolCard } from '@/components/tool-card'
import { TrendingStatus } from "@/components/trending-status"
import { StatusHistory } from "@/components/status-history"
import { JsonLd } from "@/components/seo/json-ld"
import { buildPageMetadata } from "@/lib/page-metadata"
import {
  buildBreadcrumbList,
  buildFaqPageSchema,
  buildHowToSchema,
  buildItemListSchema,
  buildWebPageSchema,
  combineJsonLd,
} from "@/lib/structured-data"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { StatusDynamicClient } from './client'
import {
  formatSiteLabel,
  getSiteSpecificStatusContext,
  getSiteStatusContext,
  normalizeSiteInput,
  STATUS_EXAMPLE_SITES,
  STATUS_POPULAR_SITES,
  STATUS_TRAFFIC_SITES,
  statusPathFor,
} from '@/lib/site-status'
import {
  STATUS_CATEGORIES,
  STATUS_CATEGORY_META,
  STATUS_DOMAINS,
  STATUS_STATIC_DOMAINS,
} from "@/lib/status-domains"

interface Props {
  params: Promise<{ site: string }>
}

const BRAND_NAME_OVERRIDES: Record<string, string> = {
  "chatgpt.com": "ChatGPT",
  "discord.com": "Discord",
  "youtube.com": "YouTube",
  "reddit.com": "Reddit",
  "github.com": "GitHub",
  "stripe.com": "Stripe",
  "gmail.com": "Gmail",
  "google.com": "Google",
}

function toSiteDisplayName(site: string) {
  const base = formatSiteLabel(site)
  const normalized = base.toLowerCase()
  if (BRAND_NAME_OVERRIDES[normalized]) {
    return BRAND_NAME_OVERRIDES[normalized]
  }
  const host = base.split(".")[0] ?? base
  return host.charAt(0).toUpperCase() + host.slice(1)
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { site } = await params
  const decodedSite = decodeURIComponent(site)
  const normalizedSite = normalizeSiteInput(decodedSite)

  if (!normalizedSite) {
    const invalid = buildPageMetadata({
      title: "Invalid website status route",
      description:
        "The requested status route is not valid. Use a hostname such as chatgpt.com or reddit.com for a canonical availability check.",
      path: "/site-status",
      image: "/og/default.png",
    })

    return {
      ...invalid,
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  return buildPageMetadata({
    title: `Is ${toSiteDisplayName(normalizedSite)} Down Right Now?`,
    description: `Check whether ${toSiteDisplayName(normalizedSite)} is currently down or experiencing issues. Fast website availability check with troubleshooting steps.`,
    path: statusPathFor(normalizedSite),
    image: "/og/default.png",
  })
}

export function generateStaticParams() {
  return STATUS_STATIC_DOMAINS.map((site) => ({
    site: encodeURIComponent(site),
  }))
}

const baseFaqs = [
  {
    question: "How does this status check work?",
    answer: "The checker sends a live HTTP probe and reports whether the site responds successfully. It does not rely on cached status pages.",
  },
  {
    question: "Why might the site be down for me but up here?",
    answer: "Regional outages, ISP routing, or local firewall rules can affect your result differently from this check location.",
  },
  {
    question: "What does response time mean?",
    answer: "Response time is the round-trip time for the latest probe request in milliseconds.",
  },
  {
    question: "Can I check a URL path?",
    answer: "Use a domain or hostname. Paths are normalized away, so /status/google.com and /status/google.com/docs check the same host.",
  },
  {
    question: "Is it down for everyone or just me?",
    answer: "Use this result as a global signal, then compare DNS, latency, and a second network to confirm whether your issue is local.",
  },
]

const relatedTools = [
  {
    name: "DNS Lookup",
    description: "Query DNS records for any domain",
    href: "/dns-lookup",
    tags: ["Edge", "Worker"] as const,
    icon: <Server className="h-4 w-4" />,
  },
  {
    name: "What is My IP",
    description: "View your public IP address",
    href: "/what-is-my-ip",
    tags: ["Local", "Edge"] as const,
    icon: <Globe className="h-4 w-4" />,
  },
  {
    name: "Ping Test",
    description: "Test latency to any hostname",
    href: "/ping-test",
    tags: ["Edge", "Worker"] as const,
    icon: <Radio className="h-4 w-4" />,
  },
]

export default async function SiteStatusDynamicPage({ params }: Props) {
  const { site } = await params
  const decodedSite = decodeURIComponent(site)
  const normalizedSite = normalizeSiteInput(decodedSite)

  if (!normalizedSite) {
    return (
      <InvalidParam
        paramType="site"
        value={decodedSite}
        toolHref="/site-status"
        toolName="Site Status Checker"
      />
    )
  }

  const canonicalStatusPath = statusPathFor(normalizedSite)
  const directStatusPath = `/status/${encodeURIComponent(normalizedSite)}`

  // Canonical status format is domain-based.
  // Example: /status/chatgpt -> /status/chatgpt.com
  if (decodedSite !== normalizedSite || canonicalStatusPath !== directStatusPath) {
    permanentRedirect(canonicalStatusPath)
  }

  const siteLabel = formatSiteLabel(normalizedSite)
  const siteDisplayName = toSiteDisplayName(normalizedSite)
  const currentCategory =
    STATUS_DOMAINS.find((entry) => entry.domain === normalizedSite)?.category ?? null
  const siteContext = getSiteStatusContext(normalizedSite)
  const siteSpecificContext = getSiteSpecificStatusContext(normalizedSite)
  const relatedStatusChecks = Array.from(
    new Set([...siteContext.relatedExamples, ...STATUS_POPULAR_SITES, ...STATUS_EXAMPLE_SITES, ...STATUS_TRAFFIC_SITES])
  )
    .filter((value) => value !== normalizedSite)
    .slice(0, 8)
  const faqs = [
    {
      question: `Is ${siteLabel} down for everyone or just me?`,
      answer:
        `Use the live status result on this page as a global signal, then run DNS and latency checks to confirm whether access issues are local to your network.`,
    },
    ...baseFaqs,
  ]
  const troubleshootingSteps = siteContext.troubleshootingSteps.map((step, index) => ({
    name: `Step ${index + 1}`,
    text: step,
  }))
  const pageUrl = `https://plain.tools/status/${normalizedSite}`
  const schemaId = normalizedSite.replace(/[^a-z0-9-]/gi, "-").toLowerCase()
  const statusPageSchema = combineJsonLd([
    buildWebPageSchema({
      name: `Is ${siteDisplayName} Down Right Now?`,
      description:
        `Live availability check for ${siteDisplayName} with current up/down signal, response-time context, and practical checks for local versus global outage diagnosis.`,
      url: pageUrl,
    }),
    buildBreadcrumbList([
      { name: "Home", url: "https://plain.tools/" },
      { name: "Network Tools", url: "https://plain.tools/network-tools" },
      { name: "Site Status", url: "https://plain.tools/site-status" },
      { name: siteLabel, url: pageUrl },
    ]),
    buildHowToSchema(
      `How to troubleshoot ${siteLabel} availability`,
      `Practical steps to decide whether ${siteLabel} is down globally or inaccessible from your local connection.`,
      troubleshootingSteps
    ),
    buildFaqPageSchema(faqs),
    buildItemListSchema(
      `Related status checks for ${siteLabel}`,
      relatedStatusChecks.map((value) => ({
        name: `Is ${value} down?`,
        url: `https://plain.tools${statusPathFor(value)}`,
      })),
      pageUrl
    ),
  ])

  return (
    <article className="category-network">
      {statusPageSchema ? <JsonLd id={`status-page-schema-${schemaId}`} schema={statusPageSchema} /> : null}
      <nav className="border-b border-border/50" aria-label="Breadcrumb">
        <div className="mx-auto max-w-6xl px-4 py-3">
          <ol className="flex items-center gap-2 text-sm text-muted-foreground">
            <li><Link href="/" className="hover:text-foreground">Home</Link></li>
            <ChevronRight className="h-3 w-3" />
            <li><Link href="/network-tools" className="hover:text-foreground">Network Tools</Link></li>
            <ChevronRight className="h-3 w-3" />
            <li><Link href="/site-status" className="hover:text-foreground">Site Status</Link></li>
            <ChevronRight className="h-3 w-3" />
            <li className="text-foreground">{siteLabel}</li>
          </ol>
        </div>
      </nav>

      <div className="mx-auto max-w-6xl px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            Is {siteDisplayName} Down Right Now?
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Live availability check for {siteDisplayName}. Status, response time, and the latest check timestamp are shown below for this {siteContext.segmentLabel.toLowerCase()} route.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Quick answer: this page checks whether {siteLabel} is currently up or down, then helps you separate global outages from local connection issues.
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-[1fr,380px]">
          <div className="space-y-8">
            <section className="rounded-xl border border-border/70 bg-card/40 p-4 md:p-5">
              <h2 className="text-base font-semibold tracking-tight text-foreground md:text-lg">
                Quick answer
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                This page answers “is {siteLabel} down for everyone or just me?” using a live HTTP probe, plus response time for the latest successful check.
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {siteSpecificContext.answerIntro}
              </p>
              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                <article className="rounded-lg border border-border/60 bg-background/60 p-3">
                  <h3 className="text-sm font-semibold text-foreground">Up</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Host responded successfully during the latest probe.
                  </p>
                </article>
                <article className="rounded-lg border border-border/60 bg-background/60 p-3">
                  <h3 className="text-sm font-semibold text-foreground">Down</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Host timed out or failed to return a usable response.
                  </p>
                </article>
                <article className="rounded-lg border border-border/60 bg-background/60 p-3">
                  <h3 className="text-sm font-semibold text-foreground">Response time</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Round-trip latency in milliseconds for the latest check.
                  </p>
                </article>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                A site may be up globally but still inaccessible for you if local DNS cache, ISP routing, firewall policy, or regional transit issues block your path.
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <Link
                  href={`/dns/${encodeURIComponent(normalizedSite)}`}
                  className="rounded-full border border-border bg-background px-3 py-1.5 text-muted-foreground transition hover:border-[var(--category-accent,var(--accent))]/40 hover:text-foreground"
                >
                  Check DNS for {siteLabel}
                </Link>
                <Link
                  href="/ping-test"
                  className="rounded-full border border-border bg-background px-3 py-1.5 text-muted-foreground transition hover:border-[var(--category-accent,var(--accent))]/40 hover:text-foreground"
                >
                  Run latency test
                </Link>
                <Link
                  href="/what-is-my-ip"
                  className="rounded-full border border-border bg-background px-3 py-1.5 text-muted-foreground transition hover:border-[var(--category-accent,var(--accent))]/40 hover:text-foreground"
                >
                  Check local network context
                </Link>
                <Link
                  href="/status/trending"
                  className="rounded-full border border-border bg-background px-3 py-1.5 text-muted-foreground transition hover:border-[var(--category-accent,var(--accent))]/40 hover:text-foreground"
                >
                  View trending outage checks
                </Link>
              </div>
            </section>

            <Surface as="section">
              <h2 className="mb-4 text-lg font-semibold text-foreground">Current Status</h2>
              <StatusDynamicClient site={normalizedSite} siteName={siteLabel} />
            </Surface>

            <AdSlot placement="status_result_below" />

            <StatusHistory domain={normalizedSite} />

            <section>
              <h2 className="mb-4 text-xl font-semibold text-foreground">What This Means</h2>
              <div className="prose prose-invert prose-sm max-w-none">
                <p className="leading-relaxed text-muted-foreground">
                  This page checks whether <strong className="text-foreground">{siteLabel}</strong> responds to live HTTP probes. If the host responds successfully,
                  it is marked as <strong className="text-foreground">Up</strong>. If the host does not respond or times out, it is marked as <strong className="text-foreground">Down</strong>.
                </p>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  {siteContext.segmentNote}
                </p>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  {siteContext.localIssueNote}
                </p>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  {siteSpecificContext.meaningNote}
                </p>
              </div>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold text-foreground">
                Troubleshooting steps
              </h2>
              <ol className="list-decimal space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
                {siteContext.troubleshootingSteps.map((step, index) => (
                  <li key={`segment-${index}-${step}`}>{step}</li>
                ))}
                {siteSpecificContext.likelyIssues.map((step, index) => (
                  <li key={`specific-${index}-${step}`}>{step}</li>
                ))}
              </ol>
            </section>

            <AdSlot placement="status_mid" />

            <section>
              <h2 className="mb-4 text-xl font-semibold text-foreground">Frequently Asked Questions</h2>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={faq.question} value={`faq-${index}`}>
                    <AccordionTrigger className="text-left text-sm">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>
          </div>

          <aside className="space-y-6">
            <Surface>
              <h3 className="mb-3 font-semibold text-foreground">Related status checks</h3>
              <div className="space-y-2">
                {relatedStatusChecks.map((value) => (
                  <Link
                    key={value}
                    href={statusPathFor(value)}
                    className="block text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Check whether {value} is down
                  </Link>
                ))}
              </div>
              <Link
                href="/site-status"
                className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[var(--category-accent,var(--accent))] hover:underline"
              >
                Check another domain
                <ChevronRight className="h-4 w-4" />
              </Link>
              <Link
                href="/status/trending"
                className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-[var(--category-accent,var(--accent))] hover:underline"
              >
                View trending checks
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Surface>

            <TrendingStatus
              title="Trending checks today"
              limit={6}
              compact
              showDescription={false}
              showTopChecksLink={false}
            />
            <div className="rounded-xl border border-border/70 bg-card/40 p-4">
              <h3 className="text-sm font-semibold text-foreground">Also trending</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Browse the most-checked domains and jump to canonical status pages.
              </p>
              <Link
                href="/status/trending"
                className="mt-3 inline-flex text-xs font-medium text-accent transition hover:underline"
              >
                Open trending checks page
              </Link>
            </div>

            <Surface>
              <h3 className="mb-3 font-semibold text-foreground">Related network tools</h3>
              <p className="mb-3 text-sm text-muted-foreground">
                Continue diagnosing with DNS, IP, and latency checks.
              </p>
              <div className="space-y-2">
                <Link href="/network-tools" className="block text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Browse network tools
                </Link>
                <Link href="/status" className="block text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Browse status directory
                </Link>
                <Link href="/dns-lookup" className="block text-sm text-muted-foreground transition-colors hover:text-foreground">
                  DNS lookup
                </Link>
                <Link href="/what-is-my-ip" className="block text-sm text-muted-foreground transition-colors hover:text-foreground">
                  What is my IP
                </Link>
                <Link href="/ping-test" className="block text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Ping test
                </Link>
              </div>
            </Surface>

            <Surface>
              <h3 className="mb-3 font-semibold text-foreground">Browse other categories</h3>
              <p className="mb-3 text-sm text-muted-foreground">
                Move across status hubs to check adjacent services quickly.
              </p>
              <div className="flex flex-wrap gap-2">
                {STATUS_CATEGORIES.filter((value) => value !== currentCategory)
                  .slice(0, 8)
                  .map((value) => (
                    <Link
                      key={value}
                      href={`/status/${value}`}
                      className="rounded-full border border-border bg-background px-3 py-1.5 text-xs text-muted-foreground transition hover:border-[var(--category-accent,var(--accent))]/40 hover:text-foreground"
                    >
                      {STATUS_CATEGORY_META[value].title}
                    </Link>
                  ))}
              </div>
            </Surface>

            <Surface>
              <h3 className="mb-3 font-semibold text-foreground">Trust and troubleshooting guides</h3>
              <div className="space-y-2">
                <Link href="/verify-claims" className="block text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Verify local-processing claims
                </Link>
                <Link href="/learn/how-to-audit-pdf-tool-network-requests" className="block text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Learn to audit network requests in DevTools
                </Link>
                <Link href="/learn/is-it-down-for-everyone-or-just-me" className="block text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Learn how to tell global outages from local issues
                </Link>
                <Link href="/learn/what-response-time-means-in-uptime-check" className="block text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Understand response time in uptime checks
                </Link>
                <Link href="/compare/offline-vs-online-pdf-tools" className="block text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Compare local and upload-based tools
                </Link>
              </div>
            </Surface>

            <div>
              <h3 className="mb-4 font-semibold text-foreground">Related Tools</h3>
              <div className="space-y-3">
                {relatedTools.map((tool) => (
                  <ToolCard key={tool.href} {...tool} />
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </article>
  )
}
