export type AdMode = "manual" | "auto"

export type AdPageType =
  | "global"
  | "homepage"
  | "tools"
  | "status"
  | "guide"
  | "compare"

export type AdPlacement =
  | "homepage_hero_below"
  | "homepage_mid"
  | "tools_hub_intro_below"
  | "tools_hub_mid"
  | "tools_header_below"
  | "tools_after_result"
  | "tools_sidebar"
  | "guide_intro_below"
  | "guide_mid"
  | "compare_hub_intro_below"
  | "compare_hub_mid"
  | "compare_table_below"
  | "status_hub_intro_below"
  | "status_hub_mid"
  | "status_result_below"
  | "status_mid"
  | "footer_top"

type AdPlacementConfig = {
  label: string
  pageType: AdPageType
  minHeight: number
  slotId?: string
  priority?: "eager" | "lazy"
  desktopOnly?: boolean
}

function normalizePublisherId(value: string | undefined) {
  const trimmed = value?.trim()
  if (!trimmed) return "pub-6207224775263883"
  return trimmed.startsWith("ca-") ? trimmed.slice(3) : trimmed
}

const publisherId = normalizePublisherId(process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID)
const adsEnabled = (process.env.NEXT_PUBLIC_ADS_ENABLED ?? "true").trim() !== "false"
const adsMode = (process.env.NEXT_PUBLIC_ADS_MODE ?? "manual").trim() === "auto" ? "auto" : "manual"
const showPlaceholders =
  (process.env.NEXT_PUBLIC_ADS_SHOW_PLACEHOLDERS ?? "").trim() === "true" ||
  process.env.NODE_ENV !== "production"
const cmpReady = (process.env.NEXT_PUBLIC_ADS_CMP_READY ?? "").trim() === "true"

const adSlotIds: Partial<Record<AdPlacement, string>> = {
  homepage_hero_below: process.env.NEXT_PUBLIC_AD_SLOT_HOMEPAGE_HERO_BELOW?.trim(),
  homepage_mid: process.env.NEXT_PUBLIC_AD_SLOT_HOMEPAGE_MID?.trim(),
  tools_hub_intro_below: process.env.NEXT_PUBLIC_AD_SLOT_TOOLS_HUB_INTRO_BELOW?.trim(),
  tools_hub_mid: process.env.NEXT_PUBLIC_AD_SLOT_TOOLS_HUB_MID?.trim(),
  tools_header_below: process.env.NEXT_PUBLIC_AD_SLOT_TOOLS_HEADER_BELOW?.trim(),
  tools_after_result: process.env.NEXT_PUBLIC_AD_SLOT_TOOLS_AFTER_RESULT?.trim(),
  tools_sidebar: process.env.NEXT_PUBLIC_AD_SLOT_TOOLS_SIDEBAR?.trim(),
  guide_intro_below: process.env.NEXT_PUBLIC_AD_SLOT_GUIDE_INTRO_BELOW?.trim(),
  guide_mid: process.env.NEXT_PUBLIC_AD_SLOT_GUIDE_MID?.trim(),
  compare_hub_intro_below: process.env.NEXT_PUBLIC_AD_SLOT_COMPARE_HUB_INTRO_BELOW?.trim(),
  compare_hub_mid: process.env.NEXT_PUBLIC_AD_SLOT_COMPARE_HUB_MID?.trim(),
  compare_table_below: process.env.NEXT_PUBLIC_AD_SLOT_COMPARE_TABLE_BELOW?.trim(),
  status_hub_intro_below: process.env.NEXT_PUBLIC_AD_SLOT_STATUS_HUB_INTRO_BELOW?.trim(),
  status_hub_mid: process.env.NEXT_PUBLIC_AD_SLOT_STATUS_HUB_MID?.trim(),
  status_result_below: process.env.NEXT_PUBLIC_AD_SLOT_STATUS_RESULT_BELOW?.trim(),
  status_mid: process.env.NEXT_PUBLIC_AD_SLOT_STATUS_MID?.trim(),
  footer_top: process.env.NEXT_PUBLIC_AD_SLOT_FOOTER_TOP?.trim(),
}

export const adsConfig = {
  publisherId,
  clientId: `ca-${publisherId}`,
  enabled: adsEnabled,
  mode: adsMode as AdMode,
  showPlaceholders,
  cmpReady,
  consentMode: cmpReady ? "cmp-ready" : "non-personalized-until-cmp",
  renderLiveAds: adsEnabled && process.env.NODE_ENV === "production",
} as const

