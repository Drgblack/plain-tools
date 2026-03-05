# SEO Tranche 1

## Scope
This tranche implements 25 high-intent SEO pages using canonical root routes:
- `/learn/*` (19 pages)
- `/compare/*` (6 pages)

Mirrors under `/pdf-tools/learn/*` and `/pdf-tools/compare/*` are redirected to root canonicals.

## 25-Page Plan
| # | Title | Slug | Primary Query | Secondary Queries | Intent | Link Targets |
|---|---|---|---|---|---|---|
| 1 | Compress PDF Without Losing Quality | `/learn/compress-pdf-without-losing-quality` | compress pdf without losing quality | reduce pdf file size, compress pdf offline | how-to | `/tools/compress-pdf`, `/learn/why-offline-compression-has-limits`, `/verify-claims` |
| 2 | How to Merge PDFs Offline | `/learn/how-to-merge-pdfs-offline` | merge pdf offline | merge pdf locally, merge pdf no upload | how-to | `/tools/merge-pdf`, `/learn/no-uploads-explained`, `/compare/offline-vs-online-pdf-tools` |
| 3 | How to Split a PDF by Pages | `/learn/how-to-split-a-pdf-by-pages` | split pdf by pages | split pdf ranges, extract pages from pdf | how-to | `/tools/split-pdf`, `/learn/how-pdfs-work`, `/learn/what-is-pdf-metadata-and-why-it-matters` |
| 4 | How to Remove PDF Metadata | `/learn/how-to-remove-pdf-metadata` | remove pdf metadata | strip xmp metadata, remove author from pdf | how-to | `/tools/metadata-purge`, `/learn/what-is-pdf-metadata-and-why-it-matters`, `/learn/gdpr-and-pdf-tools-what-businesses-need-to-know` |
| 5 | How to Redact a PDF Properly | `/learn/how-to-redact-a-pdf-properly` | redact pdf properly | secure pdf redaction, irreversible redaction | how-to | `/tools/redact-pdf`, `/learn/how-pdf-redaction-really-works`, `/learn/why-pdf-uploads-are-risky` |
| 6 | How to Sign a PDF Without Uploading It | `/learn/how-to-sign-a-pdf-without-uploading-it` | sign pdf without uploading | local pdf signer, private signing workflow | how-to | `/tools/local-signer`, `/learn/no-uploads-explained`, `/learn/verify-offline-processing` |
| 7 | How to Extract Pages from a PDF | `/learn/how-to-extract-pages-from-a-pdf` | extract pages from pdf | pdf page extraction, save selected pdf pages | how-to | `/tools/extract-pdf`, `/learn/how-pdfs-work`, `/learn/client-side-processing` |
| 8 | OCR PDF Without Cloud | `/learn/ocr-pdf-without-cloud` | ocr pdf without cloud | offline ocr pdf, local ocr browser | how-to | `/tools/offline-ocr`, `/learn/webassembly-pdf-processing-explained`, `/learn/why-pdf-uploads-are-risky` |
| 9 | What Happens When You Upload a PDF | `/learn/what-happens-when-you-upload-a-pdf` | what happens when you upload a pdf | pdf upload process, cloud processing risk | trust | `/learn/no-uploads-explained`, `/learn/how-to-verify-a-pdf-tool-doesnt-upload-your-files`, `/verify-claims` |
| 10 | No Uploads Explained | `/learn/no-uploads-explained` | no uploads explained | local processing meaning, verify no upload claim | trust | `/tools/merge-pdf`, `/learn/how-to-verify-a-pdf-tool-doesnt-upload-your-files`, `/verify-claims` |
| 11 | How to Verify a PDF Tool Does not Upload Your Files | `/learn/how-to-verify-a-pdf-tool-doesnt-upload-your-files` | verify pdf tool uploads | verify pdf privacy devtools, check local processing | trust | `/tools/pdf-qa`, `/learn/no-uploads-explained`, `/verify-claims` |
| 12 | Is Offline PDF Processing Secure | `/learn/is-offline-pdf-processing-secure` | is offline pdf processing secure | local pdf security, browser pdf security | trust | `/tools/merge-pdf`, `/learn/no-uploads-explained`, `/verify-claims` |
| 13 | GDPR and PDF Tools: What Businesses Need to Know | `/learn/gdpr-and-pdf-tools-what-businesses-need-to-know` | gdpr and pdf tools | gdpr pdf tools, client-side pdf processing gdpr | trust | `/tools/metadata-purge`, `/learn/what-is-pdf-metadata-and-why-it-matters`, `/verify-claims` |
| 14 | Common PDF Privacy Mistakes | `/learn/common-pdf-privacy-mistakes` | common pdf privacy mistakes | secure pdf workflow errors, leakage mistakes | trust | `/tools/redact-pdf`, `/learn/how-to-redact-a-pdf-properly`, `/verify-claims` |
| 15 | Why You Should Never Upload Medical Records to PDF Tools | `/learn/why-you-should-never-upload-medical-records-to-pdf-tools` | upload medical records pdf tools | healthcare local pdf processing, hipaa pdf tools | trust | `/tools/redact-pdf`, `/learn/how-to-remove-pdf-metadata`, `/verify-claims` |
| 16 | Offline vs Online PDF Tools | `/compare/offline-vs-online-pdf-tools` | offline vs online pdf tools | local vs cloud pdf tools, upload-based alternatives | comparison | `/verify-claims`, `/tools/merge-pdf`, `/learn/no-uploads-explained` |
| 17 | Plain vs Smallpdf | `/compare/plain-vs-smallpdf` | plain vs smallpdf | smallpdf alternative, smallpdf privacy | comparison | `/verify-claims`, `/tools/compress-pdf`, `/learn/why-pdf-uploads-are-risky` |
| 18 | Plain vs iLovePDF | `/compare/plain-vs-ilovepdf` | plain vs ilovepdf | ilovepdf alternative, ilovepdf privacy | comparison | `/verify-claims`, `/tools/compress-pdf`, `/learn/no-uploads-explained` |
| 19 | Plain vs Sejda | `/compare/plain-vs-sejda` | plain vs sejda | sejda alternative, sejda privacy | comparison | `/verify-claims`, `/tools/split-pdf`, `/learn/how-to-verify-a-pdf-tool-doesnt-upload-your-files` |
| 20 | Plain vs Adobe Acrobat Online | `/compare/plain-vs-adobe-acrobat-online` | plain vs adobe acrobat online | adobe online alternative, adobe online privacy | comparison | `/verify-claims`, `/tools/redact-pdf`, `/learn/why-pdf-uploads-are-risky` |
| 21 | Plain vs DocuSign | `/compare/plain-vs-docusign` | plain vs docusign | docusign alternative, local pdf signing | comparison | `/verify-claims`, `/tools/local-signer`, `/learn/how-to-sign-a-pdf-without-uploading-it` |
| 22 | What Is a PDF | `/learn/what-is-a-pdf` | what is a pdf | pdf format explained, pdf basics | evergreen | `/tools/merge-pdf`, `/learn/how-pdfs-work`, `/verify-claims` |
| 23 | How PDFs Work | `/learn/how-pdfs-work` | how pdfs work | pdf internals, page tree | evergreen | `/tools/reorder-pdf`, `/learn/how-to-split-a-pdf-by-pages`, `/verify-claims` |
| 24 | Why PDF Uploads Are Risky | `/learn/why-pdf-uploads-are-risky` | why pdf uploads are risky | online pdf privacy risk, cloud pdf risk | evergreen | `/tools/merge-pdf`, `/learn/no-uploads-explained`, `/verify-claims` |
| 25 | What Is PDF Metadata and Why It Matters | `/learn/what-is-pdf-metadata-and-why-it-matters` | what is pdf metadata and why it matters | hidden data in pdf, remove metadata | evergreen | `/tools/metadata-purge`, `/learn/how-to-remove-pdf-metadata`, `/verify-claims` |

