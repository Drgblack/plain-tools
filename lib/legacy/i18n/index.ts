/**
 * Internationalization Module
 * 
 * Central export for all i18n functionality.
 * Currently disabled - set I18N_ENABLED in config.ts to activate.
 */

// Configuration
export {
  I18N_ENABLED,
  defaultLocale,
  locales,
  localeNames,
  localeFlags,
  localeHrefLang,
  localeReady,
  getActiveLocales,
  isValidLocale,
  getCanonicalUrl,
  getLocalizedUrl,
  generateHrefLangAlternates,
  routePatterns,
  generateLocalizedPath,
  getAllLocalizedPaths,
  getHtmlLang,
  hasLocalePrefix,
  stripLocalePrefix,
  getLocaleFromPath,
  type Locale,
  type RouteKey,
} from "./config"

// Types
export type { Dictionary } from "./types"

// Dictionaries
import { en } from "./dictionaries/en"
import { de } from "./dictionaries/de"
import { fr } from "./dictionaries/fr"
import type { Dictionary } from "./types"
import { defaultLocale, type Locale } from "./config"

const dictionaries: Record<Locale, Dictionary> = {
  en,
  de,
  fr,
}

/**
 * Get dictionary for a locale
 * Falls back to English if locale not found
 */
export function getDictionary(locale: Locale = defaultLocale): Dictionary {
  return dictionaries[locale] ?? dictionaries[defaultLocale]
}

/**
 * Get a specific translation key with fallback
 * Supports nested keys like "tools.mergePdf.title"
 */
export function t(
  dictionary: Dictionary,
  key: string,
  fallback?: string
): string {
  const keys = key.split(".")
  let value: unknown = dictionary

  for (const k of keys) {
    if (value && typeof value === "object" && k in value) {
      value = (value as Record<string, unknown>)[k]
    } else {
      return fallback ?? key
    }
  }

  return typeof value === "string" ? value : fallback ?? key
}

/**
 * Create a typed translation function for a specific dictionary
 */
export function createTranslator(locale: Locale = defaultLocale) {
  const dictionary = getDictionary(locale)
  return (key: string, fallback?: string) => t(dictionary, key, fallback)
}

// Route utilities for static generation
export {
  generateLocaleParams,
  generateLocaleParamsWithSlug,
  generateLocaleParamsWithExtra,
  validateLocaleParam,
} from "./routes"

// React Context (for client components)
// Import separately to avoid bundling issues:
// import { I18nProvider, useTranslation } from "@/lib/i18n/context"
