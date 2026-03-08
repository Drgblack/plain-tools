import {
  LearnArticleTemplate,
  buildLearnArticleMetadata,
} from "@/components/seo/learn-article-template"
import { getExpansionGlossaryArticleOrThrow } from "@/lib/seo/expansion-content"

const article = getExpansionGlossaryArticleOrThrow("what-is-pdf-info-dictionary")

export const metadata = buildLearnArticleMetadata(article, {
  basePath: "/learn/glossary",
})

export default function WhatIsPdfInfoDictionaryPage() {
  return (
    <LearnArticleTemplate
      article={article}
      routeBase="/learn/glossary"
      routeLabel="Glossary"
      relatedLabel="Related glossary and metadata guides"
    />
  )
}
