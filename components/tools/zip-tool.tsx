"use client"

import { unzipSync } from "fflate"
import { Archive, CheckSquare, Download, FileArchive, Loader2, Square, Trash2 } from "lucide-react"
import { useCallback, useMemo, useState } from "react"
import { Toaster, toast } from "sonner"

import { PdfFileDropzone } from "@/components/tools/shared/pdf-file-dropzone"
import { ProcessedLocallyBadge } from "@/components/tools/processed-locally-badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { notifyLocalDownloadSuccess } from "@/lib/local-download-events"
import { ensureSafeLocalFileSize, formatFileSize } from "@/lib/pdf-client-utils"
import { blobToUint8Array, downloadZip, makeZip } from "@/lib/zip-download"

type ZipMode = "extract" | "create"

type ZipEntryRecord = {
  name: string
  bytes: Uint8Array
  sizeBytes: number
}

const MAX_ZIP_BYTES = 300 * 1024 * 1024

const isZipFile = (file: File) =>
  file.type === "application/zip" || file.name.toLowerCase().endsWith(".zip")

const normaliseZipEntryPath = (input: string) => {
  const cleaned = input.replace(/\\/g, "/").replace(/^\/+/, "")
  const parts = cleaned
    .split("/")
    .map((part) => part.trim())
    .filter((part) => part.length > 0 && part !== "." && part !== "..")
  const safe = parts.join("/")
  return safe.length > 0 ? safe : "file"
}

const toDownloadFileName = (path: string) => {
  const parts = path.split("/")
  const last = parts[parts.length - 1]
  return last && last.trim().length > 0 ? last : "file"
}

const downloadBinary = (bytes: Uint8Array, filename: string, type = "application/octet-stream") => {
  const blob = new Blob([bytes], { type })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  link.click()
  setTimeout(() => URL.revokeObjectURL(url), 0)
}

const dedupeFiles = (files: File[]) => {
  const map = new Map<string, File>()
  for (const file of files) {
    const key = `${file.name}::${file.size}::${file.lastModified}`
    map.set(key, file)
  }
  return Array.from(map.values())
}

