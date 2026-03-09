"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ExternalLink, Menu, X } from "lucide-react"
import { useEffect, useState } from "react"

import { ThemeToggle } from "@/components/ThemeToggle"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type NavItem = {
  label: string
  href: string
  external?: boolean
}

const navItems: NavItem[] = [
  { label: "Tools", href: "/tools" },
  { label: "Converters", href: "/file-converters" },
  { label: "Network", href: "/network-tools" },
  { label: "Status", href: "/status" },
  { label: "Learn", href: "/learn" },
  { label: "Compare", href: "/compare" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Verify", href: "/verify-claims" },
  {
    label: "GitHub",
    href: "https://github.com/Drgblack/plain-tools",
    external: true,
  },
]

const sisterSites: NavItem[] = [
  {
    label: "Plain Figures",
    href: "https://plainfigures.org/",
    external: true,
  },
  {
    label: "TimeMeaning",
    href: "https://timemeaning.com/",
    external: true,
  },
]

export function Navigation() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!mobileOpen) return
    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = previous
    }
  }, [mobileOpen])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/70 bg-background/92 shadow-[0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-xl supports-[backdrop-filter]:bg-background/78">
      <div className="mx-auto flex h-[4.25rem] max-w-6xl items-center justify-between px-4">
        <Link
          href="/"
          className="rounded-md text-base font-semibold tracking-tight text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          Plain Tools
        </Link>

        <nav className="hidden items-center gap-1.5 lg:flex">
          {navItems.map((item) => {
            const active = !item.external && pathname === item.href
            return (
              <Link
                key={item.label}
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                className={cn(
                  "inline-flex items-center gap-1 rounded-md px-3 py-2 text-[13px] transition-colors",
                  active
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                )}
              >
                {item.label}
                {item.external ? <ExternalLink className="h-3.5 w-3.5" /> : null}
              </Link>
            )
          })}
          <div className="ml-1 h-6 w-px bg-border/70" />
          {sisterSites.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-md px-3 py-2 text-[13px] text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground"
            >
              {item.label}
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-md border border-border/70 bg-card/40 px-2 py-1">
            <span className="hidden text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground sm:inline">
              Theme
            </span>
            <ThemeToggle />
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileOpen((value) => !value)}
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {mobileOpen ? (
        <nav className="border-t border-border/70 bg-background/95 px-4 py-3 lg:hidden">
          <p className="mb-2 rounded-md border border-border/60 bg-card/30 px-3 py-2 text-xs text-muted-foreground">
            Quick access to core tools, guides, comparisons, and status checks.
          </p>
          <div className="grid gap-1">
            {navItems.map((item) => {
              const active = !item.external && pathname === item.href
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noopener noreferrer" : undefined}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-md px-3 py-2.5 text-[13px] transition-colors",
                    active
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                  )}
                >
                  {item.label}
                  {item.external ? <ExternalLink className="h-3.5 w-3.5" /> : null}
                </Link>
              )
            })}
            <div className="mt-2 rounded-md border border-border/60 bg-card/30 px-3 py-2">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                    Theme
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Switch between dark and light mode safely in this browser.
                  </p>
                </div>
                <ThemeToggle />
              </div>
            </div>
            <div className="mt-2 border-t border-border/70 pt-2">
              <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Sister sites
              </p>
              {sisterSites.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex items-center justify-between rounded-md px-3 py-2.5 text-[13px] text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground"
                >
                  {item.label}
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              ))}
            </div>
          </div>
        </nav>
      ) : null}
    </header>
  )
}
