/**
 * ============================================================================
 * INTERNATIONALIZATION CONFIGURATION
 * ============================================================================
 * 
 * This module defines the language support architecture for Plain.
 * See ROLLOUT_STRATEGY.md for the complete multilingual rollout plan.
 * 
 * CURRENT STATE: English only (I18N_ENABLED = false)
 * PLANNED: German (DE), French (FR)
 * 
 * ============================================================================
 * ROLLOUT CHECKLIST
 * ============================================================================
 * 
 * Phase 1 - German Launch:
 * [ ] Complete all translations in dictionaries/de.ts
 * [ ] Translate all Learn articles to German
 * [ ] Translate all Blog posts to German
 * [ ] Native speaker review completed
 * [ ] Set localeReady.de = true
 * [ ] Set I18N_ENABLED = true
 * [ ] Add LanguageSwitcher to Header component
 * [ ] Test all /de/ routes
 * [ ] Verify hreflang tags
 * [ ] Submit German sitemap
 * 
 * Phase 2 - French Launch:
 * [ ] Complete all translations in dictionaries/fr.ts
 * [ ] Translate all Learn articles to French
 * [ ] Translate all Blog posts to French
 * [ ] Native speaker review completed
 * [ ] Set localeReady.fr = true
 * [ ] Verify hreflang tags include French
 * [ ] Submit French sitemap
 * 
 * ============================================================================
 * IMPORTANT RULES
 * ============================================================================
 * 
 * 1. ENGLISH IS CANONICAL
 *    - English URLs have no prefix: /tools/merge-pdf
 *    - Other languages use prefix: /de/tools/merge-pdf
 *    - x-default hreflang always points to English
 * 
 * 2. NO AUTO-TRANSLATION
 *    - All translations must be human-written
 *    - dictionaries/de.ts and dictionaries/fr.ts are stubs
 *    - DO NOT use machine translation services
 * 
 * 3. NO MIXED-LANGUAGE PAGES
 *    - Each page must be entirely in one language
 *    - If a translation is missing, show English (do not mix)
 *    - localeReady flag prevents partial launches
 * 
 * 4. FULL TRANSLATIONS ONLY
 *    - A language is only enabled when localeReady[lang] = true
 *    - This requires ALL content to be translated and reviewed
 *    - Incomplete translations should never be deployed
 * 
 * ============================================================================
 */

/**
 * Master switch for i18n functionality.
 * 
 * When false:
 * - Only English is active
 * - Language switcher is hidden
 * - Middleware passes through all requests
 * - hreflang tags only include English
 * 
 * When true:
 * - All locales marked as ready become active
 * - Language switcher appears in header
 * - Middleware handles locale detection and routing
 * - hreflang tags include all active locales
 */
export const I18N_ENABLED = false

/**
 * The default/canonical locale.
 * English URLs have no prefix and are used for:
 * - x-default hreflang
 * - Canonical URLs
 * - Fallback when preferred locale is unavailable
 */
export const defaultLocale = "en" as const

/**
 * All supported locales (including those not yet ready).
 * Order matters: this determines display order in language switcher.
 */
export const locales = ["en", "de", "fr"] as const

export type Locale = (typeof locales)[number]

/**
 * Human-readable locale names in their native language.
 * Used in the language switcher dropdown.
 */
export const localeNames: Record<Locale, string> = {
  en: "English",
  de: "Deutsch",
  fr: "Français",
}

/**
 * ISO country codes for locale flags.
 * Used in the language switcher for visual identification.
 */
export const localeFlags: Record<Locale, string> = {
  en: "GB",
  de: "DE", 
  fr: "FR",
}

/**
 * ISO language tags for hreflang attributes.
 * Format: language-region (e.g., en-GB, de-DE)
 * 
 * These are used in:
 * - <link rel="alternate" hreflang="..."> tags
 * - HTML lang attribute
 * - Content-Language headers
 */
export const localeHrefLang: Record<Locale, string> = {
  en: "en-GB",
  de: "de-DE",
  fr: "fr-FR",
}

/**
 * Content completeness tracking.
 * 
 * A locale is only exposed to users when marked as ready.
 * This prevents partial translations from being deployed.
 * 
 * Set to true ONLY when:
 * 1. All dictionary keys are translated
 * 2. All static content (Learn, Blog) is translated
 * 3. Native speaker review is complete
 * 4. All UI elements fit within design constraints
 */
