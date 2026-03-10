import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { ProgrammaticLayout } from "@/components/ProgrammaticLayout"
import { FileConverterToolEmbed } from "@/components/seo/file-converter-tool-embed"
import {
  type ConverterModifierRouteParams,
  generateAllExtendedConverterModifierParams,
  getExtendedConverterModifierPage,
} from "@/lib/converter-families"
import { buildPageMetadata } from "@/lib/page-metadata"

type PageProps = {
  params: Promise<ConverterModifierRouteParams>
}

export const revalidate = 86400
export const dynamicParams = true

function getPrebuildLimit() {
  const raw = process.env.CONVERTER_MODIFIER_PREBUILD_LIMIT
  if (!raw) return 180
  const value = Number.parseInt(raw, 10)
  return Number.isFinite(value) && value > 0 ? value : 180
}

export function generateStaticParams() {
  return generateAllExtendedConverterModifierParams(getPrebuildLimit())
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { from, to, modifier } = await params
  const page = getExtendedConverterModifierPage(from, to, modifier)

  if (!page) {
    return buildPageMetadata({
      title: "Converter page not found",
      description:
        "The requested converter route does not exist. Browse Plain Tools for privacy-first converters that run locally in your browser with no upload for the core workflow.",
      path: "/file-converters",
      image: "/og/tools.png",
      googleNotranslate: true,
    })
  }

  const metadata = buildPageMetadata({
    title: page.title,
    description: page.description,
    path: page.canonicalPath,
    image: "/og/tools.png",
    googleNotranslate: true,
    type: "article",
  })

  return {
    ...metadata,
    keywords: page.keywords,
  }
}

export default async function ConverterModifierRoute({ params }: PageProps) {
  const { from, to, modifier } = await params
  const page = getExtendedConverterModifierPage(from, to, modifier)

  if (!page) {
    notFound()
  }

  return (
    <ProgrammaticLayout
      breadcrumbs={page.breadcrumbs}
      featureList={page.featureList}
      heroBadges={page.heroBadges}
      liveTool={
        <FileConverterToolEmbed
          page={{
            embed: page.embed,
            fromFormat: page.fromFormat,
            slug: page.slug,
            toFormat: page.toFormat,
          }}
        />
      }
      liveToolDescription={page.liveToolDescription}
      liveToolTitle="Convert locally"
      page={{
        canonicalPath: page.canonicalPath,
        description: page.description,
        explanationBlocks: page.sections.map((section) => ({
          paragraphs: section.paragraphs,
          title: section.title,
        })),
        faq: page.faq,
        howItWorks: page.sections[1]?.paragraphs ?? [],
        howToSteps: page.howToSteps,
        intro: page.intro,
        paramLabel: `${page.fromFormat.seoLabel} to ${page.toFormat.seoLabel} ${modifier.replace(/-/g, " ")}`,
        paramSlug: page.slug,
        privacyNote: page.privacyNote,
        relatedTools: page.proxyPage.relatedLinks.slice(0, 6).map((link) => ({
          description: "Continue into the next relevant converter, PDF workflow, or comparison page.",
          href: link.href,
          name: link.title,
        })),
        title: page.title,
        tool: page.proxyPage.proxyTool,
        whyUsersNeedThis: page.sections[0]?.paragraphs ?? [],
        wordCount: page.wordCount,
      }}
      relatedSectionTitle={`Related ${page.fromFormat.seoLabel} to ${page.toFormat.seoLabel} routes`}
      siloLinks={[
        { href: page.proxyPage.canonicalPath, label: "Open the base converter page" },
        { href: "/file-converters", label: "Browse file converters" },
        { href: "/pdf-tools", label: "Browse PDF tools" },
        { href: "/compare/plain-tools-vs-smallpdf", label: "Compare privacy-first alternatives" },
      ]}
      titleOverride={page.h1}
    />
  )
}
