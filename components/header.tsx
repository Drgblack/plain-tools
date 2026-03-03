"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs"
import { ShareButton } from "@/components/share-button"
import { Logo } from "@/components/logo"
import { PrivacyShield } from "@/components/privacy-shield"
import { LocalHistorySidebar, HistoryIcon } from "@/components/local-history"
import { AirGapToggle } from "@/components/air-gap-toggle"
import { Command, Menu, Search, UserCircle2, X } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
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
  const clerkEnabled = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY)
  const pathname = usePathname()
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState("en")
  const [isPortalLoading, setIsPortalLoading] = useState(false)

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  const openCommandPalette = useCallback(() => {
    window.dispatchEvent(new CustomEvent("plain:open-command-palette"))
  }, [])

  const openBillingPortal = useCallback(async () => {
    setIsPortalLoading(true)
    try {
      const response = await fetch("/api/stripe/portal", {
        method: "POST",
      })
      const payload = (await response.json().catch(() => null)) as
        | { url?: string; error?: string }
        | null

      if (!response.ok || !payload?.url) {
        throw new Error(payload?.error || "Could not open billing portal.")
      }

      window.location.href = payload.url
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error(error)
      }
      setIsPortalLoading(false)
    }
  }, [])

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
        if (process.env.NODE_ENV !== "production") {
          console.error(error)
        }
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

  useEffect(() => {
    setIsMobileNavOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", isMobileNavOpen)
    return () => {
      document.body.classList.remove("overflow-hidden")
    }
  }, [isMobileNavOpen])

  return (
    <>
      <LocalHistorySidebar isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} />
      <header className="sticky top-0 z-50 w-full bg-[oklch(0.115_0.008_250/0.96)] shadow-[0_4px_16px_-4px_rgba(0,0,0,0.45),0_2px_6px_-2px_rgba(0,0,0,0.35)]">
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/[0.12] to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-white/[0.06]" />

        <div className="mx-auto flex h-14 max-w-5xl items-center gap-2 px-4">
          <div className="shrink-0">
            <Logo />
          </div>

          <nav className="hidden flex-1 items-center justify-center gap-0.5 md:flex lg:gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`group relative rounded-md px-3 py-2 text-[14px] outline-none transition-all duration-150 focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background md:px-3.5 ${
                  isActive(link.href)
                    ? "font-semibold text-accent"
                    : "font-medium text-foreground/60 hover:bg-white/[0.06] hover:text-foreground"
                }`}
              >
                {link.label}
                <span
                  className={`absolute bottom-0 left-3 right-3 h-[2px] rounded-full bg-accent transition-opacity duration-150 md:left-3.5 md:right-3.5 ${
                    isActive(link.href) ? "opacity-100" : "opacity-0"
                  }`}
                />
                {!isActive(link.href) && (
                  <span className="absolute bottom-0 left-3 right-3 h-[2px] origin-center scale-x-0 rounded-full bg-accent/50 opacity-0 transition-all duration-150 group-hover:scale-x-100 group-hover:opacity-100 md:left-3.5 md:right-3.5" />
                )}
              </Link>
            ))}
            <div className="ms-2 hidden sm:block">
              <AirGapToggle />
            </div>
            <button
              onClick={openCommandPalette}
              className="ms-2 hidden min-w-max items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.04] px-2.5 py-1.5 text-[11px] text-foreground/50 transition-all duration-150 hover:border-white/[0.12] hover:bg-white/[0.06] hover:text-foreground/70 md:flex"
              title="Open Command Palette (Cmd+K)"
            >
              <Command className="h-3 w-3" />
              <span className="font-mono">K</span>
            </button>
          </nav>

          <div className="ms-auto flex items-center">
            <button
              onClick={() => setIsHistoryOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-foreground/60 outline-none transition-all duration-150 hover:bg-white/[0.06] hover:text-foreground focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              title="Local History"
            >
              <HistoryIcon className="h-5 w-5" />
            </button>

            <div className="ms-1 border-s border-white/[0.10] ps-2 md:ms-2 md:ps-3">
              <ShareButton variant="icon" />
            </div>

            {clerkEnabled ? (
              <>
                <SignedIn>
                  <div className="ms-2 hidden md:block">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 rounded-lg text-foreground/70 hover:bg-white/[0.06] hover:text-foreground"
                          aria-label="Open account menu"
                        >
                          <UserCircle2 className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-52">
                        <DropdownMenuLabel>Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => void openBillingPortal()}
                          disabled={isPortalLoading}
                        >
                          {isPortalLoading ? "Opening..." : "Manage Subscription"}
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/pricing">View Plans</Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </SignedIn>

                <SignedOut>
                  <div className="ms-2 hidden md:block">
                    <SignInButton mode="modal">
                      <Button variant="outline" size="sm" className="h-9">
                        Sign in
                      </Button>
                    </SignInButton>
                  </div>
                </SignedOut>
              </>
            ) : null}

            <div className="ms-3 hidden lg:block">
              <PrivacyShield />
            </div>

            <div className="ms-3 hidden md:block">
              <label htmlFor="header-language-select" className="sr-only">
                Translate language
              </label>
              <select
                id="header-language-select"
                value={selectedLanguage}
                onChange={(event) => void handleHeaderLanguageChange(event.target.value)}
                className="h-9 w-40 rounded-lg border border-[#333] bg-[#111] px-2.5 text-[12px] text-white/80 outline-none transition-all duration-150 hover:border-[#0070f3]/70 focus-visible:ring-2 focus-visible:ring-[#0070f3]/35"
              >
                {GOOGLE_TRANSLATE_LANGUAGES.map((language) => (
                  <option key={language.code} value={language.code}>
                    {language.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={openCommandPalette}
              className="ms-2 inline-flex h-9 w-9 items-center justify-center rounded-lg text-foreground/70 transition-all duration-150 hover:bg-white/[0.06] hover:text-foreground focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background md:hidden"
              aria-label="Open command palette"
              title="Search and commands"
            >
              <Search className="h-5 w-5" />
            </button>

            <button
              onClick={() => setIsMobileNavOpen((previous) => !previous)}
              className="ms-2 inline-flex h-9 w-9 items-center justify-center rounded-lg text-foreground/70 transition-all duration-150 hover:bg-white/[0.06] hover:text-foreground focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background md:hidden"
              aria-label="Open navigation menu"
              aria-expanded={isMobileNavOpen}
              aria-controls="mobile-navigation-drawer"
            >
              {isMobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      <div
        className={`fixed inset-x-0 bottom-0 top-14 z-40 md:hidden ${
          isMobileNavOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <button
          onClick={() => setIsMobileNavOpen(false)}
          className={`absolute inset-0 bg-black/60 transition-opacity duration-200 focus-visible:ring-2 focus-visible:ring-accent/60 ${
            isMobileNavOpen ? "opacity-100" : "opacity-0"
          }`}
          aria-label="Close mobile navigation"
        />

        <div
          id="mobile-navigation-drawer"
          className={`absolute inset-x-0 top-0 border-b border-white/[0.12] bg-[oklch(0.13_0.008_250)] p-4 shadow-xl transition-all duration-200 ${
            isMobileNavOpen ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
          }`}
        >
          <button
            type="button"
            onClick={() => {
              setIsMobileNavOpen(false)
              openCommandPalette()
            }}
            className="mb-3 flex h-10 w-full items-center gap-2 rounded-md border border-white/[0.10] bg-white/[0.03] px-3 text-sm font-medium text-foreground/80 transition-colors hover:bg-white/[0.06] hover:text-foreground"
          >
            <Search className="h-4 w-4" />
            Search and commands
          </button>

          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileNavOpen(false)}
                className={`rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? "bg-accent/10 text-accent"
                    : "text-foreground/85 hover:bg-white/[0.06] hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {clerkEnabled ? (
            <>
              <SignedIn>
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileNavOpen(false)
                    void openBillingPortal()
                  }}
                  className="mt-3 flex h-10 w-full items-center rounded-md border border-white/[0.10] bg-white/[0.03] px-3 text-sm font-medium text-foreground/85 transition-colors hover:bg-white/[0.06]"
                  disabled={isPortalLoading}
                >
                  {isPortalLoading ? "Opening..." : "Manage Subscription"}
                </button>
              </SignedIn>

              <SignedOut>
                <div className="mt-3">
                  <SignInButton mode="modal">
                    <Button className="h-10 w-full">Sign in</Button>
                  </SignInButton>
                </div>
              </SignedOut>
            </>
          ) : null}

          <div className="mt-4 border-t border-white/[0.10] pt-4">
            <label
              htmlFor="header-language-select-mobile"
              className="mb-2 block text-xs font-medium uppercase tracking-wide text-foreground/60"
            >
              Translate language
            </label>
            <select
              id="header-language-select-mobile"
              value={selectedLanguage}
              onChange={(event) => void handleHeaderLanguageChange(event.target.value)}
              className="h-10 w-full rounded-lg border border-[#333] bg-[#111] px-3 text-sm text-white/85 outline-none transition-all duration-150 hover:border-[#0070f3]/70 focus-visible:ring-2 focus-visible:ring-[#0070f3]/35"
            >
              {GOOGLE_TRANSLATE_LANGUAGES.map((language) => (
                <option key={language.code} value={language.code}>
                  {language.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </>
  )
}
