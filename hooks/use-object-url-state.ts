"use client"

import { useCallback, useEffect, useState } from "react"

/**
 * Manages a revokable object URL for browser-only downloads.
 */
export function useObjectUrlState() {
  const [url, setUrl] = useState<string | null>(null)

  const clearUrl = useCallback(() => {
    setUrl((previous) => {
      if (previous) {
        URL.revokeObjectURL(previous)
      }
      return null
    })
  }, [])

  const setUrlFromBlob = useCallback((blob: Blob) => {
    setUrl((previous) => {
      if (previous) {
        URL.revokeObjectURL(previous)
      }
      return URL.createObjectURL(blob)
    })
  }, [])

  useEffect(() => clearUrl, [clearUrl])

  return {
    url,
    clearUrl,
    setUrlFromBlob,
  }
}
