import { StatusHistoryClient } from "@/components/status-history-client"
import { getStatusHistorySummary } from "@/lib/status-trending"

type StatusHistoryProps = {
  domain: string
}

export async function StatusHistory({ domain }: StatusHistoryProps) {
  const initialSummary = await getStatusHistorySummary(domain, {
    hours: 24,
    recentLimit: 8,
  })

  return <StatusHistoryClient domain={domain} initialSummary={initialSummary} />
}
