import { getStatusOutageHistoryPaths, getStatusTrendingPaths } from "@/lib/status-extensions"
import { getStatusIspPaths, getStatusRegionPaths, POPULAR_STATUS_TLDS } from "@/lib/status-regions"
import { STATUS_TRENDING_CATEGORIES } from "@/lib/status-trends-full"

export const STATUS_RPM_TRENDING_CATEGORIES = STATUS_TRENDING_CATEGORIES
export const STATUS_RPM_TLDS = POPULAR_STATUS_TLDS

export const STATUS_RPM_PRIORITY_SEGMENTS = [
  "finance",
  "finance-banking",
  "banking",
  "payments",
  "neobanks",
  "brokerage-trading",
  "crypto-wallets",
  "ai-tools",
  "ai-enterprise",
  "cloud",
  "cloud-infra",
  "cloud-hosting",
  "streaming-services",
  "gaming-servers",
  "vpn-services",
] as const

const PRIORITY_SEGMENT_SET = new Set<string>(STATUS_RPM_PRIORITY_SEGMENTS)

export function getStatusRpmRolloutSummary() {
  return {
    prioritySegments: STATUS_RPM_PRIORITY_SEGMENTS.length,
    tlds: STATUS_RPM_TLDS.length,
    totalSegments: STATUS_RPM_TRENDING_CATEGORIES.length,
  }
}

export function getStatusRpmRolloutPaths(limit = 3200) {
  const trending = getStatusTrendingPaths()
  const prioritizedTrending = [
    ...trending.filter((path) =>
      PRIORITY_SEGMENT_SET.has(path.replace("/status/trending-", ""))
    ),
    ...trending.filter(
      (path) => !PRIORITY_SEGMENT_SET.has(path.replace("/status/trending-", ""))
    ),
  ]

  const staged = [
    ...prioritizedTrending,
    ...getStatusOutageHistoryPaths().slice(0, 350),
    ...getStatusRegionPaths().slice(0, 2400),
    ...getStatusIspPaths().slice(0, 450),
  ]

  return Array.from(new Set(staged)).slice(0, limit)
}
