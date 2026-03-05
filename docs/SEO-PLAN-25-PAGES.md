# Plain.tools SEO Plan - 25 Pages

## Objective
Reach 200k+ monthly organic sessions by building high-intent content around private PDF workflows, offline processing, and trust verification.

## 1) Strategy Summary

### Content clusters and intent fit
- **Cluster A - Privacy and trust explainers (`/learn`)**:
  Targets users asking if PDF tools are safe, private, or compliant. Intent is informational, with trust conversion to `/verify-claims` and tool pages.
- **Cluster B - Workflow how-tos (`/learn/workflows`)**:
  Targets task-led queries such as "merge for visa" or "compress for upload limit". Intent is practical how-to with strong tool activation.
- **Cluster C - Competitor and alternatives (`/compare`)**:
  Targets commercial investigation queries such as "X alternative" and "best no-upload PDF tool".
- **Cluster D - Glossary and technical explainers (`/learn/glossary`)**:
  Captures long-tail educational demand and supports topical authority.
- **Cluster E - Evidence-based blog posts (`/blog`)**:
  Supports shareability and links into trust and tool pages; used for freshness and branded search growth.

### Internal linking system
- **Hub -> spoke model**:
  - `/learn` links to all privacy/workflow/glossary spokes.
  - `/compare` links to all comparison spokes.
  - `/tools` links to key how-to and privacy spokes.
- **Tool pages linking rule**:
  Each core tool page links to:
  - 2 relevant how-to pages
  - 1 privacy explainer
  - 1 comparison page
  - 1 trust page (`/verify-claims`)
- **Cross-cluster linking rule**:
  Every new page includes at least 3 existing-page links and 2 links to pages in this plan.

### Quality bar (avoid scaled-content abuse)
Every page must include at least **two** unique artefacts:
- local-only verification checklist
- threat model table
- browser limits explainer
- step-by-step workflow with edge-case notes
- decision matrix (when to use merge vs split vs extract)
- real-world example inputs and output checks

Also required per page:
- clear first-paragraph answer
- one practical checklist
- one failure-mode section
- no templated filler

---

## 2) Exact List of 25 Pages

> Format per page: URL, keywords, intent, outline, unique value, internal links, schema, CTA placement.

### 1) Can PDF Tools See My Files?
- **URL**: `/learn/can-pdf-tools-see-my-files`
- **Primary keyword**: can pdf tools see my files
- **Secondary keywords**: do pdf tools upload files, pdf privacy check, local pdf processing
- **Intent**: Informational
- **Outline (H2/H3)**:
  - H2: Short answer
  - H2: What happens in upload-based tools
  - H2: How local browser processing differs
  - H2: How to verify with DevTools
  - H2: Common false signals
- **Unique value elements**: local-only verification checklist, network-inspection screenshots list
- **Internal links**:
  - Existing: `/verify-claims`, `/learn/no-uploads-explained`, `/learn/how-to-verify-a-pdf-tool-doesnt-upload-your-files`
  - New: `/learn/how-to-audit-pdf-tool-network-requests`, `/blog/how-we-verify-no-upload-claims`
- **Schema**: `Article`, `FAQPage`, `BreadcrumbList`
- **CTA placement**:
  - Mid-page soft CTA: `/tools/merge-pdf`
  - End-page trust CTA: `/verify-claims`

### 2) Offline PDF Tools for Law Firms
- **URL**: `/learn/offline-pdf-tools-for-law-firms`
- **Primary keyword**: offline pdf tools for law firms
- **Secondary keywords**: legal document privacy tools, no upload pdf tools legal, confidential pdf processing
- **Intent**: Informational / Commercial investigation
- **Outline**:
  - H2: Legal workflow risk points
  - H2: Offline-first process for matter files
  - H2: Redaction and metadata controls
  - H2: Audit checklist for teams
  - H2: Implementation policy template
- **Unique value elements**: legal workflow checklist, risk-control table
- **Internal links**:
  - Existing: `/tools/redact-pdf`, `/tools/metadata-purge`, `/learn/how-pdf-redaction-really-works`
  - New: `/learn/pdf-redaction-checklist-for-compliance`, `/learn/pdf-threat-model-for-sensitive-documents`
- **Schema**: `Article`, `FAQPage`
- **CTA placement**: soft CTA to `/tools/redact-pdf`; trust CTA to `/verify-claims`

