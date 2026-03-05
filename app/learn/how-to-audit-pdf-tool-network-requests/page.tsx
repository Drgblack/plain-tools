import { LearnSeoArticlePage, buildLearnArticleMetadata } from "@/components/learn/seo-article-page"
import { loadSeoMdxArticle } from "@/lib/seo/mdx-content"

const route = "/learn/how-to-audit-pdf-tool-network-requests" as const

export async function generateMetadata() {
  const article = await loadSeoMdxArticle(route)
  return buildLearnArticleMetadata(article)
}

export default async function LearnMdxPage() {
  const article = await loadSeoMdxArticle(route)
  return <LearnSeoArticlePage article={article} />
}
