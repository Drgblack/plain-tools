import type { Metadata } from "next"

import { StatusCategoryPage } from "@/components/status-category-page"
import { buildPageMetadata } from "@/lib/page-metadata"
import { STATUS_CATEGORY_META } from "@/lib/status-domains"

const category = "ai" as const

export const metadata: Metadata = buildPageMetadata({
  title: STATUS_CATEGORY_META[category].title + " checker",
  description: STATUS_CATEGORY_META[category].description,
  path: "/status/ai",
  image: "/og/default.png",
})

export default function AiStatusCategoryPage() {
  return <StatusCategoryPage category={category} />
}
