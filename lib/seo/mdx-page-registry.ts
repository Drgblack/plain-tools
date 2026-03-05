export type SeoMdxRoute =
  | "/learn/can-pdf-tools-see-my-files"
  | "/learn/how-to-audit-pdf-tool-network-requests"
  | "/learn/workflows/prepare-pdf-for-government-portal-upload"
  | "/compare/best-pdf-tools-no-upload"
  | "/compare/plain-vs-pdf24"

export type SeoMdxPageConfig = {
  route: SeoMdxRoute
  contentPath: string
  basePath: "/learn" | "/compare"
  sectionLabel: "Learn" | "Compare"
  slug: string
  itemListSchema?: {
    name: string
    description: string
  }
}

export const seoMdxPageRegistry: Record<SeoMdxRoute, SeoMdxPageConfig> = {
  "/learn/can-pdf-tools-see-my-files": {
    route: "/learn/can-pdf-tools-see-my-files",
    contentPath: "content/learn/can-pdf-tools-see-my-files.mdx",
    basePath: "/learn",
    sectionLabel: "Learn",
    slug: "can-pdf-tools-see-my-files",
  },
  "/learn/how-to-audit-pdf-tool-network-requests": {
    route: "/learn/how-to-audit-pdf-tool-network-requests",
    contentPath: "content/learn/how-to-audit-pdf-tool-network-requests.mdx",
    basePath: "/learn",
    sectionLabel: "Learn",
    slug: "how-to-audit-pdf-tool-network-requests",
  },
  "/learn/workflows/prepare-pdf-for-government-portal-upload": {
    route: "/learn/workflows/prepare-pdf-for-government-portal-upload",
    contentPath: "content/learn/workflows/prepare-pdf-for-government-portal-upload.mdx",
    basePath: "/learn",
    sectionLabel: "Learn",
    slug: "workflows/prepare-pdf-for-government-portal-upload",
  },
  "/compare/best-pdf-tools-no-upload": {
    route: "/compare/best-pdf-tools-no-upload",
    contentPath: "content/compare/best-pdf-tools-no-upload.mdx",
    basePath: "/compare",
    sectionLabel: "Compare",
    slug: "best-pdf-tools-no-upload",
    itemListSchema: {
      name: "Best PDF tools with no upload requirement",
      description: "A practical shortlist of PDF tools that prioritise local processing and verifiable no-upload workflows.",
    },
  },
  "/compare/plain-vs-pdf24": {
    route: "/compare/plain-vs-pdf24",
    contentPath: "content/compare/plain-vs-pdf24.mdx",
    basePath: "/compare",
    sectionLabel: "Compare",
    slug: "plain-vs-pdf24",
    itemListSchema: {
      name: "Plain vs PDF24 comparison criteria",
      description: "Comparison criteria for privacy, workflow control, and operational fit between Plain and PDF24.",
    },
  },
}

export function getMdxPageConfigOrThrow(route: SeoMdxRoute) {
  const config = seoMdxPageRegistry[route]
  if (!config) {
    throw new Error(`Missing MDX SEO page config for route: ${route}`)
  }
  return config
}

export const seoMdxSitemapUrls = Object.keys(seoMdxPageRegistry) as SeoMdxRoute[]
