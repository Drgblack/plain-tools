import { isIP } from "node:net"

import { buildMetaDescription } from "@/lib/page-metadata"
import { fetchDnsRecords, type DnsAnswer } from "@/lib/network-dns"
import { validateIpAddress } from "@/lib/network-ip"
import { getSampleDomains, getSampleIps } from "@/lib/network-utils"
import type {
  ProgrammaticExplanationBlock,
  ProgrammaticFaq,
  ProgrammaticHowToStep,
  ProgrammaticPageData,
  ProgrammaticRelatedTool,
} from "@/lib/programmatic-content"
import { getToolBySlug, type ToolDefinition } from "@/lib/tools-catalogue"

type NetworkKind = "asn" | "mx" | "ns" | "reverse" | "whois"

type AsnSeed = {
  asn: string
  label: string
}

type WhoisKind = "domain" | "ip"

type AsnLookupResult = {
  asn: string
  country: string
  description: string
  name: string
  prefixes: string[]
  rir: string
}

type WhoisLookupResult = {
  handle: string
  kind: WhoisKind
  name: string
  objectClassName: string
  registrationUrl: string
  remarks: string[]
}

type NetworkLookupPage = {
  breadcrumbs: Array<{ href?: string; label: string }>
  canonicalPath: string
  desc: string
  featureList: string[]
  heroBadges: string[]
  h1: string
  liveToolDescription: string
  page: ProgrammaticPageData
  siloLinks: Array<{ href: string; label: string }>
  title: string
}

const mxTool = getToolBySlug("dns-lookup")
const nsTool = getToolBySlug("dns-lookup")
const reverseTool = getToolBySlug("what-is-my-ip")
const whoisTool = getToolBySlug("dns-lookup")

const fallbackTool = mxTool ?? reverseTool ?? whoisTool

if (!mxTool || !nsTool || !reverseTool || !whoisTool || !fallbackTool) {
  throw new Error("Missing network tool definitions for network-ops routes.")
}

export const NETWORK_OP_DOMAIN_TARGETS = getSampleDomains(96)
export const NETWORK_OP_IP_TARGETS = Array.from(
  new Set([...getSampleIps(22), "9.9.9.9", "208.67.222.222", "64.233.177.138", "172.217.16.110"])
).slice(0, 32)

export const NETWORK_OP_ASN_TARGETS: AsnSeed[] = [
  { asn: "AS13335", label: "Cloudflare" },
  { asn: "AS15169", label: "Google" },
  { asn: "AS16509", label: "Amazon" },
  { asn: "AS8075", label: "Microsoft" },
  { asn: "AS32934", label: "Meta" },
  { asn: "AS54113", label: "Fastly" },
  { asn: "AS20940", label: "Akamai" },
  { asn: "AS14061", label: "DigitalOcean" },
  { asn: "AS63949", label: "Linode" },
  { asn: "AS14618", label: "Amazon-AES" },
  { asn: "AS13414", label: "Twitter / X" },
  { asn: "AS394536", label: "OpenAI" },
  { asn: "AS398101", label: "OpenAI Azure" },
  { asn: "AS7018", label: "AT&T" },
  { asn: "AS7922", label: "Comcast" },
  { asn: "AS701", label: "Verizon" },
  { asn: "AS5607", label: "Sky UK" },
  { asn: "AS5089", label: "NTT" },
  { asn: "AS2914", label: "NTT Global" },
  { asn: "AS6939", label: "Hurricane Electric" },
  { asn: "AS24940", label: "Hetzner" },
  { asn: "AS51167", label: "Contabo" },
  { asn: "AS51167", label: "Contabo Duplicate Seed" },
  { asn: "AS16276", label: "OVHcloud" },
  { asn: "AS8560", label: "Schibsted / Orange mix seed" },
  { asn: "AS12876", label: "Online SAS" },
  { asn: "AS2497", label: "IIJ" },
  { asn: "AS3462", label: "HINET" },
  { asn: "AS4837", label: "China Unicom" },
  { asn: "AS4134", label: "China Telecom" },
  { asn: "AS4766", label: "Korea Telecom" },
  { asn: "AS3215", label: "Orange" },
  { asn: "AS8881", label: "1&1 Versatel" },
  { asn: "AS680", label: "DFN" },
  { asn: "AS3356", label: "Lumen" },
  { asn: "AS3549", label: "Level 3" },
  { asn: "AS6461", label: "Zayo" },
  { asn: "AS1273", label: "Vodafone" },
  { asn: "AS12389", label: "Rostelecom" },
  { asn: "AS174", label: "Cogent" },
  { asn: "AS6453", label: "Tata" },
  { asn: "AS9009", label: "M247" },
  { asn: "AS9002", label: "RETN" },
  { asn: "AS3257", label: "GTT" },
  { asn: "AS5511", label: "Orange International" },
  { asn: "AS9304", label: "Hutchison" },
  { asn: "AS200130", label: "Yandex Cloud" },
  { asn: "AS8070", label: "Microsoft Legacy" },
  { asn: "AS15133", label: "Edgecast" },
  { asn: "AS46489", label: "Twitch" },
].filter((entry, index, entries) => entries.findIndex((item) => item.asn === entry.asn) === index)

function toWhoisDomainSeed(domain: string) {
  const parts = domain.toLowerCase().split(".").filter(Boolean)
  if (parts.length <= 2) return domain.toLowerCase()
  return parts.slice(-2).join(".")
}

