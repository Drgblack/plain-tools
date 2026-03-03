/// <reference lib="webworker" />

import { PDFDocument } from "pdf-lib"
import * as pdfjs from "pdfjs-dist/legacy/build/pdf.mjs"

if (!pdfjs.GlobalWorkerOptions.workerSrc) {
  pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.js"
}

type StartKnownMessage = {
  type: "start-known"
  jobId: string
  pdfBytes: ArrayBuffer
  password: string
}

type StartBruteMessage = {
  type: "start-brute"
  jobId: string
  pdfBytes: ArrayBuffer
  charset: string
  maxLength: number
}

type PauseMessage = { type: "pause"; jobId: string }
type ResumeMessage = { type: "resume"; jobId: string }
type CancelMessage = { type: "cancel"; jobId: string }

type IncomingMessage =
  | StartKnownMessage
  | StartBruteMessage
  | PauseMessage
  | ResumeMessage
  | CancelMessage

type ProgressMessage = {
  type: "progress"
  jobId: string
  attempts: number
  totalAttempts: number
  currentAttempt: string
  attemptsPerSecond: number
  etaSeconds: number | null
}

type SuccessMessage = {
  type: "success"
  jobId: string
  password: string
  attempts: number
  unlockedPdfBytes: ArrayBuffer
}

type ExhaustedMessage = {
  type: "exhausted"
  jobId: string
  attempts: number
  totalAttempts: number
}

type CancelledMessage = {
  type: "cancelled"
  jobId: string
  attempts: number
}

type ErrorMessage = {
  type: "error"
  jobId: string
  error: string
}

const workerScope = self as DedicatedWorkerGlobalScope
const MAX_LENGTH_LIMIT = 6
const PROGRESS_INTERVAL_MS = 180

let activeJobId: string | null = null
let paused = false
let cancelled = false
let attemptCounter = 0

const postProgress = (payload: ProgressMessage) => workerScope.postMessage(payload)
const postSuccess = (payload: SuccessMessage) =>
  workerScope.postMessage(payload, [payload.unlockedPdfBytes])
const postExhausted = (payload: ExhaustedMessage) => workerScope.postMessage(payload)
const postCancelled = (payload: CancelledMessage) => workerScope.postMessage(payload)
const postError = (payload: ErrorMessage) => workerScope.postMessage(payload)

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const toTransferableArrayBuffer = (bytes: Uint8Array) => {
  const copy = new Uint8Array(bytes.byteLength)
  copy.set(bytes)
  return copy.buffer
}

const isPasswordFailure = (error: unknown) => {
  if (!(error instanceof Error)) {
    return false
  }

  const passwordError = error as Error & { code?: number }
  if (
    error.name === "PasswordException" &&
    typeof passwordError.code === "number" &&
    (passwordError.code === pdfjs.PasswordResponses.INCORRECT_PASSWORD ||
      passwordError.code === pdfjs.PasswordResponses.NEED_PASSWORD)
  ) {
    return true
  }

  return (error.message || "").toLowerCase().includes("password")
}

const saveUnlockedBytes = async (
  openedPdf: Awaited<ReturnType<typeof pdfjs.getDocument>["promise"]>
) => {
  const openedBytes = new Uint8Array(await openedPdf.getData())
  const outputDoc = await PDFDocument.load(openedBytes, {
    ignoreEncryption: true,
    updateMetadata: false,
  })
  return await outputDoc.save({ useObjectStreams: true })
}

const attemptPasswordUnlock = async (sourceBytes: Uint8Array, password: string) => {
  const loadingTask = pdfjs.getDocument({
    data: sourceBytes,
    password,
    disableAutoFetch: true,
    disableRange: true,
    disableStream: true,
  })

  try {
    const openedPdf = await loadingTask.promise
    return await saveUnlockedBytes(openedPdf)
  } catch (error) {
    if (isPasswordFailure(error)) {
      return null
    }
    throw error
  } finally {
    await loadingTask.destroy()
  }
}

const totalAttemptCount = (base: number, maxLength: number) => {
  let total = 0
  for (let length = 1; length <= maxLength; length += 1) {
    total += base ** length
  }
  return total
}

const fromIndex = (charset: string[], length: number, index: number) => {
  const base = charset.length
  const chars = new Array<string>(length)
  let value = index

  for (let position = length - 1; position >= 0; position -= 1) {
    chars[position] = charset[value % base] ?? ""
    value = Math.floor(value / base)
  }

  return chars.join("")
}

const waitWhilePaused = async (jobId: string) => {
  while (paused && !cancelled && activeJobId === jobId) {
    await sleep(80)
  }
}

