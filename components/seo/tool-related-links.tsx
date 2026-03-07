import { getToolSeoLinks } from "@/lib/seo/tranche1-link-map"
import { RelatedLinks } from "@/components/seo/related-links"

type ToolRelatedLinksProps = {
  toolSlug: string
  className?: string
}

const FILE_UTILITY_TOOL_SLUGS = new Set([
  "base64-encoder",
  "zip-tool",
  "file-hash",
  "qr-code",
  "qr-scanner",
  "image-compress",
])

const SECURITY_TOOL_SLUGS = new Set([
  "sign-pdf",
  "protect-pdf",
  "unlock-pdf",
  "watermark-pdf",
  "annotate-pdf",
  "redact-pdf",
  "privacy-scan",
  "metadata-purge",
])

function getAdjacentClusterLink(toolSlug: string) {
  if (FILE_UTILITY_TOOL_SLUGS.has(toolSlug)) {
    return {
      label: "Browse the file-tools cluster",
      href: "/file-tools",
    }
  }

  if (SECURITY_TOOL_SLUGS.has(toolSlug)) {
    return {
      label: "Review privacy and verification guidance",
      href: "/verify-claims",
    }
  }

  if (toolSlug === "compare-pdf") {
    return {
      label: "Check whether chatgpt.com is down",
      href: "/status/chatgpt.com",
    }
  }

  return {
    label: "Compare local and upload-based PDF workflows",
    href: "/compare/offline-vs-online-pdf-tools",
  }
}

export function ToolRelatedLinks({ toolSlug, className }: ToolRelatedLinksProps) {
  const links = getToolSeoLinks(toolSlug)
  if (!links) return null

  const adjacentClusterLink = getAdjacentClusterLink(toolSlug)

  return (
    <div className={className}>
      <RelatedLinks
        sections={[
          { title: "Related tools", links: links.relatedTools },
          { title: "Related guides", links: links.learnLinks },
          { title: "Adjacent cluster", links: [adjacentClusterLink] },
          { title: "Trust and verification", links: [links.verify] },
        ]}
      />
    </div>
  )
}

