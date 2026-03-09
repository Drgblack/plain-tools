import { buildMetaDescription } from "@/lib/page-metadata"
import { getToolBySlug } from "@/lib/tools-catalogue"

type ToolVariantFaq = {
  question: string
  answer: string
}

type ToolVariantStep = {
  title: string
  text: string
}

export type ToolModifierDefinition = {
  slug: string
  label: string
  h1Label: string
  titleLabel: string
  userNeed: string
  whyItMatters: string
  privacyAngle: string
  workflowAdvice: string
  limitationAngle: string
  querySeed: string
}

type ToolVariantToolDefinition = {
  toolSlug: string
  baseAction: string
  introUseCase: string
  privacyUseCase: string
  outcome: string
  idealDocuments: string
  stepNouns: [string, string, string, string, string]
  limitations: [string, string, string, string]
  relatedTools: string[]
  relatedGuides: string[]
  modifierSlugs: string[]
}

export type ToolVariantPageDefinition = {
  slug: string
  path: string
  toolSlug: string
  modifierSlug: string
  title: string
  metaDescription: string
  h1: string
  introParagraphs: string[]
  howItWorksParagraphs: string[]
  steps: ToolVariantStep[]
  limitations: string[]
  faq: ToolVariantFaq[]
  relatedToolSlugs: string[]
  relatedGuidePaths: string[]
  trustPoints: string[]
  ctaText: string
  wordCount: number
}

const DEVICE_MODIFIERS = ["mac", "windows", "iphone", "android"] as const
const PRIVACY_MODIFIERS = [
  "offline",
  "securely",
  "without-software",
  "free",
  "no-upload",
] as const
const DELIVERY_MODIFIERS = [
  "for-email",
  "under-1mb",
  "for-whatsapp",
  "for-upload",
] as const
const WORKFLOW_MODIFIERS = [
  "batch",
  "large-files",
  "for-sharing",
  "for-records",
  "for-contracts",
  "for-resumes",
  "for-forms",
  "for-review",
  "quick-fix",
  "for-archive",
] as const

