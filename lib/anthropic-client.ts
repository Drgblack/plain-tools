import "server-only"

import Anthropic, { APIError, RateLimitError } from "@anthropic-ai/sdk"

const DEFAULT_MODEL = process.env.ANTHROPIC_MODEL || "claude-3-5-sonnet-latest"
const MAX_RETRIES = 3

const getClient = () => {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY is not configured.")
  }

  return new Anthropic({ apiKey })
}

const sleep = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms)
  })

const getRetryDelayMs = (attempt: number, error: unknown) => {
  if (error instanceof APIError) {
    const retryAfter = error.headers?.get("retry-after")
    if (retryAfter) {
      const retryAfterSeconds = Number(retryAfter)
      if (Number.isFinite(retryAfterSeconds) && retryAfterSeconds > 0) {
        return Math.ceil(retryAfterSeconds * 1000)
      }
    }
  }

  return Math.min(10_000, 1_000 * 2 ** attempt)
}

const extractTextFromResponse = (
  response: Awaited<ReturnType<Anthropic["messages"]["create"]>>
) => {
  if (!("content" in response) || !Array.isArray(response.content)) {
    return ""
  }

  return response.content
    .map((block) => {
      if (
        typeof block === "object" &&
        block !== null &&
        "type" in block &&
        block.type === "text" &&
        "text" in block &&
        typeof block.text === "string"
      ) {
        return block.text
      }
      return ""
    })
    .filter((text) => text.length > 0)
    .join("\n")
    .trim()
}

const parseJsonArrayFromText = (raw: string) => {
  const trimmed = raw.trim()
  const direct = trimmed.startsWith("[") ? trimmed : ""
  const fencedMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i)
  const candidate = direct || fencedMatch?.[1]?.trim() || ""

  if (!candidate) return null

  try {
    const parsed = JSON.parse(candidate)
    if (!Array.isArray(parsed)) return null
    return parsed.filter((value): value is string => typeof value === "string")
  } catch {
    return null
  }
}

export async function summarizeTextWithClaude(
  text: string,
  options: {
    model?: string
    maxTokens?: number
    retries?: number
    instruction?: string
  } = {}
) {
  const client = getClient()
  const model = options.model || DEFAULT_MODEL
  const maxTokens = Math.max(128, Math.min(2048, options.maxTokens ?? 600))
  const retries = Math.max(0, Math.min(5, options.retries ?? MAX_RETRIES))
  const instruction = options.instruction?.trim()
  const instructionLine = instruction
    ? `\nAdditional instruction from user: ${instruction}\n`
    : "\n"

  let attempt = 0
  while (attempt <= retries) {
    try {
      const response = await client.messages.create({
        model,
        max_tokens: maxTokens,
        temperature: 0.2,
        system:
          "You summarise PDFs clearly and concisely. Preserve factual details and highlight key actions and risks.",
        messages: [
          {
            role: "user",
            content: `Summarise the following PDF text in bullet points with a short executive summary.${instructionLine}\n${text}`,
          },
        ],
      })

      const summary = extractTextFromResponse(response)
      if (!summary) {
        throw new Error("Claude returned an empty summary.")
      }

      return summary
    } catch (error) {
      const isRateLimit =
        error instanceof RateLimitError ||
        (error instanceof APIError && (error.status === 429 || error.status === 529))
      const canRetry = isRateLimit && attempt < retries

      if (!canRetry) {
        throw error
      }

      const delayMs = getRetryDelayMs(attempt, error)
      await sleep(delayMs)
      attempt += 1
    }
  }

  throw new Error("Anthropic summary request exceeded retry limits.")
}

export async function answerPdfQuestionWithClaude(
  text: string,
  question: string,
  options: {
    model?: string
    maxTokens?: number
    retries?: number
  } = {}
) {
  const client = getClient()
  const model = options.model || DEFAULT_MODEL
  const maxTokens = Math.max(128, Math.min(2048, options.maxTokens ?? 700))
  const retries = Math.max(0, Math.min(5, options.retries ?? MAX_RETRIES))

  let attempt = 0
  while (attempt <= retries) {
    try {
      const response = await client.messages.create({
        model,
        max_tokens: maxTokens,
        temperature: 0.1,
        system:
          "You answer questions about PDF content accurately. If information is missing, say so clearly and avoid guessing.",
        messages: [
          {
            role: "user",
            content: `Question: ${question}\n\nPDF text:\n${text}`,
          },
        ],
      })

      const answer = extractTextFromResponse(response)
      if (!answer) {
        throw new Error("Claude returned an empty answer.")
      }

      return answer
    } catch (error) {
      const isRateLimit =
        error instanceof RateLimitError ||
        (error instanceof APIError && (error.status === 429 || error.status === 529))
      const canRetry = isRateLimit && attempt < retries

      if (!canRetry) {
        throw error
      }

      const delayMs = getRetryDelayMs(attempt, error)
      await sleep(delayMs)
      attempt += 1
    }
  }

  throw new Error("Anthropic PDF QA request exceeded retry limits.")
}

export async function suggestEditsWithClaude(
  text: string,
  instruction: string,
  options: {
    model?: string
    maxTokens?: number
    retries?: number
  } = {}
) {
  const client = getClient()
  const model = options.model || DEFAULT_MODEL
  const maxTokens = Math.max(128, Math.min(2048, options.maxTokens ?? 700))
  const retries = Math.max(0, Math.min(5, options.retries ?? MAX_RETRIES))

  let attempt = 0
  while (attempt <= retries) {
    try {
      const response = await client.messages.create({
        model,
        max_tokens: maxTokens,
        temperature: 0.3,
        system:
          "You rewrite document text accurately. Return only a JSON array of 3 concise rewrite suggestions.",
        messages: [
          {
            role: "user",
            content: `Rewrite instruction: ${instruction}\n\nSource text:\n${text}`,
          },
        ],
      })

      const raw = extractTextFromResponse(response)
      const jsonSuggestions = parseJsonArrayFromText(raw)
      if (jsonSuggestions && jsonSuggestions.length > 0) {
        return jsonSuggestions.slice(0, 3)
      }

      const fallback = raw
        .split(/\n+/)
        .map((line: string) => line.replace(/^[-*\d.)\s]+/, "").trim())
        .filter(Boolean)
        .slice(0, 3)

      if (fallback.length > 0) {
        return fallback
      }

      throw new Error("Claude returned no valid edit suggestions.")
    } catch (error) {
      const isRateLimit =
        error instanceof RateLimitError ||
        (error instanceof APIError && (error.status === 429 || error.status === 529))
      const canRetry = isRateLimit && attempt < retries

      if (!canRetry) {
        throw error
      }

      const delayMs = getRetryDelayMs(attempt, error)
      await sleep(delayMs)
      attempt += 1
    }
  }

  throw new Error("Anthropic edit suggestion request exceeded retry limits.")
}