const handleKnownPassword = async (message: StartKnownMessage) => {
  const { jobId } = message
  attemptCounter = 0
  const sourceBytes = new Uint8Array(message.pdfBytes)
  const candidate = message.password

  try {
    const unlocked = await attemptPasswordUnlock(sourceBytes, candidate)
    attemptCounter = 1

    if (activeJobId !== jobId || cancelled) {
      postCancelled({ type: "cancelled", jobId, attempts: attemptCounter })
      return
    }

    if (unlocked) {
      postProgress({
        type: "progress",
        jobId,
        attempts: 1,
        totalAttempts: 1,
        currentAttempt: candidate,
        attemptsPerSecond: 1,
        etaSeconds: 0,
      })
      postSuccess({
        type: "success",
        jobId,
        password: candidate,
        attempts: 1,
        unlockedPdfBytes: toTransferableArrayBuffer(unlocked),
      })
      return
    }

    postExhausted({
      type: "exhausted",
      jobId,
      attempts: 1,
      totalAttempts: 1,
    })
  } catch (error) {
    postError({
      type: "error",
      jobId,
      error: error instanceof Error ? error.message : "Password attempt failed.",
    })
  }
}

const handleBruteForce = async (message: StartBruteMessage) => {
  const { jobId } = message
  attemptCounter = 0

  const trimmedCharset = Array.from(new Set(Array.from(message.charset)))
  const maxLength = Math.max(1, Math.min(MAX_LENGTH_LIMIT, Math.floor(message.maxLength)))

  if (trimmedCharset.length === 0) {
    postError({
      type: "error",
      jobId,
      error: "At least one character set is required for brute-force mode.",
    })
    return
  }

  const sourceBytes = new Uint8Array(message.pdfBytes)
  const totalAttempts = totalAttemptCount(trimmedCharset.length, maxLength)
  const startedAt = Date.now()
  let lastProgressAt = 0

  try {
    for (let length = 1; length <= maxLength; length += 1) {
      const combinations = trimmedCharset.length ** length

      for (let index = 0; index < combinations; index += 1) {
        if (activeJobId !== jobId || cancelled) {
          postCancelled({ type: "cancelled", jobId, attempts: attemptCounter })
          return
        }

        if (paused) {
          await waitWhilePaused(jobId)
          if (activeJobId !== jobId || cancelled) {
            postCancelled({ type: "cancelled", jobId, attempts: attemptCounter })
            return
          }
        }

        const candidate = fromIndex(trimmedCharset, length, index)
        const unlocked = await attemptPasswordUnlock(sourceBytes, candidate)
        attemptCounter += 1

        const now = Date.now()
        if (
          now - lastProgressAt >= PROGRESS_INTERVAL_MS ||
          attemptCounter === totalAttempts ||
          unlocked
        ) {
          const elapsedSeconds = Math.max(0.001, (now - startedAt) / 1000)
          const attemptsPerSecond = attemptCounter / elapsedSeconds
          const remainingAttempts = Math.max(0, totalAttempts - attemptCounter)
          const etaSeconds =
            attemptsPerSecond > 0 ? remainingAttempts / attemptsPerSecond : null

          postProgress({
            type: "progress",
            jobId,
            attempts: attemptCounter,
            totalAttempts,
            currentAttempt: candidate,
            attemptsPerSecond,
            etaSeconds: Number.isFinite(etaSeconds) ? etaSeconds : null,
          })
          lastProgressAt = now
        }

        if (unlocked) {
          postSuccess({
            type: "success",
            jobId,
            password: candidate,
            attempts: attemptCounter,
            unlockedPdfBytes: toTransferableArrayBuffer(unlocked),
          })
          return
        }
      }
    }

    postExhausted({
      type: "exhausted",
      jobId,
      attempts: attemptCounter,
      totalAttempts,
    })
  } catch (error) {
    postError({
      type: "error",
      jobId,
      error: error instanceof Error ? error.message : "Brute-force recovery failed.",
    })
  }
}

workerScope.addEventListener("message", (event: MessageEvent<IncomingMessage>) => {
  const message = event.data
  if (!message || typeof message !== "object" || !("type" in message)) {
    return
  }

  if (message.type === "pause") {
    if (message.jobId === activeJobId) {
      paused = true
    }
    return
  }

  if (message.type === "resume") {
    if (message.jobId === activeJobId) {
      paused = false
    }
    return
  }

  if (message.type === "cancel") {
    if (message.jobId === activeJobId) {
      cancelled = true
      paused = false
    }
    return
  }

  activeJobId = message.jobId
  paused = false
  cancelled = false

  if (message.type === "start-known") {
    void handleKnownPassword(message)
    return
  }

  if (message.type === "start-brute") {
    void handleBruteForce(message)
  }
})
