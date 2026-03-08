import { AdPlaceholder } from "@/components/ads/ad-placeholder"
import { cn } from "@/lib/utils"

type AdsensePlaceholderProps = {
  slot?: string
  className?: string
  title?: string
}

// Legacy compatibility wrapper. New work should use AdSlot with named placements.
export function AdsensePlaceholder({ className }: AdsensePlaceholderProps) {
  return (
    <div className={cn(className)}>
      <AdPlaceholder placement="guide_content_top" />
    </div>
  )
}
