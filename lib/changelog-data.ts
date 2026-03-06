export type ChangelogItem = {
  date: string
  title: string
  summary: string
  notes: string[]
  links?: { label: string; href: string }[]
}

export const CHANGELOG_ITEMS: ChangelogItem[] = [
  {
    date: "2026-03-06",
    title: "Homepage and tools discoverability polish",
    summary:
      "Improved homepage routing clarity, trust visibility, and stronger internal linking from core hubs.",
    notes: [
      "Added clearer homepage paths to tools, guides, comparisons, and status checks.",
      "Improved trust messaging and free-tier clarity without adding marketing clutter.",
      "Expanded tool-page related links and visible breadcrumbs for better UX and crawl depth.",
    ],
    links: [
      { label: "Browse tools", href: "/tools" },
      { label: "Read guides", href: "/learn" },
    ],
  },
  {
    date: "2026-03-05",
    title: "Structured data and metadata coverage expansion",
    summary:
      "Extended JSON-LD support and metadata consistency across homepage, hubs, and custom tool pages.",
    notes: [
      "Added reusable schema helpers and applied them to key pages.",
      "Improved SoftwareApplication / WebPage / FAQ coverage where content supports it.",
      "Kept schema factual with no ratings or synthetic trust claims.",
    ],
    links: [{ label: "Verify claims", href: "/verify-claims" }],
  },
  {
    date: "2026-03-04",
    title: "Navigation and routing stability updates",
    summary:
      "Tightened canonical routing and improved shell consistency across core public routes.",
    notes: [
      "Cleaned duplicated route paths and reinforced canonical destinations.",
      "Improved cross-section linking between tools, learn, compare, and support pages.",
      "Addressed UX regressions reported during external audit review.",
    ],
  },
]
