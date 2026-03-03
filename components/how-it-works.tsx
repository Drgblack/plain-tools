"use client"

import { useEffect, useState } from "react"

const steps = [
  {
    number: "1",
    title: "Open a tool",
    description: "Choose what you want to do. No setup required.",
  },
  {
    number: "2",
    title: "Select your files",
    description: "Files stay on your device at all times.",
  },
  {
    number: "3",
    title: "Download the result",
    description: "Your processed PDF is generated locally in your browser.",
  },
]

// Horizontal arrow connector for tablet/desktop (between steps)
function HorizontalConnector({ index }: { index: number }) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    setPrefersReducedMotion(mediaQuery.matches)
  }, [])

  // Calculate animation delay based on index for sequential flow
  const pulseDelay = index * 1.8 // Stagger so pulse travels 1 -> 2 -> 3

  return (
    <div className="absolute top-7 left-full hidden w-12 -translate-x-1 sm:block md:w-16" style={{ zIndex: 0 }}>
      <svg 
        viewBox="0 0 64 16" 
        className="w-full h-4 overflow-visible"
        aria-hidden="true"
      >
        <defs>
          {/* Glow filter for the traveling pulse */}
          <filter id={`pulse-glow-${index}`} x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* Radial gradient for the electron/pulse */}
          <radialGradient id={`electron-gradient-${index}`}>
            <stop offset="0%" stopColor="rgb(140, 170, 255)" stopOpacity="0.9" />
            <stop offset="50%" stopColor="rgb(99, 133, 255)" stopOpacity="0.6" />
            <stop offset="100%" stopColor="rgb(99, 133, 255)" stopOpacity="0" />
          </radialGradient>
        </defs>
        
        {/* Base line - thin and subtle */}
        <line 
          x1="4" 
          y1="8" 
          x2="52" 
          y2="8" 
          stroke="rgb(99, 133, 255)" 
          strokeWidth="1"
          strokeOpacity="0.2"
        />
        
        {/* Arrowhead - thin stroke */}
        <polyline 
          points="48,4 54,8 48,12" 
          fill="none" 
          stroke="rgb(99, 133, 255)" 
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeOpacity="0.25"
        />
        
        {/* Traveling electron/pulse - continuous animation */}
        {!prefersReducedMotion && (
          <>
            {/* Glow trail */}
            <circle
              r="6"
              fill={`url(#electron-gradient-${index})`}
              filter={`url(#pulse-glow-${index})`}
              opacity="0.2"
            >
              <animateMotion
                dur="3.6s"
                repeatCount="indefinite"
                begin={`${pulseDelay}s`}
                keyPoints="0;1"
                keyTimes="0;1"
                calcMode="spline"
                keySplines="0.4 0 0.2 1"
              >
                <mpath href={`#electron-path-${index}`} />
              </animateMotion>
              <animate
                attributeName="opacity"
                values="0;0.2;0.2;0"
                keyTimes="0;0.1;0.85;1"
                dur="3.6s"
                repeatCount="indefinite"
                begin={`${pulseDelay}s`}
              />
            </circle>
            
            {/* Bright center of electron */}
            <circle
              r="2.5"
              fill="rgb(140, 170, 255)"
              opacity="0"
            >
              <animateMotion
                dur="3.6s"
                repeatCount="indefinite"
                begin={`${pulseDelay}s`}
                keyPoints="0;1"
                keyTimes="0;1"
                calcMode="spline"
                keySplines="0.4 0 0.2 1"
              >
                <mpath href={`#electron-path-${index}`} />
              </animateMotion>
              <animate
                attributeName="opacity"
                values="0;0.7;0.7;0"
                keyTimes="0;0.1;0.85;1"
                dur="3.6s"
                repeatCount="indefinite"
                begin={`${pulseDelay}s`}
              />
            </circle>
            
            {/* Inner bright core */}
            <circle
              r="1"
              fill="white"
              opacity="0"
            >
              <animateMotion
                dur="3.6s"
                repeatCount="indefinite"
                begin={`${pulseDelay}s`}
                keyPoints="0;1"
                keyTimes="0;1"
                calcMode="spline"
                keySplines="0.4 0 0.2 1"
              >
                <mpath href={`#electron-path-${index}`} />
              </animateMotion>
              <animate
                attributeName="opacity"
                values="0;0.5;0.5;0"
                keyTimes="0;0.1;0.85;1"
                dur="3.6s"
                repeatCount="indefinite"
                begin={`${pulseDelay}s`}
              />
            </circle>
          </>
        )}
        
        {/* Path for the electron to follow */}
        <path id={`electron-path-${index}`} d="M4,8 L54,8" fill="none" />
      </svg>
    </div>
  )
}

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative px-4 pt-40 pb-36 md:pt-52 md:pb-48">
      {/* Top gradient divider */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
      <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-white/[0.01] to-transparent" />
      
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center gap-3">
          <div className="animate-accent-line h-6 w-1 rounded-full bg-accent" />
          <h2 className="text-2xl font-semibold tracking-tight text-foreground leading-tight">
            How Plain Works
          </h2>
        </div>
        
        <div className="mt-12 flex flex-col gap-10 sm:flex-row sm:gap-8">
          {steps.map((step, index) => (
            <div 
              key={step.number} 
              className="group relative flex flex-1 flex-col"
            >
              {/* Step circle */}
              <div
                className="relative z-10 mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-accent/16 text-base font-bold text-accent ring-2 ring-accent/40 transition-all duration-200 group-hover:bg-accent/22 group-hover:ring-accent/50 sm:h-14 sm:w-14 sm:text-[17px]"
              >
                <span aria-hidden="true">{step.number}</span>
                <span className="sr-only">{`Step ${step.number}`}</span>
              </div>

              {/* Connector hidden on mobile when steps are stacked */}
              {index < steps.length - 1 && (
                <HorizontalConnector index={index} />
              )}

              <h3 className="text-[15px] font-semibold tracking-tight text-foreground">{step.title}</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
        
        <p className="mt-14 text-[13px] text-muted-foreground/80">
          Plain uses modern browser technologies (WebAssembly) to perform PDF
          processing locally.
        </p>
      </div>
    </section>
  )
}
