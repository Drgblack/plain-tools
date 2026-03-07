import { normalizeSiteInput } from "@/lib/site-status"

export type OutageHistoryPage = {
  slug: string
  domain: string
  name: string
}

export const OUTAGE_HISTORY_PAGES: OutageHistoryPage[] = [
  { slug: "chatgpt", domain: "chatgpt.com", name: "ChatGPT" },
  { slug: "discord", domain: "discord.com", name: "Discord" },
  { slug: "youtube", domain: "youtube.com", name: "YouTube" },
  { slug: "reddit", domain: "reddit.com", name: "Reddit" },
  { slug: "github", domain: "github.com", name: "GitHub" },
  { slug: "netflix", domain: "netflix.com", name: "Netflix" },
  { slug: "spotify", domain: "spotify.com", name: "Spotify" },
  { slug: "stripe", domain: "stripe.com", name: "Stripe" },
  { slug: "slack", domain: "slack.com", name: "Slack" },
  { slug: "openai", domain: "openai.com", name: "OpenAI" },
]

const OUTAGE_HISTORY_PAGE_BY_SLUG = new Map(
  OUTAGE_HISTORY_PAGES.map((entry) => [entry.slug, entry])
)

const OUTAGE_HISTORY_PAGE_BY_DOMAIN = new Map(
  OUTAGE_HISTORY_PAGES.map((entry) => [entry.domain, entry])
)

export function getOutageHistoryPageBySlug(slug: string) {
  return OUTAGE_HISTORY_PAGE_BY_SLUG.get(slug.toLowerCase()) ?? null
}

export function getOutageHistoryPageByDomain(domain: string) {
  const normalized = normalizeSiteInput(domain)
  if (!normalized) return null
  return OUTAGE_HISTORY_PAGE_BY_DOMAIN.get(normalized) ?? null
}

export function outageHistoryPathForSlug(slug: string) {
  return `/${slug.toLowerCase()}-outage-history`
}

export function outageHistoryPathForDomain(domain: string) {
  const entry = getOutageHistoryPageByDomain(domain)
  return entry ? outageHistoryPathForSlug(entry.slug) : null
}

export function getRelatedOutageHistoryPages(slug: string, limit = 5) {
  return OUTAGE_HISTORY_PAGES.filter((entry) => entry.slug !== slug.toLowerCase()).slice(0, limit)
}
