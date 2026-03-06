import { serializeJsonLd } from "@/lib/sanitize"

type JsonLdProps = {
  id: string
  schema: unknown
}

export function JsonLd({ id, schema }: JsonLdProps) {
  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }}
    />
  )
}
