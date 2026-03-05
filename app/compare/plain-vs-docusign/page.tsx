import {
  ComparePageTemplate,
  buildComparePageMetadata,
} from "@/components/seo/compare-page-template"
import { getTrancheComparePageOrThrow } from "@/lib/seo/tranche1-content"

const page = getTrancheComparePageOrThrow("plain-vs-docusign")

export const metadata = buildComparePageMetadata(page)

export default function CompareTranchePage() {
  return <ComparePageTemplate page={page} />
}
