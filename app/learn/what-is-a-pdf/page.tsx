import {
  LearnArticleTemplate,
  buildLearnArticleMetadata,
} from "@/components/seo/learn-article-template"
import { getTrancheLearnArticleOrThrow } from "@/lib/seo/tranche1-content"

const article = getTrancheLearnArticleOrThrow("what-is-a-pdf")

export const metadata = buildLearnArticleMetadata(article)

export default function LearnTranchePage() {
  return <LearnArticleTemplate article={article} />
}
