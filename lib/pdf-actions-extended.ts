import type { Metadata } from "next"

import { buildCanonicalUrl, buildMetaDescription, buildPageMetadata } from "@/lib/page-metadata"
import type {
  ProgrammaticExplanationBlock,
  ProgrammaticFaq,
  ProgrammaticHowToStep,
  ProgrammaticPageData,
  ProgrammaticRelatedTool,
} from "@/lib/programmatic-content"
import {
  buildHowToSchema,
  buildWebPageSchema,
  combineJsonLd,
  type JsonLdObject,
} from "@/lib/structured-data"
import {
  buildPdfVariantProgrammaticBundle as buildBaseBundle,
  generatePdfVariantStaticParams as generateBaseParams,
  getPdfVariantPage as getBasePage,
  getPdfVariantSitemapPaths as getBaseSitemapPaths,
  getRelatedPdfVariantPages as getBaseRelatedPages,
  type PdfVariantRouteParams,
} from "@/lib/pdf-variants"
import { getToolBySlug } from "@/lib/tools-catalogue"

type ActionSeed = {
  action: string
  aliases?: string[]
  destination: string
  outcome: string
  pain: string
  privacy: string
  review: string
  related: string[]
  title: string
  toolSlug: string
}

type VariantSeed = {
  keyword: string
  label: string
  need: string
  reason: string
  review: string
  slug: string
}

type ExtendedSeoPage = {
  action: string
  canonicalPath: string
  h1: string
  metaDescription: string
  title: string
  toolSlug: string
  variant: string
}

type ExtendedBundle = {
  featureList: string[]
  heroBadges: string[]
  metadata: Metadata
  page: ProgrammaticPageData
  schema: JsonLdObject | null
  seoPage: ExtendedSeoPage
}

function countWords(values: string[]) {
  return values.join(" ").trim().split(/\s+/).filter(Boolean).length
}

const EXISTING_ACTIONS: ActionSeed[] = [
  ["compress-pdf", "Compress PDF", "email, portals, and approvals", "a smaller PDF that is easier to send", "oversized PDFs block the next handoff", "sensitive files should not be uploaded just to reduce size", "legibility, final size, and whether the file still works in the destination workflow", ["merge-pdf", "ocr-pdf", "pdf-to-jpg", "protect-pdf"]],
  ["merge-pdf", "Merge PDF", "client packets, archive bundles, and review sets", "one cleaner packet instead of scattered source files", "reviewers waste time when the source files stay fragmented", "local packet assembly is safer when the files contain client or internal material", "page order, completeness, and whether the merged copy is easier to review", ["split-pdf", "compress-pdf", "extract-pdf", "protect-pdf"]],
  ["split-pdf", "Split PDF", "review queues, submissions, and smaller shares", "smaller files matched to the real audience", "one large PDF is usually the wrong unit for the next workflow", "splitting locally avoids uploading a large source packet to another service", "page ranges, naming, and whether the right pages reached the right output", ["extract-pdf", "merge-pdf", "compress-pdf", "rotate-pdf"]],
  ["pdf-to-word", "PDF to Word", "editing, redrafts, and revisions", "an editable draft that is easier to revise", "fixed PDFs slow down the next editor", "confidential PDFs should not leave the device just to become editable", "text quality, layout drift, and whether the output is editable enough", ["ocr-pdf", "word-to-pdf", "compare-pdf", "metadata-purge"]],
  ["word-to-pdf", "Word to PDF", "final delivery, sign-off, and submissions", "a fixed-layout PDF ready for the next handoff", "editable files create last-minute formatting drift", "sensitive drafts can stay local while becoming final PDFs", "layout, pagination, and whether the PDF is actually final", ["compress-pdf", "sign-pdf", "protect-pdf", "html-to-pdf"]],
  ["extract-pages", "Extract PDF Pages", "evidence packets, client subsets, and cleaner reviews", "a smaller PDF containing only the pages that matter", "the next person rarely needs the whole source file", "local extraction reduces exposure when only part of the source should be shared", "page selection, completeness, and whether the subset really fits the workflow", ["split-pdf", "merge-pdf", "rotate-pdf", "compress-pdf"]],
  ["rotate-pdf", "Rotate PDF", "scans, mobile captures, and upload-ready copies", "a readable file with the right orientation", "sideways scans create avoidable friction", "phone scans and captured paperwork can stay on-device while orientation is fixed", "orientation, reading order, and whether every changed page is clear", ["ocr-pdf", "compress-pdf", "extract-pdf", "merge-pdf"]],
  ["sign-pdf", "Sign PDF", "approvals, client delivery, and records", "a signed file ready for the next controlled handoff", "the document is almost done but still not usable", "signature workflows often touch contracts and HR files that should stay local first", "signature placement, appearance, and final readiness", ["fill-pdf", "protect-pdf", "compress-pdf", "metadata-purge"]],
  ["ocr-pdf", "OCR PDF", "archives, search workflows, and editable follow-ups", "a searchable PDF that is easier to reuse", "raw scans are hard to search and harder to review", "scanned records are often the last files you want to upload to random OCR services", "recognition quality, clarity, and whether the result is searchable enough", ["pdf-to-word", "compress-pdf", "rotate-pdf", "metadata-purge"]],
  ["unlock-pdf", "Unlock PDF", "approved edits, controlled review, and the next internal step", "a usable working copy after lawful access is confirmed", "password protection can stall real work even when the team has authority to proceed", "it is safer to unlock locally than to hand the protected file to another service first", "completeness, correctness, and whether the next internal task can now move forward", ["protect-pdf", "fill-pdf", "sign-pdf", "compare-pdf"]],
].map(([action, title, destination, outcome, pain, privacy, review, related]) => ({
  action,
  destination,
  outcome,
  pain,
  privacy,
  related: related as string[],
  review,
  title,
  toolSlug: action === "extract-pages" ? "extract-pdf" : action,
}))

