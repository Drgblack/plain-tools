import type { Metadata } from "next"
import { notFound, permanentRedirect } from "next/navigation"
import { Suspense } from "react"

import { ProgrammaticLayout } from "@/components/ProgrammaticLayout"
import { ErrorBoundary } from "@/components/error-boundary"
import {
  FallbackToolComponent,
  toolComponents,
  type RegisteredToolComponent,
} from "@/components/tools/tool-component-registry"
import { generateProgrammaticMetadata } from "@/lib/generateProgrammaticMetadata"
import {
  buildProgrammaticCanonicalPath,
  buildProgrammaticPageData,
  getProgrammaticStaticParams,
  normalizeProgrammaticParam,
} from "@/lib/programmatic-content"
import { getToolVariantPage } from "@/lib/tools-matrix"

type PageProps = {
  params: Promise<{ slug: string[] }>
}

// Force static generation for enumerated programmatic routes so crawlers always
// receive full HTML instead of a hydration shell.
export const dynamic = "force-static"
export const revalidate = 3600

export async function generateStaticParams() {
  return getProgrammaticStaticParams()
}

function resolveRoute(slug: string[]) {
  if (slug.length < 2) return null

  const [toolSlug, ...paramParts] = slug
  const rawParam = paramParts.join("-")
  const normalizedParam = normalizeProgrammaticParam(rawParam)
  if (!normalizedParam) return null

  return {
    canonicalPath: buildProgrammaticCanonicalPath(toolSlug, normalizedParam),
    normalizedParam,
    toolSlug,
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolved = resolveRoute((await params).slug)
  if (!resolved) {
    return {
      title: "Programmatic page not found | Plain Tools",
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  const existingVariant = getToolVariantPage(resolved.toolSlug, resolved.normalizedParam)
  if (existingVariant) {
    return {
      title: existingVariant.title,
      description: existingVariant.metaDescription,
      alternates: {
        canonical: `https://plain.tools${existingVariant.path}`,
      },
      robots: {
        index: false,
        follow: true,
      },
    }
  }

  const programmatic = generateProgrammaticMetadata(
    resolved.toolSlug,
    resolved.normalizedParam
  )

  if (!programmatic) {
    return {
      title: "Programmatic page not found | Plain Tools",
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  return programmatic.metadata
}

export default async function ProgrammaticCatchAllPage({ params }: PageProps) {
  const slug = (await params).slug
  const resolved = resolveRoute(slug)
  if (!resolved) {
    notFound()
  }

  if (slug.length !== 2 || slug[1] !== resolved.normalizedParam) {
    permanentRedirect(resolved.canonicalPath)
  }

  const existingVariant = getToolVariantPage(resolved.toolSlug, resolved.normalizedParam)
  if (existingVariant) {
    permanentRedirect(existingVariant.path)
  }

  const page = buildProgrammaticPageData(resolved.toolSlug, resolved.normalizedParam)
  const programmatic = generateProgrammaticMetadata(
    resolved.toolSlug,
    resolved.normalizedParam
  )

  if (!page || !programmatic) {
    notFound()
  }

  const ToolComponent: RegisteredToolComponent =
    toolComponents[page.tool.slug] ?? FallbackToolComponent

  return (
    <ProgrammaticLayout
      page={page}
      schema={programmatic.jsonLd}
      liveTool={
        <Suspense
          fallback={
            <div className="rounded-xl border border-border/70 bg-background/60 p-4 text-sm text-muted-foreground">
              Loading tool workspace...
            </div>
          }
        >
          <ErrorBoundary context={`programmatic:${page.tool.slug}:${page.paramSlug}`}>
            <ToolComponent />
          </ErrorBoundary>
        </Suspense>
      }
    />
  )
}
