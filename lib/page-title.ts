export const BRAND_TITLE = "Plain Tools"

export function buildStandardPageTitle(sectionOrToolName: string): string {
  return `${sectionOrToolName} – Local & Private | ${BRAND_TITLE}`
}

export function normalizeBrandCapitalization(value: string): string {
  return value.replace(/plain\.tools/gi, BRAND_TITLE)
}
