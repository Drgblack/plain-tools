import Link from "next/link"
import { ExternalLink } from "lucide-react"

const footerSections = [
  {
    title: "Categories",
    links: [
      { name: "Network Tools", href: "/network-tools" },
      { name: "File Tools", href: "/file-tools" },
      { name: "PDF Tools", href: "/tools" },
      { name: "Calculators", href: "https://plainfigures.org", external: true },
    ],
  },
  {
    title: "Popular",
    links: [
      { name: "What is My IP", href: "/what-is-my-ip" },
      { name: "DNS Lookup", href: "/dns-lookup" },
      { name: "Compress PDF", href: "/tools/compress-pdf" },
      { name: "PDF to Word", href: "/tools/pdf-to-word" },
    ],
  },
  {
    title: "Resources",
    links: [
      { name: "Learn", href: "/learn" },
      { name: "Compare", href: "/compare" },
      { name: "Blog", href: "/blog" },
      { name: "Pricing", href: "/pricing" },
      { name: "Support", href: "/support" },
      { name: "Roadmap", href: "/roadmap" },
      { name: "Changelog", href: "/changelog" },
      { name: "HTML Sitemap", href: "/sitemap" },
      { name: "About", href: "/about" },
      { name: "Privacy", href: "/privacy" },
    ],
  },
  {
    title: "Verify",
    links: [
      { name: "Verify claims", href: "/verify-claims" },
      { name: "View source", href: "https://github.com/Drgblack/plain-tools", external: true },
      { name: "How it works", href: "/verify-claims#how-it-works" },
    ],
  },
  {
    title: "Projects",
    links: [
      { name: "TimeMeaning", href: "https://timemeaning.com", external: true, description: "Interpret dates and time zones in plain English" },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-border/50 bg-card/30">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-6">
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-lg w-fit">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground">
                <span className="text-sm font-bold text-background">P</span>
              </div>
              <span className="text-lg font-semibold tracking-tight">
                plain.tools
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Fast, private tools that run locally in your browser. Core local workflows avoid uploads.
            </p>
          </div>

          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-foreground">
                {section.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noopener noreferrer" : undefined}
                      className="inline-flex items-center gap-1.5 rounded-md px-1 py-0.5 text-sm text-muted-foreground transition-[color,background-color] duration-200 hover:bg-muted/40 hover:text-foreground focus:outline-none focus-visible:bg-muted/40 focus-visible:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    >
                      {link.name}
                      {link.external && <ExternalLink className="h-3 w-3" />}
                    </Link>
                    {link.description && (
                      <p className="mt-1 text-xs text-muted-foreground/70">{link.description}</p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-border/50 pt-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            Core tools run locally. AI features are opt-in.
          </p>
          <Link
            href="/verify-claims"
            className="rounded-md px-2 py-1 text-sm text-muted-foreground transition-[color,background-color] duration-200 hover:bg-muted/40 hover:text-foreground focus:outline-none focus-visible:bg-muted/40 focus-visible:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            View source to verify claims
          </Link>
        </div>
      </div>
    </footer>
  )
}
