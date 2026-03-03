type SanitizeHtmlOptions = {
  allowCodeTags?: boolean
}

const ALLOWED_TAGS = ["span", "strong", "em", "br", "code"]

const sanitizeAllowedTag = (tagName: string, attrs: string, allowCodeTags: boolean): string => {
  const lowered = tagName.toLowerCase()
  if (!ALLOWED_TAGS.includes(lowered)) return ""
  if (lowered === "code" && !allowCodeTags) return ""

  const classMatch = attrs.match(/\bclass\s*=\s*(['"])(.*?)\1/i)
  const translateMatch = attrs.match(/\btranslate\s*=\s*(['"])(.*?)\1/i)

  const safeAttrs: string[] = []
  if (classMatch) {
    const classValue = classMatch[2].replace(/[^A-Za-z0-9\s\-_:[\]./()%#]/g, "").trim()
    if (classValue) {
      safeAttrs.push(`class="${classValue}"`)
    }
  }

  if (translateMatch) {
    const translateValue = translateMatch[2].toLowerCase()
    if (translateValue === "no" || translateValue === "yes") {
      safeAttrs.push(`translate="${translateValue}"`)
    }
  }

  return `<${lowered}${safeAttrs.length ? ` ${safeAttrs.join(" ")}` : ""}>`
}

const sanitizeClosingTag = (tagName: string, allowCodeTags: boolean): string => {
  const lowered = tagName.toLowerCase()
  if (!ALLOWED_TAGS.includes(lowered)) return ""
  if (lowered === "code" && !allowCodeTags) return ""
  return `</${lowered}>`
}

const escapeJsonCharacter = (char: string): string => {
  switch (char) {
    case "<":
      return "\\u003c"
    case ">":
      return "\\u003e"
    case "&":
      return "\\u0026"
    case "\u2028":
      return "\\u2028"
    case "\u2029":
      return "\\u2029"
    default:
      return char
  }
}

export const sanitizeInlineHtml = (
  html: string,
  options: SanitizeHtmlOptions = {}
): string => {
  const allowCodeTags = options.allowCodeTags ?? false
  let sanitized = html
    .replace(/<\s*script[^>]*>[\s\S]*?<\s*\/script\s*>/gi, "")
    .replace(/\son\w+\s*=\s*(['"]).*?\1/gi, "")
    .replace(/javascript:/gi, "")

  sanitized = sanitized
    .replace(/<\/\s*([a-zA-Z0-9]+)\s*>/g, (_, tag: string) =>
      sanitizeClosingTag(tag, allowCodeTags)
    )
    .replace(/<\s*([a-zA-Z0-9]+)([^>]*)>/g, (_, tag: string, attrs: string) =>
      sanitizeAllowedTag(tag, attrs, allowCodeTags)
    )

  return sanitized
}

export const sanitizeCodeHtml = (html: string): string => sanitizeInlineHtml(html)

export const serializeJsonLd = (value: unknown): string =>
  JSON.stringify(value).replace(/[<>&\u2028\u2029]/g, escapeJsonCharacter)
