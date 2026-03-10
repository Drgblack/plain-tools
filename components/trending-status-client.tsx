"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { TrendingUp } from "lucide-react"

type TrendItem = {
  domain: string
  count: number
  href: string
  day: string
}

type TrendingStatusClientProps = {
  title: string
  limit: number
  segment:
    | "all"
    | "cloud"
    | "consumer"
    | "developer"
    | "finance"
    | "gaming"
    | "social"
    | "streaming"
    | "saas"
  initialItems: TrendItem[]
  compact?: boolean
  showDescription?: boolean
  showTopChecksLink?: boolean
}

export function TrendingStatusClient({
  title,
  limit,
  segment,
  initialItems,
  compact = false,
  showDescription = true,
  showTopChecksLink = true,
}: TrendingStatusClientProps) {
  const [items, setItems] = useState<TrendItem[]>(initialItems)
  const [isLoading, setIsLoading] = useState(initialItems.length === 0)

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      try {
        const response = await fetch(
          `/api/status-trending?limit=${limit}&segment=${encodeURIComponent(segment)}`,
          { method: "GET", cache: "no-store" }
        )
        const payload = (await response.json().catch(() => null)) as
          | { trends?: TrendItem[] }
          | null
        if (!cancelled && Array.isArray(payload?.trends) && payload.trends.length > 0) {
          setItems(payload.trends)
        }
      } catch {
        // Keep static server-rendered fallback.
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [limit, segment])

  const visibleItems = useMemo(() => items.slice(0, limit), [items, limit])

  return (
    <section className="rounded-xl border border-border/70 bg-card/40 p-4">
      <h2 className="inline-flex items-center gap-2 text-base font-semibold tracking-tight text-foreground">
        <TrendingUp className="h-4 w-4 text-accent" />
        {title}
      </h2>
      {showDescription ? (
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          Anonymous aggregate counts only. We store domain popularity and status-check timestamps,
          never IP addresses, session IDs, or user identifiers.
        </p>
      ) : null}
      {isLoading && visibleItems.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">Loading trending checks...</p>
      ) : (
        <div className={`mt-3 grid gap-2 ${compact ? "sm:grid-cols-1" : "sm:grid-cols-2"}`}>
          {visibleItems.map((item, index) => (
            <Link
              key={item.domain}
              href={item.href}
              className="flex items-center justify-between rounded-md border border-border/60 bg-background/60 px-3 py-2 text-sm text-muted-foreground transition hover:border-accent/40 hover:text-accent"
            >
              <span>
                {index + 1}. Is {item.domain} down?
              </span>
              <span className="text-xs text-muted-foreground">{item.count}</span>
            </Link>
          ))}
        </div>
      )}
      {showTopChecksLink ? (
        <div className="mt-3">
          <Link
            href="/status/trending"
            className="text-xs font-medium text-accent transition hover:underline"
          >
            View top checked domains today
          </Link>
        </div>
      ) : null}
    </section>
  )
}
