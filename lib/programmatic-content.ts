import { buildMetaDescription } from "@/lib/page-metadata"
import { getToolBySlug, TOOL_CATALOGUE, type ToolDefinition } from "@/lib/tools-catalogue"
import { getToolVariantPage } from "@/lib/tools-matrix"

export type ProgrammaticFaq = {
  question: string
  answer: string
}

export type ProgrammaticHowToStep = {
  name: string
  text: string
}

export type ProgrammaticExplanationBlock = {
  title: string
  paragraphs: string[]
}

export type ProgrammaticRelatedTool = {
  href: string
  name: string
  description: string
}

export type ProgrammaticPageData = {
  canonicalPath: string
  description: string
  explanationBlocks: ProgrammaticExplanationBlock[]
  faq: ProgrammaticFaq[]
  howToSteps: ProgrammaticHowToStep[]
  howItWorks: string[]
  intro: string[]
  paramLabel: string
  paramSlug: string
  privacyNote: string[]
  relatedTools: ProgrammaticRelatedTool[]
  title: string
  tool: ToolDefinition
  whyUsersNeedThis: string[]
  wordCount: number
}

type ParamContext = {
  destination: string
  friction: string
  primaryGoal: string
  reviewFocus: string
  riskAngle: string
  supportingExamples: string
  titleSuffix: string
  userGroup: string
  workflowShift: string
}

const PROGRAMMATIC_TOOL_SLUGS = new Set([
  "annotate-pdf",
  "compare-pdf",
  "compress-pdf",
  "extract-pdf",
  "fill-pdf",
  "html-to-pdf",
  "jpg-to-pdf",
  "merge-pdf",
  "ocr-pdf",
  "offline-ocr",
  "pdf-to-excel",
  "pdf-to-html",
  "pdf-to-jpg",
  "pdf-to-markdown",
  "pdf-to-ppt",
  "pdf-to-word",
  "protect-pdf",
  "rotate-pdf",
  "sign-pdf",
  "split-pdf",
  "text-to-pdf",
  "unlock-pdf",
  "watermark-pdf",
  "word-to-pdf",
])

export const PROGRAMMATIC_PARAM_SEEDS = [
  "for-law-firms",
  "for-healthcare-teams",
  "for-finance-teams",
  "for-hr-teams",
  "for-client-delivery",
  "for-government-portals",
  "for-vendor-onboarding",
  "for-board-packs",
  "for-compliance-review",
  "before-esign",
  "after-scanning",
  "for-operations-handoffs",
] as const

