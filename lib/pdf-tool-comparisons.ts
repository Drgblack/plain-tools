import { getToolBySlug } from "@/lib/tools-catalogue"

export type PdfComparisonRouteParams = {
  pair: string
}

export type PdfComparisonLink = {
  href: string
  label: string
}

export type PdfComparisonFaq = {
  answer: string
  question: string
}

export type PdfComparisonSection = {
  heading: string
  id: string
  paragraphs: string[]
}

export type PdfComparisonRow = {
  feature: string
  tool1: string
  tool2: string
}

type ProcessingModel = "browser-first" | "hybrid" | "upload-first"
type FreeTier = "strong" | "limited" | "trial"
type TeamFit = "individual" | "small-team" | "enterprise"

type ComparisonTool = {
  bestFor: string
  collaboration: string
  freeTier: FreeTier
  name: string
  privacySummary: string
  processing: ProcessingModel
  recommendationAngle: string
  slug: string
  strengths: string
  teamFit: TeamFit
}

export type PdfComparisonPage = {
  faq: PdfComparisonFaq[]
  h1: string
  introParagraphs: string[]
  metaDescription: string
  metaTitle: string
  pairSlug: string
  path: string
  recommendation: {
    rationale: string
    summary: string
    winner: string
  }
  relatedLinks: {
    comparisons: PdfComparisonLink[]
    tools: PdfComparisonLink[]
  }
  sections: PdfComparisonSection[]
  table: PdfComparisonRow[]
  title: string
  tool1: ComparisonTool
  tool2: ComparisonTool
}

