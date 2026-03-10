import { buildMetaDescription } from "@/lib/page-metadata"
import type {
  ProgrammaticExplanationBlock,
  ProgrammaticFaq,
  ProgrammaticHowToStep,
  ProgrammaticPageData,
  ProgrammaticRelatedTool,
} from "@/lib/programmatic-content"
import { getToolBySlug, type ToolDefinition } from "@/lib/tools-catalogue"

export type ProfessionalWorkflowRouteParams = {
  industry: string
  workflow: string
}

type IndustryDefinition = {
  comparePath: string
  docs: string
  keyword: string
  label: string
  nextStep: string
  review: string
  risk: string
  slug: string
}

type WorkflowDefinition = {
  canonicalVariantPath?: string
  faqLead: string
  goal: string
  keyword: string
  problem: string
  relatedToolSlugs: string[]
  slug: string
  title: string
  toolSlug: string
}

export type ProfessionalWorkflowEntry = {
  desc: string
  industry: string
  keywords: string[]
  title: string
  toolSlug: string
  workflow: string
}

export type ProfessionalWorkflowPage = ProfessionalWorkflowEntry & {
  breadcrumbs: Array<{ href?: string; label: string }>
  canonicalPath: string
  featureList: string[]
  heroBadges: string[]
  h1: string
  liveToolDescription: string
  page: ProgrammaticPageData
  relatedLinks: Array<{ href: string; title: string }>
  siloLinks: Array<{ href: string; label: string }>
  wordCount: number
}