export const NETWORK_OP_WHOIS_DOMAIN_TARGETS = Array.from(
  new Set(NETWORK_OP_DOMAIN_TARGETS.map((domain) => toWhoisDomainSeed(domain)))
)

function countWords(values: string[]) {
  return values.join(" ").trim().split(/\s+/).filter(Boolean).length
}

function encodePathSegment(value: string) {
  return encodeURIComponent(value)
}

function ipToPtr(ip: string) {
  const validation = validateIpAddress(ip)
  if (!validation.isValid) return null

  if (validation.version === "ipv4") {
    return `${validation.normalized.split(".").reverse().join(".")}.in-addr.arpa`
  }

  const expanded = validation.normalized
    .split("::")
    .reduce<string[]>((parts, segment, index, all) => {
      if (segment) {
        parts.push(...segment.split(":"))
      }
      if (index === 0 && all.length === 2) {
        const missing = 8 - all.filter(Boolean).flatMap((part) => part.split(":")).length
        for (let fill = 0; fill < missing; fill += 1) {
          parts.push("0")
        }
      }
      return parts
    }, [])
    .map((part) => part.padStart(4, "0"))
    .join("")
    .split("")
    .reverse()
    .join(".")

  return `${expanded}.ip6.arpa`
}

export async function fetchMxLookup(domain: string) {
  return fetchDnsRecords(domain, "MX")
}

export async function fetchNsLookup(domain: string) {
  return fetchDnsRecords(domain, "NS")
}

export async function fetchReverseLookup(ip: string, revalidateSeconds = 3600) {
  const ptr = ipToPtr(ip)
  if (!ptr) {
    throw new Error("Invalid IP address for reverse lookup.")
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 10_000)

  async function query(resolver: "google" | "cloudflare") {
    const response = await fetch(
      resolver === "google"
        ? `https://dns.google/resolve?name=${encodeURIComponent(ptr)}&type=PTR`
        : `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(ptr)}&type=PTR`,
      {
        cache: "force-cache",
        headers:
          resolver === "cloudflare"
            ? {
                accept: "application/dns-json",
              }
            : undefined,
        next: { revalidate: revalidateSeconds },
        signal: controller.signal,
      }
    )

    if (!response.ok) {
      throw new Error(`Reverse DNS lookup failed with ${response.status}.`)
    }

    return (await response.json()) as {
      Answer?: Array<{ data?: string; TTL?: number; name?: string }>
      Status?: number
    }
  }

  let json: {
    Answer?: Array<{ data?: string; TTL?: number; name?: string }>
    Status?: number
  }
  try {
    try {
      json = await query("google")
    } catch {
      json = await query("cloudflare")
    }
  } finally {
    clearTimeout(timeout)
  }

  return {
    answers:
      json.Answer?.map((answer) => ({
        data: answer.data ?? "",
        name: answer.name ?? ptr,
        ttl: answer.TTL ?? 0,
      })).filter((answer) => answer.data) ?? [],
    ptr,
    status: typeof json.Status === "number" ? json.Status : -1,
  }
}

export function normalizeAsnInput(value: string) {
  const trimmed = decodeURIComponent(value).trim().toUpperCase()
  const digits = trimmed.replace(/^AS/, "")
  if (!/^\d{1,10}$/.test(digits)) return null
  return `AS${digits}`
}

export async function fetchAsnLookup(asn: string, revalidateSeconds = 86400): Promise<AsnLookupResult> {
  const normalized = normalizeAsnInput(asn)
  if (!normalized) {
    throw new Error("Invalid ASN.")
  }

  const response = await fetch(`https://api.bgpview.io/asn/${normalized.replace(/^AS/, "")}`, {
    cache: "force-cache",
    next: { revalidate: revalidateSeconds },
  })

  if (!response.ok) {
    throw new Error(`ASN lookup failed with ${response.status}.`)
  }

  const json = (await response.json()) as {
    data?: {
      asn?: number
      country_code?: string
      description_short?: string
      name?: string
      rir_name?: string
      prefixes?: Array<{ prefix?: string }>
    }
  }
  const data = json.data
  if (!data?.asn) {
    throw new Error("ASN provider returned no usable data.")
  }

  return {
    asn: `AS${data.asn}`,
    country: data.country_code ?? "Unknown",
    description: data.description_short ?? "No ASN description available.",
    name: data.name ?? normalized,
    prefixes:
      data.prefixes?.map((prefix) => prefix.prefix ?? "").filter(Boolean).slice(0, 12) ?? [],
    rir: data.rir_name ?? "Unknown",
  }
}

export function normalizeWhoisQuery(value: string) {
  const decoded = decodeURIComponent(value).trim().toLowerCase()
  if (!decoded) return null
  return decoded.replace(/\/+$/, "")
}

