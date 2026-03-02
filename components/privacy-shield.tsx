"use client"

import { Shield } from "lucide-react"

export function PrivacyShield() {
  return (
    <div data-tour="privacy-shield" className="flex items-center gap-2 rounded-full bg-[oklch(0.14_0.006_250/0.9)] px-3 py-1.5 ring-1 ring-white/[0.08] backdrop-blur-sm">
      <div className="relative flex items-center justify-center">
        <span className="status-dot-active h-2 w-2 rounded-full bg-[oklch(0.7_0.2_145)]" />
      </div>
      <div className="flex items-center gap-1.5">
        <Shield className="h-3 w-3 text-[oklch(0.7_0.2_145)]" strokeWidth={2} />
        <span className="text-[11px] font-medium text-foreground/70">Client-Side Processing Active</span>
      </div>
    </div>
  )
}
