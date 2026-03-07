import type { Metadata } from "next"
import Link from "next/link"

import { buildPageMetadata } from "@/lib/page-metadata"
import { categories as blogCategories, posts as blogPosts } from "@/lib/blog-data"
import { trancheCompareSlugs, trancheLearnSlugs } from "@/lib/seo/tranche1-content"
import { workflowRouteSlugs } from "@/lib/seo/workflows-content"
import { STATUS_POPULAR_SITES, statusPathFor } from "@/lib/site-status"
import { TOOL_CATALOGUE } from "@/lib/tools-catalogue"

export const metadata: Metadata = buildPageMetadata({
  title: "HTML sitemap",
  description:
    "Browse a human-friendly map of Plain Tools sections, including tools, learn guides, comparison pages, blog entries, and legal support routes.",
  path: "/html-sitemap",
  image: "/og/default.png",
})

type SitemapLink = {
  label: string
  href: string
}

type SitemapSection = {
  title: string
  links: SitemapLink[]
}

const mainSections: SitemapSection[] = [
  {
    title: "Main pages",
    links: [
      { label: "Home", href: "/" },
      { label: "Tools", href: "/tools" },
      { label: "Learn", href: "/learn" },
      { label: "Compare", href: "/compare" },
      { label: "Blog", href: "/blog" },
      { label: "Pricing", href: "/pricing" },
      { label: "Verify Claims", href: "/verify-claims" },
      { label: "Roadmap", href: "/roadmap" },
      { label: "Changelog", href: "/changelog" },
      { label: "Labs", href: "/labs" },
    ],
  },
  {
    title: "Legal and support",
    links: [
      { label: "About", href: "/about" },
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "Support", href: "/support" },
    ],
  },
]

const toolLinks: SitemapLink[] = TOOL_CATALOGUE.filter((tool) => tool.available).map((tool) => ({
  label: tool.name,
  href: `/tools/${tool.slug}`,
}))

const learnHighlights: SitemapLink[] = trancheLearnSlugs.slice(0, 16).map((slug) => ({
  label: slug.replace(/-/g, " "),
  href: `/learn/${slug}`,
}))

const workflowLinks: SitemapLink[] = workflowRouteSlugs.map((slug) => ({
  label: slug.replace(/-/g, " "),
  href: `/learn/workflows/${slug}`,
}))

const compareLinks: SitemapLink[] = trancheCompareSlugs.map((slug) => ({
  label: slug.replace(/-/g, " "),
  href: `/compare/${slug}`,
}))

const networkLinks: SitemapLink[] = [
  { label: "Site status checker", href: "/site-status" },
  { label: "Network tools hub", href: "/network-tools" },
  { label: "DNS lookup", href: "/dns-lookup" },
  { label: "Ping test", href: "/ping-test" },
  { label: "What is my IP", href: "/what-is-my-ip" },
]

const popularStatusLinks: SitemapLink[] = STATUS_POPULAR_SITES.slice(0, 12).map((site) => ({
  label: `Check whether ${site} is down`,
  href: statusPathFor(site),
}))

const trustLinks: SitemapLink[] = [
  { label: "Verify claims", href: "/verify-claims" },
  { label: "No uploads explained", href: "/learn/no-uploads-explained" },
  { label: "How to audit network requests", href: "/learn/how-to-audit-pdf-tool-network-requests" },
  { label: "Offline vs online PDF tools", href: "/compare/offline-vs-online-pdf-tools" },
]

const blogLinks: SitemapLink[] = [
  ...blogCategories
    .filter((category) => category.slug !== "all")
    .map((category) => ({
      label: `Category: ${category.label}`,
      href: `/blog/category/${category.slug}`,
    })),
  ...blogPosts.slice(0, 10).map((post) => ({
    label: post.title,
    href: `/blog/${post.slug}`,
  })),
]

function SitemapSectionList({ section }: { section: SitemapSection }) {
  return (
    <section className="rounded-xl border border-border bg-card/40 p-5">
      <h2 className="text-lg font-semibold text-foreground">{section.title}</h2>
      <ul className="mt-3 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
        {section.links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="hover:text-foreground hover:underline">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default function HtmlSitemapPage() {
  return (
    <main className="flex-1 bg-background px-4 py-14 md:py-16">
      <div className="mx-auto max-w-5xl space-y-6">
        <header>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            HTML Sitemap
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
            Browse key Plain Tools pages in one place. For search engines, use{" "}
            <Link href="/sitemap.xml" className="text-accent hover:underline">
              sitemap.xml
            </Link>
            .
          </p>
        </header>

        {mainSections.map((section) => (
          <SitemapSectionList key={section.title} section={section} />
        ))}

        <SitemapSectionList section={{ title: "Key tools", links: toolLinks }} />
        <SitemapSectionList section={{ title: "Network tools", links: networkLinks }} />
        <SitemapSectionList section={{ title: "Popular status checks", links: popularStatusLinks }} />
        <SitemapSectionList section={{ title: "Trust and verification", links: trustLinks }} />
        <SitemapSectionList section={{ title: "Learn guides", links: learnHighlights }} />
        <SitemapSectionList section={{ title: "Workflow guides", links: workflowLinks }} />
        <SitemapSectionList section={{ title: "Compare pages", links: compareLinks }} />
        <SitemapSectionList section={{ title: "Blog links", links: blogLinks }} />
      </div>
    </main>
  )
}
