"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Script from "next/script"
import { Languages } from "lucide-react"
import { GOOGLE_TRANSLATE_INCLUDED_LANGUAGES } from "@/lib/google-translate-languages"

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

export function GoogleTranslateWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [scriptLoaded, setScriptLoaded] = useState(false)
  const comboPollRef = useRef<number | null>(null)

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
        document.cookie = "googtrans=; path=/; max-age=0"
        return
      }

      document.cookie = `googtrans=/en/${language}; path=/; max-age=31536000`
      window.dispatchEvent(new CustomEvent("plain:translate-language-change", { detail: language }))
    })

    return true
  }, [])

  const pollForComboAndBind = useCallback(() => {
    let attempts = 0
    const maxAttempts = 30

    const run = () => {
      if (bindComboListener()) {
        return
      }

      attempts += 1
      if (attempts >= maxAttempts) {
        return
      }

      comboPollRef.current = window.setTimeout(run, 150)
    }

    run()
  }, [bindComboListener])

  useEffect(() => {
    window.googleTranslateElementInit = () => {
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
      pollForComboAndBind()
    }

    if (window.google?.translate?.TranslateElement) {
      setScriptLoaded(true)
    }

    return () => {
      if (comboPollRef.current !== null) {
        window.clearTimeout(comboPollRef.current)
      }
    }
  }, [pollForComboAndBind])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    if (!scriptLoaded && window.google?.translate?.TranslateElement) {
      setScriptLoaded(true)
    }

    if (scriptLoaded || window.google?.translate?.TranslateElement) {
      window.googleTranslateElementInit?.()
    }
  }, [isOpen, scriptLoaded])

  return (
    <div className="w-full rounded-xl border border-[#333] bg-[#0f0f0f] p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Languages className="h-4 w-4 text-[#0070f3]" />
          <p className="text-base text-white/75">Translate this page</p>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen((current) => !current)}
          className="inline-flex min-h-[44px] w-full items-center justify-center rounded-md border border-[#333] bg-[#111] px-3 py-2 text-base font-medium text-white/75 transition-colors hover:border-[#0070f3]/60 hover:text-white sm:w-auto"
        >
          {isOpen ? "Hide Translator" : "Show Translator"}
        </button>
      </div>

      <div className={isOpen ? "mt-3 block" : "hidden"}>
        <p className="mb-2 w-full text-base text-white/45">
          Google Translate may send page text to Google services.
        </p>
        <div id="google_translate_element" className="w-full overflow-x-auto" />
      </div>

      {isOpen ? (
        <Script
          id="google-translate-script"
          src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
          strategy="lazyOnload"
          onLoad={() => setScriptLoaded(true)}
        />
      ) : null}
    </div>
  )
}
