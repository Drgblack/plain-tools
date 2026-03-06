import { ChangeEvent, DragEvent, useRef, useState } from "react"

type FileDropzoneProps = {
  id: string
  accept?: string
  multiple?: boolean
  description: string
  onFilesSelected: (files: File[]) => void
}

export function FileDropzone({
  id,
  accept = ".pdf,application/pdf",
  multiple = false,
  description,
  onFilesSelected,
}: FileDropzoneProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const emitFiles = (fileList: FileList | null) => {
    if (!fileList) return
    onFilesSelected(Array.from(fileList))
  }

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault()
    setIsDragging(false)
    emitFiles(event.dataTransfer.files)
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    emitFiles(event.target.files)
    event.currentTarget.value = ""
  }

  return (
    <div>
      <label
        htmlFor={id}
        onDragOver={(event) => {
          event.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-10 text-center transition ${
          isDragging
            ? "border-accent bg-accent/10"
            : "border-border bg-bg hover:border-accent/80 hover:bg-accent/5"
        }`}
      >
        <span className="text-base font-medium">Drop files here or click to browse</span>
        <span className="mt-2 text-sm text-muted">{description}</span>
      </label>
      <input
        id={id}
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleChange}
        className="sr-only"
      />
    </div>
  )
}
