# 30-Day Indexation Monitoring

Last updated: 2026-05-08

## Purpose

Use this checklist for the first 30 days after the indexation cleanup and canonical-host fix. The goal is to confirm that Google is:

- crawling fewer low-value URLs
- indexing a higher share of the curated sitemap
- consolidating signals onto `https://plain.tools`
- surfacing stronger impressions on the remaining priority page families

## Current baseline

- Canonical host: `https://plain.tools`
- Sitemap scope: `4,132` URLs
- `/guides/*`: `301` URLs including the hub
- `/status/*`: `181` URLs including the hub
- Noindexed long-tail families remain live for users but must stay out of the sitemap
- Current local audit references:
  - `generated/seo/indexing-hygiene-report.json`
  - `generated/seo/production-crawl-report.json`

## Weekly checks

Run these once per week for 4 weeks in Google Search Console and local validation.

### 1. GSC indexing coverage

Record:

- total indexed pages
- `Discovered - currently not indexed`
- `Crawled - currently not indexed`
- `Excluded by 'noindex' tag`
- `Duplicate, Google chose different canonical than user`
- `Alternate page with proper canonical tag`
- any redirect, soft-404, or server-error buckets

What to look for:

- `Discovered - currently not indexed` should trend down, especially on previously noisy generated families
- `Crawled - currently not indexed` should trend down more slowly, but should not keep climbing
- canonical conflict buckets should stay flat or decline
- `Excluded by 'noindex' tag` may stay present for live utility families, but should not suddenly expand into priority routes

### 2. Sitemap health

Check the submitted sitemap in GSC:

- submitted successfully
- fetched successfully
- discovered URL count remains near `4,132`
- indexed URL count from sitemap trends upward over time

Confirm locally:

- `npm run audit:indexing-hygiene`

What to look for:

- no spikes in sitemap-reported warnings
- no noindexed, redirected, blocked, or duplicate canonical URLs re-entering the sitemap

### 3. Search performance by page family

Track impressions and clicks separately for:

- `/tools/*`
- `/guides/*`
- `/status/*`
- `/compare/*`

Record:

- impressions
- clicks
- CTR
- average position

What to look for:

- `/tools/*` should be the first family to show the strongest stable gains
- `/compare/*` may show earlier query discovery if comparison intent is strong
- `/guides/*` should gain impressions selectively on the curated set, not broadly
- `/status/*` should be monitored carefully for quality; impressions are useful only if they land on representative pages, not noisy utility states

### 4. Top queries

For each family, export the top queries and top landing pages:

- `/tools/*`
- `/guides/*`
- `/status/*`
- `/compare/*`

Review:

- whether the query matches the page intent
- whether impressions are concentrating on the intended priority pages
- whether multiple pages appear to compete for the same query cluster

### 5. Crawl and canonical warnings

Review GSC for:

- redirect errors
- crawl anomalies
- `Google chose different canonical than user`
- duplicate without user-selected canonical
- blocked-by-robots surprises on public routes

Confirm production:

- apex host returns `200`
- `www` host redirects once to apex
- representative pages stay self-canonical on `https://plain.tools`

### 6. Noindex and sitemap exclusion integrity

Confirm weekly that these families remain excluded from the sitemap and remain noindexed where intended:

- non-curated `/guides/<industry>`
- non-curated `/guides/<industry>/<workflow>`
- non-curated `/status/<domain>`
- non-curated `/status/<domain>-outage-history`
- non-primary `/status/trending-<segment>`
- `/status/<site>-<country>`
- `/status/<isp>-in-<country>`
- any long-tail generated calculator or converter routes outside the curated allowlists

## 30-day log template

| Week | Indexed pages | Discovered not indexed | Crawled not indexed | Sitemap processed | `/tools` impressions | `/guides` impressions | `/status` impressions | `/compare` impressions | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Week 0 baseline |  |  |  |  |  |  |  |  |  |
| Week 1 |  |  |  |  |  |  |  |  |  |
| Week 2 |  |  |  |  |  |  |  |  |  |
| Week 3 |  |  |  |  |  |  |  |  |  |
| Week 4 |  |  |  |  |  |  |  |  |  |

## What counts as improvement

- sitemap stays clean and processed with no regression in inclusion quality
- indexed pages trend upward on the curated sitemap rather than on excluded families
- `Discovered - currently not indexed` declines meaningfully from the pre-cleanup state
- `Crawled - currently not indexed` declines or at least stops growing
- canonical warning buckets decline or remain near zero
- impressions concentrate on `/tools/*`, strong `/compare/*`, selected `/guides/*`, and representative `/status/*`
- the first new clicks appear on priority tool, comparison, or guide pages rather than thin/generated remnants

## What should trigger another pruning pass

- `Discovered - currently not indexed` stalls at a high level for 3 to 4 weeks with no sign of improvement
- `Crawled - currently not indexed` keeps climbing on `/guides/*`, `/status/*`, or other generated families
- GSC starts surfacing duplicate or canonical-conflict warnings again
- low-value `/status/*` or marginal `/compare/*` pages absorb impressions without clicks or query relevance
- impressions spread thinly across too many near-identical guide or status pages
- excluded/noindexed families reappear in sitemap or strong internal-link paths

## What to strengthen first if impressions appear

Prioritise pages that already show impressions before expanding any family.

### First priority

- `/tools/*` pages with rising impressions but weak CTR
- `/compare/*` pages attracting high-intent competitor or alternative queries

Recommended actions:

- tighten title and meta description to match the actual query
- strengthen the intro and first screen answer
- improve related-tool and compare-to-tool internal links

### Second priority

- curated `/guides/*` pages that begin to rank for concrete workflow intent

Recommended actions:

- add more specific examples, steps, and decision support
- link more clearly to the exact tool and the parent guide hub
- reduce any remaining boilerplate in repeated workflow sections

### Third priority

- representative `/status/*` pages that show durable impressions and query relevance

Recommended actions:

- strengthen explanation of what the page measures
- improve related links to status hubs and diagnostic tools
- keep only the pages that show clear public search value

## Recommended weekly command checks

Run locally once per week:

- `node scripts/audit-internal-links.mjs`
- `npm run audit:indexing-hygiene`
- `node scripts/audit-production-crawl.mjs`

Use these to confirm:

- no redirect or canonical regressions
- no sitemap pollution
- no internal-link drift toward legacy or excluded families
