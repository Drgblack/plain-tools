import type { Metadata } from "next"

import { buildMetaDescription, buildPageMetadata, buildCanonicalUrl } from "@/lib/page-metadata"
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
  buildPdfVariantMetadata as buildLegacyPdfVariantMetadata,
  buildPdfVariantProgrammaticBundle as buildLegacyBundle,
  getPdfToolVariantPage as getLegacyPage,
  getPdfVariants as getLegacyVariants,
  type PdfToolVariantSeoPage,
  type PdfVariantProgrammaticBundle,
} from "@/lib/pdf-tool-variants"
import { getToolBySlug } from "@/lib/tools-catalogue"

export type PdfVariantRouteParams = {
  action: string
  variant: string
}

export type PdfVariantDefinition = {
  variant: string
  title: string
  desc: string
  keywords: string[]
}

type PdfVariantCategory = "platform" | "problem" | "workflow" | "guide"
type PdfVariantKind = "tool-variant" | "problem-solution" | "how-to-guide"

type ExtraAction = {
  action: string
  toolSlug: string
  aliases?: string[]
  baseAction: string
  introUseCase: string
  privacyUseCase: string
  outcome: string
  idealDocuments: string
  stepNouns: [string, string, string, string, string]
  limitations: [string, string, string, string]
  relatedTools: string[]
  relatedGuides: string[]
}

type Modifier = {
  slug: string
  h1Label: string
  titleLabel: string
  userNeed: string
  whyItMatters: string
  privacyAngle: string
  workflowAdvice: string
  limitationAngle: string
  querySeed: string
  keywords: string[]
}

type GuideConfig = {
  action: string
  toolSlug: string
  toolVerb: string
  checklist: string
  outcome: string
  destinationExamples: string
  failureMode: string
  relatedGuides: string[]
  relatedTools: string[]
}

const GUIDE_VARIANT = "how-to"
const VARIANT_ALIASES: Record<string, string> = {
  "free-online": "free",
  secure: "securely",
}

const PDF_ACTIONS = [
  "compress-pdf",
  "merge-pdf",
  "split-pdf",
  "pdf-to-word",
  "word-to-pdf",
  "extract-pages",
  "rotate-pdf",
  "sign-pdf",
  "ocr-pdf",
  "unlock-pdf",
] as const

const EXTRA_ACTIONS: ExtraAction[] = [
  {
    action: "extract-pages",
    aliases: ["extract-pdf"],
    toolSlug: "extract-pdf",
    baseAction: "Extract Pages from PDF",
    introUseCase:
      "pull specific pages into a cleaner working file without sending the source document to another service first",
    privacyUseCase: "contracts, onboarding packs, statements, evidence bundles, and regulated PDFs",
    outcome: "a smaller PDF containing only the pages that matter",
    idealDocuments:
      "long forms, client packs, claim bundles, scans, review copies, and admin paperwork",
    stepNouns: [
      "add the source PDF",
      "select the page range",
      "extract the new file locally",
      "review the resulting subset",
      "download the clean output for the next handoff",
    ],
    limitations: [
      "Page extraction still needs a post-check because missing one required page can break the downstream workflow.",
      "Heavily scanned PDFs can remain large even after extraction if the page images themselves are dense.",
      "If the source was protected or disordered, you may still need an unlock or reorder step before the clean subset is ready.",
      "Keep the original nearby until the extracted copy has been accepted in the destination workflow.",
    ],
    relatedTools: ["split-pdf", "merge-pdf", "compress-pdf", "protect-pdf", "rotate-pdf"],
    relatedGuides: [
      "/learn/how-to-extract-pages-from-a-pdf",
      "/learn/how-to-split-a-pdf-by-pages",
      "/learn/no-uploads-explained",
    ],
  },
  {
    action: "rotate-pdf",
    toolSlug: "rotate-pdf",
    baseAction: "Rotate PDF Pages",
    introUseCase:
      "fix sideways scans and upside-down pages without exporting the file through another editor first",
    privacyUseCase: "forms, receipts, scans, client documents, and mobile-captured paperwork",
    outcome: "a PDF with correct orientation for review, upload, or archive",
    idealDocuments:
      "phone scans, office scans, signed forms, receipts, board packs, and submission copies",
    stepNouns: [
      "add the PDF",
      "pick the pages that need rotation",
      "rotate the file locally",
      "confirm the final reading order",
      "download the corrected copy",
    ],
    limitations: [
      "Rotation fixes orientation, but it does not repair poor scan quality or missing text searchability.",
      "Large image-heavy scans can still put pressure on browser memory on lower-power devices.",
      "Some downstream workflows still need OCR, extraction, or compression after rotation.",
      "Always review every changed page before you replace the original or send the corrected copy onward.",
    ],
    relatedTools: ["ocr-pdf", "compress-pdf", "extract-pdf", "merge-pdf", "protect-pdf"],
    relatedGuides: [
      "/learn/how-to-verify-a-pdf-tool-doesnt-upload-your-files",
      "/learn/no-uploads-explained",
      "/learn/how-ocr-works-on-scanned-pdfs",
    ],
  },
]

