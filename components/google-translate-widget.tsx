"use client"

import { useCallback, useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import Script from "next/script"
import { Languages } from "lucide-react"

import { GOOGLE_TRANSLATE_INCLUDED_LANGUAGES } from "@/lib/google-translate-languages"

declare global {
  interface Window {
    googleTranslateElementInit?: () => void
    __plainGoogleTranslateMounted?: boolean
    google?: {
      translate?: {
        TranslateElement: {
          new (
            options: {
              pageLanguage: string
              includedLanguages?: string
              layout?: number
              autoDisplay?: boolean
            },
            containerId: string
          ): unknown
          InlineLayout: {
            SIMPLE: number
          }
        }
      }
    }
  }
}

const GOOGLE_TRANSLATE_SCRIPT_SRC =
  "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"

function getRootDomain(hostname: string) {
  const segments = hostname.split(".")
  if (segments.length <= 2) {
    return `.${hostname}`
  }

  return `.${segments.slice(-2).join(".")}`
}

function readCurrentLanguage() {
  if (typeof document === "undefined") {
    return "en"
  }

  const cookieMatch = document.cookie.match(/(?:^|;\s*)googtrans=\/[^/]+\/([^;]+)/)
  if (!cookieMatch?.[1]) {
    return "en"
  }

  return decodeURIComponent(cookieMatch[1])
}

function clearTranslateCookie() {
  if (typeof document === "undefined" || typeof window === "undefined") {
    return
  }

  const hostname = window.location.hostname
  const domains = ["", hostname, `.${hostname}`, getRootDomain(hostname)]

  for (const domain of domains) {
    const domainPart = domain ? `; domain=${domain}` : ""
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${domainPart}`
  }
}

export function GoogleTranslateWidget() {
  const pathname = usePathname()
  const [currentLanguage, setCurrentLanguage] = useState("en")
  const [isOpen, setIsOpen] = useState(false)
  const [scriptLoaded, setScriptLoaded] = useState(false)

  const bindComboListener = useCallback(() => {
    const combo = document.querySelector<HTMLSelectElement>(
      "#google_translate_element .goog-te-combo"
    )
    if (!combo) {
      return false
    }

    if (combo.dataset.listenerAttached === "1") {
      return true
    }

    combo.dataset.listenerAttached = "1"
    combo.addEventListener("change", () => {
      const language = combo.value
      if (!language || language === "en") {
        clearTranslateCookie()
        setCurrentLanguage("en")
        return
      }

      setCurrentLanguage(language)
      window.dispatchEvent(new CustomEvent("plain:translate-language-change", { detail: language }))
    })

    return true
  }, [])

  const applyStoredLanguage = useCallback(() => {
    const language = readCurrentLanguage()
    setCurrentLanguage(language)

    const combo = document.querySelector<HTMLSelectElement>(
      "#google_translate_element .goog-te-combo"
    )
    if (!combo) {
      return false
    }

    if (!language || language === "en" || combo.value === language) {
      return true
    }

    combo.value = language
    combo.dispatchEvent(new Event("change", { bubbles: true }))
    return true
  }, [])

  const mountWidget = useCallback(() => {
    const translateElement = window.google?.translate?.TranslateElement
    const mountNode = document.getElementById("google_translate_element")
    if (!translateElement || !mountNode) {
      return false
    }

    const hasWidget = Boolean(mountNode.querySelector(".goog-te-combo"))
    if (!hasWidget || !window.__plainGoogleTranslateMounted) {
      mountNode.innerHTML = ""
      new translateElement(
        {
          pageLanguage: "en",
          includedLanguages: GOOGLE_TRANSLATE_INCLUDED_LANGUAGES,
          layout: translateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
        },
        "google_translate_element"
      )
      window.__plainGoogleTranslateMounted = true
    }

    let attempts = 0
    const syncWidgetState = () => {
      const comboBound = bindComboListener()
      const languageApplied = applyStoredLanguage()
      if ((comboBound && languageApplied) || attempts >= 20) {
        return
      }

      attempts += 1
      window.setTimeout(syncWidgetState, 150)
    }

    syncWidgetState()
    return true
  }, [applyStoredLanguage, bindComboListener])

  const resetToEnglish = useCallback(() => {
    clearTranslateCookie()
    setCurrentLanguage("en")
    window.location.reload()
  }, [])

  useEffect(() => {
    setCurrentLanguage(readCurrentLanguage())
    window.googleTranslateElementInit = () => {
      mountWidget()
    }

    if (window.google?.translate?.TranslateElement) {
      setScriptLoaded(true)
      mountWidget()
    }
  }, [mountWidget])

  useEffect(() => {
    if (!scriptLoaded) {
      return
    }

    mountWidget()
  }, [mountWidget, scriptLoaded])

  useEffect(() => {
    if (!pathname || !window.google?.translate?.TranslateElement) {
      return
    }

    const timer = window.setTimeout(() => {
      mountWidget()
    }, 120)

    return () => {
      window.clearTimeout(timer)
    }
  }, [mountWidget, pathname])

  return (
    <>
      <div
        className="plain-translate-widget notranslate"
        data-plain-translate-widget
        translate="no"
      >
        <button
          type="button"
          onClick={() => setIsOpen((current) => !current)}
          className="plain-translate-trigger"
          aria-controls="plain-translate-panel"
          aria-expanded={isOpen}
        >
          <Languages className="h-4 w-4" aria-hidden="true" />
          <span>{currentLanguage === "en" ? "Translate" : `Language: ${currentLanguage}`}</span>
        </button>

        <div
          id="plain-translate-panel"
          className={`plain-translate-panel ${isOpen ? "plain-translate-panel--open" : ""}`}
          hidden={!isOpen}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-foreground">Translate this page</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Machine translation for on-page reading only. Google may receive page text when you
                use this control.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-md border border-border/70 px-2 py-1 text-xs text-muted-foreground transition-colors hover:border-accent/60 hover:text-foreground"
            >
              Close
            </button>
          </div>

          <div id="google_translate_element" className="plain-translate-element" />

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={resetToEnglish}
              className="rounded-md bg-accent px-3 py-2 text-xs font-medium text-accent-foreground transition-opacity hover:opacity-90"
            >
              Back to original English
            </button>
          </div>

          <p className="text-[11px] leading-5 text-muted-foreground">
            SEO note: client-side translations are not indexable. For real multilingual SEO, ship
            dedicated `/es/`, `/fr/`, `/de/` URLs with professional translations, full hreflang,
            language sitemaps, and Search Console coverage.
          </p>
        </div>
      </div>

      <Script
        id="google-translate-script"
        src={GOOGLE_TRANSLATE_SCRIPT_SRC}
        strategy="lazyOnload"
        onLoad={() => setScriptLoaded(true)}
      />
    </>
  )
}
