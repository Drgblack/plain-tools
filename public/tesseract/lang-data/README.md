Place local Tesseract language files in this directory.

Required for the current OCR pipeline:
- `eng.traineddata.gz`

The OCR worker only loads language data from this local path:
- `/tesseract/lang-data`

No remote OCR language files are fetched by design.
