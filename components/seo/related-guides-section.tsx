import { RelatedLinks } from "@/components/seo/related-links"

type RelatedLinkItem = {
  href: string
  label?: string
  title?: string
}

type RelatedGuidesSectionProps = {
  links: RelatedLinkItem[]
  heading?: string
}

export function RelatedGuidesSection({
  links,
  heading = "Related guides",
}: RelatedGuidesSectionProps) {
  if (links.length === 0) return null

  return (
    <RelatedLinks
      heading={heading}
      sections={[
        {
          title: "Guides and explainers",
          links,
        },
      ]}
    />
  )
}
