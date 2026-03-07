import type { Metadata } from 'next'
import Link from "next/link"
import { redirect } from "next/navigation"
import { Globe, Server, Radio, ChevronRight } from "lucide-react"
import { InvalidParam } from '@/components/invalid-param'
import { Surface } from '@/components/surface'
import { ToolCard } from '@/components/tool-card'
import { generateDynamicToolMetadata } from '@/lib/seo'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { StatusDynamicClient } from './client'
import {
  formatSiteLabel,
  normalizeSiteInput,
  STATUS_EXAMPLE_SITES,
  statusPathFor,
} from '@/lib/site-status'

interface Props {
  params: Promise<{ site: string }>
}

function toSiteDisplayName(site: string) {
  const base = formatSiteLabel(site)
  const host = base.split('.')[0] ?? base
  return host.charAt(0).toUpperCase() + host.slice(1)
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { site } = await params
  const decodedSite = decodeURIComponent(site)
  const normalizedSite = normalizeSiteInput(decodedSite)

  return generateDynamicToolMetadata({
    toolName: 'Site Status',
    param: normalizedSite ?? decodedSite,
    paramType: 'site',
    isValid: Boolean(normalizedSite),
  })
}

const faqs = [
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

  if (decodedSite !== normalizedSite) {
    redirect(statusPathFor(normalizedSite))
  }

  const siteLabel = formatSiteLabel(normalizedSite)
  const siteDisplayName = toSiteDisplayName(normalizedSite)

  return (
    <article className="category-network">
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
            Is {siteLabel} down?
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Live availability check for {siteDisplayName}. Status, response time, and the latest check timestamp are shown below.
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-[1fr,380px]">
          <div className="space-y-8">
            <section className="rounded-xl border border-border/70 bg-card/40 p-4 md:p-5">
              <h2 className="text-base font-semibold tracking-tight text-foreground md:text-lg">
                Quick answer
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                This page reports whether {siteLabel} is currently up or down based on a live HTTP probe, plus response time for the latest successful check.
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
              </div>
            </section>

            <Surface as="section">
              <h2 className="mb-4 text-lg font-semibold text-foreground">Current Status</h2>
              <StatusDynamicClient site={normalizedSite} siteName={siteLabel} />
            </Surface>

            <section>
              <h2 className="mb-4 text-xl font-semibold text-foreground">What This Means</h2>
              <div className="prose prose-invert prose-sm max-w-none">
                <p className="leading-relaxed text-muted-foreground">
                  This page checks whether <strong className="text-foreground">{siteLabel}</strong> responds to live HTTP probes. If the host responds successfully,
                  it is marked as <strong className="text-foreground">Up</strong>. If the host does not respond or times out, it is marked as <strong className="text-foreground">Down</strong>.
                </p>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  Status can differ from your local experience. Regional routing, ISP filtering, or temporary edge failures can affect what you see from a specific location.
                </p>
              </div>
            </section>

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
              <h3 className="mb-3 font-semibold text-foreground">Check Other Sites</h3>
              <div className="space-y-2">
                {STATUS_EXAMPLE_SITES.filter((value) => value !== normalizedSite).slice(0, 5).map((value) => (
                  <Link
                    key={value}
                    href={statusPathFor(value)}
                    className="block text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Is {value} down?
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
            </Surface>

            <Surface>
              <h3 className="mb-3 font-semibold text-foreground">Network Toolkit</h3>
              <p className="mb-3 text-sm text-muted-foreground">
                Continue diagnosing with DNS, IP, and latency checks.
              </p>
              <div className="space-y-2">
                <Link href="/network-tools" className="block text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Browse network tools
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
