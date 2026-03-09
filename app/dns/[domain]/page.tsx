import type { Metadata } from "next"
import Link from "next/link"
import { Globe, Radio, Server, Wifi } from "lucide-react"
import { permanentRedirect } from "next/navigation"

import { InvalidParam } from "@/components/invalid-param"
import { JsonLd } from "@/components/seo/json-ld"
import { Surface } from "@/components/surface"
import { ToolCard } from "@/components/tool-card"
import { buildPageMetadata } from "@/lib/page-metadata"
import {
  DNS_RECORD_DEFINITIONS,
  DNS_RECORD_TYPES,
  DNS_SITEMAP_DOMAINS,
  fetchDnsRecordsForPage,
  formatDnsRecordValue,
  isValidDnsDomain,
  normalizeDnsDomain,
  parseSoaRecord,
  type DnsRecordType,
} from "@/lib/network-dns"
import {
  buildBreadcrumbList,
  buildFaqPageSchema,
  buildWebPageSchema,
  combineJsonLd,
} from "@/lib/structured-data"

type Props = {
  params: Promise<{ domain: string }>
}

export const revalidate = 1800

const relatedTools = [
  {
    name: "What Is My IP",
    description: "View the public IP your browser exposes and compare local network context.",
    href: "/what-is-my-ip",
    tags: ["Local", "Edge"] as const,
    icon: <Globe className="h-4 w-4" />,
  },
  {
    name: "Site Status",
    description: "Check whether the domain is reachable or whether the issue sits above DNS.",
    href: "/site-status",
    tags: ["Edge"] as const,
    icon: <Wifi className="h-4 w-4" />,
  },
  {
    name: "Ping Test",
    description: "Measure latency after DNS resolves so you can separate resolution from transport issues.",
    href: "/ping-test",
    tags: ["Edge", "Worker"] as const,
    icon: <Radio className="h-4 w-4" />,
  },
]

function buildDnsFaq(domain: string) {
  return [
    {
      question: `What DNS records should I check first for ${domain}?`,
      answer:
        "Start with A and AAAA for web reachability, MX for email delivery, NS for delegation, and TXT when you are troubleshooting verification or mail authentication.",
    },
    {
      question: `Why do DNS answers for ${domain} sometimes change between checks?`,
      answer:
        "Resolvers can return different answers because of load balancing, geographic routing, DNS propagation, or multiple valid records with the same name.",
    },
    {
      question: "What does TTL mean in a DNS lookup?",
      answer:
        "TTL is the cache lifetime for the answer in seconds. Lower TTL values allow faster changes but make resolvers re-query more often.",
    },
    {
      question: `Why can ${domain} look normal in DNS but still fail for users?`,
      answer:
        "A domain can resolve correctly while the origin server, CDN, TLS configuration, or network path still has problems. That is why DNS should be checked alongside site status and latency.",
    },
  ]
}

function buildDnsDescription(domain: string) {
  return `Check A, AAAA, MX, NS, TXT, SOA, and CNAME records for ${domain}. View TTL values, nameserver delegation, email routing, and DNS propagation clues with a privacy-first DNS lookup.`
}

