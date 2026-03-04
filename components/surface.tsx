import { cn } from "@/lib/utils"
import { forwardRef } from "react"

interface SurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Whether the surface should show hover effects (lift + accent border + glow) */
  interactive?: boolean
  /** Custom element type to render as */
  as?: "div" | "article" | "section"
  children: React.ReactNode
}

/**
 * Surface - A shared primitive for all card/tile UI across the site.
 * 
 * Provides consistent "two-black separation" styling with:
 * - Lighter charcoal card on near-black page background
 * - Multi-layer Apple-style shine effect
 * - 1px top highlight catchlight
 * - Radial top-left glow
 * - Internal sheen gradient
 * - Ambient shadow for OLED visibility
 * - Hover states with accent border + glow (when interactive)
 */
export const Surface = forwardRef<HTMLDivElement, SurfaceProps>(
  ({ className, interactive = false, as: Component = "div", children, ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(
          // Base structure
          "relative rounded-2xl p-7 overflow-hidden",
          // Two-black separation: card surface is lighter charcoal
          "bg-card",
          // Border with subtle white tint visible at rest
          "border border-white/[0.14]",
          // Ambient shadow + outer glow halo for OLED visibility
          "shadow-[0_4px_24px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.04),0_0_40px_rgba(255,255,255,0.02)]",
          // Transition for hover states
          "transition-all duration-300 ease-out",
          // Interactive hover effects
          interactive && [
            "hover:-translate-y-1",
            "hover:border-accent/50",
            "hover:shadow-[0_16px_48px_rgba(0,0,0,0.7),0_0_80px_rgba(100,200,180,0.15)]",
          ],
          className
        )}
        {...props}
      >
        {/* Layer 1: 1px top highlight line - light catching upper edge */}
        <div 
          className="pointer-events-none absolute inset-x-0 top-0 h-px" 
          style={{
            background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 20%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.15) 80%, transparent 100%)"
          }}
        />
        
        {/* Layer 2: Radial glow from top-left corner */}
        <div 
          className="pointer-events-none absolute inset-0"
          style={{
            background: "radial-gradient(ellipse 80% 50% at 10% 0%, rgba(255,255,255,0.08) 0%, transparent 50%)"
          }}
        />
        
        {/* Layer 3: Internal sheen gradient (diagonal) */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.10] via-white/[0.03] to-transparent" />
        
        {/* Content layer - above shine effects */}
        <div className="relative z-10">
          {children}
        </div>
      </Component>
    )
  }
)

Surface.displayName = "Surface"