const MODIFIERS: Modifier[] = [
  {
    slug: "mac",
    h1Label: "on Mac",
    titleLabel: "on Mac",
    userNeed: "finish the task in Safari or Chrome without installing a heavyweight desktop suite",
    whyItMatters: "many Mac users want a browser route that works now instead of another app detour",
    privacyAngle:
      "keeping the core workflow local in the browser avoids another cloud hand-off while the file is already on the same device",
    workflowAdvice:
      "review the output in Preview or your normal PDF viewer before you move it into another workflow",
    limitationAngle: "older Macs can still slow down on long image-heavy PDFs because the work happens in browser memory",
    querySeed: "mac",
    keywords: ["mac pdf tool", "pdf on mac", "browser pdf workflow"],
  },
  {
    slug: "windows",
    h1Label: "on Windows",
    titleLabel: "on Windows",
    userNeed: "complete the job in Edge or Chrome without another desktop PDF suite",
    whyItMatters:
      "Windows users often get bounced between install prompts, uploads, and office workflows when the task should be simple",
    privacyAngle:
      "a browser-local path keeps the source file on the same device instead of sending it to a remote service first",
    workflowAdvice:
      "open the output in your normal viewer to confirm page order, readability, and final structure",
    limitationAngle: "lower-memory Windows laptops can still struggle with long scanned PDFs",
    querySeed: "windows",
    keywords: ["windows pdf tool", "pdf on windows", "local browser pdf"],
  },
  {
    slug: "iphone",
    h1Label: "on iPhone",
    titleLabel: "on iPhone",
    userNeed: "finish the task from a phone when you do not have a laptop nearby",
    whyItMatters:
      "mobile users usually discover the document issue when a share or upload already needs to happen immediately",
    privacyAngle:
      "processing the core workflow in the mobile browser avoids installing another app or sending the file through a remote service first",
    workflowAdvice:
      "keep the file small enough for mobile and review the downloaded result before sharing it onward",
    limitationAngle: "phone browsers have tighter memory limits, so very large files may still need a desktop fallback",
    querySeed: "iphone",
    keywords: ["iphone pdf tool", "pdf on iphone", "mobile pdf browser"],
  },
  {
    slug: "android",
    h1Label: "on Android",
    titleLabel: "on Android",
    userNeed: "run the task from a phone without switching to a desktop workflow",
    whyItMatters: "many people only notice file issues when a mobile share or upload attempt fails",
    privacyAngle:
      "a local browser route avoids another app install and keeps the file on-device for the core step",
    workflowAdvice:
      "keep the workflow focused on one clear output and save the result locally before moving to the next app",
    limitationAngle: "mobile RAM constraints still matter for long PDFs and image-heavy scans",
    querySeed: "android",
    keywords: ["android pdf tool", "pdf on android", "mobile browser pdf"],
  },
  {
    slug: "offline",
    h1Label: "Offline",
    titleLabel: "Offline",
    userNeed: "reduce dependence on a cloud workflow and keep the core task on the device already holding the file",
    whyItMatters:
      "people search for offline routes when travelling, dealing with unstable connections, or avoiding upload steps on principle",
    privacyAngle:
      "local processing is closest to the privacy question users are really asking when they add terms like offline or local",
    workflowAdvice:
      "treat the output as something to review before you send it into another service or storage system",
    limitationAngle:
      "true offline use still depends on the browser having enough memory and the page assets already loaded",
    querySeed: "offline",
    keywords: ["offline pdf tool", "local pdf workflow", "browser offline pdf"],
  },
  {
    slug: "securely",
    h1Label: "Securely",
    titleLabel: "Securely",
    userNeed: "finish the task with fewer third parties touching the document",
    whyItMatters:
      "security-focused searches usually come from people handling contracts, HR files, finance material, or client records",
    privacyAngle:
      "the safest realistic starting point is often to avoid a server upload for the core processing step whenever that is genuinely possible",
    workflowAdvice:
      "treat the final output as part of a wider secure workflow that still includes careful storage and sharing decisions",
    limitationAngle:
      "local processing removes one class of risk but it does not govern the file after you download it",
    querySeed: "secure",
    keywords: ["secure pdf tool", "privacy-first pdf", "local browser security"],
  },
  {
    slug: "no-upload",
    h1Label: "No Upload",
    titleLabel: "with No Upload",
    userNeed: "avoid sending the file to a remote server just to finish a straightforward task",
    whyItMatters:
      "this modifier usually signals a trust question rather than a feature question, especially for PDFs with personal or regulated data",
    privacyAngle:
      "the core route stays on-device, which is why this page can talk concretely about privacy instead of vague claims",
    workflowAdvice:
      "inspect the Network tab if you want proof, then run the task and review the output before it leaves your device",
    limitationAngle:
      "no upload for the core workflow still does not remove the need to handle the downloaded result carefully afterwards",
    querySeed: "no upload",
    keywords: ["no upload pdf", "local browser pdf", "files never leave device"],
  },
  {
    slug: "free",
    h1Label: "Free Online",
    titleLabel: "Free Online",
    userNeed: "solve the problem without paying for a full PDF suite when the task is routine and specific",
    whyItMatters: "many utility searches include free because people need one outcome now, not a procurement decision",
    privacyAngle:
      "a free browser tool still needs to be explicit about privacy, so this route keeps the local-processing model visible",
    workflowAdvice:
      "treat the page as a one-task workflow and review the output before you replace the source file",
    limitationAngle:
      "free does not mean unlimited; large or damaged files can still need manual review or a different workflow next",
    querySeed: "free online",
    keywords: ["free online pdf", "free browser pdf tool", "no upload free pdf"],
  },
  {
    slug: "large-files",
    h1Label: "for Large Files",
    titleLabel: "for Large Files",
    userNeed: "process oversized documents without guessing whether the browser can realistically cope",
    whyItMatters:
      "large files are where local workflows save upload time, but they are also where memory limits show up fastest",
    privacyAngle:
      "when the document is both large and sensitive, keeping the main processing step local is often worth the extra care",
    workflowAdvice:
      "work in smaller chunks when necessary and review intermediate outputs instead of forcing one pass to solve everything",
    limitationAngle:
      "image-heavy sources can still push browser memory or CPU limits, especially on phones and older laptops",
    querySeed: "large files",
    keywords: ["large pdf files", "big pdf browser tool", "oversized pdf no upload"],
  },
  {
    slug: "for-email",
    h1Label: "for Email",
    titleLabel: "for Email",
    userNeed: "get the file into an inbox-friendly shape without a second round of edits",
    whyItMatters:
      "mail gateways, attachment caps, and rushed approval loops often turn a simple document task into back-and-forth friction",
    privacyAngle:
      "email attachments often contain contracts, invoices, CVs, or forms that you may not want to hand to an upload service first",
    workflowAdvice:
      "focus on a result that is small enough to send and still readable on the first pass",
    limitationAngle: "always open the final file before sending so you do not discover damage after the email has gone out",
    querySeed: "for email",
    keywords: ["compress pdf for email", "reduce pdf size for gmail", "email attachment pdf"],
  },
  {
    slug: "under-1mb",
    h1Label: "Under 1 MB",
    titleLabel: "Under 1 MB",
    userNeed: "hit a strict file-size threshold for a form, portal, or admin workflow",
    whyItMatters:
      "some systems fail hard on attachment limits and do not explain what trade-offs are needed to get under the cap",
    privacyAngle:
      "when the file contains private or regulated material, shrinking it locally is a safer starting point than random upload tools",
    workflowAdvice:
      "check both size and legibility because the smallest output is not always the most usable one",
    limitationAngle: "heavily scanned files may need a compromise between size target and on-page clarity",
    querySeed: "under 1mb",
    keywords: ["pdf under 1mb", "reduce pdf size under 1mb", "compress pdf without upload"],
  },
  {
    slug: "scanned",
    h1Label: "for Scanned Files",
    titleLabel: "for Scanned Files",
    userNeed: "handle image-based PDFs that behave differently from clean digital originals",
    whyItMatters:
      "scanned files are usually larger, heavier, and less predictable, so they deserve different expectations from digital PDFs",
    privacyAngle:
      "scans often contain ID documents, forms, or statements, so keeping the core handling local can matter more",
    workflowAdvice:
      "expect to review clarity, orientation, and text quality after processing rather than assuming the first output is final",
    limitationAngle:
      "image-based sources may still need OCR, lighter batching, or a second pass if the first output is heavy or hard to read",
    querySeed: "scanned pdf",
    keywords: ["scanned pdf", "image pdf", "make scanned pdf usable"],
  },
  {
    slug: "password-protected",
    h1Label: "for Password-Protected Files",
    titleLabel: "for Password-Protected Files",
    userNeed: "work with a file that already has access protection or needs protection as part of the workflow",
    whyItMatters:
      "people often search this when they are dealing with sensitive documents and do not want to break the protection chain by accident",
    privacyAngle:
      "a privacy-first workflow should explain clearly whether the file must be unlocked first, processed next, and re-protected afterward",
    workflowAdvice:
      "confirm whether the document needs an unlock step before this action or a protect step after it",
    limitationAngle:
      "not every tool can process a protected source directly, so the right answer may involve one extra workflow before or after this page",
    querySeed: "password protected",
    keywords: ["password protected pdf", "protected document workflow", "unlock then process pdf"],
  },
  {
    slug: "multiple-files",
    h1Label: "for Multiple Files",
    titleLabel: "for Multiple Files",
    userNeed: "repeat the same workflow across several source files without turning the task into a manual grind",
    whyItMatters:
      "multi-file work is where small inefficiencies compound, especially in admin, records, and client-delivery routines",
    privacyAngle:
      "a local route matters more when there are many source files because upload-based tools multiply both time and exposure",
    workflowAdvice: "review a sample output early before you trust the whole multi-file run",
    limitationAngle:
      "multi-file jobs can still hit local memory and session limits, so split the work when needed",
    querySeed: "multiple files",
    keywords: ["multiple pdf files", "batch pdf workflow", "many files no upload"],
  },
]

