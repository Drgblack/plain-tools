"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

type SsrContentDebugProps = {
  enabled?: boolean
  minTextLength?: number
  routeId?: string
  selector?: string
}

/**
 * Debug helper for catching pages that hydrate into a shell with no meaningful
 * server-rendered text. That pattern is a common indexing killer because the
 * initial HTML looks empty to crawlers until client code runs.
 */
export function SsrContentDebug({
  enabled,
  minTextLength = 300,
  routeId,
  selector = "[data-plain-ssr-content]",
}: SsrContentDebugProps) {
  const pathname = usePathname()

  useEffect(() => {
    const shouldWarn =
      enabled ??
      (process.env.NODE_ENV !== "production" ||
        window.location.search.includes("debug-ssr=1"))

    if (!shouldWarn) {
      return
    }

    const nodes = Array.from(document.querySelectorAll<HTMLElement>(selector))
    const textLength = nodes.reduce((total, node) => {
      return total + (node.textContent?.replace(/\s+/g, " ").trim().length ?? 0)
    }, 0)

    if (textLength < minTextLength) {
      console.warn(
        `[SSR Debug] Possible client-only shell detected for ${routeId ?? pathname}. SSR text length: ${textLength}.`
      )
    }
  }, [enabled, minTextLength, pathname, routeId, selector])

  return null
}
