/**
 * ============================================================================
 * HREFLANG LINKS COMPONENT
 * ============================================================================
 * 
 * Generates <link rel="alternate" hreflang="..."> tags for SEO.
 * These tags tell search engines about alternate language versions of a page.
 * 
 * CURRENT BEHAVIOR (I18N_ENABLED = false):
 * Outputs only English canonical links:
 * ```html
 * <link rel="alternate" hreflang="x-default" href="https://plain.tools/path" />
 * <link rel="alternate" hreflang="en-GB" href="https://plain.tools/path" />
 * ```
 * 
 * FUTURE BEHAVIOR (I18N_ENABLED = true):
 * Will output all active locale alternates:
 * ```html
 * <link rel="alternate" hreflang="x-default" href="https://plain.tools/path" />
 * <link rel="alternate" hreflang="en-GB" href="https://plain.tools/path" />
 * <link rel="alternate" hreflang="de-DE" href="https://plain.tools/de/path" />
 * <link rel="alternate" hreflang="fr-FR" href="https://plain.tools/fr/path" />
 * ```
 * 
 * KEY RULES:
 * - x-default always points to English (canonical)
 * - Only includes languages marked as ready (localeReady[lang] = true)
 * - Language tags follow ISO format (en-GB, de-DE, fr-FR)
 * 
 * USAGE:
 * ```tsx
 * // In a layout or page head:
 * <HreflangLinks path="/tools/merge-pdf" />
 * 
 * // Or in generateMetadata:
 * export function generateMetadata(): Metadata {
 *   return {
 *     alternates: {
 *       languages: generateHreflangMetadata("/tools/merge-pdf"),
 *     },
 *   }
 * }
 * ```
 * 
 * ============================================================================
 */

import {
  I18N_ENABLED,
  generateHrefLangAlternates,
  localeHrefLang,
  defaultLocale,
  getCanonicalUrl,
} from "@/lib/i18n"

interface HreflangLinksProps {
  path: string
}

export function HreflangLinks({ path }: HreflangLinksProps) {
  // When i18n is disabled, only output x-default and English
  if (!I18N_ENABLED) {
    const canonicalUrl = getCanonicalUrl(path)
    return (
      <>
        <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />
        <link rel="alternate" hrefLang={localeHrefLang[defaultLocale]} href={canonicalUrl} />
      </>
    )
  }

  // When i18n is enabled, output all active locale alternates
  const alternates = generateHrefLangAlternates(path)

  return (
    <>
      {Object.entries(alternates).map(([hreflang, href]) => (
        <link key={hreflang} rel="alternate" hrefLang={hreflang} href={href} />
      ))}
    </>
  )
}

/**
 * Generate hreflang metadata object for Next.js Metadata API
 * Use this in generateMetadata functions
 * 
 * @example
 * export function generateMetadata(): Metadata {
 *   return {
 *     alternates: {
 *       languages: generateHreflangMetadata("/tools/merge-pdf"),
 *     },
 *   }
 * }
 */
export function generateHreflangMetadata(path: string): Record<string, string> {
  return generateHrefLangAlternates(path)
}
