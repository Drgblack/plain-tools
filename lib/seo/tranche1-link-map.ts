import { comparePages, learnPages } from "@/lib/seo/tranche1-content"
import { converterPages } from "@/lib/seo/file-converters-content"
import { workflowPages } from "@/lib/seo/workflows-content"
import { getToolBySlug, TOOL_CATALOGUE } from "@/lib/tools-catalogue"

export type RouteLink = {
  label: string
  href: string
}

type ToolLinkRule = {
  learnLinks: RouteLink[]
  relatedTools?: RouteLink[]
  verify?: RouteLink
  comparison: RouteLink
}

type LearnLinkRule = {
  primaryTool: RouteLink
  relatedLearn: RouteLink[]
  verify: RouteLink
}

type CompareLinkRule = {
  verify: RouteLink
  relatedLearn: RouteLink[]
  relatedTools: RouteLink[]
}

const verifyLink: RouteLink = { label: "Verify Claims", href: "/verify-claims" }

function formatToolSlug(slug: string) {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (token) => token.toUpperCase())
}

function getToolNameFromHref(href: string) {
  const slug = href.replace("/tools/", "")
  return getToolBySlug(slug)?.name ?? formatToolSlug(slug)
}

function asDescriptiveToolAnchor(link: RouteLink): RouteLink {
  if (!link.href.startsWith("/tools/")) return link
  const toolName = getToolNameFromHref(link.href)
  return {
    ...link,
    label: `Use ${toolName} locally`,
  }
}

function asDescriptiveCompareAnchor(link: RouteLink): RouteLink {
  if (!link.href.startsWith("/compare/")) return link
  if (/^compare plain tools with/i.test(link.label)) return link
  const raw = link.label
    .replace(/^plain\s*(tools|\.tools)\s*vs\s*/i, "")
    .replace(/^plain\s*vs\s*/i, "")
    .trim()
  const target = raw || "cloud alternatives"
  return {
    ...link,
    label: `Compare Plain Tools with ${target}`,
  }
}

