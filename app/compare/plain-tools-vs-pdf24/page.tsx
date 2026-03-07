import {
  ComparePageTemplate,
  buildComparePageMetadata,
} from "@/components/seo/compare-page-template"
import { getTrancheComparePageOrThrow } from "@/lib/seo/tranche1-content"

const page = getTrancheComparePageOrThrow("plain-tools-vs-pdf24")

export const metadata = buildComparePageMetadata(page)

export default function CompareTranchePage() {
  return <ComparePageTemplate page={page} />
}
