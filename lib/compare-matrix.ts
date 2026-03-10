export type CompareRouteParams = {
  slug: string
}

export type ComparisonEntry = {
  desc: string
  slug: string
  title: string
  tool1: string
  tool2: string
}

export type ComparisonFaq = {
  answer: string
  question: string
}

export type ComparisonRow = {
  feature: string
  tool1: string
  tool2: string
}

export type ComparisonSection = {
  paragraphs: string[]
  title: string
}

type ProcessingModel = "browser-first" | "hybrid" | "upload-first"
type PricingModel = "free-heavy" | "freemium" | "trial" | "subscription"
type PrivacyStance = "privacy-first" | "mixed" | "cloud-first"

type CompareTool = {
  bestFor: string
  displayName: string
  localPositioning: string
  pricing: PricingModel
  privacy: PrivacyStance
  privacySummary: string
  processing: ProcessingModel
  slug: string
  speedSummary: string
}

export type ComparisonPage = ComparisonEntry & {
  canonicalPath: string
  faq: ComparisonFaq[]
  intro: string[]
  recommendation: {
    rationale: string
    summary: string
    winner: string
  }
  relatedLinks: Array<{ href: string; title: string }>
  rows: ComparisonRow[]
  sections: ComparisonSection[]
  tool1Name: string
  tool2Name: string
  wordCount: number
}