export const TOOL_TO_SEO_LINKS: Record<string, ToolLinkRule> = {
  "merge-pdf": {
    learnLinks: [
      { label: "How to Merge PDFs Offline", href: "/learn/how-to-merge-pdfs-offline" },
      { label: "No Uploads Explained", href: "/learn/no-uploads-explained" },
      { label: "Why PDF Uploads Are Risky", href: "/learn/why-pdf-uploads-are-risky" },
    ],
    comparison: { label: "Offline vs Online PDF Tools", href: "/compare/offline-vs-online-pdf-tools" },
  },
  "split-pdf": {
    learnLinks: [
      { label: "How to Split a PDF by Pages", href: "/learn/how-to-split-a-pdf-by-pages" },
      { label: "How PDFs Work", href: "/learn/how-pdfs-work" },
      { label: "What Is a PDF", href: "/learn/what-is-a-pdf" },
    ],
    comparison: { label: "Offline vs Online PDF Tools", href: "/compare/offline-vs-online-pdf-tools" },
  },
  "compare-pdf": {
    learnLinks: [
      { label: "How to Verify a PDF Tool Does Not Upload Your Files", href: "/learn/how-to-verify-a-pdf-tool-doesnt-upload-your-files" },
      { label: "No Uploads Explained", href: "/learn/no-uploads-explained" },
      { label: "How PDFs Work", href: "/learn/how-pdfs-work" },
    ],
    relatedTools: [
      { label: "Merge PDFs", href: "/tools/merge-pdf" },
      { label: "Split PDF", href: "/tools/split-pdf" },
      { label: "Annotate PDF", href: "/tools/annotate-pdf" },
    ],
    comparison: { label: "Offline vs Online PDF Tools", href: "/compare/offline-vs-online-pdf-tools" },
  },
  "compress-pdf": {
    learnLinks: [
      { label: "Compress PDF Without Losing Quality", href: "/learn/compress-pdf-without-losing-quality" },
      { label: "Why PDF Uploads Are Risky", href: "/learn/why-pdf-uploads-are-risky" },
      { label: "No Uploads Explained", href: "/learn/no-uploads-explained" },
    ],
    comparison: { label: "Plain vs iLovePDF", href: "/compare/plain-vs-ilovepdf" },
  },
  "extract-pdf": {
    learnLinks: [
      { label: "How to Extract Pages from a PDF", href: "/learn/how-to-extract-pages-from-a-pdf" },
      { label: "How PDFs Work", href: "/learn/how-pdfs-work" },
      { label: "Common PDF Privacy Mistakes", href: "/learn/common-pdf-privacy-mistakes" },
    ],
    comparison: { label: "Offline vs Online PDF Tools", href: "/compare/offline-vs-online-pdf-tools" },
  },
  "reorder-pdf": {
    learnLinks: [
      { label: "How PDFs Work", href: "/learn/how-pdfs-work" },
      { label: "How to Split a PDF by Pages", href: "/learn/how-to-split-a-pdf-by-pages" },
      { label: "What Is a PDF", href: "/learn/what-is-a-pdf" },
    ],
    comparison: { label: "Plain vs Sejda", href: "/compare/plain-vs-sejda" },
  },
  "convert-pdf": {
    learnLinks: [
      { label: "What Is a PDF", href: "/learn/what-is-a-pdf" },
      { label: "How PDFs Work", href: "/learn/how-pdfs-work" },
      { label: "No Uploads Explained", href: "/learn/no-uploads-explained" },
    ],
    comparison: { label: "Offline vs Online PDF Tools", href: "/compare/offline-vs-online-pdf-tools" },
  },
  "pdf-to-word": {
    learnLinks: [
      { label: "How to Verify a PDF Tool Does Not Upload Your Files", href: "/learn/how-to-verify-a-pdf-tool-doesnt-upload-your-files" },
      { label: "No Uploads Explained", href: "/learn/no-uploads-explained" },
      { label: "How PDFs Work", href: "/learn/how-pdfs-work" },
    ],
    relatedTools: [
      { label: "Word to PDF", href: "/tools/word-to-pdf" },
      { label: "PDF to Excel", href: "/tools/pdf-to-excel" },
      { label: "OCR PDF", href: "/tools/ocr-pdf" },
    ],
    comparison: { label: "Best PDF Tools with No Upload", href: "/compare/best-pdf-tools-no-upload" },
  },
  "word-to-pdf": {
    learnLinks: [
      { label: "No Uploads Explained", href: "/learn/no-uploads-explained" },
      { label: "How to Verify a PDF Tool Does Not Upload Your Files", href: "/learn/how-to-verify-a-pdf-tool-doesnt-upload-your-files" },
      { label: "How PDFs Work", href: "/learn/how-pdfs-work" },
    ],
    relatedTools: [
      { label: "PDF to Word", href: "/tools/pdf-to-word" },
      { label: "Merge PDFs", href: "/tools/merge-pdf" },
      { label: "Compress PDF", href: "/tools/compress-pdf" },
    ],
    comparison: { label: "Best PDF Tools with No Upload", href: "/compare/best-pdf-tools-no-upload" },
  },
  "pdf-to-jpg": {
    learnLinks: [
      { label: "No Uploads Explained", href: "/learn/no-uploads-explained" },
      { label: "How to Verify a PDF Tool Does Not Upload Your Files", href: "/learn/how-to-verify-a-pdf-tool-doesnt-upload-your-files" },
      { label: "How PDFs Work", href: "/learn/how-pdfs-work" },
    ],
    relatedTools: [
      { label: "JPG to PDF", href: "/tools/jpg-to-pdf" },
      { label: "Compress PDF", href: "/tools/compress-pdf" },
      { label: "OCR PDF", href: "/tools/ocr-pdf" },
    ],
    comparison: { label: "Offline vs Online PDF Tools", href: "/compare/offline-vs-online-pdf-tools" },
  },
  "jpg-to-pdf": {
    learnLinks: [
      { label: "No Uploads Explained", href: "/learn/no-uploads-explained" },
      { label: "How to Verify a PDF Tool Does Not Upload Your Files", href: "/learn/how-to-verify-a-pdf-tool-doesnt-upload-your-files" },
      { label: "How PDFs Work", href: "/learn/how-pdfs-work" },
    ],
    relatedTools: [
      { label: "PDF to JPG", href: "/tools/pdf-to-jpg" },
      { label: "Merge PDFs", href: "/tools/merge-pdf" },
      { label: "Sign PDF", href: "/tools/sign-pdf" },
    ],
    comparison: { label: "Best PDF Tools with No Upload", href: "/compare/best-pdf-tools-no-upload" },
  },
  "pdf-to-excel": {
    learnLinks: [
      { label: "OCR PDF Without Cloud", href: "/learn/ocr-pdf-without-cloud" },
      { label: "No Uploads Explained", href: "/learn/no-uploads-explained" },
      { label: "How to Verify a PDF Tool Does Not Upload Your Files", href: "/learn/how-to-verify-a-pdf-tool-doesnt-upload-your-files" },
    ],
    relatedTools: [
      { label: "PDF to Word", href: "/tools/pdf-to-word" },
      { label: "OCR PDF", href: "/tools/ocr-pdf" },
      { label: "PDF to PowerPoint", href: "/tools/pdf-to-ppt" },
    ],
    comparison: { label: "Best PDF Tools with No Upload", href: "/compare/best-pdf-tools-no-upload" },
  },
  "pdf-to-ppt": {
    learnLinks: [
      { label: "How PDFs Work", href: "/learn/how-pdfs-work" },
      { label: "No Uploads Explained", href: "/learn/no-uploads-explained" },
      { label: "How to Verify a PDF Tool Does Not Upload Your Files", href: "/learn/how-to-verify-a-pdf-tool-doesnt-upload-your-files" },
    ],
    relatedTools: [
      { label: "PDF to Word", href: "/tools/pdf-to-word" },
      { label: "PDF to Excel", href: "/tools/pdf-to-excel" },
      { label: "OCR PDF", href: "/tools/ocr-pdf" },
    ],
    comparison: { label: "Offline vs Online PDF Tools", href: "/compare/offline-vs-online-pdf-tools" },
  },
  "pdf-to-html": {
    learnLinks: [
      { label: "How to Verify a PDF Tool Does Not Upload Your Files", href: "/learn/how-to-verify-a-pdf-tool-doesnt-upload-your-files" },
      { label: "No Uploads Explained", href: "/learn/no-uploads-explained" },
      { label: "How PDFs Work", href: "/learn/how-pdfs-work" },
    ],
    relatedTools: [
      { label: "PDF to Word", href: "/tools/pdf-to-word" },
      { label: "PDF to Excel", href: "/tools/pdf-to-excel" },
      { label: "Text to PDF", href: "/tools/text-to-pdf" },
    ],
    comparison: { label: "Best PDF Tools with No Upload", href: "/compare/best-pdf-tools-no-upload" },
  },
  "html-to-pdf": {
    learnLinks: [
      { label: "How to Verify a PDF Tool Does Not Upload Your Files", href: "/learn/how-to-verify-a-pdf-tool-doesnt-upload-your-files" },
      { label: "No Uploads Explained", href: "/learn/no-uploads-explained" },
      { label: "How PDFs Work", href: "/learn/how-pdfs-work" },
    ],
    relatedTools: [
      { label: "PDF to HTML", href: "/tools/pdf-to-html" },
      { label: "Text to PDF", href: "/tools/text-to-pdf" },
      { label: "PDF to Markdown", href: "/tools/pdf-to-markdown" },
    ],
    comparison: { label: "Best PDF Tools with No Upload", href: "/compare/best-pdf-tools-no-upload" },
  },
  "pdf-to-markdown": {
    learnLinks: [
      { label: "How to Verify a PDF Tool Does Not Upload Your Files", href: "/learn/how-to-verify-a-pdf-tool-doesnt-upload-your-files" },
      { label: "No Uploads Explained", href: "/learn/no-uploads-explained" },
      { label: "How PDFs Work", href: "/learn/how-pdfs-work" },
    ],
    relatedTools: [
      { label: "PDF to HTML", href: "/tools/pdf-to-html" },
      { label: "PDF to Word", href: "/tools/pdf-to-word" },
      { label: "Text to PDF", href: "/tools/text-to-pdf" },
    ],
    comparison: { label: "Best PDF Tools with No Upload", href: "/compare/best-pdf-tools-no-upload" },
  },
  "image-compress": {
    learnLinks: [
      { label: "No Uploads Explained", href: "/learn/no-uploads-explained" },
      { label: "How to Verify a PDF Tool Does Not Upload Your Files", href: "/learn/how-to-verify-a-pdf-tool-doesnt-upload-your-files" },
      { label: "Compress PDF Without Losing Quality", href: "/learn/compress-pdf-without-losing-quality" },
    ],
    relatedTools: [
      { label: "PDF to JPG", href: "/tools/pdf-to-jpg" },
      { label: "JPG to PDF", href: "/tools/jpg-to-pdf" },
      { label: "PDF to HTML", href: "/tools/pdf-to-html" },
    ],
    comparison: { label: "Best PDF Tools with No Upload", href: "/compare/best-pdf-tools-no-upload" },
  },
  "zip-tool": {
    learnLinks: [
      { label: "No Uploads Explained", href: "/learn/no-uploads-explained" },
      { label: "How to Verify a PDF Tool Does Not Upload Your Files", href: "/learn/how-to-verify-a-pdf-tool-doesnt-upload-your-files" },
      { label: "Common PDF Privacy Mistakes", href: "/learn/common-pdf-privacy-mistakes" },
    ],
    relatedTools: [
      { label: "Base64 Encode / Decode", href: "/tools/base64" },
      { label: "File Hash / Checksum", href: "/tools/file-hash" },
      { label: "Image Compressor / Optimizer", href: "/tools/image-compress" },
    ],
    comparison: { label: "Best PDF Tools with No Upload", href: "/compare/best-pdf-tools-no-upload" },
  },
  "file-hash": {
    learnLinks: [
      { label: "How to Verify a PDF Tool Does Not Upload Your Files", href: "/learn/how-to-verify-a-pdf-tool-doesnt-upload-your-files" },
      { label: "No Uploads Explained", href: "/learn/no-uploads-explained" },
      { label: "Common PDF Privacy Mistakes", href: "/learn/common-pdf-privacy-mistakes" },
    ],
    relatedTools: [
      { label: "Base64 Encode / Decode", href: "/tools/base64" },
      { label: "Protect PDF", href: "/tools/protect-pdf" },
      { label: "Unlock PDF", href: "/tools/unlock-pdf" },
    ],
    comparison: { label: "Best PDF Tools with No Upload", href: "/compare/best-pdf-tools-no-upload" },
  },
  "qr-code": {
    learnLinks: [
      { label: "How to Verify a PDF Tool Does Not Upload Your Files", href: "/learn/how-to-verify-a-pdf-tool-doesnt-upload-your-files" },
      { label: "No Uploads Explained", href: "/learn/no-uploads-explained" },
      { label: "Common PDF Privacy Mistakes", href: "/learn/common-pdf-privacy-mistakes" },
    ],
    relatedTools: [
      { label: "File Hash / Checksum", href: "/tools/file-hash" },
      { label: "Base64 Encode / Decode", href: "/tools/base64" },
      { label: "JPG to PDF", href: "/tools/jpg-to-pdf" },
    ],
    comparison: { label: "Best PDF Tools with No Upload", href: "/compare/best-pdf-tools-no-upload" },
  },
  "qr-scanner": {
    learnLinks: [
      { label: "How to Verify a PDF Tool Does Not Upload Your Files", href: "/learn/how-to-verify-a-pdf-tool-doesnt-upload-your-files" },
      { label: "No Uploads Explained", href: "/learn/no-uploads-explained" },
      { label: "Common PDF Privacy Mistakes", href: "/learn/common-pdf-privacy-mistakes" },
    ],
    relatedTools: [
      { label: "QR Code Generator", href: "/tools/qr-code" },
      { label: "Base64 Encode / Decode", href: "/tools/base64" },
      { label: "File Hash / Checksum", href: "/tools/file-hash" },
    ],
    comparison: { label: "Best PDF Tools with No Upload", href: "/compare/best-pdf-tools-no-upload" },
  },
  "ocr-pdf": {
    learnLinks: [
      { label: "OCR PDF Without Cloud", href: "/learn/ocr-pdf-without-cloud" },
      { label: "No Uploads Explained", href: "/learn/no-uploads-explained" },
      { label: "How to Verify a PDF Tool Does Not Upload Your Files", href: "/learn/how-to-verify-a-pdf-tool-doesnt-upload-your-files" },
    ],
    relatedTools: [
      { label: "PDF to Word", href: "/tools/pdf-to-word" },
      { label: "PDF to Excel", href: "/tools/pdf-to-excel" },
      { label: "PDF to JPG", href: "/tools/pdf-to-jpg" },
    ],
    comparison: { label: "Offline vs Online PDF Tools", href: "/compare/offline-vs-online-pdf-tools" },
  },
  "sign-pdf": {
    learnLinks: [
      { label: "How to Sign a PDF Without Uploading It", href: "/learn/how-to-sign-a-pdf-without-uploading-it" },
      { label: "No Uploads Explained", href: "/learn/no-uploads-explained" },
      { label: "How to Verify a PDF Tool Does Not Upload Your Files", href: "/learn/how-to-verify-a-pdf-tool-doesnt-upload-your-files" },
    ],
    relatedTools: [
      { label: "Protect PDF", href: "/tools/protect-pdf" },
      { label: "Unlock PDF", href: "/tools/unlock-pdf" },
      { label: "Merge PDFs", href: "/tools/merge-pdf" },
    ],
    comparison: { label: "Plain vs DocuSign", href: "/compare/plain-vs-docusign" },
  },
  "watermark-pdf": {
    learnLinks: [
      { label: "No Uploads Explained", href: "/learn/no-uploads-explained" },
      { label: "How to Verify a PDF Tool Does Not Upload Your Files", href: "/learn/how-to-verify-a-pdf-tool-doesnt-upload-your-files" },
      { label: "Common PDF Privacy Mistakes", href: "/learn/common-pdf-privacy-mistakes" },
    ],
    relatedTools: [
      { label: "Sign PDF", href: "/tools/sign-pdf" },
      { label: "Protect PDF", href: "/tools/protect-pdf" },
      { label: "Rotate PDF Pages", href: "/tools/rotate-pdf" },
    ],
    comparison: { label: "Best PDF Tools with No Upload", href: "/compare/best-pdf-tools-no-upload" },
  },
  "annotate-pdf": {
    learnLinks: [
      { label: "No Uploads Explained", href: "/learn/no-uploads-explained" },
      { label: "How to Verify a PDF Tool Does Not Upload Your Files", href: "/learn/how-to-verify-a-pdf-tool-doesnt-upload-your-files" },
      { label: "Common PDF Privacy Mistakes", href: "/learn/common-pdf-privacy-mistakes" },
    ],
    relatedTools: [
      { label: "Sign PDF", href: "/tools/sign-pdf" },
      { label: "Add Watermark to PDF", href: "/tools/watermark-pdf" },
      { label: "Rotate PDF Pages", href: "/tools/rotate-pdf" },
    ],
    comparison: { label: "Best PDF Tools with No Upload", href: "/compare/best-pdf-tools-no-upload" },
  },
  "protect-pdf": {
    learnLinks: [
      { label: "No Uploads Explained", href: "/learn/no-uploads-explained" },
      { label: "Is Offline PDF Processing Secure", href: "/learn/is-offline-pdf-processing-secure" },
      { label: "How to Verify a PDF Tool Does Not Upload Your Files", href: "/learn/how-to-verify-a-pdf-tool-doesnt-upload-your-files" },
    ],
    relatedTools: [
      { label: "Unlock PDF", href: "/tools/unlock-pdf" },
      { label: "Sign PDF", href: "/tools/sign-pdf" },
      { label: "Merge PDFs", href: "/tools/merge-pdf" },
    ],
    comparison: { label: "Best PDF Tools with No Upload", href: "/compare/best-pdf-tools-no-upload" },
  },
  "unlock-pdf": {
    learnLinks: [
      { label: "No Uploads Explained", href: "/learn/no-uploads-explained" },
      { label: "Is Offline PDF Processing Secure", href: "/learn/is-offline-pdf-processing-secure" },
      { label: "How to Verify a PDF Tool Does Not Upload Your Files", href: "/learn/how-to-verify-a-pdf-tool-doesnt-upload-your-files" },
    ],
    relatedTools: [
      { label: "Protect PDF", href: "/tools/protect-pdf" },
      { label: "Sign PDF", href: "/tools/sign-pdf" },
      { label: "Password Breaker", href: "/tools/password-breaker" },
    ],
    comparison: { label: "Best PDF Tools with No Upload", href: "/compare/best-pdf-tools-no-upload" },
  },
  "metadata-purge": {
    learnLinks: [
      { label: "How to Remove PDF Metadata", href: "/learn/how-to-remove-pdf-metadata" },
      { label: "What Is PDF Metadata and Why It Matters", href: "/learn/what-is-pdf-metadata-and-why-it-matters" },
      { label: "GDPR and PDF Tools: What Businesses Need to Know", href: "/learn/gdpr-and-pdf-tools-what-businesses-need-to-know" },
    ],
    comparison: { label: "Plain vs Adobe Acrobat Online", href: "/compare/plain-vs-adobe-acrobat-online" },
  },
  "fill-pdf": {
    learnLinks: [
      { label: "How to Sign a PDF Without Uploading It", href: "/learn/how-to-sign-a-pdf-without-uploading-it" },
      { label: "How to Verify a PDF Tool Does Not Upload Your Files", href: "/learn/how-to-verify-a-pdf-tool-doesnt-upload-your-files" },
      { label: "No Uploads Explained", href: "/learn/no-uploads-explained" },
    ],
    comparison: { label: "Plain vs DocuSign", href: "/compare/plain-vs-docusign" },
  },
  "redact-pdf": {
    learnLinks: [
      { label: "How to Redact a PDF Properly", href: "/learn/how-to-redact-a-pdf-properly" },
      { label: "How PDF Redaction Really Works", href: "/learn/how-pdf-redaction-really-works" },
      { label: "Common PDF Privacy Mistakes", href: "/learn/common-pdf-privacy-mistakes" },
    ],
    comparison: { label: "Plain vs Adobe Acrobat Online", href: "/compare/plain-vs-adobe-acrobat-online" },
  },
  "local-signer": {
    learnLinks: [
      { label: "How to Sign a PDF Without Uploading It", href: "/learn/how-to-sign-a-pdf-without-uploading-it" },
      { label: "Is Offline PDF Processing Secure", href: "/learn/is-offline-pdf-processing-secure" },
      { label: "How to Verify a PDF Tool Does Not Upload Your Files", href: "/learn/how-to-verify-a-pdf-tool-doesnt-upload-your-files" },
    ],
    comparison: { label: "Plain vs DocuSign", href: "/compare/plain-vs-docusign" },
  },
  "offline-ocr": {
    learnLinks: [
      { label: "OCR PDF Without Cloud", href: "/learn/ocr-pdf-without-cloud" },
      { label: "Why PDF Uploads Are Risky", href: "/learn/why-pdf-uploads-are-risky" },
      { label: "No Uploads Explained", href: "/learn/no-uploads-explained" },
    ],
    comparison: { label: "Offline vs Online PDF Tools", href: "/compare/offline-vs-online-pdf-tools" },
  },
  "privacy-scan": {
    learnLinks: [
      { label: "Why You Should Never Upload Medical Records to PDF Tools", href: "/learn/why-you-should-never-upload-medical-records-to-pdf-tools" },
      { label: "How to Verify a PDF Tool Does Not Upload Your Files", href: "/learn/how-to-verify-a-pdf-tool-doesnt-upload-your-files" },
      { label: "Common PDF Privacy Mistakes", href: "/learn/common-pdf-privacy-mistakes" },
    ],
    comparison: { label: "Offline vs Online PDF Tools", href: "/compare/offline-vs-online-pdf-tools" },
  },
  "password-breaker": {
    learnLinks: [
      { label: "No Uploads Explained", href: "/learn/no-uploads-explained" },
      { label: "Is Offline PDF Processing Secure", href: "/learn/is-offline-pdf-processing-secure" },
      { label: "Why PDF Uploads Are Risky", href: "/learn/why-pdf-uploads-are-risky" },
    ],
    comparison: { label: "Offline vs Online PDF Tools", href: "/compare/offline-vs-online-pdf-tools" },
  },
  "webgpu-organiser": {
    learnLinks: [
      { label: "How PDFs Work", href: "/learn/how-pdfs-work" },
      { label: "What Is a PDF", href: "/learn/what-is-a-pdf" },
      { label: "How to Extract Pages from a PDF", href: "/learn/how-to-extract-pages-from-a-pdf" },
    ],
    comparison: { label: "Plain vs Sejda", href: "/compare/plain-vs-sejda" },
  },
  "batch-engine": {
    learnLinks: [
      { label: "Offline vs Online PDF Tools", href: "/compare/offline-vs-online-pdf-tools" },
      { label: "No Uploads Explained", href: "/learn/no-uploads-explained" },
      { label: "How to Verify a PDF Tool Does Not Upload Your Files", href: "/learn/how-to-verify-a-pdf-tool-doesnt-upload-your-files" },
    ],
    comparison: { label: "Plain vs Smallpdf", href: "/compare/plain-vs-smallpdf" },
  },
  "compression-preview": {
    learnLinks: [
      { label: "Compress PDF Without Losing Quality", href: "/learn/compress-pdf-without-losing-quality" },
      { label: "Why PDF Uploads Are Risky", href: "/learn/why-pdf-uploads-are-risky" },
      { label: "No Uploads Explained", href: "/learn/no-uploads-explained" },
    ],
    comparison: { label: "Plain vs Smallpdf", href: "/compare/plain-vs-smallpdf" },
  },
  "summarize-pdf": {
    learnLinks: [
      { label: "How to Verify a PDF Tool Does Not Upload Your Files", href: "/learn/how-to-verify-a-pdf-tool-doesnt-upload-your-files" },
      { label: "No Uploads Explained", href: "/learn/no-uploads-explained" },
      { label: "GDPR and PDF Tools: What Businesses Need to Know", href: "/learn/gdpr-and-pdf-tools-what-businesses-need-to-know" },
    ],
    comparison: { label: "Offline vs Online PDF Tools", href: "/compare/offline-vs-online-pdf-tools" },
  },
  "pdf-qa": {
    learnLinks: [
      { label: "How to Verify a PDF Tool Does Not Upload Your Files", href: "/learn/how-to-verify-a-pdf-tool-doesnt-upload-your-files" },
      { label: "No Uploads Explained", href: "/learn/no-uploads-explained" },
      { label: "Is Offline PDF Processing Secure", href: "/learn/is-offline-pdf-processing-secure" },
    ],
    comparison: { label: "Offline vs Online PDF Tools", href: "/compare/offline-vs-online-pdf-tools" },
  },
  "suggest-edits": {
    learnLinks: [
      { label: "How to Verify a PDF Tool Does Not Upload Your Files", href: "/learn/how-to-verify-a-pdf-tool-doesnt-upload-your-files" },
      { label: "No Uploads Explained", href: "/learn/no-uploads-explained" },
      { label: "Is Offline PDF Processing Secure", href: "/learn/is-offline-pdf-processing-secure" },
    ],
    comparison: { label: "Offline vs Online PDF Tools", href: "/compare/offline-vs-online-pdf-tools" },
  },
}

