import {
  getPdfVariantPage,
  getRelatedPdfVariantPages,
} from "@/lib/pdf-variants"
import { getSiteStatusContext, normalizeSiteInput, statusPathFor } from "@/lib/site-status"
import { STATUS_CATEGORY_META, STATUS_DOMAINS } from "@/lib/status-domains"
import { getToolBySlug } from "@/lib/tools-catalogue"

export type RelatedLink = {
  title: string
  href: string
}

const STATUS_FALLBACK_LINKS: RelatedLink[] = [
  { title: "Site status checker", href: "/site-status" },
  { title: "Trending outage checks", href: "/status/trending" },
  { title: "All status pages", href: "/status" },
  { title: "DNS lookup", href: "/dns-lookup" },
  { title: "Ping test", href: "/ping-test" },
  { title: "What is my IP", href: "/what-is-my-ip" },
  {
    title: "Is it down for everyone or just me?",
    href: "/learn/is-it-down-for-everyone-or-just-me",
  },
  {
    title: "What response time means in uptime checks",
    href: "/learn/what-response-time-means-in-uptime-check",
  },
]

const PDF_FALLBACK_LINKS: RelatedLink[] = [
  { title: "Browse PDF tools", href: "/pdf-tools" },
  { title: "Browse PDF variants", href: "/pdf-tools/variants" },
  { title: "Merge PDF", href: "/tools/merge-pdf" },
  { title: "Split PDF", href: "/tools/split-pdf" },
  { title: "Compress PDF", href: "/tools/compress-pdf" },
  { title: "PDF to JPG", href: "/tools/pdf-to-jpg" },
  {
    title: "How to compress a PDF without upload",
    href: "/learn/compress-pdf-without-upload",
  },
  {
    title: "How to verify a PDF tool does not upload your files",
    href: "/learn/how-to-verify-a-pdf-tool-doesnt-upload-your-files",
  },
]

const DNS_FALLBACK_LINKS: RelatedLink[] = [
  { title: "DNS lookup tool", href: "/dns-lookup" },
  { title: "Ping test", href: "/ping-test" },
  { title: "What is my IP", href: "/what-is-my-ip" },
  { title: "Site status checker", href: "/site-status" },
  { title: "Browse network tools", href: "/network-tools" },
  { title: "Trending outage checks", href: "/status/trending" },
  { title: "Check a different DNS domain", href: "/dns/google.com" },
  { title: "IP lookup for 1.1.1.1", href: "/ip/1.1.1.1" },
]

const IP_FALLBACK_LINKS: RelatedLink[] = [
  { title: "What is my IP", href: "/what-is-my-ip" },
  { title: "Ping test", href: "/ping-test" },
  { title: "DNS lookup tool", href: "/dns-lookup" },
  { title: "Site status checker", href: "/site-status" },
  { title: "Browse network tools", href: "/network-tools" },
  { title: "DNS lookup for plain.tools", href: "/dns/plain.tools" },
  { title: "Check IP 8.8.8.8", href: "/ip/8.8.8.8" },
  { title: "Trending outage checks", href: "/status/trending" },
]

const GLOBAL_FALLBACK_LINKS: RelatedLink[] = [
  { title: "Browse all tools", href: "/tools" },
  { title: "Browse PDF tools", href: "/pdf-tools" },
  { title: "Browse network tools", href: "/network-tools" },
  { title: "Browse learn guides", href: "/learn" },
  { title: "Browse comparisons", href: "/compare" },
  { title: "Browse status checks", href: "/status" },
  { title: "Verify local-processing claims", href: "/verify-claims" },
]