export const AD_PLACEMENTS: Record<AdPlacement, AdPlacementConfig> = {
  homepage_hero_below: {
    label: "Homepage hero below",
    pageType: "homepage",
    minHeight: 280,
    slotId: adSlotIds.homepage_hero_below,
    priority: "eager",
  },
  homepage_mid: {
    label: "Homepage mid-page",
    pageType: "homepage",
    minHeight: 280,
    slotId: adSlotIds.homepage_mid,
    priority: "lazy",
  },
  tools_hub_intro_below: {
    label: "Tools hub intro below",
    pageType: "tools",
    minHeight: 280,
    slotId: adSlotIds.tools_hub_intro_below,
    priority: "eager",
  },
  tools_hub_mid: {
    label: "Tools hub lower listing ad",
    pageType: "tools",
    minHeight: 280,
    slotId: adSlotIds.tools_hub_mid,
    priority: "lazy",
  },
  tools_header_below: {
    label: "Tool header below",
    pageType: "tools",
    minHeight: 280,
    slotId: adSlotIds.tools_header_below,
    priority: "eager",
  },
  tools_after_result: {
    label: "Tool result below",
    pageType: "tools",
    minHeight: 280,
    slotId: adSlotIds.tools_after_result,
    priority: "lazy",
  },
  tools_sidebar: {
    label: "Tool sidebar",
    pageType: "tools",
    minHeight: 600,
    slotId: adSlotIds.tools_sidebar,
    priority: "lazy",
    desktopOnly: true,
  },
  guide_intro_below: {
    label: "Guide intro below",
    pageType: "guide",
    minHeight: 280,
    slotId: adSlotIds.guide_intro_below,
    priority: "eager",
  },
  guide_mid: {
    label: "Guide mid-article",
    pageType: "guide",
    minHeight: 280,
    slotId: adSlotIds.guide_mid,
    priority: "lazy",
  },
  compare_hub_intro_below: {
    label: "Compare hub intro below",
    pageType: "compare",
    minHeight: 280,
    slotId: adSlotIds.compare_hub_intro_below,
    priority: "eager",
  },
  compare_hub_mid: {
    label: "Compare hub mid-page",
    pageType: "compare",
    minHeight: 280,
    slotId: adSlotIds.compare_hub_mid,
    priority: "lazy",
  },
  compare_table_below: {
    label: "Compare table below",
    pageType: "compare",
    minHeight: 280,
    slotId: adSlotIds.compare_table_below,
    priority: "lazy",
  },
  status_hub_intro_below: {
    label: "Status hub intro below",
    pageType: "status",
    minHeight: 280,
    slotId: adSlotIds.status_hub_intro_below,
    priority: "eager",
  },
  status_hub_mid: {
    label: "Status hub mid-page",
    pageType: "status",
    minHeight: 280,
    slotId: adSlotIds.status_hub_mid,
    priority: "lazy",
  },
  status_result_below: {
    label: "Status result below",
    pageType: "status",
    minHeight: 280,
    slotId: adSlotIds.status_result_below,
    priority: "lazy",
  },
  status_mid: {
    label: "Status mid-page",
    pageType: "status",
    minHeight: 280,
    slotId: adSlotIds.status_mid,
    priority: "lazy",
  },
  footer_top: {
    label: "Footer top",
    pageType: "global",
    minHeight: 250,
    slotId: adSlotIds.footer_top,
    priority: "lazy",
  },
}

export function getAdPlacementConfig(placement: AdPlacement) {
  return AD_PLACEMENTS[placement]
}

export function hasConfiguredManualAdSlot(placement: AdPlacement) {
  return Boolean(AD_PLACEMENTS[placement].slotId)
}

export function shouldShowAdPlacement(placement: AdPlacement) {
  if (!adsConfig.enabled) {
    return adsConfig.showPlaceholders
  }

  if (adsConfig.mode === "auto") {
    return adsConfig.showPlaceholders
  }

  if (adsConfig.renderLiveAds && hasConfiguredManualAdSlot(placement)) {
    return true
  }

  return adsConfig.showPlaceholders
}

export function shouldRenderLiveAd(placement: AdPlacement) {
  return (
    adsConfig.enabled &&
    adsConfig.mode === "manual" &&
    adsConfig.renderLiveAds &&
    hasConfiguredManualAdSlot(placement)
  )
}

export function shouldLoadAdsScript() {
  if (!adsConfig.enabled) return false
  if (adsConfig.mode === "auto") return true
  return true
}
