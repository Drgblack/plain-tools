"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export function HydrationLoader() {
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Simulate Wasm engine initialisation
    const stages = [
      { delay: 0, progress: 15 },
      { delay: 100, progress: 35 },
      { delay: 200, progress: 55 },
      { delay: 350, progress: 75 },
      { delay: 500, progress: 90 },
      { delay: 650, progress: 100 },
    ]

    stages.forEach(({ delay, progress: targetProgress }) => {
      setTimeout(() => setProgress(targetProgress), delay)
    })

    // Hide loader after completion
    const hideTimer = setTimeout(() => setIsLoading(false), 850)

    return () => clearTimeout(hideTimer)
  }, [])

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed top-0 left-0 right-0 z-[100] h-[1px] bg-transparent"
        >
          {/* Progress bar */}
          <motion.div
            className="h-full bg-[#0070f3]"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            style={{
              boxShadow: "0 0 8px rgba(0, 112, 243, 0.6), 0 0 2px rgba(0, 112, 243, 0.8)",
            }}
          />
          
          {/* Leading glow dot */}
          <motion.div
            className="absolute top-0 h-[1px] w-16"
            initial={{ left: "0%" }}
            animate={{ left: `${Math.max(0, progress - 4)}%` }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            style={{
              background: "linear-gradient(90deg, transparent, rgba(0, 112, 243, 0.8), rgba(140, 180, 255, 1))",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
