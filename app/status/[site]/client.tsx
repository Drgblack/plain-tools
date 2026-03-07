"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle, Loader2, RefreshCw, AlertTriangle } from "lucide-react"
import type { SiteStatusCheckResult } from "@/lib/site-status"

interface StatusDynamicClientProps {
  site: string
  siteName: string
}

export function StatusDynamicClient({ site, siteName }: StatusDynamicClientProps) {
  const [result, setResult] = useState<SiteStatusCheckResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const checkStatus = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/site-status?site=${encodeURIComponent(site)}`, {
        method: "GET",
        cache: "no-store",
      })
      const data = (await response.json()) as SiteStatusCheckResult
      setResult(data)
    } catch {
      setResult({
        site,
        status: "down",
        responseTimeMs: null,
        checkedAt: new Date().toISOString(),
        httpStatus: null,
        errorMessage: "Status check failed. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }, [site])

  useEffect(() => {
    void checkStatus()
  }, [checkStatus])

  const checkedAtLabel = useMemo(() => {
    if (!result?.checkedAt) return ""
    return new Date(result.checkedAt).toLocaleTimeString()
  }, [result?.checkedAt])

  const statusBlock = (() => {
    if (isLoading && !result) {
      return (
        <div className="flex flex-col items-center justify-center py-8">
          <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
          <p className="mt-3 text-sm text-muted-foreground">Checking {siteName}...</p>
        </div>
      )
    }

    if (!result || isLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-8">
          <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
          <p className="mt-3 text-sm text-muted-foreground">Refreshing status...</p>
        </div>
      )
    }

    if (result.status === "up") {
      return (
        <div className="text-center py-6">
          <CheckCircle2 className="mx-auto h-16 w-16 text-green-500" />
          <p className="mt-4 text-2xl font-semibold text-foreground">Up</p>
          <p className="mt-2 text-sm text-muted-foreground">
            {siteName} is responding normally.
          </p>
          {typeof result.responseTimeMs === "number" && (
            <p className="mt-1 text-sm text-muted-foreground">
              Response time: {result.responseTimeMs}ms
            </p>
          )}
        </div>
      )
    }

    if (result.status === "invalid") {
      return (
        <div className="text-center py-6">
          <AlertTriangle className="mx-auto h-16 w-16 text-amber-500" />
          <p className="mt-4 text-2xl font-semibold text-foreground">Invalid website</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter a valid domain such as chatgpt.com.
          </p>
        </div>
      )
    }

    return (
      <div className="text-center py-6">
        <XCircle className="mx-auto h-16 w-16 text-red-500" />
        <p className="mt-4 text-2xl font-semibold text-foreground">Down</p>
        <p className="mt-2 text-sm text-muted-foreground">
          {siteName} is not responding from the checker endpoint.
        </p>
        {result.errorMessage ? (
          <p className="mt-1 text-sm text-muted-foreground">{result.errorMessage}</p>
        ) : null}
      </div>
    )
  })()

  return (
    <div className="space-y-4">
      {statusBlock}

      {result ? (
        <div className="grid gap-2 text-sm sm:grid-cols-3">
          <div className="rounded-md border border-border/60 bg-card/60 p-3">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">HTTP status</p>
            <p className="mt-1 font-medium text-foreground">{result.httpStatus ?? "N/A"}</p>
          </div>
          <div className="rounded-md border border-border/60 bg-card/60 p-3">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Response time</p>
            <p className="mt-1 font-medium text-foreground">
              {typeof result.responseTimeMs === "number" ? `${result.responseTimeMs} ms` : "N/A"}
            </p>
          </div>
          <div className="rounded-md border border-border/60 bg-card/60 p-3">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Checked at</p>
            <p className="mt-1 font-medium text-foreground">{checkedAtLabel || "N/A"}</p>
          </div>
        </div>
      ) : null}

      <p className="text-xs leading-relaxed text-muted-foreground">
        Status is a practical signal, not a global guarantee. A host can appear up here while local DNS, ISP routing, or firewall rules still block your path.
      </p>

      <div className="flex items-center justify-between border-t border-border pt-4">
        <p className="text-xs text-muted-foreground">
          {result?.checkedAt ? `Last checked: ${checkedAtLabel}` : "Checking..."}
        </p>
        <Button onClick={() => void checkStatus()} variant="outline" size="sm" disabled={isLoading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          Check Again
        </Button>
      </div>
    </div>
  )
}
