import { Suspense } from "react"

import { ErrorBoundary } from "@/components/error-boundary"
import {
  FallbackToolComponent,
  toolComponents,
  type RegisteredToolComponent,
} from "@/components/tools/tool-component-registry"

type ToolWorkspaceEmbedProps = {
  routeId: string
  toolSlug: string
}

export function ToolWorkspaceEmbed({ routeId, toolSlug }: ToolWorkspaceEmbedProps) {
  const ToolComponent: RegisteredToolComponent =
    toolComponents[toolSlug] ?? FallbackToolComponent

  return (
    <Suspense
      fallback={
        <div className="rounded-xl border border-border/70 bg-card/40 p-4 text-sm text-muted-foreground">
          Loading tool workspace...
        </div>
      }
    >
      <ErrorBoundary context={`tool-workspace:${routeId}`}>
        <ToolComponent />
      </ErrorBoundary>
    </Suspense>
  )
}
