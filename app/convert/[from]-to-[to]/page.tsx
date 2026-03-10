import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { ProgrammaticLayout } from "@/components/ProgrammaticLayout"
import { FileConverterToolEmbed } from "@/components/seo/file-converter-tool-embed"
import {
  type ConverterRouteParams,
  generateAllExtendedConverterParams,
  getExtendedConverterPairPage,
} from "@/lib/converter-families"
import { buildPageMetadata } from "@/lib/page-metadata"

type PageProps = {
  params: Promise<ConverterRouteParams>
}

export const revalidate = 86400
export const dynamicParams = true

function getPrebuildLimit() {
  const raw = process.env.CONVERTER_PREBUILD_LIMIT
  if (!raw) return 140
  const value = Number.parseInt(raw, 10)
  return Number.isFinite(value) && value > 0 ? value : 140
}

export function generateStaticParams() {
  return generateAllExtendedConverterParams(getPrebuildLimit())
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { from, to } = await params
  const page = getExtendedConverterPairPage(from, to)

  if (!page) {
    return buildPageMetadata({
      title: "File converter not found",
      description:
        "The requested converter route does not exist. Browse Plain Tools for privacy-first converters that run in your browser with no upload for the core workflow.",
      path: "/file-converters",
      image: "/og/tools.png",
      googleNotranslate: true,
    })
  }

  return buildPageMetadata({
    title: page.title,
    description: page.description,
    path: page.canonicalPath,
    image: "/og/tools.png",
    googleNotranslate: true,
  })
}

export default async function ConverterPairPageRoute({ params }: PageProps) {
  const { from, to } = await params
  const pair = getExtendedConverterPairPage(from, to)

  if (!pair) {
    notFound()
  }

  return (
    <ProgrammaticLayout
      breadcrumbs={pair.breadcrumbs}
      featureList={pair.featureList}
      heroBadges={pair.heroBadges}
      liveTool={<FileConverterToolEmbed page={pair} />}
      liveToolDescription={pair.liveToolDescription}
      liveToolTitle="Convert locally"
      page={{
        canonicalPath: pair.canonicalPath,
        description: pair.description,
        explanationBlocks: pair.sections.map((section) => ({
          paragraphs: section.paragraphs,
          title: section.title,
        })),
        faq: pair.faq,
        howItWorks: pair.sections[1]?.paragraphs ?? [],
        howToSteps: pair.howToSteps,
        intro: pair.intro,
        paramLabel: `${pair.from} to ${pair.to}`,
        paramSlug: `${pair.from}-to-${pair.to}`,
        privacyNote: pair.privacyNote,
        relatedTools: pair.relatedLinks.slice(0, 6).map((link) => ({
          description: "Continue into the next relevant converter, PDF workflow, or comparison page.",
          href: link.href,
          name: link.title,
        })),
        title: pair.title,
        tool: pair.proxyTool,
        whyUsersNeedThis: pair.sections[0]?.paragraphs ?? [],
        wordCount: pair.wordCount,
      }}
      relatedSectionTitle={`Related tools for ${pair.from.toUpperCase()} to ${pair.to.toUpperCase()}`}
      siloLinks={[
        { href: "/file-converters", label: "Browse file converters" },
        { href: "/pdf-tools", label: "Browse PDF tools" },
        { href: "/image-tools", label: "Browse image tools" },
        { href: "/compare", label: "Browse comparisons" },
      ]}
      titleOverride={pair.h1}
    />
  )
}
