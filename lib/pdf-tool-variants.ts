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
import { getToolBySlug } from "@/lib/tools-catalogue"
import {
  TOOL_VARIANT_PAGES,
  type ToolVariantPageDefinition,
} from "@/lib/tools-matrix"

export const PDF_VARIANT_PLATFORM_MODIFIERS = ["mac", "windows", "iphone", "android"] as const
export const PDF_VARIANT_PROBLEM_MODIFIERS = [
  "offline",
  "securely",
  "no-upload",
  "large-files",
  "remove-password",
] as const

export const CORE_PDF_VARIANT_TOOL_SLUGS = [
  "merge-pdf",
  "split-pdf",
  "compress-pdf",
  "pdf-to-word",
  "jpg-to-pdf",
  "unlock-pdf",
] as const

export const CORE_PDF_VARIANT_MATRIX_MODIFIERS = [
  ...PDF_VARIANT_PLATFORM_MODIFIERS,
  ...PDF_VARIANT_PROBLEM_MODIFIERS,
] as const

export type PdfToolVariantRouteParams = {
  action: string
  variant: string
}

export type PdfVariantCategory = "platform" | "problem" | "workflow" | "guide"
export type PdfVariantKind = "tool-variant" | "problem-solution" | "how-to-guide"

export type PdfToolVariantSeoPage = ToolVariantPageDefinition & {
  aliases: string[]
  category: PdfVariantCategory
  flatSlug: string
  kind: PdfVariantKind
  pdfPath: string
}

export type PdfToolVariantIndexGroup = {
  categories: Array<{
    name: string
    pages: PdfToolVariantSeoPage[]
  }>
  toolDescription: string
  toolName: string
  toolSlug: string
}

export type PdfVariantEntry = {
  action: string
  variant: string
  title: string
  desc: string
}

export type PdfVariantProgrammaticBundle = {
  metadata: Metadata
  page: ProgrammaticPageData
  schema: JsonLdObject | null
  seoPage: PdfToolVariantSeoPage
}

type CustomPdfVariantConfig = {
  aliases?: string[]
  category: PdfVariantCategory
  faq: ProgrammaticFaq[]
  flatSlug: string
  h1: string
  howItWorksParagraphs: string[]
  introParagraphs: string[]
  kind: PdfVariantKind
  limitations: string[]
  metaDescription: string
  modifierSlug: string
  relatedGuidePaths: string[]
  relatedToolSlugs: string[]
  steps: Array<{ text: string; title: string }>
  title: string
  toolSlug: string
  trustPoints: string[]
}

const VARIANT_ALIASES: Record<string, string> = {
  "large-pdf": "large-files",
  secure: "securely",
}

const GUIDE_VARIANT_SLUG = "how-to"

