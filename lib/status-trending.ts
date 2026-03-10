import "server-only"

import { Redis } from "@upstash/redis"

import {
  STATUS_TRENDING_DEFAULT,
} from "@/lib/status-domains"
import { normalizeSiteInput, statusPathFor } from "@/lib/site-status"
export {
  getStatusTrendingCategoryEntry,
  getStatusTrendingPopularSites,
  isStatusTrendingCategory,
  STATUS_TRENDING_CATEGORIES,
  type StatusTrendingCategory,
} from "@/lib/status-trending-config"
import { getStatusTrendingPopularSites } from "@/lib/status-trending-config"

export type TrendingCheck = {
  domain: string
  count: number
  day: string
}

export type TrendingStatusEntry = TrendingCheck & {
  href: string
}

export type StatusHistoryStatus = "up" | "down" | "unknown"

export type StatusHistoryPoint = {
  domain: string
  timestamp: string
  status: StatusHistoryStatus
  responseTimeMs?: number
}

export type StatusHistoryBlock = {
  bucketStart: string
  label: string
  status: StatusHistoryStatus
  responseTimeMs: number | null
  checkedAt: string | null
}

export type StatusHistorySummary = {
  domain: string
  hours: number
  blocks: StatusHistoryBlock[]
  recentChecks: StatusHistoryPoint[]
  lastUpdatedAt: string | null
}

type StatusObservabilityStoreKind = "memory" | "upstash"

type StatusObservabilityStore = {
  kind: StatusObservabilityStoreKind
  incrementTrend(domain: string, day: string): Promise<void>
  getTrendCounts(day: string): Promise<TrendingCheck[]>
  appendHistory(point: StatusHistoryPoint): Promise<void>
  getHistory(domain: string, sinceIso: string): Promise<StatusHistoryPoint[]>
}

type GetStatusTrendsOptions = {
  limit?: number
  day?: string
  segment?: StatusTrendSegment
}

type StatusTrendSegment = StatusTrendingCategory | "all"

type GetStatusHistoryOptions = {
  hours?: number
  recentLimit?: number
}

type StatusHistoryWindow = {
  domain: string
  hours: number
  points: StatusHistoryPoint[]
  startAt: string
}

const ONE_HOUR_MS = 60 * 60 * 1000
const TREND_DEBOUNCE_MS = 45_000
const MAX_TRACKED_DOMAINS = 5_000
const MAX_TREND_DAYS = 4
const MAX_HISTORY_POINTS_PER_DOMAIN = 320
const MAX_HISTORY_HOURS = 72
const DEFAULT_HISTORY_HOURS = 24
const DEFAULT_RECENT_LIMIT = 8
const DEFAULT_TREND_LIMIT = 10
const MAX_TREND_LIMIT = 100
const MAX_RECENT_LIMIT = 20
const OBSERVABILITY_PREFIX = "plain-tools:status-observability"

function toNumber(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) return value
  if (typeof value === "string") {
    const parsed = Number.parseInt(value, 10)
    return Number.isFinite(parsed) ? parsed : 0
  }
  return 0
}

function toIsoDay(inputDate: Date) {
  return inputDate.toISOString().slice(0, 10)
}

function normalizeTimestampToHour(date: Date) {
  const hour = new Date(date)
  hour.setUTCMinutes(0, 0, 0)
  return hour
}

function getIsoHourBucket(inputDate: Date) {
  return normalizeTimestampToHour(inputDate).toISOString().slice(0, 13)
}