const NEW_ACTIONS: ActionSeed[] = [
  ["annotate-pdf", "Annotate PDF", "review rounds, legal feedback, and markups", "a marked-up copy that guides the next reader", "reviewers need context, not just another untouched draft", "internal comments and review layers should stay local until the team decides what leaves", "annotation accuracy, highlight placement, and whether the copy helps the next reviewer", ["compare-pdf", "watermark-pdf", "fill-pdf", "metadata-purge"], "annotate-pdf"],
  ["watermark-pdf", "Watermark PDF", "draft circulation, previews, and controlled sharing", "a visibly marked PDF before it leaves the team", "review copies get mistaken for final files", "drafts and partner previews are safer when the watermark step happens locally", "watermark visibility, placement, and whether the file stays readable", ["annotate-pdf", "protect-pdf", "compress-pdf", "sign-pdf"], "watermark-pdf"],
  ["bates-numbering", "Bates Number PDF", "legal packets, evidence sets, and compliance bundles", "a sequentially stamped packet that is easier to reference", "large packets are harder to discuss without stable page numbering", "evidence and privileged packets are better stamped locally before wider review", "number order, coverage, and readability after stamping", ["annotate-pdf", "merge-pdf", "extract-pdf", "compare-pdf"], "watermark-pdf"],
  ["form-fill", "Fill PDF Form", "onboarding, submissions, and approval workflows", "a completed form ready for the next handoff", "form workflows slow down when users print, scan, or upload just to fill fields", "forms often contain personal or financial information that should stay on-device", "field accuracy, completeness, and signature readiness", ["sign-pdf", "protect-pdf", "metadata-purge", "compress-pdf"], "fill-pdf"],
  ["ai-summarize-pdf", "AI Summarize PDF", "executive review, triage, and briefing notes", "a faster summary for the next reader", "long PDFs slow down first-pass review when someone only needs the main points", "internal reports and client material are safer when summary work stays in a trusted browser session", "summary quality, omissions, and whether the result is accurate enough", ["pdf-qa", "annotate-pdf", "metadata-purge", "compare-pdf"], "summarize-pdf"],
  ["redact-pdf", "Redact PDF", "client sharing, public disclosure, and safer external copies", "a share copy with sensitive material removed first", "the file is almost shareable, but one exposed detail blocks the whole workflow", "redaction matters most when the original contains exactly the material you are trying to protect", "redaction coverage, metadata follow-up, and whether the cleaned copy is actually safer", ["metadata-purge", "protect-pdf", "annotate-pdf", "compare-pdf"], "redact-pdf"],
  ["metadata-purge", "Remove PDF Metadata", "external sharing, compliance, and final circulation", "a cleaner PDF with less hidden history attached", "the visible pages are fine, but metadata can still leak context", "metadata cleanup is directly tied to a privacy-first workflow", "remaining hidden data, visible fidelity, and whether the output is appropriate to share", ["redact-pdf", "protect-pdf", "compare-pdf", "sign-pdf"], "metadata-purge"],
  ["compare-pdf", "Compare PDF", "approvals, negotiations, and version review", "a clearer picture of what changed between versions", "teams lose time when the wrong draft moves forward", "version comparison often involves sensitive internal drafts that should stay local", "difference accuracy, false positives, and whether the comparison is useful enough for sign-off", ["annotate-pdf", "metadata-purge", "merge-pdf", "sign-pdf"], "compare-pdf"],
  ["reorder-pdf", "Reorder PDF Pages", "packets, submissions, and handoff prep", "a packet whose page flow matches the real workflow", "the right pages exist but the wrong order makes the packet harder to use", "reordering is often part of preparing sensitive packets for clients or audits", "page sequence, missing pages, and whether the new order is actually better", ["merge-pdf", "extract-pdf", "compress-pdf", "compare-pdf"], "reorder-pdf"],
  ["pdf-to-html", "PDF to HTML", "web publishing, reuse, and browser editing", "an HTML output that is easier to repurpose", "static PDFs are hard to reuse when the next workflow needs web-friendly content", "local conversion matters when the source contains internal docs, drafts, or client packs", "text fidelity, layout drift, and whether the HTML is good enough for the next browser workflow", ["pdf-to-markdown", "pdf-to-word", "metadata-purge", "compare-pdf"], "pdf-to-html"],
].map(([action, title, destination, outcome, pain, privacy, review, related, toolSlug]) => ({
  action,
  destination,
  outcome,
  pain,
  privacy,
  related: related as string[],
  review,
  title,
  toolSlug: toolSlug as string,
}))

