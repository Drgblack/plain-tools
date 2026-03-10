import { buildMetaDescription } from "@/lib/page-metadata"
import type {
  ProgrammaticExplanationBlock,
  ProgrammaticFaq,
  ProgrammaticHowToStep,
  ProgrammaticPageData,
  ProgrammaticRelatedTool,
} from "@/lib/programmatic-content"
import { STATUS_DOMAIN_NAMES } from "@/lib/status-domains"
import { normalizeSiteInput } from "@/lib/site-status"
import { getToolBySlug, type ToolDefinition } from "@/lib/tools-catalogue"

export type StatusTrendingSegment = "consumer" | "developer" | "saas" | "social" | "streaming"

export const STATUS_TRENDING_SEGMENTS: Array<{
  label: string
  segment: StatusTrendingSegment
}> = [
  { label: "Social Platforms", segment: "social" },
  { label: "Consumer Platforms", segment: "consumer" },
  { label: "Cloud & SaaS Services", segment: "saas" },
  { label: "Developer Platforms", segment: "developer" },
  { label: "Streaming Services", segment: "streaming" },
]

export const STATUS_OUTAGE_HISTORY_DOMAINS = STATUS_DOMAIN_NAMES.slice(0, 180)

export function normalizeStatusHistoryDomain(value: string) {
  return normalizeSiteInput(value)
}

export function getStatusTrendingPaths() {
  return STATUS_TRENDING_SEGMENTS.map((entry) => `/status/trending/${entry.segment}`)
}

export function getStatusOutageHistoryPaths() {
  return STATUS_OUTAGE_HISTORY_DOMAINS.map(
    (domain) => `/status/${encodeURIComponent(domain)}/outage-history`
  )
}

export const STATUS_EXTENSION_METADATA_EXAMPLES = [
  {
    description: buildMetaDescription(
      "Trending social outage checks today on Plain Tools, with canonical status routes and adjacent DNS and IP diagnostics."
    ),
    path: "/status/trending/social",
    title: "Trending Social Outages Today | Plain Tools",
  },
  {
    description: buildMetaDescription(
      "Outage history for chatgpt.com with aggregated checks, recent incident windows, and privacy-first network diagnostics on Plain Tools."
    ),
    path: "/status/chatgpt.com/outage-history",
    title: "chatgpt.com Outage History – Incidents & Status Timeline | Plain Tools",
  },
]

const statusTool = getToolBySlug("site-status-checker")

if (!statusTool) {
  throw new Error("Site Status Checker tool definition is missing.")
}

type StatusPageBundle = {
  breadcrumbs: Array<{ href?: string; label: string }>
  canonicalPath: string
  desc: string
  featureList: string[]
  heroBadges: string[]
  h1: string
  liveToolDescription: string
  page: ProgrammaticPageData
  siloLinks: Array<{ href: string; label: string }>
  title: string
}

function countWords(values: string[]) {
  return values.join(" ").trim().split(/\s+/).filter(Boolean).length
}

function buildPageData(input: {
  canonicalPath: string
  description: string
  explanationBlocks: ProgrammaticExplanationBlock[]
  faq: ProgrammaticFaq[]
  howItWorks: string[]
  howToSteps: ProgrammaticHowToStep[]
  intro: string[]
  paramLabel: string
  paramSlug: string
  privacyNote: string[]
  relatedTools: ProgrammaticRelatedTool[]
  title: string
  tool: ToolDefinition
  whyUsersNeedThis: string[]
}) {
  return {
    ...input,
    wordCount: countWords([
      input.title,
      input.description,
      ...input.intro,
      ...input.whyUsersNeedThis,
      ...input.howItWorks,
      ...input.howToSteps.flatMap((step) => [step.name, step.text]),
      ...input.explanationBlocks.flatMap((block) => [block.title, ...block.paragraphs]),
      ...input.privacyNote,
      ...input.faq.flatMap((item) => [item.question, item.answer]),
    ]),
  } satisfies ProgrammaticPageData
}

