import {
  LearnArticleTemplate,
  buildLearnArticleMetadata,
} from "@/components/seo/learn-article-template"
import { getTrancheLearnArticleOrThrow } from "@/lib/seo/tranche1-content"

const article = getTrancheLearnArticleOrThrow("compress-pdf-without-losing-quality")

export const metadata = buildLearnArticleMetadata(article)

export default function LearnTranchePage() {
  return <LearnArticleTemplate article={article} />
}
