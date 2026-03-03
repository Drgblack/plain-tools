import "server-only"

import { createHash } from "node:crypto"
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"
import { NextRequest } from "next/server"

import { logger } from "@/lib/logger"
import { isPro } from "@/lib/subscription"

const REQUEST_LIMIT = 10
const WINDOW_MS = 60_000
const AI_MONTHLY_LIMIT = 5
const AI_MEMORY_FALLBACK_WINDOW_MS = 24 * 60 * 60 * 1000

export const RATE_LIMIT_ERROR_MESSAGE = "Rate limit exceeded. Try again shortly."
export const AI_MONTHLY_LIMIT_ERROR = "monthly_ai_limit_reached"
export const AI_MONTHLY_LIMIT_MESSAGE = "You've used your 5 free AI requests this month."
export const AI_MONTHLY_LIMIT_UPGRADE_URL = "https://plain.tools/pricing"

type RateLimitResult = { success: true } | { success: false; retryAfter: number }
type AiProvider = "upstash" | "memory"

type AiUsage = {
  used: number
  limit: number
  remaining: number
  resetDate: string
  provider: AiProvider
}

type AiMonthlyLimitResult =
  | (AiUsage & { success: true })
  | (AiUsage & {
      success: false
      retryAfter: number
      error: typeof AI_MONTHLY_LIMIT_ERROR
      message: string
      upgradeUrl: string
    })

type MemoryBucket = {
  count: number
  resetAt: number
}

const memoryBuckets = new Map<string, MemoryBucket>()
const aiMemoryBuckets = new Map<string, MemoryBucket>()
let cachedLimiter: Ratelimit | null | undefined
let cachedRedis: Redis | null | undefined

const getClientIp = (request: NextRequest) => {
  const forwardedFor = request.headers.get("x-forwarded-for")
  if (forwardedFor) {
    const first = forwardedFor.split(",")[0]?.trim()
    if (first) return first
  }

  const realIp = request.headers.get("x-real-ip")
  if (realIp) return realIp

  const cfIp = request.headers.get("cf-connecting-ip")
  if (cfIp) return cfIp

  return "unknown"
}

const hashIp = (ip: string) => createHash("sha256").update(ip).digest("hex").slice(0, 16)

const getUpstashRedis = () => {
  if (cachedRedis !== undefined) {
    return cachedRedis
  }

  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) {
    cachedRedis = null
    return cachedRedis
  }

  cachedRedis = new Redis({ url, token })
  return cachedRedis
}

const getUpstashLimiter = () => {
  if (cachedLimiter !== undefined) {
    return cachedLimiter
  }

  const redis = getUpstashRedis()
  if (!redis) {
    cachedLimiter = null
    return cachedLimiter
  }

  cachedLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(REQUEST_LIMIT, "60 s"),
    analytics: false,
    prefix: "plain-tools:api",
  })

  return cachedLimiter
}

const cleanupMemoryBuckets = (now: number) => {
  if (memoryBuckets.size < 200 && aiMemoryBuckets.size < 200) return
  for (const [key, bucket] of [...memoryBuckets.entries(), ...aiMemoryBuckets.entries()]) {
    if (bucket.resetAt <= now) {
      if (memoryBuckets.has(key)) {
        memoryBuckets.delete(key)
      }
      if (aiMemoryBuckets.has(key)) {
        aiMemoryBuckets.delete(key)
      }
    }
  }
}

const checkInMemoryLimit = (
  key: string,
  routeKey: string,
  ipHash: string
): RateLimitResult => {
  const now = Date.now()
  cleanupMemoryBuckets(now)

  const bucket = memoryBuckets.get(key)
  if (!bucket || bucket.resetAt <= now) {
    memoryBuckets.set(key, {
      count: 1,
      resetAt: now + WINDOW_MS,
    })
    return { success: true }
  }

  if (bucket.count >= REQUEST_LIMIT) {
    const retryAfter = Math.max(1, Math.ceil((bucket.resetAt - now) / 1000))
    logger.warn("rate_limit.exceeded", "Rate limit exceeded", {
      routeKey,
      ipHash,
      provider: "memory",
      retryAfter,
    })
    return { success: false, retryAfter }
  }

  bucket.count += 1
  return { success: true }
}

const formatDate = (date: Date) => date.toISOString().slice(0, 10)

const getMonthlyWindow = (now = new Date()) => {
  const year = now.getUTCFullYear()
  const month = now.getUTCMonth()
  const monthKey = `${year}-${String(month + 1).padStart(2, "0")}`
  const resetAt = new Date(Date.UTC(year, month + 1, 1))
  return {
    monthKey,
    resetAtMs: resetAt.getTime(),
    resetDate: formatDate(resetAt),
  }
}

const buildAiUsage = (
  used: number,
  resetDate: string,
  provider: AiProvider
): AiUsage => ({
  used,
  limit: AI_MONTHLY_LIMIT,
  remaining: Math.max(0, AI_MONTHLY_LIMIT - used),
  resetDate,
  provider,
})

const buildAiLimitExceeded = (
  usage: AiUsage,
  retryAfter: number
): AiMonthlyLimitResult => ({
  ...usage,
  success: false,
  retryAfter,
  error: AI_MONTHLY_LIMIT_ERROR,
  message: AI_MONTHLY_LIMIT_MESSAGE,
  upgradeUrl: AI_MONTHLY_LIMIT_UPGRADE_URL,
})

const getAiFallbackKey = (ipHash: string) => `ai-monthly:${ipHash}`