export async function fetchWhoisLookup(
  query: string,
  revalidateSeconds = 86400
): Promise<WhoisLookupResult> {
  const normalized = normalizeWhoisQuery(query)
  if (!normalized) {
    throw new Error("Invalid WHOIS query.")
  }

  const kind: WhoisKind = isIP(normalized) ? "ip" : "domain"
  const response = await fetch(`https://rdap.org/${kind}/${encodeURIComponent(normalized)}`, {
    cache: "force-cache",
    next: { revalidate: revalidateSeconds },
  })

  if (!response.ok) {
    throw new Error(`WHOIS lookup failed with ${response.status}.`)
  }

  const json = (await response.json()) as {
    entities?: Array<{ handle?: string; roles?: string[]; vcardArray?: [string, unknown[]] }>
    handle?: string
    ldhName?: string
    name?: string
    objectClassName?: string
    port43?: string
    remarks?: Array<{ description?: string[] }>
  }

  const remarks = json.remarks?.flatMap((remark) => remark.description ?? []).slice(0, 6) ?? []

  return {
    handle: json.handle ?? "Unknown",
    kind,
    name: json.name ?? json.ldhName ?? normalized,
    objectClassName: json.objectClassName ?? "Unknown",
    registrationUrl: json.port43 ? `WHOIS via ${json.port43}` : "RDAP",
    remarks,
  }
}

function buildNetworkPageData(input: {
  canonicalPath: string
  description: string
  faq: ProgrammaticFaq[]
  explanationBlocks: ProgrammaticExplanationBlock[]
  howItWorks: string[]
  howToSteps: ProgrammaticHowToStep[]
  intro: string[]
  paramLabel: string
  paramSlug: string
  privacyNote: string[]
  relatedTools: ProgrammaticRelatedTool[]
  title: string
  tool: ToolDefinition
  whyUsersNeedThis: string[]
}) {
  const wordCount = countWords([
    input.title,
    input.description,
    ...input.intro,
    ...input.whyUsersNeedThis,
    ...input.howItWorks,
    ...input.howToSteps.flatMap((step) => [step.name, step.text]),
    ...input.explanationBlocks.flatMap((block) => [block.title, ...block.paragraphs]),
    ...input.privacyNote,
    ...input.faq.flatMap((item) => [item.question, item.answer]),
  ])

  return {
    ...input,
    wordCount,
  } satisfies ProgrammaticPageData
}

function relatedNetworkTools(extra: ProgrammaticRelatedTool[]): ProgrammaticRelatedTool[] {
  return [
    { description: "Query mail records for another domain.", href: "/network/mx/google.com", name: "MX Lookup" },
    { description: "Inspect nameservers for a hostname.", href: "/network/ns/plain.tools", name: "NS Lookup" },
    { description: "Check reverse DNS for a public IP.", href: "/network/reverse/8.8.8.8", name: "Reverse DNS" },
    { description: "Review public ownership data for an ASN.", href: "/network/asn/AS13335", name: "ASN Lookup" },
    { description: "Lookup RDAP/WHOIS registration data.", href: "/network/whois/plain.tools", name: "WHOIS Lookup" },
    ...extra,
  ].slice(0, 6)
}

export function getNetworkOpsPaths() {
  const paths: string[] = []
  for (const domain of NETWORK_OP_DOMAIN_TARGETS) {
    paths.push(`/network/mx/${encodePathSegment(domain)}`)
    paths.push(`/network/ns/${encodePathSegment(domain)}`)
  }
  for (const domain of NETWORK_OP_WHOIS_DOMAIN_TARGETS) {
    paths.push(`/network/whois/${encodePathSegment(domain)}`)
  }
  for (const ip of NETWORK_OP_IP_TARGETS) {
    paths.push(`/network/reverse/${encodePathSegment(ip)}`)
  }
  for (const ip of NETWORK_OP_IP_TARGETS.slice(0, 16)) {
    paths.push(`/network/whois/${encodePathSegment(ip)}`)
  }
  for (const entry of NETWORK_OP_ASN_TARGETS) {
    paths.push(`/network/asn/${entry.asn}`)
  }
  return paths
}

export const NETWORK_OP_METADATA_EXAMPLES = [
  {
    description: buildMetaDescription("MX lookup for google.com with live mail exchange answers, TTL values, and privacy-first network diagnostics on Plain Tools."),
    path: "/network/mx/google.com",
    title: "MX Lookup for google.com – Mail Servers & TTL | Plain Tools",
  },
  {
    description: buildMetaDescription("NS lookup for cloudflare.com with authoritative nameservers, TTL values, and delegation guidance on Plain Tools."),
    path: "/network/ns/cloudflare.com",
    title: "NS Lookup for cloudflare.com – Nameservers & Delegation | Plain Tools",
  },
  {
    description: buildMetaDescription("Reverse DNS for 8.8.8.8 with PTR answers, ASN context, and privacy-first network troubleshooting on Plain Tools."),
    path: "/network/reverse/8.8.8.8",
    title: "Reverse DNS for 8.8.8.8 – PTR Lookup | Plain Tools",
  },
  {
    description: buildMetaDescription("ASN lookup for AS13335 with owner, prefixes, and routing context on Plain Tools."),
    path: "/network/asn/AS13335",
    title: "ASN Lookup for AS13335 – Prefixes, Owner & RIR | Plain Tools",
  },
  {
    description: buildMetaDescription("WHOIS lookup for plain.tools with RDAP registration data, remarks, and privacy-first network context on Plain Tools."),
    path: "/network/whois/plain.tools",
    title: "WHOIS Lookup for plain.tools – Registration & RDAP | Plain Tools",
  },
]

