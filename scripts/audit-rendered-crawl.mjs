const BASE_URL = process.env.AUDIT_BASE_URL ?? "http://127.0.0.1:3000"
const MAX_PAGES = Number.parseInt(process.env.AUDIT_MAX_PAGES ?? "80", 10)

const SEEDS = [
  "/",
  "/tools",
  "/topics",
  "/learn",
  "/guides",
  "/status",
  "/site-status",
  "/network-tools",
  "/file-converters",
  "/calculators",
]

const CRITICAL_PAGES = [
  "/tools/merge-pdf",
  "/tools/split-pdf",
  "/tools/compress-pdf",
  "/tools/pdf-to-word",
  "/tools/word-to-pdf",
  "/status/chatgpt.com",
  "/dns-lookup",
  "/ping-test",
  "/calculators",
  "/file-converters",
  "/topics",
]

const EXPECTED_NOINDEX = ["/faq", "/html-sitemap", "/labs"]

function normalizePath(input) {
  const url = new URL(input, BASE_URL)
  if (url.origin !== new URL(BASE_URL).origin) return null
  return url.pathname.replace(/\/+$/, "") || "/"
}

function extractLinks(html) {
  const matches = html.matchAll(/href=["']([^"'#]+)["']/gi)
  const links = new Set()

  for (const match of matches) {
    const normalized = normalizePath(match[1])
    if (normalized) links.add(normalized)
  }

  return [...links]
}

function extractCanonical(html) {
  const match = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i)
  return match ? normalizePath(match[1]) : null
}

function extractRobots(html) {
  const match = html.match(/<meta[^>]+name=["']robots["'][^>]+content=["']([^"']+)["']/i)
  return match ? match[1].toLowerCase() : null
}

async function fetchText(path) {
  const response = await fetch(new URL(path, BASE_URL), {
    redirect: "follow",
    headers: {
      "user-agent": "plain-tools-seo-audit/1.0",
    },
  })

  return {
    finalPath: normalizePath(response.url),
    html: await response.text(),
    status: response.status,
  }
}

async function fetchSitemapPaths() {
  const response = await fetch(new URL("/sitemap.xml", BASE_URL), {
    headers: {
      "user-agent": "plain-tools-seo-audit/1.0",
    },
  })

  const xml = await response.text()
  const locMatches = [...xml.matchAll(/<loc>(.*?)<\/loc>/gi)].map((match) => match[1])
  return locMatches.map((loc) => normalizePath(loc)).filter(Boolean)
}

const visited = new Map()
const queue = SEEDS.map((path) => ({ depth: 0, path }))
const errors = []
const warnings = []

while (queue.length > 0 && visited.size < MAX_PAGES) {
  const current = queue.shift()
  if (!current || visited.has(current.path)) continue

  try {
    const result = await fetchText(current.path)
    visited.set(current.path, {
      canonical: extractCanonical(result.html),
      depth: current.depth,
      finalPath: result.finalPath,
      links: extractLinks(result.html),
      robots: extractRobots(result.html),
      status: result.status,
    })

    for (const link of extractLinks(result.html)) {
      if (!visited.has(link) && !queue.some((item) => item.path === link)) {
        queue.push({ depth: current.depth + 1, path: link })
      }
    }
  } catch (error) {
    errors.push(`Failed to fetch ${current.path}: ${String(error)}`)
  }
}

for (const [path, record] of visited.entries()) {
  if (record.status >= 400) {
    errors.push(`${path} returned HTTP ${record.status}`)
  }

  if (!record.canonical) {
    warnings.push(`${path} is missing a canonical tag in rendered HTML`)
  }

  if (record.finalPath && record.finalPath !== path) {
    warnings.push(`${path} redirected to ${record.finalPath}`)
  }
}

for (const criticalPath of CRITICAL_PAGES) {
  const record = visited.get(criticalPath)
  if (!record) {
    warnings.push(`${criticalPath} was not reached during the rendered crawl`)
    continue
  }

  if (record.depth > 3) {
    warnings.push(`${criticalPath} was found at depth ${record.depth}`)
  }
}

for (const noindexPath of EXPECTED_NOINDEX) {
  try {
    const record = visited.get(noindexPath) ?? (await (async () => {
      const result = await fetchText(noindexPath)
      const parsed = {
        canonical: extractCanonical(result.html),
        depth: Infinity,
        finalPath: result.finalPath,
        links: extractLinks(result.html),
        robots: extractRobots(result.html),
        status: result.status,
      }
      visited.set(noindexPath, parsed)
      return parsed
    })())

    if (!record.robots || !record.robots.includes("noindex")) {
      errors.push(`${noindexPath} is expected to be noindex but rendered robots were "${record.robots ?? "missing"}"`)
    }
  } catch (error) {
    errors.push(`Failed to verify noindex path ${noindexPath}: ${String(error)}`)
  }
}

try {
  const sitemapPaths = await fetchSitemapPaths()
  for (const path of EXPECTED_NOINDEX) {
    if (sitemapPaths.includes(path)) {
      errors.push(`${path} appears in sitemap.xml but should be excluded`)
    }
  }
} catch (error) {
  warnings.push(`Could not fetch sitemap.xml during rendered crawl audit: ${String(error)}`)
}

if (errors.length > 0) {
  console.error("Rendered crawl audit failed:")
  for (const error of errors) console.error(`- ${error}`)
  for (const warning of warnings) console.error(`- Warning: ${warning}`)
  process.exit(1)
}

console.log(`Rendered crawl audit passed for ${visited.size} pages from ${BASE_URL}.`)
for (const warning of warnings) {
  console.warn(`Warning: ${warning}`)
}
