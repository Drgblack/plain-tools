"use client"

import { useEffect, useMemo, useState } from "react"

type StatusHistoryStatus = "up" | "down" | "unknown"

type StatusHistoryBlock = {
  bucketStart: string
  label: string
  status: StatusHistoryStatus
  responseTimeMs: number | null
  checkedAt: string | null
}

type StatusHistoryPoint = {
  domain: string
  timestamp: string
  status: StatusHistoryStatus
  responseTimeMs?: number
}

type StatusHistorySummary = {
  domain: string
  hours: number
  blocks: StatusHistoryBlock[]
  recentChecks: StatusHistoryPoint[]
  lastUpdatedAt: string | null
}

type StatusHistoryClientProps = {
  domain: string
  initialSummary: StatusHistorySummary | null
}

function blockClassName(status: StatusHistoryStatus) {
  if (status === "up") {
    return "border-emerald-500/40 bg-emerald-500/70"
  }
  if (status === "down") {
    return "border-rose-500/40 bg-rose-500/70"
  }
  return "border-border/60 bg-muted/40"
}

function statusLabel(status: StatusHistoryStatus) {
  if (status === "up") return "Up"
  if (status === "down") return "Down"
  return "Unknown"
}

export function StatusHistoryClient({ domain, initialSummary }: StatusHistoryClientProps) {
  const [summary, setSummary] = useState<StatusHistorySummary | null>(initialSummary)
  const [isLoading, setIsLoading] = useState(initialSummary === null)

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      try {
        const response = await fetch(
          `/api/status-history?domain=${encodeURIComponent(domain)}&hours=24&recentLimit=8`,
          {
            method: "GET",
            cache: "no-store",
          }
        )
        const payload = (await response.json().catch(() => null)) as
          | { history?: StatusHistorySummary }
          | null
        if (!cancelled && payload?.history) {
          setSummary(payload.history)
        }
      } catch {
        // Keep initial server-rendered fallback.
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [domain])

  const blocks = summary?.blocks ?? []
  const recentChecks = summary?.recentChecks ?? []

  const lastCheckedLabel = useMemo(() => {
    if (!summary?.lastUpdatedAt) return "No recent checks yet"
    return `Last check: ${new Date(summary.lastUpdatedAt).toLocaleString()}`
  }, [summary?.lastUpdatedAt])

  return (
    <section className="rounded-xl border border-border/70 bg-card/40 p-4">
      <h2 className="text-base font-semibold tracking-tight text-foreground">
        Recent checks over the last 24 hours
      </h2>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
        A red block means the site appeared unreachable during that check. This does not always
        mean a global outage.
      </p>
      <p className="mt-1 text-xs text-muted-foreground">{lastCheckedLabel}</p>

      {isLoading && blocks.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">Loading history...</p>
      ) : (
        <div className="mt-3 grid grid-cols-12 gap-1">
          {blocks.map((block) => (
            <div
              key={block.bucketStart}
              className={`h-4 rounded-sm border ${blockClassName(block.status)}`}
              title={`${block.label} - ${statusLabel(block.status)}${
                typeof block.responseTimeMs === "number"
                  ? ` (${block.responseTimeMs} ms)`
                  : ""
              }`}
              aria-label={`${block.label} ${statusLabel(block.status)}`}
            />
          ))}
        </div>
      )}

      <div className="mt-4 grid gap-2 text-xs text-muted-foreground sm:grid-cols-3">
        <div className="inline-flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm border border-emerald-500/40 bg-emerald-500/70" />
          Up
        </div>
        <div className="inline-flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm border border-rose-500/40 bg-rose-500/70" />
          Down
        </div>
        <div className="inline-flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm border border-border/60 bg-muted/40" />
          Unknown / no check
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-sm font-semibold text-foreground">Latest checks</h3>
        {recentChecks.length === 0 ? (
          <p className="mt-2 text-xs text-muted-foreground">
            No recent check data yet. Use “Check Again” to generate a fresh entry.
          </p>
        ) : (
          <ul className="mt-2 space-y-1.5 text-xs text-muted-foreground">
            {recentChecks.map((item) => (
              <li
                key={`${item.timestamp}-${item.status}`}
                className="flex items-center justify-between rounded-md border border-border/60 bg-background/60 px-2 py-1.5"
              >
                <span>{new Date(item.timestamp).toLocaleTimeString()}</span>
                <span className="font-medium text-foreground">{statusLabel(item.status)}</span>
                <span>
                  {typeof item.responseTimeMs === "number" ? `${item.responseTimeMs} ms` : "n/a"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