### 3) Offline PDF Tools for Healthcare Teams
- **URL**: `/learn/offline-pdf-tools-for-healthcare-teams`
- **Primary keyword**: offline pdf tools for healthcare teams
- **Secondary keywords**: private pdf tools healthcare, no upload medical pdf tools, patient document privacy pdf
- **Intent**: Informational
- **Outline**:
  - H2: Where document exposure happens
  - H2: Offline workflow for patient PDFs
  - H2: Metadata and redaction controls
  - H2: Operational safeguards
  - H2: Limitations and disclaimer
- **Unique value elements**: healthcare handoff checklist, document-minimisation table
- **Internal links**:
  - Existing: `/learn/why-you-should-never-upload-medical-records-to-pdf-tools`, `/tools/redact-pdf`, `/tools/metadata-purge`
  - New: `/learn/local-vs-cloud-ocr-privacy`, `/blog/pdf-privacy-checklist-for-small-teams`
- **Schema**: `Article`, `FAQPage`
- **CTA placement**: soft CTA to `/tools/offline-ocr`; trust CTA to `/verify-claims`

### 4) PDF Redaction Checklist for Compliance Teams
- **URL**: `/learn/pdf-redaction-checklist-for-compliance`
- **Primary keyword**: pdf redaction checklist
- **Secondary keywords**: compliant pdf redaction, secure redaction workflow, irreversible redaction checklist
- **Intent**: Informational / How-to
- **Outline**:
  - H2: Redaction failure modes
  - H2: Pre-redaction checklist
  - H2: Apply redaction correctly
  - H2: Validate output and metadata
  - H2: Team SOP template
- **Unique value elements**: downloadable checklist block, validation matrix
- **Internal links**:
  - Existing: `/learn/how-pdf-redaction-really-works`, `/tools/redact-pdf`, `/learn/what-is-pdf-metadata-and-why-it-matters`
  - New: `/learn/offline-pdf-tools-for-law-firms`, `/learn/pdf-threat-model-for-sensitive-documents`
- **Schema**: `HowTo`, `Article`, `FAQPage`
- **CTA placement**: tool CTA after checklist; trust CTA in final section

### 5) Local vs Cloud OCR Privacy
- **URL**: `/learn/local-vs-cloud-ocr-privacy`
- **Primary keyword**: local vs cloud ocr privacy
- **Secondary keywords**: offline ocr privacy, cloud ocr risk, private ocr workflow
- **Intent**: Informational / Comparison
- **Outline**:
  - H2: OCR data flow basics
  - H2: Cloud OCR risk model
  - H2: Local OCR risk model
  - H2: Decision framework by document type
  - H2: Practical recommendation
- **Unique value elements**: threat model table, decision tree
- **Internal links**:
  - Existing: `/tools/offline-ocr`, `/learn/ocr-pdf-without-cloud`, `/compare/offline-vs-online-pdf-tools`
  - New: `/learn/offline-pdf-tools-for-healthcare-teams`, `/learn/how-to-audit-pdf-tool-network-requests`
- **Schema**: `Article`, `FAQPage`, `BreadcrumbList`
- **CTA placement**: soft CTA to OCR tool; trust CTA to verify page

### 6) PDF Threat Model for Sensitive Documents
- **URL**: `/learn/pdf-threat-model-for-sensitive-documents`
- **Primary keyword**: pdf threat model
- **Secondary keywords**: sensitive document threat model, pdf privacy risks, document handling security model
- **Intent**: Informational
- **Outline**:
  - H2: Assets, actors, and attack surface
  - H2: Transfer risks vs local risks
  - H2: Mitigations by control layer
  - H2: Residual risk and monitoring
  - H2: Lightweight implementation template
- **Unique value elements**: threat model matrix, control-priority checklist
- **Internal links**:
  - Existing: `/learn/why-pdf-uploads-are-risky`, `/learn/is-offline-pdf-processing-secure`, `/verify-claims`
  - New: `/learn/pdf-redaction-checklist-for-compliance`, `/learn/offline-pdf-tools-for-law-firms`
- **Schema**: `Article`, `FAQPage`
- **CTA placement**: mid-page tool CTA to `/tools/metadata-purge`; end trust CTA