export function getStatusTrendingBundle(segment: StatusTrendingSegment): StatusPageBundle | null {
  const entry = STATUS_TRENDING_SEGMENTS.find((item) => item.segment === segment)
  if (!entry) return null

  const canonicalPath = `/status/trending/${segment}`
  const title = `Trending ${entry.label} Outages Today | Plain Tools`
  const desc = buildMetaDescription(
    `See trending ${entry.label.toLowerCase()} outage checks today on Plain Tools, with canonical status pages and adjacent DNS, IP, and latency diagnostics.`
  )

  return {
    breadcrumbs: [{ href: "/", label: "Home" }, { href: "/status", label: "Status" }, { href: "/status/trending", label: "Trending" }, { label: entry.label }],
    canonicalPath,
    desc,
    featureList: ["Trending outage checks by segment", "Direct links into canonical status routes", "DNS, IP, and reachability follow-up paths"],
    heroBadges: ["trending", "status checks", "privacy-first", "no accounts"],
    h1: `Trending ${entry.label} Outages Today`,
    liveToolDescription: "Run a fresh status check for any domain while keeping the route inside the same network/status silo.",
    page: buildPageData({
      canonicalPath,
      description: desc,
      explanationBlocks: [
        {
          paragraphs: [
            `Trending outage pages work because searchers want prioritization, not a giant alphabetical directory. This route surfaces the ${entry.label.toLowerCase()} services that are drawing the most checks right now.`,
            "That makes the page useful for both search and direct navigation. A user can spot the hot checks quickly, then move into the canonical site route or the adjacent DNS/IP diagnostics.",
          ],
          title: "Why segment trending pages matter",
        },
        {
          paragraphs: [
            "Trending does not mean we track people individually. It means the site aggregates anonymous domain-level check counts and recent status snapshots.",
            "That privacy-safe aggregation model is important because the page should stay useful without becoming a surveillance-style dashboard.",
          ],
          title: "How the data stays lightweight",
        },
        {
          paragraphs: [
            "Once a service appears near the top of a trending segment, the next job is usually operational: run the live check, compare the canonical status page, and verify DNS or reachability if the failure seems local.",
            "The internal linking on these pages is built around that next-step path.",
          ],
          title: "What to do after spotting a trend",
        },
      ],
      faq: [
        { answer: "These routes rank the domains that are receiving the highest anonymous aggregated status-check activity within the segment.", question: `What makes a ${entry.label.toLowerCase()} service trend here?` },
        { answer: "No. Trending is based on domain-level aggregate activity only, without personal identifiers or file data.", question: "Does this page track individual users?" },
        { answer: "Not always. A trend may reflect a real outage, a regional event, or a burst of curiosity after a public incident report.", question: "Does trending always mean the service is down?" },
        { answer: "Open the canonical status route, then move into DNS, ping, and IP checks if you need to separate local issues from broader incidents.", question: "What should I do when a service is trending?" },
        { answer: "Because different service groups create different search intent. Segment pages are easier to navigate and easier to index than one undifferentiated mega-page.", question: "Why split trends by segment?" },
        { answer: "The page refreshes on a short ISR window so it can respond to changing demand without turning into a noisy no-cache route.", question: "How often does this page update?" },
      ],
      howItWorks: [
        "The page requests the latest aggregate trend counts for the selected status segment, then renders the list server-side so it is shareable and indexable.",
        "That gives Plain Tools a useful midpoint between a static directory and a purely client-side dashboard.",
      ],
      howToSteps: [
        { name: "Check the top trending services first", text: "The first few results usually capture the strongest current outage or concern signals in the segment." },
        { name: "Open the canonical status route", text: "Move into the service-specific route to inspect current reachability instead of relying on trend rank alone." },
        { name: "Use DNS and ping for local-vs-global context", text: "If the service looks healthy for others, network checks help separate ISP or resolver issues from a wider incident." },
        { name: "Watch the trend over time", text: "Short-lived bursts can fade quickly, while sustained trending often suggests a broader incident window." },
      ],
      intro: [
        `Trending ${entry.label.toLowerCase()} outage pages capture a different search intent from a standard status checker. The user is not asking about one known service yet. They are asking what is breaking right now inside a service group they care about.`,
        "That is why this route is useful. It ranks the checks drawing attention, explains what the trend means, and links directly into the canonical pages needed for follow-up diagnosis.",
      ],
      paramLabel: entry.label,
      paramSlug: segment,
      privacyNote: [
        "Trending pages are built from anonymous aggregate status-check activity, not user accounts or document data.",
        "That keeps the route useful for outage discovery while staying aligned with the site's privacy-first posture.",
      ],
      relatedTools: [
        { description: "Run a live check for another service.", href: "/site-status", name: "Site status checker" },
        { description: "Inspect DNS for a trending domain.", href: "/dns/google.com", name: "DNS lookup" },
        { description: "Measure latency after a status check.", href: "/ping-test", name: "Ping test" },
        { description: "Check public IP context.", href: "/what-is-my-ip", name: "IP checker" },
        { description: "Browse all status routes.", href: "/status", name: "Status directory" },
        { description: "See all trending checks.", href: "/status/trending", name: "Trending overview" },
      ],
      title,
      tool: statusTool,
      whyUsersNeedThis: [
        "The route is valuable because it narrows discovery. Users do not need to guess which service to check first when a whole platform category feels unstable.",
        "That makes segment trending pages a practical SEO and UX extension of the existing /status system.",
      ],
    }),
    siloLinks: [
      { href: "/status/trending", label: "All trending checks" },
      { href: "/site-status", label: "Live status checker" },
      { href: "/dns-lookup", label: "DNS lookup" },
      { href: "/ping-test", label: "Ping test" },
    ],
    title,
  }
}

