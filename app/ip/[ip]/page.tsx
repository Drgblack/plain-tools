import type { Metadata } from "next"
import { notFound, permanentRedirect } from "next/navigation"

import { InvalidParam } from "@/components/invalid-param"
import { ProgrammaticLayout } from "@/components/ProgrammaticLayout"
import { buildCanonicalUrl, buildPageMetadata } from "@/lib/page-metadata"
import type { ProgrammaticPageData } from "@/lib/programmatic-content"
import {
  describeIpScope,
  fetchIpInfo,
  IP_SITEMAP_ADDRESSES,
  type IpLookupResult,
  validateIpAddress,
} from "@/lib/network-ip"
import {
  buildWebPageSchema,
  type JsonLdObject,
} from "@/lib/structured-data"
import { getToolBySlug } from "@/lib/tools-catalogue"

import { IPDynamicLookupClient } from "./client"

type Props = {
  params: Promise<{ ip: string }>
}

export const revalidate = 3600
export const dynamicParams = true

const ipTool = getToolBySlug("what-is-my-ip")

if (!ipTool) {
  throw new Error("What Is My IP tool definition is missing from the catalogue.")
}

function countWords(values: string[]) {
  return values
    .join(" ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length
}

function buildIpTitle(ip: string) {
  return `IP Address ${ip} Lookup – Location, ISP, ASN | Plain Tools`
}

function buildIpDescription(ip: string) {
  return `Lookup IP address ${ip} for ISP, ASN, organization, hosting or residential type, and approximate location. Useful for public-IP ownership checks, routing review, and DNS correlation.`
}

function buildIpFaq(ip: string, lookup: IpLookupResult) {
  const scopeAnswer =
    lookup.kind === "public"
      ? "This is a public internet address, so provider, ASN, and approximate geolocation data are meaningful."
      : describeIpScope(lookup.kind)

  return [
    {
      question: `Who owns IP address ${ip}?`,
      answer:
        lookup.kind === "public"
          ? `Ownership usually maps to the ASN and organization that announce ${ip} on the public internet. That often means an ISP, cloud provider, CDN, or large network operator rather than one individual device.`
          : `${ip} is not a normal public internet address. ${scopeAnswer}`,
    },
    {
      question: "How accurate is IP geolocation?",
      answer:
        "IP geolocation is approximate. It commonly reflects provider routing geography, registry data, or the point where the network exits to the public internet rather than the exact physical position of one user.",
    },
    {
      question: "What does ASN mean in an IP lookup?",
      answer:
        "ASN stands for Autonomous System Number. It identifies the network that announces the IP range on the public internet and is one of the fastest ways to understand who controls a route.",
    },
    {
      question: `Why might ${ip} show as private, reserved, or documentation-only?`,
      answer:
        "Some ranges are intentionally non-public. They are used for LANs, loopback, link-local networking, carrier-grade NAT, or documentation examples, so public ownership and location data are not relevant for them.",
    },
    {
      question: "Can one IP identify a specific person?",
      answer:
        "No. A public IP usually identifies a network allocation, gateway, or service edge. Residential attribution normally requires ISP subscriber logs and legal process, not a public lookup page.",
    },
    {
      question: "Does Plain Tools log the IP I query here?",
      answer:
        "Plain Tools does not require an account, file upload, or document handoff to run this lookup. The request is limited to the single IP address you ask about so the page can return ISP, ASN, and location context.",
    },
  ]
}

function buildIpPageData(ip: string, lookup: IpLookupResult): ProgrammaticPageData {
  const canonicalPath = `/ip/${encodeURIComponent(ip)}`
  const publicContext =
    lookup.kind === "public"
      ? `${lookup.info.org} (${lookup.info.asn}) appears to control this address block, and the route is classified as ${lookup.info.networkType}.`
      : `${ip} falls into a ${lookup.kind} range, so public ASN and location data are not meaningful in the normal way.`
  const intro = [
    `IP lookups are usually a routing or ownership question, not a curiosity click. People search for pages like this when they need to confirm whether an address belongs to the expected provider, whether a suspicious host sits on residential or hosting infrastructure, or whether a DNS answer points to the network they think it does. For ${ip}, the first useful answer is whether the address is public at all. After that, the next most useful answers are the provider, ASN, organization, and approximate geography behind it.`,
    `This route keeps that workflow compact. The result table gives you ownership and routing context for ${ip}, the surrounding sections explain what the data does and does not prove, and the page links directly into DNS lookup, ping testing, and status checks. There are no uploads here, no account requirement, and no need to hand a file to a third party just to understand one public network address.`,
  ]
  const whyUsersNeedThis = [
    `An IP address on its own is ambiguous unless you connect it to provider and routing data. A web server may sit behind a CDN. A suspicious login may come from a mobile gateway rather than a fixed office. A DNS answer may look plausible until you discover the IP belongs to an unexpected ASN. ${publicContext} That single detail often changes how you interpret an outage, migration, abuse report, or allow-list entry.`,
    `It is also easy to overclaim from IP data. Public lookup tools are useful because they quickly answer "what network is this?" but they should not pretend to provide precise physical attribution. This page is written to keep that distinction clear so it remains useful for search intent without drifting into vague security theatre.`,
  ]
  const howItWorks = [
    `The page validates the requested IPv4 or IPv6 value, classifies obvious private and reserved ranges locally, and then fetches public ownership metadata only when the address is routable on the public internet. That keeps the logic straightforward: non-public ranges are explained directly, while public ranges are enriched with ISP, ASN, organization, and approximate location data.`,
    `If the upstream provider rate-limits or fails, the lookup helper falls back to a second public IP intelligence source before the route gives up. That makes the page safer as a crawl target and more reliable as an operational diagnostic surface.`,
  ]
  const howToSteps = [
    {
      name: "Validate whether the address is IPv4, IPv6, or non-public",
      text: "A valid format is only the first step. You also need to know whether the range is public, private, loopback, link-local, documentation, or otherwise reserved.",
    },
    {
      name: "Read the ISP, organization, and ASN together",
      text: "These three fields tell you who likely controls the route. They are much more reliable for ownership analysis than city-level geolocation alone.",
    },
    {
      name: "Use network type to separate hosting from residential context",
      text: "A hosting or CDN classification suggests server infrastructure, while a residential classification usually points to an ISP customer edge or gateway.",
    },
    {
      name: "Treat city and region as directional, not exact",
      text: "Geolocation helps with context, but it should not be treated as proof of where a person physically sits. Use it to understand routing footprints, not to make precise identity claims.",
    },
    {
      name: "Continue into DNS and status checks when the address matches a live service",
      text: "If the IP belongs to the provider you expect, the next question is whether the related domain resolves correctly and whether the service behind it is actually reachable.",
    },
  ]
  const explanationBlocks = [
    {
      title: "Why ASN is usually more valuable than city",
      paragraphs: [
        "ASN data tells you which network announces the route. That is often the fastest way to understand whether an IP belongs to a cloud platform, CDN, ISP, enterprise edge, or a shared residential provider block.",
        "City-level geolocation can still help, but it is far less definitive. For incident response and allow-list reviews, ASN and organization data normally deserve more weight.",
      ],
    },
    {
      title: "What IP lookups can and cannot prove",
      paragraphs: [
        "A public IP lookup can tell you the provider, network type, and approximate geography. It cannot tell you exactly who was sitting behind the address at a given moment, especially when NAT, mobile gateways, VPN exits, or shared infrastructure are involved.",
        "That distinction matters because people often overread IP data. A useful lookup page should reduce ambiguity, not create false certainty.",
      ],
    },
    {
      title: "Why this route links into DNS and reachability checks",
      paragraphs: [
        "IP ownership is only one layer of diagnosis. Once you know who controls the address, the next step is usually to see which domains resolve to it, whether the target responds quickly, and whether the service is actually degraded.",
        "Strong internal linking helps users stay inside the same network-tool workflow and helps search engines understand that these pages belong to one coherent diagnostic cluster.",
      ],
    },
  ]
  const privacyNote = [
    `This route does not ask for uploads, account access, or anything tied to your own documents. Plain Tools treats the lookup as an anonymous query surface: one IP in, one result out, with no extra workflow attached.`,
    `IP ownership data still comes from public internet metadata, so the page must query a public provider to retrieve it. The privacy-first part is keeping the request narrow, using the minimum data needed for the answer, and immediately linking you into the next diagnostic step without unnecessary tracking clutter.`,
  ]
  const relatedTools = [
    {
      href: "/what-is-my-ip",
      name: "What Is My IP",
      description: "Check the public IP your own browser currently exposes.",
    },
    {
      href: "/dns-lookup",
      name: "DNS Lookup",
      description: "Compare IP ownership with the hostnames that resolve to it.",
    },
    {
      href: "/ping-test",
      name: "Ping Test",
      description: "Measure latency after you confirm ownership and routing context.",
    },
    {
      href: "/site-status",
      name: "Site Status Checker",
      description: "Verify whether the service behind the route is currently reachable.",
    },
    {
      href: "/dns/plain.tools",
      name: "DNS lookup for plain.tools",
      description: "Use a DNS route as a follow-up when you need hostname context.",
    },
    {
      href: "/ip/8.8.8.8",
      name: "IP lookup for 8.8.8.8",
      description: "Compare a known public resolver IP with the address you are investigating.",
    },
  ]
  const faq = buildIpFaq(ip, lookup)
  const wordCount = countWords([
    buildIpTitle(ip),
    buildIpDescription(ip),
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
    description: buildIpDescription(ip),
    explanationBlocks,
    faq,
    howItWorks,
    howToSteps,
    intro,
    paramLabel: ip,
    paramSlug: ip,
    privacyNote,
    relatedTools,
    title: buildIpTitle(ip),
    tool: ipTool,
    whyUsersNeedThis,
    wordCount,
  }
}

function IpSummarySection({ ip, lookup }: { ip: string; lookup: IpLookupResult }) {
  if (lookup.kind !== "public") {
    return (
      <section className="rounded-2xl border border-border/80 bg-card/60 p-5 shadow-[0_12px_40px_-28px_rgba(0,112,243,0.35)] md:p-6 notranslate" translate="no">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Address classification for {ip}
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
          {describeIpScope(lookup.kind)}
        </p>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
          Because this address is not publicly routable, ISP attribution, ASN ownership, and
          location data are not meaningful in the normal way. Treat this page as a classification
          check and continue into broader network diagnostics only if you are mapping how this
          internal or reserved address appears in logs or configs.
        </p>
      </section>
    )
  }

  return (
    <section className="rounded-2xl border border-border/80 bg-card/60 p-5 shadow-[0_12px_40px_-28px_rgba(0,112,243,0.35)] md:p-6 notranslate" translate="no">
      <h2 className="text-2xl font-semibold tracking-tight text-foreground">
        Public IP details for {lookup.info.ip}
      </h2>
      <div className="mt-4 overflow-hidden rounded-xl border border-border/70">
        <table className="min-w-full divide-y divide-border/70 text-left text-sm">
          <tbody className="divide-y divide-border/60 bg-card/40">
            {[
              ["ISP", lookup.info.isp],
              ["Organization", lookup.info.org],
              ["ASN", lookup.info.asn],
              ["Network type", lookup.info.networkType],
              ["City", lookup.info.city],
              ["Region", lookup.info.region],
              ["Country", lookup.info.country],
              ["Latitude", lookup.info.latitude?.toString() ?? "Unknown"],
              ["Longitude", lookup.info.longitude?.toString() ?? "Unknown"],
              ["Source", lookup.info.source],
            ].map(([label, value]) => (
              <tr key={label}>
                <th className="w-44 px-4 py-3 font-medium text-foreground">{label}</th>
                <td className="px-4 py-3 text-muted-foreground">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
        Treat location data as approximate. ASN, ISP, and organization fields are normally the
        stronger ownership signals for operational work.
      </p>
    </section>
  )
}

function IpSecuritySection({ ip, lookup }: { ip: string; lookup: IpLookupResult }) {
  const networkType =
    lookup.kind === "public" ? lookup.info.networkType.toLowerCase() : lookup.kind.replace(/-/g, " ")

  return (
    <section className="rounded-2xl border border-border/80 bg-card/60 p-5 shadow-[0_12px_40px_-28px_rgba(0,112,243,0.35)] md:p-6">
      <h2 className="text-2xl font-semibold tracking-tight text-foreground">
        Security notes for {ip}
      </h2>
      <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground md:text-base">
        <p>
          This lookup suggests a {networkType} context for the address. That is useful for triage,
          but it is not the same as attribution. Hosting, CDN, VPN, and residential networks can
          all front many users and services at once.
        </p>
        <p>
          If the address appears in firewall logs, DNS answers, or application telemetry, use this
          page to understand the network operator first. Then correlate it with hostname, service
          status, and latency data before concluding that one machine or person caused the event.
        </p>
        <p>
          Querying this route is lightweight and anonymous from the user-flow perspective. Plain
          Tools does not require authentication or uploads, and the lookup is limited to public IP
          metadata rather than any device-local inspection.
        </p>
      </div>
    </section>
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
        "The requested IP address is not valid. Enter a valid IPv4 or IPv6 address to check ISP, location, ASN, and ownership details.",
      path: `/ip/${encodeURIComponent(ip)}`,
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
    title: buildIpTitle(validation.normalized),
    description: buildIpDescription(validation.normalized),
    path: `/ip/${encodeURIComponent(validation.normalized)}`,
    image: "/og/default.png",
    googleNotranslate: true,
  })
}

function buildIpSchema(ip: string): JsonLdObject {
  return buildWebPageSchema({
    description: buildIpDescription(ip),
    name: `IP Address ${ip} Lookup`,
    url: buildCanonicalUrl(`/ip/${encodeURIComponent(ip)}`),
  })
}

export default async function IPAddressPage({ params }: Props) {
  const { ip } = await params
  const validation = validateIpAddress(ip)

  if (!validation.isValid) {
    return (
      <InvalidParam
        paramType="ip"
        toolHref="/what-is-my-ip"
        toolName="IP Lookup"
        value={ip}
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

  const page = buildIpPageData(validation.normalized, lookup)

  return (
    <ProgrammaticLayout
      afterStructuredContent={
        <IpSecuritySection ip={validation.normalized} lookup={lookup} />
      }
      beforeStructuredContent={
        <IpSummarySection ip={validation.normalized} lookup={lookup} />
      }
      breadcrumbs={[
        { href: "/", label: "Home" },
        { href: "/network-tools", label: "Network Tools" },
        { href: "/what-is-my-ip", label: "What Is My IP" },
        { label: validation.normalized },
      ]}
      featureList={[
        "Lookup ISP, ASN, organization, and approximate location for a public IP",
        "Classify private, loopback, link-local, and reserved ranges safely",
        "Continue into DNS, ping, and service-status diagnostics",
      ]}
      heroBadges={["anonymous query", "asn + isp", "privacy-first", "no uploads"]}
      liveTool={<IPDynamicLookupClient ip={validation.normalized} />}
      liveToolDescription="Enter another public IPv4 or IPv6 address to open its canonical lookup page. The route only requests the minimum public metadata needed for the result."
      liveToolTitle="Lookup another IP"
      page={page}
      relatedSectionTitle={`Related network checks for ${validation.normalized}`}
      schema={buildIpSchema(validation.normalized)}
      showVerifyLocalProcessing={false}
      siloLinks={[
        { href: "/what-is-my-ip", label: "What is my IP" },
        { href: "/dns-lookup", label: "DNS lookup tool" },
        { href: "/ping-test", label: "Ping test" },
        { href: "/site-status", label: "Site status checker" },
      ]}
      titleOverride={`IP Address ${validation.normalized} Lookup`}
    />
  )
}
