"use client"

import { useState, useRef, useEffect } from "react"
import { Languages, ChevronDown } from "lucide-react"

const languages = [
  { code: "EN", name: "English", locale: "en-GB" },
  { code: "FR", name: "Français", locale: "fr" },
  { code: "DE", name: "Deutsch", locale: "de" },
  { code: "ES", name: "Español", locale: "es" },
]

export function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0])
  const [focusedIndex, setFocusedIndex] = useState(0)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault()
        setIsOpen(true)
        setFocusedIndex(languages.findIndex(l => l.code === selectedLanguage.code))
      }
      return
    }

    switch (e.key) {
      case "Escape":
        setIsOpen(false)
        buttonRef.current?.focus()
        break
      case "ArrowDown":
        e.preventDefault()
        setFocusedIndex(prev => (prev + 1) % languages.length)
        break
      case "ArrowUp":
        e.preventDefault()
        setFocusedIndex(prev => (prev - 1 + languages.length) % languages.length)
        break
      case "Enter":
      case " ":
        e.preventDefault()
        handleSelect(languages[focusedIndex])
        break
      case "Tab":
        setIsOpen(false)
        break
    }
  }

  const handleSelect = (language: typeof languages[0]) => {
    setSelectedLanguage(language)
    setIsOpen(false)
    buttonRef.current?.focus()
    // Future: Trigger Google Translate here
    // document.querySelector('.goog-te-combo')?.dispatchEvent(new Event('change'))
  }

  return (
    <div ref={dropdownRef} className="relative" onKeyDown={handleKeyDown}>
      {/* Trigger Button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={`Language: ${selectedLanguage.name}. Click to change language.`}
        className="flex items-center gap-1.5 rounded-lg border border-[#333] bg-[#111] px-2.5 py-1.5 text-[13px] text-white/70 transition-all duration-150 hover:border-[#0070f3] hover:text-white hover:shadow-[0_0_8px_rgba(0,112,243,0.25)] focus-visible:border-[#0070f3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0070f3]/30"
      >
        <Languages className="h-4 w-4 text-white/50" strokeWidth={1.5} />
        <span className="font-mono text-[12px] font-medium tracking-wide">{selectedLanguage.code}</span>
        <ChevronDown 
          className={`h-3 w-3 text-white/40 transition-transform duration-150 ${isOpen ? "rotate-180" : ""}`} 
          strokeWidth={2} 
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div 
          className="absolute end-0 top-full z-50 mt-2 min-w-[160px] overflow-hidden rounded-lg border border-[#333] bg-[#0f0f0f]/95 shadow-lg shadow-black/30 backdrop-blur-xl"
          role="listbox"
          aria-label="Select language"
          aria-activedescendant={`lang-${languages[focusedIndex].code}`}
        >
          <div className="p-1">
            {languages.map((language, index) => {
              const isSelected = language.code === selectedLanguage.code
              const isFocused = index === focusedIndex

              return (
                <button
                  key={language.code}
                  id={`lang-${language.code}`}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(language)}
                  onMouseEnter={() => setFocusedIndex(index)}
                  className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-start text-[13px] transition-colors duration-100 ${
                    isFocused 
                      ? "bg-[#111] text-white" 
                      : "text-white/70 hover:bg-[#111] hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Active Indicator - Blue Dot */}
                    <span 
                      className={`h-1.5 w-1.5 rounded-full transition-all duration-150 ${
                        isSelected 
                          ? "bg-[#0070f3] shadow-[0_0_6px_rgba(0,112,243,0.6)]" 
                          : "bg-transparent"
                      }`}
                      aria-hidden="true"
                    />
                    <span className="font-medium">{language.name}</span>
                  </div>
                  <span className="font-mono text-[11px] text-white/40">{language.code}</span>
                </button>
              )
            })}
          </div>
          
          {/* Footer Note */}
          <div className="border-t border-[#333] px-3 py-2">
            <p className="text-[10px] text-white/30">
              Translation powered locally
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