const INDUSTRIES: IndustryDefinition[] = [
  { slug: "legal", label: "Legal Teams", keyword: "legal", docs: "contracts, exhibit bundles, and client review copies", risk: "matter files often contain privileged language, signatures, and ID data", nextStep: "court filing, outside counsel review, or client delivery", review: "page order, redactions, signatures, and submission size", comparePath: "/compare/plain-tools-vs-adobe-acrobat-online" },
  { slug: "accounting", label: "Accounting Teams", keyword: "accounting", docs: "invoices, statements, and month-end support packs", risk: "the files mix payment details, customer records, and audit evidence", nextStep: "finance approval, audit support, or reporting", review: "totals, legibility, file size, and record completeness", comparePath: "/compare/plain-tools-vs-pdf24" },
  { slug: "hr", label: "HR Teams", keyword: "hr", docs: "candidate packets, onboarding forms, and signed policies", risk: "HR files carry personal data, compensation details, and signatures", nextStep: "onboarding, employee review, or secure records storage", review: "field values, signatures, metadata, and final record quality", comparePath: "/compare/plain-tools-vs-smallpdf" },
  { slug: "students", label: "Students", keyword: "student", docs: "assignments, scanned notes, and submission PDFs", risk: "student uploads often include ID numbers, grades, and application material", nextStep: "course submission, scholarship upload, or tutor review", review: "legibility, page order, searchable text, and upload readiness", comparePath: "/compare/plain-tools-vs-ilovepdf" },
  { slug: "healthcare-admin", label: "Healthcare Admin", keyword: "healthcare admin", docs: "referral packets, scanned records, and intake forms", risk: "admin records can contain personal health details and operational notes", nextStep: "records administration, clinical review, or secure sharing", review: "readability, OCR quality, orientation, and packet completeness", comparePath: "/compare/plain-tools-vs-sejda" },
  { slug: "government", label: "Government Submissions", keyword: "government submission", docs: "applications, supporting evidence, and signed forms", risk: "submission files often carry identity records and regulated attachments", nextStep: "portal submission, procurement review, or compliance filing", review: "size limits, page count, searchable text, and validation readiness", comparePath: "/compare/plain-tools-vs-smallpdf" },
  { slug: "procurement", label: "Procurement Teams", keyword: "procurement", docs: "vendor packets, tax forms, and signed terms", risk: "supplier files combine commercial terms, tax data, and compliance records", nextStep: "supplier onboarding, approval, or retention", review: "document completeness, signatures, and share-copy quality", comparePath: "/compare/plain-tools-vs-pdfgear" },
  { slug: "real-estate", label: "Real Estate Teams", keyword: "real estate", docs: "lease packets, disclosures, and closing PDFs", risk: "property files contain signatures, addresses, and financial disclosures", nextStep: "client signature, brokerage review, or archive storage", review: "signatures, page order, metadata, and delivery polish", comparePath: "/compare/plain-tools-vs-dochub" },
  { slug: "insurance", label: "Insurance Teams", keyword: "insurance", docs: "claims packets, policy PDFs, and scanned evidence", risk: "claims workflows combine personal details, payment records, and supporting scans", nextStep: "claims handling, adjuster review, or archive storage", review: "OCR quality, page order, file size, and evidence readability", comparePath: "/compare/plain-tools-vs-foxit-pdf" },
  { slug: "consulting", label: "Consulting Teams", keyword: "consulting", docs: "client reports, proposal PDFs, and sign-off copies", risk: "consulting documents often include client strategy, budgets, and internal notes", nextStep: "client delivery, executive review, or scope approval", review: "branding, page consistency, file size, and client-readiness", comparePath: "/compare/plain-tools-vs-pdf24" },
  { slug: "sales", label: "Sales Teams", keyword: "sales", docs: "quotes, order forms, and signed proposal PDFs", risk: "sales files blend pricing, customer details, and signatures", nextStep: "buyer review, signature, or customer delivery", review: "pricing pages, signatures, file size, and final polish", comparePath: "/compare/plain-tools-vs-sodapdf" },
  { slug: "customer-success", label: "Customer Success Teams", keyword: "customer success", docs: "handover packs, onboarding PDFs, and account plans", risk: "customer files include account history, contacts, and contract attachments", nextStep: "customer onboarding, handover, or renewal review", review: "clarity, page order, shared-file size, and team usability", comparePath: "/compare/plain-tools-vs-xodo" },
  { slug: "marketing-ops", label: "Marketing Operations", keyword: "marketing operations", docs: "media kits, campaign proofs, and approval packs", risk: "campaign files can contain unreleased assets and client review comments", nextStep: "campaign approval, partner handoff, or archive packaging", review: "asset quality, orientation, page order, and reviewer fit", comparePath: "/compare/plain-tools-vs-canva-pdf-tools" },
  { slug: "education-admin", label: "Education Admin", keyword: "education administration", docs: "student records, enrollment forms, and board packets", risk: "office files include student identifiers, signatures, and internal review notes", nextStep: "records processing, board review, or secure communication", review: "OCR quality, redaction status, file size, and handoff readiness", comparePath: "/compare/plain-tools-vs-pdfescape" },
  { slug: "construction", label: "Construction Teams", keyword: "construction", docs: "site packs, signed permits, and inspection records", risk: "site files include signatures, addresses, commercial terms, and safety records", nextStep: "permit upload, site approval, or contractor delivery", review: "legibility, orientation, file size, and field usability", comparePath: "/compare/plain-tools-vs-swifdoo-pdf" },
  { slug: "nonprofit", label: "Nonprofit Teams", keyword: "nonprofit", docs: "grant packets, board PDFs, and signed approvals", risk: "nonprofit admin files still include donor data, signatures, and governance records", nextStep: "grant submission, board circulation, or donor delivery", review: "file size, readability, signatures, and external submission readiness", comparePath: "/compare/plain-tools-vs-lightpdf" },
]