const CORE_VARIANTS: VariantSeed[] = [
  ["mac", "on Mac", "mac", "finish the task in Safari or Chrome without another heavyweight suite", "Mac users usually discover the document issue when the real handoff is already due", "review the output in Preview or your normal Mac workflow before sharing it onward"],
  ["windows", "on Windows", "windows", "keep the workflow in Edge or Chrome without another install step", "Windows searches often come from users trapped between upload sites and desktop prompts", "open the result in the target Windows app or upload flow before you trust it"],
  ["iphone", "on iPhone", "iphone", "solve the PDF problem from a phone without waiting for a desktop", "mobile PDF issues usually appear the moment someone has to share or upload the file", "save the output locally first so the next app receives the right copy"],
  ["android", "on Android", "android", "keep the task on the device already holding the file", "Android workflows often bounce between downloads, attachments, and mobile upload forms", "review the downloaded result before sending it onward"],
  ["offline", "Offline", "offline", "avoid a cloud dependency while the file stays on the same machine", "offline intent is usually really about trust, speed, or unstable connectivity", "keep the browser session stable and finish the core work locally"],
  ["no-upload", "with No Upload", "no upload", "avoid sending the PDF to another service for a routine step", "no-upload searches line up directly with the Plain Tools trust pitch", "review the result locally before deciding what system, if any, it enters next"],
  ["securely", "Securely", "secure", "reduce third-party exposure while the file is being processed", "security-heavy searches often come from users handling contracts, HR forms, and finance material", "treat local processing as the first trust layer, then verify storage and sharing separately"],
  ["for-email", "for Email", "for email", "produce an output that is easier to send immediately", "email intent is usually about speed, compatibility, and low friction", "make sure the output is actually the version you want to attach"],
  ["large-files", "for Large Files", "large files", "keep a heavier PDF moving without another service in the middle", "large-file searches usually come from blocked portals or slow viewers", "review the result page by page because heavier files expose quality issues"],
  ["scanned", "for Scanned PDFs", "scanned pdf", "work with a scan that is more awkward than a clean digital PDF", "scanned documents create different constraints around clarity and OCR", "check readability on the key pages instead of assuming every scan behaved the same way"],
  ["multiple-files", "for Multiple Files", "multiple files", "repeat the task across a small file set instead of one source", "batch-style intent appears when the first successful task needs to become a repeatable workflow", "test one file fully, then repeat the same local path across the rest"],
  ["how-to", "How To", "how to", "see the workflow explained step by step before touching the source document", "guide-style searches are closer to professional how-to intent than one-off utility traffic", "use the steps on the page as the checklist before moving into the live tool"],
  ["team-review", "for Team Review", "team review", "prepare a version that internal reviewers can use quickly", "team-review searches usually appear right before the document has to circulate internally", "make the output easy to review, not just technically valid"],
  ["client-review", "for Client Review", "client review", "produce a cleaner copy before the PDF reaches someone outside the team", "client-facing review copies benefit from extra care around privacy and polish", "treat the downloaded result as the delivery candidate and review it accordingly"],
  ["free-online", "Free Online", "free online", "solve the task right away without another paywall or install step", "free-online searches are common, but the differentiator is still local no-upload processing", "use the live local workflow, then keep the result inside your own storage path"],
  ["quick-turnaround", "for Quick Turnaround", "quick turnaround", "finish the document step quickly because the next handoff is immediate", "speed-sensitive searches usually appear when the document problem was discovered late", "verify once, then move the file to the next queue"],
  ["batch-work", "for Batch Work", "batch workflow", "turn the task into a repeatable browser-first routine", "batch intent is operational rather than casual and often comes from office workflows", "use the first successful result as the pattern for the rest of the file set"],
  ["private-browser", "in a Private Browser Workflow", "private browser", "keep the task inside a privacy-first browser path with fewer third parties involved", "privacy-heavy searches reward clear trust language when the route genuinely stays local", "finish the task locally first, then decide what the destination system actually needs"],
].map(([slug, label, keyword, need, reason, review]) => ({
  keyword,
  label,
  need,
  reason,
  review,
  slug,
}))

