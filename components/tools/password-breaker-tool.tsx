"use client"

import { Download, KeyRound, Loader2, Pause, Play, ShieldAlert, Trash2, UploadCloud, XCircle } from "lucide-react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { toast, Toaster } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

type PdfJsModule = typeof import("pdfjs-dist/legacy/build/pdf.mjs")

type UnlockMode = "known" | "brute"
type RunState = "idle" | "running" | "paused" | "found" | "exhausted" | "cancelled" | "error"

type WorkerProgressMessage = {
  type: "progress"
  jobId: string
  attempts: number
  totalAttempts: number
  currentAttempt: string
  attemptsPerSecond: number
  etaSeconds: number | null
}

type WorkerSuccessMessage = {
  type: "success"
  jobId: string
  password: string
  attempts: number
  unlockedPdfBytes: ArrayBuffer
}

type WorkerExhaustedMessage = {
  type: "exhausted"
  jobId: string
  attempts: number
  totalAttempts: number
}

type WorkerCancelledMessage = {
  type: "cancelled"
  jobId: string
  attempts: number
}

type WorkerErrorMessage = {
  type: "error"
  jobId: string
  error: string
}

type WorkerOutgoingMessage =
  | WorkerProgressMessage
  | WorkerSuccessMessage
  | WorkerExhaustedMessage
  | WorkerCancelledMessage
  | WorkerErrorMessage

type BruteToggles = {
  lowercase: boolean
  uppercase: boolean
  digits: boolean
  special: boolean
}

const LOWERCASE_CHARS = "abcdefghijklmnopqrstuvwxyz"
const UPPERCASE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
const DIGIT_CHARS = "0123456789"
const SPECIAL_CHARS = "!@#$%^&*()-_=+[]{};:'\",.<>/?\\|`~"

let pdfJsModulePromise: Promise<PdfJsModule> | null = null

const getPdfJs = async () => {
  if (!pdfJsModulePromise) {
    pdfJsModulePromise = import("pdfjs-dist/legacy/build/pdf.mjs").then((pdfjs) => {
      if (!pdfjs.GlobalWorkerOptions.workerSrc) {
        pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.js"
      }
      return pdfjs
    })
  }
  return pdfJsModulePromise
}

const isPdfFile = (file: File) =>
  file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")

