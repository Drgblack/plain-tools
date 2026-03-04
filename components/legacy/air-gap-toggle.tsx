"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { WifiOff, Shield, Check } from "lucide-react"

// Toast notification for air-gap mode
function AirGapToast({ isVisible, onClose }: { isVisible: boolean; onClose: () => void }) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 5000)
      return () => clearTimeout(timer)
    }
  }, [isVisible, onClose])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="fixed bottom-14 left-1/2 z-[100] -translate-x-1/2"
        >
          <div className="flex items-center gap-3 rounded-lg border border-[#0070f3]/30 bg-[#050505] px-4 py-3 shadow-[0_0_30px_rgba(0,112,243,0.2)] backdrop-blur-sm">
            {/* Security terminal icon */}
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0070f3]/10 ring-1 ring-[#0070f3]/30">
              <Shield className="h-5 w-5 text-[#0070f3]" strokeWidth={1.5} />
            </div>
            
            <div className="flex flex-col">
              <span className="font-mono text-[13px] font-semibold text-[#0070f3]">
                Offline Mode Active
              </span>
              <span className="text-[12px] leading-relaxed text-white/60">
                You can now disconnect from the internet; all tools are running locally in your browser.
              </span>
            </div>
            
            {/* Dismiss button */}
            <button
              onClick={onClose}
              className="ms-2 flex h-6 w-6 items-center justify-center rounded text-white/40 transition-colors hover:bg-white/10 hover:text-white/60"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function AirGapToggle() {
  const [isEnabled, setIsEnabled] = useState(false)
  const [showToast, setShowToast] = useState(false)

  // Check localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("plain_air_gap_mode")
    if (stored === "true") {
      setIsEnabled(true)
    }
  }, [])

  const handleToggle = () => {
    const newState = !isEnabled
    setIsEnabled(newState)
    localStorage.setItem("plain_air_gap_mode", String(newState))
    
    if (newState) {
      setShowToast(true)
    }
  }

  return (
    <>
      <AirGapToast isVisible={showToast} onClose={() => setShowToast(false)} />
      
      <button
        onClick={handleToggle}
        className={`group relative flex items-center gap-2 rounded-lg border px-3 py-1.5 font-mono text-[11px] transition-all duration-200 ${
          isEnabled
            ? "border-[#0070f3]/50 bg-[#0070f3]/10 text-[#0070f3] shadow-[0_0_15px_rgba(0,112,243,0.15)]"
            : "border-[#333] bg-[#050505] text-white/50 hover:border-[#0070f3]/30 hover:text-white/70"
        }`}
        title={isEnabled ? "Air-Gap Mode Enabled" : "Enable Air-Gap Mode"}
      >
        {/* Icon */}
        <WifiOff className={`h-3.5 w-3.5 ${isEnabled ? "text-[#0070f3]" : ""}`} strokeWidth={2} />
        
        {/* Label */}
        <span className="hidden sm:inline">
          {isEnabled ? "AIR-GAP ON" : "AIR-GAP"}
        </span>
        
        {/* Active indicator */}
        {isEnabled && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex h-4 w-4 items-center justify-center rounded-full bg-[#0070f3]/20"
          >
            <Check className="h-2.5 w-2.5 text-[#0070f3]" strokeWidth={3} />
          </motion.span>
        )}
        
        {/* Pulsing glow when active */}
        {isEnabled && (
          <span className="absolute inset-0 -z-10 animate-pulse rounded-lg bg-[#0070f3]/5" />
        )}
      </button>
    </>
  )
}
