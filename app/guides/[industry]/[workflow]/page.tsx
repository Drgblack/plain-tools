import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { ProgrammaticLayout } from "@/components/ProgrammaticLayout"
import { ToolWorkspaceEmbed } from "@/components/seo/tool-workspace-embed"
import { buildPageMetadata } from "@/lib/page-metadata"
import {
  type ProfessionalWorkflowRouteParams,
  generateAllProfessionalWorkflowParams,
  getProfessionalWorkflowPage,
} from "@/lib/professional-workflows-expanded"

type PageProps = {
  params: Promise<ProfessionalWorkflowRouteParams>
}

export const revalidate = 86400
export const dynamicParams = true

function getPrebuildLimit() {
  const raw = process.env.PRO_WORKFLOW_PREBUILD_LIMIT
  if (!raw) return 500
  const value = Number.parseInt(raw, 10)
  return Number.isFinite(value) && value > 0 ? value : 500
}

export function generateStaticParams() {
  return generateAllProfessionalWorkflowParams(getPrebuildLimit())
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { industry, workflow } = await params
  const page = getProfessionalWorkflowPage(industry, workflow)

  if (!page) {
    return buildPageMetadata({
      title: "Workflow guide not found",
      description:
        "The requested workflow guide does not exist. Browse Plain Tools for privacy-first PDF workflows, tool comparisons, and local document utilities.",
      path: "/learn",
      image: "/og/tools.png",
      googleNotranslate: true,
      type: "article",
    })
  }

  const metadata = buildPageMetadata({
    title: page.title,
    description: page.desc,
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

export default async function ProfessionalWorkflowPageRoute({ params }: PageProps) {
  const { industry, workflow } = await params
  const page = getProfessionalWorkflowPage(industry, workflow)

  if (!page) {
    notFound()
  }

  return (
    <ProgrammaticLayout
      breadcrumbs={page.breadcrumbs}
      featureList={page.featureList}
      heroBadges={page.heroBadges}
      liveTool={
        <ToolWorkspaceEmbed
          routeId={`${page.page.tool.slug}:${page.page.paramSlug}`}
          toolSlug={page.page.tool.slug}
        />
      }
      liveToolDescription={page.liveToolDescription}
      liveToolTitle="Run the live workflow"
      page={page.page}
      relatedSectionTitle={`Related ${page.page.paramLabel.toLowerCase()} PDF workflows`}
      siloLinks={page.siloLinks}
      titleOverride={page.h1}
    />
  )
}
