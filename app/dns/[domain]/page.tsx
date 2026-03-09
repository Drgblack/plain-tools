import type { Metadata } from "next"
import { permanentRedirect } from "next/navigation"

import { InvalidParam } from "@/components/invalid-param"
import { ProgrammaticLayout } from "@/components/ProgrammaticLayout"
import { buildCanonicalUrl, buildPageMetadata } from "@/lib/page-metadata"
import {
  DNS_RECORD_DEFINITIONS,
  DNS_SITEMAP_DOMAINS,
  fetchDnsRecordsForPage,
  formatDnsRecordValue,
  isValidDnsDomain,
  normalizeDnsDomain,
  parseSoaRecord,
  type DnsRecordResult,
  type DnsRecordType,
} from "@/lib/network-dns"
import type { ProgrammaticPageData } from "@/lib/programmatic-content"
import {
  buildWebPageSchema,
  type JsonLdObject,
} from "@/lib/structured-data"
import { getToolBySlug } from "@/lib/tools-catalogue"

import { DNSDynamicClient } from "./client"

type Props = {
  params: Promise<{ domain: string }>
}

export const revalidate = 1800
export const dynamicParams = true

const dnsTool = getToolBySlug("dns-lookup")

if (!dnsTool) {
  throw new Error("DNS lookup tool definition is missing from the catalogue.")
}