function countWords(values: string[]) {
  return values
    .join(" ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length
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

function withNoUploadSuffix(title: string) {
  if (title.includes("No Upload")) return title
  return title.replace(/ \| Plain Tools$/, " - No Upload | Plain Tools")
}

function normaliseVariantSlug(variant: string) {
  return VARIANT_ALIASES[variant] ?? variant
}

function getVariantCategory(modifierSlug: string): PdfVariantCategory {
  if (modifierSlug === GUIDE_VARIANT_SLUG) return "guide"
  if ((PDF_VARIANT_PLATFORM_MODIFIERS as readonly string[]).includes(modifierSlug)) {
    return "platform"
  }
  if ((PDF_VARIANT_PROBLEM_MODIFIERS as readonly string[]).includes(modifierSlug)) {
    return "problem"
  }
  return "workflow"
}

function getVariantKind(modifierSlug: string): PdfVariantKind {
  if (modifierSlug === GUIDE_VARIANT_SLUG) return "how-to-guide"
  if (getVariantCategory(modifierSlug) === "problem") return "problem-solution"
  return "tool-variant"
}

function buildPdfToolVariantPath(toolSlug: string, modifierSlug: string) {
  return `/pdf-tools/${toolSlug}/${modifierSlug}`
}

function buildFlatSlug(toolSlug: string, modifierSlug: string, kind: PdfVariantKind) {
  if (kind === "how-to-guide") {
    return `how-to-${toolSlug}`
  }

  if (toolSlug === "unlock-pdf" && modifierSlug === "remove-password") {
    return "remove-pdf-password"
  }

  if ((PDF_VARIANT_PLATFORM_MODIFIERS as readonly string[]).includes(modifierSlug)) {
    return `${toolSlug}-on-${modifierSlug}`
  }

  return `${toolSlug}-${modifierSlug}`
}

function buildAliases(page: {
  aliases?: string[]
  flatSlug: string
  kind: PdfVariantKind
  modifierSlug: string
  toolSlug: string
}) {
  const aliases = new Set<string>([page.flatSlug, `${page.toolSlug}-${page.modifierSlug}`])

  if ((PDF_VARIANT_PLATFORM_MODIFIERS as readonly string[]).includes(page.modifierSlug)) {
    aliases.add(`${page.toolSlug}-on-${page.modifierSlug}`)
  }

  if (page.kind === "how-to-guide") {
    aliases.add(`how-to-${page.toolSlug}`)
    aliases.add(`${page.toolSlug}-how-to`)
  }

  if (page.toolSlug === "unlock-pdf" && page.modifierSlug === "remove-password") {
    aliases.add("remove-pdf-password")
  }

  if (page.modifierSlug === "large-files" && page.toolSlug.endsWith("-pdf")) {
    aliases.add(`${page.toolSlug.replace(/-pdf$/, "")}-large-pdf`)
  }

  for (const alias of page.aliases ?? []) {
    aliases.add(alias)
  }

  return Array.from(aliases)
}

function createCustomPdfVariant(config: CustomPdfVariantConfig): PdfToolVariantSeoPage {
  const page: PdfToolVariantSeoPage = {
    aliases: [],
    category: config.category,
    ctaText: "Use the live browser tool below. The core processing path stays on your device.",
    faq: config.faq,
    flatSlug: config.flatSlug,
    h1: config.h1,
    howItWorksParagraphs: config.howItWorksParagraphs,
    introParagraphs: config.introParagraphs,
    kind: config.kind,
    limitations: config.limitations,
    metaDescription: config.metaDescription,
    modifierSlug: config.modifierSlug,
    path: `/tools/${config.toolSlug}/${config.modifierSlug}`,
    pdfPath: buildPdfToolVariantPath(config.toolSlug, config.modifierSlug),
    relatedGuidePaths: config.relatedGuidePaths,
    relatedToolSlugs: config.relatedToolSlugs,
    slug: `${config.toolSlug}/${config.modifierSlug}`,
    steps: config.steps,
    title: config.title,
    toolSlug: config.toolSlug,
    trustPoints: config.trustPoints,
    wordCount: 0,
  }

  page.aliases = buildAliases({
    aliases: config.aliases,
    flatSlug: config.flatSlug,
    kind: page.kind,
    modifierSlug: page.modifierSlug,
    toolSlug: page.toolSlug,
  })

  page.wordCount = countWords([
    page.title,
    page.metaDescription,
    page.h1,
    ...page.introParagraphs,
    ...page.howItWorksParagraphs,
    ...page.steps.flatMap((step) => [step.title, step.text]),
    ...page.limitations,
    ...page.faq.flatMap((entry) => [entry.question, entry.answer]),
    ...page.trustPoints,
    page.ctaText,
  ])

  if (page.wordCount < 900 || page.wordCount > 1400) {
    throw new Error(
      `Custom PDF page ${page.pdfPath} must stay between 900 and 1400 words. Current count: ${page.wordCount}.`
    )
  }

  return page
}

function createHowToGuidePage(config: {
  checklist: string
  destinationExamples: string
  failureMode: string
  flatSlug: string
  outcome: string
  relatedGuidePaths: string[]
  relatedToolSlugs: string[]
  toolSlug: string
  toolVerb: string
}) {
  const tool = getToolBySlug(config.toolSlug)
  const toolName = tool?.name ?? formatPathTitle(config.toolSlug)
  const baseTitle = toolName.replace(/s$/u, "")
  const title = `How to ${baseTitle} - No Upload Guide | Plain Tools`
  const h1 = `How to ${baseTitle} in Your Browser Without Uploading It`

  return createCustomPdfVariant({
    aliases: [`${config.toolSlug}-guide`],
    category: "guide",
    faq: [
      {
        question: `Does this how-to page upload files while I ${config.toolVerb}?`,
        answer:
          "No. For the core workflow on Plain Tools, the browser handles the processing locally so the source file stays on your device during the main task.",
      },
      {
        question: `Why is there a dedicated how-to page instead of only the canonical ${toolName.toLowerCase()} tool?`,
        answer:
          "Because many users do not want a feature directory. They want a step-by-step route that explains the problem, the common failure pattern, and the exact checks to run before the file leaves their device.",
      },
      {
        question: `What should I review after I ${config.toolVerb}?`,
        answer:
          `Review ${config.checklist}. The correct answer is not only whether the file downloaded, but whether the file is genuinely ready for ${config.destinationExamples}.`,
      },
      {
        question: "Can I move straight into another PDF workflow if the result still needs work?",
        answer:
          "Yes. These guide pages intentionally link into adjacent PDF workflows so you can stay inside the same local browser processing cluster instead of restarting in a generic upload-first converter.",
      },
      {
        question: "Is this page written for beginners or power users?",
        answer:
          "Both. The content answers the beginner question in plain language, but it also gives enough operational detail for someone who wants to audit the workflow and review the output before sharing it.",
      },
      {
        question: `What is the main risk after I finish using ${toolName.toLowerCase()} here?`,
        answer:
          "The biggest remaining risk is downstream handling. The privacy advantage comes from keeping the transformation local, but you still need to review the result before you email it, upload it, or archive it elsewhere.",
      },
    ],
    flatSlug: config.flatSlug,
    h1,
    howItWorksParagraphs: [
      `The live tool on this page is the real ${toolName.toLowerCase()} workflow, not a marketing shell. Add the document, keep the settings focused on the outcome you actually need, and let the browser handle the main transformation on-device. That matters because people usually search for a how-to guide when they want one clear path, not a menu of fifty edge cases.`,
      `What turns a basic tool page into a strong how-to page is the explanation around the steps. ${config.failureMode}. The guidance here keeps the workflow grounded in that practical reality so the result is easier to trust before it moves into email, upload, signing, review, or retention.`,
      `This route also keeps repeating the same core promise in direct language: local browser processing, no upload for the core task, and explicit review before the file leaves your device. That combination is what makes the page useful for indexing and useful for actual users at the same time.`,
    ],
    introParagraphs: [
      `People search "how to ${toolName.toLowerCase()}" when the task looks simple but the real workflow keeps breaking around the edges. The PDF may be too large, out of order, difficult to share, or awkward to review on the next device. That is where most generic tool pages fall short. They tell you which button to click, but they do not explain the failure pattern that pushed you to search in the first place. This page is built to answer that problem directly, with a live workflow and enough surrounding explanation to stand on its own as a proper guide rather than a thin doorway page.`,
      `For Plain Tools, the trust model is part of the product, not a decorative claim. The core workflow on this page runs in the browser, so the file stays on your device during processing. That matters when you are working with contracts, resumes, statements, scans, onboarding packs, or any other document that still deserves careful handling even if the task itself is routine. The page therefore treats privacy, review, and next-step fit as part of the guide rather than burying them after the tool.`,
      `A useful how-to guide also needs to explain why the problem happens. In practice, users are usually trying to ${config.outcome}. The failure mode is rarely the tool action itself. It is the downstream requirement: email limits, upload caps, review expectations, storage rules, or the simple fact that the recipient needs a cleaner copy than the source file. Once you understand that, the workflow becomes less about clicking a feature and more about preparing the next handoff properly.`,
      `That is why this page combines the real ${toolName.toLowerCase()} workspace with a problem explanation, step sequence, FAQ, and related internal links. Search engines get a route with clear intent and sufficient depth. Users get a page that explains what to do, why the task exists, what to review afterward, and which local workflow to open next if one more constraint appears.`,
    ],
    kind: "how-to-guide",
    limitations: [
      `${toolName} still needs a quick post-check because a successful download does not guarantee the result is ready for the next workflow.`,
      "Large, image-heavy, or badly scanned files can still push browser memory harder than smaller digital PDFs.",
      "The local-processing claim covers the core transformation step, but you still need to handle the downloaded file carefully after it leaves the browser tab.",
      "If the next requirement changes, use the related PDF workflow rather than forcing this guide to solve a different problem than the one it is written for.",
    ],
    metaDescription: buildMetaDescription(
      `How to ${toolName.toLowerCase()} with local browser processing, no upload, a live embedded tool, and review guidance before the file leaves your device.`
    ),
    modifierSlug: GUIDE_VARIANT_SLUG,
    relatedGuidePaths: config.relatedGuidePaths,
    relatedToolSlugs: config.relatedToolSlugs,
    steps: [
      {
        title: "Open the live browser workflow",
        text: `Start below with the real file that needs work. A guide is only useful if it follows the same path you will use for the actual ${config.destinationExamples} outcome.`,
      },
      {
        title: `Choose the settings that support ${config.outcome}`,
        text: `Keep the configuration narrow. The goal is not to toggle every option. The goal is to ${config.outcome} while preserving enough quality for the next handoff.`,
      },
      {
        title: `Run ${toolName.toLowerCase()} locally`,
        text: `Let the browser do the main transformation on-device. Plain Tools keeps the core file handling local here, which removes the usual upload queue from the middle of the workflow.`,
      },
      {
        title: "Review the result before it leaves your device",
        text: `Check ${config.checklist}. That review step is where most downstream failures show up, especially when the source file was already imperfect.`,
      },
      {
        title: "Move to the next local tool only if the next constraint appears",
        text: "If the document now has a different issue, follow one of the related links instead of starting again in a generic service. That keeps the whole workflow inside the same local browser processing cluster.",
      },
    ],
    title,
    toolSlug: config.toolSlug,
    trustPoints: [
      "Local browser processing for the core workflow",
      "No file leaves your device during the main task",
      "Review guidance written around the actual downstream job",
      "Related local tools and guides for the next constraint",
    ],
  })
}

function createRemovePasswordPage() {
  return createCustomPdfVariant({
    aliases: ["unlock-pdf-remove-password"],
    category: "problem",
    faq: [
      {
        question: "Does removing a PDF password on this page upload the file anywhere?",
        answer:
          "No. The core unlock workflow is processed in your browser, so the source file stays on your device while the main task runs.",
      },
      {
        question: "Why do people search for remove PDF password instead of unlock PDF?",
        answer:
          "Because they are usually describing the problem they need to solve, not the feature name. They want an accessible working copy now, and they want to avoid handing a sensitive document to a random upload service first.",
      },
      {
        question: "What should I review after the password is removed?",
        answer:
          "Review whether the file opens cleanly, whether every page is intact, and whether the unlocked copy should be re-protected before you share, upload, or archive it.",
      },
      {
        question: "Is removing a PDF password always the right next step?",
        answer:
          "No. Sometimes the correct workflow is to keep the file protected and use a different viewer or signing path. This page is for the cases where you are authorised to create a temporary working copy for the next task.",
      },
      {
        question: "Why is local browser processing important for this workflow?",
        answer:
          "Password-related documents often include contracts, HR files, statements, approvals, or other material where the trust question is more important than raw convenience. Keeping the core processing local removes one avoidable exposure point.",
      },
      {
        question: "What should I do if the unlocked copy still needs work?",
        answer:
          "Use a related local workflow next, such as merge, fill, sign, or protect PDF, depending on what the document needs after it becomes accessible.",
      },
    ],
    flatSlug: "remove-pdf-password",
    h1: "Remove PDF Password in Your Browser Without Uploading the File",
    howItWorksParagraphs: [
      "This page embeds the live unlock workflow directly, but it frames it around the real problem users are trying to solve: they need a working copy that opens cleanly for the next approved step. In practice that next step is often signing, form filling, merging, extraction, or simply preparing a version that someone else in the same workflow can review.",
      "The main reason this page exists is that password-related searches are strongly trust-sensitive. People are not only asking whether the file can be unlocked. They are asking whether they can do it without handing the document to another service first. That is why the page makes the local-processing model explicit and tells users to review the unlocked output before they move it into another system.",
      "A good problem-solution page also explains the limit honestly. Removing the password from an authorised document can solve access friction, but it also creates a copy with fewer safeguards. The output should therefore be treated as a working file that may need re-protection before sharing or archiving.",
    ],
    introParagraphs: [
      "Searches for remove PDF password usually happen when a document workflow has stalled. A contract is locked when it needs signing, a form is protected when it needs updating, or an archive copy is inaccessible when a specific page has to be extracted. The user is not looking for an abstract security lesson. They are looking for a direct way to regain access to a file they are authorised to work with, and they want to do that without sending the document to a generic upload-first converter. That is the gap this page is meant to close.",
      "Plain Tools is strongest when the core workflow can stay in the browser. For this route, that means the main unlock step happens locally on-device, with no file upload required for the core processing path. That matters because the documents involved in password workflows are often exactly the ones users should handle more carefully: signed agreements, HR material, statements, onboarding packs, board documents, or regulated forms. The page keeps that trust framing in the main content instead of burying it after the tool.",
      "The underlying problem is rarely the password itself. The real problem is that an entire downstream workflow is blocked by access friction. Someone needs a readable copy for review, a form needs to be completed, a packet needs to be merged, or a share-safe version needs to be prepared before the next handoff. If the unlocked output is not reviewed properly, the user can solve the access problem and still create a delivery problem later. That is why this page includes the step sequence, review checklist, FAQ, and related local workflows in one place.",
      "From an indexing perspective, a problem page like this works because it matches the language users actually search with while still embedding the real tool. From a product perspective, it works because it turns a stalled file into a practical next action: create the authorised working copy locally, confirm the result on-device, then move into the next PDF workflow only if the document genuinely needs it.",
    ],
    kind: "problem-solution",
    limitations: [
      "Only remove a password when you are authorised to work with the file and need an accessible copy for a legitimate next step.",
      "An unlocked output may still need to be re-protected before you share it externally or store it in a less controlled environment.",
      "Very large or image-heavy protected PDFs can still take longer to process locally on lower-memory devices.",
      "The local browser workflow removes one exposure point, but it does not replace careful review and controlled handling after the unlocked copy is downloaded.",
    ],
    metaDescription: buildMetaDescription(
      "Remove a PDF password with local browser processing, no upload, and step-by-step guidance before the unlocked file leaves your device."
    ),
    modifierSlug: "remove-password",
    relatedGuidePaths: [
      "/learn/how-to-protect-a-pdf-with-a-password",
      "/learn/how-to-verify-a-pdf-tool-doesnt-upload-your-files",
      "/learn/no-uploads-explained",
    ],
    relatedToolSlugs: ["protect-pdf", "fill-pdf", "sign-pdf", "merge-pdf", "compare-pdf"],
    steps: [
      {
        title: "Open the unlock workflow with the real file",
        text: "Start with the protected document you are authorised to work with. This route is for creating an accessible working copy, not for bypassing access on files you should not handle.",
      },
      {
        title: "Provide the required access details locally",
        text: "Enter the password only inside the browser workflow so the core unlock step can run on-device rather than through a remote upload service.",
      },
      {
        title: "Create the temporary working copy",
        text: "Run the local processing step and wait for the unlocked result. The goal is a usable copy for the next approved workflow, not just a successful download event.",
      },
      {
        title: "Review the unlocked output before reusing it",
        text: "Open the file, confirm that every page is intact, and decide whether the working copy now needs filling, signing, comparison, merging, or re-protection.",
      },
      {
        title: "Re-protect or share only after the review",
        text: "If the working copy solved the access problem, decide how it should be handled next. In many cases the correct answer is to re-protect the final copy before it leaves your device.",
      },
    ],
    title: "Remove PDF Password - No Upload | Plain Tools",
    toolSlug: "unlock-pdf",
    trustPoints: [
      "Local browser processing for the unlock step",
      "No upload for the core workflow",
      "Review guidance before the unlocked copy leaves your device",
      "Related local workflows for re-protection, signing, filling, or comparison",
    ],
  })
}

function enhanceBasePage(page: ToolVariantPageDefinition): PdfToolVariantSeoPage {
  const category = getVariantCategory(page.modifierSlug)
  const kind = getVariantKind(page.modifierSlug)
  const flatSlug = buildFlatSlug(page.toolSlug, page.modifierSlug, kind)

  const enhanced: PdfToolVariantSeoPage = {
    ...page,
    aliases: [],
    category,
    flatSlug,
    kind,
    metaDescription: buildMetaDescription(page.metaDescription),
    pdfPath: buildPdfToolVariantPath(page.toolSlug, page.modifierSlug),
    title: withNoUploadSuffix(page.title),
  }

  enhanced.aliases = buildAliases({
    flatSlug,
    kind,
    modifierSlug: enhanced.modifierSlug,
    toolSlug: enhanced.toolSlug,
  })

  return enhanced
}

const SYNTHETIC_PAGES: PdfToolVariantSeoPage[] = [
  createHowToGuidePage({
    checklist: "readability, final file size, image quality, and whether the result is actually ready for email, upload, or storage",
    destinationExamples: "email, upload forms, storage, or mobile sharing",
    failureMode:
      "Compression is rarely about the button itself. It is about meeting a cap without making the file unreadable or too damaged for the recipient",
    flatSlug: "how-to-compress-pdf",
    outcome: "get the file under the real size limit without turning it into an unusable copy",
    relatedGuidePaths: [
      "/learn/compress-pdf-without-upload",
      "/learn/compress-pdf-without-losing-quality",
      "/learn/how-to-verify-a-pdf-tool-doesnt-upload-your-files",
    ],
    relatedToolSlugs: ["pdf-to-jpg", "merge-pdf", "split-pdf", "protect-pdf", "ocr-pdf"],
    toolSlug: "compress-pdf",
    toolVerb: "compress a PDF",
  }),
  createHowToGuidePage({
    checklist: "page order, duplicate pages, orientation, and whether the merged packet opens cleanly for the reviewer",
    destinationExamples: "handover packs, approvals, archive bundles, or client delivery",
    failureMode:
      "Merge workflows usually fail after download, when someone discovers the order is wrong, the packet is too large, or the final copy should have been split first",
    flatSlug: "how-to-merge-pdf",
    outcome: "produce one review-ready packet instead of a stack of disconnected files",
    relatedGuidePaths: [
      "/learn/how-to-merge-pdfs-offline",
      "/learn/how-to-split-a-pdf-by-pages",
      "/learn/no-uploads-explained",
    ],
    relatedToolSlugs: ["split-pdf", "compress-pdf", "protect-pdf", "compare-pdf", "extract-pdf"],
    toolSlug: "merge-pdf",
    toolVerb: "merge PDF files",
  }),
  createHowToGuidePage({
    checklist: "page boundaries, extracted ranges, file naming, and whether each output is ready for its own next step",
    destinationExamples: "submission packs, archive cleanup, or review handoff",
    failureMode:
      "Split workflows tend to fail when the user creates technically separate files that are still badly named, incomplete, or not aligned with the next review stage",
    flatSlug: "how-to-split-pdf",
    outcome: "create smaller files that are genuinely easier to send, upload, or review",
    relatedGuidePaths: [
      "/learn/how-to-split-a-pdf-by-pages",
      "/learn/how-to-extract-pages-from-a-pdf",
      "/learn/no-uploads-explained",
    ],
    relatedToolSlugs: ["extract-pdf", "merge-pdf", "compress-pdf", "rotate-pdf", "protect-pdf"],
    toolSlug: "split-pdf",
    toolVerb: "split a PDF",
  }),
  createRemovePasswordPage(),
]

const PDF_VARIANT_PAGE_MAP = new Map<string, PdfToolVariantSeoPage>()
for (const basePage of TOOL_VARIANT_PAGES.map(enhanceBasePage)) {
  PDF_VARIANT_PAGE_MAP.set(`${basePage.toolSlug}/${basePage.modifierSlug}`, basePage)
}
for (const extraPage of SYNTHETIC_PAGES) {
  PDF_VARIANT_PAGE_MAP.set(`${extraPage.toolSlug}/${extraPage.modifierSlug}`, extraPage)
}

const PDF_VARIANT_PAGES = Array.from(PDF_VARIANT_PAGE_MAP.values())
const ALL_PDF_VARIANT_TOOL_SLUGS = Array.from(
  new Set(PDF_VARIANT_PAGES.map((page) => page.toolSlug))
).sort()

function selectToolSlugs(options?: {
  includeAllPdfTools?: boolean
  toolSlugs?: readonly string[]
}) {
  if (options?.toolSlugs?.length) return [...options.toolSlugs]
  if (options?.includeAllPdfTools === false) return [...CORE_PDF_VARIANT_TOOL_SLUGS]
  return ALL_PDF_VARIANT_TOOL_SLUGS
}

function buildRelatedCards(page: PdfToolVariantSeoPage): ProgrammaticRelatedTool[] {
  const tool = getToolBySlug(page.toolSlug)
  const related = [
    {
      href: "/pdf-tools",
      name: "PDF Tools hub",
      description: "Browse the main PDF workflow cluster and jump into adjacent local tasks.",
    },
    {
      href: "/pdf-tools/variants",
      name: "PDF variants index",
      description: "See platform, problem, and guide routes built around the same PDF tool set.",
    },
    ...(tool
      ? [
          {
            href: `/tools/${tool.slug}`,
            name: tool.name,
            description: "Open the canonical local tool workflow used by this guide or variant page.",
          },
        ]
      : []),
    ...getRelatedPdfToolVariantPages(page.toolSlug, page.modifierSlug, 2).map((entry) => ({
      href: entry.pdfPath,
      name: entry.h1,
      description: "Related use-case page for the same core PDF workflow.",
    })),
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
    if (seen.has(entry.href) || entry.href === page.pdfPath) {
      return false
    }
    seen.add(entry.href)
    return true
  }).slice(0, 8)
}

function buildPrivacyNote(page: PdfToolVariantSeoPage) {
  return [
    `This page keeps the trust model explicit: local browser processing, no upload for the core workflow, and a result you can inspect on-device before it moves into another system. ${page.trustPoints[1] ?? "The core file handling stays on your device."}`,
    "The privacy gain is strongest during the transformation step itself. After download, you still need to review the output carefully before you email it, upload it, archive it, or hand it to another service.",
  ]
}

function buildExplanationBlocks(page: PdfToolVariantSeoPage): ProgrammaticExplanationBlock[] {
  const whyThisExists =
    page.howItWorksParagraphs[2] ??
    "This route exists because the downstream workflow matters as much as the tool action itself. The page is meant to solve the next handoff problem, not just produce a file."

  return [
    {
      title: page.kind === "how-to-guide" ? "Why this guide matters" : "Why this page exists",
      paragraphs: [whyThisExists, page.limitations[0]].filter(Boolean),
    },
    {
      title: "What to review before the file leaves your device",
      paragraphs: [page.limitations[1], page.limitations[2]].filter(Boolean),
    },
    {
      title: "When to move to a related workflow next",
      paragraphs: [
        page.limitations[3],
        "If the constraint changes after this step, stay inside the PDF tools cluster and solve the next problem locally instead of restarting in an upload-first tool.",
      ].filter(Boolean),
    },
  ]
}

function buildProgrammaticWordCount(input: {
  description: string
  explanationBlocks: ProgrammaticExplanationBlock[]
  faq: ProgrammaticFaq[]
  howItWorks: string[]
  howToSteps: ProgrammaticHowToStep[]
  intro: string[]
  privacyNote: string[]
  title: string
  whyUsersNeedThis: string[]
}) {
  return countWords([
    input.title,
    input.description,
    ...input.intro,
    ...input.whyUsersNeedThis,
    ...input.howItWorks,
    ...input.howToSteps.flatMap((step) => [step.name, step.text]),
    ...input.explanationBlocks.flatMap((block) => [block.title, ...block.paragraphs]),
    ...input.privacyNote,
    ...input.faq.flatMap((entry) => [entry.question, entry.answer]),
  ])
}

function buildProgrammaticPageFromVariant(page: PdfToolVariantSeoPage): ProgrammaticPageData | null {
  const tool = getToolBySlug(page.toolSlug)
  if (!tool) return null

  const intro = page.introParagraphs.slice(0, 2)
  const whyUsersNeedThis = page.introParagraphs.slice(2)
  const howItWorks = page.howItWorksParagraphs.slice(0, 2)
  const explanationBlocks = buildExplanationBlocks(page)
  const faq = page.faq.slice(0, 5)
  const privacyNote = buildPrivacyNote(page)
  const howToSteps = page.steps.map((step) => ({
    name: step.title,
    text: step.text,
  }))
  let wordCount = buildProgrammaticWordCount({
    description: page.metaDescription,
    explanationBlocks,
    faq,
    howItWorks,
    howToSteps,
    intro,
    privacyNote,
    title: page.title,
    whyUsersNeedThis,
  })

  if (wordCount < 900 && page.howItWorksParagraphs[2]) {
    howItWorks.push(page.howItWorksParagraphs[2])
    wordCount = buildProgrammaticWordCount({
      description: page.metaDescription,
      explanationBlocks,
      faq,
      howItWorks,
      howToSteps,
      intro,
      privacyNote,
      title: page.title,
      whyUsersNeedThis,
    })
  }

  if (wordCount < 900 && page.faq[5]) {
    faq.push(page.faq[5])
    wordCount = buildProgrammaticWordCount({
      description: page.metaDescription,
      explanationBlocks,
      faq,
      howItWorks,
      howToSteps,
      intro,
      privacyNote,
      title: page.title,
      whyUsersNeedThis,
    })
  }

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
    wordCount,
  }
}

