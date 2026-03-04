import Link from "next/link"
import { ChevronRight, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"
import { Surface } from "@/components/surface"

interface CategoryTileProps {
  name: string
  description: string
  href: string
  icon: React.ReactNode
  external?: boolean
  toolCount?: number
}

export function CategoryTile({
  name,
  description,
  href,
  icon,
  external,
  toolCount,
}: CategoryTileProps) {
  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="group block"
    >
      <Surface interactive className="h-full">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.08] text-foreground ring-1 ring-white/[0.12]">
          {icon}
        </div>

        <div className="mt-5">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-foreground">{name}</h3>
            {toolCount && (
              <span className="rounded-full bg-white/[0.08] px-2.5 py-0.5 text-xs font-medium text-muted-foreground ring-1 ring-white/[0.12]">
                {toolCount} tools
              </span>
            )}
          </div>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        </div>

        <div className="mt-6 pt-5 border-t border-white/[0.08]">
          <span className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-4 py-2",
            "bg-white/[0.08] text-sm font-semibold text-muted-foreground ring-1 ring-white/[0.12]",
            "transition-all duration-300 group-hover:bg-accent group-hover:text-accent-foreground group-hover:ring-accent/40"
          )}>
            {external ? "Visit site" : "Explore tools"}
            {external ? (
              <ExternalLink className="h-3.5 w-3.5" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            )}
          </span>
        </div>
      </Surface>
    </Link>
  )
}
