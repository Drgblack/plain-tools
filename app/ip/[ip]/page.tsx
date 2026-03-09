import type { Metadata } from "next"
import Link from "next/link"
import { Globe, Radio, Server, Wifi } from "lucide-react"
import { notFound, permanentRedirect } from "next/navigation"

import { InvalidParam } from "@/components/invalid-param"
import { CanonicalSelf } from "@/components/seo/canonical-self"
import { JsonLd } from "@/components/seo/json-ld"
import { RelatedLinks } from "@/components/seo/related-links"
import { Surface } from "@/components/surface"
import { ToolCard } from "@/components/tool-card"
import { buildCanonicalUrl, buildPageMetadata } from "@/lib/page-metadata"
import {
  IP_SITEMAP_ADDRESSES,
  describeIpScope,
  fetchIpInfo,
  validateIpAddress,
} from "@/lib/network-ip"
import {
  buildBreadcrumbList,
  buildFaqPageSchema,
  buildWebPageSchema,
  combineJsonLd,
} from "@/lib/structured-data"

type Props = {
  params: Promise<{ ip: string }>
}

export const revalidate = 3600

const relatedTools = [
  {
    name: "Ping Test",
    description: "Measure latency for a hostname or IP after you confirm ownership and route context.",
    href: "/ping-test",
    tags: ["Edge", "Worker"] as const,
    icon: <Radio className="h-4 w-4" />,
  },
  {
    name: "DNS Lookup",
    description: "Check whether a hostname resolves to this IP and compare DNS answers with routing clues.",
    href: "/dns-lookup",
    tags: ["Edge", "Worker"] as const,
    icon: <Server className="h-4 w-4" />,
  },
  {
    name: "What Is My IP",
    description: "Check the public IP your current connection exposes and compare it with known lookup results.",
    href: "/what-is-my-ip",
    tags: ["Local", "Edge"] as const,
    icon: <Globe className="h-4 w-4" />,
  },
]

function buildFaq(ip: string) {
  return [
    {
      question: `Who owns IP address ${ip}?`,
      answer:
        "Ownership usually maps to the ASN and organization that announce the IP range on the public internet. For residential or mobile users, that is often an ISP. For hosted services, it is usually a cloud or network provider.",
    },
    {
      question: "How accurate is IP geolocation?",
      answer:
        "IP geolocation is approximate. It often reflects the provider's network footprint or registered routing region rather than the exact physical location of one device.",
    },
    {
      question: "Can one IP identify a specific person?",
      answer:
        "Not by itself. An IP usually identifies a connection, provider allocation, or network block. Subscriber attribution normally requires provider logs and legal process.",
    },
    {
      question: `Why might ${ip} show as private or reserved?`,
      answer:
        "Some ranges are intended only for local networks, loopback, documentation, or carrier-grade NAT. Those ranges do not have meaningful public ownership and location data.",
    },
  ]
}

function LatencyHint({ ip }: { ip: string }) {
  return (
    <Surface>
      <h2 className="text-lg font-semibold tracking-tight text-foreground">Latency test</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        Raw IP latency tests are best run through the dedicated Ping Test tool because browser
        environments cannot send true ICMP pings directly. Use the tool below for a follow-up
        network check against {ip}.
      </p>
      <Link
        href="/ping-test"
        className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[var(--category-accent,var(--accent))] hover:underline"
      >
        Open Ping Test
        <Radio className="h-4 w-4" />
      </Link>
    </Surface>
  )
}