const ACTION_MAP = new Map<string, ExtraAction>()
for (const action of EXTRA_ACTIONS) {
  ACTION_MAP.set(action.action, action)
  for (const alias of action.aliases ?? []) {
    ACTION_MAP.set(alias, action)
  }
}

const MODIFIER_MAP = new Map(MODIFIERS.map((modifier) => [modifier.slug, modifier]))

function countWords(values: string[]) {
  return values.join(" ").trim().split(/\s+/).filter(Boolean).length
}

function unique<T>(values: T[]) {
  return Array.from(new Set(values))
}

function formatPathTitle(path: string) {
  return (
    path
      .split("/")
      .filter(Boolean)
      .at(-1)
      ?.replace(/-/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase()) ?? path
  )
}

function normalizeVariant(variant: string) {
  return VARIANT_ALIASES[variant] ?? variant
}

function getVariantCategory(variant: string): PdfVariantCategory {
  if (variant === GUIDE_VARIANT) return "guide"
  if (["mac", "windows", "iphone", "android"].includes(variant)) return "platform"
  if (["large-files", "password-protected", "scanned"].includes(variant)) return "problem"
  return "workflow"
}

function getVariantKind(variant: string): PdfVariantKind {
  if (variant === GUIDE_VARIANT) return "how-to-guide"
  if (getVariantCategory(variant) === "problem") return "problem-solution"
  return "tool-variant"
}

function buildFlatSlug(action: string, variant: string, kind: PdfVariantKind) {
  if (kind === "how-to-guide") return `how-to-${action}`
  return `${action}-${variant}`
}

function buildAliases(action: string, variant: string, kind: PdfVariantKind) {
  const aliases = new Set<string>([`${action}-${variant}`])
  if (kind === "how-to-guide") {
    aliases.add(`how-to-${action}`)
    aliases.add(`${action}-how-to`)
  }
  if (variant === "free") aliases.add(`${action}-free-online`)
  if (action === "extract-pages") aliases.add(`extract-pdf-${variant}`)
  return Array.from(aliases)
}

function buildGeneratedTitle(action: ExtraAction, modifier: Modifier) {
  if (action.action === "compress-pdf" && modifier.slug === "for-email") {
    return "Compress PDF for Email (Under 25MB) - No Upload, Local Browser | Plain Tools"
  }
  return `${action.baseAction} ${modifier.titleLabel} - No Upload, Local Browser | Plain Tools`
}

function buildGeneratedMetaDescription(action: ExtraAction, modifier: Modifier) {
  return buildMetaDescription(
    `${action.baseAction} ${modifier.querySeed} with 100% local in-browser processing, no file upload, and privacy-first guidance. Useful for ${modifier.keywords.join(", ")}.`
  )
}

function buildGeneratedH1(action: ExtraAction, modifier: Modifier) {
  return `${action.baseAction} ${modifier.h1Label} in Your Browser`
}

function buildGeneratedIntro(action: ExtraAction, modifier: Modifier) {
  return [
    `${action.baseAction} ${modifier.querySeed} is usually not a generic feature search. It is a workflow problem disguised as a tool query. The user needs to ${modifier.userNeed}, and they need to do it without wasting time on account prompts, install walls, or a vague upload page that never explains where the document goes. Plain Tools is built for that utility intent. The core workflow runs locally in the browser, which means the file stays on your device during processing, and the page explains the real use case instead of pretending every PDF task is interchangeable.`,
    `${modifier.whyItMatters}. For this route, that usually means working with ${action.idealDocuments}. The right answer is not simply whether the tool can produce an output. It is whether the output is genuinely ready for the next handoff: email, upload, archive, review, signature, or records storage. That is why the page is written around the modifier rather than only the tool label.`,
    `Plain Tools keeps its strongest promise where it is actually true: the main PDF transformation path stays in your browser. No file upload is required for the core workflow on these routes, so the document does not leave your device just because you need to ${action.introUseCase}. ${modifier.privacyAngle}. The page treats that privacy model as part of the workflow, not as decorative marketing copy, because people searching for secure, local, no-upload, or device-specific routes are really asking a trust question as much as a feature question.`,
    `${modifier.workflowAdvice}. A useful programmatic page has to do more than rename the feature. It needs to explain why the variant matters, what usually breaks in the next step, and how to review the output before it leaves your device.`,
  ]
}

