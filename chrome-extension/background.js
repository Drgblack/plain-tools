importScripts("tools-fallback.js");

const PLAIN_TOOLS_HOME = "https://plain.tools/";
const PLAIN_TOOLS_TOOLS = "https://plain.tools/tools";
const PLAIN_TOOLS_SEARCH = "https://plain.tools/tools";
const TOOL_CACHE_KEY = "plainToolsCachedToolList";
const TOOL_CACHE_MAX_AGE_MS = 24 * 60 * 60 * 1000;
const BADGE_TEXT = "29+";

const MENU_IDS = {
  open: "plain-tools-open",
  search: "plain-tools-search"
};

function setBadge() {
  chrome.action.setBadgeText({ text: BADGE_TEXT });
  chrome.action.setBadgeBackgroundColor({ color: "#1d4ed8" });
  chrome.action.setBadgeTextColor({ color: "#ffffff" });
}

function createContextMenus() {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: MENU_IDS.open,
      title: "Open Plain Tools",
      contexts: ["page", "frame", "link", "image", "video", "audio", "selection"]
    });

    chrome.contextMenus.create({
      id: MENU_IDS.search,
      title: "Search in Plain Tools for \"%s\"",
      contexts: ["selection"]
    });
  });
}

function openInNewTab(url) {
  chrome.tabs.create({ url });
}

function normaliseWhitespace(value) {
  return value.replace(/\s+/g, " ").trim();
}

function fallbackNameFromSlug(slug) {
  return slug
    .split("-")
    .map((part) => (part ? part.charAt(0).toUpperCase() + part.slice(1) : part))
    .join(" ");
}

function parseToolsFromToolsPageHtml(html) {
  const results = [];
  const seen = new Set();

  const itemRegex =
    /<li[^>]*>\s*<h3[^>]*>\s*<a[^>]*href=["']\/tools\/([^"'/?#]+)[^"']*["'][^>]*>([^<]+)<\/a>\s*<\/h3>[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>[\s\S]*?<\/li>/gi;
  let match = itemRegex.exec(html);

  while (match) {
    const slug = normaliseWhitespace(match[1] || "").toLowerCase();
    const name = normaliseWhitespace(match[2] || "");
    const description = normaliseWhitespace((match[3] || "").replace(/<[^>]+>/g, ""));

    if (slug && !seen.has(slug)) {
      seen.add(slug);
      results.push({
        slug,
        name: name || fallbackNameFromSlug(slug),
        description: description || "Open this Plain Tools workflow.",
        url: `https://plain.tools/tools/${slug}`
      });
    }

    match = itemRegex.exec(html);
  }

  if (results.length >= 8) {
    return results;
  }

  const anchorRegex = /<a[^>]*href=["']\/tools\/([^"'/?#]+)[^"']*["'][^>]*>([^<]+)<\/a>/gi;
  match = anchorRegex.exec(html);
  while (match) {
    const slug = normaliseWhitespace(match[1] || "").toLowerCase();
    const label = normaliseWhitespace(match[2] || "");
    if (
      slug &&
      !seen.has(slug) &&
      label &&
      label.toLowerCase() !== "open tool" &&
      label.toLowerCase() !== "try tool"
    ) {
      seen.add(slug);
      results.push({
        slug,
        name: label,
        description: "Open this Plain Tools workflow.",
        url: `https://plain.tools/tools/${slug}`
      });
    }
    match = anchorRegex.exec(html);
  }

  return results;
}

async function fetchToolsListFromSite() {
  const response = await fetch(PLAIN_TOOLS_TOOLS, {
    method: "GET",
    headers: { Accept: "text/html" }
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch tools page (${response.status})`);
  }
  const html = await response.text();
  const parsed = parseToolsFromToolsPageHtml(html);
  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error("Could not parse tools from fetched HTML");
  }
  return parsed;
}

function getFallbackTools() {
  const fallback = Array.isArray(self.PLAIN_TOOLS_FALLBACK) ? self.PLAIN_TOOLS_FALLBACK : [];
  return fallback.map((tool) => ({ ...tool }));
}

function storageGet(key) {
  return new Promise((resolve) => {
    chrome.storage.local.get([key], (result) => resolve(result[key]));
  });
}

function storageSet(payload) {
  return new Promise((resolve) => {
    chrome.storage.local.set(payload, () => resolve(true));
  });
}

async function cacheTools(tools, source) {
  const payload = {
    tools,
    source,
    updatedAt: Date.now()
  };
  await storageSet({ [TOOL_CACHE_KEY]: payload });
  return payload;
}

async function refreshToolsCache() {
  try {
    const fetched = await fetchToolsListFromSite();
    return await cacheTools(fetched, "remote");
  } catch {
    const fallback = getFallbackTools();
    return await cacheTools(fallback, "fallback");
  }
}

async function ensureToolCache(forceRefresh) {
  const cached = await storageGet(TOOL_CACHE_KEY);
  if (!forceRefresh && cached && Array.isArray(cached.tools) && cached.tools.length > 0) {
    const age = Date.now() - Number(cached.updatedAt || 0);
    if (age < TOOL_CACHE_MAX_AGE_MS) {
      return cached;
    }
  }

  return await refreshToolsCache();
}

async function handleGetTools(message, sendResponse) {
  const forceRefresh = Boolean(message && message.forceRefresh);
  const data = await ensureToolCache(forceRefresh);
  sendResponse({
    ok: true,
    tools: data.tools,
    source: data.source || "fallback",
    updatedAt: data.updatedAt || null
  });
}

chrome.runtime.onInstalled.addListener(async () => {
  createContextMenus();
  setBadge();
  await ensureToolCache(true);
});

chrome.runtime.onStartup.addListener(async () => {
  createContextMenus();
  setBadge();
  await ensureToolCache(false);
});

chrome.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId === MENU_IDS.open) {
    openInNewTab(PLAIN_TOOLS_HOME);
    return;
  }

  if (info.menuItemId === MENU_IDS.search) {
    const selectedText = (info.selectionText || "").trim();
    const query = encodeURIComponent(selectedText);
    const url = query ? `${PLAIN_TOOLS_SEARCH}?search=${query}` : PLAIN_TOOLS_SEARCH;
    openInNewTab(url);
  }
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (!message || typeof message !== "object") {
    return false;
  }

  if (message.type === "plain-tools:get-tools") {
    handleGetTools(message, sendResponse).catch((error) => {
      sendResponse({
        ok: false,
        error: error instanceof Error ? error.message : "Unknown error",
        tools: getFallbackTools(),
        source: "fallback"
      });
    });
    return true;
  }

  if (message.type === "plain-tools:refresh-tools") {
    refreshToolsCache()
      .then((data) =>
        sendResponse({
          ok: true,
          tools: data.tools,
          source: data.source,
          updatedAt: data.updatedAt
        })
      )
      .catch((error) =>
        sendResponse({
          ok: false,
          error: error instanceof Error ? error.message : "Unknown error",
          tools: getFallbackTools(),
          source: "fallback"
        })
      );
    return true;
  }

  return false;
});
