import {
  getExtendedConverterModifierPage,
  getExtendedOpenFormatGuidePage,
  getExtendedOpenFormatRelatedLinks,
  getExtendedRelatedConverterModifierLinks,
} from "@/lib/converter-families"
import {
  getComparisonPage,
  getRelatedComparisonLinks,
} from "@/lib/compare-matrix"
import {
  getExtendedConverterPairPage,
  getExtendedRelatedConverterLinks,
} from "@/lib/converter-families"
import {
  getExtendedPdfVariantPage,
  getExtendedRelatedPdfVariantPages,
} from "@/lib/pdf-actions-extended"
import {
  getProfessionalWorkflowPage,
  getRelatedProfessionalWorkflowLinks,
} from "@/lib/professional-workflows"
import {
  getCalculatorPage,
  isCalculatorCategory,
} from "@/lib/calculator-financial"
import { getSiteStatusContext, normalizeSiteInput, statusPathFor } from "@/lib/site-status"
import { STATUS_CATEGORY_META, STATUS_DOMAINS } from "@/lib/status-domains"
import {
  getStatusOutageHistoryBundle,
  getStatusTrendingBundle,
  statusOutageHistoryPathForDomain,
  statusTrendingPathForCategory,
  STATUS_TRENDING_SEGMENTS,
} from "@/lib/status-extensions"
import {
  getStatusIspBundle,
  getStatusRegionBundle,
  parseStatusIspFlatSlug,
  parseStatusRegionFlatSlug,
} from "@/lib/status-regions"
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
  { title: "Browse file converters", href: "/file-converters" },
  { title: "Browse PDF tools", href: "/pdf-tools" },
  { title: "Browse network tools", href: "/network-tools" },
  { title: "Browse learn guides", href: "/learn" },
  { title: "Browse comparisons", href: "/compare" },
  { title: "Browse status checks", href: "/status" },
  { title: "Verify local-processing claims", href: "/verify-claims" },
]

const NETWORK_FALLBACK_LINKS: RelatedLink[] = [
  { title: "Browse network tools", href: "/network-tools" },
  { title: "DNS lookup tool", href: "/dns-lookup" },
  { title: "Ping test", href: "/ping-test" },
  { title: "What is my IP", href: "/what-is-my-ip" },
  { title: "MX lookup example", href: "/network/mx/google.com" },
  { title: "NS lookup example", href: "/network/ns/plain.tools" },
  { title: "Reverse DNS example", href: "/network/reverse/8.8.8.8" },
  { title: "WHOIS example", href: "/network/whois/plain.tools" },
]