const TOOL_MODIFIERS: ToolModifierDefinition[] = [
  {
    slug: "for-email",
    label: "for email",
    h1Label: "for Email",
    titleLabel: "for Email",
    userNeed: "get the file into an inbox-friendly shape without a second round of edits",
    whyItMatters:
      "mail gateways, attachment caps, and rushed approval loops often turn a simple document task into back-and-forth friction",
    privacyAngle:
      "email attachments often contain contracts, invoices, CVs, or forms that you may not want to hand to an upload service first",
    workflowAdvice:
      "focus on a result that is small enough to send and still readable on the first pass",
    limitationAngle:
      "always open the final file before sending so you do not discover layout damage after the email has gone out",
    querySeed: "for email",
  },
  {
    slug: "under-1mb",
    label: "under 1 MB",
    h1Label: "Under 1 MB",
    titleLabel: "Under 1 MB",
    userNeed: "hit a strict file-size threshold for a form, portal, or admin workflow",
    whyItMatters:
      "some systems fail hard on attachment limits and do not tell you what trade-offs will be needed to get under the cap",
    privacyAngle:
      "when the file contains personal or regulated material, shrinking it locally is a safer starting point than trying random upload tools",
    workflowAdvice:
      "check both size and legibility because the smallest output is not always the most usable one",
    limitationAngle:
      "some heavily scanned files may need a compromise between size target and on-page clarity",
    querySeed: "under 1mb",
  },
  {
    slug: "for-whatsapp",
    label: "for WhatsApp",
    h1Label: "for WhatsApp",
    titleLabel: "for WhatsApp",
    userNeed: "make the file easy to share in a mobile-first messaging workflow",
    whyItMatters:
      "messaging routes are fast, informal, and often used when the document still contains personal or internal information",
    privacyAngle:
      "a local browser workflow reduces the number of extra services touching the file before you send it to the intended recipient",
    workflowAdvice:
      "optimise for quick delivery, readable previews, and a file that still makes sense on a phone screen",
    limitationAngle:
      "messaging apps can still compress previews or handle attachments differently, so test the output on a mobile device if it matters",
    querySeed: "for whatsapp",
  },
  {
    slug: "for-upload",
    label: "for upload",
    h1Label: "for Upload",
    titleLabel: "for Upload",
    userNeed: "prepare the file so it passes a portal or form submission first time",
    whyItMatters:
      "job portals, vendor systems, student systems, and claim forms often reject files without much explanation",
    privacyAngle:
      "preparing the file locally lets you fix format, size, or structure before you decide where it should be uploaded",
    workflowAdvice:
      "treat the result as a submission copy and keep the original separate in case the portal later needs a cleaner source file",
    limitationAngle:
      "always check the destination system rules because some portals validate page count, naming, or format as well as size",
    querySeed: "for upload",
  },
  {
    slug: "mac",
    label: "on Mac",
    h1Label: "on Mac",
    titleLabel: "on Mac",
    userNeed: "finish the task in Safari, Chrome, or another macOS browser without installing a heavyweight desktop suite",
    whyItMatters:
      "many people just want a browser route that works on a MacBook and does not send them into a native-app detour",
    privacyAngle:
      "keeping the workflow in-browser and local is especially useful when the Mac already holds the source file and you do not want to add a cloud hand-off",
    workflowAdvice:
      "review the output in Preview or your usual browser viewer once the local processing finishes",
    limitationAngle:
      "older Macs can still struggle with large, image-heavy files because the work happens in local browser memory",
    querySeed: "mac",
  },
  {
    slug: "windows",
    label: "on Windows",
    h1Label: "on Windows",
    titleLabel: "on Windows",
    userNeed: "complete the job in Edge, Chrome, or Firefox without a desktop PDF suite",
    whyItMatters:
      "Windows users often bounce between installed software prompts, upload tools, and office workflows when the task should really be simple",
    privacyAngle:
      "a browser-local route lets you keep the source file on the same device instead of passing it through another service first",
    workflowAdvice:
      "open the output in your normal PDF or document viewer to confirm page order, fonts, and exported structure",
    limitationAngle:
      "low-memory Windows devices can still slow down on very large or scanned source files",
    querySeed: "windows",
  },
  {
    slug: "iphone",
    label: "on iPhone",
    h1Label: "on iPhone",
    titleLabel: "on iPhone",
    userNeed: "finish the task from a phone when you do not have a laptop nearby",
    whyItMatters:
      "mobile users often need a quick one-off fix for a form, scan, or share copy while moving between apps",
    privacyAngle:
      "processing the core workflow locally in the mobile browser is often preferable to sending a personal document through a random app",
    workflowAdvice:
      "keep the input small, stay on a stable connection long enough to load the tool, and review the output before sharing from mobile",
    limitationAngle:
      "phone browsers have tighter memory limits, so very large files can require a desktop fallback",
    querySeed: "iphone",
  },
  {
    slug: "android",
    label: "on Android",
    h1Label: "on Android",
    titleLabel: "on Android",
    userNeed: "run the task from a phone without switching to a desktop workflow",
    whyItMatters:
      "many people only discover file-format issues when a mobile upload or share attempt fails",
    privacyAngle:
      "a local browser route avoids installing another app or sending the file to a remote service before you know the result is usable",
    workflowAdvice:
      "keep the workflow focused on one clear output and download the result to local storage before you move to the next app",
    limitationAngle:
      "mobile RAM and browser constraints still matter, particularly for long PDFs and image-heavy files",
    querySeed: "android",
  },
  {
    slug: "offline",
    label: "offline",
    h1Label: "Offline",
    titleLabel: "Offline",
    userNeed: "reduce dependence on a cloud workflow and keep the core task on the device already holding the file",
    whyItMatters:
      "people search for offline routes when they are travelling, working on unstable connections, or avoiding upload steps on principle",
    privacyAngle:
      "local processing is closest to the privacy question users are usually asking when they add terms like offline or local",
    workflowAdvice:
      "load the page, keep the session stable, and treat the output as something to review before sharing externally",
    limitationAngle:
      "true offline use depends on the browser already having the page assets available and enough memory for the local job",
    querySeed: "offline",
  },
  {
    slug: "securely",
    label: "securely",
    h1Label: "Securely",
    titleLabel: "Securely",
    userNeed: "complete the task with fewer third parties touching the document or file content",
    whyItMatters:
      "security-focused searches usually come from people handling agreements, HR records, finance files, or internal material",
    privacyAngle:
      "the safest realistic starting point is often to avoid a server upload for the core processing step whenever that is genuinely possible",
    workflowAdvice:
      "treat the final output as part of a wider secure workflow that still includes review, storage decisions, and careful sharing",
    limitationAngle:
      "local processing reduces one class of risk but it does not encrypt, classify, or govern the file after download unless the tool itself does that",
    querySeed: "securely",
  },
  {
    slug: "without-software",
    label: "without software",
    h1Label: "Without Software",
    titleLabel: "Without Software",
    userNeed: "finish the job in a browser without installing a desktop app or extension",
    whyItMatters:
      "people often search this way when they are on a locked-down device, using a shared machine, or simply want the task done immediately",
    privacyAngle:
      "using one browser tab for the core local workflow avoids both software installation friction and unnecessary cloud hand-offs",
    workflowAdvice:
      "keep the route simple: load the tool, process the file, review the output, and close the session when you are done",
    limitationAngle:
      "very advanced editing still sometimes needs a desktop workflow, so use the browser tool for the practical task it actually solves",
    querySeed: "without software",
  },
  {
    slug: "free",
    label: "free",
    h1Label: "Free",
    titleLabel: "Free",
    userNeed: "solve the problem without paying for a full PDF or file suite when the task is routine and specific",
    whyItMatters:
      "many utility searches include free because people need one outcome now, not a long procurement decision or sign-up flow",
    privacyAngle:
      "a free browser tool still needs to be clear about privacy, so this route explains the local-processing angle rather than hiding it",
    workflowAdvice:
      "treat the page as a practical one-task workflow and review the output before you replace the source file",
    limitationAngle:
      "free does not mean unlimited magic; large, damaged, or highly complex files may still require manual checking",
    querySeed: "free",
  },
  {
    slug: "no-upload",
    label: "with no upload",
    h1Label: "No Upload",
    titleLabel: "No Upload",
    userNeed: "avoid sending the file to a remote server just to finish a straightforward processing task",
    whyItMatters:
      "this modifier usually signals a trust question rather than a feature question, especially for PDFs that contain personal or regulated data",
    privacyAngle:
      "Plain Tools is strongest when the core workflow can stay on the device, so the page makes that explicit and points to verification steps",
    workflowAdvice:
      "open DevTools if you want proof, then run the task and confirm no file bytes are being posted during the local path",
    limitationAngle:
      "no-upload for the core workflow still does not remove the need to handle the downloaded result carefully afterward",
    querySeed: "no upload",
  },
  {
    slug: "batch",
    label: "in batch",
    h1Label: "in Batch",
    titleLabel: "in Batch",
    userNeed: "repeat the same workflow across several files without turning the task into a manual grind",
    whyItMatters:
      "batch work is where small inefficiencies compound, especially in admin, records, and content-prep routines",
    privacyAngle:
      "a local route matters more when there are many source files because upload-based tools multiply both time and exposure",
    workflowAdvice:
      "work in sensible batches and review a sample output early before committing the whole set",
    limitationAngle:
      "large multi-file jobs can still run into local memory and browser-session limits, so split the work when needed",
    querySeed: "batch",
  },
  {
    slug: "scanned",
    label: "for scanned files",
    h1Label: "for Scanned Files",
    titleLabel: "for Scanned Files",
    userNeed: "handle image-based PDFs or documents that behave differently from clean digital originals",
    whyItMatters:
      "scanned files are usually larger, heavier, and less predictable, so they deserve different expectations from digital-text PDFs",
    privacyAngle:
      "scans often contain ID documents, forms, medical letters, or signed records, so keeping the core handling local can matter more",
    workflowAdvice:
      "expect to review page clarity, legibility, and text quality after processing rather than assuming the first output is final",
    limitationAngle:
      "image-based sources may need OCR, lighter batching, or a second pass if the first output is still heavy or hard to read",
    querySeed: "scanned",
  },
  {
    slug: "password-protected",
    label: "for password-protected files",
    h1Label: "for Password-Protected Files",
    titleLabel: "for Password-Protected Files",
    userNeed: "work with a file that already has access protection or needs protection as part of the workflow",
    whyItMatters:
      "people often search this when they are dealing with sensitive documents and want to avoid breaking the protection chain by accident",
    privacyAngle:
      "a privacy-first workflow should explain clearly where password handling belongs and where another tool or extra step is still needed",
    workflowAdvice:
      "confirm whether the file must be unlocked first, processed next, and re-protected afterward before you send the final copy on",
    limitationAngle:
      "not every tool can directly process a protected source file, so the page explains when an unlock or protect step belongs before or after the main task",
    querySeed: "password protected",
  },
  {
    slug: "large-files",
    label: "for large files",
    h1Label: "for Large Files",
    titleLabel: "for Large Files",
    userNeed: "process oversized documents without guessing whether the browser can realistically cope",
    whyItMatters:
      "large files are where local workflows save upload time, but they are also where memory limits and failed attempts show up fastest",
    privacyAngle:
      "when the document is both large and sensitive, keeping the main processing step local is often worth the extra care",
    workflowAdvice:
      "work in smaller chunks when necessary and review intermediate outputs instead of assuming one run will always be the cleanest path",
    limitationAngle:
      "some image-heavy sources will still push browser memory or CPU limits, especially on phones and older laptops",
    querySeed: "large files",
  },
  {
    slug: "for-archive",
    label: "for archive copies",
    h1Label: "for Archive Copies",
    titleLabel: "for Archive Copies",
    userNeed: "prepare a stable copy for storage, handover, or recordkeeping",
    whyItMatters:
      "archive workflows need clarity and completeness more than flashy editing features",
    privacyAngle:
      "keeping the preparation local is often preferable when the file will later move into a controlled storage or records system",
    workflowAdvice:
      "review page order, naming, readability, and searchability before you treat the result as a long-term copy",
    limitationAngle:
      "if the archive process has strict metadata or retention rules, you may still need one extra system-specific step afterwards",
    querySeed: "for archive",
  },
  {
    slug: "for-sharing",
    label: "for sharing",
    h1Label: "for Sharing",
    titleLabel: "for Sharing",
    userNeed: "produce an output that is easier to send, review, or hand over to another person",
    whyItMatters:
      "shared files need to open cleanly on someone else’s device, not just on your own machine",
    privacyAngle:
      "local preparation lets you decide what gets shared before the document ever leaves your device",
    workflowAdvice:
      "review the final file as a recipient would, then send the processed copy rather than the raw source set",
    limitationAngle:
      "sharing-friendly does not automatically mean secure; protect or redact the output separately if the contents require it",
    querySeed: "for sharing",
  },
  {
    slug: "for-records",
    label: "for records",
    h1Label: "for Records",
    titleLabel: "for Records",
    userNeed: "prepare a document so it is easier to retain, search, or hand over internally",
    whyItMatters:
      "records workflows reward predictable outputs and careful review more than complex editing",
    privacyAngle:
      "record copies often contain personal, operational, or regulated data, so local processing can be the more sensible first step",
    workflowAdvice:
      "make the result tidy, reviewable, and easy to file before it enters the wider records process",
    limitationAngle:
      "records rules vary by organisation, so naming, classification, and storage controls may still sit outside the browser tool itself",
    querySeed: "for records",
  },
  {
    slug: "for-contracts",
    label: "for contracts",
    h1Label: "for Contracts",
    titleLabel: "for Contracts",
    userNeed: "handle an agreement or legal-style document without sending it through a generic file service first",
    whyItMatters:
      "contract workflows are usually sensitive, version-heavy, and review-driven",
    privacyAngle:
      "the less unnecessary copying and uploading involved in the core task, the easier it is to preserve a sensible chain of handling",
    workflowAdvice:
      "review the output carefully for page order, signatures, converted clauses, and final readability before external circulation",
    limitationAngle:
      "this is still a utility workflow rather than a legal review system, so final sign-off remains your responsibility",
    querySeed: "for contracts",
  },
  {
    slug: "for-resumes",
    label: "for CVs and resumes",
    h1Label: "for CVs and Resumes",
    titleLabel: "for CVs and Resumes",
    userNeed: "prepare an application document that is small enough, neat enough, and easy to upload",
    whyItMatters:
      "job application systems can be strict about size, format, or document count, and users usually want a clean fix quickly",
    privacyAngle:
      "CVs, resumes, and cover materials often carry full contact and work-history details, so local handling is a practical privacy benefit",
    workflowAdvice:
      "treat the final output as a submission copy and check that formatting still looks professional before you upload it",
    limitationAngle:
      "always keep the original source document so you can tailor future applications without quality loss",
    querySeed: "for resumes",
  },
  {
    slug: "for-forms",
    label: "for forms",
    h1Label: "for Forms",
    titleLabel: "for Forms",
    userNeed: "turn a document into something easier to fill, submit, or return without needless friction",
    whyItMatters:
      "forms are usually time-sensitive and often fail because of small format or page-order issues rather than big technical problems",
    privacyAngle:
      "forms often contain personal data, so a local route is a better starting point than an upload-first workflow",
    workflowAdvice:
      "review whether the output preserved fields, page order, and readability before you treat it as a submission-ready copy",
    limitationAngle:
      "interactive form behaviour varies, so some files still need a quick manual check or an extra export after editing",
    querySeed: "for forms",
  },
  {
    slug: "for-screenshots",
    label: "for screenshots",
    h1Label: "for Screenshots",
    titleLabel: "for Screenshots",
    userNeed: "produce image output that works well in chat, documentation, tickets, or visual review",
    whyItMatters:
      "screenshot-oriented work is usually about speed and clarity rather than full-document fidelity",
    privacyAngle:
      "creating the share copy locally lets you decide which pages or views leave your device",
    workflowAdvice:
      "choose the smallest useful output and check readability on the destination screen before you send it",
    limitationAngle:
      "image exports can lose text-search and document structure, so keep the source file if you may need it later",
    querySeed: "for screenshots",
  },
  {
    slug: "searchable",
    label: "searchable",
    h1Label: "Searchable",
    titleLabel: "Searchable",
    userNeed: "turn a file into something easier to search, quote, or reuse later",
    whyItMatters:
      "searchability is often the dividing line between a file that can sit in a records workflow and one that stays awkward to use",
    privacyAngle:
      "making a file searchable locally is especially useful when the source contains names, IDs, or internal records",
    workflowAdvice:
      "verify the searchable output with a few representative words rather than assuming OCR or extraction worked perfectly",
    limitationAngle:
      "searchable results still depend on source quality, scan contrast, language mix, and layout complexity",
    querySeed: "searchable",
  },
  {
    slug: "for-review",
    label: "for review",
    h1Label: "for Review",
    titleLabel: "for Review",
    userNeed: "create an output that is easier for another person to inspect, comment on, or compare",
    whyItMatters:
      "review routes should reduce friction and keep the document understandable rather than optimising only for technical neatness",
    privacyAngle:
      "local preparation helps you decide exactly what version to send out for review before it leaves your device",
    workflowAdvice:
      "produce the cleanest review copy you can, then keep the source file and any editable version separate",
    limitationAngle:
      "review-ready does not necessarily mean final; the output may still need another pass after comments come back",
    querySeed: "for review",
  },
  {
    slug: "quick-fix",
    label: "quick fix",
    h1Label: "Quick Fix",
    titleLabel: "Quick Fix",
    userNeed: "solve the immediate problem in one browser session without turning the task into a mini project",
    whyItMatters:
      "many searches happen under time pressure, and users need a direct route rather than a generic feature list",
    privacyAngle:
      "a quick local workflow is often both faster and easier to trust than a detour through upload queues and account prompts",
    workflowAdvice:
      "treat the output as a practical fix, then keep the original file nearby in case you later need a cleaner or more detailed workflow",
    limitationAngle:
      "quick does not remove the need for a final check; page order, size, readability, or field behaviour can still need a glance",
    querySeed: "quick fix",
  },
]