function buildGeneratedHowItWorks(action: ExtraAction, modifier: Modifier) {
  return [
    `Open the tool, ${action.stepNouns[0]}, choose the path that matches ${modifier.querySeed}, and let the browser handle the main processing on-device. That keeps the task close to the actual job and removes the usual upload queue from the middle of the workflow.`,
    `For a ${modifier.querySeed} page, the important shift is not the button you click. It is the decision criteria you apply before and after processing. You are not only asking whether ${action.baseAction.toLowerCase()} works. You are asking whether the result is fit for the destination workflow and whether the route is private enough for the material involved.`,
    `That is why this page pairs the live workspace with problem explanation, step sequence, FAQ, and internal linking. The goal is to help you complete the job once, keep the source file under control, and review the result with realistic expectations before you upload, share, archive, or store it elsewhere.`,
  ]
}

function buildGeneratedSteps(action: ExtraAction, modifier: Modifier) {
  const [first, second, third, fourth, fifth] = action.stepNouns
  return [
    {
      title: "Open the live workspace",
      text: `Start with the real document and ${first}. This page is already scoped to the ${modifier.querySeed} use case, so use the same file you actually plan to email, upload, archive, or review.`,
    },
    {
      title: "Choose the variant-specific path",
      text: `Set the workflow choices that support ${modifier.querySeed}. In practice that means prioritising ${modifier.userNeed} while keeping an eye on what the next destination expects from the final file.`,
    },
    {
      title: "Run the core processing locally",
      text: `${second.charAt(0).toUpperCase() + second.slice(1)} and then ${third}. The main file handling stays in the browser session for this route, which is the core privacy advantage of using Plain Tools here.`,
    },
    {
      title: "Review the output before it leaves your device",
      text: `${fourth.charAt(0).toUpperCase() + fourth.slice(1)}. Check readability, file size, orientation, page completeness, or downstream fit depending on the job. Treat this review as part of the workflow, not as an optional extra.`,
    },
    {
      title: "Download and move to the next step carefully",
      text: `${fifth.charAt(0).toUpperCase() + fifth.slice(1)}. Keep the original nearby until the processed copy has been accepted in the destination workflow and you know the result is genuinely usable.`,
    },
  ]
}

function buildGeneratedFaq(action: ExtraAction, modifier: Modifier): ProgrammaticFaq[] {
  return [
    {
      question: `How do I use ${action.baseAction.toLowerCase()} ${modifier.querySeed}?`,
      answer:
        `Open the tool, follow the ${modifier.querySeed} workflow, run the core processing locally in your browser, and review the output before you upload, share, archive, or submit it.`,
    },
    {
      question: `Does Plain Tools upload files for this ${action.baseAction.toLowerCase()} route?`,
      answer:
        "No for the core workflow. The file stays on your device while the main processing step runs in the browser, and you can inspect that behaviour yourself in DevTools if you want an independent check.",
    },
    {
      question: `Why does the ${modifier.querySeed} variant deserve its own page?`,
      answer:
        `Because the downstream requirement changes the workflow. ${modifier.whyItMatters}. A useful route therefore needs variant-specific guidance, not only a renamed button.`,
    },
    {
      question: `What should I check after I finish ${action.baseAction.toLowerCase()} ${modifier.querySeed}?`,
      answer:
        "Check the output against the actual job you need to complete: readability, page order, size, orientation, searchability, signature placement, or access settings. The right check depends on the variant, not only the tool.",
    },
    {
      question: "Why emphasise local browser processing so heavily here?",
      answer:
        `Because users searching ${modifier.querySeed} often care about trust as much as features. ${modifier.privacyAngle}. Keeping the core route local answers that concern directly.`,
    },
    {
      question: `What are the main limits of ${action.baseAction.toLowerCase()} ${modifier.querySeed}?`,
      answer: `${action.limitations[0]} ${modifier.limitationAngle}`,
    },
  ]
}

function buildGeneratedTrustPoints(action: ExtraAction, modifier: Modifier) {
  return [
    "100% local in-browser processing for the core workflow",
    "No file upload is required for the main task",
    "Privacy-first guidance before you start the tool",
    `${action.baseAction} is explained specifically for the ${modifier.querySeed} use case`,
  ]
}

function buildKeywords(action: ExtraAction, modifier: Modifier) {
  return unique([
    action.action,
    action.baseAction.toLowerCase(),
    `${action.action}-${modifier.slug}`,
    ...modifier.keywords,
    "local browser processing",
    "no upload PDF",
    "privacy-first PDF tool",
  ])
}

function createGeneratedPage(action: ExtraAction, modifier: Modifier): PdfToolVariantSeoPage {
  const category = getVariantCategory(modifier.slug)
  const kind = getVariantKind(modifier.slug)
  const title = buildGeneratedTitle(action, modifier)
  const metaDescription = buildGeneratedMetaDescription(action, modifier)
  const h1 = buildGeneratedH1(action, modifier)
  const introParagraphs = buildGeneratedIntro(action, modifier)
  const howItWorksParagraphs = buildGeneratedHowItWorks(action, modifier)
  const steps = buildGeneratedSteps(action, modifier)
  const limitations = [
    action.limitations[0],
    action.limitations[1],
    action.limitations[2],
    `${action.limitations[3]} ${modifier.limitationAngle}`,
  ]
  const faq = buildGeneratedFaq(action, modifier)
  const trustPoints = buildGeneratedTrustPoints(action, modifier)
  const ctaText =
    "Use the live browser tool below. The core PDF workflow stays on your device while the document is processed."
  const wordCount = countWords([
    title,
    metaDescription,
    h1,
    ...introParagraphs,
    ...howItWorksParagraphs,
    ...steps.flatMap((step) => [step.title, step.text]),
    ...limitations,
    ...faq.flatMap((entry) => [entry.question, entry.answer]),
    ...trustPoints,
    ctaText,
  ])

  if (wordCount < 900 || wordCount > 1400) {
    throw new Error(`Generated PDF variant ${action.action}/${modifier.slug} is out of range at ${wordCount} words.`)
  }

  return {
    aliases: buildAliases(action.action, modifier.slug, kind),
    category,
    ctaText,
    faq,
    flatSlug: buildFlatSlug(action.action, modifier.slug, kind),
    h1,
    howItWorksParagraphs,
    introParagraphs,
    kind,
    limitations,
    metaDescription,
    modifierSlug: modifier.slug,
    path: `/tools/${action.toolSlug}/${modifier.slug}`,
    pdfPath: `/pdf-tools/${action.action}/${modifier.slug}`,
    relatedGuidePaths: action.relatedGuides,
    relatedToolSlugs: action.relatedTools,
    slug: `${action.action}/${modifier.slug}`,
    steps,
    title,
    toolSlug: action.toolSlug,
    trustPoints,
    wordCount,
  }
}

