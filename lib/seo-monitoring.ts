import type { Metadata } from "next"

const trimEnv = (value: string | undefined) => value?.trim() || ""

function readFirstNonEmpty(...values: Array<string | undefined>) {
  for (const value of values) {
    const trimmed = trimEnv(value)
    if (trimmed) return trimmed
  }
  return ""
}

export function buildSiteVerificationMetadata(): Metadata["verification"] | undefined {
  const google = readFirstNonEmpty(
    process.env.GOOGLE_SITE_VERIFICATION,
    process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
  )
  const bing = readFirstNonEmpty(
    process.env.BING_SITE_VERIFICATION,
    process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
  )

  const verification: NonNullable<Metadata["verification"]> = {}
  if (google) {
    verification.google = google
  }
  if (bing) {
    verification.other = {
      ...(verification.other ?? {}),
      "msvalidate.01": [bing],
    }
  }

  return Object.keys(verification).length > 0 ? verification : undefined
}

export function getIndexNowKey() {
  return readFirstNonEmpty(process.env.INDEXNOW_KEY, process.env.NEXT_PUBLIC_INDEXNOW_KEY)
}