const WORKFLOWS: WorkflowDefinition[] = [
  { slug: "compress-shared-pdfs", title: "Compress PDFs", toolSlug: "compress-pdf", keyword: "compress pdf", problem: "oversized attachments or portal limits block the next step", goal: "get the file under the next limit without turning the output into a blurry compromise", faqLead: "file size", canonicalVariantPath: "/pdf-tools/compress-pdf/for-email", relatedToolSlugs: ["merge-pdf", "ocr-pdf", "protect-pdf", "pdf-to-jpg"] },
  { slug: "merge-document-packets", title: "Merge PDF Packets", toolSlug: "merge-pdf", keyword: "merge pdf", problem: "separate files create handoff friction and missed pages", goal: "bundle the right documents into one review-ready PDF without a cloud handoff", faqLead: "packet order", canonicalVariantPath: "/pdf-tools/merge-pdf/mac", relatedToolSlugs: ["split-pdf", "compress-pdf", "rotate-pdf", "protect-pdf"] },
  { slug: "split-large-packets", title: "Split Large PDF Packets", toolSlug: "split-pdf", keyword: "split pdf", problem: "different reviewers need different pages from the same source bundle", goal: "break a large packet into smaller files the next reviewer can actually use", faqLead: "page ranges", canonicalVariantPath: "/pdf-tools/split-pdf/how-to", relatedToolSlugs: ["extract-pdf", "merge-pdf", "rotate-pdf", "compress-pdf"] },
  { slug: "ocr-scanned-records", title: "OCR Scanned Records", toolSlug: "ocr-pdf", keyword: "ocr pdf", problem: "raw scans are unsearchable and painful to review", goal: "turn scanned pages into searchable text without another hosted OCR step", faqLead: "ocr quality", canonicalVariantPath: "/pdf-tools/ocr-pdf/scanned", relatedToolSlugs: ["offline-ocr", "compress-pdf", "pdf-to-word", "metadata-purge"] },
  { slug: "sign-final-copy", title: "Sign the Final PDF Copy", toolSlug: "sign-pdf", keyword: "sign pdf", problem: "the file is ready but still needs a clean signature pass", goal: "apply the signature locally before the document becomes the record copy", faqLead: "signature placement", canonicalVariantPath: "/pdf-tools/sign-pdf/no-upload", relatedToolSlugs: ["fill-pdf", "protect-pdf", "merge-pdf", "compress-pdf"] },
  { slug: "redact-sensitive-details", title: "Redact Sensitive PDF Details", toolSlug: "redact-pdf", keyword: "redact pdf", problem: "the document is shareable only after sensitive text is removed properly", goal: "produce a safer review copy without pushing the original through an upload-first utility", faqLead: "redaction safety", relatedToolSlugs: ["metadata-purge", "protect-pdf", "annotate-pdf", "compare-pdf"] },
  { slug: "protect-shared-copy", title: "Protect the Shared PDF Copy", toolSlug: "protect-pdf", keyword: "protect pdf", problem: "the outgoing file still needs an access control step", goal: "lock the PDF locally so the team controls the password before delivery", faqLead: "password sharing", relatedToolSlugs: ["unlock-pdf", "sign-pdf", "merge-pdf", "fill-pdf"] },
  { slug: "remove-hidden-metadata", title: "Remove Hidden PDF Metadata", toolSlug: "metadata-purge", keyword: "remove pdf metadata", problem: "the visible pages are fine, but hidden fields can still leak context", goal: "ship a cleaner PDF with fewer traces of document history and hidden metadata", faqLead: "metadata cleanup", relatedToolSlugs: ["redact-pdf", "protect-pdf", "sign-pdf", "compare-pdf"] },
  { slug: "rotate-scanned-pages", title: "Rotate Scanned PDF Pages", toolSlug: "rotate-pdf", keyword: "rotate pdf", problem: "camera scans and copier output arrive sideways or upside down", goal: "fix orientation quickly before reviewers or portals reject the file", faqLead: "orientation", canonicalVariantPath: "/pdf-tools/rotate-pdf/iphone", relatedToolSlugs: ["ocr-pdf", "extract-pdf", "compress-pdf", "merge-pdf"] },
  { slug: "extract-key-pages", title: "Extract Key PDF Pages", toolSlug: "extract-pdf", keyword: "extract pdf pages", problem: "the receiving team needs only the important pages", goal: "pull the right pages into a smaller file that is safer and easier to review", faqLead: "page extraction", canonicalVariantPath: "/pdf-tools/extract-pages/how-to", relatedToolSlugs: ["split-pdf", "merge-pdf", "rotate-pdf", "compress-pdf"] },
  { slug: "convert-pdf-to-word", title: "Convert PDF to Editable Word", toolSlug: "pdf-to-word", keyword: "pdf to word", problem: "the next editor needs a working draft rather than a locked PDF", goal: "extract content into an editable file while the sensitive source stays local", faqLead: "editability", canonicalVariantPath: "/pdf-tools/pdf-to-word/no-upload", relatedToolSlugs: ["ocr-pdf", "pdf-to-markdown", "compare-pdf", "word-to-pdf"] },
  { slug: "export-word-to-final-pdf", title: "Export Word to Final PDF", toolSlug: "word-to-pdf", keyword: "word to pdf", problem: "editing is done, but the team needs a stable share copy", goal: "turn the working document into a fixed-layout PDF before submission or signing", faqLead: "layout preservation", canonicalVariantPath: "/pdf-tools/word-to-pdf/how-to", relatedToolSlugs: ["compress-pdf", "sign-pdf", "protect-pdf", "html-to-pdf"] },
  { slug: "compare-document-versions", title: "Compare PDF Versions", toolSlug: "compare-pdf", keyword: "compare pdf", problem: "reviewers need to see what changed before approving the next version", goal: "surface differences locally so the team can approve the right copy faster", faqLead: "version review", relatedToolSlugs: ["annotate-pdf", "merge-pdf", "pdf-to-word", "metadata-purge"] },
  { slug: "watermark-review-drafts", title: "Watermark PDF Review Drafts", toolSlug: "watermark-pdf", keyword: "watermark pdf", problem: "the team needs a review copy that is clearly marked before circulation", goal: "apply a visible draft marker locally so the wrong version is harder to share", faqLead: "draft watermarking", relatedToolSlugs: ["protect-pdf", "sign-pdf", "compress-pdf", "annotate-pdf"] },
  { slug: "fill-standard-forms", title: "Fill Standard PDF Forms", toolSlug: "fill-pdf", keyword: "fill pdf forms", problem: "reusable forms still need a fast no-upload completion workflow", goal: "complete the form locally and export the copy that belongs in the next process", faqLead: "form accuracy", relatedToolSlugs: ["sign-pdf", "protect-pdf", "merge-pdf", "metadata-purge"] },
  { slug: "annotate-review-copy", title: "Annotate the Review Copy", toolSlug: "annotate-pdf", keyword: "annotate pdf", problem: "reviewers need notes and highlights before the document moves onward", goal: "mark up the local copy without opening another upload-and-comment platform", faqLead: "review markup", relatedToolSlugs: ["compare-pdf", "sign-pdf", "fill-pdf", "watermark-pdf"] },
]