const formatBytes = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`
  const kb = bytes / 1024
  if (kb < 1024) return `${kb.toFixed(1)} KB`
  const mb = kb / 1024
  if (mb < 1024) return `${mb.toFixed(2)} MB`
  const gb = mb / 1024
  return `${gb.toFixed(2)} GB`
}

const formatEta = (seconds: number | null) => {
  if (seconds === null || !Number.isFinite(seconds)) {
    return "Estimating..."
  }

  const safe = Math.max(0, Math.floor(seconds))
  const hours = Math.floor(safe / 3600)
  const minutes = Math.floor((safe % 3600) / 60)
  const secs = safe % 60

  if (hours > 99) {
    return ">99h"
  }

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
}

const buildCharset = (toggles: BruteToggles) => {
  const parts: string[] = []
  if (toggles.lowercase) parts.push(LOWERCASE_CHARS)
  if (toggles.uppercase) parts.push(UPPERCASE_CHARS)
  if (toggles.digits) parts.push(DIGIT_CHARS)
  if (toggles.special) parts.push(SPECIAL_CHARS)
  return parts.join("")
}

const getTotalAttempts = (charsetLength: number, maxLength: number) => {
  let total = 0
  for (let length = 1; length <= maxLength; length += 1) {
    total += charsetLength ** length
  }
  return total
}

const numberFormatter = new Intl.NumberFormat()

export default function PasswordBreakerTool() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const workerRef = useRef<Worker | null>(null)
  const activeJobIdRef = useRef<string | null>(null)
  const activeModeRef = useRef<UnlockMode>("known")

  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [pageCount, setPageCount] = useState<number | null>(null)
  const [requiresPassword, setRequiresPassword] = useState<boolean | null>(null)

  const [mode, setMode] = useState<UnlockMode>("known")
  const [knownPassword, setKnownPassword] = useState("")
  const [maxLength, setMaxLength] = useState(3)
  const [toggles, setToggles] = useState<BruteToggles>({
    lowercase: true,
    uppercase: false,
    digits: true,
    special: false,
  })

  const [runState, setRunState] = useState<RunState>("idle")
  const [status, setStatus] = useState("Upload a password-protected PDF to begin.")
  const [attempts, setAttempts] = useState(0)
  const [totalAttempts, setTotalAttempts] = useState(0)
  const [attemptsPerSecond, setAttemptsPerSecond] = useState(0)
  const [etaSeconds, setEtaSeconds] = useState<number | null>(null)
  const [currentAttempt, setCurrentAttempt] = useState("")

  const [foundPassword, setFoundPassword] = useState("")
  const [unlockedUrl, setUnlockedUrl] = useState<string | null>(null)
  const [unlockedName, setUnlockedName] = useState("unlocked.pdf")

  const charset = useMemo(() => buildCharset(toggles), [toggles])
  const plannedAttempts = useMemo(
    () => getTotalAttempts(charset.length, maxLength),
    [charset.length, maxLength]
  )

  const progressValue = useMemo(() => {
    if (totalAttempts <= 0) return 0
    return Math.min(100, Math.round((attempts / totalAttempts) * 100))
  }, [attempts, totalAttempts])

  const revokeOutput = useCallback(() => {
    if (unlockedUrl) {
      URL.revokeObjectURL(unlockedUrl)
    }
    setUnlockedUrl(null)
  }, [unlockedUrl])

  const resetRunState = useCallback(() => {
    setRunState("idle")
    setStatus("Ready.")
    setAttempts(0)
    setTotalAttempts(0)
    setAttemptsPerSecond(0)
    setEtaSeconds(null)
    setCurrentAttempt("")
    setFoundPassword("")
  }, [])

  const ensureWorker = useCallback(() => {
    if (!workerRef.current) {
      const worker = new Worker(new URL("../../workers/password-breaker.worker.ts", import.meta.url), {
        type: "module",
      })

      worker.addEventListener("message", (event: MessageEvent<WorkerOutgoingMessage>) => {
        const message = event.data
        if (!message || !("jobId" in message) || message.jobId !== activeJobIdRef.current) {
          return
        }

        if (message.type === "progress") {
          setAttempts(message.attempts)
          setTotalAttempts(message.totalAttempts)
          setCurrentAttempt(message.currentAttempt)
          setAttemptsPerSecond(message.attemptsPerSecond)
          setEtaSeconds(message.etaSeconds)
          setStatus("Trying passwords locally in browser worker.")
          return
        }

        if (message.type === "success") {
          revokeOutput()
          const blob = new Blob([message.unlockedPdfBytes], { type: "application/pdf" })
          const outputUrl = URL.createObjectURL(blob)

          setUnlockedUrl(outputUrl)
          setUnlockedName(
            file ? `${file.name.replace(/\.pdf$/i, "")}-unlocked.pdf` : "unlocked.pdf"
          )
          setFoundPassword(message.password)
          setAttempts(message.attempts)
          setRunState("found")
          setStatus("Password recovered. Download your unlocked PDF.")
          toast.success("Password recovered and PDF unlocked.")
          return
        }

        if (message.type === "exhausted") {
          setAttempts(message.attempts)
          setTotalAttempts(message.totalAttempts)
          setRunState("exhausted")
          setStatus(
            activeModeRef.current === "brute"
              ? "Password not found within the defined bounds."
              : "The supplied password was not correct."
          )
          if (activeModeRef.current === "brute") {
            toast.error("Password not found within the defined bounds.")
          } else {
            toast.error("Invalid password.")
          }
          return
        }

        if (message.type === "cancelled") {
          setAttempts(message.attempts)
          setRunState("cancelled")
          setStatus("Password recovery cancelled.")
          toast.message("Recovery cancelled.")
          return
        }

        if (message.type === "error") {
          setRunState("error")
          setStatus("Recovery failed.")
          toast.error(message.error)
        }
      })

      worker.addEventListener("error", (event) => {
        setRunState("error")
        setStatus("Worker crashed.")
        toast.error(event.message || "Password recovery worker crashed.")
      })

      workerRef.current = worker
    }

    return workerRef.current
  }, [file, revokeOutput])

  useEffect(() => {
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate()
        workerRef.current = null
      }
      if (unlockedUrl) {
        URL.revokeObjectURL(unlockedUrl)
      }
    }
  }, [unlockedUrl])

  const inspectPdf = useCallback(async (incomingFile: File) => {
    const pdfjs = await getPdfJs()
    const loadingTask = pdfjs.getDocument({
      data: new Uint8Array(await incomingFile.arrayBuffer()),
      disableAutoFetch: true,
      disableRange: true,
      disableStream: true,
    })

    try {
      const opened = await loadingTask.promise
      setPageCount(opened.numPages)
      setRequiresPassword(false)
      setStatus("PDF opened without a password. You can still run recovery if needed.")
      await opened.destroy()
    } catch (error) {
      const passwordError = error as Error & { code?: number }
      if (
        error instanceof Error &&
        error.name === "PasswordException" &&
        typeof passwordError.code === "number" &&
        (passwordError.code === pdfjs.PasswordResponses.INCORRECT_PASSWORD ||
          passwordError.code === pdfjs.PasswordResponses.NEED_PASSWORD)
      ) {
        setPageCount(null)
        setRequiresPassword(true)
        setStatus("Password-protected PDF detected. Ready to recover.")
      } else {
        throw error
      }
    } finally {
      await loadingTask.destroy()
    }
  }, [])

  const handleIncomingFile = useCallback(
    async (incomingFile: File) => {
      if (!isPdfFile(incomingFile)) {
        toast.error("Only PDF files are supported.")
        return
      }

      setFile(incomingFile)
      setKnownPassword("")
      setPageCount(null)
      setRequiresPassword(null)
      revokeOutput()
      resetRunState()
      setStatus("Inspecting PDF...")

      try {
        await inspectPdf(incomingFile)
        toast.success("PDF loaded.")
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Could not inspect this PDF file."
        setStatus("Could not inspect PDF.")
        toast.error(message)
      }
    },
    [inspectPdf, resetRunState, revokeOutput]
  )

  const startKnownMode = useCallback(async () => {
    if (!file) {
      toast.error("Upload a PDF first.")
      return
    }

    const candidate = knownPassword.trim()
    if (!candidate) {
      toast.error("Enter the known password.")
      return
    }

    revokeOutput()
    setFoundPassword("")
    setRunState("running")
    setStatus("Trying the supplied password...")
    setAttempts(0)
    setTotalAttempts(1)
    setAttemptsPerSecond(0)
    setEtaSeconds(null)
    setCurrentAttempt("")

    const jobId = crypto.randomUUID()
    activeJobIdRef.current = jobId
    activeModeRef.current = "known"

    const worker = ensureWorker()
    const pdfBytes = await file.arrayBuffer()
    worker.postMessage(
      {
        type: "start-known",
        jobId,
        pdfBytes,
        password: candidate,
      },
      [pdfBytes]
    )
  }, [ensureWorker, file, knownPassword, revokeOutput])

  const startBruteForceMode = useCallback(async () => {
    if (!file) {
      toast.error("Upload a PDF first.")
      return
    }

    if (!charset.length) {
      toast.error("Select at least one character set.")
      return
    }

    revokeOutput()
    setFoundPassword("")
    setRunState("running")
    setStatus("Starting bounded brute-force in local worker...")
    setAttempts(0)
    setTotalAttempts(plannedAttempts)
    setAttemptsPerSecond(0)
    setEtaSeconds(null)
    setCurrentAttempt("")

    const jobId = crypto.randomUUID()
    activeJobIdRef.current = jobId
    activeModeRef.current = "brute"

    const worker = ensureWorker()
    const pdfBytes = await file.arrayBuffer()
    worker.postMessage(
      {
        type: "start-brute",
        jobId,
        pdfBytes,
        charset,
        maxLength,
      },
      [pdfBytes]
    )
  }, [charset, ensureWorker, file, maxLength, plannedAttempts, revokeOutput])

  const pauseJob = useCallback(() => {
    const jobId = activeJobIdRef.current
    if (!jobId || !workerRef.current) return
    workerRef.current.postMessage({ type: "pause", jobId })
    setRunState("paused")
    setStatus("Paused.")
  }, [])

  const resumeJob = useCallback(() => {
    const jobId = activeJobIdRef.current
    if (!jobId || !workerRef.current) return
    workerRef.current.postMessage({ type: "resume", jobId })
    setRunState("running")
    setStatus("Resumed.")
  }, [])

  const cancelJob = useCallback(() => {
    const jobId = activeJobIdRef.current
    if (!jobId || !workerRef.current) return
    workerRef.current.postMessage({ type: "cancel", jobId })
  }, [])

  const runAction = useCallback(async () => {
    if (mode === "known") {
      await startKnownMode()
      return
    }
    await startBruteForceMode()
  }, [mode, startBruteForceMode, startKnownMode])

  const canStart =
    !!file &&
    (mode === "known" ? knownPassword.trim().length > 0 : charset.length > 0) &&
    runState !== "running" &&
    runState !== "paused"

  return (
    <div className="space-y-6 overflow-x-hidden">
      <Toaster richColors position="top-right" />

      <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-100">
        <p className="font-medium">Use Responsibly</p>
        <p className="mt-1">
          This tool is intended for recovering passwords from your own documents. Do not use it on documents you do not own.
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={(event) => {
          const selected = event.target.files?.[0]
          if (selected) {
            void handleIncomingFile(selected)
          }
          event.currentTarget.value = ""
        }}
      />

      <Card>
        <CardContent className="pt-6">
          <div
            role="button"
            tabIndex={0}
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault()
                fileInputRef.current?.click()
              }
            }}
            onDragOver={(event) => {
              event.preventDefault()
              setIsDragging(true)
            }}
            onDragLeave={(event) => {
              event.preventDefault()
              setIsDragging(false)
            }}
            onDrop={(event) => {
              event.preventDefault()
              setIsDragging(false)
              const dropped = event.dataTransfer.files[0]
              if (dropped) {
                void handleIncomingFile(dropped)
              }
            }}
            className={`cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition-colors sm:p-10 ${
              isDragging
                ? "border-primary bg-primary/10"
                : "border-border bg-muted/20 hover:border-primary/70"
            }`}
          >
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <UploadCloud className="h-6 w-6 text-primary" />
            </div>
            <p className="text-sm font-medium text-foreground">Drop a password-protected PDF here, or click to browse</p>
            <p className="mt-1 text-xs text-muted-foreground">100% client-side. Zero uploads.</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Plain Password Breaker</CardTitle>
          <CardDescription className="break-words">{status}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {file ? (
            <div className="flex flex-col gap-3 rounded-lg border bg-muted/30 p-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">{file.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {formatBytes(file.size)}
                  {pageCount !== null ? ` • ${pageCount} page${pageCount === 1 ? "" : "s"}` : ""}
                  {requiresPassword === true ? " • Password required" : ""}
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                className="w-full sm:w-auto"
                onClick={() => {
                  if (runState === "running" || runState === "paused") {
                    cancelJob()
                  }
                  setFile(null)
                  setPageCount(null)
                  setRequiresPassword(null)
                  setKnownPassword("")
                  revokeOutput()
                  resetRunState()
                  setStatus("Upload a password-protected PDF to begin.")
                }}
              >
                <Trash2 className="h-4 w-4" />
                Remove
              </Button>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No PDF selected yet.</p>
          )}

          <Tabs value={mode} onValueChange={(value) => setMode(value as UnlockMode)}>
            <TabsList className="grid h-auto w-full grid-cols-1 sm:grid-cols-2">
              <TabsTrigger value="known" className="h-10">
                <KeyRound className="h-4 w-4" />
                Known Password
              </TabsTrigger>
              <TabsTrigger value="brute" className="h-10">
                <ShieldAlert className="h-4 w-4" />
                Bounded Brute-Force
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {mode === "known" ? (
            <div className="space-y-2">
              <Label htmlFor="known-password">Password</Label>
              <Input
                id="known-password"
                type="password"
                value={knownPassword}
                onChange={(event) => setKnownPassword(event.target.value)}
                placeholder="Enter known PDF password"
                disabled={runState === "running" || runState === "paused"}
              />
            </div>
          ) : (
            <div className="space-y-4 rounded-lg border p-4">
              <div className="grid gap-2 sm:grid-cols-2">
                <label className="flex min-h-11 items-center gap-3 rounded-md border px-3 py-2 text-sm">
                  <Checkbox
                    checked={toggles.lowercase}
                    onCheckedChange={(checked) =>
                      setToggles((prev) => ({ ...prev, lowercase: checked === true }))
                    }
                    disabled={runState === "running" || runState === "paused"}
                  />
                  Lowercase (a-z)
                </label>
                <label className="flex min-h-11 items-center gap-3 rounded-md border px-3 py-2 text-sm">
                  <Checkbox
                    checked={toggles.uppercase}
                    onCheckedChange={(checked) =>
                      setToggles((prev) => ({ ...prev, uppercase: checked === true }))
                    }
                    disabled={runState === "running" || runState === "paused"}
                  />
                  Uppercase (A-Z)
                </label>
                <label className="flex min-h-11 items-center gap-3 rounded-md border px-3 py-2 text-sm">
                  <Checkbox
                    checked={toggles.digits}
                    onCheckedChange={(checked) =>
                      setToggles((prev) => ({ ...prev, digits: checked === true }))
                    }
                    disabled={runState === "running" || runState === "paused"}
                  />
                  Digits (0-9)
                </label>
                <label className="flex min-h-11 items-center gap-3 rounded-md border px-3 py-2 text-sm">
                  <Checkbox
                    checked={toggles.special}
                    onCheckedChange={(checked) =>
                      setToggles((prev) => ({ ...prev, special: checked === true }))
                    }
                    disabled={runState === "running" || runState === "paused"}
                  />
                  Special chars
                </label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="max-length">Maximum password length (1-6)</Label>
                <select
                  id="max-length"
                  value={maxLength}
                  onChange={(event) => setMaxLength(Math.max(1, Math.min(6, Number(event.target.value) || 1)))}
                  className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                  disabled={runState === "running" || runState === "paused"}
                >
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                  <option value={5}>5</option>
                  <option value={6}>6</option>
                </select>
              </div>

              <div className="rounded-md border bg-muted/30 p-3 text-xs text-muted-foreground">
                Charset size: {charset.length} characters
                <br />
                Total combinations: {numberFormatter.format(plannedAttempts)}
              </div>
            </div>
          )}

          {(runState !== "idle" || attempts > 0) && (
            <div className="space-y-3 rounded-lg border p-4">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                <span>{numberFormatter.format(attempts)} / {numberFormatter.format(totalAttempts)} attempts</span>
                <span>{progressValue}%</span>
              </div>
              <Progress value={progressValue} className="h-2 w-full" />
              <div className="grid gap-2 text-xs text-muted-foreground sm:grid-cols-2">
                <p className="min-w-0 truncate">Current: {currentAttempt || "-"}</p>
                <p>Attempts/s: {attemptsPerSecond.toFixed(1)}</p>
                <p>ETA: {formatEta(etaSeconds)}</p>
                <p>Status: {runState}</p>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <Button
            type="button"
            className="w-full sm:w-auto"
            onClick={() => void runAction()}
            disabled={!canStart}
          >
            {runState === "running" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Running...
              </>
            ) : mode === "known" ? (
              "Unlock with Password"
            ) : (
              "Start Brute-Force"
            )}
          </Button>

          {runState === "running" ? (
            <Button type="button" variant="outline" className="w-full sm:w-auto" onClick={pauseJob}>
              <Pause className="h-4 w-4" />
              Pause
            </Button>
          ) : null}

          {runState === "paused" ? (
            <Button type="button" variant="outline" className="w-full sm:w-auto" onClick={resumeJob}>
              <Play className="h-4 w-4" />
              Resume
            </Button>
          ) : null}

          {(runState === "running" || runState === "paused") ? (
            <Button type="button" variant="destructive" className="w-full sm:w-auto" onClick={cancelJob}>
              <XCircle className="h-4 w-4" />
              Cancel
            </Button>
          ) : null}
        </CardFooter>
      </Card>

      {unlockedUrl ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Unlocked PDF Ready</CardTitle>
            <CardDescription>
              Password found: <span className="font-medium text-foreground">{foundPassword || "(known password)"}</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full sm:w-auto">
              <a href={unlockedUrl} download={unlockedName}>
                <Download className="h-4 w-4" />
                Download Unlocked PDF
              </a>
            </Button>
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}
