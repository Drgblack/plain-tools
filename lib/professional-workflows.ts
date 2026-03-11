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

export type ProfessionalWorkflowIndustryHub = {
  canonicalPath: string
  comparePath: string
  description: string
  featuredWorkflows: Array<{
    description: string
    href: string
    title: string
    toolName: string
  }>
  label: string
  relatedToolLinks: Array<{ href: string; label: string }>
  slug: string
  workflowCount: number
}

const INDUSTRIES: IndustryDefinition[] = [
  { slug: "legal", label: "Legal Teams", keyword: "legal", docs: "contracts, exhibit bundles, and client review copies", risk: "matter files often contain privileged language, signatures, and ID data", nextStep: "court filing, outside counsel review, or client delivery", review: "page order, redactions, signatures, and submission size", comparePath: "/compare/plain-tools-vs-adobe-acrobat-online" },
  { slug: "accounting", label: "Accounting Teams", keyword: "accounting", docs: "invoices, statements, and month-end support packs", risk: "the files mix payment details, customer records, and audit evidence", nextStep: "finance approval, audit support, or reporting", review: "totals, legibility, file size, and record completeness", comparePath: "/compare/plain-tools-vs-pdf24" },
  { slug: "hr", label: "HR Teams", keyword: "hr", docs: "candidate packets, onboarding forms, and signed policies", risk: "HR files carry personal data, compensation details, and signatures", nextStep: "onboarding, employee review, or secure records storage", review: "field values, signatures, metadata, and final record quality", comparePath: "/compare/plain-tools-vs-smallpdf" },
  { slug: "hr-recruitment", label: "HR Recruitment Teams", keyword: "hr recruitment", docs: "candidate packets, NDAs, interview summaries, and offer-letter PDFs", risk: "recruitment files carry candidate data, compensation notes, signatures, and internal interview feedback", nextStep: "candidate review, hiring approval, or onboarding handoff", review: "redactions, signatures, metadata, and final share-copy quality", comparePath: "/compare/plain-tools-vs-smallpdf" },
  { slug: "students", label: "Students", keyword: "student", docs: "assignments, scanned notes, and submission PDFs", risk: "student uploads often include ID numbers, grades, and application material", nextStep: "course submission, scholarship upload, or tutor review", review: "legibility, page order, searchable text, and upload readiness", comparePath: "/compare/plain-tools-vs-ilovepdf" },
  { slug: "accounting-finance", label: "Accounting & Finance Teams", keyword: "accounting finance", docs: "close packs, board-ready statements, reconciliations, and approval PDFs", risk: "finance files combine bank details, payroll data, commercial terms, and audit evidence", nextStep: "controller review, board circulation, or secure archive delivery", review: "totals, page order, metadata, file size, and external-share readiness", comparePath: "/compare/plain-tools-vs-pdf24" },
  { slug: "healthcare-admin", label: "Healthcare Admin", keyword: "healthcare admin", docs: "referral packets, scanned records, and intake forms", risk: "admin records can contain personal health details and operational notes", nextStep: "records administration, clinical review, or secure sharing", review: "readability, OCR quality, orientation, and packet completeness", comparePath: "/compare/plain-tools-vs-sejda" },
  { slug: "healthcare", label: "Healthcare Teams", keyword: "healthcare", docs: "patient packets, signed consents, scanned referrals, and claims-support PDFs", risk: "healthcare files often contain patient identifiers, signatures, treatment notes, and regulated attachments", nextStep: "clinical review, patient handoff, or regulated archive storage", review: "redactions, OCR quality, metadata, page order, and chart-readiness", comparePath: "/compare/plain-tools-vs-sejda" },
  { slug: "government", label: "Government Submissions", keyword: "government submission", docs: "applications, supporting evidence, and signed forms", risk: "submission files often carry identity records and regulated attachments", nextStep: "portal submission, procurement review, or compliance filing", review: "size limits, page count, searchable text, and validation readiness", comparePath: "/compare/plain-tools-vs-smallpdf" },
  { slug: "government-compliance", label: "Government Compliance Teams", keyword: "government compliance", docs: "regulator response packs, evidence bundles, signed attestations, and audit PDFs", risk: "compliance files often include identity records, regulated evidence, signatures, and controlled review notes", nextStep: "regulator submission, audit review, or internal compliance sign-off", review: "redactions, bates order, searchable text, metadata, and submission readiness", comparePath: "/compare/plain-tools-vs-smallpdf" },
  { slug: "procurement", label: "Procurement Teams", keyword: "procurement", docs: "vendor packets, tax forms, and signed terms", risk: "supplier files combine commercial terms, tax data, and compliance records", nextStep: "supplier onboarding, approval, or retention", review: "document completeness, signatures, and share-copy quality", comparePath: "/compare/plain-tools-vs-pdfgear" },
  { slug: "real-estate", label: "Real Estate Teams", keyword: "real estate", docs: "lease packets, disclosures, and closing PDFs", risk: "property files contain signatures, addresses, and financial disclosures", nextStep: "client signature, brokerage review, or archive storage", review: "signatures, page order, metadata, and delivery polish", comparePath: "/compare/plain-tools-vs-dochub" },
  { slug: "property-management", label: "Property Management Teams", keyword: "property management", docs: "lease renewals, maintenance forms, notice packets, and resident-ready PDFs", risk: "property-management files contain tenant details, signatures, addresses, and payment references", nextStep: "tenant delivery, owner review, or record retention", review: "signatures, metadata, page order, and resident-share quality", comparePath: "/compare/plain-tools-vs-dochub" },
  { slug: "insurance", label: "Insurance Teams", keyword: "insurance", docs: "claims packets, policy PDFs, and scanned evidence", risk: "claims workflows combine personal details, payment records, and supporting scans", nextStep: "claims handling, adjuster review, or archive storage", review: "OCR quality, page order, file size, and evidence readability", comparePath: "/compare/plain-tools-vs-foxit-pdf" },
  { slug: "consulting", label: "Consulting Teams", keyword: "consulting", docs: "client reports, proposal PDFs, and sign-off copies", risk: "consulting documents often include client strategy, budgets, and internal notes", nextStep: "client delivery, executive review, or scope approval", review: "branding, page consistency, file size, and client-readiness", comparePath: "/compare/plain-tools-vs-pdf24" },
  { slug: "sales", label: "Sales Teams", keyword: "sales", docs: "quotes, order forms, and signed proposal PDFs", risk: "sales files blend pricing, customer details, and signatures", nextStep: "buyer review, signature, or customer delivery", review: "pricing pages, signatures, file size, and final polish", comparePath: "/compare/plain-tools-vs-sodapdf" },
  { slug: "customer-success", label: "Customer Success Teams", keyword: "customer success", docs: "handover packs, onboarding PDFs, and account plans", risk: "customer files include account history, contacts, and contract attachments", nextStep: "customer onboarding, handover, or renewal review", review: "clarity, page order, shared-file size, and team usability", comparePath: "/compare/plain-tools-vs-xodo" },
  { slug: "marketing-ops", label: "Marketing Operations", keyword: "marketing operations", docs: "media kits, campaign proofs, and approval packs", risk: "campaign files can contain unreleased assets and client review comments", nextStep: "campaign approval, partner handoff, or archive packaging", review: "asset quality, orientation, page order, and reviewer fit", comparePath: "/compare/plain-tools-vs-canva-pdf-tools" },
  { slug: "education-admin", label: "Education Admin", keyword: "education administration", docs: "student records, enrollment forms, and board packets", risk: "office files include student identifiers, signatures, and internal review notes", nextStep: "records processing, board review, or secure communication", review: "OCR quality, redaction status, file size, and handoff readiness", comparePath: "/compare/plain-tools-vs-pdfescape" },
  { slug: "registrar-services", label: "Registrar Services Teams", keyword: "registrar services", docs: "transcript requests, student forms, verification letters, and policy PDFs", risk: "registrar files contain student identifiers, signatures, grades, and regulated school records", nextStep: "student services delivery, records review, or archive retention", review: "redactions, OCR quality, metadata, and student-share readiness", comparePath: "/compare/plain-tools-vs-pdfescape" },
  { slug: "construction", label: "Construction Teams", keyword: "construction", docs: "site packs, signed permits, and inspection records", risk: "site files include signatures, addresses, commercial terms, and safety records", nextStep: "permit upload, site approval, or contractor delivery", review: "legibility, orientation, file size, and field usability", comparePath: "/compare/plain-tools-vs-swifdoo-pdf" },
  { slug: "nonprofit", label: "Nonprofit Teams", keyword: "nonprofit", docs: "grant packets, board PDFs, and signed approvals", risk: "nonprofit admin files still include donor data, signatures, and governance records", nextStep: "grant submission, board circulation, or donor delivery", review: "file size, readability, signatures, and external submission readiness", comparePath: "/compare/plain-tools-vs-lightpdf" },
  { slug: "engineering", label: "Engineering Teams", keyword: "engineering", docs: "design review PDFs, incident reports, and release evidence", risk: "engineering documents often include architecture notes, client data, and internal postmortem details", nextStep: "design review, release approval, or incident documentation", review: "diagram clarity, page order, searchable text, and export fidelity", comparePath: "/compare/plain-tools-vs-updf" },
  { slug: "product", label: "Product Teams", keyword: "product", docs: "spec packs, stakeholder reviews, and decision docs", risk: "product files combine roadmap notes, internal comments, and partner-facing attachments", nextStep: "stakeholder sign-off, planning review, or customer delivery", review: "comment visibility, page consistency, file size, and share-copy quality", comparePath: "/compare/plain-tools-vs-nitro-pdf-pro" },
  { slug: "creative-design", label: "Creative Design Teams", keyword: "creative design", docs: "proof decks, review PDFs, and client mark-up packs", risk: "design review files often contain unreleased assets and client feedback", nextStep: "client review, sign-off, or archive packaging", review: "visual fidelity, annotation clarity, page order, and final export quality", comparePath: "/compare/plain-tools-vs-canva-pdf-tools" },
  { slug: "research", label: "Research Teams", keyword: "research", docs: "study packets, scanned evidence, and review drafts", risk: "research documents can include participant data, internal notes, and unpublished findings", nextStep: "internal review, submission, or archive storage", review: "OCR quality, citation visibility, metadata, and share readiness", comparePath: "/compare/plain-tools-vs-updf" },
  { slug: "compliance", label: "Compliance Teams", keyword: "compliance", docs: "evidence packs, signed policies, and audit PDFs", risk: "compliance files often hold audit evidence, signatures, and regulated documentation", nextStep: "audit review, regulator submission, or retention", review: "metadata, signatures, page integrity, and evidence readability", comparePath: "/compare/plain-tools-vs-foxit-pdf" },
  { slug: "qa", label: "QA Teams", keyword: "qa", docs: "defect evidence, signed test records, and release packs", risk: "quality records mix screenshots, logs, approvals, and customer-sensitive reproduction details", nextStep: "release review, bug triage, or audit documentation", review: "image clarity, page order, searchable text, and packet completeness", comparePath: "/compare/plain-tools-vs-pdfgear" },
  { slug: "architecture", label: "Architecture Teams", keyword: "architecture", docs: "drawing packs, permit PDFs, and revision bundles", risk: "drawing files contain site details, signatures, and regulated attachments", nextStep: "permit review, contractor delivery, or archive storage", review: "drawing readability, orientation, page scale, and issue order", comparePath: "/compare/plain-tools-vs-swifdoo-pdf" },
  { slug: "manufacturing", label: "Manufacturing Teams", keyword: "manufacturing", docs: "quality packets, work instructions, and compliance forms", risk: "manufacturing PDFs often include supplier data, QA evidence, and traceability records", nextStep: "line release, supplier review, or compliance archive", review: "scan quality, page sequence, signatures, and record completeness", comparePath: "/compare/plain-tools-vs-onlyoffice-pdf" },
  { slug: "hospitality", label: "Hospitality Teams", keyword: "hospitality", docs: "vendor forms, event packets, and signed operations PDFs", risk: "hospitality files can include guest details, commercial terms, and signed approvals", nextStep: "vendor onboarding, event delivery, or records retention", review: "file size, readability, signatures, and handoff readiness", comparePath: "/compare/plain-tools-vs-docfly" },
  { slug: "legal-ops", label: "Legal Operations", keyword: "legal operations", docs: "matter packets, billing PDFs, and signer-ready documents", risk: "legal ops files mix privileged data, invoices, and signature workflows", nextStep: "matter review, invoicing, or approval routing", review: "redactions, signatures, file size, and billing packet order", comparePath: "/compare/plain-tools-vs-adobe-acrobat-online" },
  { slug: "litigation-support", label: "Litigation Support Teams", keyword: "litigation support", docs: "discovery packets, deposition exhibits, production sets, and court-ready PDFs", risk: "litigation-support files often include privileged review notes, personal identifiers, exhibit numbering, and court-sensitive attachments", nextStep: "court filing, outside counsel review, or discovery production", review: "bates order, redactions, OCR quality, metadata, and filing readiness", comparePath: "/compare/plain-tools-vs-adobe-acrobat-online" },
  { slug: "biotech", label: "Biotech Teams", keyword: "biotech", docs: "submission packs, lab records, and controlled review PDFs", risk: "biotech documents can include regulated data, study evidence, and partner attachments", nextStep: "regulatory review, partner delivery, or archive submission", review: "scan quality, metadata, page order, and reviewer usability", comparePath: "/compare/plain-tools-vs-wondershare-pdfelement" },
  { slug: "media", label: "Media Teams", keyword: "media", docs: "press kits, contracts, and review PDFs", risk: "media packs often hold embargoed assets, talent contracts, and internal comments", nextStep: "partner delivery, legal review, or archive packaging", review: "asset fidelity, signature status, page order, and final polish", comparePath: "/compare/plain-tools-vs-lightpdf" },
  { slug: "fundraising", label: "Fundraising Teams", keyword: "fundraising", docs: "board packs, donor PDFs, and grant attachments", risk: "fundraising files can contain donor details, grant evidence, and signed approvals", nextStep: "board circulation, donor delivery, or grant submission", review: "file size, signatures, page order, and external share quality", comparePath: "/compare/plain-tools-vs-kami" },
  { slug: "operations", label: "Operations Teams", keyword: "operations", docs: "handover packets, signed forms, and daily admin bundles", risk: "operations documents often include customer records, approvals, and vendor forms", nextStep: "handover, queue transfer, or archive retention", review: "page sequence, OCR quality, signatures, and immediate usability", comparePath: "/compare/plain-tools-vs-pdf24" },
  { slug: "executive", label: "Executive Teams", keyword: "executive", docs: "board packs, approval PDFs, and confidential strategy decks", risk: "executive files often include confidential financials, signatures, and internal plans", nextStep: "board circulation, investor review, or final sign-off", review: "page order, visual polish, signatures, and circulation readiness", comparePath: "/compare/plain-tools-vs-nitro-pdf-pro" },
  { slug: "marketing", label: "Marketing Teams", keyword: "marketing", docs: "campaign approvals, media kits, and partner-ready PDFs", risk: "marketing files can contain unreleased assets, campaign budgets, and partner-only comments", nextStep: "campaign sign-off, partner delivery, or launch archive", review: "visual quality, page order, file size, and external-delivery readiness", comparePath: "/compare/plain-tools-vs-canva-pdf-tools" },
  { slug: "commercial-real-estate", label: "Commercial Real Estate Teams", keyword: "commercial real estate", docs: "lease exhibits, diligence packs, and signer-ready property PDFs", risk: "commercial property files often contain signatures, pricing, tenant data, and broker comments", nextStep: "lease review, lender delivery, or transaction archive", review: "signatures, page order, metadata, and client-share polish", comparePath: "/compare/plain-tools-vs-dochub" },
  { slug: "nonprofit-operations", label: "Nonprofit Operations Teams", keyword: "nonprofit operations", docs: "board packets, grant appendices, and donor-ready PDFs", risk: "nonprofit operations files can contain donor records, signatures, governance notes, and grant evidence", nextStep: "board circulation, donor delivery, or grant submission", review: "redactions, signatures, page order, and external-share readiness", comparePath: "/compare/plain-tools-vs-lightpdf" },
  { slug: "engineering-ops", label: "Engineering Operations Teams", keyword: "engineering operations", docs: "runbooks, release evidence, and incident review PDFs", risk: "engineering operations files can contain internal architecture details, client incidents, and security-sensitive notes", nextStep: "release review, incident follow-up, or audit retention", review: "diagram readability, page order, searchable text, and archive fitness", comparePath: "/compare/plain-tools-vs-updf" },
  { slug: "vendor-management", label: "Vendor Management Teams", keyword: "vendor management", docs: "supplier packets, onboarding forms, and approval PDFs", risk: "vendor files mix bank details, signatures, tax data, and commercial terms", nextStep: "supplier onboarding, legal review, or procurement retention", review: "signatures, metadata, completeness, and external-share quality", comparePath: "/compare/plain-tools-vs-pdfgear" },
  { slug: "government-procurement", label: "Government Procurement Teams", keyword: "government procurement", docs: "bid packets, vendor forms, and regulated submission PDFs", risk: "public-sector procurement files include signatures, regulated attachments, pricing, and bid evidence", nextStep: "regulated submission, vendor review, or archive retention", review: "page order, searchable text, signatures, and filing readiness", comparePath: "/compare/plain-tools-vs-smallpdf" },
  { slug: "research-admin", label: "Research Administration Teams", keyword: "research administration", docs: "grant packs, ethics forms, and controlled review PDFs", risk: "research-admin files can contain participant details, regulated approvals, and unpublished work", nextStep: "grant submission, ethics review, or institutional archive", review: "redactions, OCR quality, signatures, and archive readiness", comparePath: "/compare/plain-tools-vs-updf" },
  { slug: "investor-relations", label: "Investor Relations Teams", keyword: "investor relations", docs: "board decks, announcement packs, and investor-ready PDFs", risk: "investor-relations files often contain market-sensitive financials, signatures, and draft disclosure language", nextStep: "board review, investor delivery, or compliance archive", review: "visual polish, metadata, signatures, and circulation readiness", comparePath: "/compare/plain-tools-vs-nitro-pdf-pro" },
  { slug: "marketing-agency", label: "Marketing Agency Teams", keyword: "marketing agency", docs: "client proofs, campaign approvals, and partner-ready PDFs", risk: "agency files often contain client comments, unreleased creative, budgets, and contract attachments", nextStep: "client review, campaign approval, or launch archive", review: "visual fidelity, page order, file size, and client-share readiness", comparePath: "/compare/plain-tools-vs-canva-pdf-tools" },
  { slug: "nonprofit-fundraising", label: "Nonprofit Fundraising Teams", keyword: "nonprofit fundraising", docs: "donor packets, board attachments, and grant-ready PDFs", risk: "fundraising files often contain donor records, signatures, financial details, and governance notes", nextStep: "donor delivery, board circulation, or grant submission", review: "redactions, signatures, file size, and external-share readiness", comparePath: "/compare/plain-tools-vs-lightpdf" },
  { slug: "engineering-cad", label: "Engineering CAD Teams", keyword: "engineering cad", docs: "drawing packs, review sets, and issue-tracking PDFs", risk: "CAD exports can contain internal specs, site details, and revision history meant for limited reviewers", nextStep: "client review, permit submission, or archive retention", review: "drawing readability, page order, searchable text, and orientation", comparePath: "/compare/plain-tools-vs-updf" },
  { slug: "creative", label: "Creative Teams", keyword: "creative", docs: "proof decks, approval PDFs, and presentation-ready review packs", risk: "creative files often contain unreleased assets, review comments, and client-sensitive direction", nextStep: "client approval, production handoff, or archive packaging", review: "visual quality, annotations, page order, and final-delivery polish", comparePath: "/compare/plain-tools-vs-canva-pdf-tools" },
  { slug: "legal-advanced", label: "Advanced Legal Teams", keyword: "advanced legal", docs: "discovery packets, exhibits, production sets, and signer-ready agreements", risk: "advanced legal files often contain privileged review notes, PII, signatures, and court-sensitive attachments", nextStep: "court filing, outside counsel review, or discovery production", review: "bates order, redactions, signatures, metadata, and filing readiness", comparePath: "/compare/plain-tools-vs-adobe-acrobat-online" },
  { slug: "government-forms", label: "Government Forms Teams", keyword: "government forms", docs: "portal submissions, attestations, and regulated form PDFs", risk: "government-form files often contain identity data, signatures, regulated attachments, and validation-sensitive fields", nextStep: "portal submission, regulator review, or retention archive", review: "flattening, OCR quality, signatures, and submission readiness", comparePath: "/compare/plain-tools-vs-smallpdf" },
  { slug: "insurance-claims", label: "Insurance Claims Teams", keyword: "insurance claims", docs: "claim packets, scanned evidence, and signed settlement PDFs", risk: "claims files often contain customer identifiers, payment records, signatures, and sensitive evidence", nextStep: "claims review, adjuster handoff, or regulated archive", review: "OCR quality, page order, signatures, metadata, and file size", comparePath: "/compare/plain-tools-vs-foxit-pdf" },
  { slug: "finance-ops", label: "Finance Operations Teams", keyword: "finance operations", docs: "close packs, approval PDFs, and vendor-ready attachments", risk: "finance-ops files often contain bank data, payroll records, signatures, and commercial terms", nextStep: "approver review, vendor handoff, or audit archive", review: "totals, signatures, file size, and packet order", comparePath: "/compare/plain-tools-vs-pdf24" },
  { slug: "board-governance", label: "Board Governance Teams", keyword: "board governance", docs: "board books, committee packs, and confidential approval PDFs", risk: "board-governance files often contain sensitive financials, signatures, and internal commentary", nextStep: "board circulation, committee review, or secure retention", review: "page order, watermarks, signatures, and circulation readiness", comparePath: "/compare/plain-tools-vs-nitro-pdf-pro" },
  { slug: "healthcare-records", label: "Healthcare Records Teams", keyword: "healthcare records", docs: "patient records, scanned claims, and regulated review PDFs", risk: "records files often contain patient identifiers, treatment notes, signatures, and regulated attachments", nextStep: "records review, patient handoff, or regulated archive", review: "redactions, OCR quality, orientation, and packet completeness", comparePath: "/compare/plain-tools-vs-sejda" },
  { slug: "brokerage-real-estate", label: "Brokerage Real Estate Teams", keyword: "brokerage real estate", docs: "listing packets, disclosures, and signer-ready transaction PDFs", risk: "brokerage files often contain signatures, addresses, financial disclosures, and client-only notes", nextStep: "client signature, brokerage review, or transaction archive", review: "signatures, page order, metadata, and delivery polish", comparePath: "/compare/plain-tools-vs-dochub" },
  { slug: "education-student-services", label: "Education Student Services", keyword: "education student services", docs: "student forms, records packets, and policy PDFs", risk: "student-services files often contain student identifiers, signatures, grades, and internal case notes", nextStep: "student review, records processing, or secure communication", review: "OCR quality, redactions, file size, and handoff readiness", comparePath: "/compare/plain-tools-vs-pdfescape" },
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
  { slug: "compress-portal-submissions", title: "Compress Portal Submission PDFs", toolSlug: "compress-pdf", keyword: "compress pdf for upload", problem: "strict portal limits reject otherwise valid documents", goal: "reduce the file enough to pass the upload gate while keeping the important pages readable", faqLead: "portal upload", canonicalVariantPath: "/pdf-tools/compress-pdf/large-files", relatedToolSlugs: ["ocr-pdf", "merge-pdf", "protect-pdf", "pdf-to-jpg"] },
  { slug: "prepare-client-evidence-bundles", title: "Prepare Client Evidence Bundles", toolSlug: "merge-pdf", keyword: "merge evidence pdf", problem: "supporting documents arrive as scattered files instead of one usable packet", goal: "bundle the evidence locally into one review-ready PDF with the right order and fewer missing pages", faqLead: "evidence order", canonicalVariantPath: "/pdf-tools/merge-pdf/mac", relatedToolSlugs: ["split-pdf", "compress-pdf", "compare-pdf", "protect-pdf"] },
  { slug: "create-searchable-archives", title: "Create Searchable PDF Archives", toolSlug: "ocr-pdf", keyword: "make scanned pdf searchable", problem: "archived scans are unreadable to search and painful to review later", goal: "turn archival scans into searchable PDFs before they hit long-term storage or compliance review", faqLead: "archive OCR", canonicalVariantPath: "/pdf-tools/ocr-pdf/scanned", relatedToolSlugs: ["offline-ocr", "metadata-purge", "compress-pdf", "pdf-to-word"] },
  { slug: "sanitize-external-share-copy", title: "Sanitize the External Share Copy", toolSlug: "metadata-purge", keyword: "sanitize pdf metadata", problem: "the visible PDF is fine but hidden fields still expose internal context", goal: "strip metadata locally so the external share copy reveals less than the working draft", faqLead: "hidden metadata", relatedToolSlugs: ["redact-pdf", "protect-pdf", "sign-pdf", "compare-pdf"] },
  { slug: "unlock-approved-pdfs", title: "Unlock Approved PDF Copies", toolSlug: "unlock-pdf", keyword: "unlock pdf locally", problem: "the team has the password but still needs a working copy for the next approved step", goal: "unlock the document locally without sending the protected original to another service", faqLead: "approved unlock", relatedToolSlugs: ["protect-pdf", "fill-pdf", "sign-pdf", "compare-pdf"] },
  { slug: "convert-pdf-pages-to-jpg-previews", title: "Convert PDF Pages to JPG Previews", toolSlug: "pdf-to-jpg", keyword: "pdf to jpg preview", problem: "reviewers need quick image previews instead of a full PDF handoff", goal: "export shareable page previews locally so teams can review or post them without another conversion step", faqLead: "jpg previews", relatedToolSlugs: ["jpg-to-pdf", "compress-pdf", "watermark-pdf", "compare-pdf"] },
  { slug: "build-image-pdf-packets", title: "Build Image PDF Packets", toolSlug: "jpg-to-pdf", keyword: "images to pdf packet", problem: "camera shots and screenshots need to become one stable packet", goal: "package several images into a PDF locally before they move into review, upload, or signing", faqLead: "image packet", relatedToolSlugs: ["compress-pdf", "rotate-pdf", "merge-pdf", "protect-pdf"] },
  { slug: "package-html-reports-as-pdf", title: "Package HTML Reports as PDF", toolSlug: "html-to-pdf", keyword: "html to pdf report", problem: "browser-based reports still need a stable PDF version for review and archive", goal: "capture the report locally as PDF before it heads into approval, archive, or delivery", faqLead: "html export", relatedToolSlugs: ["text-to-pdf", "word-to-pdf", "compress-pdf", "protect-pdf"] },
  { slug: "mark-approval-drafts", title: "Mark Approval Drafts", toolSlug: "watermark-pdf", keyword: "watermark draft pdf", problem: "review copies risk being mistaken for the final approved version", goal: "add a visible draft marker locally before the document circulates to approvers or partners", faqLead: "draft labels", relatedToolSlugs: ["annotate-pdf", "protect-pdf", "sign-pdf", "compress-pdf"] },
  { slug: "prepare-signed-form-packets", title: "Prepare Signed Form Packets", toolSlug: "fill-pdf", keyword: "fill and sign pdf packet", problem: "forms need to be completed accurately before they move into signature or archive workflows", goal: "fill the form locally and hand off a cleaner packet for signing, review, or retention", faqLead: "form packets", relatedToolSlugs: ["sign-pdf", "protect-pdf", "merge-pdf", "metadata-purge"] },
  { slug: "redact-for-gdpr", title: "Redact PDF for GDPR and Sensitive Review", toolSlug: "redact-pdf", keyword: "redact pdf for gdpr", problem: "the file cannot move forward until personal data, privileged notes, or regulated details are removed correctly", goal: "create a safer review copy locally before the document enters discovery, audit, client review, or external sharing", faqLead: "gdpr redaction", canonicalVariantPath: "/pdf-tools/redact-pdf/legal", relatedToolSlugs: ["metadata-purge", "protect-pdf", "compare-pdf", "annotate-pdf"] },
  { slug: "sign-nda", title: "Sign NDA PDFs", toolSlug: "sign-pdf", keyword: "sign nda pdf", problem: "the NDA is approved in principle but still needs a clean local signature workflow before circulation", goal: "place the signature locally and produce a signer-ready copy without pushing a confidential agreement into another upload-first service", faqLead: "nda signature", canonicalVariantPath: "/pdf-tools/sign-pdf/no-upload", relatedToolSlugs: ["fill-pdf", "protect-pdf", "merge-pdf", "metadata-purge"] },
  { slug: "merge-contracts", title: "Merge Contract PDFs", toolSlug: "merge-pdf", keyword: "merge contracts pdf", problem: "contract exhibits, schedules, and signed addenda arrive as scattered files instead of one usable packet", goal: "bundle the right agreements into one locally prepared packet that is easier to route for review, signature, or submission", faqLead: "contract packet order", canonicalVariantPath: "/pdf-tools/merge-pdf/legal", relatedToolSlugs: ["split-pdf", "compare-pdf", "compress-pdf", "protect-pdf"] },
  { slug: "ocr-scanned-forms", title: "OCR Scanned Forms", toolSlug: "ocr-pdf", keyword: "ocr scanned forms pdf", problem: "paper-origin forms are unreadable to search, route, or verify because the text is trapped inside image scans", goal: "turn scanned forms into searchable PDFs locally before teams review, archive, or upload them to a controlled system", faqLead: "form OCR quality", canonicalVariantPath: "/pdf-tools/ocr-pdf/scanned", relatedToolSlugs: ["rotate-pdf", "compress-pdf", "metadata-purge", "pdf-to-word"] },
  { slug: "bates-numbering", title: "Apply Bates Numbering to PDFs", toolSlug: "watermark-pdf", keyword: "bates numbering pdf", problem: "review packets need stable reference numbers before counsel, auditors, or reviewers can cite pages consistently", goal: "apply visible numbering locally so the packet is easier to reference without creating another cloud copy of sensitive files", faqLead: "bates numbering", canonicalVariantPath: "/pdf-tools/bates-numbering/legal", relatedToolSlugs: ["merge-pdf", "compare-pdf", "redact-pdf", "protect-pdf"] },
  { slug: "flatten-for-court", title: "Flatten PDF Forms for Court and Filing", toolSlug: "fill-pdf", keyword: "flatten pdf for court", problem: "fillable or layered PDFs can break when the court, regulator, or archive system expects a flattened share copy", goal: "export a flatter, more stable PDF locally before the file heads into court filing, regulated upload, or external review", faqLead: "flattened filing copy", relatedToolSlugs: ["sign-pdf", "protect-pdf", "compress-pdf", "merge-pdf"] },
  { slug: "anonymize-metadata", title: "Anonymize PDF Metadata", toolSlug: "metadata-purge", keyword: "anonymize pdf metadata", problem: "the visible pages look safe, but hidden author fields, revision traces, and document properties still expose context", goal: "strip identifying metadata locally so the outbound copy reveals less than the working version", faqLead: "metadata anonymization", canonicalVariantPath: "/pdf-tools/metadata-purge/legal", relatedToolSlugs: ["redact-pdf", "protect-pdf", "compare-pdf", "sign-pdf"] },
  { slug: "compress-for-email-secure", title: "Compress PDF for Secure Email", toolSlug: "compress-pdf", keyword: "compress pdf for secure email", problem: "email and secure-message limits reject the document even though the next reviewer still needs a readable PDF copy", goal: "reduce file size locally so the document can be sent securely without routing a sensitive file through a third-party compression queue", faqLead: "secure email size", canonicalVariantPath: "/pdf-tools/compress-pdf/for-email", relatedToolSlugs: ["protect-pdf", "metadata-purge", "merge-pdf", "ocr-pdf"] },
  { slug: "annotate-review-copies", title: "Annotate PDF Review Copies", toolSlug: "annotate-pdf", keyword: "annotate pdf review copy", problem: "review feedback lives outside the document and slows down the next approval pass", goal: "add focused notes locally so the next reviewer can act on one shareable marked-up PDF", faqLead: "review annotations", canonicalVariantPath: "/pdf-tools/annotate-pdf/legal", relatedToolSlugs: ["compare-pdf", "watermark-pdf", "merge-pdf", "protect-pdf"] },
  { slug: "watermark-board-packs", title: "Watermark Board Packs", toolSlug: "watermark-pdf", keyword: "watermark board pack pdf", problem: "draft or confidential packs can be mistaken for final circulation copies", goal: "apply clear local watermarking before the file reaches directors, auditors, or partners", faqLead: "board-pack watermarking", canonicalVariantPath: "/pdf-tools/watermark-pdf/private-sharing", relatedToolSlugs: ["annotate-pdf", "protect-pdf", "compress-pdf", "merge-pdf"] },
  { slug: "fill-client-intake-forms", title: "Fill Client Intake Forms", toolSlug: "fill-pdf", keyword: "fill client intake pdf", problem: "fillable PDFs slow down because staff still have to move between apps just to complete the first pass", goal: "complete intake forms locally before routing them for signature, approval, or storage", faqLead: "filled intake forms", canonicalVariantPath: "/pdf-tools/form-fill/legal", relatedToolSlugs: ["sign-pdf", "metadata-purge", "protect-pdf", "merge-pdf"] },
  { slug: "compare-version-changes", title: "Compare PDF Version Changes", toolSlug: "compare-pdf", keyword: "compare pdf versions", problem: "stakeholders cannot see what changed between draft and final files quickly enough", goal: "compare two versions locally before legal, finance, or board review continues", faqLead: "pdf version comparison", canonicalVariantPath: "/pdf-tools/compare-pdf/legal", relatedToolSlugs: ["annotate-pdf", "merge-pdf", "protect-pdf", "metadata-purge"] },
  { slug: "reorder-board-decks", title: "Reorder PDF Board Decks", toolSlug: "reorder-pdf", keyword: "reorder pdf board deck", problem: "the file is nearly ready, but the page sequence still undermines the next review or circulation step", goal: "reorder pages locally so the final packet reads cleanly before it goes outward", faqLead: "page sequence", canonicalVariantPath: "/pdf-tools/reorder-pdf/board-packs", relatedToolSlugs: ["merge-pdf", "compress-pdf", "annotate-pdf", "watermark-pdf"] },
  { slug: "prepare-vendor-packets", title: "Prepare Vendor PDF Packets", toolSlug: "merge-pdf", keyword: "prepare vendor pdf packet", problem: "supplier review stalls because required forms and exhibits are still scattered across separate files", goal: "bundle the vendor packet locally so the next reviewer gets one cleaner PDF instead of an email thread full of attachments", faqLead: "vendor packet order", canonicalVariantPath: "/pdf-tools/merge-pdf/vendor-packets", relatedToolSlugs: ["compress-pdf", "protect-pdf", "metadata-purge", "compare-pdf"] },
  { slug: "extract-approval-pages", title: "Extract Approval Pages", toolSlug: "extract-pdf", keyword: "extract approval pages pdf", problem: "approvers only need a narrow subset of pages but keep receiving the full packet", goal: "pull the exact pages locally so the next approval round is lighter and easier to understand", faqLead: "approval pages", canonicalVariantPath: "/pdf-tools/extract-pages/how-to", relatedToolSlugs: ["split-pdf", "merge-pdf", "compress-pdf", "protect-pdf"] },
  { slug: "convert-word-briefs-to-pdf", title: "Convert Word Briefs to PDF", toolSlug: "word-to-pdf", keyword: "convert word brief to pdf", problem: "the working draft is still in Word and the next step requires a stable PDF copy", goal: "lock the brief into a cleaner PDF locally before review, filing, or delivery", faqLead: "word to pdf brief", canonicalVariantPath: "/pdf-tools/word-to-pdf/how-to", relatedToolSlugs: ["compress-pdf", "protect-pdf", "annotate-pdf", "merge-pdf"] },
  { slug: "rotate-scanned-evidence", title: "Rotate Scanned Evidence", toolSlug: "rotate-pdf", keyword: "rotate scanned evidence pdf", problem: "sideways pages make the packet harder to read, cite, or upload", goal: "correct orientation locally before the PDF goes into review, production, or archive", faqLead: "rotated scans", canonicalVariantPath: "/pdf-tools/rotate-pdf/scanned", relatedToolSlugs: ["ocr-pdf", "compress-pdf", "merge-pdf", "annotate-pdf"] },
  { slug: "protect-board-pdfs", title: "Protect Board PDFs", toolSlug: "protect-pdf", keyword: "protect board pdf", problem: "sensitive board or executive files need a clearer access boundary before circulation", goal: "apply protection locally before the PDF leaves the working team", faqLead: "board pdf protection", canonicalVariantPath: "/pdf-tools/protect-pdf/private-sharing", relatedToolSlugs: ["watermark-pdf", "metadata-purge", "compress-pdf", "sign-pdf"] },
  { slug: "unlock-reference-copies", title: "Unlock Reference Copies", toolSlug: "unlock-pdf", keyword: "unlock reference pdf locally", problem: "the team has permission to work with the file, but the protected copy still blocks the next approved step", goal: "unlock the PDF locally before reuse in an internal or approved workflow", faqLead: "approved unlock", canonicalVariantPath: "/pdf-tools/remove-pdf-password", relatedToolSlugs: ["protect-pdf", "fill-pdf", "sign-pdf", "compare-pdf"] },
  { slug: "summarize-meeting-packets", title: "Summarize PDF Meeting Packets", toolSlug: "ai-summarize-pdf", keyword: "summarize pdf meeting packet", problem: "reviewers are asked to read long packets without a short briefing layer for the next decision", goal: "generate a local-first summary workflow so readers can scan the packet faster before review", faqLead: "packet summary", canonicalVariantPath: "/pdf-tools/ai-summarize-pdf/education", relatedToolSlugs: ["annotate-pdf", "compare-pdf", "compress-pdf", "merge-pdf"] },
  { slug: "sanitize-client-share-copy", title: "Sanitize Client Share Copies", toolSlug: "metadata-purge", keyword: "sanitize client share pdf", problem: "the visible pages are ready, but hidden properties or revision traces still make the file risky to send", goal: "strip metadata locally so the outbound copy reveals less than the working draft", faqLead: "share copy metadata", canonicalVariantPath: "/pdf-tools/metadata-purge/private-sharing", relatedToolSlugs: ["redact-pdf", "protect-pdf", "compare-pdf", "sign-pdf"] },
  { slug: "build-audit-evidence-packets", title: "Build Audit Evidence Packets", toolSlug: "merge-pdf", keyword: "build audit evidence pdf", problem: "audit support stays fragmented across files and slows down the reviewer who needs a coherent packet", goal: "assemble a cleaner evidence PDF locally before the audit or compliance review begins", faqLead: "audit evidence packet", canonicalVariantPath: "/pdf-tools/merge-pdf/audit-ready", relatedToolSlugs: ["bates-numbering", "compress-pdf", "ocr-pdf", "protect-pdf"] },
  { slug: "prepare-portfolio-proof-pdfs", title: "Prepare Portfolio Proof PDFs", toolSlug: "pdf-to-jpg", keyword: "prepare portfolio proof pdf", problem: "creative or design review needs stable preview pages rather than one heavy PDF nobody annotates clearly", goal: "convert and package cleaner proof assets locally before the review or client delivery step", faqLead: "portfolio proofs", canonicalVariantPath: "/pdf-tools/pdf-to-jpg/no-upload", relatedToolSlugs: ["annotate-pdf", "watermark-pdf", "compress-pdf", "jpg-to-pdf"] },
  { slug: "package-html-reports", title: "Package HTML Reports as PDF", toolSlug: "html-to-pdf", keyword: "package html report pdf", problem: "browser-based dashboards and reports still need a stable PDF handoff for approval or archive", goal: "capture the report locally as PDF before it heads into review, archive, or circulation", faqLead: "html report export", canonicalVariantPath: "/pdf-tools/how-to-compress-pdf", relatedToolSlugs: ["compress-pdf", "protect-pdf", "merge-pdf", "text-to-pdf"] },
  { slug: "convert-notes-to-pdf", title: "Convert Text Notes to PDF", toolSlug: "text-to-pdf", keyword: "convert notes to pdf", problem: "plain notes or quick drafts need a more stable PDF format before they enter review or records storage", goal: "turn working notes into a cleaner PDF locally before the next team touches them", faqLead: "notes to pdf", relatedToolSlugs: ["word-to-pdf", "protect-pdf", "compress-pdf", "merge-pdf"] },
  { slug: "prepare-disclosure-packets", title: "Prepare Disclosure Packets", toolSlug: "merge-pdf", keyword: "prepare disclosure pdf packet", problem: "disclosure documents, appendices, and signatures arrive as separate PDFs and weaken the next review handoff", goal: "assemble a coherent disclosure packet locally before legal, finance, or investor circulation", faqLead: "disclosure packet", canonicalVariantPath: "/pdf-tools/merge-pdf/finance", relatedToolSlugs: ["compress-pdf", "protect-pdf", "metadata-purge", "sign-pdf"] },
  { slug: "stabilize-form-submissions", title: "Stabilize Form Submission PDFs", toolSlug: "fill-pdf", keyword: "stabilize form submission pdf", problem: "fillable or inconsistent PDFs break at the exact moment a portal or approver expects a stable copy", goal: "fill and stabilize the document locally before it moves into filing, onboarding, or regulated submission", faqLead: "stable submission copy", canonicalVariantPath: "/pdf-tools/form-fill/government", relatedToolSlugs: ["sign-pdf", "flatten-for-court", "protect-pdf", "compress-pdf"] },
  { slug: "redact-compliance", title: "Redact Compliance Copies", toolSlug: "redact-pdf", keyword: "redact compliance pdf", problem: "regulated or confidential material cannot leave the team until the outward copy removes the right details", goal: "create a safer compliance-facing PDF locally before the next review or submission step", faqLead: "compliance redaction", canonicalVariantPath: "/pdf-tools/redact-pdf/compliance", relatedToolSlugs: ["metadata-purge", "protect-pdf", "compare-pdf", "annotate-pdf"] },
  { slug: "sign-contract-batch", title: "Sign Contract Batches", toolSlug: "sign-pdf", keyword: "sign contract batch pdf", problem: "multiple agreements still need signatures and the team cannot afford a messy upload-first loop for each one", goal: "run a cleaner local signing workflow across a contract batch before circulation or archive", faqLead: "contract batch signing", canonicalVariantPath: "/pdf-tools/sign-pdf/legal", relatedToolSlugs: ["fill-pdf", "merge-pdf", "protect-pdf", "metadata-purge"] },
  { slug: "ocr-invoice-scan", title: "OCR Invoice Scans", toolSlug: "ocr-pdf", keyword: "ocr invoice scan pdf", problem: "scanned invoices are unreadable to search, audit, or route because the text is trapped in image pages", goal: "turn invoice scans into searchable PDFs locally before finance, audit, or claims review continues", faqLead: "invoice OCR", canonicalVariantPath: "/pdf-tools/ocr-pdf/finance", relatedToolSlugs: ["compress-pdf", "metadata-purge", "pdf-to-word", "rotate-pdf"] },
  { slug: "compress-legal-doc-secure", title: "Compress Legal PDFs Securely", toolSlug: "compress-pdf", keyword: "compress legal pdf secure", problem: "sensitive legal or regulated files exceed attachment or portal limits right before they need to be shared", goal: "reduce PDF size locally before secure email, filing, or review without routing the document through another upload queue", faqLead: "secure legal compression", canonicalVariantPath: "/pdf-tools/compress-pdf/legal", relatedToolSlugs: ["protect-pdf", "metadata-purge", "merge-pdf", "ocr-pdf"] },
  { slug: "merge-transaction-exhibits", title: "Merge Transaction Exhibits", toolSlug: "merge-pdf", keyword: "merge transaction exhibits pdf", problem: "deals and disclosures stall because exhibits, schedules, and approvals are still spread across separate files", goal: "assemble one cleaner transaction packet locally before counsel, finance, or client review", faqLead: "transaction exhibit order", canonicalVariantPath: "/pdf-tools/merge-pdf/finance", relatedToolSlugs: ["compare-pdf", "compress-pdf", "protect-pdf", "metadata-purge"] },
  { slug: "annotate-design-proof-pdfs", title: "Annotate Design Proof PDFs", toolSlug: "annotate-pdf", keyword: "annotate design proof pdf", problem: "feedback stays scattered across messages instead of living on one shareable proof document", goal: "mark up the proof locally before the next designer, stakeholder, or client review", faqLead: "design proof annotations", canonicalVariantPath: "/pdf-tools/annotate-pdf/education", relatedToolSlugs: ["compare-pdf", "watermark-pdf", "compress-pdf", "pdf-to-jpg"] },
  { slug: "sanitize-board-copies", title: "Sanitize Board PDF Copies", toolSlug: "metadata-purge", keyword: "sanitize board pdf copy", problem: "the visible pages are board-ready but hidden metadata or revision traces still expose internal context", goal: "strip metadata locally before confidential board or executive circulation", faqLead: "board copy metadata", canonicalVariantPath: "/pdf-tools/metadata-purge/private-sharing", relatedToolSlugs: ["protect-pdf", "watermark-pdf", "compare-pdf", "sign-pdf"] },
  { slug: "protect-claim-packets", title: "Protect Claim Packets", toolSlug: "protect-pdf", keyword: "protect claim packet pdf", problem: "claim and case files need a clearer access boundary before they move into external review or archive", goal: "apply document protection locally before the packet leaves the working team", faqLead: "claim packet protection", canonicalVariantPath: "/pdf-tools/protect-pdf/finance", relatedToolSlugs: ["metadata-purge", "compress-pdf", "merge-pdf", "sign-pdf"] },
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
    desc: buildMetaDescription(`${workflow.title} for ${industry.label.toLowerCase()} with 100% local processing, no upload, files never leaving your device, and privacy-first document handling on Plain Tools.`),
    industry: industry.slug,
    keywords: [
      `${workflow.keyword} for ${industry.keyword}`,
      `${workflow.keyword} no upload`,
      `${industry.keyword} pdf workflow`,
      `${workflow.keyword} offline`,
      `${workflow.keyword} private`,
      "privacy-first pdf tools",
      "local browser processing",
    ],
    title: `${workflow.title} for ${industry.label} (Local, No Upload, Private) | Plain Tools`,
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

const PRIORITY_INDUSTRIES = new Set([
  "legal",
  "hr-recruitment",
  "accounting-finance",
  "healthcare",
  "real-estate",
  "government-compliance",
  "education-admin",
  "marketing",
  "commercial-real-estate",
  "vendor-management",
  "government-procurement",
  "marketing-agency",
  "legal-advanced",
  "insurance-claims",
  "board-governance",
])

const PRIORITY_WORKFLOWS = new Set([
  "redact-for-gdpr",
  "sign-nda",
  "merge-contracts",
  "ocr-scanned-forms",
  "bates-numbering",
  "flatten-for-court",
  "anonymize-metadata",
  "compress-for-email-secure",
  "compress-shared-pdfs",
  "merge-document-packets",
  "ocr-scanned-records",
  "annotate-review-copies",
  "compare-version-changes",
  "build-audit-evidence-packets",
  "prepare-disclosure-packets",
  "redact-compliance",
  "sign-contract-batch",
  "ocr-invoice-scan",
  "compress-legal-doc-secure",
])

function intro(tool: ToolDefinition, industry: IndustryDefinition, workflow: WorkflowDefinition) {
  return [
    `${workflow.title} for ${industry.label.toLowerCase()} is usually a live workflow query. People land here when ${workflow.problem}, and the file is already part of ${industry.docs}. The goal is to solve that bottleneck quickly without adding another upload step.`,
    `That is why Plain Tools leans so hard on local processing. ${industry.risk}. This route pairs the live ${tool.name.toLowerCase()} workspace with the review context needed before the file moves into ${industry.nextStep}.`,
    `The positioning is deliberate: 100% local processing, no upload, and files never leaving your device during the core step. For ${industry.label.toLowerCase()}, that matters because the workflow is usually blocked by trust and review readiness.`,
  ]
}

function why(industry: IndustryDefinition, workflow: WorkflowDefinition) {
  return [
    `${industry.label} do not usually need another generic PDF homepage. They need a route that recognises why ${workflow.problem} matters in their environment and how it affects the next handoff. This page is written around that narrower question.`,
    `A stronger programmatic page is useful because it keeps the explanation anchored to a professional job-to-be-done. Here that means ${workflow.goal}, while still reminding the reader to verify ${industry.review} before treating the output as final.`,
    `That combination of workflow intent plus review guidance is what keeps the page from being a thin variant. It explains why the output has to survive ${industry.nextStep} without exposing more of the document than necessary.`,
  ]
}

function how(tool: ToolDefinition, industry: IndustryDefinition) {
  return [
    `Open the live ${tool.name.toLowerCase()} panel below with the real working file. Plain Tools keeps the core transformation in the browser, so the document stays on-device during the main step rather than bouncing through an upload-first queue.`,
    `That local workflow is only valuable if the result is ready for the next team. For ${industry.label.toLowerCase()}, the review should focus on ${industry.review}. This page exists to spell that out clearly instead of assuming every workflow ends the moment the download finishes.`,
    `If the file still needs one more change after the main step, the page points into adjacent local tools and variants. That reduces the chance of sending the same sensitive packet through multiple utilities just to finish one workflow.`,
  ]
}

function steps(industry: IndustryDefinition, workflow: WorkflowDefinition): ProgrammaticHowToStep[] {
  return [
    { name: "Load the real working file", text: `Use the actual document that needs to move into ${industry.nextStep}, not a throwaway sample. That keeps the checks relevant to the real job.` },
    { name: `Run ${workflow.title.toLowerCase()} locally`, text: `Process the file in the browser so the core task happens on-device. That is the privacy-first default when the document contains material ${industry.label.toLowerCase()} handle every day.` },
    { name: "Review the output against the next handoff", text: `Check ${industry.review}. A successful download does not help if the receiving reviewer or portal still rejects the file.` },
    { name: "Confirm the privacy expectation before sharing", text: `Make sure the outgoing copy matches the privacy bar for ${industry.label.toLowerCase()}. The safest route is usually the one where the core transformation stayed local and the final file reveals only what the next step needs.` },
    { name: "Move to the next local fix only if needed", text: `If the file still needs OCR, protection, compression, metadata cleanup, or a cleaner review copy, stay inside the related-tools cluster instead of restarting elsewhere.` },
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
      title: "Why the privacy angle is part of product fit",
      paragraphs: [
        `For ${industry.label.toLowerCase()}, privacy is not decorative messaging. ${industry.risk}. Keeping the transformation local reduces exposure during the step that often happens before formal review or archive controls are applied.`,
        `That is why this route repeats the same operating model clearly: 100% local processing, no upload, and files never leaving your device during the core task.`,
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
    `In practical terms, this page is built for teams that want the result without the extra exposure. Files never leave your device for the main transformation, which is often the cleanest fit for regulated or confidential PDF work.`,
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
    { question: "Do files leave my device during the main workflow?", answer: "No. The core transformation is designed to run locally in the browser, so the file does not need to leave your device for the main step." },
    { question: `Why does this page talk about ${industry.nextStep}?`, answer: `Because a useful workflow page should prepare the file for the real handoff. The destination is what determines whether the output is actually done.` },
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

function workflowPriorityScore(entry: ProfessionalWorkflowEntry) {
  let score = 0

  if (PRIORITY_INDUSTRIES.has(entry.industry)) score += 6
  if (PRIORITY_WORKFLOWS.has(entry.workflow)) score += 6
  if (entry.toolSlug === "redact-pdf" || entry.toolSlug === "sign-pdf") score += 2
  if (entry.toolSlug === "merge-pdf" || entry.toolSlug === "ocr-pdf") score += 1

  return score
}

function orderedWorkflowEntries() {
  return [...PROFESSIONAL_WORKFLOW_MATRIX].sort((left, right) => {
    const scoreDiff = workflowPriorityScore(right) - workflowPriorityScore(left)
    if (scoreDiff !== 0) return scoreDiff

    const industryDiff = left.industry.localeCompare(right.industry)
    if (industryDiff !== 0) return industryDiff

    return left.workflow.localeCompare(right.workflow)
  })
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

  if (wordCount < 900) {
    throw new Error(`Workflow page ${canonicalPath} is below 900 words (${wordCount}).`)
  }

  return {
    ...entry,
    breadcrumbs: [
      { href: "/", label: "Home" },
      { href: "/guides", label: "Guides" },
      { href: `/guides/${industry.slug}`, label: industry.label },
      { label: workflow.title },
    ],
    canonicalPath,
    featureList: [
      `${workflow.title} in a browser-first workflow for ${industry.label.toLowerCase()}`,
      "100% local processing - no upload - files never leave your device",
      "No upload, no account gate, and task-specific review guidance",
      "Strong internal links into adjacent PDF tools, variants, and comparisons",
    ],
    heroBadges: ["professional workflow", "100% local", "no upload", "privacy-first"],
    h1: `${workflow.title} for ${industry.label}`,
    liveToolDescription: `Use the live ${tool.name.toLowerCase()} workspace below for ${industry.label.toLowerCase()}. The core workflow stays local in the browser - no upload, files never leaving your device for the main task.`,
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
      { href: `/guides/${industry.slug}`, label: `Browse ${industry.label} guides` },
      { href: `/tools/${tool.slug}`, label: `Open ${tool.name}` },
      { href: "/pdf-tools", label: "Browse PDF tools" },
      { href: industry.comparePath, label: "Read the closest privacy comparison" },
      ...(workflow.canonicalVariantPath ? [{ href: workflow.canonicalVariantPath, label: "Open the matching PDF variant" }] : []),
    ],
    wordCount,
  }
}

export function generateAllProfessionalWorkflowParams(limit?: number): ProfessionalWorkflowRouteParams[] {
  const orderedEntries = orderedWorkflowEntries()
  const entries = typeof limit === "number" ? orderedEntries.slice(0, limit) : orderedEntries
  return entries.map((entry) => ({ industry: entry.industry, workflow: entry.workflow }))
}

export function getProfessionalWorkflowSitemapPaths() {
  return PROFESSIONAL_WORKFLOW_MATRIX.map((entry) => workflowPath(entry.industry, entry.workflow))
}

export function getRelatedProfessionalWorkflowLinks(industry: string, workflow: string) {
  return getProfessionalWorkflowPage(industry, workflow)?.relatedLinks ?? []
}

function buildIndustryHubDescription(industry: IndustryDefinition) {
  return `${industry.label} workflow hub for local PDF preparation across ${industry.docs}. These guides focus on ${industry.review} before the next step: ${industry.nextStep}.`
}

export function getProfessionalWorkflowIndustryHub(
  industrySlug: string
): ProfessionalWorkflowIndustryHub | null {
  const industry = INDUSTRY_MAP.get(industrySlug)
  if (!industry) return null

  const entries = PROFESSIONAL_WORKFLOW_MATRIX.filter((entry) => entry.industry === industrySlug)
  const featuredWorkflows = entries
    .slice(0, 12)
    .flatMap((entry) => {
      const page = getProfessionalWorkflowPage(entry.industry, entry.workflow)
      if (!page) return []

      return [
        {
          description: page.desc,
          href: page.canonicalPath,
          title: page.h1,
          toolName: page.page.tool.name,
        },
      ]
    })
  const relatedToolLinks = Array.from(
    new Map(
      entries.map((entry) => {
        const tool = mustGetTool(entry.toolSlug)
        return [
          tool.slug,
          {
            href: `/tools/${tool.slug}`,
            label: `Use ${tool.name} locally`,
          },
        ]
      })
    ).values()
  ).slice(0, 6)

  return {
    canonicalPath: `/guides/${industry.slug}`,
    comparePath: industry.comparePath,
    description: buildIndustryHubDescription(industry),
    featuredWorkflows,
    label: industry.label,
    relatedToolLinks,
    slug: industry.slug,
    workflowCount: entries.length,
  }
}

export function getProfessionalWorkflowIndustryHubs() {
  return INDUSTRIES.map((industry) => getProfessionalWorkflowIndustryHub(industry.slug)).filter(
    (hub): hub is ProfessionalWorkflowIndustryHub => Boolean(hub)
  )
}

export const PROFESSIONAL_WORKFLOW_METADATA_EXAMPLES = [
  getProfessionalWorkflowPage("legal", "redact-for-gdpr"),
  getProfessionalWorkflowPage("hr-recruitment", "sign-nda"),
  getProfessionalWorkflowPage("accounting-finance", "merge-contracts"),
  getProfessionalWorkflowPage("healthcare", "ocr-scanned-forms"),
  getProfessionalWorkflowPage("government-compliance", "flatten-for-court"),
  getProfessionalWorkflowPage("education-admin", "compress-for-email-secure"),
].filter((entry): entry is ProfessionalWorkflowPage => Boolean(entry)).map((entry) => ({
  description: entry.desc,
  path: entry.canonicalPath,
  title: entry.title,
}))