const INDUSTRY_VARIANTS: VariantSeed[] = [
  ["legal", "for Legal Teams", "legal", "prepare the output for filings, evidence handling, or legal review", "legal users care about chain of handling and reference quality as much as the tool itself", "check page references, sensitive details, and final readiness before the file leaves the matter workspace"],
  ["finance", "for Finance Teams", "finance", "move the document into approvals, reporting, or statements workflows", "finance searches often imply sensitive numbers, statements, or customer records", "review totals, legibility, and whether the output is fit for the next approval step"],
  ["education", "for Education Teams", "education", "prepare the file for staff, board, or student-facing workflows", "education documents frequently involve student records, application packs, and committee reviews", "review clarity and page order because the next recipient may not know the source context"],
  ["hr", "for HR Teams", "hr", "keep the workflow private while handling onboarding packets or personnel copies", "HR files often contain personal data, signatures, and compensation details", "verify names, signatures, and share readiness before moving the file onward"],
  ["compliance", "for Compliance Review", "compliance", "prepare an audit-ready or regulator-ready version locally first", "compliance searches reward trust language because the file often contains regulated content", "review evidence order, metadata, and document integrity before final submission"],
  ["government", "for Government Portals", "government portal", "produce an output more likely to survive a strict portal workflow", "government upload flows are brittle about size, structure, or formatting", "check the output against portal constraints before replacing the source file"],
  ["procurement", "for Procurement", "procurement", "prepare supplier or contract packets for the next handoff", "procurement files regularly mix forms, signatures, and review notes", "review completeness and packet order before the file enters the approval chain"],
  ["board-packs", "for Board Packs", "board pack", "turn the PDF into a cleaner pack for executive circulation", "board-pack searches imply high-stakes internal review with little tolerance for sloppy output", "check pacing, readability, and whether the output is circulation-ready on the first pass"],
  ["audit-ready", "for Audit-Ready Copies", "audit ready", "produce a version that stands up better in audit or evidence review", "audit-oriented pages monetize well because the intent is operational and quality-sensitive", "review sequencing, text clarity, and document integrity before archiving the output"],
  ["student-records", "for Student Records", "student records", "handle academic or administrative PDFs more carefully before sharing", "student-record flows often mix personal information with everyday admin work", "make sure the result is appropriate for the exact recordkeeping or submission step"],
  ["vendor-packets", "for Vendor Packets", "vendor packet", "prepare supplier-facing or supplier-sourced files for the next handoff", "vendor packets regularly mix forms, signatures, and support documents", "treat the output as a packet that may be read by someone with no context from the source folder"],
  ["private-sharing", "for Private Sharing", "private sharing", "minimize exposure before the file reaches another person or platform", "private-sharing intent is often the last check before the document leaves the team", "review the export as though it is the exact copy someone else will keep"],
].map(([slug, label, keyword, need, reason, review]) => ({
  keyword,
  label,
  need,
  reason,
  review,
  slug,
}))