const CALCULATOR_FALLBACK_LINKS: RelatedLink[] = [
  { title: "10% of 100", href: "/calculators/percentage/what-is-10-percent-of-100" },
  { title: "15% of 200", href: "/calculators/percentage/what-is-15-percent-of-200" },
  { title: "25% of 400", href: "/calculators/percentage/what-is-25-percent-of-400" },
  { title: "75% of 120", href: "/calculators/percentage/what-is-75-percent-of-120" },
  { title: "PDF tools", href: "/pdf-tools" },
  { title: "File converters", href: "/file-converters" },
  { title: "Privacy-first comparisons", href: "/compare" },
  { title: "Professional guides", href: "/guides/legal/compress-shared-pdfs" },
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

  const raw = decodeURIComponent(match[1] ?? "")
  const regionVariant = parseStatusRegionFlatSlug(raw)
  if (regionVariant) {
    const page = getStatusRegionBundle(regionVariant.site, regionVariant.country)
    if (!page) return []

    return dedupeLinks(
      [
        { title: `Status for ${regionVariant.site}`, href: `/status/${encodeURIComponent(regionVariant.site)}` },
        { title: `${regionVariant.site} outage history`, href: `/status/${encodeURIComponent(regionVariant.site)}-outage-history` },
        { title: "Trending outage checks", href: "/status/trending" },
        { title: "Status checker", href: "/site-status" },
        { title: "Ping test", href: "/ping-test" },
        { title: "DNS lookup", href: `/dns/${encodeURIComponent(regionVariant.site)}` },
        { title: "What is my IP", href: "/what-is-my-ip" },
        { title: "Network tools", href: "/network-tools" },
      ],
      currentPath
    ).slice(0, 8)
  }

  const ispVariant = parseStatusIspFlatSlug(raw)
  if (ispVariant) {
    const page = getStatusIspBundle(ispVariant.isp, ispVariant.country)
    if (!page) return []

    return dedupeLinks(
      [
        { title: "Run another live status check", href: "/site-status" },
        { title: "Trending outage checks", href: "/status/trending" },
        { title: "DNS lookup", href: "/dns-lookup" },
        { title: "Ping test", href: "/ping-test" },
        { title: "What is my IP", href: "/what-is-my-ip" },
        { title: "Status directory", href: "/status" },
        { title: "Network tools", href: "/network-tools" },
        { title: "AI outage checks", href: statusTrendingPathForCategory("ai-tools") },
      ],
      currentPath
    ).slice(0, 8)
  }

  const site = normalizeSiteInput(raw)
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
        title: `${site} outage history`,
        href:
          statusOutageHistoryPathForDomain(site) ??
          `/status/${encodeURIComponent(site)}-outage-history`,
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
  const page = getExtendedPdfVariantPage(action, variant)
  if (!page) return []

  const tool = getToolBySlug(page.toolSlug)
  const siblingVariants = getExtendedRelatedPdfVariantPages(action, variant, 4)
    .flatMap((entry) => {
      const href =
        "canonicalPath" in entry
          ? entry.canonicalPath
          : "pdfPath" in entry
            ? entry.pdfPath
            : undefined
      return href ? [{ title: entry.h1, href }] : []
    })

  return dedupeLinks(
    [
      {
        title: tool?.name ?? formatPathTitle(page.toolSlug),
        href: `/tools/${page.toolSlug}`,
      },
      { title: "Browse PDF tools", href: "/pdf-tools" },
      { title: "Browse PDF variants", href: "/pdf-tools/variants" },
      ...siblingVariants,
      { title: "Privacy-first PDF comparisons", href: "/compare/plain-tools-vs-smallpdf" },
      { title: "Professional PDF guides", href: "/guides/legal/compress-shared-pdfs" },
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

function getConverterRelatedLinks(currentPath: string): RelatedLink[] {
  const openGuideMatch = /^\/convert\/open-([^/]+)$/.exec(normalisePath(currentPath))
  if (openGuideMatch) {
    const [, format] = openGuideMatch
    const page = getExtendedOpenFormatGuidePage(format)
    if (page) {
      return dedupeLinks(
        [
          ...getExtendedOpenFormatRelatedLinks(format),
          {
            title: `${page.format.seoLabel} to ${page.suggestedOutput.seoLabel} converter`,
            href: `/convert/${page.format.slug}-to-${page.suggestedOutput.slug}`,
          },
          { title: "Browse file converters", href: "/file-converters" },
          { title: "Browse PDF tools", href: "/pdf-tools" },
        ],
        currentPath
      ).slice(0, 10)
    }
  }

  const modifierMatch = /^\/convert\/([^/]+)-to-([^/]+)\/([^/]+)$/.exec(normalisePath(currentPath))
  if (modifierMatch) {
    const [, from, to, modifier] = modifierMatch
    const page = getExtendedConverterModifierPage(from, to, modifier)
    if (page) {
      return dedupeLinks(
        [
          ...getExtendedRelatedConverterModifierLinks(from, to, modifier),
          { title: "Browse file converters", href: "/file-converters" },
          { title: "Browse PDF tools", href: "/pdf-tools" },
          { title: "Compare privacy-first alternatives", href: "/compare/plain-tools-vs-smallpdf" },
        ],
        currentPath
      ).slice(0, 8)
    }
  }

  const match = /^\/convert\/([^/]+)-to-([^/]+)$/.exec(normalisePath(currentPath))
  if (!match) return []

  const [, from, to] = match
  const page = getExtendedConverterPairPage(from, to)
  if (!page) return []

  return dedupeLinks(
    [
      ...getExtendedRelatedConverterLinks(from, to),
      { title: "Browse file converters", href: "/file-converters" },
      { title: "Browse PDF tools", href: "/pdf-tools" },
      { title: "Convert PDF tool", href: "/tools/convert-pdf" },
      { title: "JPG to PDF tool", href: "/tools/jpg-to-pdf" },
    ],
    currentPath
  ).slice(0, 8)
}

function getCompareRelatedLinks(currentPath: string): RelatedLink[] {
  const match = /^\/compare\/([^/]+)$/.exec(normalisePath(currentPath))
  if (!match) return []

  const slug = decodeURIComponent(match[1] ?? "")
  const page = getComparisonPage(slug)
  if (!page) return []

  return dedupeLinks(
    [
      ...getRelatedComparisonLinks(slug),
      { title: "Browse all comparisons", href: "/compare" },
      { title: "Browse PDF tools", href: "/pdf-tools" },
      { title: "Merge PDF locally", href: "/tools/merge-pdf" },
      { title: "Compress PDF locally", href: "/tools/compress-pdf" },
    ],
    currentPath
  ).slice(0, 8)
}

function getProfessionalWorkflowLinks(currentPath: string): RelatedLink[] {
  const match = /^\/guides\/([^/]+)\/([^/]+)$/.exec(normalisePath(currentPath))
  if (!match) return []

  const [, industry, workflow] = match
  const page = getProfessionalWorkflowPage(industry, workflow)
  if (!page) return []

  return dedupeLinks(
    [
      ...getRelatedProfessionalWorkflowLinks(industry, workflow),
      { title: "Browse professional workflow hubs", href: "/guides" },
      { title: `Browse ${page.page.paramLabel} workflow hub`, href: `/guides/${industry}` },
      { title: "Browse PDF tools", href: "/pdf-tools" },
      { title: "Browse learn guides", href: "/learn" },
      {
        title: "Compare privacy-first alternatives",
        href:
          page.siloLinks.find((link) => link.label.toLowerCase().includes("comparison"))?.href ??
          "/compare",
      },
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

function getNetworkOpsRelatedLinks(currentPath: string): RelatedLink[] {
  const normalizedPath = normalisePath(currentPath)

  const mxOrNsMatch = /^\/network\/(mx|ns)\/([^/]+)$/.exec(normalizedPath)
  if (mxOrNsMatch) {
    const [, kind, target] = mxOrNsMatch
    const domain = decodeURIComponent(target ?? "")
    return dedupeLinks(
      [
        { title: kind === "mx" ? `NS lookup for ${domain}` : `MX lookup for ${domain}`, href: `/network/${kind === "mx" ? "ns" : "mx"}/${encodeURIComponent(domain)}` },
        { title: `WHOIS for ${domain}`, href: `/network/whois/${encodeURIComponent(domain)}` },
        { title: `DNS lookup for ${domain}`, href: `/dns/${encodeURIComponent(domain)}` },
        { title: `Status for ${domain}`, href: `/status/${encodeURIComponent(domain)}` },
        { title: "Browse network tools", href: "/network-tools" },
        { title: "Ping test", href: "/ping-test" },
        { title: "What is my IP", href: "/what-is-my-ip" },
        { title: "Trending outage checks", href: "/status/trending" },
      ],
      currentPath
    ).slice(0, 8)
  }

  const reverseMatch = /^\/network\/reverse\/([^/]+)$/.exec(normalizedPath)
  if (reverseMatch) {
    const ip = decodeURIComponent(reverseMatch[1] ?? "")
    return dedupeLinks(
      [
        { title: `IP lookup for ${ip}`, href: `/ip/${encodeURIComponent(ip)}` },
        { title: `WHOIS for ${ip}`, href: `/network/whois/${encodeURIComponent(ip)}` },
        { title: "Reverse DNS for 1.1.1.1", href: "/network/reverse/1.1.1.1" },
        { title: "Reverse DNS for 8.8.8.8", href: "/network/reverse/8.8.8.8" },
        { title: "Browse network tools", href: "/network-tools" },
        { title: "DNS lookup tool", href: "/dns-lookup" },
        { title: "Ping test", href: "/ping-test" },
        { title: "Status checker", href: "/site-status" },
      ],
      currentPath
    ).slice(0, 8)
  }

  const asnMatch = /^\/network\/asn\/([^/]+)$/.exec(normalizedPath)
  if (asnMatch) {
    const asn = decodeURIComponent(asnMatch[1] ?? "").toUpperCase()
    return dedupeLinks(
      [
        { title: "ASN lookup for AS13335", href: "/network/asn/AS13335" },
        { title: "ASN lookup for AS15169", href: "/network/asn/AS15169" },
        { title: "WHOIS lookup", href: "/network/whois/plain.tools" },
        { title: "Reverse DNS example", href: "/network/reverse/8.8.8.8" },
        { title: "IP lookup example", href: "/ip/8.8.8.8" },
        { title: "Browse network tools", href: "/network-tools" },
        { title: `Search ${asn} in comparisons`, href: "/compare/plain-tools-vs-smallpdf" },
        { title: "Trending outage checks", href: "/status/trending" },
      ],
      currentPath
    ).slice(0, 8)
  }

  const whoisMatch = /^\/network\/whois\/([^/]+)$/.exec(normalizedPath)
  if (whoisMatch) {
    const query = decodeURIComponent(whoisMatch[1] ?? "")
    const isIp = /[:\d]/.test(query) && !query.includes(".tools")
    return dedupeLinks(
      [
        ...(isIp
          ? [
              { title: `Reverse DNS for ${query}`, href: `/network/reverse/${encodeURIComponent(query)}` },
              { title: `IP lookup for ${query}`, href: `/ip/${encodeURIComponent(query)}` },
            ]
          : [
              { title: `MX lookup for ${query}`, href: `/network/mx/${encodeURIComponent(query)}` },
              { title: `NS lookup for ${query}`, href: `/network/ns/${encodeURIComponent(query)}` },
              { title: `DNS lookup for ${query}`, href: `/dns/${encodeURIComponent(query)}` },
              { title: `Status for ${query}`, href: `/status/${encodeURIComponent(query)}` },
            ]),
        { title: "Browse network tools", href: "/network-tools" },
        { title: "Ping test", href: "/ping-test" },
        { title: "What is my IP", href: "/what-is-my-ip" },
        { title: "ASN lookup example", href: "/network/asn/AS13335" },
      ],
      currentPath
    ).slice(0, 8)
  }

  return []
}

function getCalculatorRelatedLinks(currentPath: string): RelatedLink[] {
  const match = /^\/calculators\/([^/]+)\/([^/]+)$/.exec(normalisePath(currentPath))
  if (!match) return []

  const category = decodeURIComponent(match[1] ?? "")
  const expression = decodeURIComponent(match[2] ?? "")
  if (!isCalculatorCategory(category)) return []

  const page = getCalculatorPage(category, expression)
  if (!page) return []

  return dedupeLinks(
    [
      ...page.relatedLinks,
      { title: "Professional PDF guides", href: "/guides/legal/compress-shared-pdfs" },
      { title: "Privacy-first comparisons", href: "/compare/plain-tools-vs-smallpdf" },
      { title: "File converters", href: "/file-converters" },
      { title: "PDF tools", href: "/pdf-tools" },
    ],
    currentPath
  ).slice(0, 8)
}

function getStatusExtensionLinks(currentPath: string): RelatedLink[] {
  const trendingMatch = /^\/status\/trending-([^/]+)$/.exec(normalisePath(currentPath))
  if (trendingMatch) {
    const page = getStatusTrendingBundle(decodeURIComponent(trendingMatch[1] ?? ""))
    if (page) {
      return dedupeLinks(
        [
          { title: "All trending outage checks", href: "/status/trending" },
          { title: "Status checker", href: "/site-status" },
          ...STATUS_TRENDING_SEGMENTS.map((entry) => ({
            title: `Trending ${entry.label.toLowerCase()} outages`,
            href: statusTrendingPathForCategory(entry.segment),
          })),
        ],
        currentPath
      ).slice(0, 8)
    }
  }

  const historyMatch = /^\/status\/([^/]+)-outage-history$/.exec(normalisePath(currentPath))
  if (historyMatch) {
    const domain = decodeURIComponent(historyMatch[1] ?? "")
    const page = getStatusOutageHistoryBundle(domain)
    if (page) {
      return dedupeLinks(
        [
          { title: `Status for ${domain}`, href: `/status/${encodeURIComponent(domain)}` },
          { title: `DNS for ${domain}`, href: `/dns/${encodeURIComponent(domain)}` },
          { title: "Trending outage checks", href: "/status/trending" },
          { title: "Site status checker", href: "/site-status" },
          { title: "Ping test", href: "/ping-test" },
          { title: "What is my IP", href: "/what-is-my-ip" },
          { title: "Network tools", href: "/network-tools" },
          { title: "Status directory", href: "/status" },
        ],
        currentPath
      ).slice(0, 8)
    }
  }

  const regionMatch = /^\/status\/(.+)-([a-z0-9-]+)$/.exec(normalisePath(currentPath))
  if (regionMatch) {
    const parsed = parseStatusRegionFlatSlug(decodeURIComponent(regionMatch[1] + "-" + regionMatch[2]))
    if (parsed) {
      return dedupeLinks(
        [
          { title: `Status for ${parsed.site}`, href: `/status/${encodeURIComponent(parsed.site)}` },
          { title: `${parsed.site} outage history`, href: `/status/${encodeURIComponent(parsed.site)}-outage-history` },
          { title: "Trending outage checks", href: "/status/trending" },
          { title: "DNS lookup", href: `/dns/${encodeURIComponent(parsed.site)}` },
          { title: "Ping test", href: "/ping-test" },
          { title: "What is my IP", href: "/what-is-my-ip" },
          { title: "Status directory", href: "/status" },
          { title: "Network tools", href: "/network-tools" },
        ],
        currentPath
      ).slice(0, 8)
    }
  }

  return []
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

  const converterLinks = getConverterRelatedLinks(normalizedPath)
  if (converterLinks.length >= 6) {
    return converterLinks
  }

  const compareLinks = getCompareRelatedLinks(normalizedPath)
  if (compareLinks.length >= 6) {
    return compareLinks
  }

  const professionalWorkflowLinks = getProfessionalWorkflowLinks(normalizedPath)
  if (professionalWorkflowLinks.length >= 6) {
    return professionalWorkflowLinks
  }

  const dnsLinks = getDnsRelatedLinks(normalizedPath)
  if (dnsLinks.length >= 6) {
    return dnsLinks
  }

  const networkLinks = getNetworkOpsRelatedLinks(normalizedPath)
  if (networkLinks.length >= 6) {
    return networkLinks
  }

  const ipLinks = getIpRelatedLinks(normalizedPath)
  if (ipLinks.length >= 6) {
    return ipLinks
  }

  const calculatorLinks = getCalculatorRelatedLinks(normalizedPath)
  if (calculatorLinks.length >= 6) {
    return calculatorLinks
  }

  const statusExtensionLinks = getStatusExtensionLinks(normalizedPath)
  if (statusExtensionLinks.length >= 6) {
    return statusExtensionLinks
  }

  if (normalizedPath.startsWith("/dns")) {
    return dedupeLinks([...dnsLinks, ...DNS_FALLBACK_LINKS], normalizedPath).slice(0, 8)
  }

  if (normalizedPath.startsWith("/ip")) {
    return dedupeLinks([...ipLinks, ...IP_FALLBACK_LINKS], normalizedPath).slice(0, 8)
  }

  if (normalizedPath.startsWith("/network")) {
    return dedupeLinks([...networkLinks, ...NETWORK_FALLBACK_LINKS], normalizedPath).slice(0, 8)
  }

  if (normalizedPath.startsWith("/calculators")) {
    return dedupeLinks([...calculatorLinks, ...CALCULATOR_FALLBACK_LINKS], normalizedPath)
      .slice(0, 8)
  }

  if (normalizedPath.startsWith("/convert")) {
    return dedupeLinks([...converterLinks, ...GLOBAL_FALLBACK_LINKS], normalizedPath).slice(0, 8)
  }

  if (normalizedPath.startsWith("/compare")) {
    return dedupeLinks([...compareLinks, ...GLOBAL_FALLBACK_LINKS], normalizedPath).slice(0, 8)
  }

  if (normalizedPath.startsWith("/guides")) {
    return dedupeLinks([...professionalWorkflowLinks, ...GLOBAL_FALLBACK_LINKS], normalizedPath)
      .slice(0, 8)
  }

  if (normalizedPath.includes("pdf")) {
    return dedupeLinks([...pdfVariantLinks, ...getKeywordPdfLinks(normalizedPath)], normalizedPath)
      .slice(0, 8)
  }

  return dedupeLinks(GLOBAL_FALLBACK_LINKS, normalizedPath).slice(0, 7)
}
