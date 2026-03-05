import {
  LearnArticleTemplate,
  buildLearnArticleMetadata,
} from "@/components/seo/learn-article-template"
import { getTrancheLearnArticleOrThrow } from "@/lib/seo/tranche1-content"

const article = getTrancheLearnArticleOrThrow("how-to-redact-a-pdf-properly")

export const metadata = buildLearnArticleMetadata(article)

export default function LearnTranchePage() {
  return <LearnArticleTemplate article={article} />
}
