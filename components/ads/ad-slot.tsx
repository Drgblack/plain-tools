"use client"

import { useEffect, useRef, useState } from "react"

import { AdPlaceholder } from "@/components/ads/ad-placeholder"
import {
  adsConfig,
  getAdPlacementConfig,
  shouldRenderLiveAd,
  shouldShowAdPlacement,
  type AdPlacement,
} from "@/lib/ads"
import { cn } from "@/lib/utils"

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>> & {
      requestNonPersonalizedAds?: number
    }
  }
}

type AdSlotProps = {
  placement: AdPlacement
  className?: string
}

export function AdSlot({ placement, className }: AdSlotProps) {
  const config = getAdPlacementConfig(placement)
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const insRef = useRef<HTMLElement | null>(null)
  const [isVisible, setIsVisible] = useState(config.priority === "eager")
  const isLiveAd = shouldRenderLiveAd(placement)

  useEffect(() => {
    if (!isLiveAd || config.priority !== "lazy" || isVisible) {
      return
    }

    const element = wrapperRef.current
    if (!element || typeof IntersectionObserver === "undefined") {
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (!entry?.isIntersecting) return
        setIsVisible(true)
        observer.disconnect()
      },
      { rootMargin: "400px 0px" }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [config.priority, isLiveAd, isVisible])

  useEffect(() => {
    if (!isLiveAd || !isVisible || !insRef.current) {
      return
    }

    if (insRef.current.dataset.adsbygoogleStatus === "done") {
      return
    }

    try {
      window.adsbygoogle = window.adsbygoogle || []
      if (!adsConfig.cmpReady) {
        window.adsbygoogle.requestNonPersonalizedAds = 1
      }
      window.adsbygoogle.push({})
    } catch {
      // Keep ad slots non-blocking when the runtime is unavailable.
    }
  }, [isLiveAd, isVisible])

  if (!shouldShowAdPlacement(placement)) {
    return null
  }

  const desktopOnlyClass = config.desktopOnly ? "hidden xl:block" : undefined

  if (!isLiveAd) {
    return <AdPlaceholder placement={placement} className={cn(desktopOnlyClass, className)} />
  }

  return (
    <div
      ref={wrapperRef}
      className={cn(
        "rounded-2xl border border-border/70 bg-card/35 p-4",
        desktopOnlyClass,
        className
      )}
      style={{ minHeight: `${config.minHeight}px` }}
      data-ad-placement={placement}
      data-ad-mode="live"
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        Advertisement
      </p>
      <div className="mt-3 min-h-[inherit] rounded-xl border border-border/60 bg-background/50 p-2">
        {isVisible ? (
          <ins
            ref={insRef}
            className="adsbygoogle block min-h-[inherit] w-full overflow-hidden rounded-lg"
            style={{ display: "block", minHeight: `${Math.max(config.minHeight - 32, 90)}px` }}
            data-ad-client={adsConfig.clientId}
            data-ad-slot={config.slotId}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        ) : (
          <div className="flex min-h-[inherit] items-center justify-center rounded-lg text-xs text-muted-foreground">
            Loading ad slot…
          </div>
        )}
      </div>
    </div>
  )
}