function sortPagesByCategory(pages: PdfToolVariantSeoPage[]) {
  return [
    {
      name: "Platform pages",
      pages: pages.filter((page) => page.category === "platform"),
    },
    {
      name: "Problem and privacy pages",
      pages: pages.filter((page) => page.category === "problem"),
    },
    {
      name: "Workflow pages",
      pages: pages.filter((page) => page.category === "workflow"),
    },
    {
      name: "How-to guides",
      pages: pages.filter((page) => page.category === "guide"),
    },
  ].filter((section) => section.pages.length > 0)
}

export function getPdfVariants(options?: {
  includeAllPdfTools?: boolean
  modifierSlugs?: readonly string[]
  toolSlugs?: readonly string[]
}) {
  const toolSlugSet = new Set(selectToolSlugs(options))
  const modifierSlugSet = options?.modifierSlugs?.length
    ? new Set(options.modifierSlugs)
    : null

  return PDF_VARIANT_PAGES.filter((page) => {
    if (!toolSlugSet.has(page.toolSlug)) return false
    if (modifierSlugSet && !modifierSlugSet.has(page.modifierSlug)) return false
    return true
  }).map((page) => ({
    action: page.toolSlug,
    desc: page.metaDescription,
    title: page.title,
    variant: page.modifierSlug,
  })) satisfies PdfVariantEntry[]
}

