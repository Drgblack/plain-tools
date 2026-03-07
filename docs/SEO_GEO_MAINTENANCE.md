# SEO/GEO Measurement and Indexation Maintenance

## Purpose
This note documents the minimum viable measurement and crawl-control setup for Plain Tools, so SEO and GEO changes can be monitored without invasive tracking.

## Measurement Layer (Privacy-First)
- **Search Console verification**: metadata verification tag via env token.
- **Bing Webmaster verification**: metadata verification tag (`msvalidate.01`) via env token.
- **IndexNow readiness**: optional key endpoint at `/.well-known/indexnow-key`.
- **Behaviour analytics**: keep lightweight, non-invasive analytics only (no ad-tech trackers, no cross-site behavioural profiling).

### Environment variables
- `GOOGLE_SITE_VERIFICATION` (or `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`)
- `BING_SITE_VERIFICATION` (or `NEXT_PUBLIC_BING_SITE_VERIFICATION`)
- `INDEXNOW_KEY` (or `NEXT_PUBLIC_INDEXNOW_KEY`) for optional IndexNow key serving

## Canonical Strategy
- Canonical URLs are **root routes** on `https://plain.tools`.
- Legacy `/pdf-tools/*` content is not canonical for search.
- `/file-converters/*` slug pages are aliases and should resolve to canonical `/tools/*` routes (or the `/file-converters` hub when unsupported).

## Sitemap Strategy
- Source: `app/sitemap.ts`.
- Include **canonical URLs only**.
- Exclude known alias patterns from sitemap output:
  - `/pdf-tools/*`
  - `/file-converters/*` slug aliases
- Keep curated `/status/[site]` entries only (avoid open-ended sitemap pollution from arbitrary user input).

## Routes Intended to Rank
- Core hubs: `/`, `/tools`, `/learn`, `/compare`, `/blog`, `/site-status`
- Tools: `/tools/[slug]` canonical public tool routes
- Learn/compare/blog content routes
- Public support/legal/trust routes:
  - `/verify-claims`, `/pricing`, `/about`, `/support`, `/privacy`, `/terms`, `/changelog`, `/roadmap`, `/html-sitemap`

## Alias/Redirect Patterns
- `/pdf-tools/learn/*` -> `/learn/*`
- `/pdf-tools/blog/*` -> `/blog/*`
- `/pdf-tools/compare/*` -> `/compare/*`
- `/pdf-tools/tools/*` -> `/tools/*`
- `/file-converters/{supported-alias}` -> canonical `/tools/*`

Primary redirect rules are defined in `next.config.ts`.

## Metadata Generation
- Shared metadata helper: `lib/page-metadata.ts`.
- Dynamic tool/status metadata:
  - tool pages via `app/tools/[slug]/page.tsx`
  - status pages via `lib/seo.ts` (`generateDynamicToolMetadata`)
- Root verification tags are provided in `app/layout.tsx` via `lib/seo-monitoring.ts`.

## Status Page Normalisation
Status canonicalisation is handled in `lib/site-status.ts`:
- lowercases input
- strips protocol (`http://`, `https://`)
- strips `www.`
- strips path/query/hash
- strips trailing dots and optional port
- if no dot and not IPv4, appends `.com`
- validates host format
- redirects to canonical `/status/{domain}`

## Robots and Crawl Controls
- `app/robots.ts` is the canonical robots generator.
- Includes sitemap reference to `/sitemap.xml`.
- Host is set to `https://plain.tools`.
- `/pdf-tools/*` layout is marked non-indexable to reduce duplicate indexation risk.

## Maintenance Checklist
When adding a new public SEO page:
1. Ensure canonical metadata points to the preferred route.
2. Ensure any alias routes 301 to canonical.
3. Add canonical route to sitemap inputs (not alias routes).
4. Add at least one relevant internal link from hub/content surfaces.
5. Confirm page is crawlable in server-rendered HTML.
6. Run `pnpm run build` before merging.

