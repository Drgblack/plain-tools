import { describe, expect, it } from "vitest"

import {
  buildCanonicalHostRedirects,
  CANONICAL_ORIGIN,
  WWW_HOST,
  type RedirectRule,
} from "@/lib/seo/canonical-host-redirects"

// Reuse Next.js' path matching implementation so the regression test follows
// the same precedence rules the runtime uses for redirects.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { compile, match } = require("next/dist/compiled/path-to-regexp") as {
  compile: (path: string, options?: { encode?: (value: string) => string }) => (params?: Record<string, unknown>) => string
  match: (path: string, options?: { decode?: (value: string) => string }) => (input: string) => false | { params: Record<string, unknown> }
}

const baseRedirects: RedirectRule[] = [
  { source: "/pdf-tools", destination: "/tools", permanent: true },
  { source: "/pdf-tools/tools/:path*", destination: "/tools/:path*", permanent: true },
  { source: "/pdf-tools/compare/:path*", destination: "/compare/:path*", permanent: true },
  { source: "/pdf-tools/comparisons/:path*", destination: "/compare/:path*", permanent: true },
  { source: "/compare/plain-vs-smallpdf", destination: "/compare/plain-tools-vs-smallpdf", permanent: true },
  { source: "/compare/plain-vs-adobe-acrobat", destination: "/compare/plain-tools-vs-adobe-acrobat-online", permanent: true },
  { source: "/comparisons/:path*", destination: "/compare/:path*", permanent: true },
  { source: "/file-converters/pdf-to-word", destination: "/tools/pdf-to-word", permanent: true },
]

function destinationFromRule(rule: RedirectRule, url: URL, params: Record<string, unknown>) {
  const originalSearch = url.search
  const absoluteDestination = /^https?:\/\//.test(rule.destination)

  const fillPath = (pattern: string) =>
    compile(pattern, {
      encode: (value) => value,
    })(params)

  if (absoluteDestination) {
    const targetUrl = new URL(rule.destination)
    targetUrl.pathname = fillPath(targetUrl.pathname)
    targetUrl.search = originalSearch
    return targetUrl.toString()
  }

  const targetUrl = new URL(fillPath(rule.destination), url)
  targetUrl.search = originalSearch
  return targetUrl.toString()
}

function applyFirstRedirect(urlString: string, rules: readonly RedirectRule[]) {
  const url = new URL(urlString)

  for (const rule of rules) {
    const hostCondition = rule.has?.find((condition) => condition.type === "host")
    if (hostCondition?.value && hostCondition.value !== url.host) {
      continue
    }

    const matched = match(rule.source, {
      decode: (value) => value,
    })(url.pathname)

    if (!matched) {
      continue
    }

    return destinationFromRule(rule, url, matched.params)
  }

  return null
}

function resolveRedirectChain(url: string, rules: readonly RedirectRule[]) {
  const visited: string[] = [url]
  let current = url

  for (let step = 0; step < 10; step += 1) {
    const next = applyFirstRedirect(current, rules)
    if (!next) {
      return visited
    }

    if (visited.includes(next)) {
      throw new Error(`Redirect loop detected for ${url}: ${visited.join(" -> ")} -> ${next}`)
    }

    visited.push(next)
    current = next
  }

  throw new Error(`Redirect chain exceeded max hops for ${url}: ${visited.join(" -> ")}`)
}

describe("canonical host redirects", () => {
  const redirects = [...buildCanonicalHostRedirects(baseRedirects), ...baseRedirects]

  it("never emits a redirect back to the www host", () => {
    const wwwDestinations = redirects.filter((rule) => rule.destination.includes(`https://${WWW_HOST}`))
    expect(wwwDestinations).toHaveLength(0)
  })

  it("keeps apex requests stable and redirects www requests to apex in one hop", () => {
    expect(resolveRedirectChain("https://plain.tools/", redirects)).toEqual(["https://plain.tools/"])

    expect(resolveRedirectChain("https://www.plain.tools/tools/pdf-to-word?x=1", redirects)).toEqual([
      "https://www.plain.tools/tools/pdf-to-word?x=1",
      `${CANONICAL_ORIGIN}/tools/pdf-to-word?x=1`,
    ])
  })

  it("collapses representative legacy namespaces directly to final canonical urls", () => {
    expect(resolveRedirectChain("https://www.plain.tools/file-converters/pdf-to-word?x=1", redirects)).toEqual([
      "https://www.plain.tools/file-converters/pdf-to-word?x=1",
      `${CANONICAL_ORIGIN}/tools/pdf-to-word?x=1`,
    ])

    expect(resolveRedirectChain("https://www.plain.tools/pdf-tools", redirects)).toEqual([
      "https://www.plain.tools/pdf-tools",
      `${CANONICAL_ORIGIN}/tools`,
    ])

    expect(resolveRedirectChain("https://www.plain.tools/compare/plain-vs-smallpdf", redirects)).toEqual([
      "https://www.plain.tools/compare/plain-vs-smallpdf",
      `${CANONICAL_ORIGIN}/compare/plain-tools-vs-smallpdf`,
    ])

    expect(resolveRedirectChain("https://www.plain.tools/comparisons/plain-vs-adobe-acrobat", redirects)).toEqual([
      "https://www.plain.tools/comparisons/plain-vs-adobe-acrobat",
      `${CANONICAL_ORIGIN}/compare/plain-tools-vs-adobe-acrobat-online`,
    ])

    expect(resolveRedirectChain("https://www.plain.tools/pdf-tools/compare/plain-vs-smallpdf", redirects)).toEqual([
      "https://www.plain.tools/pdf-tools/compare/plain-vs-smallpdf",
      `${CANONICAL_ORIGIN}/compare/plain-tools-vs-smallpdf`,
    ])
  })
})