function networkFaq(subject: string, kind: NetworkKind): ProgrammaticFaq[] {
  const kindLabel =
    kind === "mx"
      ? "MX"
      : kind === "ns"
        ? "NS"
        : kind === "reverse"
          ? "reverse DNS"
          : kind === "asn"
            ? "ASN"
            : "WHOIS"

  return [
    {
      answer:
        "Start with the routing or ownership question you are actually trying to answer, then compare the result with DNS, status, and latency checks before concluding that the service itself is broken.",
      question: `Why would I check ${kindLabel} data for ${subject}?`,
    },
    {
      answer:
        "Because these pages only query the minimum public network metadata needed for the answer. There is no file upload or account workflow attached to the lookup.",
      question: "Why does Plain Tools describe this route as privacy-first?",
    },
    {
      answer:
        "No. Public lookup data is strong for infrastructure context, but weak for personal attribution. Treat it as network evidence, not a definitive identity statement.",
      question: "Can this page identify one person or device exactly?",
    },
    {
      answer:
        "Use the related links to move into DNS, IP, ping, status, or comparison routes so the troubleshooting flow stays inside one internal silo.",
      question: "What should I check next if the result looks wrong?",
    },
    {
      answer:
        "These routes use cached public resolver or RDAP data so they remain shareable and indexable, but a resolver or registry can still update between checks.",
      question: "Can network lookup results change between visits?",
    },
    {
      answer:
        "They are different layers. DNS tells you where traffic should go, while status and latency checks tell you whether the target actually responds.",
      question: "Does a healthy lookup result mean the service is up?",
    },
  ]
}

export function buildMxPage(domain: string, _answers: DnsAnswer[]): NetworkLookupPage {
  const answerCount = _answers.length
  const title = `MX Lookup for ${domain} – Mail Servers & TTL | Plain Tools`
  const desc = buildMetaDescription(
    `Check MX records for ${domain}, review mail exchange priorities and TTL values, and continue into DNS, status, and IP diagnostics on Plain Tools.`
  )
  const canonicalPath = `/network/mx/${encodePathSegment(domain)}`
  const page = buildNetworkPageData({
    canonicalPath,
    description: desc,
    explanationBlocks: [
      {
        paragraphs: [
          `MX records answer a narrow but important question: which hosts should accept mail for ${domain}, and in what order? When inbound email starts bouncing, queueing, or disappearing, this lookup is often the fastest way to confirm whether the mail-routing layer still points at the expected provider.`,
          "That matters because many email incidents are not application outages at all. They are priority mistakes, stale migrations, or missing failover hosts that only show up when the next delivery path is tested in production.",
        ],
        title: "Why MX records matter",
      },
      {
        paragraphs: [
          "Priority numbers matter as much as hostnames. Lower numbers are preferred first, so a surprising priority order can explain why one provider sees mail while another drops or delays it.",
          "TTL values matter too. If the MX record changed recently, cached answers can keep old routing visible longer than the change window suggests.",
        ],
        title: "How to interpret priority and TTL",
      },
      {
        paragraphs: [
          "A correct MX set does not prove the mail stack is healthy. Once the answers look right, move into WHOIS, IP, ping, or status checks if you still suspect reachability or provider issues.",
          "The route is designed to keep those next steps inside the same internal linking cluster instead of sending users back to search.",
        ],
        title: "What to do next",
      },
    ],
    faq: networkFaq(domain, "mx"),
    howItWorks: [
      "The page fetches the current MX answers for the requested domain and renders them server-side so the route stays indexable, shareable, and useful as a live troubleshooting reference.",
      "The lookup remains narrow and privacy-safe: one public DNS query, a canonical page, and clear internal links into the adjacent diagnostics that usually follow email-routing checks.",
    ],
    howToSteps: [
      { name: "Confirm the exact mail domain", text: "Check the domain that actually receives email, not just the brand homepage. Mail often routes on a different hostname." },
      { name: "Review MX priority order", text: "Lower values are tried first. A stale or unexpected first-priority target is a common source of delivery trouble." },
      { name: "Compare with NS and WHOIS data", text: "If MX looks wrong, confirm the authoritative nameservers and the domain registration context before blaming the mail vendor." },
      { name: "Continue into status checks", text: "Once the routing looks right, verify whether the mail provider or the wider service is experiencing an outage." },
    ],
    intro: [
      `MX lookup pages capture search intent when email is the real problem. People do not search this route because they want a DNS textbook. They search when ${domain} mail is bouncing, routing to the wrong provider, or failing after a migration, and they need an answer they can trust quickly.`,
      "Plain Tools keeps that answer compact and useful. The page renders the live MX answers, explains what the priority values mean, and links directly into nameserver, IP, and service-health checks without any file upload or account wall.",
    ],
    paramLabel: domain,
    paramSlug: domain,
    privacyNote: [
      "This route only queries public DNS data. There is no file upload, no inbox access, and no account requirement. The privacy-first value is keeping the request narrow and the workflow direct.",
      "Mail operations still involve public infrastructure, so the answer must come from a resolver. Plain Tools simply avoids adding extra tracking or unnecessary workflow clutter around that lookup.",
    ],
    relatedTools: relatedNetworkTools([
      { description: "Review the authoritative nameservers for the same domain.", href: `/network/ns/${encodePathSegment(domain)}`, name: "NS Lookup" },
    ]),
    title,
    tool: mxTool,
    whyUsersNeedThis: [
      "Mail failures are expensive because they hide inside ordinary business workflows. One stale MX host can break invoices, onboarding emails, or support replies without creating an obvious homepage outage.",
      `That is why this page is written for real operational intent around ${domain}, not just a generic resolver demo. It helps users move from “mail is broken” to a more precise routing diagnosis.`,
    ],
  })

  return {
    breadcrumbs: [{ href: "/", label: "Home" }, { href: "/network-tools", label: "Network Tools" }, { label: "MX Lookup" }, { label: domain }],
    canonicalPath,
    desc,
    featureList: [`Live MX records (${answerCount} answers in the current snapshot)`, "Priority and TTL review", "Email-routing troubleshooting context"],
    heroBadges: ["mail routing", "ttl aware", "privacy-first", "no uploads"],
    h1: `MX Lookup for ${domain}`,
    liveToolDescription: "Run another MX query and move straight into the canonical result page.",
    page,
    siloLinks: [
      { href: "/dns-lookup", label: "DNS lookup tool" },
      { href: `/network/ns/${encodePathSegment(domain)}`, label: "NS lookup for this domain" },
      { href: `/network/whois/${encodePathSegment(domain)}`, label: "WHOIS for this domain" },
      { href: `/status/${encodePathSegment(domain)}`, label: `Status for ${domain}` },
    ],
    title,
  }
}

