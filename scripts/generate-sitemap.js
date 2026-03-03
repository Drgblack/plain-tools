#!/usr/bin/env node

/**
 * Sitemap Export Helper
 *
 * Source of truth is app/sitemap.ts (Next.js metadata route).
 * This script copies the built output to public/sitemap.xml so any manual/static
 * workflows stay perfectly in sync with runtime generation.
 */

const fs = require('node:fs');
const path = require('node:path');

const ROOT_DIR = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const builtSitemapPath = path.join(ROOT_DIR, '.next', 'server', 'app', 'sitemap.xml.body');
const targetSitemapPath = path.join(PUBLIC_DIR, 'sitemap.xml');

if (!fs.existsSync(builtSitemapPath)) {
  console.error('[ERROR] Built sitemap not found at .next/server/app/sitemap.xml.body');
  console.error('[ERROR] Run `pnpm run build` before running this script.');
  process.exit(1);
}

if (!fs.existsSync(PUBLIC_DIR)) {
  fs.mkdirSync(PUBLIC_DIR, { recursive: true });
}

const sitemapXml = fs.readFileSync(builtSitemapPath, 'utf8');
fs.writeFileSync(targetSitemapPath, sitemapXml, 'utf8');

console.log(`[OK] Copied ${builtSitemapPath} -> ${targetSitemapPath}`);
console.log('[OK] app/sitemap.ts remains the single sitemap source of truth.');