const TOOLS: CompareTool[] = [
  {
    bestFor: "privacy-sensitive teams that want no-upload defaults",
    displayName: "Plain Tools",
    localPositioning: "Files stay on-device for the core browser workflows.",
    pricing: "free-heavy",
    privacy: "privacy-first",
    privacySummary:
      "Local browser processing is the default story for core PDF workflows, with no upload required for the main task path.",
    processing: "browser-first",
    slug: "plain-tools",
    speedSummary: "Fast for one-off tasks because there is no upload queue or hosted processing delay.",
  },
  {
    bestFor: "general users who want a familiar hosted PDF brand",
    displayName: "Smallpdf",
    localPositioning: "Primarily a hosted document workflow with account-oriented upsell paths.",
    pricing: "freemium",
    privacy: "cloud-first",
    privacySummary:
      "Convenient and polished, but the usual path is still upload-first rather than browser-first.",
    processing: "upload-first",
    slug: "smallpdf",
    speedSummary: "Fast enough, but the workflow still includes transfer time and hosted processing.",
  },
  {
    bestFor: "users who want a broad set of hosted PDF utilities",
    displayName: "iLovePDF",
    localPositioning: "Feature breadth is strong, but the primary habit remains cloud-style file handling.",
    pricing: "freemium",
    privacy: "cloud-first",
    privacySummary:
      "Broad PDF coverage with convenient hosted tooling, but less aligned with strict no-upload workflows.",
    processing: "upload-first",
    slug: "ilovepdf",
    speedSummary: "Good throughput for common tasks, though still bound to upload and download steps.",
  },
  {
    bestFor: "enterprise Adobe ecosystems and account-managed workflows",
    displayName: "Adobe Acrobat Online",
    localPositioning: "Strong ecosystem fit, but online tasks are centered on hosted service flows.",
    pricing: "trial",
    privacy: "cloud-first",
    privacySummary:
      "Deep suite depth, yet online processing typically assumes account control and hosted document handling.",
    processing: "upload-first",
    slug: "adobe-acrobat-online",
    speedSummary: "Powerful, but often heavier and more account-dependent than a lightweight local tool flow.",
  },
  {
    bestFor: "Windows-heavy teams that want a large toolkit",
    displayName: "PDF24",
    localPositioning: "Hybrid story with stronger desktop awareness than most purely hosted brands.",
    pricing: "free-heavy",
    privacy: "mixed",
    privacySummary:
      "Better offline and desktop posture than upload-only brands, but route clarity still matters.",
    processing: "hybrid",
    slug: "pdf24",
    speedSummary: "Good when the desktop path is already installed, less uniform across route choices.",
  },
  {
    bestFor: "users who like a hybrid desktop-plus-web model",
    displayName: "Sejda",
    localPositioning: "A mix of web and desktop expectations, with route-dependent privacy posture.",
    pricing: "freemium",
    privacy: "mixed",
    privacySummary:
      "Useful hybrid positioning, but privacy handling depends more heavily on which route the user chooses.",
    processing: "hybrid",
    slug: "sejda",
    speedSummary: "Reasonably fast, though product-mode switching adds decision friction.",
  },
  {
    bestFor: "business buyers who want suite packaging",
    displayName: "Soda PDF",
    localPositioning: "Suite-first positioning rather than lightweight local browser workflow.",
    pricing: "subscription",
    privacy: "mixed",
    privacySummary:
      "Business-friendly packaging, but less direct no-upload messaging than a privacy-first tool.",
    processing: "hybrid",
    slug: "sodapdf",
    speedSummary: "Depends heavily on whether the user works through online or installed flows.",
  },
  {
    bestFor: "teams standardised on a mature enterprise document vendor",
    displayName: "Foxit PDF",
    localPositioning: "Enterprise depth with stronger managed-environment appeal than lightweight browser tools.",
    pricing: "subscription",
    privacy: "mixed",
    privacySummary:
      "Good business controls, but not built around the same simple no-upload browser-first story.",
    processing: "hybrid",
    slug: "foxit-pdf",
    speedSummary: "Strong in managed environments, but heavier than consumer utility workflows.",
  },
  {
    bestFor: "cost-conscious users who want lots of tools quickly",
    displayName: "PDFgear",
    localPositioning: "Broad utility angle with mixed desktop and cloud expectations.",
    pricing: "free-heavy",
    privacy: "mixed",
    privacySummary:
      "Value-oriented and broad, though its privacy model is less focused than Plain Tools.",
    processing: "hybrid",
    slug: "pdfgear",
    speedSummary: "Often efficient, but route consistency matters more than the marketing suggests.",
  },
  {
    bestFor: "casual users who want a wide catalogue of hosted utilities",
    displayName: "PDF Candy",
    localPositioning: "Consumer utility coverage with a cloud-style workflow bias.",
    pricing: "freemium",
    privacy: "cloud-first",
    privacySummary:
      "Convenient breadth, but hosted processing remains the central habit for many tasks.",
    processing: "upload-first",
    slug: "pdfcandy",
    speedSummary: "Acceptable for ad hoc work, but still slowed by transfer-heavy flows.",
  },
  {
    bestFor: "design teams already working inside Canva",
    displayName: "Canva PDF Tools",
    localPositioning: "Best as part of a broader Canva workflow rather than standalone privacy-first processing.",
    pricing: "freemium",
    privacy: "cloud-first",
    privacySummary:
      "Fine inside design-centric workflows, but not a strong match for no-upload PDF handling.",
    processing: "upload-first",
    slug: "canva-pdf-tools",
    speedSummary: "Smooth inside Canva, less compelling if the job is only a PDF utility task.",
  },
  {
    bestFor: "browser-first annotation and simple PDF editing needs",
    displayName: "Xodo",
    localPositioning: "Collaborative cloud expectations with browser and app surfaces.",
    pricing: "freemium",
    privacy: "mixed",
    privacySummary:
      "Useful browser editing surface, but still not positioned around strict local-first handling.",
    processing: "hybrid",
    slug: "xodo",
    speedSummary: "Good for review flows, with more collaboration overhead than lightweight utilities.",
  },
]

function buildEntries() {
  const entries: ComparisonEntry[] = []

  for (let index = 0; index < TOOLS.length; index += 1) {
    for (let compareIndex = index + 1; compareIndex < TOOLS.length; compareIndex += 1) {
      const tool1 = TOOLS[index]
      const tool2 = TOOLS[compareIndex]
      entries.push({
        desc: `Compare ${tool1.displayName} vs ${tool2.displayName} for privacy, upload policy, pricing, speed, and local vs cloud PDF workflow fit. Includes a privacy-first Plain Tools recommendation angle.`,
        slug: `${tool1.slug}-vs-${tool2.slug}`,
        title: `${tool1.displayName} vs ${tool2.displayName} – Privacy & Features Comparison | Plain Tools`,
        tool1: tool1.slug,
        tool2: tool2.slug,
      })
    }
  }

  return entries
}

