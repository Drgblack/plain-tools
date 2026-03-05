import type { TrancheLearnArticle, TrancheTrustBox } from "@/lib/seo/tranche1-content"

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

  return {
    slug: prefixedSlug,
    title: config.title,
    metaTitle: `${config.title} - Offline & Private | Plain.tools`,
    metaDescription: `${config.title}. ${NO_UPLOADS_LINE}`,
    primaryQuery: config.primaryQuery,
    secondaryQueries: [
      `${config.primaryQuery} without upload`,
      `${config.primaryQuery} online`,
      `${config.primaryQuery} private`,
    ],
    intent: "how-to",
    intro: [
      `${config.title} is straightforward with a local workflow and a quick review checklist. ${NO_UPLOADS_LINE}`,
      "Use the steps below to keep document handling predictable, especially when files contain personal or financial data.",
    ],
    sections: [
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
    ],
    faqs: [
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
    ],
    trustBox,
    nextSteps: [
      {
        label: byToolLabel[config.toolHref] ?? "Open the related tool",
        href: config.toolHref,
      },
      {
        label: "Browse all PDF tools",
        href: "/pdf-tools/tools",
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
