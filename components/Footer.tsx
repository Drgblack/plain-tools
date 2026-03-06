import Link from "next/link"
import { ExternalLink } from "lucide-react"

type FooterLink = {
  label: string
  href: string
  external?: boolean
}

type FooterSection = {
  title: string
  links: FooterLink[]
}

const footerSections: FooterSection[] = [
  {
    title: "Product",
    links: [
      { label: "Tools", href: "/tools" },
      { label: "Converters", href: "/file-converters" },
      { label: "Pricing", href: "/pricing" },
      { label: "Verify Claims", href: "/verify-claims" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Learn", href: "/learn" },
      { label: "Compare", href: "/compare" },
      { label: "Blog", href: "/blog" },
      { label: "Roadmap", href: "/roadmap" },
      { label: "Changelog", href: "/changelog" },
      { label: "HTML Sitemap", href: "/sitemap" },
      { label: "Support", href: "/support" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "Cookie Notice", href: "/privacy#cookies" },
      { label: "Security", href: "/.well-known/security.txt" },
    ],
  },
  {
    title: "About",
    links: [
      { label: "About", href: "/about" },
      {
        label: "GitHub",
        href: "https://github.com/Drgblack/plain-tools",
        external: true,
      },
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
      { label: "hello@plain.tools", href: "mailto:hello@plain.tools", external: true },
    ],
  },
]

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border/60 bg-background/95">
      <div className="mx-auto max-w-6xl px-4 py-14 md:py-16">
        <div className="mb-10 md:mb-12">
          <Link href="/" className="text-lg font-semibold tracking-tight text-foreground">
            Plain Tools
          </Link>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Private browser utilities for everyday PDF and file workflows. Processed locally with no
            uploads.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h2 className="text-sm font-semibold tracking-tight text-foreground">{section.title}</h2>
              <ul className="mt-4 space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noopener noreferrer" : undefined}
                      className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                      {link.external ? <ExternalLink className="h-3 w-3" /> : null}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-border/60 pt-6 text-sm text-muted-foreground">
          <p>Private browser tools. Files processed locally where supported.</p>
          <p className="mt-1">
            Looking for calculators? Visit Plain Figures. Need timezone clarity? Use TimeMeaning.
          </p>
          <p className="mt-1">&copy; {year} Plain Tools. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
