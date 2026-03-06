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

