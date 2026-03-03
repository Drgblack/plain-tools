# Changelog

## v1.0.0 - 2026-03-03

### Release Summary
- Complete tool suite is now live with zero "Coming Soon" states.
- Core PDF workflows are fully available: merge, split, compress, convert, reorder, extract, redact, OCR, metadata purge, signing, QA, summarization, and batch flows.
- Privacy and security hardening completed across UI and APIs:
  - local-first processing UX
  - CORS alignment
  - rate limiting
  - structured API logging
  - production security headers
- Mobile responsiveness pass completed across homepage, tools, header/footer/navigation, and content pages.
- Accessibility and quality gates expanded with Playwright, screenshot overflow checks, and a11y audit coverage.
- SEO and content foundation completed:
  - sitemap/robots alignment
  - comparison pages
  - learn centre expansion
  - blog content and structured metadata support
- Performance pass completed with reduced eager heavy-tool loading and improved code splitting.

### Launch Announcement
**HackerNews / Reddit headline:**  
"Plain.tools – 18 offline PDF tools that run entirely in your browser. Zero uploads, verifiable privacy."

**Body:**  
"We built Plain because we got tired of PDF tools that require you to trust them with sensitive documents. Adobe scans your files for AI training. DocuSign admitted to training on customer contracts. Smallpdf freezes on large files because the bottleneck is their servers, not your machine.
Plain is different by architecture, not just policy. Every tool — merge, split, compress, convert, redact, OCR, sign, metadata purge, batch processing — runs in WebAssembly in your browser. Your files never leave your device. We can't see them. Architecturally impossible.
The privacy claims are verifiable. Open DevTools, go to Network, use any tool. Zero requests containing your file. We dare you to catch us uploading.
18 tools live. Zero coming soon. Works offline after load. No account. No subscription.
Feedback welcome — especially from legal/medical/finance professionals who've been burned by cloud PDF tools."
