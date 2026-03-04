import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Surface } from "@/components/surface"

export interface ToolCardProps {
  name: string
  description: string
  href: string
  tags?: string[]
  icon?: React.ReactNode
}

const tagColors: Record<string, string> = {
  Local: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  Edge: "bg-sky-500/15 text-sky-400 border-sky-500/20",
  WASM: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  Worker: "bg-violet-500/15 text-violet-400 border-violet-500/20",
}

export function ToolCard({ name, description, href, tags, icon }: ToolCardProps) {
  return (
    <Link href={href} className="group block">
      <Surface interactive className="h-full">
        <div className="flex items-start gap-4">
          {icon && (
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/[0.08] text-foreground ring-1 ring-white/[0.12]">
              {icon}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground">{name}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground line-clamp-2">
              {description}
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between gap-3">
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className={cn(
                    "rounded-full border px-2.5 py-0.5 text-[11px] font-semibold",
                    tagColors[tag] || "bg-secondary text-muted-foreground border-border"
                  )}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <span className={cn(
            "ml-auto flex items-center gap-1.5 rounded-full px-4 py-2",
            "bg-white/[0.08] text-xs font-semibold text-muted-foreground ring-1 ring-white/[0.12]",
            "transition-all duration-300 group-hover:bg-accent group-hover:text-accent-foreground group-hover:ring-accent/40"
          )}>
            Open tool
            <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </Surface>
    </Link>
  )
}
