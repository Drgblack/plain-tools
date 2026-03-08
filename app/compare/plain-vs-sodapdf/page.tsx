import {
  ComparePageTemplate,
  buildComparePageMetadata,
} from "@/components/seo/compare-page-template"
import { getExpansionComparePageOrThrow } from "@/lib/seo/expansion-content"

const page = getExpansionComparePageOrThrow("plain-vs-sodapdf")

export const metadata = buildComparePageMetadata(page)

export default function PlainVsSodapdfPage() {
  return <ComparePageTemplate page={page} />
}