function createGuidePage(config: GuideConfig): PdfToolVariantSeoPage {
  const tool = getToolBySlug(config.toolSlug)
  const toolName = tool?.name ?? formatPathTitle(config.action)
  const title = `How to ${toolName.replace(/s$/u, "")} - No Upload, Local Browser | Plain Tools`
  const h1 = `How to ${toolName.replace(/s$/u, "")} in Your Browser Without Uploading It`
  const introParagraphs = [
    `People search "how to ${toolName.toLowerCase()}" when the task looks simple but the real workflow keeps breaking around the edges. The file may be too large, out of order, sideways, hard to share, or awkward to review on the next device. That is where generic tool pages fall short. They tell you where the button is, but they do not explain the failure pattern that pushed you to search in the first place. This page is built to answer that problem directly, with a live workflow and enough surrounding guidance to stand on its own as a proper guide rather than a thin doorway page.`,
    `Plain Tools treats privacy as part of the workflow, not an afterthought. The core route on this page runs in the browser, so the file stays on your device during processing. That matters when you are working with contracts, resumes, statements, scans, onboarding packs, or any other document that still deserves careful handling even if the task itself is routine. The page combines the real tool, the step sequence, the review guidance, and the internal linking needed to continue safely if one more constraint appears after the first pass.`,
    `A useful how-to guide also needs to explain why the problem happens. In practice, users are usually trying to ${config.outcome}. The failure mode is rarely the tool action itself. It is the downstream requirement: a stricter upload cap, a cleaner review copy, a corrected phone scan, a more shareable packet, or a submission system that rejects what looked fine on the original device.`,
    `That is why this page combines the live ${toolName.toLowerCase()} workspace with a problem explanation, step sequence, FAQ, and contextual internal links. Search engines get a route with clear intent and sufficient depth. Users get a page that explains what to do, why the task exists, what to review afterward, and which privacy-first workflow to open next if the document still needs one more pass.`,
  ]
  const howItWorksParagraphs = [
    `The live tool on this page is the real ${toolName.toLowerCase()} workflow, not a marketing shell. Add the document, keep the settings focused on the actual outcome you need, and let the browser handle the core transformation on-device. That matters because people usually search for a how-to guide when they want one clear path, not a menu of unrelated PDF features.`,
    `What turns a basic tool page into a useful guide is the explanation around the steps. ${config.failureMode}. The guidance here keeps the workflow grounded in that practical reality so the output is easier to trust before it moves into email, upload, review, signing, storage, or archive handling.`,
    "This route keeps repeating the same core promise in direct language: 100% local in-browser processing for the main task, no upload for the core workflow, and explicit review before the file leaves your device.",
  ]
  const steps = [
    {
      title: "Open the live browser workflow",
      text: `Start below with the real file that needs work. A guide is only useful if it follows the same path you will use for the actual ${config.destinationExamples} outcome.`,
    },
    {
      title: "Choose settings that support the real destination",
      text: `Keep the configuration narrow. The goal is not to toggle every option. The goal is to ${config.outcome} while preserving enough quality and structure for the next handoff.`,
    },
    {
      title: "Run the core processing locally",
      text: "Let the browser do the main transformation on-device. Plain Tools keeps the core file handling local here, which removes the usual upload queue from the middle of the workflow.",
    },
    {
      title: "Review the result before it leaves your device",
      text: `Check ${config.checklist}. That review step is where most downstream failures show up, especially when the source file was already imperfect.`,
    },
    {
      title: "Move to the next local tool only if a new constraint appears",
      text: "If the document now has a different issue, follow one of the related links instead of starting again in a generic service. That keeps the whole workflow inside the same privacy-first browser processing cluster.",
    },
  ]
  const faq: ProgrammaticFaq[] = [
    {
      question: `Does this how-to page upload files while I ${config.toolVerb}?`,
      answer: "No. The core workflow runs locally in your browser, so the source file stays on your device during the main task.",
    },
    {
      question: "Why publish a dedicated how-to page instead of only the canonical tool page?",
      answer:
        "Because many users do not want a feature directory. They want a step-by-step route that explains the problem, the likely failure point, and the exact checks to run before the file leaves their device.",
    },
    {
      question: `What should I review after I ${config.toolVerb}?`,
      answer: `Review ${config.checklist}. The right answer is not just whether the file downloaded, but whether it is actually ready for ${config.destinationExamples}.`,
    },
    {
      question: `What is the main risk after I finish using ${toolName.toLowerCase()} here?`,
      answer:
        "The biggest remaining risk is downstream handling. The privacy gain comes from keeping the transformation local, but you still need to review the result before you email it, upload it, archive it, or store it elsewhere.",
    },
    {
      question: "Can I continue into another PDF workflow if the result still needs work?",
      answer:
        "Yes. These guide pages intentionally link into adjacent PDF routes so you can stay inside the same local browser processing cluster instead of restarting in a generic upload-first service.",
    },
    {
      question: "Is this page written for beginners or power users?",
      answer:
        "Both. It answers the beginner question in plain language, but it also gives enough operational detail for someone who wants to audit the workflow and review the output before sharing it.",
    },
  ]
  const limitations = [
    `${toolName} still needs a post-check because a successful download does not guarantee the result is ready for the next workflow.`,
    "Large, image-heavy, or badly scanned files can still push browser memory harder than smaller digital PDFs.",
    "The local-processing claim covers the core transformation step, but you still need to handle the downloaded file carefully after it leaves the browser tab.",
    "If the next requirement changes, use one of the related PDF workflows rather than forcing this guide to solve a different problem than the one it is written for.",
  ]
  const trustPoints = [
    "100% local in-browser processing for the core workflow",
    "No file upload is required for the main task",
    "Problem explanation and review guidance, not only a feature shell",
    "Related privacy-first PDF workflows for the next constraint",
  ]
  const metaDescription = buildMetaDescription(
    `${h1}. Use the live browser workflow with no upload, privacy-first guidance, and checks before the file leaves your device.`
  )
  const wordCount = countWords([
    title,
    metaDescription,
    h1,
    ...introParagraphs,
    ...howItWorksParagraphs,
    ...steps.flatMap((step) => [step.title, step.text]),
    ...limitations,
    ...faq.flatMap((entry) => [entry.question, entry.answer]),
    ...trustPoints,
  ])

  if (wordCount < 900 || wordCount > 1400) {
    throw new Error(`Guide page ${config.action}/${GUIDE_VARIANT} is out of range at ${wordCount} words.`)
  }

  return {
    aliases: buildAliases(config.action, GUIDE_VARIANT, "how-to-guide"),
    category: "guide",
    ctaText:
      "Use the live browser tool below, keep the core workflow local, and review the output before it leaves your device.",
    faq,
    flatSlug: `how-to-${config.action}`,
    h1,
    howItWorksParagraphs,
    introParagraphs,
    kind: "how-to-guide",
    limitations,
    metaDescription,
    modifierSlug: GUIDE_VARIANT,
    path: `/tools/${config.toolSlug}/${GUIDE_VARIANT}`,
    pdfPath: `/pdf-tools/${config.action}/${GUIDE_VARIANT}`,
    relatedGuidePaths: config.relatedGuides,
    relatedToolSlugs: config.relatedTools,
    slug: `${config.action}/${GUIDE_VARIANT}`,
    steps,
    title,
    toolSlug: config.toolSlug,
    trustPoints,
    wordCount,
  }
}

