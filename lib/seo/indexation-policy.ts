import type { Metadata } from "next"

export const NOINDEX_EXACT_PATHS = new Set([
  "/faq",
  "/html-sitemap",
  "/labs",
])

type IndexationPolicy = {
  follow: boolean
  index: boolean
}

export function getIndexationPolicy(path: string): IndexationPolicy | null {
  if (NOINDEX_EXACT_PATHS.has(path)) {
    return {
      index: false,
      follow: true,
    }
  }

  return null
}

export function applyIndexationPolicy(metadata: Metadata, path: string): Metadata {
  const policy = getIndexationPolicy(path)
  if (!policy) return metadata

  return {
    ...metadata,
    robots: {
      ...policy,
      googleBot: {
        ...policy,
      },
    },
  }
}

export function isIndexablePath(path: string) {
  return !NOINDEX_EXACT_PATHS.has(path)
}
