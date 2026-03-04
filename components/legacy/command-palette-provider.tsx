"use client"

import { CommandPalette } from "@/components/command-palette"

interface CommandPaletteProviderProps {
  children: React.ReactNode
}

export function CommandPaletteProvider({ children }: CommandPaletteProviderProps) {
  return (
    <>
      {children}
      <CommandPalette />
    </>
  )
}
