export type DnsRecordType = "A" | "AAAA" | "MX" | "TXT" | "NS" | "SOA" | "CNAME"

export type DnsAnswer = {
  name: string
  type: number
  ttl: number
  data: string
}

export type DnsLookupSuccess = {
  resolver: "cloudflare" | "google"
  status: number
  answers: DnsAnswer[]
}

export type DnsRecordResult = {
  answers: DnsAnswer[]
  error: string | null
  resolver: "cloudflare" | "google" | null
  status: number | null
  type: DnsRecordType
}

export type DnsRecordDefinition = {
  description: string
  emptyState: string
  explanation: string
  label: string
  type: DnsRecordType
}

const DOMAIN_REGEX =
  /^(?=.{1,253}$)(?!-)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/i

export const DNS_RECORD_TYPES: readonly DnsRecordType[] = [
  "A",
  "AAAA",
  "MX",
  "NS",
  "TXT",
  "SOA",
  "CNAME",
]

export const DNS_SITEMAP_DOMAINS = [
  "plain.tools",
  "google.com",
  "cloudflare.com",
  "github.com",
  "openai.com",
  "youtube.com",
  "amazon.com",
  "reddit.com",
  "netflix.com",
  "microsoft.com",
  "apple.com",
  "stripe.com",
] as const

export const DNS_RECORD_DEFINITIONS: Record<DnsRecordType, DnsRecordDefinition> = {
  A: {
    description: "Maps the hostname to one or more IPv4 addresses.",
    emptyState: "No A records were returned. That can be normal for IPv6-only or alias-only setups.",
    explanation:
      "A records are the most common DNS answers for websites. They tell browsers which IPv4 address to connect to when the hostname is requested.",
    label: "A Record",
    type: "A",
  },
  AAAA: {
    description: "Maps the hostname to one or more IPv6 addresses.",
    emptyState: "No AAAA records were returned. Many domains still serve only IPv4.",
    explanation:
      "AAAA records perform the same job as A records but for IPv6. They matter when a service supports modern dual-stack networking.",
    label: "AAAA Record",
    type: "AAAA",
  },
  MX: {
    description: "Specifies which mail servers accept email for the domain.",
    emptyState:
      "No MX records were returned. That can mean the domain does not receive mail directly or uses other delivery patterns.",
    explanation:
      "MX records control inbound email routing. They typically point to mail gateways and are often one of the first things to inspect when mail delivery fails.",
    label: "MX Record",
    type: "MX",
  },
  NS: {
    description: "Lists the authoritative nameservers for the DNS zone.",
    emptyState: "No NS records were returned in this answer set.",
    explanation:
      "NS records show which nameservers are authoritative for the domain. They matter during delegation changes, propagation checks, and provider migrations.",
    label: "NS Record",
    type: "NS",
  },
  TXT: {
    description: "Publishes arbitrary text data such as SPF, DKIM, and verification tokens.",
    emptyState:
      "No TXT records were returned. That can be fine if the domain does not publish verification or mail-authentication text entries here.",
    explanation:
      "TXT records are used heavily for email authentication, domain ownership verification, and security policies. They can grow long and sometimes appear as multiple quoted segments.",
    label: "TXT Record",
    type: "TXT",
  },
  SOA: {
    description: "Defines the primary zone authority and refresh timing values.",
    emptyState: "No SOA record was returned in this answer set.",
    explanation:
      "The SOA record is the start-of-authority entry for the zone. It contains the primary nameserver, responsible mailbox, serial number, and refresh timing values used by secondary DNS servers.",
    label: "SOA Record",
    type: "SOA",
  },
  CNAME: {
    description: "Aliases the hostname to another canonical hostname.",
    emptyState:
      "No CNAME records were returned. Many apex domains cannot use CNAME because of DNS-zone rules.",
    explanation:
      "CNAME records point one hostname to another hostname. They are common for subdomains and CDN or SaaS integrations that want to control the final target.",
    label: "CNAME Record",
    type: "CNAME",
  },
}

