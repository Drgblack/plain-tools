import {
  STATUS_CLOUD_DOMAINS,
  STATUS_FINANCE_DOMAINS,
  STATUS_GAMING_DOMAINS,
  STATUS_SOCIAL_DOMAINS,
} from "@/lib/status-domains"

export type StatusTrendingCategory = "social" | "cloud" | "gaming" | "finance"

export const STATUS_TRENDING_CATEGORIES: Array<{
  category: StatusTrendingCategory
  description: string
  label: string
  popularSites: string[]
}> = [
  {
    category: "social",
    description:
      "High-churn consumer platforms where sudden spikes in outage checks create strong same-day search demand.",
    label: "Social Platforms",
    popularSites: STATUS_SOCIAL_DOMAINS.slice(0, 18),
  },
  {
    category: "cloud",
    description:
      "Cloud, hosting, and infrastructure providers where incident traffic can spike from both developers and operations teams.",
    label: "Cloud Platforms",
    popularSites: STATUS_CLOUD_DOMAINS.slice(0, 18),
  },
  {
    category: "gaming",
    description:
      "Gaming networks and launcher ecosystems where login, store, and matchmaking outages produce repeatable long-tail demand.",
    label: "Gaming Platforms",
    popularSites: STATUS_GAMING_DOMAINS.slice(0, 18),
  },
  {
    category: "finance",
    description:
      "Payments, banking, and trading services where downtime has unusually strong urgency and advertiser value.",
    label: "Finance Platforms",
    popularSites: STATUS_FINANCE_DOMAINS.slice(0, 18),
  },
]

export const STATUS_TRENDING_CATEGORY_SET = new Set(
  STATUS_TRENDING_CATEGORIES.map((entry) => entry.category)
)

export function isStatusTrendingCategory(value: string): value is StatusTrendingCategory {
  return STATUS_TRENDING_CATEGORY_SET.has(value as StatusTrendingCategory)
}

export function getStatusTrendingCategoryEntry(category: StatusTrendingCategory) {
  return STATUS_TRENDING_CATEGORIES.find((entry) => entry.category === category) ?? null
}

export function getStatusTrendingPopularSites(
  category: StatusTrendingCategory,
  limit = 12
) {
  const entry = getStatusTrendingCategoryEntry(category)
  if (!entry) return []
  return entry.popularSites.slice(0, limit)
}
