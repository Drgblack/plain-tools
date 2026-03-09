import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Suspense } from "react"

import { ProgrammaticLayout } from "@/components/ProgrammaticLayout"
import { ErrorBoundary } from "@/components/error-boundary"
import {
  FallbackToolComponent,
  toolComponents,
  type RegisteredToolComponent,
} from "@/components/tools/tool-component-registry"
import {
  buildPdfVariantProgrammaticBundle,
  generatePdfVariantStaticParams,
  type PdfVariantRouteParams,
} from "@/lib/pdf-variants"

type PageProps = {
  params: Promise<PdfVariantRouteParams>
}

export const revalidate = 86400
export const dynamicParams = true

async function resolveParams(params: Promise<PdfVariantRouteParams>) {
  return params
}

export function generateStaticParams() {
  const requestedLimit = Number.parseInt(process.env.PDF_VARIANT_PREBUILD_LIMIT ?? "", 10)
  const limit = Number.isFinite(requestedLimit) && requestedLimit > 0 ? requestedLimit : undefined

  return generatePdfVariantStaticParams({ limit })
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { action, variant } = await resolveParams(params)
  const bundle = buildPdfVariantProgrammaticBundle(action, variant)

  if (!bundle) {
    return {
      title: "PDF tool page not found | Plain Tools",
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  return bundle.metadata
}

export default async function PdfToolVariantRoute({ params }: PageProps) {
  const { action, variant } = await resolveParams(params)
  const bundle = buildPdfVariantProgrammaticBundle(action, variant)

  if (!bundle) {
    notFound()
  }

  const ToolComponent: RegisteredToolComponent =
    toolComponents[bundle.page.tool.slug] ?? FallbackToolComponent

  return (
    <ProgrammaticLayout
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "PDF Tools", href: "/pdf-tools" },
        { label: bundle.page.tool.name, href: `/tools/${bundle.page.tool.slug}` },
        { label: bundle.seoPage.h1 },
      ]}
      page={bundle.page}
      relatedSectionTitle="You might also need"
      schema={bundle.schema}
      siloLinks={[
        { label: "PDF Tools hub", href: "/pdf-tools" },
        { label: "Programmatic variants", href: "/pdf-tools/variants" },
        { label: `Open ${bundle.page.tool.name}`, href: `/tools/${bundle.page.tool.slug}` },
      ]}
      titleOverride={bundle.seoPage.h1}
      liveTool={
        <Suspense
          fallback={
            <div className="rounded-xl border border-border/70 bg-background/60 p-4 text-sm text-muted-foreground">
              Loading tool workspace...
            </div>
          }
        >
          <ErrorBoundary context={`pdf-tools:${action}:${variant}`}>
            <ToolComponent />
          </ErrorBoundary>
        </Suspense>
      }
    />
  )
}
