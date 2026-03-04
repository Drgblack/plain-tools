"use client"

import { useState, ReactNode } from "react"
import { X, Lock, FileText, Maximize2, Minimize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface ToolWorkspaceProps {
  title: string
  fileName?: string
  children: ReactNode
  onClose?: () => void
  showPrivacyBanner?: boolean
  privacyBannerText?: string
}

export function ToolWorkspace({
  title,
  fileName,
  children,
  onClose,
  showPrivacyBanner = true,
  privacyBannerText = "100% Local Processing"
}: ToolWorkspaceProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)

  return (
    <div className={`flex flex-col bg-background ${isFullscreen ? "fixed inset-0 z-50" : "min-h-[calc(100vh-56px)]"}`}>
      {/* Workspace Header */}
      <header className="flex items-center justify-between border-b border-white/[0.08] bg-[oklch(0.115_0.008_250)] px-4 py-3">
        <div className="flex items-center gap-3">
          <Link href="/tools" className="text-muted-foreground/70 hover:text-foreground transition-colors">
            <X className="h-5 w-5" strokeWidth={1.5} />
          </Link>
          <div className="h-5 w-px bg-white/[0.08]" />
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-accent/70" strokeWidth={1.5} />
            <span className="text-[14px] font-medium text-foreground">{title}</span>
          </div>
          {fileName && (
            <>
              <div className="h-4 w-px bg-white/[0.06]" />
              <span className="text-[13px] text-muted-foreground/70 truncate max-w-[200px]">{fileName}</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Privacy Badge */}
          {showPrivacyBanner && (
            <div className="flex items-center gap-1.5 rounded-lg bg-accent/10 px-3 py-1.5 ring-1 ring-accent/20">
              <Lock className="h-3 w-3 text-accent" strokeWidth={2} />
              <span className="text-[11px] font-medium text-accent">{privacyBannerText}</span>
            </div>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="h-8 w-8 p-0 text-muted-foreground/70 hover:text-foreground"
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4" strokeWidth={1.5} />
            ) : (
              <Maximize2 className="h-4 w-4" strokeWidth={1.5} />
            )}
          </Button>
        </div>
      </header>

      {/* Workspace Content */}
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  )
}
