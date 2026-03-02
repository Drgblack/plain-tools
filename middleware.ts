/**
 * ============================================================================
 * MIDDLEWARE FOR i18n ROUTING
 * ============================================================================
 * 
 * STATUS: Active but i18n is disabled (I18N_ENABLED = false)
 * 
 * This middleware handles locale detection and URL routing for multilingual
 * support. It is controlled by the I18N_ENABLED flag in lib/i18n/config.ts.
 * 
 * CURRENT BEHAVIOR (I18N_ENABLED = false):
 * - All requests pass through unchanged
 * - No locale detection or redirects
 * - English-only site at root URLs
 * 
 * FUTURE BEHAVIOR (I18N_ENABLED = true):
 * - Detects user's preferred language from Accept-Language header
 * - Persists language preference in NEXT_LOCALE cookie
 * - Redirects to appropriate locale prefix (/de/, /fr/)
 * - English URLs remain at root (no /en/ prefix) as canonical
 * 
 * URL STRUCTURE:
 * - English (canonical):  plain.tools/tools/merge-pdf
 * - German:               plain.tools/de/tools/merge-pdf
 * - French:               plain.tools/fr/tools/merge-pdf
 * 
 * SAFEGUARDS:
 * - Only redirects to locales marked as ready (localeReady[lang] = true)
 * - Invalid locale prefixes redirect to English
 * - Static files and API routes are never intercepted
 * 
 * To enable multilingual support, see lib/i18n/ROLLOUT_STRATEGY.md
 * 
 * ============================================================================
 */

import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import {
  I18N_ENABLED,
  defaultLocale,
  locales,
  isValidLocale,
  getActiveLocales,
  type Locale,
} from "@/lib/i18n"

/**
 * Get preferred locale from request headers
 */
function getPreferredLocale(request: NextRequest): Locale {
  // Check cookie first
  const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value
  if (cookieLocale && isValidLocale(cookieLocale)) {
    return cookieLocale
  }

  // Parse Accept-Language header
  const acceptLanguage = request.headers.get("accept-language")
  if (acceptLanguage) {
    const activeLocales = getActiveLocales()
    const preferredLanguages = acceptLanguage
      .split(",")
      .map((lang) => lang.split(";")[0].trim().substring(0, 2).toLowerCase())

    for (const lang of preferredLanguages) {
      if (activeLocales.includes(lang as Locale)) {
        return lang as Locale
      }
    }
  }

  return defaultLocale
}

/**
 * i18n Middleware Handler
 */
function i18nMiddleware(request: NextRequest): NextResponse {
  const pathname = request.nextUrl.pathname

  // Skip static files and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".") ||
    pathname.startsWith("/opengraph-image")
  ) {
    return NextResponse.next()
  }

  // Check if pathname has a locale prefix
  const pathnameLocale = locales.find(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameLocale) {
    // Valid locale in URL - set cookie and continue
    const response = NextResponse.next()
    response.cookies.set("NEXT_LOCALE", pathnameLocale, {
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: "/",
    })
    return response
  }

  // No locale in URL - redirect to preferred locale
  const preferredLocale = getPreferredLocale(request)

  // For default locale, don't add prefix (canonical URLs)
  if (preferredLocale === defaultLocale) {
    return NextResponse.next()
  }

  // Redirect to localized URL
  const url = request.nextUrl.clone()
  url.pathname = `/${preferredLocale}${pathname}`
  
  const response = NextResponse.redirect(url)
  response.cookies.set("NEXT_LOCALE", preferredLocale, {
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
  })
  return response
}

/**
 * Middleware Export
 * 
 * Currently disabled. Uncomment to enable i18n routing.
 */
export function middleware(request: NextRequest): NextResponse {
  // i18n is disabled - pass through all requests
  if (!I18N_ENABLED) {
    return NextResponse.next()
  }

  return i18nMiddleware(request)
}

export const config = {
  // Match all paths except static files
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
}
