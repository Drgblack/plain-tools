"use client"

export type AiUsageSnapshot = {
  used: number
  limit: number
  resetDate: string
}

const SESSION_KEY = "plain.ai.usage.v1"

const isValidUsage = (value: unknown): value is AiUsageSnapshot => {
  if (!value || typeof value !== "object") return false
  const candidate = value as Partial<AiUsageSnapshot>
  return (
    typeof candidate.used === "number" &&
    Number.isFinite(candidate.used) &&
    typeof candidate.limit === "number" &&
    Number.isFinite(candidate.limit) &&
    typeof candidate.resetDate === "string" &&
    candidate.resetDate.length > 0
  )
}

const readCachedUsage = (): AiUsageSnapshot | null => {
  if (typeof window === "undefined") {
    return null
  }

  try {
    const raw = window.sessionStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as unknown
    return isValidUsage(parsed) ? parsed : null
  } catch {
    return null
  }
}

const writeCachedUsage = (value: AiUsageSnapshot) => {
  if (typeof window === "undefined") {
    return
  }

  try {
    window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(value))
  } catch {
    // Ignore cache write failures.
  }
}

export const consumeAiUsage = (value: AiUsageSnapshot | null): AiUsageSnapshot | null => {
  if (!value) return value
  const next: AiUsageSnapshot = {
    ...value,
    used: Math.min(value.limit, value.used + 1),
  }
  writeCachedUsage(next)
  return next
}

export const exhaustAiUsage = (value: AiUsageSnapshot | null): AiUsageSnapshot | null => {
  if (!value) return value
  const next: AiUsageSnapshot = {
    ...value,
    used: value.limit,
  }
  writeCachedUsage(next)
  return next
}

export const fetchAiUsageSnapshot = async (force = false): Promise<AiUsageSnapshot | null> => {
  if (!force) {
    const cached = readCachedUsage()
    if (cached) {
      return cached
    }
  }

  try {
    const response = await fetch("/api/ai/usage", {
      method: "GET",
      cache: "no-store",
    })
    if (!response.ok) {
      return null
    }

    const payload = (await response.json().catch(() => null)) as
      | { used?: number; limit?: number; reset_date?: string }
      | null

    if (
      typeof payload?.used !== "number" ||
      typeof payload?.limit !== "number" ||
      typeof payload?.reset_date !== "string"
    ) {
      return null
    }

    const snapshot: AiUsageSnapshot = {
      used: payload.used,
      limit: payload.limit,
      resetDate: payload.reset_date,
    }
    writeCachedUsage(snapshot)
    return snapshot
  } catch {
    return null
  }
}
