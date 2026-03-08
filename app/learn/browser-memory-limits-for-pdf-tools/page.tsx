import {
  LearnArticleTemplate,
  buildLearnArticleMetadata,
} from "@/components/seo/learn-article-template"
import { getExpansionLearnArticleOrThrow } from "@/lib/seo/expansion-content"

const article = getExpansionLearnArticleOrThrow("browser-memory-limits-for-pdf-tools")

export const metadata = buildLearnArticleMetadata(article)

export default function BrowserMemoryLimitsForPdfToolsPage() {
  return <LearnArticleTemplate article={article} />
}