const PARAM_CONTEXT_MAP: Record<string, ParamContext> = {
  "for-law-firms": {
    destination: "legal review, drafting, signing, or client delivery",
    friction:
      "version sprawl, sensitive clauses, redaction mistakes, and a low tolerance for formatting drift",
    primaryGoal:
      "prepare a document without adding an unnecessary upload handoff to a matter that already needs tighter handling",
    reviewFocus:
      "page order, redactions, signatures, clause formatting, and whether the output is ready for the next legal step",
    riskAngle:
      "contracts, witness statements, filings, and due-diligence packs should not bounce through a generic converter if a browser-only route can do the core job locally",
    supportingExamples:
      "engagement letters, exhibit bundles, disclosure packs, closing documents, and internal draft sets",
    titleSuffix: "for Law Firms",
    userGroup: "Legal teams",
    workflowShift:
      "The emphasis shifts from raw convenience to controlled handling, predictable output, and a clean review step before the file leaves the device.",
  },
  "for-healthcare-teams": {
    destination: "referrals, patient handoffs, internal review, or records administration",
    friction:
      "scanned paperwork, privacy obligations, mixed source quality, and pressure to move documents quickly without careless exposure",
    primaryGoal:
      "complete the document task while keeping the main processing path on-device and easy to verify",
    reviewFocus:
      "legibility, missing pages, metadata, OCR accuracy, and whether the output still fits the downstream clinical or admin workflow",
    riskAngle:
      "care notes, referral packets, scanned results, and insurance paperwork deserve a privacy-first flow even when the task itself is routine",
    supportingExamples:
      "referral packets, discharge instructions, scanned forms, onboarding documents, and archive clean-up work",
    titleSuffix: "for Healthcare Teams",
    userGroup: "Healthcare and admin teams",
    workflowShift:
      "The job is usually less about features and more about reducing avoidable privacy exposure while keeping documents readable and operational.",
  },
  "for-finance-teams": {
    destination: "approvals, audits, reconciliations, or external reporting",
    friction:
      "strict file-size limits, statement bundles from multiple systems, and documents that contain sensitive numbers or customer details",
    primaryGoal:
      "prepare the file for a finance workflow without introducing another vendor or upload queue into the middle of the task",
    reviewFocus:
      "totals, table readability, statement order, signatures, and whether the final copy is appropriate for review or submission",
    riskAngle:
      "financial reports, invoices, statements, and approval packs are common examples of files that benefit from local processing and clear post-checks",
    supportingExamples:
      "board reporting, reconciliation packs, invoice batches, purchase approvals, and month-end support documents",
    titleSuffix: "for Finance Teams",
    userGroup: "Finance and operations users",
    workflowShift:
      "This route is strongest when the output needs to be both share-ready and easy to defend later during audit or review.",
  },
  "for-hr-teams": {
    destination: "onboarding, policy review, candidate handling, or records management",
    friction:
      "personal information, repeated form workflows, and the need to keep simple admin jobs from turning into risky upload habits",
    primaryGoal:
      "finish the document task while keeping the source material local and easy to inspect",
    reviewFocus:
      "field values, signatures, page order, removed metadata, and whether the result is actually suitable for HR handoff",
    riskAngle:
      "CVs, offer letters, signed policies, payroll forms, and performance documents often deserve more care than a generic upload workflow provides",
    supportingExamples:
      "candidate packs, onboarding forms, policy acknowledgements, and employee record updates",
    titleSuffix: "for HR Teams",
    userGroup: "HR teams",
    workflowShift:
      "The practical value is reducing avoidable exposure while still moving common personnel documents through the process quickly.",
  },
  "for-client-delivery": {
    destination: "sending the finished document to a customer, partner, or reviewer",
    friction:
      "last-minute formatting issues, attachment limits, and the need to send a polished file instead of a rough working copy",
    primaryGoal:
      "produce a cleaner client-facing output without leaving the browser or adding an unnecessary upload step",
    reviewFocus:
      "file size, readability, branding, signatures, page order, and whether the exported copy is the one you actually want to send",
    riskAngle:
      "the final delivery copy is often the exact file you should review carefully before it leaves your control",
    supportingExamples:
      "proposal decks, signed agreements, invoice packs, handover bundles, and approval-ready drafts",
    titleSuffix: "for Client Delivery",
    userGroup: "Client-facing teams",
    workflowShift:
      "The focus here is on preparing the outward-facing copy, not just getting any technically valid output.",
  },
  "for-government-portals": {
    destination: "submission to a public-sector form, portal, or regulated upload workflow",
    friction:
      "hard file-size caps, format validation, scanned paperwork, and rejection messages that rarely explain what failed",
    primaryGoal:
      "prepare the document locally so it has a better chance of passing the portal the first time",
    reviewFocus:
      "page count, file size, readability, orientation, searchable text, and whether the output still matches the original requirement",
    riskAngle:
      "application forms, supporting evidence, and identity documents are common examples where browser-only preparation is a safer first step",
    supportingExamples:
      "permit applications, procurement packs, grant submissions, claim evidence, and compliance attachments",
    titleSuffix: "for Government Portals",
    userGroup: "Users dealing with submission portals",
    workflowShift:
      "This route is most useful when you need the final copy to be accepted by a strict destination system, not just downloaded successfully.",
  },
  "for-vendor-onboarding": {
    destination: "supplier review, procurement, or external onboarding",
    friction:
      "documents arriving from different systems, incomplete fields, and sensitive commercial details that still need practical cleanup",
    primaryGoal:
      "standardise the file enough for onboarding without turning every step into a cloud handoff",
    reviewFocus:
      "document completeness, signatures, extracted pages, password protection, and whether the onboarding contact can open the result cleanly",
    riskAngle:
      "vendor forms, tax paperwork, certificates, and policy acknowledgements are usually simple to process but still worth handling carefully",
    supportingExamples:
      "supplier setup packs, certificates of insurance, tax forms, policy documents, and signed terms",
    titleSuffix: "for Vendor Onboarding",
    userGroup: "Procurement and vendor-management teams",
    workflowShift:
      "The route should reduce admin drag without weakening control over commercial and compliance documents.",
  },
  "for-board-packs": {
    destination: "executive review or distribution to stakeholders",
    friction:
      "multiple source files, last-minute edits, confidentiality, and a high expectation that the final packet opens cleanly on the first try",
    primaryGoal:
      "prepare a board-ready document set from the browser while keeping the core workflow local",
    reviewFocus:
      "section order, legibility, attachments, bookmarks, and whether the final copy is the right one for controlled circulation",
    riskAngle:
      "board reports, annexes, financial appendices, and approval packs benefit from fewer moving parts and fewer places for accidental leakage",
    supportingExamples:
      "reporting decks, annex bundles, meeting packs, committee papers, and confidential financial appendices",
    titleSuffix: "for Board Packs",
    userGroup: "Leadership and operations teams",
    workflowShift:
      "The page has to help users prepare a more deliberate distribution copy, not merely finish a conversion step.",
  },
  "for-compliance-review": {
    destination: "audit, policy review, retention, or controlled internal sign-off",
    friction:
      "version control, metadata risk, poor scans, and the need for a file that is easier to inspect than the original source set",
    primaryGoal:
      "make the next compliance check easier while keeping the transformation step transparent and local",
    reviewFocus:
      "metadata, OCR quality, signatures, timestamps, page integrity, and whether the output is suitable for evidence or review",
    riskAngle:
      "compliance workflows usually care as much about what changed and what stayed intact as they do about speed",
    supportingExamples:
      "policy evidence, audit appendices, supplier records, training acknowledgements, and retention copies",
    titleSuffix: "for Compliance Review",
    userGroup: "Compliance, risk, and audit teams",
    workflowShift:
      "The route needs to improve inspectability and trust, not just produce a downloadable file.",
  },
  "before-esign": {
    destination: "digital signing, approval, or final sign-off",
    friction:
      "bad page order, oversized files, missing fields, and the risk of sending the wrong copy into the signing flow",
    primaryGoal:
      "prepare the document so the e-sign step starts from a cleaner and more predictable file",
    reviewFocus:
      "orientation, field placement, page order, signatures, and whether the file is lightweight enough for the signing platform",
    riskAngle:
      "the document that enters e-sign often becomes the record copy, so a browser-only prep step can save painful rework later",
    supportingExamples:
      "agreements, consent forms, approval packs, onboarding documents, and external sign-off workflows",
    titleSuffix: "Before eSign",
    userGroup: "Anyone preparing documents for signature",
    workflowShift:
      "This route is about preparing the signing copy before it becomes locked into a wider approval process.",
  },
  "after-scanning": {
    destination: "cleanup, OCR, review, or downstream submission after a paper-to-digital step",
    friction:
      "crooked pages, heavy images, poor contrast, unsearchable text, and repeated manual fixes after every scan batch",
    primaryGoal:
      "turn a raw scan into a more usable file without uploading the source pages to another service first",
    reviewFocus:
      "orientation, readability, OCR accuracy, page size, and whether the scan is now fit for sharing or retention",
    riskAngle:
      "raw scans often contain the exact documents users are most cautious about handing to a remote processor",
    supportingExamples:
      "camera scans, copier output, intake forms, signed paperwork, and archive imports",
    titleSuffix: "After Scanning",
    userGroup: "Users working from scanned documents",
    workflowShift:
      "The value comes from making imperfect scan output usable enough for the real destination workflow, not from pretending the scan was clean to begin with.",
  },
  "for-operations-handoffs": {
    destination: "internal transfer from one team, queue, or process owner to another",
    friction:
      "repeated one-off edits, inconsistent file naming, and document packs that move across teams without a reliable prep step",
    primaryGoal:
      "create a cleaner handoff copy while keeping the processing browser-only and easy to repeat",
    reviewFocus:
      "file size, page order, naming, searchable text, and whether the receiving team gets a copy that is immediately usable",
    riskAngle:
      "operations handoffs are common places for avoidable data sprawl because people reach for whatever tool is fastest in the moment",
    supportingExamples:
      "handover packs, approval bundles, intake documents, queue transfers, and daily admin workflows",
    titleSuffix: "for Operations Handoffs",
    userGroup: "Operations teams",
    workflowShift:
      "A good route removes repetitive cleanup while still keeping the trust model explicit.",
  },
}

