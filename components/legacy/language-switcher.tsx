"use client"

/**
 * Language Switcher Component
 * 
 * Currently hidden - will be shown when i18n is enabled.
 * To enable:
 * 1. Set I18N_ENABLED to true in lib/i18n/config.ts
 * 2. Set localeReady to true for DE and FR when translations are complete
 * 3. Add the component to the header
 * 
 * The switcher automatically hides when:
 * - I18N_ENABLED is false
 * - Only one locale is active (English only)
 */

import { useState, useCallback } from "react"
import { usePathname } from "next/navigation"
import { ChevronDown, Globe, Check } from "lucide-react"
import {
  I18N_ENABLED,
  locales,
  localeNames,
  localeFlags,
  defaultLocale,
  getActiveLocales,
  getLocalizedUrl,
  stripLocalePrefix,
  type Locale,
} from "@/lib/i18n"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface LanguageSwitcherProps {
  currentLocale?: Locale
  className?: string
  variant?: "icon" | "full"
  /** Force show even when i18n is disabled (for testing) */
  forceShow?: boolean
}

export function LanguageSwitcher({
  currentLocale = defaultLocale,
  className = "",
  variant = "icon",
  forceShow = false,
}: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const activeLocales = getActiveLocales()

  // Hidden when i18n is disabled or only one locale active (unless forceShow)
  if (!forceShow && (!I18N_ENABLED || activeLocales.length <= 1)) {
    return null
  }

  const handleLocaleChange = useCallback((locale: Locale) => {
    if (!I18N_ENABLED) {
      setIsOpen(false)
      return
    }

    // Get the path without locale prefix
    const cleanPath = stripLocalePrefix(pathname)
    
    // Set locale cookie for persistence
    document.cookie = `NEXT_LOCALE=${locale};path=/;max-age=${60 * 60 * 24 * 365};SameSite=Lax`
    
    // Navigate to the localized URL
    const targetUrl = locale === defaultLocale 
      ? cleanPath 
      : `/${locale}${cleanPath}`
    
    window.location.href = targetUrl
  }, [pathname])

  // Shared dropdown content
  const dropdownContent = (
    <DropdownMenuContent align="end" className="min-w-[160px]">
      {locales.map((locale) => {
        const isActive = locale === currentLocale
        const isAvailable = activeLocales.includes(locale)
        
        return (
          <DropdownMenuItem
            key={locale}
            onClick={() => handleLocaleChange(locale)}
            className={`cursor-pointer gap-3 ${
              isActive ? "bg-accent/10" : ""
            } ${!isAvailable ? "opacity-60 cursor-not-allowed" : ""}`}
            disabled={!isAvailable}
          >
            <span className="text-[11px] font-medium uppercase text-muted-foreground/80 w-5">
              {localeFlags[locale]}
            </span>
            <span className="text-[13px] flex-1">{localeNames[locale]}</span>
            {isActive && (
              <Check className="h-3.5 w-3.5 text-accent" />
            )}
            {!isAvailable && (
              <span className="text-[11px] text-muted-foreground/80">Soon</span>
            )}
          </DropdownMenuItem>
        )
      })}
    </DropdownMenuContent>
  )

  if (variant === "icon") {
    return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={`h-9 w-9 text-muted-foreground hover:text-foreground ${className}`}
            aria-label="Change language"
          >
            <Globe className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        {dropdownContent}
      </DropdownMenu>
    )
  }

  // Full variant with text label
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={`h-9 gap-2 px-3 text-muted-foreground hover:text-foreground ${className}`}
          aria-label="Change language"
        >
          <Globe className="h-4 w-4" />
          <span className="text-[13px]">{localeNames[currentLocale]}</span>
          <ChevronDown className="h-3 w-3 opacity-60" />
        </Button>
      </DropdownMenuTrigger>
      {dropdownContent}
    </DropdownMenu>
  )
}

/**
 * Server-side locale detection helper
 * Use in Server Components to get current locale from URL
 */
export function getLocaleFromPathname(pathname: string): Locale {
  for (const locale of locales) {
    if (pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`) {
      return locale
    }
  }
  return defaultLocale
}
