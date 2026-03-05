import { readFile } from "node:fs/promises"
import path from "node:path"

import { compileMDX } from "next-mdx-remote/rsc"
import Link from "next/link"
import type { ComponentPropsWithoutRef } from "react"

import type { LearnArticleData } from "@/components/learn/seo-article-page"
import { getMdxPageConfigOrThrow, type SeoMdxPageConfig, type SeoMdxRoute } from "@/lib/seo/mdx-page-registry"

type MdxFaq = {
  question: string
  answer: string
}

type MdxLink = {
  label: string
  href: string
}

type MdxCta = {
  label: string
  href: string
  text: string
}

type MdxFrontmatter = {
  title: string
  description: string
  updated: string
  readTime: string
  keywords: string[]
  intro: string[]
  faqs: MdxFaq[]
  relatedLinks: MdxLink[]
  cta: MdxCta
  itemList?: {
    name: string
    description?: string
    url?: string
  }[]
}

const BASE_URL = "https://plain.tools"

const mdxComponents = {
  a: ({ href = "", children, ...props }: ComponentPropsWithoutRef<"a">) => {
    if (href.startsWith("/")) {
      return (
        <Link href={href} className="font-medium text-accent hover:underline" {...props}>
          {children}
        </Link>
      )
    }

    return (
      <a
        href={href}
        className="font-medium text-accent hover:underline"
        target="_blank"
        rel="noreferrer"
        {...props}
      >
        {children}
      </a>
    )
  },
  h2: ({ children, ...props }: ComponentPropsWithoutRef<"h2">) => (
    <h2 className="pt-4 text-2xl font-semibold tracking-tight text-foreground" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: ComponentPropsWithoutRef<"h3">) => (
    <h3 className="pt-2 text-xl font-semibold tracking-tight text-foreground" {...props}>
      {children}
    </h3>
  ),
  p: ({ children, ...props }: ComponentPropsWithoutRef<"p">) => (
    <p className="text-base leading-relaxed text-muted-foreground" {...props}>
      {children}
    </p>
  ),
  ul: ({ children, ...props }: ComponentPropsWithoutRef<"ul">) => (
    <ul className="list-disc space-y-2 pl-6 text-muted-foreground" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: ComponentPropsWithoutRef<"ol">) => (
    <ol className="list-decimal space-y-2 pl-6 text-muted-foreground" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }: ComponentPropsWithoutRef<"li">) => <li {...props}>{children}</li>,
  table: ({ children, ...props }: ComponentPropsWithoutRef<"table">) => (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse text-left text-sm" {...props}>
        {children}
      </table>
    </div>
  ),
  thead: ({ children, ...props }: ComponentPropsWithoutRef<"thead">) => (
    <thead className="bg-muted/30 text-foreground" {...props}>
      {children}
    </thead>
  ),
  tbody: ({ children, ...props }: ComponentPropsWithoutRef<"tbody">) => (
    <tbody className="text-muted-foreground" {...props}>
      {children}
    </tbody>
  ),
  tr: ({ children, ...props }: ComponentPropsWithoutRef<"tr">) => (
    <tr className="border-b border-border" {...props}>
      {children}
    </tr>
  ),
  th: ({ children, ...props }: ComponentPropsWithoutRef<"th">) => (
    <th className="px-3 py-2 font-semibold" {...props}>
      {children}
    </th>
  ),
  td: ({ children, ...props }: ComponentPropsWithoutRef<"td">) => (
    <td className="px-3 py-2 align-top" {...props}>
      {children}
    </td>
  ),
}

function buildItemListSchema(config: SeoMdxPageConfig, frontmatter: MdxFrontmatter) {
  if (!config.itemListSchema || !frontmatter.itemList || frontmatter.itemList.length === 0) {
    return []
  }

  return [
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: config.itemListSchema.name,
      description: config.itemListSchema.description,
      itemListElement: frontmatter.itemList.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        ...(item.description ? { description: item.description } : {}),
        ...(item.url ? { url: item.url.startsWith("http") ? item.url : `${BASE_URL}${item.url}` } : {}),
      })),
    } as Record<string, unknown>,
  ]
}

export async function loadSeoMdxArticle(route: SeoMdxRoute): Promise<LearnArticleData> {
  const config = getMdxPageConfigOrThrow(route)
  const absolutePath = path.join(process.cwd(), config.contentPath)
  const source = await readFile(absolutePath, "utf8")

  const { content, frontmatter } = await compileMDX<MdxFrontmatter>({
    source,
    options: {
      parseFrontmatter: true,
    },
    components: mdxComponents,
  })

  const extraSchemas = buildItemListSchema(config, frontmatter)

  return {
    slug: config.slug,
    title: frontmatter.title,
    description: frontmatter.description,
    updated: frontmatter.updated,
    readTime: frontmatter.readTime,
    keywords: frontmatter.keywords,
    intro: frontmatter.intro,
    sections: [],
    customContent: content,
    faqs: frontmatter.faqs,
    relatedLearn: frontmatter.relatedLinks,
    cta: frontmatter.cta,
    basePath: config.basePath,
    sectionLabel: config.sectionLabel,
    extraSchemas,
  }
}
