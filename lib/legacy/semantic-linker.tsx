"use client"

import React, { useState, useRef, useEffect, useMemo, useCallback } from "react"
import Link from "next/link"
import { createPortal } from "react-dom"

// Master Terms database with glossary anchors and quick definitions
// These terms will be automatically linked to their glossary entries
const MASTER_TERMS: Record<string, {
  anchor: string
  definition: string
  aliases?: string[]
}> = {
  "WebAssembly": {
    anchor: "webassembly-wasm",
    definition: "A binary instruction format enabling high-performance code execution in browsers at near-native speeds.",
    aliases: ["Wasm", "WASM"],
  },
  "WebGPU": {
    anchor: "webgpu",
    definition: "A modern web API providing hardware-accelerated graphics and compute capabilities for on-device AI inference.",
  },
  "Client-Side Processing": {
    anchor: "client-side-processing",
    definition: "Data handling entirely on your device rather than remote servers, ensuring documents remain under your control.",
    aliases: ["Client-Side", "client-side"],
  },
  "Zero-Knowledge Architecture": {
    anchor: "zero-knowledge-architecture",
    definition: "A system design where the service provider has no technical ability to access or view user data.",
    aliases: ["Zero-Knowledge", "zero-knowledge"],
  },
  "Browser Sandboxing": {
    anchor: "browser-sandboxing",
    definition: "A security mechanism isolating web content from the operating system and other applications.",
    aliases: ["Sandbox", "sandboxing", "sandboxed"],
  },
  "End-to-End Local Encryption": {
    anchor: "end-to-end-local-encryption",
    definition: "Cryptographic approach where data is encrypted and decrypted entirely on your device.",
    aliases: ["Local Encryption", "E2E Encryption"],
  },
  "Progressive Web App": {
    anchor: "progressive-web-app-pwa",
    definition: "A web application that can be installed on devices and works offline through service worker caching.",
    aliases: ["PWA"],
  },
  "Air-Gap Mode": {
    anchor: "air-gap-mode",
    definition: "An operational state where the application is completely isolated from network connectivity.",
    aliases: ["Air-Gapped", "Air Gap"],
  },
  "Volatile Memory Processing": {
    anchor: "volatile-memory-processing",
    definition: "Data handling exclusively in RAM, automatically cleared when the application closes.",
    aliases: ["Volatile Memory"],
  },
  "Optical Character Recognition": {
    anchor: "optical-character-recognition-ocr",
    definition: "Technology converting images of text into machine-readable data, running locally via Wasm.",
    aliases: ["OCR"],
  },
  "PDF/A": {
    anchor: "pdfa-archival-pdf",
    definition: "An ISO-standardised PDF subset designed for long-term digital preservation.",
  },
  "Redaction": {
    anchor: "redaction",
    definition: "The permanent, irreversible removal of sensitive information from a document.",
    aliases: ["Redact", "Redacted"],
  },
  "Metadata Sanitisation": {
    anchor: "metadata-sanitisation",
    definition: "The process of removing hidden document properties that could reveal sensitive information.",
    aliases: ["Metadata Removal", "Sanitisation"],
  },
  "AES-256": {
    anchor: "aes-256-encryption",
    definition: "Advanced Encryption Standard with 256-bit keys, considered computationally infeasible to break.",
    aliases: ["AES-256 Encryption", "AES256"],
  },
  "Linearised PDF": {
    anchor: "linearised-pdf",
    definition: "A PDF optimised for fast web viewing by reorganising data for progressive loading.",
    aliases: ["Linearized PDF", "Fast Web View"],
  },
  "Digital Signature": {
    anchor: "digital-signature",
    definition: "A cryptographic mechanism verifying document authenticity and integrity.",
    aliases: ["Digital Signatures"],
  },
  "Lossless Compression": {
    anchor: "lossless-compression",
    definition: "Data compression that allows perfect reconstruction of original data, with no quality loss.",
  },
  "Service Worker": {
    anchor: "service-worker",
    definition: "A browser script enabling offline functionality and background processing for web applications.",
    aliases: ["Service Workers"],
  },
  "GDPR": {
    anchor: "gdpr-compliance",
    definition: "The EU General Data Protection Regulation governing data privacy and protection.",
    aliases: ["UK GDPR"],
  },
  "Local-First": {
    anchor: "local-first-software",
    definition: "Software architecture prioritising local data storage and processing over cloud dependency.",
    aliases: ["Local-First Software"],
  },
}