### 7) How to Audit PDF Tool Network Requests
- **URL**: `/learn/how-to-audit-pdf-tool-network-requests`
- **Primary keyword**: audit pdf tool network requests
- **Secondary keywords**: devtools pdf upload check, inspect pdf tool traffic, verify no upload
- **Intent**: How-to
- **Outline**:
  - H2: Setup in Chrome/Edge/Firefox
  - H2: Filter XHR/fetch correctly
  - H2: Run a controlled test file
  - H2: Interpret request payloads
  - H2: Red flags and false positives
- **Unique value elements**: browser-by-browser steps, red-flag checklist
- **Internal links**:
  - Existing: `/verify-claims`, `/learn/how-to-verify-a-pdf-tool-doesnt-upload-your-files`, `/learn/no-uploads-explained`
  - New: `/learn/can-pdf-tools-see-my-files`, `/blog/how-we-verify-no-upload-claims`
- **Schema**: `HowTo`, `FAQPage`, `Article`
- **CTA placement**: soft CTA to `/tools/merge-pdf`; trust CTA fixed at end

### 8) Merge PDF for Job Application
- **URL**: `/learn/workflows/merge-pdf-for-job-application`
- **Primary keyword**: merge pdf for job application
- **Secondary keywords**: combine cv and cover letter pdf, job application pdf merge, merge documents for application portal
- **Intent**: How-to
- **Outline**:
  - H2: Required file structure
  - H2: Step-by-step merge
  - H2: File naming and portal checks
  - H2: Privacy handling
  - H2: Final submission checklist
- **Unique value elements**: submission checklist, naming convention examples
- **Internal links**:
  - Existing: `/tools/merge-pdf`, `/learn/how-to-merge-pdfs-offline`, `/learn/no-uploads-explained`
  - New: `/learn/workflows/prepare-pdf-for-government-portal-upload`, `/learn/workflows/compress-pdf-for-whatsapp`
- **Schema**: `HowTo`, `FAQPage`
- **CTA placement**: tool CTA after steps; trust CTA in checklist footer

### 9) Compress PDF for WhatsApp
- **URL**: `/learn/workflows/compress-pdf-for-whatsapp`
- **Primary keyword**: compress pdf for whatsapp
- **Secondary keywords**: whatsapp pdf size limit, reduce pdf size for messaging, compress pdf mobile sharing
- **Intent**: How-to
- **Outline**:
  - H2: Size constraints and quality trade-offs
  - H2: Step-by-step compression
  - H2: Readability checks on mobile
  - H2: Privacy and sharing risk
  - H2: Alternative workflows
- **Unique value elements**: quality-vs-size table, mobile readability checklist
- **Internal links**:
  - Existing: `/tools/compress-pdf`, `/learn/compress-pdf-without-losing-quality`, `/learn/why-offline-compression-has-limits`
  - New: `/learn/workflows/split-pdf-for-email-attachments`, `/learn/workflows/compress-pdf-for-upload-limit`
- **Schema**: `HowTo`, `FAQPage`
- **CTA placement**: soft CTA to compress tool; trust CTA at end

### 10) Prepare PDF for Government Portal Upload
- **URL**: `/learn/workflows/prepare-pdf-for-government-portal-upload`
- **Primary keyword**: prepare pdf for government portal upload
- **Secondary keywords**: government portal pdf requirements, pdf upload limit government forms, pdf formatting for portal submission
- **Intent**: How-to
- **Outline**:
  - H2: Typical portal constraints
  - H2: Merge/compress sequence
  - H2: Validation before upload
  - H2: Privacy handling for identity documents
  - H2: Troubleshooting rejections
- **Unique value elements**: portal readiness checklist, rejection cause table
- **Internal links**:
  - Existing: `/tools/merge-pdf`, `/tools/compress-pdf`, `/verify-claims`
  - New: `/learn/workflows/merge-pdf-for-job-application`, `/learn/workflows/extract-passport-pages-for-visa-upload`
- **Schema**: `HowTo`, `FAQPage`, `Article`
- **CTA placement**: tool CTA after sequence; trust CTA in validation section

### 11) Split PDF for Email Attachments
- **URL**: `/learn/workflows/split-pdf-for-email-attachments`
- **Primary keyword**: split pdf for email attachments
- **Secondary keywords**: split large pdf for email, pdf attachment size limit split, send pdf in parts
- **Intent**: How-to
- **Outline**:
  - H2: Why splitting helps
  - H2: Split by page ranges
  - H2: Naming and ordering parts
  - H2: Privacy considerations
  - H2: Recipient instructions template
