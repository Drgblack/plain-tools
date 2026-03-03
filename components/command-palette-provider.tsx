"use client"

import dynamic from "next/dynamic"
import { useEffect, useRef, useState } from "react"

const CommandPalette = dynamic(
  () => import("@/components/command-palette").then((mod) => mod.CommandPalette),
  { ssr: false }
)

interface CommandPaletteProviderProps {
  children: React.ReactNode
}

export function CommandPaletteProvider({ children }: CommandPaletteProviderProps) {
  const [shouldMountPalette, setShouldMountPalette] = useState(false)
  const shouldOpenAfterMountRef = useRef(false)

  useEffect(() => {
    const mountPalette = (openImmediately: boolean) => {
      if (openImmediately) {
        shouldOpenAfterMountRef.current = true
      }
      setShouldMountPalette(true)
    }

    const handleOpenPalette = () => mountPalette(true)
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        mountPalette(true)
      }
    }

    window.addEventListener("plain:open-command-palette", handleOpenPalette)
    window.addEventListener("keydown", handleShortcut)

    return () => {
      window.removeEventListener("plain:open-command-palette", handleOpenPalette)
      window.removeEventListener("keydown", handleShortcut)
    }
  }, [])

  useEffect(() => {
    if (!shouldMountPalette || !shouldOpenAfterMountRef.current) {
      return
    }

    shouldOpenAfterMountRef.current = false
    const timer = window.setTimeout(() => {
      window.dispatchEvent(new CustomEvent("plain:open-command-palette"))
    }, 0)

    return () => {
      window.clearTimeout(timer)
    }
  }, [shouldMountPalette])

  return (
    <>
      {children}
      {shouldMountPalette ? <CommandPalette /> : null}
    </>
  )
}
