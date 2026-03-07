import { normalizeSiteInput, statusPathFor } from "@/lib/site-status"
import { STATUS_TRENDING_DEFAULT } from "@/lib/status-domains"

type TrendingEntry = {
  domain: string
  count: number
  href: string
}

const MAX_TRACKED_DOMAINS = 5000
const trendingCounts = new Map<string, number>(
  STATUS_TRENDING_DEFAULT.map((domain, index) => [domain, 60 - index * 5])
)

export function incrementStatusTrend(input: string) {
  const normalized = normalizeSiteInput(input)
  if (!normalized) return null

  if (!trendingCounts.has(normalized) && trendingCounts.size >= MAX_TRACKED_DOMAINS) {
    return normalized
  }

  const current = trendingCounts.get(normalized) ?? 0
  trendingCounts.set(normalized, current + 1)
  return normalized
}

export function getStatusTrends(limit = 10): TrendingEntry[] {
  return Array.from(trendingCounts.entries())
    .sort((left, right) => right[1] - left[1])
    .slice(0, Math.max(1, limit))
    .map(([domain, count]) => ({
      domain,
      count,
      href: statusPathFor(domain),
    }))
}