export function buildNsPage(domain: string, _answers: DnsAnswer[]): NetworkLookupPage {
  const answerCount = _answers.length
  const title = `NS Lookup for ${domain} – Nameservers & Delegation | Plain Tools`
  const desc = buildMetaDescription(
    `Check NS records for ${domain}, review authoritative nameservers and TTL values, and continue into MX, WHOIS, and status diagnostics on Plain Tools.`
  )
  const canonicalPath = `/network/ns/${encodePathSegment(domain)}`
  const page = buildNetworkPageData({
    canonicalPath,
    description: desc,
    explanationBlocks: [
      {
        paragraphs: [
          `Nameserver lookups matter most during migrations, registrar changes, and incidents where one resolver sees a different zone than another. If the delegated nameservers for ${domain} are wrong, every other record can look inconsistent.`,
          "That is why NS checks sit high in the troubleshooting order. They tell you who is authoritative before you spend time debugging records that may not even be coming from the provider you expect.",
        ],
        title: "Why nameserver checks matter",
      },
      {
        paragraphs: [
          "Delegation mistakes are common after DNS-provider changes, registrar edits, or incomplete zone moves. One wrong nameserver can create partial propagation that feels like random outage behavior.",
          "This route makes the delegation layer visible so you can confirm authority first, then move deeper into MX, A, or TXT debugging only if it still makes sense.",
        ],
        title: "Delegation before deeper debugging",
      },
      {
        paragraphs: [
          "NS data is public, so the lookup is simple and privacy-safe. The high-value part is not the query itself but the surrounding guidance that explains why authority matters and what to check next.",
          "That next step is usually MX, WHOIS, ping, or the matching status page.",
        ],
        title: "Privacy and next steps",
      },
    ],
    faq: networkFaq(domain, "ns"),
    howItWorks: [
      "The route requests the current NS answers for the domain and renders them server-side with a canonical URL so the result page can be linked, indexed, and revisited during live troubleshooting.",
      "A good nameserver page should do more than list hostnames. It should explain why authority and propagation matter and push users into the adjacent diagnostics that make the lookup actionable.",
    ],
    howToSteps: [
      { name: "Check the delegated nameservers first", text: "If the authority layer is wrong, every lower-layer DNS conclusion becomes unreliable." },
      { name: "Compare with the expected provider", text: "Use the hostnames and WHOIS data to confirm the zone still sits with the vendor you think controls it." },
      { name: "Move into MX or TXT next", text: "Once delegation looks correct, inspect the record type that matches the production problem." },
      { name: "Verify service reachability separately", text: "A healthy NS set does not prove the site or mail service is up." },
    ],
    intro: [
      `NS lookup pages are high-intent troubleshooting routes because they answer a simple operational question fast: who is authoritative for ${domain} right now? When zones move, registrars change, or propagation feels inconsistent, that answer usually matters more than any individual A or MX record.`,
      "Plain Tools keeps the route focused on that diagnostic outcome. The page shows the live nameservers, explains why delegation matters, and links into the next checks without burying the user under another generic DNS homepage.",
    ],
    paramLabel: domain,
    paramSlug: domain,
    privacyNote: [
      "The lookup only requests public DNS data for the hostname you entered. There is no file upload, no credential handling, and no account gate attached to the route.",
      "That privacy-first posture matters because it keeps the network workflow narrow and transparent even when the user is debugging sensitive production infrastructure.",
    ],
    relatedTools: relatedNetworkTools([
      { description: "Inspect MX records for the same domain.", href: `/network/mx/${encodePathSegment(domain)}`, name: "MX Lookup" },
    ]),
    title,
    tool: nsTool,
    whyUsersNeedThis: [
      "Delegation problems waste time because they look like random DNS noise until someone checks the authority layer directly.",
      `For ${domain}, this page narrows that ambiguity and gives the user a clear next-step path into mail, registration, or service-health checks.`,
    ],
  })

  return {
    breadcrumbs: [{ href: "/", label: "Home" }, { href: "/network-tools", label: "Network Tools" }, { label: "NS Lookup" }, { label: domain }],
    canonicalPath,
    desc,
    featureList: [`Authoritative nameserver answers (${answerCount} in the current snapshot)`, "Delegation troubleshooting context", "Strong links into MX, WHOIS, and status checks"],
    heroBadges: ["delegation", "authoritative dns", "privacy-first", "no uploads"],
    h1: `NS Lookup for ${domain}`,
    liveToolDescription: "Run another nameserver query and move into the canonical result page immediately.",
    page,
    siloLinks: [
      { href: "/dns-lookup", label: "DNS lookup tool" },
      { href: `/network/mx/${encodePathSegment(domain)}`, label: "MX lookup for this domain" },
      { href: `/network/whois/${encodePathSegment(domain)}`, label: "WHOIS for this domain" },
      { href: `/status/${encodePathSegment(domain)}`, label: `Status for ${domain}` },
    ],
    title,
  }
}

