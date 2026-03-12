import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { ProgrammaticLayout } from "@/components/ProgrammaticLayout"
import { FileConverterToolEmbed } from "@/components/seo/file-converter-tool-embed"
import {
  generateAllExtendedOpenFormatGuideParams,
  getExtendedOpenFormatGuidePage,
} from "@/lib/converter-families-ext"
import { buildPageMetadata } from "@/lib/page-metadata"

type PageProps = {
  params: Promise<{ format: string }>
}

export const revalidate = 86400
export const dynamicParams = true

function getPrebuildLimit() {
  const raw = process.env.CONVERTER_OPEN_FORMAT_PREBUILD_LIMIT
  if (!raw) return 120
  const value = Number.parseInt(raw, 10)
  return Number.isFinite(value) && value > 0 ? value : 120
}

export function generateStaticParams() {
  return generateAllExtendedOpenFormatGuideParams(getPrebuildLimit())
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { format } = await params
  const page = getExtendedOpenFormatGuidePage(format)

  if (!page) {
    const metadata = buildPageMetadata({
      title: "Open-format guide not found",
      description:
        "The requested open-format guide does not exist. Browse Plain Tools for privacy-first converter pages and open-format troubleshooting routes.",
      path: "/file-converters",
      image: "/og/tools.png",
      googleNotranslate: true,
    })

    return {
      ...metadata,
      robots: { follow: false, index: false },
    }
  }

  return {
    ...buildPageMetadata({
      title: page.title,
      description: page.description,
      path: page.canonicalPath,
      image: "/og/tools.png",
      googleNotranslate: true,
      type: "article",
    }),
    keywords: page.keywords,
  }
}

export default async function ConverterOpenFormatGuideRoute({ params }: PageProps) {
  const { format } = await params
  const page = getExtendedOpenFormatGuidePage(format)

  if (!page) notFound()

  return (
    <ProgrammaticLayout
      breadcrumbs={page.breadcrumbs}
      featureList={page.featureList}
      heroBadges={page.heroBadges}
      liveTool={
        <div className="notranslate">
          <FileConverterToolEmbed
            page={{
              embed: page.embed,
              fromFormat: page.format,
              slug: page.slug,
              toFormat: page.suggestedOutput,
            }}
          />
        </div>
      }
      liveToolDescription={page.liveToolDescription}
      liveToolTitle={`Open ${page.format.seoLabel} locally`}
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
        paramLabel: `open ${page.format.slug}`,
        paramSlug: page.slug,
        privacyNote: page.privacyNote,
        relatedTools: page.relatedLinks.slice(0, 8).map((link) => ({
          description:
            "Continue into the next relevant converter, viewer fallback, PDF tool, or privacy-first comparison route.",
          href: link.href,
          name: link.title,
        })),
        title: page.title,
        tool: {
          available: true,
          category: "File Tools",
          description:
            "Local browser file-opening and conversion fallback routes for privacy-first compatibility work.",
          id: "open-format-guide",
          name: "Open File Guide",
          slug: "file-converters",
        },
        whyUsersNeedThis: page.sections[0]?.paragraphs ?? [],
        wordCount: page.wordCount,
      }}
      relatedSectionTitle={`Related ways to open or convert ${page.format.seoLabel}`}
      siloLinks={[
        {
          href: `/convert/${page.format.slug}-to-${page.suggestedOutput.slug}`,
          label: `${page.format.seoLabel} to ${page.suggestedOutput.seoLabel}`,
        },
        { href: "/file-converters", label: "Browse file converters" },
        { href: "/tools", label: "Browse PDF tools" },
        {
          href: "/compare/plain-tools-vs-smallpdf",
          label: "Compare privacy-first alternatives",
        },
      ]}
      titleOverride={page.h1}
    />
  )
}