const TOOL_VARIANT_TOOLS: ToolVariantToolDefinition[] = [
  {
    toolSlug: "compress-pdf",
    baseAction: "Compress PDF",
    introUseCase: "reduce oversized PDFs for email, uploads, record sharing, and everyday admin hand-offs",
    privacyUseCase: "private reports, invoices, application packs, and scanned paperwork",
    outcome: "a smaller PDF that is easier to send or store",
    idealDocuments: "scanned statements, exported reports, application files, forms, and share copies",
    stepNouns: ["add the source PDF", "choose the compression path", "run the local reduction", "review the output", "download the smaller copy"],
    limitations: [
      "Aggressive compression can soften images and scanned text.",
      "Very large scans may still stay relatively heavy even after a local pass.",
      "Interactive form features can behave differently once the file is resaved.",
      "You should always compare the output against the original before deleting the source.",
    ],
    relatedTools: ["merge-pdf", "split-pdf", "pdf-to-word", "ocr-pdf", "protect-pdf"],
    relatedGuides: [
      "/learn/compress-pdf-without-upload",
      "/learn/why-offline-compression-has-limits",
      "/verify-claims",
    ],
    modifierSlugs: [
      ...DEVICE_MODIFIERS,
      ...PRIVACY_MODIFIERS,
      ...DELIVERY_MODIFIERS,
      ...WORKFLOW_MODIFIERS,
      "scanned",
    ],
  },
  {
    toolSlug: "merge-pdf",
    baseAction: "Merge PDF",
    introUseCase: "combine related PDFs into one cleaner document for review, sending, or filing",
    privacyUseCase: "contracts, evidence packs, statements, and internal document bundles",
    outcome: "one ordered PDF instead of a loose file set",
    idealDocuments: "application packs, monthly reports, signed forms, claim bundles, and case documents",
    stepNouns: ["add the PDFs", "arrange the order", "merge locally", "check the sequence", "download the combined file"],
    limitations: [
      "Page order mistakes are still easy to make if you rush the setup.",
      "Large image-heavy bundles can push browser memory on lower-power devices.",
      "Bookmarks and advanced source metadata may not carry over exactly as before.",
      "Always open the merged file once before sending it to anyone else.",
    ],
    relatedTools: ["split-pdf", "reorder-pdf", "compress-pdf", "compare-pdf", "protect-pdf"],
    relatedGuides: [
      "/learn/how-to-merge-pdfs-offline",
      "/learn/how-to-verify-a-pdf-tool-doesnt-upload-your-files",
      "/verify-claims",
    ],
    modifierSlugs: [
      ...DEVICE_MODIFIERS,
      ...PRIVACY_MODIFIERS,
      "for-upload",
      "for-sharing",
      "for-records",
      "for-contracts",
      "for-resumes",
      "for-forms",
      "for-review",
      "quick-fix",
      "for-archive",
      "large-files",
      "batch",
      "password-protected",
    ],
  },
  {
    toolSlug: "split-pdf",
    baseAction: "Split PDF",
    introUseCase: "separate the pages you need without exporting the whole document elsewhere",
    privacyUseCase: "long reports, form packs, case files, and source documents with pages you do not want to share",
    outcome: "smaller PDFs cut to the pages that matter",
    idealDocuments: "multi-page reports, claim files, application packs, archived scans, and attachments",
    stepNouns: ["add the PDF", "set the page ranges", "split locally", "check the extracted outputs", "download the pieces you need"],
    limitations: [
      "It is easy to choose the wrong range if the source page numbering is confusing.",
      "Very long scans can make previewing and range selection slower on older devices.",
      "Split outputs should be checked to ensure no essential appendix or cover page was missed.",
      "Protected source files may need an unlock step before splitting is possible.",
    ],
    relatedTools: ["merge-pdf", "extract-pdf", "reorder-pdf", "compare-pdf", "protect-pdf"],
    relatedGuides: [
      "/learn/how-to-split-a-pdf-by-pages",
      "/learn/how-to-extract-pages-from-a-pdf",
      "/verify-claims",
    ],
    modifierSlugs: [
      ...DEVICE_MODIFIERS,
      ...PRIVACY_MODIFIERS,
      "for-upload",
      "for-sharing",
      "for-records",
      "for-contracts",
      "for-resumes",
      "for-forms",
      "for-review",
      "quick-fix",
      "for-archive",
      "large-files",
      "batch",
      "password-protected",
    ],
  },
  {
    toolSlug: "pdf-to-word",
    baseAction: "PDF to Word",
    introUseCase: "turn a fixed PDF into a document you can edit, reuse, or hand back for revision",
    privacyUseCase: "agreements, reports, policy files, CVs, and internal drafts",
    outcome: "an editable Word file for practical follow-up work",
    idealDocuments: "contracts, CVs, applications, simple reports, and editable working copies",
    stepNouns: ["add the PDF", "start the conversion", "download the DOCX", "review the layout", "save the working copy separately"],
    limitations: [
      "Complex layouts, tables, and scanned pages may not convert perfectly.",
      "Converted headings and bullets should always be checked before you reuse the file.",
      "Password-protected sources may require an unlock step before conversion.",
      "Keep the original PDF so you can compare the editable copy against the source.",
    ],
    relatedTools: ["word-to-pdf", "ocr-pdf", "compare-pdf", "protect-pdf", "merge-pdf"],
    relatedGuides: [
      "/learn/what-happens-when-you-upload-a-pdf",
      "/learn/how-to-verify-a-pdf-tool-doesnt-upload-your-files",
      "/verify-claims",
    ],
    modifierSlugs: [
      ...DEVICE_MODIFIERS,
      ...PRIVACY_MODIFIERS,
      ...DELIVERY_MODIFIERS,
      "scanned",
      "password-protected",
      "large-files",
      "for-records",
      "for-contracts",
      "for-resumes",
      "for-forms",
      "for-review",
      "quick-fix",
      "searchable",
      "for-archive",
    ],
  },
  {
    toolSlug: "word-to-pdf",
    baseAction: "Word to PDF",
    introUseCase: "finalise editable documents into a cleaner file for sharing, upload, or sign-off",
    privacyUseCase: "resumes, contracts, policies, proposals, and internal handover files",
    outcome: "a portable PDF that is easier to submit or share",
    idealDocuments: "CVs, contracts, letters, proposals, forms, and archive copies",
    stepNouns: ["add the Word file", "run the conversion", "download the PDF", "check page flow and fonts", "use the result as the share copy"],
    limitations: [
      "Fonts, tables, and pagination can still shift depending on the source file structure.",
      "Very large Word files may take longer to convert on older devices.",
      "Submission systems can still reject a PDF for reasons unrelated to conversion quality.",
      "Keep the original DOCX so you can make edits without reworking the PDF.",
    ],
    relatedTools: ["pdf-to-word", "protect-pdf", "sign-pdf", "compress-pdf", "merge-pdf"],
    relatedGuides: [
      "/learn/workflows/password-protect-pdf-before-emailing",
      "/learn/no-uploads-explained",
      "/verify-claims",
    ],
    modifierSlugs: [
      ...DEVICE_MODIFIERS,
      ...PRIVACY_MODIFIERS,
      ...DELIVERY_MODIFIERS,
      "batch",
      "large-files",
      "for-records",
      "for-contracts",
      "for-resumes",
      "for-forms",
      "for-review",
      "quick-fix",
      "for-archive",
    ],
  },
  {
    toolSlug: "pdf-to-jpg",
    baseAction: "PDF to JPG",
    introUseCase: "turn PDF pages into image outputs for previews, tickets, chat, or quick review",
    privacyUseCase: "internal review pages, statement snapshots, and share copies that should stay under your control until ready",
    outcome: "JPG images derived from the relevant PDF pages",
    idealDocuments: "slides, brochures, application pages, form screenshots, and visual review packs",
    stepNouns: ["add the PDF", "choose the pages you need", "export the images locally", "review image clarity", "download the JPG files"],
    limitations: [
      "Image export removes text search and some document structure.",
      "Very long PDFs can generate a large number of output files quickly.",
      "Low-resolution settings may make small text harder to read on mobile.",
      "Keep the original PDF if you may need searchable or printable output later.",
    ],
    relatedTools: ["jpg-to-pdf", "image-compress", "pdf-to-word", "compare-pdf", "compress-pdf"],
    relatedGuides: ["/learn/how-pdfs-work", "/learn/no-uploads-explained", "/verify-claims"],
    modifierSlugs: [
      ...DEVICE_MODIFIERS,
      ...PRIVACY_MODIFIERS,
      "for-email",
      "for-whatsapp",
      "for-upload",
      "for-screenshots",
      "for-review",
      "for-sharing",
      "large-files",
      "scanned",
      "batch",
      "for-records",
      "quick-fix",
      "for-archive",
    ],
  },
  {
    toolSlug: "jpg-to-pdf",
    baseAction: "JPG to PDF",
    introUseCase: "bundle images into a single document for applications, records, or easier sharing",
    privacyUseCase: "photo scans, receipts, letters, evidence images, and quick mobile captures",
    outcome: "a single PDF made from one or more JPG images",
    idealDocuments: "camera scans, supporting documents, receipts, forms, and screenshot sets",
    stepNouns: ["add the JPG files", "arrange the order", "convert locally", "review page sequence", "download the PDF"],
    limitations: [
      "Image quality limits in the source JPGs will still show in the resulting PDF.",
      "Large batches of photos can use noticeable browser memory on phones.",
      "Poorly cropped images can create awkward white space or page sizing.",
      "Review the PDF once before upload or sharing, especially if it replaces the source images.",
    ],
    relatedTools: ["pdf-to-jpg", "image-compress", "merge-pdf", "compress-pdf", "protect-pdf"],
    relatedGuides: ["/learn/no-uploads-explained", "/learn/how-pdfs-work", "/verify-claims"],
    modifierSlugs: [
      ...DEVICE_MODIFIERS,
      ...PRIVACY_MODIFIERS,
      ...DELIVERY_MODIFIERS,
      "batch",
      "large-files",
      "for-records",
      "for-contracts",
      "for-resumes",
      "for-forms",
      "for-review",
      "quick-fix",
      "for-archive",
    ],
  },
  {
    toolSlug: "ocr-pdf",
    baseAction: "OCR PDF",
    introUseCase: "make image-based PDFs easier to search, quote, or reuse without pushing the file through a cloud OCR queue first",
    privacyUseCase: "scanned records, letters, statements, signed forms, and archive copies",
    outcome: "a more searchable and workable PDF",
    idealDocuments: "scans, receipts, letters, records, and photographed or printed paperwork",
    stepNouns: ["add the scanned PDF", "run OCR locally", "check sample search terms", "review the output quality", "download the searchable copy"],
    limitations: [
      "OCR accuracy always depends on scan quality, contrast, and page cleanliness.",
      "Large scans can take noticeably longer because the browser is doing real local work.",
      "Mixed languages, handwriting, and skewed images reduce recognition quality.",
      "Always test search and copy a few phrases before trusting the output in a records workflow.",
    ],
    relatedTools: ["pdf-to-word", "compress-pdf", "pdf-to-markdown", "compare-pdf", "protect-pdf"],
    relatedGuides: [
      "/learn/how-ocr-works-on-scanned-pdfs",
      "/learn/ocr-pdf-without-cloud",
      "/learn/workflows/make-scanned-pdf-searchable-for-records",
    ],
    modifierSlugs: [
      ...DEVICE_MODIFIERS,
      ...PRIVACY_MODIFIERS,
      "scanned",
      "searchable",
      "large-files",
      "for-records",
      "for-contracts",
      "for-forms",
      "for-review",
      "batch",
      "password-protected",
      "for-archive",
      "quick-fix",
      "for-upload",
    ],
  },
  {
    toolSlug: "image-compress",
    baseAction: "Compress Images",
    introUseCase: "reduce image weight before you send, upload, archive, or convert the files elsewhere",
    privacyUseCase: "screenshots, photo scans, proofs, and image attachments",
    outcome: "smaller image files that are easier to share or reuse",
    idealDocuments: "screenshots, camera captures, exported graphics, and scan images",
    stepNouns: ["add the image files", "choose the compression level", "run the local reduction", "review clarity", "download the optimised files"],
    limitations: [
      "Over-compression can make text and screenshots fuzzy.",
      "Repeated compression passes can stack quality loss faster than expected.",
      "Large batches of photos can still take time on mobile devices.",
      "Keep the originals if the images may later need print or archive quality.",
    ],
    relatedTools: ["jpg-to-pdf", "pdf-to-jpg", "compress-pdf", "html-to-pdf", "file-hash"],
    relatedGuides: ["/learn/no-uploads-explained", "/verify-claims"],
    modifierSlugs: [
      ...DEVICE_MODIFIERS,
      ...PRIVACY_MODIFIERS,
      ...DELIVERY_MODIFIERS,
      "batch",
      "large-files",
      "for-sharing",
      "for-screenshots",
      "for-review",
      "quick-fix",
      "for-archive",
    ],
  },
  {
    toolSlug: "json-formatter",
    baseAction: "Format JSON",
    introUseCase: "clean up JSON so it is easier to read, validate, review, or paste into another system",
    privacyUseCase: "payloads, configs, API responses, and internal data structures that should not be pasted into random formatter sites",
    outcome: "readable, validated JSON",
    idealDocuments: "API payloads, config files, webhook bodies, exports, and pasted data snippets",
    stepNouns: ["paste the JSON", "format and validate locally", "review structure and errors", "copy the cleaned result", "use the fixed payload"],
    limitations: [
      "Invalid JSON still needs manual correction when the source structure is genuinely broken.",
      "Very large payloads can make browser-based diffing or inspection slower.",
      "Formatting does not guarantee the data is semantically correct for your target system.",
      "If the payload is sensitive, copy only the cleaned output you actually need.",
    ],
    relatedTools: ["regex-tester", "file-hash", "html-to-pdf", "text-to-pdf", "compare-pdf"],
    relatedGuides: ["/verify-claims"],
    modifierSlugs: [
      ...DEVICE_MODIFIERS,
      ...PRIVACY_MODIFIERS,
      "large-files",
      "for-upload",
      "for-sharing",
      "for-review",
      "quick-fix",
      "for-records",
      "for-forms",
      "batch",
      "for-archive",
    ],
  },
  {
    toolSlug: "regex-tester",
    baseAction: "Test Regex",
    introUseCase: "check patterns, matches, and replacements without sending sample text to a remote debugging service",
    privacyUseCase: "log snippets, internal text samples, support cases, and data-cleaning rules",
    outcome: "a regex pattern you can trust more before it hits production or a workflow",
    idealDocuments: "text snippets, sample logs, support notes, exports, and replacement patterns",
    stepNouns: ["paste the sample text", "enter the pattern", "review matches locally", "adjust flags or groups", "copy the final regex"],
    limitations: [
      "A passing sample does not prove the pattern is safe for every real-world input.",
      "Large pasted text blocks can still make client-side matching feel heavy.",
      "Browser regex behaviour may still differ from your target runtime in edge cases.",
      "Test with representative examples before using a pattern on production data.",
    ],
    relatedTools: ["json-formatter", "file-hash", "text-to-pdf", "pdf-to-markdown", "compare-pdf"],
    relatedGuides: ["/verify-claims"],
    modifierSlugs: [
      ...DEVICE_MODIFIERS,
      ...PRIVACY_MODIFIERS,
      "for-review",
      "quick-fix",
      "for-records",
      "for-forms",
      "for-upload",
      "batch",
      "for-contracts",
      "for-sharing",
      "for-archive",
    ],
  },
  {
    toolSlug: "file-hash",
    baseAction: "Hash Files",
    introUseCase: "generate checksums to confirm integrity before upload, archive, or handover",
    privacyUseCase: "sensitive documents, release artifacts, backups, and working files that should not leave your device just to get a checksum",
    outcome: "a local checksum you can compare or record",
    idealDocuments: "downloads, builds, backups, evidence files, and archive copies",
    stepNouns: ["add the file", "generate the hash locally", "copy the checksum", "compare or record the value", "keep the result with your workflow notes"],
    limitations: [
      "A checksum proves file equality, not business correctness or safety.",
      "Very large files can take time because the browser must read the full contents locally.",
      "If you compare the wrong algorithm, two valid checksums can still appear mismatched.",
      "Record which hash algorithm you used whenever the checksum will be shared with someone else.",
    ],
    relatedTools: ["json-formatter", "regex-tester", "compress-pdf", "protect-pdf", "compare-pdf"],
    relatedGuides: ["/verify-claims"],
    modifierSlugs: [
      ...DEVICE_MODIFIERS,
      ...PRIVACY_MODIFIERS,
      "large-files",
      "for-upload",
      "for-sharing",
      "for-review",
      "quick-fix",
      "for-records",
      "for-contracts",
      "for-archive",
      "batch",
    ],
  },
  {
    toolSlug: "html-to-pdf",
    baseAction: "HTML to PDF",
    introUseCase: "turn HTML content into a portable document without sending the source markup or text through a third-party conversion queue",
    privacyUseCase: "draft pages, internal templates, invoices, reports, and generated HTML snippets",
    outcome: "a PDF derived from browser-rendered HTML",
    idealDocuments: "web content, reports, invoice templates, receipts, and printable drafts",
    stepNouns: ["add or paste the HTML source", "render it locally", "convert to PDF", "review pagination", "download the PDF"],
    limitations: [
      "Complex CSS, fonts, or external dependencies can still affect the final rendering.",
      "Long pages may need layout checks to avoid awkward page breaks.",
      "HTML that depends on remote assets can behave differently from fully self-contained markup.",
      "Review the PDF carefully if it will be used as a formal customer or archive copy.",
    ],
    relatedTools: ["pdf-to-html", "text-to-pdf", "word-to-pdf", "compress-pdf", "protect-pdf"],
    relatedGuides: ["/learn/no-uploads-explained", "/verify-claims"],
    modifierSlugs: [
      ...DEVICE_MODIFIERS,
      ...PRIVACY_MODIFIERS,
      ...DELIVERY_MODIFIERS,
      "for-records",
      "for-contracts",
      "for-resumes",
      "for-forms",
      "for-review",
      "large-files",
      "batch",
      "for-archive",
      "quick-fix",
    ],
  },
  {
    toolSlug: "pdf-to-html",
    baseAction: "PDF to HTML",
    introUseCase: "pull a PDF into a more web-friendly format for reuse, review, or extraction",
    privacyUseCase: "internal documents, drafts, and reports that should not go through a generic conversion upload flow",
    outcome: "HTML output you can inspect or reuse",
    idealDocuments: "reports, brochures, text-heavy PDFs, and draft content",
    stepNouns: ["add the PDF", "run the local extraction", "inspect the HTML output", "review formatting", "save the reusable result"],
    limitations: [
      "Complex layout PDFs rarely translate into perfect HTML on the first pass.",
      "Image-heavy files may not produce the cleanest reusable markup.",
      "If the PDF is scanned, OCR or another extraction path may be a better first step.",
      "Use the HTML as a working output, not as an unquestioned substitute for the source PDF.",
    ],
    relatedTools: ["html-to-pdf", "pdf-to-markdown", "pdf-to-word", "ocr-pdf", "compare-pdf"],
    relatedGuides: ["/learn/what-happens-when-you-upload-a-pdf", "/verify-claims"],
    modifierSlugs: [
      ...DEVICE_MODIFIERS,
      ...PRIVACY_MODIFIERS,
      "large-files",
      "for-review",
      "for-records",
      "for-forms",
      "for-sharing",
      "batch",
      "quick-fix",
      "for-archive",
      "scanned",
    ],
  },
  {
    toolSlug: "pdf-to-markdown",
    baseAction: "PDF to Markdown",
    introUseCase: "extract a PDF into a format that is easier to edit, quote, or reuse in knowledge workflows",
    privacyUseCase: "notes, internal policies, drafts, and text-heavy PDFs that should stay on your device during conversion",
    outcome: "Markdown text that is easier to edit and version",
    idealDocuments: "meeting notes, policies, reports, docs drafts, and searchable text workflows",
    stepNouns: ["add the PDF", "run the extraction locally", "review the Markdown output", "clean headings and lists", "save the working copy"],
    limitations: [
      "Tables, columns, and highly designed layouts often need manual cleanup afterward.",
      "Scanned PDFs still depend on OCR quality before Markdown becomes useful.",
      "The output is best treated as an editable working copy rather than a final representation.",
      "Always check section order and formatting before you publish or share the converted text.",
    ],
    relatedTools: ["pdf-to-html", "pdf-to-word", "ocr-pdf", "compare-pdf", "text-to-pdf"],
    relatedGuides: ["/learn/what-happens-when-you-upload-a-pdf", "/verify-claims"],
    modifierSlugs: [
      ...DEVICE_MODIFIERS,
      ...PRIVACY_MODIFIERS,
      "large-files",
      "for-review",
      "for-records",
      "for-contracts",
      "for-sharing",
      "batch",
      "quick-fix",
      "searchable",
      "scanned",
    ],
  },
  {
    toolSlug: "sign-pdf",
    baseAction: "Sign PDF",
    introUseCase: "apply a signature workflow without pushing a routine document through a broader cloud-sign process first",
    privacyUseCase: "agreements, internal approvals, consent forms, and handover documents",
    outcome: "a signed PDF ready for review or return",
    idealDocuments: "contracts, approvals, declarations, HR forms, and administrative PDFs",
    stepNouns: ["add the PDF", "place the signature", "review the signed copy", "confirm placement and readability", "download the final file"],
    limitations: [
      "You should still confirm whether the recipient needs a simple signature mark or a specific digital-signature standard.",
      "Placement, page choice, and signature clarity should always be checked before sending.",
      "If the file is already protected, you may need an unlock step first.",
      "Signed output may still need password protection or distribution controls afterwards.",
    ],
    relatedTools: ["protect-pdf", "unlock-pdf", "fill-pdf", "compare-pdf", "merge-pdf"],
    relatedGuides: [
      "/learn/how-to-sign-a-pdf-without-uploading-it",
      "/learn/workflows/password-protect-pdf-before-emailing",
      "/verify-claims",
    ],
    modifierSlugs: [
      ...DEVICE_MODIFIERS,
      ...PRIVACY_MODIFIERS,
      "for-contracts",
      "for-records",
      "for-forms",
      "for-review",
      "quick-fix",
      "password-protected",
      "for-sharing",
      "for-upload",
      "for-archive",
    ],
  },
  {
    toolSlug: "protect-pdf",
    baseAction: "Protect PDF",
    introUseCase: "add a practical password layer before sharing, uploading, or archiving a document",
    privacyUseCase: "contracts, HR records, statements, attachments, and handover files",
    outcome: "a password-protected PDF for controlled sharing",
    idealDocuments: "agreements, statements, exported forms, and files moving into external channels",
    stepNouns: ["add the PDF", "set the password", "protect the file locally", "review the output", "store or share the protected copy carefully"],
    limitations: [
      "Password protection helps with access control, but it is only one part of a secure workflow.",
      "You still need a sensible way to share the password separately from the file itself.",
      "Some older viewers handle protected files differently, so test the output if the recipient environment is unusual.",
      "Keep an unprotected source copy stored safely in case you need to edit the document later.",
    ],
    relatedTools: ["unlock-pdf", "sign-pdf", "fill-pdf", "merge-pdf", "compress-pdf"],
    relatedGuides: [
      "/learn/how-to-protect-a-pdf-with-a-password",
      "/learn/workflows/password-protect-pdf-before-emailing",
      "/verify-claims",
    ],
    modifierSlugs: [
      ...DEVICE_MODIFIERS,
      ...PRIVACY_MODIFIERS,
      "for-contracts",
      "for-records",
      "for-forms",
      "for-review",
      "quick-fix",
      "password-protected",
      "for-sharing",
      "for-upload",
      "for-archive",
    ],
  },
  {
    toolSlug: "unlock-pdf",
    baseAction: "Unlock PDF",
    introUseCase: "remove access friction from a file you are allowed to work with so the next step is easier",
    privacyUseCase: "internal files, client material, and archived documents that already sit on your device",
    outcome: "an accessible working copy for the next task",
    idealDocuments: "protected attachments, old records, approval packs, and PDFs that need legitimate follow-up work",
    stepNouns: ["add the protected PDF", "provide the password if required", "unlock locally", "review the working copy", "use it for the next approved step"],
    limitations: [
      "Only unlock files you are authorised to work with.",
      "An unlocked output may need re-protection before you share it again.",
      "Large protected files can still take time to process on lower-power devices.",
      "Always store the unlocked copy carefully because it removes a layer of access control.",
    ],
    relatedTools: ["protect-pdf", "sign-pdf", "fill-pdf", "compare-pdf", "merge-pdf"],
    relatedGuides: ["/learn/how-to-protect-a-pdf-with-a-password", "/verify-claims"],
    modifierSlugs: [
      ...DEVICE_MODIFIERS,
      ...PRIVACY_MODIFIERS,
      "password-protected",
      "for-contracts",
      "for-records",
      "for-forms",
      "for-review",
      "quick-fix",
      "for-sharing",
      "large-files",
      "for-archive",
    ],
  },
  {
    toolSlug: "compare-pdf",
    baseAction: "Compare PDF Files",
    introUseCase: "review two versions of a PDF without sending the documents to a remote diff service",
    privacyUseCase: "contract revisions, policy changes, document approvals, and record updates",
    outcome: "a clearer view of what changed between two PDFs",
    idealDocuments: "draft agreements, revised forms, policy updates, mark-up rounds, and archived versions",
    stepNouns: ["add both PDFs", "run the local comparison", "review the differences", "confirm the practical impact", "download or note the result"],
    limitations: [
      "Document comparisons still need human judgement because some changes matter more than others.",
      "Scanned PDFs and visually similar layouts can make change interpretation harder.",
      "Very large files or lots of pages can slow down the first local pass.",
      "Use the output as a review aid, not as a substitute for final sign-off.",
    ],
    relatedTools: ["merge-pdf", "split-pdf", "pdf-to-word", "ocr-pdf", "sign-pdf"],
    relatedGuides: ["/learn/no-uploads-explained", "/verify-claims"],
    modifierSlugs: [
      ...DEVICE_MODIFIERS,
      ...PRIVACY_MODIFIERS,
      "for-review",
      "for-contracts",
      "for-records",
      "for-forms",
      "large-files",
      "scanned",
      "batch",
      "quick-fix",
      "for-archive",
      "password-protected",
    ],
  },
  {
    toolSlug: "text-to-pdf",
    baseAction: "Text to PDF",
    introUseCase: "turn plain text into a portable document without opening a larger authoring suite",
    privacyUseCase: "notes, copy, form answers, and internal text that you do not want to paste into a third-party generator",
    outcome: "a simple PDF made from text input",
    idealDocuments: "notes, letters, draft copy, application answers, and quick working documents",
    stepNouns: ["paste the text", "set the basic layout", "generate the PDF locally", "review readability", "download the document"],
    limitations: [
      "Plain text workflows are intentionally simple, so complex styling still belongs in a fuller editor.",
      "Long text can create pagination that needs one quick review before sharing.",
      "If you later need advanced layout changes, keep the source text as your editable original.",
      "Generated PDFs should be checked once before you treat them as an archive or submission copy.",
    ],
    relatedTools: ["html-to-pdf", "word-to-pdf", "pdf-to-markdown", "json-formatter", "protect-pdf"],
    relatedGuides: ["/learn/no-uploads-explained", "/verify-claims"],
    modifierSlugs: [
      ...DEVICE_MODIFIERS,
      ...PRIVACY_MODIFIERS,
      ...DELIVERY_MODIFIERS,
      "for-records",
      "for-contracts",
      "for-resumes",
      "for-forms",
      "for-review",
      "quick-fix",
      "for-archive",
      "batch",
    ],
  },
  {
    toolSlug: "fill-pdf",
    baseAction: "Fill PDF Forms",
    introUseCase: "complete forms in a browser without sending the file to a generic form-filling service first",
    privacyUseCase: "application forms, declarations, HR paperwork, and administrative PDFs",
    outcome: "a completed PDF ready to sign, return, or store",
    idealDocuments: "forms, declarations, intake paperwork, and submission copies",
    stepNouns: ["add the PDF form", "fill the fields", "review each entry", "save the completed copy", "download the finished document"],
    limitations: [
      "Some highly specialised form features can still behave differently across viewers.",
      "Always review the saved output to confirm that every field value is visible and complete.",
      "Protected or restricted forms may need another step before or after filling.",
      "Keep an original blank copy if the form may need to be reused later.",
    ],
    relatedTools: ["sign-pdf", "protect-pdf", "unlock-pdf", "pdf-to-word", "merge-pdf"],
    relatedGuides: [
      "/learn/workflows/password-protect-pdf-before-emailing",
      "/learn/no-uploads-explained",
      "/verify-claims",
    ],
    modifierSlugs: [
      ...DEVICE_MODIFIERS,
      ...PRIVACY_MODIFIERS,
      "for-records",
      "for-contracts",
      "for-resumes",
      "for-forms",
      "for-review",
      "quick-fix",
      "password-protected",
      "for-sharing",
      "for-upload",
      "for-archive",
    ],
  },
]

