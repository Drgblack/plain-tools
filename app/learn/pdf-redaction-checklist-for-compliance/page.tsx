import {
  LearnArticleTemplate,
  buildLearnArticleMetadata,
} from "@/components/seo/learn-article-template"
import { getExpansionLearnArticleOrThrow } from "@/lib/seo/expansion-content"

const article = getExpansionLearnArticleOrThrow("pdf-redaction-checklist-for-compliance")

export const metadata = buildLearnArticleMetadata(article)

export default function PdfRedactionChecklistForCompliancePage() {
  return <LearnArticleTemplate article={article} />
}
