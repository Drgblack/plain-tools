# Indexation Optimisation Pass

Last updated: 2026-05-07

## Validation snapshot

- Root XML sitemap count reduced from `205,448` to `10,177` URLs.
- Sitemap family mix now concentrates on canonical hubs and curated long-tail subsets instead of full generated matrices.
- Current audit report: `generated/seo/indexing-hygiene-report.json`

## Excluded URL patterns

- `/faq`
- `/html-sitemap`
- `/labs`
- `/calculators/<category>/<expression>` when outside the curated calculator allowlist
- `/convert/<from>-to-<to>` when outside the curated converter-pair allowlist
- `/convert/<from>-to-<to>/<modifier>` when outside the curated converter-modifier allowlist
- `/convert/open-<format>` when outside the curated open-format guide allowlist
- `/status/<site>-<country>` regional permutations
- `/status/<isp>-in-<country>` ISP permutations

## Noindex patterns

- `/faq`
- `/html-sitemap`
- `/labs`
- `/calculators/<category>/<expression>` outside the curated calculator set
- `/convert/<from>-to-<to>` outside the curated converter set
- `/convert/<from>-to-<to>/<modifier>` outside the curated converter-modifier set
- `/convert/open-<format>` outside the curated open-format set
- `/status/<site>-<country>`
- `/status/<isp>-in-<country>`

## Canonical strategy

- Canonical host is `https://plain.tools`.
- Requests on `www.plain.tools` are redirected to the canonical host.
- Public route paths are normalized to lowercase.
- Trailing slashes are stripped except on `/`.
- Canonical metadata stays self-referencing on indexable routes.
- Legacy duplicate namespaces and redirected aliases remain excluded from sitemap inclusion.

## Sitemap strategy

- Source of truth is `lib/sitemap-data.ts` plus route-level indexation policy.
- Sitemap only includes canonical, indexable, public `200` routes.
- Calculator expressions are capped to the curated prebuild/indexable set instead of the full generated matrix.
- Converter pairs, modifier routes, and open-format guides are capped to curated indexable subsets.
- Lower-value regional and ISP status permutations remain available to users but are removed from sitemap promotion.

## Crawl-budget recommendations

- Keep query-parameter URLs out of crawl paths with robots rules and canonical path normalization.
- Let public duplicate namespaces stay crawlable when they return redirects or route-level `noindex`, rather than blocking them in `robots.txt` and leaving unresolved GSC noise.
- Do not increase calculator or converter generated-route budgets without reviewing sitemap family counts first.
- Keep internal linking focused on canonical hubs, tool pages, curated calculator routes, and curated converter routes.
- Avoid reintroducing `/pdf-tools/*`, `/file-converters/*` alias routes, or internal implementation paths into prominent navigation or XML sitemaps.
- Monitor `/guides/*` and `/status/*` family counts next, since they are now the largest remaining sitemap clusters after calculators and converters were trimmed.
