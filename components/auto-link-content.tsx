"use client"

import { SemanticLinker } from "@/lib/semantic-linker"

interface AutoLinkContentProps {
  children: React.ReactNode
  /**
   * Disable auto-linking (useful for code blocks, forms, etc.)
   */
  disabled?: boolean
  /**
   * Additional CSS classes
   */
  className?: string
}

/**
 * AutoLinkContent - Automatically links Master Terms to the Glossary
 * 
 * Wrap any content block with this component to automatically detect and link
 * technical terms (WebAssembly, WebGPU, AES-256, etc.) to their glossary entries.
 * 
 * Features:
 * - Only links the first instance of each term per content block
 * - Ignores terms inside <code>, <pre>, <a>, and translate="no" elements
 * - Provides hover tooltips with quick definitions
 * - Uses subtle dashed underline styling
 * 
 * Usage:
 * ```tsx
 * <AutoLinkContent>
 *   <p>Our tools use WebAssembly for fast, local processing.</p>
 * </AutoLinkContent>
 * ```
 */
export function AutoLinkContent({
  children,
  disabled = false,
  className,
}: AutoLinkContentProps) {
  return (
    <div className={className} data-auto-link-content>
      <SemanticLinker disabled={disabled}>
        {children}
      </SemanticLinker>
    </div>
  )
}

/**
 * NoAutoLink - Prevents auto-linking within its children
 * 
 * Use this to wrap sections where you don't want automatic glossary linking,
 * such as code examples, technical specifications, or content that already
 * has manual links.
 */
export function NoAutoLink({ children }: { children: React.ReactNode }) {
  return (
    <div data-no-link translate="no">
      {children}
    </div>
  )
}
