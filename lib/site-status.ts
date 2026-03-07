import { FIRST_WAVE_STATUS_SITES } from "@/lib/seo/first-wave-pages"
import {
  STATUS_DOMAIN_SET,
  STATUS_POPULAR_DOMAINS,
} from "@/lib/status-domains"

const DOMAIN_REGEX =
  /^(?=.{1,253}$)(?!-)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/
const IPV4_REGEX =
  /^(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)$/

export type SiteCheckStatus = "up" | "down" | "invalid"

export type SiteStatusCheckResult = {
  site: string
  status: SiteCheckStatus
  responseTimeMs: number | null
  checkedAt: string
  httpStatus: number | null
  errorMessage?: string
}

/**
 * Curated traffic-focused status routes.
 * Keep this list intentional for sitemap/index quality and high-demand "is it down" queries.
 */
export const STATUS_TRAFFIC_SITES = [
  ...FIRST_WAVE_STATUS_SITES,
  ...STATUS_POPULAR_DOMAINS.filter((domain) => !FIRST_WAVE_STATUS_SITES.includes(domain as (typeof FIRST_WAVE_STATUS_SITES)[number])),
]

export const STATUS_EXAMPLE_SITES = [
  "chatgpt.com",
  "reddit.com",
  "discord.com",
  "youtube.com",
  "google.com",
  "gmail.com",
] as const

export const STATUS_POPULAR_SITES = [
  ...STATUS_POPULAR_DOMAINS,
]

type StatusSegmentRule = {
  segmentLabel: string
  pattern: RegExp
  segmentNote: string
  localIssueNote: string
  troubleshootingSteps: [string, string, string]
  relatedExamples: string[]
}

export type SiteStatusContext = {
  segmentLabel: string
  segmentNote: string
  localIssueNote: string
  troubleshootingSteps: [string, string, string]
  relatedExamples: string[]
}

type SiteSpecificStatusContext = {
  answerIntro: string
  meaningNote: string
  likelyIssues: [string, string, string]
}

const SITE_SPECIFIC_CONTEXT: Record<string, SiteSpecificStatusContext> = {
  "chatgpt.com": {
    answerIntro:
      "ChatGPT relies on multiple model and session endpoints, so partial incidents can look like intermittent availability.",
    meaningNote:
      "A status of Up confirms the main host responded, but model requests can still fail during regional or account-level incidents.",
    likelyIssues: [
      "Retry with a fresh session to rule out auth-token expiry.",
      "Check response time changes across two to three refreshes.",
      "Compare with another network profile to isolate local restrictions.",
    ],
  },
  "google.com": {
    answerIntro:
      "Google can appear up while specific products or regions experience separate service degradation.",
    meaningNote:
      "An Up result means the main domain responded, not that every Google product path is healthy globally.",
    likelyIssues: [
      "Check whether only one Google product is affected.",
      "Run DNS lookup to verify resolver responses on your network.",
      "Test from another connection to rule out ISP routing issues.",
    ],
  },
  "youtube.com": {
    answerIntro:
      "YouTube may be reachable while playback quality or video delivery degrades at CDN edges.",
    meaningNote:
      "Up confirms host responsiveness, but buffering and playback errors can still occur due to regional delivery load.",
    likelyIssues: [
      "Compare homepage access versus playback behaviour.",
      "Run a latency check to detect local congestion.",
      "Retry on a second network to confirm whether the issue is local.",
    ],
  },
  "reddit.com": {
    answerIntro:
      "Reddit incidents often affect API and media paths differently from the main website.",
    meaningNote:
      "A positive status means the main host responded, but posting and feed APIs may still be degraded.",
    likelyIssues: [
      "Refresh and compare response time across checks.",
      "Test on web and app to see if failure is channel-specific.",
      "Verify DNS results before assuming a full outage.",
    ],
  },
  "discord.com": {
    answerIntro:
      "Discord can show mixed incidents where chat, media, and auth services degrade independently.",
    meaningNote:
      "Up indicates core host reachability; voice or messaging paths may still fail during partial incidents.",
    likelyIssues: [
      "Check if login works but messaging or voice fails.",
      "Run latency and compare with a second network.",
      "Repeat the status check after a short interval for trend context.",
    ],
  },
  "github.com": {
    answerIntro:
      "GitHub availability can differ between web UI, API, Actions, and package registry routes.",
    meaningNote:
      "An Up result confirms host response, but CI or package endpoints can still be degraded.",
    likelyIssues: [
      "Confirm whether only Actions or packages are affected.",
      "Run DNS lookup and latency checks for local path quality.",
      "Retry from a different network if failures remain inconsistent.",
    ],
  },
  "netflix.com": {
    answerIntro:
      "Netflix may respond as up while account, playback, or regional CDN delivery paths are unstable.",
    meaningNote:
      "Up confirms site reachability, not guaranteed stream quality for every region and ISP route.",
    likelyIssues: [
      "Check whether browse works but playback fails.",
      "Test latency to rule out local congestion.",
      "Retry from another network profile for comparison.",
    ],
  },
  "gmail.com": {
    answerIntro:
      "Gmail can show mailbox-specific or regional delays even when the main route is reachable.",
    meaningNote:
      "A status of Up confirms host response, but sync and delivery delays may still affect individual accounts.",
    likelyIssues: [
      "Check whether delays affect web and mobile clients equally.",
      "Run DNS checks to confirm resolver health.",
      "Retry from a second network if access remains inconsistent.",
    ],
  },
}

