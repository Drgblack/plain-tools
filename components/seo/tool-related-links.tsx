import { getToolSeoLinks } from "@/lib/seo/tranche1-link-map"
import { RelatedLinks } from "@/components/seo/related-links"

type ToolRelatedLinksProps = {
  toolSlug: string
  className?: string
}

export function ToolRelatedLinks({ toolSlug, className }: ToolRelatedLinksProps) {
  const links = getToolSeoLinks(toolSlug)
  if (!links) return null

  return (
    <div className={className}>
      <RelatedLinks
        sections={[
          { title: "Related tools", links: links.relatedTools },
          { title: "Related guides", links: links.learnLinks },
          { title: "Compare", links: [links.comparison] },
          { title: "Verify", links: [links.verify] },
        ]}
      />
    </div>
  )
}
