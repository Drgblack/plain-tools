"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ExternalLink, Menu, X } from "lucide-react"
import { useState } from "react"

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
  { label: "Learn", href: "/learn" },
  { label: "Compare", href: "/compare" },
  { label: "Blog", href: "/blog" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
  { label: "Verify", href: "/verify-claims" },
  {
    label: "GitHub",
    href: "https://github.com/Drgblack/plain-tools",
    external: true,
  },
]

export function Navigation() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

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
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
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
          </div>
        </nav>
      ) : null}
    </header>
  )
}
