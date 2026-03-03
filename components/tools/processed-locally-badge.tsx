"use client"

import { CheckCircle2 } from "lucide-react"
import { useEffect, useState } from "react"

import { cn } from "@/lib/utils"

type ProcessedLocallyBadgeProps = {
  className?: string
}

export function ProcessedLocallyBadge({ className }: ProcessedLocallyBadgeProps) {
  const [isPulsing, setIsPulsing] = useState(true)

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setIsPulsing(false)
    }, 1200)
    return () => {
      window.clearTimeout(timeout)
    }
  }, [])

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300",
        isPulsing ? "animate-pulse" : "",
        className
      )}
    >
      <CheckCircle2 className="h-3.5 w-3.5" />
      Processed locally - no upload
    </div>
  )
}

