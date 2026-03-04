"use client"

import { useState, useEffect } from "react"

// Custom Zero-Tracking icon - circle with slash through cookie shape
function ZeroTrackingIcon({ className }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      className={className}
      aria-hidden="true"
    >
      {/* Cookie base shape */}
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.6" />
      {/* Cookie chips */}
      <circle cx="9" cy="9" r="1.2" fill="currentColor" fillOpacity="0.4" />
      <circle cx="14" cy="11" r="1" fill="currentColor" fillOpacity="0.4" />
      <circle cx="10" cy="14" r="1.1" fill="currentColor" fillOpacity="0.4" />
      {/* Prohibition slash */}
      <line x1="5" y1="19" x2="19" y2="5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export function CookieFreeBanner() {
  const [isVisible, setIsVisible] = useState(false)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    // Check if user has already dismissed the banner
    const dismissed = localStorage.getItem("plain-cookie-banner-dismissed")
    if (!dismissed) {
      // Small delay before showing for smoother UX
      const timer = setTimeout(() => setIsVisible(true), 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleDismiss = () => {
    setIsExiting(true)
    // Wait for fade-out animation to complete
    setTimeout(() => {
      setIsVisible(false)
      localStorage.setItem("plain-cookie-banner-dismissed", "true")
    }, 300)
  }

  if (!isVisible) return null

  return (
    <div 
      className={`fixed bottom-14 right-4 z-40 max-w-sm transition-all duration-300 ease-out ${
        isExiting 
          ? "opacity-0 translate-y-2" 
          : "opacity-100 translate-y-0"
      }`}
      role="dialog"
      aria-labelledby="cookie-banner-heading"
      aria-describedby="cookie-banner-description"
    >
      <div className="relative overflow-hidden rounded-lg border border-accent/40 bg-[#111]/95 p-5 shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-md">
        {/* Subtle gradient overlay for glassmorphism depth */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent" />
        
        <div className="relative">
          {/* Header with icon */}
          <div className="mb-3 flex items-center justify-between">
            <h3 
              id="cookie-banner-heading"
              className="font-sans text-[15px] font-semibold tracking-tight text-foreground"
            >
              Cookie-Free by Design.
            </h3>
            <div className="flex items-center gap-1.5">
              <ZeroTrackingIcon className="h-4 w-4 text-accent" />
              <span className="font-mono text-[10px] font-medium uppercase tracking-wider text-accent/80">
                Zero-Tracking
              </span>
            </div>
          </div>
          
          {/* Body text */}
          <p 
            id="cookie-banner-description"
            className="mb-4 text-[12px] leading-relaxed text-muted-foreground/80"
          >
            Plain does not use tracking cookies, analytics, or third-party scripts. 
            Your session is entirely private, and your data remains on your device. 
            Privacy is not a setting here; it is our architecture.
          </p>
          
          {/* Ghost button */}
          <button
            onClick={handleDismiss}
            className="w-full rounded-md border border-white/[0.12] bg-transparent px-4 py-2 text-[13px] font-medium text-foreground/90 transition-all duration-200 hover:border-accent/40 hover:bg-white/[0.04] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#111]"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  )
}