function countWords(values: string[]) {
  return values
    .join(" ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length
}

function buildDnsTitle(domain: string) {
  return `DNS Lookup for ${domain} – A, MX, NS, TXT Records | Plain Tools`
}

function buildDnsDescription(domain: string) {
  return `Check DNS records for ${domain} including A, AAAA, MX, NS, TXT, SOA, and CNAME answers. Review TTL values, nameservers for ${domain}, mail-routing clues, and privacy-first DNS diagnostics.`
}

function buildDnsFaq(domain: string) {
  return [
    {
      question: `What DNS records should I check first for ${domain}?`,
      answer:
        "Start with A and AAAA if the website is not loading, MX if mail is bouncing, NS if you suspect a delegation problem, and TXT when verification, SPF, DKIM, or DMARC checks are failing.",
    },
    {
      question: `Why do DNS results for ${domain} sometimes change between checks?`,
      answer:
        "Resolvers can answer differently because of caching, load balancing, geographic routing, or because one resolver has not refreshed the record yet. TTL values help explain how long stale answers can persist.",
    },
    {
      question: "What does TTL mean in a DNS lookup?",
      answer:
        "TTL is the cache lifetime in seconds. A higher TTL means resolvers can keep an answer longer, which is good for stability but slower for rollbacks and record changes.",
    },
    {
      question: `Can ${domain} have valid DNS and still be down?`,
      answer:
        "Yes. DNS only proves where traffic should go. The origin, CDN, TLS configuration, firewall, or application can still fail after resolution, which is why DNS checks should be paired with status and latency tools.",
    },
    {
      question: `Why do nameservers for ${domain} matter?`,
      answer:
        "The NS records show which provider is authoritative for the zone. If the wrong nameservers are delegated at the registry, every other record can appear inconsistent depending on which resolver you query.",
    },
    {
      question: "Does Plain Tools store the lookup target?",
      answer:
        "Plain Tools does not ask for uploads or account data here. The page runs the minimum public DNS query needed to return the records and present them with TTL and record-type explanations.",
    },
  ]
}

function buildDnsPageData(domain: string): ProgrammaticPageData {
  const canonicalPath = `/dns/${encodeURIComponent(domain)}`
  const intro = [
    `${domain} DNS lookups usually happen when something already feels wrong. A website may be loading for one person and failing for another, mail may be bouncing without a clear reason, or a recent DNS change may not be visible yet on every network. This route is designed to answer that specific debugging intent instead of acting like a thin doorway. You get the live records for ${domain}, the TTL values that explain cache behaviour, and enough context to decide whether the issue is delegation, propagation, mail routing, or something above DNS entirely.`,
    `The page is also built to be operationally safe. There is no file upload, no account step, and no need to bounce through multiple tabs to understand what the record set means. The lookup runs securely against public resolver infrastructure, Plain Tools only requests the data needed for the response, and the surrounding content stays focused on what engineers, operators, and non-specialists actually need when they search phrases like "dns records ${domain}" or "nameservers for ${domain}".`,
  ]
  const whyUsersNeedThis = [
    `DNS issues are deceptively expensive because they often look like application failures at first. If A or AAAA records point to the wrong origin, a site can appear down even though the server is healthy. If MX records are missing or misprioritized, email delivery fails while the website still looks normal. If TXT values are malformed, ownership verification and mail authentication break even though the rest of the zone is intact. This page narrows all of that into one route for ${domain} so users do not need to mentally reconstruct the zone from scattered command outputs.`,
    `Variant intent matters here. Someone searching for a DNS lookup page is rarely doing general education. They normally need to answer a production question, compare current answers with expected infrastructure, or explain to another teammate why a change has not propagated yet. That is why the content below spends time on TTL, delegation, and next-step diagnosis instead of just listing records in a raw table.`,
  ]
  const howItWorks = [
    `The record tables below are rendered on the server with cached DNS-over-HTTPS responses so the page remains indexable and shareable. Each record group shows the raw answer value, the TTL, the resolver that returned it, and the DNS status code where available. That gives you one stable reference page for ${domain} instead of a transient browser-only debug panel.`,
    `When you need a fresh manual check, use the live lookup widget in the sidebar. That widget lets you run a new DNS query, switch record types, and move straight into a new canonical /dns/[domain] route. The result is a workflow that supports both search intent and active troubleshooting without forcing users back to a generic tool homepage.`,
  ]
  const howToSteps = [
    {
      name: "Confirm the hostname you actually mean to inspect",
      text: `Check whether the issue sits on ${domain}, a www subdomain, a mail hostname, or a service-specific subdomain. Debugging the wrong host is a common source of wasted time, especially after provider migrations.`,
    },
    {
      name: "Read the A and AAAA answers first for web reachability",
      text: "These records tell you which IPv4 and IPv6 targets browsers should contact. If the origin or CDN looks wrong, fix that first before spending time deeper in the stack.",
    },
    {
      name: "Check MX, TXT, and NS when the problem is email or verification",
      text: "Mail delivery and domain verification usually fail because of missing or malformed MX and TXT entries, while NS issues can point to a delegation problem at the zone level.",
    },
    {
      name: "Use TTL values to judge propagation risk",
      text: "A low TTL suggests resolvers should refresh soon. A high TTL means old answers can remain visible longer, which explains why two networks can disagree after a change.",
    },
    {
      name: "Continue into IP, ping, or status checks if DNS looks correct",
      text: "Once the records match the expected infrastructure, the next question is whether the target IP is owned by the right provider, whether the host responds, and whether the site is actually healthy.",
    },
  ]
  const explanationBlocks = [
    {
      title: "Why record type coverage matters",
      paragraphs: [
        `A DNS lookup page becomes much more useful when it includes A, AAAA, MX, NS, TXT, SOA, and CNAME together. Web, mail, verification, and zone-authority issues often overlap, so isolating only one record type can hide the real cause of the incident.`,
        `That is especially true for ${domain} when teams are migrating providers, rotating infrastructure, or investigating partial failures that only affect one region, resolver, or delivery path.`,
      ],
    },
    {
      title: "How TTL changes the interpretation",
      paragraphs: [
        "A DNS answer is not just a value. The TTL tells you how long a resolver may continue serving that answer from cache before it asks again. During a migration or rollback, that one number often explains why one observer sees the new state while another still sees the old state.",
        "Engineers often skip this and jump straight to blaming the upstream service. A page that exposes TTL next to the answer shortens that loop and makes the route useful for real troubleshooting, not just curiosity clicks.",
      ],
    },
    {
      title: "Why this route links into adjacent diagnostics",
      paragraphs: [
        "DNS is only the first layer. Once resolution looks healthy, users usually need to inspect IP ownership, run a ping or reachability check, or verify whether the service itself is degraded. Strong internal links keep that path inside the same intent cluster instead of sending users back to search.",
        "That internal-link structure is important for indexing and useful for people. It helps search engines understand the network-tool silo and helps users continue the diagnosis from the same context.",
      ],
    },
  ]
  const privacyNote = [
    `This route does not ask you to upload files, paste secrets, or create an account. The page only requests the public DNS data needed to answer the lookup. In practical terms that means the query target is the domain you asked for, and the result is returned with no extra workflow baggage.`,
    `Plain Tools stays explicit about the trade-off: DNS data lives on the public internet, so the page has to query a public resolver to retrieve it. The privacy-first part is that the request stays narrow, the route does not collect extra document data, and the page immediately gives you the next diagnostic step without pushing you through ad-heavy intermediaries.`,
  ]
  const relatedTools = [
    {
      href: "/dns-lookup",
      name: "DNS Lookup Tool",
      description: "Run a fresh DNS query for another hostname or record type.",
    },
    {
      href: "/what-is-my-ip",
      name: "What Is My IP",
      description: "Compare your own network edge with the DNS answers you are investigating.",
    },
    {
      href: "/ping-test",
      name: "Ping Test",
      description: "Measure latency after resolution to separate DNS issues from transport issues.",
    },
    {
      href: "/site-status",
      name: "Site Status Checker",
      description: "Confirm whether the service is up after the domain resolves.",
    },
    {
      href: `/status/${encodeURIComponent(domain)}`,
      name: `Status for ${domain}`,
      description: "Open the matching status page to compare resolution with service health.",
    },
    {
      href: "/dns/google.com",
      name: "DNS lookup for google.com",
      description: "Use a well-known reference domain to compare expected record patterns.",
    },
  ]
  const faq = buildDnsFaq(domain)
  const wordCount = countWords([
    buildDnsTitle(domain),
    buildDnsDescription(domain),
    ...intro,
    ...whyUsersNeedThis,
    ...howItWorks,
    ...howToSteps.flatMap((step) => [step.name, step.text]),
    ...explanationBlocks.flatMap((block) => [block.title, ...block.paragraphs]),
    ...privacyNote,
    ...faq.flatMap((item) => [item.question, item.answer]),
  ])

  return {
    canonicalPath,
    description: buildDnsDescription(domain),
    explanationBlocks,
    faq,
    howItWorks,
    howToSteps,
    intro,
    paramLabel: domain,
    paramSlug: domain,
    privacyNote,
    relatedTools,
    title: buildDnsTitle(domain),
    tool: dnsTool,
    whyUsersNeedThis,
    wordCount,
  }
}

function DnsResultsSection({
  domain,
  records,
}: {
  domain: string
  records: DnsRecordResult[]
}) {
  const totalAnswers = records.reduce((sum, record) => sum + record.answers.length, 0)

  return (
    <section className="space-y-6 notranslate" translate="no">
      <section className="rounded-2xl border border-border/80 bg-card/60 p-5 shadow-[0_12px_40px_-28px_rgba(0,112,243,0.35)] md:p-6">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Live DNS records for {domain}
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
          This section shows live answers for A, AAAA, MX, NS, TXT, SOA, and CNAME. Use the answer
          values together with TTL to decide whether the zone is correct, stale, or only partly
          propagated.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl border border-border/70 bg-background/60 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent/90">
              Record groups
            </p>
            <p className="mt-2 text-2xl font-semibold text-foreground">{records.length}</p>
          </div>
          <div className="rounded-xl border border-border/70 bg-background/60 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent/90">
              Answers returned
            </p>
            <p className="mt-2 text-2xl font-semibold text-foreground">{totalAnswers}</p>
          </div>
          <div className="rounded-xl border border-border/70 bg-background/60 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent/90">
              Coverage
            </p>
            <p className="mt-2 text-sm text-foreground">
              A, AAAA, MX, NS, TXT, SOA, CNAME
            </p>
          </div>
          <div className="rounded-xl border border-border/70 bg-background/60 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent/90">
              Lookup model
            </p>
            <p className="mt-2 text-sm text-foreground">Secure public resolver query</p>
          </div>
        </div>
      </section>

      {records.map((record) => (
        <RecordTable
          key={record.type}
          answers={record.answers}
          domain={domain}
          error={record.error}
          resolver={record.resolver}
          status={record.status}
          type={record.type}
        />
      ))}
    </section>
  )
}

function RecordTable({
  domain,
  type,
  answers,
  resolver,
  status,
  error,
}: {
  answers: DnsRecordResult["answers"]
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
          <h3 className="text-xl font-semibold tracking-tight text-foreground">
            {definition.label}
          </h3>
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
                            <dt className="font-medium text-foreground">Admin mailbox</dt>
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

function DnsCommonIssuesSection({ domain }: { domain: string }) {
  return (
    <section className="rounded-2xl border border-border/80 bg-card/60 p-5 shadow-[0_12px_40px_-28px_rgba(0,112,243,0.35)] md:p-6">
      <h2 className="text-2xl font-semibold tracking-tight text-foreground">
        Common DNS issues to watch for on {domain}
      </h2>
      <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground md:text-base">
        <p>
          The most common production mistake is a mismatch between the expected provider and the
          actual record target. A records might still point at an old server after a migration, or
          NS records might show that the domain is delegated to a different provider than the team
          assumes. That usually creates confusing partial failures where one network works while
          another still sees stale answers.
        </p>
        <p>
          Email problems often come from MX and TXT, not the website records. If mail routing,
          SPF, DKIM, or DMARC entries are missing or malformed, the website can remain fully
          healthy while customer emails fail. This is why the route shows all major record types
          together rather than only the web-facing ones.
        </p>
        <p>
          Finally, remember that correct DNS does not prove end-to-end availability. Once the
          records for {domain} look right, move to IP ownership, ping, and status checks to confirm
          that the resolved target actually responds and belongs to the provider you expect.
        </p>
      </div>
    </section>
  )
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
        "The requested domain is not valid for DNS lookup. Enter a hostname such as example.com to inspect A, AAAA, MX, NS, TXT, SOA, and CNAME records.",
      path: `/dns/${encodeURIComponent(domain)}`,
      image: "/og/default.png",
      googleNotranslate: true,
    })

    return {
      ...invalid,
      robots: {
        follow: false,
        index: false,
      },
    }
  }

  return buildPageMetadata({
    title: buildDnsTitle(normalizedDomain),
    description: buildDnsDescription(normalizedDomain),
    path: `/dns/${encodeURIComponent(normalizedDomain)}`,
    image: "/og/default.png",
    googleNotranslate: true,
  })
}

