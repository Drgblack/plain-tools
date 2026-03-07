export type DnsRecordType = "A" | "AAAA" | "MX" | "TXT" | "NS" | "CNAME"

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

const DOMAIN_REGEX = /^(?=.{1,253}$)(?!-)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/i

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
      const ttl = typeof record.TTL === "number" ? record.TTL : typeof record.ttl === "number" ? record.ttl : 0
      const data = typeof record.data === "string" ? record.data : ""
      if (!name || !type || !data) return null
      return { name, type, ttl, data }
    })
    .filter((answer): answer is DnsAnswer => Boolean(answer))
}

async function fetchCloudflare(name: string, type: DnsRecordType, signal: AbortSignal) {
  const response = await fetch(
    `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(name)}&type=${encodeURIComponent(type)}`,
    {
      method: "GET",
      signal,
      headers: {
        accept: "application/dns-json",
      },
      cache: "no-store",
    }
  )

  if (!response.ok) {
    throw new Error(`Cloudflare DNS query failed with ${response.status}`)
  }

  const json = (await response.json()) as Record<string, unknown>
  return {
    resolver: "cloudflare" as const,
    status: typeof json.Status === "number" ? json.Status : -1,
    answers: sanitizeDnsAnswers(json.Answer),
  }
}

async function fetchGoogle(name: string, type: DnsRecordType, signal: AbortSignal) {
  const response = await fetch(
    `https://dns.google/resolve?name=${encodeURIComponent(name)}&type=${encodeURIComponent(type)}`,
    {
      method: "GET",
      signal,
      cache: "no-store",
    }
  )

  if (!response.ok) {
    throw new Error(`Google DNS query failed with ${response.status}`)
  }

  const json = (await response.json()) as Record<string, unknown>
  return {
    resolver: "google" as const,
    status: typeof json.Status === "number" ? json.Status : -1,
    answers: sanitizeDnsAnswers(json.Answer),
  }
}

export async function fetchDnsRecords(
  domain: string,
  type: DnsRecordType,
  timeoutMs = 8000
): Promise<DnsLookupSuccess> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)

  try {
    try {
      return await fetchCloudflare(domain, type, controller.signal)
    } catch {
      return await fetchGoogle(domain, type, controller.signal)
    }
  } finally {
    clearTimeout(timeout)
  }
}