const INDUSTRY_MAP = new Map(INDUSTRIES.map((industry) => [industry.slug, industry]))
const WORKFLOW_MAP = new Map(WORKFLOWS.map((workflow) => [workflow.slug, workflow]))

function countWords(values: string[]) {
  return values.join(" ").trim().split(/\s+/).filter(Boolean).length
}

function workflowPath(industry: string, workflow: string) {
  return `/guides/${industry}/${workflow}`
}

function mustGetTool(toolSlug: string) {
  const tool = getToolBySlug(toolSlug)
  if (!tool) throw new Error(`Missing tool ${toolSlug}`)
  return tool
}

function buildEntry(industry: IndustryDefinition, workflow: WorkflowDefinition): ProfessionalWorkflowEntry {
  return {
    desc: buildMetaDescription(`${workflow.title} for ${industry.label.toLowerCase()} with 100% local browser processing, no upload, and privacy-first document handling on Plain Tools.`),
    industry: industry.slug,
    keywords: [`${workflow.keyword} for ${industry.keyword}`, `${workflow.keyword} no upload`, `${industry.keyword} pdf workflow`, "privacy-first pdf tools", "local browser processing"],
    title: `${workflow.title} for ${industry.label} – No Upload, Local Browser | Plain Tools`,
    toolSlug: workflow.toolSlug,
    workflow: workflow.slug,
  }
}

export const PROFESSIONAL_WORKFLOW_MATRIX = INDUSTRIES.flatMap((industry) =>
  WORKFLOWS.map((workflow) => buildEntry(industry, workflow))
)