export async function generateStaticParams() {
  return IP_SITEMAP_ADDRESSES.map((ip) => ({ ip: encodeURIComponent(ip) }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { ip } = await params
  const validation = validateIpAddress(ip)

  if (!validation.isValid) {
    const invalid = buildPageMetadata({
      title: "Invalid IP Address Lookup | Plain Tools",
      description:
        "The requested IP address is not valid. Enter a valid IPv4 or IPv6 address to check ISP, location, ASN, and routing ownership details.",
      path: `/ip/${encodeURIComponent(ip)}`,
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

  const base = buildPageMetadata({
    title: `IP ${validation.normalized} Lookup - Location, ISP, ASN | Plain Tools`,
    description: `Lookup IP ${validation.normalized} for ISP, ASN, organization, city, region, country, latitude, and longitude. Review ownership, routing, and privacy notes, then continue with DNS, ping, and status checks.`,
    path: `/ip/${encodeURIComponent(validation.normalized)}`,
    image: "/og/default.png",
    googleNotranslate: true,
  })

  return base
}

export default async function IPAddressPage({ params }: Props) {
  const { ip } = await params
  const validation = validateIpAddress(ip)

  if (!validation.isValid) {
    return (
      <InvalidParam
        paramType="ip"
        value={ip}
        toolHref="/what-is-my-ip"
        toolName="IP Lookup"
      />
    )
  }

  if (ip !== validation.normalized) {
    permanentRedirect(`/ip/${encodeURIComponent(validation.normalized)}`)
  }

  const lookup = await fetchIpInfo(validation.normalized, revalidate).catch(() => null)
  if (!lookup) {
    notFound()
  }

  const faq = buildFaq(validation.normalized)
  const currentPath = `/ip/${encodeURIComponent(validation.normalized)}`
  const schema = combineJsonLd([
    buildWebPageSchema({
      name: `IP ${validation.normalized} Lookup`,
      description:
        lookup.kind === "public"
          ? `Lookup for ${validation.normalized} with ISP, city, region, country, ASN, organization, and geolocation context.`
          : `Lookup for ${validation.normalized} showing that the address is ${lookup.kind} and not a public IP with routable ownership metadata.`,
      url: buildCanonicalUrl(currentPath),
    }),
    buildFaqPageSchema(faq),
    buildBreadcrumbList([
      { name: "Home", url: buildCanonicalUrl("/") },
      { name: "Network Tools", url: buildCanonicalUrl("/network-tools") },
      { name: "What Is My IP", url: buildCanonicalUrl("/what-is-my-ip") },
      {
        name: validation.normalized,
        url: buildCanonicalUrl(currentPath),
      },
    ]),
  ])

  return (
    <article className="category-network">
      <CanonicalSelf pathname={currentPath} />
      {schema ? <JsonLd id={`ip-lookup-${validation.normalized}-schema`} schema={schema} /> : null}

      <div className="border-b border-border/50">
        <div className="mx-auto max-w-6xl px-4 py-3">
          <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
            <ol className="flex flex-wrap items-center gap-2">
              <li><Link href="/" className="hover:text-foreground">Home</Link></li>
              <li>/</li>
              <li><Link href="/network-tools" className="hover:text-foreground">Network Tools</Link></li>
              <li>/</li>
              <li><Link href="/what-is-my-ip" className="hover:text-foreground">What Is My IP</Link></li>
              <li>/</li>
              <li className="font-mono text-foreground">{validation.normalized}</li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-10">
        <header className="max-w-4xl">
          <div className="inline-flex items-center rounded-full border border-accent/25 bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-accent">
            IP Ownership and Location
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            IP {validation.normalized} Lookup
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
            Use this page to inspect ISP ownership, routing context, approximate geolocation, and
            ASN details for <span className="font-mono text-foreground">{validation.normalized}</span>.
            It is useful when you need to identify the network that controls an address, compare a
            suspected server IP with DNS output, or confirm whether a public IP belongs to a cloud
            provider, ISP, or edge network.
          </p>
        </header>

        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-8">
            {lookup.kind === "public" ? (
              <Surface as="section">
                <h2 className="text-xl font-semibold tracking-tight text-foreground">
                  IP details for {lookup.info.ip}
                </h2>
                <div className="mt-4 overflow-hidden rounded-xl border border-border/70">
                  <table className="min-w-full divide-y divide-border/70 text-left text-sm">
                    <tbody className="divide-y divide-border/60 bg-card/40">
                      {[
                        ["ISP", lookup.info.isp],
                        ["Organization", lookup.info.org],
                        ["ASN", lookup.info.asn],
                        ["City", lookup.info.city],
                        ["Region", lookup.info.region],
                        ["Country", lookup.info.country],
                        ["Latitude", lookup.info.latitude?.toString() ?? "Unknown"],
                        ["Longitude", lookup.info.longitude?.toString() ?? "Unknown"],
                      ].map(([label, value]) => (
                        <tr key={label}>
                          <th className="w-40 px-4 py-3 font-medium text-foreground">{label}</th>
                          <td className="px-4 py-3 text-muted-foreground">{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Surface>
            ) : (
              <Surface as="section">
                <h2 className="text-xl font-semibold tracking-tight text-foreground">
                  Non-public IP range
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {describeIpScope(lookup.kind)}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Because this address is not publicly routable, ISP ownership, ASN attribution,
                  and geolocation lookups are not meaningful here. Use this route as a quick
                  classification check, then move to the main network tools if you need broader
                  diagnostics.
                </p>
              </Surface>
            )}

            <Surface as="section">
              <h2 className="text-xl font-semibold tracking-tight text-foreground">
                Who owns this IP
              </h2>
              <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground">
                <p>
                  Public IP ownership usually maps to the ASN that announces the route on the
                  internet. In practice that means the organization you see here is often the ISP,
                  cloud provider, CDN, or enterprise network controlling the address block rather
                  than one individual device.
                </p>
                <p>
                  This matters for incident response and attribution. If a DNS answer points to an
                  IP owned by a provider you do not expect, that mismatch can explain routing,
                  migration, or configuration issues before you even reach the application layer.
                </p>
              </div>
            </Surface>

            <Surface as="section">
              <h2 className="text-xl font-semibold tracking-tight text-foreground">
                Privacy and attribution notes
              </h2>
              <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground">
                <p>
                  IP intelligence depends on public routing and geolocation databases, so this page
                  only requests the minimum public metadata needed to explain ownership, ASN, and
                  rough location. Plain Tools does not ask for file uploads or account access to run
                  this lookup.
                </p>
                <p>
                  Local browser processing is the default principle across Plain Tools where it is
                  technically possible. IP and DNS pages are the exception because the answer lives
                  on the public internet, but the lookup still stays narrow: one IP in, one result
                  out, with clear follow-up links for DNS, ping, and status investigation.
                </p>
              </div>
            </Surface>

            <Surface as="section">
              <h2 className="text-xl font-semibold tracking-tight text-foreground">
                Security notes
              </h2>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
                <li className="rounded-xl border border-border/70 bg-background/60 p-4">
                  IP geolocation is approximate and should not be treated as precise physical
                  evidence of where one user is sitting.
                </li>
                <li className="rounded-xl border border-border/70 bg-background/60 p-4">
                  One public IP can represent a household, office, mobile gateway, VPN exit node,
                  or large shared cloud service rather than a single machine.
                </li>
                <li className="rounded-xl border border-border/70 bg-background/60 p-4">
                  Private, loopback, link-local, and documentation ranges should not be interpreted
                  as public internet endpoints even if they appear in logs or configuration files.
                </li>
              </ul>
            </Surface>

            <RelatedLinks
              currentPath={currentPath}
              heading={`Related lookups for ${validation.normalized}`}
            />

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
            <LatencyHint ip={validation.normalized} />

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
                Continue diagnosis
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                IP ownership is only one layer. Pair it with DNS lookup, site status, and latency
                checks to understand whether the real issue is resolution, routing, or application
                health.
              </p>
              <Link
                href="/what-is-my-ip"
                className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[var(--category-accent,var(--accent))] hover:underline"
              >
                Check your own public IP
                <Wifi className="h-4 w-4" />
              </Link>
            </Surface>
          </aside>
        </div>
      </div>
    </article>
  )
}
