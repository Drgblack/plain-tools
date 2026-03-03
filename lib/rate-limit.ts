import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"
import { NextRequest } from "next/server"

const REQUEST_LIMIT = 10
const WINDOW_MS = 60_000

export const RATE_LIMIT_ERROR_MESSAGE = "Rate limit exceeded. Try again shortly."

type RateLimitResult = { success: true } | { success: false; retryAfter: number }

type MemoryBucket = {
  count: number
  resetAt: number
}

const memoryBuckets = new Map<string, MemoryBucket>()
let cachedLimiter: Ratelimit | null | undefined

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

const getUpstashLimiter = () => {
  if (cachedLimiter !== undefined) {
    return cachedLimiter
  }

  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) {
    cachedLimiter = null
    return cachedLimiter
  }

  const redis = new Redis({ url, token })
  cachedLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(REQUEST_LIMIT, "60 s"),
    analytics: false,
    prefix: "plain-tools:api",
  })

  return cachedLimiter
}

const cleanupMemoryBuckets = (now: number) => {
  if (memoryBuckets.size < 200) return
  for (const [key, bucket] of memoryBuckets.entries()) {
    if (bucket.resetAt <= now) {
      memoryBuckets.delete(key)
    }
  }
}

const checkInMemoryLimit = (key: string): RateLimitResult => {
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
    return { success: false, retryAfter }
  }

  bucket.count += 1
  return { success: true }
}

export async function enforceRateLimit(
  request: NextRequest,
  routeKey: string
): Promise<RateLimitResult> {
  const key = `${routeKey}:${getClientIp(request)}`
  const limiter = getUpstashLimiter()

  if (!limiter) {
    return checkInMemoryLimit(key)
  }

  try {
    const result = await limiter.limit(key)
    if (result.success) {
      return { success: true }
    }

    const retryAfter = Math.max(1, Math.ceil((result.reset - Date.now()) / 1000))
    return { success: false, retryAfter }
  } catch {
    return checkInMemoryLimit(key)
  }
}