export const localeReady: Record<Locale, boolean> = {
  en: true,   // English is always ready (canonical)
  de: false,  // German: awaiting translations
  fr: false,  // French: awaiting translations
}

/**
 * Get active locales (only those marked as ready)
 * Used to determine which locales to expose in sitemap and routing
 */
export function getActiveLocales(): Locale[] {
  if (!I18N_ENABLED) return [defaultLocale]
  return locales.filter((locale) => localeReady[locale])
}

/**
 * Check if a locale is valid
 */
export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale)
}

/**
 * Get canonical URL for a path
 * Always returns English URL as canonical
 */
export function getCanonicalUrl(path: string): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`
  return `https://plain.tools${cleanPath}`
}

/**
 * Get localized URL for a path
 */
export function getLocalizedUrl(path: string, locale: Locale): string {
  if (!I18N_ENABLED || locale === defaultLocale) {
    return getCanonicalUrl(path)
  }
  const cleanPath = path.startsWith("/") ? path : `/${path}`
  return `https://plain.tools/${locale}${cleanPath}`
}

/**
 * Generate hreflang alternates for a path
 * Used in metadata for SEO
 */
export function generateHrefLangAlternates(path: string): Record<string, string> {
  if (!I18N_ENABLED) {
    return {
      "x-default": getCanonicalUrl(path),
      [localeHrefLang.en]: getCanonicalUrl(path),
    }
  }

  const alternates: Record<string, string> = {
    "x-default": getCanonicalUrl(path),
  }

  for (const locale of getActiveLocales()) {
    alternates[localeHrefLang[locale]] = getLocalizedUrl(path, locale)
  }

  return alternates
}

/**
 * Route configuration for i18n
 * Maps route patterns to their localized versions
 */
export const routePatterns = {
  // Core pages
  home: "/",
  tools: "/tools",
  learn: "/learn",
  blog: "/blog",
  about: "/about",
  faq: "/faq",
  privacy: "/privacy",
  verify: "/verify",
  
  // Tool pages
  mergePdf: "/tools/merge-pdf",
  splitPdf: "/tools/split-pdf",
  compressPdf: "/tools/compress-pdf",
  
  // Dynamic routes (use with generateLocalizedPath)
  toolDetail: "/tools/[slug]",
  blogPost: "/blog/[slug]",
  learnArticle: "/learn/[slug]",
  comparison: "/compare/[slug]",
} as const

export type RouteKey = keyof typeof routePatterns

/**
 * Generate localized path for a route
 * Handles both static routes and dynamic routes with params
 */
export function generateLocalizedPath(
  route: RouteKey,
  locale: Locale = defaultLocale,
  params?: Record<string, string>
): string {
  let path: string = routePatterns[route]
  
  // Replace dynamic segments with actual values
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      path = path.replace(`[${key}]`, value)
    }
  }
  
  // For default locale or when i18n is disabled, don't add prefix
  if (!I18N_ENABLED || locale === defaultLocale) {
    return path
  }
  
  return `/${locale}${path}`
}

/**
 * Get all localized versions of a path
 * Useful for generating sitemap entries
 */
export function getAllLocalizedPaths(path: string): Array<{ locale: Locale; path: string }> {
  return getActiveLocales().map((locale) => ({
    locale,
    path: locale === defaultLocale ? path : `/${locale}${path}`,
  }))
}

/**
 * Locale metadata for HTML lang attribute
 */
export function getHtmlLang(locale: Locale = defaultLocale): string {
  return locale === "en" ? "en-GB" : localeHrefLang[locale].toLowerCase()
}

/**
 * Check if a path has a locale prefix
 */
export function hasLocalePrefix(path: string): boolean {
  return locales.some(
    (locale) => path.startsWith(`/${locale}/`) || path === `/${locale}`
  )
}

/**
 * Strip locale prefix from a path
 */
export function stripLocalePrefix(path: string): string {
  for (const locale of locales) {
    if (path.startsWith(`/${locale}/`)) {
      return path.slice(locale.length + 1)
    }
    if (path === `/${locale}`) {
      return "/"
    }
  }
  return path
}

/**
 * Get locale from a path
 */
export function getLocaleFromPath(path: string): Locale {
  for (const locale of locales) {
    if (path.startsWith(`/${locale}/`) || path === `/${locale}`) {
      return locale
    }
  }
  return defaultLocale
}
