export type AdSlotType =
  | "TOP_LEADERBOARD"
  | "CONTENT_TOP"
  | "CONTENT_MID"
  | "CONTENT_BOTTOM"
  | "SIDEBAR"
  | "RESULT_AFTER"
  | "FOOTER_TOP"

type AdSlotDefinition = {
  slotName: AdSlotType
  recommendedSize: string
  responsiveBehavior: string
  minHeight: number
  desktopOnly?: boolean
}

export const AD_SLOT_DEFINITIONS: Record<AdSlotType, AdSlotDefinition> = {
  TOP_LEADERBOARD: {
    slotName: "TOP_LEADERBOARD",
    recommendedSize: "728x90",
    responsiveBehavior: "Responsive leaderboard on desktop, responsive banner fallback on smaller screens.",
    minHeight: 90,
  },
  CONTENT_TOP: {
    slotName: "CONTENT_TOP",
    recommendedSize: "Responsive rectangle",
    responsiveBehavior: "Responsive rectangle with full-width layout support across desktop and mobile.",
    minHeight: 300,
  },
  CONTENT_MID: {
    slotName: "CONTENT_MID",
    recommendedSize: "Responsive rectangle",
    responsiveBehavior: "Responsive rectangle intended for below-the-fold article and hub sections.",
    minHeight: 300,
  },
  CONTENT_BOTTOM: {
    slotName: "CONTENT_BOTTOM",
    recommendedSize: "Responsive rectangle",
    responsiveBehavior: "Responsive rectangle placed late in the page to avoid interrupting core tasks.",
    minHeight: 300,
  },
  SIDEBAR: {
    slotName: "SIDEBAR",
    recommendedSize: "300x250",
    responsiveBehavior: "Desktop-only sidebar unit hidden on mobile and narrow tablet layouts.",
    minHeight: 250,
    desktopOnly: true,
  },
  RESULT_AFTER: {
    slotName: "RESULT_AFTER",
    recommendedSize: "Responsive rectangle",
    responsiveBehavior: "Responsive rectangle placed after the result or answer block.",
    minHeight: 300,
  },
  FOOTER_TOP: {
    slotName: "FOOTER_TOP",
    recommendedSize: "728x90",
    responsiveBehavior: "Responsive leaderboard reserved for gentle late-page monetisation.",
    minHeight: 90,
  },
}

export function getAdSlotDefinition(slotType: AdSlotType) {
  return AD_SLOT_DEFINITIONS[slotType]
}