const PDF_COMPARISON_TOOLS: ComparisonTool[] = [
  {
    slug: "plain-tools",
    name: "Plain Tools",
    processing: "browser-first",
    privacySummary: "No upload for the core PDF workflows, with browser-only positioning and privacy-first guidance.",
    bestFor: "sensitive PDF work, quick one-off tasks, and users who want local processing first",
    strengths: "strong local-first positioning, direct tools, and clear trust messaging",
    collaboration: "lightweight collaboration; best when each user runs the tool locally",
    freeTier: "strong",
    teamFit: "small-team",
    recommendationAngle: "best when privacy and local control matter more than cloud storage features",
  },
  {
    slug: "smallpdf",
    name: "Smallpdf",
    processing: "upload-first",
    privacySummary: "Primarily cloud-style document handling with polished UX and broad consumer familiarity.",
    bestFor: "general users who want a polished interface and broad PDF coverage",
    strengths: "strong brand recognition, clean UX, and broad PDF workflow coverage",
    collaboration: "good for lightweight cloud handoff flows",
    freeTier: "limited",
    teamFit: "individual",
    recommendationAngle: "best when interface polish matters more than strict local processing",
  },
  {
    slug: "ilovepdf",
    name: "iLovePDF",
    processing: "upload-first",
    privacySummary: "Cloud-oriented PDF workflow with desktop options, but many common paths still centre on upload and hosted processing.",
    bestFor: "users who want a broad menu of PDF utilities and simple batch actions",
    strengths: "wide coverage, recognisable brand, and straightforward bulk tasks",
    collaboration: "reasonable for teams already comfortable with cloud PDF flows",
    freeTier: "limited",
    teamFit: "small-team",
    recommendationAngle: "best when feature breadth matters and files are not highly sensitive",
  },
  {
    slug: "adobe",
    name: "Adobe Acrobat Online",
    processing: "upload-first",
    privacySummary: "Enterprise-grade ecosystem with strong feature depth, but online workflows are account-centric and upload-heavy.",
    bestFor: "Adobe-centric teams, enterprise procurement, and advanced document workflows",
    strengths: "deep ecosystem integration and enterprise familiarity",
    collaboration: "strong for enterprise account workflows",
    freeTier: "trial",
    teamFit: "enterprise",
    recommendationAngle: "best when enterprise standardisation matters more than no-upload simplicity",
  },
  {
    slug: "sejda",
    name: "Sejda",
    processing: "hybrid",
    privacySummary: "Mix of desktop and web options, so the privacy story depends on which product path the user actually picks.",
    bestFor: "users who value a hybrid desktop-plus-web model",
    strengths: "flexible mix of cloud and desktop flows",
    collaboration: "better for individuals than large teams",
    freeTier: "limited",
    teamFit: "individual",
    recommendationAngle: "best when a hybrid desktop route is acceptable and task limits are manageable",
  },
  {
    slug: "pdf24",
    name: "PDF24",
    processing: "hybrid",
    privacySummary: "Known for desktop-heavy workflows and a wide tool set, with a stronger offline story than typical upload-first brands.",
    bestFor: "Windows-heavy teams that want a large PDF utility bundle",
    strengths: "broad toolkit and recognisable offline options",
    collaboration: "better for desktop-heavy internal workflows",
    freeTier: "strong",
    teamFit: "small-team",
    recommendationAngle: "best when a broad desktop toolkit matters more than a focused browser-first product",
  },
  {
    slug: "pdfgear",
    name: "PDFgear",
    processing: "hybrid",
    privacySummary: "Mixes desktop and cloud-style expectations, with a value-oriented pitch and broad workflow coverage.",
    bestFor: "cost-conscious users who want a wide tool list",
    strengths: "aggressive value proposition and broad tool coverage",
    collaboration: "fine for ad hoc team use",
    freeTier: "strong",
    teamFit: "small-team",
    recommendationAngle: "best when price sensitivity matters more than a strict privacy-first model",
  },
  {
    slug: "pdfcandy",
    name: "PDF Candy",
    processing: "upload-first",
    privacySummary: "Consumer-oriented hosted PDF tooling with broad surface area and convenience-driven flows.",
    bestFor: "casual users who want many PDF options in one place",
    strengths: "wide long-tail tool coverage and easy discoverability",
    collaboration: "limited team-specific advantages",
    freeTier: "limited",
    teamFit: "individual",
    recommendationAngle: "best when a casual user needs breadth more than privacy guarantees",
  },
  {
    slug: "sodapdf",
    name: "Soda PDF",
    processing: "hybrid",
    privacySummary: "Balanced desktop and online model with business-facing features, but less direct local-first messaging than Plain Tools.",
    bestFor: "business users who want a recognisable PDF suite",
    strengths: "suite positioning and familiar business feature set",
    collaboration: "reasonable for business account workflows",
    freeTier: "trial",
    teamFit: "enterprise",
    recommendationAngle: "best when suite packaging matters more than lightweight browser-only tools",
  },
  {
    slug: "foxit",
    name: "Foxit PDF",
    processing: "hybrid",
    privacySummary: "Strong document suite reputation with enterprise and desktop depth, though simpler online jobs may feel heavier.",
    bestFor: "business teams that want a mature PDF suite with broader enterprise depth",
    strengths: "mature business feature set and familiar document tooling",
    collaboration: "stronger for managed business environments",
    freeTier: "trial",
    teamFit: "enterprise",
    recommendationAngle: "best when business controls and suite depth matter more than a minimal workflow",
  },
  {
    slug: "canva",
    name: "Canva PDF Tools",
    processing: "upload-first",
    privacySummary: "Fits design-centric cloud workflows, but PDF processing is secondary to the broader Canva ecosystem.",
    bestFor: "marketing and design teams already living inside Canva",
    strengths: "design workflow context and familiar collaboration",
    collaboration: "strong inside Canva teams",
    freeTier: "limited",
    teamFit: "small-team",
    recommendationAngle: "best when the PDF job is part of a wider Canva design workflow",
  },
]

function buildComparisonPairs() {
  const pairs: Array<{ pairSlug: string; tool1: ComparisonTool; tool2: ComparisonTool }> = []

  for (let index = 0; index < PDF_COMPARISON_TOOLS.length; index += 1) {
    for (let compareIndex = index + 1; compareIndex < PDF_COMPARISON_TOOLS.length; compareIndex += 1) {
      const tool1 = PDF_COMPARISON_TOOLS[index]
      const tool2 = PDF_COMPARISON_TOOLS[compareIndex]
      pairs.push({
        pairSlug: `${tool1.slug}-vs-${tool2.slug}`,
        tool1,
        tool2,
      })
    }
  }

  return pairs
}

