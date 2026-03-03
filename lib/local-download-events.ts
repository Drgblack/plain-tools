export const LOCAL_DOWNLOAD_SUCCESS_EVENT = "plain:local-download-success"

export const notifyLocalDownloadSuccess = () => {
  if (typeof window === "undefined") {
    return
  }

  window.dispatchEvent(new Event(LOCAL_DOWNLOAD_SUCCESS_EVENT))
}

