"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, lazy, Suspense } from "react"
import { Search, Menu, X, Command, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ThemeToggle"
import { cn } from "@/lib/utils"

// Lazy load command palette - only loaded when user opens it
const CommandPalette = lazy(() => import("@/components/command-palette").then(mod => ({ default: mod.CommandPalette })))

const navItems = [
  { name: "PDF", href: "/tools" },
  { name: "Network", href: "/network-tools" },
  { name: "Status", href: "/site-status" },
  { name: "File", href: "/file-tools" },
  { name: "Learn", href: "/learn" },
  { name: "Compare", href: "/compare" },
  { name: "Pricing", href: "/pricing" },
  { name: "Verify", href: "/verify-claims" },
  { name: "About", href: "/about" },
]

const sisterSites = [
  {
    name: "Plain Figures",
    href: "https://plainfigures.org/",
    description: "Calculator-focused sister site",
  },
  {
    name: "TimeMeaning",
    href: "https://timemeaning.com/",
    description: "Time interpretation and timezone clarity",
  },
]

export function SiteHeader() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/90 shadow-[0_6px_24px_-20px_rgba(0,0,0,0.65)] backdrop-blur-xl supports-[backdrop-filter]:bg-background/70">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 rounded-lg transition-colors hover:text-foreground/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground">
              <span className="text-sm font-bold text-background">P</span>
            </div>
            <span className="text-lg font-semibold tracking-tight text-foreground">
              plain.tools
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                className={cn(
                  "inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-[background-color,color,box-shadow] duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  pathname === item.href
                    ? "bg-secondary text-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-secondary/55 hover:text-foreground"
                )}
              >
                {item.name}
                {item.external && <ExternalLink className="h-3 w-3" />}
                {pathname === item.href ? <span className="ml-1 h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" /> : null}
              </Link>
            ))}
            <details className="group relative">
              <summary
                className={cn(
                  "list-none inline-flex cursor-pointer items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-[background-color,color,box-shadow] duration-200 hover:bg-secondary/55 hover:text-foreground",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                )}
              >
                Sister sites
                <ExternalLink className="h-3 w-3" />
              </summary>
              <div className="absolute right-0 z-30 mt-2 w-72 rounded-lg border border-border bg-card p-3 shadow-lg">
                <ul className="space-y-2">
                  {sisterSites.map((site) => (
                    <li key={site.href}>
                      <Link
                        href={site.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block rounded-md px-2 py-1.5 transition-colors hover:bg-secondary/50"
                      >
                        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground">
                          {site.name}
                          <ExternalLink className="h-3 w-3" />
                        </span>
                        <p className="mt-0.5 text-xs text-muted-foreground">{site.description}</p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </details>
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />

            <Button
              variant="outline"
              size="sm"
              className="hidden h-9 gap-2 border-border/60 bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground sm:flex focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              onClick={() => setCommandPaletteOpen(true)}
            >
              <Search className="h-4 w-4" />
              <span className="text-sm">Search tools...</span>
              <kbd className="pointer-events-none ml-2 hidden h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground sm:flex">
                <Command className="h-3 w-3" />K
              </kbd>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-muted-foreground hover:text-foreground sm:hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              onClick={() => setCommandPaletteOpen(true)}
              aria-label="Search tools"
            >
              <Search className="h-4 w-4" />
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 md:hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="border-t border-border/50 bg-background px-4 py-4 md:hidden">
            <div className="flex flex-col gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noopener noreferrer" : undefined}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-[background-color,color,box-shadow] duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    pathname === item.href
                      ? "bg-secondary text-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-secondary/55 hover:text-foreground"
                  )}
                >
                  {item.name}
                  {item.external && <ExternalLink className="h-3 w-3" />}
                </Link>
              ))}
              <div className="mt-3 border-t border-border/50 pt-3">
                <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  Sister sites
                </p>
                {sisterSites.map((site) => (
                  <Link
                    key={site.href}
                    href={site.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMobileMenuOpen(false)}
                    className="inline-flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-[background-color,color] duration-200 hover:bg-secondary/55 hover:text-foreground"
                  >
                    <span>{site.name}</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                ))}
              </div>
            </div>
          </nav>
        )}
      </header>

      {/* Command Palette - only rendered when opened (lazy loaded) */}
      {commandPaletteOpen && (
        <Suspense fallback={null}>
          <CommandPalette 
            open={commandPaletteOpen} 
            onOpenChange={setCommandPaletteOpen} 
          />
        </Suspense>
      )}
    </>
  )
}
