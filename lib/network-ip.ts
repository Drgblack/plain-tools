import { isIP } from "node:net"

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
  org: string
  region: string
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

export const IP_SITEMAP_ADDRESSES = [
  "1.1.1.1",
  "1.0.0.1",
  "8.8.8.8",
  "8.8.4.4",
  "9.9.9.9",
  "208.67.222.222",
  "2606:4700:4700::1111",
  "2001:4860:4860::8888",
] as const

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
  const response = await fetch(
    `https://api.ipapi.is/?q=${encodeURIComponent(validation.normalized)}`,
    {
      cache: "force-cache",
      next: { revalidate: revalidateSeconds },
    }
  )

  if (!response.ok) {
    throw new Error(`IP info request failed with ${response.status}`)
  }

  const payload = (await response.json()) as {
    company?: {
      name?: string
    }
    ip?: string
    asn?: {
      asn?: number
      org?: string
    }
    location?: {
      city?: string
      country?: string
      latitude?: number
      longitude?: number
      state?: string
    }
  }
  const organization = payload.company?.name ?? payload.asn?.org ?? "Unknown"
  const asn = payload.asn?.asn ? `AS${payload.asn.asn}` : "Unknown"

  return {
    info: {
      asn,
      city: payload.location?.city ?? "Unknown",
      country: payload.location?.country ?? "Unknown",
      ip: payload.ip ?? validation.normalized,
      isp: organization,
      latitude:
        typeof payload.location?.latitude === "number" ? payload.location.latitude : null,
      longitude:
        typeof payload.location?.longitude === "number" ? payload.location.longitude : null,
      org: organization,
      region: payload.location?.state ?? "Unknown",
    },
    kind: "public",
    version: validation.version,
  }
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