export function getPdfToolVariantPage(
  action: string,
  variant: string
): PdfToolVariantSeoPage | null {
  const resolvedVariant = normaliseVariantSlug(variant)
  return PDF_VARIANT_PAGE_MAP.get(`${action}/${resolvedVariant}`) ?? null
}

export function getPdfToolVariantFlatAliasPage(flatSlug: string): PdfToolVariantSeoPage | null {
  return (
    PDF_VARIANT_PAGES.find((page) => page.aliases.includes(flatSlug.toLowerCase().trim())) ?? null
  )
}

export function getPdfToolVariantPagesForTool(toolSlug: string) {
  return PDF_VARIANT_PAGES.filter((page) => page.toolSlug === toolSlug)
}

export function getRelatedPdfToolVariantPages(
  toolSlug: string,
  modifierSlug: string,
  limit = 6
) {
  return PDF_VARIANT_PAGES.filter(
    (page) => page.toolSlug === toolSlug && page.modifierSlug !== modifierSlug
  ).slice(0, limit)
}

export function generatePdfToolVariantStaticParams(options?: {
  includeAllPdfTools?: boolean
  modifierSlugs?: readonly string[]
  toolSlugs?: readonly string[]
}) {
  return getPdfVariants(options).map(({ action, variant }) => ({
    action,
    variant,
  }))
}

