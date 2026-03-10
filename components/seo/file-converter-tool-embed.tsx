import { Suspense } from "react"

import { ErrorBoundary } from "@/components/error-boundary"
import { FallbackToolComponent, toolComponents } from "@/components/tools/tool-component-registry"
import UniversalFormatConverterTool from "@/components/tools/universal-format-converter-tool"
import type { ConverterEmbed, ConverterFormat, ConverterPairPage } from "@/lib/converter-pairs"
import type { FileConverterSeoPage } from "@/lib/file-converter-slugs"

type ConverterEmbedPage =
  | Pick<FileConverterSeoPage, "embed" | "from" | "slug" | "to">
  | Pick<ConverterPairPage, "embed" | "fromFormat" | "slug" | "toFormat">
  | {
      embed: ConverterEmbed
      fromFormat: ConverterFormat
      slug: string
      toFormat: ConverterFormat
    }

function resolveFormats(page: ConverterEmbedPage) {
  if ("fromFormat" in page && "toFormat" in page) {
    return {
      fromFormat: page.fromFormat,
      toFormat: page.toFormat,
    }
  }

  return {
    fromFormat: page.from,
    toFormat: page.to,
  }
}

type FileConverterToolEmbedProps = {
  page: ConverterEmbedPage
}

export function FileConverterToolEmbed({ page }: FileConverterToolEmbedProps) {
  const { fromFormat, toFormat } = resolveFormats(page)

  if (page.embed.kind === "universal") {
    return (
      <UniversalFormatConverterTool
        from={fromFormat.slug}
        fromLabel={fromFormat.seoLabel}
        to={toFormat.slug}
        toLabel={toFormat.seoLabel}
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
