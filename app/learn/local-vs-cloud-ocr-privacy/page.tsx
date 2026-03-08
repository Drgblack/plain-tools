import {
  LearnArticleTemplate,
  buildLearnArticleMetadata,
} from "@/components/seo/learn-article-template"
import { getExpansionLearnArticleOrThrow } from "@/lib/seo/expansion-content"

const article = getExpansionLearnArticleOrThrow("local-vs-cloud-ocr-privacy")

export const metadata = buildLearnArticleMetadata(article)

export default function LocalVsCloudOcrPrivacyPage() {
  return <LearnArticleTemplate article={article} />
}
