export type StatusQueryPage = {
  slug: string
  domain: string
  name: string
}

export const STATUS_QUERY_PAGES: StatusQueryPage[] = [
  { slug: "chatgpt", domain: "chatgpt.com", name: "ChatGPT" },
  { slug: "discord", domain: "discord.com", name: "Discord" },
  { slug: "youtube", domain: "youtube.com", name: "YouTube" },
  { slug: "reddit", domain: "reddit.com", name: "Reddit" },
  { slug: "github", domain: "github.com", name: "GitHub" },
  { slug: "netflix", domain: "netflix.com", name: "Netflix" },
  { slug: "spotify", domain: "spotify.com", name: "Spotify" },
  { slug: "openai", domain: "openai.com", name: "OpenAI" },
  { slug: "stripe", domain: "stripe.com", name: "Stripe" },
  { slug: "slack", domain: "slack.com", name: "Slack" },
]

export const STATUS_QUERY_PAGE_BY_SLUG = new Map(
  STATUS_QUERY_PAGES.map((entry) => [entry.slug, entry])
)

export function getStatusQueryPageBySlug(slug: string) {
  return STATUS_QUERY_PAGE_BY_SLUG.get(slug.toLowerCase()) ?? null
}

export function statusQueryPathForSlug(slug: string) {
  return `/is-${slug.toLowerCase()}-down`
}
