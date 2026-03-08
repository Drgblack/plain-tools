import {
  LearnArticleTemplate,
  buildLearnArticleMetadata,
} from "@/components/seo/learn-article-template"
import { getExpansionLearnArticleOrThrow } from "@/lib/seo/expansion-content"

const article = getExpansionLearnArticleOrThrow("offline-pdf-tools-for-healthcare-teams")

export const metadata = buildLearnArticleMetadata(article)

export default function OfflinePdfToolsForHealthcareTeamsPage() {
  return <LearnArticleTemplate article={article} />
}
