"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ShareButton } from "@/components/share-button"
import { Logo } from "@/components/logo"
import { PrivacyShield } from "@/components/privacy-shield"
import { LocalHistorySidebar, HistoryIcon } from "@/components/local-history"
import { AirGapToggle } from "@/components/air-gap-toggle"
import { Command } from "lucide-react"
import {
  GOOGLE_TRANSLATE_INCLUDED_LANGUAGES,
  GOOGLE_TRANSLATE_LANGUAGES,
} from "@/lib/google-translate-languages"

declare global {
  interface Window {
    googleTranslateElementInit?: () => void
    __googleTranslateInitialised?: boolean
    google?: {
      translate?: {
        TranslateElement: new (
          options: {
            pageLanguage: string
            includedLanguages?: string
            autoDisplay?: boolean
          },
          containerId: string
        ) => unknown
      }
    }
  }
}

const GOOGLE_TRANSLATE_SCRIPT_SRC =
  "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"

const wait = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms)
  })

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
  const [selectedLanguage, setSelectedLanguage] = useState("en")

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  const applyLanguageToGoogleCombo = useCallback((languageCode: string) => {
    const combo = document.querySelector<HTMLSelectElement>(
      "#google_translate_element .goog-te-combo"
    )
    if (!combo) {
      return false
    }

    combo.value = languageCode
    combo.dispatchEvent(new Event("change", { bubbles: true }))
    return true
  }, [])

  const ensureGoogleTranslateReady = useCallback(async () => {
    const initialiseWidgetIfNeeded = () => {
      const translateConstructor = window.google?.translate?.TranslateElement
      const mountNode = document.getElementById("google_translate_element")
      if (!translateConstructor || !mountNode) {
        return
      }

      const hasWidget = Boolean(
        mountNode.querySelector(".goog-te-combo") ||
          mountNode.querySelector(".goog-te-gadget")
      )
      if (!hasWidget) {
        mountNode.innerHTML = ""
        new translateConstructor(
          {
            pageLanguage: "en",
            includedLanguages: GOOGLE_TRANSLATE_INCLUDED_LANGUAGES,
            autoDisplay: false,
          },
          "google_translate_element"
        )
      }

      window.__googleTranslateInitialised = true
    }

    if (window.google?.translate?.TranslateElement) {
      initialiseWidgetIfNeeded()
      return
    }

    await new Promise<void>((resolve, reject) => {
      window.googleTranslateElementInit = () => {
        initialiseWidgetIfNeeded()
        resolve()
      }

      const existingScript = document.querySelector<HTMLScriptElement>(
        `script[src="${GOOGLE_TRANSLATE_SCRIPT_SRC}"]`
      )
      if (existingScript) {
        if (window.google?.translate?.TranslateElement) {
          window.googleTranslateElementInit?.()
          return
        }

        const onLoad = () => window.googleTranslateElementInit?.()
        const onError = () => reject(new Error("Google Translate script failed to load."))
        existingScript.addEventListener("load", onLoad, { once: true })
        existingScript.addEventListener("error", onError, { once: true })
        return
      }

      const script = document.createElement("script")
      script.src = GOOGLE_TRANSLATE_SCRIPT_SRC
      script.async = true
      script.defer = true
      script.onerror = () => reject(new Error("Google Translate script failed to load."))
      document.head.appendChild(script)
    })
  }, [])

  const handleHeaderLanguageChange = useCallback(
    async (languageCode: string) => {
      setSelectedLanguage(languageCode)

      if (applyLanguageToGoogleCombo(languageCode)) {
        return
      }

      try {
        await ensureGoogleTranslateReady()
        for (let attempt = 0; attempt < 12; attempt++) {
          if (applyLanguageToGoogleCombo(languageCode)) {
            return
          }
          await wait(120)
        }
      } catch (error) {
        console.error(error)
      }
    },
    [applyLanguageToGoogleCombo, ensureGoogleTranslateReady]
  )

  useEffect(() => {
    const cookieMatch = document.cookie.match(/(?:^|;\s*)googtrans=\/en\/([^;]+)/)
    if (cookieMatch?.[1]) {
      setSelectedLanguage(decodeURIComponent(cookieMatch[1]))
    }

    const handleLanguageEvent = (event: Event) => {
      const customEvent = event as CustomEvent<string>
      if (typeof customEvent.detail === "string" && customEvent.detail.length > 0) {
        setSelectedLanguage(customEvent.detail)
      }
    }

    window.addEventListener("plain:translate-language-change", handleLanguageEvent)
    return () => {
      window.removeEventListener("plain:translate-language-change", handleLanguageEvent)
    }
  }, [])

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
          {/* Language Selector */}
          <div className="ms-3 hidden md:block">
            <label htmlFor="header-language-select" className="sr-only">
              Translate language
            </label>
            <select
              id="header-language-select"
              value={selectedLanguage}
              onChange={(event) => void handleHeaderLanguageChange(event.target.value)}
              className="h-9 max-w-[160px] rounded-lg border border-[#333] bg-[#111] px-2.5 text-[12px] text-white/80 outline-none transition-all duration-150 hover:border-[#0070f3]/70 focus-visible:ring-2 focus-visible:ring-[#0070f3]/35"
            >
              {GOOGLE_TRANSLATE_LANGUAGES.map((language) => (
                <option key={language.code} value={language.code}>
                  {language.label}
                </option>
              ))}
            </select>
          </div>
        </nav>
      </div>
    </header>
    </>
  )
}