const RELATED_TOOL_OVERRIDES: Partial<Record<string, string[]>> = {
  "annotate-pdf": ["compare-pdf", "sign-pdf", "fill-pdf", "merge-pdf", "protect-pdf"],
  "compare-pdf": ["annotate-pdf", "merge-pdf", "pdf-to-word", "ocr-pdf", "protect-pdf"],
  "compress-pdf": ["merge-pdf", "split-pdf", "ocr-pdf", "pdf-to-jpg", "protect-pdf"],
  "extract-pdf": ["split-pdf", "merge-pdf", "rotate-pdf", "compress-pdf", "protect-pdf"],
  "fill-pdf": ["sign-pdf", "protect-pdf", "merge-pdf", "pdf-to-word", "annotate-pdf"],
  "html-to-pdf": ["text-to-pdf", "word-to-pdf", "pdf-to-html", "protect-pdf", "compress-pdf"],
  "jpg-to-pdf": ["pdf-to-jpg", "merge-pdf", "compress-pdf", "ocr-pdf", "word-to-pdf"],
  "merge-pdf": ["split-pdf", "compress-pdf", "rotate-pdf", "protect-pdf", "compare-pdf"],
  "ocr-pdf": ["offline-ocr", "pdf-to-word", "compress-pdf", "pdf-to-markdown", "protect-pdf"],
  "offline-ocr": ["ocr-pdf", "pdf-to-word", "compress-pdf", "pdf-to-markdown", "protect-pdf"],
  "pdf-to-excel": ["pdf-to-word", "ocr-pdf", "pdf-to-html", "compare-pdf", "protect-pdf"],
  "pdf-to-html": ["html-to-pdf", "pdf-to-markdown", "pdf-to-word", "ocr-pdf", "protect-pdf"],
  "pdf-to-jpg": ["jpg-to-pdf", "compress-pdf", "rotate-pdf", "merge-pdf", "protect-pdf"],
  "pdf-to-markdown": ["pdf-to-html", "pdf-to-word", "ocr-pdf", "text-to-pdf", "protect-pdf"],
  "pdf-to-ppt": ["pdf-to-jpg", "pdf-to-word", "compress-pdf", "merge-pdf", "protect-pdf"],
  "pdf-to-word": ["word-to-pdf", "ocr-pdf", "pdf-to-markdown", "pdf-to-html", "protect-pdf"],
  "protect-pdf": ["unlock-pdf", "sign-pdf", "merge-pdf", "fill-pdf", "compress-pdf"],
  "rotate-pdf": ["split-pdf", "extract-pdf", "merge-pdf", "compress-pdf", "protect-pdf"],
  "sign-pdf": ["fill-pdf", "protect-pdf", "merge-pdf", "pdf-to-word", "compress-pdf"],
  "split-pdf": ["extract-pdf", "merge-pdf", "rotate-pdf", "compress-pdf", "protect-pdf"],
  "text-to-pdf": ["html-to-pdf", "word-to-pdf", "protect-pdf", "merge-pdf", "compress-pdf"],
  "unlock-pdf": ["protect-pdf", "fill-pdf", "sign-pdf", "merge-pdf", "compare-pdf"],
  "watermark-pdf": ["protect-pdf", "sign-pdf", "merge-pdf", "compress-pdf", "annotate-pdf"],
  "word-to-pdf": ["pdf-to-word", "protect-pdf", "merge-pdf", "compress-pdf", "html-to-pdf"],
}

