# AdSense Setup

## Files and entry points

- `public/ads.txt`
  Contains the site-level AdSense publisher declaration and is served at `/ads.txt`.
- `lib/ads.ts`
  Central ad configuration, placement registry, environment gating, and mode switching.
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

## Consent and CMP readiness

- Current default behaviour is conservative:
  - if `NEXT_PUBLIC_ADS_CMP_READY` is not `true`, the bootstrap sets AdSense to non-personalized mode
  - this is only a bridge, not a substitute for a certified CMP
- Integration point:
  - `components/ads/adsense-script.tsx`
  - replace the temporary non-personalized bootstrap with your CMP callback once consent collection is implemented

## Manual slot mapping

Configure slot IDs with these environment variables:

- `NEXT_PUBLIC_AD_SLOT_HOMEPAGE_HERO_BELOW`
- `NEXT_PUBLIC_AD_SLOT_HOMEPAGE_MID`
- `NEXT_PUBLIC_AD_SLOT_TOOLS_HUB_INTRO_BELOW`
- `NEXT_PUBLIC_AD_SLOT_TOOLS_HUB_MID`
- `NEXT_PUBLIC_AD_SLOT_TOOLS_HEADER_BELOW`
- `NEXT_PUBLIC_AD_SLOT_TOOLS_AFTER_RESULT`
- `NEXT_PUBLIC_AD_SLOT_TOOLS_SIDEBAR`
- `NEXT_PUBLIC_AD_SLOT_GUIDE_INTRO_BELOW`
- `NEXT_PUBLIC_AD_SLOT_GUIDE_MID`
- `NEXT_PUBLIC_AD_SLOT_COMPARE_HUB_INTRO_BELOW`
- `NEXT_PUBLIC_AD_SLOT_COMPARE_HUB_MID`
- `NEXT_PUBLIC_AD_SLOT_COMPARE_TABLE_BELOW`
- `NEXT_PUBLIC_AD_SLOT_STATUS_HUB_INTRO_BELOW`
- `NEXT_PUBLIC_AD_SLOT_STATUS_HUB_MID`
- `NEXT_PUBLIC_AD_SLOT_STATUS_RESULT_BELOW`
- `NEXT_PUBLIC_AD_SLOT_STATUS_MID`
- `NEXT_PUBLIC_AD_SLOT_FOOTER_TOP`

## Placements intentionally used

- Homepage:
  - `homepage_hero_below`
  - `homepage_mid`
- Tools hub:
  - `tools_hub_intro_below`
  - `tools_hub_mid`
- Tool pages:
  - `tools_header_below`
  - `tools_after_result`
  - `tools_sidebar`
- Learn and guide pages:
  - `guide_intro_below`
  - `guide_mid`
- Compare hub and compare pages:
  - `compare_hub_intro_below`
  - `compare_hub_mid`
  - `compare_table_below`
- Status surfaces:
  - `status_hub_intro_below`
  - `status_hub_mid`
  - `status_result_below`
  - `status_mid`
- Global:
  - `footer_top`

## Placements intentionally avoided

- Above the homepage headline
- Inside upload boxes or input panels
- Between a core upload CTA and the result area
- Directly beside primary tool action buttons
- Above the main status answer on status pages

## Production checklist

1. Confirm `/ads.txt` loads and contains the correct publisher line.
2. Set real slot IDs for the placements you want to activate.
3. Decide whether the site is running in `manual` or `auto` mode.
4. Implement a certified CMP before serving personalized ads in the EEA or UK.
5. Verify the AdSense script is injected once in the shared layout.
6. Spot-check homepage, tools hub, tool pages, status pages, learn pages, and compare pages on mobile and desktop.
7. Confirm ad spacing is clear and no placement crowds a primary button or form control.
8. Re-run `pnpm build` before deployment.