const modifierMap = new Map(TOOL_MODIFIERS.map((modifier) => [modifier.slug, modifier]))
const toolMap = new Map(TOOL_VARIANT_TOOLS.map((tool) => [tool.toolSlug, tool]))

function countWords(value: string | string[]) {
  const text = Array.isArray(value) ? value.join(" ") : value
  return text
    .trim()
    .split(/\s+/)
    .filter(Boolean).length
}

function unique(values: string[]) {
  return Array.from(new Set(values))
}

function buildVariantTitle(tool: ToolVariantToolDefinition, modifier: ToolModifierDefinition) {
  return `${tool.baseAction} ${modifier.titleLabel} | Plain Tools`
}

function buildVariantH1(tool: ToolVariantToolDefinition, modifier: ToolModifierDefinition) {
  return `${tool.baseAction} ${modifier.h1Label} - Free Private No-Upload Tool`
}

function buildVariantMetaDescription(
  tool: ToolVariantToolDefinition,
  modifier: ToolModifierDefinition
) {
  return buildMetaDescription(
    `${tool.baseAction} ${modifier.querySeed} with Plain Tools. Run the core workflow in your browser with local processing, no upload step, and practical checks before you share or submit the result.`
  )
}

function buildIntroParagraphs(
  tool: ToolVariantToolDefinition,
  modifier: ToolModifierDefinition
) {
  return [
    `${tool.baseAction} ${modifier.querySeed} is usually a search for a very specific outcome, not a generic feature list. The user normally needs to ${modifier.userNeed}, and they need to do it without burning time on account prompts, trial walls, or a vague upload page that never explains where the file goes. Plain Tools is designed for that kind of real task. The page gives you the live tool immediately, but it also explains the use case properly so you can decide whether the route matches the job before you touch the document. In practical terms, this variant is best when you need to ${tool.introUseCase} and want the workflow to stay direct.`,
    `${modifier.whyItMatters}. That is why this page is written around the modifier rather than pretending every document job is the same. ${tool.baseAction} for this use case usually means working with ${tool.idealDocuments}. The right output is not only technically valid. It also needs to make the next step easier, whether that means sharing a smaller file, uploading a cleaner document, creating a more reviewable copy, or preparing something that can be stored with less friction. The explanation here stays practical so you can judge the trade-offs quickly and avoid a second round of fixes later.`,
    `Plain Tools keeps its strongest promise where it is actually true: for the core workflow, processing stays in your browser rather than sending the source file to a Plain Tools server. That matters for ${tool.privacyUseCase}, and it matters even more when the search intent already signals caution through words like ${modifier.querySeed}, secure, or local. ${modifier.privacyAngle}. The page therefore treats privacy as part of the workflow rather than as decorative marketing language. If you want evidence, you can inspect the Network tab yourself and verify that the core local path does not post file bytes during processing.`,
    `${modifier.workflowAdvice}. This route is deliberately calm and low-hype. It is meant to solve the immediate task, explain the boundaries honestly, and leave you with ${tool.outcome}. ${modifier.limitationAngle}. That combination of utility, trust, and clear caveats is what makes the page useful even before you start the tool.`,
  ]
}