const PDF_COMPARISON_PAIRS = buildComparisonPairs()
const PDF_COMPARISON_PAIR_MAP = new Map(
  PDF_COMPARISON_PAIRS.map((pair) => [pair.pairSlug, pair])
)

function toolScore(tool: ComparisonTool) {
  return (
    (tool.processing === "browser-first" ? 5 : tool.processing === "hybrid" ? 3 : 1) +
    (tool.freeTier === "strong" ? 2 : tool.freeTier === "limited" ? 1 : 0) +
    (tool.teamFit === "enterprise" ? 2 : tool.teamFit === "small-team" ? 1 : 0)
  )
}

function buildRecommendation(tool1: ComparisonTool, tool2: ComparisonTool) {
  const tool1Score = toolScore(tool1)
  const tool2Score = toolScore(tool2)
  const winner = tool1Score >= tool2Score ? tool1 : tool2
  const loser = winner.slug === tool1.slug ? tool2 : tool1

  if (winner.slug === "plain-tools") {
    return {
      winner: winner.name,
      summary: `${winner.name} is the better fit when no-upload handling and browser-first privacy are the deciding factors.`,
      rationale: `${winner.name} wins this comparison for privacy-sensitive workflows because it centres the experience on local processing for the core PDF tasks. ${loser.name} may still suit users who want a broader cloud suite or a specific ecosystem, but the recommendation shifts toward ${winner.name} when trust, speed, and minimal handoff risk come first.`,
    }
  }

  return {
    winner: winner.name,
    summary: `${winner.name} is the stronger default between these two, but Plain Tools remains the better privacy-first alternative for sensitive files.`,
    rationale: `${winner.name} edges ahead because it offers a stronger mix of workflow breadth, team fit, and practical PDF coverage for the average buyer. ${loser.name} can still be the right pick in narrow cases, yet neither matches the plain no-upload positioning that Plain Tools offers for sensitive local PDF jobs.`,
  }
}

function buildTable(tool1: ComparisonTool, tool2: ComparisonTool): PdfComparisonRow[] {
  return [
    { feature: "Primary processing model", tool1: tool1.processing, tool2: tool2.processing },
    { feature: "Privacy posture", tool1: tool1.privacySummary, tool2: tool2.privacySummary },
    { feature: "Best fit", tool1: tool1.bestFor, tool2: tool2.bestFor },
    { feature: "Strengths", tool1: tool1.strengths, tool2: tool2.strengths },
    { feature: "Collaboration model", tool1: tool1.collaboration, tool2: tool2.collaboration },
    { feature: "Free tier", tool1: tool1.freeTier, tool2: tool2.freeTier },
    { feature: "Team fit", tool1: tool1.teamFit, tool2: tool2.teamFit },
    { feature: "Recommendation angle", tool1: tool1.recommendationAngle, tool2: tool2.recommendationAngle },
  ]
}

