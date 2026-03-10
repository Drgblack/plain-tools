import { Suspense } from "react"

import { ErrorBoundary } from "@/components/error-boundary"
import { FallbackToolComponent, toolComponents } from "@/components/tools/tool-component-registry"
import UniversalFormatConverterTool from "@/components/tools/universal-format-converter-tool"
import type { ConverterPairPage } from "@/lib/converter-pairs"
import type { FileConverterSeoPage } from "@/lib/file-converter-slugs"

type FileConverterToolEmbedProps = {
  page: Pick<FileConverterSeoPage | ConverterPairPage, "embed" | "from" | "slug" | "to">
}

export function FileConverterToolEmbed({ page }: FileConverterToolEmbedProps) {
  if (page.embed.kind === "universal") {
    return (
      <UniversalFormatConverterTool
        from={page.from.slug}
        fromLabel={page.from.seoLabel}
        to={page.to.slug}
        toLabel={page.to.seoLabel}
      />
    )
  }

  const ToolComponent = toolComponents[page.embed.toolSlug] ?? FallbackToolComponent

  return (
    <Suspense
      fallback={
        <div className="rounded-xl border border-border/70 bg-card/40 p-4 text-sm text-muted-foreground">
          Loading converter workspace...
        </div>
      }
    >
      <ErrorBoundary context={`file-converter:${page.slug}`}>
        <ToolComponent />
      </ErrorBoundary>
    </Suspense>
  )
}