function buildHowItWorksParagraphs(
  tool: ToolVariantToolDefinition,
  modifier: ToolModifierDefinition
) {
  return [
    `The local workflow is simple on purpose. You open the tool in a browser, add the source file or input, choose the options that matter for this modifier, and let the browser handle the core processing on-device. That keeps the experience closer to the actual task and avoids turning a one-step document problem into an upload queue.`,
    `For a ${modifier.querySeed} variant, the important shift is not the button you click. It is the decision criteria you apply before and after processing. You are not just asking whether ${tool.baseAction.toLowerCase()} works. You are asking whether the result is genuinely fit for ${modifier.querySeed} use, whether the workflow stays private enough for the material involved, and whether the output will save time in the next step rather than create more cleanup.`,
    `That is why this page pairs the live tool with explanation, checks, and limitations. The goal is to help you complete the task once, keep the source file under control, and review the result with realistic expectations before you upload, share, archive, or submit it.`,
  ]
}

function buildSteps(tool: ToolVariantToolDefinition, modifier: ToolModifierDefinition): ToolVariantStep[] {
  const [first, second, third, fourth, fifth] = tool.stepNouns
  return [
    {
      title: "Open the live workspace",
      text: `Start with the tool interface below and ${first}. The page is already framed around the ${modifier.querySeed} use case, so begin with the document or input you actually plan to use rather than a generic sample.`,
    },
    {
      title: "Choose the modifier-specific path",
      text: `Set the options or workflow choices that support ${modifier.querySeed}. In most cases that means prioritising ${modifier.userNeed} while keeping an eye on the result you will need in the next step.`,
    },
    {
      title: "Run the core processing locally",
      text: `${second.charAt(0).toUpperCase() + second.slice(1)} and then ${third}. The core file handling stays in the browser session for this path, which is the main privacy advantage of using Plain Tools for the task.`,
    },
    {
      title: "Review before you trust the output",
      text: `${fourth.charAt(0).toUpperCase() + fourth.slice(1)}. Check readability, page order, structure, field behaviour, or searchability depending on the job. Treat this as a working-quality check, not as an optional extra.`,
    },
    {
      title: "Download and use the result carefully",
      text: `${fifth.charAt(0).toUpperCase() + fifth.slice(1)}. Keep the original nearby until the destination workflow has accepted the processed copy and you know the outcome is fit for purpose.`,
    },
  ]
}