export function getPdfToolVariantSitemapPaths(options?: {
  includeAllPdfTools?: boolean
  modifierSlugs?: readonly string[]
  toolSlugs?: readonly string[]
}) {
  return generatePdfToolVariantStaticParams(options).map(({ action, variant }) =>
    buildPdfToolVariantPath(action, variant)
  )
}

export function getPdfToolVariantIndexGroups(options?: {
  includeAllPdfTools?: boolean
  toolSlugs?: readonly string[]
}) {
  return selectToolSlugs(options)
    .map((toolSlug) => {
      const tool = getToolBySlug(toolSlug)
      if (!tool) return null

      const pages = getPdfToolVariantPagesForTool(toolSlug)
      if (pages.length === 0) return null

      return {
        categories: sortPagesByCategory(pages),
        toolDescription: tool.description,
        toolName: tool.name,
        toolSlug,
      } satisfies PdfToolVariantIndexGroup
    })
    .filter(Boolean) as PdfToolVariantIndexGroup[]
}

export function buildPdfVariantMetadata(
  action: string,
  variant: string
): Metadata | null {
  const page = getPdfToolVariantPage(action, variant)
  if (!page) return null

  const metadata = buildPageMetadata({
    title: page.title,
    description: page.metaDescription,
    path: page.pdfPath,
    image: "/og/tools.png",
    googleNotranslate: true,
  })

  return {
    ...metadata,
    keywords: [
      page.title.replace(/ \| Plain Tools$/u, ""),
      page.h1,
      "local browser processing",
      "no upload PDF",
      "PDF tools",
    ],
    robots: {
      index: true,
      follow: true,
    },
  }
}

