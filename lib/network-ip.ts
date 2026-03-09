import { isIP } from "node:net"

import { getSampleIps } from "@/lib/network-utils"

export type IpVersion = "ipv4" | "ipv6"

export type IpScope =
  | "public"
  | "private"
  | "loopback"
  | "link-local"
  | "documentation"
  | "carrier-grade-nat"
  | "reserved"

export type IpInfo = {
  asn: string
  city: string
  country: string
  ip: string
  isp: string
  latitude: number | null
  longitude: number | null
  networkType: string
  org: string
  region: string
  source: "ipapi.is" | "ipwho.is"
}

export type IpLookupResult =
  | {
      info: IpInfo
      kind: "public"
      version: IpVersion
    }
  | {
      info: null
      kind: Exclude<IpScope, "public">
      version: IpVersion
    }

export const IP_SITEMAP_ADDRESSES = getSampleIps(22)

function normalizeIpInput(value: string) {
  return decodeURIComponent(value).trim().toLowerCase()
}

export function validateIpAddress(value: string) {
  const normalized = normalizeIpInput(value)
  const version = isIP(normalized)
  if (version === 4) return { isValid: true as const, normalized, version: "ipv4" as const }
  if (version === 6) return { isValid: true as const, normalized, version: "ipv6" as const }
  return { isValid: false as const, normalized, version: null }
}

function parseIpv4Octets(ip: string) {
  return ip.split(".").map((part) => Number.parseInt(part, 10))
}

function isIpv4InRange(ip: string, base: string, maskBits: number) {
  const octets = parseIpv4Octets(ip)
  const baseOctets = parseIpv4Octets(base)

  const ipNumber =
    ((octets[0] ?? 0) << 24) |
    ((octets[1] ?? 0) << 16) |
    ((octets[2] ?? 0) << 8) |
    (octets[3] ?? 0)
  const baseNumber =
    ((baseOctets[0] ?? 0) << 24) |
    ((baseOctets[1] ?? 0) << 16) |
    ((baseOctets[2] ?? 0) << 8) |
    (baseOctets[3] ?? 0)
  const mask = maskBits === 0 ? 0 : (~0 << (32 - maskBits)) >>> 0

  return (ipNumber >>> 0 & mask) === (baseNumber >>> 0 & mask)
}

function expandIpv6(ip: string) {
  if (!ip.includes(":")) return null
  const [head, tail] = ip.split("::")
  const headParts = head ? head.split(":").filter(Boolean) : []
  const tailParts = tail ? tail.split(":").filter(Boolean) : []
  if (ip.includes("::")) {
    const missing = 8 - (headParts.length + tailParts.length)
    if (missing < 0) return null
    return [...headParts, ...Array.from({ length: missing }, () => "0"), ...tailParts].map(
      (part) => part.padStart(4, "0")
    )
  }

  const parts = ip.split(":").filter(Boolean)
  if (parts.length !== 8) return null
  return parts.map((part) => part.padStart(4, "0"))
}

function isIpv6Prefix(ip: string, prefix: string) {
  const expanded = expandIpv6(ip)
  if (!expanded) return false
  return expanded.join(":").startsWith(prefix)
}

export function getIpScope(ip: string, version: IpVersion): IpScope {
  if (version === "ipv4") {
    if (isIpv4InRange(ip, "10.0.0.0", 8) || isIpv4InRange(ip, "172.16.0.0", 12) || isIpv4InRange(ip, "192.168.0.0", 16)) {
      return "private"
    }
    if (isIpv4InRange(ip, "127.0.0.0", 8)) return "loopback"
    if (isIpv4InRange(ip, "169.254.0.0", 16)) return "link-local"
    if (isIpv4InRange(ip, "100.64.0.0", 10)) return "carrier-grade-nat"
    if (
      isIpv4InRange(ip, "192.0.2.0", 24) ||
      isIpv4InRange(ip, "198.51.100.0", 24) ||
      isIpv4InRange(ip, "203.0.113.0", 24)
    ) {
      return "documentation"
    }
    if (isIpv4InRange(ip, "0.0.0.0", 8) || isIpv4InRange(ip, "240.0.0.0", 4)) {
      return "reserved"
    }
    return "public"
  }

  if (ip === "::1") return "loopback"
  if (isIpv6Prefix(ip, "fc") || isIpv6Prefix(ip, "fd")) return "private"
  if (isIpv6Prefix(ip, "fe8") || isIpv6Prefix(ip, "fe9") || isIpv6Prefix(ip, "fea") || isIpv6Prefix(ip, "feb")) {
    return "link-local"
  }
  if (isIpv6Prefix(ip, "2001:0db8")) return "documentation"
  if (ip === "::") return "reserved"

  return "public"
}

type IpApiIsPayload = {
  asn?: {
    asn?: number
    org?: string
  }
  company?: {
    name?: string
    type?: string
  }
  ip?: string
  location?: {
    city?: string
    country?: string
    latitude?: number
    longitude?: number
    state?: string
  }
}

