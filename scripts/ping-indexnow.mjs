#!/usr/bin/env node

/**
 * Submit all sitemap URLs to IndexNow.
 *
 * Usage:
 *   pnpm run ping-indexnow
 *
 * Env vars:
 *   SITE_URL=https://plain.tools
 *   INDEXNOW_KEY=your_indexnow_key
 */

const SITE_URL = process.env.SITE_URL || "https://plain.tools";
const INDEXNOW_KEY = process.env.INDEXNOW_KEY;
const SITEMAP_URL = `${SITE_URL.replace(/\/$/, "")}/sitemap.xml`;
const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";

function log(message, level = "info") {
  const timestamp = new Date().toISOString();
  const prefix = {
    info: "[INFO]",
    warn: "[WARN]",
    error: "[ERROR]",
    ok: "[OK]",
  }[level];

  console.log(`${timestamp} ${prefix} ${message}`);
}

async function fetchSitemapUrls() {
  const response = await fetch(SITEMAP_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch sitemap (${response.status} ${response.statusText})`);
  }

  const xml = await response.text();
  const matches = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)];
  const urls = matches.map((match) => match[1]?.trim()).filter(Boolean);
  return [...new Set(urls)];
}

async function submitUrls(urls) {
  if (!INDEXNOW_KEY) {
    log("INDEXNOW_KEY is not set. Skipping IndexNow submission.", "warn");
    return false;
  }

  const payload = {
    host: new URL(SITE_URL).host,
    key: INDEXNOW_KEY,
    keyLocation: `${SITE_URL.replace(/\/$/, "")}/${INDEXNOW_KEY}.txt`,
    urlList: urls,
  };

  const response = await fetch(INDEXNOW_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(payload),
  });

  if (response.ok || response.status === 200 || response.status === 202) {
    log(`IndexNow accepted ${urls.length} sitemap URLs.`, "ok");
    return true;
  }

  throw new Error(`IndexNow failed (${response.status} ${response.statusText})`);
}

async function main() {
  log(`Fetching sitemap: ${SITEMAP_URL}`);
  const urls = await fetchSitemapUrls();

  if (urls.length === 0) {
    throw new Error("No <loc> URLs were found in sitemap.");
  }

  log(`Found ${urls.length} sitemap URLs.`);
  await submitUrls(urls);
}

main().catch((error) => {
  log(error instanceof Error ? error.message : "Unexpected error", "error");
  process.exit(1);
});
