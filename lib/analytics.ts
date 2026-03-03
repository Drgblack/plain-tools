"use client"

type PlausibleProps = Record<string, string>

type PlausibleFn = (eventName: string, options?: { props?: PlausibleProps }) => void

const getPlausible = (): PlausibleFn | null => {
  if (typeof window === "undefined") {
    return null
  }

  const plausible = (window as Window & { plausible?: PlausibleFn }).plausible
  return typeof plausible === "function" ? plausible : null
}

export function trackEvent(name: string, props?: PlausibleProps) {
  const plausible = getPlausible()
  if (!plausible) {
    return
  }

  plausible(name, { props })
}

