"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Link2, Check } from "lucide-react"

interface CopyLinkButtonProps {
  url?: string
  className?: string
  variant?: "default" | "icon" | "full"
  label?: string
}

/**
 * Copy Link to Clipboard button with minimalist notification
 * Matches Plain's dark UI aesthetic
 */
export function CopyLinkButton({
  url,
  className = "",
  variant = "default",
  label = "Copy Link",
}: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false)
  const [showNotification, setShowNotification] = useState(false)

  const handleCopy = useCallback(async () => {
    const linkToCopy = url || (typeof window !== "undefined" ? window.location.href : "")
    
    try {
      await navigator.clipboard.writeText(linkToCopy)
      setCopied(true)
      setShowNotification(true)
      
      // Reset after 2 seconds
      setTimeout(() => {
        setCopied(false)
      }, 2000)
      
      // Hide notification after 2.5 seconds
      setTimeout(() => {
        setShowNotification(false)
      }, 2500)
    } catch (err) {
      console.error("Failed to copy link:", err)
    }
  }, [url])

  if (variant === "icon") {
    return (
      <>
        <button
          onClick={handleCopy}
          className={`flex h-9 w-9 items-center justify-center rounded-lg border border-[#333] bg-[#111] text-white/60 transition-all duration-150 hover:border-[#0070f3] hover:text-white hover:shadow-[0_0_10px_rgba(0,112,243,0.2)] ${className}`}
          title="Copy link to clipboard"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Link2 className="h-4 w-4" />
          )}
        </button>
        <CopyNotification show={showNotification} />
      </>
    )
  }

  if (variant === "full") {
    return (
      <>
        <button
          onClick={handleCopy}
          className={`flex items-center gap-2.5 rounded-lg border border-[#333] bg-[#111] px-4 py-2.5 text-[14px] font-medium text-white/70 transition-all duration-150 hover:border-[#0070f3] hover:bg-[#161616] hover:text-white hover:shadow-[0_0_10px_rgba(0,112,243,0.2)] ${className}`}
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 text-green-500" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Link2 className="h-4 w-4" />
              <span>{label}</span>
            </>
          )}
        </button>
        <CopyNotification show={showNotification} />
      </>
    )
  }

  // Default variant
  return (
    <>
      <button
        onClick={handleCopy}
        className={`flex items-center gap-2 rounded-lg bg-[#111] px-3 py-2 text-[13px] text-white/60 transition-all duration-150 hover:bg-[#161616] hover:text-white ${className}`}
      >
        {copied ? (
          <Check className="h-3.5 w-3.5 text-green-500" />
        ) : (
          <Link2 className="h-3.5 w-3.5" />
        )}
        <span>{copied ? "Copied" : label}</span>
      </button>
      <CopyNotification show={showNotification} />
    </>
  )
}

/**
 * Minimalist "Link Copied" notification matching Plain's dark UI
 */
function CopyNotification({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="fixed bottom-20 left-1/2 z-[100] -translate-x-1/2"
        >
          <div className="flex items-center gap-2.5 rounded-lg border border-[#333] bg-[#111]/95 px-4 py-2.5 shadow-[0_4px_20px_rgba(0,0,0,0.4),0_0_10px_rgba(0,112,243,0.15)] backdrop-blur-sm">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500/20">
              <Check className="h-3 w-3 text-green-500" />
            </div>
            <span className="text-[13px] font-medium text-white/90">Link Copied</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/**
 * Exportable utility function for programmatic copying
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (err) {
    console.error("Failed to copy:", err)
    return false
  }
}
