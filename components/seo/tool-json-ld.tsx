import { JsonLd } from "@/components/seo/json-ld"
import { getToolPageProfile } from "@/lib/tool-page-content"
import { buildToolSchema } from "@/lib/tool-schema"
import { getToolBySlug } from "@/lib/tools-catalogue"

type ToolJsonLdProps = {
  toolSlug: string
}

export function ToolJsonLd({ toolSlug }: ToolJsonLdProps) {
  const tool = getToolBySlug(toolSlug)
  if (!tool) return null

  const profile = getToolPageProfile(tool)

  const schema = buildToolSchema({
    name: tool.name,
    slug: tool.slug,
    description: profile.description,
    featureList: profile.featureList,
    includeHowTo: true,
    includeFaq: profile.faqs.length > 0,
    faqs: profile.faqs,
  })

  if (!schema) return null

  return <JsonLd id={`tool-schema-${tool.slug}`} schema={schema} />
}
