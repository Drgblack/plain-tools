"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle, Loader2, RefreshCw } from "lucide-react"

interface StatusDynamicClientProps {
  site: string
  siteName: string
}

type Status = "loading" | "up" | "down"

export function StatusDynamicClient({ site, siteName }: StatusDynamicClientProps) {
  const [status, setStatus] = useState<Status>("loading")
  const [responseTime, setResponseTime] = useState<number | null>(null)
  const [checkedAt, setCheckedAt] = useState<Date | null>(null)

  useEffect(() => {
    checkStatus()
  }, [site])

  const checkStatus = () => {
    setStatus("loading")
    // Placeholder - would be replaced with actual status check
    setTimeout(() => {
      // Simulate mostly up, occasionally down
      const isUp = Math.random() > 0.1
      setStatus(isUp ? "up" : "down")
      setResponseTime(isUp ? Math.floor(Math.random() * 200) + 50 : null)
      setCheckedAt(new Date())
    }, 1000)
  }

  return (
    <div className="space-y-4">
      {status === "loading" ? (
        <div className="flex flex-col items-center justify-center py-8">
          <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
          <p className="mt-3 text-sm text-muted-foreground">Checking {siteName}...</p>
        </div>
      ) : status === "up" ? (
        <div className="text-center py-6">
          <CheckCircle2 className="mx-auto h-16 w-16 text-green-500" />
          <p className="mt-4 text-2xl font-semibold text-foreground">
            {siteName} is Up
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            The site is responding normally
          </p>
          {responseTime && (
            <p className="mt-1 text-sm text-muted-foreground">
              Response time: {responseTime}ms
            </p>
          )}
        </div>
      ) : (
        <div className="text-center py-6">
          <XCircle className="mx-auto h-16 w-16 text-red-500" />
          <p className="mt-4 text-2xl font-semibold text-foreground">
            {siteName} is Down
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            The site is not responding or returned an error
          </p>
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground">
          {checkedAt ? `Last checked: ${checkedAt.toLocaleTimeString()}` : "Checking..."}
        </p>
        <Button 
          onClick={checkStatus} 
          variant="outline" 
          size="sm"
          disabled={status === "loading"}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${status === "loading" ? "animate-spin" : ""}`} />
          Check Again
        </Button>
      </div>
    </div>
  )
}
