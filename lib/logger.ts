import "server-only"

type LoggerMetadata = Record<string, unknown>

type LogLevel = "error" | "warn"

type LogEntry = {
  timestamp: string
  level: LogLevel
  context: string
  metadata: LoggerMetadata
  errorMessage?: string
  message?: string
  stack?: string
}

const isProduction = process.env.NODE_ENV === "production"

const toErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message
  if (typeof error === "string") return error
  try {
    return JSON.stringify(error)
  } catch {
    return "Unknown error"
  }
}

const emitLog = (entry: LogEntry) => {
  const serialized = JSON.stringify(entry)

  // Production logs should go to stdout for Vercel log drains.
  if (isProduction) {
    process.stdout.write(`${serialized}\n`)
    return
  }

  if (entry.level === "error") {
    console.error(JSON.stringify(entry, null, 2))
    return
  }

  console.warn(JSON.stringify(entry, null, 2))
}

export const logger = {
  error(context: string, error: unknown, metadata: LoggerMetadata = {}): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: "error",
      context,
      errorMessage: toErrorMessage(error),
      metadata,
    }

    if (error instanceof Error && error.stack) {
      entry.stack = error.stack
    }

    emitLog(entry)
  },

  warn(context: string, message: string, metadata: LoggerMetadata = {}): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: "warn",
      context,
      message,
      metadata,
    }

    emitLog(entry)
  },
}
