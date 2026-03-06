import { useEffect, useMemo, useState } from "react"

type ThemeMode = "light" | "dark" | "system"

const STORAGE_KEY = "plain-tools-theme"

const getStoredTheme = (): ThemeMode => {
  if (typeof window === "undefined") return "system"
  const value = window.localStorage.getItem(STORAGE_KEY)
  if (value === "light" || value === "dark" || value === "system") {
    return value
  }
  return "system"
}

const getSystemTheme = (): "light" | "dark" => {
  if (typeof window === "undefined") return "light"
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

export const useTheme = () => {
  const [mode, setMode] = useState<ThemeMode>("system")
  const [systemTheme, setSystemTheme] = useState<"light" | "dark">(getSystemTheme())

  useEffect(() => {
    setMode(getStoredTheme())

    const media = window.matchMedia("(prefers-color-scheme: dark)")
    const listener = () => setSystemTheme(media.matches ? "dark" : "light")
    media.addEventListener("change", listener)
    return () => media.removeEventListener("change", listener)
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, mode)
    }
  }, [mode])

  const resolvedTheme = useMemo(
    () => (mode === "system" ? systemTheme : mode),
    [mode, systemTheme]
  )

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", resolvedTheme)
  }, [resolvedTheme])

  return {
    mode,
    resolvedTheme,
    setMode,
  }
}
