"use client"

import { useState, useEffect, useCallback } from "react"
import { X } from "lucide-react"

interface TourStep {
  target: string
  title: string
  content: string
  position: "top" | "bottom" | "left" | "right"
}

const tourSteps: TourStep[] = [
  {
    target: "[data-tour='hero-heading']",
    title: "Welcome to Plain",
    content: "Unlike traditional tools, we don't have a server. Your files are processed entirely within this browser tab using WebAssembly.",
    position: "bottom",
  },
  {
    target: "[data-tour='tools-section']",
    title: "Advanced Capabilities",
    content: "From permanent redaction to AI-powered summarisation, every tool runs locally. Your sensitive documents never touch the cloud.",
    position: "top",
  },
  {
    target: "[data-tour='system-status']",
    title: "Performance Transparency",
    content: "Monitor your system in real-time. This bar confirms that your device's hardware is doing the heavy lifting, ensuring total data isolation.",
    position: "top",
  },
  {
    target: "[data-tour='privacy-shield']",
    title: "Offline Readiness",
    content: "You are ready. Once loaded, you can even disconnect your internet; Plain will continue to function perfectly.",
    position: "bottom",
  },
]

export function WelcomeTour() {
  const [isActive, setIsActive] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null)
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 })

  // Check if tour should show
  useEffect(() => {
    const hasSeenTour = localStorage.getItem("plain-tour-completed")
    if (!hasSeenTour) {
      // Small delay to let page render
      const timer = setTimeout(() => setIsActive(true), 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  // Calculate spotlight and popover positions
  const updatePositions = useCallback(() => {
    if (!isActive) return

    const step = tourSteps[currentStep]
    const target = document.querySelector(step.target)
    
    if (target) {
      const rect = target.getBoundingClientRect()
      setTargetRect(rect)

      // Calculate popover position based on step.position
      const popoverWidth = 360
      const popoverHeight = 180
      const padding = 16

      let top = 0
      let left = 0

      switch (step.position) {
        case "bottom":
          top = rect.bottom + padding
          left = rect.left + rect.width / 2 - popoverWidth / 2
          break
        case "top":
          top = rect.top - popoverHeight - padding
          left = rect.left + rect.width / 2 - popoverWidth / 2
          break
        case "left":
          top = rect.top + rect.height / 2 - popoverHeight / 2
          left = rect.left - popoverWidth - padding
          break
        case "right":
          top = rect.top + rect.height / 2 - popoverHeight / 2
          left = rect.right + padding
          break
      }

      // Keep within viewport bounds
      left = Math.max(16, Math.min(left, window.innerWidth - popoverWidth - 16))
      top = Math.max(16, Math.min(top, window.innerHeight - popoverHeight - 16))

      setPopoverPosition({ top, left })

      // Scroll target into view if needed
      target.scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }, [isActive, currentStep])

  useEffect(() => {
    updatePositions()
    window.addEventListener("resize", updatePositions)
    window.addEventListener("scroll", updatePositions)
    return () => {
      window.removeEventListener("resize", updatePositions)
      window.removeEventListener("scroll", updatePositions)
    }
  }, [updatePositions])

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleFinish()
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSkip = () => {
    localStorage.setItem("plain-tour-completed", "true")
    setIsActive(false)
  }

  const handleFinish = () => {
    localStorage.setItem("plain-tour-completed", "true")
    setIsActive(false)
  }

  if (!isActive) return null

  const step = tourSteps[currentStep]

  return (
    <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true" aria-label="Welcome tour">
      {/* Spotlight overlay with cutout */}
      <svg className="absolute inset-0 h-full w-full" aria-hidden="true">
        <defs>
          <mask id="spotlight-mask">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            {targetRect && (
              <rect
                x={targetRect.left - 8}
                y={targetRect.top - 8}
                width={targetRect.width + 16}
                height={targetRect.height + 16}
                rx="8"
                fill="black"
              />
            )}
          </mask>
        </defs>
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="rgba(0, 0, 0, 0.85)"
          mask="url(#spotlight-mask)"
        />
      </svg>

      {/* Spotlight border glow */}
      {targetRect && (
        <div
          className="pointer-events-none absolute rounded-lg ring-2 ring-accent/60 shadow-[0_0_24px_4px_rgba(0,112,243,0.25)]"
          style={{
            top: targetRect.top - 8,
            left: targetRect.left - 8,
            width: targetRect.width + 16,
            height: targetRect.height + 16,
          }}
        />
      )}

      {/* Popover */}
      <div
        className="absolute w-[360px] rounded-lg border border-[#0070f3]/40 bg-[#111] p-5 shadow-2xl"
        style={{
          top: popoverPosition.top,
          left: popoverPosition.left,
        }}
      >
        {/* Close button */}
        <button
          onClick={handleSkip}
          className="absolute right-3 top-3 rounded p-1 text-muted-foreground/60 transition-colors hover:bg-white/[0.06] hover:text-muted-foreground"
          aria-label="Close tour"
        >
          <X className="h-4 w-4" strokeWidth={2} />
        </button>

        {/* Step indicator */}
        <div className="mb-3 flex items-center gap-1.5">
          {tourSteps.map((_, idx) => (
            <div
              key={idx}
              className={`h-1 rounded-full transition-all duration-300 ${
                idx === currentStep
                  ? "w-6 bg-accent"
                  : idx < currentStep
                  ? "w-1.5 bg-accent/50"
                  : "w-1.5 bg-white/20"
              }`}
            />
          ))}
          <span className="ml-auto text-[11px] font-medium text-muted-foreground/60">
            {currentStep + 1} of {tourSteps.length}
          </span>
        </div>

        {/* Content */}
        <h3 className="mb-2 text-[15px] font-semibold text-foreground">
          {step.title}
        </h3>
        <p className="mb-5 text-[13px] leading-relaxed text-muted-foreground/80">
          {step.content}
        </p>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleSkip}
            className="text-[12px] font-medium text-muted-foreground/50 transition-colors hover:text-muted-foreground"
          >
            Skip tour
          </button>

          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <button
                onClick={handleBack}
                className="rounded-md border border-white/[0.12] bg-transparent px-4 py-1.5 text-[13px] font-medium text-foreground/80 transition-all duration-200 hover:border-white/20 hover:bg-white/[0.04]"
              >
                Back
              </button>
            )}
            <button
              onClick={handleNext}
              className="rounded-md border border-accent/50 bg-accent/10 px-4 py-1.5 text-[13px] font-medium text-accent transition-all duration-200 hover:border-accent hover:bg-accent/20"
            >
              {currentStep === tourSteps.length - 1 ? "Finish" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