export function buildReversePage(input: {
  ip: string
  ptr: string
  records: Array<{ data: string; name: string; ttl: number }>
  scopeDescription: string
}): NetworkLookupPage {
  const title = `Reverse DNS for ${input.ip} – PTR Lookup | Plain Tools`
  const desc = buildMetaDescription(
    `Check reverse DNS for ${input.ip}, inspect PTR answers, and continue into IP ownership, DNS, and status diagnostics on Plain Tools.`
  )
  const canonicalPath = `/network/reverse/${encodePathSegment(input.ip)}`
  const page = buildNetworkPageData({
    canonicalPath,
    description: desc,
    explanationBlocks: [
      {
        paragraphs: [
          "Reverse DNS answers a different question from forward DNS. Instead of asking which IP a hostname resolves to, you ask which hostname an IP claims for itself through PTR data.",
          `That matters for ${input.ip} when you are validating mail reputation, checking server naming hygiene, or correlating logs with DNS and provider ownership data.`,
        ],
        title: "Why reverse DNS matters",
      },
      {
        paragraphs: [
          `The PTR name for this lookup sits under ${input.ptr}. If that record looks missing or surprising, the next step is usually to compare it with the IP ownership data and the forward DNS records for the hostname returned.`,
          "PTR records are common in email and server administration because they provide reputation and identity hints that other systems expect to match.",
        ],
        title: "How to interpret PTR answers",
      },
      {
        paragraphs: [
          input.scopeDescription,
          "Reverse DNS is still only one layer of truth. A neat PTR hostname does not prove the service is healthy, and a missing PTR record does not always explain an outage by itself.",
        ],
        title: "Context and limitations",
      },
    ],
    faq: networkFaq(input.ip, "reverse"),
    howItWorks: [
      "The page converts the IP into its PTR query form, requests the current answer from a public resolver, and renders the response on the server so the result remains crawlable and reusable.",
      "That lets the route behave like a stable diagnostic page rather than a one-off form result, while still keeping the actual network request narrow and privacy-safe.",
    ],
    howToSteps: [
      { name: "Validate the IP first", text: "Reverse DNS only makes sense for a valid IPv4 or IPv6 address." },
      { name: "Review the PTR answer", text: "Check whether the hostname looks consistent with the provider, workload, or mail reputation you expect." },
      { name: "Compare with IP ownership", text: "Use the related IP lookup route to verify which ASN and provider control the address." },
      { name: "Move into forward DNS if needed", text: "Once you have the hostname, inspect the forward DNS records and status context separately." },
    ],
    intro: [
      `Reverse DNS lookups are a classic network-operations query because they explain what an IP address says about itself on the public internet. That can help with email troubleshooting, server inventory, abuse review, and ownership validation when the raw IP alone is not enough.`,
      "Plain Tools keeps the route practical. You get the live PTR answers, the underlying PTR name, and the next-step links into IP, DNS, and service-health checks without a file upload or account detour.",
    ],
    paramLabel: input.ip,
    paramSlug: input.ip,
    privacyNote: [
      "This route only sends the public IP value needed for the PTR query. It does not inspect your device or collect files, credentials, or local logs.",
      "The privacy-first angle is not that reverse DNS is private data. It is that the workflow stays minimal, transparent, and free of unnecessary tracking clutter.",
    ],
    relatedTools: relatedNetworkTools([
      { description: "Inspect the ownership of this IP address.", href: `/ip/${encodePathSegment(input.ip)}`, name: "IP Lookup" },
    ]),
    title,
    tool: reverseTool,
    whyUsersNeedThis: [
      "PTR lookups matter because a surprising hostname often reveals a routing, mail, or ownership clue faster than a generic IP page does.",
      "This route keeps that check attached to the broader network-diagnostics silo so the user can keep moving once the PTR answer lands.",
    ],
  })

  return {
    breadcrumbs: [{ href: "/", label: "Home" }, { href: "/network-tools", label: "Network Tools" }, { label: "Reverse DNS" }, { label: input.ip }],
    canonicalPath,
    desc,
    featureList: ["PTR record lookup", "IP-to-hostname troubleshooting", "Links into IP ownership and DNS checks"],
    heroBadges: ["ptr lookup", "ip to hostname", "privacy-first", "no uploads"],
    h1: `Reverse DNS for ${input.ip}`,
    liveToolDescription: "Run another reverse DNS query for a public IPv4 or IPv6 address.",
    page,
    siloLinks: [
      { href: "/what-is-my-ip", label: "What is my IP" },
      { href: `/ip/${encodePathSegment(input.ip)}`, label: `IP lookup for ${input.ip}` },
      { href: "/dns-lookup", label: "DNS lookup tool" },
      { href: "/site-status", label: "Site status checker" },
    ],
    title,
  }
}