function countWords(values: string[]) {
  return values
    .join(" ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length
}

function humanizeSlug(value: string) {
  return value
    .replace(/[-_/]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
    .trim()
}

export function normalizeProgrammaticParam(rawParam: string) {
  const decoded = decodeURIComponent(rawParam).trim().toLowerCase()
  if (!decoded) return null

  const normalized = decoded
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-")

  if (!normalized || normalized.length > 72) return null
  return normalized
}

export function buildProgrammaticCanonicalPath(toolSlug: string, paramSlug: string) {
  return `/programmatic/${toolSlug}/${paramSlug}`
}

function buildParamContext(paramSlug: string): ParamContext {
  const directMatch = PARAM_CONTEXT_MAP[paramSlug]
  if (directMatch) return directMatch

  const paramLabel = humanizeSlug(paramSlug)

  return {
    destination: `${paramLabel.toLowerCase()} workflows where the next step still matters`,
    friction:
      "unclear upload behaviour, repetitive manual cleanup, and output that looks finished until a reviewer actually opens it",
    primaryGoal:
      "solve a specific document task with a browser-only route that keeps the main processing step local",
    reviewFocus:
      "file size, page order, readability, searchable text, and whether the exported copy is right for the destination workflow",
    riskAngle:
      "when a file contains operational, commercial, or personal information, local processing is often a safer first step than handing it to a generic upload tool",
    supportingExamples:
      "approval packs, supporting evidence, working drafts, archived copies, and share-ready document bundles",
    titleSuffix: paramLabel,
    userGroup: "Teams",
    workflowShift:
      "The route should answer a sharper use case than the generic tool page while still staying honest about quality checks and limits.",
  }
}

function getProgrammaticRelatedTools(tool: ToolDefinition) {
  const overrideSlugs = RELATED_TOOL_OVERRIDES[tool.slug] ?? []
  const fallbackSlugs = TOOL_CATALOGUE.filter(
    (entry) =>
      entry.available &&
      entry.slug !== tool.slug &&
      entry.category === tool.category &&
      PROGRAMMATIC_TOOL_SLUGS.has(entry.slug)
  ).map((entry) => entry.slug)

  const selectedSlugs = [...overrideSlugs, ...fallbackSlugs]
    .filter((slug, index, values) => values.indexOf(slug) === index)
    .slice(0, 6)

  return selectedSlugs
    .map((slug) => getToolBySlug(slug))
    .filter((entry): entry is ToolDefinition => Boolean(entry))
    .map((entry) => ({
      href: `/tools/${entry.slug}`,
      name: entry.name,
      description: entry.description,
    }))
}

function buildProgrammaticDescription(tool: ToolDefinition, context: ParamContext) {
  return buildMetaDescription(
    `${tool.name} ${context.titleSuffix.toLowerCase()} with a 100% local, no-upload, privacy-first browser workflow. Review the result on-device before sharing or submitting it.`
  )
}

function buildIntro(tool: ToolDefinition, context: ParamContext) {
  return [
    `${tool.name} ${context.titleSuffix.toLowerCase()} is usually not a search for a generic feature list. It is a search for one clean outcome: ${context.primaryGoal}. People landing on this page typically need to finish the task now, but they also need to avoid an unnecessary upload step. Plain Tools is built for that kind of use case. The core workflow runs 100% local in the browser, the file stays on the device during processing, and the page adds enough explanation around the tool so it can stand on its own as a useful route instead of acting like a thin SEO doorway.`,
    `${context.riskAngle}. That is why the page repeats the same trust framing in plain language: browser-only, privacy-first, no upload for the main processing step, and easy to verify with DevTools if the user wants proof. For this route, the job is not only to run ${tool.name.toLowerCase()}. It is to make sure the result is ready for ${context.destination} without creating more rework in the next step.`,
  ]
}

function buildWhyUsersNeedThis(tool: ToolDefinition, context: ParamContext) {
  return [
    `${context.userGroup} usually arrive here after the normal workflow has already started to go wrong. The file may be too large, poorly ordered, awkward to review, or not yet in the right format for handoff. The friction points are consistent: ${context.friction}. A generic tool landing page can explain what the button does, but it rarely explains why the user is cautious or why the next review stage can fail even after the output downloads successfully.`,
    `A strong programmatic page should narrow the problem definition. For this ${context.titleSuffix.toLowerCase()} route, the important question is whether ${tool.name.toLowerCase()} creates an output that is fit for the real destination rather than merely technically valid. That means the page needs substantial guidance, explicit trust language, and sensible internal links to adjacent tools. It also means telling the user what to review before they treat the exported file as final.`,
  ]
}

function buildHowItWorks(tool: ToolDefinition, context: ParamContext) {
  return [
    `The workflow is intentionally direct. Open the live tool below, add the document or source files, choose the options that support ${context.titleSuffix.toLowerCase()}, and let the browser handle the main transformation on-device. Because the page focuses on one sharper use case, the surrounding content tells the user what trade-offs matter before and after they click run.`,
    `That matters because ${tool.name.toLowerCase()} is rarely the end of the workflow. The result normally moves into ${context.destination}. If the file still has the wrong structure, unclear pages, broken formatting, or avoidable metadata, the user loses time later and may need to repeat the work. A practical page therefore combines the tool with guidance about review criteria, not just a headline and a form.`,
    `${context.workflowShift} That is the real value of a scalable programmatic foundation. It lets the site generate many focused pages without making them interchangeable, and it keeps the trust model consistent across routes: 100% local where supported, no upload for the core workflow, privacy-first messaging, and browser-only processing that users can inspect for themselves.`,
  ]
}

function buildHowToSteps(tool: ToolDefinition, context: ParamContext): ProgrammaticHowToStep[] {
  return [
    {
      name: "Open the live browser workspace",
      text: `Start in the tool panel below with the real document you need for ${context.destination}. The page is tuned to the ${context.titleSuffix.toLowerCase()} use case, so use the source file that actually needs work.`,
    },
    {
      name: "Choose the smallest set of options that solves the job",
      text: `Adjust the workflow settings with the destination in mind. For this route, the main priority is ${context.primaryGoal.toLowerCase()} without adding extra complexity or another upload handoff.`,
    },
    {
      name: "Run the core task locally",
      text: `Process the file in the browser and keep an eye on the output state. On Plain Tools, the main handling step stays on-device for these local workflows, so you can download the result directly.`,
    },
    {
      name: "Review the output before it leaves your device",
      text: `Check ${context.reviewFocus}. The goal is to confirm that the output is genuinely ready for the next step instead of assuming a successful download means the workflow is done.`,
    },
    {
      name: "Use the related tools only if the next constraint appears",
      text: `If the file still needs another pass, move to a closely related tool rather than restarting from scratch elsewhere. That internal tool cluster is what turns a single-use page into a reliable workflow path.`,
    },
  ]
}

function buildExplanationBlocks(tool: ToolDefinition, context: ParamContext) {
  return [
    {
      title: `Why ${context.titleSuffix} changes the workflow`,
      paragraphs: [
        `The same ${tool.name.toLowerCase()} action can mean different things depending on where the file is going next. A route aimed at ${context.destination} needs stronger guidance around review and output quality because the downstream failure cost is higher than on a casual personal task.`,
        `That is also why this page repeats the privacy framing instead of hiding it in a footer. When a user specifically searches for a narrower business or compliance context, they are often signalling that the data matters as much as the feature.`,
      ],
    },
    {
      title: "What makes the page genuinely useful",
      paragraphs: [
        `Useful programmatic pages do more than rename the tool. They give concrete language for the real job, surface predictable friction points early, and connect users to the adjacent tools they are most likely to need next.`,
        `On Plain Tools that means the page should answer the main question quickly, embed the live workflow, and still give enough surrounding context to avoid becoming thin or redundant. The content is written to help someone decide whether to proceed, not just to rank.`,
      ],
    },
    {
      title: "What to check before you trust the output",
      paragraphs: [
        `Before you send, upload, archive, or sign the result, check ${context.reviewFocus}. Those checks are where most downstream failures show up, especially when the source file began as a scan, mixed bundle, or export from another system.`,
        `If the result is close but not quite ready, the safer route is to stay inside the internal tool cluster and fix the next constraint locally rather than exporting the file into a random external converter.`,
      ],
    },
  ]
}

function buildPrivacyNote() {
  return [
    `Plain Tools should be explicit about what is and is not being claimed here. For the core local workflow on this page, the file stays on your device while the browser performs the main transformation. There is no upload step required for the actual processing path. That is why the page can honestly emphasize 100% local, privacy-first, browser-only handling instead of leaning on vague trust language.`,
    `That does not remove every operational risk. The result can still be mishandled after download, shared too broadly, or stored badly in another system. Privacy-first means reducing one important category of risk at the point of processing, then telling the user to review the output and treat the next handoff with the same level of care.`,
  ]
}

function buildFaq(tool: ToolDefinition, context: ParamContext): ProgrammaticFaq[] {
  return [
    {
      question: `Can I use ${tool.name.toLowerCase()} ${context.titleSuffix.toLowerCase()} without uploading my file?`,
      answer:
        `Yes. For the core local workflow on Plain Tools, processing happens in your browser, so the file stays on your device during the main task.`,
    },
    {
      question: `Why does this route exist instead of only one generic ${tool.name.toLowerCase()} page?`,
      answer:
        `Because the downstream requirement changes the advice. A page aimed at ${context.destination} should explain different checks, risks, and related tools than a generic overview page.`,
    },
    {
      question: `What should I review after using ${tool.name.toLowerCase()} on this page?`,
      answer:
        `Review ${context.reviewFocus}. The right post-check depends on the destination workflow, not just the tool name.`,
    },
    {
      question: "Is this page meant to replace the canonical tool page?",
      answer:
        `No. The canonical tool page remains the main product route. This page narrows the use case and links back into the broader internal cluster when you need adjacent workflows.`,
    },
    {
      question: "How does this help avoid thin content at scale?",
      answer:
        `Each page is generated from reusable blocks, but the blocks are written around a distinct use case, review focus, privacy angle, and internal-link context. That keeps the route specific enough to be useful on its own.`,
    },
    {
      question: "When should I move to another tool after this one?",
      answer:
        `Move when the next constraint changes. For example, if the output is correct but still too large, needs signing, or needs metadata cleanup, use the related tools section instead of restarting the whole process elsewhere.`,
    },
  ]
}

function validateProgrammaticTool(toolSlug: string) {
  if (!PROGRAMMATIC_TOOL_SLUGS.has(toolSlug)) return null
  return getToolBySlug(toolSlug)
}

export function getProgrammaticStaticParams() {
  return Array.from(PROGRAMMATIC_TOOL_SLUGS).flatMap((toolSlug) =>
    PROGRAMMATIC_PARAM_SEEDS.map((param) => ({
      slug: [toolSlug, param],
    }))
  )
}

export function getProgrammaticSitemapPaths() {
  return Array.from(PROGRAMMATIC_TOOL_SLUGS).flatMap((toolSlug) =>
    PROGRAMMATIC_PARAM_SEEDS.map((param) => buildProgrammaticCanonicalPath(toolSlug, param))
  )
}

export function buildProgrammaticPageData(
  toolSlug: string,
  rawParam: string
): ProgrammaticPageData | null {
  const tool = validateProgrammaticTool(toolSlug)
  if (!tool) return null

  const paramSlug = normalizeProgrammaticParam(rawParam)
  if (!paramSlug) return null

  if (getToolVariantPage(toolSlug, paramSlug)) {
    return null
  }

  const context = buildParamContext(paramSlug)
  const intro = buildIntro(tool, context)
  const whyUsersNeedThis = buildWhyUsersNeedThis(tool, context)
  const howItWorks = buildHowItWorks(tool, context)
  const howToSteps = buildHowToSteps(tool, context)
  const explanationBlocks = buildExplanationBlocks(tool, context)
  const privacyNote = buildPrivacyNote()
  const faq = buildFaq(tool, context)
  const relatedTools = getProgrammaticRelatedTools(tool)
  const title = `${tool.name} ${context.titleSuffix} | Plain Tools`
  const description = buildProgrammaticDescription(tool, context)
  const canonicalPath = buildProgrammaticCanonicalPath(tool.slug, paramSlug)

  const wordCount = countWords([
    title,
    description,
    ...intro,
    ...whyUsersNeedThis,
    ...howItWorks,
    ...howToSteps.flatMap((step) => [step.name, step.text]),
    ...explanationBlocks.flatMap((block) => [block.title, ...block.paragraphs]),
    ...privacyNote,
    ...faq.flatMap((entry) => [entry.question, entry.answer]),
  ])

  if (wordCount < 800 || wordCount > 1500) {
    throw new Error(
      `Programmatic page ${canonicalPath} must stay between 800 and 1500 words. Current count: ${wordCount}.`
    )
  }

  return {
    canonicalPath,
    description,
    explanationBlocks,
    faq,
    howToSteps,
    howItWorks,
    intro,
    paramLabel: context.titleSuffix,
    paramSlug,
    privacyNote,
    relatedTools,
    title,
    tool,
    whyUsersNeedThis,
    wordCount,
  }
}
