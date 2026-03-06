type JsonLdValue =
  | string
  | number
  | boolean
  | null
  | JsonLdObject
  | JsonLdValue[]

export type JsonLdObject = {
  [key: string]: JsonLdValue
}

type BreadcrumbItem = {
  name: string
  url: string
}

type FaqItem = {
  question: string
  answer: string
}

type HowToStep = {
  name: string
  text: string
}

type CollectionPageInput = {
  name: string
  description: string
  url: string
  inLanguage?: string
}

type WebPageInput = {
  name: string
  description: string
  url: string
  inLanguage?: string
}

type WebSiteInput = {
  name: string
  url: string
  description?: string
  inLanguage?: string
}

type WebApplicationInput = {
  name: string
  description: string
  url: string
  applicationCategory?: string
  operatingSystem?: string
  offerCurrency?: string
  featureList?: string[]
}

type ArticleInput = {
  headline: string
  description: string
  url: string
  datePublished?: string
  dateModified?: string
  authorName?: string
  inLanguage?: string
}

type SoftwareApplicationInput = {
  name: string
  description: string
  url: string
  featureList: string[]
  browserRequirements?: string
}

type ItemListElement = {
  name: string
  url: string
  description?: string
}

export function withContext(schema: JsonLdObject): JsonLdObject {
  return {
    "@context": "https://schema.org",
    ...schema,
  }
}

export function buildBreadcrumbList(items: BreadcrumbItem[]): JsonLdObject {
  return withContext({
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  })
}

export function buildCollectionPageSchema(input: CollectionPageInput): JsonLdObject {
  return withContext({
    "@type": "CollectionPage",
    name: input.name,
    description: input.description,
    url: input.url,
    inLanguage: input.inLanguage ?? "en-GB",
  })
}

export function buildWebPageSchema(input: WebPageInput): JsonLdObject {
  return withContext({
    "@type": "WebPage",
    name: input.name,
    description: input.description,
    url: input.url,
    inLanguage: input.inLanguage ?? "en-GB",
  })
}

export function buildWebSiteSchema(input: WebSiteInput): JsonLdObject {
  return withContext({
    "@type": "WebSite",
    name: input.name,
    url: input.url,
    ...(input.description ? { description: input.description } : {}),
    inLanguage: input.inLanguage ?? "en-GB",
  })
}

export function buildWebApplicationSchema(input: WebApplicationInput): JsonLdObject {
  return withContext({
    "@type": "WebApplication",
    name: input.name,
    description: input.description,
    url: input.url,
    applicationCategory: input.applicationCategory ?? "UtilitiesApplication",
    operatingSystem: input.operatingSystem ?? "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: input.offerCurrency ?? "EUR",
    },
    ...(input.featureList && input.featureList.length > 0
      ? { featureList: input.featureList }
      : {}),
  })
}

export function buildItemListSchema(
  name: string,
  elements: ItemListElement[],
  url?: string
): JsonLdObject {
  return withContext({
    "@type": "ItemList",
    name,
    ...(url ? { url } : {}),
    itemListElement: elements.map((element, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: element.url,
      name: element.name,
      ...(element.description ? { description: element.description } : {}),
    })),
  })
}

export function buildSoftwareApplicationSchema(
  input: SoftwareApplicationInput
): JsonLdObject {
  return withContext({
    "@type": ["SoftwareApplication", "WebApplication"],
    name: input.name,
    description: input.description,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Web",
    browserRequirements:
      input.browserRequirements ??
      "Requires a modern browser with JavaScript and WebAssembly support.",
    isAccessibleForFree: true,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR",
    },
    featureList: input.featureList,
    url: input.url,
  })
}

export function buildArticleSchema(input: ArticleInput): JsonLdObject {
  return withContext({
    "@type": "Article",
    headline: input.headline,
    description: input.description,
    author: {
      "@type": "Organization",
      name: input.authorName ?? "Plain Team",
    },
    publisher: {
      "@type": "Organization",
      name: "Plain Tools",
    },
    ...(input.datePublished ? { datePublished: input.datePublished } : {}),
    ...(input.dateModified ? { dateModified: input.dateModified } : {}),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": input.url,
    },
    url: input.url,
    inLanguage: input.inLanguage ?? "en-GB",
  })
}

export function buildFaqPageSchema(faqs: FaqItem[]): JsonLdObject {
  return withContext({
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  })
}

export function buildHowToSchema(
  name: string,
  description: string,
  steps: HowToStep[]
): JsonLdObject {
  return withContext({
    "@type": "HowTo",
    name,
    description,
    step: steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.name,
      text: step.text,
    })),
  })
}

export function combineJsonLd(schemas: JsonLdObject[]): JsonLdObject | null {
  const validSchemas = schemas.filter(Boolean)
  if (validSchemas.length === 0) return null
  if (validSchemas.length === 1) return validSchemas[0]

  return withContext({
    "@graph": validSchemas.map((schema) => {
      const schemaWithoutContext = { ...schema }
      delete schemaWithoutContext["@context"]
      return schemaWithoutContext
    }),
  })
}