function buildLimitations(tool: ToolVariantToolDefinition, modifier: ToolModifierDefinition) {
  return [
    tool.limitations[0],
    tool.limitations[1],
    tool.limitations[2],
    `${tool.limitations[3]} ${modifier.limitationAngle}`,
  ]
}

function buildFaq(tool: ToolVariantToolDefinition, modifier: ToolModifierDefinition): ToolVariantFaq[] {
  return [
    {
      question: `How do I use ${tool.baseAction.toLowerCase()} ${modifier.querySeed}?`,
      answer: `Open the tool, use the workflow that matches ${modifier.querySeed}, run the core processing locally in your browser, then review the output before you upload, share, or archive it.`,
    },
    {
      question: `Does Plain Tools upload files for this ${tool.baseAction.toLowerCase()} route?`,
      answer: `No for the core local workflow. The file stays on your device while the main processing step runs in the browser, and you can inspect that behaviour in DevTools if you want independent confirmation.`,
    },
    {
      question: `Is this ${tool.baseAction.toLowerCase()} page genuinely free to use?`,
      answer: `Yes. This route is designed as a free utility workflow. The page explains the practical limits honestly, but the core browser-based task does not require an account or paid subscription.`,
    },
    {
      question: `What should I check after using ${tool.baseAction.toLowerCase()} ${modifier.querySeed}?`,
      answer: `Check the output against the job you actually need to complete: size, page order, readability, formatting, searchability, signature placement, or access settings. The right check depends on the modifier, not just the tool.`,
    },
    {
      question: `When is a local browser workflow better for ${modifier.querySeed}?`,
      answer: `It is often better when the file contains private material, when you want to avoid upload delays, or when you only need a focused one-task workflow rather than a full document suite.`,
    },
    {
      question: `What are the main limits of ${tool.baseAction.toLowerCase()} ${modifier.querySeed}?`,
      answer: `${tool.limitations[0]} ${modifier.limitationAngle}`,
    },
  ]
}

