import {
  LearnArticleTemplate,
  buildLearnArticleMetadata,
} from "@/components/seo/learn-article-template"
import { getExpansionLearnArticleOrThrow } from "@/lib/seo/expansion-content"

const article = getExpansionLearnArticleOrThrow("offline-pdf-tools-for-law-firms")

export const metadata = buildLearnArticleMetadata(article)

export default function OfflinePdfToolsForLawFirmsPage() {
  return <LearnArticleTemplate article={article} />
}
