import {
  LearnArticleTemplate,
  buildLearnArticleMetadata,
} from "@/components/seo/learn-article-template"
import { getExpansionGlossaryArticleOrThrow } from "@/lib/seo/expansion-content"

const article = getExpansionGlossaryArticleOrThrow("what-is-xmp-in-pdf")

export const metadata = buildLearnArticleMetadata(article, {
  basePath: "/learn/glossary",
})

export default function WhatIsXmpInPdfPage() {
  return (
    <LearnArticleTemplate
      article={article}
      routeBase="/learn/glossary"
      routeLabel="Glossary"
      relatedLabel="Related glossary and metadata guides"
    />
  )
}