const STATUS_SEGMENT_RULES: StatusSegmentRule[] = [
  {
    segmentLabel: "AI and assistant services",
    pattern: /(chatgpt|openai|claude|gemini|perplexity|copilot)/,
    segmentNote:
      "AI services can appear partially degraded even when the root domain responds, because model endpoints and auth gateways may fail independently.",
    localIssueNote:
      "If the status looks up but your requests fail, check regional throttling, auth-session expiry, and enterprise network restrictions.",
    troubleshootingSteps: [
      "Refresh the status check and compare response time with a second run.",
      "Check DNS resolution and latency to rule out local network issues.",
      "Try from another network profile to separate local vs wider outage behaviour.",
    ],
    relatedExamples: ["chatgpt.com", "openai.com", "claude.ai"],
  },
  {
    segmentLabel: "Social and communication platforms",
    pattern: /(reddit|discord|x\.com|twitter|instagram|facebook|whatsapp)/,
    segmentNote:
      "Social platforms can return mixed availability where web views are up while API, messaging, or media delivery paths are degraded.",
    localIssueNote:
      "Local app cache, DNS resolver issues, or ISP peering problems can cause access failures when global status appears healthy.",
    troubleshootingSteps: [
      "Run a fresh status check, then test DNS records for propagation issues.",
      "Compare behaviour between browser and mobile app sessions.",
      "Use a second connection to confirm whether the issue is local-only.",
    ],
    relatedExamples: ["reddit.com", "discord.com", "x.com", "instagram.com"],
  },
  {
    segmentLabel: "Developer and infrastructure platforms",
    pattern: /(github|gitlab|npmjs|vercel|cloudflare|docker)/,
    segmentNote:
      "Developer platforms often have partial incidents where package registries, CI, or dashboards degrade separately from the primary website.",
    localIssueNote:
      "If web status is up but pipelines fail, check endpoint-specific service status and regional routing behaviour.",
    troubleshootingSteps: [
      "Check status first, then test latency and DNS for the same host.",
      "Verify whether a specific API or CI endpoint is failing.",
      "Re-test after clearing local DNS cache if failures are inconsistent.",
    ],
    relatedExamples: ["github.com", "cloudflare.com", "google.com"],
  },
  {
    segmentLabel: "Streaming and media services",
    pattern: /(youtube|spotify|netflix|twitch)/,
    segmentNote:
      "Media services may report as up while playback quality degrades due to CDN edge load, regional delivery issues, or account-level limits.",
    localIssueNote:
      "If you can open the site but playback fails, test latency and compare another network before assuming a full outage.",
    troubleshootingSteps: [
      "Check current status and response time for the main domain.",
      "Test latency and retry from another network to rule out local congestion.",
      "Confirm whether only media playback is affected rather than full site access.",
    ],
    relatedExamples: ["youtube.com", "spotify.com", "netflix.com"],
  },
]

