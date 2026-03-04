import {
  LearnSeoArticlePage,
  buildLearnArticleMetadata,
  type LearnArticleData,
} from "@/components/learn/seo-article-page"

const article: LearnArticleData = {
  slug: "how-to-verify-a-pdf-tool-doesnt-upload-your-files",
  title: "How to Verify a PDF Tool Does not Upload Your Files",
  description:
    "Learn how to verify PDF privacy with DevTools by inspecting network requests, testing offline behavior, and proving whether file bytes leave your browser.",
  updated: "March 3, 2026",
  readTime: "10 min read",
  keywords: [
    "how to check PDF tool uploads files",
    "verify PDF privacy devtools",
    "network tab file upload check",
    "offline PDF tools verification",
  ],
  intro: [
    "Privacy claims are easy to write and hard to trust. The good news is that you can verify a PDF tool's behavior yourself in a few minutes with built-in browser tooling.",
    "You do not need to reverse engineer code or use packet sniffers. Browser DevTools already shows every network request a page makes while you upload, process, and download files.",
    "This guide gives you a repeatable verification workflow you can use for Plain or any other PDF service before sending sensitive documents.",
  ],
  sections: [
    {
      heading: "What You Are Verifying",
      paragraphs: [
        "The central question is simple: does document processing happen on your device, or are file bytes sent to a remote server? A tool can look local in the UI while still uploading content in the background, so the interface alone is not evidence.",
        "You want to observe behavior, not promises. Specifically, you will check request endpoints, payload size, request method, and timing while performing a real operation. If your file is transmitted, you will see it in the network log.",
      ],
      subSections: [
        {
          heading: "Do This for Every Tool, Not Once",
          paragraphs: [
            "Even reputable products evolve. New features, analytics changes, or third-party integrations can alter data flows over time. Re-run this check periodically, especially before using high-sensitivity documents.",
          ],
        },
      ],
    },
    {
      heading: "Step 1: Open DevTools and Prepare the Network Panel",
      paragraphs: [
        "Open DevTools with Cmd+Option+I on macOS or F12 / Ctrl+Shift+I on Windows. Select the Network tab, clear existing requests, and enable Preserve log if available so navigation does not hide requests.",
        "Filter to XHR and Fetch first because these usually carry API traffic. If you want full confidence, run the same test again with all request types visible and inspect any suspicious entries manually.",
      ],
      subSections: [
        {
          heading: "Use an Easy-to-Recognize Test File",
          paragraphs: [
            "Create a small PDF with unique text like VERIFY-LOCAL-12345 in the content or filename. If upload occurs, that marker can appear in payload previews, making detection easier.",
          ],
        },
      ],
    },
    {
      heading: "Step 2: Perform a Real Processing Action",
      paragraphs: [
        "Select your file and run an operation such as merge, split, compression, or redaction. Do not stop at opening the page. Actual processing steps are where upload endpoints appear on cloud tools.",
        "Watch for POST or PUT requests during the exact moment you click the action button. Those methods can still be harmless, but they are the first place to inspect because they commonly carry document bytes.",
      ],
      subSections: [
        {
          heading: "Compare Request Size to File Size",
          paragraphs: [
            "If your PDF is 8 MB and you see a newly created request around that size, investigate immediately. Even compressed payloads still tend to correlate with source file magnitude.",
          ],
        },
      ],
    },
    {
      heading: "Step 3: Inspect Request Details Carefully",
      paragraphs: [
        "Click any suspicious request and inspect headers and payload. Multipart form uploads, binary blobs, or base64 data fields are common indicators of document transfer. Also check destination domains. Unexpected third-party endpoints are a red flag.",
        "Some tools split uploads into chunks. Instead of one large request, you may see many smaller POST calls close together. The pattern still indicates transfer if total payload roughly matches your document size.",
      ],
      subSections: [
        {
          heading: "What a Local Tool Usually Shows",
          paragraphs: [
            "Mostly static asset requests, optional telemetry pings without file content, and download URLs for local blobs. You should not see file payloads sent off-device during processing.",
          ],
        },
      ],
    },
    {
      heading: "Step 4: Run the Offline Confirmation Test",
      paragraphs: [
        "After page load, disconnect your internet and try the same operation again. A true client-side workflow continues to process documents because core logic runs in browser memory using local libraries.",
        "If processing fails immediately without connectivity, the tool likely depends on remote infrastructure. That may be acceptable for your use case, but it is not the same as no-upload processing.",
      ],
      subSections: [
        {
          heading: "Airplane Mode Is a High-Signal Test",
          paragraphs: [
            "This test cuts through ambiguous docs and marketing language. If a tool claims local-first but cannot operate offline after initial load, treat the claim as incomplete.",
          ],
        },
      ],
    },
    {
      heading: "Step 5: Validate Cookies, Storage, and Third-Party Scripts",
      paragraphs: [
        "Open the Application panel and inspect Cookies, Local Storage, and IndexedDB. Presence of analytics cookies does not prove file upload, but it signals additional data collection pathways you should evaluate for policy fit.",
        "In Sources and Network, review third-party scripts loaded on the page. Extensive ad-tech or session replay tooling is usually incompatible with strict privacy expectations around sensitive documents.",
      ],
      subSections: [
        {
          heading: "Keep Evidence for Internal Reviews",
          paragraphs: [
            "Capture screenshots of clean network traces and store them in your vendor evaluation notes. This creates a defensible record for compliance, procurement, or security review workflows.",
          ],
        },
      ],
    },
    {
      heading: "Common Misreadings and How to Avoid Them",
      paragraphs: [
        "Seeing network activity does not always mean file upload. Pages need fonts, scripts, and localization assets. The key is whether document content itself is transmitted in requests after you select or process a file.",
        "Likewise, no visible request does not guarantee perfect security. Browser extensions, compromised endpoints, or screenshots can still leak data. Verification should be part of a broader security posture, not a sole control.",
      ],
      subSections: [
        {
          heading: "Build a Repeatable Checklist",
          paragraphs: [
            "Standardize your checks: network clear, operation run, payload inspect, offline test, storage review, and evidence capture. Consistency prevents false confidence and catches regressions early.",
          ],
        },
      ],
    },
  ],
  faqs: [
    {
      question: "Can a tool upload files even if it says it uses encryption?",
      answer:
        "Yes. Encryption in transit protects data while traveling to a server, but your file is still uploaded. Local processing avoids that transfer entirely.",
    },
    {
      question: "Is checking only the XHR filter enough?",
      answer:
        "It is a good start but not exhaustive. For higher assurance, inspect all request types and review payload details for anything unusual.",
    },
    {
      question: "Where can I practice this process quickly?",
      answer:
        "Use the Plain verification flow and repeat the same checks on other tools so you can compare behavior under identical test steps.",
    },
  ],
  relatedLearn: [
    { label: "Why You Should Never Upload Medical Records", href: "/learn/why-you-should-never-upload-medical-records-to-pdf-tools" },
    { label: "GDPR and PDF Tools: What Businesses Need to Know", href: "/learn/gdpr-and-pdf-tools-what-businesses-need-to-know" },
    { label: "WebAssembly PDF Processing Explained", href: "/learn/webassembly-pdf-processing-explained" },
  ],
  cta: {
    label: "Try Q&A on PDF",
    href: "/tools/pdf-qa",
    text: "Use a real tool flow and verify network behavior in DevTools while processing PDF content locally.",
  },
}

export const metadata = buildLearnArticleMetadata(article)

export default function VerifyNoUploadsLearnPage() {
  return <LearnSeoArticlePage article={article} />
}
