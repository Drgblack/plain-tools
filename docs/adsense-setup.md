# AdSense Setup

## Files and entry points

- `public/ads.txt`
  Contains the site-level AdSense publisher declaration and is served at `/ads.txt`.
- `lib/ads.ts`
  Central ad configuration, placement registry, environment gating, and mode switching.
- `lib/ad-slots.ts`
  Standard slot type definitions used across the site for consistent size and responsive behaviour.
- `components/ads/adsense-script.tsx`
  Loads the AdSense runtime once in the shared layout and exposes the consent/CMP integration point.
- `components/ads/ad-slot.tsx`
  Named placement component for manual AdSense slots.
- `components/ads/ad-layout.tsx`
  Page-width wrapper for ad sections on hubs and long-form pages.
- `components/ads/ad-placeholder.tsx`
  Development and unconfigured-slot placeholder.
- `app/layout.tsx`
  Shared script injection. This is the only place the AdSense script should load.

## Publisher configuration

- Publisher ID is configured in `lib/ads.ts`.
- Default publisher ID: `pub-6207224775263883`
- Override with:
  - `NEXT_PUBLIC_ADSENSE_PUBLISHER_ID`

## Enable or disable ads

- `NEXT_PUBLIC_ADS_ENABLED=true|false`
  Master ad toggle.
- `NEXT_PUBLIC_ADS_MODE=manual|auto`
  `manual` renders named placements.
  `auto` loads only the AdSense script so Google Auto ads can be tested later.
- `NEXT_PUBLIC_ADS_SHOW_PLACEHOLDERS=true|false`
  Show safe placeholders when live slots are not configured.
- `NEXT_PUBLIC_ADS_CMP_READY=true|false`
  Signals whether a proper CMP integration is in place.
- `NEXT_PUBLIC_ADS_SHOW_ADBLOCK_NOTICE=true|false`
  Enables a subtle ad-block support message when a live ad does not load.

## Consent and CMP readiness

- Current default behaviour is conservative:
  - if `NEXT_PUBLIC_ADS_CMP_READY` is not `true`, the bootstrap sets AdSense to non-personalized mode
  - this is only a bridge, not a substitute for a certified CMP
- Integration point:
  - `components/ads/adsense-script.tsx`
  - replace the temporary non-personalized bootstrap with your CMP callback once consent collection is implemented

## Standard slot types

- `TOP_LEADERBOARD`
  Recommended size: `728x90`
  Responsive behaviour: desktop leaderboard with smaller-screen fallback.
- `CONTENT_TOP`
  Recommended size: responsive rectangle
  Responsive behaviour: full-width in-content unit for early page placement.
- `CONTENT_MID`
  Recommended size: responsive rectangle
  Responsive behaviour: below-the-fold in-content unit with lazy rendering.
- `CONTENT_BOTTOM`
  Recommended size: responsive rectangle
  Responsive behaviour: late-page in-content unit before footer or final CTA.
- `SIDEBAR`
  Recommended size: `300x250`
  Responsive behaviour: desktop only.
- `RESULT_AFTER`
  Recommended size: responsive rectangle
  Responsive behaviour: in-content unit after the answer or output block.
- `FOOTER_TOP`
  Recommended size: `728x90`
  Responsive behaviour: reserved for late-page monetisation if needed later.

## Manual slot mapping

Configure slot IDs with these environment variables:

- `NEXT_PUBLIC_AD_SLOT_HOMEPAGE_CONTENT_TOP`
- `NEXT_PUBLIC_AD_SLOT_HOMEPAGE_CONTENT_BOTTOM`
- `NEXT_PUBLIC_AD_SLOT_TOOLS_HUB_CONTENT_TOP`
- `NEXT_PUBLIC_AD_SLOT_TOOLS_HUB_CONTENT_BOTTOM`
- `NEXT_PUBLIC_AD_SLOT_TOOL_CONTENT_TOP`
- `NEXT_PUBLIC_AD_SLOT_TOOL_RESULT_AFTER`
- `NEXT_PUBLIC_AD_SLOT_TOOL_SIDEBAR`
- `NEXT_PUBLIC_AD_SLOT_GUIDE_HUB_CONTENT_TOP`
- `NEXT_PUBLIC_AD_SLOT_GUIDE_HUB_CONTENT_BOTTOM`
- `NEXT_PUBLIC_AD_SLOT_GUIDE_CONTENT_TOP`
- `NEXT_PUBLIC_AD_SLOT_GUIDE_CONTENT_MID`
- `NEXT_PUBLIC_AD_SLOT_GUIDE_CONTENT_BOTTOM`
- `NEXT_PUBLIC_AD_SLOT_COMPARE_HUB_CONTENT_TOP`
- `NEXT_PUBLIC_AD_SLOT_COMPARE_HUB_CONTENT_BOTTOM`
- `NEXT_PUBLIC_AD_SLOT_COMPARE_CONTENT_TOP`
- `NEXT_PUBLIC_AD_SLOT_COMPARE_CONTENT_MID`
- `NEXT_PUBLIC_AD_SLOT_COMPARE_CONTENT_BOTTOM`
- `NEXT_PUBLIC_AD_SLOT_STATUS_HUB_CONTENT_TOP`
- `NEXT_PUBLIC_AD_SLOT_STATUS_HUB_CONTENT_MID`
- `NEXT_PUBLIC_AD_SLOT_STATUS_RESULT_AFTER`
- `NEXT_PUBLIC_AD_SLOT_STATUS_CONTENT_MID`
- `NEXT_PUBLIC_AD_SLOT_FOOTER_TOP`

## Placements intentionally used

- Homepage:
  - `homepage_content_top`
  - `homepage_content_bottom`
- Tools hub:
  - `tools_hub_content_top`
  - `tools_hub_content_bottom`
- Tool pages:
  - `tool_content_top`
  - `tool_result_after`
  - `tool_sidebar`
- Learn hub and guide pages:
  - `guide_hub_content_top`
  - `guide_hub_content_bottom`
  - `guide_content_top`
  - `guide_content_mid`
  - `guide_content_bottom`
- Compare hub and compare pages:
  - `compare_hub_content_top`
  - `compare_hub_content_bottom`
  - `compare_content_top`
  - `compare_content_mid`
  - `compare_content_bottom`
- Status surfaces:
  - `status_hub_content_top`
  - `status_hub_content_mid`
  - `status_result_after`
  - `status_content_mid`
- Reserved:
  - `footer_top`

## Placements intentionally avoided

- Above the homepage headline
- Inside upload boxes or input panels
- Between a core upload CTA and the result area
- Directly beside primary tool action buttons
- Above the main status answer on status pages
- More than 2 ads on the homepage
- More than 3 ads on guide or comparison pages

## Production checklist

1. Confirm `/ads.txt` loads and contains the correct publisher line.
2. Set real slot IDs for the placements you want to activate.
3. Decide whether the site is running in `manual` or `auto` mode.
4. Implement a certified CMP before serving personalized ads in the EEA or UK.
5. Verify the AdSense script is injected once in the shared layout.
6. Spot-check homepage, tools hub, tool pages, status pages, learn pages, and compare pages on mobile and desktop.
7. Confirm ad spacing is clear and no placement crowds a primary button or form control.
8. Re-run `pnpm build` before deployment.
