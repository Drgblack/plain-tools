"use client"

import { useEffect } from "react"
import Script from "next/script"

type AdsensePlaceholderProps = {
  slot: string
  className?: string
  title?: string
}

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>>
  }
}

// Replace NEXT_PUBLIC_ADSENSE_CLIENT_ID and per-page slots before enabling live ads.
const FALLBACK_CLIENT = "ca-pub-XXXXXXXXXXXXXXXX"

export function AdsensePlaceholder({
  slot,
  className,
  title = "Sponsored",
}: AdsensePlaceholderProps) {
  const adClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID?.trim() || FALLBACK_CLIENT
  const hasLiveAdsenseClient = adClient !== FALLBACK_CLIENT

  useEffect(() => {
    if (!hasLiveAdsenseClient) return

    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch {
      // Keep placeholder non-blocking when ad script is unavailable.
    }
  }, [hasLiveAdsenseClient, slot])

  return (
    <section className={className}>
      {hasLiveAdsenseClient ? (
        <Script
          id="adsense-loader"
          strategy="afterInteractive"
          async
          crossOrigin="anonymous"
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adClient}`}
        />
      ) : null}
      <div className="rounded-xl border border-border/70 bg-card/35 p-4 text-center">
        <p className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">{title}</p>
        <ins
          className="adsbygoogle mt-2 block min-h-[90px] rounded-lg border border-dashed border-border/80 bg-background/70"
          style={{ display: "block" }}
          data-ad-client={adClient}
          data-ad-slot={slot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
        <p className="mt-2 text-xs text-muted-foreground">
          Ad slot placeholder for AdSense readiness on content hubs.
        </p>
      </div>
    </section>
  )
}

