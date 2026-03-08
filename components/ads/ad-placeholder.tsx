import { getAdPlacementConfig, getAdSlotConfigForPlacement, type AdPlacement } from "@/lib/ads"
import { cn } from "@/lib/utils"

type AdPlaceholderProps = {
  placement: AdPlacement
  className?: string
}

export function AdPlaceholder({ placement, className }: AdPlaceholderProps) {
  const config = getAdPlacementConfig(placement)
  const slot = getAdSlotConfigForPlacement(placement)

  return (
    <div
      className={cn(
        "rounded-2xl border border-dashed border-border/80 bg-card/35 p-4 text-center",
        className
      )}
      style={{ minHeight: `${slot.minHeight}px` }}
      data-ad-placement={placement}
      data-ad-slot-type={config.slotType}
      data-ad-mode="placeholder"
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        Advertisement
      </p>
      <div className="mt-3 flex min-h-[inherit] items-center justify-center rounded-xl border border-border/70 bg-background/60 px-5 py-10">
        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">{config.label}</p>
          <p className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
            {slot.slotName} · {slot.recommendedSize}
          </p>
          <p className="max-w-md text-xs leading-relaxed text-muted-foreground">
            Placeholder for a configured AdSense unit. This stays visible in development and when
            manual ad slots are not yet assigned. {slot.responsiveBehavior}
          </p>
        </div>
      </div>
    </div>
  )
}
