import type { Metadata } from "next"

import { buildCanonicalUrl, buildPageMetadata } from "@/lib/page-metadata"
import { normalizeBrandCapitalization } from "@/lib/page-title"

function normalisePath(slug: string): string {
  const cleaned = slug.trim().replace(/^\/+/, "")
  return cleaned ? `/${cleaned}` : "/"
}

function normaliseDescription(description: string): string {
  return description.replace(/\s+/g, " ").trim()
}

function normaliseTitle(title: string): string {
  return normalizeBrandCapitalization(title).trim()
}

interface ToolMetadataProps {
  name: string
  description: string
  slug: string
  category?: string
}

export function generateToolMetadata({
  name,
  description,
  slug,
  category,
}: ToolMetadataProps): Metadata {
  const path = normalisePath(slug)
  const suffix = category?.toLowerCase().includes("network")
    ? "Practical browser-based network diagnostics with clear, verifiable behaviour."
    : "Runs locally in your browser where supported, with no upload step for core local workflows."
  const fullDescription = `${normaliseDescription(description)} ${suffix}`

  return buildPageMetadata({
    title: normaliseTitle(name),
    description: fullDescription,
    path,
    image: "/og/default.png",
  })
}

interface CategoryMetadataProps {
  name: string
  description: string
  slug: string
  toolCount: number
}

export function generateCategoryMetadata({
  name,
  description,
  slug,
  toolCount,
}: CategoryMetadataProps): Metadata {
  const path = normalisePath(slug)
  const scopeNote = name.toLowerCase().includes("network")
    ? `Browse ${toolCount} practical diagnostics for uptime, DNS, IP, and latency checks.`
    : `Browse ${toolCount} practical tools with local processing where supported.`
  const fullDescription = `${normaliseDescription(description)} ${scopeNote}`

  return buildPageMetadata({
    title: normaliseTitle(name),
    description: fullDescription,
    path,
    image: "/og/default.png",
  })
}

interface StaticPageMetadataProps {
  title: string
  description: string
  slug: string
}

export function generateStaticPageMetadata({
  title,
  description,
  slug,
}: StaticPageMetadataProps): Metadata {
  return buildPageMetadata({
    title: normaliseTitle(title),
    description: normaliseDescription(description),
    path: normalisePath(slug),
    image: "/og/default.png",
  })
}

// Validation helpers for dynamic routes
const DOMAIN_REGEX = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/
const IPV4_REGEX = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
const IPV6_REGEX = /^(?:[a-fA-F0-9]{1,4}:){7}[a-fA-F0-9]{1,4}$|^::(?:[a-fA-F0-9]{1,4}:){0,6}[a-fA-F0-9]{1,4}$|^(?:[a-fA-F0-9]{1,4}:){1,6}:$|^(?:[a-fA-F0-9]{1,4}:){1,5}(?::[a-fA-F0-9]{1,4}){1,2}$/

export function isValidDomain(domain: string): boolean {
  if (!domain || domain.length > 253) return false
  return DOMAIN_REGEX.test(domain)
}

export function isValidIPAddress(address: string): boolean {
  if (!address) return false
  return IPV4_REGEX.test(address) || IPV6_REGEX.test(address)
}

export function isValidSite(site: string): boolean {
  if (!site || site.length > 253) return false
  // Allow domains with or without protocol prefix for site status
  const cleaned = site.replace(/^https?:\/\//, '').split('/')[0]
  return DOMAIN_REGEX.test(cleaned) || IPV4_REGEX.test(cleaned)
}

interface DynamicToolMetadataProps {
  toolName: string
  param: string
  paramType: 'domain' | 'ip' | 'site'
  isValid: boolean
}

export function generateDynamicToolMetadata({ toolName, param, paramType, isValid }: DynamicToolMetadataProps): Metadata {
  const slugMap = {
    domain: 'dns',
    ip: 'ip',
    site: 'status',
  }
  
  const titleMap = {
    domain: `DNS lookup for ${param}`,
    ip: `IP address ${param}`,
    site: `Is ${param} down?`,
  }
  
  const descriptionMap = {
    domain: `View DNS records for ${param}, including A, AAAA, MX, TXT, NS, and CNAME results for practical troubleshooting.`,
    ip: `View information about IP address ${param}, including approximate geolocation, ISP details, and network context.`,
    site: `Check whether ${param} is currently up or down, including response time and latest check status.`,
  }
  
  const slug = slugMap[paramType]
  const title = titleMap[paramType]
  const description = descriptionMap[paramType]
  const contextualDescription = `${description} ${toolName} route.`
  const path = `/${slug}/${encodeURIComponent(param)}`
  const canonical = buildCanonicalUrl(path)
  
  // For invalid params, add noindex
  if (!isValid) {
    const invalidLabel =
      paramType === "domain" ? "domain" : paramType === "ip" ? "IP address" : "site"
    const base = buildPageMetadata({
      title: `Invalid ${invalidLabel}`,
      description: `The provided ${invalidLabel} is not valid for this ${toolName.toLowerCase()} route. Check the input and try again.`,
      path,
      image: "/og/default.png",
    })

    return {
      ...base,
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  const metadata = buildPageMetadata({
    title,
    description: contextualDescription,
    path,
    image: "/og/default.png",
  })

  return {
    ...metadata,
    alternates: {
      ...metadata.alternates,
      canonical,
    },
  }
}
