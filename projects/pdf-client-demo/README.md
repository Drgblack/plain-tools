# Local PDF Merge + Compress Demo

A minimal, privacy-first React app that runs entirely in your browser.

## Features

- Merge multiple PDFs into one (`merged.pdf`)
- Best-effort PDF optimisation (`*-optimised.pdf`)
- Dark mode with system detection and persistence (`plain-tools-theme` in `localStorage`)
- Responsive, keyboard-accessible UI
- No backend and no file uploads

## Privacy Model

- All processing runs in the browser using `pdf-lib`
- Files are never sent to a server
- No analytics or tracking code in this project

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- pdf-lib
- Vitest + Testing Library

## Getting Started

```bash
pnpm install
pnpm dev
```

Open `http://localhost:5173`.

Sample file for quick testing: `public/demo/sample.pdf`.

## Scripts

```bash
pnpm dev       # start dev server
pnpm test      # run tests
pnpm build     # typecheck + production build
pnpm preview   # preview production build
```

## Deployment

### Vercel

1. Import this repository.
2. Set **Root Directory** to `projects/pdf-client-demo`.
3. Build command: `pnpm build`
4. Output directory: `dist`

### Netlify

1. Base directory: `projects/pdf-client-demo`
2. Build command: `pnpm build`
3. Publish directory: `dist`

## Notes and Limitations

- Compression is best-effort. Some PDFs may not shrink noticeably.
- Encrypted PDFs may fail depending on source constraints.
- For large files, memory limits depend on the browser/device.
