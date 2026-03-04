"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search } from "lucide-react"

interface FocusedSearchProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function FocusedSearch({ 
  value, 
  onChange, 
  placeholder = "Search...",
  className = "" 
}: FocusedSearchProps) {
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Handle click on backdrop to unfocus
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false)
        inputRef.current?.blur()
      }
    }

    if (isFocused) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isFocused])

  return (
    <>
      {/* Background dim overlay */}
      <AnimatePresence>
        {isFocused && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Search input container */}
      <div ref={containerRef} className={`relative z-50 ${className}`}>
        <motion.div
          animate={{
            scale: isFocused ? 1.02 : 1,
          }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="relative"
        >
          <Search 
            className={`absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors duration-150 ${
              isFocused ? "text-[#0070f3]" : "text-muted-foreground/50"
            }`} 
            strokeWidth={2} 
          />
          <motion.input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              // Delay to allow click events to fire first
              setTimeout(() => setIsFocused(false), 100)
            }}
            animate={{
              boxShadow: isFocused 
                ? "0 0 0 2px rgba(0, 112, 243, 0.3), 0 4px 12px rgba(0, 0, 0, 0.2)" 
                : "0 0 0 0px rgba(0, 112, 243, 0)",
              borderColor: isFocused ? "#0070f3" : "#333",
            }}
            transition={{ duration: 0.15 }}
            className="w-full rounded-lg border bg-[#111] py-3 pl-11 pr-4 text-[14px] text-foreground placeholder:text-muted-foreground/50 outline-none transition-colors duration-150 focus:bg-[#161616]"
          />
        </motion.div>
      </div>
    </>
  )
}
