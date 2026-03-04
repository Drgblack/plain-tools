/**
 * ============================================================================
 * i18n ROUTE UTILITIES
 * ============================================================================
 * 
 * Helper functions for generating localized routes and static params.
 * Used when building pages with [locale] dynamic segment.
 * 
 * CURRENT STATE:
 * These utilities are ready but not actively used since I18N_ENABLED = false.
 * When i18n is enabled, use these in generateStaticParams() functions.
 * 
 * FUTURE USAGE:
 * When i18n is enabled, the app structure would change from:
 *   app/tools/merge-pdf/page.tsx
 * To:
 *   app/[locale]/tools/merge-pdf/page.tsx
 * 
 * And pages would use these utilities:
 * ```tsx
 * export function generateStaticParams() {
 *   return generateLocaleParams()
 *   // Returns: [{ locale: "en" }, { locale: "de" }, { locale: "fr" }]
 * }
 * ```
 * 
 * ============================================================================
 */

import {
  I18N_ENABLED,
  getActiveLocales,
  defaultLocale,
  type Locale,
} from "./config"

/**
 * Generate static params for localized pages
 * Use in generateStaticParams for pages with [locale] segment
 * 
 * @example
 * // app/[locale]/page.tsx
 * export function generateStaticParams() {
 *   return generateLocaleParams()
 * }
 */
export function generateLocaleParams(): Array<{ locale: Locale }> {
  if (!I18N_ENABLED) {
    return [{ locale: defaultLocale }]
  }
  return getActiveLocales().map((locale) => ({ locale }))
}

/**
 * Generate static params for localized pages with additional params
 * 
 * @example
 * // app/[locale]/blog/[slug]/page.tsx
 * export function generateStaticParams() {
 *   const slugs = ["post-1", "post-2"]
 *   return generateLocaleParamsWithSlug(slugs)
 * }
 */
export function generateLocaleParamsWithSlug(
  slugs: string[]
): Array<{ locale: Locale; slug: string }> {
  const locales = I18N_ENABLED ? getActiveLocales() : [defaultLocale]
  
  return locales.flatMap((locale) =>
    slugs.map((slug) => ({ locale, slug }))
  )
}

/**
 * Generate static params with custom additional params
 * 
 * @example
 * // app/[locale]/[category]/[slug]/page.tsx
 * export function generateStaticParams() {
 *   const items = [
 *     { category: "tools", slug: "merge-pdf" },
 *     { category: "tools", slug: "split-pdf" },
 *   ]
 *   return generateLocaleParamsWithExtra(items)
 * }
 */
export function generateLocaleParamsWithExtra<T extends Record<string, string>>(
  items: T[]
): Array<{ locale: Locale } & T> {
  const locales = I18N_ENABLED ? getActiveLocales() : [defaultLocale]
  
  return locales.flatMap((locale) =>
    items.map((item) => ({ locale, ...item }))
  )
}

/**
 * Validate locale param in page/layout
 * Redirects to default locale if invalid
 * 
 * @example
 * // app/[locale]/layout.tsx
 * export default function Layout({ params }: { params: { locale: string } }) {
 *   const validLocale = validateLocaleParam(params.locale)
 *   // Use validLocale for translations
 * }
 */
export function validateLocaleParam(locale: string): Locale {
  const activeLocales = getActiveLocales()
  if (activeLocales.includes(locale as Locale)) {
    return locale as Locale
  }
  return defaultLocale
}

/**
 * Get locale-specific metadata
 * Helper for generating metadata in localized pages
 * 
 * @example
 * export async function generateMetadata({ params }: Props): Promise<Metadata> {
 *   const locale = validateLocaleParam(params.locale)
 *   return getLocaleMetadata(locale, {
 *     titleKey: "tools.mergePdf.title",
 *     descriptionKey: "tools.mergePdf.description",
 *     path: "/tools/merge-pdf",
 *   })
 * }
 */
export interface LocaleMetadataOptions {
  titleKey: string
  descriptionKey: string
  path: string
}

// Note: This function would use getDictionary and t() from the main index
// Keeping signature here for documentation purposes
// Actual implementation would be in the consuming component to avoid circular deps