export function buildAsnPage(result: AsnLookupResult): NetworkLookupPage {
  const title = `ASN Lookup for ${result.asn} – Prefixes, Owner & RIR | Plain Tools`
  const desc = buildMetaDescription(
    `Lookup ${result.asn} for owner, RIR, country, and example prefixes. Useful for network ownership, routing review, and provider verification on Plain Tools.`
  )
  const canonicalPath = `/network/asn/${result.asn}`
  const page = buildNetworkPageData({
    canonicalPath,
    description: desc,
    explanationBlocks: [
      {
        paragraphs: [
          `ASN lookups answer the ownership layer of internet routing. ${result.asn} maps to ${result.name}, which is often a faster operational clue than city-level IP geolocation or brand assumptions.`,
          "That makes ASN pages especially valuable for abuse handling, allow-list reviews, outage triage, and provider verification.",
        ],
        title: "Why ASN ownership matters",
      },
      {
        paragraphs: [
          `The RIR and country data here provide registration context, while the prefix samples show how the network is announced publicly. ${result.description}`,
          "Used together, those fields help operators understand whether a target belongs to the provider they expected before they debug a higher application layer.",
        ],
        title: "How to read the result",
      },
      {
        paragraphs: [
          "ASN data is public routing metadata. It is useful for infrastructure context, but it does not identify one physical server or one person directly.",
          "This route links into DNS, IP, and WHOIS pages so the user can keep moving once the ownership question is answered.",
        ],
        title: "Limits and follow-up checks",
      },
    ],
    faq: networkFaq(result.asn, "asn"),
    howItWorks: [
      "The page requests ASN information from a public BGP data source and caches the result for daily refreshes, which fits the slower-changing nature of routing ownership metadata.",
      "That makes the route suitable for both search and repeated operational use without turning every lookup into a noisy live API dependency.",
    ],
    howToSteps: [
      { name: "Confirm the ASN format", text: "Use the AS-prefixed number so the route resolves canonically and links cleanly inside the network silo." },
      { name: "Read the owner and RIR first", text: "Those fields usually tell you whether the network belongs to the provider you expected." },
      { name: "Check the example prefixes", text: "The announced prefixes help connect the ASN to specific IP ranges you may be seeing in logs or DNS results." },
      { name: "Continue into IP or WHOIS", text: "If you still need a narrower ownership or registration answer, move into the matching IP or WHOIS route next." },
    ],
    intro: [
      `ASN lookup pages capture high-value network intent because people search them when they already have an ownership or routing question. They want to know which organization announces a network, whether a provider match is real, and whether the IP space behind an incident or dependency belongs to the expected operator.`,
      `For ${result.asn}, Plain Tools keeps that answer focused on the fields that matter: owner, registration region, prefix examples, and the next internal links needed for deeper investigation.`,
    ],
    paramLabel: result.asn,
    paramSlug: result.asn.toLowerCase(),
    privacyNote: [
      "ASN lookups query public routing metadata only. There is no document upload, credential handling, or account requirement on this route.",
      "That privacy-first model is simple: the query stays narrow, the result is server-rendered for reuse, and the user gets the next diagnostic links immediately.",
    ],
    relatedTools: relatedNetworkTools([
      { description: "Run WHOIS or RDAP for the related domain or IP.", href: "/network/whois/plain.tools", name: "WHOIS Lookup" },
    ]),
    title,
    tool: fallbackTool,
    whyUsersNeedThis: [
      "ASN ownership is one of the fastest ways to turn a random IP or provider clue into something operationally meaningful.",
      "That makes this page especially strong for infrastructure, security, and procurement-adjacent traffic where the user wants provider certainty rather than general background reading.",
    ],
  })

  return {
    breadcrumbs: [{ href: "/", label: "Home" }, { href: "/network-tools", label: "Network Tools" }, { label: "ASN Lookup" }, { label: result.asn }],
    canonicalPath,
    desc,
    featureList: ["ASN owner and description", "RIR and country context", "Prefix examples for routing review"],
    heroBadges: ["routing ownership", "asn", "privacy-first", "no uploads"],
    h1: `ASN Lookup for ${result.asn}`,
    liveToolDescription: "Run another ASN query to inspect owner, country, and prefix context.",
    page,
    siloLinks: [
      { href: "/network/whois/plain.tools", label: "WHOIS lookup" },
      { href: "/what-is-my-ip", label: "IP lookup" },
      { href: "/dns-lookup", label: "DNS lookup" },
      { href: "/network/reverse/8.8.8.8", label: "Reverse DNS example" },
    ],
    title,
  }
}

