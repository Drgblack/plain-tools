"use client"

import { useEffect, useState } from "react"
import Script from "next/script"
import { Languages } from "lucide-react"

declare global {
  interface Window {
    googleTranslateElementInit?: () => void
    __googleTranslateInitialised?: boolean
    google?: {
      translate?: {
        TranslateElement: new (
          options: { pageLanguage: string },
          containerId: string
        ) => unknown
      }
    }
  }
}

export function GoogleTranslateWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [scriptLoaded, setScriptLoaded] = useState(false)

  useEffect(() => {
    window.googleTranslateElementInit = () => {
      if (window.__googleTranslateInitialised) {
        return
      }

      const translateConstructor = window.google?.translate?.TranslateElement
      const mountNode = document.getElementById("google_translate_element")
      if (!translateConstructor || !mountNode) {
        return
      }

      mountNode.innerHTML = ""

      // Required init: new google.translate.TranslateElement({pageLanguage: 'en'}, 'google_translate_element')
      new translateConstructor({ pageLanguage: "en" }, "google_translate_element")
      window.__googleTranslateInitialised = true
    }
  }, [])

  useEffect(() => {
    if (isOpen && scriptLoaded) {
      window.googleTranslateElementInit?.()
    }
  }, [isOpen, scriptLoaded])

  return (
    <div className="rounded-xl border border-[#333] bg-[#0f0f0f] p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Languages className="h-4 w-4 text-[#0070f3]" />
          <p className="text-[13px] text-white/75">Translate this page</p>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen((current) => !current)}
          className="inline-flex items-center justify-center rounded-md border border-[#333] bg-[#111] px-3 py-1.5 text-[12px] font-medium text-white/75 transition-colors hover:border-[#0070f3]/60 hover:text-white"
        >
          {isOpen ? "Hide Translator" : "Show Translator"}
        </button>
      </div>

      <div className={isOpen ? "mt-3 block" : "hidden"}>
        <p className="mb-2 text-[11px] text-white/45">
          Google Translate may send page text to Google services.
        </p>
        <div id="google_translate_element" />
      </div>

      {isOpen ? (
        <Script
          id="google-translate-script"
          src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
          strategy="afterInteractive"
          onLoad={() => setScriptLoaded(true)}
        />
      ) : null}
    </div>
  )
}
