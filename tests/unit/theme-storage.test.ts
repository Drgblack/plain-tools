import { describe, expect, it, vi } from "vitest"

import {
  applyResolvedTheme,
  getThemeChoiceWithFallback,
  resolveThemeChoice,
  safeReadStoredTheme,
  safeWriteStoredTheme,
} from "@/lib/theme-storage"

describe("theme-storage helpers", () => {
  it("reads a valid stored theme", () => {
    const storage = {
      getItem: vi.fn().mockReturnValue("dark"),
      setItem: vi.fn(),
    }

    expect(getThemeChoiceWithFallback(storage, "plain-tools-theme")).toBe("dark")
    expect(storage.setItem).not.toHaveBeenCalled()
  })

  it("falls back to system and persists when value is invalid", () => {
    const storage = {
      getItem: vi.fn().mockReturnValue("invalid"),
      setItem: vi.fn(),
    }

    expect(getThemeChoiceWithFallback(storage, "plain-tools-theme")).toBe("system")
    expect(storage.setItem).toHaveBeenCalledWith("plain-tools-theme", "system")
  })

  it("survives restricted storage exceptions", () => {
    const storage = {
      getItem: vi.fn(() => {
        throw new Error("SecurityError")
      }),
      setItem: vi.fn(() => {
        throw new Error("SecurityError")
      }),
    }

    expect(safeReadStoredTheme(storage, "plain-tools-theme")).toBeNull()
    expect(() => safeWriteStoredTheme(storage, "dark", "plain-tools-theme")).not.toThrow()
    expect(getThemeChoiceWithFallback(storage, "plain-tools-theme")).toBe("system")
  })

  it("resolves system theme from media preference", () => {
    expect(resolveThemeChoice("system", true)).toBe("dark")
    expect(resolveThemeChoice("system", false)).toBe("light")
    expect(resolveThemeChoice("light", true)).toBe("light")
  })

  it("applies resolved theme attributes to root element", () => {
    const setAttribute = vi.fn()
    const root = {
      setAttribute,
      style: { colorScheme: "" },
    }

    applyResolvedTheme(root as unknown as HTMLElement, "dark")
    expect(setAttribute).toHaveBeenCalledWith("data-theme", "dark")
    expect(root.style.colorScheme).toBe("dark")
  })
})