type IpWhoIsPayload = {
  asn?: number
  city?: string
  connection?: {
    isp?: string
    org?: string
    type?: string
  }
  country?: string
  ip?: string
  latitude?: number
  longitude?: number
  region?: string
  success?: boolean
}

function mapIpApiIsPayload(
  payload: IpApiIsPayload,
  fallbackIp: string
): IpLookupResult & { kind: "public" } {
  const organization = payload.company?.name ?? payload.asn?.org ?? "Unknown"
  const asn = payload.asn?.asn ? `AS${payload.asn.asn}` : "Unknown"

  return {
    info: {
      asn,
      city: payload.location?.city ?? "Unknown",
      country: payload.location?.country ?? "Unknown",
      ip: payload.ip ?? fallbackIp,
      isp: organization,
      latitude:
        typeof payload.location?.latitude === "number" ? payload.location.latitude : null,
      longitude:
        typeof payload.location?.longitude === "number" ? payload.location.longitude : null,
      networkType: payload.company?.type ?? "Unknown",
      org: organization,
      region: payload.location?.state ?? "Unknown",
      source: "ipapi.is",
    },
    kind: "public",
    version: fallbackIp.includes(":") ? "ipv6" : "ipv4",
  }
}

function mapIpWhoIsPayload(
  payload: IpWhoIsPayload,
  fallbackIp: string,
  version: IpVersion
): IpLookupResult & { kind: "public" } {
  const organization = payload.connection?.org ?? payload.connection?.isp ?? "Unknown"
  const asn = payload.asn ? `AS${payload.asn}` : "Unknown"

  return {
    info: {
      asn,
      city: payload.city ?? "Unknown",
      country: payload.country ?? "Unknown",
      ip: payload.ip ?? fallbackIp,
      isp: payload.connection?.isp ?? organization,
      latitude: typeof payload.latitude === "number" ? payload.latitude : null,
      longitude: typeof payload.longitude === "number" ? payload.longitude : null,
      networkType: payload.connection?.type ?? "Unknown",
      org: organization,
      region: payload.region ?? "Unknown",
      source: "ipwho.is",
    },
    kind: "public",
    version,
  }
}

export async function fetchIpInfo(ip: string, revalidateSeconds = 3600): Promise<IpLookupResult> {
  const validation = validateIpAddress(ip)
  if (!validation.isValid) {
    throw new Error("Invalid IP address")
  }

  const scope = getIpScope(validation.normalized, validation.version)
  if (scope !== "public") {
    return {
      info: null,
      kind: scope,
      version: validation.version,
    }
  }

  // Rate limiting hint:
  // If /ip/[ip] becomes a high-volume crawl target, front this API call with a cached server-side
  // store and apply per-IP or per-path throttling before calling the upstream free-tier endpoint.
  const providers = [
    {
      name: "ipapi.is" as const,
      url: `https://api.ipapi.is/?q=${encodeURIComponent(validation.normalized)}`,
      map: async (response: Response) =>
        mapIpApiIsPayload((await response.json()) as IpApiIsPayload, validation.normalized),
    },
    {
      name: "ipwho.is" as const,
      url: `https://ipwho.is/${encodeURIComponent(validation.normalized)}`,
      map: async (response: Response) => {
        const payload = (await response.json()) as IpWhoIsPayload
        if (payload.success === false) {
          throw new Error("Fallback provider returned an unsuccessful lookup response")
        }
        return mapIpWhoIsPayload(payload, validation.normalized, validation.version)
      },
    },
  ]

  let lastError: Error | null = null

  for (const provider of providers) {
    try {
      const response = await fetch(provider.url, {
        cache: "force-cache",
        headers: {
          accept: "application/json",
        },
        next: { revalidate: revalidateSeconds },
      })

      if (!response.ok) {
        throw new Error(`${provider.name} request failed with ${response.status}`)
      }

      return await provider.map(response)
    } catch (error) {
      lastError = error instanceof Error ? error : new Error("IP lookup failed.")
    }
  }

  throw lastError ?? new Error("IP lookup failed.")
}

export function describeIpScope(scope: Exclude<IpScope, "public">) {
  switch (scope) {
    case "private":
      return "This is a private network address. It is meant for LAN use and does not have a public geolocation or ISP ownership record."
    case "loopback":
      return "This is a loopback address used by the local machine to talk to itself."
    case "link-local":
      return "This is a link-local address used on the local network segment. It is not publicly routable."
    case "carrier-grade-nat":
      return "This address falls inside a carrier-grade NAT range. It may be used internally by an ISP and is not a normal public IP."
    case "documentation":
      return "This address belongs to a documentation or example range. It should not represent a live public host."
    case "reserved":
      return "This address is reserved or otherwise non-public, so geolocation and ASN ownership data are not meaningful here."
  }
}