function buildTrustPoints(tool: ToolVariantToolDefinition, modifier: ToolModifierDefinition) {
  return [
    "Runs 100% in your browser",
    "No uploads for the core local workflow",
    "No data stored by Plain Tools during processing",
    `${tool.baseAction} is explained for the ${modifier.querySeed} use case before you start`,
  ]
}

function createVariantPage(
  tool: ToolVariantToolDefinition,
  modifier: ToolModifierDefinition
): ToolVariantPageDefinition {
  const slug = `${tool.toolSlug}/${modifier.slug}`
  const path = `/tools/${slug}`
  const introParagraphs = buildIntroParagraphs(tool, modifier)
  const howItWorksParagraphs = buildHowItWorksParagraphs(tool, modifier)
  const steps = buildSteps(tool, modifier)
  const limitations = buildLimitations(tool, modifier)
  const faq = buildFaq(tool, modifier)
  const title = buildVariantTitle(tool, modifier)
  const metaDescription = buildVariantMetaDescription(tool, modifier)
  const h1 = buildVariantH1(tool, modifier)
  const ctaText = "Try it now - completely free and private."
  const trustPoints = buildTrustPoints(tool, modifier)
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

  if (wordCount < 900) {
    throw new Error(`Variant page ${path} is too thin at ${wordCount} words.`)
  }

  return {
    slug,
    path,
    toolSlug: tool.toolSlug,
    modifierSlug: modifier.slug,
    title,
    metaDescription,
    h1,
    introParagraphs,
    howItWorksParagraphs,
    steps,
    limitations,
    faq,
    relatedToolSlugs: tool.relatedTools,
    relatedGuidePaths: tool.relatedGuides,
    trustPoints,
    ctaText,
    wordCount,
  }
}

