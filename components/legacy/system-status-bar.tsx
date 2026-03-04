"use client"

import { useState, useEffect } from "react"

// Pulse icon component with breathing glow effect
function PulseIcon({ className }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 16 16" 
      fill="none" 
      className={className}
      aria-hidden="true"
      style={{ filter: "drop-shadow(0 0 4px currentColor)" }}
    >
      {/* Outer breathing glow ring */}
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="0.5" opacity="0.2">
        <animate 
          attributeName="r" 
          values="5;7;5" 
          dur="3s" 
          repeatCount="indefinite" 
          calcMode="spline"
          keySplines="0.4 0 0.6 1; 0.4 0 0.6 1"
        />
        <animate 
          attributeName="opacity" 
          values="0.3;0.1;0.3" 
          dur="3s" 
          repeatCount="indefinite" 
          calcMode="spline"
          keySplines="0.4 0 0.6 1; 0.4 0 0.6 1"
        />
      </circle>
      {/* Middle breathing ring */}
      <circle cx="8" cy="8" r="4.5" stroke="currentColor" strokeWidth="1" opacity="0.3">
        <animate 
          attributeName="r" 
          values="4;5.5;4" 
          dur="3s" 
          repeatCount="indefinite" 
          calcMode="spline"
          keySplines="0.4 0 0.6 1; 0.4 0 0.6 1"
        />
        <animate 
          attributeName="opacity" 
          values="0.4;0.15;0.4" 
          dur="3s" 
          repeatCount="indefinite" 
          calcMode="spline"
          keySplines="0.4 0 0.6 1; 0.4 0 0.6 1"
        />
      </circle>
      {/* Core dot with subtle scale breathing */}
      <circle cx="8" cy="8" r="3" fill="currentColor">
        <animate 
          attributeName="r" 
          values="2.5;3;2.5" 
          dur="3s" 
          repeatCount="indefinite" 
          calcMode="spline"
          keySplines="0.4 0 0.6 1; 0.4 0 0.6 1"
        />
      </circle>
    </svg>
  )
}

// Lock icon component
function LockIcon({ className }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 16 16" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="3" y="7" width="10" height="7" rx="1.5" />
      <path d="M5 7V5a3 3 0 0 1 6 0v2" />
    </svg>
  )
}

// Strike-through cloud icon
function NoCloudIcon({ className }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 16 16" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M4.5 12.5h7a3 3 0 0 0 .5-5.96A4.002 4.002 0 0 0 4.05 8.5a2.5 2.5 0 0 0 .45 4Z" />
      <line x1="2" y1="14" x2="14" y2="2" strokeWidth="2" />
    </svg>
  )
}

// GPU chip icon
function GpuIcon({ className }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 16 16" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="3" y="3" width="10" height="10" rx="1" />
      <line x1="6" y1="1" x2="6" y2="3" />
      <line x1="10" y1="1" x2="10" y2="3" />
      <line x1="6" y1="13" x2="6" y2="15" />
      <line x1="10" y1="13" x2="10" y2="15" />
      <line x1="1" y1="6" x2="3" y2="6" />
      <line x1="1" y1="10" x2="3" y2="10" />
      <line x1="13" y1="6" x2="15" y2="6" />
      <line x1="13" y1="10" x2="15" y2="10" />
    </svg>
  )
}

// Memory icon
function MemoryIcon({ className }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 16 16" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="2" y="4" width="12" height="8" rx="1" />
      <line x1="4" y1="12" x2="4" y2="14" />
      <line x1="8" y1="12" x2="8" y2="14" />
      <line x1="12" y1="12" x2="12" y2="14" />
      <rect x="4" y="6" width="2" height="4" rx="0.5" fill="currentColor" opacity="0.4" />
      <rect x="7" y="6" width="2" height="4" rx="0.5" fill="currentColor" opacity="0.4" />
      <rect x="10" y="6" width="2" height="4" rx="0.5" fill="currentColor" opacity="0.4" />
    </svg>
  )
}

export function SystemStatusBar() {
  const [memoryUsage, setMemoryUsage] = useState(42)
  const [webGpuStatus, setWebGpuStatus] = useState<"checking" | "accelerated" | "fallback">("checking")
  const [engineStatus, setEngineStatus] = useState<"initialising" | "ready">("initialising")

  // Simulate memory fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setMemoryUsage(prev => {
        const delta = (Math.random() - 0.5) * 8
        const newValue = prev + delta
        return Math.max(32, Math.min(128, newValue))
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  // Check WebGPU availability
  useEffect(() => {
    const checkWebGPU = async () => {
      if (typeof window !== "undefined" && "gpu" in navigator) {
        try {
          const adapter = await (navigator as Navigator & { gpu: { requestAdapter: () => Promise<unknown> } }).gpu.requestAdapter()
          setWebGpuStatus(adapter ? "accelerated" : "fallback")
        } catch {
          setWebGpuStatus("fallback")
        }
      } else {
        setWebGpuStatus("fallback")
      }
    }
    
    checkWebGPU()
  }, [])

  // Simulate engine initialisation
  useEffect(() => {
    const timer = setTimeout(() => {
      setEngineStatus("ready")
    }, 1500)
    
    return () => clearTimeout(timer)
  }, [])

  return (
    <div 
      data-tour="system-status"
      className="fixed bottom-0 inset-x-0 z-50 h-9 border-t border-white/[0.08] bg-[rgba(0,0,0,0.85)] backdrop-blur-sm"
      role="status"
      aria-label="System status"
    >
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4">
        {/* Left: Status Indicators */}
        <div className="flex items-center gap-4 md:gap-6">
          {/* Engine Status */}
          <div className="flex items-center gap-2">
            <PulseIcon className={`h-3 w-3 ${engineStatus === "ready" ? "text-emerald-400" : "text-amber-400"}`} />
            <span className="font-mono text-[11px] text-foreground/70">
              Local Engine: {engineStatus === "ready" ? "Ready" : "Initialising"}
            </span>
          </div>

          {/* Security Protocol - hidden on smallest screens */}
          <div className="hidden items-center gap-2 sm:flex">
            <LockIcon className="h-3.5 w-3.5 text-accent" />
            <span className="font-mono text-[11px] text-foreground/70">
              End-to-End Local Encryption Active
            </span>
          </div>
        </div>

        {/* Right: Technical Metrics - hidden on mobile */}
        <div className="hidden items-center gap-5 md:flex">
          {/* WebGPU Status */}
          <div className="flex items-center gap-2">
            <GpuIcon className={`h-3.5 w-3.5 ${webGpuStatus === "accelerated" ? "text-accent" : "text-muted-foreground/60"}`} />
            <span className="font-mono text-[11px] text-foreground/70">
              WebGPU: {webGpuStatus === "checking" ? "Checking" : webGpuStatus === "accelerated" ? "Accelerated" : "Software Fallback"}
            </span>
          </div>

          {/* Memory Monitor */}
          <div className="flex items-center gap-2">
            <MemoryIcon className="h-3.5 w-3.5 text-muted-foreground/60" />
            <span className="font-mono text-[11px] text-foreground/70">
              Local RAM: <span className="text-accent tabular-nums">{memoryUsage.toFixed(1)}</span> MB
            </span>
          </div>

          {/* Network Status */}
          <div className="flex items-center gap-2">
            <NoCloudIcon className="h-3.5 w-3.5 text-emerald-400/80" />
            <span className="font-mono text-[11px] text-foreground/70">
              No Data Exit
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
