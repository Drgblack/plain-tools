"use client"

import { useRef, useState } from "react"
import { UploadCloud } from "lucide-react"

import { cn } from "@/lib/utils"

interface PdfFileDropzoneProps {
  accept?: string
  multiple?: boolean
  disabled?: boolean
  title: string
  subtitle: string
  onFilesSelected: (files: File[]) => void
}

/**
 * Shared upload/drop interaction surface used by client-side PDF tools.
 * Keeps drag/drop keyboard behavior consistent across tools.
 */
export function PdfFileDropzone({
  accept = "application/pdf",
  multiple = false,
  disabled = false,
  title,
  subtitle,
  onFilesSelected,
}: PdfFileDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleFiles = (list: FileList | null) => {
    if (!list?.length || disabled) return
    onFilesSelected(Array.from(list))
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        disabled={disabled}
        onChange={(event) => {
          handleFiles(event.target.files)
          event.currentTarget.value = ""
        }}
      />

      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled}
        onClick={() => {
          if (!disabled) {
            inputRef.current?.click()
          }
        }}
        onKeyDown={(event) => {
          if (disabled) return
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault()
            inputRef.current?.click()
          }
        }}
        onDragOver={(event) => {
          if (disabled) return
          event.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={(event) => {
          if (disabled) return
          event.preventDefault()
          setIsDragging(false)
        }}
        onDrop={(event) => {
          if (disabled) return
          event.preventDefault()
          setIsDragging(false)
          handleFiles(event.dataTransfer.files)
        }}
        className={cn(
          "cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition-colors sm:p-10",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          isDragging
            ? "border-primary bg-primary/10"
            : "border-border bg-muted/20 hover:border-primary/70",
          disabled && "cursor-not-allowed opacity-60 hover:border-border"
        )}
      >
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <UploadCloud className="h-6 w-6 text-primary" />
        </div>
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
      </div>
    </>
  )
}