export const COMPARE_MATRIX = buildEntries()

const COMPARE_MAP = new Map(COMPARE_MATRIX.map((entry) => [entry.slug, entry]))
const TOOL_MAP = new Map(TOOLS.map((tool) => [tool.slug, tool]))

function compareScore(tool: CompareTool) {
  return (
    (tool.processing === "browser-first" ? 4 : tool.processing === "hybrid" ? 2 : 0) +
    (tool.privacy === "privacy-first" ? 4 : tool.privacy === "mixed" ? 2 : 0) +
    (tool.pricing === "free-heavy" ? 2 : tool.pricing === "freemium" ? 1 : 0)
  )
}

function buildRecommendation(tool1: CompareTool, tool2: CompareTool) {
  const tool1Score = compareScore(tool1)
  const tool2Score = compareScore(tool2)
  const winner = tool1Score >= tool2Score ? tool1 : tool2
  const loser = winner.slug === tool1.slug ? tool2 : tool1

  if (winner.slug === "plain-tools") {
    return {
      rationale: `${winner.displayName} wins when the deciding factor is privacy-first file handling. ${winner.localPositioning} ${loser.displayName} may still make sense for users who want a hosted ecosystem, account features, or a familiar suite, but the local/no-upload model is the stronger default for sensitive documents.`,
      summary: `${winner.displayName} is the stronger choice when privacy, no-upload handling, and low-friction execution matter most.`,
      winner: winner.displayName,
    }
  }

  return {
    rationale: `${winner.displayName} edges ahead inside this head-to-head because it better matches the average buyer between these two products. Even so, Plain Tools remains the privacy-first alternative if your real requirement is local browser processing rather than another upload-centric workflow.`,
    summary: `${winner.displayName} is the stronger general pick between these two, but Plain Tools stays the better privacy-first fallback.`,
    winner: winner.displayName,
  }
}

function buildRows(tool1: CompareTool, tool2: CompareTool): ComparisonRow[] {
  return [
    {
      feature: "Processing model",
      tool1: tool1.processing,
      tool2: tool2.processing,
    },
    {
      feature: "Upload policy",
      tool1: tool1.localPositioning,
      tool2: tool2.localPositioning,
    },
    {
      feature: "Privacy posture",
      tool1: tool1.privacySummary,
      tool2: tool2.privacySummary,
    },
    {
      feature: "Pricing model",
      tool1: tool1.pricing,
      tool2: tool2.pricing,
    },
    {
      feature: "Speed profile",
      tool1: tool1.speedSummary,
      tool2: tool2.speedSummary,
    },
    {
      feature: "Best fit",
      tool1: tool1.bestFor,
      tool2: tool2.bestFor,
    },
  ]
}

function buildIntro(tool1: CompareTool, tool2: CompareTool) {
  return [
    `${tool1.displayName} vs ${tool2.displayName} is not just a feature checklist query. Users normally search it when they are close to a decision and want to know which product fits their actual workflow, privacy expectations, and budget shape. That means the useful comparison is not "who has more buttons?" but "who handles files in the way my team can actually live with?"`,
    `That framing matters even more for PDF utilities because the documents are often sensitive. Contracts, invoices, HR exports, scanned IDs, and customer files all travel through the same category. So this page keeps the structure practical: upload policy, privacy, speed, pricing, local vs cloud behaviour, and a direct recommendation with a Plain Tools privacy-first angle.`,
  ]
}

