import { LearnSeoArticlePage, buildLearnArticleMetadata } from "@/components/learn/seo-article-page"
import { loadSeoMdxArticle } from "@/lib/seo/mdx-content"

const route = "/learn/workflows/prepare-pdf-for-government-portal-upload" as const

export async function generateMetadata() {
  const article = await loadSeoMdxArticle(route)
  return buildLearnArticleMetadata(article)
}

export default async function LearnWorkflowMdxPage() {
  const article = await loadSeoMdxArticle(route)
  return <LearnSeoArticlePage article={article} />
}
