import { OUTAGE_HISTORY_PAGES, type OutageHistoryPage } from "@/lib/outage-history-pages"

export type StatusQueryPage = OutageHistoryPage

export const STATUS_QUERY_PAGES: StatusQueryPage[] = OUTAGE_HISTORY_PAGES

export const STATUS_QUERY_PAGE_BY_SLUG = new Map(
  STATUS_QUERY_PAGES.map((entry) => [entry.slug, entry])
)

export function getStatusQueryPageBySlug(slug: string) {
  return STATUS_QUERY_PAGE_BY_SLUG.get(slug.toLowerCase()) ?? null
}

export function statusQueryPathForSlug(slug: string) {
  return `/is-${slug.toLowerCase()}-down`
}
