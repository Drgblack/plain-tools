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
    question: "Do PDF converters upload files?",
    answer:
      "Many online PDF converters do upload files to remote servers because the conversion runs in cloud infrastructure. Plain Tools core PDF workflows are built to process files locally in the browser instead.",
  },
  {
    question: "Are online PDF tools safe?",
    answer:
      "Some are safer than others, but safety depends on architecture and handling practices. If a tool uploads your file for processing, you are trusting that provider with the document and any hidden data inside it.",
  },
  {
    question: "Can websites see my documents when I convert a PDF?",
    answer:
      "Yes, if the website uploads the file to its servers for processing. With local browser processing, the site can run the workflow without sending the document bytes away during the core task.",
  },
  {
    question: "Do PDF compressors store files?",
    answer:
      "Many upload-based PDF compressors temporarily process files on remote infrastructure, and some may log or retain them according to their own policies. Plain Tools core compression is designed to run on-device instead.",
  },
  {
    question: "Is local PDF processing more secure?",
    answer:
      "Local processing is usually a stronger privacy default because the file stays on your device during the task. It reduces exposure to third-party storage, server logs, and cloud transfer paths, but you should still verify the behaviour in DevTools.",
  },
] as const

export const verifyClaimsSchema = combineJsonLd([
  buildWebPageSchema({
    name: "Do online PDF tools upload your files?",
    description:
      "Learn how online PDF tools process documents and verify that Plain.tools keeps files on your device. See how to confirm this using your browser’s developer tools.",
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
