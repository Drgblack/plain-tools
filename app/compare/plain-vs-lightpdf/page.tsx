import {
  ComparePageTemplate,
  buildComparePageMetadata,
} from "@/components/seo/compare-page-template"
import { getExpansionComparePageOrThrow } from "@/lib/seo/expansion-content"

const page = getExpansionComparePageOrThrow("plain-vs-lightpdf")

export const metadata = buildComparePageMetadata(page)

export default function PlainVsLightpdfPage() {
  return <ComparePageTemplate page={page} />
}
