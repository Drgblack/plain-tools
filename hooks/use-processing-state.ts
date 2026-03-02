"use client"

import { useCallback, useMemo, useState } from "react"

export type ProcessingState =
  | "Idle"
  | "Initialising Wasm"
  | "Scrubbing Metadata"
  | "Complete"
  | "Failed"

const INITIAL_MESSAGE = "Ready for local-only processing."

export function useProcessingState() {
  const [state, setState] = useState<ProcessingState>("Idle")
  const [message, setMessage] = useState(INITIAL_MESSAGE)
  const [error, setError] = useState<string | null>(null)

  const isProcessing = state === "Initialising Wasm" || state === "Scrubbing Metadata"

  const setInitialising = useCallback((nextMessage?: string) => {
    setState("Initialising Wasm")
    setMessage(nextMessage ?? "Initialising Wasm for local PDF processing.")
    setError(null)
  }, [])

  const setScrubbingMetadata = useCallback((nextMessage?: string) => {
    setState("Scrubbing Metadata")
    setMessage(nextMessage ?? "Scrubbing metadata locally with no uploads.")
    setError(null)
  }, [])

  const setComplete = useCallback((nextMessage?: string) => {
    setState("Complete")
    setMessage(nextMessage ?? "Complete. Your processed file is ready.")
    setError(null)
  }, [])

  const setFailed = useCallback((errorMessage: string) => {
    setState("Failed")
    setMessage("Processing failed locally. Please check the file and try again.")
    setError(errorMessage)
  }, [])

  const reset = useCallback(() => {
    setState("Idle")
    setMessage(INITIAL_MESSAGE)
    setError(null)
  }, [])

  return useMemo(
    () => ({
      state,
      message,
      error,
      isProcessing,
      setInitialising,
      setScrubbingMetadata,
      setComplete,
      setFailed,
      reset,
    }),
    [
      error,
      isProcessing,
      message,
      reset,
      setComplete,
      setFailed,
      setInitialising,
      setScrubbingMetadata,
      state,
    ]
  )
}
