"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

const subnavItems = [
  { label: "Plain.tools", href: "/" },
  { label: "Tools", href: "/pdf-tools" },
  { label: "Learn", href: "/pdf-tools/learn" },
  { label: "Blog", href: "/pdf-tools/blog" },
  { label: "Verify", href: "/pdf-tools/verify-claims" },
]

function isActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/"
  }

  return pathname === href || pathname.startsWith(`${href}/`)
}

export function PdfToolsSubnav() {
  const pathname = usePathname()

  return (
    <div className="w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-2 px-4 py-2">
        {subnavItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "rounded-md px-2.5 py-1.5 text-sm transition-colors",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              isActive(pathname, item.href)
                ? "bg-secondary font-semibold text-foreground"
                : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
            )}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  )
}
