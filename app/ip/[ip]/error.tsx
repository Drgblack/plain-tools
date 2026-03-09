"use client"

import Link from "next/link"
import { AlertTriangle, RefreshCw } from "lucide-react"

import { Surface } from "@/components/surface"
import { Button } from "@/components/ui/button"

export default function IPPageError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <Surface className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <AlertTriangle className="h-6 w-6" />
        </div>

        <h1 className="mt-4 text-2xl font-semibold tracking-tight text-foreground">
          IP lookup is temporarily unavailable
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          The lookup page could not load the current ownership or location data right now. Retry
          the request or continue with the main IP tool while the upstream IP data source recovers.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Button onClick={reset} className="inline-flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Retry lookup
          </Button>
          <Button asChild variant="outline">
            <Link href="/what-is-my-ip">Open What Is My IP</Link>
          </Button>
        </div>

        {error.digest ? (
          <p className="mt-4 text-xs text-muted-foreground">Reference: {error.digest}</p>
        ) : null}
      </Surface>
    </div>
  )
}
