This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### Environment Variables

Copy the example env file and fill in real values:

```bash
cp .env.example .env
```

Set required keys (for example `ANTHROPIC_API_KEY`, `BREVO_API_KEY`, `SUPPORT_EMAIL`/`WAITLIST_EMAIL`, and Upstash Redis values if rate limiting is enabled).

## SEO Setup (One-Time)

### Google Search Console

Preferred method: DNS TXT verification. Alternative: HTML file verification (do not use the AdSense meta tag).

1. Go to Google Search Console -> Add Property -> URL prefix -> https://plain.tools
2. Choose HTML file verification method
3. Download the verification file and replace `public/google-search-console-verify.html` with the actual file content from Google
4. Deploy, then click Verify in Search Console
5. Once verified, submit https://plain.tools/sitemap.xml under Sitemaps

### Bing Webmaster Tools

1. Go to https://www.bing.com/webmasters and add `https://plain.tools`
2. Copy your `msvalidate.01` verification code
3. Replace the placeholder in `app/layout.tsx`:
   - `<!-- <meta name="msvalidate.01" content="[YOUR_BING_CODE]" /> -->`
4. Deploy and click Verify in Bing Webmaster Tools

### IndexNow

Run after each significant content update to notify Bing, Yandex, and other IndexNow participants immediately:

```bash
pnpm run ping-indexnow
```

## Analytics

### Plausible (Privacy-Respecting)

The site uses Plausible Analytics for privacy-first product analytics.

- Script is loaded in `app/layout.tsx` with `data-domain="plain.tools"`.
- CSP allowlist includes `https://plausible.io` in `script-src` and `connect-src`.
- No cookies are required.

Setup steps:

1. Create a site in Plausible for `plain.tools`.
2. Confirm the script is active on production (`View Page Source` or browser network).
3. Verify custom events appear in the Plausible dashboard:
   - `Tool Download`
   - `AI Limit Reached`
   - `Share Click`

## Plain Pro Billing

The Pro subscription stack uses Clerk (auth) + Stripe (billing + tax).

1. Create Stripe product `Plain Pro` with:
   - Monthly: `€7.00`
   - Annual: `€59.00`
2. Enable Stripe Tax in dashboard.
3. Configure env vars:
   - `STRIPE_SECRET_KEY`
   - `STRIPE_PUBLISHABLE_KEY`
   - `STRIPE_PRO_MONTHLY_PRICE_ID`
   - `STRIPE_PRO_ANNUAL_PRICE_ID`
   - `STRIPE_WEBHOOK_SECRET`
   - `NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID`
   - `NEXT_PUBLIC_STRIPE_PRO_ANNUAL_PRICE_ID`
4. Configure Clerk keys:
   - `CLERK_SECRET_KEY`
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
5. Stripe webhook endpoint:
   - `POST /api/stripe/webhook`
   - enable events:
     - `checkout.session.completed`
     - `customer.subscription.deleted`
     - `invoice.payment_failed`

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
  - `script-src` also allows `https://plausible.io` for privacy-first analytics
  - `connect-src 'self' https://api.anthropic.com https://translate.googleapis.com`
  - `connect-src` also allows `https://plausible.io`
  - `worker-src 'self' blob:`
  - `frame-src 'none'`
  - `object-src 'none'`
  - `base-uri 'self'`

`/api` routes are intentionally excluded from this header set. API CORS and route-level response headers are handled in API route logic (`lib/api-cors.ts` and route handlers).

API routes also emit structured JSON error and warning logs (`lib/logger.ts`) suitable for production ingestion. On Vercel, these logs are captured automatically and can be forwarded through log drains. For production monitoring, connect a drain provider such as Axiom, Logtail, or Papertrail.

## Monitoring

### Axiom Log Drain

The app is configured with `withAxiom(...)` in `next.config.ts` and uses `next-axiom` in `lib/logger.ts` for production log ingestion.

1. Create an Axiom dataset.
2. Create an Axiom token with ingest permissions.
3. Set these Vercel environment variables:
   - `NEXT_PUBLIC_AXIOM_DATASET`
   - `AXIOM_TOKEN`
