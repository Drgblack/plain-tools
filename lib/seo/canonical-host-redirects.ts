export type RedirectCondition = {
  type: string
  key?: string
  value?: string
}

export type RedirectRule = {
  source: string
  destination: string
  permanent: boolean
  basePath?: false
  locale?: false
  has?: RedirectCondition[]
  missing?: RedirectCondition[]
}

export const CANONICAL_HOST = "plain.tools"
export const WWW_HOST = "www.plain.tools"
export const CANONICAL_ORIGIN = `https://${CANONICAL_HOST}`

const WWW_HOST_CONDITION: RedirectCondition = {
  type: "host",
  value: WWW_HOST,
}

const COMPARE_NAMESPACE_ROOTS = [
  "/comparisons",
  "/pdf-tools/compare",
  "/pdf-tools/comparisons",
] as const

const COMPARE_ALIAS_TARGETS = [
  {
    sourceSlug: "plain-vs-adobe-acrobat",
    destination: "/compare/plain-tools-vs-adobe-acrobat-online",
  },
  {
    sourceSlug: "plain-vs-smallpdf",
    destination: "/compare/plain-tools-vs-smallpdf",
  },
  {
    sourceSlug: "plain-vs-ilovepdf",
    destination: "/compare/plain-tools-vs-ilovepdf",
  },
  {
    sourceSlug: "plain-tools-vs-adobe-online",
    destination: "/compare/plain-tools-vs-adobe-acrobat-online",
  },
  {
    sourceSlug: "plain-vs-adobe-acrobat-online",
    destination: "/compare/plain-tools-vs-adobe-acrobat-online",
  },
  {
    sourceSlug: "plain-vs-pdf24",
    destination: "/compare/plain-tools-vs-pdf24",
  },
  {
    sourceSlug: "plain-vs-sejda",
    destination: "/compare/plain-tools-vs-sejda",
  },
  {
    sourceSlug: "plain-vs-online-pdf-tools",
    destination: "/compare/offline-vs-online-pdf-tools",
  },
] as const

function toAbsoluteCanonicalDestination(destination: string) {
  if (/^https?:\/\//.test(destination)) {
    return destination
  }

  return `${CANONICAL_ORIGIN}${destination}`
}

function withWwwHostCanonicalDestination(rule: RedirectRule): RedirectRule {
  return {
    ...rule,
    destination: toAbsoluteCanonicalDestination(rule.destination),
    has: [...(rule.has ?? []), WWW_HOST_CONDITION],
  }
}

function buildCompareNamespaceCanonicalRedirects(): RedirectRule[] {
  return COMPARE_NAMESPACE_ROOTS.flatMap((root) =>
    COMPARE_ALIAS_TARGETS.map(({ sourceSlug, destination }) => ({
      source: `${root}/${sourceSlug}`,
      destination: toAbsoluteCanonicalDestination(destination),
      permanent: true,
      has: [WWW_HOST_CONDITION],
    }))
  )
}

export function buildCanonicalHostRedirects(baseRedirects: readonly RedirectRule[]): RedirectRule[] {
  const wwwScopedLegacyRedirects = baseRedirects
    .filter((rule) => rule.destination.startsWith("/"))
    .map(withWwwHostCanonicalDestination)

  return [
    ...buildCompareNamespaceCanonicalRedirects(),
    ...wwwScopedLegacyRedirects,
    {
      source: "/",
      destination: `${CANONICAL_ORIGIN}/`,
      permanent: true,
      has: [WWW_HOST_CONDITION],
    },
    {
      source: "/:path*",
      destination: `${CANONICAL_ORIGIN}/:path*`,
      permanent: true,
      has: [WWW_HOST_CONDITION],
    },
  ]
}
