const FILE_CONVERTER_CANONICAL_PATHS: Record<string, string> = {
  "excel-to-pdf": "/file-converters",
  "heic-to-pdf": "/file-converters",
  "image-to-pdf": "/tools/jpg-to-pdf",
  "jpg-to-pdf": "/tools/jpg-to-pdf",
  "pdf-to-excel": "/tools/pdf-to-excel",
  "pdf-to-heic": "/file-converters",
  "pdf-to-image": "/tools/pdf-to-jpg",
  "pdf-to-jpg": "/tools/pdf-to-jpg",
  "pdf-to-png": "/tools/pdf-to-jpg",
  "pdf-to-ppt": "/tools/pdf-to-ppt",
  "pdf-to-word": "/tools/pdf-to-word",
  "png-to-pdf": "/tools/jpg-to-pdf",
  "ppt-to-pdf": "/file-converters",
  "tiff-to-pdf": "/file-converters",
  "word-to-pdf": "/tools/word-to-pdf",
}

export function getCanonicalFileConverterPath(slug: string) {
  return FILE_CONVERTER_CANONICAL_PATHS[slug.toLowerCase()] ?? "/file-converters"
}
