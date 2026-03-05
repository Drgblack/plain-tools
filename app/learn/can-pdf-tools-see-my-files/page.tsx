import { LearnSeoArticlePage, buildLearnArticleMetadata } from "@/components/learn/seo-article-page"
import { loadSeoMdxArticle } from "@/lib/seo/mdx-content"

const route = "/learn/can-pdf-tools-see-my-files" as const

export async function generateMetadata() {
  const article = await loadSeoMdxArticle(route)
  return buildLearnArticleMetadata(article)
}

export default async function LearnMdxPage() {
  const article = await loadSeoMdxArticle(route)
  return <LearnSeoArticlePage article={article} />
}
