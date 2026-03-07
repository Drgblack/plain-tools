const DEFAULT_TOOLS_URL = "https://plain.tools/tools";

const searchInput = document.getElementById("toolSearch");
const searchButton = document.getElementById("searchButton");
const refreshButton = document.getElementById("refreshToolList");
const directoryGrid = document.getElementById("toolDirectoryGrid");
const directoryStatus = document.getElementById("directoryStatus");

let tools = [];

function fallbackTools() {
  return Array.isArray(window.PLAIN_TOOLS_FALLBACK) ? window.PLAIN_TOOLS_FALLBACK : [];
}

function openInNewTab(url) {
  window.open(url, "_blank", "noopener,noreferrer");
}

function getToolsMessage(type) {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ type }, (response) => {
      if (chrome.runtime.lastError) {
        resolve({
          ok: false,
          tools: fallbackTools(),
          source: "fallback",
          error: chrome.runtime.lastError.message
        });
        return;
      }
      resolve(response || { ok: false, tools: fallbackTools(), source: "fallback" });
    });
  });
}

function toolMatchesQuery(tool, query) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return `${tool.name} ${tool.description} ${tool.slug}`.toLowerCase().includes(q);
}

function renderDirectory() {
  if (!directoryGrid) return;
  const query = searchInput instanceof HTMLInputElement ? searchInput.value : "";
  const filtered = tools.filter((tool) => toolMatchesQuery(tool, query));

  directoryGrid.innerHTML = "";
  if (filtered.length === 0) {
    const empty = document.createElement("p");
    empty.className = "directory-status";
    empty.textContent = "No tools match this search.";
    directoryGrid.appendChild(empty);
    return;
  }

  filtered.slice(0, 60).forEach((tool) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "card";
    button.setAttribute("role", "listitem");
    button.innerHTML = `
      <span class="card-title">${tool.name}</span>
      <span class="card-text">${tool.description || "Open this tool on Plain Tools."}</span>
    `;
    button.addEventListener("click", () => openInNewTab(tool.url || `${DEFAULT_TOOLS_URL}/${tool.slug}`));
    directoryGrid.appendChild(button);
  });
}

async function loadTools(forceRefresh) {
  if (directoryStatus) {
    directoryStatus.textContent = forceRefresh ? "Refreshing tool list…" : "Loading tool list…";
  }
  const response = await getToolsMessage(
    forceRefresh ? "plain-tools:refresh-tools" : "plain-tools:get-tools"
  );
  tools = Array.isArray(response.tools) && response.tools.length > 0 ? response.tools : fallbackTools();
  if (directoryStatus) {
    directoryStatus.textContent = `Showing ${tools.length} tools (${response.source || "fallback"}).`;
  }
  renderDirectory();
}

function submitSiteSearch() {
  const query =
    searchInput instanceof HTMLInputElement ? searchInput.value.trim() : "";
  const url = query
    ? `${DEFAULT_TOOLS_URL}?search=${encodeURIComponent(query)}`
    : DEFAULT_TOOLS_URL;
  openInNewTab(url);
}

function handleQuickLinks() {
  const clickable = document.querySelectorAll("[data-url]");
  clickable.forEach((element) => {
    element.addEventListener("click", () => {
      const url = element.getAttribute("data-url");
      if (!url) return;
      openInNewTab(url);
    });
  });
}

if (searchButton instanceof HTMLButtonElement) {
  searchButton.addEventListener("click", submitSiteSearch);
}

if (searchInput instanceof HTMLInputElement) {
  searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      submitSiteSearch();
    }
  });
  searchInput.addEventListener("input", () => {
    renderDirectory();
  });
}

if (refreshButton instanceof HTMLButtonElement) {
  refreshButton.addEventListener("click", () => {
    void loadTools(true);
  });
}

handleQuickLinks();
void loadTools(false);