const EXTRA_VARIANT_PAGES: PdfToolVariantSeoPage[] = [
  ...EXTRA_ACTIONS.flatMap((action) =>
    ["mac", "windows", "iphone", "android", "offline", "securely", "no-upload", "free", "large-files", "for-email", "under-1mb", "scanned", "password-protected", "multiple-files"].flatMap((slug) => {
      const modifier = MODIFIER_MAP.get(slug)
      if (!modifier) return []
      return createGeneratedPage(action, modifier)
    })
  ),
  createGuidePage({
    action: "rotate-pdf",
    toolSlug: "rotate-pdf",
    toolVerb: "rotate PDF pages",
    checklist: "page orientation, reading order, scan clarity, and whether every changed page is now upright in the destination viewer",
    outcome: "produce a review-ready PDF that no longer opens sideways or upside down",
    destinationExamples: "upload forms, shared reviews, email attachments, or archive copies",
    failureMode:
      "Rotation workflows usually fail after download, when someone notices a few pages are still sideways or the file now needs OCR or extraction as a second pass",
    relatedGuides: ["/learn/no-uploads-explained", "/learn/how-to-verify-a-pdf-tool-doesnt-upload-your-files", "/learn/how-ocr-works-on-scanned-pdfs"],
    relatedTools: ["ocr-pdf", "extract-pdf", "compress-pdf", "protect-pdf", "merge-pdf"],
  }),
  createGuidePage({
    action: "extract-pages",
    toolSlug: "extract-pdf",
    toolVerb: "extract PDF pages",
    checklist: "page completeness, naming, file size, and whether the subset is really ready for the destination workflow on its own",
    outcome: "create a smaller document containing only the pages the next step actually needs",
    destinationExamples: "visa uploads, admin forms, review packets, or records handoffs",
    failureMode:
      "Extraction workflows usually fail when the technically separate file is missing one required page or still carries extra pages that should have been removed",
    relatedGuides: ["/learn/how-to-extract-pages-from-a-pdf", "/learn/how-to-split-a-pdf-by-pages", "/learn/no-uploads-explained"],
    relatedTools: ["split-pdf", "merge-pdf", "compress-pdf", "rotate-pdf", "protect-pdf"],
  }),
  createGuidePage({
    action: "pdf-to-word",
    toolSlug: "pdf-to-word",
    toolVerb: "convert PDF to Word",
    checklist: "paragraph flow, heading order, tables, lists, and whether the editable output is actually easier to finish in Word",
    outcome: "create an editable Word draft without shipping the source PDF to an upload-first service",
    destinationExamples: "editing passes, contract cleanup, or document reuse in Word",
    failureMode:
      "PDF-to-Word workflows usually fail when a technically exported file still needs too much manual cleanup to be useful in the next step",
    relatedGuides: ["/learn/no-uploads-explained", "/learn/how-to-verify-a-pdf-tool-doesnt-upload-your-files", "/learn/how-pdfs-work"],
    relatedTools: ["word-to-pdf", "ocr-pdf", "compare-pdf", "protect-pdf", "merge-pdf"],
  }),
  createGuidePage({
    action: "word-to-pdf",
    toolSlug: "word-to-pdf",
    toolVerb: "convert Word to PDF",
    checklist: "font rendering, page breaks, margins, and whether the PDF now matches what you need to share or upload",
    outcome: "produce a stable PDF copy from a Word file without adding an unnecessary upload step",
    destinationExamples: "email, upload forms, archive copies, or review packets",
    failureMode:
      "Word-to-PDF workflows usually fail when layout drift only becomes obvious after the converted file reaches the recipient or upload portal",
    relatedGuides: ["/learn/no-uploads-explained", "/learn/how-to-verify-a-pdf-tool-doesnt-upload-your-files", "/learn/how-pdfs-work"],
    relatedTools: ["pdf-to-word", "protect-pdf", "sign-pdf", "compress-pdf", "merge-pdf"],
  }),
  createGuidePage({
    action: "sign-pdf",
    toolSlug: "sign-pdf",
    toolVerb: "sign a PDF",
    checklist: "signature placement, final page count, readability, and whether the signed copy should now be protected or shared",
    outcome: "create a review-ready signed copy without sending the document to a generic signing page first",
    destinationExamples: "contracts, approvals, HR forms, or client review copies",
    failureMode:
      "Signing workflows usually fail when the signed copy is technically complete but still needs protection, a better share copy, or one more review step before circulation",
    relatedGuides: ["/learn/how-to-sign-a-pdf-without-uploading-it", "/learn/no-uploads-explained", "/learn/how-to-verify-a-pdf-tool-doesnt-upload-your-files"],
    relatedTools: ["protect-pdf", "unlock-pdf", "fill-pdf", "merge-pdf", "compare-pdf"],
  }),
  createGuidePage({
    action: "ocr-pdf",
    toolSlug: "ocr-pdf",
    toolVerb: "make a PDF searchable with OCR",
    checklist: "searchability, text accuracy, file size, and whether the output is ready for records, review, or a later Word export",
    outcome: "turn a scan into a more searchable, reviewable working file",
    destinationExamples: "records, review packets, editable exports, or searchable archives",
    failureMode:
      "OCR workflows usually fail when the output is technically searchable but still too inaccurate, too heavy, or too messy for the next handoff",
    relatedGuides: ["/learn/ocr-pdf-without-cloud", "/learn/how-ocr-works-on-scanned-pdfs", "/learn/no-uploads-explained"],
    relatedTools: ["pdf-to-word", "compress-pdf", "rotate-pdf", "extract-pdf", "protect-pdf"],
  }),
]