// Build a lookup map including all aliases
function buildTermLookup(): Map<string, { key: string; anchor: string; definition: string }> {
  const lookup = new Map<string, { key: string; anchor: string; definition: string }>()
  
  for (const [term, data] of Object.entries(MASTER_TERMS)) {
    // Add the main term
    lookup.set(term.toLowerCase(), { key: term, anchor: data.anchor, definition: data.definition })
    
    // Add all aliases
    if (data.aliases) {
      for (const alias of data.aliases) {
        lookup.set(alias.toLowerCase(), { key: term, anchor: data.anchor, definition: data.definition })
      }
    }
  }
  
  return lookup
}

const TERM_LOOKUP = buildTermLookup()

// Get all terms sorted by length (longest first to match multi-word terms first)
function getAllTermPatterns(): string[] {
  const allTerms: string[] = []
  
  for (const [term, data] of Object.entries(MASTER_TERMS)) {
    allTerms.push(term)
    if (data.aliases) {
      allTerms.push(...data.aliases)
    }
  }
  
  // Sort by length descending to match longer terms first
  return allTerms.sort((a, b) => b.length - a.length)
}

// Create a regex that matches any of the master terms (case-insensitive, word boundaries)
function createTermRegex(): RegExp {
  const patterns = getAllTermPatterns()
  const escapedPatterns = patterns.map(p => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  return new RegExp(`\\b(${escapedPatterns.join('|')})\\b`, 'gi')
}

const TERM_REGEX = createTermRegex()

// Tooltip Component with Portal
function GlossaryTooltip({
  term,
  definition,
  anchor,
  position,
  onMouseEnter,
  onMouseLeave,
}: {
  term: string
  definition: string
  anchor: string
  position: { top: number; left: number }
  onMouseEnter: () => void
  onMouseLeave: () => void
}) {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  if (!mounted) return null
  
  const tooltipContent = (
    <div
      className="fixed z-[9999] w-72 rounded-lg border border-[#0070f3] bg-[#0f0f0f] p-4 shadow-[0_0_20px_rgba(0,112,243,0.2)] backdrop-blur-sm"
      style={{
        top: position.top,
        left: position.left,
        transform: 'translateY(-100%) translateY(-8px)',
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Technical grid pattern background */}
      <div 
        className="pointer-events-none absolute inset-0 rounded-lg opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px',
        }}
      />
      
      <div className="relative">
        {/* Term heading */}
        <h4 className="font-mono text-[13px] font-semibold text-[#0070f3]" translate="no">
          {term}
        </h4>
        
        {/* Quick definition */}
        <p className="mt-2 text-[12px] leading-relaxed text-white/70">
          {definition}
        </p>
        
        {/* Glossary link */}
        <Link
          href={`/learn/glossary#${anchor}`}
          className="mt-3 inline-flex items-center gap-1 text-[11px] font-medium text-[#0070f3] transition-colors hover:text-[#3291ff]"
        >
          Read more in Glossary
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  )
  
  return createPortal(tooltipContent, document.body)
}

// Linked Term Component
function LinkedTerm({
  term,
  matchedText,
  anchor,
  definition,
}: {
  term: string
  matchedText: string
  anchor: string
  definition: string
}) {
  const [showTooltip, setShowTooltip] = useState(false)
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 })
  const linkRef = useRef<HTMLAnchorElement>(null)
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  
  const handleMouseEnter = useCallback(() => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current)
      hideTimeoutRef.current = null
    }
    
    if (linkRef.current) {
      const rect = linkRef.current.getBoundingClientRect()
      setTooltipPosition({
        top: rect.top + window.scrollY,
        left: Math.min(rect.left, window.innerWidth - 300),
      })
    }
    setShowTooltip(true)
  }, [])
  
  const handleMouseLeave = useCallback(() => {
    hideTimeoutRef.current = setTimeout(() => {
      setShowTooltip(false)
    }, 150)
  }, [])
  
  const handleTooltipMouseEnter = useCallback(() => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current)
      hideTimeoutRef.current = null
    }
  }, [])
  
  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current)
      }
    }
  }, [])
  
  return (
    <>
      <Link
        ref={linkRef}
        href={`/learn/glossary#${anchor}`}
        className="border-b border-dashed border-[#0070f3]/50 text-inherit no-underline transition-colors hover:border-[#0070f3] hover:text-[#0070f3]"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        translate="no"
      >
        {matchedText}
      </Link>
      
      {showTooltip && (
        <GlossaryTooltip
          term={term}
          definition={definition}
          anchor={anchor}
          position={tooltipPosition}
          onMouseEnter={handleTooltipMouseEnter}
          onMouseLeave={handleMouseLeave}
        />
      )}
    </>
  )
}