export function buildWhoisPage(query: string, result: WhoisLookupResult): NetworkLookupPage {
  const title = `WHOIS Lookup for ${query} – Registration & RDAP | Plain Tools`
  const desc = buildMetaDescription(
    `Lookup WHOIS and RDAP data for ${query}, including registration handle, object class, and remarks. Useful for ownership and registration context on Plain Tools.`
  )
  const canonicalPath = `/network/whois/${encodePathSegment(query)}`
  const page = buildNetworkPageData({
    canonicalPath,
    description: desc,
    explanationBlocks: [
      {
        paragraphs: [
          `WHOIS and RDAP routes exist for one reason: ownership and registration context. For ${query}, that usually means confirming who controls the object, which registry/RIR class it belongs to, and whether there are operational remarks worth checking before you escalate the issue elsewhere.`,
          "That makes WHOIS pages a strong follow-up after DNS, IP, or ASN checks, because they answer the registration layer rather than the live routing layer.",
        ],
        title: "Why WHOIS still matters",
      },
      {
        paragraphs: [
          `This lookup returned ${result.objectClassName} data with handle ${result.handle}. That helps you distinguish between a domain registration question and an IP allocation question before you misread the result.`,
          "RDAP data can still be sparse, so the remarks and object class often matter more than a single ownership field.",
        ],
        title: "How to interpret RDAP output",
      },
      {
        paragraphs: [
          "Registration context is useful, but it is not the whole story. A correct WHOIS record does not prove the service is healthy, and a suspicious result should still be correlated with DNS, IP, and status data.",
          "That is why this route links back into the wider network-tool cluster instead of pretending registration data answers every incident.",
        ],
        title: "Registration vs live operations",
      },
    ],
    faq: networkFaq(query, "whois"),
    howItWorks: [
      "The page calls a public RDAP endpoint for the requested domain or IP and caches the response so the route stays stable enough for indexing and repeated reference.",
      "That turns a raw registration API response into a usable programmatic page with explanation, FAQs, and internal links to the live operational checks that usually follow.",
    ],
    howToSteps: [
      { name: "Confirm whether the query is a domain or IP", text: "WHOIS and RDAP data differ depending on whether you are inspecting a registration object or an address allocation." },
      { name: "Read handle and object class together", text: "Those fields anchor the result and reduce the risk of misreading the registration context." },
      { name: "Check remarks for registry clues", text: "Remarks often explain special handling, allocation notes, or the appropriate follow-up path." },
      { name: "Continue into DNS, IP, or ASN", text: "Once the registration layer is clear, move into the live network layer to debug the actual service behavior." },
    ],
    intro: [
      `WHOIS lookup pages serve a different search intent from DNS or status pages. The user is usually asking who controls the object, which registry or RIR it belongs to, and whether the registration context matches what they expected.`,
      `Plain Tools keeps that route useful by focusing on the registration answer for ${query}, then linking into the live diagnostic pages that usually follow once ownership is clearer.`,
    ],
    paramLabel: query,
    paramSlug: query,
    privacyNote: [
      "The lookup only requests public RDAP data for the query you enter. There is no account requirement, no file upload, and no credential exposure on this route.",
      "That makes the page privacy-first in the practical sense: minimal data in, registration answer out, and direct links to the next relevant checks.",
    ],
    relatedTools: relatedNetworkTools([
      { description: "Check the nameservers for the same domain.", href: `/network/ns/${encodePathSegment(query)}`, name: "NS Lookup" },
    ]),
    title,
    tool: whoisTool,
    whyUsersNeedThis: [
      "WHOIS and RDAP pages answer the registration question that often sits behind routing, ownership, or vendor-validation work.",
      "This route keeps that search intent tied to the broader network-ops silo so users can move directly into live diagnostics afterwards.",
    ],
  })

  return {
    breadcrumbs: [{ href: "/", label: "Home" }, { href: "/network-tools", label: "Network Tools" }, { label: "WHOIS Lookup" }, { label: query }],
    canonicalPath,
    desc,
    featureList: ["Public RDAP lookup", "Registration handle and object class", "Strong links into live network diagnostics"],
    heroBadges: ["rdap", "ownership", "privacy-first", "no uploads"],
    h1: `WHOIS Lookup for ${query}`,
    liveToolDescription: "Run another WHOIS or RDAP query for a domain or public IP.",
    page,
    siloLinks: [
      { href: "/dns-lookup", label: "DNS lookup tool" },
      { href: "/what-is-my-ip", label: "IP lookup" },
      { href: "/network/asn/AS13335", label: "ASN lookup example" },
      { href: "/site-status", label: "Site status checker" },
    ],
    title,
  }
}

export function generateNetworkMxParams(limit = NETWORK_OP_DOMAIN_TARGETS.length) {
  return NETWORK_OP_DOMAIN_TARGETS.slice(0, limit).map((domain) => ({ domain }))
}

export function generateNetworkNsParams(limit = NETWORK_OP_DOMAIN_TARGETS.length) {
  return NETWORK_OP_DOMAIN_TARGETS.slice(0, limit).map((domain) => ({ domain }))
}

export function generateNetworkReverseParams(limit = NETWORK_OP_IP_TARGETS.length) {
  return NETWORK_OP_IP_TARGETS.slice(0, limit).map((ip) => ({ ip: encodeURIComponent(ip) }))
}

export function generateNetworkAsnParams(limit = NETWORK_OP_ASN_TARGETS.length) {
  return NETWORK_OP_ASN_TARGETS.slice(0, limit).map((entry) => ({ asn: entry.asn }))
}

export function generateNetworkWhoisParams(limit = NETWORK_OP_DOMAIN_TARGETS.length) {
  return [
    ...NETWORK_OP_WHOIS_DOMAIN_TARGETS.slice(0, limit).map((query) => ({ query })),
    ...NETWORK_OP_IP_TARGETS.slice(0, Math.min(16, limit)).map((query) => ({
      query: encodeURIComponent(query),
    })),
  ]
}