function resolveAction(action: string) {
  return ACTION_MAP.get(action)?.action ?? action
}

function getExtraPage(action: string, variant: string) {
  const resolvedAction = resolveAction(action)
  const normalizedVariant = normalizeVariant(variant)
  return (
    EXTRA_VARIANT_PAGES.find(
      (page) => page.pdfPath === `/pdf-tools/${resolvedAction}/${normalizedVariant}`
    ) ?? null
  )
}

function buildPageKeywords(action: string, variant: string, page: PdfToolVariantSeoPage) {
  const modifier = MODIFIER_MAP.get(variant)
  const actionDef = ACTION_MAP.get(action)
  if (modifier && actionDef) {
    return buildKeywords(actionDef, modifier)
  }

  return unique([
    action,
    page.h1.toLowerCase(),
    page.title.toLowerCase(),
    "local browser processing",
    "no upload PDF",
  ])
}

function getAllRoutePages() {
  const legacyPages = getLegacyVariants()
    .filter((item) => item.action !== "extract-pdf" && item.action !== "rotate-pdf")
    .flatMap((item) => {
      const page = getLegacyPage(item.action, item.variant)
      if (!page) return []
      return {
        action: item.action,
        desc: item.desc,
        keywords: buildPageKeywords(item.action, item.variant, page),
        page,
        title: item.title,
        variant: item.variant,
      }
    })

  const extraPages = EXTRA_VARIANT_PAGES.map((page) => {
    const [, , action, variant] = page.pdfPath.split("/")
    return {
      action,
      desc: page.metaDescription,
      keywords: buildPageKeywords(action, variant, page),
      page,
      title: page.title,
      variant,
    }
  })

  const deduped = new Map<string, (typeof legacyPages)[number] | (typeof extraPages)[number]>()
  for (const page of [...legacyPages, ...extraPages]) {
    deduped.set(`${page.action}/${page.variant}`, page)
  }
  return Array.from(deduped.values())
}

const ALL_ROUTE_PAGES = getAllRoutePages()

function getActionPriority(action: string) {
  const index = PDF_ACTIONS.indexOf(action as (typeof PDF_ACTIONS)[number])
  return index === -1 ? 99 : index
}

function getVariantPriority(variant: string) {
  const priorities = [
    "for-email",
    "under-1mb",
    "large-files",
    "no-upload",
    "offline",
    "mac",
    "windows",
    "iphone",
    "android",
    GUIDE_VARIANT,
  ]
  const index = priorities.indexOf(variant)
  return index === -1 ? 99 : index
}

function sortPages(
  pages: Array<{
    action: string
    desc: string
    keywords: string[]
    page: PdfToolVariantSeoPage
    title: string
    variant: string
  }>
) {
  return [...pages].sort((left, right) => {
    const actionDelta = getActionPriority(left.action) - getActionPriority(right.action)
    if (actionDelta !== 0) return actionDelta

    const variantDelta = getVariantPriority(left.variant) - getVariantPriority(right.variant)
    if (variantDelta !== 0) return variantDelta

    return left.variant.localeCompare(right.variant)
  })
}

function buildRelatedCards(page: PdfToolVariantSeoPage): ProgrammaticRelatedTool[] {
  const tool = getToolBySlug(page.toolSlug)
  const [, , action] = page.pdfPath.split("/")
  const siblingPages = getRelatedPdfVariantPages(action, page.modifierSlug, 4).map((entry) => ({
    href: entry.pdfPath,
    name: entry.h1,
    description: "Related use-case page for the same PDF workflow.",
  }))

  const related = [
    {
      href: "/pdf-tools",
      name: "PDF tools hub",
      description: "Browse the main PDF workflow cluster and jump into adjacent local tasks.",
    },
    {
      href: "/pdf-tools/variants",
      name: "PDF variants index",
      description: "See platform, problem, and how-to routes built around the same browser-first tool set.",
    },
    ...(tool
      ? [
          {
            href: `/tools/${tool.slug}`,
            name: tool.name,
            description: "Open the canonical local tool workflow used by this variant page.",
          },
        ]
      : []),
    ...siblingPages,
    ...page.relatedToolSlugs.slice(0, 3).flatMap((slug) => {
      const relatedTool = getToolBySlug(slug)
      if (!relatedTool) return []
      return {
        href: `/tools/${relatedTool.slug}`,
        name: relatedTool.name,
        description: relatedTool.description,
      }
    }),
    ...page.relatedGuidePaths.slice(0, 2).map((path) => ({
      href: path,
      name: formatPathTitle(path),
      description: "Supporting guide for the next review or privacy check in the workflow.",
    })),
  ]

  const seen = new Set<string>()
  return related.filter((entry) => {
    if (seen.has(entry.href) || entry.href === page.pdfPath) return false
    seen.add(entry.href)
    return true
  }).slice(0, 8)
}