export function getStatusOutageHistoryBundle(domain: string): StatusPageBundle | null {
  const normalized = normalizeStatusHistoryDomain(domain)
  if (!normalized) return null

  const canonicalPath = `/status/${encodeURIComponent(normalized)}/outage-history`
  const title = `${normalized} Outage History – Incidents & Status Timeline | Plain Tools`
  const desc = buildMetaDescription(
    `Review outage history for ${normalized}, including recent aggregated checks, timeline guidance, and follow-up DNS and network diagnostics on Plain Tools.`
  )

  return {
    breadcrumbs: [{ href: "/", label: "Home" }, { href: "/status", label: "Status" }, { href: `/status/${encodeURIComponent(normalized)}`, label: normalized }, { label: "Outage History" }],
    canonicalPath,
    desc,
    featureList: ["Recent outage history guidance", "Timeline-aware status interpretation", "DNS and network follow-up links"],
    heroBadges: ["outage history", "status timeline", "privacy-first", "no accounts"],
    h1: `${normalized} Outage History`,
    liveToolDescription: "Run a fresh status check for the same domain or pivot into DNS and network diagnostics.",
    page: buildPageData({
      canonicalPath,
      description: desc,
      explanationBlocks: [
        {
          paragraphs: [
            "Outage-history pages answer a slightly different question from a live status page. Instead of only asking whether the service is up now, the user wants to know whether there was a pattern of recent instability.",
            `That matters for ${normalized} because repeated short outages, degraded responses, and incident clusters often change how users interpret a current status result.`,
          ],
          title: "Why outage history matters",
        },
        {
          paragraphs: [
            "A history page is only useful when it stays honest about the data source. Plain Tools uses aggregated status observations and recent timeline context rather than unverifiable anecdotal reporting.",
            "That gives the route a cleaner trust model and keeps it aligned with the site's privacy-first positioning.",
          ],
          title: "Why the data model stays simple",
        },
        {
          paragraphs: [
            "The practical value is helping users decide whether they are seeing a one-off local issue or part of a wider service pattern.",
            "That is why the route links into the canonical status page, DNS, IP, and ping checks instead of treating history as the final answer.",
          ],
          title: "How to use the page operationally",
        },
      ],
      faq: [
        { answer: `The page summarizes recent aggregated reachability context for ${normalized} so users can judge whether a current issue looks isolated or part of a wider pattern.`, question: `What does this outage-history page show for ${normalized}?` },
        { answer: "No. It uses anonymous status observations and timeline summaries rather than personal identifiers or user-submitted reports.", question: "Does this page store personal activity data?" },
        { answer: "Not necessarily. A clean history does not rule out a local issue, and a rough history does not prove the service is down this minute.", question: "Does outage history guarantee current status?" },
        { answer: "Start with the live status route, then compare DNS resolution, latency, and IP context if the problem still looks ambiguous.", question: "What should I check after reading the history?" },
        { answer: "Because users often search for service stability patterns, not just a one-time up/down answer.", question: "Why create separate outage-history pages?" },
        { answer: "The route refreshes on a shorter ISR window than static content so the timeline remains relevant.", question: "How often is the history refreshed?" },
      ],
      howItWorks: [
        "The page reads the recent aggregated status-history summary for the domain and renders it server-side so it can act as a stable reference route.",
        "That gives searchers and returning users a page that is more useful than a transient dashboard view and more focused than a generic status homepage.",
      ],
      howToSteps: [
        { name: "Check the current status first", text: "A live check tells you whether the service is reachable right now before you interpret recent history." },
        { name: "Read the recent timeline", text: "Use the timeline blocks to see whether failures look clustered, isolated, or stable." },
        { name: "Compare with DNS and latency", text: "If the service appears healthy overall, local DNS or transport issues may explain the problem better than outage history." },
        { name: "Use related status routes", text: "Move into the canonical service page or trending segment if you need broader context." },
      ],
      intro: [
        `People search outage-history pages when a binary up/down answer is not enough. They want to know whether ${normalized} has been unstable recently, whether the incident looks ongoing, and whether their current problem fits a wider pattern.`,
        "This route exists to answer that intent directly. It keeps the history view attached to the live status checker and the surrounding network tools instead of isolating it as a dead-end content page.",
      ],
      paramLabel: normalized,
      paramSlug: normalized,
      privacyNote: [
        "Plain Tools uses anonymous aggregated status observations for this page. It does not require an account or collect file data to render outage-history context.",
        "That lighter data model keeps the route useful without turning it into a personal-activity feed.",
      ],
      relatedTools: [
        { description: "Run the current status check now.", href: `/status/${encodeURIComponent(normalized)}`, name: `Status for ${normalized}` },
        { description: "Inspect DNS for the same domain.", href: `/dns/${encodeURIComponent(normalized)}`, name: "DNS lookup" },
        { description: "Check current latency.", href: "/ping-test", name: "Ping test" },
        { description: "Inspect current public IP context.", href: "/what-is-my-ip", name: "IP checker" },
        { description: "Browse trending status pages.", href: "/status/trending", name: "Trending checks" },
        { description: "Open the status directory.", href: "/status", name: "Status directory" },
      ],
      title,
      tool: statusTool,
      whyUsersNeedThis: [
        "A service can be technically up while still being practically unstable. That gap is exactly why outage-history routes capture search demand.",
        "This page helps users interpret instability patterns without leaving the network/status silo.",
      ],
    }),
    siloLinks: [
      { href: `/status/${encodeURIComponent(normalized)}`, label: `Status for ${normalized}` },
      { href: `/dns/${encodeURIComponent(normalized)}`, label: `DNS for ${normalized}` },
      { href: "/ping-test", label: "Ping test" },
      { href: "/status/trending", label: "Trending outage checks" },
    ],
    title,
  }
}
