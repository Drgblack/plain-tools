const STRIP_BLOCK_TAGS = [
  "script",
  "style",
  "iframe",
  "object",
  "embed",
  "link",
  "meta",
  "base",
  "form",
  "input",
  "button",
  "select",
  "textarea",
  "video",
  "audio",
  "source",
]

const ALLOWED_TAGS = new Set([
  "p",
  "br",
  "div",
  "span",
  "strong",
  "em",
  "b",
  "i",
  "u",
  "s",
  "sup",
  "sub",
  "ul",
  "ol",
  "li",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "table",
  "thead",
  "tbody",
  "tr",
  "th",
  "td",
  "blockquote",
  "pre",
  "code",
  "a",
  "img",
])

const VOID_TAGS = new Set(["br", "img"])

const decodeEntityEscapes = (value: string) =>
  value.replace(/&#(x?[0-9a-f]+);?/gi, (_, code: string) => {
    const radix = code.toLowerCase().startsWith("x") ? 16 : 10
    const raw = code.toLowerCase().startsWith("x") ? code.slice(1) : code
    const parsed = Number.parseInt(raw, radix)
    if (!Number.isFinite(parsed)) {
      return ""
    }
    return String.fromCharCode(parsed)
  })

const isSafeHref = (value: string) => {
  const normalised = decodeEntityEscapes(value)
    .replace(/[\u0000-\u001f\u007f\s]+/g, "")
    .toLowerCase()

  return normalised.startsWith("#")
}

const isSafeImageUrl = (value: string) => {
  const normalised = decodeEntityEscapes(value)
    .replace(/[\u0000-\u001f\u007f\s]+/g, "")
    .toLowerCase()

  return normalised.startsWith("data:image/") || normalised.startsWith("blob:")
}

const sanitiseAttributes = (tagName: string, rawAttrs: string) => {
  const safeAttrs: string[] = []
  const attrRegex =
    /([^\s=/>]+)(?:\s*=\s*("([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g
  let match: RegExpExecArray | null

  while ((match = attrRegex.exec(rawAttrs))) {
    const rawName = match[1]
    const attrName = rawName.toLowerCase()
    const value = (match[3] ?? match[4] ?? match[5] ?? "").trim()

    if (attrName.startsWith("on")) {
      continue
    }

    if (attrName === "style") {
      continue
    }

    if (tagName === "img") {
      if (attrName === "src" && isSafeImageUrl(value)) {
        safeAttrs.push(`src="${value.replace(/"/g, "&quot;")}"`)
        continue
      }

      if (attrName === "srcset") {
        continue
      }

      if (attrName === "alt") {
        safeAttrs.push(`alt="${value.replace(/"/g, "&quot;")}"`)
        continue
      }

      if ((attrName === "width" || attrName === "height") && /^\d{1,4}$/.test(value)) {
        safeAttrs.push(`${attrName}="${value}"`)
      }

      continue
    }

    if (tagName === "a") {
      if (attrName === "href" && isSafeHref(value)) {
        safeAttrs.push(`href="${value.replace(/"/g, "&quot;")}"`)
      }
      continue
    }

    if (attrName === "colspan" || attrName === "rowspan") {
      if (/^\d{1,2}$/.test(value)) {
        safeAttrs.push(`${attrName}="${value}"`)
      }
      continue
    }
  }

  return safeAttrs
}

/**
 * Sanitises mammoth HTML output before local canvas rendering.
 * Blocks active content and remote URL fetches to avoid XSS/privacy leaks.
 */
export const sanitizeDocxHtmlForRendering = (input: string) => {
  const blockTagPattern = STRIP_BLOCK_TAGS.join("|")
  const stripBlocksRegex = new RegExp(
    `<\\s*(${blockTagPattern})\\b[^>]*>[\\s\\S]*?<\\s*\\/\\s*\\1\\s*>`,
    "gi"
  )
  const stripSingleTagsRegex = new RegExp(
    `<\\s*(${blockTagPattern})\\b[^>]*\\/?>`,
    "gi"
  )

  let sanitized = input
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(stripBlocksRegex, "")
    .replace(stripSingleTagsRegex, "")
    .replace(/\son[a-z0-9_-]+\s*=\s*("([^"]*)"|'([^']*)'|[^\s>]+)/gi, "")
    .replace(/\sstyle\s*=\s*("([^"]*)"|'([^']*)'|[^\s>]+)/gi, "")

  sanitized = sanitized
    .replace(/<\s*\/\s*([a-z0-9:-]+)\s*>/gi, (_, tag: string) => {
      const tagName = tag.toLowerCase()
      if (!ALLOWED_TAGS.has(tagName) || VOID_TAGS.has(tagName)) {
        return ""
      }
      return `</${tagName}>`
    })
    .replace(/<\s*([a-z0-9:-]+)([^>]*)>/gi, (_, tag: string, attrs: string) => {
      const tagName = tag.toLowerCase()
      if (!ALLOWED_TAGS.has(tagName)) {
        return ""
      }

      const safeAttrs = sanitiseAttributes(tagName, attrs)
      return `<${tagName}${safeAttrs.length ? ` ${safeAttrs.join(" ")}` : ""}>`
    })

  return sanitized
}
