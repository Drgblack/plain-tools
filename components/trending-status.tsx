import { TrendingStatusClient } from "@/components/trending-status-client"
import { getStatusTrends } from "@/lib/status-trending"
import type { StatusTrendSegment } from "@/lib/status-domains"

type TrendingStatusVariant =
  | "cloud"
  | "finance"
  | "gaming"
  | "today"
  | "consumer"
  | "developer"
  | "social"
  | "streaming"
  | "saas"

type TrendingStatusProps = {
  title?: string
  limit?: number
  variant?: TrendingStatusVariant
  compact?: boolean
  showDescription?: boolean
  showTopChecksLink?: boolean
}

const VARIANT_TO_SEGMENT: Record<TrendingStatusVariant, StatusTrendSegment> = {
  cloud: "cloud",
  finance: "finance",
  gaming: "gaming",
  today: "all",
  consumer: "consumer",
  developer: "developer",
  social: "social",
  streaming: "streaming",
  saas: "saas",
}

const VARIANT_TITLES: Record<TrendingStatusVariant, string> = {
  cloud: "Trending cloud platform checks",
  finance: "Trending finance platform checks",
  gaming: "Trending gaming platform checks",
  today: "Trending checks today",
  consumer: "Most checked consumer websites",
  developer: "Popular developer service checks",
  social: "Trending social and messaging checks",
  streaming: "Trending streaming status checks",
  saas: "Trending SaaS platform checks",
}

export async function TrendingStatus({
  title,
  limit = 8,
  variant = "today",
  compact = false,
  showDescription = true,
  showTopChecksLink = true,
}: TrendingStatusProps) {
  const segment = VARIANT_TO_SEGMENT[variant]
  const initialItems = await getStatusTrends({ limit, segment })

  return (
    <TrendingStatusClient
      title={title ?? VARIANT_TITLES[variant]}
      limit={limit}
      segment={segment}
      initialItems={initialItems}
      compact={compact}
      showDescription={showDescription}
      showTopChecksLink={showTopChecksLink}
    />
  )
}