- **Unique value elements**: naming template, recipient handoff checklist
- **Internal links**:
  - Existing: `/tools/split-pdf`, `/learn/how-to-split-a-pdf-by-pages`, `/learn/how-to-extract-pages-from-a-pdf`
  - New: `/learn/workflows/compress-pdf-for-whatsapp`, `/learn/workflows/combine-invoices-into-one-pdf`
- **Schema**: `HowTo`, `FAQPage`
- **CTA placement**: split tool CTA mid-page; trust CTA in handoff section

### 12) Combine Invoices into One PDF
- **URL**: `/learn/workflows/combine-invoices-into-one-pdf`
- **Primary keyword**: combine invoices into one pdf
- **Secondary keywords**: merge invoices pdf, invoice bundle pdf, accounting document merge
- **Intent**: How-to
- **Outline**:
  - H2: Invoice bundle structure
  - H2: Step-by-step merge
  - H2: Pagination and ordering checks
  - H2: Metadata hygiene
  - H2: Archive version control
- **Unique value elements**: invoice ordering checklist, metadata scrub checklist
- **Internal links**:
  - Existing: `/tools/merge-pdf`, `/tools/metadata-purge`, `/learn/how-to-remove-pdf-metadata`
  - New: `/learn/workflows/remove-metadata-before-sharing-pdf`, `/learn/workflows/merge-pdf-for-job-application`
- **Schema**: `HowTo`, `FAQPage`
- **CTA placement**: tool CTA after steps; trust CTA after metadata section

### 13) Extract Passport Pages for Visa Upload
- **URL**: `/learn/workflows/extract-passport-pages-for-visa-upload`
- **Primary keyword**: extract passport pages for visa upload
- **Secondary keywords**: passport pdf page extraction, visa document page selection, extract pages for visa portal
- **Intent**: How-to
- **Outline**:
  - H2: Required pages by application type
  - H2: Extract only required pages
  - H2: Merge supporting files
  - H2: Privacy handling for identity docs
  - H2: Final upload checks
- **Unique value elements**: required-page checklist, identity-document handling checklist
- **Internal links**:
  - Existing: `/tools/extract-pdf`, `/tools/merge-pdf`, `/learn/how-to-extract-pages-from-a-pdf`
  - New: `/learn/workflows/prepare-pdf-for-government-portal-upload`, `/learn/workflows/remove-metadata-before-sharing-pdf`
- **Schema**: `HowTo`, `FAQPage`
- **CTA placement**: extract tool CTA after step section; trust CTA at end

### 14) Merge Scanned Documents into Searchable PDF
- **URL**: `/learn/workflows/merge-scanned-documents-into-searchable-pdf`
- **Primary keyword**: merge scanned documents into searchable pdf
- **Secondary keywords**: scanned pdf ocr workflow, combine scans with ocr, searchable document bundle
- **Intent**: How-to
- **Outline**:
  - H2: Merge then OCR workflow
  - H2: OCR quality constraints
  - H2: Searchability verification
  - H2: Privacy and retention controls
  - H2: Output quality troubleshooting
- **Unique value elements**: OCR quality checklist, merge-vs-OCR sequencing diagram
- **Internal links**:
  - Existing: `/tools/merge-pdf`, `/tools/offline-ocr`, `/learn/ocr-pdf-without-cloud`
  - New: `/learn/local-vs-cloud-ocr-privacy`, `/learn/workflows/combine-invoices-into-one-pdf`
- **Schema**: `HowTo`, `FAQPage`, `Article`
- **CTA placement**: tool CTA after sequence diagram; trust CTA at end

### 15) Remove Metadata Before Sharing PDF
- **URL**: `/learn/workflows/remove-metadata-before-sharing-pdf`
- **Primary keyword**: remove metadata before sharing pdf
- **Secondary keywords**: strip pdf metadata before send, remove author from pdf, clean document properties
- **Intent**: How-to
- **Outline**:
  - H2: What metadata leaks
  - H2: Step-by-step purge process
  - H2: Verify before/after metadata
  - H2: Sensitive sharing checklist
  - H2: Team policy snippet
- **Unique value elements**: before/after metadata table, sharing checklist
- **Internal links**:
  - Existing: `/tools/metadata-purge`, `/learn/what-is-pdf-metadata-and-why-it-matters`, `/verify-claims`
  - New: `/learn/workflows/combine-invoices-into-one-pdf`, `/learn/offline-pdf-tools-for-law-firms`
