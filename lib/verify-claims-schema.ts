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
    question: "How do I verify no upload?",
    answer:
      "Open DevTools, switch to the Network tab, run a local PDF workflow, and inspect Fetch and XHR requests to confirm no file bytes are being sent.",
  },
  {
    question: "What should I look for in the Network tab?",
    answer:
      "Look for outgoing requests, request payloads, and multipart form uploads while the tool runs. Local workflows should not send your PDF content to a remote endpoint.",
  },
  {
    question: "Does Plain Tools upload my PDFs?",
    answer:
      "No for core local PDF tools. Those workflows process files directly in your browser without uploading document bytes to a Plain Tools server.",
  },
  {
    question: "Can I inspect the implementation on GitHub?",
    answer:
      "Yes. The public repository shows how the product is built, and you can compare that code with what you observe in your own browser during a live test.",
  },
  {
    question: "Are AI features included in the no-upload claim?",
    answer:
      "No. AI features are opt-in and may send extracted text for processing. The no-upload verification on this page applies to the core local workflows.",
  },
] as const

export const verifyClaimsSchema = combineJsonLd([
  buildWebPageSchema({
    name: "Verify Plain Tools no-upload claims",
    description:
      "Verification page showing how to inspect Plain Tools network behaviour, confirm no-upload workflows, and validate claims in DevTools.",
    url: "https://plain.tools/verify-claims",
  }),
  buildSoftwareApplicationSchema({
    name: "Plain Tools",
    description:
      "Privacy-first browser utility platform for local PDF workflows, file tasks, and diagnostics with a free tier and verifiable no-upload behaviour.",
    url: "https://plain.tools",
    featureList: [
      "Core PDF workflows run locally in your browser",
      "No upload step for core local PDF processing",
      "Verification guidance using browser network inspection",
      "Free access to core browser-based utilities",
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