const ALL_ACTIONS = [...EXISTING_ACTIONS, ...NEW_ACTIONS]
const ACTION_MAP = new Map<string, ActionSeed>()
for (const action of ALL_ACTIONS) {
  ACTION_MAP.set(action.action, action)
  for (const alias of action.aliases ?? []) ACTION_MAP.set(alias, action)
}

const EXTENSION_MATRIX = [
  ...NEW_ACTIONS.flatMap((action) => CORE_VARIANTS.map((variant) => ({ action, variant }))),
  ...ALL_ACTIONS.flatMap((action) => INDUSTRY_VARIANTS.map((variant) => ({ action, variant }))),
]

const EXTENSION_MAP = new Map(
  EXTENSION_MATRIX.map(({ action, variant }) => [`${action.action}/${variant.slug}`, { action, variant }])
)

function relatedCards(action: ActionSeed): ProgrammaticRelatedTool[] {
  return action.related.flatMap((slug) => {
    const tool = getToolBySlug(slug)
    return tool ? [{ description: tool.description, href: `/tools/${tool.slug}`, name: tool.name }] : []
  })
}

function buildExtensionBundle(action: ActionSeed, variant: VariantSeed): ExtendedBundle | null {
  const tool = getToolBySlug(action.toolSlug)
  if (!tool) return null

  const canonicalPath = `/pdf-tools/${action.action}/${variant.slug}`
  const h1 = `${action.title} ${variant.label}`
  const title = `${h1} – No Upload, Local Browser | Plain Tools`
  const metaDescription = buildMetaDescription(
    `${action.title} ${variant.keyword} on Plain Tools with 100% local browser processing, no upload, and privacy-first workflow guidance.`
  )
  const intro = [
    `${h1} is a specific workflow query, not a generic PDF search. It usually appears when a real handoff is already blocked and the user needs a route tuned to ${variant.keyword} intent.`,
    `Plain Tools keeps the core ${action.title.toLowerCase()} flow local in the browser. That matters because ${action.privacy}.`,
    `The practical outcome is ${action.outcome} so the next step in ${action.destination} can move forward with less friction and less unnecessary exposure.`,
  ]
  const whyUsersNeedThis = [
    `${variant.need}. That is why this page exists as a dedicated long-tail route instead of one more generic PDF hub page.`,
    `${variant.reason}. These searches are valuable because the user is usually close to a real review, submission, or approval workflow.`,
    `A useful page also needs to explain what to verify after the local processing step. For this route, focus on ${action.review}.`,
  ]
  const howItWorks = [
    `Open the live ${action.title.toLowerCase()} workspace below and run the task directly in the browser. Plain Tools keeps the core processing on-device, so the source file does not need to leave your machine for the main workflow.`,
    `${variant.review}. That turns the page into a usable workflow asset rather than a thin tool listing.`,
    variant.slug === "how-to"
      ? "This guide-style variant is written to be followed step by step by someone handling the workflow for the first time."
      : "This variant assumes the user already understands the base task and needs a route optimized for the exact constraint in the query.",
  ]
  const howToSteps: ProgrammaticHowToStep[] = [
    { name: "Open the real source PDF", text: `Start with the document that is actually blocked by the ${variant.keyword} constraint rather than a throwaway sample.` },
    { name: "Run the live local workflow", text: `Use the embedded Plain Tools workspace so the core ${action.title.toLowerCase()} step stays on-device.` },
    { name: "Tune the task for the real destination", text: `Apply the settings or workflow choice that best fits ${variant.keyword} intent and the next destination for the file.` },
    { name: "Review the exported result", text: `Check ${action.review} before deciding the output is ready.` },
    { name: "Move into the next handoff", text: "Only after the review step should the document continue into email, a portal, an archive, or another review queue." },
  ]
  const explanationBlocks: ProgrammaticExplanationBlock[] = [
    { title: `Why ${variant.keyword} changes the workflow`, paragraphs: [`${variant.keyword} is not a cosmetic modifier. It changes what the user is actually optimizing: trust, speed, compatibility, or audience fit.`, "That is why this page leads with the scenario rather than burying it in one sentence. The route works best when it meets the exact blocker behind the search."] },
    { title: "Why local processing matters here", paragraphs: [`Plain Tools leans into a browser-first model because ${action.privacy}. If the core workflow can stay on-device, that is usually the cleaner trust story.`, "Local processing does not solve every downstream risk, but it removes one major exposure point: the need to upload the source PDF to another service just to finish the main task."] },
    { title: "How to judge whether the result is really ready", paragraphs: [`A successful export is not the same thing as a successful workflow. The output still needs to match the real destination, whether that is board circulation, a portal upload, client review, or internal approval.`, `For this route, focus on ${action.review}. That review step is what makes the page useful instead of thin.`] },
    { title: "Why this page earns a dedicated canonical URL", paragraphs: [`Exact-match routes like ${canonicalPath} work because the scenario itself is worth bookmarking, sharing, and revisiting. Teams often need to rerun the same style of task across recurring document types.`, "That is also why each page includes strong internal linking. The user often needs the next nearby route immediately after this one, not a fresh search session."] },
  ]
  const privacyNote = [
    "Plain Tools is explicit about the trust model on this route: 100% local browser processing for the core PDF task, no upload, and no account requirement before you use the live workspace.",
    `That privacy-first approach is especially relevant when ${action.privacy}. The file can stay on the same device until the output is ready for the next controlled step.`,
    "Local processing is not the whole security story, but it is a strong default when the alternative is handing the source document to another upload-first service for a routine operation.",
  ]
  const faq: ProgrammaticFaq[] = [
    { question: `Can I ${action.title.toLowerCase()} ${variant.keyword} without uploading the file?`, answer: "Yes. The preferred Plain Tools path keeps the core workflow local in the browser, so the file does not need to be uploaded for the main task." },
    { question: `Why does this page focus on ${variant.keyword}?`, answer: "Because the modifier usually reveals the real constraint behind the search. The document task is the same, but the review criteria and workflow advice change." },
    { question: "What should I review after using the tool?", answer: `Review ${action.review}. A file is only ready when the next real workflow accepts it.` },
    { question: "Is this route suitable for sensitive PDFs?", answer: `It is designed for privacy-first handling because ${action.privacy}. Local processing reduces one major exposure point before the file moves onward.` },
    { question: "Why are there so many internal links here?", answer: "Because PDF workflows branch naturally. Users often need a sibling variant, adjacent tool, or comparison page immediately after the first task." },
    { question: "Can I share this exact scenario with someone else?", answer: "Yes. The page uses a self-referencing canonical URL so the exact workflow variant can be reopened and shared consistently." },
    { question: "What if the output still is not right?", answer: "Use the related links to move into the next nearby PDF route instead of restarting the workflow on another upload-first site." },
  ]
  const wordCount = countWords([
    title,
    metaDescription,
    ...intro,
    ...whyUsersNeedThis,
    ...howItWorks,
    ...howToSteps.flatMap((step) => [step.name, step.text]),
    ...explanationBlocks.flatMap((block) => [block.title, ...block.paragraphs]),
    ...privacyNote,
    ...faq.flatMap((item) => [item.question, item.answer]),
  ])
  if (wordCount < 900) {
    throw new Error(`Extended PDF page ${canonicalPath} fell below 900 words (${wordCount}).`)
  }

  return {
    featureList: [`${action.title} ${variant.keyword}`, "100% local browser processing", "No upload for the core workflow", "Related internal links into PDF variants and comparisons"],
    heroBadges: ["100% local", "no upload", "privacy-first", variant.keyword],
    metadata: {
      ...buildPageMetadata({ title, description: metaDescription, path: canonicalPath, image: "/og/tools.png", googleNotranslate: true, type: "article" }),
      keywords: [`${action.action} ${variant.keyword}`, `${action.title.toLowerCase()} ${variant.keyword}`, `${action.title.toLowerCase()} no upload`, "local browser pdf tool", "privacy-first pdf workflow"],
    },
    page: {
      canonicalPath,
      description: metaDescription,
      explanationBlocks,
      faq,
      howItWorks,
      howToSteps,
      intro,
      paramLabel: variant.label,
      paramSlug: variant.slug,
      privacyNote,
      relatedTools: relatedCards(action),
      title,
      tool,
      whyUsersNeedThis,
      wordCount,
    },
    schema: combineJsonLd([
      buildWebPageSchema({ name: h1, description: metaDescription, url: buildCanonicalUrl(canonicalPath) }),
      buildHowToSchema(`How to ${action.title.toLowerCase()} ${variant.keyword}`, metaDescription, howToSteps),
    ]),
    seoPage: { action: action.action, canonicalPath, h1, metaDescription, title, toolSlug: action.toolSlug, variant: variant.slug },
  }
}

