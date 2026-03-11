import { promises as fs } from "node:fs"
import path from "node:path"

const ROOT = process.cwd()

const CONTENT_FILES = [
  "app/page.tsx",
  "app/tools/page.tsx",
  "app/topics/page.tsx",
  "app/file-converters/page.tsx",
  "app/calculators/page.tsx",
  "app/learn/page.tsx",
  "app/network-tools/page.tsx",
  "app/status/page.tsx",
]

const TEMPLATE_CHECKS = [
  {
    file: "app/topics/page.tsx",
    patterns: ["buildPageMetadata(", "PageBreadcrumbs", "buildBreadcrumbList("],
  },
  {
    file: "app/calculators/page.tsx",
    patterns: ["buildPageMetadata(", "PageBreadcrumbs", "buildBreadcrumbList("],
  },
  {
    file: "app/calculators/[category]/page.tsx",
    patterns: ["buildPageMetadata(", "PageBreadcrumbs", "buildBreadcrumbList("],
  },
  {
    file: "app/file-converters/page.tsx",
    patterns: ["buildPageMetadata(", "ToolCategoryHub"],
  },
  {
    file: "components/seo/learn-article-template.tsx",
    patterns: ["buildPageMetadata(", "buildBreadcrumbList("],
  },
  {
    file: "components/seo/compare-page-template.tsx",
    patterns: ["buildPageMetadata(", "\"@type\": \"BreadcrumbList\""],
  },
]

const CRITICAL_TARGETS = [
  { href: "/tools/merge-pdf", minCount: 2 },
  { href: "/tools/split-pdf", minCount: 2 },
  { href: "/tools/compress-pdf", minCount: 2 },
  { href: "/tools/pdf-to-word", minCount: 2 },
  { href: "/tools/word-to-pdf", minCount: 2 },
  { href: "/site-status", minCount: 2 },
  { href: "/dns-lookup", minCount: 2 },
  { href: "/ping-test", minCount: 2 },
  { href: "/calculators", minCount: 2 },
  { href: "/file-converters", minCount: 2 },
  { href: "/topics", minCount: 2 },
]

async function read(relativePath) {
  return fs.readFile(path.join(ROOT, relativePath), "utf8")
}

const errors = []
const warnings = []

for (const check of TEMPLATE_CHECKS) {
  const content = await read(check.file)

  for (const pattern of check.patterns) {
    if (!content.includes(pattern)) {
      errors.push(`${check.file} is missing required pattern: ${pattern}`)
    }
  }
}

const fileContents = new Map()
for (const file of CONTENT_FILES) {
  fileContents.set(file, await read(file))
}

for (const target of CRITICAL_TARGETS) {
  let count = 0
  const matchedFiles = []

  for (const [file, content] of fileContents.entries()) {
    if (content.includes(target.href)) {
      count += 1
      matchedFiles.push(file)
    }
  }

  if (count < target.minCount) {
    errors.push(
      `${target.href} only appears in ${count}/${target.minCount}+ critical hub files (${matchedFiles.join(", ") || "none"})`
    )
  }
}

const sitemapData = await read("lib/sitemap-data.ts")
for (const requiredPath of ["/topics", "/calculators", "/file-converters", "/guides", "/status", "/tools"]) {
  if (!sitemapData.includes(`"${requiredPath}"`)) {
    warnings.push(`lib/sitemap-data.ts does not reference ${requiredPath} directly in static hub coverage`)
  }
}

if (errors.length > 0) {
  console.error("SEO structure audit failed:")
  for (const error of errors) {
    console.error(`- ${error}`)
  }
  if (warnings.length > 0) {
    console.error("Warnings:")
    for (const warning of warnings) {
      console.error(`- ${warning}`)
    }
  }
  process.exit(1)
}

console.log("SEO structure audit passed.")
for (const warning of warnings) {
  console.warn(`Warning: ${warning}`)
}
