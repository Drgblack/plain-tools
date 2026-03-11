import { promises as fs } from "node:fs"
import path from "node:path"

const ROOT = process.cwd()
const SCAN_DIRS = ["app", "components", "lib"]
const ALLOWED_ROUTE_FILES = new Set([
  path.normalize("app/is/[site]/page.tsx"),
  path.normalize("app/is-chatgpt-down/page.tsx"),
  path.normalize("app/is-discord-down/page.tsx"),
  path.normalize("lib/status-query-pages.ts"),
  path.normalize("scripts/audit-internal-links.mjs"),
])

const issues = []

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      await walk(fullPath)
      continue
    }

    if (!/\.(ts|tsx|js|mjs)$/.test(entry.name)) {
      continue
    }

    const relativePath = path.normalize(path.relative(ROOT, fullPath))
    const content = await fs.readFile(fullPath, "utf8")
    const lines = content.split(/\r?\n/)

    lines.forEach((line, index) => {
      const lineNumber = index + 1
      const hasLegacyHref = /(?:^|["'`\s(=])\/is-[a-z0-9-]+-down\b/.test(line)
      const usesLegacyHelper = line.includes("statusQueryPathForSlug(")

      if (!hasLegacyHref && !usesLegacyHelper) {
        return
      }

      if (ALLOWED_ROUTE_FILES.has(relativePath)) {
        return
      }

      issues.push({
        file: relativePath,
        line: lineNumber,
        content: line.trim(),
      })
    })
  }
}

for (const dir of SCAN_DIRS) {
  await walk(path.join(ROOT, dir))
}

if (issues.length > 0) {
  console.error("Found internal links pointing at legacy /is-* status routes:")

  for (const issue of issues) {
    console.error(`- ${issue.file}:${issue.line} ${issue.content}`)
  }

  process.exitCode = 1
} else {
  console.log("No legacy /is-* internal links found outside approved noindex route files.")
}
