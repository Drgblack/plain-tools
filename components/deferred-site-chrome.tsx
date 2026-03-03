"use client"

import dynamic from "next/dynamic"
import { useEffect, useState } from "react"

const SystemStatusBar = dynamic(
  () => import("@/components/system-status-bar").then((mod) => mod.SystemStatusBar),
  { ssr: false }
)

export function DeferredSiteChrome() {
  const [showChrome, setShowChrome] = useState(false)

  useEffect(() => {
    let timeoutId: number | null = null
    const activate = () => {
      timeoutId = window.setTimeout(() => setShowChrome(true), 4000)
    }

    if (document.readyState === "complete") {
      activate()
    } else {
      window.addEventListener("load", activate, { once: true })
    }

    return () => {
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId)
      }
      window.removeEventListener("load", activate)
    }
  }, [])

  if (!showChrome) {
    return null
  }

  return (
    <>
      <SystemStatusBar />
    </>
  )
}
