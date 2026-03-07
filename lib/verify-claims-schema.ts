import {
  buildBreadcrumbList,
  buildFaqPageSchema,
  buildHowToSchema,
  buildSoftwareApplicationSchema,
  buildWebPageSchema,
  combineJsonLd,
} from "@/lib/structured-data"

export const verifyClaimsFaqs = [
  {
    question: "How do I verify files are not uploaded?",
    answer:
      "Open your browser DevTools, switch to the Network tab, run a PDF workflow, and confirm no request contains your file bytes.",
  },
  {
    question: "Does Plain upload my PDFs?",
    answer:
      "No. Core local PDF tools process files directly in your browser. File bytes are not uploaded for those workflows.",
  },
  {
    question: "Can I inspect this myself?",
    answer:
      "Yes. Filter DevTools requests by Fetch and XHR while running a tool and inspect payloads for file-content transfer.",
  },
  {
    question: "Does this page guarantee absolute security?",
    answer:
      "No. It provides practical verification steps so you can validate behaviour yourself in your own browser environment.",
  },
] as const

export const verifyClaimsSchema = combineJsonLd([
  buildWebPageSchema({
    name: "We Dare You to Catch Us Uploading Your Files",
    description:
      "Interactive proof page showing how to verify Plain Tools no-upload claims in browser DevTools.",
    url: "https://plain.tools/verify-claims",
  }),
  buildSoftwareApplicationSchema({
    name: "Plain Tools",
    description:
      "Privacy-first browser utility platform for local PDF workflows, file processing, and diagnostics with verifiable no-upload behaviour.",
    url: "https://plain.tools",
    featureList: [
      "Core PDF workflows run locally in your browser",
      "No upload step for core local PDF processing",
      "Verification guidance using browser network inspection",
    ],
    sameAs: ["https://github.com/Drgblack/plain-tools"],
  }),
  buildBreadcrumbList([
    { name: "Home", url: "https://plain.tools/" },
    { name: "Verify Claims", url: "https://plain.tools/verify-claims" },
  ]),
  buildHowToSchema(
    "How to verify no-upload PDF processing claims",
    "Use browser DevTools to validate whether file bytes are uploaded during tool usage.",
    [
      { name: "Open DevTools", text: "Open browser DevTools and switch to the Network tab." },
      { name: "Filter requests", text: "Filter requests to Fetch and XHR types while running a tool." },
      { name: "Run a tool workflow", text: "Upload and process a test PDF with a local tool." },
      { name: "Inspect payload data", text: "Confirm no request payload includes your PDF file bytes." },
    ]
  ),
  buildFaqPageSchema(verifyClaimsFaqs),
])

