#!/usr/bin/env node

/**
 * Sitemap Export Helper
 *
 * Source of truth is app/sitemap.ts (Next.js metadata route).
 * This script exports a static public/sitemap.xml from that route so any
 * manual/static workflows stay perfectly in sync with runtime generation.
 */

import { execSync } from "node:child_process"
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT_DIR = path.resolve(__dirname, "..")
const PUBLIC_DIR = path.join(ROOT_DIR, "public")
const targetSitemapPath = path.join(PUBLIC_DIR, "sitemap.xml")
const SITE_URL = "https://www.plain.tools"

function runTsx(code) {
  const output = execSync(`npx tsx -e ${JSON.stringify(code)}`, {
    cwd: ROOT_DIR,
    encoding: "utf8",
    shell: true,
    stdio: ["ignore", "pipe", "inherit"],
  })

  return output.trim()
}

function escapeXml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

function buildUrlSet(entries) {
  const xmlEntries = entries
    .map((entry) => {
      const parts = [
        `<loc>${escapeXml(entry.url)}</loc>`,
        `<lastmod>${new Date(entry.lastModified ?? new Date()).toISOString()}</lastmod>`,
      ]
      if (entry.changeFrequency) {
        parts.push(`<changefreq>${entry.changeFrequency}</changefreq>`)
      }
      if (typeof entry.priority === "number") {
        parts.push(`<priority>${entry.priority.toFixed(1)}</priority>`)
      }
      return `<url>${parts.join("")}</url>`
    })
    .join("")

  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${xmlEntries}</urlset>`
}

function buildSitemapIndex(ids) {
  const entries = ids
    .map(({ id }) => {
      return `<sitemap><loc>${escapeXml(`${SITE_URL}/sitemap/${id}.xml`)}</loc><lastmod>${new Date().toISOString()}</lastmod></sitemap>`
    })
    .join("")

  return `<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries}</sitemapindex>`
}

if (!fs.existsSync(PUBLIC_DIR)) {
  fs.mkdirSync(PUBLIC_DIR, { recursive: true })
}

const metadataIds = JSON.parse(
  runTsx(
    "(async()=>{const mod=await import('./app/sitemap.ts'); const ids=await (mod.generateSitemaps?.() ?? [{ id: 0 }]); process.stdout.write(JSON.stringify(ids));})().catch((error)=>{console.error(error); process.exit(1)})"
  )
)

const sitemapXml =
  metadataIds.length <= 1
    ? buildUrlSet(
        JSON.parse(
          runTsx(
            "(async()=>{const mod=await import('./app/sitemap.ts'); const sitemapFn=typeof mod.default==='function' ? mod.default : mod.default?.default; if (typeof sitemapFn !== 'function') { throw new TypeError('Sitemap route default export is not callable'); } const entries=await sitemapFn({ id: 0 }); process.stdout.write(JSON.stringify(entries));})().catch((error)=>{console.error(error); process.exit(1)})"
          )
        )
      )
    : buildSitemapIndex(metadataIds)

fs.writeFileSync(targetSitemapPath, sitemapXml, "utf8")

console.log(`[OK] Wrote ${targetSitemapPath}`)
console.log(`[OK] Exported ${metadataIds.length} sitemap chunk(s) from app/sitemap.ts.`)