const allLearnPages = [...learnPages, ...workflowPages, ...converterPages]
const learnTitleBySlug = new Map(allLearnPages.map((page) => [page.slug, page.title]))
const converterSlugSet = new Set(converterPages.map((page) => page.slug))

function buildLearnRouteFromSlug(slug: string) {
  if (converterSlugSet.has(slug)) {
    return `/file-converters/${slug}`
  }
  return `/learn/${slug}`
}

export const LEARN_TO_SEO_LINKS: Record<string, LearnLinkRule> = Object.fromEntries(
  allLearnPages.map((article) => {
    const relatedLearn = article.relatedLearn.slice(0, 2).map((slug) => ({
      label: learnTitleBySlug.get(slug) ?? slug,
      href: buildLearnRouteFromSlug(slug),
    }))
    const primaryToolHref =
      article.nextSteps.find((step) => step.href.startsWith("/tools/"))?.href ?? article.toolHref
    const primaryToolName = getToolNameFromHref(primaryToolHref)
    return [
      article.slug,
      {
        primaryTool: {
          label: `Use ${primaryToolName} locally`,
          href: primaryToolHref,
        },
        relatedLearn,
        verify: verifyLink,
      } satisfies LearnLinkRule,
    ]
  })
)

export const COMPARE_TO_SEO_LINKS: Record<string, CompareLinkRule> = Object.fromEntries(
  comparePages.map((page) => [
    page.slug,
    {
      verify: verifyLink,
      relatedLearn: page.relatedLearn.slice(0, 2).map((slug) => ({
        label: learnTitleBySlug.get(slug) ?? slug,
        href: `/learn/${slug}`,
      })),
      relatedTools: page.toolHrefs.map((href) => ({
        label: `Use ${getToolNameFromHref(href)} locally`,
        href,
      })),
    } satisfies CompareLinkRule,
  ])
)