// Check if a node is inside a code block or existing link
function isInsideCodeOrLink(node: Node): boolean {
  let current: Node | null = node
  while (current) {
    if (current.nodeType === Node.ELEMENT_NODE) {
      const element = current as Element
      const tagName = element.tagName.toLowerCase()
      
      // Skip if inside code, pre, a, or elements with translate="no"
      if (
        tagName === 'code' ||
        tagName === 'pre' ||
        tagName === 'a' ||
        tagName === 'script' ||
        tagName === 'style' ||
        element.getAttribute('translate') === 'no' ||
        element.classList.contains('notranslate') ||
        element.hasAttribute('data-no-link')
      ) {
        return true
      }
    }
    current = current.parentNode
  }
  return false
}

// Process text and return React nodes with linked terms
export function processTextWithLinks(
  text: string,
  linkedTerms: Set<string> = new Set()
): { nodes: React.ReactNode[]; updatedLinkedTerms: Set<string> } {
  const nodes: React.ReactNode[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null
  
  // Reset regex
  TERM_REGEX.lastIndex = 0
  
  while ((match = TERM_REGEX.exec(text)) !== null) {
    const matchedText = match[0]
    const termData = TERM_LOOKUP.get(matchedText.toLowerCase())
    
    if (!termData) continue
    
    // Only link the first instance of each term
    if (linkedTerms.has(termData.key)) continue
    
    // Add text before the match
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index))
    }
    
    // Add the linked term
    nodes.push(
      <LinkedTerm
        key={`${termData.key}-${match.index}`}
        term={termData.key}
        matchedText={matchedText}
        anchor={termData.anchor}
        definition={termData.definition}
      />
    )
    
    linkedTerms.add(termData.key)
    lastIndex = match.index + matchedText.length
  }
  
  // Add remaining text
  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex))
  }
  
  return { nodes: nodes.length > 0 ? nodes : [text], updatedLinkedTerms: linkedTerms }
}

// Component that wraps children and auto-links terms
export function SemanticLinker({
  children,
  disabled = false,
}: {
  children: React.ReactNode
  disabled?: boolean
}) {
  const linkedTermsRef = useRef<Set<string>>(new Set())
  
  const processNode = useCallback((node: React.ReactNode): React.ReactNode => {
    if (disabled) return node
    
    // Handle string children
    if (typeof node === 'string') {
      const { nodes } = processTextWithLinks(node, linkedTermsRef.current)
      return nodes.length === 1 ? nodes[0] : <>{nodes}</>
    }
    
    // Handle React elements
    if (React.isValidElement(node)) {
      const element = node as React.ReactElement<{ children?: React.ReactNode }>
      
      // Skip certain elements
      const type = element.type
      if (
        typeof type === 'string' && 
        ['code', 'pre', 'a', 'script', 'style'].includes(type)
      ) {
        return node
      }
      
      // Skip elements with translate="no" or data-no-link
      const props = element.props as Record<string, unknown>
      if (props.translate === 'no' || props['data-no-link']) {
        return node
      }
      
      // Process children recursively
      if (props.children) {
        const processedChildren = React.Children.map(props.children, processNode)
        return React.cloneElement(element, {}, processedChildren)
      }
    }
    
    // Handle arrays
    if (Array.isArray(node)) {
      return node.map(processNode)
    }
    
    return node
  }, [disabled])
  
  // Reset linked terms on each render cycle
  linkedTermsRef.current = new Set()
  
  const processedChildren = useMemo(() => {
    return React.Children.map(children, processNode)
  }, [children, processNode])
  
  return <>{processedChildren}</>
}

// Hook for programmatic text processing
export function useSemanticLinks() {
  const linkedTermsRef = useRef<Set<string>>(new Set())
  
  const processText = useCallback((text: string) => {
    const { nodes, updatedLinkedTerms } = processTextWithLinks(text, linkedTermsRef.current)
    linkedTermsRef.current = updatedLinkedTerms
    return nodes
  }, [])
  
  const reset = useCallback(() => {
    linkedTermsRef.current = new Set()
  }, [])
  
  return { processText, reset }
}

// Utility to get all master terms (for reference)
export function getMasterTerms() {
  return MASTER_TERMS
}

// Export the term lookup for external use
export { TERM_LOOKUP, MASTER_TERMS }
