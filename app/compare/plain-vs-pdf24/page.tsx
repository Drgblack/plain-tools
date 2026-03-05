import { LearnSeoArticlePage, buildLearnArticleMetadata } from "@/components/learn/seo-article-page"
import { loadSeoMdxArticle } from "@/lib/seo/mdx-content"

const route = "/compare/plain-vs-pdf24" as const

export async function generateMetadata() {
  const article = await loadSeoMdxArticle(route)
  return buildLearnArticleMetadata(article)
}

export default async function CompareMdxPage() {
  const article = await loadSeoMdxArticle(route)
  return <LearnSeoArticlePage article={article} />
}