export function getToolSeoLinks(toolSlug: string) {
  const base = TOOL_TO_SEO_LINKS[toolSlug]
  const fallbackLearnLinks: RouteLink[] = [
    { label: "No Uploads Explained", href: "/learn/no-uploads-explained" },
    { label: "How to Verify a PDF Tool Does not Upload Your Files", href: "/learn/how-to-verify-a-pdf-tool-doesnt-upload-your-files" },
  ]
  const fallbackRelatedTools = TOOL_CATALOGUE.filter(
    (tool) => tool.available && tool.slug !== toolSlug
  )
    .slice(0, 3)
    .map((tool) => ({ label: `Use ${tool.name} locally`, href: `/tools/${tool.slug}` }))

  const learnLinks = (base?.learnLinks ?? fallbackLearnLinks)
    .filter((link) => link.href.startsWith("/learn/"))
    .slice(0, 2)

  const relatedTools = (base?.relatedTools ?? fallbackRelatedTools)
    .filter((link) => link.href.startsWith("/tools/"))
    .slice(0, 3)
    .map(asDescriptiveToolAnchor)

  return {
    learnLinks: learnLinks.length >= 2 ? learnLinks : fallbackLearnLinks,
    relatedTools: relatedTools.length >= 3 ? relatedTools : fallbackRelatedTools,
    verify: base?.verify ?? verifyLink,
    comparison: asDescriptiveCompareAnchor(base?.comparison ?? {
      label: "Offline vs Online PDF Tools",
      href: "/compare/offline-vs-online-pdf-tools",
    }),
  }
}

export function getLearnSeoLinks(learnSlug: string) {
  return LEARN_TO_SEO_LINKS[learnSlug]
}

export function getCompareSeoLinks(compareSlug: string) {
  return COMPARE_TO_SEO_LINKS[compareSlug]
}
