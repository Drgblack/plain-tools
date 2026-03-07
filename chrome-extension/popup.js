const plainToolsHomeUrl = "https://plain.tools";
const plainToolsSearchUrl = "https://plain.tools/tools";

const openButton = document.getElementById("openPlainTools");
const refreshButton = document.getElementById("refreshTools");
const searchInput = document.getElementById("toolSearchInput");
const toolGrid = document.getElementById("toolGrid");
const toolStatus = document.getElementById("toolStatus");

let tools = [];
let query = "";

function fallbackTools() {
  return Array.isArray(window.PLAIN_TOOLS_FALLBACK) ? window.PLAIN_TOOLS_FALLBACK : [];
}

function openTab(url) {
  if (typeof chrome !== "undefined" && chrome.tabs && chrome.tabs.create) {
    chrome.tabs.create({ url });
    return;
  }
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

function setStatus(message) {
  if (toolStatus) {
    toolStatus.textContent = message;
  }
}

function renderToolGrid() {
  if (!toolGrid) return;
  const filtered = tools.filter((tool) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return `${tool.name} ${tool.description} ${tool.slug}`.toLowerCase().includes(q);
  });

  toolGrid.innerHTML = "";

  if (filtered.length === 0) {
    const empty = document.createElement("p");
    empty.className = "status-text";
    empty.textContent = "No matching tools found.";
    toolGrid.appendChild(empty);
    return;
  }

  filtered.slice(0, 24).forEach((tool) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "tool-card";
    button.setAttribute("role", "listitem");
    button.innerHTML = `
      <span class="tool-name">${tool.name}</span>
      <span class="tool-description">${tool.description || "Open this tool in Plain Tools."}</span>
    `;
    button.addEventListener("click", () => openTab(tool.url || `${plainToolsSearchUrl}/${tool.slug}`));
    toolGrid.appendChild(button);
  });
}

async function loadTools(forceRefresh) {
  setStatus(forceRefresh ? "Refreshing tools…" : "Loading tools…");
  const response = await getToolsMessage(
    forceRefresh ? "plain-tools:refresh-tools" : "plain-tools:get-tools"
  );
  tools = Array.isArray(response.tools) && response.tools.length > 0 ? response.tools : fallbackTools();
  setStatus(`Showing ${tools.length} tools (${response.source || "fallback"}).`);
  renderToolGrid();
}

if (openButton) {
  openButton.addEventListener("click", () => {
    const q = query.trim();
    const url = q ? `${plainToolsSearchUrl}?search=${encodeURIComponent(q)}` : plainToolsHomeUrl;
    openTab(url);
    window.close();
  });
}

if (refreshButton) {
  refreshButton.addEventListener("click", () => {
    void loadTools(true);
  });
}

if (searchInput) {
  searchInput.addEventListener("input", (event) => {
    query = event.target.value || "";
    renderToolGrid();
  });
  searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const q = query.trim();
      const url = q ? `${plainToolsSearchUrl}?search=${encodeURIComponent(q)}` : plainToolsSearchUrl;
      openTab(url);
      window.close();
    }
  });
}

void loadTools(false);
