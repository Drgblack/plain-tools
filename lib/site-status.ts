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

export const STATUS_EXAMPLE_SITES = [
  "chatgpt.com",
  "reddit.com",
  "discord.com",
  "github.com",
  "youtube.com",
  "spotify.com",
] as const

export const STATUS_POPULAR_SITES = [
  "chatgpt.com",
  "reddit.com",
  "discord.com",
  "github.com",
  "youtube.com",
  "spotify.com",
  "google.com",
  "openai.com",
  "claude.ai",
  "x.com",
  "instagram.com",
  "whatsapp.com",
  "cloudflare.com",
  "netflix.com",
  "amazon.com",
] as const

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
  return `/status/${encodeURIComponent(site)}`
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