function buildExtraProgrammaticPage(page: PdfToolVariantSeoPage): ProgrammaticPageData | null {
  const tool = getToolBySlug(page.toolSlug)
  if (!tool) return null

  const intro = page.introParagraphs.slice(0, 2)
  const whyUsersNeedThis = page.introParagraphs.slice(2)
  const howItWorks = page.howItWorksParagraphs.slice(0, 2)
  const explanationBlocks: ProgrammaticExplanationBlock[] = [
    {
      title: page.kind === "how-to-guide" ? "Why this guide matters" : "Why this variant matters",
      paragraphs: [page.howItWorksParagraphs[2], page.limitations[0]].filter(Boolean),
    },
    {
      title: "What to review before the file leaves your device",
      paragraphs: [page.limitations[1], page.limitations[2]].filter(Boolean),
    },
    {
      title: "When to move to a related workflow next",
      paragraphs: [
        page.limitations[3],
        "If the requirement changes after this step, stay inside the same local PDF cluster and solve the next issue with a focused route instead of restarting in a generic upload-first tool.",
      ],
    },
  ]
  const faq = page.faq.slice(0, 6)
  const privacyNote = [
    `This route keeps the trust model explicit: 100% local in-browser processing for the core workflow, no file upload, and a result you can inspect on-device before it moves into another system. ${page.trustPoints[1] ?? "The core file handling stays on your device."}`,
    "The privacy gain is strongest during the transformation step itself. After download, you still need to review the output carefully before you email it, upload it, archive it, or store it elsewhere.",
  ]
  const howToSteps: ProgrammaticHowToStep[] = page.steps.map((step) => ({
    name: step.title,
    text: step.text,
  }))

  return {
    canonicalPath: page.pdfPath,
    description: page.metaDescription,
    explanationBlocks,
    faq,
    howToSteps,
    howItWorks,
    intro,
    paramLabel: formatPathTitle(page.modifierSlug),
    paramSlug: page.modifierSlug,
    privacyNote,
    relatedTools: buildRelatedCards(page),
    title: page.title,
    tool,
    whyUsersNeedThis,
    wordCount: page.wordCount,
  }
}

function buildExtraMetadata(action: string, variant: string, page: PdfToolVariantSeoPage) {
  const metadata = buildPageMetadata({
    title: page.title,
    description: page.metaDescription,
    path: `/pdf-tools/${action}/${variant}`,
    image: "/og/tools.png",
    googleNotranslate: true,
  })

  return {
    ...metadata,
    keywords: buildPageKeywords(action, variant, page),
    robots: {
      index: true,
      follow: true,
    },
  } satisfies Metadata
}

function buildExtraBundle(action: string, variant: string) {
  const page = getExtraPage(action, variant)
  if (!page) return null

  const programmaticPage = buildExtraProgrammaticPage(page)
  if (!programmaticPage) return null

  const metadata = buildExtraMetadata(action, variant, page)
  const schema: JsonLdObject | null = combineJsonLd([
    buildWebPageSchema({
      name: page.title,
      description: page.metaDescription,
      url: buildCanonicalUrl(page.pdfPath),
    }),
    buildHowToSchema(`How to use ${page.h1}`, page.metaDescription, programmaticPage.howToSteps),
  ])

  return {
    metadata,
    page: programmaticPage,
    schema,
    seoPage: page,
  } satisfies PdfVariantProgrammaticBundle
}

export function getPdfActions() {
  return [...PDF_ACTIONS]
}

export function getVariantsForAction(action: string): PdfVariantDefinition[] {
  const resolvedAction = resolveAction(action)
  return sortPages(ALL_ROUTE_PAGES.filter((page) => page.action === resolvedAction)).map(
    (page) => ({
      desc: page.desc,
      keywords: page.keywords,
      title: page.title,
      variant: page.variant,
    })
  )
}

export function generateAllPdfPaths(options?: {
  actions?: readonly string[]
  limit?: number
}) {
  const actionSet = options?.actions?.length
    ? new Set(options.actions.map((action) => resolveAction(action)))
    : null

  const pages = sortPages(
    ALL_ROUTE_PAGES.filter((page) => (actionSet ? actionSet.has(page.action) : true))
  ).map((page) => ({
    params: {
      action: page.action,
      variant: page.variant,
    },
  }))

  if (typeof options?.limit === "number" && options.limit > 0) {
    return pages.slice(0, options.limit)
  }

  return pages
}

export function generatePdfVariantStaticParams(options?: {
  actions?: readonly string[]
  limit?: number
}) {
  return generateAllPdfPaths(options).map((entry) => entry.params)
}

export function getPdfVariantSitemapPaths(options?: {
  actions?: readonly string[]
}) {
  return generateAllPdfPaths(options).map(
    ({ params }) => `/pdf-tools/${params.action}/${params.variant}`
  )
}

export function getPdfVariantPage(action: string, variant: string) {
  const resolvedAction = resolveAction(action)
  const normalizedVariant = normalizeVariant(variant)
  const extraPage = getExtraPage(resolvedAction, normalizedVariant)
  if (extraPage) return extraPage

  return getLegacyPage(resolvedAction === "extract-pages" ? "extract-pdf" : resolvedAction, normalizedVariant)
}

export function getRelatedPdfVariantPages(action: string, variant: string, limit = 6) {
  const resolvedAction = resolveAction(action)
  return sortPages(
    ALL_ROUTE_PAGES.filter(
      (page) => page.action === resolvedAction && page.variant !== normalizeVariant(variant)
    )
  )
    .slice(0, limit)
    .map((page) => page.page)
}

export function buildPdfVariantMetadata(action: string, variant: string): Metadata | null {
  const resolvedAction = resolveAction(action)
  const normalizedVariant = normalizeVariant(variant)
  const extraPage = getExtraPage(resolvedAction, normalizedVariant)
  if (extraPage) {
    return buildExtraMetadata(resolvedAction, normalizedVariant, extraPage)
  }

  return buildLegacyPdfVariantMetadata(
    resolvedAction === "extract-pages" ? "extract-pdf" : resolvedAction,
    normalizedVariant
  )
}

export function buildPdfVariantProgrammaticBundle(
  action: string,
  variant: string
): PdfVariantProgrammaticBundle | null {
  const resolvedAction = resolveAction(action)
  const normalizedVariant = normalizeVariant(variant)
  const extraBundle = buildExtraBundle(resolvedAction, normalizedVariant)
  if (extraBundle) return extraBundle

  return buildLegacyBundle(
    resolvedAction === "extract-pages" ? "extract-pdf" : resolvedAction,
    normalizedVariant
  )
}

export const PDF_VARIANT_METADATA_EXAMPLES = [
  ["compress-pdf", "for-email"],
  ["merge-pdf", "mac"],
  ["split-pdf", GUIDE_VARIANT],
  ["pdf-to-word", "securely"],
  ["ocr-pdf", "scanned"],
  ["rotate-pdf", "iphone"],
].flatMap(([action, variant]) => {
  const metadata = buildPdfVariantMetadata(action, variant)
  if (!metadata) return []

  return {
    action,
    metadata,
    variant,
  }
})