- **Schema**: `HowTo`, `FAQPage`
- **CTA placement**: soft CTA in step section; trust CTA at end

### 16) Plain vs PDF24
- **URL**: `/compare/plain-vs-pdf24`
- **Primary keyword**: pdf24 alternative
- **Secondary keywords**: plain vs pdf24, pdf24 privacy, offline pdf24 alternative
- **Intent**: Commercial investigation
- **Outline**:
  - H2: Quick comparison summary
  - H2: Feature table (uploads highlighted)
  - H2: Privacy model comparison
  - H2: Performance and workflow fit
  - H2: Verdict by use case
- **Unique value elements**: threat model table, use-case decision matrix
- **Internal links**:
  - Existing: `/compare/offline-vs-online-pdf-tools`, `/verify-claims`, `/tools/merge-pdf`
  - New: `/compare/plain-vs-pdfcandy`, `/compare/best-pdf-tools-no-upload`
- **Schema**: `Article`, `FAQPage`, `BreadcrumbList`
- **CTA placement**: tool CTA below table; trust CTA near verdict

### 17) Plain vs PDFCandy
- **URL**: `/compare/plain-vs-pdfcandy`
- **Primary keyword**: pdfcandy alternative
- **Secondary keywords**: plain vs pdfcandy, pdfcandy privacy, no upload pdfcandy alternative
- **Intent**: Commercial investigation
- **Outline**:
  - H2: Summary and positioning
  - H2: Feature and limits table
  - H2: Privacy and data flow
  - H2: Speed and UX comparison
  - H2: Who should pick which
- **Unique value elements**: data-flow comparison diagram, limits table
- **Internal links**:
  - Existing: `/compare/plain-vs-smallpdf`, `/tools/compress-pdf`, `/verify-claims`
  - New: `/compare/plain-vs-pdf24`, `/compare/plain-vs-lightpdf`
- **Schema**: `Article`, `FAQPage`
- **CTA placement**: CTA after privacy section and final CTA to `/tools`

### 18) Plain vs LightPDF
- **URL**: `/compare/plain-vs-lightpdf`
- **Primary keyword**: lightpdf alternative
- **Secondary keywords**: plain vs lightpdf, lightpdf privacy, offline lightpdf alternative
- **Intent**: Commercial investigation
- **Outline**:
  - H2: Core differences
  - H2: Feature table
  - H2: Privacy verification criteria
  - H2: Reliability and large files
  - H2: Final recommendation
- **Unique value elements**: verification criteria checklist, reliability scenarios
- **Internal links**:
  - Existing: `/compare/offline-vs-online-pdf-tools`, `/tools/batch-engine`, `/learn/why-pdf-uploads-are-risky`
  - New: `/compare/plain-vs-sodapdf`, `/compare/best-pdf-tools-no-upload`
- **Schema**: `Article`, `FAQPage`
- **CTA placement**: soft CTA to batch engine; trust CTA before recommendation

### 19) Plain vs SodaPDF
- **URL**: `/compare/plain-vs-sodapdf`
- **Primary keyword**: sodapdf alternative
- **Secondary keywords**: plain vs sodapdf, sodapdf privacy, offline sodapdf alternative
- **Intent**: Commercial investigation
- **Outline**:
  - H2: Positioning summary
  - H2: Features and constraints table
  - H2: Privacy and control model
  - H2: Practical workflow fit
  - H2: Verdict
- **Unique value elements**: control model comparison table, workflow fit matrix
- **Internal links**:
  - Existing: `/compare/plain-vs-adobe-acrobat-online`, `/tools/merge-pdf`, `/verify-claims`
  - New: `/compare/plain-vs-lightpdf`, `/compare/best-pdf-tools-no-upload`
- **Schema**: `Article`, `FAQPage`, `BreadcrumbList`
- **CTA placement**: mid-page tool CTA and end trust CTA

### 20) Best PDF Tools with No Upload (2026)
- **URL**: `/compare/best-pdf-tools-no-upload`
- **Primary keyword**: best pdf tools no upload
- **Secondary keywords**: private pdf tools, offline pdf tools list, no upload pdf converter
- **Intent**: Commercial investigation
- **Outline**:
  - H2: Selection criteria
  - H2: Ranked tool categories
  - H2: Verification methods
  - H2: Tool-by-tool summary table
  - H2: Which workflow to choose