function decodeSafe(value: string) {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

export function normalizeDnsDomain(input: string) {
  let domain = decodeSafe(input).trim().toLowerCase()
  if (!domain) return ""

  domain = domain
    .replace(/^[a-z]+:\/\//, "")
    .replace(/^www\./, "")
    .split(/[/?#]/)[0]
    .replace(/:\d+$/, "")
    .replace(/\.+$/, "")
    .trim()

  if (!domain) return ""
  if (!domain.includes(".")) {
    domain = `${domain}.com`
  }

  return domain
}

export function isValidDnsDomain(domain: string) {
  return DOMAIN_REGEX.test(domain)
}

function sanitizeDnsAnswers(rawAnswers: unknown): DnsAnswer[] {
  if (!Array.isArray(rawAnswers)) return []
  return rawAnswers
    .map((entry) => {
      if (!entry || typeof entry !== "object") return null
      const record = entry as Record<string, unknown>
      const name = typeof record.name === "string" ? record.name : ""
      const type = typeof record.type === "number" ? record.type : 0
      const ttl =
        typeof record.TTL === "number" ? record.TTL : typeof record.ttl === "number" ? record.ttl : 0
      const data = typeof record.data === "string" ? record.data : ""
      if (!name || !type || !data) return null
      return { name, type, ttl, data }
    })
    .filter((answer): answer is DnsAnswer => Boolean(answer))
}

type FetchMode = "cache" | "live"

async function queryResolver(
  resolver: "cloudflare" | "google",
  name: string,
  type: DnsRecordType,
  signal: AbortSignal,
  mode: FetchMode,
  revalidateSeconds = 1800
) {
  const url =
    resolver === "cloudflare"
      ? `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(name)}&type=${encodeURIComponent(type)}`
      : `https://dns.google/resolve?name=${encodeURIComponent(name)}&type=${encodeURIComponent(type)}`

  const response = await fetch(url, {
    cache: mode === "live" ? "no-store" : "force-cache",
    headers:
      resolver === "cloudflare"
        ? {
            accept: "application/dns-json",
          }
        : undefined,
    method: "GET",
    next: mode === "cache" ? { revalidate: revalidateSeconds } : undefined,
    signal,
  })

  if (!response.ok) {
    throw new Error(`${resolver} DNS query failed with ${response.status}`)
  }

  const json = (await response.json()) as Record<string, unknown>
  return {
    resolver,
    status: typeof json.Status === "number" ? json.Status : -1,
    answers: sanitizeDnsAnswers(json.Answer),
  }
}

async function performDnsQuery(
  domain: string,
  type: DnsRecordType,
  timeoutMs: number,
  mode: FetchMode,
  revalidateSeconds = 1800
): Promise<DnsLookupSuccess> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)

  try {
    try {
      return await queryResolver("google", domain, type, controller.signal, mode, revalidateSeconds)
    } catch {
      return await queryResolver(
        "cloudflare",
        domain,
        type,
        controller.signal,
        mode,
        revalidateSeconds
      )
    }
  } finally {
    clearTimeout(timeout)
  }
}

export async function fetchDnsRecords(
  domain: string,
  type: DnsRecordType,
  timeoutMs = 8000
): Promise<DnsLookupSuccess> {
  return performDnsQuery(domain, type, timeoutMs, "live")
}

export async function fetchDnsRecordsForPage(
  domain: string,
  revalidateSeconds = 1800
): Promise<DnsRecordResult[]> {
  // Rate limiting hint:
  // If this route becomes a high-volume target, move DNS queries behind a cached edge/API layer
  // and apply IP-based rate limiting per domain+record type before hitting the upstream resolver.
  return Promise.all(
    DNS_RECORD_TYPES.map(async (type) => {
      try {
        const result = await performDnsQuery(domain, type, 8000, "cache", revalidateSeconds)
        return {
          answers: result.answers,
          error: null,
          resolver: result.resolver,
          status: result.status,
          type,
        }
      } catch (error) {
        return {
          answers: [],
          error: error instanceof Error ? error.message : "DNS lookup failed.",
          resolver: null,
          status: null,
          type,
        }
      }
    })
  )
}

export function formatDnsRecordValue(type: DnsRecordType, answer: DnsAnswer) {
  if (type === "MX") {
    const [priority, ...target] = answer.data.split(" ")
    if (priority && target.length > 0) {
      return `Priority ${priority} -> ${target.join(" ")}`
    }
  }

  return answer.data
}

export function parseSoaRecord(value: string) {
  const [primaryNs, adminEmail, serial, refresh, retry, expire, minimum] = value.split(/\s+/)
  if (!primaryNs || !adminEmail) return null

  return {
    adminEmail,
    expire: expire ?? "",
    minimum: minimum ?? "",
    primaryNs,
    refresh: refresh ?? "",
    retry: retry ?? "",
    serial: serial ?? "",
  }
}