export function buildPdfVariantProgrammaticBundle(
  action: string,
  variant: string
): PdfVariantProgrammaticBundle | null {
  const seoPage = getPdfToolVariantPage(action, variant)
  if (!seoPage) return null

  const page = buildProgrammaticPageFromVariant(seoPage)
  const metadata = buildPdfVariantMetadata(action, variant)
  if (!page || !metadata) return null

  const schema = combineJsonLd([
    buildWebPageSchema({
      name: seoPage.title,
      description: seoPage.metaDescription,
      url: buildCanonicalUrl(seoPage.pdfPath),
    }),
    buildHowToSchema(`How to use ${seoPage.h1}`, seoPage.metaDescription, page.howToSteps),
  ])

  return {
    metadata,
    page,
    schema,
    seoPage,
  }
}

export const PDF_VARIANT_METADATA_EXAMPLES = [
  ["compress-pdf", "for-email"],
  ["compress-pdf", "under-1mb"],
  ["merge-pdf", "mac"],
  ["compress-pdf", "large-files"],
  ["unlock-pdf", "remove-password"],
  ["compress-pdf", "how-to"],
  ["merge-pdf", "how-to"],
  ["split-pdf", "how-to"],
].flatMap(([action, variant]) => {
  const metadata = buildPdfVariantMetadata(action, variant)
  if (!metadata) return []

  return {
    action,
    metadata,
    variant,
  }
})
