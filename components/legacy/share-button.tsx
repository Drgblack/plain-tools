"use client"

import { useState, useRef, useEffect } from "react"
import { Share2, Link2, Check, Mail } from "lucide-react"

interface ShareButtonProps {
  variant?: "icon" | "inline" | "subtle"
  url?: string
  title?: string
  text?: string
  className?: string
}

const defaultShareText = "Plain - offline PDF tools that never upload your files"

// Social share URLs
function getTwitterShareUrl(url: string, text: string) {
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
}

function getLinkedInShareUrl(url: string) {
  return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
}

function getEmailShareUrl(url: string, title: string, text: string) {
  return `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(text + "\n\n" + url)}`
}

export function ShareButton({
  variant = "icon",
  url,
  title = "Plain - Offline PDF Tools",
  text = defaultShareText,
  className = "",
}: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Get current URL on client
  const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "https://plain.tools")

  // Close popover when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popoverRef.current &&
        buttonRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  // Handle share click
  async function handleShare() {
    // Try Web Share API first
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url: shareUrl,
        })
        return
      } catch {
        // User cancelled or error, fall through to popover
      }
    }
    // Fallback to popover
    setIsOpen(!isOpen)
  }

  // Copy link to clipboard
  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea")
      textarea.value = shareUrl
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand("copy")
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // Render based on variant
  if (variant === "icon") {
    return (
      <div className={`relative ${className}`}>
        <button
          ref={buttonRef}
          onClick={handleShare}
          className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground/70 transition-all duration-150 hover:text-accent hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
          aria-label="Share"
        >
          <Share2 className="h-4 w-4" />
        </button>

        {isOpen && (
          <SharePopover
            ref={popoverRef}
            shareUrl={shareUrl}
            title={title}
            text={text}
            copied={copied}
            onCopy={copyLink}
            onClose={() => setIsOpen(false)}
            position="bottom-right"
          />
        )}
      </div>
    )
  }

  if (variant === "inline") {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <button
          onClick={copyLink}
          className="flex items-center gap-1.5 rounded-md bg-[oklch(0.16_0.005_250)] px-2.5 py-1.5 text-[12px] font-medium text-muted-foreground border border-white/[0.08] transition-colors hover:border-accent/25 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-green-500" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Link2 className="h-3.5 w-3.5" />
              <span>Copy link</span>
            </>
          )}
        </button>
        <SocialIconButton
          href={getTwitterShareUrl(shareUrl, text)}
          label="Share on X"
          icon={<XTwitterIcon />}
        />
        <SocialIconButton
          href={getLinkedInShareUrl(shareUrl)}
          label="Share on LinkedIn"
          icon={<LinkedInIcon />}
        />
        <SocialIconButton
          href={getEmailShareUrl(shareUrl, title, text)}
          label="Share via Email"
          icon={<Mail className="h-3.5 w-3.5" />}
        />
      </div>
    )
  }

  // subtle variant - for use in articles and tool success screens
  return (
    <div className={`${className}`}>
      <p className="mb-3 text-[12px] text-muted-foreground/70">
        Know someone who cares about PDF privacy? Share this.
      </p>
      <div className="flex items-center gap-2">
        <button
          onClick={copyLink}
          className="flex items-center gap-1.5 rounded-md bg-[oklch(0.15_0.004_250)] px-2.5 py-1.5 text-[12px] font-medium text-muted-foreground border border-white/[0.08] transition-colors hover:border-accent/25 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-green-500" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Link2 className="h-3.5 w-3.5" />
              <span>Copy link</span>
            </>
          )}
        </button>
        <SocialIconButton
          href={getTwitterShareUrl(shareUrl, text)}
          label="Share on X"
          icon={<XTwitterIcon />}
        />
        <SocialIconButton
          href={getLinkedInShareUrl(shareUrl)}
          label="Share on LinkedIn"
          icon={<LinkedInIcon />}
        />
        <SocialIconButton
          href={getEmailShareUrl(shareUrl, title, text)}
          label="Share via Email"
          icon={<Mail className="h-3.5 w-3.5" />}
        />
      </div>
    </div>
  )
}

// Popover component
interface SharePopoverProps {
  shareUrl: string
  title: string
  text: string
  copied: boolean
  onCopy: () => void
  onClose: () => void
  position: "bottom-right" | "top-center"
}

const SharePopover = ({
  ref,
  shareUrl,
  title,
  text,
  copied,
  onCopy,
  onClose,
  position,
}: SharePopoverProps & { ref: React.RefObject<HTMLDivElement | null> }) => {
  const positionClasses =
    position === "bottom-right"
      ? "right-0 top-full mt-2"
      : "left-1/2 bottom-full mb-2 -translate-x-1/2"

  return (
    <div
      ref={ref}
      className={`absolute ${positionClasses} z-50 w-56 rounded-lg border border-white/[0.10] bg-[oklch(0.14_0.005_250)] p-3 shadow-xl`}
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70">
          Share
        </span>
        <button
          onClick={onClose}
          className="rounded p-0.5 text-muted-foreground/70 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
          aria-label="Close"
        >
          <XIcon className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Copy link button */}
      <button
        onClick={onCopy}
        className="mb-3 flex w-full items-center gap-2 rounded-md bg-[oklch(0.18_0.006_250)] px-3 py-2 text-[13px] font-medium text-foreground/90 border border-white/[0.08] transition-colors hover:border-accent/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
      >
        {copied ? (
          <>
            <Check className="h-4 w-4 text-green-500" />
            <span>Link copied</span>
          </>
        ) : (
          <>
            <Link2 className="h-4 w-4" />
            <span>Copy link</span>
          </>
        )}
      </button>

      {/* Social icons */}
      <div className="flex items-center gap-2">
        <SocialIconButton
          href={getTwitterShareUrl(shareUrl, text)}
          label="Share on X"
          icon={<XTwitterIcon />}
          size="lg"
        />
        <SocialIconButton
          href={getLinkedInShareUrl(shareUrl)}
          label="Share on LinkedIn"
          icon={<LinkedInIcon />}
          size="lg"
        />
        <SocialIconButton
          href={getEmailShareUrl(shareUrl, title, text)}
          label="Share via Email"
          icon={<Mail className="h-4 w-4" />}
          size="lg"
        />
      </div>
    </div>
  )
}

// Social icon button - small, no animations
function SocialIconButton({
  href,
  label,
  icon,
  size = "sm",
}: {
  href: string
  label: string
  icon: React.ReactNode
  size?: "sm" | "lg"
}) {
  const sizeClasses = size === "lg" ? "h-8 w-8" : "h-7 w-7"

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex ${sizeClasses} items-center justify-center rounded-md text-muted-foreground/60 border border-white/[0.06] bg-[oklch(0.15_0.004_250)] transition-colors hover:border-accent/25 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50`}
      aria-label={label}
    >
      {icon}
    </a>
  )
}

// Social icons
function XTwitterIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

// Subtle share component for articles and tool success screens
export function ArticleShareRow({ className = "" }: { className?: string }) {
  return (
    <div className={`${className}`}>
      <ShareButton variant="subtle" />
    </div>
  )
}
