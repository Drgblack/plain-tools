"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

const PROTECTED_SELECTOR = [
  "input",
  "textarea",
  "select",
  "pre",
  "code",
  "kbd",
  "samp",
  "[data-plain-tool-shell]",
  "[data-plain-legal-copy]",
].join(", ")

function markProtectedNodes() {
  const nodes = document.querySelectorAll<HTMLElement>(PROTECTED_SELECTOR)
  nodes.forEach((node) => {
    node.setAttribute("translate", "no")
    node.classList.add("notranslate")
  })
}

export function TranslationProtection() {
  const pathname = usePathname()

  useEffect(() => {
    markProtectedNodes()

    const observer = new MutationObserver(() => {
      markProtectedNodes()
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })

    return () => {
      observer.disconnect()
    }
  }, [pathname])

  return null
}
