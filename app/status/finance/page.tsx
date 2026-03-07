import type { Metadata } from "next"

import { StatusCategoryPage } from "@/components/status-category-page"
import { buildPageMetadata } from "@/lib/page-metadata"
import { STATUS_CATEGORY_META } from "@/lib/status-domains"

const category = "finance" as const

export const metadata: Metadata = buildPageMetadata({
  title: STATUS_CATEGORY_META[category].title + " checker",
  description: STATUS_CATEGORY_META[category].description,
  path: "/status/finance",
  image: "/og/default.png",
})

export default function FinanceStatusCategoryPage() {
  return <StatusCategoryPage category={category} />
}
