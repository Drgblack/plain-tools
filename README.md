This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### Environment Variables

Copy the example env file and fill in real values:

```bash
cp .env.example .env
```

Set required keys (for example `ANTHROPIC_API_KEY`, `BREVO_API_KEY`, and Upstash Redis values if rate limiting is enabled).

## Security

This project sets strict browser security headers at the framework level via `next.config.ts` for all non-API routes.

- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- `Content-Security-Policy`:
  - `default-src 'self'`
  - `script-src 'self' 'unsafe-eval' 'unsafe-inline' https://translate.googleapis.com https://translate.google.com`
  - `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`
  - `font-src 'self' https://fonts.gstatic.com`
  - `img-src 'self' data: blob: https://translate.googleapis.com https://www.gstatic.com`
  - `connect-src 'self' https://api.anthropic.com https://translate.googleapis.com`
  - `worker-src 'self' blob:`
  - `frame-src 'none'`
  - `object-src 'none'`
  - `base-uri 'self'`

`/api` routes are intentionally excluded from this header set. API CORS and route-level response headers are handled in API route logic (`lib/api-cors.ts` and route handlers).

API routes also emit structured JSON error and warning logs (`lib/logger.ts`) suitable for production ingestion. On Vercel, these logs are captured automatically and can be forwarded through log drains. For production monitoring, connect a drain provider such as Axiom, Logtail, or Papertrail.

## Launch Checklist

### Pre-launch

- [ ] All env vars in `.env.example` are set in Vercel project settings
- [ ] `ANTHROPIC_API_KEY` is valid and has sufficient quota
- [ ] `ALLOWED_ORIGIN` is set to `https://plain.tools`
- [ ] Upstash Redis is provisioned and `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` are set (or in-memory fallback is acceptable)
- [ ] Vercel deployment is on Production branch (`main`)
- [ ] Custom domain `plain.tools` is connected and SSL is active in Vercel
- [ ] `pnpm run build` passes locally on latest `main`
- [ ] `pnpm run lint` passes with 0 errors
- [ ] `pnpm exec tsc --noEmit` passes
- [ ] `pnpm run test:e2e` passes

### Smoke tests (manual, post-deploy)

- [ ] Homepage loads at `https://plain.tools`
- [ ] Merge PDF tool: upload two PDFs, merge, download result
- [ ] Split PDF tool: upload a multi-page PDF, split, download
- [ ] Compress PDF tool: upload a PDF, compress, download
- [ ] OCR tool: upload an image-based PDF, run OCR, download searchable PDF
- [ ] AI Summarise: upload a PDF, request summary (confirm API key works)
- [ ] Support form: submit a test message, confirm no 500 error
- [ ] Verify Claims page loads
- [ ] `/sitemap.xml` returns valid XML with no 404 URLs
- [ ] `/robots.txt` references sitemap and disallows `/api/`
- [ ] Security headers present: check via `https://securityheaders.com`

### Rollback procedure

- [ ] Revert to previous commit: `git revert HEAD && git push origin main`
- [ ] Or use Vercel dashboard: `Deployments > previous deployment > Promote to Production`

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