function buildDnsSchema(domain: string): JsonLdObject {
  return buildWebPageSchema({
    description: buildDnsDescription(domain),
    name: `DNS Lookup for ${domain}`,
    url: buildCanonicalUrl(`/dns/${encodeURIComponent(domain)}`),
  })
}

export default async function DNSDomainPage({ params }: Props) {
  const { domain } = await params
  const normalizedDomain = normalizeDnsDomain(domain)

  if (!normalizedDomain || !isValidDnsDomain(normalizedDomain)) {
    return (
      <InvalidParam
        paramType="domain"
        toolHref="/dns-lookup"
        toolName="DNS Lookup"
        value={domain}
      />
    )
  }

  if (domain !== normalizedDomain) {
    permanentRedirect(`/dns/${encodeURIComponent(normalizedDomain)}`)
  }

  const records = await fetchDnsRecordsForPage(normalizedDomain, revalidate)
  const page = buildDnsPageData(normalizedDomain)

  return (
    <ProgrammaticLayout
      beforeStructuredContent={
        <DnsResultsSection domain={normalizedDomain} records={records} />
      }
      breadcrumbs={[
        { href: "/", label: "Home" },
        { href: "/network-tools", label: "Network Tools" },
        { href: "/dns-lookup", label: "DNS Lookup" },
        { label: normalizedDomain },
      ]}
      featureList={[
        "Check A, AAAA, MX, NS, TXT, SOA, and CNAME answers",
        "Review TTL values and nameserver delegation for the domain",
        "Continue into IP lookup, ping, and status diagnostics",
      ]}
      heroBadges={["secure lookup", "ttl aware", "privacy-first", "no uploads"]}
      liveTool={<DNSDynamicClient domain={normalizedDomain} />}
      liveToolDescription="Run a fresh browser-side DNS query, switch record types, and open the canonical detail page for the next hostname without uploading anything."
      liveToolTitle="Run another DNS lookup"
      page={page}
      relatedSectionTitle={`You might also need after checking ${normalizedDomain}`}
      schema={buildDnsSchema(normalizedDomain)}
      showVerifyLocalProcessing={false}
      siloLinks={[
        { href: "/dns-lookup", label: "DNS lookup tool" },
        { href: "/what-is-my-ip", label: "What is my IP" },
        { href: "/ping-test", label: "Ping test" },
        { href: `/status/${encodeURIComponent(normalizedDomain)}`, label: `Status for ${normalizedDomain}` },
      ]}
      titleOverride={`DNS Lookup for ${normalizedDomain}`}
      afterStructuredContent={<DnsCommonIssuesSection domain={normalizedDomain} />}
    />
  )
}
