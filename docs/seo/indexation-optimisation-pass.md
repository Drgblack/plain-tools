# Indexation Optimisation Pass

Last updated: 2026-05-07

## Validation snapshot

- Root XML sitemap count reduced from `205,448` to `4,132` URLs after the second pruning pass.
- Sitemap family mix now concentrates on canonical hubs and curated long-tail subsets instead of full generated matrices.
- Current audit report: `generated/seo/indexing-hygiene-report.json`

## Pass 3: priority-page quality reinforcement

### Page families improved

- Homepage: tightened metadata and clarified the primary value proposition around free PDF tools, status checks, and network diagnostics.
- Core tool pages: added stronger "who this is for", common use cases, and next-step guidance through the shared tool-content model.
- Converter and workflow pages using the shared programmatic layout: improved section labelling and stronger internal-link framing so pages read like complete landing routes rather than thin wrappers.
- Guide hubs and priority guide pages: added intent-setting copy explaining who the hub serves, how to use it, and why only priority routes remain indexable.
- Status hubs and representative status pages: strengthened metadata, FAQ schema, and explanatory copy so the remaining indexable status routes justify their SEO weight.
- Compare pages: added clearer decision support, best-fit summaries for each option, and stronger next-step links into core tools and verification content.

### Metadata examples improved

- Homepage title now emphasizes `Free PDF tools, website status checks and network diagnostics`.
- `/tools` now emphasizes `Free PDF tools and utility workflows` instead of a generic directory label.
- Representative status pages now describe the live signal plus the next diagnostic step instead of using near-boilerplate outage copy.
- Trending status and guides hubs now use more specific titles and descriptions tied to curated indexable intent.

### Internal-linking improvements

- Shared programmatic pages now frame related links and silo links as explicit next-step paths within the same workflow cluster.
- Compare pages now link users into the core tool hub, comparison hub, and trust-verification routes after the decision layer.
- Guide hubs now explain how to move from industry hub to priority workflow to canonical tool within 2 to 3 clicks.
- Status hubs now reinforce the move from directory or category page into canonical domain checks and follow-up diagnostics.

### Remaining candidates for later noindex or removal review

- Lower-priority compare combinations that still attract little engagement and offer weak differentiation beyond the shared comparison model.
- Any priority guide page whose traffic or internal-link demand stays negligible after the quality reinforcement pass.
- Representative status domains that do not show durable search demand once more GSC data is available.

## Pass 2: guides and status pruning

- `/guides/*` reduced from `3,596` to `300` indexable URLs.
- `/status/*` reduced from `2,929` to `180` indexable URLs.
- `/guides/*` now keeps only `15` priority industry hubs plus `285` priority workflow intersections.
- `/status/*` now keeps only `14` category hubs, `112` representative domain pages, `43` outage-history pages, `10` primary trending segments, and the `/status/trending` overview.
- Lower-value guide permutations and status support routes remain available when needed, but are now removed from sitemap promotion and served with route-level `noindex`.

### Rationale

- The professional workflow matrix was too broad: `58` industries multiplied by `61` workflows created large volumes of templated near-duplicates.
- Status pages are partly operational support pages rather than durable search landing pages, so indexing the full domain, history, and trend universe diluted crawl priority.
- Priority hubs remain indexable where they provide real navigation value and stronger internal-link consolidation.
- Representative status routes remain indexable where they map to clear public search demand and complete user intent.

## Excluded URL patterns

- `/faq`
- `/html-sitemap`
- `/labs`
- `/calculators/<category>/<expression>` when outside the curated calculator allowlist
- `/convert/<from>-to-<to>` when outside the curated converter-pair allowlist
- `/convert/<from>-to-<to>/<modifier>` when outside the curated converter-modifier allowlist
- `/convert/open-<format>` when outside the curated open-format guide allowlist
- `/guides/<industry>` outside the curated priority-industry hubs
- `/guides/<industry>/<workflow>` outside the curated priority industry x workflow intersections
- `/status/<domain>` outside the curated category-representative status set
- `/status/<domain>-outage-history` outside the curated outage-history set
- `/status/trending-<segment>` outside the primary status trend segments
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
- `/guides/<industry>` outside the curated priority-industry hubs
- `/guides/<industry>/<workflow>` outside the curated priority industry x workflow intersections
- `/status/<domain>` outside the curated category-representative status set
- `/status/<domain>-outage-history` outside the curated outage-history set
- `/status/trending-<segment>` outside the primary status trend segments
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
- Monitor `/calculators/*` and `/convert/*` family counts next, since they are now the largest remaining sitemap clusters after the guides and status pruning pass.
