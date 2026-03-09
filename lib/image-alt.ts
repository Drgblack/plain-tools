export const FUTURE_IMAGE_ALT_STUB =
  "Plain Tools image. Replace with a descriptive alt text before publishing."

export function getImageAltTextOrStub(alt?: string) {
  const trimmed = alt?.trim()
  if (trimmed) return trimmed
  return FUTURE_IMAGE_ALT_STUB
}
