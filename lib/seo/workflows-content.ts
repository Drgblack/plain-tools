import type {
  TrancheFaq,
  TrancheLearnArticle,
  TrancheSection,
  TrancheTrustBox,
} from "@/lib/seo/tranche1-content"

const WORKFLOW_PREFIX = "workflows"
const NO_UPLOADS_LINE = "Runs locally in your browser. No uploads."

const trustBox: TrancheTrustBox = {
  localProcessing: "Workflow steps run in local browser memory on your device.",
  noUploads: NO_UPLOADS_LINE,
  noTracking: "No behavioural tracking is required for local PDF workflows.",
  verifyHref: "/verify-claims",
}

type WorkflowConfig = {
  slug: string
  title: string
  primaryQuery: string
  toolHref: string
  relatedWorkflowSlugs: [string, string]
  secondaryQueries?: string[]
  intro?: [string, string]
  sections?: TrancheSection[]
  faqs?: TrancheFaq[]
}

const workflowConfigs: WorkflowConfig[] = [
  {
    slug: "compress-pdf-for-email",
    title: "Compress PDF for Email",
    primaryQuery: "compress pdf for email",
    toolHref: "/tools/compress-pdf",
    relatedWorkflowSlugs: ["reduce-pdf-size-for-gmail", "compress-pdf-for-upload-limit"],
  },
  {
    slug: "reduce-pdf-size-for-gmail",
    title: "Reduce PDF Size for Gmail",
    primaryQuery: "reduce pdf size for gmail",
    toolHref: "/tools/compress-pdf",
    relatedWorkflowSlugs: ["compress-pdf-for-email", "compress-pdf-for-upload-limit"],
  },
  {
    slug: "combine-bank-statements-into-one-pdf",
    title: "Combine Bank Statements into One PDF",
    primaryQuery: "combine bank statements into one pdf",
    toolHref: "/tools/merge-pdf",
    relatedWorkflowSlugs: ["combine-documents-into-single-pdf", "merge-receipts-into-single-pdf"],
  },
  {
    slug: "merge-scanned-pages-into-one-pdf",
    title: "Merge Scanned Pages into One PDF",
    primaryQuery: "merge scanned pages into one pdf",
    toolHref: "/tools/merge-pdf",
    relatedWorkflowSlugs: ["combine-documents-into-single-pdf", "merge-pdf-for-visa-application"],
  },
  {
    slug: "split-pdf-into-individual-pages",
    title: "Split PDF into Individual Pages",
    primaryQuery: "split pdf into individual pages",
    toolHref: "/tools/split-pdf",
    relatedWorkflowSlugs: ["extract-pages-from-pdf-document", "compress-pdf-for-upload-limit"],
  },
  {
    slug: "merge-pdf-for-visa-application",
    title: "Merge PDF for Visa Application",
    primaryQuery: "merge pdf for visa application",
    toolHref: "/tools/merge-pdf",
    relatedWorkflowSlugs: ["combine-documents-into-single-pdf", "merge-scanned-pages-into-one-pdf"],
  },
  {
    slug: "combine-documents-into-single-pdf",
    title: "Combine Documents into Single PDF",
    primaryQuery: "combine documents into single pdf",
    toolHref: "/tools/merge-pdf",
    relatedWorkflowSlugs: ["combine-bank-statements-into-one-pdf", "merge-pdf-for-visa-application"],
  },
  {
    slug: "extract-pages-from-pdf-document",
    title: "Extract Pages from PDF Document",
    primaryQuery: "extract pages from pdf document",
    toolHref: "/tools/extract-pdf",
    relatedWorkflowSlugs: ["split-pdf-into-individual-pages", "combine-documents-into-single-pdf"],
  },
  {
    slug: "compress-pdf-for-upload-limit",
    title: "Compress PDF for Upload Limit",
    primaryQuery: "compress pdf for upload limit",
    toolHref: "/tools/compress-pdf",
    relatedWorkflowSlugs: ["compress-pdf-for-email", "reduce-pdf-size-for-gmail"],
  },
  {
    slug: "merge-receipts-into-single-pdf",
    title: "Merge Receipts into Single PDF",
    primaryQuery: "merge receipts into single pdf",
    toolHref: "/tools/merge-pdf",
    relatedWorkflowSlugs: ["combine-bank-statements-into-one-pdf", "combine-documents-into-single-pdf"],
  },
  {
    slug: "merge-pdf-for-job-application",
    title: "Merge PDF for Job Application",
    primaryQuery: "merge pdf for job application",
    secondaryQueries: [
      "combine cv and cover letter pdf",
      "job application pdf merge",
      "merge documents for application portal",
    ],
    toolHref: "/tools/merge-pdf",
    relatedWorkflowSlugs: ["compress-pdf-for-upload-limit", "merge-pdf-for-visa-application"],
    intro: [
      `Job-application portals usually want one neat PDF, not several loose attachments. ${NO_UPLOADS_LINE}`,
      "Use this workflow to combine the right documents in the right order, then check naming, page order, and readability before submission.",
    ],
    sections: [
      {
        id: "prepare-files",
        heading: "Prepare the application packet first",
        paragraphs: [
          "Confirm which documents the employer or portal wants in a single file before merging. A common pattern is CV first, then cover letter, then supporting certificates.",
          "Rename the source files before merging so the final order is obvious and repeatable.",
        ],
      },
      {
        id: "merge-steps",
        heading: "Merge in the order a reviewer expects",
        paragraphs: [
          "Merge the files in reading order, not upload order. Recruiters usually expect the CV first unless the portal states otherwise.",
          "After export, check the first page, transition pages, and final page before uploading.",
        ],
        bullets: [
          "CV first",
          "cover letter second when required",
          "supporting pages last",
          "final filename aligned with the application instructions",
        ],
      },
      {
        id: "portal-checks",
        heading: "Final portal checks",
        paragraphs: [
          "Make sure the merged file is still within the portal size limit and opens correctly in a separate viewer.",
          "If the portal rejects large files, compress the finished packet rather than the individual source files first.",
        ],
      },
    ],
    faqs: [
      {
        question: "What order should a merged job application PDF use?",
        answer:
          "Usually CV first, then cover letter, then supporting documents, unless the application instructions say otherwise.",
      },
      {
        question: "Should I compress before or after merging?",
        answer:
          "Usually after merging, because you only need to optimise the final file that will actually be uploaded.",
      },
      {
        question: "Will this workflow upload my documents?",
        answer:
          "No. The merge step runs locally in your browser. Only the final reviewed PDF needs to be uploaded to the application portal.",
      },
      {
        question: "Can I keep the original files unchanged?",
        answer:
          "Yes. Keep the originals and create a separate merged submission copy for the actual application.",
      },
    ],
  },
  {
    slug: "compress-pdf-for-whatsapp",
    title: "Compress PDF for WhatsApp",
    primaryQuery: "compress pdf for whatsapp",
    secondaryQueries: [
      "whatsapp pdf size limit",
      "reduce pdf size for messaging",
      "compress pdf mobile sharing",
    ],
    toolHref: "/tools/compress-pdf",
    relatedWorkflowSlugs: ["compress-pdf-for-email", "compress-pdf-for-upload-limit"],
    intro: [
      `WhatsApp sharing is usually a file-size problem first and a quality problem second. ${NO_UPLOADS_LINE}`,
      "This workflow helps you reduce the file enough for mobile sharing while still keeping text readable on a phone screen.",
    ],
    sections: [
      {
        id: "size-vs-quality",
        heading: "Start with the size goal, not the strongest setting",
        paragraphs: [
          "Messaging workflows fail when the file is still too large or when the result becomes unreadable on mobile. Start with light compression and step up only if needed.",
          "The right target is the smallest file that still reads clearly on a phone display.",
        ],
      },
      {
        id: "compression-steps",
        heading: "Run one pass and inspect the output on mobile",
        paragraphs: [
          "Compress the final PDF, then open it on a mobile device or narrow browser window before sending.",
          "Check small text, signatures, and scanned pages because those usually degrade first.",
        ],
        bullets: [
          "compress the final share copy",
          "check page 1, a dense middle page, and the last page",
          "re-run with a stronger setting only if still too large",
        ],
      },
      {
        id: "sharing-risk",
        heading: "Keep privacy in mind when using messaging apps",
        paragraphs: [
          "Compression does not change the sensitivity of the document. If the file contains personal or financial information, verify that messaging is an acceptable route before sending.",
          "Remove metadata first when the recipient does not need it.",
        ],
      },
    ],
    faqs: [
      {
        question: "What is the best way to compress a PDF for WhatsApp?",
        answer:
          "Start with light compression, check readability on mobile, and only move to stronger settings if the file is still too large.",
      },
      {
        question: "Should I compress each page separately?",
        answer:
          "Usually no. Compress the final PDF that you plan to send, not several partial versions.",
      },
      {
        question: "Will compression make the file unreadable on a phone?",
        answer:
          "It can if the setting is too aggressive. Always preview dense text and scanned pages before sharing.",
      },
      {
        question: "Does this workflow upload my PDF?",
        answer:
          "No. The compression step runs locally in your browser.",
      },
    ],
  },
  {
    slug: "split-pdf-for-email-attachments",
    title: "Split PDF for Email Attachments",
    primaryQuery: "split pdf for email attachments",
    secondaryQueries: [
      "split large pdf for email",
      "pdf attachment size limit split",
      "send pdf in parts",
    ],
    toolHref: "/tools/split-pdf",
    relatedWorkflowSlugs: ["extract-pages-from-pdf-document", "compress-pdf-for-email"],
    intro: [
      `Email size limits are easier to handle when you split the document deliberately instead of hoping the server accepts it. ${NO_UPLOADS_LINE}`,
      "Use this workflow to split a large PDF into smaller, clearly named parts that the recipient can understand and reassemble mentally.",
    ],
    sections: [
      {
        id: "decide-boundaries",
        heading: "Choose sensible split boundaries",
        paragraphs: [
          "Split by section or page range that still makes sense to the recipient. Arbitrary breaks create confusion and increase the chance that pages are missed.",
          "If there is a cover or index page, consider repeating it or mentioning it in the email body.",
        ],
      },
      {
        id: "naming",
        heading: "Name the parts clearly",
        paragraphs: [
          "The recipient should be able to tell the order immediately from the filenames alone.",
          "Use sequential numbering and a short descriptor rather than vague names like final-small or export-two.",
        ],
        bullets: [
          "project-report-part-1-of-3.pdf",
          "project-report-part-2-of-3.pdf",
          "project-report-part-3-of-3.pdf",
        ],
      },
      {
        id: "recipient-handoff",
        heading: "Make the handoff easy for the recipient",
        paragraphs: [
          "Tell the recipient how many files to expect and whether they need every part.",
          "If only certain sections matter, note that in the message so they do not open irrelevant files first.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is splitting better than compressing for email attachments?",
        answer:
          "Sometimes yes. If compression harms readability or still does not meet the email limit, splitting is usually the cleaner option.",
      },
      {
        question: "How should I name split files for email?",
        answer:
          "Use numbered filenames such as part-1-of-3, part-2-of-3, and part-3-of-3 so the order is obvious.",
      },
      {
        question: "Can I split by page range locally?",
        answer:
          "Yes. You can choose the page ranges in the local split workflow and export the parts without uploading the source file.",
      },
      {
        question: "Should I tell the recipient how many parts there are?",
        answer:
          "Yes. It reduces confusion and helps them confirm they received the full document set.",
      },
    ],
  },
  {
    slug: "extract-passport-pages-for-visa-upload",
    title: "Extract Passport Pages for Visa Upload",
    primaryQuery: "extract passport pages for visa upload",
    secondaryQueries: [
      "passport pdf page extraction",
      "visa document page selection",
      "extract pages for visa portal",
    ],
    toolHref: "/tools/extract-pdf",
    relatedWorkflowSlugs: ["merge-pdf-for-visa-application", "compress-pdf-for-upload-limit"],
    intro: [
      `Visa portals often need only a subset of identity-document pages, not the full scanned packet. ${NO_UPLOADS_LINE}`,
      "Use this workflow to extract only the required passport pages, then validate that the final upload copy still matches the portal instructions.",
    ],
    sections: [
      {
        id: "identify-pages",
        heading: "Confirm which pages are actually required",
        paragraphs: [
          "Read the visa instructions first. Many portals ask for the identity page, amendment pages, or recent visa history, not every scanned page.",
          "Avoid over-sharing by extracting only what the application requires.",
        ],
      },
      {
        id: "extract-only-needed",
        heading: "Extract the relevant pages",
        paragraphs: [
          "Use the page numbers from the full scan to create a smaller passport subset. After export, confirm the page order and legibility in a separate viewer.",
          "If the portal needs additional supporting files, merge those only after the passport subset is correct.",
        ],
      },
      {
        id: "privacy-check",
        heading: "Treat identity documents as high-sensitivity files",
        paragraphs: [
          "Passport scans carry more information than many applicants realise. Keep the extraction step local and avoid creating unnecessary extra copies.",
          "When the final file is ready, check size limits and portal rules before upload.",
        ],
      },
    ],
    faqs: [
      {
        question: "Should I upload the full passport scan if only one page is requested?",
        answer:
          "Usually no. Upload only the pages the application instructions require.",
      },
      {
        question: "Can I extract passport pages without uploading the scan?",
        answer:
          "Yes. The extraction step runs locally in your browser.",
      },
      {
        question: "When should I merge supporting files?",
        answer:
          "After you confirm the passport subset is correct. That keeps the identity-document step easier to review.",
      },
      {
        question: "What should I verify before portal upload?",
        answer:
          "Check page order, image readability, file size, and whether the final file matches the portal's requested document list.",
      },
    ],
  },
  {
    slug: "remove-metadata-before-sharing-pdf",
    title: "Remove Metadata Before Sharing PDF",
    primaryQuery: "remove metadata before sharing pdf",
    secondaryQueries: [
      "strip pdf metadata before send",
      "remove author from pdf",
      "clean document properties",
    ],
    toolHref: "/tools/metadata-purge",
    relatedWorkflowSlugs: ["compress-pdf-for-email", "extract-pages-from-pdf-document"],
    intro: [
      `A PDF can look harmless on-screen while still carrying hidden metadata the recipient does not need. ${NO_UPLOADS_LINE}`,
      "This workflow helps you clean the file before external sharing so the visible document and the hidden properties tell the same story.",
    ],
    sections: [
      {
        id: "why-clean-first",
        heading: "Why remove metadata before sharing",
        paragraphs: [
          "Author names, producer fields, titles, timestamps, and other properties can leak internal workflow context or personal details.",
          "If the recipient only needs the document contents, metadata minimisation is often the cleaner default.",
        ],
      },
      {
        id: "purge-steps",
        heading: "Run the cleanup and verify the result",
        paragraphs: [
          "Use the metadata-purge step on the final share copy, not on the original source file. Then inspect the cleaned output before sending it onward.",
          "This is especially useful before external email, portal upload, or client handoff.",
        ],
        bullets: [
          "clean the final output copy",
          "keep the source version unchanged",
          "inspect the cleaned file before sharing",
        ],
      },
      {
        id: "when-to-keep",
        heading: "When metadata should be kept intentionally",
        paragraphs: [
          "Some archival or internal workflows may need creator or timestamp information. The key is to keep it on purpose, not by accident.",
          "For external sharing, default to minimisation unless there is a documented reason to keep the fields.",
        ],
      },
    ],
    faqs: [
      {
        question: "Why remove metadata before sending a PDF?",
        answer:
          "Because metadata can reveal authorship, timestamps, software details, or other context that the recipient does not need.",
      },
      {
        question: "Should I clean the source file or a copy?",
        answer:
          "Use a separate share copy so the original remains intact for internal records.",
      },
      {
        question: "Can I remove PDF metadata locally?",
        answer:
          "Yes. The metadata-purge workflow runs locally in your browser.",
      },
      {
        question: "Is metadata cleanup always necessary?",
        answer:
          "Not always. It depends on the workflow, but external sharing often benefits from metadata minimisation.",
      },
    ],
  },
  {
    slug: "add-watermark-before-client-review",
    title: "Add Watermark Before Client Review",
    primaryQuery: "add watermark before client review",
    secondaryQueries: [
      "watermark draft pdf for client review",
      "mark pdf as draft before sending",
      "review watermark workflow pdf",
    ],
    toolHref: "/tools/watermark-pdf",
    relatedWorkflowSlugs: ["compare-contract-versions-as-pdf", "password-protect-pdf-before-emailing"],
    intro: [
      `A review copy should be clearly marked before it leaves your team. ${NO_UPLOADS_LINE}`,
      "Use this workflow to apply a visible draft or review watermark, then confirm it does not hide important content before the file is shared.",
    ],
    sections: [
      {
        id: "review-purpose",
        heading: "Decide what the watermark needs to communicate",
        paragraphs: [
          "A good review watermark tells the recipient what the file is: draft, internal review, client comments, or not for execution.",
          "Set the wording before you apply the mark so the export process stays consistent across reviewers.",
        ],
      },
      {
        id: "apply-watermark",
        heading: "Apply the watermark to a separate review copy",
        paragraphs: [
          "Work on a copy, not the final release document. That keeps the clean source version available for later issue or signing.",
          "Use enough opacity to stay visible without covering signatures, tables, or page numbers.",
        ],
        bullets: [
          "keep the clean master separate",
          "use wording the recipient will understand immediately",
          "check a dense page and a signature page before export",
        ],
      },
      {
        id: "send-review-copy",
        heading: "Check the review copy before sending",
        paragraphs: [
          "Open the watermarked file in a separate viewer and confirm the mark is visible on mobile and desktop.",
          "If the file is sensitive, combine the watermark step with password protection or a limited-distribution workflow.",
        ],
      },
    ],
    faqs: [
      {
        question: "Why watermark a PDF before client review?",
        answer:
          "It makes the document status obvious and reduces the chance that a draft is mistaken for a final or executable version.",
      },
      {
        question: "Should I watermark the only copy I have?",
        answer:
          "No. Create a separate review copy so the clean source document remains available for final release.",
      },
      {
        question: "How strong should the watermark be?",
        answer:
          "Visible enough to signal review status, but not so strong that it hides signatures, totals, or small print.",
      },
      {
        question: "Does this workflow upload the PDF?",
        answer:
          "No. The watermark step runs locally in your browser.",
      },
    ],
  },
  {
    slug: "fill-and-sign-pdf-for-hr-onboarding",
    title: "Fill and Sign PDF for HR Onboarding",
    primaryQuery: "fill and sign pdf for hr onboarding",
    secondaryQueries: [
      "complete onboarding pdf locally",
      "fill and sign employee forms pdf",
      "private hr form workflow pdf",
    ],
    toolHref: "/tools/fill-pdf",
    relatedWorkflowSlugs: ["password-protect-pdf-before-emailing", "add-watermark-before-client-review"],
    intro: [
      `HR onboarding packets often contain personal details that should be handled carefully from the first draft to the signed copy. ${NO_UPLOADS_LINE}`,
      "Use this workflow to fill fields, apply the signature step, and create a clean share copy without introducing an avoidable upload route.",
    ],
    sections: [
      {
        id: "prepare-packet",
        heading: "Prepare the onboarding packet first",
        paragraphs: [
          "Confirm which pages need form fields completed and which pages only need a signature or initials.",
          "Work from a copy of the packet so the original template remains unchanged for future use.",
        ],
      },
      {
        id: "fill-then-sign",
        heading: "Fill first, then apply the signature step",
        paragraphs: [
          "Complete the text fields before signing so the final review matches the actual submitted version.",
          "Once the fields are correct, place the signature and export the completed packet.",
        ],
        bullets: [
          "check names, dates, and addresses carefully",
          "flatten a share copy when editable fields are no longer needed",
          "keep the source template outside the final employee packet",
        ],
      },
      {
        id: "handoff",
        heading: "Protect the handoff if the file leaves HR",
        paragraphs: [
          "If the completed packet is being emailed or uploaded, review whether password protection or portal upload is required by policy.",
          "Check the final packet in a separate viewer so no field is cut off or left blank by mistake.",
        ],
      },
    ],
    faqs: [
      {
        question: "Should I fill the fields before signing the PDF?",
        answer:
          "Yes. Fill the packet first so the signature is applied to the exact version that will be shared or stored.",
      },
      {
        question: "Should the final file stay editable?",
        answer:
          "Usually only if the workflow requires it. A flattened share copy is often cleaner once the onboarding packet is complete.",
      },
      {
        question: "Is this suitable for sensitive employee data?",
        answer:
          "It is a strong local-first approach for sensitive forms, but you still need the right HR handling and retention controls around the file.",
      },
      {
        question: "Does this workflow upload the packet?",
        answer:
          "No. The filling and signing steps run locally in your browser.",
      },
    ],
  },
  {
    slug: "compare-contract-versions-as-pdf",
    title: "Compare Contract Versions as PDF",
    primaryQuery: "compare contract versions as pdf",
    secondaryQueries: [
      "compare two contract pdfs",
      "pdf contract diff workflow",
      "review contract revisions locally",
    ],
    toolHref: "/tools/compare-pdf",
    relatedWorkflowSlugs: ["add-watermark-before-client-review", "remove-metadata-before-sharing-pdf"],
    intro: [
      `Contract review is usually faster when the diff is obvious before legal or client review begins. ${NO_UPLOADS_LINE}`,
      "Use this workflow to compare two PDF versions locally, confirm material changes, and then prepare the review copy that actually needs to leave your team.",
    ],
    sections: [
      {
        id: "version-control",
        heading: "Make sure you are comparing the right versions",
        paragraphs: [
          "Name the files clearly before running the comparison. Ambiguous names create review errors before the diff even starts.",
          "Keep the baseline and revised copies untouched so the report always points back to a stable source pair.",
        ],
      },
      {
        id: "review-diff",
        heading: "Review the diff with a legal or commercial lens",
        paragraphs: [
          "Focus first on changed clauses, schedules, signatures, defined terms, and any page where formatting shifts could hide a meaningful change.",
          "Use an annotated or watermarked review copy only after the version comparison is complete.",
        ],
        bullets: [
          "check definitions and payment clauses first",
          "confirm page numbers and annexes still line up",
          "export the diff report for the review file",
        ],
      },
      {
        id: "next-step",
        heading: "Decide what the recipient actually needs",
        paragraphs: [
          "Sometimes the next step is a marked-up review draft. Other times it is only a clean revised contract and an internal comparison record.",
          "Choose the smallest distribution set that still supports the review process.",
        ],
      },
    ],
    faqs: [
      {
        question: "Why compare contract versions locally?",
        answer:
          "It keeps draft agreements and negotiation history on-device during the comparison step, which is often preferable for confidentiality-sensitive work.",
      },
      {
        question: "What should I review first in the diff?",
        answer:
          "Start with the clauses that change obligations, money, dates, termination rights, and defined terms, then check schedules and signature areas.",
      },
      {
        question: "Should I add comments before or after the comparison?",
        answer:
          "Usually after. Compare the clean versions first, then create the review copy that needs comments or watermarks.",
      },
      {
        question: "Does the comparison step upload the contracts?",
        answer:
          "No. The comparison runs locally in your browser.",
      },
    ],
  },
  {
    slug: "make-scanned-pdf-searchable-for-records",
    title: "Make Scanned PDF Searchable for Records",
    primaryQuery: "make scanned pdf searchable for records",
    secondaryQueries: [
      "searchable records pdf workflow",
      "ocr scanned records locally",
      "make record scans searchable pdf",
    ],
    toolHref: "/tools/offline-ocr",
    relatedWorkflowSlugs: ["extract-passport-pages-for-visa-upload", "split-pdf-for-email-attachments"],
    intro: [
      `Record archives are much easier to work with when a scan becomes searchable, but the OCR step should still match the sensitivity of the file. ${NO_UPLOADS_LINE}`,
      "Use this workflow to run local OCR on scanned records, validate the output, and keep the original scan alongside the searchable copy.",
    ],
    sections: [
      {
        id: "source-quality",
        heading: "Check scan quality before you run OCR",
        paragraphs: [
          "OCR works best when the source scan is upright, readable, and not overly compressed.",
          "If the record set is mixed quality, split problem pages out first instead of forcing one pass over everything.",
        ],
      },
      {
        id: "run-local-ocr",
        heading: "Generate the searchable copy locally",
        paragraphs: [
          "Run OCR on the pages that need searchability and then test a few names, dates, or reference numbers in the output.",
          "Keep the original scan untouched as the source record while the searchable version becomes the working copy.",
        ],
        bullets: [
          "test search on a few known terms",
          "copy and paste from key pages to spot OCR issues",
          "split oversized records into smaller batches when needed",
        ],
      },
      {
        id: "records-management",
        heading: "Store the result in a way records staff can trust",
        paragraphs: [
          "Use a naming convention that distinguishes the original scan from the searchable working copy.",
          "If the record is sensitive, minimise how many intermediate exports you keep after validation.",
        ],
      },
    ],
    faqs: [
      {
        question: "Why keep the original scan after OCR?",
        answer:
          "Because the OCR copy is a processed working version. The original scan remains the safer source record if anything needs to be regenerated or rechecked.",
      },
      {
        question: "How do I confirm that the PDF is searchable?",
        answer:
          "Use search, text selection, and copy-and-paste on a few important terms before treating the OCR output as complete.",
      },
      {
        question: "What if the scanned record set is very large?",
        answer:
          "Split it into smaller batches first. That is usually more reliable than running one oversized OCR job in the browser.",
      },
      {
        question: "Does this workflow upload the scanned records?",
        answer:
          "No. The OCR step runs locally in your browser.",
      },
    ],
  },
  {
    slug: "password-protect-pdf-before-emailing",
    title: "Password-Protect PDF Before Emailing",
    primaryQuery: "password protect pdf before emailing",
    secondaryQueries: [
      "protect pdf for email attachment",
      "send password protected pdf by email",
      "email pdf securely with password",
    ],
    toolHref: "/tools/protect-pdf",
    relatedWorkflowSlugs: ["split-pdf-for-email-attachments", "compress-pdf-for-email"],
    intro: [
      `If a PDF has to be emailed, password protection can reduce exposure before the attachment leaves your inbox. ${NO_UPLOADS_LINE}`,
      "Use this workflow to protect the file locally, validate the export, and then share the password through a separate route.",
    ],
    sections: [
      {
        id: "decide-if-email-is-right",
        heading: "Confirm that email is the right route first",
        paragraphs: [
          "Password protection helps, but it does not make every document safe for email by default.",
          "Check whether a portal, secure transfer route, or internal system is the required path before you send the attachment.",
        ],
      },
      {
        id: "protect-the-copy",
        heading: "Protect the share copy, not the source file",
        paragraphs: [
          "Keep the original untouched and create a separate protected version for the email workflow.",
          "Once the password is applied, open the file and test it before composing the message.",
        ],
        bullets: [
          "protect the final share copy only",
          "test the password before sending",
          "send the password in a different channel",
        ],
      },
      {
        id: "email-handoff",
        heading: "Make the recipient handoff clear",
        paragraphs: [
          "Tell the recipient what file to expect and how the password will arrive.",
          "If the PDF is large, combine protection with splitting or compression only after you verify readability.",
        ],
      },
    ],
    faqs: [
      {
        question: "Should I send the PDF password in the same email?",
        answer:
          "Usually no. Send the password through a different channel so the attachment and the access key are not bundled together.",
      },
      {
        question: "Should I protect the original file?",
        answer:
          "No. Protect a share copy and keep the clean source file unchanged for internal records.",
      },
      {
        question: "Does password protection make email fully secure?",
        answer:
          "It helps, but it does not replace broader judgement about whether email is the right delivery route for the document.",
      },
      {
        question: "Does this workflow upload the PDF?",
        answer:
          "No. The protection step runs locally in your browser.",
      },
    ],
  },
]

const byToolLabel: Record<string, string> = {
  "/tools/compress-pdf": "Use the Compress PDF tool",
  "/tools/merge-pdf": "Use the Merge PDF tool",
  "/tools/split-pdf": "Use the Split PDF tool",
  "/tools/extract-pdf": "Use the Extract Pages tool",
}

function withPrefix(slug: string) {
  return `${WORKFLOW_PREFIX}/${slug}`
}

function createWorkflowArticle(config: WorkflowConfig): TrancheLearnArticle {
  const [relatedA, relatedB] = config.relatedWorkflowSlugs
  const prefixedSlug = withPrefix(config.slug)
  const sections =
    config.sections ??
    [
      {
        id: "step-by-step",
        heading: "Step-by-step instructions",
        paragraphs: [
          "Collect the source PDFs first and rename them in the final order before you begin.",
          "Run the workflow once, check the output pages, then keep the original files unchanged for traceability.",
        ],
        bullets: [
          "Open the relevant Plain tool in your browser",
          "Select the files or page ranges you need",
          "Process the document and download the result",
          "Confirm readability, page order, and file size before sharing",
        ],
      },
      {
        id: "privacy-explanation",
        heading: "Why local processing matters",
        paragraphs: [
          "When you process documents locally, file contents are not transferred to a third-party processing service.",
          "For sensitive paperwork, this reduces avoidable transfer exposure and supports a cleaner compliance posture.",
        ],
      },
      {
        id: "quality-checks",
        heading: "Quality checks before sending",
        paragraphs: [
          "Open the output in a separate PDF viewer and check first page, last page, and any critical attachment pages.",
          "If the file is being uploaded to a portal, verify the accepted size and naming format before final upload.",
        ],
      },
      {
        id: "when-to-repeat",
        heading: "When to repeat the workflow",
        paragraphs: [
          "Repeat the process when source documents change or when portal limits are updated.",
          "Keep a simple processing note with date and version if the document is part of a recurring submission routine.",
        ],
      },
    ]
  const faqs =
    config.faqs ??
    [
      {
        question: `Can I ${config.primaryQuery} without creating an account?`,
        answer:
          "Yes. You can run this workflow in the browser without an account for the local processing steps.",
      },
      {
        question: "Will this workflow upload my files?",
        answer:
          "No. Core processing happens locally in your browser session. You can verify this in your network inspector.",
      },
      {
        question: "How do I keep the output readable after processing?",
        answer:
          "Check the downloaded file in a separate viewer and inspect key pages before sharing or submitting it.",
      },
      {
        question: "Is this legal or financial advice?",
        answer:
          "No. This page is informational and focuses on workflow mechanics only.",
      },
    ]

  return {
    slug: prefixedSlug,
    title: config.title,
    metaTitle: `${config.title} - Offline & Private | Plain.tools`,
    metaDescription: `${config.title}. ${NO_UPLOADS_LINE}`,
    primaryQuery: config.primaryQuery,
    secondaryQueries:
      config.secondaryQueries ??
      [
        `${config.primaryQuery} without upload`,
        `${config.primaryQuery} online`,
        `${config.primaryQuery} private`,
      ],
    intent: "how-to",
    intro:
      config.intro ??
      [
        `${config.title} is straightforward with a local workflow and a quick review checklist. ${NO_UPLOADS_LINE}`,
        "Use the steps below to keep document handling predictable, especially when files contain personal or financial data.",
      ],
    sections,
    faqs,
    trustBox,
    nextSteps: [
      {
        label: byToolLabel[config.toolHref] ?? "Open the related tool",
        href: config.toolHref,
      },
      {
        label: "Browse all PDF tools",
        href: "/tools",
      },
      {
        label: "Privacy guide: No Uploads Explained",
        href: "/learn/no-uploads-explained",
      },
      {
        label: "Privacy guide: Why PDF Uploads Are Risky",
        href: "/learn/why-pdf-uploads-are-risky",
      },
      {
        label: "Verify claims with DevTools",
        href: "/verify-claims",
      },
      {
        label: `Related workflow: ${relatedA.replace(/-/g, " ")}`,
        href: `/learn/workflows/${relatedA}`,
      },
      {
        label: `Related workflow: ${relatedB.replace(/-/g, " ")}`,
        href: `/learn/workflows/${relatedB}`,
      },
    ],
    toolHref: config.toolHref,
    relatedLearn: [withPrefix(relatedA), withPrefix(relatedB)],
    verifyHref: "/verify-claims",
  }
}

export const workflowPages: TrancheLearnArticle[] = workflowConfigs.map(createWorkflowArticle)

const workflowMap = new Map(workflowPages.map((page) => [page.slug, page]))

export function getWorkflowArticleOrThrow(slug: string) {
  const page = workflowMap.get(withPrefix(slug))
  if (!page) {
    throw new Error(`Missing workflow article for slug: ${slug}`)
  }
  return page
}

export const workflowRouteSlugs = workflowConfigs.map((config) => config.slug)
export const workflowSitemapUrls = workflowRouteSlugs.map((slug) => `/learn/workflows/${slug}`)
