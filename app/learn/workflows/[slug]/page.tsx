import { notFound } from "next/navigation"

import {
  LearnArticleTemplate,
  buildLearnArticleMetadata,
} from "@/components/seo/learn-article-template"
import { getWorkflowArticleOrThrow, workflowRouteSlugs } from "@/lib/seo/workflows-content"

type WorkflowPageProps = {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return workflowRouteSlugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: WorkflowPageProps) {
  const { slug } = await params
  try {
    const article = getWorkflowArticleOrThrow(slug)
    return buildLearnArticleMetadata(article)
  } catch {
    return {}
  }
}

export default async function WorkflowArticlePage({ params }: WorkflowPageProps) {
  const { slug } = await params

  let article: ReturnType<typeof getWorkflowArticleOrThrow> | null = null
  try {
    article = getWorkflowArticleOrThrow(slug)
  } catch {
    notFound()
  }
  if (!article) {
    notFound()
  }

  return <LearnArticleTemplate article={article} />
}
