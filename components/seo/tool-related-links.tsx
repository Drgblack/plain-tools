import { getToolSeoLinks } from "@/lib/seo/tranche1-link-map"
import { RelatedLinks } from "@/components/seo/related-links"

type ToolRelatedLinksProps = {
  toolSlug: string
  className?: string
}

export function ToolRelatedLinks({ toolSlug, className }: ToolRelatedLinksProps) {
  const links = getToolSeoLinks(toolSlug)
  if (!links) return null

  const statusClusterLinks = [
    { label: "Check whether chatgpt.com is down", href: "/status/chatgpt.com" },
    { label: "Run DNS lookup for a domain", href: "/dns-lookup" },
    { label: "Measure latency with ping test", href: "/ping-test" },
  ]

  return (
    <div className={className}>
      <RelatedLinks
        sections={[
          { title: "Related tools", links: links.relatedTools },
          { title: "Related guides", links: links.learnLinks },
          { title: "Compare alternatives", links: [links.comparison] },
          { title: "Verify", links: [links.verify] },
          { title: "Status and network cluster", links: statusClusterLinks },
        ]}
      />
    </div>
  )
}