## Internal Linking Rules
- Every tool page links to 3 Learn pages and 1 comparison page.
- Every Learn page links to 1 tool page, 2 related Learn pages, and `/verify-claims`.
- Every comparison page links to `/verify-claims`, 2 Learn pages, and relevant tool routes.
- Use relative links with `next/link`; do not hardcode absolute domain URLs for internal routes.

## Canonical Strategy
- Canonical pages live at root routes (`/learn/*`, `/compare/*`).
- `/pdf-tools/learn/*` and `/pdf-tools/compare/*` permanently redirect (301) to root equivalents.
- Legacy `/compare/plain-vs-adobe-acrobat` permanently redirects to `/compare/plain-vs-adobe-acrobat-online`.

## Definition of Done
- [ ] All 25 tranche pages exist and render through reusable templates.
- [ ] Every page includes trust box and exact line: `Runs locally in your browser. No uploads.`
- [ ] Learn pages include Article + FAQPage + BreadcrumbList JSON-LD.
- [ ] Compare pages include Article + FAQPage + BreadcrumbList JSON-LD.
- [ ] Root sitemap includes all 25 canonical URLs once.
- [ ] No `/pdf-tools/learn/*` or `/pdf-tools/compare/*` entries in root sitemap.
- [ ] Build passes without layout duplication regressions.
- [ ] Canonical tags point to root URLs.

