import { notFound } from "next/navigation"

import {
  LearnArticleTemplate,
  buildLearnArticleMetadata,
} from "@/components/seo/learn-article-template"
import {
  converterRouteSlugs,
  getConverterArticleOrThrow,
} from "@/lib/seo/file-converters-content"

type ConverterPageProps = {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return converterRouteSlugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: ConverterPageProps) {
  const { slug } = await params
  try {
    const article = getConverterArticleOrThrow(slug)
    return buildLearnArticleMetadata(article, { basePath: "/file-converters" })
  } catch {
    return {}
  }
}

export default async function ConverterArticlePage({ params }: ConverterPageProps) {
  const { slug } = await params

  let article: ReturnType<typeof getConverterArticleOrThrow> | null = null
  try {
    article = getConverterArticleOrThrow(slug)
  } catch {
    notFound()
  }
  if (!article) {
    notFound()
  }

  return (
    <LearnArticleTemplate
      article={article}
      routeBase="/file-converters"
      routeLabel="File Converters"
      relatedLabel="Related converters"
    />
  )
}