const WORKFLOW_ENTRY_MAP = new Map(
  PROFESSIONAL_WORKFLOW_MATRIX.map((entry) => [`${entry.industry}/${entry.workflow}`, entry])
)

function intro(tool: ToolDefinition, industry: IndustryDefinition, workflow: WorkflowDefinition) {
  return [
    `${workflow.title} for ${industry.label.toLowerCase()} is usually a live workflow query. People land here when ${workflow.problem}, and the file is already part of ${industry.docs}. The goal is to solve that bottleneck quickly without adding one more upload step halfway through the process.`,
    `That is why Plain Tools leans so hard on local processing. ${industry.risk}. This route pairs the live ${tool.name.toLowerCase()} workspace with intent-specific guidance, so the user gets both the tool and the review context needed before the file moves into ${industry.nextStep}.`,
  ]
}

function why(industry: IndustryDefinition, workflow: WorkflowDefinition) {
  return [
    `${industry.label} do not usually need another generic PDF homepage. They need a route that recognises why ${workflow.problem} matters in their environment and how it affects the next handoff. This page is written around that narrower question.`,
    `A stronger programmatic page is useful because it keeps the explanation anchored to a professional job-to-be-done. Here that means ${workflow.goal}, while still reminding the reader to verify ${industry.review} before treating the output as final.`,
  ]
}

function how(tool: ToolDefinition, industry: IndustryDefinition) {
  return [
    `Open the live ${tool.name.toLowerCase()} panel below with the real working file. Plain Tools keeps the core transformation in the browser, so the document stays on-device during the main step rather than bouncing through an upload-first queue.`,
    `That local workflow is only valuable if the result is ready for the next team. For ${industry.label.toLowerCase()}, the review should focus on ${industry.review}. This page exists to spell that out clearly instead of assuming every workflow ends the moment the download finishes.`,
  ]
}

function steps(industry: IndustryDefinition, workflow: WorkflowDefinition): ProgrammaticHowToStep[] {
  return [
    { name: "Load the real working file", text: `Use the actual document that needs to move into ${industry.nextStep}, not a throwaway sample. That keeps the checks relevant to the real job.` },
    { name: `Run ${workflow.title.toLowerCase()} locally`, text: `Process the file in the browser so the core task happens on-device. That is the privacy-first default when the document contains material ${industry.label.toLowerCase()} handle every day.` },
    { name: "Review the output against the next handoff", text: `Check ${industry.review}. A successful download does not help if the receiving reviewer or portal still rejects the file.` },
    { name: "Move to the next local fix only if needed", text: `If the file still needs OCR, protection, compression, or metadata cleanup, stay inside the related-tools cluster instead of restarting elsewhere.` },
  ]
}

function blocks(industry: IndustryDefinition, workflow: WorkflowDefinition): ProgrammaticExplanationBlock[] {
  return [
    {
      title: `Why ${workflow.title.toLowerCase()} matters in ${industry.label.toLowerCase()}`,
      paragraphs: [
        `${industry.label} work with documents that move across several people and systems. When ${workflow.problem}, the delay rarely stays isolated. It slows down the review, approval, or submission that comes next.`,
        `That is why this page speaks to the downstream outcome rather than only the feature. The target is a file that is easier to trust for ${industry.nextStep}, not just a new download.`,
      ],
    },
    {
      title: "How this page avoids being a thin variant",
      paragraphs: [
        `Useful workflow pages name the document set, the likely failure point, and the review standard for the destination. On this route that means matching ${industry.docs} with guidance built around ${workflow.title.toLowerCase()}.`,
        `The result is a route that feels closer to a hand-written playbook than a recycled tool stub, even though it is powered by a reusable template system.`,
      ],
    },
    {
      title: "What to check before you trust the file",
      paragraphs: [
        `Before the document leaves your device, review ${industry.review}. Those checks are where downstream failures usually show up, especially with scans, signatures, and regulated uploads.`,
        `If the result is close but not ready, use the internal links to handle the next constraint locally. That is a better workflow than pushing the same sensitive file through a second random utility site.`,
      ],
    },
  ]
}

