import { RelatedLinks } from "@/components/seo/related-links"

type RelatedLinkItem = {
  href: string
  label?: string
  title?: string
}

type RelatedToolsSectionProps = {
  links: RelatedLinkItem[]
  heading?: string
}

export function RelatedToolsSection({
  links,
  heading = "Related tools",
}: RelatedToolsSectionProps) {
  if (links.length === 0) return null

  return (
    <RelatedLinks
      heading={heading}
      sections={[
        {
          title: "Tool workflows",
          links,
        },
      ]}
    />
  )
}