export function isValidStatusSite(value: string) {
  if (!value) return false
  return DOMAIN_REGEX.test(value) || IPV4_REGEX.test(value)
}

export function normalizeSiteInput(input: string) {
  let site = ""
  try {
    site = decodeURIComponent(input)
  } catch {
    site = input
  }

  site = site.trim().toLowerCase()
  if (!site) return null

  // Backward-compatible legacy slug support: /status/is-chatgpt-down.
  if (site.startsWith("is-") && site.endsWith("-down")) {
    site = site.slice(3, -5)
  }

  site = site
    .replace(/^[a-z]+:\/\//, "")
    .replace(/^www\./, "")
    .split(/[/?#]/)[0]
    .trim()

  if (!site) return null

  // Strip a trailing port if present (example: example.com:443).
  site = site.replace(/:\d+$/, "")
  if (!site) return null

  if (!site.includes(".") && !IPV4_REGEX.test(site)) {
    site = `${site}.com`
  }

  site = site.replace(/\.+/g, ".").replace(/^\.+/, "")
  site = site.replace(/\.+$/, "")
  if (!site) return null

  return isValidStatusSite(site) ? site : null
}

export function formatSiteLabel(site: string) {
  return site.replace(/^www\./, "")
}

export function statusPathFor(site: string) {
  const normalized = normalizeSiteInput(site) ?? formatSiteLabel(site).toLowerCase()
  return `/status/${encodeURIComponent(normalized)}`
}

export function isIndexedStatusDomain(site: string) {
  const normalized = normalizeSiteInput(site)
  if (!normalized) return false
  return STATUS_DOMAIN_SET.has(normalized)
}

export function getSiteSpecificStatusContext(site: string): SiteSpecificStatusContext {
  const normalizedSite = formatSiteLabel(site).toLowerCase()
  const matched = SITE_SPECIFIC_CONTEXT[normalizedSite]

  if (matched) {
    return matched
  }

  return {
    answerIntro:
      "This route checks current host responsiveness and gives a practical first signal for outage triage.",
    meaningNote:
      "A host can be up globally while still failing locally due to resolver, routing, or policy constraints.",
    likelyIssues: [
      "Re-run the check and compare response-time trend.",
      "Verify DNS and latency for the same host.",
      "Test from another network to isolate local-only issues.",
    ],
  }
}

export function getSiteStatusContext(site: string): SiteStatusContext {
  const normalizedSite = formatSiteLabel(site).toLowerCase()
  const matchedRule =
    STATUS_SEGMENT_RULES.find((rule) => rule.pattern.test(normalizedSite)) ?? null

  if (!matchedRule) {
    return {
      segmentLabel: "general web platforms",
      segmentNote:
        "A positive status means the host responded during the latest probe, but local routing and DNS conditions can still block individual users.",
      localIssueNote:
        "If the host appears up here but fails for you, check DNS, latency, and network path from your local connection.",
      troubleshootingSteps: [
        "Run the status check again and note whether response time changes significantly.",
        "Check DNS records and run a latency test for the same hostname.",
        "Retry from a different network to isolate local connectivity issues.",
      ],
      relatedExamples: [...STATUS_EXAMPLE_SITES],
    }
  }

  const relatedExamples = Array.from(
    new Set([...matchedRule.relatedExamples, ...STATUS_EXAMPLE_SITES])
  )

  return {
    segmentLabel: matchedRule.segmentLabel,
    segmentNote: matchedRule.segmentNote,
    localIssueNote: matchedRule.localIssueNote,
    troubleshootingSteps: matchedRule.troubleshootingSteps,
    relatedExamples,
  }
}