function privacy(industry: IndustryDefinition) {
  return [
    `Plain Tools keeps the trust model simple on this route: 100% local browser processing for the core workflow, no upload, and no account wall before you can act. That matters here because ${industry.risk}.`,
    `Privacy-first does not mean the workflow is complete the second the file downloads. It means the transformation step exposed the document to fewer systems before it entered ${industry.nextStep}.`,
  ]
}

function faq(industry: IndustryDefinition, workflow: WorkflowDefinition, tool: ToolDefinition): ProgrammaticFaq[] {
  return [
    { question: `Can I use ${tool.name.toLowerCase()} for ${industry.label.toLowerCase()} without uploading the file?`, answer: "Yes. This route is built around local browser processing for the core workflow, so the file stays on your device during the main task." },
    { question: `Why is this ${workflow.faqLead} workflow different for ${industry.label.toLowerCase()}?`, answer: `Because the destination matters. ${industry.label} need the result to survive ${industry.nextStep} and to be reviewed against ${industry.review}.` },
    { question: `What should ${industry.label.toLowerCase()} review before sharing the output?`, answer: `Review ${industry.review}. Those checks matter more than a generic “success” message.` },
    { question: "Does this replace the canonical tool page?", answer: "No. The main tool page remains the product-level route. This page narrows the advice for one professional use case and links into the adjacent workflows." },
    { question: `Why emphasize privacy on a ${workflow.keyword} page?`, answer: `Because ${industry.risk}. The privacy angle is part of product fit, not decorative copy.` },
    { question: "What if the file still is not ready?", answer: "Use the related links to move into the next local workflow such as OCR, compression, protection, metadata cleanup, or comparison rather than restarting elsewhere." },
  ]
}

function relatedTools(workflow: WorkflowDefinition): ProgrammaticRelatedTool[] {
  return workflow.relatedToolSlugs
    .map((slug) => getToolBySlug(slug))
    .filter((tool): tool is ToolDefinition => Boolean(tool))
    .slice(0, 6)
    .map((tool) => ({ description: tool.description, href: `/tools/${tool.slug}`, name: tool.name }))
}

function relatedLinks(industry: IndustryDefinition, workflow: WorkflowDefinition) {
  const siblingWorkflows = WORKFLOWS.filter((entry) => entry.slug !== workflow.slug)
    .filter((entry) => entry.toolSlug === workflow.toolSlug || workflow.relatedToolSlugs.includes(entry.toolSlug))
    .slice(0, 4)
    .map((entry) => ({ href: workflowPath(industry.slug, entry.slug), title: `${entry.title} for ${industry.label}` }))
  const crossIndustry = INDUSTRIES.filter((entry) => entry.slug !== industry.slug)
    .slice(0, 2)
    .map((entry) => ({ href: workflowPath(entry.slug, workflow.slug), title: `${workflow.title} for ${entry.label}` }))
  const support = [
    { href: `/tools/${workflow.toolSlug}`, title: `Open ${mustGetTool(workflow.toolSlug).name}` },
    { href: "/pdf-tools", title: "Browse PDF tools" },
    { href: industry.comparePath, title: "Read the closest privacy comparison" },
    ...(workflow.canonicalVariantPath ? [{ href: workflow.canonicalVariantPath, title: "Open the matching PDF variant" }] : []),
  ]

  return [...siblingWorkflows, ...crossIndustry, ...support]
    .filter((link, index, links) => links.findIndex((entry) => entry.href === link.href) === index)
    .slice(0, 10)
}