export default function ZipTool() {
  const [mode, setMode] = useState<ZipMode>("extract")
  const [extractArchive, setExtractArchive] = useState<File | null>(null)
  const [extractedEntries, setExtractedEntries] = useState<ZipEntryRecord[]>([])
  const [selectedEntryNames, setSelectedEntryNames] = useState<string[]>([])
  const [createFiles, setCreateFiles] = useState<File[]>([])
  const [isWorking, setIsWorking] = useState(false)
  const [status, setStatus] = useState("Choose Extract or Create to process ZIP files locally.")

  const selectedEntries = useMemo(() => {
    if (!selectedEntryNames.length) return []
    const selection = new Set(selectedEntryNames)
    return extractedEntries.filter((entry) => selection.has(entry.name))
  }, [extractedEntries, selectedEntryNames])

  const allExtractSelected =
    extractedEntries.length > 0 && selectedEntryNames.length === extractedEntries.length

  const resetExtract = useCallback(() => {
    setExtractArchive(null)
    setExtractedEntries([])
    setSelectedEntryNames([])
  }, [])

  const resetCreate = useCallback(() => {
    setCreateFiles([])
  }, [])

  const handleExtractArchive = useCallback(
    async (candidate: File) => {
      if (!isZipFile(candidate)) {
        toast.error("Please choose a .zip archive.")
        return
      }

      setIsWorking(true)
      setStatus("Reading ZIP archive locally...")
      resetExtract()

      try {
        ensureSafeLocalFileSize(candidate, MAX_ZIP_BYTES)
        const zipBytes = new Uint8Array(await candidate.arrayBuffer())
        const rawEntries = unzipSync(zipBytes)

        const parsed = Object.entries(rawEntries)
          .map(([name, bytes]) => ({
            name: normaliseZipEntryPath(name),
            bytes,
            sizeBytes: bytes.byteLength,
          }))
          .filter((entry) => !entry.name.endsWith("/"))
          .sort((left, right) => left.name.localeCompare(right.name))

        if (!parsed.length) {
          throw new Error("No extractable files were found in this ZIP.")
        }

        setExtractArchive(candidate)
        setExtractedEntries(parsed)
        setSelectedEntryNames(parsed.map((entry) => entry.name))
        setStatus(`Loaded ${parsed.length} file${parsed.length === 1 ? "" : "s"} from archive.`)
        toast.success("ZIP archive loaded.")
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Could not read this ZIP archive."
        setStatus(message)
        resetExtract()
        toast.error(message)
      } finally {
        setIsWorking(false)
      }
    },
    [resetExtract]
  )

  const downloadEntriesAsZip = useCallback((entries: ZipEntryRecord[], filename: string) => {
    if (!entries.length) {
      toast.error("Select at least one file.")
      return
    }
    const zipBytes = makeZip(entries.map((entry) => ({ name: entry.name, data: entry.bytes })))
    downloadZip(zipBytes, filename)
    notifyLocalDownloadSuccess()
    toast.success(`ZIP ready. ${entries.length} file${entries.length === 1 ? "" : "s"} included.`)
  }, [])

  const handleCreateZip = useCallback(async () => {
    if (!createFiles.length) {
      toast.error("Add files before creating a ZIP.")
      return
    }

    setIsWorking(true)
    setStatus("Creating ZIP locally...")

    try {
      const entries = await Promise.all(
        createFiles.map(async (file) => ({
          name: normaliseZipEntryPath(file.name),
          data: await blobToUint8Array(file),
        }))
      )
      const zipBytes = makeZip(entries)
      downloadZip(zipBytes, "plain-tools-archive.zip")
      notifyLocalDownloadSuccess()
      setStatus(
        `ZIP created successfully. ${entries.length} file${entries.length === 1 ? "" : "s"} archived.`
      )
      toast.success("ZIP file created.")
    } catch {
      setStatus("Could not create ZIP archive.")
      toast.error("Could not create ZIP archive.")
    } finally {
      setIsWorking(false)
    }
  }, [createFiles])

  return (
    <div className="space-y-6 overflow-x-hidden">
      <Toaster richColors position="top-right" />

      <Card className="border-blue-500/25 bg-card/80">
        <CardHeader>
          <CardTitle className="text-base">ZIP Extract & Create</CardTitle>
          <CardDescription>
            Best-effort offline archive handling. Files never leave your device.
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs value={mode} onValueChange={(value) => setMode(value as ZipMode)} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="extract">Extract</TabsTrigger>
          <TabsTrigger value="create">Create</TabsTrigger>
        </TabsList>

        <TabsContent value="extract" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <PdfFileDropzone
                accept=".zip,application/zip"
                disabled={isWorking}
                title="Drop a ZIP archive here, or click to browse"
                subtitle="Extract files locally with no upload step"
                onFilesSelected={(files) => {
                  const archive = files[0]
                  if (archive) {
                    void handleExtractArchive(archive)
                  }
                }}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Extracted files</CardTitle>
              <CardDescription>{status}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {extractArchive ? (
                <div className="rounded-lg border bg-muted/30 p-3">
                  <p className="truncate text-sm font-medium text-foreground">{extractArchive.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatFileSize(extractArchive.size)} • {extractedEntries.length} file
                    {extractedEntries.length === 1 ? "" : "s"}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No archive loaded yet.</p>
              )}

              {extractedEntries.length > 0 ? (
                <>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (allExtractSelected) {
                          setSelectedEntryNames([])
                        } else {
                          setSelectedEntryNames(extractedEntries.map((entry) => entry.name))
                        }
                      }}
                    >
                      {allExtractSelected ? (
                        <>
                          <Square className="h-4 w-4" />
                          Clear selection
                        </>
                      ) : (
                        <>
                          <CheckSquare className="h-4 w-4" />
                          Select all
                        </>
                      )}
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={!selectedEntries.length}
                      onClick={() =>
                        downloadEntriesAsZip(selectedEntries, "zip-tool-selected-files.zip")
                      }
                    >
                      <Archive className="h-4 w-4" />
                      Download selected ZIP ({selectedEntries.length})
                    </Button>

                    <Button
                      type="button"
                      size="sm"
                      disabled={!extractedEntries.length}
                      onClick={() =>
                        downloadEntriesAsZip(extractedEntries, "zip-tool-extract-all.zip")
                      }
                    >
                      <FileArchive className="h-4 w-4" />
                      Extract all as ZIP
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {extractedEntries.map((entry) => {
                      const checked = selectedEntryNames.includes(entry.name)
                      return (
                        <div
                          key={entry.name}
                          className="flex flex-col gap-2 rounded-lg border bg-muted/20 p-3 sm:flex-row sm:items-center sm:justify-between"
                        >
                          <label className="flex min-w-0 cursor-pointer items-start gap-2">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={(event) => {
                                setSelectedEntryNames((previous) => {
                                  if (event.target.checked) {
                                    return [...previous, entry.name]
                                  }
                                  return previous.filter((name) => name !== entry.name)
                                })
                              }}
                              className="mt-0.5 h-4 w-4 rounded border-border"
                            />
                            <span className="min-w-0">
                              <span className="block truncate text-sm font-medium text-foreground">
                                {entry.name}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {formatFileSize(entry.sizeBytes)}
                              </span>
                            </span>
                          </label>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              downloadBinary(entry.bytes, toDownloadFileName(entry.name))
                              notifyLocalDownloadSuccess()
                            }}
                          >
                            <Download className="h-4 w-4" />
                            Download
                          </Button>
                        </div>
                      )
                    })}
                  </div>
                </>
              ) : null}
            </CardContent>
            <CardFooter className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
              <ProcessedLocallyBadge />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  resetExtract()
                  setStatus("Choose Extract or Create to process ZIP files locally.")
                }}
              >
                <Trash2 className="h-4 w-4" />
                Clear extract mode
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="create" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <PdfFileDropzone
                accept="*/*"
                multiple
                disabled={isWorking}
                title="Drop files here, or click to browse"
                subtitle="Create a ZIP archive locally in your browser"
                onFilesSelected={(files) => {
                  if (!files.length) return
                  setCreateFiles((previous) => dedupeFiles([...previous, ...files]))
                  setStatus(`Added ${files.length} file${files.length === 1 ? "" : "s"} for ZIP creation.`)
                }}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Files for new ZIP</CardTitle>
              <CardDescription>
                Add one or more files, then create a ZIP archive.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {createFiles.length ? (
                <div className="space-y-2">
                  {createFiles.map((file) => (
                    <div
                      key={`${file.name}-${file.size}-${file.lastModified}`}
                      className="flex items-center justify-between rounded-lg border bg-muted/20 p-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">{file.name}</p>
                        <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setCreateFiles((previous) =>
                            previous.filter(
                              (candidate) =>
                                !(
                                  candidate.name === file.name &&
                                  candidate.size === file.size &&
                                  candidate.lastModified === file.lastModified
                                )
                            )
                          )
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No files added yet.</p>
              )}
            </CardContent>
            <CardFooter className="flex flex-col gap-2 sm:flex-row sm:justify-between">
              <div className="w-full sm:w-auto">
                <ProcessedLocallyBadge />
              </div>
              <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetCreate}
                  disabled={!createFiles.length || isWorking}
                >
                  <Trash2 className="h-4 w-4" />
                  Clear files
                </Button>
                <Button
                  type="button"
                  onClick={() => void handleCreateZip()}
                  disabled={!createFiles.length || isWorking}
                >
                  {isWorking ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating ZIP...
                    </>
                  ) : (
                    <>
                      <Archive className="h-4 w-4" />
                      Create ZIP
                    </>
                  )}
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
