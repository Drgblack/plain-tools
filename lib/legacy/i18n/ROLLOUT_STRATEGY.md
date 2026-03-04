# Multilingual Rollout Strategy

This document outlines the safe, staged approach to adding German (DE) and French (FR) language support to Plain.

## Core Principles

1. **English remains canonical** - All English URLs stay at root (e.g., `/tools/merge-pdf`)
2. **Full translations only** - No partial or auto-generated translations
3. **No mixed-language pages** - Each page is entirely in one language
4. **Incremental rollout** - One language at a time, fully tested

## URL Structure

```
English (canonical):  plain.tools/tools/merge-pdf
German:               plain.tools/de/tools/merge-pdf
French:               plain.tools/fr/tools/merge-pdf
```

## hreflang Implementation

Each page includes hreflang tags for SEO:

```html
<link rel="alternate" hreflang="x-default" href="https://plain.tools/path" />
<link rel="alternate" hreflang="en-GB" href="https://plain.tools/path" />
<link rel="alternate" hreflang="de-DE" href="https://plain.tools/de/path" />
<link rel="alternate" hreflang="fr-FR" href="https://plain.tools/fr/path" />
```

Key rules:
- `x-default` always points to English (canonical)
- Only include hreflang for languages with complete translations
- Language tags follow ISO format (en-GB, de-DE, fr-FR)

## Rollout Phases

### Phase 0: Current State (English Only)
- `I18N_ENABLED = false`
- All infrastructure in place but inactive
- Language switcher hidden
- Only English hreflang tags output

### Phase 1: German Launch
1. Complete all German translations in `dictionaries/de.ts`
2. Translate all static content (Learn articles, Blog posts)
3. Set `localeReady.de = true`
4. Set `I18N_ENABLED = true`
5. Add language switcher to header
6. Test all routes with /de/ prefix
7. Verify hreflang tags include German
8. Submit German sitemap to search engines

### Phase 2: French Launch
1. Complete all French translations in `dictionaries/fr.ts`
2. Translate all static content
3. Set `localeReady.fr = true`
4. French routes automatically become active
5. Verify hreflang tags include French
6. Submit French sitemap to search engines

## Content Requirements

Before launching a language:

### Dictionary Completeness
- [ ] All keys from `en.ts` translated
- [ ] No placeholder text or TODOs
- [ ] Brand terms consistent (Plain, PDF, etc.)
- [ ] Numbers and dates localized appropriately

### Static Content
- [ ] All Learn articles translated
- [ ] All Blog posts translated
- [ ] FAQ content translated
- [ ] Legal pages (Privacy, Terms) translated
- [ ] Error messages translated

### Quality Checks
- [ ] Native speaker review
- [ ] UI text fits within design constraints
- [ ] Links point to correct localized versions
- [ ] SEO metadata in target language
- [ ] No English text visible on translated pages

## Technical Safeguards

### Preventing Mixed-Language Pages

1. **Dictionary validation** - Build fails if dictionary is incomplete
2. **localeReady flag** - Language must be explicitly enabled
3. **Middleware guards** - Invalid locales redirect to English
4. **Content isolation** - Each language has separate content files

### Rollback Procedure

If issues are found after launch:

1. Set `localeReady.[lang] = false`
2. Deploy - affected language routes return 404
3. Users on that language redirected to English
4. Fix issues and re-enable when ready

## Monitoring

After each language launch:

- Monitor 404 rates for new language routes
- Check search console for indexing issues
- Track bounce rates by language
- Review user feedback

## File Reference

```
lib/i18n/
├── config.ts           # Core settings, I18N_ENABLED flag
├── types.ts            # TypeScript definitions
├── context.tsx         # React context for client components
├── routes.ts           # Route generation utilities
├── index.ts            # Public exports
├── ROLLOUT_STRATEGY.md # This document
└── dictionaries/
    ├── en.ts           # English (source of truth)
    ├── de.ts           # German (translate from en.ts)
    └── fr.ts           # French (translate from en.ts)
```

## Important Notes

- **Never auto-translate** - All translations must be human-written
- **English is always available** - Users can always switch to English
- **Canonical URLs matter** - English URLs are the canonical versions for SEO
- **Test offline behavior** - Ensure language detection works after page load
