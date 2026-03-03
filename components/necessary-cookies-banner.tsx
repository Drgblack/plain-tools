"use client"

import { useEffect, useState } from "react"
import { X } from "lucide-react"

const BANNER_STORAGE_KEY = "plain-necessary-cookies-banner-dismissed"

export function NecessaryCookiesBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      const dismissed = window.localStorage.getItem(BANNER_STORAGE_KEY)
      if (!dismissed) {
        setVisible(true)
      }
    } catch {
      setVisible(true)
    }
  }, [])

  const dismiss = () => {
    try {
      window.localStorage.setItem(BANNER_STORAGE_KEY, "true")
    } catch {
      // Ignore storage errors and still close the banner.
    }
    setVisible(false)
  }

  if (!visible) {
    return null
  }

  return (
    <div className="fixed inset-x-3 bottom-12 z-40 sm:inset-x-auto sm:bottom-14 sm:right-4 sm:max-w-md">
      <div
        className="rounded-lg border border-border/70 bg-background/95 p-3 shadow-lg backdrop-blur"
        role="status"
        aria-live="polite"
      >
        <div className="flex items-start justify-between gap-3">
          <p className="text-sm leading-relaxed text-foreground">
            Plain uses strictly necessary cookies for authentication and payment processing only.
            No advertising or tracking cookies are used.
          </p>
          <button
            type="button"
            onClick={dismiss}
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Dismiss cookie notice"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
