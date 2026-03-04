"use client"

/**
 * i18n React Context
 * 
 * Provides translation functions to client components.
 * Currently uses English as the only active locale.
 * 
 * Usage:
 * 1. Wrap your app with <I18nProvider locale="en">
 * 2. Use the useTranslation hook in components:
 *    const { t, locale } = useTranslation()
 *    return <p>{t("common.tagline")}</p>
 */

import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react"
import { getDictionary, t as translate, defaultLocale, type Locale } from "./index"
import type { Dictionary } from "./types"

interface I18nContextValue {
  locale: Locale
  dictionary: Dictionary
  t: (key: string, fallback?: string) => string
}

const I18nContext = createContext<I18nContextValue | null>(null)

interface I18nProviderProps {
  children: ReactNode
  locale?: Locale
}

/**
 * i18n Provider Component
 * 
 * Wraps the application to provide translation context.
 * Currently defaults to English.
 */
export function I18nProvider({
  children,
  locale = defaultLocale,
}: I18nProviderProps) {
  const value = useMemo(() => {
    const dictionary = getDictionary(locale)
    return {
      locale,
      dictionary,
      t: (key: string, fallback?: string) => translate(dictionary, key, fallback),
    }
  }, [locale])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

/**
 * useTranslation Hook
 * 
 * Access translations in client components.
 * 
 * @example
 * const { t, locale } = useTranslation()
 * return <h1>{t("tools.mergePdf.title")}</h1>
 */
export function useTranslation() {
  const context = useContext(I18nContext)

  if (!context) {
    // Fallback when used outside provider (for SSR or direct usage)
    const dictionary = getDictionary(defaultLocale)
    return {
      locale: defaultLocale,
      dictionary,
      t: (key: string, fallback?: string) => translate(dictionary, key, fallback),
    }
  }

  return context
}

/**
 * Server Component Translation Helper
 * 
 * For use in Server Components where hooks aren't available.
 * 
 * @example
 * const t = getServerTranslation("en")
 * return <h1>{t("tools.mergePdf.title")}</h1>
 */
export function getServerTranslation(locale: Locale = defaultLocale) {
  const dictionary = getDictionary(locale)
  return (key: string, fallback?: string) => translate(dictionary, key, fallback)
}