const getAiUsageFromMemory = (ipHash: string): AiUsage => {
  const now = Date.now()
  cleanupMemoryBuckets(now)

  const key = getAiFallbackKey(ipHash)
  const bucket = aiMemoryBuckets.get(key)
  if (!bucket || bucket.resetAt <= now) {
    const resetAt = now + AI_MEMORY_FALLBACK_WINDOW_MS
    return buildAiUsage(0, formatDate(new Date(resetAt)), "memory")
  }

  return buildAiUsage(bucket.count, formatDate(new Date(bucket.resetAt)), "memory")
}

const incrementAiUsageInMemory = (
  ipHash: string,
  routeKey: string
): AiMonthlyLimitResult => {
  const now = Date.now()
  cleanupMemoryBuckets(now)

  const key = getAiFallbackKey(ipHash)
  const existing = aiMemoryBuckets.get(key)
  const shouldReset = !existing || existing.resetAt <= now

  const bucket = shouldReset
    ? {
        count: 0,
        resetAt: now + AI_MEMORY_FALLBACK_WINDOW_MS,
      }
    : existing

  bucket.count += 1
  aiMemoryBuckets.set(key, bucket)

  const usage = buildAiUsage(bucket.count, formatDate(new Date(bucket.resetAt)), "memory")
  if (usage.used <= AI_MONTHLY_LIMIT) {
    return { success: true, ...usage }
  }

  const retryAfter = Math.max(1, Math.ceil((bucket.resetAt - now) / 1000))
  logger.warn("rate_limit.ai_monthly_exceeded", "AI monthly limit exceeded", {
    routeKey,
    ipHash,
    provider: "memory",
    retryAfter,
    resetDate: usage.resetDate,
  })
  return buildAiLimitExceeded(usage, retryAfter)
}

const getAiMonthlyRedisKey = (ipHash: string, monthKey: string) =>
  `ai-monthly:${ipHash}:${monthKey}`

export async function enforceRateLimit(
  request: NextRequest,
  routeKey: string
): Promise<RateLimitResult> {
  const clientIp = getClientIp(request)
  const ipHash = hashIp(clientIp)
  const key = `${routeKey}:${clientIp}`
  const limiter = getUpstashLimiter()

  if (!limiter) {
    return checkInMemoryLimit(key, routeKey, ipHash)
  }

  try {
    const result = await limiter.limit(key)
    if (result.success) {
      return { success: true }
    }

    const retryAfter = Math.max(1, Math.ceil((result.reset - Date.now()) / 1000))
    logger.warn("rate_limit.exceeded", "Rate limit exceeded", {
      routeKey,
      ipHash,
      provider: "upstash",
      retryAfter,
    })
    return { success: false, retryAfter }
  } catch {
    return checkInMemoryLimit(key, routeKey, ipHash)
  }
}

export async function getAiUsage(
  request: NextRequest,
  userId?: string | null
): Promise<AiUsage> {
  if (userId) {
    try {
      const pro = await isPro(userId)
      if (pro) {
        const monthlyWindow = getMonthlyWindow()
        return buildAiUsage(0, monthlyWindow.resetDate, "upstash")
      }
    } catch {
      logger.warn("rate_limit.ai_pro_check_failed", "Failed to verify Pro status", {
        routeKey: "api:ai:usage",
      })
    }
  }

  const clientIp = getClientIp(request)
  const ipHash = hashIp(clientIp)
  const monthlyWindow = getMonthlyWindow()
  const redis = getUpstashRedis()

  if (!redis) {
    return getAiUsageFromMemory(ipHash)
  }

  try {
    const key = getAiMonthlyRedisKey(ipHash, monthlyWindow.monthKey)
    const raw = await redis.get<number | string | null>(key)
    const parsed =
      typeof raw === "number" ? raw : typeof raw === "string" ? Number.parseInt(raw, 10) : 0
    const used = Number.isFinite(parsed) && parsed > 0 ? parsed : 0
    return buildAiUsage(used, monthlyWindow.resetDate, "upstash")
  } catch {
    return getAiUsageFromMemory(ipHash)
  }
}

export async function enforceAiMonthlyLimit(
  request: NextRequest,
  routeKey: string,
  userId?: string | null
): Promise<AiMonthlyLimitResult> {
  if (userId) {
    try {
      const pro = await isPro(userId)
      if (pro) {
        const monthlyWindow = getMonthlyWindow()
        return {
          success: true,
          ...buildAiUsage(0, monthlyWindow.resetDate, "upstash"),
        }
      }
    } catch {
      // Fall back to free-tier limiter path.
    }
  }

  const clientIp = getClientIp(request)
  const ipHash = hashIp(clientIp)
  const monthlyWindow = getMonthlyWindow()
  const redis = getUpstashRedis()

  if (!redis) {
    return incrementAiUsageInMemory(ipHash, routeKey)
  }

  try {
    const key = getAiMonthlyRedisKey(ipHash, monthlyWindow.monthKey)
    const used = await redis.incr(key)
    if (used === 1) {
      await redis.expireat(key, Math.ceil(monthlyWindow.resetAtMs / 1000))
    }

    const usage = buildAiUsage(used, monthlyWindow.resetDate, "upstash")
    if (used <= AI_MONTHLY_LIMIT) {
      return { success: true, ...usage }
    }

    const retryAfter = Math.max(1, Math.ceil((monthlyWindow.resetAtMs - Date.now()) / 1000))
    logger.warn("rate_limit.ai_monthly_exceeded", "AI monthly limit exceeded", {
      routeKey,
      ipHash,
      provider: "upstash",
      retryAfter,
      resetDate: usage.resetDate,
    })
    return buildAiLimitExceeded(usage, retryAfter)
  } catch {
    return incrementAiUsageInMemory(ipHash, routeKey)
  }
}