function buildDefaultTrendCounts() {
  return new Map<string, number>(
    STATUS_TRENDING_DEFAULT.map((domain, index) => [domain, Math.max(5, 60 - index * 5)])
  )
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function statusFromRaw(value: unknown): StatusHistoryStatus {
  if (value === "up" || value === "down" || value === "unknown") return value
  return "unknown"
}

class InMemoryStatusObservabilityStore implements StatusObservabilityStore {
  readonly kind = "memory" as const

  private readonly trendCountsByDay = new Map<string, Map<string, number>>()
  private readonly lastTrendIncrementAt = new Map<string, number>()
  private readonly historyByDomain = new Map<string, StatusHistoryPoint[]>()

  constructor() {
    const today = toIsoDay(new Date())
    this.trendCountsByDay.set(today, buildDefaultTrendCounts())
  }

  private pruneOldDays() {
    if (this.trendCountsByDay.size <= MAX_TREND_DAYS) return

    const dayEntries = Array.from(this.trendCountsByDay.keys()).sort()
    while (dayEntries.length > MAX_TREND_DAYS) {
      const oldest = dayEntries.shift()
      if (!oldest) break
      this.trendCountsByDay.delete(oldest)
    }
  }

  private pruneOldHistory(domain: string, nowMs: number) {
    const history = this.historyByDomain.get(domain)
    if (!history || history.length === 0) return

    const minTimestamp = nowMs - MAX_HISTORY_HOURS * ONE_HOUR_MS
    const filtered = history
      .filter((point) => {
        const timestampMs = new Date(point.timestamp).getTime()
        return Number.isFinite(timestampMs) && timestampMs >= minTimestamp
      })
      .slice(-MAX_HISTORY_POINTS_PER_DOMAIN)

    this.historyByDomain.set(domain, filtered)
  }

  async incrementTrend(domain: string, day: string) {
    const now = Date.now()
    const lastIncrementAt = this.lastTrendIncrementAt.get(domain) ?? 0
    if (now - lastIncrementAt < TREND_DEBOUNCE_MS) {
      return
    }

    let counts = this.trendCountsByDay.get(day)
    if (!counts) {
      counts = new Map<string, number>()
      this.trendCountsByDay.set(day, counts)
    }

    if (!counts.has(domain) && counts.size >= MAX_TRACKED_DOMAINS) {
      return
    }

    counts.set(domain, (counts.get(domain) ?? 0) + 1)
    this.lastTrendIncrementAt.set(domain, now)
    this.pruneOldDays()
  }

  async getTrendCounts(day: string) {
    const counts = this.trendCountsByDay.get(day)
    if (!counts) return []

    return Array.from(counts.entries()).map(([domain, count]) => ({
      domain,
      count,
      day,
    }))
  }

  async appendHistory(point: StatusHistoryPoint) {
    const nowMs = Date.now()
    const history = this.historyByDomain.get(point.domain) ?? []
    history.push(point)
    this.historyByDomain.set(point.domain, history.slice(-MAX_HISTORY_POINTS_PER_DOMAIN))
    this.pruneOldHistory(point.domain, nowMs)
  }

  async getHistory(domain: string, sinceIso: string) {
    const since = new Date(sinceIso).getTime()
    const history = this.historyByDomain.get(domain) ?? []
    if (!Number.isFinite(since)) return [...history]

    return history.filter((point) => {
      const timestamp = new Date(point.timestamp).getTime()
      return Number.isFinite(timestamp) && timestamp >= since
    })
  }
}

class UpstashStatusObservabilityStore implements StatusObservabilityStore {
  readonly kind = "upstash" as const

  constructor(private readonly redis: Redis) {}

  private dayTrendKey(day: string) {
    return `${OBSERVABILITY_PREFIX}:trend:${day}`
  }

  private trendDebounceKey(domain: string) {
    return `${OBSERVABILITY_PREFIX}:trend:last:${domain}`
  }

  private historyKey(domain: string) {
    return `${OBSERVABILITY_PREFIX}:history:${domain}`
  }

  async incrementTrend(domain: string, day: string) {
    const now = Date.now()
    const debounceKey = this.trendDebounceKey(domain)

    const lastRaw = await this.redis.get<number | string | null>(debounceKey)
    const lastSeen = toNumber(lastRaw)
    if (lastSeen > 0 && now - lastSeen < TREND_DEBOUNCE_MS) {
      return
    }

    await this.redis.set(debounceKey, now)
    await this.redis.hincrby(this.dayTrendKey(day), domain, 1)
  }

  async getTrendCounts(day: string) {
    const raw = await this.redis.hgetall<Record<string, number | string>>(this.dayTrendKey(day))
    if (!raw) return []

    return Object.entries(raw).map(([domain, count]) => ({
      domain,
      count: toNumber(count),
      day,
    }))
  }

  async appendHistory(point: StatusHistoryPoint) {
    const key = this.historyKey(point.domain)
    await this.redis.lpush(key, JSON.stringify(point))
    await this.redis.ltrim(key, 0, MAX_HISTORY_POINTS_PER_DOMAIN - 1)
  }

  async getHistory(domain: string, sinceIso: string) {
    const since = new Date(sinceIso).getTime()
    const raw = (await this.redis.lrange(
      this.historyKey(domain),
      0,
      MAX_HISTORY_POINTS_PER_DOMAIN - 1
    )) as string[] | null

    if (!Array.isArray(raw)) return []

    const parsed = raw
      .map((value) => {
        try {
          return JSON.parse(value) as StatusHistoryPoint
        } catch {
          return null
        }
      })
      .filter((value): value is StatusHistoryPoint => Boolean(value))

    if (!Number.isFinite(since)) return parsed

    return parsed.filter((point) => {
      const timestamp = new Date(point.timestamp).getTime()
      return Number.isFinite(timestamp) && timestamp >= since
    })
  }
}

let cachedStore: StatusObservabilityStore | null = null

function getRedisClient() {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return null
  return new Redis({ url, token })
}

function getStore(): StatusObservabilityStore {
  if (cachedStore) return cachedStore

  const redis = getRedisClient()
  if (redis) {
    cachedStore = new UpstashStatusObservabilityStore(redis)
    return cachedStore
  }

  // Production note:
  // without UPSTASH_REDIS_REST_URL/TOKEN this falls back to process memory,
  // so counts/history reset on deployment restart or serverless cold starts.
  cachedStore = new InMemoryStatusObservabilityStore()
  return cachedStore
}

function applyTrendDefaults(entries: TrendingCheck[], day: string) {
  if (entries.length > 0) return entries

  const defaults = buildDefaultTrendCounts()
  return Array.from(defaults.entries()).map(([domain, count]) => ({
    domain,
    count,
    day,
  }))
}

function filterByTrendSegment(entries: TrendingCheck[], segment: StatusTrendSegment) {
  if (segment === "all") return entries
  const segmentDomains = getStatusTrendingPopularSites(segment, MAX_TRACKED_DOMAINS)
  if (!segmentDomains || segmentDomains.length === 0) return entries
  const allowed = new Set(segmentDomains)
  return entries.filter((entry) => allowed.has(entry.domain))
}

export function getStatusDayBucket(referenceDate = new Date()) {
  return toIsoDay(referenceDate)
}

export function getStatusHourBucket(referenceDate = new Date()) {
  return getIsoHourBucket(referenceDate)
}

export async function incrementStatusTrend(input: string) {
  const normalized = normalizeSiteInput(input)
  if (!normalized) return null

  await getStore().incrementTrend(normalized, getStatusDayBucket())
  return normalized
}

export async function recordStatusObservation(input: {
  domain: string
  status: StatusHistoryStatus
  responseTimeMs?: number | null
  checkedAt?: string
}) {
  const normalized = normalizeSiteInput(input.domain)
  if (!normalized) return null

  const timestamp = input.checkedAt ?? new Date().toISOString()
  const timestampDate = new Date(timestamp)
  const checkedAtDate = Number.isFinite(timestampDate.getTime())
    ? timestampDate
    : new Date()
  const status = statusFromRaw(input.status)

  await getStore().incrementTrend(normalized, getStatusDayBucket(checkedAtDate))
  await getStore().appendHistory({
    domain: normalized,
    timestamp: checkedAtDate.toISOString(),
    status,
    ...(typeof input.responseTimeMs === "number" && Number.isFinite(input.responseTimeMs)
      ? { responseTimeMs: Math.max(0, Math.round(input.responseTimeMs)) }
      : {}),
  })

  return normalized
}

export async function getStatusTrends(options: GetStatusTrendsOptions = {}) {
  const limit = clamp(
    Number.isFinite(options.limit) ? Number(options.limit) : DEFAULT_TREND_LIMIT,
    1,
    MAX_TREND_LIMIT
  )
  const day = options.day ?? getStatusDayBucket()
  const segment = options.segment ?? "all"

  const raw = await getStore().getTrendCounts(day)
  const withDefaults = applyTrendDefaults(raw, day)
  const segmented = filterByTrendSegment(withDefaults, segment)

  return segmented
    .sort((left, right) => {
      if (right.count !== left.count) return right.count - left.count
      return left.domain.localeCompare(right.domain)
    })
    .slice(0, limit)
    .map((entry) => ({
      ...entry,
      href: statusPathFor(entry.domain),
    })) satisfies TrendingStatusEntry[]
}

export async function getStatusHistoryWindow(
  domainInput: string,
  options: Pick<GetStatusHistoryOptions, "hours"> = {}
): Promise<StatusHistoryWindow | null> {
  const normalized = normalizeSiteInput(domainInput)
  if (!normalized) return null

  const hours = clamp(
    Number.isFinite(options.hours) ? Number(options.hours) : DEFAULT_HISTORY_HOURS,
    1,
    MAX_HISTORY_HOURS
  )

  const now = new Date()
  const start = new Date(now.getTime() - (hours - 1) * ONE_HOUR_MS)
  start.setUTCMinutes(0, 0, 0)

  const rawHistory = await getStore().getHistory(normalized, start.toISOString())
  const orderedHistory = rawHistory
    .filter((point) => Number.isFinite(new Date(point.timestamp).getTime()))
    .sort(
      (left, right) =>
        new Date(left.timestamp).getTime() - new Date(right.timestamp).getTime()
    )

  return {
    domain: normalized,
    hours,
    points: orderedHistory,
    startAt: start.toISOString(),
  }
}

export async function getStatusHistorySummary(
  domainInput: string,
  options: GetStatusHistoryOptions = {}
): Promise<StatusHistorySummary | null> {
  const window = await getStatusHistoryWindow(domainInput, { hours: options.hours })
  if (!window) return null

  const { domain: normalized, hours, points: orderedHistory, startAt } = window
  const recentLimit = clamp(
    Number.isFinite(options.recentLimit) ? Number(options.recentLimit) : DEFAULT_RECENT_LIMIT,
    1,
    MAX_RECENT_LIMIT
  )
  const start = new Date(startAt)

  const bucketMap = new Map<string, StatusHistoryPoint>()
  for (const point of orderedHistory) {
    const key = getStatusHourBucket(new Date(point.timestamp))
    bucketMap.set(key, point)
  }

  const blocks: StatusHistoryBlock[] = []
  for (let index = 0; index < hours; index += 1) {
    const bucketDate = new Date(start.getTime() + index * ONE_HOUR_MS)
    const key = getStatusHourBucket(bucketDate)
    const point = bucketMap.get(key)

    blocks.push({
      bucketStart: bucketDate.toISOString(),
      label: bucketDate.toISOString().slice(11, 16),
      status: point?.status ?? "unknown",
      responseTimeMs:
        typeof point?.responseTimeMs === "number" ? Math.round(point.responseTimeMs) : null,
      checkedAt: point?.timestamp ?? null,
    })
  }

  const recentChecks = [...orderedHistory].slice(-recentLimit).reverse()

  return {
    domain: normalized,
    hours,
    blocks,
    recentChecks,
    lastUpdatedAt: recentChecks[0]?.timestamp ?? null,
  }
}

export function getStatusObservabilityStorageInfo() {
  const store = getStore()
  return {
    kind: store.kind,
    persistence:
      store.kind === "upstash"
        ? "Upstash Redis (anonymous aggregate status data)"
        : "In-memory fallback (development/runtime only)",
  }
}
