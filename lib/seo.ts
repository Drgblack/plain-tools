import { Metadata } from 'next'

const BASE_URL = 'https://plain.tools'

interface ToolMetadataProps {
  name: string
  description: string
  slug: string
}

export function generateToolMetadata({ name, description, slug }: ToolMetadataProps): Metadata {
  const title = name
  const fullDescription = `${description} Plain Tools runs entirely in your browser with no uploads and no tracking.`
  
  return {
    title,
    description: fullDescription,
    openGraph: {
      title: `${name} | Plain Tools`,
      description: fullDescription,
      url: `${BASE_URL}/${slug}`,
      siteName: 'Plain Tools',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${name} | Plain Tools`,
      description: fullDescription,
    },
    alternates: {
      canonical: `${BASE_URL}/${slug}`,
    },
  }
}

interface CategoryMetadataProps {
  name: string
  description: string
  slug: string
  toolCount: number
}

export function generateCategoryMetadata({ name, description, slug, toolCount }: CategoryMetadataProps): Metadata {
  const title = name
  const fullDescription = `${description} Browse ${toolCount} privacy-first ${name.toLowerCase()} that run locally in your browser.`
  
  return {
    title,
    description: fullDescription,
    openGraph: {
      title: `${name} | Plain Tools`,
      description: fullDescription,
      url: `${BASE_URL}/${slug}`,
      siteName: 'Plain Tools',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${name} | Plain Tools`,
      description: fullDescription,
    },
    alternates: {
      canonical: `${BASE_URL}/${slug}`,
    },
  }
}

interface StaticPageMetadataProps {
  title: string
  description: string
  slug: string
}

export function generateStaticPageMetadata({ title, description, slug }: StaticPageMetadataProps): Metadata {
  return {
    title,
    description,
    openGraph: {
      title: `${title} | Plain Tools`,
      description,
      url: `${BASE_URL}/${slug}`,
      siteName: 'Plain Tools',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Plain Tools`,
      description,
    },
    alternates: {
      canonical: `${BASE_URL}/${slug}`,
    },
  }
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
    domain: `DNS Lookup for ${param}`,
    ip: `IP Address ${param}`,
    site: `Is ${param} Down?`,
  }
  
  const descriptionMap = {
    domain: `View DNS records for ${param} including A, AAAA, MX, TXT, NS, and CNAME records. Free DNS lookup tool.`,
    ip: `View information about IP address ${param} including geolocation, ISP, and network details.`,
    site: `Check if ${param} is up or down right now. Free website status checker with response time.`,
  }
  
  const slug = slugMap[paramType]
  const title = titleMap[paramType]
  const description = descriptionMap[paramType]
  const fullUrl = `${BASE_URL}/${slug}/${encodeURIComponent(param)}`
  
  // For invalid params, add noindex
  if (!isValid) {
    return {
      title: `Invalid ${paramType === 'domain' ? 'Domain' : paramType === 'ip' ? 'IP Address' : 'Site'}`,
      description: `The provided ${paramType} is not valid. Please check your input.`,
      robots: {
        index: false,
        follow: false,
      },
      alternates: {
        canonical: fullUrl,
      },
    }
  }
  
  return {
    title,
    description,
    openGraph: {
      title: `${title} | Plain Tools`,
      description,
      url: fullUrl,
      siteName: 'Plain Tools',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Plain Tools`,
      description,
    },
    alternates: {
      canonical: fullUrl,
    },
  }
}
