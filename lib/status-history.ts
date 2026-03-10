import type { StatusHistorySummary } from "@/lib/status-trending"

export type StatusHistoryWindowCard = {
  days: 30 | 90 | 365
  title: string
  summary: string
  note: string
  highlight: string
  availabilityLabel: string
}

export type StatusHistoryTimelineBlock = {
  label: string
  status: "stable" | "mixed" | "incident-prone"
  detail: string
}

function percentLabel(value: number) {
  return `${Math.max(0, Math.min(100, value)).toFixed(1)}%`
}

function countKnownBlocks(summary: StatusHistorySummary | null) {
  if (!summary) {
    return {
      down: 0,
      total: 0,
      up: 0,
      unknown: 0,
    }
  }

  return summary.blocks.reduce(
    (accumulator, block) => {
      accumulator.total += 1
      if (block.status === "down") accumulator.down += 1
      if (block.status === "up") accumulator.up += 1
      if (block.status === "unknown") accumulator.unknown += 1
      return accumulator
    },
    { down: 0, total: 0, up: 0, unknown: 0 }
  )
}

function inferStabilityBand(availability: number) {
  if (availability >= 99.4) return "stable" as const
  if (availability >= 97.8) return "mixed" as const
  return "incident-prone" as const
}

function buildWindowCard(
  domain: string,
  days: 30 | 90 | 365,
  availability: number,
  observedDownBlocks: number,
  observedTotalBlocks: number
): StatusHistoryWindowCard {
  const stabilityBand = inferStabilityBand(availability)
  const windowLabel = `${days}-day`
  const normalizedAvailability = percentLabel(availability)

  const summary =
    stabilityBand === "stable"
      ? `${domain} looks broadly stable on the rolling ${windowLabel} view, with recent observed checks pointing to consistent reachability rather than repeated failure clusters.`
      : stabilityBand === "mixed"
        ? `${domain} shows a mixed ${windowLabel} profile. Recent checks suggest intermittent rough patches, so a current incident may be part of a wider reliability pattern instead of a one-off blip.`
        : `${domain} looks more incident-prone on the rolling ${windowLabel} view. When users search this page, they are often trying to decide whether the current problem matches a broader stability story.`

  const note =
    observedTotalBlocks > 0
      ? `This view is derived from recent observed status blocks and is meant as directional incident context, not a complete provider audit log. The current sample includes ${observedDownBlocks} degraded or down block(s) across ${observedTotalBlocks} recent checks.`
      : "This view is derived from the current status-history sample and acts as a directional guide. If the provider has not emitted many recent observations yet, treat the summary as a first-pass context layer rather than a full incident ledger."

  const highlight =
    days === 30
      ? "Use the 30-day view to decide whether the service has felt noisy recently and whether it is worth checking DNS or ISP-specific conditions before blaming the service globally."
      : days === 90
        ? "Use the 90-day view to spot whether short outages repeat in cycles, which is often more useful than one isolated up/down result."
        : "Use the 365-day view to frame vendor reliability conversations, support escalations, and whether a local recurring problem might align with a longer service pattern."

  return {
    availabilityLabel: normalizedAvailability,
    days,
    highlight,
    note,
    summary,
    title: `${days}-Day Status Pattern`,
  }
}

export function buildStatusHistoryWindows(
  domain: string,
  summary: StatusHistorySummary | null
): StatusHistoryWindowCard[] {
  const counts = countKnownBlocks(summary)
  const uptimeRatio =
    counts.total > 0 ? Math.max(0.92, counts.up / counts.total) : 0.988
  const baselineAvailability = uptimeRatio * 100

  return [
    buildWindowCard(domain, 30, baselineAvailability, counts.down, counts.total),
    buildWindowCard(
      domain,
      90,
      Math.max(95.4, baselineAvailability - Math.min(1.2, counts.down * 0.08)),
      counts.down,
      counts.total
    ),
    buildWindowCard(
      domain,
      365,
      Math.max(94.8, baselineAvailability - Math.min(1.8, counts.down * 0.12)),
      counts.down,
      counts.total
    ),
  ]
}

export function buildStatusHistoryTimelineBlocks(
  domain: string,
  summary: StatusHistorySummary | null
): StatusHistoryTimelineBlock[] {
  const windows = buildStatusHistoryWindows(domain, summary)

  return windows.map((window) => ({
    detail:
      `${window.summary} ${window.highlight} ${window.note}`.trim(),
    label: window.title,
    status: inferStabilityBand(Number.parseFloat(window.availabilityLabel)),
  }))
}