function buildSections(
  tool1: CompareTool,
  tool2: CompareTool,
  recommendation: ReturnType<typeof buildRecommendation>
): ComparisonSection[] {
  return [
    {
      title: `Why users compare ${tool1.displayName} and ${tool2.displayName}`,
      paragraphs: [
        `${tool1.displayName} and ${tool2.displayName} solve overlapping PDF jobs, but they do not solve them with the same operating assumptions. One product may lean harder into hosted workflows, while the other may offer a better desktop or hybrid story. For buyers, that changes what "fast" and "safe" actually mean.`,
        `The search intent here is usually practical. Someone wants a shortlist decision they can defend to a manager, a procurement teammate, or themselves. That is why the page compares workflow shape, not just marketing pages.`,
      ],
    },
    {
      title: "Privacy, uploads, and local vs cloud behaviour",
      paragraphs: [
        `${tool1.displayName}: ${tool1.privacySummary} ${tool2.displayName}: ${tool2.privacySummary}`,
        `That distinction is the highest-signal difference for many teams. A cloud-first product can still be perfectly usable, but it asks the buyer to trust remote processing, account controls, and retention policies. A browser-first or stronger local path narrows that trust surface significantly.`,
      ],
    },
    {
      title: "Speed, pricing, and day-to-day workflow friction",
      paragraphs: [
        `${tool1.displayName} tends to feel like ${tool1.speedSummary.toLowerCase()} ${tool2.displayName} tends to feel like ${tool2.speedSummary.toLowerCase()}`,
        `Pricing only makes sense when tied to how the team actually works. A cheaper monthly plan can still cost more if every sensitive document needs extra policy review because the workflow is hosted. Conversely, a heavier suite can be worth it if the organisation already standardised on that vendor and needs the broader environment.`,
      ],
    },
    {
      title: "What changes when the documents are actually sensitive",
      paragraphs: [
        `A comparison that ignores document sensitivity is usually incomplete. Many PDF jobs involve statements, contracts, HR forms, signed documents, procurement packs, or internal slide decks. In those cases the architecture matters more than the screenshot gallery. A browser-first tool reduces one category of exposure by keeping the file on-device for the core task, while a hosted workflow shifts the risk conversation toward vendor controls, retention, account permissions, and procurement review.`,
        `That does not automatically make every cloud tool wrong. It simply changes the burden of proof. If the files are sensitive, the buyer should ask harder questions about where the bytes go, how long they stay there, which plan controls are required, and whether the team can verify those claims in practice. This is where Plain Tools deliberately tilts the comparison toward privacy-first defaults rather than pretending every workflow is equivalent.`,
      ],
    },
    {
      title: "Recommendation",
      paragraphs: [recommendation.summary, recommendation.rationale],
    },
    {
      title: "Where Plain Tools fits if neither option feels clean",
      paragraphs: [
        `Even when the search query is ${tool1.displayName} vs ${tool2.displayName}, plenty of users are really looking for a safer workflow default. Plain Tools is that alternative when the requirement is simple: keep the core job local in the browser, avoid unnecessary uploads, and move directly into the next PDF task without an account-first handoff.`,
        `That is also why these comparison pages link back into real tools and adjacent comparisons. They are designed as executable SEO surfaces, not dead-end opinion pages.`,
      ],
    },
  ]
}

function buildFaq(tool1: CompareTool, tool2: CompareTool, winner: string): ComparisonFaq[] {
  return [
    {
      question: `Which is better: ${tool1.displayName} or ${tool2.displayName}?`,
      answer: `${winner} comes out ahead in this comparison, but the right answer still depends on whether you need privacy-first local processing or a more account-centric hosted workflow.`,
    },
    {
      question: `Which is better for private documents: ${tool1.displayName} or ${tool2.displayName}?`,
      answer:
        "The better option is the one with the lower upload exposure for your workflow. If strict no-upload handling is the requirement, Plain Tools remains the stronger privacy-first alternative.",
    },
    {
      question: "Do comparison pages like this replace testing the workflow yourself?",
      answer:
        "No. They narrow the shortlist and make the trade-offs explicit, but the final decision should still be based on a representative pilot using real documents and your own policy constraints.",
    },
    {
      question: "Why does this page keep mentioning Plain Tools?",
      answer:
        "Because many comparison searches are really alternative-intent searches. Users want to evaluate vendors, but they also want a practical local/no-upload option if both products feel too cloud-dependent.",
    },
    {
      question: `When might ${tool1.displayName} or ${tool2.displayName} still be the better fit than Plain Tools?`,
      answer:
        "When your organisation prioritises suite depth, account administration, or vendor standardisation over a lighter browser-first workflow. The right decision depends on operating context, not ideology.",
    },
    {
      question: "What should teams test during a real pilot?",
      answer:
        "Use the same representative files on both products, check upload behavior, turnaround time, export quality, and the number of steps needed to complete the task. That practical test is usually more valuable than another vendor feature table.",
    },
  ]
}