- **Unique value elements**: scoring framework, verification checklist
- **Internal links**:
  - Existing: `/verify-claims`, `/compare/offline-vs-online-pdf-tools`, `/tools`
  - New: `/compare/plain-vs-pdf24`, `/compare/plain-vs-sodapdf`
- **Schema**: `Article`, `FAQPage`, `ItemList`
- **CTA placement**: tool CTA in ranking table; trust CTA in verification section

### 21) Glossary: What Is XMP in PDF?
- **URL**: `/learn/glossary/what-is-xmp-in-pdf`
- **Primary keyword**: what is xmp in pdf
- **Secondary keywords**: pdf xmp metadata, xmp packet pdf, remove xmp from pdf
- **Intent**: Informational
- **Outline**:
  - H2: XMP definition in plain language
  - H2: Where XMP appears in files
  - H2: Why it matters for privacy
  - H2: How to inspect and remove
  - H2: Common misunderstandings
- **Unique value elements**: XMP field map, inspect/remove checklist
- **Internal links**:
  - Existing: `/learn/what-is-pdf-metadata-and-why-it-matters`, `/tools/metadata-purge`, `/learn/glossary`
  - New: `/learn/glossary/what-is-pdf-info-dictionary`, `/learn/workflows/remove-metadata-before-sharing-pdf`
- **Schema**: `DefinedTerm`, `Article`, `FAQPage`
- **CTA placement**: metadata-purge CTA mid-page; verify CTA at end

### 22) Glossary: What Is the PDF Info Dictionary?
- **URL**: `/learn/glossary/what-is-pdf-info-dictionary`
- **Primary keyword**: pdf info dictionary
- **Secondary keywords**: document info dictionary pdf, pdf properties fields, pdf metadata fields
- **Intent**: Informational
- **Outline**:
  - H2: Info dictionary basics
  - H2: Common fields and leakage risk
  - H2: Difference from XMP
  - H2: How to check and clean
  - H2: Operational best practice
- **Unique value elements**: field-by-field table, XMP vs Info comparison table
- **Internal links**:
  - Existing: `/learn/what-is-pdf-metadata-and-why-it-matters`, `/tools/metadata-purge`, `/learn/glossary`
  - New: `/learn/glossary/what-is-xmp-in-pdf`, `/learn/pdf-threat-model-for-sensitive-documents`
- **Schema**: `DefinedTerm`, `Article`, `FAQPage`
- **CTA placement**: tool CTA after field table; trust CTA at end

### 23) Browser Memory Limits for PDF Tools
- **URL**: `/learn/browser-memory-limits-for-pdf-tools`
- **Primary keyword**: browser memory limits for pdf tools
- **Secondary keywords**: large pdf browser limits, pdf processing out of memory, client side pdf performance
- **Intent**: Informational / Troubleshooting
- **Outline**:
  - H2: Why browser memory limits happen
  - H2: Typical limits by browser class
  - H2: Signs of memory pressure
  - H2: Mitigation workflow
  - H2: When to split workloads
- **Unique value elements**: browser limits table, mitigation checklist
- **Internal links**:
  - Existing: `/tools/batch-engine`, `/learn/why-offline-compression-has-limits`, `/learn/how-pdfs-work`
  - New: `/learn/workflows/split-pdf-for-email-attachments`, `/blog/pdf-privacy-checklist-for-small-teams`
- **Schema**: `Article`, `FAQPage`
- **CTA placement**: batch-engine CTA after mitigation; trust CTA in conclusion

### 24) Blog: How We Verify No-Upload Claims
- **URL**: `/blog/how-we-verify-no-upload-claims`
- **Primary keyword**: verify no upload claims
- **Secondary keywords**: pdf tool privacy verification, devtools upload verification, no upload evidence
- **Intent**: Informational / Trust
- **Outline**:
  - H2: Why trust statements are not enough
  - H2: Our verification method
  - H2: Common false positives
  - H2: Evidence checklist anyone can run
  - H2: What this does and does not prove
- **Unique value elements**: verification protocol, false-positive catalogue
- **Internal links**:
  - Existing: `/verify-claims`, `/learn/how-to-verify-a-pdf-tool-doesnt-upload-your-files`, `/blog/why-we-open-sourced-our-privacy-claims`
  - New: `/learn/how-to-audit-pdf-tool-network-requests`, `/learn/can-pdf-tools-see-my-files`
