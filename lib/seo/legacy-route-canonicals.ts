export const LEGACY_CANONICAL_REDIRECTS = {
  "/compress-pdf": "/tools/compress-pdf",
  "/pdf-merge": "/tools/merge-pdf",
  "/pdf-to-word": "/tools/pdf-to-word",
} as const

export type LegacyCanonicalSourcePath = keyof typeof LEGACY_CANONICAL_REDIRECTS

export function getLegacyCanonicalRedirect(path: string) {
  return LEGACY_CANONICAL_REDIRECTS[path as LegacyCanonicalSourcePath] ?? null
}