function resolvedAction(action: string) {
  return ACTION_MAP.get(action)?.action ?? action
}

export function buildExtendedPdfVariantProgrammaticBundle(action: string, variant: string): ExtendedBundle | null {
  const extension = EXTENSION_MAP.get(`${resolvedAction(action)}/${variant}`)
  if (extension) return buildExtensionBundle(extension.action, extension.variant)

  const base = buildBaseBundle(action, variant)
  if (!base) return null

  return {
    featureList: [`${base.page.tool.name} ${base.page.paramLabel}`, "100% local browser processing", "No upload for the core workflow", "Related internal links into PDF variants and comparisons"],
    heroBadges: ["100% local", "no upload", "privacy-first", "pdf workflow"],
    metadata: base.metadata,
    page: base.page,
    schema: base.schema,
    seoPage: {
      action: resolvedAction(action),
      canonicalPath: base.page.canonicalPath,
      h1: base.seoPage.h1,
      metaDescription: base.page.description,
      title: base.page.title,
      toolSlug: base.page.tool.slug,
      variant,
    },
  }
}

export function generateExtendedPdfVariantStaticParams(options?: { limit?: number }) {
  const extension = EXTENSION_MATRIX.map(({ action, variant }) => ({ action: action.action, variant: variant.slug }))
  const base = generateBaseParams().filter((entry) => !EXTENSION_MAP.has(`${resolvedAction(entry.action)}/${entry.variant}`))
  const combined = [...extension, ...base]
  return typeof options?.limit === "number" && options.limit > 0 ? combined.slice(0, options.limit) : combined
}

