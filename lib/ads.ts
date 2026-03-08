import { getAdSlotDefinition, type AdSlotType } from "@/lib/ad-slots"

export type AdMode = "manual" | "auto"

export type AdPageType =
  | "global"
  | "homepage"
  | "tools"
  | "status"
  | "guide"
  | "compare"

export type AdPlacement =
  | "homepage_content_top"
  | "homepage_content_bottom"
  | "tools_hub_content_top"
  | "tools_hub_content_bottom"
  | "tool_content_top"
  | "tool_result_after"
  | "tool_sidebar"
  | "guide_hub_content_top"
  | "guide_hub_content_bottom"
  | "guide_content_top"
  | "guide_content_mid"
  | "guide_content_bottom"
  | "compare_hub_content_top"
  | "compare_hub_content_bottom"
  | "compare_content_top"
  | "compare_content_mid"
  | "compare_content_bottom"
  | "status_hub_content_top"
  | "status_hub_content_mid"
  | "status_result_after"
  | "status_content_mid"
  | "footer_top"

type AdPlacementConfig = {
  label: string
  pageType: AdPageType
  slotType: AdSlotType
  slotId?: string
  priority?: "eager" | "lazy"
  desktopOnly?: boolean
}

function readEnv(...keys: string[]) {
  for (const key of keys) {
    const value = process.env[key]?.trim()
    if (value) return value
  }
  return undefined
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
const showAdBlockSupportNotice =
  (process.env.NEXT_PUBLIC_ADS_SHOW_ADBLOCK_NOTICE ?? "").trim() === "true"

const adSlotIds: Partial<Record<AdPlacement, string>> = {
  homepage_content_top: readEnv(
    "NEXT_PUBLIC_AD_SLOT_HOMEPAGE_CONTENT_TOP",
    "NEXT_PUBLIC_AD_SLOT_HOMEPAGE_HERO_BELOW"
  ),
  homepage_content_bottom: readEnv(
    "NEXT_PUBLIC_AD_SLOT_HOMEPAGE_CONTENT_BOTTOM",
    "NEXT_PUBLIC_AD_SLOT_HOMEPAGE_MID"
  ),
  tools_hub_content_top: readEnv(
    "NEXT_PUBLIC_AD_SLOT_TOOLS_HUB_CONTENT_TOP",
    "NEXT_PUBLIC_AD_SLOT_TOOLS_HUB_INTRO_BELOW"
  ),
  tools_hub_content_bottom: readEnv(
    "NEXT_PUBLIC_AD_SLOT_TOOLS_HUB_CONTENT_BOTTOM",
    "NEXT_PUBLIC_AD_SLOT_TOOLS_HUB_MID"
  ),
  tool_content_top: readEnv(
    "NEXT_PUBLIC_AD_SLOT_TOOL_CONTENT_TOP",
    "NEXT_PUBLIC_AD_SLOT_TOOLS_HEADER_BELOW"
  ),
  tool_result_after: readEnv(
    "NEXT_PUBLIC_AD_SLOT_TOOL_RESULT_AFTER",
    "NEXT_PUBLIC_AD_SLOT_TOOLS_AFTER_RESULT"
  ),
  tool_sidebar: readEnv(
    "NEXT_PUBLIC_AD_SLOT_TOOL_SIDEBAR",
    "NEXT_PUBLIC_AD_SLOT_TOOLS_SIDEBAR"
  ),
  guide_hub_content_top: readEnv("NEXT_PUBLIC_AD_SLOT_GUIDE_HUB_CONTENT_TOP"),
  guide_hub_content_bottom: readEnv("NEXT_PUBLIC_AD_SLOT_GUIDE_HUB_CONTENT_BOTTOM"),
  guide_content_top: readEnv(
    "NEXT_PUBLIC_AD_SLOT_GUIDE_CONTENT_TOP",
    "NEXT_PUBLIC_AD_SLOT_GUIDE_INTRO_BELOW"
  ),
  guide_content_mid: readEnv(
    "NEXT_PUBLIC_AD_SLOT_GUIDE_CONTENT_MID",
    "NEXT_PUBLIC_AD_SLOT_GUIDE_MID"
  ),
  guide_content_bottom: readEnv("NEXT_PUBLIC_AD_SLOT_GUIDE_CONTENT_BOTTOM"),
  compare_hub_content_top: readEnv(
    "NEXT_PUBLIC_AD_SLOT_COMPARE_HUB_CONTENT_TOP",
    "NEXT_PUBLIC_AD_SLOT_COMPARE_HUB_INTRO_BELOW"
  ),
  compare_hub_content_bottom: readEnv(
    "NEXT_PUBLIC_AD_SLOT_COMPARE_HUB_CONTENT_BOTTOM",
    "NEXT_PUBLIC_AD_SLOT_COMPARE_HUB_MID"
  ),
  compare_content_top: readEnv("NEXT_PUBLIC_AD_SLOT_COMPARE_CONTENT_TOP"),
  compare_content_mid: readEnv(
    "NEXT_PUBLIC_AD_SLOT_COMPARE_CONTENT_MID",
    "NEXT_PUBLIC_AD_SLOT_COMPARE_TABLE_BELOW"
  ),
  compare_content_bottom: readEnv("NEXT_PUBLIC_AD_SLOT_COMPARE_CONTENT_BOTTOM"),
  status_hub_content_top: readEnv(
    "NEXT_PUBLIC_AD_SLOT_STATUS_HUB_CONTENT_TOP",
    "NEXT_PUBLIC_AD_SLOT_STATUS_HUB_INTRO_BELOW"
  ),
  status_hub_content_mid: readEnv(
    "NEXT_PUBLIC_AD_SLOT_STATUS_HUB_CONTENT_MID",
    "NEXT_PUBLIC_AD_SLOT_STATUS_HUB_MID"
  ),
  status_result_after: readEnv(
    "NEXT_PUBLIC_AD_SLOT_STATUS_RESULT_AFTER",
    "NEXT_PUBLIC_AD_SLOT_STATUS_RESULT_BELOW"
  ),
  status_content_mid: readEnv(
    "NEXT_PUBLIC_AD_SLOT_STATUS_CONTENT_MID",
    "NEXT_PUBLIC_AD_SLOT_STATUS_MID"
  ),
  footer_top: readEnv("NEXT_PUBLIC_AD_SLOT_FOOTER_TOP"),
}

export const adsConfig = {
  publisherId,
  clientId: `ca-${publisherId}`,
  enabled: adsEnabled,
  mode: adsMode as AdMode,
  showPlaceholders,
  cmpReady,
  showAdBlockSupportNotice,
  consentMode: cmpReady ? "cmp-ready" : "non-personalized-until-cmp",
  renderLiveAds: adsEnabled && process.env.NODE_ENV === "production",
} as const

export const AD_PLACEMENTS: Record<AdPlacement, AdPlacementConfig> = {
  homepage_content_top: {
    label: "Homepage content top",
    pageType: "homepage",
    slotType: "CONTENT_TOP",
    slotId: adSlotIds.homepage_content_top,
    priority: "eager",
  },
  homepage_content_bottom: {
    label: "Homepage content bottom",
    pageType: "homepage",
    slotType: "CONTENT_BOTTOM",
    slotId: adSlotIds.homepage_content_bottom,
    priority: "lazy",
  },
  tools_hub_content_top: {
    label: "Tools hub content top",
    pageType: "tools",
    slotType: "CONTENT_TOP",
    slotId: adSlotIds.tools_hub_content_top,
    priority: "eager",
  },
  tools_hub_content_bottom: {
    label: "Tools hub content bottom",
    pageType: "tools",
    slotType: "CONTENT_BOTTOM",
    slotId: adSlotIds.tools_hub_content_bottom,
    priority: "lazy",
  },
  tool_content_top: {
    label: "Tool content top",
    pageType: "tools",
    slotType: "CONTENT_TOP",
    slotId: adSlotIds.tool_content_top,
    priority: "eager",
  },
  tool_result_after: {
    label: "Tool result after",
    pageType: "tools",
    slotType: "RESULT_AFTER",
    slotId: adSlotIds.tool_result_after,
    priority: "lazy",
  },
  tool_sidebar: {
    label: "Tool sidebar",
    pageType: "tools",
    slotType: "SIDEBAR",
    slotId: adSlotIds.tool_sidebar,
    priority: "lazy",
    desktopOnly: true,
  },
  guide_hub_content_top: {
    label: "Guide hub content top",
    pageType: "guide",
    slotType: "CONTENT_TOP",
    slotId: adSlotIds.guide_hub_content_top,
    priority: "eager",
  },
  guide_hub_content_bottom: {
    label: "Guide hub content bottom",
    pageType: "guide",
    slotType: "CONTENT_BOTTOM",
    slotId: adSlotIds.guide_hub_content_bottom,
    priority: "lazy",
  },
  guide_content_top: {
    label: "Guide content top",
    pageType: "guide",
    slotType: "CONTENT_TOP",
    slotId: adSlotIds.guide_content_top,
    priority: "eager",
  },
  guide_content_mid: {
    label: "Guide content mid",
    pageType: "guide",
    slotType: "CONTENT_MID",
    slotId: adSlotIds.guide_content_mid,
    priority: "lazy",
  },
  guide_content_bottom: {
    label: "Guide content bottom",
    pageType: "guide",
    slotType: "CONTENT_BOTTOM",
    slotId: adSlotIds.guide_content_bottom,
    priority: "lazy",
  },
  compare_hub_content_top: {
    label: "Compare hub content top",
    pageType: "compare",
    slotType: "CONTENT_TOP",
    slotId: adSlotIds.compare_hub_content_top,
    priority: "eager",
  },
  compare_hub_content_bottom: {
    label: "Compare hub content bottom",
    pageType: "compare",
    slotType: "CONTENT_BOTTOM",
    slotId: adSlotIds.compare_hub_content_bottom,
    priority: "lazy",
  },
  compare_content_top: {
    label: "Compare content top",
    pageType: "compare",
    slotType: "CONTENT_TOP",
    slotId: adSlotIds.compare_content_top,
    priority: "eager",
  },
  compare_content_mid: {
    label: "Compare content mid",
    pageType: "compare",
    slotType: "CONTENT_MID",
    slotId: adSlotIds.compare_content_mid,
    priority: "lazy",
  },
  compare_content_bottom: {
    label: "Compare content bottom",
    pageType: "compare",
    slotType: "CONTENT_BOTTOM",
    slotId: adSlotIds.compare_content_bottom,
    priority: "lazy",
  },
  status_hub_content_top: {
    label: "Status hub content top",
    pageType: "status",
    slotType: "CONTENT_TOP",
    slotId: adSlotIds.status_hub_content_top,
    priority: "eager",
  },
  status_hub_content_mid: {
    label: "Status hub content mid",
    pageType: "status",
    slotType: "CONTENT_MID",
    slotId: adSlotIds.status_hub_content_mid,
    priority: "lazy",
  },
  status_result_after: {
    label: "Status result after",
    pageType: "status",
    slotType: "RESULT_AFTER",
    slotId: adSlotIds.status_result_after,
    priority: "lazy",
  },
  status_content_mid: {
    label: "Status content mid",
    pageType: "status",
    slotType: "CONTENT_MID",
    slotId: adSlotIds.status_content_mid,
    priority: "lazy",
  },
  footer_top: {
    label: "Footer top",
    pageType: "global",
    slotType: "FOOTER_TOP",
    slotId: adSlotIds.footer_top,
    priority: "lazy",
  },
}

export function getAdPlacementConfig(placement: AdPlacement) {
  return AD_PLACEMENTS[placement]
}

export function getAdSlotConfigForPlacement(placement: AdPlacement) {
  return getAdSlotDefinition(AD_PLACEMENTS[placement].slotType)
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
