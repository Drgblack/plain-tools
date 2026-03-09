import { AdSlot } from "@/components/ads/ad-slot"

type ToolPageAdProps = {
  className?: string
}

function shouldRenderToolPageAds() {
  return process.env.NODE_ENV === "production"
}

export function AdContentTop({ className }: ToolPageAdProps) {
  if (!shouldRenderToolPageAds()) {
    return null
  }

  return <AdSlot placement="tool_content_top" className={className} />
}

export function AdAfterResult({ className }: ToolPageAdProps) {
  if (!shouldRenderToolPageAds()) {
    return null
  }

  return <AdSlot placement="tool_result_after" className={className} />
}

export function AdToolSidebar({ className }: ToolPageAdProps) {
  if (!shouldRenderToolPageAds()) {
    return null
  }

  return <AdSlot placement="tool_sidebar" className={className} />
}
