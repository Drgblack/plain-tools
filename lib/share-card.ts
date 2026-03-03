const CARD_WIDTH = 1200
const CARD_HEIGHT = 630

export const buildShareCardPng = async (headline: string) => {
  const canvas = document.createElement("canvas")
  canvas.width = CARD_WIDTH
  canvas.height = CARD_HEIGHT
  const context = canvas.getContext("2d")

  if (!context) {
    throw new Error("Could not prepare share card canvas.")
  }

  const gradient = context.createLinearGradient(0, 0, CARD_WIDTH, CARD_HEIGHT)
  gradient.addColorStop(0, "#08131A")
  gradient.addColorStop(1, "#0F2028")
  context.fillStyle = gradient
  context.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT)

  context.strokeStyle = "rgba(68, 255, 181, 0.28)"
  context.lineWidth = 3
  context.strokeRect(32, 32, CARD_WIDTH - 64, CARD_HEIGHT - 64)

  context.fillStyle = "#44FFB5"
  context.font = "700 42px var(--font-mono, 'JetBrains Mono', monospace)"
  context.fillText("PLAIN", 84, 110)

  context.fillStyle = "#E6F4FF"
  context.font = "700 52px var(--font-sans, 'Inter', sans-serif)"
  wrapText(context, headline, 84, 205, CARD_WIDTH - 168, 66)

  context.fillStyle = "rgba(230, 244, 255, 0.92)"
  context.font = "500 34px var(--font-sans, 'Inter', sans-serif)"
  context.fillText("without uploading it.", 84, 360)

  context.fillStyle = "rgba(68, 255, 181, 0.95)"
  context.font = "600 32px var(--font-sans, 'Inter', sans-serif)"
  context.fillText("Verify at plain.tools/verify-claims", 84, 450)

  context.fillStyle = "rgba(230, 244, 255, 0.74)"
  context.font = "500 28px var(--font-mono, 'JetBrains Mono', monospace)"
  context.fillText("plain.tools", 84, 530)

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (nextBlob) => {
        if (nextBlob) {
          resolve(nextBlob)
          return
        }
        reject(new Error("Could not export share card image."))
      },
      "image/png",
      0.95
    )
  })

  return blob
}

const wrapText = (
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) => {
  const words = text.split(" ")
  let line = ""
  let lineY = y

  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word
    const width = context.measureText(candidate).width
    if (width > maxWidth && line) {
      context.fillText(line, x, lineY)
      line = word
      lineY += lineHeight
      continue
    }
    line = candidate
  }

  if (line) {
    context.fillText(line, x, lineY)
  }
}

