import { THEME_STORAGE_KEY } from "@/lib/theme-storage"

export const buildThemeInitScript = (storageKey = THEME_STORAGE_KEY) => `
(() => {
  const key = ${JSON.stringify(storageKey)};
  const root = document.documentElement;
  const valid = new Set(["light", "dark", "system"]);

  let stored = null;
  try {
    stored = localStorage.getItem(key);
  } catch {}

  const choice = valid.has(stored) ? stored : "system";
  if (!valid.has(stored)) {
    try {
      localStorage.setItem(key, "system");
    } catch {}
  }

  const resolved = choice === "system"
    ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
    : choice;

  root.setAttribute("data-theme", resolved);
  root.style.colorScheme = resolved;
})();
`