function buildSections(
  tool1: ComparisonTool,
  tool2: ComparisonTool,
  recommendation: PdfComparisonPage["recommendation"]
): PdfComparisonSection[] {
  return [
    {
      id: "decision-summary",
      heading: `${tool1.name} vs ${tool2.name}: decision summary`,
      paragraphs: [
        `${tool1.name} vs ${tool2.name} is a real comparison query because users are usually close to a decision when they search for it. They already understand the category. What they need is a clear explanation of privacy posture, workflow friction, pricing expectations, and which product is likely to be the better fit for their specific context. That is the difference between a useful comparison page and a thin affiliate-style summary.`,
        `On Plain Tools, the comparison is also framed through a privacy-first lens because that is where utility-site differentiation becomes concrete. Some products assume the upload-first model and optimise around hosted convenience, while others have stronger desktop or browser-first stories. Searchers evaluating ${tool1.name} and ${tool2.name} usually need to know not just who has more features, but who handles files in a way they can actually trust.`,
      ],
    },
    {
      id: "privacy",
      heading: `Privacy and file handling: ${tool1.name} vs ${tool2.name}`,
      paragraphs: [
        `${tool1.name} approaches file handling as ${tool1.processing}, while ${tool2.name} sits closer to ${tool2.processing}. That difference matters more than most comparison pages admit. If the document contains contracts, customer records, invoices, health data, or internal slide decks, the first question should be whether the workflow starts by uploading the file into a hosted stack or whether the task can stay on-device for the main processing path.`,
        `${tool1.name}: ${tool1.privacySummary} ${tool2.name}: ${tool2.privacySummary} Those summaries are not a moral ranking. They are a risk-model difference. An upload-first workflow can still be appropriate for many teams, but it is not the same thing as a browser-first or offline route. The right answer depends on how sensitive the files are and how much procurement, retention, and audit review a team wants to do.`,
      ],
    },
    {
      id: "workflow",
      heading: `Workflow fit and feature depth`,
      paragraphs: [
        `${tool1.name} tends to suit ${tool1.bestFor}, while ${tool2.name} is stronger for ${tool2.bestFor}. That means the better pick can change depending on whether the user needs occasional merge and split tasks, a full business suite, or a local-first utility that avoids unnecessary friction.`,
        `This is where many comparison pages become shallow because they reduce everything to a one-line “best for” tag. In reality, workflow fit is shaped by the full experience: how fast the tool gets to the first result, how often the user is interrupted by limits or upgrade gates, whether there is a natural path to adjacent tasks, and whether the product feels lightweight enough for repetitive use. That practical layer matters as much as the checklist.`,
      ],
    },
    {
      id: "pricing",
      heading: `Pricing, team fit, and buying context`,
      paragraphs: [
        `${tool1.name} leans toward a ${tool1.freeTier} free-tier model and usually fits ${tool1.teamFit.replace(/-/g, " ")} buyers best. ${tool2.name} leans toward a ${tool2.freeTier} model and fits ${tool2.teamFit.replace(/-/g, " ")} buyers better. That distinction matters because many searches for “${tool1.slug} vs ${tool2.slug}” come from people trying to choose a stack for repeated use, not just a one-time file conversion.`,
        `Teams should also look at operational shape rather than sticker price alone. A tool that is nominally cheap can still become expensive if every sensitive document requires policy exceptions, manual review, or extra procurement steps because files are routed through a hosted platform. Conversely, an enterprise product may be reasonable if the organisation already standardised on that vendor and needs tighter management features. Price only makes sense when tied to workflow and risk.`,
      ],
    },
    {
      id: "recommendation",
      heading: `Recommendation: who should choose ${tool1.name} or ${tool2.name}`,
      paragraphs: [recommendation.summary, recommendation.rationale],
    },
    {
      id: "plain-tools-angle",
      heading: `Where Plain Tools fits in this comparison`,
      paragraphs: [
        `Even when the query is ${tool1.name} vs ${tool2.name}, many users are really looking for a trustworthy alternative that avoids the usual upload-first tradeoffs. That is why these pages do not stop at vendor A vs vendor B. They connect the comparison to the live Plain Tools product surface, including merge, split, compress, convert, and related PDF workflows that run locally where supported.`,
        `That internal-linking pattern is deliberate. It keeps the comparison pages useful, gives the visitor a practical next step, and avoids thin-content failure modes where the page compares two brands but offers no executable path. If neither ${tool1.name} nor ${tool2.name} is a clean fit for your privacy requirements, the related links below take you straight into browser-first PDF tools instead of sending you back to search.`,
      ],
    },
  ]
}

function buildFaq(
  tool1: ComparisonTool,
  tool2: ComparisonTool,
  recommendation: PdfComparisonPage["recommendation"]
): PdfComparisonFaq[] {
  return [
    {
      question: `Which is better: ${tool1.name} or ${tool2.name}?`,
      answer: recommendation.summary,
    },
    {
      question: `Is ${tool1.name} or ${tool2.name} better for private PDF files?`,
      answer:
        "The better option is the one with the lower upload risk for your workflow. If you want the clearest no-upload positioning for core PDF tasks, Plain Tools is the stronger privacy-first alternative.",
    },
    {
      question: `Should I choose ${tool1.name} or ${tool2.name} for a team workflow?`,
      answer: `${tool1.name} generally suits ${tool1.teamFit.replace(/-/g, " ")} teams, while ${tool2.name} suits ${tool2.teamFit.replace(/-/g, " ")} teams better. The right answer depends on procurement, collaboration needs, and sensitivity of the files.`,
    },
    {
      question: "Why does this comparison page also link to Plain Tools?",
      answer:
        "Because many comparison searches are really alternative-intent queries. Users want to compare brands, but they also want a practical next step if both products rely too heavily on upload-first handling.",
    },
  ]
}