function normalisePath(path: string) {
  const pathname = path.split(/[?#]/, 1)[0]?.trim() || "/"
  if (!pathname.startsWith("/")) return `/${pathname}`
  return pathname
}

function dedupeLinks(links: RelatedLink[], currentPath: string) {
  const normalizedCurrentPath = normalisePath(currentPath)
  const seen = new Set<string>()

  return links.filter((link) => {
    const href = normalisePath(link.href)
    if (!link.title.trim() || href === normalizedCurrentPath || seen.has(href)) {
      return false
    }

    seen.add(href)
    return true
  })
}

function formatPathTitle(path: string) {
  return path
    .split("/")
    .filter(Boolean)
    .at(-1)
    ?.replace(/-/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase()) ?? path
}

function getStatusRelatedLinks(currentPath: string): RelatedLink[] {
  const match = /^\/status\/([^/]+)$/.exec(normalisePath(currentPath))
  if (!match) return []

  const site = normalizeSiteInput(decodeURIComponent(match[1] ?? ""))
  if (!site) return []

  const category = STATUS_DOMAINS.find((entry) => entry.domain === site)?.category
  const statusContext = getSiteStatusContext(site)
  const relatedStatusPages = statusContext.relatedExamples.slice(0, 3).map((domain) => ({
    title: `Is ${domain} down right now?`,
    href: statusPathFor(domain),
  }))

  const categoryLink = category
    ? [
        {
          title: STATUS_CATEGORY_META[category].title,
          href: `/status/${category}`,
        },
      ]
    : []

  return dedupeLinks(
    [
      {
        title: `DNS lookup for ${site}`,
        href: `/dns/${encodeURIComponent(site)}`,
      },
      {
        title: `Run a fresh status check for ${site}`,
        href: "/site-status",
      },
      { title: "Trending outage checks", href: "/status/trending" },
      { title: "All status pages", href: "/status" },
      ...categoryLink,
      ...relatedStatusPages,
      { title: "Ping test", href: "/ping-test" },
      { title: "What is my IP", href: "/what-is-my-ip" },
      {
        title: "Is it down for everyone or just me?",
        href: "/learn/is-it-down-for-everyone-or-just-me",
      },
      {
        title: "What response time means in uptime checks",
        href: "/learn/what-response-time-means-in-uptime-check",
      },
    ],
    currentPath
  ).slice(0, 8)
}

function getPdfVariantRelatedLinks(currentPath: string): RelatedLink[] {
  const match = /^\/pdf-tools\/([^/]+)\/([^/]+)$/.exec(normalisePath(currentPath))
  if (!match) return []

  const [, action, variant] = match
  const page = getPdfVariantPage(action, variant)
  if (!page) return []

  const tool = getToolBySlug(page.toolSlug)
  const siblingVariants = getRelatedPdfVariantPages(action, page.modifierSlug, 4).map(
    (entry) => ({
      title: entry.h1,
      href: entry.pdfPath,
    })
  )
  const relatedTools = page.relatedToolSlugs.slice(0, 3).flatMap((slug) => {
    const relatedTool = getToolBySlug(slug)
    if (!relatedTool) return []

    return {
      title: relatedTool.name,
      href: `/tools/${relatedTool.slug}`,
    }
  })
  const relatedGuides = page.relatedGuidePaths.slice(0, 2).map((path) => ({
    title: formatPathTitle(path),
    href: path,
  }))

  return dedupeLinks(
    [
      {
        title: tool?.name ?? formatPathTitle(page.toolSlug),
        href: `/tools/${page.toolSlug}`,
      },
      { title: "Browse PDF tools", href: "/pdf-tools" },
      { title: "Browse PDF variants", href: "/pdf-tools/variants" },
      ...siblingVariants,
      ...relatedTools,
      ...relatedGuides,
    ],
    currentPath
  ).slice(0, 8)
}

function getKeywordPdfLinks(currentPath: string): RelatedLink[] {
  if (!/pdf|ocr|watermark|sign|convert|compress|merge|split/i.test(currentPath)) {
    return []
  }

  return dedupeLinks(
    [
      ...PDF_FALLBACK_LINKS,
      ...(currentPath.includes("compress")
        ? [
            { title: "Compress PDF for email", href: "/pdf-tools/compress-pdf/for-email" },
            { title: "Compress PDF for large files", href: "/pdf-tools/compress-pdf/large-files" },
          ]
        : []),
      ...(currentPath.includes("merge")
        ? [{ title: "Merge PDF on Mac", href: "/pdf-tools/merge-pdf/mac" }]
        : []),
      ...(currentPath.includes("jpg") || currentPath.includes("image")
        ? [{ title: "JPG to PDF", href: "/tools/jpg-to-pdf" }]
        : []),
    ],
    currentPath
  ).slice(0, 8)
}

function getDnsRelatedLinks(currentPath: string): RelatedLink[] {
  const match = /^\/dns\/([^/]+)$/.exec(normalisePath(currentPath))
  if (!match) return []

  const domain = decodeURIComponent(match[1] ?? "")
  const rootDomain = domain.replace(/^www\./, "")
  const isRootDomain = domain === rootDomain

  return dedupeLinks(
    [
      { title: `Run DNS lookup for ${domain}`, href: "/dns-lookup" },
      { title: `Check ${rootDomain} site status`, href: `/status/${encodeURIComponent(rootDomain)}` },
      { title: "Ping test", href: "/ping-test" },
      { title: "What is my IP", href: "/what-is-my-ip" },
      { title: "Browse network tools", href: "/network-tools" },
      { title: "Trending outage checks", href: "/status/trending" },
      ...(isRootDomain
        ? [{ title: `DNS lookup for www.${rootDomain}`, href: `/dns/${encodeURIComponent(`www.${rootDomain}`)}` }]
        : [{ title: `DNS lookup for ${rootDomain}`, href: `/dns/${encodeURIComponent(rootDomain)}` }]),
      { title: "IP lookup for 1.1.1.1", href: "/ip/1.1.1.1" },
    ],
    currentPath
  ).slice(0, 8)
}

function getIpRelatedLinks(currentPath: string): RelatedLink[] {
  const match = /^\/ip\/([^/]+)$/.exec(normalisePath(currentPath))
  if (!match) return []

  const ip = decodeURIComponent(match[1] ?? "")
  const isIpv6 = ip.includes(":")
  const comparisonIp = isIpv6
    ? ip === "2001:4860:4860::8888"
      ? "2606:4700:4700::1111"
      : "2001:4860:4860::8888"
    : ip === "8.8.8.8"
      ? "1.1.1.1"
      : "8.8.8.8"

  return dedupeLinks(
    [
      { title: "What is my IP", href: "/what-is-my-ip" },
      { title: "DNS lookup tool", href: "/dns-lookup" },
      { title: "Ping test", href: "/ping-test" },
      { title: "Site status checker", href: "/site-status" },
      { title: "Browse network tools", href: "/network-tools" },
      { title: "DNS lookup for plain.tools", href: "/dns/plain.tools" },
      { title: `Check comparison IP ${comparisonIp}`, href: `/ip/${encodeURIComponent(comparisonIp)}` },
      { title: "Trending outage checks", href: "/status/trending" },
    ],
    currentPath
  ).slice(0, 8)
}

export function getRelatedLinks(currentPath: string): RelatedLink[] {
  const normalizedPath = normalisePath(currentPath)

  const statusLinks = getStatusRelatedLinks(normalizedPath)
  if (statusLinks.length >= 6) {
    return statusLinks
  }

  const pdfVariantLinks = getPdfVariantRelatedLinks(normalizedPath)
  if (pdfVariantLinks.length >= 6) {
    return pdfVariantLinks
  }

  if (normalizedPath.startsWith("/status")) {
    return dedupeLinks([...statusLinks, ...STATUS_FALLBACK_LINKS], normalizedPath).slice(0, 8)
  }

  const dnsLinks = getDnsRelatedLinks(normalizedPath)
  if (dnsLinks.length >= 6) {
    return dnsLinks
  }

  const ipLinks = getIpRelatedLinks(normalizedPath)
  if (ipLinks.length >= 6) {
    return ipLinks
  }

  if (normalizedPath.startsWith("/dns")) {
    return dedupeLinks([...dnsLinks, ...DNS_FALLBACK_LINKS], normalizedPath).slice(0, 8)
  }

  if (normalizedPath.startsWith("/ip")) {
    return dedupeLinks([...ipLinks, ...IP_FALLBACK_LINKS], normalizedPath).slice(0, 8)
  }

  if (normalizedPath.includes("pdf")) {
    return dedupeLinks([...pdfVariantLinks, ...getKeywordPdfLinks(normalizedPath)], normalizedPath)
      .slice(0, 8)
  }

  return dedupeLinks(GLOBAL_FALLBACK_LINKS, normalizedPath).slice(0, 7)
}