export async function generateStaticParams() {
  return DNS_SITEMAP_DOMAINS.map((domain) => ({ domain }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { domain } = await params
  const normalizedDomain = normalizeDnsDomain(domain)

  if (!normalizedDomain || !isValidDnsDomain(normalizedDomain)) {
    const invalid = buildPageMetadata({
      title: "Invalid DNS Lookup Domain | Plain Tools",
      description:
        "The requested domain is not valid for DNS lookup. Enter a hostname such as example.com to inspect A, MX, NS, TXT, SOA, and CNAME records.",
      path: `/dns/${encodeURIComponent(domain)}`,
      image: "/og/default.png",
      googleNotranslate: true,
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
    title: `DNS Lookup for ${normalizedDomain} | A, MX, NS Records | Plain Tools`,
    description: buildDnsDescription(normalizedDomain),
    path: `/dns/${encodeURIComponent(normalizedDomain)}`,
    image: "/og/default.png",
    googleNotranslate: true,
  })
}

function RecordTable({
  domain,
  type,
  answers,
  resolver,
  status,
  error,
}: {
  answers: Awaited<ReturnType<typeof fetchDnsRecordsForPage>>[number]["answers"]
  domain: string
  error: string | null
  resolver: string | null
  status: number | null
  type: DnsRecordType
}) {
  const definition = DNS_RECORD_DEFINITIONS[type]

  return (
    <article className="rounded-2xl border border-border/80 bg-card/60 p-5 shadow-[0_12px_40px_-28px_rgba(0,112,243,0.35)]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            {definition.label}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {definition.explanation}
          </p>
        </div>
        <div className="rounded-full border border-border/70 bg-background/70 px-3 py-1 text-xs uppercase tracking-[0.14em] text-muted-foreground">
          {type}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
        <span className="rounded-full border border-border/60 bg-background/70 px-3 py-1">
          {resolver ? `Resolver: ${resolver}` : "Resolver unavailable"}
        </span>
        <span className="rounded-full border border-border/60 bg-background/70 px-3 py-1">
          {typeof status === "number" ? `DNS status ${status}` : "No DNS status"}
        </span>
      </div>

      {error ? (
        <div className="mt-4 rounded-xl border border-red-400/20 bg-red-500/5 p-4 text-sm leading-relaxed text-red-100">
          Lookup failed for {type} records on {domain}: {error}
        </div>
      ) : null}

      {!error && answers.length === 0 ? (
        <div className="mt-4 rounded-xl border border-border/70 bg-background/60 p-4 text-sm leading-relaxed text-muted-foreground">
          {definition.emptyState}
        </div>
      ) : null}

      {!error && answers.length > 0 ? (
        <div className="mt-4 overflow-hidden rounded-xl border border-border/70">
          <table className="min-w-full divide-y divide-border/70 text-left text-sm">
            <thead className="bg-background/80">
              <tr>
                <th className="px-4 py-3 font-medium text-foreground">Host</th>
                <th className="px-4 py-3 font-medium text-foreground">Value</th>
                <th className="px-4 py-3 font-medium text-foreground">TTL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 bg-card/40">
              {answers.map((answer, index) => {
                const parsedSoa = type === "SOA" ? parseSoaRecord(answer.data) : null
                return (
                  <tr key={`${type}-${answer.data}-${index}`}>
                    <td className="px-4 py-3 align-top font-mono text-xs text-muted-foreground">
                      {answer.name}
                    </td>
                    <td className="px-4 py-3 align-top">
                      <div className="font-mono text-sm text-foreground">
                        {formatDnsRecordValue(type, answer)}
                      </div>
                      {parsedSoa ? (
                        <dl className="mt-2 grid gap-1 text-xs text-muted-foreground sm:grid-cols-2">
                          <div>
                            <dt className="font-medium text-foreground">Primary NS</dt>
                            <dd>{parsedSoa.primaryNs}</dd>
                          </div>
                          <div>
                            <dt className="font-medium text-foreground">Admin Mailbox</dt>
                            <dd>{parsedSoa.adminEmail}</dd>
                          </div>
                          <div>
                            <dt className="font-medium text-foreground">Serial</dt>
                            <dd>{parsedSoa.serial}</dd>
                          </div>
                          <div>
                            <dt className="font-medium text-foreground">Refresh / Retry</dt>
                            <dd>
                              {parsedSoa.refresh} / {parsedSoa.retry}
                            </dd>
                          </div>
                          <div>
                            <dt className="font-medium text-foreground">Expire</dt>
                            <dd>{parsedSoa.expire}</dd>
                          </div>
                          <div>
                            <dt className="font-medium text-foreground">Minimum</dt>
                            <dd>{parsedSoa.minimum}</dd>
                          </div>
                        </dl>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 align-top font-mono text-xs text-muted-foreground">
                      {answer.ttl}s
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      ) : null}
    </article>
  )
}

export default async function DNSDomainPage({ params }: Props) {
  const { domain } = await params
  const normalizedDomain = normalizeDnsDomain(domain)

  if (!normalizedDomain || !isValidDnsDomain(normalizedDomain)) {
    return (
      <InvalidParam
        paramType="domain"
        value={domain}
        toolHref="/dns-lookup"
        toolName="DNS Lookup"
      />
    )
  }

  if (domain !== normalizedDomain) {
    permanentRedirect(`/dns/${encodeURIComponent(normalizedDomain)}`)
  }

  const faq = buildDnsFaq(normalizedDomain)
  const records = await fetchDnsRecordsForPage(normalizedDomain, revalidate)
  const schema = combineJsonLd([
    buildWebPageSchema({
      name: `DNS Lookup for ${normalizedDomain}`,
      description: buildDnsDescription(normalizedDomain),
      url: `https://plain.tools/dns/${encodeURIComponent(normalizedDomain)}`,
    }),
    buildFaqPageSchema(faq),
    buildBreadcrumbList([
      { name: "Home", url: "https://plain.tools/" },
      { name: "Network Tools", url: "https://plain.tools/network-tools" },
      { name: "DNS Lookup", url: "https://plain.tools/dns-lookup" },
      {
        name: normalizedDomain,
        url: `https://plain.tools/dns/${encodeURIComponent(normalizedDomain)}`,
      },
    ]),
  ])

  return (
    <article className="category-network">
      {schema ? <JsonLd id={`dns-lookup-${normalizedDomain}-schema`} schema={schema} /> : null}

      <div className="border-b border-border/50">
        <div className="mx-auto max-w-6xl px-4 py-3">
          <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
            <ol className="flex flex-wrap items-center gap-2">
              <li><Link href="/" className="hover:text-foreground">Home</Link></li>
              <li>/</li>
              <li><Link href="/network-tools" className="hover:text-foreground">Network Tools</Link></li>
              <li>/</li>
              <li><Link href="/dns-lookup" className="hover:text-foreground">DNS Lookup</Link></li>
              <li>/</li>
              <li className="text-foreground">{normalizedDomain}</li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-10">
        <header className="max-w-4xl">
          <div className="inline-flex items-center rounded-full border border-accent/25 bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-accent">
            DNS Records with TTL
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            DNS Lookup for {normalizedDomain}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
            Check real A, AAAA, MX, NS, TXT, SOA, and CNAME records for{" "}
            <span className="font-medium text-foreground">{normalizedDomain}</span>. This page
            fetches live DNS answers, shows TTL values, and explains what each record means so you
            can diagnose propagation, mail routing, nameserver delegation, and web-resolution
            issues without guessing.
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
            <span className="rounded-full border border-border/60 bg-background/70 px-3 py-1">
              Long-tail DNS diagnostics
            </span>
            <span className="rounded-full border border-border/60 bg-background/70 px-3 py-1">
              TTL visibility
            </span>
            <span className="rounded-full border border-border/60 bg-background/70 px-3 py-1">
              Email and nameserver checks
            </span>
          </div>
        </header>

        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-8">
            <Surface as="section">
              <h2 className="text-xl font-semibold tracking-tight text-foreground">
                DNS record summary for {normalizedDomain}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Each record type below answers a different troubleshooting question. Web access
                usually starts with A or AAAA, email depends on MX, delegation depends on NS and
                SOA, and TXT often explains why verification or SPF checks are failing.
              </p>
            </Surface>

            {records.map((record) => (
              <RecordTable
                key={record.type}
                answers={record.answers}
                domain={normalizedDomain}
                error={record.error}
                resolver={record.resolver}
                status={record.status}
                type={record.type}
              />
            ))}

            <Surface as="section">
              <h2 className="text-xl font-semibold tracking-tight text-foreground">
                What these DNS records mean
              </h2>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {DNS_RECORD_TYPES.map((type) => (
                  <div key={type} className="rounded-xl border border-border/70 bg-background/60 p-4">
                    <h3 className="font-semibold text-foreground">
                      {DNS_RECORD_DEFINITIONS[type].label}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {DNS_RECORD_DEFINITIONS[type].description}
                    </p>
                  </div>
                ))}
              </div>
            </Surface>

            <Surface as="section">
              <h2 className="text-xl font-semibold tracking-tight text-foreground">
                Why DNS matters for {normalizedDomain}
              </h2>
              <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground">
                <p>
                  DNS is the control plane that tells browsers, mail servers, and other services
                  where the domain should point. When users report that a website is down, email is
                  bouncing, or a verification token is failing, DNS is often the first place to
                  check because it can break before the application itself changes.
                </p>
                <p>
                  For {normalizedDomain}, the important question is not only whether a record
                  exists. It is whether the answer matches the infrastructure you expect and
                  whether the TTL values explain why one resolver still shows an older result.
                  That makes this route useful for propagation checks, SaaS onboarding, domain
                  verification, and routine production troubleshooting.
                </p>
              </div>
            </Surface>

            <Surface as="section">
              <h2 className="text-xl font-semibold tracking-tight text-foreground">
                Common DNS issues
              </h2>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
                <li className="rounded-xl border border-border/70 bg-background/60 p-4">
                  Wrong A or AAAA values can send traffic to the wrong host or leave one protocol
                  path broken while another still works.
                </li>
                <li className="rounded-xl border border-border/70 bg-background/60 p-4">
                  Missing or incorrect MX records can break mail delivery even when the website is
                  healthy.
                </li>
                <li className="rounded-xl border border-border/70 bg-background/60 p-4">
                  TXT records are often the cause of failed SPF, DKIM, DMARC, and domain
                  verification checks because one typo or missing quote invalidates the entry.
                </li>
                <li className="rounded-xl border border-border/70 bg-background/60 p-4">
                  Delegation problems show up in NS and SOA first. If nameservers are wrong, every
                  other record can look inconsistent depending on which resolver you ask.
                </li>
              </ul>
            </Surface>

            <Surface as="section">
              <h2 className="text-xl font-semibold tracking-tight text-foreground">
                Frequently asked questions
              </h2>
              <div className="mt-4 space-y-4">
                {faq.map((item) => (
                  <div key={item.question} className="rounded-xl border border-border/70 bg-background/60 p-4">
                    <h3 className="font-semibold text-foreground">{item.question}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {item.answer}
                    </p>
                  </div>
                ))}
              </div>
            </Surface>
          </div>

          <aside className="space-y-6">
            <Surface>
              <h2 className="text-lg font-semibold tracking-tight text-foreground">
                Run another lookup
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Need a fresh hostname or a browser-side query flow? Open the main DNS lookup tool.
              </p>
              <Link
                href="/dns-lookup"
                className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[var(--category-accent,var(--accent))] hover:underline"
              >
                Open DNS Lookup Tool
                <Server className="h-4 w-4" />
              </Link>
            </Surface>

            <div>
              <h2 className="mb-4 text-lg font-semibold tracking-tight text-foreground">
                Related tools
              </h2>
              <div className="space-y-3">
                {relatedTools.map((tool) => (
                  <ToolCard key={tool.href} {...tool} />
                ))}
              </div>
            </div>

            <Surface>
              <h2 className="text-lg font-semibold tracking-tight text-foreground">
                Next troubleshooting step
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                If DNS looks correct but the service still fails, continue with a status or
                latency check. DNS tells you where traffic should go. It does not prove that the
                origin is healthy after resolution.
              </p>
            </Surface>
          </aside>
        </div>
      </div>
    </article>
  )
}