4. In Vercel, enable log drain forwarding to Axiom (or use Axiom ingestion directly via env vars above).

### Health Check Endpoint

Public health endpoint:

- `GET /api/health`
- Response: `{ "status": "ok", "version": "1.0.0", "timestamp": "<ISO-8601>" }`

This endpoint is intentionally crawl-allowed in `robots.txt` for uptime tooling compatibility.

## Programmatic Tool Variants

Plain Tools now supports nested tool-intent variant pages at:

- `/tools/[toolSlug]/[modifierSlug]`

The first wave is generated from `lib/tools-matrix.ts` and rendered by `app/tools/[toolSlug]/[modifierSlug]/page.tsx` using `components/ProgrammaticVariantPage.tsx`.

### How generation works

1. Define supported tools and modifiers in `lib/tools-matrix.ts`.
2. Filter combinations so only useful, non-nonsense pairings ship.
3. `generateStaticParams()` returns the full matrix for static generation.
4. Each page gets a unique H1, metadata, FAQ set, internal links, and JSON-LD.
5. The main sitemap and `sitemap-tools.xml` both include the generated routes.

### Revalidation strategy

- Route ISR is set to `30 days`:
  - `export const revalidate = 60 * 60 * 24 * 30`
- This is a good default because the content is mostly evergreen and dataset-driven rather than news-like.

### Local verification

Run:

```bash
pnpm lint
pnpm build
```

Then spot-check a few generated routes, for example:

- `/tools/compress-pdf/for-email`
- `/tools/merge-pdf/offline`
- `/tools/pdf-to-word/no-upload`
- `/tools/ocr-pdf/searchable`

### Scaling to 2,000+ pages later

- Add more real tools only where the live tool UI already exists.
- Add more modifiers only when the combination creates a distinct user problem.
- Keep build-time guards for:
  - minimum word count
  - valid tool slugs
  - sensible total page count per wave
- Prefer expanding by high-intent clusters such as:
  - submission constraints
  - device-specific workflows
  - privacy and no-upload queries
  - archive and records workflows
- Add new waves gradually and monitor indexing and internal-link coverage before doubling the matrix again.

## Problem Diagnosis Tool

Plain Tools now includes a diagnosis-first route at:

- `/diagnosis`

It helps users describe a file problem in plain language, then recommends the most relevant core tool or nested tool-variant route.

### Main files

- `lib/diagnosis-rules.ts`
- `components/DiagnosisTool.tsx`
- `components/DiagnosisResultCard.tsx`
- `app/diagnosis/page.tsx`

### How to add new rules

1. Open `lib/diagnosis-rules.ts`.
2. Add a new `rule(...)` entry to `DIAGNOSIS_RULES`.
3. Keep the rule specific to a real user problem, such as:
   - file is too large for upload
   - scanned PDF needs editing
   - password-protected file will not open
4. Point each recommendation at:
   - a real tool route under `/tools/[slug]`, or
   - a real variant route under `/tools/[toolSlug]/[modifierSlug]`
5. Keep the recommendation description practical and specific to the problem.

### Testing the diagnosis feature

Run:

```bash
pnpm lint
pnpm build
```

Then spot-check:

- `/diagnosis`
- `/diagnosis?fileType=pdf&problem=too-large&goal=email`
- `/diagnosis?fileType=pdf&problem=scanned-document&goal=edit`
- `/why-is-my-pdf-so-large`
- `/pdf-wont-open`

### Analytics and privacy

- Diagnosis logic runs locally in the browser.
- The free-text input is not sent to Plain Tools.
- GA4 event tracking only records high-level enums such as:
  - file type
  - problem
  - goal
  - device
  - top recommendation URL
- Do not add raw free-text logging.

### Revalidation strategy

- Diagnosis page ISR is set to `86400` seconds (1 day).
- This keeps the route fresh enough for copy or rules updates without making it dynamic.

### Scaling later

To expand beyond the first rule wave:

1. Add more precise problem patterns in `lib/diagnosis-rules.ts`.
2. Add new redirect-style long-tails that prefill `/diagnosis`.
3. Watch which diagnosis combinations are used most often.
4. Promote the strongest combinations into dedicated long-form programmatic pages when they deserve their own route.

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
