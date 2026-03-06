"use client"

import { Moon, Sun } from "lucide-react"
import { useCallback, useEffect, useMemo, useState } from "react"

import {
  applyResolvedTheme,
  getThemeChoiceWithFallback,
  resolveThemeChoice,
  safeWriteStoredTheme,
  THEME_STORAGE_KEY,
  type ResolvedTheme,
  type ThemeChoice,
} from "@/lib/theme-storage"
import { Button } from "@/components/ui/button"

const getSystemTheme = (): ResolvedTheme =>
  window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"

const applyTheme = (theme: ResolvedTheme) => {
  applyResolvedTheme(document.documentElement, theme)
}

export function ThemeToggle() {
  const [themeChoice, setThemeChoice] = useState<ThemeChoice>("system")
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>("dark")
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const initialChoice = getThemeChoiceWithFallback(localStorage, THEME_STORAGE_KEY)
    const initialResolved = resolveThemeChoice(initialChoice, getSystemTheme() === "dark")
    setThemeChoice(initialChoice)
    setResolvedTheme(initialResolved)
    applyTheme(initialResolved)
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready || themeChoice !== "system") {
      return
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const syncSystemTheme = () => {
      const next = mediaQuery.matches ? "dark" : "light"
      setResolvedTheme(next)
      applyTheme(next)
    }

    syncSystemTheme()

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", syncSystemTheme)
      return () => mediaQuery.removeEventListener("change", syncSystemTheme)
    }

    mediaQuery.addListener(syncSystemTheme)
    return () => mediaQuery.removeListener(syncSystemTheme)
  }, [ready, themeChoice])

  const setTheme = useCallback((nextChoice: ThemeChoice) => {
    const nextResolved = resolveThemeChoice(nextChoice, getSystemTheme() === "dark")
    setThemeChoice(nextChoice)
    setResolvedTheme(nextResolved)
    applyTheme(nextResolved)
    safeWriteStoredTheme(localStorage, nextChoice, THEME_STORAGE_KEY)
  }, [])

  const toggleTheme = useCallback(() => {
    const currentEffective = themeChoice === "system" ? resolvedTheme : themeChoice
    const next = currentEffective === "dark" ? "light" : "dark"
    setTheme(next)
  }, [resolvedTheme, setTheme, themeChoice])

  const ariaLabel = useMemo(() => {
    if (!ready) {
      return "Toggle theme"
    }
    return resolvedTheme === "dark" ? "Switch to light mode" : "Switch to dark mode"
  }, [ready, resolvedTheme])

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-9 w-9 text-muted-foreground hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      onClick={toggleTheme}
      aria-label={ariaLabel}
      title={themeChoice === "system" ? "Theme: system" : `Theme: ${themeChoice}`}
    >
      {resolvedTheme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  )
}