export function getProfessionalWorkflowPage(industrySlug: string, workflowSlug: string): ProfessionalWorkflowPage | null {
  const entry = WORKFLOW_ENTRY_MAP.get(`${industrySlug}/${workflowSlug}`)
  if (!entry) return null

  const industry = INDUSTRY_MAP.get(industrySlug)
  const workflow = WORKFLOW_MAP.get(workflowSlug)
  if (!industry || !workflow) return null

  const tool = mustGetTool(entry.toolSlug)
  const canonicalPath = workflowPath(industry.slug, workflow.slug)
  const introCopy = intro(tool, industry, workflow)
  const whyCopy = why(industry, workflow)
  const howCopy = how(tool, industry)
  const stepCopy = steps(industry, workflow)
  const blockCopy = blocks(industry, workflow)
  const privacyCopy = privacy(industry)
  const faqCopy = faq(industry, workflow, tool)
  const wordCount = countWords([
    entry.title,
    entry.desc,
    ...introCopy,
    ...whyCopy,
    ...howCopy,
    ...stepCopy.flatMap((step) => [step.name, step.text]),
    ...blockCopy.flatMap((block) => [block.title, ...block.paragraphs]),
    ...privacyCopy,
    ...faqCopy.flatMap((item) => [item.question, item.answer]),
  ])

  if (wordCount < 800) {
    throw new Error(`Workflow page ${canonicalPath} is below 800 words (${wordCount}).`)
  }

  return {
    ...entry,
    breadcrumbs: [
      { href: "/", label: "Home" },
      { href: "/learn", label: "Learn" },
      { label: industry.label },
      { label: workflow.title },
    ],
    canonicalPath,
    featureList: [
      `${workflow.title} in a browser-first workflow for ${industry.label.toLowerCase()}`,
      "100% local processing for the core document step",
      "No upload, no account gate, and task-specific review guidance",
      "Strong internal links into adjacent PDF tools, variants, and comparisons",
    ],
    heroBadges: ["professional workflow", "100% local", "no upload", "privacy-first"],
    h1: `${workflow.title} for ${industry.label}`,
    liveToolDescription: `Use the live ${tool.name.toLowerCase()} workspace below for ${industry.label.toLowerCase()}. The core workflow stays local in the browser, so the file never needs to leave your device for the main task.`,
    page: {
      canonicalPath,
      description: entry.desc,
      explanationBlocks: blockCopy,
      faq: faqCopy,
      howItWorks: howCopy,
      howToSteps: stepCopy,
      intro: introCopy,
      paramLabel: industry.label,
      paramSlug: `${industry.slug}-${workflow.slug}`,
      privacyNote: privacyCopy,
      relatedTools: relatedTools(workflow),
      title: entry.title,
      tool,
      whyUsersNeedThis: whyCopy,
      wordCount,
    },
    relatedLinks: relatedLinks(industry, workflow),
    siloLinks: [
      { href: `/tools/${tool.slug}`, label: `Open ${tool.name}` },
      { href: "/pdf-tools", label: "Browse PDF tools" },
      { href: industry.comparePath, label: "Read the closest privacy comparison" },
      ...(workflow.canonicalVariantPath ? [{ href: workflow.canonicalVariantPath, label: "Open the matching PDF variant" }] : []),
    ],
    wordCount,
  }
}

export function generateAllProfessionalWorkflowParams(limit?: number): ProfessionalWorkflowRouteParams[] {
  const entries = typeof limit === "number" ? PROFESSIONAL_WORKFLOW_MATRIX.slice(0, limit) : PROFESSIONAL_WORKFLOW_MATRIX
  return entries.map((entry) => ({ industry: entry.industry, workflow: entry.workflow }))
}

export function getProfessionalWorkflowSitemapPaths() {
  return PROFESSIONAL_WORKFLOW_MATRIX.map((entry) => workflowPath(entry.industry, entry.workflow))
}

export function getRelatedProfessionalWorkflowLinks(industry: string, workflow: string) {
  return getProfessionalWorkflowPage(industry, workflow)?.relatedLinks ?? []
}

export const PROFESSIONAL_WORKFLOW_METADATA_EXAMPLES = [
  getProfessionalWorkflowPage("legal", "compress-shared-pdfs"),
  getProfessionalWorkflowPage("accounting", "merge-document-packets"),
  getProfessionalWorkflowPage("hr", "sign-final-copy"),
].filter((entry): entry is ProfessionalWorkflowPage => Boolean(entry)).map((entry) => ({
  description: entry.desc,
  path: entry.canonicalPath,
  title: entry.title,
}))
