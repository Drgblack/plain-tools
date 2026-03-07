import "server-only"

import {
  getStatusHistoryWindow,
  type StatusHistoryPoint,
} from "@/lib/status-trending"

export type OutageIncident = {
  startedAt: string
  endedAt: string | null
  durationMinutes: number
  label: string
  ongoing: boolean
}

type GetOutageIncidentOptions = {
  hours?: number
  limit?: number
}

const DEFAULT_INCIDENT_HOURS = 72
const DEFAULT_INCIDENT_LIMIT = 6

function minutesBetween(startedAt: string, endedAt: string) {
  const startMs = new Date(startedAt).getTime()
  const endMs = new Date(endedAt).getTime()
  if (!Number.isFinite(startMs) || !Number.isFinite(endMs)) return 1
  return Math.max(1, Math.round((endMs - startMs) / 60_000))
}

function buildOutageIncidents(points: StatusHistoryPoint[]): OutageIncident[] {
  const incidents: OutageIncident[] = []
  let activeStart: string | null = null

  for (const point of points) {
    if (point.status === "down") {
      activeStart ??= point.timestamp
      continue
    }

    if (!activeStart) continue

    incidents.push({
      startedAt: activeStart,
      endedAt: point.timestamp,
      durationMinutes: minutesBetween(activeStart, point.timestamp),
      label: "Service unreachable",
      ongoing: false,
    })
    activeStart = null
  }

  if (activeStart) {
    const now = new Date().toISOString()
    incidents.push({
      startedAt: activeStart,
      endedAt: null,
      durationMinutes: minutesBetween(activeStart, now),
      label: "Still failing checks",
      ongoing: true,
    })
  }

  return incidents.reverse()
}

export async function getRecentOutageIncidents(
  domain: string,
  options: GetOutageIncidentOptions = {}
) {
  const hours = options.hours ?? DEFAULT_INCIDENT_HOURS
  const limit = options.limit ?? DEFAULT_INCIDENT_LIMIT
  const window = await getStatusHistoryWindow(domain, { hours })

  if (!window) {
    return null
  }

  return {
    domain: window.domain,
    hours: window.hours,
    incidents: buildOutageIncidents(window.points).slice(0, limit),
  }
}

export function formatOutageDuration(durationMinutes: number) {
  if (durationMinutes < 60) {
    return `${durationMinutes} minute${durationMinutes === 1 ? "" : "s"}`
  }

  const hours = Math.floor(durationMinutes / 60)
  const minutes = durationMinutes % 60
  if (minutes === 0) {
    return `${hours} hour${hours === 1 ? "" : "s"}`
  }

  return `${hours}h ${minutes}m`
}