export function getExtendedPdfVariantSitemapPaths() {
  const extensionPaths = EXTENSION_MATRIX.map(({ action, variant }) => `/pdf-tools/${action.action}/${variant.slug}`)
  return [...extensionPaths, ...getBaseSitemapPaths()].filter(
    (path, index, paths) => paths.findIndex((entry) => entry === path) === index
  )
}

export function getExtendedPdfVariantPage(action: string, variant: string) {
  const extension = buildExtendedPdfVariantProgrammaticBundle(action, variant)
  if (extension) return extension.seoPage
  return getBasePage(action, variant)
}

export function getExtendedRelatedPdfVariantPages(action: string, variant: string, limit = 6) {
  const extension = EXTENSION_MATRIX.filter(
    (entry) => entry.action.action === resolvedAction(action) && entry.variant.slug !== variant
  )
    .slice(0, limit)
    .flatMap((entry) => {
      const page = buildExtensionBundle(entry.action, entry.variant)?.seoPage
      return page ? [page] : []
    })

  if (extension.length >= limit) return extension
  return [...extension, ...getBaseRelatedPages(action, variant, limit)].slice(0, limit)
}

export const EXTENDED_PDF_VARIANT_METADATA_EXAMPLES = [
  buildExtendedPdfVariantProgrammaticBundle("annotate-pdf", "legal"),
  buildExtendedPdfVariantProgrammaticBundle("watermark-pdf", "client-review"),
  buildExtendedPdfVariantProgrammaticBundle("bates-numbering", "audit-ready"),
  buildExtendedPdfVariantProgrammaticBundle("form-fill", "education"),
  buildExtendedPdfVariantProgrammaticBundle("ai-summarize-pdf", "private-sharing"),
  buildExtendedPdfVariantProgrammaticBundle("compare-pdf", "finance"),
]
  .filter((entry): entry is ExtendedBundle => Boolean(entry))
  .map((entry) => ({
    description: entry.page.description,
    path: entry.page.canonicalPath,
    title: entry.seoPage.title,
  }))

export type { PdfVariantRouteParams }
