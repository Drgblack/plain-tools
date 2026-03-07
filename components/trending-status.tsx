"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { TrendingUp } from "lucide-react"

type TrendItem = {
  domain: string
  count: number
  href: string
}

type TrendingStatusProps = {
  title?: string
  limit?: number
}

export function TrendingStatus({
  title = "Trending checks today",
  limit = 8,
}: TrendingStatusProps) {
  const [items, setItems] = useState<TrendItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      try {
        const response = await fetch(`/api/status-trending?limit=${limit}`, {
          method: "GET",
          cache: "no-store",
        })
        const payload = (await response.json().catch(() => null)) as { trends?: TrendItem[] } | null
        if (!cancelled) {
          setItems(Array.isArray(payload?.trends) ? payload.trends : [])
        }
      } catch {
        if (!cancelled) {
          setItems([])
        }
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
  }, [limit])

  const visibleItems = useMemo(() => items.slice(0, limit), [items, limit])

  return (
    <section className="rounded-xl border border-border/70 bg-card/40 p-4">
      <h2 className="inline-flex items-center gap-2 text-base font-semibold tracking-tight text-foreground">
        <TrendingUp className="h-4 w-4 text-accent" />
        {title}
      </h2>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
        Counts are aggregate and privacy-safe. We only store domain and check count, with no IP addresses or user identifiers.
      </p>
      {isLoading ? (
        <p className="mt-3 text-sm text-muted-foreground">Loading trending checks...</p>
      ) : (
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {visibleItems.map((item) => (
            <Link
              key={item.domain}
              href={item.href}
              className="flex items-center justify-between rounded-md border border-border/60 bg-background/60 px-3 py-2 text-sm text-muted-foreground transition hover:border-accent/40 hover:text-accent"
            >
              <span>Is {item.domain} down?</span>
              <span className="text-xs text-muted-foreground">{item.count}</span>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}
