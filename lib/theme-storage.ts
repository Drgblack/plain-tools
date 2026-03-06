export const THEME_STORAGE_KEY = "plain-tools-theme"

export type ThemeChoice = "light" | "dark" | "system"
export type ResolvedTheme = "light" | "dark"

export const isThemeChoice = (value: string | null): value is ThemeChoice =>
  value === "light" || value === "dark" || value === "system"

export const resolveThemeChoice = (
  choice: ThemeChoice,
  systemPrefersDark: boolean
): ResolvedTheme => {
  if (choice === "system") {
    return systemPrefersDark ? "dark" : "light"
  }
  return choice
}

export const safeReadStoredTheme = (
  storage: Pick<Storage, "getItem">,
  key = THEME_STORAGE_KEY
) => {
  try {
    return storage.getItem(key)
  } catch {
    return null
  }
}

export const safeWriteStoredTheme = (
  storage: Pick<Storage, "setItem">,
  value: ThemeChoice,
  key = THEME_STORAGE_KEY
) => {
  try {
    storage.setItem(key, value)
  } catch {}
}

export const getThemeChoiceWithFallback = (
  storage: Pick<Storage, "getItem" | "setItem">,
  key = THEME_STORAGE_KEY
): ThemeChoice => {
  const stored = safeReadStoredTheme(storage, key)
  if (isThemeChoice(stored)) {
    return stored
  }
  safeWriteStoredTheme(storage, "system", key)
  return "system"
}

export const applyResolvedTheme = (
  root: Pick<HTMLElement, "setAttribute" | "style">,
  theme: ResolvedTheme
) => {
  root.setAttribute("data-theme", theme)
  root.style.colorScheme = theme
}