export const TOOL_VARIANT_PAGES = TOOL_VARIANT_TOOLS.flatMap((tool) =>
  unique(tool.modifierSlugs).map((modifierSlug) => {
    const modifier = modifierMap.get(modifierSlug)
    if (!modifier) {
      throw new Error(`Unknown modifier slug: ${modifierSlug}`)
    }
    return createVariantPage(tool, modifier)
  })
)

if (TOOL_VARIANT_PAGES.length < 400 || TOOL_VARIANT_PAGES.length > 500) {
  throw new Error(
    `Tool variant wave should stay between 400 and 500 pages. Current count: ${TOOL_VARIANT_PAGES.length}.`
  )
}

for (const tool of TOOL_VARIANT_TOOLS) {
  if (!getToolBySlug(tool.toolSlug)) {
    throw new Error(`Tool variant matrix references missing tool slug: ${tool.toolSlug}`)
  }
}

export function getToolVariantPage(toolSlug: string, modifierSlug: string) {
  return TOOL_VARIANT_PAGES.find(
    (page) => page.toolSlug === toolSlug && page.modifierSlug === modifierSlug
  )
}

export function getToolVariantPagesForTool(toolSlug: string) {
  return TOOL_VARIANT_PAGES.filter((page) => page.toolSlug === toolSlug)
}

export function getRelatedToolVariantPages(
  toolSlug: string,
  modifierSlug: string,
  limit = 5
) {
  return TOOL_VARIANT_PAGES.filter(
    (page) => page.toolSlug === toolSlug && page.modifierSlug !== modifierSlug
  ).slice(0, limit)
}

export function getToolVariantStaticParams() {
  return TOOL_VARIANT_PAGES.map((page) => ({
    toolSlug: page.toolSlug,
    modifierSlug: page.modifierSlug,
  }))
}

export function getVariantToolDefinition(toolSlug: string) {
  return toolMap.get(toolSlug)
}

export function getVariantModifierDefinition(modifierSlug: string) {
  return modifierMap.get(modifierSlug)
}

export const TOOL_VARIANT_EXAMPLE_SLUGS = TOOL_VARIANT_PAGES.slice(0, 20).map((page) => ({
  slug: page.path,
  title: page.title,
}))
