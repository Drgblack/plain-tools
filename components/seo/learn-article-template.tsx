import type { Metadata } from "next"

import { ArticleLayout } from "@/components/seo/article-layout"
import { FaqBlock } from "@/components/seo/faq-block"
import { RelatedLinks } from "@/components/seo/related-links"
import { TrustBox } from "@/components/seo/trust-box"
import type { TrancheLearnArticle } from "@/lib/seo/tranche1-content"
import { getLearnSeoLinks } from "@/lib/seo/tranche1-link-map"

const BASE_URL = "https://plain.tools"

function titleCase(value: string) {
  return value
    .split(" ")
    .map((token) => token.charAt(0).toUpperCase() + token.slice(1))
    .join(" ")
}

export function buildLearnArticleMetadata(article: TrancheLearnArticle): Metadata {
  const canonical = `${BASE_URL}/learn/${article.slug}`
  const title = `${titleCase(article.primaryQuery)} - Offline & Private | Plain.tools`
  return {
    title,
    description: article.metaDescription,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description: article.metaDescription,
      url: canonical,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: article.metaDescription,
    },
  }
}

function buildLearnSchema(article: TrancheLearnArticle) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: article.title,
        description: article.metaDescription,
        author: {
          "@type": "Organization",
          name: "Plain Team",
        },
        publisher: {
          "@type": "Organization",
          name: "Plain",
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `${BASE_URL}/learn/${article.slug}`,
        },
        url: `${BASE_URL}/learn/${article.slug}`,
        inLanguage: "en-GB",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
          { "@type": "ListItem", position: 2, name: "Learn", item: `${BASE_URL}/learn` },
          {
            "@type": "ListItem",
            position: 3,
            name: article.title,
            item: `${BASE_URL}/learn/${article.slug}`,
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: article.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      },
    ],
  }
}

type LearnArticleTemplateProps = {
  article: TrancheLearnArticle
}

export function LearnArticleTemplate({ article }: LearnArticleTemplateProps) {
  const schema = buildLearnSchema(article)
  const links = getLearnSeoLinks(article.slug)

  return (
    <ArticleLayout
      title={article.title}
      intro={article.intro}
      sections={article.sections}
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Learn", href: "/learn" },
        { label: article.title, href: `/learn/${article.slug}` },
      ]}
      jsonLd={schema}
      disclaimer={article.disclaimer}
      trustBox={
        <TrustBox
          localProcessing={article.trustBox.localProcessing}
          noUploads={article.trustBox.noUploads}
          noTracking={article.trustBox.noTracking}
          verifyHref={article.trustBox.verifyHref}
        />
      }
      faq={<FaqBlock faqs={article.faqs} />}
      relatedLinks={
        <RelatedLinks
          heading="Next steps"
          sections={[
            {
              title: "Tool",
              links: links ? [links.primaryTool] : article.nextSteps.filter((step) => step.href.startsWith("/tools/")).slice(0, 1),
            },
            {
              title: "Learn",
              links: links ? links.relatedLearn : article.nextSteps.filter((step) => step.href.startsWith("/learn/")).slice(0, 2),
            },
            {
              title: "Verify",
              links: links ? [links.verify] : [{ label: "Verify Claims", href: "/verify-claims" }],
            },
          ]}
        />
      }
    />
  )
}
