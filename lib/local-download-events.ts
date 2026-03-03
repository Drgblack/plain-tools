import { trackEvent } from "@/lib/analytics"

export const LOCAL_DOWNLOAD_SUCCESS_EVENT = "plain:local-download-success"

const getToolSlugFromPath = () => {
  if (typeof window === "undefined") {
    return null
  }

  const path = window.location.pathname
  if (!path.startsWith("/tools/")) {
    return null
  }

  const slug = path.slice("/tools/".length).split("/")[0]?.trim()
  return slug || null
}

export const notifyLocalDownloadSuccess = (toolName?: string) => {
  if (typeof window === "undefined") {
    return
  }

  const inferredTool = toolName || getToolSlugFromPath() || "unknown"
  trackEvent("Tool Download", { tool: inferredTool })

  window.dispatchEvent(new Event(LOCAL_DOWNLOAD_SUCCESS_EVENT))
}
