export type ToolIntroMode = "local" | "network" | "ai"

function extractFirstSentence(text: string) {
  const cleaned = text.replace(/\s+/g, " ").trim()
  if (!cleaned) return ""

  const match = cleaned.match(/^.*?[.!?](?=\s|$)/)
  const sentence = match ? match[0].trim() : cleaned

  return /[.!?]$/.test(sentence) ? sentence : `${sentence}.`
}

function getSecondSentence(mode: ToolIntroMode) {
  switch (mode) {
    case "network":
      return "The check runs directly from your browser and does not use a Plain Tools proxy."
    case "ai":
      return "Any AI step is opt-in and only happens after the local extraction step has already run on your device."
    case "local":
    default:
      return "The core workflow runs in your browser with no upload step to Plain Tools."
  }
}

export function buildStandardToolIntro(description: string, mode: ToolIntroMode = "local") {
  const firstSentence = extractFirstSentence(description)
  const secondSentence = getSecondSentence(mode)

  if (!firstSentence) {
    return secondSentence
  }

  return `${firstSentence} ${secondSentence}`
}
