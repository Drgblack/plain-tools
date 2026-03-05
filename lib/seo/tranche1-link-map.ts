import { comparePages, learnPages } from "@/lib/seo/tranche1-content"
import { converterPages } from "@/lib/seo/file-converters-content"
import { workflowPages } from "@/lib/seo/workflows-content"
import { TOOL_CATALOGUE } from "@/lib/tools-catalogue"

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
    return [
      article.slug,
      {
        primaryTool: {
          label: article.nextSteps.find((step) => step.href.startsWith("/tools/"))?.label ?? "Open tool",
          href: article.toolHref,
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
        label: href.replace("/tools/", "").replace(/-/g, " "),
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
    .map((tool) => ({ label: tool.name, href: `/tools/${tool.slug}` }))

  const learnLinks = (base?.learnLinks ?? fallbackLearnLinks)
    .filter((link) => link.href.startsWith("/learn/"))
    .slice(0, 2)

  const relatedTools = (base?.relatedTools ?? fallbackRelatedTools)
    .filter((link) => link.href.startsWith("/tools/"))
    .slice(0, 3)

  return {
    learnLinks: learnLinks.length >= 2 ? learnLinks : fallbackLearnLinks,
    relatedTools: relatedTools.length >= 3 ? relatedTools : fallbackRelatedTools,
    verify: base?.verify ?? verifyLink,
    comparison: base?.comparison ?? {
      label: "Offline vs Online PDF Tools",
      href: "/compare/offline-vs-online-pdf-tools",
    },
  }
}

export function getLearnSeoLinks(learnSlug: string) {
  return LEARN_TO_SEO_LINKS[learnSlug]
}

export function getCompareSeoLinks(compareSlug: string) {
  return COMPARE_TO_SEO_LINKS[compareSlug]
}
