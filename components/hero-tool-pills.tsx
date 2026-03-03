"use client"

import { TOOL_CATALOGUE } from "@/lib/tools-catalogue"

const availableToolNames = TOOL_CATALOGUE.filter((tool) => tool.available).map(
  (tool) => tool.name
)
const marqueeToolNames =
  availableToolNames.length > 0 ? [...availableToolNames, ...availableToolNames] : []

export function HeroToolPills() {
  return (
    <div className="relative mt-8 w-full max-w-5xl overflow-x-hidden px-2">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 hidden w-12 bg-gradient-to-r from-[#000] to-transparent sm:block" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 hidden w-12 bg-gradient-to-l from-[#000] to-transparent sm:block" />

      <div aria-hidden="true" className="flex flex-wrap justify-center gap-2 sm:hidden">
        {availableToolNames.map((toolName, index) => (
          <span key={`${toolName}-mobile-${index}`} className="hero-tools-pill">
            {toolName}
          </span>
        ))}
      </div>

      <div aria-hidden="true" className="hero-tools-marquee hidden sm:flex">
        {marqueeToolNames.map((toolName, index) => (
          <span key={`${toolName}-desktop-${index}`} className="hero-tools-pill">
            {toolName}
          </span>
        ))}
      </div>
      <p className="sr-only">Available tools include {availableToolNames.join(", ")}.</p>
    </div>
  )
}
