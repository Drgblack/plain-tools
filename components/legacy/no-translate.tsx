"use client"

import { ReactNode } from "react"

interface NoTranslateProps {
  children: ReactNode
  className?: string
  as?: "span" | "div" | "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
}

/**
 * Wrapper component to protect brand terms and technical terminology
 * from being altered by translation engines (e.g., Google Translate).
 * 
 * Usage:
 * <NoTranslate>Plain</NoTranslate>
 * <NoTranslate>WebAssembly</NoTranslate>
 * <NoTranslate>Wasm</NoTranslate>
 * <NoTranslate>WebGPU</NoTranslate>
 */
export function NoTranslate({ children, className = "", as = "span" }: NoTranslateProps) {
  const Component = as
  return (
    <Component 
      translate="no" 
      className={`notranslate ${className}`}
    >
      {children}
    </Component>
  )
}

/**
 * Pre-configured brand term components for consistency
 */
export function BrandPlain({ className = "" }: { className?: string }) {
  return <NoTranslate className={className}>Plain</NoTranslate>
}

export function BrandWasm({ className = "" }: { className?: string }) {
  return <NoTranslate className={className}>Wasm</NoTranslate>
}

export function BrandWebAssembly({ className = "" }: { className?: string }) {
  return <NoTranslate className={className}>WebAssembly</NoTranslate>
}

export function BrandWebGPU({ className = "" }: { className?: string }) {
  return <NoTranslate className={className}>WebGPU</NoTranslate>
}
