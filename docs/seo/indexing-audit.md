# Indexing Audit

Last updated: 2026-03-12

This audit documents the intended index state for the main public route groups on `plain.tools`. The goal is to keep only canonical, index-worthy public URLs in XML sitemaps and to reduce crawl waste from redirects, duplicate alternates, and legacy surfaces.

| Route pattern | Intended index state | Canonical target | Robots status | Sitemap inclusion | Notes / risks |
| --- | --- | --- | --- | --- | --- |
| `/` | Index | Self | Allowed | Included | Primary brand and hub entry point. |
| `/tools` | Index | Self | Allowed | Included | Canonical PDF and utility directory. |
| `/tools/[slug]` | Index | Self | Allowed | Included | Primary money pages. Must stay self-canonical. |
| `/tools/[toolSlug]/[modifierSlug]` | Index | Self | Allowed | Included | Intent and modifier pages. Keep only canonical variants in sitemap. |
| `/learn` and `/learn/*` | Index | Self | Allowed | Included | Informational cluster that funnels into tools. |
| `/guides`, `/guides/[industry]`, `/guides/[industry]/[workflow]` | Index | Self | Allowed | Included | Industry workflow cluster. Important for crawl paths into high-intent tools. |
| `/compare` and `/compare/*` | Index | Self | Allowed | Included | Canonical comparison cluster. Legacy comparison aliases redirect here. |
| `/blog`, `/blog/category/[slug]`, `/blog/[slug]` | Index | Self | Allowed | Included | Editorial content. |
| `/file-converters` | Index | Self | Allowed | Included | Canonical converter hub. |
| `/file-converters/[slug]` | Redirect only | `/tools/*` or `/file-converters` | Allowed | Excluded | Alias routes only. Must never appear in sitemap. |
| `/calculators` and `/calculators/[category]` | Index | Self | Allowed | Included | Hub and category pages for calculator cluster. |
| `/calculators/[category]/[expression]` | Index when valid | Self | Allowed | Included | Invalid or non-canonical expressions are redirected or noindex. |
| `/status` and `/site-status` | Index | Self | Allowed | Included | Canonical status hubs. |
| `/status/[site]` | Index | Self | Allowed | Included | Canonical status result route for a domain. |
| `/status/[site]/outage-history` | Index | Self | Allowed | Included | Canonical outage-history route attached to a domain. |
| `/status/trending` and `/status/trending/[segment]` | Index | Self | Allowed | Included | Important status discovery routes. |
| `/status/region/[site]/[country]` | Indexable but de-prioritised | Self | Allowed | Excluded | Programmatic long tail. Kept crawlable via internal links, removed from sitemap to reduce crawl waste. |
| `/status/access/[isp]/[country]` | Indexable but de-prioritised | Self | Allowed | Excluded | Lower-value permutation set. Removed from sitemap. |
| `/outage-history/[service]` public aliases such as `/chatgpt-outage-history` | Index | Self | Allowed | Included | Canonical public path is the short alias. Internal route is served through rewrites. |
| `/is/[site]` and `/is-*-down` query routes | Canonical alternate only | `/status/{domain}` | Allowed, `noindex` | Excluded | Kept for user demand and query capture, but should not compete with `/status/*`. |
| `/programmatic/[...slug]` | Index when valid | Self or canonical variant target | Allowed | Included when canonical | Invalid or duplicate variants redirect or noindex. |
| `/dns/[domain]`, `/ip/[ip]`, `/network/whois/[query]`, `/network/reverse/[ip]`, `/network/asn/[asn]` | Index when valid | Self | Allowed | Included | Invalid lookups render `noindex`. |
| `/convert/[from]-to-[to]` and `/convert/[from]-to-[to]/[modifier]` | Index when valid | Self | Allowed | Included | Canonical conversion landing pages. |
| `/convert/open/[format]` public aliases such as `/convert/open-jpg` | Index when valid | Self | Allowed | Included | Invalid format routes render `noindex`. |
| `/topics` | Index | Self | Allowed | Included | User-facing topical map for shallow discovery. |
| `/faq`, `/html-sitemap`, `/labs` | Noindex utility/support pages | Self | Allowed, `noindex` | Excluded | Useful for users, not intended to compete in search results. |
| `/compress-pdf`, `/pdf-merge`, `/pdf-to-word`, `/pricing`, `/sitemap`, `/verify` | Redirect only | Canonical destination | Allowed | Excluded | Legacy entry routes. Must not appear in sitemap or canonicals. |
| `/pdf-tools` and `/pdf-tools/*` | Legacy duplicate subtree | Root canonical routes | Blocked by root robots, subtree also `noindex` | Excluded | Legacy namespace. Major crawl-waste risk if reintroduced into sitemap or internal linking outside that subtree. |
| `/api/*`, `/sign-in`, `/sign-up`, `/pro/*` | Private/system | N/A | Blocked | Excluded | Non-public routes. |

## Key decisions

- The root sitemap should only contain canonical, indexable, public URLs that resolve as `200`.
- The legacy `/pdf-tools/*` namespace is intentionally excluded from indexing and should not be surfaced in root XML sitemaps or prominent internal linking.
- Status query aliases under `/is/*` are valid alternates for users but should remain `noindex` with canonicals pointing to `/status/{domain}`.
- Lower-value status permutations under `/status/region/*` and `/status/access/*` remain crawlable but are no longer advertised in the root sitemap.

## Main risks to monitor

- Reintroduction of `/pdf-tools/*` URLs into sitemap generators or prominent internal links.
- Redirecting legacy tool aliases being linked from hubs instead of their final canonical `/tools/*` routes.
- Programmatic long-tail pages with weak differentiation staying in sitemap despite low value.
- Canonical drift on large templates where a page starts canonicalising to a parent, redirect target, or stale alias.
