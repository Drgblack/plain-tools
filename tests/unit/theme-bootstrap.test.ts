import vm from "node:vm"

import { describe, expect, it, vi } from "vitest"

import { buildThemeInitScript } from "@/lib/theme-bootstrap"

type RunResult = {
  setAttribute: ReturnType<typeof vi.fn>
  setItem: ReturnType<typeof vi.fn>
  colorScheme: string
}

const runBootstrap = ({
  stored,
  prefersDark,
  throwOnGet,
  throwOnSet,
}: {
  stored: string | null
  prefersDark: boolean
  throwOnGet?: boolean
  throwOnSet?: boolean
}): RunResult => {
  const setAttribute = vi.fn()
  const setItem = vi.fn((key: string, value: string) => {
    if (throwOnSet) {
      throw new Error("SecurityError")
    }
    return [key, value]
  })

  const localStorage = {
    getItem: vi.fn(() => {
      if (throwOnGet) {
        throw new Error("SecurityError")
      }
      return stored
    }),
    setItem,
  }

  const root = {
    setAttribute,
    style: {
      colorScheme: "",
    },
  }

  const context = {
    localStorage,
    window: {
      matchMedia: () => ({ matches: prefersDark }),
    },
    document: {
      documentElement: root,
    },
    Set,
  }

  vm.runInNewContext(buildThemeInitScript(), context)

  return {
    setAttribute,
    setItem,
    colorScheme: root.style.colorScheme,
  }
}

describe("theme bootstrap script", () => {
  it("applies system dark when storage access is blocked", () => {
    const result = runBootstrap({
      stored: null,
      prefersDark: true,
      throwOnGet: true,
      throwOnSet: true,
    })

    expect(result.setAttribute).toHaveBeenCalledWith("data-theme", "dark")
    expect(result.colorScheme).toBe("dark")
  })

  it("defaults invalid stored values to system and writes fallback", () => {
    const result = runBootstrap({
      stored: "invalid",
      prefersDark: false,
    })

    expect(result.setItem).toHaveBeenCalledWith("plain-tools-theme", "system")
    expect(result.setAttribute).toHaveBeenCalledWith("data-theme", "light")
  })

  it("respects explicit stored theme choice", () => {
    const result = runBootstrap({
      stored: "light",
      prefersDark: true,
    })

    expect(result.setItem).not.toHaveBeenCalled()
    expect(result.setAttribute).toHaveBeenCalledWith("data-theme", "light")
    expect(result.colorScheme).toBe("light")
  })
})
