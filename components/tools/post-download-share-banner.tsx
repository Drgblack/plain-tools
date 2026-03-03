"use client"

import Link from "next/link"
import { CheckCircle2, Share2 } from "lucide-react"
import { useEffect, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import { trackEvent } from "@/lib/analytics"
import { LOCAL_DOWNLOAD_SUCCESS_EVENT } from "@/lib/local-download-events"

const SESSION_KEY = "plain-share-banner-shown"
const AUTO_DISMISS_MS = 8_000
const SHARE_TEXT =
  "I just processed a PDF entirely in my browser with Plain. No upload occurred. https://plain.tools"

export function PostDownloadShareBanner() {
  const rootRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const showBanner = () => {
      if (typeof window === "undefined") {
        return
      }

      const alreadyShown = window.sessionStorage.getItem(SESSION_KEY)
      if (alreadyShown === "1") {
        return
      }

      window.sessionStorage.setItem(SESSION_KEY, "1")
      setIsVisible(true)
    }

    const onClick = (event: MouseEvent) => {
      const target = event.target
      if (!(target instanceof Element)) {
        return
      }

      const anchor = target.closest("a[download]")
      if (anchor) {
        showBanner()
      }
    }

    window.addEventListener(LOCAL_DOWNLOAD_SUCCESS_EVENT, showBanner)
    document.addEventListener("click", onClick, true)

    return () => {
      window.removeEventListener(LOCAL_DOWNLOAD_SUCCESS_EVENT, showBanner)
      document.removeEventListener("click", onClick, true)
    }
  }, [])

  useEffect(() => {
    if (!isVisible) {
      return
    }

    const timeout = window.setTimeout(() => {
      setIsVisible(false)
    }, AUTO_DISMISS_MS)

    return () => {
      window.clearTimeout(timeout)
    }
  }, [isVisible])

  useEffect(() => {
    if (!isVisible) {
      return
    }

    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current) {
        return
      }

      const target = event.target
      if (!(target instanceof Node)) {
        return
      }

      if (!rootRef.current.contains(target)) {
        setIsVisible(false)
      }
    }

    document.addEventListener("pointerdown", onPointerDown)
    return () => {
      document.removeEventListener("pointerdown", onPointerDown)
    }
  }, [isVisible])

  if (!isVisible) {
    return null
  }

  return (
    <div className="pointer-events-none fixed bottom-4 left-4 right-4 z-50 sm:left-auto sm:max-w-md">
      <div
        ref={rootRef}
        className="pointer-events-auto rounded-xl border border-emerald-500/40 bg-background/95 p-3 shadow-xl backdrop-blur"
      >
        <p className="flex items-start gap-2 text-sm text-foreground">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
          <span>Done - processed entirely in your browser. No upload occurred.</span>
        </p>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="w-full sm:w-auto"
            onClick={async () => {
              trackEvent("Share Click", { location: "post-download" })
              try {
                await navigator.clipboard.writeText(SHARE_TEXT)
                setCopied(true)
                window.setTimeout(() => setCopied(false), 1400)
              } catch {
                setCopied(false)
              }
            }}
          >
            <Share2 className="h-3.5 w-3.5" />
            {copied ? "Copied" : "Share Plain"}
          </Button>
          <Button asChild variant="outline" size="sm" className="w-full sm:w-auto">
            <Link href="/verify-claims">Verify this yourself</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
