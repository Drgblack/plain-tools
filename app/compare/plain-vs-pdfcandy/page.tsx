import {
  ComparePageTemplate,
  buildComparePageMetadata,
} from "@/components/seo/compare-page-template"
import { getExpansionComparePageOrThrow } from "@/lib/seo/expansion-content"

const page = getExpansionComparePageOrThrow("plain-vs-pdfcandy")

export const metadata = buildComparePageMetadata(page)

export default function PlainVsPdfcandyPage() {
  return <ComparePageTemplate page={page} />
}
