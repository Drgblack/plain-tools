import { AdSlot } from "@/components/ads/ad-slot"
import { type AdPlacement } from "@/lib/ads"
import { cn } from "@/lib/utils"

type AdLayoutProps = {
  placement: AdPlacement
  className?: string
  innerClassName?: string
}

export function AdLayout({ placement, className, innerClassName }: AdLayoutProps) {
  return (
    <section className={cn("px-4 py-8 md:py-10", className)} data-ad-layout={placement}>
      <div className={cn("mx-auto max-w-6xl", innerClassName)}>
        <AdSlot placement={placement} />
      </div>
    </section>
  )
}