- **Schema**: `BlogPosting`, `FAQPage`
- **CTA placement**: soft CTA to `/tools/merge-pdf`; trust CTA to `/verify-claims`

### 25) Blog: PDF Privacy Checklist for Small Teams
- **URL**: `/blog/pdf-privacy-checklist-for-small-teams`
- **Primary keyword**: pdf privacy checklist
- **Secondary keywords**: small team document privacy, secure pdf workflow checklist, private pdf handling
- **Intent**: Informational
- **Outline**:
  - H2: Team risk baseline
  - H2: 10-point privacy checklist
  - H2: Weekly review routine
  - H2: Tool selection guardrails
  - H2: Rollout in 30 minutes
- **Unique value elements**: 10-point checklist, weekly review template
- **Internal links**:
  - Existing: `/learn/common-pdf-privacy-mistakes`, `/learn/no-uploads-explained`, `/verify-claims`
  - New: `/learn/offline-pdf-tools-for-healthcare-teams`, `/learn/browser-memory-limits-for-pdf-tools`
- **Schema**: `BlogPosting`, `FAQPage`, `BreadcrumbList`
- **CTA placement**: tool CTA in checklist section; trust CTA in final section

---

## 3) Technical SEO Checklist (Next.js App Router)

### Sitemap and robots
- Keep one canonical sitemap source in `app/sitemap.ts`.
- Include only indexable canonical URLs.
- Exclude auth and post-checkout routes (`/sign-in`, `/sign-up`, `/pro/success`) and all `/api/*`.
- Keep `robots.txt` with:
  - `Disallow: /api/`
  - `Allow: /api/health`
  - `Sitemap: https://plain.tools/sitemap.xml`

### Canonical strategy (`/pdf-tools/*` mount)
- Root canonical routes for SEO content:
  - `/learn/*`, `/compare/*`, `/blog/*`
- Keep `/pdf-tools/learn/*` and `/pdf-tools/compare/*` as redirect aliases to root canonicals.
- Ensure no duplicate canonical tags across mount and root.
- Keep permanent redirects in `next.config`.

### OG image strategy
- Use one base branded OG image for hubs.
- Use route-specific OG title/description overlays for high-value pages:
  - top comparisons
  - top workflow pages
  - trust pages
- Keep OG image dimensions 1200x630 and strong contrast text.

### Performance basics (actionable)
- Keep all content pages as server components.
- Do not import heavy PDF engines on content pages.
- Keep CLS stable with fixed image/container sizes.
- Keep LCP fast by:
  - no blocking third-party scripts above the fold
  - lazy-load non-critical widgets
  - preconnect only where needed
- Set performance budget in PR checks:
  - content route JS minimal
  - no new heavy client dependencies for article pages

---

## 4) Execution Plan

### Day 1-7
- Publish first 8 pages:
  - 3 privacy explainers
  - 3 workflows
  - 2 comparisons
- Wire all internal links and schema.
- Submit updated sitemap in GSC.

### Day 8-14
- Publish next 9 pages:
  - remaining trust/workflow pages
  - one glossary page
  - one blog evidence post
- Refresh top tool pages with contextual links to new pages.
- Validate indexation and canonical behaviour in GSC URL inspection.

### Day 15-30
- Publish final 8 pages.
- Improve pages with real user query data from GSC (titles, intros, FAQ wording).
- Add at least one unique diagram/checklist upgrade to top 10 performing pages.

### Tracking and ROI measurement
- **Google Search Console**:
  - impressions, CTR, avg position by page and query cluster
  - index coverage and canonical status
- **GA4 events** (recommended custom events):
  - `content_cta_tool_click` (params: page_slug, target_tool)
  - `content_cta_verify_click` (params: page_slug)
  - `content_scroll_75` (params: page_slug)
  - `content_outbound_share_click` (params: page_slug, channel)
  - `tool_download_from_content` (params: source_page_slug, tool_slug)
- **Weekly KPI review**:
  - Pages indexed
  - Top 20 landing pages by organic sessions
  - CTA click-through to tools and verify page
  - Assisted conversions to tool usage

---

## Definition of done per page
- Metadata complete (title, description, canonical, OG)
- Required trust line near top: **Runs locally in your browser. No uploads.**
- 3+ existing internal links and 2+ links to new plan pages
- At least 2 unique value artefacts
- Schema valid and tested
- Included in sitemap
- Indexed and query-tracked in GSC