function buildRelatedLinks(tool1: ComparisonTool, tool2: ComparisonTool) {
  const pairSlug = `${tool1.slug}-vs-${tool2.slug}`
  const comparisons = PDF_COMPARISON_PAIRS.filter(
    (pair) =>
      pair.pairSlug !== pairSlug &&
      ([pair.tool1.slug, pair.tool2.slug].includes(tool1.slug) ||
        [pair.tool1.slug, pair.tool2.slug].includes(tool2.slug))
  )
    .slice(0, 6)
    .map((pair) => ({
      href: `/pdf-tools/compare/${pair.pairSlug}`,
      label: `${pair.tool1.name} vs ${pair.tool2.name}`,
    }))

  const tools: PdfComparisonLink[] = [
    { href: "/tools/merge-pdf", label: "Try Merge PDF locally" },
    { href: "/tools/compress-pdf", label: "Try Compress PDF locally" },
    { href: "/tools/split-pdf", label: "Try Split PDF locally" },
    { href: "/tools/pdf-to-word", label: "Try PDF to Word locally" },
    { href: "/pdf-tools/variants", label: "Browse PDF tool variants" },
    { href: "/compare", label: "Browse all comparison pages" },
  ]

  return { comparisons, tools }
}

export function getPdfComparisonPage(pairSlug: string): PdfComparisonPage | null {
  const pair = PDF_COMPARISON_PAIR_MAP.get(pairSlug)
  if (!pair) return null

  const recommendation = buildRecommendation(pair.tool1, pair.tool2)
  const title = `${pair.tool1.name} vs ${pair.tool2.name}`
  const path = `/pdf-tools/compare/${pair.pairSlug}`

  return {
    pairSlug: pair.pairSlug,
    path,
    title,
    h1: title,
    metaTitle: `${pair.tool1.name} vs ${pair.tool2.name} | Privacy, Features & Recommendation | Plain Tools`,
    metaDescription: `Compare ${pair.tool1.name} vs ${pair.tool2.name} for privacy, uploads, feature depth, pricing context, and workflow fit. See the recommendation and Plain Tools alternative for sensitive PDF work.`,
    introParagraphs: [
      `This ${pair.tool1.name} vs ${pair.tool2.name} comparison is written for buyers who already know the PDF-tool category and want a clear recommendation. Instead of recycling one vendor template, the page compares privacy posture, workflow fit, team context, and the tradeoff between upload-first convenience and browser-first trust.`,
      `Plain Tools uses these comparison routes as executable SEO pages, not just editorial pages. That means each comparison ties back to live local PDF tools, variant pages, and alternative routes so the user can move from evaluation to action without another search.`,
    ],
    sections: buildSections(pair.tool1, pair.tool2, recommendation),
    faq: buildFaq(pair.tool1, pair.tool2, recommendation),
    recommendation,
    table: buildTable(pair.tool1, pair.tool2),
    relatedLinks: buildRelatedLinks(pair.tool1, pair.tool2),
    tool1: pair.tool1,
    tool2: pair.tool2,
  }
}

export function generatePdfComparisonStaticParams(): PdfComparisonRouteParams[] {
  return PDF_COMPARISON_PAIRS.map((pair) => ({ pair: pair.pairSlug }))
}

export function getPdfComparisonSitemapPaths() {
  return PDF_COMPARISON_PAIRS.map((pair) => `/pdf-tools/compare/${pair.pairSlug}`)
}

export function getPdfComparisonManifest() {
  return PDF_COMPARISON_PAIRS.map((pair) => ({
    slug: pair.pairSlug,
    title: `${pair.tool1.name} vs ${pair.tool2.name}`,
    url: `/pdf-tools/compare/${pair.pairSlug}`,
    tool1: pair.tool1.slug,
    tool2: pair.tool2.slug,
    plainToolsToolHref: getToolBySlug("merge-pdf") ? "/tools/merge-pdf" : "/pdf-tools",
  }))
}