function countWords(values: string[]) {
  return values
    .join(" ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length
}

export function getComparisonEntry(slug: string) {
  return COMPARE_MAP.get(slug) ?? null
}

export function getComparisonPage(slug: string): ComparisonPage | null {
  const entry = getComparisonEntry(slug)
  if (!entry) return null

  const tool1 = TOOL_MAP.get(entry.tool1)
  const tool2 = TOOL_MAP.get(entry.tool2)
  if (!tool1 || !tool2) return null

  const recommendation = buildRecommendation(tool1, tool2)
  const intro = buildIntro(tool1, tool2)
  const sections = buildSections(tool1, tool2, recommendation)
  const faq = buildFaq(tool1, tool2, recommendation.winner)
  const rows = buildRows(tool1, tool2)
  const relatedLinks = getRelatedComparisonLinks(slug)
  const wordCount = countWords([
    entry.title,
    entry.desc,
    ...intro,
    ...sections.flatMap((section) => [section.title, ...section.paragraphs]),
    ...faq.flatMap((item) => [item.question, item.answer]),
  ])

  return {
    ...entry,
    canonicalPath: `/compare/${entry.slug}`,
    faq,
    intro,
    recommendation,
    relatedLinks,
    rows,
    sections,
    tool1Name: tool1.displayName,
    tool2Name: tool2.displayName,
    wordCount,
  }
}

export function getCompareMatrix() {
  return COMPARE_MATRIX
}

export function generateAllComparisonParams(limit?: number): CompareRouteParams[] {
  const entries = typeof limit === "number" ? COMPARE_MATRIX.slice(0, limit) : COMPARE_MATRIX
  return entries.map((entry) => ({ slug: entry.slug }))
}

export function getCompareMatrixSitemapPaths() {
  return COMPARE_MATRIX.map((entry) => `/compare/${entry.slug}`)
}

export function getRelatedComparisonLinks(slug: string) {
  const entry = getComparisonEntry(slug)
  if (!entry) return []

  const relatedPairs = COMPARE_MATRIX.filter(
    (pair) =>
      pair.slug !== slug &&
      ([pair.tool1, pair.tool2].includes(entry.tool1) || [pair.tool1, pair.tool2].includes(entry.tool2))
  )
    .slice(0, 6)
    .map((pair) => ({
      href: `/compare/${pair.slug}`,
      title: pair.title.replace(" – Privacy & Features Comparison | Plain Tools", ""),
    }))

  return [
    ...relatedPairs,
    { href: "/compare", title: "Browse all comparisons" },
    { href: "/pdf-tools", title: "Browse PDF tools" },
    { href: "/tools/merge-pdf", title: "Try Merge PDF locally" },
    { href: "/tools/compress-pdf", title: "Try Compress PDF locally" },
  ]
    .filter((link, index, links) => links.findIndex((entryLink) => entryLink.href === link.href) === index)
    .slice(0, 10)
}

export const COMPARISON_METADATA_EXAMPLES = [
  getComparisonPage("smallpdf-vs-ilovepdf"),
  getComparisonPage("plain-tools-vs-pdf24"),
  getComparisonPage("smallpdf-vs-sejda"),
]
  .filter((entry): entry is ComparisonPage => Boolean(entry))
  .map((entry) => ({
    description: entry.desc,
    path: entry.canonicalPath,
    title: entry.title,
  }))
