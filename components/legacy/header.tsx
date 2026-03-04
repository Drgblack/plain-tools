"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ShareButton } from "@/components/share-button"
import { Logo } from "@/components/logo"
import { PrivacyShield } from "@/components/privacy-shield"
import { LocalHistorySidebar, HistoryIcon } from "@/components/local-history"
import { LanguageSelector } from "@/components/language-selector"
import { AirGapToggle } from "@/components/air-gap-toggle"
import { Command } from "lucide-react"

const navLinks = [
  { label: "Tools", href: "/tools" },
  { label: "Learn", href: "/learn" },
  { label: "Labs", href: "/labs" },
  { label: "Blog", href: "/blog" },
  { label: "Verification", href: "/verify-claims" },
  { label: "Privacy", href: "/privacy" },
  { label: "About", href: "/about" },
]

export function Header() {
  const pathname = usePathname()
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  return (
    <>
    <LocalHistorySidebar isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} />
    <header className="sticky top-0 z-50 w-full bg-[oklch(0.115_0.008_250)] shadow-[0_4px_16px_-4px_rgba(0,0,0,0.5),0_2px_6px_-2px_rgba(0,0,0,0.4)] backdrop-blur-[16px] backdrop-saturate-[1.15]">
      {/* Bottom divider - gradient edge for clear separation */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/[0.12] to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-white/[0.06]" />
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Logo />
        <nav className="flex items-center gap-0.5 md:gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`group relative rounded-md px-3 py-2 text-[14px] outline-none transition-all duration-150 focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background md:px-3.5 ${
                isActive(link.href)
                  ? "font-semibold text-accent"
                  : "font-medium text-foreground/60 hover:text-foreground hover:bg-white/[0.06]"
              }`}
            >
              {link.label}
              {/* Active indicator - solid bar */}
              <span 
                className={`absolute bottom-0 left-3 right-3 h-[2px] rounded-full bg-accent transition-opacity duration-150 md:left-3.5 md:right-3.5 ${
                  isActive(link.href) ? "opacity-100" : "opacity-0"
                }`} 
              />
              {/* Hover indicator - subtle bar that grows in */}
              {!isActive(link.href) && (
                <span 
                  className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full bg-accent/50 opacity-0 scale-x-0 transition-all duration-150 origin-center group-hover:opacity-100 group-hover:scale-x-100 md:left-3.5 md:right-3.5"
                />
              )}
            </Link>
          ))}
          {/* Air-Gap Mode Toggle */}
          <div className="ms-2 hidden sm:block">
            <AirGapToggle />
          </div>
          
          {/* Command Palette Trigger */}
          <button
            onClick={() => {
              window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }))
            }}
            className="ms-2 hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[11px] text-foreground/50 hover:bg-white/[0.06] hover:text-foreground/70 hover:border-white/[0.12] transition-all duration-150 min-w-max"
            title="Open Command Palette (Cmd+K)"
          >
            <Command className="h-3 w-3" />
            <span className="font-mono">K</span>
          </button>

          {/* History Button */}
          <button
            onClick={() => setIsHistoryOpen(true)}
            className="ms-1.5 flex h-9 w-9 items-center justify-center rounded-lg text-foreground/60 transition-all duration-150 hover:bg-white/[0.06] hover:text-foreground focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background outline-none"
            title="Local History"
          >
            <HistoryIcon className="h-5 w-5" />
          </button>
          <div className="ms-1 ps-2 border-s border-white/[0.10] md:ms-2 md:ps-3">
            <ShareButton variant="icon" />
          </div>
          <div className="ms-3 hidden lg:block">
            <PrivacyShield />
          </div>
          {/* Language Selector - Ready for Google Translate integration */}
          <div className="ms-3 hidden md:block" id="google_translate_element">
            <LanguageSelector />
          </div>
        </nav>
      </div>
    </header>
    </>
  )
}
